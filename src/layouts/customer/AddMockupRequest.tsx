import React, { useState, useEffect } from 'react';
import { Card, Grid, TextareaAutosize } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { service } from 'utils/Service/service';
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';
import ErrorShow from 'common/ErrorShow';
import { requiredMessage } from 'utils/common';

interface MocukUpRequestData {
    platform_master_id: string,
    remarks: string,
    website_url: string,
    customer_id: number,
}

const AddMockupRequest = () => {
    const dispatchData = useDispatch();
    const history = useNavigate();
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [controller] = useMaterialUIController();
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue } = useForm<MocukUpRequestData>();
    const { sidenavColor } = controller;
    const [platformType, setPlatformType] = useState<any[]>([]);
    console.log("id", customerId.customer_id);
    const onSubmit = async (mocukUpRequestData: MocukUpRequestData) => {
        console.log("data", mocukUpRequestData);
        try {
            const response = await service.makeAPICall({
                apiUrl: service.API_URL.order.mockup,
                methodName: service.Methods.POST,
                body: mocukUpRequestData,
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

    useEffect(() => {
        if (customerId) {
            setValue('customer_id', customerId.customer_id);
            trigger('customer_id')
        }
    }, []);

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 4 }));
        history(`/my-customer`);
    };

    const fetchPlatform = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            console.log("API Platform");
            setPlatformType(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPlatform();
    }, [customerId]);

    return (
        <>
            <DashboardLayout>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: '20px' }}>
                                <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Add Mockup Request
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={6} pb={3}>
                                    <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                <Select placeholder="Select Platform" options={platformType?.map((platformType: any) => ({
                                                        value: platformType.platform_master_id,
                                                        label: platformType.name,
                                                    }))}
                                                        value={getValues('platform_master_id') ? String(getValues('platform_master_id')) : null}
                                                        {...register("platform_master_id", { required: requiredMessage })}
                                                        handleChange={(selectedOption) => {
                                                            setValue('platform_master_id', selectedOption.target.value);
                                                            trigger('platform_master_id')
                                                        }} />
                                                    {errors?.platform_master_id?.message && <ErrorShow error={errors?.platform_master_id?.message} />}
</MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput
                                                        label="Website URL"
                                                        fullWidth
                                                        required
                                                        {...register("website_url", { required: requiredMessage })}
                                                    />
                                                    {errors?.website_url?.message && <ErrorShow error={errors?.website_url?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <MDBox mb={2}>
                                                    <TextareaAutosize
                                                        aria-label="Preferences"
                                                        {...register("remarks", { required: requiredMessage })}
                                                        placeholder="Preferences"
                                                        minRows={3}
                                                        style={{ width: '100%', minHeight: '100px', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    />
                                                    {errors?.remarks?.message && <ErrorShow error={errors?.remarks?.message} />}
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>

                                <Grid item xs={12}>
                                    <MDBox>
                                        <MDButton variant="gradient" onClick={handleSubmit(onSubmit)} color={sidenavColor} type="submit">
                                            ADD Mockup
                                        </MDButton>
                                        <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
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

export default AddMockupRequest;