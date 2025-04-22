import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  User,
} from "@heroui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "firebaseconfig";
import RegisterModal from "@/components/Register/page";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavComponte() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal de registro
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [checkingAuth, setCheckingAuth] = useState(true); // Estado para saber si estamos verificando la autenticación

  const menuItems = [
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  // Verificar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
      } else {
        setUser(null);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null; // Mostrar algo mientras se verifica la autenticación

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <ThemeSwitcher />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">RMCDynamics</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link aria-current="page" href="/Home">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Mostrar el nombre del usuario si está autenticado */}
      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            {/* Hacer que el avatar actúe como enlace al perfil */}
            <Link href={`/Profile`}>
              <User
                avatarProps={{
                  src: user.photoURL || "", // Imagen de perfil o avatar predeterminado
                }}
                description="Usuario autenticado"
                name={user.displayName || user.email} // Nombre del usuario o correo
              />
            </Link>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="Login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                className="text-blue-500 hover:underline"
                onClick={() => setIsModalOpen(true)}
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <RegisterModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </Navbar>
  );
}
