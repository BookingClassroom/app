import { useState } from "react";
import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import authImage from "../assets/images/formImg.jpg";
import { Card, CardContent } from "@/components/ui/card";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
        <Card className="w-full max-w-md shadow-xl border rounded-2xl p-6">
          <CardContent>
            {isLogin ? <SigninForm /> : <SignupForm />}

            <p className="text-gray-600 mt-6 text-center">
              {isLogin ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    className="text-primary font-semibold transition-colors duration-200 hover:text-primary/80 focus:outline-none"
                    onClick={() => setIsLogin(false)}
                  >
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    className="text-primary font-semibold transition-colors duration-200 hover:text-primary/80 focus:outline-none"
                    onClick={() => setIsLogin(true)}
                  >
                    Se connecter
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className="hidden md:block w-1/2 bg-cover bg-center relative shadow-lg"
        style={{ backgroundImage: `url(${authImage})` }}
      ></div>
    </div>
  );
};

export default AuthPage;
