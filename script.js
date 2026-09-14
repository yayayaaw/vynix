document.addEventListener("DOMContentLoaded", function() {
    
    let allVideos = []; 
    let firstVideoData = null; 
    
    // --- 1. UTILITY FUNCTION ---
    const getThumbnailUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`; 
    const getEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`; 
    
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

    // MEMBUAT KARTU DENGAN DESAIN CSS ASLI
    function createCard(video) {
        const card = document.createElement('div');
        card.classList.add('movie-card'); // Menggunakan class CSS asli
        const thumbnailUrl = getThumbnailUrl(video.youtubeId);
        
        card.innerHTML = `
            <div class="card-thumb">
                <img src="${thumbnailUrl}" alt="${video.title}">
                <div class="hover-play"><i class="fas fa-play"></i></div>
            </div>
            <div class="card-info">
                <h3>${video.title}</h3>
                <p class="meta">${video.genre} • AI Film</p> 
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

    function renderHomeContent(videos) {
        dynamicHomeContent.innerHTML = ''; 
        const groupedVideos = groupVideosByGenre(videos);
        const genreOrder = ["SCI-FI", "FANTASI", "AKSI", "HOROR", "DISTOPIA", "STEAMPUNK", "MISTERI", "KOMEDI", "ANIMASI", "DRAMA"];
        
        // Buat section Trending (Campuran beberapa film pertama)
        const trendingSection = createSectionHTML("TRENDING NOW", "fas fa-fire icon-fire", videos.slice(0, 4));
        dynamicHomeContent.appendChild(trendingSection);

        // Buat section berdasarkan Genre
        genreOrder.forEach(genre => {
            const sectionVideos = groupedVideos[genre];
            if (!sectionVideos || sectionVideos.length === 0) return;
            
            let icon = "fas fa-film";
            if(genre === "SCI-FI") icon = "fas fa-rocket";
            if(genre === "FANTASI") icon = "fas fa-magic";
            if(genre === "AKSI") icon = "fas fa-bolt";
            if(genre === "HOROR") icon = "fas fa-ghost";

            const section = createSectionHTML(genre, icon, sectionVideos.slice(0, 8)); // Tampilkan maks 8 per genre di beranda
            dynamicHomeContent.appendChild(section);
        });
    }

    function createSectionHTML(title, iconClass, videos) {
        const section = document.createElement('section');
        section.classList.add('content-section');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('section-header');
        headerDiv.innerHTML = `
            <div><h2 class="section-title"><i class="${iconClass}"></i> ${title}</h2></div>
            <a href="#" class="see-all-link">See All <i class="fas fa-arrow-right"></i></a>
        `;
        section.appendChild(headerDiv);

        const gridDiv = document.createElement('div');
        gridDiv.classList.add('cards-grid', 'grid-4'); 
        
        videos.forEach(video => {
            gridDiv.appendChild(createCard(video));
        });

        section.appendChild(gridDiv);
        return section;
    }
    
    function renderExploreContent(videos) {
        exploreContent.innerHTML = ''; 

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('cards-grid', 'grid-4'); // Pakai grid CSS asli
        
        if (videos.length === 0) {
             exploreContent.innerHTML = '<p style="text-align:center; color:#64748b; margin-top:20px;">Tidak ada film ditemukan.</p>';
        } else {
             videos.forEach(video => {
                gridContainer.appendChild(createCard(video));
            });
             exploreContent.appendChild(gridContainer);
        }
    }

    // --- 6. LOGIKA MODAL VIDEO & PLAYER ---
    function openModalWithDetails(video) {
        currentVideoData = video;
        
        movieDetailsView.classList.remove('hidden-view');
        playerView.classList.add('hidden-view');
        
        modalTitle.textContent = video.title;
        if(modalGenreTag) modalGenreTag.textContent = video.genre.toUpperCase();
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
    
    // --- 7. LOGIKA PENUTUPAN MODAL ---
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
