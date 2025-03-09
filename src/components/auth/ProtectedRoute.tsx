import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Pour la démo, on ne vérifie pas l'authentification
  // et on affiche toujours le contenu protégé
  return <>{children}</>;
}
