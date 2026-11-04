import { supabase } from './supabase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(
  /\/+$/,
  '',
);

type CreateRecordInput = {
  record_name: string;
  record_date:Date;
  record_type: string;
  amount: number;
};

function randomID(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function createRecord(record: CreateRecordInput): Promise<unknown> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!session?.access_token) {
    throw new Error('You must be signed in to add a record.');
  }

  const response = await fetch(`${API_BASE_URL}/record/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      record_id: randomID(1000, 9999),
      record_obj: record,
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
}
