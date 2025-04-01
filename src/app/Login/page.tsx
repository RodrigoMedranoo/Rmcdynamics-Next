'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Input } from "@heroui/react";
import app from "../../../firebaseconfig";
import Link from "next/link";
import RegisterModal from "@/Register/page"; // Asegúrate de que el import sea correcto

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = getAuth(app);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal de registro

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Home");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-semibold text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <Input
              isRequired
              value={email}
              className="max-w-xs"
              label="Correo Electronico"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <Input
              isRequired
              className="max-w-xs"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" color="primary" variant="ghost">
            Iniciar Sesión
          </Button>
        </form>
        <p className="text-center mt-4 text-sm">
          ¿No tienes una cuenta?{" "}
          <Link
            href="#"
            className="text-blue-500 hover:underline"
            onClick={() => setIsModalOpen(true)} // Abre el modal de registro
          >
            Regístrate
          </Link>
        </p>
      </div>

      {/* Modal de registro que se abre desde el login */}
      <RegisterModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
