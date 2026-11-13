import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: { '/api': 'http://localhost:4100', '/uploads': 'http://localhost:4100' },
    // Les fichiers déposés à la racine (logos, documents) et synchronisés par OneDrive
    // peuvent être verrouillés : on ne les surveille pas pour éviter un arrêt du serveur.
    watch: { ignored: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.pdf', '**/public/storage/**'] },
  },
});
