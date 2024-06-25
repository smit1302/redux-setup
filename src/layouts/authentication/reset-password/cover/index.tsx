import React, { useState, ChangeEvent } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { service } from "utils/Service/service";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { validateEmail, requiredMessage } from "utils/common";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [email, setEmail] = useState<string>('');
  const [backendError, setBackendError] = useState<string>('');

  const history = useNavigate();
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const onSubmit = async () => {
    setBackendError('');
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.POST,
        apiUrl: service.API_URL.auth.forgotPassword,
        body: { email } // Pass email directly without JSON.stringify
      });

      if (!response?.status) {
        // Handle backend validation errors
        setBackendError("Email is required");
      }
    } catch (err) {
      console.log("err :", err)
    }
  };

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
            Forgot Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form>
            <MDBox component="form" role="form">
              <MDBox >
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  id="email"
                  {...register("email", { required: requiredMessage, validate: validateEmail })}
                  fullWidth
                  onChange={handleInput}
                />
              </MDBox>
              {errors.email && <ErrorShow error={errors.email.message?.toString()} />}

              <MDBox ml={3} mt={2} pb={2}>
                <MDButton onClick={handleSubmit(onSubmit)} variant="gradient" color="info" > Reset</MDButton>
                <MDButton onClick={() => history(-1)} variant="contained" color="dark" style={{ marginLeft: '10px' }}>Back</MDButton>
              </MDBox>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ForgotPassword;
