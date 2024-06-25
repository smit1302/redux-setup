import React, { useEffect, useState } from 'react';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import Grid from "@mui/material/Grid";
import globalMessages from "utils/global";
import { service } from "utils/Service/service";
import { validateEmail, requiredMessage, validatePassword, validateContact, validateZip } from 'utils/common';
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { useNavigate, useParams } from 'react-router-dom';
import { City, Country, State } from 'country-state-city';
import MDSelect from 'components/MDSelect';

// Define the interface for the props of user form component
interface UserFormProps {
    method: string;
}

// Define the interface for the user data
interface UserData {
    email: string,
    address1: string,
    state: string,
    phone: string,
    im_id: string,
    twitter: string,
    anniversary: string,
    title: string,
    address2: string,
    country: string,
    mobile: string,
    linkedin: string,
    blog: string,
    qualification: string,
    user_name: string,
    user_type: string,
    joining_date: string,
    name: string,
    city: string,
    zip: string,
    im_type: string,
    facebook: string,
    birth_date: string,
    experience: string,
    password: string,
    skills: string,
}

const UserForm: React.FC<UserFormProps> = ({ method }) => {
    const [imTypeOption, setImTypeOption] = useState<{ id: any; name: any; }[] | undefined>(undefined);
    const [userRoleOption, setUserRoleOption] = useState<{ id: any; display_name: any; }[] | undefined>(undefined);
    const navigate = useNavigate();
    const { register, trigger, handleSubmit, getValues, unregister, setValue, formState: { errors }, watch } = useForm<UserData>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const { id } = useParams();
    const history = useNavigate();

    // function to trigger dropdowns
    const ChangeValue = (event: any, type: keyof UserData) => {
        setValue(type, event.target.value);
        trigger(type); // Manually trigger validation for the changed field
    };


    // fetch options on component mount
    useEffect(() => {
        fetchImTypes();
        fetchUserRole();
        fetchCountries();
    }, []);

    // function to fetch user data for update
    useEffect(() => {
        if (id) {
            fetchUserData();
        }
    }, [id]);

    // function to fetch countries
    const fetchCountries = async () => {
        const countryList = Country.getAllCountries();
        setCountries(countryList.map((country: any) => ({ value: country.name, label: country.name, countryCode: country.isoCode })));
    };

    // function to fetch user roles
    const fetchUserRole = async () => {
        try {
            const userRoleResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.userRole,
                query: { forSelect: true }
            })
            const Roles = userRoleResponse?.data.data;

            if (Roles && Array.isArray(Roles)) {
                const UserRole = Roles?.map(role => ({ id: role.id, display_name: role.display_name }));
                setUserRoleOption(UserRole);
            }

        } catch (err) {
            console.error("Error fetching user Role:", err);
        }
    }

    //function to fetch im types
    const fetchImTypes = async () => {
        try {
            const [imTypeResponse] = await Promise.all([
                service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.ImType.List,
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


    // function to fetch user data for update
    const fetchUserData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.get,
                params: id
            });
            // set default values of react hook form
            const user: UserData = response?.data?.data;

            if (user) {
                Object.entries(user).forEach(([key, value]) => {
                    setValue(key as keyof UserData, value);
                });
            }

            if (getValues('country')) {
                handleCountryChange(getValues('country'))
            }

            trigger('user_type');
        } catch (error) {
            console.log(error);
        }
    };

    // function to handle submit
    const onSubmit: SubmitHandler<UserData> = async (data: any) => {
        // Convert experience to a number only if it's not already a number
        if (typeof data.experience !== 'number') {
            data.experience = parseInt(data.experience, 10);
        }

        try {
            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.people.addUser : service.API_URL.people.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: data,
                showAlert: true,
            });

            navigate("/user");
        } catch (error) {
            console.log(error);
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


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Card>
                        <Grid item xs={15} className='module_wrap'>
                            <MDBox className='module_head' mx={2} mt={-3} py={3} px={2} variant="gradient" borderRadius="lg" coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.user.form_title}
                                </MDTypography>
                            </MDBox>
                        </Grid>

                        <MDBox mt={4.5}>
                            <Grid container spacing={3}>
                                <Grid item xs={8} md={3} lg={4} py={3} px={2}  >
                                    <MDBox mb={3} ml={3} >
                                        <MDSelect
                                            placeholder='User Role'
                                            options={(userRoleOption || [])?.map(role => ({ value: role.id, label: role.display_name }))}
                                            handleChange={(event: any) => ChangeValue(event, "user_type")}
                                            value={getValues("user_type") ? String(getValues("user_type")) : null}
                                            {...register("user_type", { required: requiredMessage })}
                                        />
                                        {errors.user_type?.message && <ErrorShow error={errors.user_type?.message} />}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="email" label={globalMessages.user.email} id="email" {...register("email", { required: requiredMessage, validate: validateEmail })} InputLabelProps={id && getValues('email') && { shrink: watch('email') ? true : false }} fullWidth />
                                        {errors.email?.message && <ErrorShow error={errors.email?.message} />}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="title"{...register("title")} label={globalMessages.user.title} InputLabelProps={id && getValues('title') && { shrink: watch('title') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDSelect
                                            value={getValues('country') ? String(getValues('country')) : null}
                                            placeholder={globalMessages.user.country}
                                            options={countries}
                                            {...register('country')}
                                            handleChange={handleCountryChange}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="zip"{...register("zip", { validate: validateZip })} label={globalMessages.user.zip} InputLabelProps={id && getValues('zip') && { shrink: watch('zip') ? true : false }} fullWidth />
                                        {errors.zip?.message && <ErrorShow error={errors.zip?.message} />}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDSelect
                                            value={getValues('im_type') ? String(getValues('im_type')) : null}
                                            placeholder={globalMessages.user.im_type}
                                            options={(imTypeOption || [])?.map(imtype => ({ value: imtype.id, label: imtype.name }))}
                                            handleChange={(event: any) => ChangeValue(event, "im_type")}
                                            {...register("im_type")}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="twitter"{...register("twitter")} value={watch("twitter")} label={globalMessages.user.twitter} InputLabelProps={id && getValues('twitter') && { shrink: watch('twitter') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch("anniversary") ? "has-value" : ""} id="anniversary"{...register("anniversary")} label={globalMessages.user.anniversary} InputLabelProps={id && getValues('anniversary') && { shrink: watch('anniversary') ? true : false }} fullWidth />
                                    </MDBox>
                                    {
                                        id === undefined &&
                                        <MDBox mb={3} ml={3} >
                                            <MDInput type="text" id="qualification"{...register("qualification")} label={globalMessages.user.qualification} InputLabelProps={id && getValues('qualification') && { shrink: watch('qualification') ? true : false }} fullWidth />
                                        </MDBox>
                                    }
                                    {
                                        id &&

                                        <MDBox mb={3} ml={3} >
                                            <MDInput type="text" id="skills"{...register("skills")} label={globalMessages.user.skills} InputLabelProps={id && getValues('skills') && { shrink: watch('skills') ? true : false }} fullWidth />
                                        </MDBox>
                                    }
                                </Grid>

                                <Grid item xs={8} md={3} lg={4} py={3} px={2}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="userName"{...register("user_name", { required: requiredMessage })} label={globalMessages.user.user_name} InputLabelProps={id && getValues('user_name') && { shrink: watch('user_name') ? true : false }} fullWidth />
                                        {errors.user_name?.message && <ErrorShow error={errors.user_name?.message} />}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" id="joiningDate" className={watch("joining_date") ? "has-value" : ""} {...register("joining_date")} InputLabelProps={id && getValues('joining_date') && { shrink: watch('joining_date') ? true : false }} label={globalMessages.user.joining_date} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="address1" {...register("address1")} label={globalMessages.user.address1} InputLabelProps={id && getValues('address1') && { shrink: watch('address1') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDSelect
                                            value={getValues('state') ? String(getValues('state')) : null}
                                            placeholder={globalMessages.user.state}
                                            options={states}
                                            {...register('state')}
                                            handleChange={handleStateChange}
                                        />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="phone" {...register("phone", { validate: validateContact })} label={globalMessages.user.phone} InputLabelProps={id && getValues('phone') && { shrink: watch('phone') ? true : false }} fullWidth />
                                        {errors.phone?.message && <ErrorShow error={errors.phone?.message} />}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="imId"{...register("im_id")} label={globalMessages.user.im_id} InputLabelProps={id && getValues('im_id') && { shrink: watch('im_id') ? true : false }} fullWidth />
                                    </MDBox>

                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="blog"{...register("blog")} label={globalMessages.user.blog} InputLabelProps={id && getValues('blog') && { shrink: watch('blog') ? true : false }} fullWidth />                                    </MDBox>

                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch("birth_date") ? "has-value" : ""} id="birthDate" {...register("birth_date")} label={globalMessages.user.birth_date} InputLabelProps={id && getValues('birth_date') && { shrink: watch('birth_date') ? true : false }} fullWidth />
                                    </MDBox>
                                    {
                                        id === undefined &&
                                        <MDBox mb={3} ml={3} >
                                            <MDInput type="text" id="skills"{...register("skills")} label={globalMessages.user.skills} InputLabelProps={id && getValues('skills') && { shrink: watch('skills') ? true : false }} fullWidth />
                                        </MDBox>
                                    }
                                </Grid>
                                <Grid item xs={8} md={3} lg={4} py={3} px={2}>
                                    {
                                        id === undefined &&
                                        <MDBox mb={3} ml={3} >
                                            <MDInput type="text" id="password"{...register("password", { required: requiredMessage, validate: validatePassword })} label="Password" InputLabelProps={id && getValues('password') && { shrink: watch('password') ? true : false }} fullWidth />
                                            {errors.password?.message && <ErrorShow error={errors.password?.message} />}
                                        </MDBox>
                                    }
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="name" {...register("name", { required: requiredMessage })} label={globalMessages.user.name} InputLabelProps={id && getValues('name') && { shrink: watch('name') ? true : false }} fullWidth />
                                        {errors.name?.message && <ErrorShow error={errors.name?.message} />}
                                    </MDBox>

                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="address2"{...register("address2")} InputLabelProps={id && getValues('address2') && { shrink: watch('address2') ? true : false }} fullWidth />
                                    </MDBox>
                                    {
                                        id === undefined ? <>
                                            <MDBox mb={3} ml={3} >
                                                <MDSelect
                                                    value={getValues('city') ? String(getValues('city')) : null}
                                                    placeholder={globalMessages.user.city}
                                                    options={cities}
                                                    {...register('city')}
                                                    handleChange={handleCityChange}
                                                />
                                            </MDBox>

                                            <MDBox mb={3} ml={3} >
                                                <MDInput type="text" id="mobile"{...register("mobile", { validate: validateContact })} label={globalMessages.user.mobile} InputLabelProps={id && getValues('mobile') && { shrink: watch('mobile') ? true : false }} fullWidth />
                                                {errors.mobile?.message && <ErrorShow error={errors.mobile?.message} />}
                                            </MDBox>
                                        </> :
                                            <>
                                                <MDBox mb={3} ml={3} >
                                                    <MDInput type="text" id="mobile"{...register("mobile", { validate: validateContact })} label={globalMessages.user.mobile} InputLabelProps={id && getValues('mobile') && { shrink: watch('mobile') ? true : false }} fullWidth />
                                                    {errors.mobile?.message && <ErrorShow error={errors.mobile?.message} />}
                                                </MDBox>
                                                <MDBox mb={3} ml={3} >
                                                    <MDSelect
                                                        value={getValues('city') ? String(getValues('city')) : null}
                                                        placeholder={globalMessages.user.city}
                                                        options={cities}
                                                        {...register('city')}
                                                        handleChange={handleCityChange}
                                                    />
                                                </MDBox>

                                            </>
                                    }
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="linkedIn"{...register("linkedin")} label={globalMessages.user.linkedin} InputLabelProps={id && getValues('linkedin') && { shrink: watch('linkedin') ? true : false }} fullWidth />
                                    </MDBox>

                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="facebook"{...register("facebook")} label={globalMessages.user.facebook} InputLabelProps={id && getValues('facebook') && { shrink: watch('facebook') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" id="experience"{...register("experience")} label={globalMessages.user.experience} InputLabelProps={id && getValues('experience') && { shrink: watch('experience') ? true : false }} fullWidth />
                                    </MDBox>
                                    {
                                        id &&
                                        <MDBox mb={3} ml={3} >
                                            <MDInput type="text" id="qualification"{...register("qualification")} label={globalMessages.user.qualification} InputLabelProps={id && getValues('qualification') && { shrink: watch('qualification') ? true : false }} fullWidth />
                                        </MDBox>
                                    }
                                </Grid>
                            </Grid>
                        </MDBox>
                        <MDBox ml={3} pb={2}>
                            <MDButton onClick={handleSubmit(onSubmit)} variant="gradient" color="info" > {method === 'POST' ? 'Add' : 'Update'} {globalMessages.user.save_button_text}</MDButton>
                            <MDButton onClick={() => history(-1)} variant="contained" color="error" style={{ marginLeft: '10px' }}>{globalMessages.btn_text.cancel_button_text}</MDButton>
                        </MDBox>
                    </Card>
                </MDBox>
            </DashboardLayout>
        </>
    );
};

export default UserForm;
