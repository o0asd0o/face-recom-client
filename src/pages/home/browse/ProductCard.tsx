import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Product, WebPage } from "types";
import { toTitleCase } from "_utils/helpers";
import { Score } from "./MainPage";
import { Button, Chip, Link } from "@mui/material";
import { FacebookRounded } from "@mui/icons-material";
import format from "format-number";

type Props = {
  product?: Product;
  webPage?: WebPage;
  score?: Score;
};

const RecipeReviewCard: React.FC<Props> = ({ product, webPage }) => {
  return (
    <Card sx={{ maxWidth: "100%" }}>
      <CardMedia
        component="img"
        height="194"
        image={product?.imageUrl || "/images/product-placeholder.png"}
        alt="Paella dish"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {toTitleCase(product?.name || "-")}
        </Typography>
        <Typography
          gutterBottom
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#827e7e" }}
        >
          {format({ prefix: "PHP ", round: 2, padRight: 2 })(
            product?.price ?? 0
          )}
        </Typography>
        <div style={{ marginTop: 15 }}>
          {product?.categories.map((item) => {
            return <Chip key={item} label={item} sx={{ mr: 0.5 }} />;
          })}
        </div>
      </CardContent>
      <CardActions>
        <Link
          href={webPage?.facebookPage || "www.fb.com/"}
          sx={{ ml: "auto" }}
          target="_blank"
        >
          <Button color="primary" variant="contained" sx={{ color: "white" }}>
            Order on <FacebookRounded sx={{ ml: 1 }} />
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default RecipeReviewCard;
