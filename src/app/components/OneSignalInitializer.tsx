"use client";
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  useEffect(() => {
    OneSignal.init({
      appId: "a68a8317-e9d4-4ea6-a31c-516bfcac8d1a",
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
    } as any); // <--- Questo 'as any' risolve l'errore rosso!
  }, []);

  return null;
}