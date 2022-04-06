import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';
import { Product, WebPage } from 'types';
import { toTitleCase } from '_utils/helpers';
import { Score } from './MainPage';
import { Button, Link } from '@mui/material';
import { Facebook, FacebookRounded } from '@mui/icons-material';

type Props = {
    product?: Product;
    webPage?: WebPage;
    score?: Score;
}

const RecipeReviewCard: React.FC<Props> = ({ product, webPage,  score }) => {

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
        <Typography gutterBottom variant="subtitle2">
          {`${(Math.round((score?.score ?? 0) * 10000) / 100)}% Matched`}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={webPage?.facebookPage || 'www.fb.com/'} sx={{ ml: "auto" }} target="_blank"> 
          <Button color="primary" variant="contained" sx={{ color: "white" }}>
            Order on <FacebookRounded sx={{ ml: 1 }} />
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default RecipeReviewCard;