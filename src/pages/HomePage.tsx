import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted to-primary/20 p-6">
      {/* Ajout d'un effet visuel dynamique */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>

      <Card className="max-w-3xl text-center shadow-2xl border border-border rounded-2xl p-10 bg-card backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold text-primary drop-shadow-md">
            Bienvenue sur BookingClassroom
          </CardTitle>
        </CardHeader>
        <CardContent className="text-foreground text-lg leading-relaxed">
          <p>
            BookingClassroom est une plateforme de réservation de salles
            simplifiée pour les étudiants. Réservez un créneau en quelques
            clics.
          </p>
          <p className="mt-6 font-semibold text-secondary-foreground">
            Connectez-vous pour accéder aux fonctionnalités de réservation !
          </p>

          {/* Bouton stylisé avec animation */}
          <div className="mt-8 flex justify-center">
            <Button
              className="px-8 py-3 text-lg font-semibold bg-primary text-primary-foreground rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-out"
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
