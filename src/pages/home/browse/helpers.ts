import { createTheme } from "@mui/material";
import { Product } from "types";

type Emotion = "sad" | "angry" | "surprised" | "happy";

export const getRatingFromEmotion = (emotion: Emotion, product: Product) => {
    if (emotion === "angry") {
        return product.angryFoodRating;
    }
    if (emotion === "sad") {
        return product.sadFoodRating;
    }
    if (emotion === "happy") {
        return product.happyFoodRating;
    }
    if (emotion === "surprised") {
        return product.surpriseFoodRating;
    }
    return 0;
};

export const getThemeFromColor = (theme: string | undefined) => createTheme({
    palette: {
        primary: {
            main: theme || "#810202",
        },
    },
});