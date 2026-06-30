import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY as string;
const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;
const FCM_TOKEN_KEY = 'stage_time_fcm_token';

export function useFCM() {
  const { user, sessionToken } = useAuth();

  useEffect(() => {
    // Only run if the user is signed in and messaging is supported
    if (!user || !sessionToken || !messaging) return;

    async function registerForPush() {
      // 1. Ask the user's permission to send notifications
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return;
      }

      // 2. Get the FCM device token for this browser
      // The VAPID key tells FCM this request is from your app (not someone else's)
      const token = await getToken(messaging!, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        ),
      });

      if (!token) return;

      // 3. Don't re-register the same token if we already sent it
      const stored = localStorage.getItem(FCM_TOKEN_KEY);
      if (stored === token) return;

      // 4. Send the token to our Worker to store in D1
      const res = await fetch(`${WORKER_URL}/auth/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          token,
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        localStorage.setItem(FCM_TOKEN_KEY, token);
      }
    }

    registerForPush().catch(console.error);
  }, [user, sessionToken]);
}
