<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-gray-50 flex items-center justify-center">

    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">

        <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <!-- Google Button -->
        <button id="google-login"
            class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition cursor-pointer">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
            <span class="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        <!-- Facebook Button -->
        <button id="facebook-login"
            class="w-full flex items-center justify-center gap-3 bg-[#1877F2] rounded-lg px-4 py-2.5 hover:bg-[#1665d8] transition cursor-pointer">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" class="w-5 h-5" />
            <span class="text-sm font-medium text-white">Continue with Facebook</span>
        </button>

        <!-- Error Message -->
        <p id="error-msg" class="text-red-500 text-sm text-center hidden"></p>

    </div>

    <script>
    document.getElementById('google-login').addEventListener('click', async () => {
        try {
            await window.loginWithGoogle();
        } catch (e) {
            document.getElementById('error-msg').classList.remove('hidden');
            document.getElementById('error-msg').textContent = e.message;
        }
    });

    document.getElementById('facebook-login').addEventListener('click', async () => {
        try {
            await window.loginWithFacebook();
        } catch (e) {
            document.getElementById('error-msg').classList.remove('hidden');
            document.getElementById('error-msg').textContent = e.message;
        }
    });
</script>

</body>
</html>