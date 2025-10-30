document.addEventListener("DOMContentLoaded", function() {
    
    let allVideos = []; // Array global untuk menyimpan data film
    let firstVideoData = null; // Menyimpan data film pertama untuk Hero Button
    
    // --- 1. UTILITY FUNCTION ---
    const getThumbnailUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`; 
    const getEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`; 
    
    // --- 2. AMBIL DATA FILM DARI movies.json ---
    function loadMovieData() {
        // PENTING: Menggunakan fetch membutuhkan server lokal (VS Code Live Server)
        fetch('./data/movies.json') 
            .then(response => {
                if (!response.ok) {
                    // Jika path salah atau server tidak berjalan
                    throw new Error(`Gagal memuat movies.json: ${response.statusText}. Pastikan Anda menggunakan Local Server.`);
                }
                return response.json();
            })
            .then(data => {
                allVideos = data; // Simpan data ke variabel global
                if (allVideos.length > 0) {
                    firstVideoData = allVideos[0]; // Ambil film pertama untuk Hero Section
                }
                
                // Panggil fungsi untuk mengisi konten setelah data dimuat
                createVideoCards(allVideos); 
                // Tampilkan halaman utama setelah semua siap
                showView('main-content', navHomeBtn);
            })
            .catch(error => {
                console.error("Kesalahan memuat data film:", error);
                // Tampilkan pesan error di UI jika perlu
                mainContent.innerHTML = `<div class="dummy-page-content" style="padding-top: 100px;"><h2 style="color:red;">KESALAHAN FATAL!</h2><p>Gagal memuat data/movies.json. Pastikan file ada dan Anda menjalankan proyek melalui **Local Server** (misalnya, Live Server VS Code).</p></div>`;
            });
    }

    // --- 3. ELEMEN UTAMA & MODAL ---
    const mainContent = document.getElementById('main-content');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalGenreTag = videoModal.querySelector('.modal-genre-tag');
    const modalDescription = document.getElementById('modalDescription');
    const modalPoster = document.getElementById('modalPoster');
    const playMovieBtn = document.getElementById('playMovieBtn');
    const heroPlayBtn = document.querySelector('.hero-play-btn'); 
    const movieDetailsView = document.getElementById('movieDetailsView');
    const playerView = document.getElementById('playerView');
    
    // ELEMEN PERGANTIAN HALAMAN
    const navHomeBtn = document.getElementById('navHomeBtn'); 
    const navSupportBtn = document.getElementById('navSupportBtn'); 
    const navExploreBtn = document.getElementById('navExploreBtn');
    const explorePageView = document.getElementById('explore-page-view');
    const exploreContent = document.getElementById('explore-content');
    const searchInput = document.getElementById('searchInput');
    const headerSearchIcon = document.getElementById('headerSearchIcon'); 
    const navWatchlistBtn = document.getElementById('navWatchlistBtn');
    
    let currentVideoData = null; // Data film yang sedang dibuka

    // --- 4. LOGIKA PERGANTIAN HALAMAN ---
    function showView(viewId, activeBtn) {
        // Sembunyikan semua tampilan utama
        document.querySelectorAll('.main-view').forEach(view => {
            view.classList.add('hidden-view');
        });
        // Hapus kelas 'active' dari semua tombol navigasi
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.classList.remove('active');
        });

        // Tampilkan tampilan yang diminta
        document.getElementById(viewId).classList.remove('hidden-view');

        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        closeAllModals(); 
        
        if (viewId === 'explore-page-view' && allVideos.length > 0) {
            renderExploreContent(allVideos); // Render ulang konten explore
            searchInput.value = '';
            searchInput.focus(); 
        }
    }

    // Event Listener Navigasi
    if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => { e.preventDefault(); showView('main-content', navHomeBtn); });
    if (navExploreBtn) navExploreBtn.addEventListener('click', (e) => { e.preventDefault(); showView('explore-page-view', navExploreBtn); });
    if (headerSearchIcon) headerSearchIcon.addEventListener('click', (e) => { e.preventDefault(); showView('explore-page-view', navExploreBtn); });
    if (navSupportBtn) navSupportBtn.addEventListener('click', (e) => { e.preventDefault(); showView('support-page-view', navSupportBtn); });
    if (navWatchlistBtn) navWatchlistBtn.addEventListener('click', (e) => { e.preventDefault(); showView('watchlist-page-view', navWatchlistBtn); });
    
    // Tombol Hero Section
    if (heroPlayBtn) heroPlayBtn.addEventListener('click', () => {
        if (firstVideoData) {
            openModalWithDetails(firstVideoData);
        }
    });

    // Link Media Sosial (di Support Page)
    const instagramLink = 'https://www.instagram.com/vynixai';
    const tiktokLink = 'https://www.tiktok.com/@vynixid';

    document.getElementById('social-instagram')?.addEventListener('click', (e) => { e.preventDefault(); window.open(instagramLink, '_blank'); });
    document.getElementById('social-tiktok')?.addEventListener('click', (e) => { e.preventDefault(); window.open(tiktokLink, '_blank'); });
    
    // --- 5. LOGIKA PENCARIAN & RENDERING ---
    
    // Listener pencarian di Explore Page
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toUpperCase().trim();
        
        const filteredVideos = allVideos.filter(video => {
            const isGenreMatch = video.genre.toUpperCase().includes(searchTerm);
            const isTitleMatch = video.title.toUpperCase().includes(searchTerm);
            return isGenreMatch || isTitleMatch;
        });

        renderExploreContent(filteredVideos);
    });

    // Membuat elemen Card film
    function createCard(video) {
        const card = document.createElement('div');
        card.classList.add('video-card');
        const thumbnailUrl = getThumbnailUrl(video.youtubeId);
        
        card.innerHTML = `
            <div class="video-thumbnail" style="background-image: url('${thumbnailUrl}')">
                <i class="fas fa-play-circle play-icon"></i>
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-genre">#${video.genre.toUpperCase()}</div> 
            </div>
        `;

        card.addEventListener('click', () => {
            openModalWithDetails(video);
        });
        return card;
    }

    // Mengelompokkan video berdasarkan Genre
    function groupVideosByGenre(videos) {
        const grouped = {};
        videos.forEach(video => {
            const genre = video.genre || "LAIN-LAIN";
            if (!grouped[genre]) {
                grouped[genre] = [];
            }
            grouped[genre].push(video);
        });
        return grouped;
    }

    // A. Render Halaman Beranda (Home)
    function createVideoCards(videos) {
        const groupedVideos = groupVideosByGenre(videos);
        // Urutan genre yang diinginkan
        const genreOrder = [
            "SCI-FI", "FANTASI", "AKSI", "PERANG", "DISTOPIA", 
            "STEAMPUNK", "HOROR", "MISTERI", "KOMEDI", "LAIN-LAIN"
        ];
        
        // Hapus konten lama sebelum me-render ulang
        document.querySelectorAll('.video-row').forEach(row => row.remove());
        
        genreOrder.forEach(genre => {
            const sectionVideos = groupedVideos[genre];
            if (!sectionVideos || sectionVideos.length === 0) return;

            const section = document.createElement('div');
            section.classList.add('video-row');

            const title = document.createElement('h2');
            title.classList.add('section-title');
            title.textContent = genre.toUpperCase();
            section.appendChild(title);

            const videoListContainer = document.createElement('div');
            videoListContainer.classList.add('video-list-container');
            
            sectionVideos.forEach(video => {
                videoListContainer.appendChild(createCard(video));
            });

            section.appendChild(videoListContainer);
            mainContent.appendChild(section);
        });
    }
    
    // B. Render Halaman Jelajahi (Explore)
    function renderExploreContent(videos) {
        exploreContent.innerHTML = ''; 

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('explore-grid-container'); 
        
        if (videos.length === 0) {
             gridContainer.innerHTML = '<p class="no-results">Tidak ada film ditemukan untuk genre atau judul tersebut. Coba kata kunci genre utama seperti: SCI-FI, FANTASI, HOROR, PERANG, DISTOPIA.</p>';
        } else {
             videos.forEach(video => {
                gridContainer.appendChild(createCard(video));
            });
        }
        
        exploreContent.appendChild(gridContainer);
    }

    // --- 6. LOGIKA MODAL VIDEO & PLAYER ---
    function openModalWithDetails(video) {
        currentVideoData = video;
        
        movieDetailsView.classList.remove('hidden-view');
        playerView.classList.add('hidden-view');
        
        modalTitle.textContent = video.title;
        modalGenreTag.textContent = video.genre.toUpperCase();
        modalDescription.textContent = video.desc;
        modalPoster.src = getThumbnailUrl(video.youtubeId); 
        
        videoPlayer.src = ""; // Pastikan player kosong saat detail ditampilkan

        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    playMovieBtn.addEventListener('click', () => {
        if (!currentVideoData) return;

        // Tampilkan player dan sembunyikan detail
        movieDetailsView.classList.add('hidden-view');
        playerView.classList.remove('hidden-view');

        const embedUrl = getEmbedUrl(currentVideoData.youtubeId) + "?autoplay=1&rel=0";
        videoPlayer.src = embedUrl; 

        // Opsional: Logika Fullscreen dan Orientasi Layar (Khusus Mobile)
        const playerContainer = playerView.querySelector('.player-container');
        const requestFullScreen = playerContainer.requestFullscreen || playerContainer.mozRequestFullScreen || playerContainer.webkitRequestFullscreen || playerContainer.msRequestFullscreen;
        
        if (requestFullScreen) {
            requestFullScreen.call(playerContainer).catch(err => {
                console.warn("Gagal request fullscreen:", err);
            });
        }
    });
    
    // --- 7. LOGIKA PENUTUPAN MODAL ---
    function closeAllModals() {
        videoPlayer.src = ""; // Stop video

        // Logika Exit Fullscreen
        const exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        
        if (exitFullscreen && document.fullscreenElement) {
            exitFullscreen.call(document);
        }

        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModal.addEventListener('click', closeAllModals);

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeAllModals();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Panggil fungsi utama untuk memuat data saat pertama kali DOM dimuat
    loadMovieData(); 
});
