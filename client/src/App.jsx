import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgrammePage from './pages/ProgrammePage';
import SpeakersPage from './pages/SpeakersPage';
import VenuePage from './pages/VenuePage';
import RegistrationPage from './pages/RegistrationPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ManageProgramme from './pages/admin/ManageProgramme';
import ManageSpeakers from './pages/admin/ManageSpeakers';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import ManageSponsors from './pages/admin/ManageSponsors';
import ManageExhibitions from './pages/admin/ManageExhibitions';
import ManageNews from './pages/admin/ManageNews';
import ManageContacts from './pages/admin/ManageContacts';
import ManageNewsletter from './pages/admin/ManageNewsletter';
import ManagePages from './pages/admin/ManagePages';
import ManageConfig from './pages/admin/ManageConfig';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public pages wrapped in main Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programme" element={<ProgrammePage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/venue" element={<VenuePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* Admin login - standalone, no layout */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin protected routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="programme" element={<ManageProgramme />} />
          <Route path="speakers" element={<ManageSpeakers />} />
          <Route path="registrations" element={<ManageRegistrations />} />
          <Route path="sponsors" element={<ManageSponsors />} />
          <Route path="exhibitions" element={<ManageExhibitions />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="newsletter" element={<ManageNewsletter />} />
          <Route path="pages" element={<ManagePages />} />
          <Route path="settings" element={<ManageConfig />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
