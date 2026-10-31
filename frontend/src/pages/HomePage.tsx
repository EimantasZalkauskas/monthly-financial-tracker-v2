import { Box, CircularProgress, Typography } from '@mui/material';

type HomePageProps = {
  isLoading: boolean;
  name: string | null;
  userId: string | null;
};

export default function HomePage({ isLoading, name, userId }: HomePageProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', minHeight: '50vh', placeItems: 'center' }}>
        <CircularProgress aria-label="Loading account" />
      </Box>
    );
  }

  return (
    <Box component="section">
      <Typography component="h1" variant="h4">
        {name ? `Welcome, ${name}` : 'Home Page'}
      </Typography>
      {userId && (
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
          User ID: {userId}
        </Typography>
      )}
    </Box>
  );
}