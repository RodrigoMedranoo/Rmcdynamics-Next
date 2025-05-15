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
import RegisterModal from "@/components/Register/page";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "firebaseconfig";
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

export default function NavComponentProgress() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        // Obtenemos la ruta actual de manera segura
        if (typeof window !== "undefined") {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    const mainMenuItems = [
        { name: "Inicio", path: "/Home", isActive: currentPath === "/Home" },
        { name: "Progreso", path: "#", isActive: currentPath === "#" },
    ];

    const handleLogout = async () => {
        try {
            await signOut(getAuth(app));
            setUser(null);
            setIsMenuOpen(false);
            // Redirección segura sin depender del router
            window.location.href = "/";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const menuItems = user
        ? [
            { name: "Perfil", path: "/Profile", isActive: currentPath === "/Profile" },
            { name: "Log Out", action: handleLogout, isActive: false },
        ]
        : [
            { name: "Login", path: "/Login", isActive: currentPath === "/Login" },
            { name: "Sign Up", action: () => setIsModalOpen(true), isActive: false },
            { name: "Help & Feedback", path: "/help", isActive: currentPath === "/help" },
        ];

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

    if (checkingAuth) return null;

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <ThemeSwitcher />

            <NavbarContent>
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
                {mainMenuItems.map((item, index) => (
                    <NavbarItem key={index} isActive={item.isActive}>
                        <Link href={item.path}>{item.name}</Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                {user ? (
                    <NavbarItem className="hidden sm:flex">
                        <Link href="/Profile">
                            <User
                                avatarProps={{
                                    src: user.photoURL || "",
                                }}
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
                        <NavbarItem>
                            <Button
                                color="primary"
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
                {/* Menú principal */}
                {mainMenuItems.map((item, index) => (
                    <NavbarMenuItem key={`main-${index}`}>
                        <Button
                            as={Link}
                            className="w-full"
                            color={item.isActive ? "primary" : "default"}
                            href={item.path}
                            size="lg"
                            variant="light"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Button>
                    </NavbarMenuItem>
                ))}

                {/* Menú de usuario */}
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.name}-${index}`}>
                        {item.action ? (
                            <Button
                                className="w-full"
                                color={item.name === "Log Out" ? "danger" : "default"}
                                onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                }}
                                size="lg"
                                variant="light"
                            >
                                {item.name}
                            </Button>
                        ) : (
                            <Button
                                as={Link}
                                className="w-full"
                                color={item.isActive ? "primary" : "default"}
                                href={item.path}
                                size="lg"
                                variant="light"
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