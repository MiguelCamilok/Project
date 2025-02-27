import React from "react";
import "../ThemeToggle.css";

const ThemeToggle = ({ toggleTheme }) => {
    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            🌙
        </button>
    );
};

export default ThemeToggle;
