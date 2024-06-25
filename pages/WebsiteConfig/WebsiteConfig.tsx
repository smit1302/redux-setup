import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';
import MDInput from "components/MDInput";
import './style.css'
import Card from "@mui/material/Card";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import ErrorShow from "common/ErrorShow";
import Select from "common/Select";
import SelectComponent from "components/MDSelect";

interface FormData {
    lead_auto_assign_user_id: number;
    contact_us_assign_user_id: number;
    lead_manage_by_user_id: number;
    auto_mail_reply_user_id: number;
    auto_mail_admin_user_id: number;
    auto_mail_ss_user_id: number;
    web_inquiry_lead_product_id: number;
    automail_reply_email: string;
    automail_admin_user_email: string;
    automail_ss_email: string;
    email1: string;
    email2: string;
    phone1: string;
    phone2: string;
    facebook_link: string;
    twitter_link: string;
    linkedin_link: string;
    instagram_link: string;
    pintrest_link: string;
    youtube_link: string;
    skype_link: string;
}
const UserSeting = () => {
    const [organizationId, setOrganizationId] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [options, setOptions] = useState<any[]>([]);
    const navigate = useNavigate()
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

    useEffect(() => {
        fetchData();
    }, [])

    const [formData, setFormData] = useState<FormData | null>({
        lead_auto_assign_user_id: 0,
        contact_us_assign_user_id: 0,
        lead_manage_by_user_id: 0,
        auto_mail_reply_user_id: 0,
        auto_mail_admin_user_id: 0,
        auto_mail_ss_user_id: 0,
        web_inquiry_lead_product_id: 0,
        automail_reply_email: '',
        automail_admin_user_email: '',
        automail_ss_email: '',
        email1: '',
        email2: '',
        phone1: '',
        phone2: '',
        facebook_link: '',
        twitter_link: '',
        linkedin_link: '',
        instagram_link: '',
        pintrest_link: '',
        youtube_link: '',
        skype_link: '',
    })
    const fetchData = async () => {
        try {
            const userDataResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.get,
            });

            setOrganizationId(userDataResponse?.data.data?.organization_id);
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        // Define the IDs that should be parsed to numbers
        const numericIds: Set<string> = new Set([
            'lead_auto_assign_user_id',
            'contact_us_assign_user_id',
            'lead_manage_by_user_id',
            'auto_mail_reply_user_id',
            'auto_mail_admin_user_id',
            'auto_mail_ss_user_id',
            'web_inquiry_lead_product_id',
        ]);

        setFormData((prevFormData) => {
            if (prevFormData === null) return null;

            const updatedValue = numericIds.has(id) ? parseInt(value, 10) : value;

            return {
                ...prevFormData, // Preserve existing form data
                [id]: updatedValue,
                organization_id: organizationId,
            };
        });
    };

    const handleUpdate = async () => {
        console.log("daat to send : ", JSON.stringify(formData))
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.webConfig.companyConfig,
                body: formData
            });
            console.log('Form submitted successfully:', response);
            if (response?.status === 201) {
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }

    }

    const handleDropDownChange = (event: any, fieldName: string) => {
        const selectedUserId = event.value;

        setFormData(prevFormData => {
            if (prevFormData === null) return null;

            return {
                ...prevFormData,
                [fieldName]: selectedUserId
            };
        });
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <MDBox position="relative" mb={5}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }: any) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                <Card
                    sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <MDBox height="100%" mt={0.5} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    User Setting
                                </MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>


                    <MDBox mt={5} mb={3}>
                        <Grid container spacing={2} className="grid InputWithMargin align_top">
                            <Grid item px={2} xs={12} md={6} xl={5}>
                                <SelectComponent
                                    placeholder="Lead Auto Assign User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'lead_auto_assign_user_id')}
                                    options={options}
                                />
                                {/* <MDInput type="text" label="Lead Auto Assign User ID" id="lead_auto_assign_user_id"  {...register("lead_auto_assign_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                <SelectComponent
                                    placeholder="Lead Auto Assign User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'contact_us_assign_user_id')}
                                    options={options}
                                />
                                {/* {errors.lead_auto_assign_user_id && <ErrorShow error="Lead Auto Assign User ID is required" />} */}
                                {/* <MDInput type="text" label="Contact Us Assign User ID" id="contact_us_assign_user_id" {...register("contact_us_assign_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.contact_us_assign_user_id && <ErrorShow error="Contact Us Assign User ID is required" />}
                                <SelectComponent
                                    placeholder="Lead Manage By User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'lead_manage_by_user_id')}
                                    options={options}
                                />
                                {/* <MDInput type="text" label="Lead Manage By User ID" id="lead_manage_by_user_id" {...register("lead_manage_by_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.lead_manage_by_user_id && <ErrorShow error="Lead Manage By User ID is required" />}
                                <SelectComponent
                                    placeholder="Auto Mail Reply User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'auto_mail_reply_user_id')}
                                    options={options}
                                />
                                {/* <MDInput type="text" label="Auto Mail Reply User ID" id="auto_mail_reply_user_id" {...register("auto_mail_reply_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.auto_mail_reply_user_id && <ErrorShow error="Auto Mail Reply User ID is required" />}
                                <SelectComponent
                                    placeholder="Auto Mail Admin User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'auto_mail_admin_user_id')}
                                    options={options}
                                />
                                {/* <MDInput type="text" label="Auto Mail Admin User ID" id="auto_mail_admin_user_id" {...register("auto_mail_admin_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.auto_mail_admin_user_id && <ErrorShow error="Auto Mail Admin User ID is required" />}
                                <SelectComponent
                                    placeholder="Auto Mail SS User ID"
                                    handleChange={(event) => handleDropDownChange(event, 'auto_mail_ss_user_id')}
                                    options={options}
                                />
                                {/* <MDInput type="text" label="Auto Mail SS User ID" id="auto_mail_ss_user_id"  {...register("auto_mail_ss_user_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.auto_mail_ss_user_id && <ErrorShow error="Auto Mail SS User ID is required" />}
                                <SelectComponent
                                    placeholder="Web Inquiry Lead Product ID"
                                    handleChange={(event) => handleDropDownChange(event, 'web_inquiry_lead_product_id')}
                                    options={options}
                                />

                                {/* <MDInput type="text" label="Web Inquiry Lead Product ID" id="web_inquiry_lead_product_id" {...register("web_inquiry_lead_product_id", { required: true })} onChange={handleChange} fullWidth /> */}
                                {errors.web_inquiry_lead_product_id && <ErrorShow error="Web Inquiry Lead Product ID is required" />}
                                <MDInput type="text" label="Auto Mail Reply Email" id="automail_reply_email" {...register("automail_reply_email", { required: true })} onChange={handleChange} fullWidth />
                                {errors.automail_reply_email && <ErrorShow error="Auto Mail Reply Email is required" />}
                                <MDInput type="text" label="Auto Mail Admin User Email" id="automail_admin_user_email" {...register("automail_admin_user_email", { required: true })} onChange={handleChange} fullWidth />
                                {errors.automail_admin_user_email && <ErrorShow error="Auto Mail Admin User Email is required" />}
                                <MDInput type="text" label="Auto Mail SS Email" id="automail_ss_email" {...register("automail_ss_email", { required: true })} onChange={handleChange} fullWidth />
                                {errors.automail_ss_email && <ErrorShow error="Auto Mail SS Email is required" />}
                                <MDInput type="text" label="Email 1" id="email1" {...register("email1", { required: true })} onChange={handleChange} fullWidth />
                                {errors.email1 && <ErrorShow error="Email 1 is required" />}
                            </Grid>
                            <Grid item xs={12} md={6} xl={5}>
                                <MDInput type="text" label="Email 2" id="email2" {...register("email2", { required: true })} onChange={handleChange} fullWidth />
                                {errors.email2 && <ErrorShow error="Email 2 is required" />}
                                <MDInput type="text" label="Phone 1" id="phone1" {...register("phone1", { required: true })} onChange={handleChange} fullWidth />
                                {errors.phone1 && <ErrorShow error="Phone 1 is required" />}
                                <MDInput type="text" label="Phone 2" id="phone2" {...register("phone2", { required: true })} onChange={handleChange} fullWidth />
                                {errors.phone2 && <ErrorShow error="Phone 2 is required" />}
                                <MDInput type="text" label="Facebook Link" id="facebook_link" {...register("facebook_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.facebook_link && <ErrorShow error="Facebook Link is required" />}
                                <MDInput type="text" label="Twitter Link" id="twitter_link" {...register("twitter_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.twitter_link && <ErrorShow error="Twitter Link is required" />}
                                <MDInput type="text" label="LinkedIn Link" id="linkedin_link" {...register("linkedin_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.linkedin_link && <ErrorShow error="LinkedIn Link is required" />}
                                <MDInput type="text" label="Instagram Link" id="instagram_link" {...register("instagram_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.instagram_link && <ErrorShow error="Instagram Link is required" />}
                                <MDInput type="text" label="Pinterest Link" id="pintrest_link" {...register("pintrest_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.pintrest_link && <ErrorShow error="Pinterest Link is required" />}
                                <MDInput type="text" label="YouTube Link" id="youtube_link" {...register("youtube_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.youtube_link && <ErrorShow error="YouTube Link is required" />}
                                <MDInput type="text" label="Skype Link" id="skype_link" {...register("skype_link", { required: true })} onChange={handleChange} fullWidth />
                                {errors.skype_link && <ErrorShow error="Skype Link is required" />}
                            </Grid>
                        </Grid>
                        <MDBox pt={3} ml={3} pb={2} className='action_wrap d_flex center'>
                            <MDButton className='action-button' variant="gradient" color="info" onClick={handleSubmit(handleUpdate)}>Add</MDButton>
                            <MDButton className='button grey' variant="gradient" color="dark" onClick={() => navigate("/dasbord")} style={{ marginLeft: '10px' }}>Cancel</MDButton>
                        </MDBox>

                    </MDBox>

                </Card>
            </MDBox>

            <Footer />
        </DashboardLayout>
    );
}

export default UserSeting;
