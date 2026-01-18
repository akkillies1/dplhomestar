
import React from 'react';

interface LogoProps {
    className?: string;
    isScrolled?: boolean;
}

export const Logo = ({ className = "w-40 h-auto", isScrolled = false }: LogoProps) => {
    // We can use isScrolled to toggle classes or styles if needed later, 
    // but for now we render the user-provided SVG as is.
    return (
        <svg
            width="400"
            height="100"
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Glow filter for the star and particles */}
                <filter id="goldGlow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Gradient for the text (Lighter Blue for Dark Theme) */}
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#93C5FD", stopOpacity: 1 }} />
                </linearGradient>

                {/* Gradient for the Star (Gold) */}
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#FCD34D", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#B45309", stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* The Text "DPL Home" */}
            <text
                x="25"
                y="62"
                fontFamily="'Outfit', sans-serif"
                fontSize="42"
                fill="url(#textGradient)"
                letterSpacing="-0.5"
            >
                <tspan fontWeight="700">DPL</tspan>
                <tspan dx="12" fontWeight="800">Home</tspan>
            </text>

            {/* Animated Star & Effects (The "star" in Homestar) */}
            {/* Moved slightly right to accommodate the new text width */}
            <g transform="translate(285, 54) scale(1.4)">

                {/* Pulsating Radiations (Rings emanating outwards) */}
                <circle r="12" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0">
                    <animate attributeName="r" values="12; 40" dur="2.5s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="opacity" values="0.6; 0" dur="2.5s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="stroke-width" values="1.5; 0" dur="2.5s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle r="12" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0">
                    <animate attributeName="r" values="12; 40" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                    <animate attributeName="opacity" values="0.6; 0" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                    <animate attributeName="stroke-width" values="1.5; 0" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                </circle>

                {/* Pouring Stardust (Gold particles falling down) */}
                <g fill="#FCD34D" filter="url(#goldGlow)">
                    {/* Particle 1 */}
                    <circle cx="-6" cy="10" r="1.5" opacity="0">
                        <animate attributeName="cy" values="10; 45" dur="2s" repeatCount="indefinite" begin="0s" />
                        <animate attributeName="cx" values="-6; -12" dur="2s" repeatCount="indefinite" begin="0s" />
                        <animate attributeName="opacity" values="1; 0" dur="2s" repeatCount="indefinite" begin="0s" />
                    </circle>
                    {/* Particle 2 */}
                    <circle cx="6" cy="8" r="1.2" opacity="0">
                        <animate attributeName="cy" values="8; 40" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                        <animate attributeName="cx" values="6; 14" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                        <animate attributeName="opacity" values="1; 0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                    {/* Particle 3 */}
                    <circle cx="0" cy="12" r="1" opacity="0">
                        <animate attributeName="cy" values="12; 50" dur="1.8s" repeatCount="indefinite" begin="1s" />
                        <animate attributeName="opacity" values="1; 0" dur="1.8s" repeatCount="indefinite" begin="1s" />
                    </circle>
                </g>

                {/* CLASSIC 5-POINT STAR SHAPE */}
                <polygon points="0,-20 6,-7 20,-7 9,2 13,16 0,8 -13,16 -9,2 -20,-7 -6,-7" fill="url(#starGradient)" stroke="#F59E0B" strokeWidth="1">
                    {/* Subtle Pulse */}
                    <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="3s" repeatCount="indefinite" />
                    {/* Rotate/Wobble slightly to catch light */}
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0; 10 0 0; 0 0 0; -10 0 0; 0 0 0" dur="6s" repeatCount="indefinite" additive="sum" />
                </polygon>

                {/* Inner bright center for shine */}
                <circle r="3" fill="#FFFFFF" opacity="0.9" filter="url(#goldGlow)">
                    <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.5s" repeatCount="indefinite" />
                </circle>

            </g>

        </svg>
    );
};
