import { useState } from "react";
import { LoginLayout } from "./components/LoginLayout";
import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";
import { Divider } from "./components/Divider";
import { SocialLogin } from "./components/SocialLogin";

export const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <LoginLayout>
      <div className="p-8 sm:p-10">
        <LoginHeader isSignup={isSignup} />
        <LoginForm isSignup={isSignup} setIsSignup={setIsSignup} />
        <Divider />
        <SocialLogin />
      </div>
    </LoginLayout>
  );
};
