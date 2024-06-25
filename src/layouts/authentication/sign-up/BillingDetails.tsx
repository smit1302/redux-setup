// BillingDetails.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import { useFormContext, Controller } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';

import MDSelect from 'components/MDSelect';

function BillingDetails(submitted: any) {
  const { control, formState: { errors } } = useFormContext();
  const error = submitted.submitted
  const [month, setMonth] = useState<any[]>([]);
  const [year, setYear] = useState<any[]>([]);

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: (index + 1).toString().padStart(2, '0'), // Ensure two-digit format
    label: (index + 1).toString().padStart(2, '0'), // Month numbers as labels
  }));
  const generateFutureYears = () => {
    const currentYear = new Date().getFullYear();
    const futureYears = [];
    for (let i = 0; i < 10; i++) {
      const year = (currentYear + i).toString(); // Convert to string
      futureYears.push({ label: year, value: year });
    }
    return futureYears;
  };

  const futureYearOptions = generateFutureYears();

  return (
    <>
      <MDBox mt={4.5}>
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <Controller
              name="card_number"
              control={control}
              rules={{
                required: "Card number is required",
                pattern: {
                  value: /^\d{4}(?:\s?\d{4}){3}$/,
                  message: "Invalid Card number"
                }
              }}
              defaultValue=""
              render={({ field }) => (
                <MDInput {...field} type="text" label="Card Number" fullWidth onChange={(e: any) => {
                  const { value } = e.target;
                  // Remove non-digit characters
                  const newValue = value.replace(/\D/g, '');
                  // Add space after every 4 digits
                  const formattedValue = newValue.replace(/(\d{4})/g, '$1 ').trim();
                  // Update field value
                  field.onChange(formattedValue);
                }} />
              )}
            />
            {error && errors.card_number && <ErrorShow error={errors.card_number.message?.toString()} />}

          </MDBox>
          <MDBox mb={2}>
            <Controller
              name="csv"
              control={control}
              rules={{
                required: "Cvv number is required",
                pattern: {
                  value: /[0-9]{3}/,
                  message: "Invalid Cvv number"
                },
                maxLength: 3 // Limit input to 3 characters
              }}
              defaultValue=""
              render={({ field }) => (
                <MDInput {...field} type="text" label="CVV" fullWidth inputProps={{ maxLength: 3 }} />
              )}
            />
            {error && errors.csv && <ErrorShow error={errors.csv.message?.toString()} />}

          </MDBox>
          <MDBox mb={2}>
            <Controller
              name="expiry_month"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <MDSelect
                  {...field}
                  placeholder='Card Expiry Month'
                  options={monthOptions}
                  handleChange={(selectedOption) => field.onChange(selectedOption.target.value)}
                  value={field.value}
                />
              )}
            />
            {error && errors.expiry_month && <ErrorShow error='Card Expiry is Required' />}
          </MDBox>


          <MDBox mb={2}>
            <Controller
              name="expiry_year"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <MDSelect
                  {...field}
                  placeholder='Card Expiry Year'
                  options={futureYearOptions}
                  handleChange={(selectedOption) => field.onChange(selectedOption.target.value)}
                  value={field.value}
                />
              )}
            />

            {error && errors.expiry_year && <ErrorShow error='Card Expiry Year is Required' />}


          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default BillingDetails;
