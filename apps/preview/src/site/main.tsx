import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteApp } from './site-app';
import './site.css';
import '@/skin.css';
import '../frame/preview.css';

createRoot(document.getElementById('root')!).render(<StrictMode><SiteApp /></StrictMode>);
