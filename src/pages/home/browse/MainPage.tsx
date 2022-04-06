import styled from "@emotion/styled";
import { Box, Button, CircularProgress, Container, createTheme, Grid, Stack, Theme, ThemeProvider, Typography } from "@mui/material";
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

type Props = {
    currentEmotion: Emotion;
    preferences: string[];
};

export type Score = {
  id   : string
  score: number
};

type Response = {
    message: string;
    similarDocsMapping: Record<string, Score[]>
}

const EmotionContainer = styled(Box)`
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
`;

const StoreHeader = styled("div")<{ theme?: string }>`
    padding: 20px;
    background: ${props => props.theme || "#81c784"}12;
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
    font-size: 37px;
    font-family: 'Rubik';
`

const MainPage: React.FC<Props> = ({ currentEmotion, preferences }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [webpages, setWebPages] = useState<WebPage[]>([]);

    useEffect(() => {
        const unsub1 = onProductsSnapshot((snapshot) => {
            const prods: Product[] = [];
            snapshot.forEach(product => {
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
                })
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
                    ownerEmail: web.data().ownerEmail
                });
            });
            setWebPages(webs)
        })

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    const { data, isLoading } = useQuery<Response, any>(['productRecommendation', currentEmotion, preferences], async () => {
        if (currentEmotion) {
            const response = await http.get('/products/recommend', {
                preferences: preferences.length > 0 ? preferences.join(" ") : 'none',
                currentEmotion,
            });

            return response.data;
        }

        return null;
    }, { refetchOnMount: false });

    const themes: Record<string, Theme> = useMemo(() => {
        return webpages.reduce((accu, current) => {
            if (!current.id) return accu;
            return {
                ...accu,
                [current.id]: getThemeFromColor(current.themeColor)
            }
        }, {})
    }, [webpages])

    return <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" sx={{ marginTop: 1 }}>
            <Header variant="h5">
                Browse Food!
            </Header>
            <EmotionContainer>
                <Typography sx={{mr: 1}}>You look: </Typography>
                <img height="100%"src={`/images/emotions/${currentEmotion}.png`} />
            </EmotionContainer>
        </Stack>
        <Box sx={{ mt: 2 }}>
            <Stack>
                {data && !isLoading && (<>
                    <RecommendHeader>🌟 Here&apos;s our recommeded food for you! 🌟</RecommendHeader>
                    {Object.entries(data.similarDocsMapping).map(([storeEmail, scores]) => {
                        const webPage = webpages.find((web) => web.ownerEmail === storeEmail);
                        const { storeName } = webPage || {};
                        const theme = themes[webPage?.id || ''];
                        return <ThemeProvider theme={theme} key={storeEmail}>
                            <StoreHeader theme={"#adaab6"}>
                                <Typography variant="h5" sx={{ fontFamily: "Rubik", textTransform: "uppercase", pt: 0.5 }}>
                                    {storeName || "Unnamed store"}
                                </Typography>
                                <Button variant="outlined" sx={{ ml: "auto", display: { xs: "none", sm: "block"} }}>View Store</Button>
                                <Button variant="outlined" sx={{ ml: "auto", display: { xs: "block", sm: "none"} }}>View</Button>
                            </StoreHeader>
                            <Grid container spacing={{ xs: 3, sm: 5, md: 10 }} sx={{ mb: 3 }}>
                                {scores.slice(0, 3).map((score) => {
                                    const product = products.find((item) => item.id === score.id);
                                    return (
                                        <Grid key={score.id} item xs={12} sm={6} md={4}>
                                            <RecipeReviewCard product={product} webPage={webPage} score={score} />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </ThemeProvider>
                    })}
                </>)}
                {!data && isLoading && (
                    <Box height={500} sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>
                            Please wait as we recommend you food...
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    </Container>
};

export default React.memo(MainPage);