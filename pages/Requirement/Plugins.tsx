import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { service } from 'utils/Service/service';
import { useNavigate } from 'react-router-dom';
import ErrorShow from 'common/ErrorShow';

interface FormData {
    title: string;
    platform_master_id: number;
    app_list: number;
    description: string;
}

interface Option {
    id: number;
    name: string;
}

const AddAppRequirement = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<FormData>();
    const [organization_id, setOrganizationId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [dropDown, setDropDown] = useState<Option[]>();
    const history = useNavigate();

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

    const handleChangeOption = (event: any) => {
        const selectedOptionId = event.target.value;
        if (selectedOptionId !== undefined) {
            const parsedOptionId = parseInt(selectedOptionId, 10);
            setValue('platform_master_id', parsedOptionId);
            trigger('platform_master_id')
        }
    };

    const onSubmit = async (data: FormData) => {
        // console.log("data :", typeof data.app_list);
        data.app_list = parseInt(data.app_list.toString(), 10);
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.requirement.addAppRequirement,
                body: data
            });
            if (response?.status === 201) {
                history(-1)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={3}>
                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                    <Grid item xs={12}>
                        <MDInput type="text" label="Title" id="title" {...register('title', { required: 'Title is required' })} fullWidth />
                        {errors.title && <ErrorShow error="this is requried" />}
                    </Grid>
                    <Grid item xs={12}>
                        <Select
                            placeholder="Platform"
                            {...register('platform_master_id', { required: true })}
                            options={dropDown?.map((option: any) => ({
                                value: option.platform_master_id,
                                label: option.name
                            })) || []}
                            value={getValues('platform_master_id') ? String(getValues('platform_master_id')) : ""}
                            handleChange={handleChangeOption}
                        />
                    </Grid>
                    {errors.platform_master_id && <ErrorShow error="Platform is required" />}

                    <Grid item xs={12}>
                        <MDInput type="number" label="App List" id="app_list" {...register('app_list', { required: 'App List is required' })} fullWidth rows={4} />
                        {errors.app_list && <ErrorShow error="this is requried" />}
                    </Grid>
                    <Grid item xs={12}>
                        <MDInput type="text" label="Description" id="description" {...register('description', { required: 'Description is required' })} fullWidth multiline rows={4} />
                        {errors.description && <ErrorShow error="this is requried" />}
                    </Grid>
                    <MDBox pt={4} ml={60} className='action_wrap'>
                        <MDButton className='action-button' variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Submit</MDButton>
                    </MDBox>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default AddAppRequirement;
