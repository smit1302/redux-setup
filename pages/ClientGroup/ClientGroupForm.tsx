import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid } from '@mui/material';
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
import { requiredMessage, validateFutureDate, validatePastDate } from 'utils/common';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from "react-redux";
import { } from 'utils/common';

interface ClientGroupFormProps {
    method: string;
}

interface ClientGroupData {
    customer_type: string;
    customer_signup_from_date: Date;
    customer_signup_to_date: Date;
    amount_paid_till_date: number;
    amount_outstanding_till_date: number;
    number_of_orders: number;
    last_order_date: Date;
    number_of_orders_at_last: number;
    product_id: number;
    life_cycle_stage_id: number;
    contact_type: number;
    blocked_situation: number;
    platform_id: string;
    activity_type: number;
    name: string;
    category_id: string;
    is_active: boolean;
}

const ClientGroup: React.FC<ClientGroupFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const [lifecycleStage, setLifecycleStage] = useState<any[]>([]);
    const [clientType, setClientType] = useState<any[]>([]);
    const [platform, setPlatform] = useState<any[]>([]);
    const [customerBlockSituation, setCustomerBlockSituation] = useState<any[]>([]);
    const [contactType, setContactType] = useState<any[]>([]);
    const [selectCategory, setCategoryType] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [product, setProduct] = useState<any[]>([]);
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue, watch } = useForm<ClientGroupData>();
    const history = useNavigate();
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer_group.view,
                    params: id,
                });
                const clientGroupData: ClientGroupData = response?.data.data;
                if (clientGroupData)
                    Object.entries(clientGroupData).forEach(([key, value]) => {
                        setValue(key as keyof ClientGroupData, value);
                    });
                trigger('product_id');
                trigger('life_cycle_stage_id');
                trigger('contact_type');
                trigger('blocked_situation');
                trigger('platform_id');
                trigger('category_id');
                trigger('activity_type');


            } catch (error) {
                console.log(error);
            }
        };

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method]);

    const onSubmit = async (clientGroupData: ClientGroupData) => {
        const dispatchDataForKey = (key: string, data: any) => {
            dispatchData(addData({ key, data }));
        };

        const dispatchAllData = () => {
            dispatchDataForKey("customer_type", clientGroupData.customer_type);
            dispatchDataForKey("customer_signup_from_date", clientGroupData.customer_signup_from_date);
            dispatchDataForKey("customer_signup_to_date", clientGroupData.customer_signup_to_date);
            dispatchDataForKey("amount_paid_till_date", clientGroupData.amount_paid_till_date);
            dispatchDataForKey("amount_outstanding_till_date", clientGroupData.amount_outstanding_till_date);
            dispatchDataForKey("number_of_orders", clientGroupData.number_of_orders);
            dispatchDataForKey("last_order_date", clientGroupData.last_order_date);
            dispatchDataForKey("number_of_orders_at_last", clientGroupData.number_of_orders_at_last);
            dispatchDataForKey("product_id", clientGroupData.product_id);
            dispatchDataForKey("life_cycle_stage_id", clientGroupData.life_cycle_stage_id);
            dispatchDataForKey("contact_type", clientGroupData.contact_type);
            dispatchDataForKey("blocked_situation", clientGroupData.blocked_situation);
            dispatchDataForKey("platform_id", clientGroupData.platform_id);
            dispatchDataForKey("activity_type", clientGroupData.activity_type);
            dispatchDataForKey("category_id", clientGroupData.category_id);
        };

        if (method === 'POST') {
            dispatchAllData();
            history(`/client-group/-add`);
        } else if (method === 'PUT') {
            dispatchAllData();
            navigate(`/client-group/-update/${id}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setClientType(response.data.data.client_type);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.product.list,
                });
                setProduct(response?.data?.data);

            } catch (error) {
                console.log(error)
            }
            return null;
        }

        fetchProduct();
    }, []);

    const fetchCategory = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.list,
            });
            setCategoryType(response?.data?.data);

        } catch (error) {
            console.log(error)
        }
        return null;
    }
    const lifeCycleStage = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.lifecycleStage,
            });
            setLifecycleStage(response?.data?.data);
            console.log("check", response?.data.data)
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    const customerblockSituation = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.blockedSituation,
            });
            setCustomerBlockSituation(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    useEffect(() => {
        customerblockSituation();
        lifeCycleStage();
        fetchCategory();
    }, []);

    const ContactType = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.contact,
            });
            setContactType(response?.data?.data);
            console.log("check", response?.data.data)
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    useEffect(() => {
        ContactType();
    }, []);
    const PlatformType = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.platform,
            });
            setPlatform(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    useEffect(() => {
        PlatformType();
    }, []);

    const ActivityType = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.activity,
            });
            setActivity(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    useEffect(() => {
        ActivityType();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setValue(name as keyof ClientGroupData, value);
        trigger(name as keyof ClientGroupData);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue(name as keyof ClientGroupData, value);
        trigger(name as keyof ClientGroupData);
    };
    const ChangeValue = (event: any, type: keyof ClientGroupData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        trigger(type);
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
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.client_group.clientGroup}
                                </MDTypography>
                            </MDBox>
                            <MDBox mx={2} my={3} mt={-3} py={2} px={0} component="form" role="form">
                                <Grid container spacing={3} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12} px={10}>
                                        <SelectComponent
                                            {...register("customer_type", { required: requiredMessage })}
                                            placeholder="Select Client Type"
                                            options={clientType.map((method) => ({ value: method.label, label: method.label }))}
                                            handleChange={(event: any) => ChangeValue(event, "customer_type")}
                                            value={getValues("customer_type") || ''}
                                        />
                                        {errors.customer_type?.message && <ErrorShow error={errors.customer_type?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("customer_signup_from_date", { required: requiredMessage, validate: validatePastDate })}
                                            type="date"
                                            className={watch("customer_signup_from_date") ? "has-value" : ""}
                                            label="Client Signup From Date"
                                            fullWidth
                                            onChange={handleDateChange}
                                            InputLabelProps={id && getValues("customer_signup_from_date") && { shrink: watch("customer_signup_from_date") ? true : false }}
                                        />
                                        {errors.customer_signup_from_date?.message && <ErrorShow error={errors.customer_signup_from_date?.message} />}

                                    </Grid>

                                </Grid>
                                <Grid container spacing={8} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("customer_signup_to_date", { required: requiredMessage, validate: validateFutureDate })}
                                            type="date"
                                            className={watch("customer_signup_to_date") ? "has-value" : ""}
                                            label="Client Signup To Date"
                                            fullWidth
                                            onChange={handleDateChange}
                                            InputLabelProps={id && getValues("customer_signup_to_date") && { shrink: watch("customer_signup_to_date") ? true : false }}

                                        />
                                        {errors.customer_signup_to_date?.message && <ErrorShow error={errors.customer_signup_to_date?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("amount_paid_till_date", { required: requiredMessage, })}
                                            type="number"
                                            label="Amount Paid Till Date"
                                            fullWidth
                                            onChange={handleChange}
                                            InputLabelProps={id && getValues("amount_paid_till_date") && { shrink: watch("amount_paid_till_date") ? true : false }}


                                        />
                                        {errors.amount_paid_till_date?.message && <ErrorShow error={errors.amount_paid_till_date?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("amount_outstanding_till_date", { required: requiredMessage, })}
                                            type="number"
                                            label="Amount Outstanding Till Date"
                                            fullWidth
                                            onChange={handleChange}
                                            InputLabelProps={id && getValues("amount_outstanding_till_date") && { shrink: watch("amount_outstanding_till_date") ? true : false }}
                                        />
                                        {errors.amount_outstanding_till_date?.message && <ErrorShow error={errors.amount_outstanding_till_date?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("number_of_orders", { required: requiredMessage, })}
                                            type="number"
                                            label="Number of Ordes"
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={id && getValues("number_of_orders") && { shrink: watch("number_of_orders") ? true : false }}
                                        />
                                        {errors.number_of_orders?.message && <ErrorShow error={errors.number_of_orders?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("last_order_date", { required: requiredMessage, validate: validatePastDate })}
                                            type="date"
                                            label="Last Order Date"
                                            className={watch("last_order_date") ? "has-value" : ""}
                                            fullWidth
                                            onChange={handleDateChange}
                                            InputLabelProps={id && getValues("last_order_date") && { shrink: watch("last_order_date") ? true : false }}

                                        />
                                        {errors.last_order_date?.message && <ErrorShow error={errors.last_order_date?.message} />}

                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            {...register("number_of_orders_at_last", { required: requiredMessage, })}
                                            type="number"
                                            label="Number of Order in Last Days"
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={id && getValues("number_of_orders_at_last") && { shrink: watch("number_of_orders") ? true : false }}
                                        />
                                        {errors.number_of_orders_at_last?.message && <ErrorShow error={errors.number_of_orders_at_last?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("product_id", { required: 'Select product is required' })}
                                            placeholder="Select Product"
                                            options={product.map(product => ({
                                                value: product.id,
                                                label: product.name
                                            }))}

                                            handleChange={(event: any) => ChangeValue(event, "product_id")}
                                            value={getValues('product_id') ? String(getValues('product_id')) : null}
                                        />
                                        {errors.product_id?.message && <ErrorShow error={errors.product_id?.message} />}

                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("life_cycle_stage_id", { required: requiredMessage })}
                                            placeholder="Select Life Cycle Stage"
                                            options={lifecycleStage.map(lifecycleStage => ({
                                                value: lifecycleStage.life_cycle_stage_id,
                                                label: lifecycleStage.name
                                            }))}

                                            handleChange={(event: any) => ChangeValue(event, "life_cycle_stage_id")}
                                            value={getValues('life_cycle_stage_id') ? String(getValues('life_cycle_stage_id')) : null}
                                        />

                                        {errors.life_cycle_stage_id?.message && <ErrorShow error={errors.life_cycle_stage_id?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="center" style={{ marginBottom: '10px' }} >
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("contact_type", { required: requiredMessage, })}
                                            placeholder="Select Contact"
                                            options={contactType.map(contactType => ({
                                                value: contactType.datasource_id,
                                                label: contactType.name
                                            }))}
                                            handleChange={(event: any) => ChangeValue(event, "contact_type")}
                                            value={getValues('contact_type') ? String(getValues('contact_type')) : null}
                                        />
                                        {errors.contact_type?.message && <ErrorShow error={errors.contact_type?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="center" style={{ marginBottom: '10px' }} >
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("blocked_situation", { required: requiredMessage, })}
                                            placeholder="Block Situation"
                                            options={customerBlockSituation.map(customerBlockSituation => ({
                                                value: customerBlockSituation.customer_block_situation_id,
                                                label: customerBlockSituation.name
                                            }))}

                                            handleChange={(event: any) => ChangeValue(event, "blocked_situation")}
                                            value={getValues('blocked_situation') ? String(getValues('blocked_situation')) : null}
                                        />
                                        {errors.blocked_situation?.message && <ErrorShow error={errors.blocked_situation?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '20px' }}>
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("activity_type", { required: requiredMessage, })}
                                            placeholder="Select Activity"
                                            options={activity.map(activity => ({
                                                value: activity.activity_type_id,
                                                label: activity.name
                                            }))}


                                            handleChange={(event: any) => ChangeValue(event, "activity_type")}
                                            value={getValues('activity_type') ? String(getValues('activity_type')) : null}
                                        />
                                        {errors.activity_type?.message && <ErrorShow error={errors.activity_type?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("platform_id", { required: requiredMessage, })}
                                            placeholder="Select Platform"
                                            options={platform.map(platform => ({
                                                value: platform.platform_master_id,
                                                label: platform.name
                                            }))}
                                            handleChange={(event: any) => ChangeValue(event, "platform_id")}
                                            value={getValues('platform_id') ? String(getValues('platform_id')) : null}
                                        />
                                        {errors.platform_id?.message && <ErrorShow error={errors.platform_id?.message} />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="center" style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12}>
                                        <SelectComponent
                                            {...register("category_id", { required: requiredMessage, })}
                                            placeholder="Select Category"
                                            options={selectCategory.map(
                                                (
                                                    Category: any
                                                ) => ({
                                                    value: Category.id,
                                                    label: Category.name,
                                                })
                                            )}
                                            handleChange={(event: any) => ChangeValue(event, "category_id")}
                                            value={getValues('category_id') ? String(getValues('category_id')) : null}
                                        />
                                        {errors.category_id?.message && <ErrorShow error={errors.category_id?.message} />}
                                    </Grid>
                                </Grid>
                                <MDBox>
                                    <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        Next
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
}
export default ClientGroup;
