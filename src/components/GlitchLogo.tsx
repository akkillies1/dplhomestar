import { useState, useEffect } from "react";

export const GlitchLogo = ({ isScrolled }: { isScrolled: boolean }) => {
    const [text, setText] = useState("DCode");
    const targetText = "DCode";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    useEffect(() => {
        let iteration = 0;
        let interval: NodeJS.Timeout;

        const startAnimation = () => {
            clearInterval(interval);
            iteration = 0;

            interval = setInterval(() => {
                setText(prev =>
                    targetText
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return targetText[index];
                            }
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join("")
                );

                if (iteration >= targetText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        // Initial animation
        startAnimation();

        // Re-run animation on hover or interval if desired, 
        // but clarity animation usually runs on mount or view.

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span
                className={`font-serif font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-2xl md:text-3xl text-foreground" : "text-2xl md:text-3xl text-white/90"
                    }`}
            >
                The{" "}
            </span>
            <span
                className="font-serif font-bold tracking-tight text-2xl md:text-3xl text-red-600 transition-colors duration-300"
            >
                {text}
            </span>
            {/* Optional: Add a subtle cursor or glitch element if needed */}
        </div>
    );
};

