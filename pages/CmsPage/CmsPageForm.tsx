import React, { useEffect, useState } from 'react';
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


interface CmsPageFormProps {
    method: string;
}

interface CmsData {
    page_name: string,
    page_url: string,
    description: string,
    meta_title: string,
    meta_description: string,
    is_active: boolean,
}

const CmsPageForm: React.FC<CmsPageFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, watch } = useForm<CmsData>();
    const history = useNavigate();
    const { id } = useParams();
    const [getUrl, setGetUrl] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.cms.get,
                    params: id,
                });
                // set default values of react hook form
                const cmsData: CmsData = response?.data.data;
                // Set form values using setValue
                Object.entries(cmsData).forEach(([key, value]) => {
                    if (key !== 'created_by_user' && key !== 'updated_by_user') {
                        setValue(key as keyof CmsData, value);
                    }
                });
                setGetUrl(false);
                trigger();
            } catch (error) {
                console.log(error);
            }
        };

        // remove this 
        setValue('description', 'This is a sample description for the cms page');

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method, setValue]);


    const onSubmit = async (cmsData: any) => {

        try {
            const { organization_name, ...formData } = cmsData;

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.cms.create : service.API_URL.cms.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: formData,
                showAlert: true
            });
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
                            <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.cms.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox component="form" role="form">
                                <MDBox mb={2} >
                                    <MDInput my={2} {...register("page_name", {
                                        required: 'Page title is requird',
                                        onChange: (e: any) => {
                                            getUrl && setValue('page_url', e.target.value.trim().replace(/\s+/g, '-').toLowerCase())
                                        }
                                    })}
                                        InputLabelProps={id && getValues("page_name") && { shrink: watch('page_name') ? true : false }} label={globalMessages.cms.page_title} fullWidth required />
                                    {errors.page_name?.message && <ErrorShow error={errors.page_name?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput my={2}  {...register("page_url", {
                                        required: 'Page URL is requird',
                                        onChange: () => {
                                            setGetUrl(false);
                                        }
                                    })} InputLabelProps={id && getValues("page_url") && { shrink: watch('page_url') ? true : false }} label={globalMessages.cms.page_url} fullWidth required />
                                    {errors.page_url?.message && <ErrorShow error={errors.page_url?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.cms.description}
                                    </MDTypography>
                                    <Editor
                                        apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                        value={getValues('description')}
                                        {...register("description", { required: 'Page description is requird' })}
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
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput {...register("meta_title")} InputLabelProps={id && getValues("meta_title") && { shrink: watch('meta_title') ? true : false }} label={globalMessages.cms.meta_title} fullWidth multiline required />
                                    {errors.meta_title?.message && <ErrorShow error={errors.meta_title?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput {...register("meta_description")} InputLabelProps={id && getValues("meta_description") && { shrink: watch('meta_description') ? true : false }} label={globalMessages.cms.meta_description} fullWidth multiline rows={4} required />
                                    {errors.meta_description?.message && <ErrorShow error={errors.meta_description?.message} />}
                                </MDBox>
                                <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="button" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.cms.is_active}
                                    </MDTypography>
                                    <Switch checked={getValues('is_active')}  {...register("is_active")} onClick={handleToggle} />
                                </MDBox>
                                <MDBox>
                                    <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add' : 'Update'} {globalMessages.cms.save_button_text}
                                    </MDButton>
                                    <MDButton variant="gradient" color="error" onClick={() => history(-1)}>
                                        {globalMessages.cms.cancel_button_text}
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

export default CmsPageForm;
