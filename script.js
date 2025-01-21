// Hava durumu sembollerini döndüren yardımcı fonksiyon
function getWeatherSymbol(weatherCode) {
    // Hava durumu kodlarını sembollerle ve açıklamalarıyla eşleştiren bir nesne
    var weatherSymbols = {
        0: { emoji: '☀️', description: 'Açık Hava' },
        1: { emoji: '🌤️', description: 'Çoğunlukla Açık' },
        2: { emoji: '⛅️', description: 'Parçalı Bulutlu' },
        3: { emoji: '☁️', description: 'Kapalı' },
        45: { emoji: '🌫️', description: 'Sis' },
        48: { emoji: '🌫️', description: 'Kırağı Sisinin Birikmesi' },
        51: { emoji: '🌧️', description: 'Hafif Çiseleme' },
        53: { emoji: '🌧️', description: 'Orta Yoğunlukta Çiseleme' },
        55: { emoji: '🌧️', description: 'Yoğun Çiseleme' },
        56: { emoji: '🌧️❄️', description: 'Hafif Dondurucu Çiseleme' },
        57: { emoji: '🌧️❄️', description: 'Yoğun Dondurucu Çiseleme' },
        61: { emoji: '🌧️', description: 'Hafif Yağmur' },
        63: { emoji: '🌧️', description: 'Orta Yoğunlukta Yağmur' },
        65: { emoji: '🌧️', description: 'Şiddetli Yağmur' },
        66: { emoji: '🌧️❄️', description: 'Hafif Dondurucu Yağmur' },
        67: { emoji: '🌧️❄️', description: 'Şiddetli Dondurucu Yağmur' },
        71: { emoji: '🌨️', description: 'Hafif Kar Yağışı' },
        73: { emoji: '🌨️', description: 'Orta Yoğunlukta Kar Yağışı' },
        75: { emoji: '🌨️', description: 'Şiddetli Kar Yağışı' },
        77: { emoji: '❄️', description: 'Kar Taneleri' },
        80: { emoji: '🌦️', description: 'Hafif Yağmur Sağanakları' },
        81: { emoji: '🌦️', description: 'Orta Yoğunlukta Yağmur Sağanakları' },
        82: { emoji: '🌦️', description: 'Şiddetli Yağmur Sağanakları' },
        85: { emoji: '🌨️', description: 'Hafif Kar Yağışı' },
        86: { emoji: '🌨️', description: 'Kuvvetli Kar Yağışı' },
        95: { emoji: '🌩️', description: 'Fırtına' },
        96: { emoji: '🌩️❄️', description: 'Hafif Dolu ve Gök Gürültülü Sağanak Yağış' },
        99: { emoji: '🌩️❄️', description: 'Şiddetli Dolu ve Gök Gürültülü Sağanak Yağış' }
    };

    // Hava durumu sembolünü oluştur
    var weatherSymbol = '';
    if (weatherCode in weatherSymbols) {
        weatherSymbol = `${weatherSymbols[weatherCode].emoji} > ${weatherSymbols[weatherCode].description}`;
        // Arka planı güncellemek için fonksiyonu burada çağırabiliriz
        updateBackground(weatherCode);
    } else {
        weatherSymbol = weatherCode;
    }
    return weatherSymbol;
}

// Arka plan rengini güncelleyen fonksiyon
function updateBackground(weatherCode) {
    var body = document.querySelector("body");
    var newBackgroundColor;

    // Hava durumuna göre arka plan rengini belirle
    switch (weatherCode) {
        case 0:
        case 1:
            newBackgroundColor = "linear-gradient(to right, #66BBDD, #73B6D1)";
            break;
        case 2:
            newBackgroundColor = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;
        case 3:
            newBackgroundColor = "linear-gradient(to right, #4b6cb7, #182848)";
            break;
        case 45:
        case 48:
            newBackgroundColor = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            newBackgroundColor = "linear-gradient(to right, #4b6cb7, #182848)";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
            newBackgroundColor = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;
        case 80:
        case 81:
        case 82:
            newBackgroundColor = "linear-gradient(to right, #4b6cb7, #182848)";
            break;
        case 85:
        case 86:
            newBackgroundColor = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;
        case 95:
        case 96:
        case 99:
            newBackgroundColor = "linear-gradient(to right, #4b6cb7, #182848)";
            break;
        default:
            newBackgroundColor = "linear-gradient(to right, #3494e6, #ec6ead)";
            break;
    }

    // Yeni arka plan rengini uygula ve geçiş efektini etkinleştir
    body.style.transition = "background 1s ease"; // Geçiş süresi artırıldı
    body.style.background = newBackgroundColor;
}

