import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Grid, Radio, RadioGroup, FormControlLabel, Card, Typography } from '@mui/material';
import MDBox from 'components/MDBox';

function SelectPlan() {
  const { control, formState: { errors } } = useFormContext(); // This hook is used to access the form context
  console.log("errors", errors)
  return (
    <>
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={11} sm={9} md={5} lg={15} xl={4}>
            <MDBox mb={3}>
              <Card style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h5 style={{ textAlign: 'center' }}>Free (7 Days Free Trial)</h5>
                <Controller
                  name="plan_id"
                  control={control}
                  rules={{
                    required: "hii",
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup {...field} value={field.value.toString()}>
                      <FormControlLabel value="1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} control={<Radio />} label="" />
                    </RadioGroup>
                  )}
                />
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={11} sm={9} md={5} lg={15} xl={4}>
            <MDBox mb={3}>
              <Card style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h5 style={{ textAlign: 'center' }}>Pay Monthly</h5>
                <Controller
                  name="plan_id"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup {...field} value={field.value.toString()}>
                      <FormControlLabel style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} value="2" control={<Radio />} label="" />
                    </RadioGroup>
                  )}
                />
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={11} sm={9} md={5} lg={15} xl={4}>
            <MDBox mb={3}>
              <Card style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h5 style={{ textAlign: 'center' }}>Pay Annually</h5>
                <Controller
                  name="plan_id"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup {...field} value={field.value.toString()}>
                      <FormControlLabel style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} value="3" control={<Radio />} label="" />
                    </RadioGroup>
                  )}
                />
              </Card>

            </MDBox>

          </Grid>
        </Grid>
        {errors.plan_id && (
          <Typography color="error" variant="body2">
            {errors.plan_id.type === 'required' ? 'Please select a plan' : 'Custom error message for plan_id'}
          </Typography>
        )}
      </MDBox>
    </>
  );
}

export default SelectPlan;
