import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './lib/auth';
import './styles/theme.css';
import './styles/annuaire.css';

// Pas de <StrictMode> : les animations d'origine (particules, compteurs, popup)
// ne doivent s'exécuter qu'une seule fois par affichage de page.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
