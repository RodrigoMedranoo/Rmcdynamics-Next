'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from '@heroui/react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebaseconfig';

interface RegisterModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onOpenChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth(app);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const allowedDomains = ['@gmail.com', '@outlook.com', '@hotmail.com'];
        const emailDomain = email.substring(email.lastIndexOf('@'));
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!allowedDomains.includes(emailDomain)) {
            alert('Solo se permiten correos de Gmail, Outlook o Hotmail.');
            return;
        }

        if (!emailPattern.test(email)) {
            alert('El correo no debe contener caracteres especiales.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Te has registrado exitosamente.');
            onOpenChange(false); // Cierra el modal después del registro
        } catch (error) {
            alert('Error en el registro: ' + error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Registro</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleRegister}>
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
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button color="primary" onClick={handleRegister}>Registrarse</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RegisterModal;
