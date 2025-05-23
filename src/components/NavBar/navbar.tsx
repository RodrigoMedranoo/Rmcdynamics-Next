"use client";

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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "firebaseconfig";
import RegisterModal from "@/components/Register/page";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { usePathname } from "next/navigation";

export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function NavComponent() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(getAuth(app));
      setUser(null);
      setIsMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const authMenuItems = user
    ? [
      {
        name: "Perfil",
        path: "/Profile",
        isActive: pathname === "/Profile",
      },
      {
        name: "Log Out",
        action: handleLogout,
      },
    ]
    : [
      {
        name: "Login",
        path: "/Login",
        isActive: pathname === "/Login",
      },
      {
        name: "Sign Up",
        action: () => setIsModalOpen(true),
      },
    ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (userFirebase) => {
      setUser(userFirebase || null);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null;

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <ThemeSwitcher />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">RMCDynamics</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Escritorio */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/Home"}>
          <Link href="/Home">Inicio</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? (
          <NavbarItem className="hidden sm:flex">
            <Link href="/Profile">
              <User
                avatarProps={{ src: user.photoURL || "" }}
                description="Usuario autenticado"
                name={user.displayName || user.email}
              />
            </Link>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/Login">Login</Link>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button color="primary" onClick={() => setIsModalOpen(true)} variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Menú móvil */}
      <NavbarMenu>
        {/* SIEMPRE visible */}
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/Home"
            className="w-full"
            size="lg"
            variant="light"
            color={pathname === "/Home" ? "primary" : "default"}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Button>
        </NavbarMenuItem>

        {authMenuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            {item.action ? (
              <Button
                onClick={() => {
                  item.action();
                  setIsMenuOpen(false);
                }}
                className="w-full"
                size="lg"
                color={item.name === "Log Out" ? "danger" : "default"}
                variant="light"
              >
                {item.name}
              </Button>
            ) : (
              <Button
                as={Link}
                href={item.path}
                className="w-full"
                size="lg"
                variant="light"
                color={item.isActive ? "primary" : "default"}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Button>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <RegisterModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </Navbar>
  );
}