/*
* ============================================================
* MAIN JAVASCRIPT - CERILINE (FULL DEMO VERSION)
* Sistem: Simulasi Full (Login, Order, Dashboard di LocalStorage)
* Status: Dijamin Jalan Tanpa Server Backend
* ============================================================
*/

document.addEventListener("DOMContentLoaded", function() {

    // ============================================================
    // 1. UI & INTERAKSI (Menu, Dropdown, Upload, Harga)
    // ============================================================

    // --- Hamburger Menu ---
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

    // --- Custom Dropdown (Logic Pintar) ---
    const allSelectWrappers = document.querySelectorAll('.custom-select-wrapper');
    allSelectWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const realSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                allSelectWrappers.forEach(w => w !== wrapper && w.classList.remove('open'));
                wrapper.classList.toggle('open');
            });
        }

        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                if (triggerText) triggerText.textContent = this.textContent;
                if (realSelect) realSelect.value = selectedValue;
                if (trigger) {
                    trigger.classList.remove('placeholder');
                    // Tambahkan style agar teks terlihat jelas (hitam)
                    trigger.style.color = "#333";
                    trigger.style.fontWeight = "500";
                }
                wrapper.classList.remove('open');
            });
        });
    });
    window.addEventListener('click', () => allSelectWrappers.forEach(w => w.classList.remove('open')));


    // --- Upload Preview (Nama File) ---
    const uploadInput = document.getElementById('upload-image');
    if (uploadInput) {
        uploadInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : "Upload";
            const uploadLabel = document.querySelector('label[for="upload-image"]');
            if (uploadLabel) {
                uploadLabel.innerText = fileName;
                uploadLabel.style.backgroundColor = "#5A33BE";
                uploadLabel.style.color = "#fff";
            }
        });
    }

    // --- Kalkulator Harga Otomatis ---
    const styleRadios = document.querySelectorAll('input[name="style"]');
    const bgRadios = document.querySelectorAll('input[name="background"]');
    const priceDisplay = document.querySelector('.estimated-price');

    function calculatePrice() {
        if (!priceDisplay) return;
        let totalPrice = 0;

        // Harga Dasar
        const selectedStyle = document.querySelector('input[name="style"]:checked');
        if (selectedStyle) {
            const val = selectedStyle.value;
            if (val === 'sketch') totalPrice += 75000;
            else if (val === 'colored') totalPrice += 150000;
            else if (val === 'fullrender') totalPrice += 300000;
        }

        // Tambahan Background
        const selectedBg = document.querySelector('input[name="background"]:checked');
        if (selectedBg) {
            const val = selectedBg.value;
            if (val === 'simple') totalPrice += 50000;
            else if (val === 'detailed') totalPrice += 100000;
        }

        // Format Rupiah
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalPrice);

        priceDisplay.innerText = "Estimated Price : " + formattedPrice;
    }

    if (priceDisplay) {
        styleRadios.forEach(r => r.addEventListener('change', calculatePrice));
        bgRadios.forEach(r => r.addEventListener('change', calculatePrice));
        calculatePrice(); // Hitung saat loading
    }


    // ============================================================
    // 3. SISTEM LOGIN & SIGN UP (SIMULASI)
    // ============================================================

    // --- REGISTER ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simpan akun ke Database Bohongan (LocalStorage)
            const newUser = { name: name, email: email, password: password };
            localStorage.setItem('user_' + email, JSON.stringify(newUser));

            alert(`Account created for ${name}! Please login.`);
            window.location.href = "login.html";
        });
    }

    // --- LOGIN ---
    const loginForm = document.getElementById('loginForm'); // Pastikan ID di HTML loginForm
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Cek database bohongan
            const storedUser = JSON.parse(localStorage.getItem('user_' + email));
            
            // LOGIKA LOGIN SAKTI (Bisa login pakai akun yg baru dibuat ATAU akun artis)
            let isValidUser = false;
            let username = "";

            if (email.toLowerCase().includes("artist")) {
                isValidUser = true; // Akun artis selalu bisa login (Backdoor)
                username = "Artist";
            } else if (storedUser && storedUser.password === password) {
                isValidUser = true;
                username = storedUser.name;
            } else if (storedUser) {
                alert("Password salah!");
                return;
            } else {
                // Kalau belum daftar, kita anggap login sukses aja untuk demo (biar gak ribet)
                // Atau bisa alert("User not found");
                isValidUser = true; 
                username = email.split('@')[0];
            }

            if (isValidUser) {
                localStorage.setItem('ceriline_username', username);
                localStorage.setItem('ceriline_email', email); // Simpan email buat filter

                if (email.toLowerCase().includes('artist')) {
                    window.location.href = 'dashboard-artist.html';
                } else {
                    window.location.href = 'dashboard-customer.html';
                }
            }
        });
    }

    // --- ICON USER NAVIGASI ---
    const userIconLink = document.querySelector('.user-icon a');
    if (userIconLink) {
        userIconLink.addEventListener('click', function(e) {
            e.preventDefault();
            const user = localStorage.getItem('ceriline_username');
            const email = localStorage.getItem('ceriline_email');

            if (user) {
                if (email && email.includes('artist')) {
                    window.location.href = 'dashboard-artist.html';
                } else {
                    window.location.href = 'dashboard-customer.html';
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // --- LOGOUT ---
    const logoutBtns = document.querySelectorAll('.btn-logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ceriline_username');
            localStorage.removeItem('ceriline_email');
            window.location.href = 'index.html';
        });
    });


    // ============================================================
    // 4. SISTEM ORDER (LOCALSTORAGE)
    // ============================================================
    const orderForm = document.querySelector('.commission-form');
    if (orderForm) {
        // Cek Login
        const user = localStorage.getItem('ceriline_username');
        if (!user) {
            alert("Silakan login terlebih dahulu.");
            window.location.href = "login.html";
        } else {
            // Auto fill email
            const emailData = localStorage.getItem('ceriline_email');
            const emailField = document.getElementById('email');
            if (emailField && emailData) emailField.value = emailData;
        }

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Processing...";
            
            // Proses Gambar
            const fileInput = document.getElementById('upload-image');
            const processOrder = (base64Img) => {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                
                // Helper ambil value
                const getVal = (id) => document.getElementById(id).value;
                const getRadio = (name) => {
                    const el = document.querySelector(`input[name="${name}"]:checked`);
                    return el ? el.nextElementSibling.innerText : "-";
                };
                
                // Ambil harga
                let priceTxt = document.querySelector('.estimated-price') ? document.querySelector('.estimated-price').innerText : "";
                priceTxt = priceTxt.replace("Estimated Price : ", "");

                const newOrder = {
                    id: '#' + Math.floor(1000 + Math.random() * 9000),
                    client: name,
                    email: email,
                    style: getRadio('style'),
                    background: getRadio('background'),
                    artType: getVal('art-type'),
                    commercial: getVal('commercial-use'),
                    instagram: getVal('instagram'),
                    reference_link: getVal('reference'),
                    description: getVal('description'),
                    notes: getVal('notes'),
                    price: priceTxt,
                    imageReference: base64Img,
                    status: 'Pending',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
                };

                // Simpan
                const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
                orders.push(newOrder);
                
                try {
                    localStorage.setItem('ceriline_orders', JSON.stringify(orders));
                    window.location.href = `thankyou.html?name=${encodeURIComponent(name)}`;
                } catch (e) {
                    alert("Gambar terlalu besar! Coba gambar lain.");
                    submitBtn.innerText = "Submit Order";
                }
            };

            if (fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => processOrder(e.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                processOrder(null);
            }
        });
    }


    // ============================================================
    // 5. DASHBOARD (READ DATA)
    // ============================================================
    const artistTable = document.getElementById('orders-table-body');
    const customerTable = document.getElementById('customer-table-body');

    if (artistTable || customerTable) {
        renderDashboards();
    }

    function renderDashboards() {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];

        // A. ARTIST (Lihat Semua)
        if (artistTable) {
            if (orders.length === 0) {
                artistTable.innerHTML = `<tr><td colspan="6" style="padding:40px; color:#999;">No orders yet.</td></tr>`;
            } else {
                artistTable.innerHTML = orders.map((order, index) => {
                    
                    // KONVERSI TANGGAL: DD/MM/YYYY -> YYYY-MM-DD (Supaya bisa dibaca input type="date")
                    let dateValue = "";
                    if (order.deadline && order.deadline.includes('/')) {
                        const parts = order.deadline.split('/');
                        if(parts.length === 3) {
                            // Ubah jadi YYYY-MM-DD
                            dateValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        }
                    }

                    return `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.client}</td>
                        <td>
                            <select class="status-select ${order.status.toLowerCase().replace(' ', '-')}" 
                                    onchange="updateStatus(${index}, this.value)">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <input type="date" 
                                   class="date-input" 
                                   value="${dateValue}" 
                                   onchange="updateDeadline(${index}, this.value)">
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button onclick="viewOrder(${index})" class="btn-view">View</button>
                                <button onclick="deleteOrder(${index})" class="btn-delete" style="margin-left:5px; background:#ff4d4d; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `}).join('');
            }
        }

        // B. CUSTOMER (Lihat Punya Sendiri)
        if (customerTable) {
            const myEmail = localStorage.getItem('ceriline_email');
            // Filter berdasarkan email yang sama
            const myOrders = orders.filter(o => o.email && myEmail && o.email.toLowerCase() === myEmail.toLowerCase());

            if (myOrders.length === 0) {
                customerTable.innerHTML = `<tr><td colspan="3" style="padding:40px; color:#999;">You haven't placed any orders yet.</td></tr>`;
            } else {
                // Kita perlu cari index asli di array 'orders' untuk fungsi view
                customerTable.innerHTML = myOrders.map(order => {
                    // Cari index asli order ini di database utama
                    const originalIndex = orders.findIndex(o => o.id === order.id);
                    
                    return `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.style} - ${order.artType}</td>
                            <td>
                                <div class="status-badge ${order.status.toLowerCase().replace(' ', '-')}">
                                    ${order.status}
                                </div>
                            </td>
                            </tr>
                    `;
                }).join('');
            }
        }
    }

    // Fungsi Helper Global (Bisa dipanggil dari HTML)
    window.updateStatus = function(index, newStatus) {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
        if (orders[index]) {
            orders[index].status = newStatus;
            localStorage.setItem('ceriline_orders', JSON.stringify(orders));
            renderDashboards(); // Refresh tampilan
        }
    };

    window.deleteOrder = function(index) {
        if(confirm("Delete this order?")) {
            const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
            orders.splice(index, 1);
            localStorage.setItem('ceriline_orders', JSON.stringify(orders));
            renderDashboards();
        }
    };

    window.viewOrder = function(index) {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
        localStorage.setItem('view_order_data', JSON.stringify(orders[index]));
        window.location.href = 'order-detail.html';
    };


    // --- 6. HALAMAN DETAIL ORDER ---
    const detailCard = document.querySelector('.order-detail-card');
    if (detailCard) {
        const data = JSON.parse(localStorage.getItem('view_order_data'));
        if (data) {
            const setText = (id, val) => {
                const el = document.getElementById(id);
                if(el) el.innerText = val || "-";
            };
            
            setText('d-name', data.client);
            setText('d-email', data.email);
            setText('d-instagram', data.instagram);
            setText('d-style', data.style);
            setText('d-arttype', data.artType);
            setText('d-desc', data.description);
            setText('d-bg', data.background);
            setText('d-commercial', data.commercial);
            setText('d-notes', data.notes);
            
            const refLink = document.getElementById('d-reflink');
            if(refLink) {
                refLink.innerText = data.reference_link || "-";
                if(data.reference_link) refLink.href = data.reference_link;
            }

            const imgBox = document.getElementById('d-images');
            if(imgBox) {
                if(data.imageReference) imgBox.innerHTML = `<img src="${data.imageReference}" style="max-width:200px; border-radius:10px;">`;
                else imgBox.innerHTML = "No image";
            }
        }
    }

    // --- 7. HEADER WELCOME (Customer Dashboard) ---
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        const username = localStorage.getItem('ceriline_username');
        if (username) {
            // Kapitalisasi huruf pertama
            const cleanName = username.charAt(0).toUpperCase() + username.slice(1);
            welcomeMsg.innerText = `Hi, ${cleanName}!`;
        }
    }
    
    // --- 8. THANK YOU PAGE ---
    const thankName = document.getElementById('greeting-name');
    if (thankName) {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        if(name) thankName.innerText = `Hi, ${name}!`;
    }

    // Fungsi Update Deadline (Global)
    window.updateDeadline = function(index, newDateYMD) {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
        
        if (orders[index]) {
            // newDateYMD formatnya YYYY-MM-DD (dari input date)
            // Kita ubah balik ke DD/MM/YYYY biar seragam
            if(newDateYMD) {
                const parts = newDateYMD.split('-'); // [YYYY, MM, DD]
                const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
                
                orders[index].deadline = formattedDate;
                localStorage.setItem('ceriline_orders', JSON.stringify(orders));
                
                // Optional: Kasih feedback visual (console log atau alert kecil)
                console.log("Deadline updated to:", formattedDate);
            }
        }
    };

});