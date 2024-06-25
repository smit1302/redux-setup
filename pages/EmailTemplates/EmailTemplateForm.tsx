import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
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
import { Editor } from "@tinymce/tinymce-react";
import MDFileInput from "common/MDFileInput";

interface EmailTemplateFormProps {
	method: string;
}

interface EmailData {
	email_marketing_id: number;
	organization_id: number;
	title: string;
	subject: string;
	email_message: string;
	type_of_use: string;
	content_type: string;
	attachment: File ;
	is_active: boolean;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({ method }) => {
	const [controller, dispatch] = useMaterialUIController();
	const { sidenavColor } = controller;
	const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue ,watch,setError,clearErrors} = useForm<EmailData>();
	const history = useNavigate();
	const [selectedTypeOfUse, setSelectedTypeOfUse] = useState('');
	const [selectedContentType, setSelectedContentType] = useState('');
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await service.makeAPICall({
					methodName: service.Methods.GET,
					apiUrl: service.API_URL.email_marketing.View,
					params: id,
				});
				const emailData: EmailData = response?.data.data;

				Object.entries(emailData).forEach(([key, value]) => {
					setValue(key as keyof EmailData, value);
				});
				//set the value of dropdown type of use and content type
				setValue("type_of_use", emailData.type_of_use);
				setSelectedTypeOfUse(emailData.type_of_use);
				setValue("content_type", emailData.content_type);
				setSelectedContentType(emailData.content_type);
				trigger();
			} catch (error) {
				console.log(error);
			}
		};
		if (id && method === 'PUT') {
			fetchData();
		}
	}, [id, method, setValue]);


	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		console.log('Selected file:', selectedFile);
	};
	const handleToggle = () => {
		setValue('is_active', !getValues('is_active'))
	}

	const onSubmit = async (emailData: EmailData) => {
		try {
			const updatedEmailData = {
				...emailData,
			};
			const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
			const url = method === 'POST' ? service.API_URL.email_marketing.add : service.API_URL.email_marketing.update;
			const formData = new FormData();

            Object.entries(updatedEmailData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (typeof value === "boolean" || typeof value === "number") {
                        formData.append(key, value.toString());
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            });

			await service.makeAPICall({
				methodName: apiMethod,
				apiUrl: url,
				params: id ?? '',
				body: formData,
				options: {
					headers: {
						'Accept': '*',
						'content-type': 'multipart/form-data',
					}
				}
			});
			history(-1)
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
						<Grid item xs={15}>
							<MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
								<MDTypography variant="h6" color="white">
									{method === 'POST' ? 'Add' : 'Update'} {globalMessages.emailmarketing_form.email}
								</MDTypography>
							</MDBox>
							<MDBox mx={2} my={3} mt={-3} py={2} px={0} component="form" role="form">
								<Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>

									<Grid item xs={12}>
										<MDInput
											my={2}
											{...register("title", { required: 'Template title is required' })}
											label={globalMessages.emailmarketing_form.title}
											fullWidth
											required
											InputLabelProps={id && { shrink: watch('title') ? true : false }}
										/>
										{errors.title?.message && <ErrorShow error={errors.title?.message} />}
									</Grid>
									<Grid item xs={12}>
										<MDInput
											my={2}
											{...register("subject", { required: 'Email subject is required' })}
											label={globalMessages.emailmarketing_form.subject}
											fullWidth
											required
											InputLabelProps={id && { shrink: watch('subject') ? true : false }}
										/>
										{errors.subject?.message && <ErrorShow error={errors.subject?.message} />}
									</Grid>
									<Grid item xs={12}>
										<MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
											{globalMessages.emailmarketing_form.message}
										</MDTypography>
										<Editor
											apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
											value={getValues('email_message')}
											{...register("email_message", { required: 'Email message is requird' })}
										// set the height of editor as per Page layout
											init={{
												height: 200,
												menubar: false,
											}}
											onEditorChange={(newValue, editor) => {
												setValue('email_message', editor.getContent({ format: 'raw' }));
												trigger('email_message')
											}}
										/>
										{errors.email_message?.message && <ErrorShow error={errors.email_message?.message} />}
									</Grid>
								</Grid>
								<Grid container spacing={2} alignItems="center" style={{ marginBottom: '2px' }}>
									<Grid item xs={2}>
											<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
											{globalMessages.emailmarketing_form.type_of_use}
											</MDTypography>
									</Grid>
									<Grid item xs={9}>
										<MDBox mb={2}>
											<FormControl component="fieldset">
												<RadioGroup
													row
													value={selectedTypeOfUse}
													
													onChange={(e) => {
														setValue("type_of_use", e.target.value);
														setSelectedTypeOfUse(e.target.value);
														
													}}
												>
													<FormControlLabel
														value="Manual"
														control={<Radio />}
														label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Manual</MDTypography>}
													/>
													<FormControlLabel
														value="Auto"
														control={<Radio />}
														label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Auto</MDTypography>}
													/>
												</RadioGroup>
											</FormControl>
											{errors.type_of_use?.message && <ErrorShow error={errors.type_of_use?.message} />}
										</MDBox>
									</Grid>
								</Grid>
								<Grid container spacing={2} alignItems="center" style={{ marginBottom: '5px' }}>
									<Grid item xs={2}>
									<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
											{globalMessages.emailmarketing_form.content_type}
											</MDTypography>
									</Grid>
									<Grid item xs={9}>
										<MDBox mb={2}>
											<FormControl component="fieldset">
												<RadioGroup
													row
													value={selectedContentType}
													onChange={(e) => {
														setValue("content_type", e.target.value);
														setSelectedContentType(e.target.value);
													}}
												>
													<FormControlLabel
														value="Textbase"
														control={<Radio />}
														label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>TextBase</MDTypography>}
													/>
													<FormControlLabel
														value="Graphics"
														control={<Radio />}
														label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Graphics</MDTypography>}
													/>
												</RadioGroup>

											</FormControl>
											{errors.content_type?.message && <ErrorShow error={errors.content_type?.message} />}
										</MDBox>
									</Grid>
								</Grid>
								<Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
									<Grid item xs={2}>
									<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
											{globalMessages.emailmarketing_form.attechment}
											</MDTypography>
									</Grid>

									<Grid item xs={9}>
										<MDBox mb={2}>
											<MDFileInput getValues={getValues} name="attachment" type="pdf" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
											{errors.attachment?.message && <ErrorShow error={errors.attachment?.message} />}

										</MDBox>
									</Grid>
								</Grid>
								<Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
									<Grid item xs={9}>
										<MDBox display='flex' alignItems='center' mb={2}>
											<MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
												{globalMessages.emailmarketing_form.is_Active}
											</MDTypography>
											<Switch checked={getValues('is_active')} onClick={handleToggle} {...register("is_active") } />
										</MDBox>
										{errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
									</Grid>
								</Grid>
								<MDBox>
									<MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
										{method === 'POST' ? 'Add' : 'Update'} {globalMessages.emailmarketing_form.save_button_text}
									</MDButton>
									<MDButton variant="gradient" color="dark" onClick={() => history(-1)}>
										{globalMessages.btn_text.back_button_text}
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

export default EmailTemplateForm;

