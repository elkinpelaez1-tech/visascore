import { VisaExpediente } from "../components/types";
import { supabase } from "./supabaseClient";

export async function getExpedientes(): Promise<VisaExpediente[]> {
  const { data, error } = await supabase
    .from('visa_expedientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching expedientes:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    submissionDate: row.submission_date,
    state: row.state,
    ds160: row.ds160,
    checklist: row.checklist
  }));
}

export async function getExpedienteById(id: string): Promise<VisaExpediente | null> {
  const { data, error } = await supabase
    .from('visa_expedientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching expediente by id:', error);
    return null;
  }

  return {
    id: data.id,
    submissionDate: data.submission_date,
    state: data.state,
    ds160: data.ds160,
    checklist: data.checklist
  };
}

export async function saveExpediente(expediente: VisaExpediente): Promise<VisaExpediente> {
  const payload = {
    id: expediente.id,
    submission_date: expediente.submissionDate,
    state: expediente.state,
    ds160: expediente.ds160,
    checklist: expediente.checklist
  };

  const { error } = await supabase
    .from('visa_expedientes')
    .insert([payload]);

  if (error) {
    console.error('Error saving expediente:', error);
    throw error;
  }

  return expediente;
}

export async function updateExpediente(id: string, updates: Partial<VisaExpediente>): Promise<VisaExpediente | null> {
  const existing = await getExpedienteById(id);
  if (!existing) return null;

  const mergedExpediente = { ...existing, ...updates };
  if (updates.ds160) {
    mergedExpediente.ds160 = { ...existing.ds160, ...updates.ds160 };
  }
  if (updates.checklist) {
    mergedExpediente.checklist = { ...existing.checklist, ...updates.checklist };
  }

  const finalPayload = {
    submission_date: mergedExpediente.submissionDate,
    state: mergedExpediente.state,
    ds160: mergedExpediente.ds160,
    checklist: mergedExpediente.checklist
  };

  const { error } = await supabase
    .from('visa_expedientes')
    .update(finalPayload)
    .eq('id', id);

  if (error) {
    console.error('Error updating expediente:', error);
    return null;
  }

  return mergedExpediente;
}

export async function deleteExpediente(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('visa_expedientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expediente:', error);
    return false;
  }

  return true;
}

export async function resetExpedientes(): Promise<VisaExpediente[]> {
  console.warn('resetExpedientes is disabled in production database mode');
  return getExpedientes();
}
