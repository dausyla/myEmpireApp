export const Divider = () => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white/0 dark:bg-[#181b21]/0 backdrop-blur-sm text-gray-500">
          Ou continuer avec
        </span>
      </div>
    </div>
  );
};
