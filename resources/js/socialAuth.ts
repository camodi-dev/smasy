import { auth, googleProvider, facebookProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { router } from "@inertiajs/react";

async function socialLogin(provider: typeof googleProvider): Promise<void> {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await axios.post("/auth/social/callback", {
        token: idToken,
    }, {
        headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "",
        }
    });

    router.visit(response.data.redirect ?? "/dashboard");
}

export const loginWithGoogle   = (): Promise<void> => socialLogin(googleProvider);
export const loginWithFacebook = (): Promise<void> => socialLogin(facebookProvider);