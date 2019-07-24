import { ReactiveStorageOptions, ReactiveStorageHandler } from './types';

declare global {
    interface Storage {
        setEItem(key: string, value: any): void;
        getJSONItem(key: string): any;
    }
    // Fix my TS Version
    interface StorageEvent extends Event {
        initStorageEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, keyArg: string, oldValueArg: any, newValueArg: any, urlArg: string, storageAreaArg: Storage): void;
    }
}

// Функция глубокого копирования аргумента
function fullCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

// Класс своих ошибок
class StorageError extends Error {
    message: string;
    name: string;
    stack!: string;

    constructor(message: string) {
        message = `[ReactiveStorage] ${message}`;
        super(message);
        this.message = message;
        this.name = (<any> this.constructor).name;
    }
}


// Получение хранилища по типу
function getStoreByType(type: 'local' | 'session'): Storage {
    switch (type) {
    case 'local':
        return window.localStorage;
    case 'session':
        return window.sessionStorage;
    default:
        new StorageError('Wrong storage type');
        return window.localStorage;
    }
}

// Модифицированная функция записи в хранилище с созданием события на текущей вкладке и преобразованием сложных типов к строке
function setEItem(this: Storage, key: string, value: any) {
    let modifiedValue: any;
    switch (typeof value) {
    // В случае если подан объект, необходимо его перевести в строку путем JSON кодирования
    case 'object':
        modifiedValue = JSON.stringify(value);
        break;
    case 'function':
    // В случае если подана функция выбрасываем ошибку т.к.
        throw new StorageError('Function can\'t be in storage');
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
function getJSONItem(this: Storage,key: string): any {
    // Получение элемента из local/sessionStorage
    const value: any = this.getItem(key);
    let modifiedValue: any;
    try {
        // Попытка распарсить из json
        modifiedValue = JSON.parse(value);
    } catch (e) {
        // В случае неудачи вернуть неизмененное значение
        modifiedValue = value;
    }
    return modifiedValue;
}

// Установка в прототип хранилищ своих функций
if (!Storage.prototype.setEItem) {
    Storage.prototype.setEItem = setEItem;
}
if (!Storage.prototype.getJSONItem) {
    Storage.prototype.getJSONItem = getJSONItem;
}

// Приведение объекта к шаблону через рекурсию
function objToPattern(obj: any, pattern: any): any {
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

export class _ReactiveStorage<S> {
    private _$config: ReactiveStorageOptions;
    private _$preset: S;
    private _$store: Storage;
    private _$blacklist: string[];
    private _$listeners: ReactiveStorageHandler<S>[];
    [key: string]: any;

    constructor(
        preset: S,
        config = { type: 'local', name: '$RStore', ttl: 60 * 60 * 24 * 1000 * 7 } as ReactiveStorageOptions,
        listeners = [] as ReactiveStorageHandler<S>[],
        onload = (store: _ReactiveStorage<S> | S | ReactiveStorageMixin<S>): void => {}
    ) {
        this._$blacklist = Object.keys(this);

        this._$config = config;
        this._$store = getStoreByType(this._$config.type);
        this._$preset = preset;
        this._$listeners = listeners;

        this._hideProps();

        this._initConfig();
        this.saveStorage(false);

        onload(this);
    }

    _initConfig(): void {
        const config = this._$config;
        const store = this._$store;

        // Получение хранилища
        const value = store.getJSONItem(config.name);
        // Заполнение объекта данными из пресета
        for (let key in this._$preset) {
            if (!~this._$blacklist.indexOf(key)) this[key as string] = this._$preset[key];
        }
        // Object.keys(this._$preset).forEach((key) => {
        //     if (!~this._$blacklist.indexOf(key)) this[key] = this._$preset[key];
        // });

        // Совмещение данных из пресета с данными из хранилища
        // Object.assign(this, value);
        if (value) Object.assign(this, value);
        this._fixTemplate();

        // Обработка события изменения хранилища
        window.addEventListener('storage', ({ storageArea, key }) => {
            if (this._$store === storageArea && key === this._$config.name) {
                Object.assign(this, store.getJSONItem(this._$config.name));
            }
        });
    }

    // Сокрытие служебных свойств
    _hideProps(): void {
        Object.keys(this).forEach((key) => {
            Object.defineProperty(this, key, {
                enumerable: false,
            });
        });
    }

    // Функция приведения текущего хранилища к шаблону
    _fixTemplate(): void {
        objToPattern(this, this._$preset);
    }

    // Сохранение хранилища
    saveStorage(noNeedEvent: boolean = true) {
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
    addChangeHandler(callback: ReactiveStorageHandler<S>) {
        this._$listeners.push(callback);
    }

    // Удаление события
    removeChangeHandler(callback: ReactiveStorageHandler<S>) {
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

export type ReactiveStorageMixin<S> = _ReactiveStorage<S> & S;

export type ReactiveStorageType = {
    new <S>(
        preset: S,
        config?: ReactiveStorageOptions,
        listeners?: ReactiveStorageHandler<S>[],
        onload?: (store: _ReactiveStorage<S> | S | ReactiveStorageMixin<S>) => void
    ): ReactiveStorageMixin<S>;

    _initConfig(): void;
    _hideProps(): void;
    _fixTemplate(): void;
    saveStorage(noNeedEvent: boolean): void;
    addChangeHandler(callback: _ReactiveStorage<any>): void;
    removeChangeHandler(callback: _ReactiveStorage<any>): void;
    _doChangehandlers(): void;
}

const ReactiveStorage = _ReactiveStorage as ReactiveStorageType;

export default ReactiveStorage;
