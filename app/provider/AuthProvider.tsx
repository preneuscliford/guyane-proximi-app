import { StyleSheet, Text, View } from "react-native";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

type AuthContext = {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  userData: null,
});

interface UserData {
  avatar_url: string;
  username: string;
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserdata] = useState<UserData | null>(null);

  // const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, id`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      setUserdata(data as any);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    } finally {
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Récupérer la session actuelle
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        const user = session.user;

        const userDetails = {
          UID: user.id, // ID unique
          displayName: user.user_metadata?.name || "N/A", // Nom affiché (si configuré)
          email: user.email, // Email
          phone: user.phone, // Téléphone
          providers: user.app_metadata?.providers || [], // Liste des providers (e.g., ['google'])
          providerType: user.app_metadata?.provider || "N/A", // Type de provider principal
          createdAt: user.created_at, // Date de création
          lastSignInAt: session.expires_at, // Date d'expiration (approximation de dernière connexion)
        };

        console.log("User Details:", userDetails);

        return userDetails;
      } else {
        console.log("No active session");
        return null;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
      return null;
    }
  };

  fetchUserDetails();

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        userData: userData || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
