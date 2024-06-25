import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import globalMessages from 'utils/global';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';
import SelectComponent from "components/MDSelect";
import { requiredMessage,validateFutureDate,validateEmail} from 'utils/common';


interface CampaignFormProps {
    method: string;
}

interface CampaignData {
    campaign_id: number;
    organization_id: number;
    title: string;
    from_name: string;
    from_email: string;
    client_group_id: number;
    email_template_id: number;
    campaign_date: Date;
    description: string;
    promocode: string;
    campaign_type: string;
    is_active: boolean;
    name: string;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { register, handleSubmit, getValues, setValue, formState: { errors },watch ,trigger} = useForm<CampaignData>();
    const history = useNavigate();
    const [promotionFor, setPromotionFor] = useState<any[]>([]);
    const [promotioncode, setPromotionCode] = useState<any[]>([]);
    const [customerGroup, setCustomerGroup] = useState<any[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
    const [selectedCampaignType, setSelectedCampaignType] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchPromotionData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.promotionalCode.list,
                });
                if (response && response.data && response.data.data) {
                    const promotions = response.data.data?.map((promotion: any) => ({
                        id: promotion.promocode_id,
                        label: promotion.promocode_name,
                    }));
                    setPromotionCode(promotions);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPromotionData();
    }, []);

    useEffect(() => {
        const fetchPromotionalFor = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setPromotionFor(response.data.data.promotion_for);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchEmailTemplate = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.email_marketing.list,
                });
                if (response && response.data && response.data.data) {
                    const templates = response.data.data.map((templates: any) => ({
                        id: templates.email_marketing_id,
                        label: templates.title,
                    }));
                    setEmailTemplates(templates);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchEmailTemplate();
        fetchPromotionalFor();
    }, []);

    useEffect(() => {
        const fetchClientGroup = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer_group.get
                });
                setCustomerGroup(response?.data?.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchClientGroup();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.campaign.View,
                    params: id,
                });
                const campaignData: CampaignData = response?.data.data;
               if(campaignData) 
               Object.entries(campaignData).forEach(([key, value]) => {
                    setValue(key as keyof CampaignData, value);
                });
                setValue("campaign_type", campaignData.campaign_type);
                setSelectedCampaignType(campaignData.campaign_type);
                trigger('client_group_id');
                trigger('email_template_id');
                trigger('promocode');
                
            } catch (error) {
                console.log(error);
            }
        };

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method])
    const onSubmit = async (campaignData: CampaignData) => {
        try {
            const updatedCampaignData = {
                ...campaignData,
            };
            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.campaign.create : service.API_URL.campaign.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: updatedCampaignData,
            });
            history(-1)
        } catch (error) {
            console.log(error);
        }
    };const ChangeValue = (event: any, type: keyof CampaignData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        trigger(type); 
    };

    const handleToggle = () => {
        setValue('is_active', !getValues('is_active'))
    }
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} pb={3}>
                <Grid container spacing={1}>
                    <Grid item xs={15}>
                        <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                            <MDTypography variant="h6" color="white">
                                {method === 'POST' ? 'Add' : 'Update'} {globalMessages.campaign.campaign}
                            </MDTypography>
                        </MDBox>
                        <MDBox mx={2} my={3} mt={-3} py={2} px={0}component="form" role="form">
                            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>

                                <Grid item xs={12}>
                                    <MDInput
                                        my={2}
                                        {...register("title", { required: ' Title Required' })}
                                        label={globalMessages.campaign.title}
                                        fullWidth
                                        required
                                        InputLabelProps={id && { shrink: watch('title') ? true : false }}
                                    />
                                    {errors.title?.message && <ErrorShow error={errors.title?.message} />}
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        my={2}
                                        {...register("description", { required: 'Discription Required' })}
                                        label={globalMessages.campaign.description}
                                        fullWidth
                                        required
                                        InputLabelProps={id && { shrink: watch('description') ? true : false }}
                                    />
                                    {errors.description?.message && <ErrorShow error={errors.description?.message} />}
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        {...register("from_name", { required: 'From Name Required' })}
                                        label={globalMessages.campaign.from_name}
                                      
                                        fullWidth
                                        multiline
                                        required
                                        InputLabelProps={id && { shrink: watch('from_name') ? true : false }}
                                    />
                                    {errors.from_name?.message && <ErrorShow error={errors.from_name?.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <MDInput
                                        {...register("from_email", {
                                            required: 'Form Email Required',
                                            validate: validateEmail
                                        })}
                                        label={globalMessages.campaign.From_email}
                                        type="email"
                                        fullWidth
                                        required
                                        InputLabelProps={id && { shrink: watch('from_email') ? true : false }}
                                    />
                                    {errors.from_email && (
                                        <ErrorShow error={errors.from_email.message ?? ""} />
                                    )}
                                </Grid>

                            </Grid>
                            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '2px' }}>
                                <Grid item xs={12}>

                                    <SelectComponent
                                        placeholder="Email Template"
                                        options={emailTemplates.map(
                                            (
                                                method: any
                                            ) => ({
                                                value: method.id,
                                                label: method.label,
                                            })
                                        )}
                                        handleChange={(event: any) => ChangeValue(event, "email_template_id")}
                                        // value={getValues("email_template_id") || ''}
                                        value={getValues('email_template_id') ? String(getValues('email_template_id')) : null}
                                        {...register("email_template_id", { required: requiredMessage, })}
                                    />
                                    {errors.title && <ErrorShow error={errors.title.message ?? ""} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <SelectComponent
                                        placeholder="Promotional Code"
                                        options={promotioncode.map(
                                            (
                                                method: any
                                            ) => ({
                                                value: method.id,
                                                label: method.label,
                                            })
                                        )}
                                        handleChange={(event: any) => ChangeValue(event, "promocode")}
                                        value={getValues('promocode') ? String(getValues('promocode')) : null}
                                        {...register("promocode", { required: 'Promotional Code Required' })}
                                    />
                                    {errors.promocode && <ErrorShow error={errors.promocode.message ?? ""} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <SelectComponent
                                        placeholder="Select Group"
                                        options={customerGroup.map((group: any) => ({
                                            value: group.customer_group_id,
                                            label: group.name,
                                        }))}
                                        handleChange={(event: any) => ChangeValue(event, "client_group_id")}
                                        value={getValues('client_group_id') ? String(getValues('client_group_id')) : null}
                                        {...register("client_group_id", { required: 'Customer Group Required' })}
                                    />

                                    {errors.client_group_id && <ErrorShow error={errors.client_group_id.message ?? ""} />}
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        {...register("campaign_date", { required: "Campaign Date Required ",validate:validateFutureDate})}
                                        label={globalMessages.campaign.campaign_date}
                                        type="date"
                                        className={watch("campaign_date") ? "has-value" : ""}
                                        fullWidth
                                        required
                                        style={{ height: "45px" }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    {errors.campaign_date && <ErrorShow error={errors.campaign_date.message ?? ""} />}
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}  alignItems="center" style={{ marginBottom: '5px' }}>
                                <Grid item xs={3} >
                                <MDTypography   variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
											{globalMessages.campaign.campaign_type}
											</MDTypography>
                                </Grid>
                                < Grid item xs={9}>
                                    <MDBox mx={1} py={2} px={3}>
                                        <FormControl component="fieldset">
                                            
                                            <RadioGroup
                                                row
                                                value={selectedCampaignType}
                                                onChange={(e) => {
                                                    setValue("campaign_type", e.target.value);
                                                    setSelectedCampaignType(e.target.value);
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="Bulk"
                                                    control={<Radio />}
                                                    label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Bulk</MDTypography>}
                                                />
                                                <FormControlLabel
                                                    value="One to One"
                                                    control={<Radio />}
                                                  label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>One TO One</MDTypography>}
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        {errors.campaign_type?.message && <ErrorShow error={errors.campaign_type?.message} />}
                                    </MDBox>
                                </Grid>
                                <Grid item xs={9}>
                                    <MDBox mx={2}  display='flex' alignItems='center' mb={2}>
                                        <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                            {globalMessages.campaign.is_active}
                                        </MDTypography>
                                        <Switch checked={getValues('is_active')} onClick={handleToggle} {...register("is_active")} />
                                    </MDBox>
                                    {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}

                                </Grid>
                            </Grid>
                            <MDBox>
                                <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.campaign.save_button_text}
                                </MDButton>
                                <MDButton variant="gradient" color="dark" onClick={() => history(-1)}>
                                    {globalMessages.btn_text.back_button_text}
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default CampaignForm;
