import React, { useState } from "react";
import { Grid, Button, IconButton, Typography, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Score, StoreHeader } from "./MainPage";
import RecipeReviewCard from "./ProductCard";
import { Product, WebPage } from "types";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";


type Props = {
    scores: Score[],
    products: Product[],
    webPage?: WebPage,
}   


const CollapsibleProducts: React.FC<Props> = ({ scores, products, webPage }) => {
    const [collapsed, setCollapsed] = useState(false);

    return <>
        <StoreHeader theme={"#adaab6"}>
            <Typography variant="h5" sx={{ fontFamily: "Rubik", textTransform: "uppercase", pt: 0.5 }}>
                {webPage?.storeName || "Unnamed store"}
            </Typography>
            <Link to={`/home/browse/store`} state={{ ownerEmail: webPage?.ownerEmail }} style={{ marginLeft: "auto", textDecoration: "none" }}>
                <Button variant="outlined" sx={{ display: { xs: "none", sm: "block"} }}>View Store</Button>
                <Button variant="outlined" sx={{ display: { xs: "block", sm: "none"} }}>View</Button>
            </Link>
        </StoreHeader>
        <Grid container spacing={{ xs: 3, sm: 5, md: 10 }} sx={{ mb: 3 }}>
            {scores.slice(0, collapsed ? scores.length : 3).map((score) => {
                const product = products.find((item) => item.id === score.id);
                return (
                    <Grid key={score.id} item xs={12} sm={6} md={4}>
                        <RecipeReviewCard product={product} webPage={webPage} score={score} />
                    </Grid>
                );
            })}
            <Grid key={`collapsible-${webPage?.ownerEmail}`} item xs={12} sx={{ textAlign: "center"}} style={{ paddingTop: "20px" }}>
                <div onClick={() => setCollapsed(prev => !prev)} style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        {collapsed ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    <Typography>View {collapsed ? "Less" : "More"}</Typography>
                </div>
            </Grid>
        </Grid>
    </>
};

export default CollapsibleProducts;