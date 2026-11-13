import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AProposPage from './pages/AProposPage';
import NosActivitesPage from './pages/NosActivitesPage';
import ActualitesPage from './pages/ActualitesPage';
import BlogPage from './pages/BlogPage';
import BonsPlansPage from './pages/BonsPlansPage';
import ArticlePage from './pages/ArticlePage';
import ProduitsPage from './pages/ProduitsPage';
import ProduitPage from './pages/ProduitPage';
import OffresPage from './pages/OffresPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import CandidaturePage from './pages/CandidaturePage';
import { LoginPage, InscriptionPage, MonComptePage } from './pages/AuthPages';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import { ArticlesAdmin, ProduitsAdmin, OffresAdmin, FaqAdmin } from './admin/Contents';
import { MessagesAdmin, CandidaturesAdmin, UsersAdmin } from './admin/Requests';

export default function App() {
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="produits" element={<ProduitsAdmin />} />
        <Route path="offres" element={<OffresAdmin />} />
        <Route path="faq" element={<FaqAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="candidatures" element={<CandidaturesAdmin />} />
        <Route path="utilisateurs" element={<UsersAdmin />} />
      </Route>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="a-propos" element={<AProposPage />} />
        <Route path="nos-activites" element={<NosActivitesPage />} />
        <Route path="actualites" element={<ActualitesPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="bons-plans" element={<BonsPlansPage />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="nos-produits" element={<ProduitsPage />} />
        <Route path="nos-produits/:slug" element={<ProduitPage />} />
        <Route path="offres" element={<OffresPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="candidature-spontanee" element={<CandidaturePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="inscription" element={<InscriptionPage />} />
        <Route path="mon-compte" element={<MonComptePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
