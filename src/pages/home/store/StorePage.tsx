import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Container, Grid, IconButton, Theme, ThemeProvider, Typography } from "@mui/material";
import { Header } from "../common/styled";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useHomeNavigation } from "context/navigationContext";
import { Product, WebPage } from "types";
import { onWebPageSnapshot } from "providers/webPage";
import styled from "@emotion/styled";
import { getThemeFromColor } from "../browse/helpers";
import { onProductsSnapshot } from "providers/products";
import RecipeReviewCard from "../browse/ProductCard";

const WithImageBackground = styled("div")<{ background: string }>`
    background-image: url(${props => props.background || ""});
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-color: #464646;
`;

const Body = styled("div")`
    height: calc(100vh);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 100px;
`;

const Logo = styled("img")`
    width: 200px;
    border-radius: 10px;
    margin-bottom: 10px;
`

const StorePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { prevPageIndex, setPageIndexManual } = useHomeNavigation();

    const [webpage, setWebPage] = useState<WebPage>();
    const [products, setProducts] = useState<Product[]>([]);
    const [theme, setTheme] = useState<Theme>();

    console.log({state: location.state});

    useEffect(() => {
        window.scrollTo({ top:0 });
    }, [])

    useEffect(() => {
        if (!location.state) return;
        const unsub1 = onWebPageSnapshot((snapshot) => {
            snapshot.forEach((web) => {
                setWebPage({
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
                setTheme(getThemeFromColor(web.data().themeColor));
            });
        }, (location.state as { ownerEmail: string }).ownerEmail);

        const unsub2 = onProductsSnapshot((snapshot) => {
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
        }, (location.state as { ownerEmail: string }).ownerEmail)

        return () => {
            unsub1();
            unsub2();
        }
    }, [location.state])

    const handleNavigateOnPrevious = () => {
        setPageIndexManual(prevPageIndex);
        navigate(-1);
    };

    return <ThemeProvider theme={theme || {}}>
        {webpage ? (
            <WithImageBackground background={String(webpage?.landingImage)}>
                <Container maxWidth="xl" >
                    <div style={{ display: "flex", alignItems: "center", position: "fixed" }}>
                        <Header variant="h5">
                            <IconButton aria-label="delete" size="large" sx={{ mr: 1, color: "white", background: "rgba(0, 0, 0, 0.3)" }} onClick={handleNavigateOnPrevious}>
                                <ArrowBack fontSize="inherit" />
                            </IconButton>
                        </Header>
                    </div>
                    <Body>
                        <Logo src={String(webpage?.logo)} />
                        <Typography variant="h2" sx={{ fontFamily: "Rubik", color: "white", textAlign: "center" }}>{webpage?.storeName || "-"}</Typography>
                        <Typography variant="h5" sx={{ fontFamily: "Rubik", color: "white", textAlign: "center" }}>{webpage?.slogan || "-"}</Typography>
                        <Button variant="contained" sx={{ mt: 4 }}>Go to Facebook Page</Button>
                    </Body>
                </Container>
            </WithImageBackground>
        ) : (
            <Container maxWidth="xl">
                <Body style={{ justifyContent: "center", padding: 0 }}>
                    <CircularProgress />
                </Body>
            </Container>
        )}
        {webpage && products.length > 0 && (
            <Container maxWidth="xl" >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h4" sx={{ textAlign: "center", my: 3, width: "100%", fontFamily: "" }}>{(webpage?.storeName || "Store")}&apos;s Products</Typography>
                </div>
                <Grid container spacing={{ xs: 3, sm: 5, md: 10 }} sx={{ mb: 3 }}>
                    {products.map((product) => {
                        return (
                            <Grid key={product.id} item xs={12} sm={6} md={4}>
                                <RecipeReviewCard product={product} webPage={webpage} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        )}
    </ThemeProvider>
};

export default StorePage;