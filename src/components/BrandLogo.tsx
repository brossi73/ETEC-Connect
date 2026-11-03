import { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export function BrandLogo({ className = '', compact = false }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`flex items-center gap-3 select-none ${className}`}
        aria-label="Etec Prof. Dr. José Dagnoni — Centro Paula Souza"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold tracking-tight text-[#3E4E56]">
            Etec
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#B20000]">
            CPS
          </span>
        </div>
        {!compact && (
          <div className="text-xs leading-tight text-slate-600">
            <p className="font-semibold text-[#B20000]">Prof. Dr. José Dagnoni</p>
            <p className="text-[#3E4E56]">Santa Bárbara d&apos;Oeste</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/assets/aistudio/image_5f2cace4.png"
        alt="Logotipo Etec Prof. Dr. José Dagnoni — Santa Bárbara d'Oeste e Centro Paula Souza"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={
          compact
            ? 'h-9 w-auto max-w-[180px] object-contain'
            : 'h-12 w-auto max-w-[228px] object-contain'
        }
      />
    </div>
  );
}
