import { defineStore } from 'pinia'
import { useIconStore } from '@/stores/iconStore'

const API_URL = '/computer/api/v1'
const WS_URL =
  (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/computer/api/v1/ws'

export const useComputersStore = defineStore('computers', {
  state: () => ({
    computers: [],
    blockedRulesByPc: {},
    loading: false,
    error: null,

    selectedPcIds: [],
    bulkMode: false,

    ws: null,
    wsConnected: false,
    reconnectTimer: null,
    filters: {
      q: '',
      online: 'all',
      overloaded: false,
      cpuMin: 0,
      cpuMax: 100,
      ramMin: 0,
      ramMax: 100,
      diskMin: 0,
      diskMax: 100,
      sort: 'online_first',
      hasProcess: '',
      cpuMin: 0,
      cpuMax: 100,
      ramMin: 0,
      ramMax: 100,
      diskMin: 0,
      diskMax: 100,
      icon: null,
      iconColor: null,
    },
  }),

  getters: {
    filteredComputers: state => {
      const iconStore = useIconStore()
      const iconColor = state.filters.iconColor
      const q = (state.filters.q || '').trim().toLowerCase()
      const procQ = (state.filters.hasProcess || '').trim().toLowerCase()

      const pass = c => {
        if (iconColor) {
          const cColor = iconStore.getColorKey(c.id)
          if (cColor !== iconColor) return false
        }
        // online
        if (state.filters.online === 'online' && !c.computerActive) return false
        if (state.filters.online === 'offline' && c.computerActive) return false

        // search by name/mac/ip/user + processes
        if (q) {
          const hay = [c.computerName, c.computerMacAddress, c.system?.ip, c.system?.username]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          const procHay = (c.processList || [])
            .map(p => p.name)
            .join(' ')
            .toLowerCase()
          if (!hay.includes(q) && !procHay.includes(q)) return false
        }

        // hasProcess отдельно
        if (procQ) {
          const procHay = (c.processList || [])
            .map(p => p.name)
            .join(' ')
            .toLowerCase()
          if (!procHay.includes(procQ)) return false
        }

        // cpu/ram/disk (страхуемся от undefined)
        const cpu = Number(c.cpu?.value ?? 0)
        const ram = Number(c.ozu?.value ?? 0)
        const disk = Number(c.hard_drive?.value ?? 0)

        if (cpu < state.filters.cpuMin || cpu > state.filters.cpuMax) return false
        if (ram < state.filters.ramMin || ram > state.filters.ramMax) return false
        if (disk < state.filters.diskMin || disk > state.filters.diskMax) return false

        if (state.filters.overloaded) {
          const cpu = Number(c.cpu?.value ?? 0)
          const ram = Number(c.ozu?.value ?? 0)
          if (cpu < state.filters.overloadCpu && ram < state.filters.overloadRam) return false
        }

        return true
      }

      const arr = (state.computers || []).filter(pass)

      // сортировка
      const sort = state.filters.sort
      const byName = (a, b) => (a.computerName || '').localeCompare(b.computerName || '')
      const byNumDesc = get => (a, b) => get(b) - get(a)

      if (sort === 'name') arr.sort(byName)
      else if (sort === 'cpu') arr.sort(byNumDesc(c => Number(c.cpu?.value ?? 0)))
      else if (sort === 'ram') arr.sort(byNumDesc(c => Number(c.ozu?.value ?? 0)))
      else if (sort === 'disk') arr.sort(byNumDesc(c => Number(c.hard_drive?.value ?? 0)))
      else if (sort === 'online_first')
        arr.sort((a, b) => Number(b.computerActive) - Number(a.computerActive) || byName(a, b))

      return arr
    },
    sortedComputers: state =>
      [...state.computers].sort((a, b) => b.computerActive - a.computerActive),

    stats: state => {
      const active = state.computers.filter(c => c.computerActive).length
      const total = state.computers.length
      return { active, inactive: total - active, total }
    },
  },

  actions: {
    setFilter(key, value) {
      this.filters[key] = value
    },
    resetFilters() {
      this.filters = {
        q: '',
        online: 'all',
        cpuMin: 0,
        cpuMax: 100,
        ramMin: 0,
        ramMax: 100,
        diskMin: 0,
        diskMax: 100,
        hasProcess: '',
        sort: 'online_first',
        overloaded: false,
        icon: null,
      }
    },
    async loadDashboard() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_URL}/dashboard/pcs`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        this.computers = data.computers
        this.connectWS()
      } catch (e) {
        this.error = e.message || 'Ошибка загрузки'
      } finally {
        this.loading = false
      }
    },

    upsertComputer(dto) {
      const idx = this.computers.findIndex(c => c.id === dto.id)
      if (idx === -1) this.computers.push(dto)
      else this.computers[idx] = { ...this.computers[idx], ...dto }
    },

    applyTaskUpdate(pcId, task) {
      const idx = this.computers.findIndex(c => c.id === pcId)
      if (idx === -1) return
      const tasks = this.computers[idx].tasks || []
      const tIdx = tasks.findIndex(t => t.id === task.id)

      if (task.status === 'completed' || task.status === 'failed') {
        const next = tasks.filter(t => t.id !== task.id)
        this.computers[idx] = { ...this.computers[idx], tasks: next }
        return
      }

      if (tIdx === -1) tasks.unshift(task)
      else tasks[tIdx] = task
      this.computers[idx] = { ...this.computers[idx], tasks: [...tasks] }
    },

    applyCommandUpdate(ev) {
      const pcId = ev.pc_id
      const cmdId = ev.command_id
      const idx = this.computers.findIndex(c => c.id === pcId)
      if (idx === -1) return

      const tasks = this.computers[idx].tasks || []
      const tIdx = tasks.findIndex(t => t.id === cmdId)

      const existingType = tIdx !== -1 ? tasks[tIdx].type : undefined
      const cmdType = existingType || ev.command_type

      if (tIdx === -1) {
        tasks.unshift({
          id: cmdId,
          type: cmdType,
          status: ev.status,
          createdAtTs: ev.ts || Date.now() / 1000,
          stdout: ev.stdout,
          stderr: ev.stderr,
          exitCode: ev.exit_code,
          finishedAtTs: ev.finished_at_ts,
        })
      } else {
        tasks[tIdx] = {
          ...tasks[tIdx],
          status: ev.status,
          exitCode: ev.exit_code,
          finishedAtTs: ev.finished_at_ts,
          stdout: ev.stdout ?? tasks[tIdx].stdout,
          stderr: ev.stderr ?? tasks[tIdx].stderr,
        }
      }

      this.computers[idx] = { ...this.computers[idx], tasks: [...tasks] }

      if (ev.status === 'completed' && cmdType === 'GET_BLOCKED_LIST') {
        const stdout = ev.stdout ?? (tIdx !== -1 ? tasks[tIdx].stdout : null) ?? ''
        try {
          const arr = JSON.parse(stdout || '[]')
          this.setBlockedRules(pcId, Array.isArray(arr) ? arr : [])
        } catch (e) {
          console.error('GET_BLOCKED_LIST parse failed:', stdout, e)
        }
      }

      if (
        ev.status === 'completed' &&
        (cmdType === 'BLOCK_PROCESS_NAME' || cmdType === 'UNBLOCK_PROCESS_NAME')
      ) {
        this.createCommand(pcId, 'GET_BLOCKED_LIST', {}).catch(() => {})
      }
    },

    subscribe() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
      if (!this.computers.length) return

      this.ws.send(
        JSON.stringify({
          action: 'subscribe',
          pc_ids: this.computers.map(c => c.id),
          streams: ['meta', 'metrics', 'procs', 'commands'],
        })
      )
    },

    removeTaskLocal(pcId, taskId) {
      const idx = this.computers.findIndex(c => c.id === pcId)
      if (idx === -1) return
      const tasks = this.computers[idx].tasks || []
      this.computers[idx] = { ...this.computers[idx], tasks: tasks.filter(t => t.id !== taskId) }
    },

    connectWS() {
      if (this.ws) this.ws.close()

      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        this.wsConnected = true
        this.subscribe()
      }

      this.ws.onmessage = event => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }

        if (msg.type === 'pc_update') this.upsertComputer(msg.data)
        if (msg.type === 'task_update') this.applyTaskUpdate(msg.pc_id, msg.task)
        if (msg.type === 'command_update') {
          this.applyCommandUpdate(msg.data)
        }
        if (msg.type === 'pc_offline') {
          const idx = this.computers.findIndex(c => c.id === msg.id)
          if (idx !== -1) {
            this.computers[idx] = { ...this.computers[idx], computerActive: false }
          }
        }
      }

      this.ws.onclose = () => {
        this.wsConnected = false
        this.reconnectTimer = setTimeout(() => this.connectWS(), 1500)
      }

      this.ws.onerror = () => {
        try {
          this.ws.close()
        } catch {
          /* */
        }
      }
    },

    async createCommand(pcId, type, payload = {}) {
      const res = await fetch(`${API_URL}/ui/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pc_id: pcId, type, payload }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
      }
      const created = await res.json() // {id: "..."}
      this.applyTaskUpdate(pcId, {
        id: created.id,
        type,
        status: 'pending',
        progress: 0,
        createdAtTs: Math.floor(Date.now() / 1000),
      })
      return created
    },

    setBlockedRules(pcId, rules) {
      this.blockedRulesByPc[pcId] = rules
    },

    addBlockedRule(pcId, name) {
      const n = (name || '').trim()
      if (!n) return
      const cur = this.blockedRulesByPc[pcId] || []
      if (!cur.includes(n)) this.blockedRulesByPc[pcId] = [...cur, n].sort()
    },

    removeBlockedRule(pcId, name) {
      const n = (name || '').trim()
      const cur = this.blockedRulesByPc[pcId] || []
      this.blockedRulesByPc[pcId] = cur.filter(x => x !== n)
    },
    toggleBulkMode() {
      this.bulkMode = !this.bulkMode
      if (!this.bulkMode) this.selectedPcIds = []
    },

    isSelected(pcId) {
      return this.selectedPcIds.includes(pcId)
    },

    toggleSelected(pcId) {
      if (this.selectedPcIds.includes(pcId)) {
        this.selectedPcIds = this.selectedPcIds.filter(x => x !== pcId)
      } else {
        this.selectedPcIds = [...this.selectedPcIds, pcId]
      }
    },

    selectMany(pcIds) {
      const set = new Set(this.selectedPcIds)
      pcIds.forEach(id => set.add(id))
      this.selectedPcIds = Array.from(set)
    },

    clearSelection() {
      this.selectedPcIds = []
    },
  },
})
