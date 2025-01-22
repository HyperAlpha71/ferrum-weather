// Hava durumu sembollerini döndüren yardımcı fonksiyon
function getWeatherSymbol(weatherCode) {
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

    var weatherSymbol = '';
    if (weatherCode in weatherSymbols) {
        weatherSymbol = weatherSymbols[weatherCode];
    } else {
        weatherSymbol = { emoji: weatherCode, description: '' };
    }
    return weatherSymbol;
}

function koordinatBul() {
    var yerAdi = document.getElementById('yerAdi').value;

    var loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.classList.add('show');
    loadingMessage.style.display = 'block';
    document.body.classList.add('loading'); // Add loading class to body

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${yerAdi}`)
        .then(response => response.json())
        .then(data => {
            var latitude = parseFloat(data[0].lat);
            var longitude = parseFloat(data[0].lon);
            havaDurumuGetir(latitude, longitude);
        })
        .catch(error => {
            console.error('Koordinat bilgisi alınamadı:', error);
            document.getElementById('sonuclar').innerHTML = '<p class="koordinatlar">Koordinat bilgisi alınamadı.</p>';
        })
        .finally(() => {
            loadingMessage.classList.remove('show');
            loadingMessage.style.display = 'none';
            document.body.classList.remove('loading'); // Remove loading class from body
        });
}

document.getElementById('yerAdi').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
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
            console.log(data); // Log the fetched data for debugging
            var currentData = data.current;
            var hourlyData = data.hourly;
            console.log(hourlyData); // Log the hourly data for debugging
            if (!hourlyData || hourlyData.length === 0) {
                console.error('No hourly data available.');
                return; // Exit if no hourly data
            }

            var anlikVerilerDiv = document.getElementById('anlikVerilerDiv');
            anlikVerilerDiv.innerHTML = `<p class="koordinatlar">Koordinatlar: Enlem ${latitude}, Boylam ${longitude}</p>`;

            anlikVerilerDiv.innerHTML += `<div class="anlik-veriler-icerik">`;

            if (currentData && currentData.temperature_2m !== undefined && currentData.wind_speed_10m !== undefined) {
                anlikVerilerDiv.innerHTML += `<p>Sıcaklık: ${currentData.temperature_2m} °C</p>`;
                anlikVerilerDiv.innerHTML += `<p>Rüzgar Hızı: ${currentData.wind_speed_10m} km/sa.</p>`;
                anlikVerilerDiv.innerHTML += `<p>Nem: %${currentData.relative_humidity_2m}</p>`;
                anlikVerilerDiv.innerHTML += `
                    <div class="weather-condition">
                        <span class="weather-emoji">${getWeatherSymbol(currentData.weather_code).emoji}</span>
                        <span class="weather-description">${getWeatherSymbol(currentData.weather_code).description}</span>
                    </div>`;
            } else {
                anlikVerilerDiv.innerHTML += '<p>Anlık hava durumu bilgisi bulunamadı.</p>';
            }

            anlikVerilerDiv.innerHTML += `</div>`;

            anlikVerilerDiv.style.display = 'block';

            // Clear existing hourly data
            var containerDiv = document.querySelector('.container');
            var existingHourlyDiv = document.querySelector('.saatlik-veriler-kutusu');
            if (existingHourlyDiv) {
                containerDiv.removeChild(existingHourlyDiv);
            }

            // Create new hourly data container
            var saatlikVerilerDiv = document.createElement('div');
            saatlikVerilerDiv.classList.add('saatlik-veriler-kutusu');

            saatlikVerilerDiv.innerHTML += `<div class="hourly-scroll-container">`;

            for (let i = 0; i < hourlyData.time.length; i++) {
                (function(i) {
                    var timestamp = new Date(hourlyData.time[i]);
                    var formattedHour = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format hour

                    // Add a fade-in effect for each hourly data box
                    setTimeout(() => {
                        var hourlyDataDiv = document.createElement('div');
                        hourlyDataDiv.classList.add('hourly-data');
                        hourlyDataDiv.onclick = function() { showHourlyDetails(i); };
                        hourlyDataDiv.innerHTML = `
                            <span>${formattedHour}</span>
                            <span>${hourlyData.temperature_2m[i]} °C</span>
                            <span>%${hourlyData.relative_humidity_2m[i]}</span>
                            <span>${hourlyData.wind_speed_10m[i]} km/sa</span>
                            <span>${getWeatherSymbol(hourlyData.weather_code[i]).emoji}</span>
                        `;
                        saatlikVerilerDiv.appendChild(hourlyDataDiv);
                        // Trigger fade-in effect
                        setTimeout(() => {
                            hourlyDataDiv.style.opacity = 1; // Set opacity to 1 for fade-in
                        }, 10);
                    }, i * 300); // 300ms delay for each box
                })(i);
            }

            saatlikVerilerDiv.innerHTML += `</div>`; // Close hourly-scroll-container

            containerDiv.appendChild(saatlikVerilerDiv);

            updateBackground(currentData.weather_code);
        })
        .catch(error => {
            console.error('Hava durumu bilgisi alınamadı:', error);
            var sonuclarDiv = document.getElementById('anlik-veriler-kutusu');
            sonuclarDiv.innerHTML = '<p class="koordinatlar">Hava durumu bilgisi bulunamadı.</p>';
            sonuclarDiv.style.display = 'block';
        });
}

// New function to fetch user information based on IP
function fetchUserInfo() {
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('userIp').innerText = data.query;
            document.getElementById('userCity').innerText = data.city;
            document.getElementById('userCountry').innerText = data.country;
            document.getElementById('userIsp').innerText = data.isp;
            document.getElementById('userLat').innerText = data.lat;
            document.getElementById('userLon').innerText = data.lon;
        })
        .catch(error => {
            console.error('Kullanıcı bilgileri alınamadı:', error);
        });
}

// Call fetchUserInfo when the page loads
window.onload = function() {
    fetchUserInfo();
};
