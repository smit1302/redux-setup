import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { service } from 'utils/Service/service';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';

interface Option {
    id: number;
    name: string;
}

const CustomWork = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm();
    const [formData, setFormData] = useState({
        project_number: '',
        custom_work_title: '',
        platform_master_id: '',
        website_url: '',
        hours: '',
        theme_name: '',
        description: ''
    });
    const [organizationId, setOrganizationId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [dropDown, setDropDown] = useState<Option[]>();

    useEffect(() => {
        fetchUserData();
        fetchPlatform();
    }, []);

    const fetchPlatform = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            console.log("API Platform");
            setDropDown(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserData = async () => {
        try {
            const userDataResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.profile.getUser,
            });
            setUserId(userDataResponse?.data.data.user_id);
            setOrganizationId(userDataResponse?.data.data.organization_id);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const onSubmit = async (data: any) => {
        try {
            console.log("platform iD", data.platform_master_id.value)
            data.project_number = parseInt(data.project_number);
            data.platform_master_id = data.platform_master_id;

            // Convert hours to a floating-point number
            data.hours = parseFloat(data.hours);

            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.requirement.customWork,
                body: data
            });
            console.log('Form submitted successfully:', response);
            if (response?.status === 201) {
                navigate('/custom-work');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChangeOption = (event: any) => {
        const selectedOptionId = event.target.value;
        console.log("select : ", selectedOptionId)
        if (selectedOptionId !== undefined) {
            console.log("Selected option ID:", selectedOptionId);
            setFormData(prevFormData => ({
                ...prevFormData,
                platform_master_id: selectedOptionId
            }));
        }
        setValue('platform_master_id', selectedOptionId);
        trigger('platform_master_id')
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={3}>
                <Grid container spacing={2} className="grid InputWithMargin">
                    <Grid item px={2} xs={12} md={6} xl={5}>
                        <MDInput type="number" label="Project Number" id="project_number" {...register('project_number', { required: true })} onChange={handleChange} fullWidth />
                        {errors.project_number && <ErrorShow error="Project Number is required" />}
                        <MDInput type="text" label="Custom Work Title" id="custom_work_title" {...register('custom_work_title', { required: true })} onChange={handleChange} fullWidth />
                        {errors.custom_work_title && <ErrorShow error="Custom Work Title is required" />}
                        <Select
                            placeholder="Platform"
                            {...register('platform_master_id', { required: true })}
                            options={dropDown?.map((option: any) => ({
                                value: option.platform_master_id,
                                label: option.name
                            })) || []}
                            value={getValues('platform_master_id') ? String(getValues('platform_master_id')) : ''}
                            handleChange={handleChangeOption}
                        />
                        {errors.platform_master_id && <ErrorShow error="Platform is required" />}
                        <MDInput type="text" label="WebSite Url" id="website_url" {...register('website_url', { required: true })} onChange={handleChange} fullWidth rows={4} />
                        {errors.website_url && <ErrorShow error="WebSite Url must be a number" />}
                        <MDInput type="number" label="Hours" id="hours" {...register('hours', { required: true })} onChange={handleChange} fullWidth rows={4} />
                        {errors.hours && <ErrorShow error="Hours must be a number" />}
                        <MDInput type="text" label="Theme" id="theme_name" {...register('theme_name', { required: true })} onChange={handleChange} fullWidth rows={4} />
                        {errors.theme_name && <ErrorShow error="Theme must be a number" />}
                        <MDInput type="text" label="Description" id="description" {...register('description', { required: true })} onChange={handleChange} fullWidth rows={4} />
                        {errors.description && <ErrorShow error="Description must be a number" />}
                    </Grid>
                </Grid>
                <MDBox ml={60} className='action_wrap'>
                    <MDButton className='action-button' variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Submit</MDButton>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
};

export default CustomWork;
