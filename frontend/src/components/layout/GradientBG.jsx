// components/BackgroundGradientAnimation.js
import React, { useEffect, useRef, useState } from 'react';

const GradientBG = ({ children, className }) => {
  const interactiveRef = useRef(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty('--gradient-background-start', 'rgb(108, 0, 162)');
    document.body.style.setProperty('--gradient-background-end', 'rgb(0, 17, 82)');
    document.body.style.setProperty('--first-color', '18, 113, 255');
    document.body.style.setProperty('--second-color', '221, 74, 255');
    document.body.style.setProperty('--third-color', '100, 220, 255');
    document.body.style.setProperty('--fourth-color', '200, 50, 50');
    document.body.style.setProperty('--fifth-color', '180, 180, 50');
    document.body.style.setProperty('--pointer-color', '140, 100, 255');
    document.body.style.setProperty('--size', '80%');
    document.body.style.setProperty('--blending-value', 'hard-light');
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    move();
  }, [tgX, tgY]);

  return (
    <div
      className={`h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))] ${className}`}
      ref={interactiveRef}
    >
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)] mix-blend-mode-[var(--blending-value)] animate-moveVertical"></div>
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)] mix-blend-mode-[var(--blending-value)] animate-moveInCircle"></div>
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)] mix-blend-mode-[var(--blending-value)] animate-moveInCircle"></div>
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)] mix-blend-mode-[var(--blending-value)] animate-moveHorizontal"></div>
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)] mix-blend-mode-[var(--blending-value)] animate-moveInCircle"></div>
      {children}
    </div>
  );
};

export default GradientBG;