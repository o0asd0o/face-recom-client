import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Header } from "../common/styled";
import SelectableCard from "components/selectableCard/SelectableCard";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import { useAuth } from "context/authContext";
import { updatePreferences } from "providers/customers";
import { useHomeNavigation } from "context/navigationContext";

const SELECT_LIMIT = 5;
const CATEGORIES = [
    "BEEF",
    "CHICKEN",
    "PORK",
    "SEAFOOD",
    "VEGETABLES",
    "BEVERAGES",
    "NOODLES",
    "PIZZA",
    "BURGER",
    "FRIES",
    "RICE MEALS",
    "MAKI"
];

const ImageBG = styled("div")<{ image: string }>`
    background-image: url(${props => props.image});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    height: 200px;
`;

const ActionHolder = styled("div")`
    margin-top: 20px;
    display: flex;
`;

const requestUpdatePreferences = async (id: string, preferences: string[], callback: () => void) => {
    const updateProcess = async () => await updatePreferences(id, preferences);

    await toast.promise(updateProcess, {
        pending: 'Saving preferences...',
        success: 'Successfuly saved!',
        error: 'Error while saving preferences',
    });
    callback();
}

const PreferencesPage: React.FC = () => {
    const [selectedItems, setSelectedItems] = useState<Array<number>>([]);
    const { handleNavigation } = useHomeNavigation();
    const { userInfo } = useAuth();

    const handleSelectedItem = useCallback((itemIndex) => {
        setSelectedItems(prev => {
            if (prev.includes(itemIndex)) {
                const filtered = prev.filter((i) => i !== itemIndex);
                return filtered;
            }

            if (prev.length === SELECT_LIMIT) {
                toast.warning("Max 5 selections reached")
                return prev;
            }

            return [...prev, itemIndex];
        })
    }, [setSelectedItems]);

    useEffect(() => {
        if (userInfo) {
            const { preferences } = userInfo;
            
            const selectedItems = preferences.map((name) => {
                return CATEGORIES.findIndex((item) => item === name);
            });

            setSelectedItems(selectedItems);
        }
    }, [userInfo?.preferences]);

    const handleUpdatePreferences = useCallback(() => {
        if (userInfo?.id) {
            const preferences = selectedItems.map((index) => {
                return CATEGORIES.find((_, i) => i === index);
            });

            requestUpdatePreferences(userInfo.id, preferences as string[], () => {
                handleNavigation("/home/browse");
            });
        }
    }, [selectedItems, userInfo?.id])
    
    return <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" sx={{ marginTop: 1 }}>
            <Header variant="h5">
                Preferences
                <Typography variant="caption" sx={{ ml: 1, fontSize: "15px"}}>(Max 5 selections)</Typography>
            </Header>
            
        </Stack>
        <Grid container spacing={1}>
            {CATEGORIES.map((item, index) => {
                return <Grid item xs={12} sm={6} md={4} key={item}>
                    <SelectableCard onClick={() => handleSelectedItem(index)} selected={selectedItems.includes(index)}>
                        <ImageBG image={`/images/preferences/${item.replace(" ", "_")}.jpg`}>
                            <Typography sx={{ background: "#57515133", p: 1, fontWeight: "bold"}} variant="h5" color="white">
                                {item}
                            </Typography>
                        </ImageBG>
                    </SelectableCard>
                </Grid>
            })}
        </Grid>
        <ActionHolder>  
            <Button variant="contained" sx={{ ml: "auto"}} onClick={() => handleUpdatePreferences()}>SAVE PREFERENCES</Button>
        </ActionHolder>
    </Container>
};

export default PreferencesPage;