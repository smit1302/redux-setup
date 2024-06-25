import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import globalMessages from "utils/global";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
//material ui component
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Select from 'components/MDSelect';
import { useForm } from "react-hook-form";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { service } from "utils/Service/service";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ErrorShow from "common/ErrorShow";


interface PreferenceType {
    business_type: string,
    email_preferences: string,
    life_cycle_stage_id: number,
    billing_cycle_days: number,
    credit_limit: number,
    currency_type: number,
    billing_type: number,
    bde_id: number,
    customer_id: number,
}

interface PreferenceFormProps {
    method: string;
}

const AddPreferences: React.FC<PreferenceFormProps> = ({ method }) => {
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger, watch } = useForm<PreferenceType>();
    const dispatchData = useDispatch();
    const { id } = useParams();
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [buisnessType, setBuisnessType] = useState<any[]>([]);
    const [billingType, setBillingType] = useState<any[]>([]);
    const [currencyType, setCurrencyType] = useState<any[]>([]);
    const [bdeList, setBdeList] = useState<any[]>([]);
    const [lifeCycleStage, setLifeCycleStage] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const history = useNavigate();
    const [emailPreferencesOptions, setEmailPreferencesOptions] = useState<any[]>([]);
    const [preferenceData, setPreferenceData] = useState({
        business_type: '',
        email_preferences: '',
        life_cycle_stage_id: '',
        billing_cycle_days: '',
        credit_limit: '',
        currency_type: '',
        billing_type: '',
        bde_id: 0,
        customer_id: customerId.customer_id,
    });

    const global = globalMessages.add_preferences;
    const global_btn = globalMessages.btn_text;






    useEffect(() => {
        const fetchData = async () => {
            try {

                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                    query: { forSelect: true },
                });
                console.log('dropdown', response.data.data)
                // setBuisnessType(response.data.data.buisness_type);
                setBuisnessType(() => {
                    return response?.data.data?.buisness_type.map((data: any) => {
                        return { value: data.label, label: data.label };
                    });
                });
                // setBillingType(response.data.data.billing_type);
                setBillingType(() => {
                    return response?.data.data?.billing_type.map((data: any) => {
                        return { value: data.id, label: data.label };
                    });
                });
                // setCurrencyType(response.data.data.currency_type);
                setCurrencyType(() => {
                    return response?.data.data?.currency_type.map((data: any) => {
                        return { value: data.id, label: data.label };
                    });
                });
                // setBdeList(response.data.data.currency_type);
                // setLifeCycleStage(response.data.data.lifecycle_stage);
                setLifeCycleStage(() => {
                    return response?.data.data?.lifecycle_stage.map((data: any) => {
                        return { value: data.id, label: data.label };
                    });
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        fetchDropdownData();

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
                query: { forSelect: true },
            });
            const userRoleWise = userRole.data.data;
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            setBde(bde);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPreferenceData(prevData => ({ ...prevData, [name]: value }));
    };

    const fetchEmailPreferences = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.emailPreferences,
            });
            setEmailPreferencesOptions(() => {
                return response?.data.data.map((email: any) => {
                    return { id: email.email_preference_id, name: email.name };
                });
            });

        } catch (error) {
            console.log(error);
        }
    }

    const fetchPreference = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.getPreference,
                params: id,
            });
            // set default values of react hook form
            const singlePreference: PreferenceType = response?.data.data;
            console.log('incoming', singlePreference)
            // Set form values using setValue
            Object.entries(singlePreference).forEach(([key, value]) => {
                setValue(key as keyof PreferenceType, value);
            });
            trigger();
            preferenceData.email_preferences = singlePreference.email_preferences

            // Extract email preferences IDs
            const emailPreferenceIds = singlePreference.email_preferences.split('|').map(id => parseInt(id, 10));
            console.log('email', emailPreferenceIds)
            setEmailPreferencesOptions(prevOptions => prevOptions.map(option => ({
                ...option,
                checked: emailPreferenceIds.includes(option.id)
            })));
            console.log('setted data', getValues())
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEmailPreferences();
        fetchPreference();
    }, [])


    const handleSelectChange = (name: string, option: { value: number, label: string }) => {
        if (name === 'business_type') {
            setPreferenceData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
            setValue('business_type', option.label)
        } else if (name === 'life_cycle_stage_id') {
            setPreferenceData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
            setValue('life_cycle_stage_id', option.value)
        } else if (name === 'billing_type') {
            setPreferenceData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
            setValue('billing_type', option.value)
        } else if (name === 'currency_type') {
            setPreferenceData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
            setValue('currency_type', option.value)
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        let updatedEmailPreferences = '';

        // Update email_preferences based on checked status
        if (checked) {
            updatedEmailPreferences = preferenceData.email_preferences ? `${preferenceData.email_preferences}|${name}` : name;
        } else {
            updatedEmailPreferences = preferenceData.email_preferences.split('|').filter(pref => pref !== name).join('|');
        }

        console.log('newwww check', name)
        setPreferenceData(prevData => ({ ...prevData, email_preferences: updatedEmailPreferences }));
    };



    const onSubmit = async (prefernces: PreferenceType) => {
        try {
            prefernces.billing_cycle_days = Number(getValues('billing_cycle_days'))
            prefernces.credit_limit = Number(getValues('credit_limit'))
            prefernces.email_preferences = preferenceData.email_preferences
            prefernces.customer_id = customerId.customer_id;

            trigger()
            console.log('final', prefernces)
            // return null;

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.customer.createPreference : service.API_URL.customer.updatePreference;
            const response = await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: prefernces,
                showAlert: true
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

    const handleSelectedValueChangeById = (
        name: string,
        value: number | boolean | { label: string, value: any }
    ) => {
        setPreferenceData(prevValues => ({
            ...prevValues,
            [name]: typeof value === 'object' ? value.value : value,
        }));
        setValue('bde_id', typeof value === 'object' ? value.value : value)
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox position="relative" mb={5}>
                <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                    <AppBar position="static">
                        <Tabs  >
                            <Tab
                                label="QEHTML"
                                icon={
                                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                        home
                                    </Icon>
                                }
                            />
                            <Tab
                                label="QE Retails"
                                icon={
                                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                        home
                                    </Icon>
                                }
                            />
                        </Tabs>
                    </AppBar>
                </Grid>
            </MDBox>
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                        <MDTypography variant="h6" color="white">
                            {global.title_preferences}
                        </MDTypography>
                    </MDBox>
                    <MDBox mt={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={8} md={3} lg={3}>

                                <MDBox mb={3} ml={3} >
                                    <Select
                                        value={getValues('bde_id')}
                                        {...register('bde_id', { required: 'BDE is requird' })}
                                        placeholder="Select BDE"
                                        options={bde}
                                        handleChange={(label) => handleSelectedValueChangeById("bde_id", label.target.value)}
                                    />
                                    {errors.bde_id?.message && <ErrorShow error={errors.bde_id?.message} />}
                                </MDBox>
                            </Grid>
                            <Grid item xs={8} md={3} lg={3}>
                                <MDBox mb={3} ml={3} >
                                    <Select
                                        value={getValues('life_cycle_stage_id')}
                                        {...register('life_cycle_stage_id', { required: 'Life cycle stage is requird' })}
                                        placeholder="Life cycle stage"
                                        options={lifeCycleStage}
                                        handleChange={(value) => handleSelectChange('life_cycle_stage_id', value.target.value)} />
                                    {errors.life_cycle_stage_id?.message && <ErrorShow error={errors.life_cycle_stage_id?.message} />}
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Card>
            </MDBox>
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                        <MDTypography variant="h6" color="white">
                            {global.title_billing}
                        </MDTypography>
                    </MDBox>
                    <MDBox mt={4}>
                        <Grid container mt={2} mb={3} ml={1} >
                            <MDBox ml={3} >
                                <Select
                                    value={getValues('billing_type')}
                                    {...register('billing_type', { required: 'Billing type is requird' })}
                                    placeholder="Billing Type"
                                    options={billingType}
                                    handleChange={(value) => handleSelectChange('billing_type', value.target.value)} />
                                {errors.billing_type?.message && <ErrorShow error={errors.billing_type?.message} />}
                            </MDBox>
                            <MDBox ml={3} >
                                <MDInput {...register('billing_cycle_days', { required: 'Billing Days is requird' })}
                                    InputLabelProps={ id && getValues('billing_cycle_days') && { shrink: watch('billing_cycle_days') ? true : false }}
                                    type="number" label="Billing Days" fullWidth required />
                                {errors.billing_cycle_days?.message && <ErrorShow error={errors.billing_cycle_days?.message} />}
                            </MDBox>
                            <MDBox ml={3} >
                                <MDInput {...register('credit_limit', { required: 'Credit Limit is requird' })}
                                    InputLabelProps={ id && getValues('credit_limit') && { shrink: watch('credit_limit') ? true : false }}
                                    type="number" label="Credit Limit" name="credit_limit"
                                    fullWidth required />
                                {errors.credit_limit?.message && <ErrorShow error={errors.credit_limit?.message} />}
                            </MDBox>

                            <MDBox ml={3} >
                                <Select
                                    value={getValues('currency_type')}
                                    {...register('currency_type', { required: 'Currency Type is requird' })}
                                    placeholder="Currency Type"
                                    options={currencyType}
                                    handleChange={(value) => handleSelectChange('currency_type', value.target.value)} />
                                {errors.currency_type?.message && <ErrorShow error={errors.currency_type?.message} />}
                            </MDBox>
                            <MDBox mb={2} ml={3}>
                                <Select
                                    value={getValues('business_type')}
                                    {...register('business_type', { required: 'Business Type is requird' })}
                                    placeholder="Buisness Type"
                                    options={buisnessType}
                                    handleChange={(value) => handleSelectChange('business_type', value.target.value)} />
                                {errors.business_type?.message && <ErrorShow error={errors.business_type?.message} />}
                            </MDBox>


                        </Grid>


                    </MDBox>
                </Card>
            </MDBox>
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                        <MDTypography variant="h6" color="white">
                            {global.title_email_preferences_for_qeHtml}
                        </MDTypography>
                    </MDBox>

                    <MDBox mt={4}>
                        <Grid container spacing={3}>
                            {
                                emailPreferencesOptions.map((option) => {
                                    return (

                                        <>
                                            <Grid item xs={8} md={3} lg={4}>
                                                <MDBox mb={3} ml={3} >
                                                    <Checkbox onChange={handleCheckboxChange} name={option.id} defaultChecked={option.checked} /> {option.name}
                                                </MDBox>
                                            </Grid>
                                        </>
                                    )
                                })
                            }
                        </Grid>
                    </MDBox>
                    <MDBox pt={3} ml={3} pb={2}>
                        <MDButton variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>{global_btn.save_button_text}</MDButton>
                        <MDButton variant="gradient" color="dark" onClick={() => history(-1)} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                    </MDBox>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AddPreferences;


