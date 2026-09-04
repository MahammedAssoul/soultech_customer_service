import { getSupabase } from './supabaseClient'
import type { CustomerIssue, IssueWithMachine, NewIssueInput } from '../../types'

export async function getIssues(): Promise<CustomerIssue[]> {
  const { data, error } = await getSupabase()
    .from('customer_issues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getIssueByReference(
  reference: string,
): Promise<IssueWithMachine | null> {
  const { data, error } = await getSupabase()
    .from('customer_issues')
    .select('*, machines(name)')
    .eq('reference_number', reference)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createIssue(input: NewIssueInput): Promise<CustomerIssue> {
  const { data, error } = await getSupabase()
    .from('customer_issues')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateIssueStatus(
  id: string,
  status: CustomerIssue['status'],
): Promise<CustomerIssue | null> {
  const { data, error } = await getSupabase()
    .from('customer_issues')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}