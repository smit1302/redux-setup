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

interface ReminderData {
    task_assign_to: number;
    date_from: Date;
    reminder_data: string;
    log_lead: boolean;
    is_order: boolean;
    is_job: boolean;
    prior_alert: boolean;
    order_product_id: number;
    organization_id: number;
    customer_id: number;
    activity_id: number;
}

const Reminder = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const dispatchData = useDispatch();
    const history = useNavigate();
    const [orderName, setOrderName] = useState('')
    const [orderProductOptions, setOrderProductOptions] = useState<any[]>([]);
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const [userRoleWise, setUserRoleWise] = useState<any[]>([]);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, reset, watch } = useForm<ReminderData>({
        defaultValues: {
            log_lead: false,
            is_order: false,
            is_job: false,
            order_product_id: orderProductId?.order_product_id || 0,
            organization_id: orderProductId?.organization_id || 0,
            customer_id: orderProductId?.customer_id || 0,
            activity_id: 5
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

    useEffect(() => {
        fetchOrder();
        fetchUserData();
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

    };

    const onSubmit = async (reminderData: ReminderData) => {
        console.log('data', reminderData)

        await service.makeAPICall({
            methodName: service.Methods.POST,
            apiUrl: service.API_URL.message_activity.reminder,
            body: reminderData,
        });
        handleNavigation();
    };

    const handleorderProductChange = (selectedOption: any) => {
        setValue('order_product_id', selectedOption.target.value);
        trigger('order_product_id');
    };

    const handleuserChange = (selectedOption: any) => {
        setValue('task_assign_to', selectedOption.target.value);
        trigger('task_assign_to');
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid>
                <MDBox pt={6} pb={3}>
                    <MDTypography>Reminder</MDTypography>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            {/* Right side of the first card */}
                            <div style={{ marginBottom: '50px' }}>
                                <Card>
                                    <form ref={formRef}>
                                        <MDBox mb={2} ml={2}>
                                            <Select
                                                value={getValues('task_assign_to') ? String(getValues('task_assign_to')) : ''}
                                                {...register('task_assign_to')}
                                                placeholder="Select"
                                                options={userRoleWise?.map((role: any) => ({
                                                    value: role.user_id,
                                                    label: role.name
                                                }))}
                                                handleChange={handleuserChange}
                                            />
                                        </MDBox>
                                        <MDBox mb={2} ml={2}>
                                            <MDInput {...register('date_from', { required: requiredMessage })}
                                                className={watch('date_from') ? "has-value" : ""}
                                                type="date" label="From" variant="standard" fullWidth InputLabelProps={{ shrink: true }} />
                                        </MDBox>
                                        <MDBox py={3} px={2}>
                                            <Editor
                                                {...register('reminder_data', { required: requiredMessage })}
                                                init={{
                                                    height: 300,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('reminder_data', editor.getContent({ format: 'raw' }));
                                                    trigger('reminder_data')
                                                }}
                                                apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"></Editor>
                                            {errors.reminder_data?.message && <ErrorShow error={errors.reminder_data?.message} />}
                                        </MDBox>
                                        <MDBox mx={2} mt={-3} py={3} px={2}>
                                            <MDTypography><u>Log Reminder to:</u></MDTypography>
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
                                                    <MDBox ml={3} >
                                                        {/* <MDInput InputLabelProps={{ shrink: true }} label='Job' value={orderName} /> */}
                                                    </MDBox>
                                                </Grid>
                                            </MDBox>
                                        </MDBox>
                                    </form>
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

                        </MDBox>

                        <MDBox display="flex">
                            <MDBox style={{ marginRight: '20px' }}>
                                <Checkbox {...register('prior_alert')} />Send me a 15 min. prior email alert
                            </MDBox>
                            <MDButton onClick={handleSubmit(onSubmit)} style={{ marginLeft: '10px' }} variant="gradient" color="info"  >
                                Add a note
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

export default Reminder;