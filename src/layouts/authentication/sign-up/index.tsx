import React, { useState } from 'react';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import CoverLayout from 'layouts/authentication/components/CoverLayout';
import bgImage from 'assets/images/aqe-group-logo.png';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';

// Step components
import SelectPlan from './SelectPlan';
import PersonalDetails from './PersonalDetails';
import CompanyDetails from './CompanyDetails';
import BillingDetails from './BillingDetails';

// Utility function or service
import { service } from "utils/Service/service";
import DataTable from 'examples/Tables/DataTable';

const SignUp = () => {
  const navigate = useNavigate();
  const stepFields: any = {
    0: ['plan_id'],
    1: ['name', 'email', 'password', 'phone'],
    2: ['company_name', 'company_phone', 'city', 'zip', 'number_of_offices', 'company_email', 'address', 'state', 'country', 'company_names'], // Replace these with actual field names for CompanyDetails
    3: ['card_number', 'csv', 'expiry_month', 'expiry_year']
  };

  const methods = useForm();
  const steps = ['Select Plan', 'Personal Details', 'Company Details', 'Billing Details'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = async () => {
    const currentFields = stepFields[activeStep];
    console.log("currentFields", currentFields)
    const isValid = await methods.trigger(currentFields);
    console.log("isValid", isValid)
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    methods.reset();
  };

  const handleFinish = async () => {

    const data = methods.getValues();
    console.log("data",data)
    const body = {
      ...data,
      plan_id: +data.plan_id,
      zip: +data.zip,
      number_of_offices: +data.number_of_offices,
      card_number: +data.card_number,
      csv: +data.csv
    }
    console.log("body : ", body)
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.POST,
        apiUrl: service.API_URL.auth.signUp,
        body: body,
        showAlert:true
      });
      
      if (response?.status === 201) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlesubmit = async () => {
    const data = methods.getValues();
    if (data.card_number === "") {
      setSubmitted(true);
      return false;
    }
    if (data.csv === "") {
      setSubmitted(true);
      return false;
    }

    if (data.expiry_month === "") {
      setSubmitted(true);
      return false;
    }

    if (data.expiry_year === "") {
      setSubmitted(true);
      return false;
    }

   
  };

 

const renderStepComponent = (stepIndex: any) => {
  switch (stepIndex) {
    case 0:
      return <SelectPlan />;
    case 1:
      return <PersonalDetails />;
    case 2:
      return <CompanyDetails />;
    case 3:
      return <BillingDetails submitted={submitted} />;
    default:
      return null;
  }
};

return (
  <CoverLayout image={bgImage}>
    <FormProvider {...methods}> 
      <Card>
        <MDBox px={3} pt={6} pb={3}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={methods.handleSubmit(handleFinish)}> 
            {renderStepComponent(activeStep)}
            <MDBox sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {activeStep === steps.length ? (
                <>
                  <MDTypography sx={{ mt: 2, mb: 1 }}>All steps completed - you're finished</MDTypography>
                  <MDBox sx={{ flex: '1 1 auto' }} />
                  <MDButton onClick={handleReset}>Reset</MDButton>
                </>
              ) : (
                <>
                  <MDButton color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </MDButton>
                  <MDBox sx={{ flex: '1 1 auto' }} />
                  {activeStep === steps.length - 1 ? (
                    <MDButton type="submit" onClick={handlesubmit}>Finish</MDButton>
                  ) : (
                    <MDButton onClick={handleNext}>Next</MDButton>
                  )}
                </>
              )}
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </FormProvider>
  </CoverLayout>
);
}

export default SignUp;
