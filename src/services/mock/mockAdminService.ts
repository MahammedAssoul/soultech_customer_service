export interface AdminRecord {
  uid: string
  created_at: string
}

let mockAdmins: AdminRecord[] = [
  { uid: 'mock-admin-1', created_at: '2026-01-01T00:00:00.000Z' },
]

/** In mock mode the admin uid is a stable local id. */
export async function getAdminUid(): Promise<string> {
  return 'mock-admin-1'
}

export async function listAdmins(): Promise<AdminRecord[]> {
  return [...mockAdmins]
}

export async function addAdmin(uid: string): Promise<void> {
  const trimmed = uid.trim()
  if (!trimmed) return
  if (!mockAdmins.some((a) => a.uid === trimmed)) {
    mockAdmins = [...mockAdmins, { uid: trimmed, created_at: new Date().toISOString() }]
  }
}

export async function removeAdmin(uid: string): Promise<void> {
  mockAdmins = mockAdmins.filter((a) => a.uid !== uid)
}