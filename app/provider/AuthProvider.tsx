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
