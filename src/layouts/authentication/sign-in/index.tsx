import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { validateEmail, validatePassword, setCookie } from 'utils/common';
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { service } from "utils/Service/service";
import ErrorShow from "common/ErrorShow";
import { useDispatch, useSelector } from "react-redux";
import Loading from "common/Loading";


interface SignInProps {
    handleGenerateRoutes: () => {};
}

interface UserData {
    email: string;
    password: string;
}

const SignIn: React.FC<SignInProps> = ({ handleGenerateRoutes }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserData>();
    const d = useSelector((state: any) => state.commonData.commonData)
    console.log(d);
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleSetRememberMe = () => setRememberMe(!rememberMe);
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }

    const onSubmit: SubmitHandler<UserData> = async (data) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.auth.login,
                body: data,
                showAlert: true
            });
            const token = response?.data.data.token
            console.log("token : ", token)
            setCookie("token", token, 0.25);
            handleGenerateRoutes();
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const forgotPassword = () => {
        navigate('/forgot-password')
    }
    return (<>
        {
            loading ?
                <Loading /> :
                <>

                    <BasicLayout image={bgImage}>
                        <Card>
                            <MDBox
                                variant="gradient"
                                borderRadius="lg"
                                coloredShadow="info"
                                mx={2}
                                mt={-3}
                                p={2}
                                mb={1}
                                textAlign="center"
                                sx={{ backgroundColor: '#162D5A', color: '#FFFFFF' }}
                            >
                                <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                                    Sign in
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={4} pb={3} px={3}>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <MDInput type="email" label="Email" id="email" {...register("email", { required: true, validate: validateEmail })} fullWidth onChange={handleChange} />
                                        {errors.email && <ErrorShow error="Email is required" />}
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput type="password" label="Password" id="password" fullWidth {...register("password", { required: true, validate: validatePassword })}
                                            onChange={handleChange} />
                                        {errors.password && <ErrorShow error="Password is required" />}
                                    </MDBox>
                                    <MDBox mt={4} mb={1}>
                                        <MDButton
                                            variant="gradient"
                                            fullWidth
                                            onClick={handleSubmit(onSubmit)}
                                            sx={{ backgroundColor: '#162D5A', color: '#FFFFFF' }}
                                        >
                                            sign in
                                        </MDButton>
                                    </MDBox>
                                    <MDBox mt={4} mb={1}>
                                        <MDButton
                                            variant="gradient"
                                            fullWidth
                                            onClick={forgotPassword}
                                            sx={{ backgroundColor: '#162D5A', color: '#FFFFFF' }}
                                        >
                                            forgot password
                                        </MDButton>
                                    </MDBox>
                                    <MDBox mt={3} mb={1} textAlign="center">
                                        <MDTypography variant="button" color="text">
                                            Don&apos;t have an account?{" "}
                                            <MDTypography
                                                component={Link}
                                                to="/register"
                                                variant="button"
                                                color="info"
                                                fontWeight="medium"
                                                textGradient
                                            >
                                                Sign up
                                            </MDTypography>
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </BasicLayout>
                </>
        }
    </>
    );
}

export default SignIn;
