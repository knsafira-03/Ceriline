const menu = document.querySelector('.menu');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const iconBars = document.querySelectorAll('.icon-bar');
const iconClose = document.querySelectorAll('.icon-close');

hamburgerMenu.addEventListener('click', displayMenu);
menu.addEventListener('click', displayMenu);

function displayMenu() {
    if (menu.classList.contains('tampil')) {
        menu.classList.remove('tampil');
        iconBars.forEach(bar => bar.style.display = 'block');
        iconClose.forEach(close => close.style.display = 'none');
    } else {
        menu.classList.add('tampil');
        iconBars.forEach(bar => bar.style.display = 'none');
        iconClose.forEach(close => close.style.display = 'block');
    }
}

/*
* =================================
* Custom Select Dropdown (Versi Multi)
* =================================
*/
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Cari SEMUA dropdown di halaman
    const allSelectWrappers = document.querySelectorAll('.custom-select-wrapper');

    // 2. Terapkan fungsionalitas ke SETIAP dropdown
    allSelectWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const realSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        // Buka/Tutup daftar opsi
        trigger.addEventListener('click', function(e) {
            e.stopPropagation(); // Hentikan event agar tidak tertutup 'window'
            // Tutup semua dropdown lain dulu
            closeAllSelects(wrapper);
            // Buka/tutup yang ini
            wrapper.classList.toggle('open');
        });

        // Saat salah satu opsi diklik
        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                const selectedText = this.textContent;

                // Update teks di kotak palsu
                triggerText.textContent = selectedText;
                
                // Update nilai di <select> asli yang tersembunyi
                realSelect.value = selectedValue;

                // Hapus style placeholder jika ada
                trigger.classList.remove('placeholder');

                // Tutup daftar opsi
                wrapper.classList.remove('open');
            });
        });
    });

    // 3. (Opsional) Tutup jika klik di luar
    window.addEventListener('click', function(e) {
        closeAllSelects(null);
    });

    // Fungsi untuk menutup semua dropdown
    function closeAllSelects(exceptThisOne) {
        allSelectWrappers.forEach(wrapper => {
            if (wrapper !== exceptThisOne) {
                wrapper.classList.remove('open');
            }
        });
    }
});