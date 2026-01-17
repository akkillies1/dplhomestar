import React from 'react';

export const ExplodingCube = () => {
    return (
        <div className="w-10 h-10 md:w-14 md:h-14" style={{ perspective: '1200px' }}>
            <div
                className="relative w-full h-full group cursor-pointer"
                style={{
                    transformStyle: 'preserve-3d',
                    animation: 'cubeRotate 12s linear infinite'
                }}
            >
                {/* Faces Common Styles */}
                {[
                    { rotate: 'rotateY(0deg)', translate: 'translateZ(24px)' },   // Front
                    { rotate: 'rotateY(180deg)', translate: 'translateZ(24px)' }, // Back
                    { rotate: 'rotateY(90deg)', translate: 'translateZ(24px)' },  // Right
                    { rotate: 'rotateY(-90deg)', translate: 'translateZ(24px)' }, // Left
                    { rotate: 'rotateX(90deg)', translate: 'translateZ(24px)' },  // Top
                    { rotate: 'rotateX(-90deg)', translate: 'translateZ(24px)' }, // Bottom
                ].map((face, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent border border-white/10 transition-all duration-500 ease-out group-hover:border-red-500/30 group-hover:bg-red-500/5 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] rounded-sm cube-face-${index}`}
                        style={{
                            transform: `${face.rotate} ${face.translate}`,
                        }}
                    />
                ))}

                {/* Inner Core / Logo */}
                <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                        transform: 'translateZ(0px)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Removed backdrop-blur to keep text sharp */}
                    <div className="bg-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center w-6 h-6 md:w-8 md:h-8 z-10 relative">
                        <span className="text-red-600 font-serif font-bold text-lg md:text-2xl select-none leading-none z-20" style={{ textShadow: '0 0 1px rgba(0,0,0,0.1)' }}>
                            D
                        </span>
                    </div>
                    {/* Inner glowing core effect */}
                    <div className="absolute w-4 h-4 bg-red-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                </div>
            </div>

            <style>{`
        @keyframes cubeRotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        /* Stronger Expansion Effect on Hover using specific classes */
        .group:hover .cube-face-0 { transform: rotateY(0deg) translateZ(50px) !important; }
        .group:hover .cube-face-1 { transform: rotateY(180deg) translateZ(50px) !important; }
        .group:hover .cube-face-2 { transform: rotateY(90deg) translateZ(50px) !important; }
        .group:hover .cube-face-3 { transform: rotateY(-90deg) translateZ(50px) !important; }
        .group:hover .cube-face-4 { transform: rotateX(90deg) translateZ(50px) !important; }
        .group:hover .cube-face-5 { transform: rotateX(-90deg) translateZ(50px) !important; }
      `}</style>
        </div>
    );
};
