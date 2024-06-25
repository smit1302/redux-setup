import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch, IconButton } from '@mui/material';
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

interface FeedbackFormProps {
  method: string;
}

interface FeedbackData {
  customer_id: number;
  feedback_for: string;
  feedback_for_id: number;
  comment: string;
  rating: number;
  record_type: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ method }) => {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const { register, handleSubmit, getValues, formState: { errors }, setValue, trigger } = useForm<FeedbackData>();
  const history = useNavigate();
  const [recordType, setRecordType] = useState<any[]>([]);
  const [feedbackfor, setFeedbackFor] = useState<any[]>([]);
  const [SelectFeedBackFor, setSelectFeedBackFor] = useState<any[]>([]);


  const [starRating, setStarRating] = useState(0)
  const [customeremail, setCustomerEmail] = useState<any[]>([]);
  const [feedbackForValue, setfeedbacFormValue] = useState(false);
  const { id } = useParams();
  const [Feedbacklabel, setFeedbacklabel] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await service.makeAPICall({
          methodName: service.Methods.GET,
          apiUrl: service.API_URL.testimonial.view,
          params: id
        });

        const feedbackData: FeedbackData = response?.data.data;
        Object.entries(feedbackData).forEach(([key, value]) => {
          if (key !== 'created_by_user' && key !== 'updated_by_user') {
            setValue(key as keyof FeedbackData, value);
          }
        });
        setStarRating(feedbackData.rating)
        trigger();

      } catch (error) {
        console.log(error);
      }
    };

    if (id && method === 'PUT') {
      fetchData();
    }
  }, []);

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


  const handleUserChange = async (options: string, ) => {
    try {
      console.log("check",options)
      const response = await service.makeAPICall({
        methodName: service.Methods.GET,
        apiUrl: service.API_URL.user.list,
        query: { role_name: options }
      });
      setSelectFeedBackFor(response?.data.data);
      setFeedbacklabel('Select ' + options)
      setfeedbacFormValue(true);
      setValue("feedback_for",options)
    } catch (err) {
      console.error("Error fetching data:", err);
    }

  }



  useEffect(() => {
    const fetchFeedbackFor = async () => {
      try {
        const response: any = await service.makeAPICall({
          methodName: service.Methods.GET,
          apiUrl: service.API_URL.masterSelect.get,
        });
        setFeedbackFor(response.data.data.feedback_for);
        setRecordType(response.data.data.record_type);

      } catch (error) {
        console.log(error);
      }
    };
    fetchFeedbackFor();
  }, []);

  const handleRatingChange = (value: number): void => {
    setStarRating(value);
    setValue("rating", value);
  };

  const ChangeValue = (event: any, type: keyof FeedbackData) => {
    const selectedValue = event.target.value;
    setValue(type, selectedValue);
    trigger(type); // Manually trigger validation for the changed field
};


  const onSubmit = async (feedbackData: FeedbackData) => {
    try {
      feedbackData.rating = starRating;
      const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
      const url = method === 'POST' ? service.API_URL.testimonial.create : service.API_URL.testimonial.update;
      await service.makeAPICall({
        methodName: apiMethod,
        apiUrl: url,
        params: id ?? '',
        body: feedbackData,
      });
      return null;
      history(-1)
      console.log("check", feedbackData);
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
                  {method === 'POST' ? 'Add' : 'Update'} {globalMessages.feedback.feedback}
                </MDTypography>
              </MDBox>
              <MDBox component="form" role="form">
                <MDBox mx={2} my={3} mt={-3} py={2}  fontSize='medium'>
                  < SelectComponent
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
                
                <MDBox mx={2} my={3} mt={-3} py={2}>
                  <Grid item xs={12} style={{ marginTop: "5px" }}>
                  <SelectComponent
                      placeholder="Feedback For"
                      options={feedbackfor.map(method => ({
                        value: method.label,
                        label: method.label
                      }))}
                   
                      handleChange={(event: any) => handleUserChange(event.target.value)}
                      value={getValues("feedback_for") || ''}
                      {...register("feedback_for", { required: 'Feedback for is required' })}
                    />
                    {errors.feedback_for && <ErrorShow error={errors.feedback_for.message ?? ""} />}
                  </Grid>

                  {feedbackForValue && (
                    <Grid item xs={12} style={{ marginTop: "5px" }}>
                      <SelectComponent
                        placeholder={Feedbacklabel}
                        options={SelectFeedBackFor.map(SelectFeedBackFor => ({
                          value: SelectFeedBackFor.user_id,
                          label: SelectFeedBackFor.name
                        }))}
                        handleChange={(event: any) => ChangeValue(event, "feedback_for_id")}
                        value={getValues('feedback_for_id') ? String(getValues('feedback_for_id')) : null}
                        {...register("feedback_for_id", { required: 'BDE is required' })}
                      />
                      {errors.feedback_for_id && <ErrorShow error={errors.feedback_for_id.message ?? ""} />}
                    </Grid>

                  )}


                  <Grid item xs={12} sm={12} style={{ marginTop: "5px" }}>
                    <SelectComponent
                      placeholder="Record Type"
                      options={recordType.map(method => ({
                        value: method.id,
                        label: method.label
                      }))}
                      handleChange={(event: any) => ChangeValue(event, "record_type")}
                      value={getValues('record_type') ? String(getValues('record_type')) : null}
                      {...register("record_type", { required: 'Record type is required' })}
                    />
                    {errors.record_type && <ErrorShow error={errors.record_type.message ?? ""} />}
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <MDBox mb={2}>
                      <MDInput {...register("comment")} InputLabelProps={getValues('comment') && { shrink: true }} label={globalMessages.feedback.comment} fullWidth multiline />
                      {errors.comment?.message && <ErrorShow error={errors.comment?.message} />}
                    </MDBox>
                    <MDBox mx={2} my={3} mt={-3} py={2}>
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
                  </Grid>
                  <MDBox>
                    <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                      {method === 'POST' ? 'Add' : 'Update'} {globalMessages.feedback.save_button_text}
                    </MDButton>
                    <MDButton variant="gradient" color="dark" onClick={() => history(-1)}>
                      {globalMessages.btn_text.back_button_text}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    </>
  );
};
export default FeedbackForm;

