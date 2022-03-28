import React from "react";
import { ThemeProvider } from "@mui/system";
import { useFormik } from "formik";

import { theme } from "themes/themes";
import { Container, Typography, Button } from "@mui/material";

import { MainCard, Form, ImageBanner, Title1, Title2, BackdropRight, CardContainer,
    Body, FieldsContainer, AvatarContainer, Footer, ReactLink, FooterLink, ErrorMessage, RegisterButton
} from "./styled/StyledRegisterPage";

import UploadImage from "components/UploadImage";
import { Customer, RegistrationDetails } from "types";
import MainFields from "./MainFields";
import {  validation } from "./helpers";
import { addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { customersCollection, registerWithEmailPassword, uploadUsersImage, usersCollection, webPagesCollection } from "providers/firebase";
import { mapDefaultWebPageData } from "utils/mappers/webPageMappers";
import { CustomerData, UserData, WebPageData } from "types/server";
import { Logo } from "pages/login/styled/StyledLoginPage";
import { mapUserData } from "utils/mappers/userMappers";
import { mapCustomerrData } from "utils/mappers/customerMapper";

const initialValues: Customer = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
}

const handleSubmit = async ({ password, ...otherDetails}: Customer) => {
    const registrationProcesses = async () => {
        await registerWithEmailPassword(otherDetails.email, password)

        const customerData: CustomerData = mapCustomerrData(otherDetails);

        await addDoc(customersCollection, customerData);
    };

    return await toast.promise(registrationProcesses, {
        pending: 'Customer registration in progress...',
        success: 'Successfuly registered!',
        error: {
            render: (err) => {
                const { data } = err;
                const error = data as { code: string };
                if (error.code === 'auth/email-already-in-use') {
                    return 'That email address is already in use!';
                } else if (error.code === 'auth/invalid-email') {
                    return 'That email address is invalid!';
                }

                return JSON.stringify(error);
            }
        },
    })
}

const RegisterPage: React.FC = () => {

    const form = useFormik<Customer>({
        initialValues,
        validationSchema: validation,
        onSubmit: handleSubmit,
    })

    return <ThemeProvider theme={theme}>
        <Container maxWidth="md" fixed sx={{ paddingBottom: "40px" }}>
            <MainCard variant="outlined">
                <Form onSubmit={form.handleSubmit}>
                    <CardContainer>
                        <Body>
                            <Title2 variant="h3">
                                Registration
                            </Title2>
                            <Typography sx={{ marginTop: "10px" }}> 
                                Enter your contact and persoanal information below.
                            </Typography>
                            <FieldsContainer>
                                <MainFields form={form} />
                            </FieldsContainer>
                        </Body>
                        <Footer>
                            <div>
                                <span style={{ color: "#666" }}>Already have an account?</span>&nbsp;<ReactLink to="/login">Login Here</ReactLink>
                            </div>
                            <RegisterButton
                                color="primary"
                                variant="contained"
                                fullWidth type="submit"

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
}

export default React.memo(RegisterPage);