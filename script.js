document.addEventListener("DOMContentLoaded", function() {
    // --- 1. DATA VIDEO (Genre Disederhanakan: SCI-FI, FANTASI, HOROR, PERANG, DISTOPIA, AKSI, dll.) ---
    const allVideos = [
        // KELOMPOK: SCI-FI
        { title: "Where the robots", youtubeId: "3vfhIeNHhv4", genre: "SCI-FI", desc: "Di masa depan pasca-manusia, saksikan bagaimana robot mewarisi bumi dan membangun peradaban baru dari reruntuhan peradaban lama." },
        { title: "The Simulation is hiding", youtubeId: "RJxSgkNjhLg", genre: "SCI-FI", desc: "Seorang programmer genius menemukan sebuah celah (glitch) yang mengungkap bahwa seluruh realitas mereka hanyalah sebuah program komputer raksasa. Siapa di balik kendali ini?" },
        { title: "The Farfrum", youtubeId: "TuMxVxYXXfY", genre: "SCI-FI", desc: "Sebuah pesawat eksplorasi luar angkasa AI dikirim ke galaksi terjauh. Mereka menemukan kehidupan yang jauh lebih tua dan lebih asing dari perkiraan." },
        { title: "Fist contact", youtubeId: "aiDkHchx7JI", genre: "SCI-FI", desc: "Film tentang momen pertama umat manusia bertemu dengan kecerdasan buatan alien, dan dilema apakah mereka datang sebagai penyelamat atau penakluk." },
        { title: "Naya", youtubeId: "JI9UJd-5VPc", genre: "SCI-FI", desc: "Kisah emosional tentang Naya, robot yang berusaha mencari tahu arti kemanusiaan setelah ia ditinggalkan sendirian di dunia yang sepi." },
        { title: "2095", youtubeId: "4gKBHYjbUAM", genre: "SCI-FI", desc: "Kota futuristik di tahun 2095 menghadapi krisis energi dan identitas, di mana batas antara manusia dan mesin sudah tidak ada lagi." },
        { title: "The rise of kalki", youtubeId: "sdfncXf0L-Y", genre: "SCI-FI", desc: "Ramalan kuno bertemu teknologi AI modern. Seorang ksatria digital bangkit sebagai Kalki, penyelamat atau penghancur umat manusia." },
        { title: "Copernicus", youtubeId: "VZuMcqI9xoo", genre: "SCI-FI", desc: "Misi rahasia untuk menemukan 'Planet Kedua'. Kru AI menemukan sebuah anomali kosmik yang mengubah pemahaman mereka tentang alam semesta." },
        { title: "A Cosmic Odyssey", youtubeId: "9ERK_nnZQ3Q", genre: "SCI-FI", desc: "Perjalanan visual yang memukau melintasi kosmos, diiringi narasi puitis tentang asal-usul kehidupan yang tercipta dari algoritma." },
        { title: "First man on mars", youtubeId: "pWn2iKjGCL4", genre: "SCI-FI", desc: "Kisah tentang astronot AI pertama yang mendarat di Mars, dan misteri yang ia temukan di planet merah." },

        // KELOMPOK: DISTOPIA & STEAMPUNK
        { title: "Dsytopian", youtubeId: "lPVsav9Does", genre: "DISTOPIA", desc: "Di kota yang dikuasai oleh korporasi gelap, seorang pemberontak muda AI memimpin perlawanan untuk mendapatkan kembali kebebasan informasi." },
        { title: "Steampunk", youtubeId: "1PLerxEKOUM", genre: "STEAMPUNK", desc: "Dunia uap dan gigi mesin. Seorang penemu eksentrik menciptakan perangkat AI yang bisa mengubah masa lalu dan masa depan." },
        { title: "New York has fallen", youtubeId: "_Wg178p7oIQ", genre: "DISTOPIA", desc: "Kota New York telah takluk oleh kekuatan tak terlihat. Sekelompok kecil penyintas berjuang melawan ancaman AI yang melumpuhkan peradaban." },
        { title: "A steampunk ballerina", youtubeId: "b13ApHV-vz4", genre: "STEAMPUNK", desc: "Kisah balerina mekanik yang memiliki jiwa. Ia harus bersembunyi dari para kolektor yang ingin mengklaim teknologi langka di dalam dirinya." },
        { title: "Project Genesis", youtubeId: "BBgByBR_ego", genre: "DISTOPIA", desc: "Di bawah tanah, sekelompok ilmuwan AI mencoba menghidupkan kembali peradaban menggunakan DNA kuno dalam Proyek Genesis yang sangat rahasia." },
        { title: "The cleaner", youtubeId: "pD4q9zwWvRg", genre: "DISTOPIA", desc: "Seorang pembunuh bayaran robot (Cleaner) ditugaskan untuk menghapus semua jejak kecerdasan artifisial ilegal di kota bawah tanah yang bobrok." },
        
        // KELOMPOK: FANTASI
        { title: "Immortal emperor", youtubeId: "IAyBdD4yOkk", genre: "FANTASI", desc: "Kisah raja abadi yang memimpin kerajaannya melawan kekuatan gelap dari dimensi lain. Sebuah epik fantasi dengan sentuhan visual AI yang menakjubkan." },
        { title: "Age of kingdom", youtubeId: "f7CM2F2_ASk", genre: "FANTASI", desc: "Film yang merayakan kejayaan kerajaan-kerajaan Nusantara di masa lalu, dengan visual yang direka ulang oleh teknologi AI terbaru." },
        { title: "Gog and magog", youtubeId: "OUctsVdjVkE", genre: "FANTASI", desc: "Dua entitas purba terbangun dari tidur panjangnya, mengancam keseimbangan dunia. Hanya pahlawan yang bisa menggabungkan sihir dan teknologi yang bisa menghentikan mereka." },
        { title: "Panji tengkorak", youtubeId: "G5bYtxyBnLc", genre: "FANTASI", desc: "Legenda sang ksatria bertopeng tengkorak. Perjalanan balas dendam dan keadilan di tanah Jawa yang penuh misteri dan ilmu hitam." },
        { title: "The guardian nusantara", youtubeId: "T1tDorodPbM", genre: "FANTASI", desc: "Penjaga rahasia Nusantara harus bangkit melindungi tujuh pusaka suci dari tangan penjahat AI yang ingin menguasai dunia melalui artefak kuno." },
        { title: "Majapahit", youtubeId: "x5c3Vw74_Zg", genre: "FANTASI", desc: "Rekonstruksi visual luar biasa dari Kerajaan Majapahit di masa jayanya, dengan fokus pada intrik politik dan kekuatan militer yang legendaris." },
        { title: "Nusantara", youtubeId: "ZoPYHHHZWq8", genre: "FANTASI", desc: "Sebuah perjalanan melintasi keindahan dan keajaiban alam serta budaya Nusantara, diinterpretasikan oleh mata dan pikiran Kecerdasan Buatan." },
        { title: "Angling darma part 1", youtubeId: "rejgKF0gA48", genre: "FANTASI", desc: "Bagian pertama dari kisah Raja Angling Dharma yang memiliki kemampuan berbicara dengan binatang. Ia harus menghadapi musuh dari dalam istananya sendiri." },
        { title: "Angling darma part 2", youtubeId: "gObghl6rguk", genre: "FANTASI", desc: "Kelanjutan epik Angling Dharma. Ia harus mengorbankan segalanya demi melindungi kerajaan dan rakyatnya dari sihir hitam yang mengancam." },
        { title: "Aladdin", youtubeId: "Lx9UfeujiqE", genre: "FANTASI", desc: "Interpretasi AI yang unik tentang kisah seribu satu malam. Aladdin dan jin yang kini hadir dalam bentuk hologram digital." },
        { title: "Diablo", youtubeId: "cxAtw9s4Txw", genre: "FANTASI", desc: "Film fantasi gelap tentang pertarungan melawan iblis. Visual yang terinspirasi dari game Diablo, diolah oleh AI." },
        { title: "Jurassic", youtubeId: "AI9Yroa_Gz8", genre: "FANTASI", desc: "Dinosaurus kembali hidup, kali ini dengan sentuhan AI yang membuat tampilan mereka semakin realistis dan mengerikan." },
        { title: "Dragon ball part 2", youtubeId: "2bj2dBrKsqc", genre: "FANTASI", desc: "Interpretasi AI dari pertarungan epik Dragon Ball. Bagian 2: Pertarungan di planet Namek yang hancur." },
        { title: "Dragon Ball part 1", youtubeId: "kzrw0Y1qBpc", genre: "FANTASI", desc: "Interpretasi AI dari pertarungan epik Dragon Ball. Bagian 1: Lahirnya legenda Super Saiyan." },
        { title: "Echoes of the horde part 1", youtubeId: "TTzmr4gXt7k", genre: "FANTASI", desc: "Bagian 1: Invasi ras orc kuno yang tiba-tiba muncul di zaman modern melalui portal AI yang tidak sengaja terbuka." },
        { title: "Echoes of the horde part 2", youtubeId: "98zS5AwTG8o", genre: "FANTASI", desc: "Bagian 2: Perlawanan manusia melawan gerombolan orc. Pasukan gabungan manusia dan robot berjuang mati-matian." },
        { title: "Echoes of the horde part 3", youtubeId: "r_4cPaFnN00", genre: "FANTASI", desc: "Bagian 3: Pertempuran di ibukota. Nasib umat manusia berada di ujung tanduk." },
        { title: "Echoes of the horde part 4", youtubeId: "C6d6WZkGUFI", genre: "FANTASI", desc: "Bagian 4: Pencarian artefak kuno untuk menutup portal." },
        { title: "Echoes of the horde part 5", youtubeId: "keppK_KNa2E", genre: "FANTASI", desc: "Bagian 5: Klimaks. Pertarungan epik antara jenderal manusia dan Raja Orc." },
        { title: "Mermed", youtubeId: "rQ6mB0YmI3Q", genre: "FANTASI", desc: "Misteri putri duyung (mermaid) yang ternyata adalah hasil rekayasa genetik dan AI. Kisah yang menyentuh hati di lautan yang tercemar." },
        { title: "Solomon", youtubeId: "QxdT5mQh_nc", genre: "FANTASI", desc: "Visualisasi epik tentang Raja Solomon yang bijaksana dan kekayaan kerajaannya, direkonstruksi oleh AI." },

        // KELOMPOK: AKSI & PERANG
        { title: "Battle of new York 2025", youtubeId: "JiVb7YY3H3c", genre: "PERANG", desc: "Di tengah puing-puing kota New York, pasukan pemberontak melancarkan serangan terakhir melawan dominasi drone dan robot tempur." },
        { title: "Swat", youtubeId: "kC8dxvMKsEc", genre: "AKSI", desc: "Unit elit SWAT berpacu dengan waktu untuk menetralisir bom AI yang telah diprogram untuk meledak di jantung ibu kota." },
        { title: "Glider man", youtubeId: "6-kXTsC-8e0", genre: "AKSI", desc: "Pahlawan yang menggunakan sayap canggih melawan jet tempur tak berawak. Aksi udara cepat yang menegangkan di atas langit kota yang diselimuti kabut asap." },
        { title: "Spartan 300 vs hell's army", youtubeId: "e0ccn_dUgXk", genre: "PERANG", desc: "Jika 300 Sparta melawan pasukan dari neraka yang dihidupkan oleh AI. Perpaduan sejarah, mitologi, dan teknologi dalam satu medan perang." },
        { title: "300 sparta the final Battle warior", youtubeId: "yUEOlq-dWqc", genre: "PERANG", desc: "Pertempuran terakhir para prajurit Sparta melawan musuh yang tidak manusiawi. Darah, kehormatan, dan teknologi kuno." },
        { title: "Battle of the milvian bridge part 1", youtubeId: "MHBqKnfdaKE", genre: "PERANG", desc: "Bagian pertama dari pertempuran legendaris yang menentukan nasib Kekaisaran Romawi, direkonstruksi dengan detail visual AI yang luar biasa." },
        { title: "Battle of the milvian bridge part 2", youtubeId: "ysst5wtu1Ro", genre: "PERANG", desc: "Bagian kedua, klimaks dari pertempuran di Jembatan Milvian, di mana iman dan taktik militer berbenturan." },
        { title: "Shadow war part 1", youtubeId: "bJaTq8GP77s", genre: "AKSI", desc: "Perang rahasia antar-negara yang hanya melibatkan agen AI dan drone siluman. Bagian 1: Pengkhianatan di Tokyo." },
        { title: "Shadow war part 2", youtubeId: "EwRS73thx8A", genre: "AKSI", desc: "Perang rahasia antar-negara yang hanya melibatkan agen AI dan drone siluman. Bagian 2: Pengejaran di Siberia." },
        { title: "Shadow war part 3", youtubeId: "6AYuZNj861g", genre: "AKSI", desc: "Perang rahasia antar-negara yang hanya melibatkan agen AI dan drone siluman. Bagian 3: Klimaks di London." },
        { title: "Spartacus' rebelion part 1", youtubeId: "MOUYkuX3Djc", genre: "PERANG", desc: "Pemberontakan budak yang dipimpin Spartacus, direkonstruksi dengan visual AI yang brutal dan realistis." },
        { title: "Batalion", youtubeId: "5NZubOOeeV0", genre: "AKSI", desc: "Dokumenter fiksi tentang unit militer elit yang dibentuk untuk melawan teroris digital." },

        // KELOMPOK: HOROR & MISTERI
        { title: "The most terrifying legenlegend ever liver", youtubeId: "3sMBwxIuRiw", genre: "HOROR", desc: "Sekelompok pemburu hantu AI memasuki rumah terkutuk yang konon menyimpan rahasia tentang legenda horor paling menakutkan." },
        { title: "Lucifer", youtubeId: "s8eDE99oOJI", genre: "HOROR", desc: "Interpretasi modern AI tentang jatuhnya Lucifer dan perang antara surga dan neraka di dunia digital." },
        { title: "Mandela", youtubeId: "xXUvWkJoDeA", genre: "MISTERI", desc: "Misteri yang berhubungan dengan 'Efek Mandela'. Apa yang terjadi jika ingatan kolektif kita dimanipulasi oleh entitas AI yang jahat?" },
        { title: "Embriyon", youtubeId: "4odmSX1Mraw", genre: "HOROR", desc: "Horor psikologis tentang embrio yang dikembangkan secara artifisial dan memiliki kesadaran kolektif yang mengerikan." },
        { title: "Riset of the infected", youtubeId: "Y1HR7d2DtOI", genre: "HOROR", desc: "Wabah zombie modern yang disebabkan oleh virus komputer yang mengubah manusia menjadi 'infected'. Penuh aksi dan ketegangan." },

        // KELOMPOK: LAIN-LAIN / KOMEDI
        { title: "Dente's comedy", youtubeId: "fWdWYm0sEZ4", genre: "KOMEDI", desc: "Kumpulan sketsa komedi dan animasi konyol yang dibuat sepenuhnya oleh kecerdasan buatan. Dijamin menghibur!" },
        { title: "Treta", youtubeId: "ZFnvrQNgnaY", genre: "LAIN-LAIN", desc: "Sebuah eksperimen gagal yang menciptakan kekacauan dan fenomena aneh di kota metropolitan. Saksikan aksi dan efek visual yang memukau." },
        { title: "TVRI", youtubeId: "7yeQpg72Xno", genre: "LAIN-LAIN", desc: "Nostalgia siaran TVRI di masa lalu, dihidupkan kembali dengan sentuhan dan kualitas visual yang dihasilkan AI." },
        { title: "OUR T2 REMAKE", youtubeId: "2upyv9tJCTM", genre: "LAIN-LAIN", desc: "Remake dari film klasik Terminator 2, yang dibuat oleh penggemar dan disempurnakan dengan teknologi AI." },
        { title: "Mnemosyne", youtubeId: "L_NA-OiOGWA", genre: "LAIN-LAIN", desc: "Eksplorasi visual tentang mitologi Yunani, dewi ingatan, dan bagaimana AI memproses kenangan." },
        { title: "Legend of the stromviel", youtubeId: "RkZStZrpGIc", genre: "LAIN-LAIN", desc: "Legenda tentang makhluk badai (Stromviel) yang menguasai lautan. Sebuah fantasi dengan visual gelombang laut AI yang mengagumkan." },
        { title: "Last man", youtubeId: "amXGChr-YFI", genre: "LAIN-LAIN", desc: "Kisah orang terakhir yang tersisa di bumi setelah wabah. Ia harus berjuang melawan kesendirian dan robot yang ditugaskan membersihkan planet." },
        { title: "Remi", youtubeId: "3oDnRqNiqhc", genre: "LAIN-LAIN", desc: "Film pendek animasi tentang seekor tikus kecil bernama Remi yang berjuang bertahan hidup di kota besar yang dikuasai AI." },
        { title: "Endless wonder", youtubeId: "GUgnvl733jg", genre: "LAIN-LAIN", desc: "Perjalanan visual melalui lanskap fantastis, flora, dan fauna yang tidak ada di dunia nyata, hasil imajinasi AI." },
        { title: "Mnemonade", youtubeId: "_tIm8GBKRJ0", genre: "LAIN-LAIN", desc: "Musik dan visualisasi tentang proses kognitif otak manusia yang dimodelkan oleh AI." },
        { title: "My most insane", youtubeId: "p6JgSujjpto", genre: "LAIN-LAIN", desc: "Video kompilasi dari ide-ide AI paling gila dan aneh yang pernah diproduksi. Tonton dengan risiko Anda sendiri!" },
        { title: "Newton's cradle", youtubeId: "RJZCMfaS-io", genre: "LAIN-LAIN", desc: "Eksperimen fisika yang diinterpretasikan secara artistik oleh AI. Hukum gerak dan tabrakan yang divisualisasikan secara abstrak." },
        { title: "War or Beast part 1", youtubeId: "infDOUAMeq4", genre: "LAIN-LAIN", desc: "Bagian 1: Konflik antara ras manusia dan makhluk buas yang diciptakan melalui rekayasa genetika AI." },
        { title: "The barrier", youtubeId: "Bpwbtmmmb4I", genre: "LAIN-LAIN", desc: "Misteri di balik 'Tembok' raksasa yang memisahkan peradaban. Apa yang ada di baliknya? Film yang penuh pertanyaan dan visual yang kelam." },
        { title: "Air india ai 171", youtubeId: "4i1H_Gqqfdk", genre: "LAIN-LAIN", desc: "Drama yang menceritakan kecelakaan penerbangan Air India 171, dengan visual rekonstruksi yang mendebarkan oleh AI." },
        { title: "Finals glimpse", youtubeId: "mShU3MCO160", genre: "LAIN-LAIN", desc: "Pandangan terakhir ke dunia sebelum kehancuran. Film pendek dengan visual yang indah namun menyedihkan tentang akhir zaman." },
        { title: "On the age", youtubeId: "4HbyziUROS8", genre: "LAIN-LAIN", desc: "Eksplorasi filosofis tentang waktu, umur, dan keabadian melalui mata kecerdasan buatan." },
        { title: "What if the bible", youtubeId: "zzDZeNhmqeg", genre: "LAIN-LAIN", desc: "Visualisasi dari cerita-cerita alkitab yang dibuat seolah-olah terjadi di zaman modern dengan teknologi canggih." },
        { title: "The betrayal", youtubeId: "xiJ2x4lXQh8", genre: "LAIN-LAIN", desc: "Film noir yang penuh intrik dan pengkhianatan di dunia yang dikuasai oleh sistem pengawasan AI." },
        { title: "Hope", youtubeId: "ixo66kHbJR4", genre: "LAIN-LAIN", desc: "Film pendek inspiratif tentang mencari harapan di dunia yang gelap dan tanpa kehidupan. Sebuah karya seni visual AI." },
        { title: "One more pumpkin", youtubeId: "ezZ-8F_dQpo", genre: "LAIN-LAIN", desc: "Animasi Halloween yang lucu dan menyeramkan. Labu yang tiba-tiba hidup dan melakukan teror kecil." },
        { title: "Where do granmas go when they get lost", youtubeId: "JOKINvqrnWQ", genre: "LAIN-LAIN", desc: "Kisah fantasi yang mengharukan tentang seorang anak yang mencari neneknya di dunia paralel yang diciptakan AI." },
    ];
    
    // --- 2. ELEMEN UTAMA & MODAL ---
    const mainContent = document.getElementById('main-content');
    
    // Elemen Modal Video
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPoster = document.getElementById('modalPoster');
    const playMovieBtn = document.getElementById('playMovieBtn');
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
    
    // Fungsi Utility
    // FIX: Menggunakan URL standar YouTube yang berfungsi
    const getThumbnailUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`; 
    const getEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`; 
    
    let currentVideoData = null; 

    // --- 3. LOGIKA PERGANTIAN HALAMAN ---
    function showView(viewId, activeBtn) {
        // Sembunyikan semua view utama
        document.querySelectorAll('.main-view').forEach(view => {
            view.classList.add('hidden-view');
        });
        
        // Nonaktifkan semua tombol navigasi
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.classList.remove('active');
        });

        // Tampilkan view yang diminta
        document.getElementById(viewId).classList.remove('hidden-view');

        // Aktifkan tombol yang sedang diklik
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        closeAllModals(); 
        
        // LOGIKA KHUSUS UNTUK HALAMAN JELAJAHI
        if (viewId === 'explore-page-view') {
            // Tampilkan semua film saat halaman Jelajahi dibuka
            renderExploreContent(allVideos);
            // Reset input pencarian
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

    // Link Media Sosial FIX: Menghilangkan error 404 pada link media sosial
    const instagramLink = 'https://www.instagram.com/vynixai?igsh=MWRiNGFhdG1qY2lubg==';
    const tiktokLink = 'https://www.tiktok.com/@vynixid';

    document.getElementById('social-instagram')?.addEventListener('click', (e) => { e.preventDefault(); window.open(instagramLink, '_blank'); });
    document.getElementById('social-tiktok')?.addEventListener('click', (e) => { e.preventDefault(); window.open(tiktokLink, '_blank'); });
    
    // --- 4. LOGIKA PENCARIAN BERDASARKAN GENRE/JUDUL ---
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toUpperCase().trim();
        
        const filteredVideos = allVideos.filter(video => {
            const isGenreMatch = video.genre.toUpperCase().includes(searchTerm);
            const isTitleMatch = video.title.toUpperCase().includes(searchTerm);
            return isGenreMatch || isTitleMatch;
        });

        renderExploreContent(filteredVideos);
    });

    // --- 5. FUNGSI UTAMA UNTUK MENAMPILKAN CARD FILM & EXPLORE ---

    // Fungsi Pembantu untuk membuat card film (Digunakan di Home & Explore)
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

    // A. Fungsi untuk Render Halaman Beranda (Dikelompokkan per Genre)
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

    function createVideoCards() {
        const groupedVideos = groupVideosByGenre(allVideos);

        // Urutan Genre Utama
        const genreOrder = [
            "SCI-FI", 
            "FANTASI", 
            "AKSI",
            "PERANG",
            "DISTOPIA",
            "STEAMPUNK", 
            "HOROR",
            "MISTERI",
            "KOMEDI",
            "LAIN-LAIN"
        ];
        
        // FIX: Hanya menghapus video row yang dibuat oleh JS agar Hero Banner tetap ada
        mainContent.querySelectorAll('.video-row').forEach(row => row.remove());
        
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
    
    // B. Fungsi untuk Render Halaman Jelajahi (Semua dalam Satu Daftar/Grid)
    function renderExploreContent(videos) {
        exploreContent.innerHTML = ''; 

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('explore-grid-container'); 
        
        // Tampilkan pesan jika tidak ada hasil
        if (videos.length === 0) {
             gridContainer.innerHTML = '<p class="no-results">Tidak ada film ditemukan untuk genre atau judul tersebut. Coba kata kunci genre utama seperti: SCI-FI, FANTASI, HOROR, PERANG, DISTOPIA.</p>';
        } else {
             videos.forEach(video => {
                gridContainer.appendChild(createCard(video));
            });
        }
        
        exploreContent.appendChild(gridContainer);
    }

    // Panggil saat DOM selesai dimuat untuk mengisi halaman Beranda
    createVideoCards(); 

    // --- 6. LOGIKA MODAL VIDEO & PLAYER ---
    function openModalWithDetails(video) {
        currentVideoData = video;
        
        movieDetailsView.classList.remove('hidden-view');
        playerView.classList.add('hidden-view');
        
        modalTitle.textContent = video.title;
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

        // FIX: Menggunakan URL standar YouTube yang berfungsi
        const embedUrl = getEmbedUrl(currentVideoData.youtubeId) + "?autoplay=1&rel=0";
        videoPlayer.src = embedUrl; 

        const playerContainer = playerView.querySelector('.player-container');
        
        const requestFullScreen = playerContainer.requestFullscreen || playerContainer.mozRequestFullScreen || playerContainer.webkitRequestFullscreen || playerContainer.msRequestFullscreen;
        
        if (requestFullScreen) {
            requestFullScreen.call(playerContainer);
        }

        try {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(e => console.log("Gagal mengunci orientasi: ", e));
            }
        } catch (error) {
            console.log("Tidak bisa mengunci orientasi layar.");
        }
    });
    
    // --- 7. LOGIKA PENUTUPAN MODAL ---
    function closeAllModals() {
        videoPlayer.src = ""; 

        const exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        
        if (exitFullscreen && document.fullscreenElement) {
            exitFullscreen.call(document);
        }

        try {
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        } catch (error) {
            // ...
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

    // Panggil halaman film saat pertama kali dimuat
    showView('main-content', navHomeBtn);
});
