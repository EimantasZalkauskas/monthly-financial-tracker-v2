import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { type ChangeEvent, useState } from 'react';
import { uploadPayslip } from '../api/payslip_calls';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function AddDataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<unknown>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setStatus('idle');
    setErrorMessage('');
    setResult(null);
  }

  async function handleUpload() {
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');
    setResult(null);

    try {
      setResult(await uploadPayslip(file));
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'The upload failed.');
    }
  }

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', p: 3 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Add Data
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Choose a payslip PDF to upload and process.
      </Typography>
      <Button component="label" variant="outlined" disabled={status === 'uploading'}>
        Choose PDF
        <input
          hidden
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <Typography sx={{ mt: 1 }} aria-live="polite">
          Selected: {file.name}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || status === 'uploading'}
        >
          {status === 'uploading' ? 'Uploading…' : 'Upload payslip'}
        </Button>
        {status === 'uploading' && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Box>
      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Payslip uploaded successfully.
        </Alert>
      )}
      {status === 'success' && (
        <Box component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(result, null, 2)}
        </Box>
      )}
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
}