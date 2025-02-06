import AuthForm from "../components/AuthForm";
import authImage from "../assets/images/formImg.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Partie gauche */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
        <Card className="w-full max-w-md shadow-xl border rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Bienvenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>

      {/* Partie droite */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center relative shadow-lg"
        style={{ backgroundImage: `url(${authImage})` }}
      ></div>
    </div>
  );
};

export default AuthPage;
