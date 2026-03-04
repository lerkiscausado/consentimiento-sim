"use client";

import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onClear?: () => void;
    width?: number;
    height?: number;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
    onSave,
    onClear,
    width = 600,
    height = 300
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set line styles
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000'; // Pure black for signatures
    }, []);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            // Touch event
            const touch = e.touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        } else {
            // Mouse event
            return {
                x: (e as React.MouseEvent).clientX - rect.left,
                y: (e as React.MouseEvent).clientY - rect.top
            };
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e.nativeEvent);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e.nativeEvent);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL('image/png'));
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            onClear?.();
        }
    };

    // Prevent scrolling when drawing on touch devices
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const preventDefault = (e: TouchEvent) => {
            if (isDrawing) e.preventDefault();
        };

        canvas.addEventListener('touchstart', preventDefault as any, { passive: false });
        canvas.addEventListener('touchmove', preventDefault as any, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', preventDefault as any);
            canvas.removeEventListener('touchmove', preventDefault as any);
        };
    }, [isDrawing]);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-crosshair shadow-inner touch-none">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="max-w-full h-auto"
                />
            </div>
            <div className="flex gap-4 w-full">
                <button
                    onClick={clear}
                    className="flex-1 py-3 px-6 rounded-lg font-bold text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">delete</span>
                    Limpiar
                </button>
            </div>
        </div>
    );
};
