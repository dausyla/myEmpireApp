import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div
        className="p-12 shadow-2xl text-center rounded-3xl border-0 max-w-[600px] w-full mx-4"
        style={{
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-primary)",
        }}
      >
        <h1 className="font-bold mb-4 text-4xl">Welcome to MyEmpire</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Track, analyze, and predict your portfolio performance with ease.
        </p>

        <button
          className="px-8 py-4 rounded-full font-semibold shadow-md text-white transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--brand-gradient)" }}
          onClick={() => navigate("/app")}
        >
          🚀 Enter Your Empire
        </button>
      </div>
    </div>
  );
}
