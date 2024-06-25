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
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";


const AddNotification = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [userNames, setUserNames] = useState<any[]>([]);
    const [notificationData, setNotificationData] = useState<any>({
        notification_for: [],
        message: "",
        mandatory_reply: true,
        remind_later: true
    });
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        setValue('message', "heelloo this is message.")
        trigger()
    }, [])
    const handleCheckboxChange = async (option: string) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.list,
                query: { role_name: option }
            });
            setUserNames(response?.data.data);
        } catch (error) {
            console.error('Error fetching user names:', error);
        }
    };

    const handleChange = (content: string) => {
        const sanitizedContent = content.replace(/<[^>]*>?/gm, '');
        setNotificationData((prevData: any) => ({
            ...prevData,
            message: sanitizedContent
        }));
        setValue('message', sanitizedContent)
    };

    const changeCheckBox = (user_id: any) => {
        setNotificationData((prevData: any) => {
            const updatedNotificationFor = prevData.notification_for.includes(user_id)
                ? prevData.notification_for.filter((id: any) => id !== user_id)
                : [...prevData.notification_for, user_id];

            return {
                ...prevData,
                notification_for: updatedNotificationFor
            };
        });
    };

    const handleMandatoryReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationData((prevData: any) => ({
            ...prevData,
            mandatory_reply: event.target.checked
        }));
    };

    const handleRemindLaterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationData((prevData: any) => ({
            ...prevData,
            remind_later: event.target.checked
        }));
    };

    const onSubmit = async (data: any) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.notification.saveNotification,
                body: notificationData,
            });
            if (response?.data) {
                navigate('/notification')
            }
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                        <MDTypography variant="h6" color="white">
                            Add Notification
                        </MDTypography>
                    </MDBox>
                    <MDBox mt={4}>
                        <MDBox pt={3} ml={3} pb={2}>
                            <Checkbox
                                {...register('xyz', { required: true })}
                                onChange={() => {
                                    handleCheckboxChange('SALES_MANAGER');
                                }}
                            /> Sales Manager

                            <Checkbox
                                {...register('xyz', { required: true })}
                                onChange={() => {
                                    handleCheckboxChange('pm');
                                }}
                            /> PM

                            <Checkbox
                                {...register('xyz', { required: true })}
                                onChange={() => {
                                    handleCheckboxChange('bde');
                                }}
                            /> BDE
                            {errors.xyz &&
                                <ErrorShow error="Please select at least one option" />
                            }
                        </MDBox>
                        <MDBox pt={3} ml={3} pb={2}>
                            {Array.isArray(userNames) && userNames.map(({ user_id, name }) => (
                                <React.Fragment key={user_id}>
                                    <Checkbox
                                        {...register(`user_${user_id}`)} // Remove required: true
                                        checked={notificationData.notification_for.includes(user_id)}
                                        onChange={() => changeCheckBox(user_id)}
                                    /> {name}
                                </React.Fragment>
                            ))}
                        </MDBox>
                    </MDBox>
                    <MDBox pt={6} pb={3}>
                        <MDBox mx={2} mt={-3} py={3} px={2}>
                            <MDTypography >
                                Notification
                            </MDTypography>
                        </MDBox>
                        <MDBox py={3} px={2}>
                            <Editor
                                apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"
                                onEditorChange={(content, editor) => handleChange(content)}
                                {...register("message", { required: "Message is required." })}
                            />
                            {errors.message && <ErrorShow error="Message is req" />}

                        </MDBox>
                        <MDBox pt={3} ml={3} pb={2}>
                            <MDTypography>
                                Is Reply Mandatory?
                            </MDTypography>
                            <Checkbox
                                {...register('mandatory_reply')}
                                name="mandatory_reply"
                                onChange={handleMandatoryReplyChange} // Call handleMandatoryReplyChange on change
                            />Yes
                            <Checkbox
                                {...register('mandatory_reply')} // Set value to false when unchecked
                                name="mandatory_reply"
                                onChange={handleMandatoryReplyChange}
                            />No
                            {errors.mandatory_reply && <ErrorShow error="This field is required" />}
                            <MDTypography>
                                Can Put on Remind Later?
                            </MDTypography>
                            <Checkbox
                                {...register('remind_later')}
                                name="remind_later"
                                onChange={handleRemindLaterChange}
                            />Yes
                            <Checkbox
                                {...register('remind_later')}
                                name="remind_later"
                                onChange={handleRemindLaterChange}
                            />No
                            {errors.remind_later && <ErrorShow error="This field is required" />}
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
            <MDBox pt={3} ml={3} pb={2}>
                <MDButton variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Send Notification</MDButton>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default AddNotification;
