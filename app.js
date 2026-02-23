// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================

// Элементы DOM
const currentLocationSection = document.getElementById('currentLocation');
const currentLoader = document.getElementById('currentLoader');
const currentWeatherCards = document.getElementById('currentWeatherCards');
const currentError = document.getElementById('currentError');
const citySearchSection = document.getElementById('citySearchSection');
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const cityDropdown = document.getElementById('cityDropdown');
const dropdownList = document.getElementById('dropdownList');
const searchError = document.getElementById('searchError');
const additionalCities = document.getElementById('additionalCities');
const citiesList = document.getElementById('citiesList');
const refreshButton = document.getElementById('refreshButton');

// Состояние приложения
let currentLocationWeather = null;
let additionalCitiesList = [];
let geolocationDenied = false;

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
 * Показать форму поиска города
 */
function showCitySearchForm() {
    citySearchSection.style.display = 'block';
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
    // TODO: Реализация поиска городов (через API геокодирования)
    // TODO: Возврат списка городов с координатами
    console.log('searchCities вызвана:', query);
    return [];
}

/**
 * Отображение выпадающего списка городов
 * @param {Array} cities - Массив найденных городов
 */
function renderDropdown(cities) {
    // TODO: Создание элементов списка
    // TODO: Обработка клика по элементу
    console.log('renderDropdown вызвана:', cities);
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
    // TODO: Сохранение additionalCitiesList в localStorage
    console.log('saveCitiesToStorage вызвана');
}

/**
 * Загрузка списка городов из localStorage
 */
function loadCitiesFromStorage() {
    // TODO: Загрузка данных из localStorage
    // TODO: Восстановление списка городов
    // TODO: Загрузка погоды для сохраненных городов
    console.log('loadCitiesFromStorage вызвана');
}

/**
 * Добавление города в список
 * @param {string} cityName - Название города
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
function addCity(cityName, lat, lon) {
    // TODO: Проверка на дубликаты
    // TODO: Добавление города в список
    // TODO: Сохранение в localStorage
    // TODO: Загрузка и отображение погоды
    console.log('addCity вызвана:', { cityName, lat, lon });
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
    // Обработчик формы поиска
    searchForm.addEventListener('submit', handleFormSubmit);
    
    // Обработчик ввода в поле поиска
    cityInput.addEventListener('input', handleCityInput);
    
    // Обработчик клика вне выпадающего списка
    document.addEventListener('click', handleDocumentClick);
    
    // Обработчик кнопки обновления
    refreshButton.addEventListener('click', handleRefresh);
}

/**
 * Обработка отправки формы поиска
 * @param {Event} event - Событие формы
 */
function handleFormSubmit(event) {
    event.preventDefault();
    // TODO: Валидация ввода
    // TODO: Поиск города
    // TODO: Добавление города
    console.log('handleFormSubmit вызвана');
}

/**
 * Обработка ввода в поле поиска
 * @param {Event} event - Событие ввода
 */
function handleCityInput(event) {
    const query = event.target.value.trim();
    // TODO: Дебаунс для поиска
    // TODO: Вызов searchCities и отображение результатов
    console.log('handleCityInput вызвана:', query);
}

/**
 * Обработка клика вне выпадающего списка
 * @param {Event} event - Событие клика
 */
function handleDocumentClick(event) {
    if (!cityInput.contains(event.target) && !cityDropdown.contains(event.target)) {
        hideDropdown();
    }
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

