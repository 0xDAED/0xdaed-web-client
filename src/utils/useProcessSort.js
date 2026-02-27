const PRIORITY = [
  { key: 'steam', rx: /\bsteam\b/i },
  { key: 'java', rx: /\bjava(w)?(\.exe)?\b/i }, // java/javaw
  { key: 'bluestacks', rx: /\bbluestacks\b/i },
  { key: 'chrome', rx: /\bchrome(\.exe)?\b/i },
  { key: 'edge', rx: /\b(msedge|microsoft edge)(\.exe)?\b/i },
  { key: 'browser', rx: /\b(browser|firefox|opera|brave|vivaldi)\b/i },
]

function priorityIndexByName(name = '') {
  const n = String(name).toLowerCase()
  for (let i = 0; i < PRIORITY.length; i++) {
    if (PRIORITY[i].rx.test(n)) return i
  }
  return null
}

export function sortProcesses(list = []) {
  return [...list].sort((a, b) => {
    const ap = priorityIndexByName(a?.name)
    const bp = priorityIndexByName(b?.name)

    if (ap !== null && bp !== null) {
      if (ap !== bp) return ap - bp
      return String(a?.name || '').localeCompare(String(b?.name || ''), 'ru')
    }
    if (ap !== null) return -1
    if (bp !== null) return 1

    return String(a?.name || '').localeCompare(String(b?.name || ''), 'ru')
  })
}
