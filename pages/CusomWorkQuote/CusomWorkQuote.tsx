import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Editor } from "@tinymce/tinymce-react";
import { service } from "utils/Service/service";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import { validateImage } from "utils/common";
import Select from "components/MDSelect";
import MDFileInput from "common/MDFileInput";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";

interface CustomWorkQuoteData {
    assign_to_user_id: string;
    related_to_quote: string;
    quote: string;
    attachment: File;
}

const AddCustomWorkQoute = () => {
    const navigate = useNavigate()
    const [userNames, setUserNames] = useState<any[]>([])

    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue, watch, setError, clearErrors } = useForm<CustomWorkQuoteData>();

    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchDropDown = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.user.list
                });
                console.log("response of drop down : ", response?.data?.data)
                if (response && response.data.data) {
                    const data = response.data.data;
                    const namesAndIds = data.map((item: { user_id: number, name: string }) => ({
                        value: item.user_id,
                        label: item.name
                    }));
                    console.log("namesAndIds", namesAndIds)
                    setOptions(namesAndIds)
                } else {
                    console.log("else")
                }
            } catch (error) {
                console.log("err : ", error)
            }
        }
        fetchDropDown()

    }, [])

    const handleReletedToQoute = (event: any) => {
        setValue("related_to_quote", event.target.checked)
    };
    const onSubmit = async (data: CustomWorkQuoteData) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (typeof value === "boolean") {
                        formData.append(key, value.toString());
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            });

            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.customWorkQoute.add,
                body: formData
            });

            navigate(-1);
            // const userDataResponse = await service.makeAPICall({
            //     methodName: service.Methods.GET,
            //     apiUrl: service.API_URL.user.get,
            // });

        } catch (error) {
            console.error('Error saving notification:', error);
        }
    }

    const handleDropDownChange = (event: any) => {
        setValue("assign_to_user_id", event.target.value.toString());
        trigger("assign_to_user_id")
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Card className='module_wrap'>
                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" className='module_head'>
                        <MDTypography variant="h6" color="white">
                            My Task
                        </MDTypography>
                    </MDBox>
                    <MDBox mt={4}>
                        <MDBox pt={3} ml={3} pb={2}>
                            <Select
                                value={getValues("assign_to_user_id") ? String(getValues("assign_to_user_id")) : ''}
                                placeholder={
                                    "select user"
                                }
                                {...register("assign_to_user_id")}
                                handleChange={handleDropDownChange}
                                options={options}
                            />
                        </MDBox>
                    </MDBox>
                    <MDBox pt={6} pb={3}>
                        <MDBox mx={2} mt={-3} py={3} px={2}>
                            <MDTypography variant="h6">

                                <Checkbox {...register("related_to_quote")} onChange={(e: any) => handleReletedToQoute(e)} /> Is Task Releted to Quote ?
                            </MDTypography>
                        </MDBox>
                        <MDBox py={3} px={2}>
                            <Editor
                                {...register("quote")}
                                apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"
                                onEditorChange={(content, editor) => {
                                    setValue('quote', editor.getContent({ format: 'raw' }));
                                    trigger('quote')
                                }}
                            />
                        </MDBox>
                        <MDBox pt={3} ml={3} pb={2}>
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
                                    UploadFile
                                </MDTypography>

                                <MDFileInput name="attachment" type="image" trigger={trigger} getValues={getValues} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                                {errors.attachment?.message && <ErrorShow error={errors.attachment.message} />}
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
            <MDBox pt={3} ml={3} pb={2} className='action_wrap'>
                <MDButton className='action-button' variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Send Quote</MDButton>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AddCustomWorkQoute

