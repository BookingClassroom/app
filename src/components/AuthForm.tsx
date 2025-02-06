import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signin, signup } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const authSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setError(null);

    if (isLogin) {
      const token = await signin(data.email, data.password);
      if (token) {
        navigate("/");
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
      }
    } else {
      const success = await signup(data.email, data.password, "John Doe");
      if (success) {
        navigate("/");
      } else {
        setError("Échec de l'inscription. Essayez avec un autre email.");
      }
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Votre email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Votre mot de passe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>
      </Form>
      <p className="text-gray-600 mt-4 text-center">
        {isLogin ? (
          <>
            Pas encore de compte ?{" "}
            <Button
              variant="link"
              className="text-primary"
              onClick={() => setIsLogin(false)}
            >
              Inscrivez-vous
            </Button>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Button
              variant="link"
              className="text-primary"
              onClick={() => setIsLogin(true)}
            >
              Connectez-vous
            </Button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
