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
    const modalGenreTag = videoModal.querySelector('.modal-genre-tag') || document.getElementById('modalGenre');
    const modalDescription = document.getElementById('modalDescription');
    const modalPoster = document.getElementById('modalPoster');
    const playMovieBtn = document.getElementById('playMovieBtn');
    const heroPlayBtn = document.querySelector('.hero-play-btn');
    const movieDetailsView = document.getElementById('movieDetailsView');
    const playerView = document.getElementById('playerView');

    const navHomeBtn = document.getElementById('navHomeBtn');
    const navSupportBtn = document.getElementById('navSupportBtn');
    const navExploreBtn = document.getElementById('navExploreBtn');
    const navWatchlistBtn = document.getElementById('navWatchlistBtn');
    const exploreContent = document.getElementById('explore-content');
    const searchInput = document.getElementById('searchInput');
    const topSearchInput = document.getElementById('topSearchInput');

    let currentVideoData = null;

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

        if (viewId === 'explore-page-view' && allVideos.length > 0) {
            renderExploreContent(allVideos);
            searchInput.focus();
        }
    }

    if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => { e.preventDefault(); showView('main-content', navHomeBtn); });
    if (navExploreBtn) navExploreBtn.addEventListener('click', (e) => { e.preventDefault(); showView('explore-page-view', navExploreBtn); });
    if (navSupportBtn) navSupportBtn.addEventListener('click', (e) => { e.preventDefault(); showView('support-page-view', navSupportBtn); });
    if (navWatchlistBtn) navWatchlistBtn.addEventListener('click', (e) => { e.preventDefault(); showView('watchlist-page-view', navWatchlistBtn); });

    if (topSearchInput) topSearchInput.addEventListener('click', () => { showView('explore-page-view', navExploreBtn); searchInput.focus(); });

    if (heroPlayBtn) heroPlayBtn.addEventListener('click', () => {
        if (firstVideoData) {
            openModalWithDetails(firstVideoData);
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
                <p class="meta">
                    <span>${video.genre}</span>
                    <span class="meta-sep">&bull;</span>
                    <span>${getDuration(video)}</span>
                    <span class="meta-sep">&bull;</span>
                    <span class="meta-views"><i class="fas fa-eye"></i> ${getViews(video)}</span>
                </p>
            </div>
        `;

        card.addEventListener('click', () => {
            openModalWithDetails(video);
        });
        return card;
    }

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

        // 6) Sisanya, per genre, seperti sebelumnya (agar seluruh katalog tetap mudah dijelajah)
        const genreOrder = ["SCI-FI", "FANTASI", "AKSI", "HOROR", "DISTOPIA", "STEAMPUNK", "MISTERI", "KOMEDI", "ANIMASI", "DRAMA", "PERANG"];
        genreOrder.forEach(genre => {
            const sectionVideos = groupedVideos[genre];
            if (!sectionVideos || sectionVideos.length === 0) return;

            let icon = "fas fa-film";
            if (genre === "SCI-FI") icon = "fas fa-rocket";
            if (genre === "FANTASI") icon = "fas fa-magic";
            if (genre === "AKSI") icon = "fas fa-bolt";
            if (genre === "HOROR") icon = "fas fa-ghost";

            dynamicHomeContent.appendChild(
                createSectionHTML(genre, icon, sectionVideos.slice(0, 8))
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

        const gridDiv = document.createElement('div');
        gridDiv.classList.add('cards-grid', 'grid-4');

        videos.forEach((video, index) => {
            gridDiv.appendChild(createCard(video, opts.rank ? { rank: index + 1 } : {}));
        });

        section.appendChild(gridDiv);
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
        section.querySelector('#continueWatchingCard').addEventListener('click', () => openModalWithDetails(pick));
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
                gridContainer.appendChild(createCard(video));
            });
            exploreContent.appendChild(gridContainer);
        }
    }

    // --- 7. LOGIKA MODAL VIDEO & PLAYER ---
    function openModalWithDetails(video) {
        currentVideoData = video;

        movieDetailsView.classList.remove('hidden-view');
        playerView.classList.add('hidden-view');

        modalTitle.textContent = video.title;
        if (modalGenreTag) modalGenreTag.textContent = video.genre.toUpperCase();
        modalDescription.textContent = video.desc;
        modalPoster.src = getThumbnailUrl(video.youtubeId);

        videoPlayer.src = "";

        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

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
