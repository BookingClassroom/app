"use client";
import { useEffect, useState } from "react";
// @ts-ignore
import confetti from "canvas-confetti";

const RlyImportantComponent = () => {
  const konamiCode = [
    "ArrowUp",
    "ArrowDown",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];
  const [_input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setInput((prev) => {
        const newInput = [...prev, event.key].slice(-konamiCode.length);

        if (JSON.stringify(newInput) === JSON.stringify(konamiCode)) {
          launchConfetti();
          return [];
        }
        return newInput;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const launchConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = [
      ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#ff99ac"],
      ["#006eff", "#00bfff", "#0096c7", "#5bc0eb", "#002855"],
      ["#ffcc00", "#ff9900", "#ff6600", "#ff4400", "#cc2200"],
      ["#00ff66", "#00cc44", "#009933", "#00802b", "#004d1a"],
      ["#800080", "#a020f0", "#dda0dd", "#e6a8d7", "#663399"],
    ];

    const frame = () => {
      const colorSet = colors[Math.floor(Math.random() * colors.length)];

      confetti({
        particleCount: 10,
        spread: 180,
        startVelocity: 40,
        gravity: 0.6,
        scalar: 1.2,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        shapes: ["square", "circle", "star"],
        colors: colorSet,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return null;
};

export default RlyImportantComponent;
