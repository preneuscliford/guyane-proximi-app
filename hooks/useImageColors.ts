import { supabase } from '@/lib/supabase';
import ImageColors, { getColors } from 'react-native-image-colors'


export const getDominantColor = async (filename: string): Promise<string> => {
  try {
    const { data } = supabase.storage.from( "services").getPublicUrl(filename);
    const result = await ImageColors.getColors(data.publicUrl, {
      fallback: "#FFFFFF",
      cache: true,
      key: filename, // Utilisez le nom de fichier comme clé de cache unique
    });

    return result.platform === "android" 
      ? result.dominant || result.average || "#FFFFFF"
      : result.platform === "ios"
        ? result.primary || result.secondary || "#FFFFFF"
        : result.dominant || result.vibrant  || "#FFFFFF";
  } catch (error) {
    console.error("Erreur avec l'image", filename, ":", error);
    return "#FFFFFF";
  }
};


export const getContrastType = (hexColor: string): "light" | "dark" | "inverted" | "auto" => {
  if (!hexColor || hexColor.length !== 7 || hexColor[0] !== "#") {
    return "auto"; // Valeur de fallback si le format est incorrect
  }

  // Conversion hex -> RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calcul de la luminance (perception humaine)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance > 0.5) {
    return "inverted"; // Très clair, on inverse les couleurs
  } else if (luminance > 0.6) {
    return "auto"; // Moyen, laisser automatique
  } else {
    return "dark"; // Couleur foncée, texte clair recommandé
  }
};
