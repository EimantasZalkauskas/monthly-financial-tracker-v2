import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createUser } from '../../api/user_calls';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await createUser({
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
      });
      setConfirmationRequired(result.confirmationRequired);
      if (result.confirmationRequired) {
        setSuccess(true);
      } else {
        navigate('/');
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to create your account. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        minHeight: 'calc(100vh - 2 * clamp(56px, 10vh, 104px))',
        placeItems: 'center',
      }}
    >
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography color="primary.main" variant="overline">
                Monthly financial tracker
              </Typography>
              <Typography component="h1" sx={{ fontWeight: 700 }} variant="h4">
                Create your account
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body1">
                Sign up to start organizing your finances.
              </Typography>
            </Box>
            {success ? (
              <Alert severity="success" role="status">
                {confirmationRequired
                  ? 'Your account was created. Check your email to confirm it before logging in.'
                  : 'Your account was created. You can now '}
                {!confirmationRequired && (
                  <>
                    <MuiLink component={Link} to="/login">
                      log in
                    </MuiLink>
                    .
                  </>
                )}
              </Alert>
            ) : (
              <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <TextField
                  autoComplete="name"
                  fullWidth
                  label="Name"
                  name="name"
                  required
                />
                <TextField
                  autoComplete="email"
                  fullWidth
                  label="Email"
                  name="email"
                  required
                  type="email"
                />
                <TextField
                  autoComplete="new-password"
                  fullWidth
                  label="Password"
                  name="password"
                  required
                  slotProps={{ htmlInput: { minLength: 8 } }}
                  type="password"
                />

                {error && (
                  <Alert role="alert" severity="error">
                    {error}
                  </Alert>
                )}

                <Button
                  disabled={isSubmitting}
                  fullWidth
                  type="submit"
                  variant="contained"
                >
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                </Button>

                <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
                  Already have an account?{' '}
                  <MuiLink component={Link} to="/login">
                    Log in
                  </MuiLink>
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
