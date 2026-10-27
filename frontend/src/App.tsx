import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

export default function App() {

  return (
    <div className="app-shell">
      <main className="page-content">
        <Routes>
          <Route element={<HomePage />} path="/" />

        </Routes>
      </main>
    </div>
  )
}


