import { useState } from "react";
import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import authImage from "../assets/images/formImg.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted to-primary/10">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
        <Card className="w-full max-w-md shadow-2xl border border-border rounded-2xl p-8 bg-card backdrop-blur-lg">
          <CardContent>
            {isLogin ? <SigninForm /> : <SignupForm />}

            <p className="text-muted-foreground mt-6 text-center">
              {isLogin ? (
                <>
                  Pas encore de compte ?{" "}
                  <Button
                    variant="link"
                    className="text-primary font-semibold transition-transform duration-300 hover:scale-105"
                    onClick={() => setIsLogin(false)}
                  >
                    S'inscrire
                  </Button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <Button
                    variant="link"
                    className="text-primary font-semibold transition-transform duration-300 hover:scale-105"
                    onClick={() => setIsLogin(true)}
                  >
                    Se connecter
                  </Button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className="hidden md:block w-1/2 bg-cover bg-center relative shadow-xl rounded-l-2xl"
        style={{ backgroundImage: `url(${authImage})` }}
      ></div>
    </div>
  );
};

export default AuthPage;
