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