import React, { useState, ChangeEvent } from 'react';
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import globalMessages from "utils/global";
import MDButton from "components/MDButton";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { requiredMessage } from 'utils/common';
import ErrorShow from 'common/ErrorShow';
import MDFileInput from 'common/MDFileInput';
import { service } from 'utils/Service/service';
import { useMaterialUIController } from 'context';

interface AttachmentProps {
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    uploadDate?: string;
    remarks: string;
    file: File;

}

const AddAttachment = () => {
    const dispatchData = useDispatch();
    const global = globalMessages.add_attachment;
    const global_btn = globalMessages.btn_text;
    const [file, setFile] = useState<File | null>(null);
    const [remarks, setRemarks] = useState<string>('');
    const history = useNavigate();
    const customerId = useSelector((state: any) => state?.commonData.commonData?.customer_id);
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue, watch, setError, clearErrors } = useForm<AttachmentProps>();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }

    const handleRemarksChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
    }

    const onSubmit = async (data: AttachmentProps) => {
        const formData = new FormData();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        formData.append('uploadDate', formattedDate.toString());

        formData.append('customerId', customerId.toString()) // Assuming customer ID is fixed for now
        formData.append('fileName', data.file.name);
        formData.append('fileType', data.file.type);
        formData.append('fileSize', data.file.size.toString()); // Assuming file size is fixed for now
        formData.append('remarks', data.remarks);
        formData.append('file', data.file);

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.customerDocument.create,
                body: formData
            })

            // Add further logic as needed
        } catch (error) {
            console.log(error)
        }
    }

    const handleGoBack = () => {
        dispatchData(addData({ key: "value", data: 2 }));
        history(`/my-customer`);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Card style={{ padding: "20px" }} className='module_wrap'>
                    <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                        <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                            {global.title}
                        </MDTypography>
                    </MDBox>
                    <Grid item xs={12} md={3} lg={3}>
                        <MDBox mx={2} py={3} px={2}>
                            <MDFileInput getValues={getValues} name="file" type="all" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                            {errors?.file?.message && <ErrorShow error={errors?.file?.message} />}
                        </MDBox>
                        <MDBox mx={2} py={3} px={2}>
                            <MDInput label={global.remark_label} {...register("remarks", { required: requiredMessage })} multiline rows={5} fullWidth onChange={handleRemarksChange} />
                            {errors.remarks?.message && <ErrorShow error={errors.remarks?.message} />}
                        </MDBox>
                    </Grid>
                    <MDBox pt={3} ml={3} pb={2} >
                        <div className="action_wrap d_flex">
                            <MDButton className="action-button" variant="gradient" color="info" onClick={handleSubmit(onSubmit)}> {global_btn.save_button_text}</MDButton>
                            <MDButton variant="gradient" color="dark" onClick={handleGoBack} style={{ marginLeft: '10px' }}>Go Back</MDButton>
                        </div>
                    </MDBox>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AddAttachment;
