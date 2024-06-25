import React, { useEffect, ChangeEvent, useState } from 'react';
import { Card, Checkbox, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { service } from 'utils/Service/service';
import { useNavigate, useParams } from 'react-router-dom';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useSelector, useDispatch } from "react-redux";
import { useMaterialUIController } from "context";
import { addData } from "../../redux/features/commonData/commonData";
import { requiredMessage } from 'utils/common';
import ErrorShow from 'common/ErrorShow';
import Select from 'components/MDSelect';


interface BusinessProps {
    method: string;
}
interface BusinessData {
    website_url: string;
    founded_year: number;
    team_size: number;
    platform_master_id: number;
    seo_score: number;
    categories: string;
    domain_expiry: string;
    turnover: number;
    design_score: number;
    page_count: number;
    website_industry_id: number;
    is_website_check: boolean;
    is_responsive: boolean;
    is_has_robots: boolean;
    is_seo_score: boolean;
    website_check_date: string;
    responsive_check_date: string;
    has_robots_date: string;
    seo_score_date: string;
    customer_id: number;
}

const AddCustomerBusinesses: React.FC<BusinessProps> = ({ method }) => {
    const [controller] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const { id } = useParams();
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [platformType, setPlatformType] = React.useState<any[]>([]);
    const [industry, setIndustry] = React.useState<any[]>([]);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, watch } = useForm<BusinessData>();



    useEffect(() => {
        fetchIndustryData();
        fetchPlatform();
    }, [customerId]);

    const fetchIndustryData = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });
            setIndustry(response?.data?.data.industry);
            setValue('website_industry_id', response?.data?.data.industry[0]?.id || 1);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPlatform = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            setPlatformType(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer.getBusiness,
                    params: id,
                });
                const businessData: BusinessData = response?.data.data;
                // Set form values using setValue
                Object.entries(businessData).forEach(([key, value]) => {
                    setValue(key as keyof BusinessData, value);
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method, setValue]);


    const onSubmit = async (data: BusinessData) => {
        try {
            const dataToSend = {
                ...data,
                founded_year: Number(data.founded_year),
                design_score: Number(data.design_score),
                page_count: Number(data.page_count),
                seo_score: Number(data.seo_score),
                team_size: Number(data.team_size),
                turnover: Number(data.turnover),
                website_industry_id: data.website_industry_id || 1,
                customer_id: customerId.customer_id,
            };
            let response;
            if (method === 'PUT') {
                response = await service.makeAPICall({
                    apiUrl: `${service.API_URL.customer.updateBusiness}/${id}`,
                    methodName: service.Methods.PUT,
                    body: dataToSend
                });
            } else {
                response = await service.makeAPICall({
                    apiUrl: service.API_URL.customer.addBusiness,
                    methodName: service.Methods.POST,
                    body: dataToSend
                });
            }
            if (response && response.data && response.data.success) {
                history(-1);
            } else {
                console.error("Error:", response?.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 2 }));
        history(`/my-customer`);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card style={{ padding: "20px" }} className='module_wrap'>
                        <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                Customer Business
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4.5}>
                            <Grid container spacing={3}>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="text" label="Website URL" fullWidth {...register('website_url', { required: requiredMessage })} InputLabelProps={id && getValues('website_url') && { shrink: watch('website_url') ? true : false }} />
                                        {errors.website_url?.message && <ErrorShow error={errors.website_url?.message} />}                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="Founded Year" type="number" {...register('founded_year')} fullWidth InputLabelProps={id && getValues('founded_year') && { shrink: watch('founded_year') ? true : false }} />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="Team Size" type="number" {...register('team_size')} fullWidth InputLabelProps={id && getValues('team_size') && { shrink: watch('team_size') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Select
                                            placeholder="platform"
                                            {...register('platform_master_id', { required: requiredMessage })}
                                            value={getValues('platform_master_id') ? String(getValues('platform_master_id')) : null}
                                            options={platformType.map(platformType => ({
                                                value: platformType.platform_master_id,
                                                label: platformType.name,
                                            }))}
                                            handleChange={(selectedOption) => {
                                                setValue('platform_master_id', selectedOption.target.value);
                                                trigger('platform_master_id');
                                            }}
                                        />
                                        {errors.platform_master_id?.message && <ErrorShow error={errors.platform_master_id?.message} />}

                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="Business Category" type="text" {...register('categories')} fullWidth InputLabelProps={id && getValues('categories') && { shrink: watch('categories') ? true : false }} />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput className={watch('domain_expiry') ? "has-value" : ""} label="Website Domain Expiry Date" type="date" {...register('domain_expiry', { required: requiredMessage })} InputLabelProps={id && getValues('domain_expiry') && { shrink: watch('domain_expiry') ? true : false }} fullWidth />
                                        {errors.domain_expiry?.message && <ErrorShow error={errors.domain_expiry?.message} />}
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Select
                                            placeholder="industry"
                                            options={platformType.map(industry => ({
                                                value: industry.id,
                                                label: industry.label,
                                            }))}
                                            value={getValues('website_industry_id') ? String(getValues('website_industry_id')) : null}
                                            handleChange={(selectedOption) => {
                                                setValue('website_industry_id', selectedOption.target.value);
                                            }}
                                        />

                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="SEO Score" type="number" {...register('seo_score')} fullWidth InputLabelProps={id && getValues('seo_score') && { shrink: watch('seo_score') ? true : false }} />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="Business Turnover" type="number" {...register('turnover')} fullWidth InputLabelProps={id && getValues('turnover') && { shrink: watch('turnover') ? true : false }} />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="Website Design Score" type="number" {...register('design_score')} fullWidth InputLabelProps={id && getValues('design_score') && { shrink: watch('design_score') ? true : false }} />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput label="No. of Pages in Website" type="number" {...register('page_count')} fullWidth InputLabelProps={id && getValues('page_count') && { shrink: watch('page_count') ? true : false }} />
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </form>
            </MDBox>
            <MDBox pt={6} pb={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card style={{ padding: "20px" }} className='module_wrap'>
                        <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                Work Details
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4.5}>
                            <Grid container spacing={4}>
                                {/* First Grid */}
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox {...register('is_website_check')} />Website Working
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox {...register('is_responsive')} />Website Responsive
                                    </MDBox>
                                </Grid>
                                {/* Second Grid */}
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch('website_check_date') ? "has-value" : ""} label='checked on date'  {...register('website_check_date')} InputLabelProps={id && getValues('website_check_date') && { shrink: watch('website_check_date') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch('responsive_check_date') ? "has-value" : ""} label='checked on date'  {...register('responsive_check_date')} InputLabelProps={id && getValues('responsive_check_date') && { shrink: watch('responsive_check_date') ? true : false }} fullWidth />
                                    </MDBox>
                                </Grid>
                                {/* Third Grid */}
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox {...register('is_has_robots')} />Has Robots Txt
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <Checkbox {...register('is_seo_score')} />SEO Score
                                    </MDBox>
                                </Grid>
                                {/* Fourth Grid */}
                                <Grid item xs={8} md={3} lg={3} px={2}>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch('has_robots_date') ? "has-value" : ""} label='checked on date'  {...register('has_robots_date')} InputLabelProps={id && getValues('has_robots_date') && { shrink: watch('has_robots_date') ? true : false }} fullWidth />
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        <MDInput type="date" className={watch('seo_score_date') ? "has-value" : ""} label='checked on date'  {...register('seo_score_date')} InputLabelProps={id && getValues('seo_score_date') && { shrink: watch('seo_score_date') ? true : false }} fullWidth />
                                    </MDBox>
                                </Grid>
                            </Grid>

                        </MDBox>
                        <MDBox pt={3} ml={3} pb={2}>
                            <div className="action_wrap d_flex">
                                <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                    {method === 'POST' ? 'Add' : 'Update'}
                                </MDButton>
                                <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                            </div>
                        </MDBox>
                    </Card>
                </form>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AddCustomerBusinesses;