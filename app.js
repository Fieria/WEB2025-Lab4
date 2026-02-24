// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================

// Элементы DOM
const currentLocationSection = document.getElementById('currentLocation');
const currentLoader = document.getElementById('currentLoader');
const currentWeatherCards = document.getElementById('currentWeatherCards');
const currentError = document.getElementById('currentError');
const cityModal = document.getElementById('cityModal');
const modalClose = document.getElementById('modalClose');
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const cityDropdown = document.getElementById('cityDropdown');
const dropdownList = document.getElementById('dropdownList');
const searchError = document.getElementById('searchError');
const additionalCities = document.getElementById('additionalCities');
const citiesList = document.getElementById('citiesList');
const refreshButton = document.getElementById('refreshButton');
const addCityButton = document.getElementById('addCityButton');
const citiesButtons = document.getElementById('citiesButtons');
const okButton = document.getElementById('okButton');
const weatherContainer = document.getElementById('weatherContainer');
const weatherToday = document.getElementById('weatherToday');
const weatherTomorrow = document.getElementById('weatherTomorrow');
const weatherDayAfter = document.getElementById('weatherDayAfter');

// Состояние приложения
let currentLocationWeather = null;
let additionalCitiesList = [];
let geolocationDenied = false;
let searchTimeout = null;
let selectedCity = null;
let currentSelectedCity = null; // Текущий выбранный город для отображения погоды

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

/**
 * Инициализация приложения при загрузке страницы
 */
function init() {
    loadCitiesFromStorage();
    requestGeolocation();
    setupEventListeners();
}

// ============================================
// ГЕОЛОКАЦИЯ
// ============================================

/**
 * Запрос геолокации пользователя
 */
function requestGeolocation() {
    if (!navigator.geolocation) {
        showGeolocationError('Геолокация не поддерживается вашим браузером');
        showCitySearchForm();
        return;
    }

    showLoader(currentLoader);
    navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError,
        { timeout: 10000, enableHighAccuracy: true }
    );
}

/**
 * Обработка успешного получения геолокации
 * @param {GeolocationPosition} position - Позиция пользователя
 */
async function handleGeolocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    
    currentSelectedCity = { name: 'Текущее местоположение', lat: latitude, lon: longitude };
    
    // Показываем лоадер
    showLoader(currentLoader);
    
    // Скрываем контейнер погоды
    if (weatherContainer) {
        weatherContainer.style.display = 'none';
    }
    
    // Скрываем ошибку
    if (currentError) {
        currentError.style.display = 'none';
    }
    
    try {
        // Загружаем прогноз для текущего местоположения
        const forecasts = await fetchWeatherForecast(latitude, longitude, 'Текущее местоположение');
        renderWeatherCards(forecasts, 'Текущее местоположение');
        currentLocationWeather = forecasts;
    } catch (error) {
        console.error('Ошибка при загрузке погоды для текущего местоположения:', error);
        hideLoader(currentLoader);
        showGeolocationError('Не удалось загрузить прогноз погоды для вашего местоположения.');
    }
}

/**
 * Обработка ошибки геолокации
 * @param {GeolocationPositionError} error - Ошибка геолокации
 */
function handleGeolocationError(error) {
    geolocationDenied = true;
    hideLoader(currentLoader);
    
    let errorMessage = 'Не удалось определить ваше местоположение. ';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage += 'Разрешение на геолокацию отклонено.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage += 'Информация о местоположении недоступна.';
            break;
        case error.TIMEOUT:
            errorMessage += 'Превышено время ожидания запроса.';
            break;
        default:
            errorMessage += 'Произошла неизвестная ошибка.';
    }
    
    showGeolocationError(errorMessage);
    showCitySearchForm();
}

/**
 * Показать ошибку геолокации
 * @param {string} message - Текст ошибки
 */
function showGeolocationError(message) {
    currentError.textContent = message;
    currentError.style.display = 'block';
}

/**
 * Показать модальное окно для добавления города
 */
function showCitySearchForm() {
    if (cityModal) {
        cityModal.style.display = 'flex';
        // Фокус на поле ввода после небольшой задержки для анимации
        setTimeout(() => {
            if (cityInput) {
                cityInput.focus();
            }
        }, 100);
    }
}

