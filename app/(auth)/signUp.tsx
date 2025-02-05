import * as React from "react";
import { Text, TextInput, Button, View } from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { client } from "@/hooks/supabaseClient";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (user) {
      await createUserInDb(user);
    } else {
      console.error("Aucun utilisateur Clerk trouvé");
    }

    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        if (user) {
          await createUserInDb(user);
        } else {
          console.error("Aucun utilisateur Clerk trouvé");
        }

        router.replace("/");
      } else {
        console.error(
          "Vérification incomplète :",
          JSON.stringify(signUpAttempt, null, 2)
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Exemple d'insertion dans la table "users"
  const createUserInDb = async (clerkUser: any) => {
    const { id, emailAddresses, imageUrl, firstName, lastName } = clerkUser;
    // On suppose que clerkUser.emailAddresses est un tableau et que vous souhaitez utiliser le premier email
    const email = emailAddresses?.[0]?.emailAddress || "";

    const { data, error } = await client.from("test").insert([
      {
        email: "preneus@example.com",
        // Ajoutez d'autres champs si nécessaire
      },
    ]);

    if (error) {
      console.error("Erreur lors de l'insertion dans Supabase :", error);
    } else {
      console.log("Utilisateur inséré dans Supabase :", data);
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </>
    );
  }

  return (
    <SafeAreaView>
      <Text>Sign up</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Continue" onPress={onSignUpPress} />
    </SafeAreaView>
  );
}
