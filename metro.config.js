const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Ajouter "lottie" à la liste des extensions d'actifs
    assetExts: [
      ...defaultConfig.resolver.assetExts.filter((ext) => ext !== "json"),
      "lottie",
    ],
    sourceExts: [...defaultConfig.resolver.sourceExts, "json"], // Autoriser les fichiers JSON (pour Lottie)
  },
};

// Intégrer NativeWind à la configuration
module.exports = withNativeWind(
  {
    ...defaultConfig,
    ...config,
  },
  { input: "./globals.css" } // Spécifiez le chemin de votre fichier CSS global pour Tailwind
);
