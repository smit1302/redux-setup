import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { connectSocket, socket } from './utils/socket';
// import { SocketContext, socket } from './socket/SocketContext';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { addData } from "./redux/features/commonData/commonData";
import { service } from "utils/Service/service";
import { useMaterialUIController, setMiniSidenav } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Loading from "common/Loading";
import 'App.css';
import { useDispatch, useSelector } from "react-redux";
import { authRequireRoute, generateRoutes } from "routes";
import AddClientGroup from "pages/ClientGroup/AddClientGroup";
import AlertMessage from "common/Alert";
import { getCookie } from "utils/common";
const SignUp = React.lazy(() => import('layouts/authentication/sign-up/index'));
const SignIn = React.lazy(() => import('./layouts/authentication/sign-in'));
const EditProfile = React.lazy(() => import('layouts/profile/EditProfile'));
const ResetPassword = React.lazy(() => import('layouts/authentication/reset-password/ResetPass'));
const ForgotPassword = React.lazy(() => import('layouts/authentication/reset-password/cover'));
const Dashboards = React.lazy(() => import("pages/DashBoard/Home"));

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const [routes, setRoutes] = useState<any>([]);
    const currentUser = useSelector((state: any) => state?.commonData.commonData?.userData);
    const location = useLocation();
    const token = getCookie('token');
    let currentPath = location.pathname;
    const dispatchUser = useDispatch();
    const navigate = useNavigate()
    const {
        miniSidenav,
        direction,
        layout,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    }: any = controller;
    const [onMouseEnter, setOnMouseEnter] = useState<boolean>(false);
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    useEffect(() => {
        if (socket?.active) {
            socket.on("connect_error", () => {
                console.error("socket error!");
                socket.close();
            });

            socket.on("sendReminder", (data: any) => {
                AlertMessage('info', data.reminder, 15000, "top-center");
                console.log(data, 'HAS BEEN recieved');
            });
            return () => {
                console.log(' I M DISCONNECTED')
                socket.close();
            }
        }
    }, [socket])

    useEffect(() => {
        if (!token) {
            navigate('/sign-in')
        } else {
            handleGenerateRoutes();
        }
    }, []);

    const handleGenerateRoutes = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.get,
            });

            dispatchUser(addData({ key: 'userData', data: response?.data?.data }));
            const generatedRoutes = generateRoutes(response?.data?.data?.permissions);
            setRoutes(generatedRoutes);

            connectSocket(response?.data?.data?.user_id);

            const lastIndex = currentPath.lastIndexOf('/');
            if (lastIndex === currentPath.length - 1) {
                currentPath = currentPath.substring(0, lastIndex);
            }

            const paths = currentPath.split('/');

            let checkPath = '';
            if (paths.length > 0 && /^\d+$/.test(paths[paths.length - 1])) {
                paths[paths.length - 1] = ":id";
                checkPath = paths.join("/")
            }

            let pathToCheck = checkPath ? checkPath : currentPath;
            let isInRoutes = authRequireRoute.findIndex(route => route.path === pathToCheck) != -1;

            if (isInRoutes) {
                return null;
            }

            isInRoutes = await (async () => {
                let isIn = false; // Initialize the variable to store the result
                const toCheck = checkPath ? checkPath : currentPath;
                await Promise.all(generatedRoutes.map(async (route) => {
                    if (route.collapse) {
                        await Promise.all(route.collapse.map(async (collapseRoute) => {
                            // Using find instead of some for cleaner code
                            const found = collapseRoute.collapse.find(endpoint => endpoint.route === toCheck);
                            if (found) {
                                isIn = true; // Set the flag to true if the path is found
                            }
                        }));
                    }
                }));
                return isIn; // Return the result
            })();

            // if (!isInRoutes) {
            //     navigate('/dashboard');
            //     return null;
            // }

            // if (lastIndex) {
            //     navigate(currentPath);
            //     return null;
            // }

        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    }

    useEffect(() => {
        let currentPath = window.location.pathname;

        // List of routes that should not redirect to sign-in page
        const allowedRoutes = ['/reset-password', '/forgot-password'];

        if (!token && !allowedRoutes.includes(currentPath)) {
            navigate('/sign-in');
        }
    }, []);

    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);

    const getRoutes = (allRoutes: any) => // Consider defining a specific type for your routes
        allRoutes?.map((route: any) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                return <Route path={route.route} element={route.component} key={route.key} />;
            }

            if (route.route) {
                return (
                    <Route
                        path={route.route}
                        element={route.component}
                        key={route.key}
                    />
                );
            }

            return null;
        });

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <>
                <CssBaseline />
                {layout === "dashboard" && (
                    <>
                        <Sidenav
                            color={sidenavColor}
                            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                            brandName=" QeTeam CRM"
                            routes={routes}
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                        />
                        <Configurator />
                    </>
                )}
                {layout === "vr" && <Configurator />}
                <Suspense fallback={<Loading />}>
                    <Routes>
                        {getRoutes(routes)}
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/sign-in" element={<SignIn handleGenerateRoutes={handleGenerateRoutes} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        {token && <>
                            {
                                authRequireRoute?.map((route) => {
                                    return <Route path={route.path} element={route.element} key={route.key} />
                                })
                            }
                        </>}
                    </Routes>
                </Suspense>
            </>

        </ThemeProvider>
    );
}
