'use client';

import React, { useState } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, useDisclosure, Input, addToast
} from '@heroui/react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../../firebaseconfig';

const EyeSlashFilledIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" width="1em" height="1em" fill="none">
        <path
            d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
            fill="currentColor"
        />
    </svg>
);

const EyeFilledIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" width="1em" height="1em" fill="none">
        <path
            d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969Z"
            fill="currentColor"
        />
    </svg>
);

interface RegisterModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onOpenChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const auth = getAuth(app);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const allowedDomains = ['@gmail.com', '@outlook.com', '@hotmail.com'];
        const emailDomain = email.includes('@') ? email.substring(email.lastIndexOf('@')) : '';
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!allowedDomains.includes(emailDomain)) {
            return addToast({
                title: "Error",
                description: "Solo se permiten correos de Gmail, Outlook o Hotmail.",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }

        if (!emailPattern.test(email)) {
            return addToast({
                title: "Error",
                description: "El correo no debe contener caracteres especiales.",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            addToast({
                title: "¡Éxito!",
                description: "Te has registrado exitosamente.",
                timeout: 1000,
                shouldShowTimeoutProgress: true,
                color: "success",
            });
            onOpenChange(false);
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error?.message || "Error desconocido al registrarse.",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Registro</ModalHeader>
                <form onSubmit={handleRegister}>
                    <ModalBody>
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor="email">Correo Electrónico</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor="password">Contraseña</label>
                            <Input
                                id="password"
                                type={isVisible ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                endContent={
                                    <button
                                        type="button"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setIsVisible(!isVisible)}
                                        className="focus:outline-none"
                                    >
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button color="primary" type="submit">Registrarse</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default RegisterModal;
