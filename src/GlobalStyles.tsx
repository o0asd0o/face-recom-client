import React from 'react';
import { Global, css } from "@emotion/react";

const GlobalStyles: React.FC = () => (
    <Global
        styles={css`
            @font-face {
                font-family: 'Rubik';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: local(''), 
                    url('/fonts/Rubik-Regular.woff') format('woff'),
                    url('/fonts/Rubik-Regular.ttf') format('truetype');
            }
        `}
    />
);

export default GlobalStyles;