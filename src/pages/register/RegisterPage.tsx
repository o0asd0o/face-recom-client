import React from "react";
import { ThemeProvider } from "@mui/system";
import { useFormik } from "formik";

import { theme } from "themes/themes";
import { Container, Typography } from "@mui/material";

import {
  MainCard,
  Form,
  Title2,
  CardContainer,
  Body,
  FieldsContainer,
  Footer,
  ReactLink,
  RegisterButton,
} from "./styled/StyledRegisterPage";

import { Customer } from "types";
import MainFields from "./MainFields";
import { validation } from "./helpers";
import { addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  customersCollection,
  registerWithEmailPassword,
} from "providers/firebase";
import { CustomerData } from "types/server";
import { mapCustomerrData } from "_utils/mappers/customerMapper";
import { useNavigate } from "react-router-dom";

const initialValues: Customer = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  address: "",
  phoneNumber: "",
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({ password, ...otherDetails }: Customer) => {
    const registrationProcesses = async () => {
      await registerWithEmailPassword(otherDetails.email, password);

      const customerData: CustomerData = mapCustomerrData(otherDetails);

      await addDoc(customersCollection, customerData);
    };

    await toast.promise(registrationProcesses, {
      pending: "Customer registration in progress...",
      success: "Successfuly registered!",
      error: {
        render: (err) => {
          const { data } = err;
          const error = data as { code: string };
          if (error.code === "auth/email-already-in-use") {
            return "That email address is already in use!";
          } else if (error.code === "auth/invalid-email") {
            return "That email address is invalid!";
          }

          return JSON.stringify(error);
        },
      },
    });

    navigate("/home/preferences", {
      state: {
        from: "registration",
      },
    });
  };

  const form = useFormik<Customer>({
    initialValues,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" fixed sx={{ paddingBottom: "40px" }}>
        <MainCard variant="outlined">
          <Form onSubmit={form.handleSubmit}>
            <CardContainer>
              <Body>
                <Title2 variant="h3">Registration</Title2>
                <Typography sx={{ marginTop: "10px" }}>
                  Enter your contact and persoanal information below.
                </Typography>
                <FieldsContainer>
                  <MainFields form={form} />
                </FieldsContainer>
              </Body>
              <Footer>
                <div>
                  <span style={{ color: "#666" }}>
                    Already have an account?
                  </span>
                  &nbsp;<ReactLink to="/login">Login Here</ReactLink>
                </div>
                <RegisterButton
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"

                  // ={form.isSubmitting}
                >
                  Register
                </RegisterButton>
              </Footer>
            </CardContainer>
          </Form>
        </MainCard>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(RegisterPage);
