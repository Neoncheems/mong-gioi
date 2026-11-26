import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { WorldEditPage } from './pages/WorldEditPage';
import { PlayPage } from './pages/PlayPage';
import { AuthPage } from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="world/:id/edit" element={<WorldEditPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
        <Route path="/play/:saveId" element={<PlayPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;