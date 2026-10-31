import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { supabase } from './api/supabase';
import Navbar from './components/Navbar';
import LoginPage from './pages/Access/LoginPage';
import SignUpPage from './pages/Access/SignUpPage';
import AddDataPage from './pages/AddDataPage';
import HomePage from './pages/HomePage';

export default function App() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      const metadataName = authUser?.user_metadata?.name;
      setUser(
        authUser
          ? {
              id: authUser.id,
              name: typeof metadataName === 'string' ? metadataName : '',
            }
          : null,
      );
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <CssBaseline />
      <div
        className="app-shell"
        style={{ maxWidth: '100%', overflowX: 'clip', width: '100%' }}
      >
        <Navbar isAuthLoading={isAuthLoading} user={user} />
        <main className="page-content">
          <Routes>
            <Route
              element={
                <HomePage
                  isLoading={isAuthLoading}
                  name={user?.name ?? null}
                  userId={user?.id ?? null}
                />
              }
              path="/"
            />
            <Route element={<AddDataPage />} path="/add" />
            <Route element={<SignUpPage />} path="/signup" />
            <Route element={<LoginPage />} path="/login" />
          </Routes>
        </main>
      </div>
    </>
  );
}
