import { ThemeProvider } from "@mui/material";
import Footer from "components/Footer";
import React from "react";
import { theme } from "themes/themes";
import PublicHeaderNav from "./PublicHeaderNav";

const PublicAppLayout: React.FC = ({ children }) => {
    return <ThemeProvider theme={theme}>
        <PublicHeaderNav key="public-header-nav" />
        {children}
        <Footer />
    </ThemeProvider>
}

export default PublicAppLayout;