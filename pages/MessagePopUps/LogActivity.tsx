import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import Select from 'common/Select';
import Select from "components/MDSelect";
import { Editor } from "@tinymce/tinymce-react";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { requiredMessage } from "utils/common";
import { service } from "utils/Service/service";
import { useEffect, useState } from "react";
import React, { useRef } from 'react';
import MDFileInput from "common/MDFileInput";

interface ActivityData {
    log_data: string;
    activity_type: string;
    activity_date: Date;
    log_lead: boolean;
    is_order: boolean;
    is_job: boolean;
    is_lead_hot: boolean;
    file_name: File;
    order_product_id: number;
    organization_id: number;
    customer_id: number;
    activity_id: number;
}

const LogActivity = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const dispatchData = useDispatch();
    const history = useNavigate();
    const [orderName, setOrderName] = useState('')
    const [orderProductOptions, setOrderProductOptions] = useState<any[]>([]);
    const [activityOptions, setActivityOptions] = useState<any[]>([]);
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, reset, watch, setError, clearErrors } = useForm<ActivityData>({
        defaultValues: {
            log_lead: false,
            is_order: false,
            is_job: false,
            is_lead_hot: false,
            order_product_id: orderProductId?.order_product_id || 0,
            organization_id: orderProductId?.organization_id || 0,
            customer_id: orderProductId?.customer_id || 0,
            activity_id: 1,
        }
    });

    const fetchOrder = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
            });
            setOrderProductOptions(() => {
                return response?.data.data.map((orderProduct: any) => {
                    return { value: orderProduct.order_product_id, label: orderProduct.products };
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    const fetchActivity = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.message_activity.list,
            });
            setActivityOptions(() => {
                return response?.data.data.map((activity: any) => {
                    return { value: activity.activity_master_id, label: activity.activity_title };
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchOrder();
        fetchActivity();
    }, [])

    const handleResetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setValue('log_lead', false);
            setValue('is_order', false);
            setValue('is_job', false);
        }
    };

    useEffect(() => {
        if (orderProductId) {
            setOrderName(orderProductId?.order_product_id?.toString());
            setValue('order_product_id', orderProductId?.order_product_id);
            trigger('order_product_id') 
        }
    }, []);

    const handleNavigation = () => {
        dispatchData(addData({ key: "value", data: 1 }));
        history(-1);
    };

    const onSubmit = async (activityData: ActivityData) => {
        console.log('data', activityData)

        try {
            const formData = new FormData();
            Object.entries(activityData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (typeof value === "boolean") {
                        formData.append(key, value.toString());
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            });
            await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.message_activity.log,
                body: formData,
                options: {
                    headers: {
                        'Accept': '*',
                        'content-type': 'multipart/form-data',
                    }
                }
            });
            handleNavigation();
        }
        catch (error) {
            console.log(error)
        }
    };

    const handleorderProductChange = (selectedOption: any) => {
        setValue('order_product_id', selectedOption.target.value);
        trigger('order_product_id');
    };

    const handleActivityChange = (selectedOption: any) => {
        setValue('activity_type', selectedOption.target.value);
        trigger('activity_type');
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid>
                <MDBox pt={6} pb={3}>
                    <MDTypography>Log Activity</MDTypography>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6} lg={4}>
                            <div style={{ marginBottom: '50px' }}>
                                {/* Left side of  card  */}
                                <Card>
                                    <MDBox pt={4} pb={3} px={3}>
                                        <MDBox component="form" role="form">
                                            Log Activity to
                                            <MDBox mb={2}>
                                                <MDBox mb={2}>
                                                    <Select
                                                        value={getValues('activity_type') ? String(getValues('activity_type')) : ""}
                                                        {...register("activity_type")}
                                                        placeholder='Select Activity'
                                                        options={activityOptions}
                                                        handleChange={handleActivityChange}
                                                    />
                                                </MDBox>
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDBox mb={2}>
                                                    <MDInput className={watch("activity_date") ? "has-value" : ""} {...register('activity_date', { required: requiredMessage })} type="date" label="From" variant="standard" fullWidth InputLabelProps={{ shrink: true }} />
                                                    {errors.activity_date?.message && <ErrorShow error={errors.activity_date?.message} />}
                                                </MDBox>
                                            </MDBox>
                                            <MDBox mb={2}  >
                                                <Checkbox {...register('log_lead')} />Lead
                                            </MDBox>
                                            <MDBox mb={2}  >
                                                <Checkbox {...register('is_order')} />Order
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Select
                                                    value={getValues('order_product_id') ? String(getValues('order_product_id')) : ""}
                                                    {...register("order_product_id")}
                                                    placeholder='Order Product'
                                                    options={orderProductOptions}
                                                    handleChange={handleorderProductChange}
                                                />
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Card>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            {/* Right side of the first card */}
                            <div style={{ marginBottom: '50px' }}>
                                <Card>
                                    <MDBox py={3} px={2}>
                                        <Editor
                                            {...register('log_data', { required: requiredMessage })}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                            }}
                                            onEditorChange={(newValue, editor) => {
                                                setValue('log_data', editor.getContent({ format: 'raw' }));
                                                trigger('log_data')
                                            }}
                                            apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"></Editor>
                                        {errors.log_data?.message && <ErrorShow error={errors.log_data?.message} />}
                                    </MDBox>
                                    <MDBox mx={2} mt={-3} py={3} px={2}>
                                        <MDBox ml={3} mt={3} py={3} px={2}>
                                            <Grid container spacing={4}>
                                                <MDBox mb={2}>
                                                    {/* <MDInput type="file" label="Subject" variant="standard" fullWidth /> */}
                                                    <MDFileInput getValues={getValues} name="file_name" type="image" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                                    {errors.file_name?.message && <ErrorShow error={errors.file_name?.message} />}
                                                </MDBox>
                                            </Grid>
                                        </MDBox>
                                    </MDBox>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox display="flex">
                            <MDBox style={{ marginRight: '20px' }}>
                                <Checkbox {...register('is_lead_hot')} />Make Lead Hot
                            </MDBox>
                            <MDButton onClick={handleSubmit(onSubmit)} style={{ marginLeft: '10px' }} variant="gradient" color="info" >
                                Save
                            </MDButton>
                            <MDButton style={{ marginLeft: '10px' }} variant="gradient" color="warning" >
                                Reset
                            </MDButton>
                            <MDButton onClick={handleNavigation} style={{ marginLeft: '10px' }} variant="gradient" color="error" >
                                Cancel
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Grid>
            <Footer />
        </DashboardLayout>
    );
}

export default LogActivity;