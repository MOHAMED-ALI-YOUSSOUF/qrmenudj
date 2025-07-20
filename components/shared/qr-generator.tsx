'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  logoUrl?: string;
}

export default function QRGenerator({ value, size = 200, className = '', logoUrl }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });

        if (logoUrl) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          logo.onload = () => {
            const logoSize = size * 0.2;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(x - 6, y - 6, logoSize + 12, logoSize + 12, 10);
            ctx.fill();
            ctx.drawImage(logo, x, y, logoSize, logoSize);
          };
          logo.src = logoUrl;
        }
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
      }
    };
    generateQR();
  }, [value, size, logoUrl]);

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
      />
    </div>
  );
}