import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const root = window.document.documentElement;
        const initialTheme = root.classList.contains("dark") ? "dark" : "light";
        setTheme(initialTheme);
    }, []);

    const toggleTheme = () => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.remove("dark");
            setTheme("light");
            localStorage.setItem("theme", "light");
        } else {
            root.classList.add("dark");
            setTheme("dark");
            localStorage.setItem("theme", "dark");
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-white/10"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-accent" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all text-primary" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};
