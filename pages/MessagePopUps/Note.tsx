import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Editor } from "@tinymce/tinymce-react";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { requiredMessage } from "utils/common";
import { service } from "utils/Service/service";
import { useEffect, useState } from "react";
import React, { useRef } from 'react';
import SelectComponent from "components/MDSelect";

interface noteData {
    note_data: string;
    log_lead: boolean;
    is_order: boolean;
    is_job: boolean;
    product_id: number;
    organization_id: number;
    customer_id: number;
    activity_id: number;
}

const Note = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const dispatchData = useDispatch();
    const history = useNavigate();
    const [orderProductOptions, setOrderProductOptions] = useState<any[]>([]);
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, reset } = useForm<noteData>({
        defaultValues: {
            log_lead: false,
            is_order: false,
            is_job: false,
            product_id: orderProductId?.product_id || 0,
            organization_id: orderProductId?.organization_id || 0,
            customer_id: orderProductId?.customer_id || 0,
            activity_id: 3,
        }
    });

    const fetchOrderProduct = async () => {
        try {
            // Fetch orders
            const ordersResponse = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
            });

            console.log('Orders Response:', ordersResponse?.data?.data); // Log orders response

            if (ordersResponse && ordersResponse.data) {
                // Create a map to store order_id to product_id mapping
                const orderProductMap = new Map();

                // Iterate through each order object
                ordersResponse.data.data.forEach((order: any) => {
                    const orderId = order.order_id;
                    const productId = order.product_id;

                    if (orderId !== null && productId !== null) {
                        if (orderProductMap.has(orderId)) {
                            orderProductMap.get(orderId).push(productId);
                        } else {
                            orderProductMap.set(orderId, [productId]);
                        }
                    }
                });

                console.log('Order Product Map:', orderProductMap); // Log order product map

                // Map the orderProductMap entries to the required format
                const mappedProducts = Array.from(orderProductMap.entries()).map(([orderId, productIds]) => ({
                    orderId: orderId,
                    productIds: productIds,
                }));

                const orderID = orderProductId.order_id;

                const productsForOrder = mappedProducts.filter(obj => obj.orderId === orderID);

                // Log the productIds of the filtered objects
                productsForOrder.forEach(obj => {
                    console.log('Order idss:', obj.productIds);
                });

                // Fetch products only if there are products for the order
                if (productsForOrder.length > 0) {
                    // Fetch products
                    const productsResponse = await service.makeAPICall({
                        methodName: service.Methods.GET,
                        apiUrl: service.API_URL.product.list,
                    });

                    console.log('Products Response:', productsResponse?.data?.data); // Log products response

                    // Filter products based on product IDs present in productsForOrder
                    const filteredProducts = productsResponse?.data?.data?.filter((product: any) =>
                        productsForOrder.some(obj => obj.productIds.includes(product.id))
                    );

                    console.log('Filtered Products:', filteredProducts); // Log filtered products

                    // Assuming filteredProducts is an array of products
                    const listProducts = filteredProducts?.map((product: any) => ({
                        value: product.id,
                        label: product.name,
                    })) || [];

                    // Set the order product options
                    setOrderProductOptions(listProducts);
                } else {
                    console.log('No products found for the order.');
                }
            }
        } catch (error) {
            console.error('Error fetching order products:', error);
        }
    };

    useEffect(() => {
        fetchOrderProduct();
    }, [])

    const handleResetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setValue('log_lead', false);
            setValue('is_order', false);
            setValue('is_job', false);
            trigger('log_lead');
            trigger('is_order');
            trigger('is_job');
        }
    };

    useEffect(() => {
        if (orderProductId) {
            console.log("ORDER ID", orderProductId.order_id);
            console.log("PRODUCT ID", orderProductId.product_id);
            setValue('product_id', orderProductId.product_id);
            trigger('product_id')
        }
    }, []);

    const handleNavigation = () => {
        dispatchData(addData({ key: "value", data: 1 }));
        history(-1);
    };

    const onSubmit = async (noteData: noteData) => {
        console.log('data', noteData)

        await service.makeAPICall({
            methodName: service.Methods.POST,
            apiUrl: service.API_URL.message_activity.note,
            body: noteData,
        });
        handleNavigation();
    };

    const handleorderProductChange = (selectedOption: any) => {
        setValue('product_id', selectedOption.target.value);
        trigger('product_id');
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid>
                <MDBox pt={6} pb={3}>
                    <MDTypography>Note</MDTypography>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            {/* Right side of the first card */}
                            <div style={{ marginBottom: '50px' }}>
                                <Card>
                                    <form ref={formRef}>
                                        <MDBox py={3} px={2}>
                                            <Editor apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"
                                                {...register("note_data", { required: requiredMessage })}
                                                init={{
                                                    height: 300,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('note_data', editor.getContent({ format: 'raw' }));
                                                    trigger('note_data')
                                                }}
                                            ></Editor>
                                            {errors.note_data?.message && <ErrorShow error={errors.note_data?.message} />}
                                        </MDBox>
                                        <MDBox mx={2} mt={-3} py={3} px={2}>
                                            <MDTypography><u>Log Email to:</u></MDTypography>
                                            <MDBox ml={3} mt={3} py={3} px={2}>
                                                <Grid container spacing={4}>
                                                    <MDBox ml={3} >
                                                        <Checkbox {...register('log_lead')} />Lead
                                                    </MDBox>
                                                    <MDBox ml={3}  >
                                                        <Checkbox {...register('is_job')} />Try Job
                                                    </MDBox>
                                                    <MDBox ml={3}  >
                                                        <Checkbox {...register('is_order')} />Order
                                                    </MDBox>
                                                    <MDBox ml={3} >
                                                        <SelectComponent
                                                            value={String(getValues('product_id'))}
                                                            {...register("product_id")}
                                                            placeholder='Order Product'
                                                            options={orderProductOptions}
                                                            handleChange={handleorderProductChange}
                                                        />
                                                    </MDBox>
                                                </Grid>
                                            </MDBox>
                                        </MDBox>
                                    </form>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox >
                            <MDButton style={{ marginLeft: '10px' }} onClick={handleSubmit(onSubmit)} variant="gradient" color="info" >
                                Add a note
                            </MDButton>
                            <MDButton style={{ marginLeft: '10px' }} variant="gradient" color="warning" onClick={handleResetForm} >
                                Reset
                            </MDButton>
                            <MDButton style={{ marginLeft: '10px' }} onClick={handleNavigation} variant="gradient" color="error" >
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

export default Note;