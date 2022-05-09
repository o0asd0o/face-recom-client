import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { usePublicNavigation } from "context/publicNavigationContext";
import { onRestoOwnersSnapshot } from "providers/restoOwners";
import { onWebPageSnapshot } from "providers/webPage";
import React, { useEffect, useMemo, useState } from "react";
import { LandingResto } from "types";

const LandingPage: React.FC = () => {
  const [restos, setRestos] = useState<LandingResto[]>([]);
  const [approvedOwners, setApprovedOwners] = useState<string[]>([]);

  const { handleNavigation } = usePublicNavigation();

  useEffect(() => {
    const unsub0 = onRestoOwnersSnapshot((snapshot) => {
      const owners: string[] = [];
      snapshot.forEach((owner) => {
        owners.push(owner.data().email);
      });
      setApprovedOwners(owners);
    }, "approved");

    const unsub1 = onWebPageSnapshot((snapshot) => {
      const resultRestos: LandingResto[] = [];
      snapshot.forEach((doc) => {
        resultRestos.push({
          id: doc.id,
          name: doc.data().storeName,
          description: doc.data().description,
          contact: doc.data().contactNumber,
          featured: doc.data().featuredUrl,
          address: doc.data().address,
          ownerEmail: doc.data().ownerEmail,
        });
      });

      setRestos(resultRestos);
    });

    return () => {
      unsub0();
      unsub1();
    };
  }, []);

  const restosToDisplay = useMemo(() => {
    return restos.filter((item) => {
      if (item.ownerEmail) {
        return approvedOwners.includes(item.ownerEmail);
      }
      return false;
    });
  }, [restos, approvedOwners]);

  console.log({ restos, approvedOwners, restosToDisplay });

  return (
    <>
      <Container maxWidth="xl" sx={{ display: "flex", pt: 10 }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/images/login-logo.png"
            alt="Food Findr Logo"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        </Box>
        <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Welcome Foodies!</Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
              &quot;We&lsquo;re always in the mood for food&quot;
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNavigation("/login")}
            >
              Find Foodies
            </Button>
          </div>
        </Box>
      </Container>
      <Container maxWidth="xl" sx={{ pt: 30 }}>
        <Divider />
      </Container>
      <Typography
        id="featured"
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          pt: 10,
          textTransform: "uppercase",
          mb: 5,
        }}
      >
        Our Featured Foodies
      </Typography>
      {restosToDisplay.map((item, index) => (
        <div
          key={item.id}
          style={{
            padding: "25px 0",
            background: index % 2 === 1 ? "rgb(246, 246, 246)" : "white",
          }}
        >
          <Container maxWidth="xl" sx={{ display: "flex" }}>
            <Grid container>
              <Grid
                item
                width={{ md: "50%", xs: "100%" }}
                sx={{
                  textAlign: "center",
                  backgroundImage: `url(${item.featured})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  height: "350px",
                }}
              />
              <Grid
                item
                width={{ md: "50%", xs: "100%" }}
                sx={{
                  padding: "30px 30px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4">{item.name}</Typography>
                <Typography variant="h6" sx={{ pt: 2 }}>
                  Location: {item.address}
                </Typography>
                <Typography variant="h6" sx={{ pt: 2 }}>
                  Contact No.: {item.contact}
                </Typography>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleNavigation("/login")}
                  >
                    Find Food
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      ))}
    </>
  );
};

export default LandingPage;
