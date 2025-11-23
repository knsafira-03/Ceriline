const menu = document.querySelector('.menu');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const iconBars = document.querySelectorAll('.icon-bar');
const iconClose = document.querySelectorAll('.icon-close');

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. HAMBURGER MENU ---
    const menu = document.querySelector('.menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const iconBars = document.querySelectorAll('.icon-bar');
    const iconClose = document.querySelectorAll('.icon-close');

    if (hamburgerMenu && menu) {
        hamburgerMenu.addEventListener('click', displayMenu);
        menu.addEventListener('click', displayMenu);
    }

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


    // --- 2. CUSTOM DROPDOWN (Support Multi Dropdown) ---
    const allSelectWrappers = document.querySelectorAll('.custom-select-wrapper');
    
    allSelectWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const realSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelects(wrapper);
            wrapper.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                const selectedText = this.textContent;

                triggerText.textContent = selectedText;
                realSelect.value = selectedValue;
                trigger.classList.remove('placeholder');
                wrapper.classList.remove('open');
            });
        });
    });

    window.addEventListener('click', function() {
        closeAllSelects(null);
    });

    function closeAllSelects(exceptThisOne) {
        allSelectWrappers.forEach(wrapper => {
            if (wrapper !== exceptThisOne) {
                wrapper.classList.remove('open');
            }
        });
    }


    // --- 3. LOGIKA FORM ORDER (Halaman order.html) ---
    const orderForm = document.querySelector('.commission-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            // Ambil style (radio button)
            let style = "Unknown";
            const checkedStyle = document.querySelector('input[name="style"]:checked');
            if(checkedStyle) style = checkedStyle.nextElementSibling.innerText;

            // Ambil art type (dropdown)
            const artTypeSelect = document.getElementById('art-type');
            let artType = "Not Specified";
            if(artTypeSelect && artTypeSelect.value) {
                // Cari text dari option yang value-nya terpilih
                 const selectedOption = artTypeSelect.querySelector(`option[value="${artTypeSelect.value}"]`);
                 if(selectedOption) artType = selectedOption.innerText;
            }

            // Buat Data Order Baru
            const newOrder = {
                id: '#' + Math.floor(1000 + Math.random() * 9000),
                client: name,
                type: `${style} (${artType})`,
                status: 'Pending',
                deadline: getFutureDate(7) // Deadline 7 hari dari sekarang
            };

            // Simpan ke LocalStorage
            const existingOrders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
            existingOrders.push(newOrder);
            localStorage.setItem('ceriline_orders', JSON.stringify(existingOrders));

            // Pindah ke halaman Thank You
            window.location.href = `thankyou.html?name=${encodeURIComponent(name)}`;
        });
    }


    // --- 4. LOGIKA HALAMAN THANK YOU (thankyou.html) ---
    const greetingElement = document.getElementById('greeting-name');
    if (greetingElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        if (nameFromUrl) {
            greetingElement.textContent = `Hi, ${nameFromUrl}!`;
        }
    }


    // --- 5. LOGIKA LOGIN (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email').value;

            if (emailInput.toLowerCase().includes("artist")) {
                // Login sebagai ARTIS -> Ke Dashboard
                window.location.href = "dashboard-artist.html";
            } else {
                // Login sebagai USER BIASA -> Ke Home
                window.location.href = "index.html";
            }
        });
    }


    // --- 6. LOGIKA DASHBOARD ARTIS (dashboard-artist.html) ---
    const tableBody = document.getElementById('orders-table-body');
    if (tableBody) {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];

        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="padding:30px; color:#999;">No active commissions yet.</td></tr>`;
        } else {
            // Render tabel dari data LocalStorage
            tableBody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.client}</td>
                    <td>
                        <div class="status-badge pending">Pending</div>
                        </td>
                    <td>${order.deadline}</td>
                    <td>
                        <a href="#" class="btn-view">View</a>
                    </td>
                </tr>
            `).join('');
        }
    }

});

// Fungsi helper untuk tanggal
function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-GB');
}