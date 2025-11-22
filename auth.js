// =======================================================
// URL BACKEND ASLI YANG AKAN DIGUNAKAN
// =======================================================
const BASE_BACKEND_URL = 'https://ceriline-auth-123.vercel.app'; 
// =======================================================


document.addEventListener('DOMContentLoaded', () => {

    // LOGIKA UNTUK REGISTRASI (SIGNUP) - Menggunakan /api/register
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            // Ambil nilai dari field input
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Data yang dikirim ke backend
            const payload = {
                username: name, // MAPPING: 'name' frontend ke 'username' backend
                email: email,
                password: password,
                confirm_password: confirmPassword
            };
            
            try {
                const response = await fetch(`${BASE_BACKEND_URL}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) { // Jika status 201
                    alert('Registrasi Berhasil: ' + data.message);
                    window.location.href = 'login.html'; // Arahkan ke halaman login
                } else {
                    // Jika gagal (misalnya 400 Bad Request)
                    alert('Registrasi Gagal: ' + data.error);
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Terjadi kesalahan koneksi.');
            }
        });
    }


    // LOGIKA UNTUK LOGIN - Menggunakan /api/login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            // Ambil nilai dari field input
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Data yang dikirim ke backend
            const payload = {
                identifier: email, // MAPPING: 'email' frontend ke 'identifier' backend
                password: password
            };

            try {
                const response = await fetch(`${BASE_BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // PENTING: untuk mengirim dan menerima cookie sesi
                    credentials: 'include', 
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok) { // Jika status 200
                    alert('Login Berhasil: ' + data.message);
                    window.location.href = 'index.html'; // Arahkan ke halaman utama
                } else {
                    // Jika gagal (misalnya 401 Unauthorized)
                    alert('Login Gagal: ' + data.error);
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Terjadi kesalahan koneksi.');
            }
        });
    }

    // ... (lanjutan kode di atas)

    // LOGIKA UNTUK LOGOUT - Menggunakan /api/logout (Anda bisa memanggil fungsi ini saat tombol Logout di klik)
    window.handleLogout = async () => {
        const backendUrl = `${BASE_BACKEND_URL}/api/logout`;
        
        try {
            // Permintaan logout juga harus menyertakan kredensial (cookie)
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' 
            });

            const data = await response.json();

            if (response.ok) { // Jika status 200 OK
                alert('Anda telah berhasil Logout.');
                window.location.href = 'index.html'; // Arahkan kembali ke halaman utama atau login
            } else {
                alert('Logout Gagal: ' + (data.error || 'Terjadi kesalahan saat logout.'));
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Terjadi kesalahan jaringan saat mencoba logout.');
        }
    };
    
});