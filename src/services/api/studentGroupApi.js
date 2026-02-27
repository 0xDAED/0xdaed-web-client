export async function fetchStudentGroups() {
  const response = await fetch('/api/groups')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
