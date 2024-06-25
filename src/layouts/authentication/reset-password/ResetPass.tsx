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
import { clearCookies } from "utils/common";

type Inputs = {
    newPassword: string;
  };

const RestPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl :any = params.get('token');
    console.log("token :",tokenFromUrl)
    setToken(tokenFromUrl);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleClick:SubmitHandler<Inputs> = async () => {
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.POST,
        apiUrl: service.API_URL.auth.resetPassword,
        body: {
          encryptedEmail: token,
          newPassword: password,
        },
      });
      console.log("response :" , JSON.stringify(response))
      if (response?.status) {
        clearCookies('token')
        navigate('/sign-in')
      }
    } catch (err) {
        console.log("err :",err)
    }
  }

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput type="password" label="NewPassword" id="newPassword" variant="standard" {...register("newPassword", { required: true})} fullWidth onChange={handleInput} />
            </MDBox>
            {errors.newPassword && <ErrorShow error="Password is required" />}
            <MDBox mt={6} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit(handleClick)}>
                Reset
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default RestPassword;
