import React from "react";

interface LoginHeaderProps {
  isSignup: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ isSignup }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="font-bold text-3xl mb-2 text-gray-900 dark:text-white">
        {isSignup ? "Créer un compte" : "Bon retour"}
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        {isSignup
          ? "Commencez votre aventure MyEmpire"
          : "Accédez à votre tableau de bord"}
      </p>
    </div>
  );
};
