import React, { useCallback, useEffect } from "react";
import { landingPages } from "constants/constants";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PublicNavigationContextType = {
    selectedPage: string,
    selectedPageIndex: number,
    prevPageIndex: number
    handleNavigation(page: string, index?: number): void,
    setPageIndexManual(index: number): void,
} | undefined

const PublicNavigationContext = createContext<PublicNavigationContextType>(undefined);

export function PublicNavigationProvider({ children }: { children: JSX.Element }) {
    const [selectedPage, setSelectedPage] = useState<string>("/");
    const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
    const [prevPageIndex, setPrevPageIndex] = useState<number>(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            const pathName = location.pathname;
            const hash = location.hash;
            const index = landingPages.findIndex((item) => {
                if (item.isAnchor) {
                    return item.page === `${pathName}${hash}`;
                }
                return item.page === pathName
            });
            setSelectedPageIndex(index)
             window.scrollTo({ top: 0, behavior: "smooth"});
        }, 0);
    }, [location.pathname, landingPages])

    useEffect(() => {
        if (location.hash) {
            const scrollElement = document.querySelector(`${location.hash}`) as HTMLDivElement;
            setTimeout(() => {
                window.scrollTo({ top: scrollElement.offsetTop - 64, behavior: "smooth"});
            }, 200);
        }
    }, [location.hash])

    const handleNavigation = useCallback((page: string, index: number = selectedPageIndex) => {
        setSelectedPage(page);
        setSelectedPageIndex(index);
        setPrevPageIndex(selectedPageIndex);

        navigate(page);
    }, [selectedPageIndex, setSelectedPage, setSelectedPageIndex, setPrevPageIndex]);

    return (
        <PublicNavigationContext.Provider value={{ 
            selectedPage,
            selectedPageIndex,
            prevPageIndex,
            handleNavigation,
            setPageIndexManual: setSelectedPageIndex,
         }}>
             {children}
        </PublicNavigationContext.Provider>
    );
}

export function usePublicNavigation() {
  const context = useContext(PublicNavigationContext);

  if (context === undefined) {
    throw new Error("usePublicNavigation must be used within an PublicNavigationProvider");
  }

  return context;
}
