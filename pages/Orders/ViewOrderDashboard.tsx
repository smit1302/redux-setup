import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import MDTypography from "components/MDTypography";
import { ShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import globalMessages from "utils/global";
import Icon from "@mui/material/Icon";
import { Delete, Edit, Person, Preview } from '@mui/icons-material';
import Checkbox from "@mui/material/Checkbox";
import MDButton from "components/MDButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from "@mui/icons-material/Paid";
import WorkIcon from '@mui/icons-material/Work';
import { useMaterialUIController } from "context";

function ViewOrderDashboard() {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;

    return (
        <>
            <MDBox pb={3}>
                <MDBox mt={4.5}>
                    <Grid container spacing={3} className='row_bx'>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                <MDTypography variant="h6" color="white">
                                    Numbers
                                </MDTypography>

                            </MDBox>
                            <MDBox ml={3} className='content_bx'>
                                <Grid>
                                    <MDBox mt={4} className='order_status_wrap'>
                                        <Grid container spacing={3} className='row_bx_inner'>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <ShoppingCart fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>New Orders This Week</MDTypography>
                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <ShoppingCart fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Active Orders</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <ShoppingCart fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Dragging Orders</MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <WorkIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>New Try Jobs This Week</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <WorkIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Yet To Deliver Try Jobs</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <WorkIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Try Jobs Await Decision</MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PaidIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Installment Due This Week</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PaidIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Work In Progress</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PaidIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Payment Awaited</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Grid>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Scope of Work Missing(0)
                                </MDTypography>
                            </MDBox >
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Quick Links
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                <MDTypography color={sidenavColor}>View Active Orders</MDTypography>
                                <MDTypography color={sidenavColor}>View Delivered Free Trial Jobs</MDTypography>
                                <MDTypography color={sidenavColor}>View Free Trial Jobs in Production</MDTypography>
                                <MDTypography color={sidenavColor}>View Orders yet to Sign-off</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox mt={4.5}>
                    <Grid container spacing={3} className='row_bx'>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    My Follows Ups
                                </MDTypography>

                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Messages
                                </MDTypography>

                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Messages
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox mt={4.5}>
                    <Grid container spacing={3} className='row_bx'>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Active Orders By Product
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Active Orders By Platform
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} className='col_item'>
                            <MDBox
                                className='col_heading'
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Count Of Delivered Order
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <Footer />
        </>
    );
}

export default ViewOrderDashboard;