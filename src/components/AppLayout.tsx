import { ThemeProvider } from "@mui/material";
import React from "react";
import { theme } from "themes/themes";
import Footer from "./Footer";
import HeaderNav from "./HeaderNav";

const AppLayout: React.FC = ({ children }) => {
    return <ThemeProvider theme={theme}>
        <HeaderNav />
        {children}
        <Footer />
    </ThemeProvider>
}

export default AppLayout;