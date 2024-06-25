import React, { useEffect, useState } from 'react';
import { Grid, Card, Switch } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from "components/MDButton";
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { useMaterialUIController } from 'context';
import { showFormattedDate, showFormattedDateTime } from 'utils/common';


interface PromotionDetail {
    promocode_id: number;
    organization_id: number;
    promocode_name: string;
    description: string;
    start_date: string;
    end_date: string;
    promotional_type: string | null;
    promotional_for: string | null;
    discount_type: string;
    discount_value: number;
    apply_to: string | null;
    is_active: boolean;
}

const ViewDetailedPromotion: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [promotion, setPromotion] = useState<PromotionDetail | null>(null);

    const fetchPromotionDetail = async (id: string | undefined) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.promotionalCode.view,
                params: id,
            });

            setPromotion(response?.data?.data);
        } catch (error) {
            console.error("Error fetching promotion details:", error);
        }

    };
    useEffect(() => {
        fetchPromotionDetail(id);
    }, [id]);

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox mx={2} mt={-3} py={2.5} px={2} variant="gradient" display='flex' justifyContent='space-between' bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    Promotion Details
                                </MDTypography>
                                <MDButton variant="contained" onClick={() => navigate(-1)}>
                                    Go Back
                                </MDButton>
                            </MDBox>
                            <MDBox p={3}>
                                {promotion && Object.entries(promotion)
                                    .filter(([key, _]) => key !== 'organization_id')
                                    .slice(0, 14)
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
                                                        style={{
                                                            fontSize: "1.1rem",
                                                        }}
                                                        variant="span"
                                                        flex="2"
                                                    >
                                                        {modifyKey(key)}{" "}
                                                        :
                                                    </MDTypography>
                                                    {key === 'created_at' || key === 'updated_at' ?
                                                        <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>
                                                            {showFormattedDateTime(value) || 'No value'}
                                                        </MDTypography>
                                                        :
                                                        (typeof value === "boolean" ? (
                                                            <MDBox
                                                                flex="8"
                                                                textAlign="left"
                                                            >
                                                                {" "}
                                                                <Switch
                                                                    checked={value}
                                                                    disabled
                                                                />{" "}
                                                            </MDBox>
                                                        ) : (
                                                            <MDTypography
                                                                flex="8"
                                                                textAlign="left"
                                                                variant="span"
                                                                style={{
                                                                    fontSize: "1rem",
                                                                }}
                                                            >
                                                                {value || "No value"}
                                                            </MDTypography>
                                                        ))
                                                    }
                                                </MDBox>
                                                <MDTypography
                                                    component="hr"
                                                    style={{
                                                        border: `1px solid #EDEFF0`,
                                                    }}
                                                />
                                            </>
                                        );
                                    })}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout >
    );
};

export default ViewDetailedPromotion;