/*
* ============================================================
* MAIN JAVASCRIPT - CERILINE (FINAL VERSION)
* ============================================================
*/

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


    // --- 3. FITUR UPLOAD GAMBAR (Preview Nama File) ---
    const uploadInput = document.getElementById('upload-image');
    if (uploadInput) {
        uploadInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : "Upload";
            // Cari label yang jadi tombol upload
            const uploadLabel = document.querySelector('label[for="upload-image"]');
            if (uploadLabel) {
                uploadLabel.innerText = fileName; // Ubah tulisan "Upload" jadi nama file
                uploadLabel.style.backgroundColor = "#5A33BE"; // Ubah warna jadi ungu tanda sukses
                uploadLabel.style.color = "#fff";
            }
        });
    }


    // --- 4. LOGIKA FORM ORDER (Simpan Data + Gambar) ---
    const orderForm = document.querySelector('.commission-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil File Gambar
            const fileInput = document.getElementById('upload-image');
            const file = fileInput.files[0];

            // Peringatan jika file terlalu besar (LocalStorage terbatas 5MB)
            if (file && file.size > 500000) { // 500KB limit
                alert("File gambar terlalu besar! Mohon upload di bawah 500KB untuk simulasi ini.");
                return;
            }

            // Fungsi untuk memproses simpan data (dijalankan setelah gambar dibaca)
            const processOrder = (base64Image) => {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const instagram = document.getElementById('instagram').value;
                const refLink = document.getElementById('reference').value;
                const description = document.getElementById('description').value;
                const notes = document.getElementById('notes').value;
                
                // Style (Radio)
                let style = "Unknown";
                const checkedStyle = document.querySelector('input[name="style"]:checked');
                if(checkedStyle) style = checkedStyle.nextElementSibling.innerText;

                // Background (Radio)
                let background = "None";
                const checkedBg = document.querySelector('input[name="background"]:checked');
                if(checkedBg) background = checkedBg.nextElementSibling.innerText;

                // Art Type (Dropdown)
                const artTypeSelect = document.getElementById('art-type');
                let artType = "Not Specified";
                if(artTypeSelect && artTypeSelect.value) {
                     const selectedOption = artTypeSelect.querySelector(`option[value="${artTypeSelect.value}"]`);
                     if(selectedOption) artType = selectedOption.innerText;
                }

                // Commercial Use (Dropdown)
                const commSelect = document.getElementById('commercial-use');
                let commercial = "No";
                if(commSelect && commSelect.value) {
                     const selectedOption = commSelect.querySelector(`option[value="${commSelect.value}"]`);
                     if(selectedOption) commercial = selectedOption.innerText;
                }

                // Buat Data Order Baru
                const newOrder = {
                    id: '#' + Math.floor(1000 + Math.random() * 9000),
                    client: name,
                    email: email,
                    instagram: instagram,
                    style: style,
                    artType: artType,
                    referenceLink: refLink,
                    description: description,
                    background: background,
                    commercial: commercial,
                    notes: notes,
                    imageReference: base64Image, // Simpan kode gambar di sini
                    status: 'Pending',
                    deadline: getFutureDate(7)
                };

                // Simpan ke LocalStorage
                const existingOrders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
                existingOrders.push(newOrder);
                try {
                    localStorage.setItem('ceriline_orders', JSON.stringify(existingOrders));
                    // Pindah ke halaman Thank You
                    window.location.href = `thankyou.html?name=${encodeURIComponent(name)}`;
                } catch (error) {
                    alert("Storage penuh! Coba upload gambar yang lebih kecil.");
                }
            };

            // Jika ada file, baca dulu jadi Base64
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    processOrder(event.target.result); // Kirim hasil bacaan gambar
                };
                reader.readAsDataURL(file);
            } else {
                processOrder(null); // Tidak ada gambar
            }
        });
    }


    // --- 5. LOGIKA HALAMAN THANK YOU ---
    const greetingElement = document.getElementById('greeting-name');
    if (greetingElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        if (nameFromUrl) {
            greetingElement.textContent = `Hi, ${nameFromUrl}!`;
        }
    }


    // --- 6. LOGIKA LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email').value;

            if (emailInput.toLowerCase().includes("artist")) {
                window.location.href = "dashboard-artist.html";
            } else {
                window.location.href = "index.html";
            }
        });
    }


// --- 7. LOGIKA DASHBOARD ARTIS (UPDATE: Edit Status & Delete) ---
    const tableBody = document.getElementById('orders-table-body');
    
    // Fungsi untuk render tabel (kita buat jadi fungsi biar bisa dipanggil ulang saat delete)
    function renderTable() {
        if (!tableBody) return;

        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];

        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="padding:30px; color:#999;">No active commissions yet.</td></tr>`;
        } else {
            tableBody.innerHTML = orders.map((order, index) => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.client}</td>
                    <td>
                        <select 
                            class="status-select ${order.status.toLowerCase().replace(' ', '-')}" 
                            onchange="updateStatus(${index}, this.value)"
                        >
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In Progress" ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </td>
                    <td>${order.deadline}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="order-detail.html?id=${encodeURIComponent(order.id)}" class="btn-view">View</a>
                            <button onclick="deleteOrder(${index})" class="btn-delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Panggil fungsi render saat halaman dimuat
    renderTable();

    // --- FUNGSI UPDATE STATUS (Global) ---
    window.updateStatus = function(index, newStatus) {
        const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
        
        // Update status di data
        orders[index].status = newStatus;
        
        // Simpan balik ke LocalStorage
        localStorage.setItem('ceriline_orders', JSON.stringify(orders));
        
        // Refresh tabel biar warnanya berubah
        renderTable();
        // alert("Status updated to " + newStatus); // Opsional: tampilkan pesan
    };

    // --- FUNGSI DELETE ORDER (Global) ---
    window.deleteOrder = function(index) {
        if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
            
            // Hapus 1 item pada posisi 'index'
            orders.splice(index, 1);
            
            // Simpan balik ke LocalStorage
            localStorage.setItem('ceriline_orders', JSON.stringify(orders));
            
            // Refresh tabel
            renderTable();
        }
    };


    // --- 8. LOGIKA HALAMAN DETAIL ORDER (Tetap sama, tidak perlu diubah) ---
    const detailCard = document.querySelector('.order-detail-card');
    if (detailCard) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');

        if (orderId) {
            const orders = JSON.parse(localStorage.getItem('ceriline_orders')) || [];
            const order = orders.find(o => o.id === orderId);

            if (order) {
                setText('d-name', order.client);
                setText('d-email', order.email);
                setText('d-instagram', order.instagram || '-');
                setText('d-style', order.style);
                setText('d-arttype', order.artType);
                setText('d-reflink', order.referenceLink || '-');
                setText('d-desc', order.description);
                setText('d-bg', order.background);
                setText('d-commercial', order.commercial);
                setText('d-notes', order.notes || '-');

                const imgContainer = document.getElementById('d-images');
                if (order.imageReference) {
                    imgContainer.innerHTML = `<img src="${order.imageReference}" alt="Reference" style="max-width: 100%; max-height: 300px; border-radius: 10px; border: 1px solid #ddd;">`;
                } else {
                    imgContainer.innerHTML = `<div class="img-placeholder">No Image Uploaded</div>`;
                }
            } else {
                alert("Order not found!");
            }
        }
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

}); // <--- INI TUTUP DOMContentLoaded

// Fungsi helper tanggal (di luar DOMContentLoaded)
function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-GB');
}