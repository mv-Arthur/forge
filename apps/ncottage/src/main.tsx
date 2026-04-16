import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Eager decode of all images used in the presentation, so the first slide
// switch doesn't pay the decode cost on the main thread.
const PRELOAD_IMAGES = [
  'https://ncottage.ru/app/uploads/2022/02/logo-.png',
  'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1920&q=85',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
  'https://ncottage.ru/app/uploads/2023/07/nord-new.jpg',
  'https://ncottage.ru/app/uploads/2023/07/alaster-new.jpg',
  'https://ncottage.ru/app/uploads/2023/07/valter-new.jpg',
  'https://ncottage.ru/app/uploads/2023/07/eliot-new.jpg',
  'https://ncottage.ru/app/uploads/2022/06/anton-new.webp',
];

for (const src of PRELOAD_IMAGES) {
  const img = new Image();
  img.src = src;
  img.decoding = 'async';
  img.decode?.().catch(() => {
    // Some images may 404 (works gallery has .webp fallbacks); ignore.
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
