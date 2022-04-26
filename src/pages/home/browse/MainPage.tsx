import styled from "@emotion/styled";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Theme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { onProductsSnapshot } from "providers/products";
import React, { useEffect, useMemo, useState } from "react";
import { Product, WebPage } from "types";
import { Header } from "../common/styled";
import { useQuery } from "react-query";
import http from "_utils/http";
import { Emotion } from "types";
import { onWebPageSnapshot } from "providers/webPage";
import RecipeReviewCard from "./ProductCard";
import { getThemeFromColor } from "./helpers";
import { Link } from "react-router-dom";
import { toTitleCase } from "_utils/helpers";
import CollapsibleProducts from "./CallapsibleProducts";

type Props = {
  currentEmotion: Emotion;
  preferences: string[];
};

export type Score = {
  id: string;
  score: number;
};

type Response = {
  message: string;
  similarDocsMapping: Record<string, Score[]>;
};

const EmotionContainer = styled(Box)`
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  position: relative;
`;

export const StoreHeader = styled("div")<{ theme?: string }>`
  padding: 20px;
  background: ${(props) => props.theme || "#81c784"}12;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  border: 1px solid #3333330f;
  justify-content: center;
  align-items: center;
`;

const EmotionText = styled("p")`
  position: absolute;
  bottom: -33px;
  right: 0px;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 700;
  color: #b6b1b1;
  width: 70px;
  text-align: center;
`;

const RecommendHeader = styled("div")`
  text-align: center;
  margin-bottom: 20px;
  font-size: 37px;
  font-family: "Rubik";
  margin-top: 20px;
`;

const MainPage: React.FC<Props> = ({ currentEmotion, preferences }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [webpages, setWebPages] = useState<WebPage[]>([]);

  useEffect(() => {
    const unsub1 = onProductsSnapshot((snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((product) => {
        prods.push({
          id: product.id,
          sadFoodRating: product.data().sadFoodRating,
          happyFoodRating: product.data().happyFoodRating,
          surpriseFoodRating: product.data().surpriseFoodRating,
          angryFoodRating: product.data().angryFoodRating,
          imageUrl: product.data().imageUrl,
          name: product.data().name,
          ownerEmail: product.data().ownerEmail,
          price: product.data().price,
          categories: product.data().categories,
        });
      });
      setProducts(prods);
    });

    const unsub2 = onWebPageSnapshot((snapshot) => {
      const webs: WebPage[] = [];
      snapshot.forEach((web) => {
        webs.push({
          id: web.id,
          logo: web.data().logoUrl,
          themeColor: web.data().themeColor,
          storeName: web.data().storeName,
          slogan: web.data().description,
          landingImage: web.data().landingImageUrl,
          facebookPage: web.data().facebookPage,
          contactNumber: web.data().contactNumber,
          ownerEmail: web.data().ownerEmail,
        });
      });
      setWebPages(webs);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const { data, isLoading } = useQuery<Response, any>(
    ["productRecommendation", currentEmotion, preferences],
    async () => {
      if (currentEmotion) {
        const response = await http.get("/products/recommend", {
          preferences: preferences.length > 0 ? preferences.join(" ") : "none",
          currentEmotion,
        });

        return response.data;
      }

      return null;
    },
    { refetchOnMount: false }
  );

  const themes: Record<string, Theme> = useMemo(() => {
    return webpages.reduce((accu, current) => {
      if (!current.id) return accu;
      return {
        ...accu,
        [current.id]: getThemeFromColor(current.themeColor),
      };
    }, {});
  }, [webpages]);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" sx={{ marginTop: 1 }}>
        <Header variant="h5">Browse Food!</Header>
        <EmotionContainer>
          <Typography sx={{ mr: 1, whitSpace: "nowrap" }}>
            You look:{" "}
          </Typography>
          <img height="100%" src={`/images/emotions/${currentEmotion}.png`} />
          <EmotionText>{toTitleCase(currentEmotion)}</EmotionText>
        </EmotionContainer>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Stack>
          {data && !isLoading && (
            <>
              <RecommendHeader>
                🌟 Here&apos;s our recommeded food for you! 🌟
              </RecommendHeader>
              {Object.entries(data.similarDocsMapping).map(
                ([storeEmail, scores]) => {
                  const webPage = webpages.find(
                    (web) => web.ownerEmail === storeEmail
                  );
                  const theme = themes[webPage?.id || ""];
                  return (
                    <ThemeProvider theme={theme} key={storeEmail}>
                      <CollapsibleProducts
                        webPage={webPage}
                        products={products}
                        scores={scores}
                      />
                    </ThemeProvider>
                  );
                }
              )}
            </>
          )}
          {!data && isLoading && (
            <Box
              height={500}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                Please wait as we recommend you food...
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default React.memo(MainPage);
