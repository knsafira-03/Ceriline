/*
* ============================================================
* MAIN JAVASCRIPT - CERILINE (FINAL VERSION)
* ============================================================
*/

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. KONFIGURASI API ---
    const API_BASE_URL = 'https://ceriline-auth-123.vercel.app'; 

    // --- 2. LOGIKA ICON USER (Supaya Gak Login Ulang) ---
    const userIconLink = document.querySelector('.user-icon a');
    if (userIconLink) {
        userIconLink.addEventListener('click', function(e) {
            e.preventDefault(); // Tahan dulu, jangan langsung pindah halaman
            
            // Cek di memori browser apakah ada user yg sedang login
            const currentUser = localStorage.getItem('ceriline_username');
            
            if (currentUser) {
                // --- JIKA SUDAH LOGIN ---
                // Cek apakah dia Artis atau User Biasa
                if (currentUser.toLowerCase().includes('artist')) {
                    // Kalau Artis -> Langsung ke Dashboard
                    window.location.href = 'dashboard-artist.html';
                } else {
                    // Kalau User Biasa -> Kasih tau aja sudah login (atau bisa diarahkan ke profile nanti)
                    alert(`Halo ${currentUser}, kamu sudah login!`);
                }
            } else {
                // --- JIKA BELUM LOGIN ---
                // Baru arahkan ke halaman Login
                window.location.href = 'login.html';
            }
        });
    }


    // --- 3. MENU HAMBURGER ---
    const menu = document.querySelector('.menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const iconBars = document.querySelectorAll('.icon-bar');
    const iconClose = document.querySelectorAll('.icon-close');

    if (hamburgerMenu && menu) {
        hamburgerMenu.addEventListener('click', () => {
            const isTampil = menu.classList.toggle('tampil');
            iconBars.forEach(el => el.style.display = isTampil ? 'none' : 'block');
            iconClose.forEach(el => el.style.display = isTampil ? 'block' : 'none');
        });
    }

    // --- 4. CUSTOM DROPDOWN ---
    const allSelectWrappers = document.querySelectorAll('.custom-select-wrapper');
    allSelectWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const realSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            allSelectWrappers.forEach(w => w !== wrapper && w.classList.remove('open'));
            wrapper.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                triggerText.textContent = this.textContent;
                realSelect.value = selectedValue;
                trigger.classList.remove('placeholder');
                wrapper.classList.remove('open');
            });
        });
    });
    window.addEventListener('click', () => allSelectWrappers.forEach(w => w.classList.remove('open')));

    // Upload Preview
    const uploadInput = document.getElementById('upload-image');
    if (uploadInput) {
        uploadInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : "Upload";
            const label = document.querySelector('label[for="upload-image"]');
            if (label) {
                label.innerText = fileName;
                label.style.backgroundColor = "#5A33BE";
                label.style.color = "#fff";
            }
        });
    }


    // --- 5. REGISTER (SIGN UP) ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Loading...";
            submitBtn.disabled = true;

            const payload = {
                username: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirm_password: document.getElementById('confirm-password').value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                if (response.ok) {
                    alert('Registrasi Berhasil! Silakan Login.');
                    window.location.href = 'login.html';
                } else {
                    alert('Registrasi Gagal: ' + (data.error || data.message));
                }
            } catch (error) {
                console.error(error);
                alert('Gagal terhubung ke server.');
            } finally {
                submitBtn.innerText = "Sign Up";
                submitBtn.disabled = false;
            }
        });
    }


    // --- 6. LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Loading...";
            submitBtn.disabled = true;

            const payload = {
                identifier: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                if (response.ok) {
                    // Simpan info user di localStorage agar ikon user tau kita sudah login
                    localStorage.setItem('ceriline_username', data.username || payload.identifier);
                    
                    if (data.role === 'artist' || payload.identifier.includes('artist')) {
                        window.location.href = 'dashboard-artist.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert('Login Gagal: ' + (data.error || data.message));
                }
            } catch (error) {
                console.error(error);
                alert('Gagal terhubung ke server.');
            } finally {
                submitBtn.innerText = "Login";
                submitBtn.disabled = false;
            }
        });
    }


    // --- 7. LOGOUT ---
    // Update: Logout sekarang menghapus data localStorage juga
    const logoutBtns = document.querySelectorAll('.btn-logout, a[href="index.html"].logout'); // Atau tambahkan tombol logout khusus
    
    // Cek juga kalau ada tombol logout di dashboard (biasanya belum ada class khusus, kita tambahkan logika umum)
    document.body.addEventListener('click', async (e) => {
        // Jika yang diklik adalah link/tombol yang mengandung kata "Logout"
        if (e.target.innerText.includes('Logout') || e.target.closest('.btn-logout')) {
             e.preventDefault();
             try {
                await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
            } catch (err) { console.log(err); }
            
            // Hapus data login dari browser
            localStorage.removeItem('ceriline_username');
            localStorage.removeItem('view_order_data');
            
            window.location.href = 'index.html';
        }
    });


    // --- 8. SUBMIT ORDER ---
    const orderForm = document.querySelector('.commission-form');
    if (orderForm) {
        // Cek Login Dulu
        const user = localStorage.getItem('ceriline_username');
        if (!user) {
            alert("Silakan login terlebih dahulu untuk memesan.");
            window.location.href = "login.html";
            return;
        } else {
            // Auto fill email kalau ada fieldnya
            const emailField = document.getElementById('email');
            if(emailField && !emailField.value) emailField.value = user.includes('@') ? user : '';
        }

        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('instagram', document.getElementById('instagram').value);
            formData.append('reference_link', document.getElementById('reference').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('notes', document.getElementById('notes').value);
            
            const style = document.querySelector('input[name="style"]:checked');
            if(style) formData.append('style', style.nextElementSibling.innerText);
            
            const bg = document.querySelector('input[name="background"]:checked');
            if(bg) formData.append('background', bg.nextElementSibling.innerText);

            formData.append('art_type', document.getElementById('art-type').value);
            formData.append('commercial_use', document.getElementById('commercial-use').value);

            const fileInput = document.getElementById('upload-image');
            if (fileInput.files.length > 0) {
                formData.append('image', fileInput.files[0]);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/order`, {
                    method: 'POST', credentials: 'include', body: formData
                });

                if (response.ok) {
                    const clientName = document.getElementById('name').value;
                    window.location.href = `thankyou.html?name=${encodeURIComponent(clientName)}`;
                } else {
                    const data = await response.json();
                    alert('Gagal: ' + (data.error || data.message));
                    submitBtn.innerText = "Submit Order";
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert('Error koneksi.');
                submitBtn.innerText = "Submit Order";
                submitBtn.disabled = false;
            }
        });
    }


    // --- 9. DASHBOARD ARTIS (LOAD DATA) ---
    const tableBody = document.getElementById('orders-table-body');
    if (tableBody) {
        loadDashboardData();
    }

    async function loadDashboardData() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                renderTable(data.orders);
            } else {
                // Kalau gagal load (misal belum login), kembalikan ke login
                console.warn("Gagal memuat dashboard.");
                // window.location.href = 'login.html'; 
            }
        } catch (error) {
            console.error("Error loading dashboard:", error);
            tableBody.innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
        }
    }

    function renderTable(orders) {
        if (!orders || orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="padding:40px; text-align:center;">No active commissions yet.</td></tr>`;
            return;
        }

        let html = '';
        orders.forEach((order, index) => {
            html += `
                <tr>
                    <td>#${order.order_id}</td>
                    <td>${order.name}</td>
                    <td>${order.status || 'Pending'}</td>
                    <td>${order.deadline || '-'}</td>
                    <td>
                         <button onclick='viewOrderDetails(${JSON.stringify(order)})' class="btn-view" style="border:none; width:100%; cursor:pointer;">View</button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }
    
    // Helper View Order
    window.viewOrderDetails = function(orderData) {
        localStorage.setItem('view_order_data', JSON.stringify(orderData));
        window.location.href = 'order-detail.html';
    };


    // --- 10. HALAMAN DETAIL ORDER ---
    const detailCard = document.querySelector('.order-detail-card');
    if (detailCard) {
        const orderData = JSON.parse(localStorage.getItem('view_order_data'));

        if (orderData) {
            setText('d-name', orderData.name);
            setText('d-email', orderData.email);
            setText('d-instagram', orderData.instagram || '-');
            setText('d-style', orderData.style);
            setText('d-arttype', orderData.art_type);
            
            const refLink = document.getElementById('d-reflink');
            if (orderData.reference_link) {
                refLink.innerText = orderData.reference_link;
                refLink.href = orderData.reference_link.startsWith('http') ? orderData.reference_link : 'https://' + orderData.reference_link;
            } else {
                refLink.innerText = '-';
            }

            const imgBox = document.getElementById('d-images');
            if (orderData.image_reference_url) {
                imgBox.innerHTML = `<img src="${orderData.image_reference_url}" alt="Ref" style="max-width:200px; border-radius:10px;">`;
            } else {
                imgBox.innerHTML = `<div class="img-placeholder" style="color:#888; font-style:italic;">No image uploaded</div>`;
            }

            setText('d-desc', orderData.character_description);
            setText('d-bg', orderData.background);
            setText('d-commercial', orderData.commercial_use);
            setText('d-notes', orderData.additional_notes || '-');
        }
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }
    
    // --- 11. HALAMAN THANK YOU ---
    const greetingElement = document.getElementById('greeting-name');
    if (greetingElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        if (nameFromUrl) greetingElement.textContent = `Hi, ${nameFromUrl}!`;
    }

}); // End DOMContentLoaded