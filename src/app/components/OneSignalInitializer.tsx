"use client";
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  useEffect(() => {
    OneSignal.init({
      appId: "a68a8317-e9d4-4ea6-a31c-516bfcac8d1a",
      allowLocalhostAsSecureOrigin: true,
      
      promptOptions: {
        slidedown: {
          prompts: [{
            type: "push",
            autoPrompt: true,
            text: {
              actionMessage: "Vorresti ricevere notifiche quando arrivano nuovi ordini?",
              acceptButton: "Sì, attiva",
              cancelButton: "Non ora",
            },
            delay: {
              pageViews: 1,
              timeDelay: 5,
            }
          }]
        }
      },

      welcomeNotification: {
        title: "Forno Artigianale",
        message: "Perfetto! Ora riceverai una notifica per ogni nuovo ordine.",
      },

      notifyButton: {
        enable: true,
        text: {
          'tip.state.unsubscribed': 'Iscriviti alle notifiche',
          'tip.state.subscribed': "Sei iscritto alle notifiche",
          'tip.state.blocked': "Hai bloccato le notifiche",
          'message.prenotify': 'Clicca per ricevere notifiche sugli ordini',
          'dialog.main.title': 'Gestisci notifiche del Forno',
          'dialog.main.button.subscribe': 'ISCRIVITI',
          'dialog.main.button.unsubscribe': 'DISISCRIVITI',
        }
      },
    } as any).then(() => {
      // --- INIZIO MODIFICA ---
      // Questo codice viene eseguito solo quando OneSignal è pronto
      OneSignal.User.addTag("role", "staff");
      console.log("Ruolo Staff impostato correttamente");
      // --- FINE MODIFICA ---
    });
  }, []);

  return null;
}