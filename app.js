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

// Состояние приложения
let currentLocationWeather = null;
let additionalCitiesList = [];
let geolocationDenied = false;
let searchTimeout = null;
let selectedCity = null;

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
function handleGeolocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    // TODO: Вызов fetchWeather для текущего местоположения
    console.log('Геолокация получена:', latitude, longitude);
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
    // TODO: Реализация запроса прогноза на 3 дня
    console.log('fetchWeatherForecast вызвана:', { lat, lon, cityName });
    return [];
}

// ============================================
// РАБОТА С DOM
// ============================================

/**
 * Отображение карточек погоды
 * @param {Array} forecasts - Массив прогнозов (сегодня + 2 дня)
 * @param {string} cityName - Название города
 * @param {HTMLElement} container - Контейнер для карточек
 * @param {boolean} isRemovable - Можно ли удалить карточку
 */
function renderWeatherCards(forecasts, cityName, container, isRemovable = false) {
    // TODO: Создание HTML-структуры карточек
    // TODO: Отображение данных: температура, описание, детали
    console.log('renderWeatherCards вызвана:', { forecasts, cityName, container, isRemovable });
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
        // Используем OpenWeatherMap Geocoding API (бесплатный, требует API ключ)
        // Для демонстрации используем публичный API без ключа или можно использовать другой сервис
        const API_KEY = 'YOUR_API_KEY'; // Замените на свой API ключ от OpenWeatherMap
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ошибка при поиске городов');
        }

        const data = await response.json();
        
        return data.map(city => ({
            name: `${city.name}, ${city.country}`,
            cityName: city.name,
            lat: city.lat,
            lon: city.lon,
            country: city.country
        }));
    } catch (error) {
        console.error('Ошибка поиска городов:', error);
        // Для демонстрации возвращаем пустой массив или можно использовать захардкоженный список
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

    // Загрузка и отображение погоды
    // TODO: Реализовать загрузку погоды для города
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
    button.textContent = cityName;
    button.dataset.cityName = cityName;
    button.dataset.lat = lat;
    button.dataset.lon = lon;

    // Обработчик клика на кнопку города
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.city-button').forEach(btn => {
            btn.classList.remove('city-button--active');
        });
        
        // Добавляем активный класс текущей кнопке
        button.classList.add('city-button--active');
        
        // TODO: Загрузить и отобразить погоду для выбранного города
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
    // TODO: Реализовать загрузку погоды
    console.log('Загрузка погоды для города:', { cityName, lat, lon });
}

/**
 * Удаление города из списка
 * @param {string} cityName - Название города
 */
function removeCity(cityName) {
    // TODO: Удаление города из списка
    // TODO: Обновление localStorage
    // TODO: Удаление карточек из DOM
    console.log('removeCity вызвана:', cityName);
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
    // TODO: Обновление погоды для текущего местоположения
    // TODO: Обновление погоды для всех дополнительных городов
    // TODO: Показ состояния загрузки
    console.log('handleRefresh вызвана');
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

