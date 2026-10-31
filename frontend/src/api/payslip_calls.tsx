const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(
  /\/+$/,
  '',
);


export async function uploadPayslip(file: File): Promise<JSON> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/payslip/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status}): ${await response.text()}`);
  }

  return await response.json() 
}