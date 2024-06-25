import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import globalMessages from 'utils/global';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';
import { requiredMessage, validateActive, validateImage } from 'utils/common';
import { Editor } from "@tinymce/tinymce-react";
import MDSelect from "components/MDSelect";
import MDFileInput from "common/MDFileInput";

// Define the interface for the props of category form component
interface CategoryFormProps {
    method: string;
}

// Define the interface for the category data
interface CategoryData {
    name: string,
    is_active: string,
    parent_id?: string,
    short_description: string,
    long_description?: string,
    image?: File,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string
}

const CategoryForm: React.FC<CategoryFormProps> = ({ method }) => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue, watch, setError, clearErrors } = useForm<CategoryData>();
    const history = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState<any[]>([]);
    // const watchAllFields = useWatch();

    // function to fetch parent categories for parent category dropdown
    const fetchCategories = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.list,
                query: { column: true, parent_id: null },
            });
            setCategories(() => {
                return response?.data?.data?.map((category: any) => {
                    return { value: category.id, label: category.name };
                });
            });
            trigger('parent_id')
        } catch (error) {
            console.log(error);
        }
    };

    // function to fetch category data for update
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.get,
                params: id,
            });
            // set default values of react hook form
            const categoryData: CategoryData = response?.data.data;

            // Set form values using setValue
            Object.entries(categoryData).forEach(([key, value]) => {
                setValue(key as keyof CategoryData, value);
            });

            setValue("is_active", String(getValues('is_active')))
            trigger('parent_id');
        } catch (error) {
            console.log(error);
        }
    };


    // useEffect hook to fetch categories and set default values and set default values
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
    }, [id]);

    // function to handle select change
    const handleSelectChange = (event: any) => {
        setValue('parent_id', String(event.target.value))
        trigger('parent_id');
    }

    // function to handle is active
    const handleToggle = (event: any) => {
        setValue('is_active', event.target.value)
        trigger('is_active');
    }

    const handleImageChange = (event: any) => {
        if (event.target.files) {
            const valid = validateImage(event.target.files)
            if (valid == true) {
                setValue("image", event.target.files[0]);
                watch("image")
            } else {
                setError('image', {
                    type: "manual",
                    message: valid,
                })
                trigger("image")
            }
        }
    }

    // function to handle submit button
    const onSubmit = async (categoryData: CategoryData) => {
        console.log('cuheh', categoryData)
        try {
            if(typeof categoryData.image === 'string') {
                // @ts-ignore
                categoryData.image =null;
            }

            const formData = new FormData();
            Object.entries(categoryData).forEach(([key, value]) => {
                console.log(key, value);
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
            const url = method === 'POST' ? service.API_URL.category.create : service.API_URL.category.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? "",
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
                        <Grid item xs={15} className='module_wrap'>
                            <MDBox
                                className='module_head'
                                mx={2}
                                my={3}
                                mt={-3}
                                py={2}
                                px={2}
                                variant="gradient"
                                bgColor={sidenavColor}
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    {method === "POST" ? "Add" : "Update"}{" "}
                                    {globalMessages.category.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox mt={3} component="form" role="form">
                                <MDBox mb={2}>
                                    <MDInput my={2} InputLabelProps={id && getValues("name") && { shrink: watch('name') ? true : false }}   {...register("name", { required: requiredMessage })} label={globalMessages.category.name_label} fullWidth required />
                                    {errors.name?.message && <ErrorShow error={errors.name?.message} />}
                                </MDBox>

                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.category.short_description_label}
                                    </MDTypography>
                                    <Editor
                                        apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                        value={getValues('short_description')}
                                        {...register("short_description", { required: requiredMessage })}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                            allow_html_in_named_anchor: false,
                                        }}
                                        onEditorChange={(newValue, editor) => {
                                            setValue('short_description', editor.getContent({ format: 'raw' }));
                                            trigger('short_description')
                                        }}
                                    />
                                    {errors.short_description?.message && <ErrorShow error={errors.short_description?.message} />}
                                </MDBox>
                                <MDBox fontSize='medium' mb={2}>
                                    <MDSelect value={getValues('parent_id') ? String(getValues('parent_id')) : null} {...register("parent_id")} placeholder={globalMessages.category.select_label} options={categories} handleChange={handleSelectChange} />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.category.long_description_label}
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
                                <MDBox
                                    mx={1}
                                    display="flex"
                                    alignItems="center"
                                    mb={2}
                                >
                                    <MDTypography
                                        variant="label"
                                        mr={1}
                                        fontSize={"0.8em"}
                                        fontWeight="regular"
                                        color="text"
                                    >
                                        {
                                            globalMessages.category
                                                .image_label
                                        }
                                    </MDTypography>
                                    <MDFileInput name="image" type="image" trigger={trigger} getValues={getValues} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                    {errors.image?.message && <ErrorShow error={errors.image?.message} />}
                                </MDBox>
                                <MDBox mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.category.is_active_label}
                                    </MDTypography>
                                    <FormControl component="fieldset">
                                        <div style={{ display: "flex" }}>
                                            <RadioGroup row {...register('is_active', { validate: validateActive })} value={getValues('is_active')} onChange={handleToggle}>
                                                <FormControlLabel value={"true"} control={<Radio />} checked={getValues('is_active') == "true"} label={<MDTypography checked={getValues('is_active')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Yes</MDTypography>} />
                                            </RadioGroup>
                                            <RadioGroup row {...register('is_active', { validate: validateActive })} value={getValues('is_active')} onChange={handleToggle}>
                                                <FormControlLabel value={"false"} control={<Radio />} checked={getValues('is_active') == "false"} label={<MDTypography checked={getValues('is_active')} variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>No</MDTypography>} />
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                    {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput {...register("meta_title")} InputLabelProps={id && getValues("meta_title") && { shrink: watch('meta_title') ? true : false }} label={globalMessages.category.meta_title_label} fullWidth multiline />
                                    {errors.meta_title?.message && <ErrorShow error={errors.meta_title?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput {...register("meta_keyword")} InputLabelProps={id && getValues("meta_keyword") && { shrink: watch('meta_keyword') ? true : false }} label={globalMessages.category.meta_keyword_label} fullWidth multiline />
                                    {errors.meta_keyword?.message && <ErrorShow error={errors.meta_keyword?.message} />}
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                        {globalMessages.category.meta_description_label}
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
                                <MDBox className='action_wrap d_flex'>
                                    <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add' : 'Update'} {globalMessages.category.save_button_text}
                                    </MDButton>
                                    <MDButton
                                        className='button grey'
                                        variant="gradient"
                                        color="error"
                                        onClick={() => history(-1)}
                                    >
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

export default CategoryForm;
