import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Card, Grid } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { service } from 'utils/Service/service';
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import { useSelector, useDispatch } from 'react-redux';
import { addData } from "../../redux/features/commonData/commonData";
import { useForm } from 'react-hook-form';
import { requiredMessage } from 'utils/common';
import ErrorShow from 'common/ErrorShow';

interface SocialMediaData {
    customer_business_id: number;
    customer_contact_id: number;
    social_media_label: string;
    activity_rating: number;
    profile_type: string;
    social_media_profile_title: string;
    social_media_link: string;

}

const AddSocialMedia = () => {
    const [controller] = useMaterialUIController();
    const dispatchData = useDispatch();
    const history = useNavigate();
    const { sidenavColor } = controller;
    const [socialMediaLabel, setSocialMediaLabel] = useState<any[]>([]);
    const [activityRating, setactivityRating] = useState<any[]>([]);
    const [profile_type, setprofile_type] = useState<any[]>([]);
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [socialMediaData, setSocialMediaData] = useState({
        customer_business_id: customerId.customer_business_id,
        customer_contact_id: customerId.customer_contact_id,
        social_media_label: '',
        activity_rating: 0,
        profile_type: '',
        social_media_profile_title: '',
        social_media_link: ''
    });
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue } = useForm<SocialMediaData>();




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setprofile_type(response.data.data.profile_type);
                setSocialMediaLabel(response.data.data.social_media_label);
                setactivityRating(response.data.data.activity_rating);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleChanges = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setSocialMediaData(prevData => ({ ...prevData, [name]: value }));
    };


    const onSubmit = async (data: SocialMediaData) => {
        try {
            const dataToSend = {
                ...data,
                activity_rating: Number(data.activity_rating),
            }
            const response = await service.makeAPICall({
                apiUrl: service.API_URL.customer.createSocialMedia,
                methodName: service.Methods.POST,
                body: dataToSend,
            });
            if (response && response.data && response.data.success) {
                history(-1);
            } else {
                console.error("Error creating customer:", response?.data.message);
            }
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    };

    const handleSelectChange = (name: string, option: { id: number, label: string }) => {
        if (name === 'profile_type') {
            setSocialMediaData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
        } else {
            setSocialMediaData(prevData => ({
                ...prevData,
                [name]: option.label
            }));
        }
    };

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 2 }));
        history(`/my-customer`);
    };

    return (
        <>
            <DashboardLayout>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "20px" }} className='module_wrap'>
                                <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Add Social Media
                                    </MDTypography>
                                </MDBox>
                                <MDBox pb={3}>
                                    <MDBox component="form" role="form" onSubmit={handleSubmit}>
                                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <Select placeholder="social Media Label" options={socialMediaLabel} value={getValues('social_media_label')} {...register('social_media_label', { required: requiredMessage })} handleChange={(value) => setValue('social_media_label', value.target.value)} />
                                                    {errors?.social_media_label?.message && <ErrorShow error={errors?.social_media_label?.message} />}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <Select placeholder="Profile Type" options={profile_type} value={getValues('profile_type')} {...register('profile_type', { required: requiredMessage })} handleChange={(value) => setValue('profile_type', value.target.value)} />
                                                    {errors?.profile_type?.message && <ErrorShow error={errors?.profile_type?.message} />}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <Select placeholder="Activity Rating" options={activityRating} value={getValues('activity_rating')} {...register('activity_rating', { required: requiredMessage })} handleChange={(value) => setValue('activity_rating', value.target.value)} />
                                                    {errors?.activity_rating?.message && <ErrorShow error={errors?.activity_rating?.message} />}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput label="Social Media Profile" {...register('social_media_profile_title', { required: requiredMessage })} fullWidth required />
                                                    {errors?.social_media_profile_title?.message && <ErrorShow error={errors?.social_media_profile_title?.message} />}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput label="Social Media URL" {...register('social_media_link', { required: requiredMessage })} fullWidth required />
                                                    {errors?.social_media_link?.message && <ErrorShow error={errors?.social_media_link?.message} />}
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>

                                <Grid item xs={12}>
                                    <MDBox>
                                        <div className="action_wrap d_flex">
                                            <MDButton className='action-button' variant="gradient" color={sidenavColor} type="submit" onClick={handleSubmit(onSubmit)}>
                                                ADD Social Media
                                            </MDButton>
                                            <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                                        </div>
                                    </MDBox>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
};

export default AddSocialMedia;
