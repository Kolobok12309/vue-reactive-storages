// Функция глубокого копирования аргумента
function fullCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Функция для создания строки с ошибкой
function getErrorText(text) {
    return `[ReactiveStorage] ${text}`;
}

// Получение хранилища по типу
function getStoreByType(type) {
    let result;
    switch (type) {
    case 'local':
        result = window.localStorage;
        break;
    case 'session':
        result = window.sessionStorage;
        break;
    default:
        result = null;
        break;
    }
    return result;
}

// Модифицированная функция записи в хранилище с созданием события на текущей вкладке и преобразованием сложных типов к строке
function setEItem(key, value) {
    let modifiedValue;
    switch (typeof value) {
    // В случае если подан объект, необходимо его перевести в строку путем JSON кодирования
    case 'object':
        modifiedValue = JSON.stringify(value);
        break;
    case 'function':
    // В случае если подана функция выбрасываем ошибку т.к.
        throw new Error(getErrorText("Function can't be in storage"));
    default:
    // В ином случае просто записать значение
        modifiedValue = value;
        break;
    }

    // Получение старого значения для передачи в событие
    const oldValue = this.getItem(key);
    // Запись в хранилище нового значения
    this.setItem(key, modifiedValue);
    // Создание, конфиг и вызов события для текущей вкладки
    const e = document.createEvent('StorageEvent');
    e.initStorageEvent('storage', false, false, key, oldValue, modifiedValue, window.location.href, this);
    // Вызов события
    window.dispatchEvent(e);
}

// Получение элемента, при возможности распаршенный
function getJSONItem(key) {
    // Получение элемента из local/sessionStorage
    const value = this.getItem(key);
    let modifiedValue;
    try {
        // Попытка распарсить из json
        modifiedValue = JSON.parse(value);
    } catch (e) {
        // В случае неудачи вернуть неизмененное значение
        modifiedValue = value;
    }
    return modifiedValue;
}

// Приведение объекта к шаблону через рекурсию
function objToPattern(obj, pattern) {
    Object.keys(pattern).forEach((key) => {
        if (key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                objToPattern(obj[key], pattern[key]);
            }
        } else {
            obj[key] = fullCopy(pattern[key]);
        }
    });
}

class defaultReactiveStorage {
    constructor() {
        this._$config = {};
        this._$preset = {};
        this._$data = {};
        this._$handlers = {};
        this._$store = {};
        this._$blacklist = [];
        this._$listeners = [];

        // Установка в прототип хранилищ своих функций
        if (!Storage.prototype.setEItem) {
            Storage.prototype.setEItem = setEItem;
        }
        if (!Storage.prototype.getJSONItem) {
            Storage.prototype.getJSONItem = getJSONItem;
        }

        this._$blacklist = Object.keys(this);
        this._hideProps();
    }

    _initConfig(config) {
        const store = getStoreByType(config.type);
        if (!store) throw new Error(getErrorText('Wrong storage type'));
        // Получение хранилища
        const value = store.getJSONItem(config.name);
        // Заполнение объекта данными из пресета
        Object.keys(this._$preset).forEach((key) => {
            if (!~this._$blacklist.indexOf(key)) this[key] = this._$preset[key];
        });

        // Совмещение данных из пресета с данными из хранилища
        Object.assign(this, value);
        this._fixTemplate();

        // Обработка события изменения хранилища
        window.addEventListener('storage', ({ storageArea, key }) => {
            if (this._$store === storageArea && key === this._$config.name) {
                Object.assign(this, store.getJSONItem(this._$config.name));
            }
        });

        this._$config = config;
        this._$store = store;
    }

    // Сокрытие служебных свойств
    _hideProps() {
        Object.keys(this).forEach((key) => {
            Object.defineProperty(this, key, {
                enumerable: false,
            });
        });
    }

    // Функция приведения текущего хранилища к шаблону
    _fixTemplate() {
        objToPattern(this, this._$preset);
    }

    // Сохранение хранилища
    saveStorage(noNeedEvent = true) {
        // Запуск сохранения осуществляется не при каждом вызове
        this._fixTemplate();
        if (noNeedEvent) {
            this._$store.setItem(this._$config.name, JSON.stringify(this));
            this._doChangehandlers();
        } else {
            this._$store.setEItem(this._$config.name, this);
        }
    }

    // Добавление события на изменение данных
    addChangeHandler(callback) {
        this._$listeners.push(callback);
    }

    // Удаление события
    removeChangeHandler(callback) {
        const index = this._$listeners.indexOf(callback);
        if (~index) {
            this._$listeners.splice(index, 1);
        }
    }

    // Запуск обработчиков
    _doChangehandlers() {
        this._$listeners.forEach((handler) => {
            handler(this);
        });
    }
}

class reactiveStorage extends defaultReactiveStorage {
    constructor(preset, config = { type: 'local', name: '$RStore', ttl: 60 * 60 * 24 * 1000 * 7 }, listeners = [], onload = () => { }) {
        super();
        this._$preset = fullCopy(preset);
        this._initConfig(config);
        this._$listeners = this._$listeners.concat(listeners);
        this.saveStorage(false);
        onload(this);
    }
}

export default reactiveStorage;
