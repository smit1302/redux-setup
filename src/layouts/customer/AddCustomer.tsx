import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Card, Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import Select from 'components/MDSelect';
import Checkbox from "@mui/material/Checkbox";
import { City, Country, State } from 'country-state-city';
import { useMaterialUIController } from 'context';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getLocationData, requiredMessage, validateEmail } from 'utils/common';
import ErrorShow from 'common/ErrorShow';

interface CustomerFormData {
    name: string;
    email: string;
    email_2: string;
    phone: string;
    company_name: string;
    mobile_no: string;
    website_url: string;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
    activity_type_id: string;
    datasource_id: string;
    business_type: string;
    service_type: string;
    platform_master_id: string;
    opportunity_by: number;
    Amount: string;
    projection_time: string;
    website_url_opp: string;
    follow_up: boolean;
}


const AddCustomer = () => {
    const [controller] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [bde, setBde] = useState<any[]>([]);
    const [buisnessType, setBuisnessType] = useState<any[]>([]);
    const [activityType, setActivityType] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [product, setProduct] = useState<any[]>([]);
    const [platformType, setPlatformType] = useState<any[]>([]);
    // const [opportunityBy, setOpportunityBy] = useState<any[]>([]);
    const { register, trigger, unregister, handleSubmit, getValues, formState: { errors }, setValue, watch } = useForm<CustomerFormData>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const countryList = Country.getAllCountries();
            setCountries(() => {
                return countryList.map((country: any) => {
                    return { value: country.name, label: country.name, countryCode: country.isoCode };
                });
            });
        };
        fetchCountries();
    }, []);

    const handleCountryChange = async (selectedCountry: any) => {
        // setSelected({ country: selectedCountry.target.value, state: '', city: '' })
        if (typeof selectedCountry === 'string') {
            const countries = Country.getAllCountries();
            let country = countries.find(country => country.name === selectedCountry);
            const stateList = State.getStatesOfCountry(country?.isoCode);
            setStates(() => {
                return stateList.map((state: any) => {
                    return { value: state.name, label: state.name };
                });
            });
            if (country?.isoCode) {
                const cityList = City.getCitiesOfCountry(country?.isoCode);
                if (cityList) {
                    setCities(() => {
                        return cityList.map((city: any) => {
                            return { value: city.name, label: city.name };
                        });
                    });
                }
            }
            trigger('country')
            trigger('state');
            trigger('city')
            return null;
        }

        setValue('country', selectedCountry.target.value)
        if (selectedCountry) {
            let country = countries.find(country => country.value == selectedCountry.target.value);
            const stateList = State.getStatesOfCountry(country?.countryCode);
            setStates(() => {
                return stateList.map((state: any) => {
                    return { value: state.name, label: state.name, stateCode: state.isoCode };
                });
            });
        } else {
            setStates([]);
            setCities([]);
        }
        if (getValues('state')) {
            unregister('state')
            trigger('state');
        }
        if (getValues('city')) {
            unregister('city')
            trigger('city');
        }
    };

    const handleStateChange = async (selectedState: any) => {
        let country = countries.find(country => country.value == getValues('country'));
        let state = states.find(state => state.value == selectedState.target.value);
        const cityList = City.getCitiesOfState(country?.countryCode, state?.stateCode);
        if (cityList) {
            setCities(() => {
                return cityList.map((city: any) => {
                    return { value: city.name, label: city.name };
                });
            });
        }
        else {
            setCities([]);
        }

        setValue('state', selectedState.target.value)
    };

    const handleCityChange = async (selectedCity: any) => {
        setValue('city', selectedCity.target.value);
        trigger('city')
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setBuisnessType(response.data.data.buisness_type);
                // setOpportunityBy(response.data.data.opportunity_by);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        fetchMarketingActivity();
        fetchContactDatasource();
        fetchPlatform();
        fetchDropdownData();
        fetchProduct();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const filterUserDataByRole = (userData: any[], roleName: string) => {
                return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
                    value: user.user_id,
                    label: user.name,
                }));
            };
            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            setBde(bde);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchContactDatasource = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.contact
            });
            setDataSource(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMarketingActivity = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.activity,
            });
            setActivityType(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPlatform = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            console.log("API Platform");
            setPlatformType(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProduct = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            console.log("API PRODUCT");
            setProduct(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    const handleSelectChange = (name: string, value: any) => {
        if (name === 'business_type') {
            console.log('kdfn', value)
            setValue(name, value.target.value);
            trigger(name)
        } else {
            setValue(name as keyof CustomerFormData, value.target.value);
            trigger(name as keyof CustomerFormData)
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue('follow_up', !getValues('follow_up'))
        trigger('follow_up')
    };

    const onSubmit = async (customerData: CustomerFormData) => {
        console.log(customerData);
        try {
            const dataToSend = {
                ...customerData,
                mobile_no: Number(customerData.mobile_no),
                phone: Number(customerData.phone),
                latitude: Number(customerData.latitude),
                longitude: Number(customerData.longitude),
                Amount: Number(customerData.Amount)
            };

            let locationData = await getLocationData();
            locationData.location_of = "registration";

            const response = await service.makeAPICall({
                apiUrl: service.API_URL.customer.create,
                methodName: service.Methods.POST,
                body: { ...dataToSend, locationData },
            });

            if (response && response.data && response.data.success) {
                history(-1);
            } else {
                console.error("Error creating customer:", response?.data.message);
            }
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    };

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 2 }));
        history(`/my-customer`);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: "20px" }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Add Customer Details
                                </MDTypography>
                            </MDBox>
                            <MDBox component="form" role="form">
                                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput type="text" label="Name" {...register("name", { required: requiredMessage })} fullWidth required />
                                            {errors?.name?.message && <ErrorShow error={errors?.name?.message} />}
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput type="email" label="Email" {...register("email", { required: requiredMessage, validate: validateEmail })} fullWidth required />
                                            {errors?.email?.message && <ErrorShow error={errors?.email?.message} />}
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Email 2" {...register("email_2")} fullWidth />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Phone" type="number" {...register("phone", { required: requiredMessage })} fullWidth />
                                            {errors?.phone?.message && <ErrorShow error={errors?.phone?.message} />}
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Longitude" type="number" {...register("longitude")} fullWidth />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Latitude" type="number" {...register("latitude")} fullWidth />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={3}>
                                <MDBox mb={2}>
                                    <MDInput label="Company Name" name="company_name" value={customerData.company_name}  fullWidth required />
                                </MDBox>
                            </Grid> */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Mobile" type="number" {...register("mobile_no", { required: requiredMessage })} fullWidth required />
                                            {errors?.mobile_no?.message && <ErrorShow error={errors?.mobile_no?.message} />}

                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Website URL" {...register("website_url", { required: requiredMessage })} fullWidth required />
                                            {errors?.website_url?.message && <ErrorShow error={errors?.website_url?.message} />}

                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <MDInput label="Address" {...register("address")} fullWidth />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select
                                                {...register("country")}
                                                value={getValues('country') ? String(getValues('country')) : null}
                                                placeholder={'Country'}
                                                options={countries}
                                                handleChange={handleCountryChange}
                                            />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select
                                                {...register("state")}
                                                value={getValues('state')}
                                                placeholder={'State'}
                                                options={states}
                                                handleChange={handleStateChange}
                                            />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select
                                                {...register("city")}
                                                value={getValues('city')}
                                                placeholder={'City'}
                                                options={cities}
                                                handleChange={handleCityChange}
                                            />
                                        </MDBox>
                                        {/* Add other input fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select placeholder="Buisness Type" value={getValues("business_type")} {...register("business_type", { required: requiredMessage })} options={buisnessType} handleChange={(value) => handleSelectChange("business_type", value)} />
                                            {errors?.business_type?.message && <ErrorShow error={errors?.business_type?.message} />}
                                        </MDBox>
                                        {/* Add other dropdown fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select
                                                placeholder="Contact Datasource"
                                                options={dataSource.map(dataSource => ({
                                                    value: dataSource.datasource_id,
                                                    label: dataSource.name,
                                                }))}
                                                value={getValues('datasource_id')}
                                                {...register("datasource_id", { required: requiredMessage })}
                                                handleChange={(selectedOption) => {
                                                    setValue('datasource_id', selectedOption.target.value);
                                                    trigger('datasource_id')
                                                }}

                                            />
                                            {errors?.datasource_id?.message && <ErrorShow error={errors?.datasource_id?.message} />}

                                        </MDBox>
                                        {/* Add other dropdown fields */}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <MDBox mb={2}>
                                            <Select
                                                placeholder="Marketing Activity"
                                                options={activityType.map(activityType => ({
                                                    value: activityType.activity_type_id,
                                                    label: activityType.name,
                                                }))}
                                                value={getValues('activity_type_id')}
                                                {...register("activity_type_id", { required: requiredMessage })}
                                                handleChange={(selectedOption) => {
                                                    setValue('activity_type_id', selectedOption.target.value);
                                                    trigger('activity_type_id')
                                                }}
                                            />
                                            {errors?.activity_type_id?.message && <ErrorShow error={errors?.activity_type_id?.message} />}

                                        </MDBox>
                                        {/* Add other dropdown fields */}
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>

                        <MDBox pt={6} pb={3}>
                            <Card style={{ padding: "20px" }} className='module_wrap'>
                                <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Add Opportunity Details
                                    </MDTypography>
                                </MDBox>
                                <MDBox component="form" role="form">
                                    <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <MDBox mb={2}>
                                                <Select
                                                    placeholder="platform"
                                                    options={platformType.map(platformType => ({
                                                        value: platformType.platform_master_id,
                                                        label: platformType.name,
                                                    }))}
                                                    value={getValues('platform_master_id')}
                                                    {...register("platform_master_id", { required: requiredMessage })}
                                                    handleChange={(selectedOption) => {
                                                        setValue('platform_master_id', selectedOption.target.value)
                                                        trigger('platform_master_id')
                                                    }}
                                                />
                                                {errors?.platform_master_id?.message && <ErrorShow error={errors?.platform_master_id?.message} />}
                                            </MDBox>
                                            <Checkbox
                                                checked={getValues('follow_up')}
                                                {...register("follow_up")}
                                                onChange={handleCheckboxChange}
                                            />Follow Up
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <MDBox mb={2}>
                                                <MDInput label="Amount" {...register("Amount", { required: requiredMessage })} type="number" fullWidth required />
                                                {errors?.Amount?.message && <ErrorShow error={errors?.Amount?.message} />}

                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDInput label="Projection Date" className={watch('projection_time') ? "has-value" : ""}   {...register("projection_time", { required: requiredMessage })} type="date" fullWidth required />
                                                {errors?.projection_time?.message && <ErrorShow error={errors?.projection_time?.message} />}
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <MDBox mb={2}>
                                                <Select
                                                    placeholder="Opportunity By"
                                                    options={bde}
                                                    {...register("opportunity_by")}
                                                    value={getValues('opportunity_by')}
                                                    handleChange={(value: any) => {
                                                        setValue("opportunity_by", value.target.value)
                                                        trigger("opportunity_by")
                                                    }
                                                    }
                                                />
                                                {errors?.opportunity_by?.message && <ErrorShow error={errors?.opportunity_by?.message} />}
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDInput label="Website URL" {...register("website_url_opp", { required: requiredMessage })} fullWidth required />
                                                {errors?.website_url_opp?.message && <ErrorShow error={errors?.website_url_opp?.message} />}

                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <MDBox mb={2}>
                                                <Select
                                                    placeholder="Select Products"
                                                    options={product.map(product => ({
                                                        value: product.id,
                                                        label: product.name,
                                                    }))}

                                                    value={getValues('service_type')}
                                                    {...register("service_type", { required: requiredMessage })}
                                                    handleChange={(selectedOption) => {
                                                        setValue('service_type', selectedOption.target.value)
                                                        trigger('service_type')
                                                    }}
                                                />
                                                {errors?.service_type?.message && <ErrorShow error={errors?.service_type?.message} />}

                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>

                        <div className="action_wrap d_flex">
                            <MDButton className='action-button' variant={"contained"} color={sidenavColor} onClick={handleSubmit(onSubmit)} children="Add Customer" />
                            <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}
export default AddCustomer;

