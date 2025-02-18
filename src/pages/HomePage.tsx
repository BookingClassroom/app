import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-3xl text-center shadow-lg border rounded-lg p-8 bg-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gray-800">
            Bienvenue sur BookingClassroom
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 text-lg leading-relaxed">
          <p>
            BookingClassroom est une plateforme de réservation de salles
            simplifiée pour les étudiants. Réservez un créneau en quelques
            clics.
          </p>
          <p className="mt-4 font-medium text-gray-700">
            Connectez-vous pour accéder aux fonctionnalités de réservation !
          </p>

          {/* Bouton pour rediriger vers l'authentification */}
          <div className="mt-6 flex justify-center">
            <Button
              className="px-6 py-3 text-lg"
              onClick={() => navigate("/auth")}
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
