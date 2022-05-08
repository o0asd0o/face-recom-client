import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHomeNavigation } from "context/navigationContext";
import { onRestoOwnersSnapshot } from "providers/restoOwners";
import { onWebPageSnapshot } from "providers/webPage";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LandingResto } from "types";

const MainHome: React.FC = () => {
  const [restos, setRestos] = useState<LandingResto[]>([]);
  const [approvedOwners, setApprovedOwners] = useState<string[]>([]);

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

  return (
    <>
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
                <Link
                  to={`/home/browse/store`}
                  state={{ ownerEmail: item.ownerEmail }}
                  style={{ marginLeft: "auto", textDecoration: "none" }}
                >
                  <div style={{ textAlign: "right" }}>
                    <Button variant="contained" sx={{ mt: 2 }}>
                      View Store
                    </Button>
                  </div>
                </Link>
              </Grid>
            </Grid>
          </Container>
        </div>
      ))}
    </>
  );
};

export default MainHome;
