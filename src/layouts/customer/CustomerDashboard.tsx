import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from 'components/MDButton';
import { useMaterialUIController } from "context";
import { ShoppingCart } from "@mui/icons-material";
import PaidIcon from "@mui/icons-material/Paid";
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactsIcon from '@mui/icons-material/Contacts';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const handleNavigation = (route: any) => {
        history(route);
    };

    return (
        <>
            <MDBox py={3} className='col_wrap_item'>
                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
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
                                                            <AccountBoxIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Customers</MDTypography>
                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <ContactsIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Directory</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <ShoppingCart fontSize="large" />
                                                            <MDTypography>$0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>In Cart</MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <CalendarMonthIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Assigned This Week</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PersonAddIcon fontSize="large" onClick={() => handleNavigation("/email-activity")} />
                                                            <MDTypography>Add new</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Customer</MDTypography>

                                                </MDBox>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PaidIcon fontSize="large" />
                                                            <MDTypography>$0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>In Opportunity</MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PhoneDisabledIcon fontSize="large" />
                                                            <MDTypography>0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Blocked Contacts</MDTypography>

                                                </MDBox>

                                                <MDBox mb={3} ml={3} className='d_flex action_wrap'>
                                                    <MDButton className="action-button">
                                                        <Grid>
                                                            <PaidIcon fontSize="large" />
                                                            <MDTypography>$0</MDTypography>
                                                        </Grid>
                                                    </MDButton>
                                                    <MDTypography>Payment Due</MDTypography>
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
                                    Birthdays / Anniversary
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
                                    Reports
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                <MDTypography color={sidenavColor}>Contact Info</MDTypography>
                                <MDTypography color={sidenavColor}>View Active Order</MDTypography>
                                <MDTypography color={sidenavColor}>View delivered Free Trial Jobs</MDTypography>
                                <MDTypography color={sidenavColor}>View free Trial Jobs in Production</MDTypography>
                                <MDTypography color={sidenavColor}>View orders yet to sign-offs</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid >
                </MDBox >
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
                                    Customer Count By Life Cycle
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
                                    Try Job Statistics
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
                                    My Orders
                                </MDTypography>
                            </MDBox>
                            <MDBox ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }} className='content_bx'>
                                No Data Found
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox >
            <Footer />
        </>
    );
}

export default CustomerDashboard;