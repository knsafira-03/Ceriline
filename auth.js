// =======================================================
// URL BACKEND ASLI YANG AKAN DIGUNAKAN
// =======================================================
const BASE_BACKEND_URL = 'https://ceriline-auth-123.vercel.app'; 
// =======================================================


document.addEventListener('DOMContentLoaded', () => {

    // LOGIKA UNTUK REGISTRASI (SIGNUP)
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
                username: name,
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

                if (response.ok) { 
                    alert('Registrasi Berhasil: ' + data.message);
                    window.location.href = 'login.html';
                } else {
                    alert('Registrasi Gagal: ' + data.error);
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Terjadi kesalahan koneksi.');
            }
        });
    }


    // LOGIKA UNTUK LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            // Ambil nilai dari field input
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Data yang dikirim ke backend
            const payload = {
                identifier: email,
                password: password
            };

            try {
                const response = await fetch(`${BASE_BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', 
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok) { 
                    alert('Login Berhasil: ' + data.message);
                    window.location.href = 'index.html'; 
                } else {
                    alert('Login Gagal: ' + data.error);
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Terjadi kesalahan koneksi.');
            }
        });
    }

    // LOGIKA UNTUK LOGOUT (Pastikan ini ada di dalam document.addEventListener)
    window.handleLogout = async () => {
        const backendUrl = `${BASE_BACKEND_URL}/api/logout`;
        
        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' 
            });

            const data = await response.json();

            if (response.ok) { 
                alert('Anda telah berhasil Logout.');
                window.location.href = 'index.html'; 
            } else {
                alert('Logout Gagal: ' + (data.error || 'Terjadi kesalahan saat logout.'));
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Terjadi kesalahan jaringan saat mencoba logout.');
        }
    };
    
}); // Tutup document.addEventListener('DOMContentLoaded')