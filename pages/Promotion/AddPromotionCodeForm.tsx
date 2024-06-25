import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import { Grid, InputLabel, Switch } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import SelectComponent from "components/MDSelect";
import { useForm } from "react-hook-form";
import globalMessages from "utils/global";
import ErrorShow from "common/ErrorShow";
import { requiredMessage, validateFutureDate, validateLength, validateDescriptionLength } from "utils/common";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { RemoveCircleOutline, Watch } from "@mui/icons-material";
import { pid } from "process";
interface PromotionFormProps {
    method: string;
}

interface PromotionData {
    promocode_id: number;
    organization_id: number;
    promocode_name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    promotional_type: string;
    promotional_for: string;
    customer_id: number;
    discount_type: string;
    discount_value: number;
    apply_to_product: string;
    customer_group_id: number;
    is_active: boolean;
    product_id: number;
    customer_name: string;
}
interface SelectOption {
    label: string;
    value: any;
}


const PromotionCodeForm: React.FC<PromotionFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { register, handleSubmit, getValues, formState: { errors }, setValue, watch, trigger } = useForm<PromotionData>();
    const history = useNavigate();
    const [promotionType, setPromotionType] = useState<any[]>([]);
    const [promotionFor, setPromotionFor] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any[]>([]);
    const [customerGroup, setCustomerGroup] = useState<any[]>([]);
    const [discountType, setDiscountType] = useState<any[]>([]);
    const [product, setProduct] = useState<any[]>([]);
    const [selectedPromotionFor, setSelectedPromotionFor] = useState("");
    const { id } = useParams();
    const userTemplate = { pid: "", discount_value: 0, discount_type: "" };
    const [selectedValues, setSelectedValues] = useState({
        promotional_type: '',
        promotional_for: '',
        discount_type: '',
    })
    //for add multiple products handle counts 
    const [additionalFieldsCounts, setAdditionalFieldsCount] = useState([userTemplate]);

    // set the value for promotionfor  
    const handlePromotionForChange = (event: React.ChangeEvent<any>, type: keyof PromotionData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        setSelectedPromotionFor(selectedValue); // Update selectedPromotionFor with the selected value
        trigger(type); // Manually trigger validation for the changed field
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.promotionalCode.view,
                    params: id,
                });
                const promotionData: PromotionData = response?.data.data;
                setSelectedPromotionFor(promotionData.promotional_for);
                if (promotionData) {
                    Object.entries(promotionData).forEach(([key, value]) => {
                        setValue(key as keyof PromotionData, value);
                    });
                    trigger('customer_id');
                    trigger('customer_group_id');
                    trigger('discount_type');
                }

                // Set the selected customer value if "promotional_for" is "For specific customers"
                if (promotionData.promotional_for === 'For specific customers') {
                    const selectedCustomerId = promotionData.customer_id;
                    setValue('customer_id', selectedCustomerId);
                } else if (promotionData.promotional_for === "For customer groups") {
                    const selectedCustomerGroupId = promotionData.customer_group_id;
                    setValue("customer_group_id", selectedCustomerGroupId);
                }
            } catch (error) {
                console.log(error);
            }
        };


        if (id && method === 'PUT')
            fetchData();

    }, [id, method]);

    useEffect(() => {
        const fetchPromotionalTypes = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setPromotionFor(response.data.data.promotion_for);
                setPromotionType(response.data.data.promotional_type);
                setDiscountType(response.data.data.discount_type);

            } catch (error) {
                console.log(error);
            }
        };
        fetchPromotionalTypes();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.product.list,
                });
                setProduct(response?.data?.data);
            } catch (error) {
                console.log(error)
            }
            return null;
        }
        const fetchCustomer = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer.list,
                });
                setCustomer(response?.data?.data);
            } catch (error) {
                console.log(error)
            }
        };
        fetchCustomer();
        fetchProduct();
    }, []);

    useEffect(() => {
        const fetchClientGroup = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer_group.get
                });
                setCustomerGroup(response?.data?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchClientGroup();
    }, []);

    const handleToggle = () => {
        setValue('is_active', !getValues('is_active'))
    }

    const handleAddFields = () => {
        setAdditionalFieldsCount([...additionalFieldsCounts, { ...userTemplate }]);
    };

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const handleremoveFields = (indexToRemove: number) => {
        setAdditionalFieldsCount(prevCount => prevCount.filter((_, index) => index !== indexToRemove));
    };

    //handle multiple fields for multiple product with discount type and value
    const handleDiscountValueChange = (event: React.ChangeEvent<HTMLInputElement>, index: any) => {

        const { name, value } = event.target;
        const updatedRows = additionalFieldsCounts.map((additionalFieldsCount, i) =>
            index === i
                ? { ...additionalFieldsCount, [name]: value }
                : additionalFieldsCount
        );
        setAdditionalFieldsCount(updatedRows);
    };

    const onSubmit = async (promotionData: PromotionData) => {
        try {
            const updatedpromotionData = {
                ...promotionData,
            };
            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.promotionalCode.create : service.API_URL.promotionalCode.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: updatedpromotionData,
            });
            if (selectedPromotionFor === "For specific customers") {
                const selectedCustomer = customer.find(customer => customer.sr_no === getValues("customer_id"))?.sr_no || '';
                if (selectedCustomer) {
                    setValue("customer_id", selectedCustomer);
                }
            } else if (selectedPromotionFor === "For customer groups") {
                const selectedCustomerGroup = customerGroup.find(group => group.customer_group_id === getValues("customer_group_id"))?.customer_group_id || '';
                if (selectedCustomerGroup) {
                    setValue("customer_group_id", selectedCustomerGroup);
                }
            }

            history(-1)
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }
    const ChangeValue = (event: any, type: keyof PromotionData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        trigger(type);
    };
    // validate end date must not be the previous date of start date
    const validateEndDate = (value: Date) => {
        const startDate = getValues('start_date');
        if (!startDate) return true;
        return value > startDate || 'End date must be greater than start date';
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} pb={3}>
                <Grid container spacing={1} className='module_wrap'>
                    <Grid item xs={12} md={12}>
                        <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                            <MDTypography variant="h6" color="white">
                                {method === 'POST' ? 'Add' : 'Update'} Promotion Code
                            </MDTypography>
                        </MDBox>
                        <MDBox mx={2} my={3} mt={-3} py={2} px={0} component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                <Grid item xs={12}>
                                    <MDInput
                                        my={2}
                                        {...register("promocode_name", { required: 'Promotion code s required' })}
                                        label={globalMessages.promotion_form.promocode_name}
                                        fullWidth
                                        required
                                        InputLabelProps={id && { shrink: watch('promocode_name') ? true : false }}
                                    />
                                    {errors.promocode_name?.message && <ErrorShow error={errors.promocode_name?.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <MDInput
                                        my={2}
                                        {...register("description", { required: 'Description is required' })}
                                        label={globalMessages.promotion_form.description}
                                        fullWidth
                                        required
                                        InputLabelProps={id && { shrink: watch('description') ? true : false }}
                                    />
                                    {errors.description?.message && <ErrorShow error={errors.description?.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <MDInput
                                        {...register("start_date", { required: "Start date is required", validate: validateFutureDate })}
                                        label={globalMessages.promotion_form.start_date}
                                        className={watch("start_date") ? "has-value" : ""}
                                        type="date"
                                        fullWidth
                                        required
                                        style={{ height: "45px" }}

                                    />
                                    {errors.start_date?.message && <ErrorShow error={errors.start_date.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <MDInput
                                        {...register("end_date", { required: "End date is required", validate: validateEndDate })}
                                        label={globalMessages.promotion_form.end_date}
                                        className={watch("end_date") ? "has-value" : ""}
                                        type="date"
                                        fullWidth
                                        required
                                        style={{ height: "45px" }}

                                    />
                                    {errors.end_date?.message && <ErrorShow error={errors.end_date.message} />}
                                </Grid>
                            </Grid>
                            <Grid item style={{ marginTop: "10px" }} />
                            <Grid container spacing={2} alignItems="center" >
                                <Grid item xs={12} sm={12} >
                                    <SelectComponent
                                        placeholder="Promotion Type"
                                        options={promotionType.map(method => ({
                                            value: method.label,
                                            label: method.label
                                        }))}
                                        handleChange={(event: any) => ChangeValue(event, "promotional_type")}
                                        value={getValues("promotional_type") || ''}
                                        {...register("promotional_type", { required: 'Promotion type is required' })}
                                    />
                                    {errors.promotional_type?.message && <ErrorShow error={errors.promotional_type.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <SelectComponent
                                        placeholder="Promotion For"
                                        options={promotionFor.map(method => ({
                                            value: method.label,
                                            label: method.label
                                        }))}
                                        handleChange={(event: any) => {
                                            ChangeValue(event, "promotional_for");
                                            handlePromotionForChange(event, "promotional_for");
                                        }}
                                        value={getValues("promotional_for") || ''}
                                        {...register("promotional_for", { required: 'Promotional code for required' })}
                                    />
                                    {errors.promotional_for?.message && <ErrorShow error={errors.promotional_for.message} />}
                                </Grid>


                                {selectedPromotionFor === "For specific customers" && (
                                    <Grid item xs={12} style={{ marginTop: "5px" }}>
                                        <SelectComponent
                                            placeholder="Select Specific Customer"
                                            options={customer.map(customer => ({
                                                value: customer.sr_no,
                                                label: customer.name
                                            }))}
                                            handleChange={(event: any) => ChangeValue(event, "customer_id")}
                                            value={getValues('customer_id') ? String(getValues('customer_id')) : null}
                                            {...register("customer_id", { required: requiredMessage })}
                                        />
                                        {errors.customer_id?.message && <ErrorShow error={errors.customer_id.message} />}
                                    </Grid>
                                )}

                                {selectedPromotionFor === "For customer groups" && (
                                    <Grid item xs={12} style={{ marginTop: "5px" }}>
                                        <SelectComponent
                                            placeholder="Select Customer Group"
                                            options={customerGroup.map(group => ({
                                                value: group.customer_group_id,
                                                label: group.name
                                            }))}
                                            handleChange={(event: any) => ChangeValue(event, "customer_group_id")}

                                            value={getValues('customer_group_id') ? String(getValues('customer_group_id')) : null}
                                            {...register("customer_group_id", { required: requiredMessage })}
                                        />
                                        {errors.customer_group_id?.message && <ErrorShow error={errors.customer_group_id.message} />}
                                    </Grid>
                                )}


                                {additionalFieldsCounts.map((additionalFieldsCount, index) => (
                                    <Grid container spacing={4} mt={0} ml={-2} lg={12} key={index}>
                                        <React.Fragment key={index}>


                                            <Grid item lg={3.6}>
                                                <SelectComponent
                                                    {...register("apply_to_product", { required: 'Select product is required' })}
                                                    placeholder="Select Product"
                                                    options={product.map(product => ({
                                                        value: product.name,
                                                        label: product.name
                                                    }))}
                                                    handleChange={(event: any) => ChangeValue(event, "apply_to_product")}
                                                    // value={additionalFieldsCount.pid ? product.find(option => option.value === additionalFieldsCount.pid) : null}
                                                    value={getValues("apply_to_product") || ''}
                                                />
                                                {errors.apply_to_product?.message && <ErrorShow error={errors.apply_to_product.message} />}
                                            </Grid>
                                            <Grid item lg={2.2}>

                                                <MDInput
                                                    // {...register("discount_value", { required: 'Discount value is required' })}
                                                    type="number"
                                                    label="Discount Value"
                                                    fullWidth
                                                    name="discount_value"
                                                    //onChange={(event: any) => handleDiscountValueChange(event)}
                                                    onChange={(e: any) => {
                                                        const newValue = parseInt(e.target.value);
                                                        if (newValue !== 0) {
                                                            handleDiscountValueChange(e, index);

                                                        }
                                                    }}
                                                    value={additionalFieldsCount.discount_value}
                                                    min="1"
                                                    InputLabelProps={id && { shrink: watch('discount_value') ? true : false }}
                                                />
                                                {errors.discount_value && <ErrorShow error={errors.discount_value.message} />}
                                            </Grid>

                                            <Grid item lg={3.8}>
                                                <SelectComponent
                                                    {...register("discount_type", { required: 'Discount type is required' })}
                                                    placeholder="Discount Type"
                                                    options={discountType.map((method) => ({ value: method.label, label: method.label }))}
                                                    handleChange={(event: any) => ChangeValue(event, "discount_type")}
                                                    value={getValues("discount_type") || ''}
                                                // value={additionalFieldsCount.discount_type ? discountType.find(option => option.value === additionalFieldsCount.discount_type) : null}
                                                //  InputLabelProps={id && { shrink: watch('discount_value') ? true : false }}
                                                />
                                                {errors.discount_type?.message && <ErrorShow error={errors.discount_type.message} />}

                                            </Grid>

                                        </React.Fragment>
                                        <Grid mt={4} ml={3}>
                                            {index == 0 && (
                                                <MDButton onClick={handleAddFields} variant="contained" color="dark">
                                                    <AddCircleIcon />
                                                </MDButton>
                                            )}
                                            {index != 0 && (
                                                <MDButton onClick={() => handleremoveFields(index)} variant="contained" color="dark">
                                                    <RemoveCircleOutline />
                                                </MDButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item style={{ marginTop: "20px" }} />
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={9}>
                                    <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                        <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                            {globalMessages.promotion_form.is_Active}
                                        </MDTypography>
                                        <Switch checked={getValues('is_active')} onClick={handleToggle} {...register("is_active")} />
                                    </MDBox>
                                    {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                                </Grid>
                            </Grid>
                            <MDBox className='action_wrap d_flex'>
                                <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.promotion_form.save_button_text}
                                </MDButton>
                                <MDButton variant="gradient" color="dark" onClick={() => history(-1)}>
                                    {globalMessages.btn_text.back_button_text}
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </Grid>
                </Grid >
            </MDBox >
        </DashboardLayout >
    );
};
export default PromotionCodeForm;



