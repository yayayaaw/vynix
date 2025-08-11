document.addEventListener("DOMContentLoaded", function() {
    const videos = [
        { title: "Dente's comedy", youtubeId: "fWdWYm0sEZ4" },
        { title: "Treta", youtubeId: "ZFnvrQNgnaY" },
        { title: "TVRI", youtubeId: "7yeQpg72Xno" },
        { title: "Where the robots", youtubeId: "3vfhIeNHhv4" },
        { title: "OUR T2 REMAKE", youtubeId: "2upyv9tJCTM" },
        { title: "Mnemosyne", youtubeId: "L_NA-OiOGWA" },
        { title: "Legend of the stromviel", youtubeId: "RkZStZrpGIc" },
        { title: "Last man", youtubeId: "amXGChr-YFI" },
        { title: "Remi", youtubeId: "3oDnRqNiqhc" },
        { title: "The Simulation is hiding", youtubeId: "RJxSgkNjhLg" },
        { title: "The Farfrum", youtubeId: "TuMxVxYXXfY" },
        { title: "Fist contact", youtubeId: "aiDkHchx7JI" },
        { title: "Naya", youtubeId: "JI9UJd-5VPc" },
        { title: "Immortal emperor", youtubeId: "IAyBdD4yOkk" },
        { title: "Age of kingdom", youtubeId: "f7CM2F2_ASk" },
        { title: "Gog and magog", youtubeId: "OUctsVdjVkE" },
        { title: "Panji tengkorak", youtubeId: "G5bYtxyBnLc" },
        { title: "The guardian nusantara", youtubeId: "T1tDorodPbM" },
        { title: "One Piece Ai", youtubeId: "8OJ01m1gKpc" },
        { title: "Endless wonder", youtubeId: "GUgnvl733jg" },
        { title: "Angling darma part 1", youtubeId: "rejgKF0gA48" },
        { title: "Angling darma part 2", youtubeId: "gObghl6rguk" },
        { title: "Mnemonade", youtubeId: "_tIm8GBKRJ0" },
        { title: "My most insane", youtubeId: "p6JgSujjpto" },
        { title: "Diablo", youtubeId: "cxAtw9s4Txw" },
        { title: "Newton's cradle", youtubeId: "RJZCMfaS-io" },
        { title: "War or Beast part 1", youtubeId: "infDOUAMeq4" },
        { title: "The barrier", youtubeId: "Bpwbtmmmb4I" },
        { title: "Air india ai 171", youtubeId: "4i1H_Gqqfdk" },
        { title: "Finals glimpse", youtubeId: "mShU3MCO160" },
        { title: "Batalion", youtubeId: "5NZubOOeeV0" },
        { title: "The cleaner", youtubeId: "pD4q9zwWvRg" },
        { title: "Dsytopian", youtubeId: "lPVsav9Does" },
        { title: "Steampunk", youtubeId: "1PLerxEKOUM" },
        { title: "On the age", youtubeId: "4HbyziUROS8" },
        { title: "New York has fallen", youtubeId: "_Wg178p7oIQ" },
        { title: "The rise of kalki", youtubeId: "sdfncXf0L-Y" },
        { title: "What if the bible", youtubeId: "zzDZeNhmqeg" },
        { title: "Copernicus", youtubeId: "VZuMcqI9xoo" },
        { title: "Jurassic", youtubeId: "AI9Yroa_Gz8" },
        { title: "A Cosmic Odyssey", youtubeId: "9ERK_nnZQ3Q" },
        { title: "Aladdin", youtubeId: "Lx9UfeujiqE" },
        { title: "2095", youtubeId: "4gKBHYjbUAM" },
        { title: "Majapahit", youtubeId: "x5c3Vw74_Zg" },
        { title: "Nusantara", youtubeId: "ZoPYHHHZWq8" },
        { title: "A steampunk ballerina", youtubeId: "b13ApHV-vz4" },
        { title: "Shadow war part 1", youtubeId: "bJaTq8GP77s" },
        { title: "Shadow war part 2", youtubeId: "EwRS73thx8A" },
        { title: "Shadow war part 3", youtubeId: "6AYuZNj861g" },
        { title: "Dragon ball part 2", youtubeId: "2bj2dBrKsqc" },
        { title: "The betrayal", youtubeId: "xiJ2x4lXQh8" },
        { title: "Dragon Ball part 1", youtubeId: "kzrw0Y1qBpc" },
        { title: "Battle of the milvian bridge part 1", youtubeId: "MHBqKnfdaKE" },
        { title: "Battle of the milvian bridge part 2", youtubeId: "ysst5wtu1Ro" },
        { title: "Spartacus' rebelion part 1", youtubeId: "MOUYkuX3Djc" },
        { title: "Embriyon", youtubeId: "4odmSX1Mraw" },
        { title: "The most terrifying legenlegend ever liver", youtubeId: "3sMBwxIuRiw" },
        { title: "First man on mars", youtubeId: "pWn2iKjGCL4" },
        { title: "Project Genesis", youtubeId: "BBgByBR_ego" },
        { title: "Riset of the infected", youtubeId: "Y1HR7d2DtOI" },
        { title: "Battle of new York 2025", youtubeId: "JiVb7YY3H3c" },
        { title: "Glider man", youtubeId: "6-kXTsC-8e0" },
        { title: "Spartan 300 vs hell's army", youtubeId: "e0ccn_dUgXk" },
        { title: "300 sparta the final Battle warior", youtubeId: "yUEOlq-dWqc" },
        { title: "Echoes of the horde part 1", youtubeId: "TTzmr4gXt7k" },
        { title: "Echoes of the horde part 2", youtubeId: "98zS5AwTG8o" },
        { title: "Echoes of the horde part 3", youtubeId: "r_4cPaFnN00" },
        { title: "Echoes of the horde part 4", youtubeId: "C6d6WZkGUFI" },
        { title: "Echoes of the horde part 5", youtubeId: "keppK_KNa2E" },
        { title: "Swat", youtubeId: "kC8dxvMKsEc" },
        { title: "Lucifer", youtubeId: "s8eDE99oOJI" },
        { title: "Mermed", youtubeId: "rQ6mB0YmI3Q" },
        { title: "Hope", youtubeId: "ixo66kHbJR4" },
        { title: "One more pumpkin", youtubeId: "ezZ-8F_dQpo" },
        { title: "Where do granmas go when they get lost", youtubeId: "JOKINvqrnWQ" },
        { title: "Mandela", youtubeId: "xXUvWkJoDeA" },
        { title: "Solomon", youtubeId: "QxdT5mQh_nc" }
    ];

    const mainContent = document.getElementById('main-content');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const supportBtn = document.getElementById('supportBtn');
    const supportModal = document.getElementById('supportModal');
    const closeSupport = document.getElementById('closeSupport');
    const themeToggle = document.getElementById('theme-icon');
    
    const getThumbnailUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const getEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`;
    const descriptionPlaceholder = "Deskripsi film ini tidak tersedia.";

    function createVideoCards() {
        const videosPerSection = Math.ceil(videos.length / 6);
        for (let i = 0; i < 6; i++) {
            const section = document.createElement('div');
            section.classList.add('video-row');

            const title = document.createElement('h2');
            title.classList.add('section-title');
            title.textContent = `FILM AI`;
            section.appendChild(title);

            const videoListContainer = document.createElement('div');
            videoListContainer.classList.add('video-list-container');
            
            const start = i * videosPerSection;
            const end = start + videosPerSection;
            const sectionVideos = videos.slice(start, end);

            sectionVideos.forEach(video => {
                const card = document.createElement('div');
                card.classList.add('video-card');

                const thumbnailUrl = getThumbnailUrl(video.youtubeId);

                card.innerHTML = `
                    <div class="video-thumbnail" style="background-image: url('${thumbnailUrl}')">
                        <i class="fas fa-play-circle play-icon"></i>
                    </div>
                    <div class="video-info">
                        <div class="video-title">${video.title}</div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    const embedUrl = getEmbedUrl(video.youtubeId) + "?autoplay=1&rel=0";
                    videoPlayer.src = embedUrl;
                    modalTitle.textContent = video.title;
                    modalDescription.textContent = descriptionPlaceholder;
                    videoModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });

                videoListContainer.appendChild(card);
            });

            section.appendChild(videoListContainer);
            mainContent.appendChild(section);
        }
    }
    
    createVideoCards();

    closeModal.addEventListener('click', () => {
        videoModal.style.display = 'none';
        videoPlayer.src = "";
        document.body.style.overflow = 'auto';
    });

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoPlayer.src = '';
            document.body.style.overflow = 'auto';
        }
    });

    supportBtn.addEventListener('click', () => {
        supportModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeSupport.addEventListener('click', () => {
        supportModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    supportModal.addEventListener('click', (e) => {
        if (e.target === supportModal) {
            supportModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal.style.display === 'flex') {
                videoModal.style.display = 'none';
                videoPlayer.src = '';
            }
            if (supportModal.style.display === 'flex') {
                supportModal.style.display = 'none';
            }
            document.body.style.overflow = 'auto';
        }
    });

    themeToggle.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }
    });
});
