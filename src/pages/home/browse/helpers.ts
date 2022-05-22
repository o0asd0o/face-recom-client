import { createTheme } from "@mui/material";
import { Product } from "types";

type Emotion = "sad" | "happy";

export const getRatingFromEmotion = (emotion: Emotion, product: Product) => {
  if (emotion === "sad") {
    return product.sadFoodRating;
  }
  if (emotion === "happy") {
    return product.happyFoodRating;
  }
  return 0;
};

export const getThemeFromColor = (theme: string | undefined) =>
  createTheme({
    palette: {
      primary: {
        main: theme || "#810202",
      },
    },
  });

export const getEmotionLabelEquivalent = (emotion: Emotion) => {
  const sad =
    "You look like you're not in the mood, have some food to uplift your mood";
  const happy = "You look amazing, let's celebrate! Have some food";

  return emotion === "sad" ? sad : happy;
};
