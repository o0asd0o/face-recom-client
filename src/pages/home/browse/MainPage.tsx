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
import { Product, RestoOwnerStatus, WebPage } from "types";
import { Header } from "../common/styled";
import { useQuery } from "react-query";
import http from "_utils/http";
import { Emotion } from "types";
import { onWebPageSnapshot } from "providers/webPage";
import RecipeReviewCard from "./ProductCard";
import { getEmotionLabelEquivalent, getThemeFromColor } from "./helpers";
import { Link } from "react-router-dom";
import { toTitleCase } from "_utils/helpers";
import CollapsibleProducts from "./CallapsibleProducts";
import { onRestoOwnersSnapshot } from "providers/restoOwners";

type Props = {
  currentEmotion: Emotion;
  preferences: string[];
  calibrating: boolean;
};

export type Score = {
  id: string;
  score: number;
};

type Response = {
  message: string;
  similarDocsMapping: Record<string, Score[]>;
};

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

const RecommendHeader = styled("div")`
  text-align: center;
  margin-bottom: 20px;
  font-size: 35px;
  font-family: "Rubik";
  margin-top: 20px;
`;

const MainPage: React.FC<Props> = ({
  currentEmotion,
  calibrating,
  preferences,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [webpages, setWebPages] = useState<WebPage[]>([]);
  const [approvedOwners, setApprovedOwners] = useState<string[]>([]);

  useEffect(() => {
    const unsub0 = onRestoOwnersSnapshot((snapshot) => {
      const owners: string[] = [];
      snapshot.forEach((owner) => {
        owners.push(owner.data().email);
      });
      setApprovedOwners(owners);
    }, "approved");

    const unsub1 = onProductsSnapshot((snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((product) => {
        prods.push({
          id: product.id,
          sadFoodRating: product.data().sadFoodRating,
          happyFoodRating: product.data().happyFoodRating,
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
      unsub0();
      unsub1();
      unsub2();
    };
  }, []);

  const webPagesToDisplay = useMemo(() => {
    return webpages.filter((item) => {
      if (item.ownerEmail) {
        return approvedOwners.includes(item.ownerEmail);
      }
      return false;
    });
  }, [webpages, approvedOwners]);

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
    return webPagesToDisplay.reduce((accu, current) => {
      if (!current.id) return accu;
      return {
        ...accu,
        [current.id]: getThemeFromColor(current.themeColor),
      };
    }, {});
  }, [webPagesToDisplay]);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" sx={{ marginTop: 1 }}>
        <Header variant="h5" sx={{ whiteSpaice: "nowrap", mr: 5 }}>
          Browse Food!
        </Header>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Stack>
          {data && !isLoading && !calibrating && (
            <>
              <RecommendHeader>
                🌟{getEmotionLabelEquivalent(currentEmotion)}🌟
              </RecommendHeader>
              {Object.entries(data.similarDocsMapping).map(
                ([storeEmail, scores]) => {
                  const webPage = webPagesToDisplay.find(
                    (web) => web.ownerEmail === storeEmail
                  );

                  if (!webPage) return null;

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
          {(calibrating || (!data && isLoading && !calibrating)) && (
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
