
import React from 'react';

export const StarSpinner = ({ size = "w-12 h-12" }: { size?: string }) => {
    return (
        <div className={`relative ${size} animate-spin-slow`}>
            <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#FCD34D", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#B45309", stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="spinnerGlow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <polygon
                    points="20,4 23,13 34,13 25,20 28,31 20,25 12,31 15,20 6,13 17,13"
                    fill="url(#spinnerGradient)"
                    filter="url(#spinnerGlow)"
                />
            </svg>
        </div>
    );
};
