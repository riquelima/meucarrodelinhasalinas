import React, { useState } from "react";
import { Car } from "lucide-react";

interface LogoProps {
  src?: string;
  className?: string;
  alt?: string;
  bgClass?: string; 
}

export function Logo({ src, className = "", alt = "Meu Carro de Linha", bgClass = "bg-gradient-to-br from-blue-600 to-green-600" }: LogoProps) {
  const envSrc = (import.meta as any).env?.VITE_LOGO_URL as string | undefined;
  const logoSrc = src || envSrc || "/logo.png" ;
  const [imgError, setImgError] = useState(false); 

  const showImage = !!logoSrc && !imgError;

  return (
    <div className={className}>
      {showImage ? (
        <img
          src={logoSrc}
          alt={alt}
          className="w-full h-full object-contain rounded-xl"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full ${bgClass} rounded-xl flex items-center justify-center`}>
          <Car className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}

export default Logo;
