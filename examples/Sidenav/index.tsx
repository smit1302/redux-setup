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

import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from "react-redux";

// Material Dashboard 2 React context
import {
    useMaterialUIController,
    setMiniSidenav,
    setTransparentSidenav,
    setWhiteSidenav,
} from "context";

import { ArrowDropDown } from "@mui/icons-material";
import { idID } from "@mui/material/locale";
function Sidenav({ color, brand, brandName, routes, ...rest }: any) {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
    const location = useLocation();
    const collapseName = location.pathname.split("/")[1];
    const [dropdownState, setDropdownState] = useState<{ [key: string]: boolean }>({});
    const dispatchData = useDispatch();

    const handleDropdownToggle = (key: string) => {
        setDropdownState(prevState => {
            const newState: { [key: string]: boolean } = {};

            // Toggle the state of the specified dropdown
            newState[key] = !prevState[key];

            // Set all other dropdowns to false
            Object.keys(prevState).forEach(dropKey => {
                if (dropKey !== key) {
                    newState[dropKey] = false;
                }
            });

            return newState;
        });
    };


    let textColor = "white";

    if (transparentSidenav || (whiteSidenav && !darkMode)) {
        textColor = "dark";
    } else if (whiteSidenav && darkMode) {
        textColor = "inherit";
    }

    const closeSidenav = () => setMiniSidenav(dispatch, true);

    useEffect(() => {
        const element1 = document.getElementsByClassName('css-22u4d0')[0] as HTMLElement | null;
        if (element1) {
            element1.style.background = 'none';
        }
        const element2 = document.getElementsByClassName('css-8l7y5w')[0] as HTMLElement | null;
        if (element2) {
            element2.style.background = 'none';
        }
        const element3 = document.getElementsByClassName('css-12zl3pz')[0] as HTMLElement | null;
        if (element3) {
            element3.style.background = 'none';
        }
        {
            const element4 = document.getElementsByClassName('css-ulhh9g ')[0] as HTMLElement | null;
            if (element4) {
                element4.style.background = 'none';
            }
        }
        // A function that sets the mini state of the sidenav.
        function handleMiniSidenav() {
            setMiniSidenav(dispatch, window.innerWidth < 1200);
            setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
            setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
        }

        /** 
         The event listener that's calling the handleMiniSidenav function when resizing the window.
        */
        window.addEventListener("resize", handleMiniSidenav);

        // Call the handleMiniSidenav function to set the state with the initial value.
        handleMiniSidenav();
        dispatchData(addData({ key: "organization_id", data: null }));
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleMiniSidenav);
    }, [dispatch, location]);

    // Render all the routes from the routes.js (All the visible items on the Sidenav)
    const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route, dropdown, collapse }: any) => {
        let returnValue;

        if (dropdown && collapse) {
            returnValue = (
                <div className="child_items" key={key}>
                    {/* Render a clickable div for the dropdown */}
                    <div className="dropdown_btn" onClick={() => handleDropdownToggle(key)}>
                        <SidenavCollapse isDropdownOpen={dropdownState[key]} dropdown={dropdown} name={name} icon={icon} dropdownIcon={<ArrowDropDown />} />
                    </div>
                    {/* Render the collapse list */}
                    <MDTypography className="dropdown_content" variant="ol" style={{ display: dropdownState[key] ? 'block' : 'none' }}>
                        {collapse.map((item: any) => {
                            return (
                                <>
                                    {
                                        item.type === "collapse" ?
                                            <>
                                                <NavLink key={item.key} to={item.route}>
                                                    <SidenavCollapse name={item.name} icon={item.icon} active={item.key === collapseName || item.key === collapseName + 's'} />
                                                </NavLink>
                                            </> :
                                            <>
                                                <NavLink key={item.key} to={item.route} />
                                            </>
                                    }
                                </>
                            )
                        })}
                    </MDTypography>
                </div>
            );
        } else if (type === "collapse") {
            returnValue = href ? (
                <Link
                    className="link_item2"
                    href={href}
                    key={key}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textDecoration: "none" }}
                >
                    <SidenavCollapse
                        name={name}
                        icon={icon}
                        active={key === collapseName}
                        noCollapse={noCollapse}
                    />
                </Link>
            ) : (
                <NavLink className="link_item" key={key} to={route}>
                    <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
                </NavLink>
            );
        } else if (type === "title") {
            returnValue = (
                <MDTypography
                    key={key}
                    color={textColor}
                    display="block"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="uppercase"
                    pl={3}
                    mt={2}
                    mb={1}
                    ml={1}
                >
                    {title}
                </MDTypography>
            );
        } else if (type === "divider") {
            returnValue = (
                <Divider
                    key={key}
                    light={
                        (!darkMode && !whiteSidenav && !transparentSidenav) ||
                        (darkMode && !transparentSidenav && whiteSidenav)
                    }
                />
            );
        }

        return returnValue;
    });

    return (
        <SidenavRoot
            className="sidebar_menu"
            {...rest}
            variant="permanent"
            ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
            onMouseEnter={rest.onMouseEnter} // Add this line
            onMouseLeave={rest.onMouseLeave} // And this line
        >
            <MDBox pt={3} pb={1} px={4} textAlign="center">
                <MDBox
                    display={{ xs: "block", xl: "none" }}
                    position="absolute"
                    top={0}
                    right={0}
                    p={1.625}
                    onClick={closeSidenav}
                    sx={{ cursor: "pointer" }}

                >
                    <MDTypography variant="h6" color="secondary">
                        <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    </MDTypography>
                </MDBox>
                <MDBox component={NavLink} to="/" display="flex" alignItems="center">
                    {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
                    <MDBox
                        width={!brandName && "100%"}
                        sx={(theme: any) => sidenavLogoLabel(theme, { miniSidenav })}
                    >
                        <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
                            {brandName}
                        </MDTypography>
                    </MDBox>
                </MDBox>
            </MDBox>
            <Divider
                light={
                    (!darkMode && !whiteSidenav && !transparentSidenav) ||
                    (darkMode && !transparentSidenav && whiteSidenav)
                }
            />
            <List>{renderRoutes}</List>

        </SidenavRoot>
    );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
    color: "info",
    brand: "",
    onMouseEnter: () => { },
    onMouseLeave: () => { },
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    brand: PropTypes.string,
    brandName: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};

export default Sidenav;
