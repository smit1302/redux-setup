import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { service } from "utils/Service/service";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useSelector } from "react-redux";
import { clearCookies } from "utils/common";

type Inputs = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();
    const loginData = useSelector((state: any) => state.login);

    useEffect(() => {
        console.log("loginData :", loginData)
    }, [])

    const handleOldPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
    }

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const handleClick: SubmitHandler<Inputs> = async () => {
        try {
            if (password !== confirmPassword) {
                console.log("Passwords do not match");
                return;
            }

            const userDataResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.get,
            });
            console.log("res :", JSON.stringify(userDataResponse?.data.data))
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.auth.changePassword,
                body: {
                    user_id: userDataResponse?.data.data.user_id,
                    oldPassword: oldPassword,
                    newPassword: password,
                },
            });

            console.log("response :", JSON.stringify(response))

            if (response?.status) {
                clearCookies('token')
                navigate('/sign-in')
            }
        } catch (err) {
            console.log("err :", err)
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{ maxWidth: 500, margin: 'auto' }} className='module_wrap'>
                <MDBox
                    className='module_head'
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    py={2}
                    mb={1}
                    mt={-2}
                    textAlign="center"
                >
                    <MDTypography variant="h3" fontWeight="medium" color="white" mt={0}>
                        Change Password
                    </MDTypography>
                </MDBox>
                <MDBox p={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={4}>
                            <MDInput
                                type="password"
                                label="Old Password"
                                id="oldPassword"
                                variant="standard"
                                fullWidth
                                {...register("oldPassword", { required: true })}
                                onChange={handleOldPasswordInput}
                            />
                        </MDBox>
                        {errors.oldPassword && <ErrorShow error="Old Password is required" />}
                        <MDBox mb={4}>
                            <MDInput
                                type="password"
                                label="New Password"
                                id="newPassword"
                                variant="standard"
                                fullWidth
                                {...register("newPassword", { required: true })}
                                onChange={handlePasswordInput}
                            />
                        </MDBox>
                        {errors.newPassword && <ErrorShow error="New Password is required" />}
                        <MDBox mb={4}>
                            <MDInput
                                type="password"
                                label="Confirm Password"
                                id="confirmPassword"
                                variant="standard"
                                fullWidth
                                {...register("confirmPassword", { required: true })}
                                onChange={handleConfirmPasswordInput}
                            />
                        </MDBox>
                        {errors.newPassword && <ErrorShow error="Confirm Password is required" />}
                        <MDBox mt={4} className='action_wrap d_flex center'>
                            <MDButton className='action-button' variant="gradient" color="info" fullWidth onClick={handleSubmit(handleClick)}>
                                Change
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}

export default ChangePassword;
