import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { pages } from "constants/constants";
import { noop } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavigationContextType =
  | {
      selectedPage: string;
      selectedPageIndex: number;
      prevPageIndex: number;
      pathName: string;
      acceptedTerm: boolean;
      handShowTerm(show: boolean): void;
      handleNavigation(page: string, index?: number): void;
      setPageIndexManual(index: number): void;
    }
  | undefined;

const NavigationContext = createContext<NavigationContextType>(undefined);

export function NavigationProvider({ children }: { children: JSX.Element }) {
  const [selectedPage, setSelectedPage] = useState<string>("/");
  const [acceptedTerm, setAcceptedTerm] = useState<boolean>(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [prevPageIndex, setPrevPageIndex] = useState<number>(0);
  const [pathName, setPathName] = useState<string>("");

  const [termModal, setTermModal] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const pathName = location.pathname;
      const index = pages.findIndex((item) => item.page === pathName);
      setSelectedPageIndex(index);
      setPathName(pathName);
    }, 0);
  }, [location.pathname, pages]);

  const handleNavigation = useCallback(
    (page: string, index: number = selectedPageIndex) => {
      setSelectedPage(page);
      setSelectedPageIndex(index);
      setPrevPageIndex(selectedPageIndex);

      navigate(page);
    },
    [selectedPageIndex, setSelectedPage, setSelectedPageIndex, setPrevPageIndex]
  );

  const handleTermsNo = useCallback(() => {
    setAcceptedTerm(false);
    setTermModal(false);
    handleNavigation("/home");
  }, []);

  const handleTermsYes = useCallback(() => {
    const { from } = (location.state as { from?: string }) || {};
    setAcceptedTerm(true);
    setTermModal(false);
    if (from === "registration") {
      setSelectedPageIndex(2);
      return handleNavigation("/home/preferences");
    }
    setSelectedPageIndex(1);
    handleNavigation("/home/browse");
  }, [location.state]);

  return (
    <NavigationContext.Provider
      value={{
        pathName,
        selectedPage,
        selectedPageIndex,
        prevPageIndex,
        acceptedTerm,
        handShowTerm: setTermModal,
        handleNavigation,
        setPageIndexManual: setSelectedPageIndex,
      }}
    >
      <Dialog open={termModal} onClose={noop} sx={{ p: 5 }}>
        <DialogContent sx={{ p: 5 }}>
          <DialogContentText>
            We are about to get your facial expression for us to recommend you
            foods! Would you allow us?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleTermsNo}>No</Button>
          <Button variant="contained" onClick={handleTermsYes}>
            Yes, sure
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </NavigationContext.Provider>
  );
}

export function useHomeNavigation() {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error(
      "useHomeNavigation must be used within an NavigationProvider"
    );
  }

  return context;
}