/**
 * Скрыть модальное окно для добавления города
 */
function hideCitySearchForm() {
    if (cityModal) {
        cityModal.style.display = 'none';
        if (cityInput) {
            cityInput.value = '';
        }
        hideDropdown();
        hideSearchError();
    }
}

// ============================================
// РАБОТА С API ПОГОДЫ
// ============================================

/**
 * Получение данных о погоде
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @param {string} cityName - Название города (опционально)
 * @returns {Promise<Object>} - Данные о погоде
 */
async function fetchWeather(lat, lon, cityName = null) {
    // TODO: Реализация запроса к API погоды
    // TODO: Обработка ошибок сети
    // TODO: Парсинг ответа и возврат данных
    console.log('fetchWeather вызвана:', { lat, lon, cityName });
    return null;
}

/**
 * Получение прогноза погоды на несколько дней
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @param {string} cityName - Название города (опционально)
 * @returns {Promise<Array>} - Массив прогнозов на 3 дня
 */
async function fetchWeatherForecast(lat, lon, cityName = null) {
    try {
        // Используем Open-Meteo API (бесплатный, не требует ключа)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&timezone=auto&forecast_days=3`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.daily || !data.daily.time) {
            throw new Error('Неверный формат данных от API');
        }

        // Формируем массив прогнозов на 3 дня
        const forecasts = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date(data.daily.time[i]);
            const weatherCode = data.daily.weathercode[i];
            
            forecasts.push({
                date: date,
                dateString: formatDate(date),
                tempMax: Math.round(data.daily.temperature_2m_max[i]),
                tempMin: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: weatherCode,
                description: getWeatherDescription(weatherCode),
                windSpeed: Math.round(data.daily.windspeed_10m_max[i] || 0),
                cityName: cityName || 'Неизвестный город'
            });
        }

        return forecasts;
    } catch (error) {
        console.error('Ошибка при получении прогноза погоды:', error);
        throw error;
    }
}

/**
 * Получение описания погоды по коду
 * @param {number} code - Код погоды WMO
 * @returns {string} - Описание погоды
 */
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Ясно',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Изморозь',
        51: 'Легкая морось',
        53: 'Умеренная морось',
        55: 'Сильная морось',
        56: 'Легкая ледяная морось',
        57: 'Сильная ледяная морось',
        61: 'Небольшой дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        66: 'Легкий ледяной дождь',
        67: 'Сильный ледяной дождь',
        71: 'Небольшой снег',
        73: 'Умеренный снег',
        75: 'Сильный снег',
        77: 'Снежные зерна',
        80: 'Небольшой ливень',
        81: 'Умеренный ливень',
        82: 'Сильный ливень',
        85: 'Небольшой снегопад',
        86: 'Сильный снегопад',
        95: 'Гроза',
        96: 'Гроза с градом',
        99: 'Сильная гроза с градом'
    };
    return weatherCodes[code] || 'Неизвестно';
}

/**
 * Форматирование даты
 * @param {Date} date - Дата
 * @returns {string} - Отформатированная дата
 */
function formatDate(date) {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    if (date.toDateString() === new Date().toDateString()) {
        return 'Сегодня';
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Завтра';
    }
    
    return `${dayName}, ${day} ${month}`;
}

// ============================================
// РАБОТА С DOM
// ============================================

/**
 * Отображение карточек погоды
 * @param {Array} forecasts - Массив прогнозов (сегодня + 2 дня)
 * @param {string} cityName - Название города
 */
function renderWeatherCards(forecasts, cityName) {
    if (!forecasts || forecasts.length !== 3) {
        console.error('Неверный формат данных прогноза');
        return;
    }

    if (!weatherToday || !weatherTomorrow || !weatherDayAfter) {
        console.error('Элементы контейнера погоды не найдены');
        return;
    }

    // Скрываем ошибку, если она была
    if (currentError) {
        currentError.style.display = 'none';
    }

    // Скрываем лоадер
    hideLoader(currentLoader);

    // Показываем контейнер погоды
    if (weatherContainer) {
        weatherContainer.style.display = 'block';
    }

    // Отображаем данные для каждого дня
    renderWeatherDay(weatherToday, forecasts[0], cityName);
    renderWeatherDay(weatherTomorrow, forecasts[1], cityName);
    renderWeatherDay(weatherDayAfter, forecasts[2], cityName);
}

