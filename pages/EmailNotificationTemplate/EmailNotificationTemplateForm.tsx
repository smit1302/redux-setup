import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import ErrorShow from "common/ErrorShow";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import { requiredMessage, validateActive, validateEmail } from "utils/common";
import globalMessages from "utils/global";

// Define the interface for the props of email notification template form component
interface EmailNotificationFormProps {
    method: string;
}

// Define custom type
type nullString = undefined | string;

// Define the interface for the email notification template data
interface EmailData {
    organization_id: number;
    template_title: string;
    primary_template: string;
    is_active: string;
    from_email: string;
    from_name: string;
    reply_email: string;
    reply_name: string;
    send_to_admin: boolean;
    send_to_team: boolean;
    send_to_supervisor: boolean;
    send_to_bde: boolean;
    send_to_pm: boolean;
    send_to_customer: boolean;
    admin?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
    team?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
    supervisor?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
    bde?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
    pm?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
    customer?: {
        email_type: nullString;
        email_subject: nullString;
        email_description: nullString;
    };
}

const EmailNotificationForm: React.FC<EmailNotificationFormProps> = ({ method }) => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { id } = useParams();
    const { register, handleSubmit, unregister, getValues, formState: { errors }, setValue, trigger, watch } = useForm<EmailData>();
    const history = useNavigate();
    const options = [
        { value: 'to', label: 'To' },
        { value: 'cc', label: 'CC' },
        { value: 'bcc', label: 'BCC' },
    ]

    // dropdown options for email templates
    const templates = [
        { value: 'admin', label: 'Admin' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'team', label: 'Team' },
        { value: 'pm', label: 'PM' },
        { value: 'bde', label: 'BDE' },
        { value: 'customer', label: 'Customer' }
    ]

    // function to fetch email notification template data for update
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.emailNotification.get,
                params: id,
            });
            // set default values of react hook form
            const emailData: EmailData = response?.data.data;

            // Set form values using setValue
            Object.entries(emailData).forEach(([key, value]) => {
                setValue(key as keyof EmailData, value);
            });

            setValue("is_active", String(getValues('is_active')))
            trigger('primary_template');
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect hook to fetch data for update
    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    // function to handle submit 
    const onSubmit = async (data: EmailData) => {
        data.organization_id = 1;
        console.log(data);
        try {
            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.emailNotification.create : service.API_URL.emailNotification.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? "",
                body: { ...data, is_active: data.is_active === 'true' },
                showAlert: true,
            });
            history(-1);
        } catch (error) {
            console.log(error);
        }
    }

    // function to handle toggle switch
    const handleSwitch = (user: keyof EmailData) => {
        setValue(`send_to_${user}` as keyof EmailData, !getValues(`send_to_${user}` as keyof EmailData));
        if (!getValues(`send_to_${user}` as keyof EmailData)) {
            unregister(`${user}`);
        }
        trigger(`send_to_${user}` as keyof EmailData);
    }

    // function to handle select template change
    const handleSelectTemplate = (event: any) => {
        const currentTemplate = getValues('primary_template');
        const subject = getValues(`${currentTemplate}.email_subject` as keyof EmailData);
        const body = getValues(`${currentTemplate}.email_description` as keyof EmailData);
        if (currentTemplate && !subject && !body) {
            handleSwitch(currentTemplate as keyof EmailData);
        }

        setValue('primary_template', event.target.value);
        const sendTo = `send_to_${event.target.value}` as keyof EmailData;
        setValue(sendTo, true)

        const userEmailType = `${event.target.value}.email_type` as keyof EmailData;
        setValue(userEmailType, 'to');
        setValue(`${event.target.value}.email_description` as keyof EmailData, 'Example email description');
        trigger(event.target.value as keyof EmailData)
    }

    // function to handle is active
    const handleToggle = (event: any) => {
        setValue('is_active', event.target.value)
        trigger('is_active');
    }

    // function to handle select email type for particular user
    const handleSelect = (event: any, user: string) => {
        const userEmailType = `${user}.email_type` as keyof EmailData;
        setValue(userEmailType, event.target.value);
        if (event.target.value === 'to') {
            setValue(`${user}.email_description` as keyof EmailData, 'Example Email Body');
        }
        trigger(userEmailType);
    }

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
                                    {globalMessages.email_notification.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox mt={3} component="form" role="form" className='form_ps'>
                                <MDBox mb={2} className='form_control'>
                                    <MDInput my={2} {...register("template_title", { required: requiredMessage })} InputLabelProps={id && getValues("template_title") && { shrink: watch('template_title') ? true : false }} label={globalMessages.email_notification.template_title_label} fullWidth required />
                                    {errors.template_title?.message && <ErrorShow error={errors.template_title?.message} />}
                                </MDBox>
                                <MDBox mb={2} className='form_control' fontSize={'medium'}>
                                    <MDSelect placeholder="Select Primary Template" value={getValues('primary_template') ? String(getValues('primary_template')): null} {...register('template_title', { required: requiredMessage })} options={templates} handleChange={handleSelectTemplate} />
                                </MDBox>
                                <MDBox mb={2} className='form_control'>
                                    <MDInput my={2} {...register("from_email", { required: requiredMessage, validate: validateEmail })} InputLabelProps={id && getValues("from_email") && { shrink: watch('from_email') ? true : false }} label={globalMessages.email_notification.from_email_label} fullWidth required />
                                    {errors.from_email?.message && <ErrorShow error={errors.from_email?.message} />}
                                </MDBox>
                                <MDBox mb={2} className='form_control'>
                                    <MDInput my={2} {...register("from_name", { required: requiredMessage })} InputLabelProps={id && getValues("from_name") && { shrink: watch('from_name') ? true : false }} label={globalMessages.email_notification.from_name_label} fullWidth required />
                                    {errors.from_name?.message && <ErrorShow error={errors.from_name?.message} />}
                                </MDBox>
                                <MDBox mb={2} className='form_control'>
                                    <MDInput my={2} {...register("reply_email", { required: requiredMessage, validate: validateEmail })} label={globalMessages.email_notification.reply_email_label} InputLabelProps={id && getValues("reply_email") && { shrink: watch('reply_email') ? true : false }} fullWidth required />
                                    {errors.reply_email?.message && <ErrorShow error={errors.reply_email?.message} />}
                                </MDBox>
                                <MDBox className='form_control' mx={1} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} mr={1} fontWeight="regular" color="text">
                                        {globalMessages.email_notification.is_active_label}
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
                                <MDBox mx={2} className='form_control' display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_admin_email}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'admin'} checked={getValues('send_to_admin')} {...register("send_to_admin")} onClick={() => handleSwitch('admin')} />
                                </MDBox>
                                {getValues('send_to_admin') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type" value={getValues('admin.email_type')} {...register('admin.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'admin'} options={options} handleChange={(event) => handleSelect(event, 'admin')} />
                                    </MDBox> : <></>
                                }
                                {getValues('admin.email_type') === 'to' ?
                                    <>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDInput my={2} {...register("admin.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues("admin.email_subject") && { shrink: watch('admin.email_subject') ? true : false }} label={globalMessages.email_notification.admin_subject_label} fullWidth required />
                                            {errors.admin?.email_subject?.message && <ErrorShow error={errors.admin.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.admin_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('admin.email_description')}
                                                {...register("admin.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('admin.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('admin.email_description')
                                                }}
                                            />
                                            {errors.admin?.email_description?.message && <ErrorShow error={errors.admin.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox className='form_control' mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_supervisor_email}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'supervisor'} checked={getValues('send_to_supervisor')}  {...register("send_to_supervisor")} onClick={() => handleSwitch('supervisor')} />
                                </MDBox>
                                {getValues('send_to_supervisor') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type" value={getValues('supervisor.email_type')} {...register('supervisor.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'supervisor'} options={options} handleChange={(event) => handleSelect(event, 'supervisor')} />
                                    </MDBox> : <></>
                                }
                                {getValues('supervisor.email_type') === 'to' ?
                                    <>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDInput my={2} {...register("supervisor.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues("supervisor.email_subject") && { shrink: watch('supervisor.email_subject') ? true : false }} label={globalMessages.email_notification.supervisor_subject_label} fullWidth required />
                                            {errors.supervisor?.email_subject?.message && <ErrorShow error={errors.supervisor.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.supervisor_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('supervisor.email_description')}
                                                {...register("supervisor.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('supervisor.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('supervisor.email_description')
                                                }}
                                            />
                                            {errors.supervisor?.email_description?.message && <ErrorShow error={errors.supervisor.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox className='form_control' mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_team_email}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'team'} checked={getValues('send_to_team')} {...register("send_to_team")} onClick={() => handleSwitch('team')} />
                                </MDBox>
                                {getValues('send_to_team') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type" value={getValues('team.email_type')} {...register('team.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'team'} options={options} handleChange={(event) => handleSelect(event, 'team')} />
                                    </MDBox> : <></>
                                }
                                {getValues('team.email_type') === 'to' ?
                                    <>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDInput my={2} {...register("team.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues("team.email_subject") && { shrink: watch('team.email_subject') ? true : false }} label={globalMessages.email_notification.team_subject_label} fullWidth required />
                                            {errors.team?.email_subject?.message && <ErrorShow error={errors.team?.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox mt={2} mb={2} className='form_control'>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.team_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('team.email_description')}
                                                {...register("team.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('team.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('team.email_description')
                                                }}
                                            />
                                            {errors.team?.email_description?.message && <ErrorShow error={errors.team.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_bde_email}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'bde'} checked={getValues('send_to_bde')} {...register("send_to_bde")} onClick={() => handleSwitch('bde')} />
                                </MDBox>
                                {getValues('send_to_bde') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type" value={getValues('bde.email_type')} {...register('bde.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'bde'} options={options} handleChange={(event) => handleSelect(event, 'bde')} />
                                    </MDBox> : <></>
                                }
                                {getValues('bde.email_type') === 'to' ?
                                    <>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDInput my={2} {...register("bde.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues("bde.email_subject") && { shrink: watch('bde.email_subject') ? true : false }} label={globalMessages.email_notification.bde_subject_label} fullWidth required />
                                            {errors.bde?.email_subject?.message && <ErrorShow error={errors.bde.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.bde_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('bde.email_description')}
                                                {...register("bde.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('bde.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('bde.email_description')
                                                }}
                                            />
                                            {errors.bde?.email_description?.message && <ErrorShow error={errors.bde.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_pm_email}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'pm'} checked={getValues('send_to_pm')} {...register("send_to_pm")} onClick={() => handleSwitch('pm')} />
                                </MDBox>
                                {getValues('send_to_pm') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type"  value={getValues('pm.email_type')} {...register('pm.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'pm'} options={options} handleChange={(event) => handleSelect(event, 'pm')} />
                                    </MDBox> : <></>
                                }
                                {getValues('pm.email_type') === 'to' ?
                                    <>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDInput my={2} {...register("pm.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues("pm.email_subject") && { shrink: watch('pm.email_subject') ? true : false }} label={globalMessages.email_notification.pm_subject_label} fullWidth required />
                                            {errors.pm?.email_subject?.message && <ErrorShow error={errors.pm.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.team_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('pm.email_description')}
                                                {...register("pm.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('pm.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('pm.email_description')
                                                }}
                                            />
                                            {errors.pm?.email_description?.message && <ErrorShow error={errors.pm.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                                    <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        {globalMessages.email_notification.send_customer_label}
                                    </MDTypography>
                                    <Switch disabled={getValues('primary_template') === 'customer'} checked={getValues('send_to_customer')} {...register("send_to_customer")} onClick={() => handleSwitch('customer')} />
                                </MDBox>
                                {getValues('send_to_customer') ?
                                    <MDBox fontSize={'medium'}>
                                        <MDSelect placeholder="Select Email Type" value={getValues('customer.email_type')} {...register('customer.email_type', { required: requiredMessage })} disabled={getValues('primary_template') === 'customer'} options={options} handleChange={(event) => handleSelect(event, 'customer')} />
                                    </MDBox> : <></>
                                }
                                {getValues('customer.email_type') === 'to' ?
                                    <>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDInput my={2} {...register("customer.email_subject", { required: requiredMessage })} InputLabelProps={id && getValues('customer.email_subject') && { shrink: watch('customer.email_subject') ? true : false }} label={globalMessages.email_notification.customer_subject_label} fullWidth required />
                                            {errors.customer?.email_subject?.message && <ErrorShow error={errors.customer?.email_subject?.message} />}
                                        </MDBox>
                                        <MDBox className='form_control' mt={2} mb={2}>
                                            <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                                                {globalMessages.email_notification.customer_body_label}
                                            </MDTypography>
                                            <Editor
                                                apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                                                value={getValues('customer.email_description')}
                                                {...register("customer.email_description", { required: requiredMessage })}
                                                init={{
                                                    height: 200,
                                                    menubar: false,
                                                }}
                                                onEditorChange={(newValue, editor) => {
                                                    setValue('customer.email_description', editor.getContent({ format: 'raw' }));
                                                    trigger('customer.email_description')
                                                }}
                                            />
                                            {errors.customer?.email_description?.message && <ErrorShow error={errors.customer?.email_description?.message} />}
                                        </MDBox>
                                    </> : <></>
                                }
                                <MDBox className='action_wrap d_flex'>
                                    <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                        {method === 'POST' ? 'Add' : 'Update'} {globalMessages.email_notification.save_button_text}
                                    </MDButton>
                                    <MDButton variant="gradient" color="error" onClick={() => history(-1)} >
                                        {globalMessages.btn_text.cancel_button_text}
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    )

}

export default EmailNotificationForm;