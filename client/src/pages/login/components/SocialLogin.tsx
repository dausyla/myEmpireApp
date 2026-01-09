export const SocialLogin = () => {
  const handleGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-[#22262e] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2d323b] transition-all duration-200 font-medium cursor-pointer"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 6.5c1.61 0 3.05.66 4.08 1.73l3.06-3.06C17.46 3.12 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84C6.71 8.41 9.14 6.5 12 6.5z"
          fill="#EA4335"
        />
      </svg>
      Google
    </button>
  );
};
