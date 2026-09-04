import { getSupabase } from './supabaseClient'
import type { Machine } from '../../types'

export async function getMachines(): Promise<Machine[]> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('is_active', true)
    .order('machine_code', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getMachineByCode(machineCode: string): Promise<Machine | null> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('machine_code', machineCode)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}