import React, { useState } from react;
import { useAuth } from ..contextAuthContext;
import { useLanguage } from ..contextLanguageContext;

export default function AuthModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const { login } = useAuth();
  
  const [authTab, setAuthTab] = useState(register);
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  if (!isOpen) return null;

  const handleAuthSubmit = (e) = {
    e.preventDefault();
    login.({ email emailInput });
    onClose();
    alert(lang === en  Successfully connected!  Connexion réussie ! Bienvenue sur Boké One.);
  };

  return (
    div className=fixed inset-0 z-50 flex items-center justify-center bg-black85 p-4 backdrop-blur-md
      div className=bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 smp-8 space-y-6 relative shadow-2xl
        button 
          type=button
          onClick={onClose}
          className=absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hoverbg-neutral-700 transition cursor-pointer
        
          ✕
        button

        div className=flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800
          button
            type=button
            onClick={() = setAuthTab(register)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              authTab === register  bg-amber-500 text-neutral-950 shadow  text-neutral-400 hovertext-white
            }`}
          
            S'inscrire
          button
          button
            type=button
            onClick={() = setAuthTab(login)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              authTab === login  bg-amber-500 text-neutral-950 shadow  text-neutral-400 hovertext-white
            }`}
          
            Se connecter
          button
        div

        div className=space-y-1 text-center
          h3 className=text-lg font-black text-white
            {authTab === register  Rejoignez le réseau Boké One  Accès Membre Boké One}
          h3
          p className=text-xs text-neutral-400
            {authTab === register 
               Créez votre compte pour réserver vos prestataires en toute sécurité. 
               Connectez-vous pour retrouver votre panier et vos réservations.}
          p
        div

        form onSubmit={handleAuthSubmit} className=space-y-4
          div className=space-y-1.5
            label className=text-[11px] font-bold text-neutral-300Adresse emaillabel
            input
              type=email
              required
              placeholder=nom@exemple.com
              value={emailInput}
              onChange={(e) = setEmailInput(e.target.value)}
              className=w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focusborder-amber-500
            
          div

          div className=space-y-1.5
            label className=text-[11px] font-bold text-neutral-300Mot de passelabel
            input
              type=password
              required
              placeholder=••••••••
              value={passwordInput}
              onChange={(e) = setPasswordInput(e.target.value)}
              className=w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focusborder-amber-500
            
          div

          button
            type=submit
            className=w-full bg-amber-500 hoverbg-amber-400 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg
          
            {authTab === register  Créer mon compte  Se connecter}
          button
        form
      div
    div
  );
}