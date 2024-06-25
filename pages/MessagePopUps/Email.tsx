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
import { useEffect, useRef, useState } from "react";
import MDFileInput from "common/MDFileInput";

interface EmailData {
    template_id: number;
    email_from: string;
    email_to: string;
    email_subject: string;
    email_data: string;
    log_lead: boolean;
    is_order: boolean;
    is_job: boolean;
    is_draft: boolean;
    is_scheduled: boolean;
    is_sent: boolean;
    email_cc: string;
    email_bcc: string;
    file_name: File;
    scheduled_date: Date;
    order_product_id: number;
    organization_id: number;
    customer_id: number;
    activity_id: number;
}

const Email = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const dispatchData = useDispatch();
    const history = useNavigate();
    const [orderName, setOrderName] = useState('')
    const [orderProductOptions, setOrderProductOptions] = useState<any[]>([]);
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
    const { register, handleSubmit, trigger, formState: { errors }, watch, setValue, getValues, setError, clearErrors } = useForm<EmailData>({
        defaultValues: {
            log_lead: false,
            is_order: false,
            is_job: false,
            is_draft: false,
            is_scheduled: false,
            is_sent: false,
            order_product_id: orderProductId?.order_product_id || 0,
            organization_id: orderProductId?.organization_id || 0,
            customer_id: orderProductId?.customer_id || 0,
            activity_id: 2,
        }
    });
    const [selectedValues, setSelectedValues] = useState({
        template_id: '',
    })

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

    const fetchEmailTemplate = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.email_marketing.list,
            });
            if (response && response.data && response.data.data) {
                const templates = response.data.data?.map((templates: any) => ({
                    id: templates.email_marketing_id,
                    label: templates.title,
                }));
                setEmailTemplates(templates);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchEmailTemplate();
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

    const onSubmit = async (emailData: EmailData) => {

        try {
            const formData = new FormData();
            Object.entries(emailData).forEach(([key, value]) => {
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
                apiUrl: service.API_URL.message_activity.email,
                body: formData,
            });
        } catch (err) {
            console.log(err);
        }
        handleNavigation();
    };

    const handleorderProductChange = (selectedOption: any) => {
        setValue('order_product_id', selectedOption.target.value);
        trigger('order_product_id');
    };

    const handleSaveDraft = () => {
        setValue('is_draft', true);
        handleSubmit(onSubmit)();
    };

    // const handleScheduleEmail = () => {
    //     setValue('is_scheduled', true);
    //     handleSubmit(onSubmit)();
    // };

    const handleSelectedValueChangeById = (
        name: string,
        value: any
    ) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: typeof value === 'object' ? value.target.value : value,
        }));
        setValue("template_id", value.target.value);
    };

    const handleScheduleEmail = () => {
        // Display the scheduled date input
        setValue('is_scheduled', true);
        setScheduledDate(new Date());
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid>
                <MDBox pt={6} pb={3}>
                    <MDTypography>Email</MDTypography>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6} lg={4}>
                            <div style={{ marginBottom: '50px' }}>
                                {/* Left side of  card  */}
                                <Card>
                                    <MDBox pt={4} pb={3} px={3}>
                                        <MDBox component="form" role="form">
                                            <MDBox mb={2}>
                                                <Select
                                                    placeholder="Email Template"
                                                    options={emailTemplates?.map(
                                                        (method: any) => ({
                                                            value: method.id,
                                                            label: method.label,
                                                        })
                                                    )}  
                                                    {...register("template_id")}
                                                    value={getValues("template_id") ? String(getValues("template_id")) : "" }
                                                    handleChange={(label: any) => handleSelectedValueChangeById("template_id", label)}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDBox mb={2}>
                                                    <MDInput {...register('email_from', { required: requiredMessage })} type="text" label="From" variant="standard" fullWidth />
                                                    {errors.email_from?.message && <ErrorShow error={errors.email_from?.message} />}
                                                </MDBox>
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDBox mb={2}>
                                                    <MDInput {...register('email_to', { required: requiredMessage })} type="text" label="To" variant="standard" fullWidth />
                                                    {errors.email_to?.message && <ErrorShow error={errors.email_to?.message} />}
                                                </MDBox>
                                            </MDBox>

                                            <MDBox mb={2}>
                                                <MDInput {...register('email_cc')} type="text" label="Cc" variant="standard" fullWidth />
                                                {errors.email_cc?.message && <ErrorShow error={errors.email_cc?.message} />}
                                            </MDBox>

                                            <MDBox mb={2}>
                                                <MDInput {...register('email_bcc')} type="text" label="Bcc" variant="standard" fullWidth />
                                                {errors.email_bcc?.message && <ErrorShow error={errors.email_bcc?.message} />}
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDInput {...register('email_subject', { required: requiredMessage })} type="text" label="Subject" variant="standard" fullWidth />
                                                {errors.email_subject?.message && <ErrorShow error={errors.email_subject?.message} />}
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDFileInput getValues={getValues} name="file_name" type="image" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                                {errors.file_name?.message && <ErrorShow error={errors.file_name?.message} />}
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
                                            {...register('email_data', { required: requiredMessage })}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                            }}
                                            onEditorChange={(newValue, editor) => {
                                                setValue('email_data', editor.getContent({ format: 'raw' }));
                                                trigger('email_data')
                                            }}
                                            apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"></Editor>
                                        {errors.email_data?.message && <ErrorShow error={errors.email_data?.message} />}
                                    </MDBox>
                                    <MDBox mx={2} mt={-3} py={3} px={2}>
                                        <MDTypography><u>Log Email to:</u></MDTypography>
                                        <MDBox ml={3} mt={3} py={3} px={2}>
                                            <Grid container spacing={4}>

                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('log_lead')} />Lead
                                                </MDBox>
                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('is_order')} />Order
                                                </MDBox>

                                                <MDBox ml={3} >
                                                    <Select
                                                        value={getValues('order_product_id') ? String(getValues('order_product_id')) : ''}
                                                        {...register("order_product_id")}
                                                        placeholder='Order Product'
                                                        options={orderProductOptions}
                                                        handleChange={handleorderProductChange}
                                                    />
                                                </MDBox>
                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('is_job')} />Try Job
                                                </MDBox>
                                            </Grid>
                                        </MDBox>
                                    </MDBox>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                    <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <MDBox>
                            <MDButton onClick={handleSubmit(onSubmit)} variant="gradient" color="success" >
                                Send Email
                            </MDButton>
                            <MDButton onClick={handleSaveDraft} style={{ marginLeft: '10px' }} variant="gradient" color="info" >
                                Save as Draft
                            </MDButton>
                            <MDButton style={{ marginLeft: '10px' }} variant="gradient" color="warning" >
                                Reset
                            </MDButton>
                            <MDButton onClick={handleNavigation} style={{ marginLeft: '10px' }} variant="gradient" color="error" >
                                Cancel
                            </MDButton>
                        </MDBox>

                        <MDBox >
                            <MDButton variant="contained" color="black">
                                <DateRangeIcon />
                            </MDButton>
                            <MDButton onClick={handleScheduleEmail} style={{ marginLeft: '10px' }} variant="gradient" color="info" >
                                Schedule Email
                            </MDButton>
                        </MDBox>
                        {scheduledDate && (
                            <Grid item xs={12} md={6} lg={4}>
                                <div style={{ marginBottom: '50px' }}>
                                    {/* Scheduled date card */}
                                    <Card>
                                        <MDBox pt={4} pb={3} px={3}>
                                        </MDBox>
                                    </Card>
                                </div>
                            </Grid>
                        )}

                    </MDBox>
                </MDBox>
            </Grid>
            <Footer />
        </DashboardLayout>
    );
}

export default Email;