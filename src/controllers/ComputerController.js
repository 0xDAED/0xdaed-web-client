// composables/ComputerController.js
import { reactive, readonly } from 'vue';

/**
 * @typedef {Object} Computer
 * @property {boolean} computerActive - Активен ли компьютер
 * @property {string} computerName - Имя компьютера
 * @property {string} computerMacAddress - MAC-адрес компьютера
 * @property {string} lastTimeActive - Последнее время активности
 * @property {string} [createdAt] - Дата создания записи
 */

export /**
 * ComputerController - TODO: Добавить описание класса
 */
class ComputerController {
  /** @type {import('vue').UnwrapNestedRefs<Record<string, Computer>>} */
  #computers = reactive({});

  /**
   * Получить реактивный доступ ко всем компьютерам (только для чтения)
   * @returns {Readonly<Record<string, Computer>>} Объект всех компьютеров
   */
  get computers() {
    return readonly(this.#computers);
  }

  /**
   * Добавить новый компьютер
   * @param {string} id - Уникальный идентификатор (например, MAC-адрес)
   * @param {Partial<Computer>} params - Данные компьютера
   * @returns {boolean} true если успешно добавлен
   */
  addComputer(id, params) {
    if (this.#computers[id]) {
      console.warn(`Компьютер с ID ${id} уже существует`);
      return false;
    }

    this.#computers[id] = {
      computerActive: params.computerActive ?? false,
      computerName: params.computerName ?? 'Unknown',
      computerMacAddress: params.computerMacAddress ?? '',
      lastTimeActive: params.lastTimeActive ?? 'никогда',
      createdAt: new Date().toISOString(),
      ...params,
    };

    return true;
  }

  /**
   * Обновить данные компьютера
   * @param {string} id - ID компьютера
   * @param {Partial<Computer>} updates - Обновления
   * @returns {boolean} true если успешно обновлен
   */
  updateComputer(id, updates) {
    if (!this.#computers[id]) {
      console.error(`Компьютер с ID ${id} не найден`);
      return false;
    }

    Object.assign(this.#computers[id], updates);
    return true;
  }

  /**
   * Удалить компьютер
   * @param {string} id - ID компьютера
   * @returns {boolean} true если успешно удалён
   */
  removeComputer(id) {
    if (!this.#computers[id]) {
      console.warn(`Компьютер с ID ${id} не найден`);
      return false;
    }

    delete this.#computers[id];
    return true;
  }

  /**
   * Получить компьютер по ID
   * @param {string} id - ID компьютера
   * @returns {Computer | undefined} Компьютер или undefined
   */
  getComputer(id) {
    return this.#computers[id];
  }

  /**
   * Получить все компьютеры в виде массива
   * @returns {Computer[]} Массив компьютеров
   */
  getAllComputers() {
    return Object.values(this.#computers);
  }

  /**
   * Получить только активные компьютеры
   * @returns {Computer[]} Массив активных компьютеров
   */
  getActiveComputers() {
    return Object.values(this.#computers).filter((comp) => comp.computerActive);
  }

  /**
   * Очистить все компьютеры
   * @returns {void}
   */
  clearAll() {
    Object.keys(this.#computers).forEach((key) => {
      delete this.#computers[key];
    });
  }
}

/** @type {ComputerController} */
export const /**
   * @type {any}
   */
  computerController = new ComputerController();
