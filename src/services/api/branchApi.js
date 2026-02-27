export async function fetchUserBranches() {
  const response = await fetch('/api/branches')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
