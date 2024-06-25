import React, { useEffect, useState } from "react";
import { Grid, Switch, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";

interface ViewNewsLetter {
    newsletterSubscribers_id: number;
    website: string;
    created_at: Date;
    name: string;
    email: string;
    status: boolean;
    subscribe_from: string;
}

const ViewNewsLetter: React.FC = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const [subscriber, setSubscriber] = useState<ViewNewsLetter | null>(null);
    const { sidenavColor } = controller;

    const fetchNewsLetter = async (id: string | undefined) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.newsLetter.view,
                params: id,
            });
            setSubscriber(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
        return null;
    };

    useEffect(() => {
        fetchNewsLetter(id);
    }, []);

    const modifyKey = (key: string): string => {
        let words = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return words;
    };

    return (
        <>
            <DashboardLayout>
                <MDBox pt={2} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox mx={2} mt={-3} py={2.5} px={2} varia nt="gradient" display="flex" justifyContent="space-between"
                                    bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        {subscriber?.name}'s details
                                    </MDTypography>
                                    <MDButton variant="contained" color={sidenavColor} onClick={() => history(-1)}>
                                        Go back
                                    </MDButton>
                                </MDBox>
                                <MDBox>
                                    {subscriber &&
                                        Object.entries(subscriber)
                                            .slice(0, 11)
                                            .map(([key, value]) => {
                                                return (
                                                    <>
                                                        <MDBox key={key} variant="div" display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
                                                            <MDTypography style={{ fontSize: "1.1rem", }} variant="span" flex="2">
                                                                {modifyKey(key)}{" "}
                                                                :
                                                            </MDTypography>
                                                            {typeof value ===
                                                                "boolean" ? (
                                                                <MDBox flex="8" textAlign="left"
                                                                >
                                                                    {" "}
                                                                    <Switch
                                                                        checked={value}
                                                                        disabled
                                                                    />{" "}
                                                                </MDBox>
                                                            ) : (
                                                                <MDTypography flex="8" textAlign="left" variant="span" style={{ fontSize: "1rem" }}>
                                                                    {value || "No value"}
                                                                </MDTypography>
                                                            )}
                                                        </MDBox>
                                                        <MDTypography component="hr" style={{ border: `1px solid #EDEFF0` }} />
                                                    </>
                                                );
                                            })}
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
};

export default ViewNewsLetter;
