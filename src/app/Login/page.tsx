'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { Button, Input } from "@heroui/react";
import app from "../../../firebaseconfig";
import Link from "next/link";
import RegisterModal from "@/components/Register/page";

// Íconos
const EyeSlashFilledIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" height="1em" width="1em">
    <path
      fill="currentColor"
      d="M21.27 9.18c-.29-.46-.6-.89-.92-1.29a1 1 0 0 0-1.49-.01L15.86 10.8c.22.66.26 1.42.06 2.21a4.02 4.02 0 0 1-3.9 2.9c-.7 0-1.35-.17-2.12-.46l-1.49 1.5c-.5.5-.34 1.36.35 1.6 1.07.41 2.18.62 3.27.62 1.78 0 3.51-.52 5.09-1.49 1.61-1 3.06-2.47 4.17-4.3.95-1.5.9-3.95-.9-6.2Z"
    />
    <path
      fill="currentColor"
      d="M14.02 9.98 9.98 14.02A3.05 3.05 0 0 1 9.14 12c0-1.57 1.27-2.86 2.86-2.86.78 0 1.49.31 2.02.84Z"
    />
    <path
      fill="currentColor"
      d="M18.25 5.75 14.86 9.14A3.99 3.99 0 0 0 12 7.96a4 4 0 0 0-4.04 4.04c0 1.1.45 2.1 1.18 2.83L5.76 18.25A12 12 0 0 1 2.75 14.84C1.75 13.27 1.75 10.72 2.75 9.15 3.91 7.33 5.33 5.9 6.91 4.92 8.49 3.96 10.22 3.43 12 3.43c2.23 0 4.39.82 6.25 2.32Z"
    />
    <path
      fill="currentColor"
      d="M14.86 12c0 1.58-1.28 2.86-2.86 2.86h-.14l3-3c.01.05.01.1.01.14Z"
    />
    <path
      fill="currentColor"
      d="M21.77 2.23a.75.75 0 0 0-1.09 0L2.23 20.69a.75.75 0 0 0 1.06 1.06L21.77 3.31a.75.75 0 0 0 0-1.08Z"
    />
  </svg>
);

const EyeFilledIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" height="1em" width="1em">
    <path
      fill="currentColor"
      d="M21.25 9.15C18.94 5.52 15.56 3.43 12 3.43c-1.78 0-3.51.52-5.09 1.49C5.33 5.9 3.91 7.33 2.75 9.15c-1 1.57-1 4.12 0 5.69 2.31 3.64 5.69 5.72 9.25 5.72 1.78 0 3.51-.52 5.09-1.49 1.58-1 3-2.43 4.16-4.26 1-1.56 1-4.11 0-5.66Zm-9.25 6.89a4.04 4.04 0 0 1 0-8.08 4.04 4.04 0 0 1 0 8.08Z"
    />
    <path
      fill="currentColor"
      d="M12 9.14a2.86 2.86 0 1 0 0 5.72 2.86 2.86 0 0 0 0-5.72Z"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Home");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push("/Home");
    } catch (error) {
      console.error("Error en el inicio anónimo:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center px-4" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Correo Electrónico</label>
            <Input
              isRequired
              value={email}
              type="email"
              label="Correo Electrónico"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
            <Input
              isRequired
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="focus:outline-none"
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              variant="bordered"
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full" color="primary" variant="solid">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
          <Link href="#" className="text-blue-600 hover:underline text-sm" onClick={() => setIsModalOpen(true)}>
            Regístrate aquí
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">¿Solo quieres explorar?</p>
          <Button
            onClick={handleAnonymousLogin}
            variant="solid"
            color="secondary"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 ease-in-out"
          >
            Iniciar como Invitado
          </Button>
        </div>
      </div>

      <RegisterModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
