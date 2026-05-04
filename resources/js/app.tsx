import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { loginWithGoogle, loginWithFacebook } from './socialAuth';

createInertiaApp({
    resolve: (name: string) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx', { eager: false })
        ),
    setup({ el, App, props }) {
        window.loginWithGoogle   = loginWithGoogle;
        window.loginWithFacebook = loginWithFacebook;
        createRoot(el).render(<App {...props} />);
    },
});