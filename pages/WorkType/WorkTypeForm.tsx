import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch } from '@mui/material';
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
import { Editor } from '@tinymce/tinymce-react';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';


interface WorkTypeFormProps {
    method: string;
}

interface WorkTypeData {
    name: string,
    description: string,
    is_active: boolean,
}

const WorkTypeForm: React.FC<WorkTypeFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const dispatchData = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger, watch } = useForm<WorkTypeData>();
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.workType.get,
                    params: id,
                });
                // set default values of react hook form
                const workTypeData: WorkTypeData = response?.data.data;
                // Set form values using setValue
                Object.entries(workTypeData).forEach(([key, value]) => {
                    if (key !== 'created_by_user' && key !== 'updated_by_user') {
                        setValue(key as keyof WorkTypeData, value);
                        trigger();
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // remove this 
        setValue('description', 'This is a sample description for the work type');

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method, setValue]);

    const onSubmit = async (workTypeData: WorkTypeData) => {
        try {
            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.workType.create : service.API_URL.workType.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: workTypeData,
            });
            await dispatchData(addData({ key: "project_template_tab_value", data: 1 }));
            history(-1)
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggle = () => {
        setValue('is_active', !getValues('is_active'))
        trigger('is_active');
    }


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={4} pb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={15} className='module_wrap'>
                            <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography variant="h6" color="white">
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.work_type.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox mt={3} component="form" role="form">
                                <MDBox mb={2} >
                                    <MDInput my={2} {...register("name", { required: 'Title is requird' })} InputLabelProps={id && getValues("name") && { shrink: watch('name') ? true : false }} label={globalMessages.work_type.name} fullWidth required />
                                    {errors.name?.message && <ErrorShow error={errors.name?.message} />}
                                </MDBox>
                                <Editor
                                    apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                    value={getValues('description')}
                                    {...register("description", { required: 'Description is requird' })}
                                    init={{
                                        height: 200,
                                        menubar: false,
                                    }}
                                    onEditorChange={(newValue, editor) => {
                                        setValue('description', editor.getContent({ format: 'raw' }));
                                        trigger('description')
                                    }}
                                />
                                {errors.description?.message && <ErrorShow error={errors.description?.message} />}
                                <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="button" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.work_type.is_active}
                                    </MDTypography>
                                    <Switch checked={getValues('is_active')}  {...register("is_active")} onClick={handleToggle} />
                                </MDBox>
                                <MDBox className='action_wrap d_flex'>
                                    <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add' : 'Update'} {globalMessages.work_type.save_button_text}
                                    </MDButton>
                                    <MDButton variant="gradient" color="error" onClick={() => {
                                        dispatchData(addData({ key: "project_template_tab_value", data: 1 }));
                                        history(-1)
                                    }}>
                                        {globalMessages.work_type.cancel_button_text}
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

export default WorkTypeForm;
