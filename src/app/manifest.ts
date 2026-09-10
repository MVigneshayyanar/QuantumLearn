import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QLearn - Quantum Algorithm Learning Platform',
    short_name: 'QLearn',
    description: 'Master quantum algorithms through multi-simulator simulation, 3D Bloch sphere, and Schrödinger AI tutor.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
