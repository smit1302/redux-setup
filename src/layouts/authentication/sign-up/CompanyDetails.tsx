import React, { useState, useEffect } from 'react';
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import { useFormContext, Controller } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';
import { City, Country, State } from 'country-state-city';

import MDSelect from 'components/MDSelect';
function CompanyDetails() {
  const { control, formState: { errors }, getValues, trigger, setValue, unregister } = useFormContext();
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetchCountries()

    console.log("country : ", countries)
    console.log("states : ", states)
    console.log("cities : ", cities)
  }, [])


  const fetchCountries = async () => {
    const countryList = Country.getAllCountries();
    setCountries(countryList.map((country: any) => ({ value: country.name, label: country.name, countryCode: country.isoCode })));
  };

  //Country
  const handleCountryChange = async (selectedCountry: any) => {

    setValue('country', selectedCountry.target.value)
    let country = countries.find(country => country.value == getValues('country'));
    const stateList = State.getStatesOfCountry(country?.countryCode);
    var stateData: any = [];
    stateList.map((state) => {
      stateData.push({ value: state.name, label: state.name, stateCode: state.isoCode });
    })
    setStates(stateData);

    setCities([]);
  };
  //State
  const handleStateChange = async (selectedState: any) => {

    setValue('state', selectedState.target.value)
    let country = countries.find(country => country.value == getValues('country'));
    let state = states.find(st => st.value == getValues('state'));
    const cityList = City.getCitiesOfState(country?.countryCode, state.stateCode);
    var cityData: any = [];
    cityList.map((city) => {
      cityData.push({ value: city.name, label: city.name });
    })
    setCities(cityData);
  };
  //City 
  const handleCityChange = async (selectedCity: any) => {
    setValue('city', selectedCity.target.value)
  };


  return (
    <MDBox mt={4.5}>
      <Grid container spacing={2}>
        <Grid item xs={11} sm={9} md={5} lg={4} xl={6}>
          <MDBox mb={3} ml={3}>
            <Controller
              name="company_name"
              control={control}
              rules={{ required: "Name is required" }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="text" label="Company Name" fullWidth />}
            />
            {errors.company_name && <ErrorShow error={errors.company_name.message?.toString()} />}

          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="company_phone"
              control={control}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number"
                }
              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="text" label="Phone" fullWidth />}
            />
            {errors.company_phone && <ErrorShow error={errors.company_phone.message?.toString()} />}
          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="country"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue=""
              render={({ field }) =>
                <MDSelect
                  {...field}
                  value={getValues('country') ? String(getValues('country')) : null}
                  placeholder="Country"
                  options={countries}

                  handleChange={handleCountryChange}
                />}

            />
            {errors.country && <ErrorShow error='Country is Required' />}

          </MDBox>

          <MDBox mb={3} ml={3}>
            <Controller
              name="city"
              control={control}
              rules={{
                required: "City is Required",
              }}
              defaultValue=""
              render={({ field }) =>

                <MDSelect
                  {...field}
                  value={getValues('city') ? String(getValues('city')) : null}
                  placeholder="City"
                  options={cities}
                  handleChange={handleCityChange}
                />}
            />
            {errors.city && <ErrorShow error={errors.city.message?.toString()} />}
          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="zip"
              control={control}
              rules={{
                required: "Zip Code is required",
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: "Invalid Zip Code"
                }
              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="text" label="Zip" fullWidth />}
            />

            {errors.zip && <ErrorShow error={errors.zip.message?.toString()} />}

          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="number_of_offices"
              control={control}
              rules={{
                required: "Number of Offices is required",

              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="number" label="Number of Offices" fullWidth />}
            />
            {errors.number_of_offices && <ErrorShow error={errors.number_of_offices.message?.toString()} />}
          </MDBox>
        </Grid>
        <Grid item xs={11} sm={9} md={5} lg={4} xl={6}>
          <MDBox mb={3} ml={3}>
            <Controller
              name="company_email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="text" label="Email" fullWidth />}
            />
            {errors.company_email && <ErrorShow error={errors.company_email.message?.toString()} />}

          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Address is required",
              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} label="Address" multiline fullWidth />}
            />

            {errors.address && <ErrorShow error={errors.address.message?.toString()} />}

          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="state"
              control={control}
              rules={{
                required: "State is required",
              }}
              defaultValue=""
              render={({ field }) =>

                <MDSelect
                  {...field}
                  value={getValues('state') ? String(getValues('state')) : null}
                  placeholder="State"
                  options={states}
                  handleChange={handleStateChange}
                />}
            />
            {errors.state && <ErrorShow error={errors.state.message?.toString()} />}
          </MDBox>
          <MDBox mb={3} ml={3}>
            <Controller
              name="company_names"
              control={control}
              rules={{
                required: "Companies is Required",
              }}
              defaultValue=""
              render={({ field }) => <MDInput {...field} type="text" label="Companies" fullWidth />}
            />

            {errors.company_names && <ErrorShow error={errors.company_names.message?.toString()} />}
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default CompanyDetails;
