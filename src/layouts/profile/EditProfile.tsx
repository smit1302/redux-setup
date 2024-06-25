import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'

import backgroundImage from "assets/images/bg-profile.jpeg";
import MDInput from 'components/MDInput';
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';

import Card from "@mui/material/Card";
import MDTypography from 'components/MDTypography';
import { useNavigate } from 'react-router-dom';
import './style.css'
// import Select from 'common/Select';
import Select from 'components/MDSelect';
import globalMessages from 'utils/global';
import { useEffect, useState } from 'react';
import { service } from 'utils/Service/service';
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorShow from 'common/ErrorShow';
import { City, Country, State } from 'country-state-city';
import { validateEmail, requiredMessage, validatePassword, validateContact, validateZip } from 'utils/common';


interface UserData {
    login_name: string;
    email: string,
    name: string;
    title: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    im_type: number;
    im_id: string;
    linkedin: string;
    facebook: string;
    twitter: string;
    blog: string;
    birth_date: string;
    anniversary: string;
    qualification: string;
    experience: string;
}

const EditProfile = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, trigger, getValues, unregister, watch } = useForm<UserData>();
    const global = globalMessages.profile;
    const [imTypeOption, setImTypeOption] = useState<{ id: any; name: any; }[] | undefined>(undefined);
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);


    useEffect(() => {
        console.log("profile data : ",)
        fetchData();
        fetchImTypes();
        fetchCountries()
    }, []);

    //function to fetch im types
    const fetchImTypes = async () => {
        try {
            const [imTypeResponse] = await Promise.all([
                service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.profile.fetchImTypeList,
                    query: { forSelect: true }
                }),
            ]);

            const imTypes = imTypeResponse?.data.data;
            if (imTypes && Array.isArray(imTypes)) {
                const data = imTypes?.map(imType => ({ id: imType.id, name: imType.name }));
                setImTypeOption(data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const fetchData = async () => {
        try {
            const userDataResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.get,
            });

            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.profile.getSystemUser
            });

            const userdata: UserData = userDataResponse?.data?.data;
            if (userdata) {
                Object.entries(userdata).forEach(([key, value]) => {
                    setValue(key as keyof UserData, value);
                });
            }
            console.log('getvalues', getValues())
            const user: UserData = response?.data?.data;
            if (user) {
                Object.entries(user).forEach(([key, value]) => {
                    setValue(key as keyof UserData, value);
                });
            }
            if (getValues('country')) {
                handleCountryChange(getValues('country'))
            }

            trigger('im_type');
            trigger('country');
            trigger('state');
            trigger('city');



        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    const onSubmit: SubmitHandler<UserData> = async (data: any) => {
        console.log("data :", data)
        const response = await service.makeAPICall({
            methodName: service.Methods.PUT,
            apiUrl: service.API_URL.profile.profile,
            body: data
        });
        if (response?.statusText == 'OK') {
            navigate('/profile')
        }

    }


    // Manually trigger validation for the changed field
    const ChangeValue = (event: any, type: keyof UserData) => {
        setValue(type, event.target.value);
        trigger(type);
    };
    // function to handle country change dropdown
    const handleCountryChange = async (selectedCountry: any) => {

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


    // function to handle state changes
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
        if (getValues('city')) {
            unregister('city')
            trigger('city');
        }

        setValue('state', selectedState.target.value)
    };

    // function to handle city changes
    const handleCityChange = async (selectedCity: any) => {
        setValue('city', selectedCity.target.value);
        trigger('city')
    };

    const fetchCountries = async () => {
        const countryList = Country.getAllCountries();
        setCountries(countryList.map((country: any) => ({ value: country.name, label: country.name, countryCode: country.isoCode })));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <MDBox position="relative" mb={5}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }: any) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                <Card
                    sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <MDBox height="100%" mt={0.5} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    {getValues('name')}
                                </MDTypography>

                            </MDBox>
                        </Grid>
                    </Grid>
                    <MDBox mt={5} mb={3}>
                        <Grid container spacing={2} >
                            <Grid item px={2} xs={12} md={6} xl={5}>
                                <MDBox mb={3} ml={3} >
                                    <MDInput
                                        type="text"
                                        label={global.login_name}
                                        id="login_name"
                                        value={getValues('login_name')}
                                        {...register("login_name", { required: requiredMessage })}

                                        InputLabelProps={getValues('login_name') && { shrink: watch('login_name') ? true : false }}
                                        fullWidth
                                    />
                                    {errors.login_name?.message && <ErrorShow error={errors.login_name?.message} />}
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.email} fullWidth id="email"
                                        {...register("email", { required: requiredMessage, validate: validateEmail })}
                                        InputLabelProps={getValues('email') && { shrink: watch('email') ? true : false }} />

                                    {errors.email?.message && <ErrorShow error={errors.email?.message} />}
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.name} fullWidth id="user_name"
                                        {...register("name", { required: requiredMessage })}
                                        InputLabelProps={getValues('name') && { shrink: watch('name') ? true : false }} />

                                    {errors.name?.message && <ErrorShow error={errors.name?.message} />}
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.title} fullWidth id="title"
                                        {...register("title")}
                                        InputLabelProps={getValues('title') && { shrink: watch('title') ? true : false }} />

                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.address1} fullWidth id="address1"
                                        {...register("address1")}
                                        InputLabelProps={getValues('address1') && { shrink: watch('address1') ? true : false }} />

                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.address2} fullWidth id="address2"
                                        {...register("address2")}
                                        InputLabelProps={getValues('address2') && { shrink: watch('address2') ? true : false }} />

                                </MDBox>

                                <MDBox mb={3} ml={3} >

                                    <Select
                                        value={getValues('country') ? String(getValues('country')) : null}
                                        placeholder={globalMessages.user.country}
                                        options={countries}
                                        {...register('country')}
                                        handleChange={handleCountryChange}
                                    />

                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <Select
                                        value={getValues('state') ? String(getValues('state')) : null}
                                        placeholder={globalMessages.user.state}
                                        options={states}
                                        {...register('state')}
                                        handleChange={handleStateChange}
                                    />
                                </MDBox>


                                <MDBox mb={3} ml={3} >
                                    <Select
                                        value={getValues('city') ? String(getValues('city')) : null}
                                        placeholder={globalMessages.user.city}
                                        options={cities}
                                        {...register('city')}
                                        handleChange={handleCityChange}
                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.zip} id="zip" {...register("zip", { validate: validateZip })}
                                        InputLabelProps={getValues('zip') && { shrink: watch('zip') ? true : false }}
                                        fullWidth />
                                    {errors.zip?.message && <ErrorShow error={errors.zip?.message} />}
                                </MDBox>

                            </Grid>

                            <Grid item px={2} xs={12} md={6} xl={5}>
                                <MDBox mb={3} ml={3} >
                                    <Select
                                        value={getValues('im_type') ? String(getValues('im_type')) : null}
                                        placeholder={globalMessages.user.im_type}
                                        options={(imTypeOption || [])?.map(imtype => ({ value: imtype.id, label: imtype.name }))}
                                        handleChange={(event: any) => ChangeValue(event, "im_type")}
                                        {...register("im_type", { required: requiredMessage })}
                                    />
                                    {errors.im_type && <ErrorShow error="Please select this" />}
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput
                                        type="text"
                                        label={global.im_id}
                                        id="im_id"
                                        fullWidth
                                        InputLabelProps={getValues('im_id') && { shrink: watch('im_id') ? true : false }}
                                        {...register("im_id", { required: requiredMessage })}

                                    />
                                    {errors.im_id?.message && <ErrorShow error={errors.im_id?.message} />}

                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.linked_in}
                                        id="linkedin"
                                        {...register("linkedin")}
                                        fullWidth
                                        InputLabelProps={getValues('linkedin') && { shrink: watch('linkedin') ? true : false }}
                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.facebook}
                                        id="facebook" fullWidth
                                        {...register("facebook")}
                                        InputLabelProps={getValues('facebook') && { shrink: watch('facebook') ? true : false }}

                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.twitter} id="twitter" fullWidth

                                        {...register("twitter")} value={watch("twitter")}
                                        InputLabelProps={getValues('twitter') && { shrink: watch('twitter') ? true : false }}
                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.blog} id="blog" fullWidth
                                        InputLabelProps={getValues('blog') && { shrink: watch('blog') ? true : false }}
                                        {...register("blog")}
                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput
                                        label={global.birthdate}
                                        fullWidth
                                        type="date"
                                        className={watch("birth_date") ? "has-value" : ""}

                                        {...register("birth_date")}
                                        InputLabelProps={getValues('birth_date') && { shrink: watch('birth_date') ? true : false }}

                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput
                                        type="date"
                                        className={watch("anniversary") ? "has-value" : ""}
                                        label={global.anniversary}
                                        {...register("anniversary")}
                                        InputLabelProps={getValues('anniversary') && { shrink: watch('anniversary') ? true : false }}
                                        fullWidth
                                    />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.qualification} id="qualification"{...register("qualification")} InputLabelProps={getValues('qualification') && { shrink: watch('qualification') ? true : false }} fullWidth />
                                </MDBox>

                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label={global.experience}
                                        id="experience"
                                        {...register("experience")}
                                        InputLabelProps={getValues('experience') && { shrink: watch('experience') ? true : false }} fullWidth />
                                </MDBox>
                            </Grid>

                        </Grid>
                        <MDBox pt={3} ml={3} pb={2}>
                            <MDButton variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Update</MDButton>
                            <MDButton variant="gradient" color="dark" onClick={() => navigate("/profile")} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                        </MDBox>
                    </MDBox>

                </Card>
            </MDBox>
        </DashboardLayout>

    )
}

export default EditProfile
