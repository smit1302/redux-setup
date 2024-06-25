import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Card, Checkbox, Grid } from '@mui/material';
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
import { requiredMessage } from 'utils/common';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';

interface OpportunityData {
    customer_id: number,
    platform_master_id: string,
    follow_up: boolean,
    amount: string,
    projection_time: string,
    opportunity_by: number,
    website_url: string,
    service_type: string
}

const AddOpportunity = () => {
    const [controller] = useMaterialUIController();
    const history = useNavigate();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue, watch } = useForm<OpportunityData>();
    const [product, setProduct] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [platformType, setPlatformType] = useState<any[]>([]);
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    // const id =customerId.customer_id;
    console.log("id", customerId.customer_id);

    useEffect(() => {
        fetchProduct();
        fetchDropdownData();
        fetchPlatform();
    }, [customerId]);


    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setValue("follow_up", !getValues("follow_up"));
    };

    const onSubmit = async (opportunityData: OpportunityData) => {
        console.log("data", opportunityData);
        try {
            const response = await service.makeAPICall({
                apiUrl: service.API_URL.opportunity.create,
                methodName: service.Methods.POST,
                body: opportunityData,
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

    const fetchDropdownData = async () => {
        try {
            const filterUserDataByRole = (userData: any[], roleName: string) => {
                return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
                    value: user.user_id,
                    label: user.name,
                }));
            };
            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            setBde(bde);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (customerId) {
            setValue('customer_id', customerId.customer_id);
            trigger('customer_id')
        }
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            console.log("API PRODUCT");
            setProduct(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 4 }));
        history(`/my-customer`);
    };

    return (
        <>
            <DashboardLayout>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: '20px' }}>
                                <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Add Opportunity
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={6} pb={3}>
                                    <MDBox component="form" role="form">
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
                                                <Checkbox
                                                    {...register("follow_up")}
                                                    onChange={handleCheckboxChange}
                                                    name="follow_up"
                                                />Follow Up
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput label="Amount" {...register("amount", { required: requiredMessage })} type="number" fullWidth required />
                                                    {errors?.amount?.message && <ErrorShow error={errors?.amount?.message} />}
                                                </MDBox>
                                                <MDBox mb={2}>
                                                    <MDInput label="Projection Date" className={watch('projection_time') ? "has-value" : ""}  {...register("projection_time", { required: requiredMessage })} type="date" fullWidth required />
                                                    {errors?.projection_time?.message && <ErrorShow error={errors?.projection_time?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <Select
                                                        placeholder="Opportunity By"
                                                        options={bde}
                                                        value={getValues("opportunity_by")}
                                                        {...register("opportunity_by", { required: requiredMessage })}
                                                        handleChange={(selectedOption) => {
                                                            setValue('opportunity_by', selectedOption.target.value);
                                                            trigger('opportunity_by')
                                                        }}
                                                    />
                                                    {errors?.opportunity_by?.message && <ErrorShow error={errors?.opportunity_by?.message} />}
                                                </MDBox>
                                                <MDBox mb={2}>
                                                    <MDInput label="Website URL" {...register("website_url", { required: requiredMessage })} fullWidth required />
                                                    {errors?.website_url?.message && <ErrorShow error={errors?.website_url?.message} />}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <Select
                                                        placeholder="Select Products"
                                                        options={product.map(product => ({
                                                            value: product.id,
                                                            label: product.name,
                                                        }))}
                                                        value={getValues("service_type")}
                                                        {...register("service_type", { required: requiredMessage })}
                                                        handleChange={(selectedOption) => {
                                                            setValue('service_type', selectedOption.target.value);
                                                            trigger('service_type')
                                                        }}
                                                    />
                                                    {errors?.service_type?.message && <ErrorShow error={errors?.service_type?.message} />}

                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>

                                <Grid item xs={12}>
                                    <MDBox>
                                        <MDButton variant="gradient" color={sidenavColor} type="submit" onClick={handleSubmit(onSubmit)}>
                                            ADD Opportunity
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

export default AddOpportunity;

