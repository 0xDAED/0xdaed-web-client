import { RefreshCw, StopCircle, Zap, Settings, Activity } from 'lucide-vue-next'

export const PANEL_TABS = [
  { key: 'processes', label: 'Процессы', icon: Activity },
  { key: 'tasks', label: 'Задачи', icon: Zap },
  { key: 'system', label: 'Система', icon: Settings },
]

export const QUICK_ACTIONS = [
  { name: 'Перезагрузка', type: 'REBOOT', icon: RefreshCw, color: 'error' },
  { name: 'Выключение', type: 'SHUTDOWN', icon: StopCircle, color: 'error' },
  { name: 'Сон', type: 'SLEEP', icon: StopCircle, color: 'info' },
]

export const TASK_TYPE_MAP = {
  'Выполнить команду': 'RUN_SHELL',
  'Запустить программу': 'RUN_PROGRAM',
  Перезагрузка: 'REBOOT',
  Выключение: 'SHUTDOWN',
}