/**
 * Отображение данных одного дня
 * @param {HTMLElement} container - Контейнер для дня
 * @param {Object} forecast - Данные прогноза
 * @param {string} cityName - Название города
 */
function renderWeatherDay(container, forecast, cityName) {
    if (!container || !forecast) return;

    container.innerHTML = `
        <div class="weather-day__header">
            <div class="weather-day__city">${cityName}</div>
            <div class="weather-day__date">${forecast.dateString}</div>
        </div>
        <div class="weather-day__temp">${forecast.tempMax}°</div>
        <div class="weather-day__description">${forecast.description}</div>
        <div class="weather-day__details">
            <div class="weather-day__detail-item">
                <span>Мин. температура:</span>
                <span>${forecast.tempMin}°</span>
            </div>
            <div class="weather-day__detail-item">
                <span>Макс. температура:</span>
                <span>${forecast.tempMax}°</span>
            </div>
            <div class="weather-day__detail-item">
                <span>Скорость ветра:</span>
                <span>${forecast.windSpeed} км/ч</span>
            </div>
        </div>
    `;
}

/**
 * Показать лоадер
 * @param {HTMLElement} loaderElement - Элемент лоадера
 */
function showLoader(loaderElement) {
    if (loaderElement) {
        loaderElement.style.display = 'flex';
    }
}

/**
 * Скрыть лоадер
 * @param {HTMLElement} loaderElement - Элемент лоадера
 */
function hideLoader(loaderElement) {
    if (loaderElement) {
        loaderElement.style.display = 'none';
    }
}

/**
 * Показать ошибку в форме поиска
 * @param {string} message - Текст ошибки
 */
function showSearchError(message) {
    searchError.textContent = message;
    searchError.style.display = 'block';
    cityInput.classList.add('error');
}

/**
 * Скрыть ошибку в форме поиска
 */
function hideSearchError() {
    searchError.style.display = 'none';
    cityInput.classList.remove('error');
}

// ============================================
// ПОИСК ГОРОДОВ
// ============================================

/**
 * Поиск городов по введенному тексту
 * @param {string} query - Поисковый запрос
 * @returns {Promise<Array>} - Массив найденных городов
 */
async function searchCities(query) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        // Используем Open-Meteo Geocoding API (бесплатный, без API ключа)
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ru&format=json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ошибка при поиске городов');
        }

        const data = await response.json();
        
        // Проверяем, есть ли результаты
        if (!data.results || data.results.length === 0) {
            return [];
        }
        
        return data.results.map(city => ({
            name: `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}${city.country ? ', ' + city.country : ''}`,
            cityName: city.name,
            lat: city.latitude,
            lon: city.longitude,
            country: city.country || ''
        }));
    } catch (error) {
        console.error('Ошибка поиска городов:', error);
        // В случае ошибки возвращаем захардкоженный список
        return getHardcodedCities(query);
    }
}

/**
 * Захардкоженный список городов для демонстрации (если API недоступен)
 * @param {string} query - Поисковый запрос
 * @returns {Array} - Массив найденных городов
 */
