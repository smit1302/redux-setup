import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import Typography from '@mui/material/Typography';
import ErrorShow from 'common/ErrorShow';

function PersonalDetails() {
  const { control, formState: { errors } } = useFormContext(); // Access form context

  return (
    <>
      <MDBox mt={4.5}>
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <>
                  <MDInput
                    {...field}
                    type="text"
                    label="Name"
                    fullWidth

                  />
                </>
              )}
            />
            {errors.name && <ErrorShow error={errors.name.message?.toString()} />}

          </MDBox>
          <MDBox mb={2}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}

              render={({ field }) => (
                <>
                  <MDInput
                    {...field}
                    type="email"
                    label="Email"
                    fullWidth
                  />
                </>
              )}
            />
            {errors.email && <ErrorShow error={errors.email.message?.toString()} />}

          </MDBox>
          <MDBox mb={2}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters"
                },
                pattern: {
                  value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                }
              }}
              defaultValue=""
              render={({ field }) => (
                <>
                  <MDInput
                    {...field}
                    type="password"
                    label="Password"
                    fullWidth
                  />
                </>
              )}
            />
            {errors.password && <ErrorShow error={errors.password.message?.toString()} />}
          </MDBox>
          <MDBox mb={2}>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number"
                }
              }}
              defaultValue=""
              render={({ field }) => (
                <>
                  <MDInput
                    {...field}
                    type="number"
                    label="Contact"
                    fullWidth

                  />
                </>
              )}
            />
            {errors.phone && <ErrorShow error={errors.phone.message?.toString()} />}

          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default PersonalDetails;
