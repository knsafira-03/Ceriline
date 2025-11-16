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
contact
*/
document.addEventListener("DOMContentLoaded", function() {
    const wrapper = document.querySelector('.custom-select-wrapper');
    if (wrapper) {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const realSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        // 1. Buka/Tutup daftar opsi
        trigger.addEventListener('click', function() {
            wrapper.classList.toggle('open');
        });

        // 2. Saat salah satu opsi diklik
        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                const selectedText = this.textContent;
                triggerText.textContent = selectedText;
                realSelect.value = selectedValue;
                wrapper.classList.remove('open');
            });
        });

        // 3. (Opsional) Tutup jika klik di luar
        window.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });
    }
});