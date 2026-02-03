import { computed } from 'vue';
import { computerController } from '@/controllers/ComputerController';

/**
 * @typedef {Object} UseComputersReturn
 * @property {import('vue').ComputedRef<Readonly<Record<string, Computer>>>} computers - Все компьютеры
 * @property {import('vue').ComputedRef<Computer[]>} allComputers - Все компьютеры в виде массива
 * @property {import('vue').ComputedRef<Computer[]>} activeComputers - Только активные компьютеры
 * @property {import('vue').ComputedRef<number>} computersCount - Количество компьютеров
 * @property {import('vue').ComputedRef<number>} activeCount - Количество активных компьютеров
 * @property {(id: string, params: Partial<Computer>) => boolean} addComputer - Добавить компьютер
 * @property {(id: string, updates: Partial<Computer>) => boolean} updateComputer - Обновить компьютер
 * @property {(id: string) => boolean} removeComputer - Удалить компьютер
 * @property {(id: string) => Computer | undefined} getComputer - Получить компьютер по ID
 * @property {() => void} clearAll - Очистить все компьютеры
 */

/**
 * Composable для работы со списком компьютеров
 * @returns {UseComputersReturn} Реактивные данные и методы управления
 */
export /**
 * useComputers - TODO: Добавить описание функции

 * @returns {any} TODO: Описать возвращаемое значение
 */
function useComputers() {
  const computers = computed(() => computerController.computers);

  const allComputers = computed(() => computerController.getAllComputers());
  const activeComputers = computed(() => computerController.getActiveComputers());
  const computersCount = computed(() => Object.keys(computers.value).length);
  const activeCount = computed(() => activeComputers.value.length);

  return {
    computers,
    allComputers,
    activeComputers,
    computersCount,
    activeCount,

    addComputer: (id, params) => computerController.addComputer(id, params),
    updateComputer: (id, updates) => computerController.updateComputer(id, updates),
    removeComputer: (id) => computerController.removeComputer(id),
    getComputer: (id) => computerController.getComputer(id),
    clearAll: () => computerController.clearAll(),
  };
}

/**
 * @typedef {Object} UseComputerReturn
 * @property {import('vue').Ref<string>} id - ID компьютера
 * @property {import('vue').WritableComputedRef<Computer | undefined>} computer - Реактивный объект компьютера
 * @property {import('vue').ComputedRef<boolean>} computerActive - Статус активности
 * @property {import('vue').ComputedRef<string>} computerName - Имя компьютера
 * @property {import('vue').ComputedRef<string>} computerMacAddress - MAC-адрес
 * @property {import('vue').ComputedRef<string>} lastTimeActive - Последнее время активности
 * @property {(updates: Partial<Computer>) => void} update - Обновить компьютер
 * @property {() => void} remove - Удалить компьютер
 * @property {(active: boolean) => void} setActive - Установить статус активности
 */

/**
 * Composable для работы с конкретным компьютером
 * @param {string} computerId - ID компьютера (например, MAC-адрес)
 * @returns {UseComputerReturn} Реактивные поля и методы компьютера
 */
export /**
 * useComputer - TODO: Добавить описание функции
 * @param {any} computerId - Описание параметра computerId

 * @returns {any} TODO: Описать возвращаемое значение
 */
function useComputer(computerId) {
  const id = ref(computerId);

  const computer = computed({
    get() {
      return computerController.getComputer(id.value);
    },
    set(newValue) {
      if (newValue) {
        computerController.updateComputer(id.value, newValue);
      }
    },
  });

  const computerActive = computed(() => computer.value?.computerActive ?? false);
  const computerName = computed(() => computer.value?.computerName ?? '');
  const computerMacAddress = computed(() => computer.value?.computerMacAddress ?? '');
  const lastTimeActive = computed(() => computer.value?.lastTimeActive ?? '');

  const /**
 * update - TODO: Добавить описание функции
 * @param {any} updates - Описание параметра updates

 * @returns {any} TODO: Описать возвращаемое значение
 */
    update = (updates) => {
      computerController.updateComputer(id.value, updates);
    };

  const /**
 * remove - TODO: Добавить описание функции

 * @returns {any} TODO: Описать возвращаемое значение
 */
    remove = () => {
      computerController.removeComputer(id.value);
    };

  const /**
 * setActive - TODO: Добавить описание функции
 * @param {any} active - Описание параметра active

 * @returns {any} TODO: Описать возвращаемое значение
 */
    setActive = (active) => {
      update({
        computerActive: active,
        lastTimeActive: new Date().toLocaleString(),
      });
    };

  return {
    id,
    computer,
    computerActive,
    computerName,
    computerMacAddress,
    lastTimeActive,
    update,
    remove,
    setActive,
  };
}
