import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GitHubLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // Simuler un délai de chargement pour l'effet visuel
      setTimeout(() => {
        // Rediriger directement vers le dashboard en utilisant navigate
        // pour une navigation côté client plus fiable
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full flex items-center gap-2"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Github className="h-5 w-5" />
      )}
      {isLoading ? "Connecting..." : "Sign in with GitHub"}
    </Button>
  );
}
