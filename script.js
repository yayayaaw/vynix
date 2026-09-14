document.addEventListener("DOMContentLoaded", function() {

    let allVideos = [];
    let firstVideoData = null;

    // --- 1. UTILITY FUNCTIONS ---
    const getThumbnailUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const getEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`;

    // Deterministic pseudo-random number from a string, so each film always
    // shows the same duration/view-count instead of a different one every load.
    function hashString(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h << 5) - h + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }

    function getDuration(video) {
        const h = hashString(video.youtubeId);
        const minutes = 8 + (h % 12);       // 8–19 min
        const seconds = (h >> 3) % 60;      // 0–59 sec
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    function getViews(video) {
        const h = hashString(video.youtubeId + video.title);
        const raw = 45000 + (h % 1250000);  // 45K–1.29M
        if (raw >= 1000000) return (raw / 1000000).toFixed(1) + 'M';
        if (raw >= 1000) return Math.round(raw / 1000) + 'K';
        return String(raw);
    }

    // --- 2. AMBIL DATA FILM DARI movies.json ---
    function loadMovieData() {
        fetch('./data/movies.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gagal memuat movies.json`);
                }
                return response.json();
            })
            .then(data => {
                allVideos = data;
                if (allVideos.length > 0) {
                    firstVideoData = allVideos[0];
                }

                renderHomeContent(allVideos);
                showView('main-content', navHomeBtn);
            })
            .catch(error => {
                console.error("Kesalahan memuat data film:", error);
                document.getElementById('dynamic-home-content').innerHTML = `<p style="color:red; padding: 20px;">Gagal memuat data/movies.json. Pastikan Anda menjalankan proyek melalui Local Server.</p>`;
            });
    }

    // --- 3. ELEMEN UTAMA & MODAL ---
    const mainContent = document.getElementById('main-content');
    const dynamicHomeContent = document.getElementById('dynamic-home-content');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalDescription = document.getElementById('modalDescription');
    const modalPoster = document.getElementById('modalPoster');
    const playMovieBtn = document.getElementById('playMovieBtn');
    const watchlistBtn = document.getElementById('watchlistBtn');
    const watchlistBtnIcon = document.getElementById('watchlistBtnIcon');
    const watchlistBtnLabel = document.getElementById('watchlistBtnLabel');
    const moreLikeThisRow = document.getElementById('moreLikeThisRow');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const heroPlayBtn = document.querySelector('.hero-play-btn');
    const movieDetailsView = document.getElementById('movieDetailsView');
    const playerView = document.getElementById('playerView');

    const headerEl = document.querySelector('.header');
    const navHomeBtn = document.getElementById('navHomeBtn');
    const navSupportBtn = document.getElementById('navSupportBtn');
    const navExploreBtn = document.getElementById('navExploreBtn');
    const navWatchlistBtn = document.getElementById('navWatchlistBtn');
    const exploreContent = document.getElementById('explore-content');
    const searchInput = document.getElementById('searchInput');
    const topSearchInput = document.getElementById('topSearchInput');
    const headerSearchIconBtn = document.getElementById('headerSearchIconBtn');
    const watchlistTabs = document.getElementById('watchlistTabs');
    const watchlistListContainer = document.getElementById('watchlistListContainer');

    let currentVideoData = null;
    let currentContextList = [];   // daftar film aktif saat modal dibuka (untuk tombol prev/next)
    let currentWatchlistFilter = 'all';

    // --- WATCHLIST STATE (disimpan di memori selama sesi berjalan) ---
    // Catatan: sengaja TIDAK pakai localStorage supaya file ini tetap aman
    // dirender sebagai preview/artifact. Selama halaman belum di-reload,
    // watchlist tetap konsisten di semua tab (Beranda/Jelajah/Watchlist).
    let watchlist = []; // { youtubeId, watched: boolean }

    function findWatchlistEntry(youtubeId) {
        return watchlist.find(w => w.youtubeId === youtubeId);
    }

    function isInWatchlist(youtubeId) {
        return !!findWatchlistEntry(youtubeId);
    }

    function toggleWatchlist(video) {
        const existing = findWatchlistEntry(video.youtubeId);
        if (existing) {
            watchlist = watchlist.filter(w => w.youtubeId !== video.youtubeId);
        } else {
            watchlist.push({ youtubeId: video.youtubeId, watched: false });
        }
        updateWatchlistButtonUI(video.youtubeId);
        renderWatchlistPage();
    }

    function updateWatchlistButtonUI(youtubeId) {
        const inList = isInWatchlist(youtubeId);
        watchlistBtn.classList.toggle('in-watchlist', inList);
        watchlistBtnIcon.className = inList ? 'fas fa-heart' : 'far fa-heart';
        watchlistBtnLabel.textContent = inList ? 'Tersimpan di Watchlist' : 'Simpan ke Watchlist';
    }

    // --- 4. LOGIKA PERGANTIAN HALAMAN ---
    function showView(viewId, activeBtn) {
        document.querySelectorAll('.main-view').forEach(view => {
            view.classList.add('hidden-view');
            view.style.display = 'none';
        });
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetView = document.getElementById(viewId);
        targetView.classList.remove('hidden-view');
        targetView.style.display = 'block';

        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        closeAllModals();

        // Halaman Dukung tidak punya search di header sama sekali
        headerEl.classList.toggle('header--no-search', viewId === 'support-page-view');

        if (viewId === 'explore-page-view' && allVideos.length > 0) {
            renderExploreContent(allVideos);
            searchInput.focus();
        }

        if (viewId === 'watchlist-page-view') {
            renderWatchlistPage();
        }
    }

    if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => { e.preventDefault(); showView('main-content', navHomeBtn); });
    if (navExploreBtn) navExploreBtn.addEventListener('click', (e) => { e.preventDefault(); showView('explore-page-view', navExploreBtn); });
    if (navSupportBtn) navSupportBtn.addEventListener('click', (e) => { e.preventDefault(); showView('support-page-view', navSupportBtn); });
    if (navWatchlistBtn) navWatchlistBtn.addEventListener('click', (e) => { e.preventDefault(); showView('watchlist-page-view', navWatchlistBtn); });

    if (topSearchInput) topSearchInput.addEventListener('click', () => { showView('explore-page-view', navExploreBtn); searchInput.focus(); });
    if (headerSearchIconBtn) headerSearchIconBtn.addEventListener('click', () => { showView('explore-page-view', navExploreBtn); searchInput.focus(); });

    if (heroPlayBtn) heroPlayBtn.addEventListener('click', () => {
        if (firstVideoData) {
            openModalWithDetails(firstVideoData, allVideos);
        }
    });

    // --- 5. LOGIKA PENCARIAN & RENDERING ---
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toUpperCase().trim();
        const filteredVideos = allVideos.filter(video => {
            const isGenreMatch = video.genre.toUpperCase().includes(searchTerm);
            const isTitleMatch = video.title.toUpperCase().includes(searchTerm);
            return isGenreMatch || isTitleMatch;
        });
        renderExploreContent(filteredVideos);
    });

    function searchByGenre(genre) {
        showView('explore-page-view', navExploreBtn);
        searchInput.value = genre;
        searchInput.dispatchEvent(new Event('input'));
    }

    // MEMBUAT KARTU FILM (opsi rank badge untuk Trending Now)
    function createCard(video, options) {
        options = options || {};
        const card = document.createElement('div');
        card.classList.add('movie-card');
        const thumbnailUrl = getThumbnailUrl(video.youtubeId);

        const rankBadge = options.rank ? `<span class="rank-badge">#${options.rank}</span>` : '';

        card.innerHTML = `
            <div class="card-thumb">
                ${rankBadge}
                <img src="${thumbnailUrl}" alt="${video.title}">
                <div class="hover-play"><i class="fas fa-play"></i></div>
            </div>
            <div class="card-info">
                <h3>${video.title}</h3>
            </div>
        `;

        card.addEventListener('click', () => {
            openModalWithDetails(video, options.context || allVideos);
        });
        return card;
    }

    if (watchlistTabs) {
        watchlistTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.watchlist-tab');
            if (!btn) return;
            watchlistTabs.querySelectorAll('.watchlist-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            currentWatchlistFilter = btn.dataset.filter;
            renderWatchlistPage();
        });
    }

    // --- HALAMAN WATCHLIST ---
    function renderWatchlistPage() {
        if (!watchlistListContainer || allVideos.length === 0) return;

        const items = watchlist
            .map(entry => ({ entry, video: allVideos.find(v => v.youtubeId === entry.youtubeId) }))
            .filter(x => x.video);

        const countAll = items.length;
        const countWatched = items.filter(x => x.entry.watched).length;
        const countUnwatched = countAll - countWatched;
        document.getElementById('wlCountAll').textContent = countAll;
        document.getElementById('wlCountWatched').textContent = countWatched;
        document.getElementById('wlCountUnwatched').textContent = countUnwatched;

        const filtered = items.filter(x => {
            if (currentWatchlistFilter === 'watched') return x.entry.watched;
            if (currentWatchlistFilter === 'unwatched') return !x.entry.watched;
            return true;
        });

        watchlistListContainer.innerHTML = '';

        if (filtered.length === 0) {
            watchlistListContainer.innerHTML = `
                <div class="watchlist-empty">
                    <i class="fas fa-bookmark"></i>
                    <h3>Belum ada film di sini</h3>
                    <p>Klik "Simpan ke Watchlist" saat menonton detail film untuk menambahkannya.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(({ entry, video }) => {
            const row = document.createElement('div');
            row.classList.add('watchlist-item');
            row.innerHTML = `
                <div class="watchlist-item-thumb">
                    <img src="${getThumbnailUrl(video.youtubeId)}" alt="${video.title}">
                    <div class="wl-play-icon"><i class="fas fa-play"></i></div>
                </div>
                <div class="watchlist-item-info">
                    <h3>${video.title}</h3>
                    <p class="meta">${video.genre} &bull; ${getDuration(video)}</p>
                    <span class="wl-status-badge ${entry.watched ? 'watched' : ''}">
                        ${entry.watched ? '<i class="fas fa-check"></i> Sudah ditonton' : 'Belum ditonton'}
                    </span>
                </div>
                <div class="wl-item-menu">
                    <i class="fas fa-ellipsis-vertical wl-menu-trigger"></i>
                    <div class="wl-menu-dropdown hidden-view">
                        <button class="wl-menu-option" data-action="toggle-watched">${entry.watched ? 'Tandai belum ditonton' : 'Tandai sudah ditonton'}</button>
                        <button class="wl-menu-option danger" data-action="remove">Hapus dari Watchlist</button>
                    </div>
                </div>
            `;

            row.addEventListener('click', () => openModalWithDetails(video, allVideos));

            const menuTrigger = row.querySelector('.wl-menu-trigger');
            const menuDropdown = row.querySelector('.wl-menu-dropdown');
            menuTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.wl-menu-dropdown').forEach(d => { if (d !== menuDropdown) d.classList.add('hidden-view'); });
                menuDropdown.classList.toggle('hidden-view');
            });
            menuDropdown.querySelectorAll('.wl-menu-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (opt.dataset.action === 'toggle-watched') {
                        entry.watched = !entry.watched;
                    } else if (opt.dataset.action === 'remove') {
                        watchlist = watchlist.filter(w => w.youtubeId !== video.youtubeId);
                    }
                    renderWatchlistPage();
                });
            });

            watchlistListContainer.appendChild(row);
        });
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.wl-menu-dropdown').forEach(d => d.classList.add('hidden-view'));
    });

    function groupVideosByGenre(videos) {
        const grouped = {};
        videos.forEach(video => {
            const genre = video.genre || "LAIN-LAIN";
            if (!grouped[genre]) grouped[genre] = [];
            grouped[genre].push(video);
        });
        return grouped;
    }

    // --- 6. BERANDA: SUSUNAN SECTION SESUAI DESAIN ---
    function renderHomeContent(videos) {
        dynamicHomeContent.innerHTML = '';
        if (videos.length === 0) return;

        const groupedVideos = groupVideosByGenre(videos);

        // 1) TRENDING NOW — 4 film unggulan pertama, diberi rank badge #1-#4
        const trending = videos.slice(0, 4);
        dynamicHomeContent.appendChild(
            createSectionHTML("TRENDING NOW", "fas fa-fire icon-fire", trending, { rank: true })
        );

        // 2) NEW ON VYNIX — 4 film yang ditambahkan paling akhir
        const fresh = videos.slice(-4).reverse();
        dynamicHomeContent.appendChild(
            createSectionHTML("NEW ON VYNIX", "fas fa-star icon-new", fresh, { subtitle: "Fresh films added this week." })
        );

        // 3) CONTINUE WATCHING — kartu tunggal dengan progress bar
        dynamicHomeContent.appendChild(createContinueWatchingSection(videos));

        // 4) EXPLORE BY GENRE — ubin genre yang bisa discroll
        dynamicHomeContent.appendChild(createGenreSection(groupedVideos));

        // 5) BECAUSE YOU WATCHED <GENRE> — rekomendasi genre yang sama dengan trending #1
        const seedGenre = trending[0] ? trending[0].genre : Object.keys(groupedVideos)[0];
        const recommendations = (groupedVideos[seedGenre] || [])
            .filter(v => v.youtubeId !== (trending[0] && trending[0].youtubeId))
            .slice(0, 4);
        if (recommendations.length > 0) {
            dynamicHomeContent.appendChild(
                createSectionHTML(`BECAUSE YOU WATCHED ${seedGenre}`, "fas fa-wand-magic-sparkles icon-new", recommendations, { subtitle: "Similar films you might like." })
            );
        }

        // 6) Sisa katalog, satu baris scroll per genre (tidak pernah wrap ke bawah)
        const genreIcons = {
            "SCI-FI": "fas fa-rocket",
            "FANTASI": "fas fa-magic",
            "AKSI": "fas fa-bolt",
            "HOROR": "fas fa-ghost",
            "DISTOPIA": "fas fa-city",
            "STEAMPUNK": "fas fa-cog",
            "PERANG": "fas fa-shield-halved",
            "MISTERI": "fas fa-magnifying-glass",
            "KOMEDI": "fas fa-face-grin-wide",
            "ANIMASI": "fas fa-shapes",
            "DRAMA": "fas fa-masks-theater"
        };
        const genreOrder = ["SCI-FI", "DISTOPIA", "STEAMPUNK", "FANTASI", "PERANG", "AKSI", "HOROR", "MISTERI", "KOMEDI", "ANIMASI", "DRAMA"];
        genreOrder.forEach(genre => {
            const sectionVideos = groupedVideos[genre];
            if (!sectionVideos || sectionVideos.length === 0) return;
            const icon = genreIcons[genre] || "fas fa-film";
            dynamicHomeContent.appendChild(
                createSectionHTML(genre, icon, sectionVideos)
            );
        });
    }

    function createSectionHTML(title, iconClass, videos, opts) {
        opts = opts || {};
        const section = document.createElement('section');
        section.classList.add('content-section');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('section-header');
        headerDiv.innerHTML = `
            <div>
                <h2 class="section-title"><i class="${iconClass}"></i> ${title}</h2>
                ${opts.subtitle ? `<p class="section-subtitle">${opts.subtitle}</p>` : ''}
            </div>
            <a href="#" class="see-all-link">See All <i class="fas fa-arrow-right"></i></a>
        `;
        headerDiv.querySelector('.see-all-link').addEventListener('click', (e) => {
            e.preventDefault();
            const firstVideo = videos[0];
            if (firstVideo) searchByGenre(firstVideo.genre);
        });
        section.appendChild(headerDiv);

        // Baris scroll horizontal (bukan grid yang wrap ke bawah)
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('cards-row');

        videos.forEach((video, index) => {
            const cardOpts = { context: videos };
            if (opts.rank) cardOpts.rank = index + 1;
            rowDiv.appendChild(createCard(video, cardOpts));
        });

        section.appendChild(rowDiv);
        return section;
    }

    function createContinueWatchingSection(videos) {
        const pick = videos[Math.floor(hashString('continue') % videos.length)];
        const h = hashString(pick.youtubeId + 'progress');
        const progressPercent = 20 + (h % 65); // 20%-85% watched
        const totalMinutes = 8 + (h % 12);
        const remainingMinutes = Math.max(1, Math.round(totalMinutes * (1 - progressPercent / 100)));

        const section = document.createElement('section');
        section.classList.add('content-section');
        section.innerHTML = `
            <div class="section-header">
                <div><h2 class="section-title"><i class="fas fa-clock"></i> CONTINUE WATCHING</h2></div>
                <a href="#" class="see-all-link">View All <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="continue-watching-card" id="continueWatchingCard">
                <div class="continue-thumb">
                    <img src="${getThumbnailUrl(pick.youtubeId)}" alt="${pick.title}">
                    <div class="continue-play-btn"><i class="fas fa-play"></i></div>
                </div>
                <div class="continue-info">
                    <h3>${pick.title}</h3>
                    <p class="meta">${pick.genre} &bull; ${remainingMinutes}:00 remaining</p>
                    <div class="progress-track"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
                </div>
                <i class="fas fa-ellipsis-vertical continue-options"></i>
            </div>
        `;
        section.querySelector('#continueWatchingCard').addEventListener('click', () => openModalWithDetails(pick, videos));
        section.querySelector('.see-all-link').addEventListener('click', (e) => e.preventDefault());
        return section;
    }

    function createGenreSection(groupedVideos) {
        const section = document.createElement('section');
        section.classList.add('content-section');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('section-header');
        headerDiv.innerHTML = `
            <div>
                <h2 class="section-title"><i class="fas fa-th-large"></i> EXPLORE BY GENRE</h2>
                <p class="section-subtitle">Find your next favorite film.</p>
            </div>
            <a href="#" class="see-all-link">See All <i class="fas fa-arrow-right"></i></a>
        `;
        headerDiv.querySelector('.see-all-link').addEventListener('click', (e) => { e.preventDefault(); showView('explore-page-view', navExploreBtn); });
        section.appendChild(headerDiv);

        const scrollDiv = document.createElement('div');
        scrollDiv.classList.add('genre-scroll');

        Object.keys(groupedVideos).forEach(genre => {
            const representative = groupedVideos[genre][0];
            const tile = document.createElement('div');
            tile.classList.add('genre-tile');
            tile.innerHTML = `
                <img src="${getThumbnailUrl(representative.youtubeId)}" alt="${genre}">
                <div class="genre-tile-overlay"><span class="genre-tile-label">${genre}</span></div>
            `;
            tile.addEventListener('click', () => searchByGenre(genre));
            scrollDiv.appendChild(tile);
        });

        section.appendChild(scrollDiv);
        return section;
    }

    function renderExploreContent(videos) {
        exploreContent.innerHTML = '';

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('cards-grid', 'grid-4');

        if (videos.length === 0) {
            exploreContent.innerHTML = '<p style="text-align:center; color:#64748b; margin-top:20px;">Tidak ada film ditemukan.</p>';
        } else {
            videos.forEach(video => {
                gridContainer.appendChild(createCard(video, { context: videos }));
            });
            exploreContent.appendChild(gridContainer);
        }
    }

    // --- 7. LOGIKA MODAL VIDEO & PLAYER ---
    function openModalWithDetails(video, contextList) {
        currentVideoData = video;
        currentContextList = (contextList && contextList.length > 0) ? contextList : allVideos;

        movieDetailsView.classList.remove('hidden-view');
        playerView.classList.add('hidden-view');

        modalTitle.textContent = video.title;
        modalMeta.textContent = `${video.genre} • SHORT FILM • ${getDuration(video)}`;
        modalDescription.textContent = video.desc;
        modalPoster.src = getThumbnailUrl(video.youtubeId);

        updateWatchlistButtonUI(video.youtubeId);
        renderMoreLikeThis(video);

        videoPlayer.src = "";

        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // "MORE LIKE THIS": film lain dengan genre yang sama
    function renderMoreLikeThis(video) {
        moreLikeThisRow.innerHTML = '';
        const related = allVideos
            .filter(v => v.genre === video.genre && v.youtubeId !== video.youtubeId)
            .slice(0, 8);

        if (related.length === 0) {
            document.getElementById('moreLikeThisSection').classList.add('hidden-view');
            return;
        }
        document.getElementById('moreLikeThisSection').classList.remove('hidden-view');
        related.forEach(v => {
            moreLikeThisRow.appendChild(createCard(v, { context: related }));
        });
    }

    function goToAdjacentVideo(direction) {
        if (!currentVideoData || currentContextList.length === 0) return;
        const idx = currentContextList.findIndex(v => v.youtubeId === currentVideoData.youtubeId);
        const safeIdx = idx === -1 ? 0 : idx;
        const nextIdx = (safeIdx + direction + currentContextList.length) % currentContextList.length;
        openModalWithDetails(currentContextList[nextIdx], currentContextList);
    }

    if (modalPrevBtn) modalPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); goToAdjacentVideo(-1); });
    if (modalNextBtn) modalNextBtn.addEventListener('click', (e) => { e.stopPropagation(); goToAdjacentVideo(1); });

    watchlistBtn.addEventListener('click', () => {
        if (!currentVideoData) return;
        toggleWatchlist(currentVideoData);
    });

    playMovieBtn.addEventListener('click', () => {
        if (!currentVideoData) return;

        movieDetailsView.classList.add('hidden-view');
        playerView.classList.remove('hidden-view');

        const embedUrl = getEmbedUrl(currentVideoData.youtubeId) + "?autoplay=1&rel=0";
        videoPlayer.src = embedUrl;
    });

    // --- 8. LOGIKA PENUTUPAN MODAL ---
    function closeAllModals() {
        videoPlayer.src = "";
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModal.addEventListener('click', closeAllModals);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeAllModals();
    });

    loadMovieData();
});
