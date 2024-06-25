import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch, IconButton} from '@mui/material';
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
import SelectComponent from "components/MDSelect";
import { Star, StarBorder } from '@mui/icons-material';
import { requiredMessage } from 'utils/common';
import { Editor } from '@tinymce/tinymce-react';
import MDFileInput from "common/MDFileInput";

interface TestimonailFormProps {
  method: string;
}

interface TestimonialData {
  testimonial_id: number;
  customer_id: number;
  customer_name: string;
  customer_designation: string;
  customer_company: string;
  customer_photo: File;
  description: string;
  rating: number;
  is_active: boolean;
}

const TestimonialForm: React.FC<TestimonailFormProps> = ({ method }) => {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const { register, handleSubmit, getValues, formState: { errors }, setValue, trigger, watch, setError, clearErrors  } = useForm<TestimonialData>();
  const history = useNavigate();
  const [starRating, setStarRating] = useState(0)
  const [customeremail, setCustomerEmail] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<Partial<TestimonialData>>({
  });
 
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await service.makeAPICall({
          methodName: service.Methods.GET,
          apiUrl: service.API_URL.testimonial.view,
          params: id
        });

        const testimonialData: TestimonialData = response?.data.data;
        Object.entries(testimonialData).forEach(([key, value]) => {
          if (key !== 'created_by_user' && key !== 'updated_by_user') {
            setValue(key as keyof TestimonialData, value);
          }
        });
        setStarRating(testimonialData.rating)
        trigger('customer_id');

      } catch (error) {
        console.log(error);
      }
    };

    if (id && method === 'PUT') {
      fetchData();
    }
  }, []);

  const ChangeValue = (event: any, type: keyof TestimonialData) => {
    const selectedValue = event.target.value;
    setValue(type, selectedValue);
    trigger(type); // Manually trigger validation for the changed field
};

  const fetchEmail = async () => {
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.GET,
        apiUrl: service.API_URL.testimonial.email,
      });
      setCustomerEmail(response?.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchEmail();
  }, [])

  const handleSelectedValueChange = (name: string, value: any) => {
    console.log(value);
    setSelectedValues(prevValues => ({
        ...prevValues,
        [name]: value,
    }));

};
//set the value for of ratinf based on seected star
  const handleRatingChange = (value: number): void => {
    setStarRating(value);
    setValue("rating", value);
  };

  const handleToggle = () => {
    setValue('is_active', !getValues('is_active'))
    trigger('is_active');
  }


  const onSubmit = async (testimonialData: TestimonialData) => {
    try {
      const formData = new FormData();
      Object.entries(testimonialData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key !== 'customer_photo') {
              if (typeof value === "boolean") {
                  formData.append(key, value.toString());
              }
              else {
                  formData.append(key, value);
              }
          }
      });
// add the customer photo when data submit
 if (testimonialData.customer_photo) {
      formData.append('customer_photo', testimonialData.customer_photo);
    }
      console.log("check", testimonialData);
      testimonialData.rating = starRating;
      const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
      const url = method === 'POST' ? service.API_URL.testimonial.create : service.API_URL.testimonial.update;
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
                  {method === 'POST' ? 'Add' : 'Update'} {globalMessages.customer_testimonial.testimonial}
                </MDTypography>
              </MDBox>
              <MDBox  mx={2} my={3} mt={-3} py={2} px={0} component="form" role="form">
                <MDBox mb={2} fontSize='medium'>
                  <SelectComponent
                    {...register("customer_id", { required: 'Email is required' })}
                    placeholder="Select Email"
                    options={customeremail.map(customer => ({
                      value: customer.customer_id,
                      label: customer.email
                    }))}
                    handleChange={(event: any) => ChangeValue(event, "customer_id")}
                    value={getValues('customer_id') ? String(getValues('customer_id')) : null}
                  />

                  {errors.customer_id?.message && <ErrorShow error={errors.customer_id?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    my={2}
                    {...register("customer_name", { required: requiredMessage })}
                    InputLabelProps={id && { shrink: watch('customer_name') ? true : false }}
                    label={globalMessages.customer_testimonial.name}
                    fullWidth
                    required
                  />
                  {errors.customer_name?.message && <ErrorShow error={errors.customer_name?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    {...register("customer_company", { required: requiredMessage })}
                    InputLabelProps={id && { shrink: watch('customer_company') ? true : false }}
                    label={globalMessages.customer_testimonial.customer_company}
                    fullWidth
                    multiline
                    required
                  />
                  {errors.customer_company?.message && <ErrorShow error={errors.customer_company?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    {...register("customer_designation", { required: requiredMessage })}
                    InputLabelProps={id && { shrink: watch('customer_designation') ? true : false }}
                    label={globalMessages.customer_testimonial.customer_designaition}
                    fullWidth
                    multiline
                    required
                  />
                  {errors.customer_designation?.message && <ErrorShow error={errors.customer_designation?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography variant="button" fontSize={'0.7em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
                    {globalMessages.customer_testimonial.description}
                  </MDTypography>
                  <Editor
                    apiKey="26gbys1jawyqqnhug3vkrra5acd8f99cijzfpqwsu3ovu157"
                    value={getValues('description')}
                    {...register("description", { required: 'Description is requird' })}
                    init={{
                      height: 200,
                      menubar: false,
                    }}
                    onEditorChange={(newValue, editor) => {
                      setValue('description', editor.getContent({ format: 'raw' }));
                      trigger('description')
                    }}
                  />
                  {errors.description?.message && <ErrorShow error={errors.description?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography mr={2} variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                    Rating
                  </MDTypography>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <IconButton key={value} onClick={() => handleRatingChange(value)}>
                      {value <= starRating ? <Star /> : <StarBorder />}
                    </IconButton>
                  ))}
                  {errors.rating?.message && <ErrorShow error={errors.rating?.message} />}
                </MDBox>
                
                <MDBox mb={2}>
                  <MDTypography mr={2} variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                    Image
                  </MDTypography>
                  <MDFileInput getValues={getValues} name="customer_photo" type="image" trigger={trigger} setValue={setValue} watch={watch} setError={setError} clearErrors={clearErrors} />
                  {errors.customer_photo?.message && <ErrorShow error={errors.customer_photo?.message} />}
                </MDBox>
                <MDBox mb={2}>
                  <MDBox mx={2} display='flex' alignItems='center' mb={2} >
                    <MDTypography mr={2} variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                      {globalMessages.emailmarketing_form.is_Active}
                    </MDTypography>
                    <Switch checked={getValues('is_active')} onClick={handleToggle} {...register("is_active")} />
                  </MDBox>
                  {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                </MDBox>

                <MDBox>
                  <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.cms.save_button_text}
                  </MDButton>
                  <MDButton variant="gradient" color="dark" onClick={() => history(-1)}>
                    {globalMessages.btn_text.back_button_text}
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout >
    </>
  );
};

export default TestimonialForm;