// Koordinatları bul
function koordinatBul() {
    var yerAdi = document.getElementById('yerAdi').value;

    // Show loading message
    var loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.classList.add('show');
    loadingMessage.style.display = 'block';

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${yerAdi}`)
        .then(response => response.json())
        .then(data => {
            var latitude = parseFloat(data[0].lat);  // Convert to number
            var longitude = parseFloat(data[0].lon);  // Convert to number

            console.log('Koordinatlar:', latitude, longitude); // Log coordinates

            // Call the havaDurumuGetir function with the retrieved coordinates
            havaDurumuGetir(latitude, longitude);
        })
        .catch(error => {
            console.error('Koordinat bilgisi alınamadı:', error);
            document.getElementById('sonuclar').innerHTML = '<p class="koordinatlar">Koordinat bilgisi alınamadı.</p>';
        })
        .finally(() => {
            // Hide loading message after fetching data
            loadingMessage.classList.remove('show');
            loadingMessage.style.display = 'none';
        });
}

// Enter tuşuna basıldığında koordinatBul fonksiyonunu çağıran event listener ekle
document.getElementById('yerAdi').addEventListener('keypress', function(event) {
    // Eğer kullanıcı enter tuşuna bastıysa
    if (event.key === 'Enter') {
        // Koordinatları bul
        koordinatBul();
    }
});

function havaDurumuGetir(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Hava durumu bilgisi alınamadı. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var currentData = data.current;
            var hourlyData = data.hourly;

            var anlikVerilerDiv = document.getElementById('anlikVerilerDiv');
            anlikVerilerDiv.innerHTML = `<p class="koordinatlar">Koordinatlar: Enlem ${latitude}, Boylam ${longitude}</p>`;

            // Anlık veriler
            anlikVerilerDiv.innerHTML += `<div class="anlik-veriler-icerik">`;

            if (currentData && currentData.temperature_2m !== undefined && currentData.wind_speed_10m !== undefined) {
                anlikVerilerDiv.innerHTML += `<p>Sıcaklık: ${currentData.temperature_2m} °C</p>`;
                anlikVerilerDiv.innerHTML += `<p>Rüzgar Hızı: ${currentData.wind_speed_10m} km/sa.</p>`;
                anlikVerilerDiv.innerHTML += `<p>Nem: %${currentData.relative_humidity_2m}</p>`;
                anlikVerilerDiv.innerHTML += `<p>Hava Durumu: ${getWeatherSymbol(currentData.weather_code)}</p>`;
                // Arka planı güncellemek için fonksiyonu burada çağırmaya gerek yok
            } else {
                anlikVerilerDiv.innerHTML += '<p>Anlık hava durumu bilgisi bulunamadı.</p>';
            }

            anlikVerilerDiv.innerHTML += `</div>`; // Anlık veriler div kapatma

            anlikVerilerDiv.style.display = 'block';

            // Saatlik veriler
            var saatlikVerilerDiv = document.createElement('div');
            saatlikVerilerDiv.classList.add('saatlik-veriler-kutusu');

            saatlikVerilerDiv.innerHTML += `<h2>Saatlik Veriler</h2>`;
            saatlikVerilerDiv.innerHTML += `<table class="kutu-container">
                                            <thead>
                                                <tr>
                                                    <th>Zaman</th>
                                                    <th>Sıcaklık (°C)</th>
                                                    <th>Nem (%)</th>
                                                    <th>Rüzgar Hızı (km/s)</th>
                                                    <th>Hava Durumu</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;

            for (var i = 0; i < hourlyData.time.length; i++) {
                var timestamp = new Date(hourlyData.time[i]);
                var formattedDate = ('0' + timestamp.getHours()).slice(-2) + ':' + ('0' + timestamp.getMinutes()).slice(-2);
                var formattedDateTime = `${timestamp.toLocaleDateString()} ${formattedDate}`; // Tarih ve saat birleştirildi

                saatlikVerilerDiv.innerHTML += `<tr>
                                                <td>🕑 | <b>${formattedDateTime}</b> |</td>
                                                <td>🌡 | <b>${hourlyData.temperature_2m[i]}</b> |</td>
                                                <td>💧 | <b>%${hourlyData.relative_humidity_2m[i]}</b> |</td>
                                                <td>💨 | <b>${hourlyData.wind_speed_10m[i]} km/sa.</b> |</td>
                                                <td>▶️ | <b>${getWeatherSymbol(hourlyData.weather_code[i])}</b> |</td>
                                            </tr>`;
            }

            saatlikVerilerDiv.innerHTML += `</tbody></table>`;

            // Saatlik veriler div'ini anlık veriler kutusunun dışına ekle
            var containerDiv = document.querySelector('.container');
            containerDiv.appendChild(saatlikVerilerDiv);

            // Arka plan rengini güncelle
            updateBackground(currentData.weather_code);
        })
        .catch(error => {
            console.error('Hava durumu bilgisi alınamadı:', error);
            var sonuclarDiv = document.getElementById('anlik-veriler-kutusu');
            sonuclarDiv.innerHTML = '<p class="koordinatlar">Hava durumu bilgisi alınamadı.</p>';
            sonuclarDiv.style.display = 'block';
        });
}
