import React, { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDButton from 'components/MDButton';
import SelectComponent from "components/MDSelect";
import MDInput from 'components/MDInput';
import { service } from 'utils/Service/service';
import { useMaterialUIController } from 'context';
import { useSelector } from "react-redux";
import ClientGroup from './ClientGroupForm';
import { useDispatch } from "react-redux";


interface AddclientGroupFormProps {
    method: string;
}
interface AddClientGroupData {
    clientType: string;
    customer_group_id: number;
    name: string;
    is_active: boolean;
}
const AddClientGroup: React.FC<AddclientGroupFormProps> = ({ method }) => {
    const navigate = useNavigate();
    const history = useNavigate();
    const dispatchData = useDispatch();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { id } = useParams();
    const [customerGroup, setCustomerGroup] = useState<any[]>([]);
    const [data, setData] = useState({
        customer_group_id: '',
        clientType: '',
        name: '',
        is_active: '',
    });
    const reduxValue = useSelector((state: any) => state?.commonData.commonData);
    const [value, setValue] = useState(reduxValue.value ? reduxValue.value : 0);
    useEffect(() => {
        if (method === 'PUT' && id) {
            fetchDataById(id);
        }
    }, [method, id]);
    

    const fetchDataById = async (id: string) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.view,
                params: id,
            });
            const existingData = response?.data;
            setData({
                customer_group_id: existingData.customer_group_id,
                clientType: existingData.clientType,
                name: existingData.name,
                is_active: existingData.is_active,
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (reduxValue?.value !== undefined) {
            setValue(reduxValue.value);
        }
    },
        [reduxValue]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const mergedData = {
                ...ClientGroup,
                // ...data,
                name: data.name,
                is_active: data.is_active,
                customer_type: reduxValue.customer_type,
                customer_signup_from_date: reduxValue.customer_signup_from_date,
                customer_signup_to_date: reduxValue.customer_signup_to_date,
                amount_paid_till_date: reduxValue.amount_paid_till_date,
                amount_outstanding_till_date: reduxValue.amount_outstanding_till_date,
                number_of_orders: reduxValue.number_of_orders,
                last_order_date: reduxValue.last_order_date,
                number_of_orders_at_last: reduxValue.number_of_orders_at_last,
                product_id: reduxValue.product_id,
                life_cycle_stage_id: reduxValue.life_cycle_stage_id,
                contact_type: reduxValue.contact_type,
                blocked_situation: reduxValue.blocked_situation,
                platform_id: reduxValue.platform_id,
                activity_type: reduxValue.activity_type,
                category_id: reduxValue.category_id
            };

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.customer_group.create : service.API_URL.customer_group.update;

            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: id ?? '',
                body: mergedData,
            });
            navigate(-1);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
    }, [data]);


    const fetchClientGroup = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.get
            });
            setCustomerGroup(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchClientGroup();
    }, []);

    const ChangeValue = (event: any, type: keyof AddClientGroupData) => {
        const selectedValue = event.target.value;
        setValue(selectedValue);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedValue = name === 'is_active' ? value === 'true' : value;
        setData(prevData => ({
            ...prevData,
            [name]: updatedValue,
        }));


        if (name === 'clientType') {
            setData(prevData => ({
                ...prevData,
                customer_group_id: '',
            }));
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} pb={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg">
                            <MDTypography variant="h6" color="white">
                                {method === 'POST' ? 'Add' : 'Update'} Client Type
                            </MDTypography>
                        </MDBox>
                        <MDBox component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={2}>
                                <MDTypography variant="label" fontSize={'3em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        Client Group
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={9}>
                                    <RadioGroup
                                        row
                                        aria-label="client-group"
                                        name="clientType"
                                        value={data.clientType}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel 
                                        value="existing" 
                                        control={<Radio />}
                                         label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Customer add in existing group</MDTypography>}
                                         />
                                         <FormControlLabel 
                                        value="new" 
                                        control={<Radio />} 
                                        label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Create new group</MDTypography>}
                                        
                                     />
                                    </RadioGroup>

                                </Grid>
                                {data.clientType === 'new' && (
                                    <Grid container item xs={12} spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                        <MDTypography variant="label" fontSize={'2em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                                Client Group Name
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <MDInput
                                                label="Customer Group Name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                fullWidth
                                            />

                                        </Grid>

                                    </Grid>
                                )}
                                {data.clientType === 'existing' && (
                                    <Grid container item xs={12} spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                        <MDTypography variant="label" fontSize={'3em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                                Select Group
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <SelectComponent 
                                                placeholder="Select Group"
                                                options={customerGroup.map((group: any) => ({
                                                    value: group.customer_group_id,
                                                    label: group.name,

                                                }))}
                                                handleChange={(event: any) => ChangeValue(event, "customer_group_id")}                                
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
                                <Grid item xs={2}>
                                <MDTypography variant="label" fontSize={'3em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                        Is Active
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={9}>
                                    <RadioGroup
                                        row
                                        aria-label="Is Active"
                                        name="is_active"
                                        value={data.is_active}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel 
                                            value="true" 
                                            control={<Radio />} 
                                            label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>Yes</MDTypography>}
                                        />
                                        <FormControlLabel 
                                            value="false" 
                                            control={<Radio />} 
                                            label={<MDTypography variant="label" fontSize={'1em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>No</MDTypography>}
                                        />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>

                                    <MDButton variant="gradient" color={sidenavColor} sx={{ mr: 2 }} type="submit">
                                        {method === 'POST' ? 'Add' : 'Update'} Client Group
                                    </MDButton>
                                    <MDButton variant="contained" color="secondary" onClick={() => navigate(-1)}>
                                        Cancel
                                    </MDButton>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default AddClientGroup;

