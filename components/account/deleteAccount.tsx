import React from "react";
import { Alert, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";

const DeleteAccountButton: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              if (!session?.user.id) {
                throw new Error("Utilisateur non authentifié.");
              }

              // Ici, nous effectuons un soft delete en mettant à jour un champ dans le profil.
              // Assurez-vous que la table profiles contient un champ, par exemple, "is_deleted" (booléen)
              const { error } = await supabase
                .from("profiles")
                .update({ is_deleted: true })
                .eq("id", session.user.id);

              if (error) throw error;

              // Déconnecte l'utilisateur
              const { error: signOutError } = await supabase.auth.signOut();
              if (signOutError) throw signOutError;

              Alert.alert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès."
              );
              // Redirige vers la page de connexion
              router.push("/(auth)/signIn");
            } catch (err: any) {
              Alert.alert("Erreur", err.message || "La suppression a échoué.");
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
      <Text style={styles.buttonText}>Supprimer mon compte</Text>
    </TouchableOpacity>
  );
};

export default DeleteAccountButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#EF4444", // Rouge pour la suppression
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
