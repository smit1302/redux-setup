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
import { requiredMessage, validateEmail } from 'utils/common';
import ErrorShow from 'common/ErrorShow';
import { watch } from 'fs';

interface ServiceType {
    website_url: string;
    price: number;
    productId: number;
    product_name: string;
    qty: number;
    cart_id: number;
    name: string;
    email: string;
}

const AddService = () => {
    const history = useNavigate();
    const dispatchData = useDispatch();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [product, setProduct] = useState<any[]>([]);
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [customerPersonalInfo, setCustomerPersonalInfo] = useState({
        name: '',
        email: '',
    });

    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue } = useForm<ServiceType>();


    const fetchCustomerData = async () => {
        const queryData = { customer_id: customerId.cartCustomer }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.list,
                query: queryData,
            });
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                const customerData = response.data.data[0];
                setCustomerPersonalInfo({
                    name: customerData.name,
                    email: customerData.email
                });
            }
        } catch (error) {
            console.log(error);
        }
    };



    const onSubmit = async (data: ServiceType) => {
        console.log('customer', customerId)
        try {
            const dataToSend = {
                ...data,
                productId: Number(data.productId),
                qty: Number(data.qty),
                price: Number(data.price),
                cart_id: Number(customerId.cartId),
            };
            const response = await service.makeAPICall({
                apiUrl: service.API_URL.cartProduct.create,
                methodName: service.Methods.POST,
                body: dataToSend,
            });

            history(-1);
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    };

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

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 5 }));
        history(`/my-customer`);
    };

    useEffect(() => {
        fetchProduct();
        fetchCustomerData();
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
                                        Add Service
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={6} pb={3}>
                                    <MDBox component="form" role="form">
                                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput label="Name" {...register("name")} type="text" value={customerPersonalInfo.name} fullWidth disabled />
                                                </MDBox>
                                                <MDBox mb={2}>
                                                    <MDInput label="Email" {...register("email")} type="text" value={customerPersonalInfo.email} fullWidth disabled />
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
                                                        {...register("productId", { required: requiredMessage })}
                                                        value={getValues("productId")}
                                                        handleChange={(selectedOption) => {
                                                                setValue('productId', selectedOption.target.value);
                                                                setValue('price', product.find(product => product.id == selectedOption.target.value)?.price);
                                                                setValue('product_name', product.find(product => product.id == selectedOption.target.value)?.name);
                                                                trigger('price')
                                                                trigger('product_name')
                                                                trigger('productId')
                                                        }}
                                                    />
                                                    {errors?.productId?.message && <ErrorShow error={errors?.productId?.message} />}
                                                </MDBox>
                                                <MDBox mb={2}>
                                                    <MDInput label="Price" InputLabelProps={( Number(getValues("price")) || String(getValues("price")) == '0') && {shrink: true}} {...register("price", { required: requiredMessage })} type="number" fullWidth required disabled />
                                                    {errors?.price?.message && <ErrorShow error={errors?.price?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput
                                                        label="Products alias"
                                                        value={getValues("product_name")}
                                                        InputLabelProps={(getValues("product_name")) && {shrink: true}}
                                                        {...register("product_name", { required: requiredMessage })}
                                                    />
                                                    {errors?.product_name?.message && <ErrorShow error={errors?.product_name?.message} />}
                                                </MDBox>
                                                <MDBox mb={2}>
                                                    <MDInput label="Quantity" {...register("qty", { required: requiredMessage })} type="text" fullWidth required />
                                                    {errors?.qty?.message && <ErrorShow error={errors?.qty?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <MDBox mb={2}>
                                                    <MDInput label="Website URL" {...register("website_url", { required: requiredMessage })} fullWidth required />
                                                    {errors?.website_url?.message && <ErrorShow error={errors?.website_url?.message} />}
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>

                                <Grid item xs={12}>
                                    <MDBox>
                                        <MDButton variant="gradient" color={sidenavColor} type="submit" onClick={handleSubmit(onSubmit)}>
                                            ADD Service
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

export default AddService;


