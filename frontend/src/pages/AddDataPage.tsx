import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { type ChangeEvent, useEffect, useState } from 'react';
import { uploadPayslip } from '../api/payslip_calls';
import { supabase } from '../api/supabase';
import { AddRecord } from '../components/AddRecord';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function AddDataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [manualEntry, setManualEntry] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) throw new Error('You must be signed in to add records.');
        if (isMounted) setUserId(user.id);
      } catch (error) {
        if (isMounted) {
          setUserError(error instanceof Error ? error.message : 'Unable to load the signed-in user.');
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

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
      console.log(result);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'The upload failed.');
    }
  }

  function handleManualChange(){
    setManualEntry(manualEntry+1);
  }

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', p: 3 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Add Data
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Choose a payslip PDF to upload and process.
      </Typography>
      {userError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {userError}
        </Alert>
      )}

      <Box id='buttons-box' sx={{
        display:'flex',
        flexDirection:'row'
      }}>
        <Box sx={{flexDirection:'column'}}>
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
        </Box>
        <Box sx={{mx:'10%'}}>
          <Button variant="outlined" color='secondary' onClick={()=>handleManualChange()}>Manual Entry</Button>
        </Box>
      </Box>

      
      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Payslip uploaded successfully.
        </Alert>
      )}
      {status === 'success' && (
        <Box component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
          {Object.keys(result).map((name:any)=> (
            <Box id={name} key={name} sx={{py:'2%'}}>
              {userId && <AddRecord name={name} value={result[name]} />}
            </Box>
          ))}
        </Box>
      )}
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {manualEntry !== 0 && userId && (
        Array.from({ length: manualEntry }, (_, index) => (
          <Box
            id={`manual-entry-${index}`}
            key={`manual-entry-${index}`}
            component="pre"
            sx={{ mt: 2, whiteSpace: 'pre-wrap' }}
          >
            <AddRecord name={null} value={null} />
          </Box>
        ))
      )}
    </Box>
  );
}