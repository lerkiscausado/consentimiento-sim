"use client";

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { SignaturePad } from './signature-pad';

interface SignatureDialogProps {
    onAccept: (signatureData: string) => void;
    trigger?: React.ReactNode;
}

export const SignatureDialog: React.FC<SignatureDialogProps> = ({ onAccept, trigger }) => {
    const [tempSignature, setTempSignature] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = (dataUrl: string) => {
        setTempSignature(dataUrl);
    };

    const handleAccept = () => {
        if (tempSignature) {
            onAccept(tempSignature);
            setIsOpen(false);
            setTempSignature(null);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                {trigger || (
                    <button className="hidden">Open</button>
                )}
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-2xl bg-white dark:bg-portal-card rounded-2xl shadow-2xl p-0 overflow-hidden z-50 animate-in zoom-in-95 fade-in duration-300 border border-portal-border dark:border-gray-800">

                    {/* Header */}
                    <div className="bg-slate-50 dark:bg-gray-900 px-8 py-6 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center">
                        <div>
                            <Dialog.Title className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-portal-primary">edit_square</span>
                                Captura de Firma Digital
                            </Dialog.Title>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                                Por favor, firme dentro del recuadro inferior utilizando su mouse o pantalla táctil.
                            </p>
                        </div>
                        <Dialog.Close asChild>
                            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Body */}
                    <div className="p-8 pb-10">
                        <SignaturePad
                            onSave={handleSave}
                            onClear={() => setTempSignature(null)}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 bg-slate-50 dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex justify-end gap-4">
                        <Dialog.Close asChild>
                            <button className="px-6 py-2.5 font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                Cancelar
                            </button>
                        </Dialog.Close>
                        <button
                            onClick={handleAccept}
                            disabled={!tempSignature}
                            className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2 ${tempSignature
                                    ? 'bg-portal-primary hover:bg-portal-primary/90 hover:shadow-xl active:transform active:scale-95'
                                    : 'bg-slate-300 dark:bg-gray-700 cursor-not-allowed opacity-50'
                                }`}
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            Aceptar Firma
                        </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
