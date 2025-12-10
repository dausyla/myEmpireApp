import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext/AuthContextHook";

export const LoginPage = () => {
  const { login, signup } = useAuthContext();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSigningUp) {
      signup(email, password, username);
    } else {
      login(email, password);
    }
  };

  const handleGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div
          className="shadow-2xl border-0 rounded-3xl overflow-hidden"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div className="p-10">
            <div className="text-center mb-8">
              <h2
                className="font-bold text-3xl mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {isSigningUp ? "Créer un compte" : "Connexion"}
              </h2>
              <p className="text-gray-500">
                {isSigningUp
                  ? "Rejoignez MyEmpire"
                  : "Accédez à votre portefeuille"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="formEmail"
                  className="block text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email
                </label>
                <input
                  id="formEmail"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{
                    backgroundColor: "var(--bg-surface-secondary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>

              {isSigningUp && (
                <div className="space-y-2">
                  <label
                    htmlFor="formUsername"
                    className="block text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Pseudo
                  </label>
                  <input
                    id="formUsername"
                    type="text"
                    placeholder="Choisissez un pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    style={{
                      backgroundColor: "var(--bg-surface-secondary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="formPassword"
                  className="block text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Mot de passe
                </label>
                <input
                  id="formPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{
                    backgroundColor: "var(--bg-surface-secondary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {isSigningUp ? "S'inscrire" : "Se connecter"}
                </button>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded-full shadow-sm text-sm font-semibold transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                    backgroundColor: "transparent",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 6.5c1.61 0 3.05.66 4.08 1.73l3.06-3.06C17.46 3.12 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84C6.71 8.41 9.14 6.5 12 6.5z" />
                  </svg>
                  Continuer avec Google
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSigningUp)}
                  className="text-sm font-medium hover:underline focus:outline-none"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {isSigningUp
                    ? "Déjà un compte ? Se connecter"
                    : "Pas de compte ? S'inscrire"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          © 2025 MyEmpire — Tous droits réservés
        </div>
      </div>
    </div>
  );
};
