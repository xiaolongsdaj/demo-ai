'use client'
import React, { useEffect, useRef } from 'react';
import { SignIn as ClerkSignIn } from '@clerk/nextjs';

interface SignInProps {
  show: boolean;
  onClose: () => void;
}

export default function SignIn({ show, onClose }: SignInProps) {
  const signInRef = useRef<HTMLDivElement>(null);
  
  // 点击外部区域关闭登录框
  useEffect(() => {
    if (!show) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4" ref={signInRef}>
        <ClerkSignIn 
        />
      </div>
    </div>
  );
}