function getHardcodedCities(query) {
    const cities = [
        { name: 'Москва, RU', cityName: 'Москва', lat: 55.7558, lon: 37.6173, country: 'RU' },
        { name: 'Санкт-Петербург, RU', cityName: 'Санкт-Петербург', lat: 59.9343, lon: 30.3351, country: 'RU' },
        { name: 'Новосибирск, RU', cityName: 'Новосибирск', lat: 55.0084, lon: 82.9357, country: 'RU' },
        { name: 'Екатеринбург, RU', cityName: 'Екатеринбург', lat: 56.8431, lon: 60.6454, country: 'RU' },
        { name: 'Казань, RU', cityName: 'Казань', lat: 55.8304, lon: 49.0661, country: 'RU' },
        { name: 'London, GB', cityName: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
        { name: 'New York, US', cityName: 'New York', lat: 40.7128, lon: -74.0060, country: 'US' },
        { name: 'Paris, FR', cityName: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR' },
        { name: 'Tokyo, JP', cityName: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP' },
        { name: 'Berlin, DE', cityName: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'DE' }
    ];

    const queryLower = query.toLowerCase();
    return cities.filter(city => 
        city.name.toLowerCase().includes(queryLower) ||
        city.cityName.toLowerCase().includes(queryLower)
    ).slice(0, 5);
}

/**
 * Отображение выпадающего списка городов
 * @param {Array} cities - Массив найденных городов
 */
function renderDropdown(cities) {
    if (!dropdownList || !cityDropdown) return;

    dropdownList.innerHTML = '';

    if (cities.length === 0) {
        hideDropdown();
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'dropdown__item';
        li.textContent = city.name;
        li.addEventListener('click', () => {
            selectCity(city);
        });
        dropdownList.appendChild(li);
    });

    cityDropdown.style.display = 'block';
}

/**
 * Выбор города из выпадающего списка
 * @param {Object} city - Объект города
 */
function selectCity(city) {
    selectedCity = city;
    cityInput.value = city.name;
    hideDropdown();
    hideSearchError();
}

/**
 * Скрыть выпадающий список
 */
function hideDropdown() {
    cityDropdown.style.display = 'none';
}

// ============================================
// РАБОТА С LOCALSTORAGE
// ============================================

/**
 * Сохранение списка городов в localStorage
 */
function saveCitiesToStorage() {
    try {
        localStorage.setItem('additionalCities', JSON.stringify(additionalCitiesList));
        console.log('Города сохранены в localStorage');
    } catch (error) {
        console.error('Ошибка при сохранении городов в localStorage:', error);
    }
}

/**
 * Загрузка списка городов из localStorage
 */
function loadCitiesFromStorage() {
    try {
        const savedCities = localStorage.getItem('additionalCities');
        if (savedCities) {
            additionalCitiesList = JSON.parse(savedCities);
            
            // Восстановление кнопок городов
            additionalCitiesList.forEach(city => {
                createCityButton(city.name, city.lat, city.lon);
            });
            
            // TODO: Загрузка погоды для сохраненных городов
            console.log('Города загружены из localStorage:', additionalCitiesList);
        }
    } catch (error) {
        console.error('Ошибка при загрузке городов из localStorage:', error);
        additionalCitiesList = [];
    }
}

/**
 * Добавление города в список
 * @param {string} cityName - Название города
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
async function addCity(cityName, lat, lon) {
    // Проверка на дубликаты
    const cityExists = additionalCitiesList.some(city => 
        city.name.toLowerCase() === cityName.toLowerCase()
    );

    if (cityExists) {
        showSearchError('Этот город уже добавлен');
        return;
    }

    // Добавление города в список
    const cityData = {
        name: cityName,
        lat: lat,
        lon: lon
    };

    additionalCitiesList.push(cityData);

    // Создание кнопки города
    createCityButton(cityName, lat, lon);

    // Сохранение в localStorage
    saveCitiesToStorage();

    // Автоматически загружаем и отображаем погоду для добавленного города
    await loadWeatherForCity(cityName, lat, lon);
    
    console.log('Город добавлен:', { cityName, lat, lon });
}

/**
 * Создание кнопки города в контейнере
 * @param {string} cityName - Название города
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
function createCityButton(cityName, lat, lon) {
    if (!citiesButtons) return;

    const button = document.createElement('button');
    button.className = 'city-button';
    button.dataset.cityName = cityName;
    button.dataset.lat = lat;
    button.dataset.lon = lon;

    // Создаем контейнер для содержимого кнопки
    const buttonContent = document.createElement('span');
    buttonContent.className = 'city-button__text';
    buttonContent.textContent = cityName;

    // Создаем кнопку удаления
    const removeButton = document.createElement('button');
    removeButton.className = 'city-button__remove';
    removeButton.innerHTML = '×';
    removeButton.setAttribute('aria-label', 'Удалить город');
    
    // Обработчик клика на кнопку удаления (останавливаем всплытие события)
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем срабатывание клика на родительской кнопке
        removeCity(cityName);
    });

    // Добавляем содержимое в кнопку
    button.appendChild(buttonContent);
    button.appendChild(removeButton);

    // Обработчик клика на кнопку города
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.city-button').forEach(btn => {
            btn.classList.remove('city-button--active');
        });
        
        // Добавляем активный класс текущей кнопке
        button.classList.add('city-button--active');
        
        // Загрузить и отобразить погоду для выбранного города
        loadWeatherForCity(cityName, lat, lon);
    });

    // Добавляем кнопку в контейнер
    citiesButtons.appendChild(button);
}

/**
 * Загрузка погоды для выбранного города
 * @param {string} cityName - Название города
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
async function loadWeatherForCity(cityName, lat, lon) {
    currentSelectedCity = { name: cityName, lat, lon };
    
    // Показываем лоадер
    showLoader(currentLoader);
    
    // Скрываем контейнер погоды
    if (weatherContainer) {
        weatherContainer.style.display = 'none';
    }
    
    // Скрываем ошибку
    if (currentError) {
        currentError.style.display = 'none';
    }

    try {
        // Загружаем прогноз на 3 дня
        const forecasts = await fetchWeatherForecast(lat, lon, cityName);
        
        // Отображаем данные
        renderWeatherCards(forecasts, cityName);
        
        console.log('Погода загружена для города:', cityName);
    } catch (error) {
        console.error('Ошибка при загрузке погоды:', error);
        
        // Скрываем лоадер
        hideLoader(currentLoader);
        
        // Показываем ошибку
        if (currentError) {
            currentError.textContent = `Не удалось загрузить прогноз погоды для ${cityName}. Попробуйте обновить данные.`;
            currentError.style.display = 'block';
        }
    }
}

/**
 * Удаление города из списка
 * @param {string} cityName - Название города
 */
function removeCity(cityName) {
    // Удаляем город из списка
    additionalCitiesList = additionalCitiesList.filter(city => 
        city.name.toLowerCase() !== cityName.toLowerCase()
    );

    // Обновляем localStorage
    saveCitiesToStorage();

    // Удаляем кнопку города из DOM
    const cityButton = document.querySelector(`.city-button[data-city-name="${cityName}"]`);
    if (cityButton) {
        cityButton.remove();
    }

    // Если удаляемый город был активным, очищаем контейнер погоды
    if (currentSelectedCity && currentSelectedCity.name === cityName) {
        currentSelectedCity = null;
        if (weatherContainer) {
            weatherContainer.style.display = 'none';
            weatherContainer.innerHTML = '';
        }
        // Убираем активный класс со всех кнопок
        document.querySelectorAll('.city-button').forEach(btn => {
            btn.classList.remove('city-button--active');
        });
    }

    console.log('Город удален:', cityName);
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

/**
 * Настройка всех обработчиков событий
 */
function setupEventListeners() {
    // Обработчик кнопки "Добавить город"
    if (addCityButton) {
        addCityButton.addEventListener('click', handleAddCityButtonClick);
    }
    
    // Обработчик кнопки закрытия модального окна
    if (modalClose) {
        modalClose.addEventListener('click', hideCitySearchForm);
    }
    
    // Обработчик клика на overlay для закрытия модального окна
    if (cityModal) {
        cityModal.addEventListener('click', (event) => {
            if (event.target === cityModal) {
                hideCitySearchForm();
            }
        });
    }
    
    // Обработчик формы поиска
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }
    
    // Обработчик кнопки OK
    if (okButton) {
        okButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleFormSubmit(event);
        });
    }
    
    // Обработчик ввода в поле поиска
    if (cityInput) {
        cityInput.addEventListener('input', handleCityInput);
        // Закрытие по Escape
        cityInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideCitySearchForm();
            }
        });
    }
    
    // Обработчик клика вне выпадающего списка
    document.addEventListener('click', handleDocumentClick);
    
    // Обработчик кнопки обновления
    if (refreshButton) {
        refreshButton.addEventListener('click', handleRefresh);
    }
}

