import { useNavigate, useParams } from 'react-router-dom';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import React, { useEffect, useState } from 'react';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";
import { service } from "utils/Service/service";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import { useForm } from 'react-hook-form';
import globalMessages from 'utils/global';
import { floatNumber, integerNumber, requiredMessage, validateActive, validateIcon, validateImage } from 'utils/common';
import ErrorShow from 'common/ErrorShow';
import { Editor } from '@tinymce/tinymce-react';
import MDSelect from 'components/MDSelect';
import MDFileInput from 'common/MDFileInput';

// Define the interface for the props of product form component
interface ProductFormProps {
    method: string;
}

// Define the interface for the product data
interface ProductData {
    name: string;
    price: number;
    sales_price: number;
    is_active: string;
    alias: string;
    category_id: number[];
    short_description: string;
    member_price: number;
    product_type: string;
    qty_apply: string;
    product_icon?: null | string;
    product_image?: null | string;
    meta_title?: string;
    meta_description?: string;
    long_description?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ method }) => {
    const [controller] = useMaterialUIController();
    const [categories, setCategories] = useState([]);
    const { sidenavColor } = controller;
    const history = useNavigate();
    const { id } = useParams();
    const productType = [
        { value: 'paid', label: 'Paid' },
        { value: 'free', label: 'Free' },
    ]
    const { register, unregister, handleSubmit, getValues, formState: { errors }, setValue, trigger, watch, setError, clearErrors } = useForm<ProductData>();

    // function to fetch categories for category dropdown
    const fetchCategories = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.list,
                query: { column: true, forSelect: true },
            });
            setCategories(() => {
                return response?.data?.data?.map((category: any) => {
                    return { value: category.id, label: category.name };
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    // function to fetch product data for update
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.get,
                params: id,
            });

            const productData: ProductData = response?.data.data;

            if (productData) {
                Object.entries(productData).forEach(([key, value]) => {
                    setValue(key as keyof ProductData, value);
                });
            }

            setValue("is_active", String(getValues('is_active')));
            setValue("qty_apply", String(getValues('qty_apply')));
        
            trigger("product_type")
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect hook to fetch categories and set default values for tiny editor
    useEffect(() => {
        fetchCategories();
        setValue("meta_description", "Example Description");
        setValue("long_description", "Example Description");
        setValue("short_description", "Example Description");
    }, []);

    // useEffect hook to fetch data for update
    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, method]);

    // function to handle select change
    const handleSelectChange = (event: any) => {
        setValue('product_type', String(event.target.value));
        trigger('product_type');

        // product is free than, make products value 0
        if (event.target.value === 'free') {
            setValue('price', 0);
            setValue('member_price', 0);
            setValue('sales_price', 0);
        }

        // unregistering previous value
        if (event.target.value === 'paid') {
            unregister('price');
            unregister('member_price');
            unregister('sales_price');
        }
    }

    // function to handle select category change
    const handleCategoryChange = (event: any) => {
        setValue('category_id', event.target.value);
        trigger('category_id');
    }

    // function to handle toggle switch
    const handleToggle = (event: any) => {
        setValue('is_active', event.target.value)
        trigger('is_active');
    }

    // function to handle toggle switch
    const handleQtyApply = (event: any) => {
        setValue('qty_apply', event.target.value)
        trigger('qty_apply');
    }

    const handleIconChange = (event: any) => {
        if (event.target.files) {
            const valid = validateIcon(event.target.files)
            if (valid == true) {
                setValue("product_icon", event.target.files[0]);
                watch("product_icon")
            } else {
                setError('product_icon', {
                    type: "manual",
                    message: valid,
                })
                trigger("product_icon")
            }
        }
    }

    const handleImageChange = (event: any) => {
        if (event.target.files) {
            const valid = validateImage(event.target.files)
            if (valid == true) {
                setValue("product_image", event.target.files[0]);
                watch("product_image")
            } else {
                setError('product_image', {
                    type: "manual",
                    message: valid,
                })
                trigger("product_image")
            }
        }
    }

    // function to handle submit 
    const onSubmit = async (productData: ProductData) => {
        try {
            if (productData.product_type == "free") {
                productData.price = 0;
                productData.member_price = 0;
                productData.sales_price = 0;
            }

            const formData = new FormData();
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (typeof value === "boolean") {
                        formData.append(key, value.toString());
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            });

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.product.create : service.API_URL.product.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: formData,
                showAlert: true,
                options: {
                    headers: {
                        'Accept': '*',
                        'content-type': 'multipart/form-data',
                    }
                }
            });

            history(-1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={4} pb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className='module_wrap'>
                            <MDBox mx={2} my={3} mt={-3} py={2} px={2} className='module_head' variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.product.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox mt={3} component="form" role="form">
                                <MDBox mb={2}>
                                    <MDInput my={2} {...register("name", { required: requiredMessage })} InputLabelProps={id && getValues("name") && { shrink: watch('name') ? true : false }} label={globalMessages.product.name_label} fullWidth required />
                                    {errors.name?.message && <ErrorShow error={errors.name?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput my={2} {...register("alias", { required: requiredMessage })} InputLabelProps={id && getValues("alias") && { shrink: watch('alias') ? true : false }} label={globalMessages.product.alias_label} fullWidth required />
                                    {errors.alias?.message && <ErrorShow error={errors.alias?.message} />}
                                </MDBox>
                                <MDBox fontSize='medium' mb={2}>
                                    <MDSelect value={getValues('product_type') ? String(getValues('product_type')) : ''} {...register("product_type", { required: requiredMessage })} handleChange={handleSelectChange} placeholder={globalMessages.product.type_placeholder} options={productType} />
                                    {errors.product_type?.message && <ErrorShow error={errors.product_type?.message} />}
                                </MDBox>
                                {
                                    getValues('product_type') === 'paid' &&
                                    <>
                                        <MDBox mb={2}>
                                            <MDInput {...register("price", { required: requiredMessage, pattern: integerNumber })} InputLabelProps={id && getValues("price") && { shrink: watch('price') ? true : false }} label={globalMessages.product.price_label} fullWidth required />
                                            {errors.price?.message && <ErrorShow error={errors.price?.message} />}
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput {...register("member_price", { required: requiredMessage, pattern: integerNumber })} InputLabelProps={id && getValues("member_price") && { shrink: watch('member_price') ? true : false }} label={globalMessages.product.member_price_label} fullWidth required />
                                            {errors.member_price?.message && <ErrorShow error={errors.member_price?.message} />}
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput {...register("sales_price", { required: requiredMessage, pattern: floatNumber })} InputLabelProps={id && getValues("sales_price") && { shrink: watch('sales_price') ? true : false }} label={globalMessages.product.sales_price_label} fullWidth required />
                                            {errors.sales_price?.message && <ErrorShow error={errors.sales_price?.message} />}
                                        </MDBox>
                                    </>
                                }
                                <MDBox fontSize='medium' mb={2}>
                                    <MDSelect value={getValues('category_id') || []} {...register("category_id", { required: requiredMessage })} isMulti={true} handleChange={handleCategoryChange} placeholder={globalMessages.product.category_placeholder} options={categories} />
                                    {errors.category_id?.message && <ErrorShow error={errors.category_id?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.product.short_description_label}
                                    </MDTypography>
                                    <Editor
                                        apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                        value={getValues('short_description')}
                                        {...register("short_description")}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                        }}
                                        onEditorChange={(newValue, editor) => {
                                            setValue('short_description', editor.getContent({ format: 'raw' }));
                                            trigger('short_description')
                                        }}
                                    />
                                    {errors.short_description?.message && <ErrorShow error={errors.short_description?.message} />}
                                </MDBox>

                                <MDBox mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.product.qty_apply}
                                    </MDTypography>
                                    <FormControl component="fieldset">
                                        <div style={{ display: "flex" }}>
                                            <RadioGroup row {...register('qty_apply', { validate: validateActive })} value={getValues('qty_apply')} onChange={handleQtyApply}>
                                                <FormControlLabel value={"true"} control={<Radio />} checked={getValues('qty_apply') === "true"} label={<MDTypography checked={getValues('qty_apply')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Yes</MDTypography>} />
                                            </RadioGroup>
                                            <RadioGroup row {...register('qty_apply', { validate: validateActive })} value={getValues('qty_apply')} onChange={handleQtyApply}>
                                                <FormControlLabel value={"false"} control={<Radio />} checked={getValues('qty_apply') === "false"} label={<MDTypography checked={getValues('qty_apply')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>No</MDTypography>} />
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                    {errors.qty_apply?.message && <ErrorShow error={errors.qty_apply?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.product.long_description_label}
                                    </MDTypography>
                                    <Editor
                                        apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                        value={getValues('long_description')}
                                        {...register("long_description")}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                        }}
                                        onEditorChange={(newValue, editor) => {
                                            setValue('long_description', editor.getContent({ format: 'raw' }));
                                            trigger('long_description')
                                        }}
                                    />
                                    {errors.long_description?.message && <ErrorShow error={errors.long_description?.message} />}
                                </MDBox>
                                <MDBox mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.product.icon_label}
                                    </MDTypography>
                                    <MDFileInput name="product_icon" type="icon" getValues={getValues} trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                    {errors.product_icon?.message && <ErrorShow error={errors.product_icon?.message} />}
                                </MDBox>
                                <MDBox mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.product.image_label}
                                    </MDTypography>
                                    <MDFileInput name="product_image" type="image" getValues={getValues} trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                    {errors.product_image?.message && <ErrorShow error={errors.product_image?.message} />}
                                </MDBox>
                                <MDBox mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.product.is_active_label}
                                    </MDTypography>
                                    <FormControl component="fieldset">
                                        <div style={{ display: "flex" }}>
                                            <RadioGroup row {...register('is_active', { validate: validateActive })} value={getValues('is_active')} onChange={handleToggle}>
                                                <FormControlLabel value={"true"} control={<Radio />} checked={getValues('is_active') === "true"} label={<MDTypography checked={getValues('is_active')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Yes</MDTypography>} />
                                            </RadioGroup>
                                            <RadioGroup row {...register('is_active', { validate: validateActive })} value={getValues('is_active')} onChange={handleToggle}>
                                                <FormControlLabel value={"false"} control={<Radio />} checked={getValues('is_active') === "false"} label={<MDTypography checked={getValues('is_active')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>No</MDTypography>} />
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                    {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput  {...register("meta_title")} InputLabelProps={id && getValues("meta_title") && { shrink: watch('meta_title') ? true : false }} label={globalMessages.product.meta_title_label} fullWidth multiline />
                                    {errors.meta_title?.message && <ErrorShow error={errors.meta_title?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.product.meta_description_label}
                                    </MDTypography>
                                    <Editor
                                        apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                        value={getValues('meta_description')}
                                        {...register("meta_description")}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                        }}
                                        onEditorChange={(newValue, editor) => {
                                            setValue('meta_description', editor.getContent({ format: 'raw' }));
                                            trigger('meta_description')
                                        }}
                                    />
                                    {errors.meta_description?.message && <ErrorShow error={errors.meta_description?.message} />}
                                </MDBox>
                                <MDBox>
                                    <MDButton type="submit" variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add' : 'Update'} {globalMessages.product.save_button_text}
                                    </MDButton>
                                    <MDButton variant="gradient" color="error" onClick={() => history(-1)}>
                                        {globalMessages.btn_text.cancel_button_text}
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

export default ProductForm;
