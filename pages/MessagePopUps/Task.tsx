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

interface TaskData {
    task_assign_to: number;
    task_data: string;
    log_lead: boolean;
    is_order: boolean;
    is_job: boolean;
    file_name: File;
    order_product_id: number;
    organization_id: number;
    customer_id: number;
    activity_id: number;
}


const Task = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const dispatchData = useDispatch();
    const history = useNavigate();
    const [orderProductOptions, setOrderProductOptions] = useState<any[]>([]);
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, watch, setError, clearErrors } = useForm<TaskData>({
        defaultValues: {
            log_lead: false,
            is_order: false,
            is_job: false,
            order_product_id: orderProductId?.order_product_id || 0,
            organization_id: orderProductId?.organization_id || 0,
            customer_id: orderProductId?.customer_id || 0,
            activity_id: 4,
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

    useEffect(() => {
        fetchOrder();
    }, [])

    const handleResetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setValue('log_lead', false);
            setValue('is_order', false);
            setValue('is_job', false);
        }
    };

    const handleNavigation = () => {
        dispatchData(addData({ key: "value", data: 1 }));
        history(-1);
    };

    const onSubmit = async (taskData: TaskData) => {
        console.log('data', taskData)
        try {
            const formData = new FormData();
            Object.entries(taskData).forEach(([key, value]) => {
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
                apiUrl: service.API_URL.message_activity.task,
                body: formData,
            });
            handleNavigation();
        } catch (error) {
            console.log(error);
        }
    };

    const handleorderProductChange = (selectedOption: any) => {
        setValue('order_product_id', selectedOption.target.value);
        trigger('order_product_id');
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid>
                <MDBox pt={6} pb={3}>
                    <MDTypography>Task</MDTypography>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            {/* Right side of the first card */}
                            <div style={{ marginBottom: '50px' }}>
                                <Card>
                                    <MDBox py={3} px={2}>
                                        <Editor
                                            {...register('task_data', { required: requiredMessage })}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                            }}
                                            onEditorChange={(newValue, editor) => {
                                                setValue('task_data', editor.getContent({ format: 'raw' }));
                                                trigger('task_data')
                                            }}
                                            apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"></Editor>
                                        {errors.task_data?.message && <ErrorShow error={errors.task_data?.message} />}
                                    </MDBox>
                                    <MDBox mb={2} ml={2}>
                                        <MDFileInput getValues={getValues} name="file_name" type="image" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                        {errors.file_name?.message && <ErrorShow error={errors.file_name?.message} />}
                                    </MDBox>
                                    <MDBox mx={2} mt={0} py={3} px={2}>
                                        <MDTypography><u>Log Task for:</u></MDTypography>
                                        <MDBox ml={3} mt={3} py={3} px={2}>
                                            <Grid container spacing={4}>
                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('log_lead')} />Lead
                                                </MDBox>
                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('is_order')} />Order
                                                </MDBox>
                                                <MDBox ml={3}  >
                                                    <Checkbox {...register('is_job')} />Try Job
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
                                            </Grid>
                                        </MDBox>
                                    </MDBox>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox >
                            <MDButton onClick={handleSubmit(onSubmit)} style={{ marginLeft: '10px' }} variant="gradient" color="info" >
                                Add a task
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

export default Task;