/**
 * Обработка клика на кнопку "Добавить город"
 */
function handleAddCityButtonClick() {
    if (cityModal && cityModal.style.display === 'none') {
        showCitySearchForm();
    } else {
        hideCitySearchForm();
    }
}

/**
 * Обработка отправки формы поиска
 * @param {Event} event - Событие формы (опционально)
 */
async function handleFormSubmit(event) {
    if (event) {
        event.preventDefault();
    }
    
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showSearchError('Введите название города');
        return;
    }

    // Если город был выбран из выпадающего списка
    if (selectedCity) {
        await addCity(selectedCity.cityName, selectedCity.lat, selectedCity.lon);
        hideCitySearchForm();
        return;
    }

    // Если город введен вручную, ищем его
    const cities = await searchCities(cityName);
    
    if (cities.length === 0) {
        showSearchError('Город не найден. Пожалуйста, выберите город из списка подсказок.');
        return;
    }

    // Если найден один город или точное совпадение
    const exactMatch = cities.find(city => 
        city.name.toLowerCase() === cityName.toLowerCase() ||
        city.cityName.toLowerCase() === cityName.toLowerCase()
    );

    if (exactMatch) {
        await addCity(exactMatch.cityName, exactMatch.lat, exactMatch.lon);
        hideCitySearchForm();
    } else if (cities.length === 1) {
        // Если найден только один город, добавляем его
        await addCity(cities[0].cityName, cities[0].lat, cities[0].lon);
        hideCitySearchForm();
    } else {
        // Если найдено несколько городов, показываем список
        showSearchError('Найдено несколько городов. Пожалуйста, выберите город из списка подсказок.');
        renderDropdown(cities);
    }
}

