import PublicAppLayout from "components/public/PublicAppLayout";
import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavigationProvider } from "context/publicNavigationContext";


const Public: React.FC = () => {
    return (
        <PublicNavigationProvider>
            <PublicAppLayout>
                <Outlet />
            </PublicAppLayout>
        </PublicNavigationProvider>
    )
}

export default Public;