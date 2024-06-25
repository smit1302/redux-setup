import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Grid } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { service } from 'utils/Service/service';
import { City, Country, State } from 'country-state-city';
import { useMaterialUIController } from 'context';
import { addData } from "../../redux/features/commonData/commonData";
import ErrorShow from 'common/ErrorShow';
import { requiredMessage, validateEmail } from 'utils/common';
import { getValue } from '@testing-library/user-event/dist/utils';
import MDFileInput from 'common/MDFileInput';
interface ContactProps {
    method: string;
}
interface ContactData {
    is_primary: boolean;
    is_active: boolean;
    website_url: string;
    position?: string;
    qualification?: string;
    skills?: string;
    experience: number;
    birthdate?: string; // Assuming it's a string representing a date
    anniversary_date?: string; // Assuming it's a string representing a date
    time_zone?: string;
    longitude: number;
    latitude: number;
    localtion_url?: string; // Should this be location_url?
    contact_name: string;
    contact_email: string;
    country: string;
    state: string;
    city: string;
    address1?: string;
    zipcode?: number;
    phone_no?: number;
    mobile_no?: number;
    address2?: string;
    profile_image?: File;
}



const AddContact: React.FC<ContactProps> = ({ method }) => {
    const history = useNavigate();
    const dispatchData = useDispatch();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, unregister, trigger, watch, setError, clearErrors } = useForm<ContactData>();
    const { id } = useParams();
    const [selected, setSelected] = useState({
        country: '',
        state: '',
        city: ''
    });
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer.getContact,
                    params: id,
                });
                const contactData: ContactData = response?.data.data;
                // Set form values using setValue
                Object.entries(contactData).forEach(([key, value]) => {
                    setValue(key as keyof ContactData, value);
                });
                if (getValues('country')) {
                    handleCountryChange(getValues('country'))
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method, setValue]);

    const onSubmit = async (data: ContactData) => {
        console.log(data);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (typeof value === "boolean") {
                    formData.append(key, value.toString());
                }
                else {
                    formData.append(key, value);
                }
            }
        });

        formData.append("customer_id", customerId.customer_id.toString());
        try {
            let response;
            if (method === 'PUT') {
                response = await service.makeAPICall({
                    apiUrl: `${service.API_URL.customer.updateContact}/${id}`,
                    methodName: service.Methods.PUT,
                    body: formData
                });
            } else {
                response = await service.makeAPICall({
                    apiUrl: service.API_URL.customer.createContact,
                    methodName: service.Methods.POST,
                    body: formData
                });
            }
            if (response && response.data && response.data.success) {
                history(-1);
            } else {
                console.error("Error:", response?.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    // function to handle country change dropdown
    const handleCountryChange = async (selectedCountry: any) => {
        // setSelected({ country: selectedCountry.target.value, state: '', city: '' })
        if (typeof selectedCountry === 'string') {
            const countries = Country.getAllCountries();
            let country = countries.find(country => country.name === selectedCountry);
            const stateList = State.getStatesOfCountry(country?.isoCode);
            setStates(() => {
                return stateList.map((state: any) => {
                    return { value: state.name, label: state.name, stateCode: state.isoCode };
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
        const fetchCountries = async () => {
            const countryList = Country.getAllCountries();
            setCountries(countryList.map((country: any) => ({ value: country.name, label: country.name, countryCode: country.isoCode })));
        };
        fetchCountries();
    }, []);

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 2 }));
        history(`/my-customer`);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card style={{ padding: "20px" }} className='module_wrap'>
                        <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                Customer Contact
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4}>
                            <Grid container spacing={3}>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox
                                            {...register("is_primary")}
                                        />Is Primary
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox
                                            {...register("is_active")}
                                        />Is Active
                                    </MDBox>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Website Url"
                                            fullWidth
                                            required
                                            InputLabelProps={id && getValues('website_url') && { shrink: watch('website_url') ? true : false }}
                                            {...register("website_url", { required: requiredMessage })}
                                        />
                                        {errors.website_url?.message && <ErrorShow error={errors.website_url?.message} />}                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Position"
                                            fullWidth
                                            InputLabelProps={id && getValues('position') && { shrink: watch('position') ? true : false }}
                                            {...register("position")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Qualification"
                                            InputLabelProps={id && getValues('qualification') && { shrink: watch('qualification') ? true : false }}
                                            fullWidth
                                            {...register("qualification")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="number"
                                            label="Longitude"
                                            fullWidth
                                            InputLabelProps={id && getValues('longitude') && { shrink: watch('longitude') ? true : false }}
                                            {...register("longitude")}
                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Skills"
                                            fullWidth
                                            InputLabelProps={id && getValues('skills') && { shrink: watch('skills') ? true : false }}
                                            {...register("skills")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="number"
                                            label="Experience"
                                            fullWidth
                                            InputLabelProps={id && getValues('experience') && { shrink: watch('experience') ? true : false }}
                                            {...register("experience")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="date"
                                            label="Birth Date"
                                            fullWidth
                                            className={watch('birthdate') ? "has-value" : ""}
                                            InputLabelProps={id && getValues('birthdate') && { shrink: watch('birthdate') ? true : false }}
                                            {...register("birthdate")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} fullWidth>
                                        <MDInput
                                            type="number"
                                            label="Latitude"
                                            fullWidth
                                            InputLabelProps={id && getValues('latitude') && { shrink: watch('latitude') ? true : false }}
                                            {...register("latitude")}
                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="date"
                                            label="Anniversary Date"
                                            className={watch('anniversary_date') ? "has-value" : ""}
                                            fullWidth
                                            InputLabelProps={id && getValues('anniversary_date') && { shrink: watch('anniversary_date') ? true : false }}
                                            {...register("anniversary_date")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDBox
                                            mx={1}
                                            display="flex"
                                            alignItems="center"
                                            mb={2}
                                        >
                                            <MDTypography
                                                variant="label"
                                                mr={1}
                                                fontSize={"0.8em"}
                                                fontWeight="regular"
                                                color="text"
                                            >
                                                Profile Image
                                            </MDTypography>
                                            <MDFileInput name="profile_image" type={"image"} setError={setError} watch={watch} clearErrors={clearErrors} trigger={trigger} setValue={setValue} getValues={getValues} />
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="time_zone"
                                            fullWidth
                                            InputLabelProps={id && getValues('time_zone') && { shrink: watch('time_zone') ? true : false }}
                                            {...register("time_zone")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} fullWidth>
                                        <MDInput
                                            type="text"
                                            label="Location Url"
                                            InputLabelProps={id && getValues('localtion_url') && { shrink: watch('localtion_url') ? true : false }}
                                            fullWidth
                                            {...register("localtion_url")}
                                        />
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                    <Card style={{ padding: "20px" }} className='module_wrap'>
                        <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                Contact Details
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Contact Name"
                                            fullWidth
                                            required
                                            InputLabelProps={id && getValues('contact_name') && { shrink: watch('contact_name') ? true : false }}
                                            {...register("contact_name", { required: requiredMessage })}
                                        />
                                        {errors.contact_name?.message && <ErrorShow error={errors.contact_name?.message} />}
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput
                                            type="text"
                                            label="Contact Email"
                                            fullWidth
                                            required
                                            InputLabelProps={id && getValues('contact_email') && { shrink: watch('contact_email') ? true : false }}
                                            {...register("contact_email", { required: requiredMessage, validate: validateEmail })}
                                        />
                                        {errors.contact_email?.message && <ErrorShow error={errors.contact_email?.message} />}
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <Select
                                            {...register('country')}
                                            value={getValues('country') ? String(getValues('country')) : null}
                                            placeholder={'Country'}
                                            options={countries}
                                            handleChange={handleCountryChange}
                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <Select
                                            {...register('state')}
                                            value={getValues('state') ? String(getValues('state')) : null}
                                            placeholder={'State'}
                                            options={states}
                                            handleChange={handleStateChange}
                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <Select
                                            {...register('city')}
                                            value={getValues('city') ? String(getValues('city')) : null}
                                            placeholder={'City'}
                                            options={cities}
                                            handleChange={handleCityChange}
                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" label="Address1" {...register("address1")} fullWidth InputLabelProps={id && getValues('address1') && { shrink: watch('address1') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="number" label="Zipcode" {...register("zipcode")} fullWidth InputLabelProps={id && getValues('zipcode') && { shrink: watch('zipcode') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="number" label="Phone number" {...register("phone_no")} fullWidth InputLabelProps={id && getValues('phone_no') && { shrink: watch('phone_no') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="number" label="Mobile number" {...register("mobile_no")} fullWidth InputLabelProps={id && getValues('mobile_no') && { shrink: watch('mobile_no') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MDBox mb={3} ml={3} fullWidth>
                                        <MDInput type="text" label="Address2" {...register("address2")} fullWidth InputLabelProps={id && getValues('address2') && { shrink: watch('address2') ? true : false }} />
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                        <Grid item xs={12}>
                            <MDBox>
                                <div className="action_wrap d_flex">
                                    <MDButton className="action-button" variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add Contact' : 'Update Contact'}
                                    </MDButton>
                                    <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                                </div>
                            </MDBox>
                        </Grid>
                    </Card>
                </form>
            </DashboardLayout >
        </>
    );
}

export default AddContact;
