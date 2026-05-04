export {};

declare global {
    interface Window {
        loginWithGoogle: () => Promise<void>;
        loginWithFacebook: () => Promise<void>;
    }
}