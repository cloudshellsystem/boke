import React from "react";
import AuthForm from "./AuthForm";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md">
        {/* On injecte le vrai formulaire qui gère les e-mails Supabase */}
        <AuthForm 
          onClose={onClose} 
          onAuthSuccess={() => {
            if (onAuthSuccess) onAuthSuccess();
            if (onClose) onClose();
          }} 
        />
      </div>
    </div>
  );
}
