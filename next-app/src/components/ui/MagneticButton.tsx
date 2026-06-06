'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function MagneticButton({ 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(text, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative group transition-colors ${className}`}
    >
      <span ref={textRef} className="relative z-10 block pointer-events-none">
        {children}
      </span>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-0"></div>
    </button>
  );
}
