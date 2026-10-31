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
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser } from '../../api/user_calls';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await signInUser(
        String(formData.get('email') ?? '').trim(),
        String(formData.get('password') ?? ''),
      );
      navigate('/');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to log in. Please try again.',
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
                Welcome back
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body1">
                Log in to continue organizing your finances.
              </Typography>
            </Box>

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              <TextField
                autoComplete="email"
                autoFocus
                fullWidth
                label="Email"
                name="email"
                required
                type="email"
              />
              <TextField
                autoComplete="current-password"
                fullWidth
                label="Password"
                name="password"
                required
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
                {isSubmitting ? 'Logging in…' : 'Log in'}
              </Button>

              <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
                Don&apos;t have an account?{' '}
                <MuiLink component={Link} to="/signup">
                  Sign up
                </MuiLink>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}