import React, {useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Grid, Switch, } from '@mui/material';
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

interface OrderStatusFormProps {
  method: string;
}

interface OrderStatusData {
  order_status_id: number;
  order_status_name: string;
  display_label: string;
  order_status_short: string;
  is_active: boolean;
}

const OrderStatusForm: React.FC<OrderStatusFormProps> = ({ method }) => {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const { register, handleSubmit, getValues, formState: { errors }, setValue, watch } = useForm<OrderStatusData>();
  const history = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await service.makeAPICall({
          methodName: service.Methods.GET,
          apiUrl: service.API_URL.order_status.view,
          params: id,
        });
        const orderStatusData: OrderStatusData = response?.data.data;
        Object.entries(orderStatusData).forEach(([key, value]) => {
          setValue(key as keyof OrderStatusData, value);
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (id && method === 'PUT') {
      fetchData();
    }
  }, [id, method]);

  const onSubmit = async (orderstatusData: OrderStatusData) => {
    try {

      const updatedOrderStatusData = {
        ...orderstatusData,
      };
      const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
      const url = method === 'POST' ? service.API_URL.order_status.create : service.API_URL.order_status.update;

      await service.makeAPICall({
        methodName: apiMethod,
        apiUrl: url,
        params: id ?? '',
        body: updatedOrderStatusData,
      });
      history(-1)
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggle = () => {
    setValue('is_active', !getValues('is_active'))

  }
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={4} pb={3}>
          <Grid container spacing={1}>
            <Grid item xs={15}>
              <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  {method === 'POST' ? 'Add' : 'Update'} {globalMessages.order_status.order_status}
                </MDTypography>
              </MDBox>
              <MDBox  mx={2} my={3} mt={-3} py={2} px={0} component="form" role="form">
                <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                  <Grid item xs={12}>
                    <MDInput 
                      my={2}
                      {...register("order_status_name", { required: 'Order Status is required' })}
                      label={globalMessages.order_status.name}
                      fullWidth
                      required
                      InputLabelProps={id && { shrink: watch('order_status_name') ? true : false }}
                    />
                    {errors.order_status_name?.message && <ErrorShow error={errors.order_status_name?.message} />}
                  </Grid>
                  <Grid item xs={12}>
                    <MDInput
                    InputLabelProps={id && { shrink: watch('display_label') ? true : false }}
                      my={2}
                      {...register("display_label", { required: 'Label is required' })}
                      label={globalMessages.order_status.dislplay_label}
                      fullWidth
                      required
                    />
                    {errors.display_label?.message && <ErrorShow error={errors.display_label?.message} />}
                  </Grid>
                  <Grid item xs={12}>
                    <MDInput
                      my={2}
                      {...register("order_status_short", { required: 'Shortform is required' })}
                      label={globalMessages.order_status.short_form}
                      fullWidth
                      required
                      InputLabelProps={id && { shrink: watch('order_status_short') ? true : false }}
                    />
                    {errors.order_status_short?.message && <ErrorShow error={errors.order_status_short?.message} />}
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={9}>
                      <MDBox mx={2} display='flex' alignItems='center' mb={2}>
                        <MDTypography variant="label" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                          {globalMessages.emailmarketing_form.is_Active}
                        </MDTypography>
                        <Switch checked={getValues('is_active')} onClick={handleToggle} {...register("is_active")} />
                      </MDBox>
                      {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                    </Grid>
                    {errors.is_active?.message && <ErrorShow error={errors.is_active?.message} />}
                  </Grid>
                </Grid>
                <MDBox>
                  <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.order_status.save_button_text}
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

export default OrderStatusForm;

