import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-[#0f1115]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[100px] animate-pulse delay-1000" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-[#181b21]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          {children}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} MyEmpire — Tous droits réservés
        </div>
      </div>
    </div>
  );
};
