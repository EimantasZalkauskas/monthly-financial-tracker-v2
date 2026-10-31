import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../api/supabase';

type NavbarProps = {
  isAuthLoading: boolean;
  user: { id: string; name: string } | null;
};

export default function Navbar({ isAuthLoading, user }: NavbarProps) {
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);
  const [logoutError, setLogoutError] = useState('');

  async function handleLogout() {
    setAccountMenuAnchor(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setLogoutError(error.message);
      }
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'An unexpected error occurred.',
      );
    }
  }

  const avatarLabel = user?.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <>
      <AppBar
        color="transparent"
        elevation={0}
        position="static"
        sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
      >
        <Toolbar
          sx={{
            boxSizing: 'border-box',
            gap: 1,
            mx: 'auto',
            px: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: 1136,
          }}
        >
          <Typography
            component="div"
            color="text.primary"
            sx={{
              flex: '1 1 auto',
              fontSize: { xs: '0.875rem', sm: '1.125rem' },
              fontWeight: 600,
              lineHeight: 1.2,
              minWidth: 0,
              textAlign: 'left',
            }}
            variant="h6"
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Monthly financial tracker
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Tracker
            </Box>
          </Typography>
          <Stack
            direction="row"
            spacing={0}
            sx={{
              alignItems: 'center',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              size="small"
              sx={{ minWidth: 0, px: { xs: 0.5, sm: 1.5 }, textTransform: 'none' }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/add"
              color="inherit"
              size="small"
              sx={{ minWidth: 0, px: { xs: 0.5, sm: 1.5 }, textTransform: 'none' }}
            >
              Add Data
            </Button>
            {!isAuthLoading &&
              (user ? (
                <>
                  <IconButton
                    aria-label="Open account menu"
                    aria-controls={accountMenuAnchor ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={accountMenuAnchor ? 'true' : undefined}
                    onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
                  >
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {avatarLabel}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={accountMenuAnchor}
                    id="account-menu"
                    onClose={() => setAccountMenuAnchor(null)}
                    open={Boolean(accountMenuAnchor)}
                  >
                    {user.name && (
                      <Box sx={{ px: 2, py: 1.5, minWidth: 180 }}>
                        <Typography color="text.secondary" variant="caption">
                          Signed in as
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontWeight: 700, mt: 0.25 }}
                          variant="subtitle1"
                        >
                          {user.name}
                        </Typography>
                      </Box>
                    )}
                    {user.name && <Divider />}
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    aria-controls={accountMenuAnchor ? 'account-menu' : undefined}
                    aria-expanded={accountMenuAnchor ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 0, px: { xs: 1, sm: 1.5 }, textTransform: 'none' }}
                  >
                    Account
                  </Button>
                  <Menu
                    anchorEl={accountMenuAnchor}
                    id="account-menu"
                    onClose={() => setAccountMenuAnchor(null)}
                    open={Boolean(accountMenuAnchor)}
                  >
                    <MenuItem
                      component={RouterLink}
                      onClick={() => setAccountMenuAnchor(null)}
                      to="/login"
                    >
                      Log in
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      onClick={() => setAccountMenuAnchor(null)}
                      to="/signup"
                    >
                      Sign up
                    </MenuItem>
                  </Menu>
                </>
              ))}
          </Stack>
        </Toolbar>
      </AppBar>
      <Snackbar
        autoHideDuration={6000}
        onClose={() => setLogoutError('')}
        open={Boolean(logoutError)}
      >
        <Alert onClose={() => setLogoutError('')} severity="error" variant="filled">
          Could not log out: {logoutError}
        </Alert>
      </Snackbar>
    </>
  );
}
