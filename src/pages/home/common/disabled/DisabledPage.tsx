import styled from "@emotion/styled";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useHomeNavigation } from "context/navigationContext";
import React from "react";

const CenterContainer = styled("div")`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const DisabledPage: React.FC = () => {
  const { handShowTerm } = useHomeNavigation();
  return (
    <Container maxWidth="xl" sx={{ height: "calc(100vh - 229px)" }}>
      <CenterContainer>
        <Typography sx={{ mb: 2, textAlign: "center" }}>
          This page is disabled because you did not accept our terms for food
          recommendation
        </Typography>
        <Button variant="contained" onClick={() => handShowTerm(true)}>
          Enable Recommendation
        </Button>
      </CenterContainer>
    </Container>
  );
};

export default React.memo(DisabledPage);