/**
 * Обработка ввода в поле поиска
 * @param {Event} event - Событие ввода
 */
async function handleCityInput(event) {
    const query = event.target.value.trim();
    selectedCity = null;
    hideSearchError();

    // Очищаем предыдущий таймер
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
        hideDropdown();
        return;
    }

    // Дебаунс - ждем 300ms после последнего ввода
    searchTimeout = setTimeout(async () => {
        const cities = await searchCities(query);
        renderDropdown(cities);
    }, 300);
}

/**
 * Обработка клика вне выпадающего списка
 * @param {Event} event - Событие клика
 */
function handleDocumentClick(event) {
    if (!cityInput || !cityDropdown) return;
    
    const target = event.target;
    
    // Не скрываем, если клик внутри модального окна
    if (cityModal && cityModal.contains(target)) {
        return;
    }
    
    // Не скрываем, если клик на кнопку "Добавить город"
    if (addCityButton && addCityButton.contains(target)) {
        return;
    }
    
    hideDropdown();
}

/**
 * Обработка кнопки обновления
 */
async function handleRefresh() {
    // Скрываем ошибки
    if (currentError) {
        currentError.style.display = 'none';
    }

    // Если выбран город из списка, обновляем его погоду
    if (currentSelectedCity) {
        showLoader(currentLoader);
        if (weatherContainer) {
            weatherContainer.style.display = 'none';
        }

        try {
            const forecasts = await fetchWeatherForecast(
                currentSelectedCity.lat, 
                currentSelectedCity.lon, 
                currentSelectedCity.name
            );
            renderWeatherCards(forecasts, currentSelectedCity.name);
            console.log('Данные обновлены для:', currentSelectedCity.name);
        } catch (error) {
            console.error('Ошибка при обновлении погоды:', error);
            hideLoader(currentLoader);
            if (currentError) {
                currentError.textContent = 'Не удалось обновить данные. Попробуйте позже.';
                currentError.style.display = 'block';
            }
        }
    } else {
        // Если нет выбранного города, пытаемся получить геолокацию
        if (navigator.geolocation) {
            showLoader(currentLoader);
            navigator.geolocation.getCurrentPosition(
                handleGeolocationSuccess,
                (error) => {
                    hideLoader(currentLoader);
                    if (currentError) {
                        currentError.textContent = 'Не удалось определить местоположение для обновления.';
                        currentError.style.display = 'block';
                    }
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            if (currentError) {
                currentError.textContent = 'Геолокация не поддерживается. Выберите город из списка.';
                currentError.style.display = 'block';
            }
        }
    }
}

// ============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

