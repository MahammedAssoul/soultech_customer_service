import { mockMachines } from '../../data/mockData'
import { delay } from './mockUtils'
import type { Machine } from '../../types'

export async function getMachines(): Promise<Machine[]> {
  await delay(300)
  return mockMachines
    .filter((m) => m.is_active)
    .sort((a, b) => a.machine_code.localeCompare(b.machine_code))
    .map((m) => ({ ...m }))
}

export async function getMachineByCode(machineCode: string): Promise<Machine | null> {
  await delay(300)
  const machine = mockMachines.find(
    (m) => m.machine_code.toLowerCase() === machineCode.toLowerCase() && m.is_active,
  )
  return machine ?? null
}

export async function getMachineById(id: string): Promise<Machine | null> {
  await delay(200)
  return mockMachines.find((m) => m.id === id) ?? null
}