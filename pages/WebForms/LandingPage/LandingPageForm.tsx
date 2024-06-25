import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import { Grid, Switch } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import SelectComponent from "components/MDSelect";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { requiredMessage, integerNumber } from "utils/common";

interface LandingPageFormProps {
    method: string;
}

interface LandingPageData {
    landing_page_id: number;
    organization_id: number;
    page_name: string;
    page_url: string;
    description: string;
    landing_page_hook_url: string;
    request_type: string;
    lead_owner: number;
    page_owner: number;
    admin_email: string;
    email_subject: string;
    email_template: string;
    send_registration_email: boolean;
    send_contact_email: boolean;
    created_by: number;
    updated_by: number;
}

const LandingPageForm: React.FC<LandingPageFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        trigger,
        watch
    } = useForm<LandingPageData>();
    const history = useNavigate();
    const { id } = useParams();
    const [requestType, setRequestType] = useState<any[]>([]);
    const [selectedValues, setSelectedValues] = useState({
        request_type: "",
    });
    const [userRoleWise, setUserRoleWise] = useState<any[]>([]);
    const [leadOwner, setLeadOwner] = useState('')
    const [pageOwner, setPageOwner] = useState('')

    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.landingPage.get,
                params: id,
            });
            // set default values of react hook form
            const landingPageData: LandingPageData = response?.data.data;
            // Set form values using setValue
            Object.entries(landingPageData).forEach(([key, value]) => {
                setValue(key as keyof LandingPageData, value);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const SelectData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setRequestType(response.data.data.request_type);
            } catch (error) {
                console.log(error);
            }
        };
        SelectData();
        fetchUserData();
    }, []);

    const onSubmit = async (landingPageData: LandingPageData) => {
        try {
            landingPageData.lead_owner = Number(landingPageData.lead_owner);
            landingPageData.page_owner = Number(landingPageData.page_owner);
            landingPageData.organization_id = 1;
            landingPageData.created_by = 1;
            landingPageData.updated_by = 1;

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.landingPage.create : service.API_URL.landingPage.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? "",
                body: landingPageData,
            });

            history(-1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleRegistration = () => {
        setValue('send_registration_email', !getValues('send_registration_email'))
        trigger('send_registration_email');
    }

    const handleToggleContact = () => {
        setValue('send_contact_email', !getValues('send_contact_email'))
        trigger("send_contact_email");
    }

    const fetchUserData = async () => {
        try {
            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            setUserRoleWise(userRole.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlepageOwnerChange = (selectedOption: any) => {
        setValue('page_owner', selectedOption.value);
        trigger('page_owner');
    };

    const handleleadOwnerChange = (selectedOption: any) => {
        setValue('lead_owner', selectedOption.value);
        trigger('lead_owner');
    };

    const ChangeValue = (event: any, type: keyof LandingPageData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        trigger(type); // Manually trigger validation for the changed field
    };


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={4} pb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={15}>
                            <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    {method === "POST" ? "Add" : "Update"}{" Landing Page"}
                                </MDTypography>
                            </MDBox>
                            <MDBox component="form" role="form">
                                <MDBox mb={2}>
                                    <MDInput
                                        my={2}
                                        {...register("page_name", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('page_name') ? true : false }}
                                        label={'Page Name'}
                                        fullWidth
                                        required
                                    />
                                    {errors.page_name?.message && (
                                        <ErrorShow
                                            error={errors.page_name?.message}
                                        />
                                    )}
                                </MDBox>

                                <MDBox mb={2}>
                                    <SelectComponent
                                        placeholder="Request Type"
                                        options={requestType.map(
                                            (
                                                method: any
                                            ) => ({
                                                value: method.label,
                                                label: method.label,
                                            })
                                        )}
                                        handleChange={(event: any) => ChangeValue(event, "request_type")}
                                        value={getValues("request_type") || ''}
                                        
                                        {...register("request_type", { required: 'Request Type is required' })}

                                    />
                                    {errors.page_url?.message && (
                                        <ErrorShow
                                            error={
                                                errors.page_url
                                                    ?.message
                                            }
                                        />
                                    )}
                                </MDBox>

                                <MDBox mb={2}>
                                    <MDInput
                                        my={2}
                                        {...register("page_url", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('page_url') ? true : false }}
                                        label={'Page Url'}
                                        fullWidth
                                        required
                                    />
                                    {errors.page_url?.message && (
                                        <ErrorShow
                                            error={
                                                errors.page_url
                                                    ?.message
                                            }
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        {...register("description", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('description') ? true : false }}
                                        label={'Description'}
                                        fullWidth
                                        multiline
                                    />
                                    {errors.description?.message && (
                                        <ErrorShow
                                            error={
                                                errors.description?.message
                                            }
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <SelectComponent
                                        {...register('page_owner')}
                                        placeholder="Select Page Owner"
                                        options={userRoleWise?.map((role: any) => ({
                                            value: role.user_id,
                                            label: role.name
                                        }))}
                                        handleChange={(event: any) => ChangeValue(event, "page_owner")}
                                        value={getValues('page_owner') ? String(getValues('page_owner')) : null}
                                    />
                                    {errors.page_owner?.message && (
                                        <ErrorShow
                                            error={errors.page_owner?.message}
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <SelectComponent
                                         
                                        {...register('lead_owner')}
                                        placeholder="Select Lead Owner"
                                        options={userRoleWise?.map((role: any) => ({
                                            value: role.user_id,
                                            label: role.name
                                        }))}
                                        handleChange={(event: any) => ChangeValue(event, "lead_owner")}
                                        value={getValues('lead_owner') ? String(getValues('lead_owner')) : null}
                                       
                                    />
                                    {errors.lead_owner?.message && (
                                        <ErrorShow
                                            error={errors.lead_owner?.message}
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        {...register("admin_email", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('admin_email') ? true : false }}
                                        type='text'
                                        label={'Admin Email'}
                                        fullWidth
                                        multiline

                                    />
                                    {errors.admin_email?.message && (
                                        <ErrorShow
                                            error={
                                                errors.admin_email?.message
                                            }
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        {...register("email_template", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('email_template') ? true : false }}
                                        label={'Email Template'}
                                        fullWidth
                                        multiline
                                    />
                                    {errors.email_template?.message && (
                                        <ErrorShow
                                            error={
                                                errors.email_template?.message
                                            }
                                        />
                                    )}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        {...register("email_subject", {
                                            required: requiredMessage,
                                        })}
                                        InputLabelProps={id && { shrink: watch('email_subject') ? true : false }}
                                        label={'Email Subject'}
                                        fullWidth
                                        multiline
                                    />
                                    {errors.email_subject?.message && (
                                        <ErrorShow
                                            error={
                                                errors.email_subject?.message
                                            }
                                        />
                                    )}
                                </MDBox>
                                <MDBox mx={2} display="flex" alignItems="center" mb={2}>
                                    <MDTypography variant="label" fontSize={"0.8em"} fontWeight="regular" color="text"
                                        sx={{ cursor: "pointer", userSelect: "none", ml: -1, }}>
                                        {'Send Registration Email'}
                                    </MDTypography>
                                    <Switch checked={getValues('send_registration_email')}  {...register("send_registration_email")} onClick={handleToggleRegistration} />
                                </MDBox>
                                <MDBox mx={2} display="flex" alignItems="center" mb={2}>
                                    <MDTypography variant="label" fontSize={"0.8em"} fontWeight="regular" color="text" sx={{
                                        cursor: "pointer", userSelect: "none", ml: -1
                                    }}>
                                        {'Send Contact Email'}
                                    </MDTypography>
                                    <Switch checked={getValues('send_contact_email')}  {...register("send_contact_email")} onClick={handleToggleContact} />
                                </MDBox>
                                <MDBox>
                                    <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === "POST" ? "Add" : "Update"}{" Landing Page"}
                                    </MDButton>
                                    <MDButton variant="gradient" color="error" onClick={() => history(-1)}>
                                        Go Back
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
};

export default LandingPageForm;
