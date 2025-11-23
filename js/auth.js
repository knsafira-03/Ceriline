
const BASE_BACKEND_URL = 'https://ceriline-auth-123.vercel.app';


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
                identifier: email, // MAPPING: 'email' frontend ke 'identifier' backend
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

    // LOGIKA UNTUK LOGOUT
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

    // LOGIKA UNTUK VERIFIKASI SESI (PROTECTED ROUTE)
    const verifySession = async () => {
        const protectedUrl = `${BASE_BACKEND_URL}/api/protected`;

        try {
            const response = await fetch(protectedUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' 
            });

            const data = await response.json();

            if (response.ok) { 
                console.log('Sesi Aktif:', data.message);
                return true; 
            } else if (response.status === 401) {
                console.warn('Sesi Tidak Valid, Mengarahkan ke Halaman Login.');
                window.location.href = 'login.html';
                return false;
            } else {
                console.error('Verifikasi Gagal:', data.error);
                return false;
            }

        } catch (error) {
            console.error('Kesalahan Jaringan Saat Verifikasi Sesi:', error);
            return false;
        }
    };

    // Panggil verifySession jika kita berada di index.html (asumsi ini halaman protected)
    if (window.location.pathname.includes('index.html')) {
        verifySession(); // Panggil langsung, karena kita sudah berada di dalam DOMContentLoaded
    }
    
});