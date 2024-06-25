import React, { useEffect, useState } from "react";
import { Grid, Switch, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";

interface ViewFeedback {
    customer_feedbacks_id: number;
    website: string;
    created_at: Date;
    user_name: string;
    user_email: string;
}

const ViewFeedback: React.FC = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const [feedback, setFeedback] = useState<ViewFeedback | null>(null);
    const { sidenavColor } = controller;
    const fetchFeedback = async (id: string | undefined) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.feedback.view,
                params: id,
            });
            setFeedback(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
        return null;
    };

    useEffect(() => {
        fetchFeedback(id);
    }, []);

    const modifyKey = (key: string): string => {
        let words = key
            .split("_")
            .map((word, index) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .filter((word) => word !== "")
            .join(" ");
        return words;
    };

    const removeKey = ['created_by', 'updated_by', 'deleted_at', 'deleted_by', 'organization_id'];

    return (
        <>
            <DashboardLayout>
                <MDBox pt={2} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={2.5}
                                    px={2}
                                    variant="gradient"
                                    display="flex"
                                    justifyContent="space-between"
                                    bgColor={sidenavColor}
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        variant="h6"
                                        color="white"
                                    >
                                        {feedback?.user_name}'s Feedback
                                    </MDTypography>
                                    <MDButton
                                        variant="contained"
                                        color={'white'}
                                        onClick={() => history(-1)}
                                    >
                                        Go back
                                    </MDButton>
                                </MDBox>
                                <MDBox>
                                    {feedback &&
                                        Object.entries(feedback)
                                        .filter(([key, _]) => key !== 'customer_id')
                                            .slice(0, 11)
                                            .map(([key, value]) => {
                                                return (
                                                    <>
                                                        <MDBox
                                                            key={key}
                                                            variant="div"
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            px={2}
                                                            py={1.5}
                                                        >
                                                            <MDTypography
                                                                style={{ fontSize: "1.1rem" }}
                                                                variant="span"
                                                                flex="2"
                                                            >
                                                                {modifyKey(key)}{" "}
                                                                :
                                                            </MDTypography>
                                                            {typeof value ===
                                                                "boolean" ? (
                                                                <MDBox
                                                                    flex="8"
                                                                    textAlign="left"
                                                                >
                                                                    {" "}
                                                                    <Switch
                                                                        checked={
                                                                            value
                                                                        }
                                                                        disabled
                                                                    />{" "}
                                                                </MDBox>
                                                            ) : (
                                                                <MDTypography
                                                                    flex="8"
                                                                    textAlign="left"
                                                                    variant="span"
                                                                    style={{ fontSize: "1rem" }}
                                                                >
                                                                    {value || "No value"}
                                                                </MDTypography>
                                                            )}
                                                        </MDBox>
                                                        <MDTypography
                                                            component="hr"
                                                            style={{ border: `1px solid #EDEFF0` }}
                                                        />
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

export default ViewFeedback;
