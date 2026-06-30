import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

interface AppUser {
  uid: string;
  email: string;
  name?: string;
  photo?: string;
  display_name?: string;
  photo_url?: string;
}

interface AuthContextType {
  user: AppUser | null;
  sessionToken: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;
const SESSION_KEY = 'stage_time_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY)
  );
  const [loading, setLoading] = useState(true);

  // When app loads, if we have a session token, fetch the user profile
  useEffect(() => {
    if (sessionToken) {
      fetch(`${WORKER_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((u) => {
          if (u) setUser(u as AppUser);
          else {
            // Session expired or invalid — clear it
            localStorage.removeItem(SESSION_KEY);
            setSessionToken(null);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

  const signIn = async () => {
    // 1. Sign in with Google popup — Firebase handles all the OAuth steps
    const result = await signInWithPopup(auth, provider);

    // 2. Get the Firebase ID token — this is what proves identity to our Worker
    const idToken = await result.user.getIdToken();

    // 3. Send the ID token to our Worker to create a session
    const res = await fetch(`${WORKER_URL}/auth/login`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!res.ok) {
      throw new Error('Login failed — Worker rejected the token');
    }

    const data = await res.json() as { sessionToken: string; user: AppUser };

    // 4. Store the session token in localStorage
    localStorage.setItem(SESSION_KEY, data.sessionToken);
    setSessionToken(data.sessionToken);
    setUser(data.user);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem(SESSION_KEY);
    setSessionToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
