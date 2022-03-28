import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import React from "react";

const FooterComponent = styled("footer")`
    height: 60px;
    border-top: 1px #e5e5e5 solid;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
`
const Footer: React.FC = () => {
    return <FooterComponent>
        <Typography>All rights reserved (c) 2022 - Marilao Food Findr</Typography>
    </FooterComponent>
};

export default Footer;