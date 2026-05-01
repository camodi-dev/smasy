// resources/js/socialAuth.js
import { auth, googleProvider, facebookProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

async function socialLogin(provider) {
  try {
    // 1. Firebase handles the OAuth popup
    const result = await signInWithPopup(auth, provider);

    // 2. Get the Firebase ID token
    const idToken = await result.user.getIdToken();

    // 3. Send token to YOUR Laravel backend
    const response = await axios.post("/auth/social/callback", { token: idToken });

    // 4. Redirect or update UI
    window.location.href = response.data.redirect ?? "/dashboard";

  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

export const loginWithGoogle   = () => socialLogin(googleProvider);
export const loginWithFacebook = () => socialLogin(facebookProvider);