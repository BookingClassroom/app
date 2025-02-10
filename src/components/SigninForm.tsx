import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signin } from "@/services/auth.service";
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
import toast from "react-hot-toast";

const signinSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const SigninForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setError(null);
    const token = await signin(data.email, data.password);

    if (token) {
      toast.success("✅ Connexion réussie !");
      navigate("/");
    } else {
      toast.error("❌ Identifiants incorrects.");
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">Connexion</h2>
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
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SigninForm;
