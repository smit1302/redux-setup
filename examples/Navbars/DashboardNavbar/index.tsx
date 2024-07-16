/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { VerifiedUser } from "@mui/icons-material";
import ConfirmModal from "common/ConfirmModal";
import globalMessages from "utils/global";
import { clearCookies } from "utils/common";
import { service } from "utils/Service/service";
import Select from "common/Select";
import { socket } from "utils/socket";

function DashboardNavbar({ absolute, light, isMini }: any) {
  const [navbarType, setNavbarType] = useState<any>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState<any>(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<{ id: any; display_name: any; }[] | undefined>(undefined);


  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event: any) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  useEffect(() => {
    FetchUserorganations();
  }, [])
  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      // anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );
  //fetch organations

  const FetchUserorganations = async () => {
    try {
      const OrganizationResponse = await service.makeAPICall({
        methodName: service.Methods.GET,
        apiUrl: service.API_URL.auth.getuser,
      })
      const Organizationarray = OrganizationResponse?.data.data.organizations

      if (Organizationarray && Array.isArray(Organizationarray)) {
        const OrganizationList = Organizationarray?.map(list => ({
          id: list.organization_id
          , display_name: list.display_name
        }));
        setOrganization(OrganizationList);
      }

    } catch (err) {
      console.error("Error fetching user Role:", err);
    }

  }
  //Organation
  const ChangeValue = (event: any, fieldName: string) => {
    console.log("organization", event.value)
  };

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }: any) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const logout = () =>{
    clearCookies('token')
    navigate('/sign-in')
    socket.close();
  }
  return (
    <AppBar
      className="top_bar_header"
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme: any) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme: any) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <Select
               
                placeholder="Select Organization"
                options={(organization || [])?.map(organization => ({ value: organization.id, label: organization.display_name }))}
                handleChange={(event: any) => ChangeValue(event, "organization")}

              />
            </MDBox>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/profile">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <AccountCircleIcon sx={iconsStyle} />
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                onClick={() => setShowConfirm(true)}
              // onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>logout</Icon>
              </IconButton>
              {renderMenu()}
              <ConfirmModal closeModal={() => setShowConfirm(false)} message={globalMessages.login_form.logout_confirm} visible={showConfirm} handleFunction={logout} />
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
