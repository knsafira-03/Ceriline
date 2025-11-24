/*
* ============================================================
* MAIN JAVASCRIPT - CERILINE (FINAL CONNECTED)
* ============================================================
*/

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. KONFIGURASI API ---
    const API_BASE_URL = 'https://ceriline-auth-123.vercel.app'; 

    // --- 2. UI LOGIC (Menu, Dropdown) ---
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

    // Logika Navigasi Icon User
    const userIconLink = document.querySelector('.user-icon a');
    if (userIconLink) {
        userIconLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = localStorage.getItem('ceriline_username');
            if (currentUser) {
                if (currentUser.toLowerCase().includes('artist')) {
                    window.location.href = 'dashboard-artist.html';
                } else {
                    window.location.href = 'dashboard-customer.html';
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Custom Dropdown Logic
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

    // --- 3. REGISTER ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Loading...";
            
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
            }
        });
    }

    // --- 4. LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Loading...";

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
                    // Simpan nama user di localStorage
                    const username = data.username || payload.identifier;
                    localStorage.setItem('ceriline_username', username);
                    
                    if (payload.identifier.toLowerCase().includes('artist')) {
                        window.location.href = 'dashboard-artist.html';
                    } else {
                        window.location.href = 'dashboard-customer.html';
                    }
                } else {
                    alert('Login Gagal: ' + (data.error || data.message));
                }
            } catch (error) {
                console.error(error);
                alert('Gagal terhubung ke server.');
            } finally {
                submitBtn.innerText = "Login";
            }
        });
    }

    // --- 5. LOGOUT ---
    const logoutBtns = document.querySelectorAll('.btn-logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
            } catch (err) { console.log(err); }
            
            localStorage.removeItem('ceriline_username');
            localStorage.removeItem('view_order_data');
            window.location.href = 'index.html';
        });
    });
    // ============================================================
    // FITUR: KALKULATOR HARGA OTOMATIS
    // ============================================================
    const styleRadios = document.querySelectorAll('input[name="style"]');
    const bgRadios = document.querySelectorAll('input[name="background"]');
    const commercialSelect = document.getElementById('commercial-use');
    const priceDisplay = document.querySelector('.estimated-price');

    function calculatePrice() {
        if (!priceDisplay) return;

        let totalPrice = 0;

        // 1. Harga Dasar Style (Sesuai pricing.html)
        // Sketch: 75k, Colored: 150k, Full Render: 300k
        const selectedStyle = document.querySelector('input[name="style"]:checked');
        if (selectedStyle) {
            const val = selectedStyle.value;
            if (val === 'sketch') totalPrice += 75000;
            else if (val === 'colored') totalPrice += 150000;
            else if (val === 'fullrender') totalPrice += 300000;
        }

        // 2. Harga Tambahan Background
        // Simple: +50k, Detailed: +100k (Estimasi standar)
        const selectedBg = document.querySelector('input[name="background"]:checked');
        if (selectedBg) {
            const val = selectedBg.value;
            if (val === 'simple') totalPrice += 50000;
            else if (val === 'detailed') totalPrice += 100000;
        }

        // 4. Tampilkan Format Rupiah (Rp 150.000)
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(totalPrice);

        // Update Teks HTML
        priceDisplay.innerText = "Estimated Price : " + formattedPrice;
        
        // Efek animasi kecil
        priceDisplay.classList.add('updated');
        setTimeout(() => priceDisplay.classList.remove('updated'), 200);
    }

    // Pasang "telinga" (Event Listener) agar update otomatis saat diklik
    if (priceDisplay) {
        styleRadios.forEach(radio => radio.addEventListener('change', calculatePrice));
        bgRadios.forEach(radio => radio.addEventListener('change', calculatePrice));
        // commercialSelect.addEventListener('change', calculatePrice); // Aktifkan jika commercial use nambah harga

        // Hitung sekali saat halaman pertama kali dibuka (biar gak 0 atau XXX)
        calculatePrice();
    }

    // --- 6. SUBMIT ORDER ---
    const orderForm = document.querySelector('.commission-form');
    if (orderForm) {
        const user = localStorage.getItem('ceriline_username');
        if (!user) {
            alert("Silakan login terlebih dahulu untuk memesan.");
            window.location.href = "login.html";
        } else {
            const emailField = document.getElementById('email');
            // Jika username di localStorage adalah email, isi otomatis
            if(emailField && user.includes('@')) emailField.value = user;
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

    // --- 7. UPDATE NAMA DASHBOARD (FITUR BARU) ---
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        const username = localStorage.getItem('ceriline_username');
        if (username) {
            // Ambil bagian depan email jika formatnya email, dan kapitalisasi huruf pertama
            let cleanName = username.includes('@') ? username.split('@')[0] : username;
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            
            welcomeMsg.innerText = `Hi, ${cleanName}!`;
        }
    }


    // --- 8. DASHBOARD DATA (Customer & Artist) ---
    const artistTable = document.getElementById('orders-table-body'); // Dashboard Artist
    const customerTable = document.getElementById('customer-table-body'); // Dashboard Customer
    
    if (artistTable || customerTable) {
        loadDashboardData(artistTable, customerTable);
    }

    async function loadDashboardData(artistTable, customerTable) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                const orders = data.orders || [];
                
                // Render untuk Artis (Semua Order)
                if (artistTable) {
                    renderArtistTable(artistTable, orders);
                }
                
                // Render untuk Customer (Filter Order Sendiri)
                if (customerTable) {
                    const myUser = localStorage.getItem('ceriline_username');
                    // Filter sederhana berdasarkan email/username yang tersimpan
                    // (Sebaiknya filter ini dilakukan di backend untuk keamanan, tapi ini untuk demo)
                    const myOrders = orders.filter(o => 
                        (o.email && myUser && o.email.toLowerCase() === myUser.toLowerCase()) ||
                        (o.customer_username && myUser && o.customer_username.toLowerCase() === myUser.toLowerCase())
                    );
                    renderCustomerTable(customerTable, myOrders);
                }

            } else {
                console.warn("Gagal memuat dashboard.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function renderArtistTable(tbody, orders) {
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="padding:40px; text-align:center;">No orders yet.</td></tr>`;
            return;
        }
        let html = '';
        orders.forEach((order, index) => {
            html += `
                <tr>
                    <td>#${order.order_id}</td>
                    <td>${order.name}</td>
                    <td>${order.style} / ${order.art_type}</td>
                    <td>${order.status || 'Pending'}</td>
                    <td>${order.deadline || '-'}</td>
                    <td>
                         <button onclick='viewOrderDetails(${JSON.stringify(order)})' class="btn-view" style="border:none; width:100%; cursor:pointer;">View</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function renderCustomerTable(tbody, orders) {
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="padding:40px; color:#999;">You haven't placed any orders yet.</td></tr>`;
            return;
        }
        let html = '';
        orders.forEach(order => {
            html += `
                <tr>
                    <td>#${order.order_id}</td>
                    <td>${order.style} - ${order.art_type}</td>
                    <td>
                        <div class="status-badge ${order.status ? order.status.toLowerCase().replace(' ', '-') : 'pending'}">
                            ${order.status || 'Pending'}
                        </div>
                    </td>
                    <td>${order.deadline || '-'}</td>
                    <td>
                         <button onclick='viewOrderDetails(${JSON.stringify(order)})' class="btn-view" style="border:none; width:100%; cursor:pointer;">View</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
    
    window.viewOrderDetails = function(orderData) {
        localStorage.setItem('view_order_data', JSON.stringify(orderData));
        window.location.href = 'order-detail.html';
    };

    // --- 9. HALAMAN DETAIL ORDER ---
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
                imgBox.innerHTML = `<div class="img-placeholder">No Image</div>`;
            }

            setText('d-desc', orderData.character_description);
            setText('d-bg', orderData.background);
            setText('d-commercial', orderData.commercial_use);
            setText('d-notes', orderData.additional_notes || '-');
        }
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text || "-";
    }

    // --- 10. THANK YOU PAGE ---
    const greetingElement = document.getElementById('greeting-name');
    if (greetingElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        if (nameFromUrl) greetingElement.textContent = `Hi, ${nameFromUrl}!`;
    }

    

});