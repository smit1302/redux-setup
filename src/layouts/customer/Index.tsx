import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
//icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { useNavigate } from "react-router-dom";
import globalMessages from "utils/global";
import { service } from "utils/Service/service";
import { ChangeEvent, useEffect, useState } from "react";
import { CellProps } from "react-table";
import { IconButton } from "@mui/material";
import Select from "components/MDSelect";
import { useMaterialUIController } from "context";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../redux/features/commonData/commonData";
import { useForm } from "react-hook-form";
import { requiredMessage, validateContact } from "utils/common";
import ErrorShow from "common/ErrorShow";
import { Add } from '@mui/icons-material';


interface CustomerPersonalInfoData {
    name: string;
    email: string;
    email_2: string;
    phone: string;
    website_url: string;
    password: string;
    // c_country: string;
    mobile: string;
    created_at: string;
    username: string;
    billingAddress: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    activity_type_id: number;
    datasource_id: number;
    address: string
}
const Customer = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const global_arcticgrey = globalMessages.arcticgrey
    const global_source = globalMessages.source
    const global_billing = globalMessages.billing
    const global_history = globalMessages.history
    const history = useNavigate()
    const dispatchData = useDispatch();
    const [contacts, setContacts] = useState([]);
    const [preference, setPreference] = useState([]);
    const [totalPaid, setTotalPaid] = useState<number>();
    const [totalUnpaid, setTotalUnpaid] = useState<number>();
    const [totalNetAmount, settotalNetAmount] = useState<number>();
    const [totalBadDebt, setTotalBadDebt] = useState<number>();
    const [profile, setProfile] = useState({
        opportunityCount: 0,
        opportunityTotal: 0,
        orderCount: 0,
        orderTotal: 0,
        freejobCount: 0,
        website_url: '',
        last_commubication_date: '',
        worth: 0,
    });

    console.log("profilestate", profile);
    const [business, setBusiness] = useState([]);
    const [activityType, setActivityType] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [attachment, setAttachment] = useState<any[]>([]);
    const { register, handleSubmit, getValues, trigger, formState: { errors }, setValue } = useForm<CustomerPersonalInfoData>();
    const [customerPersonalInfo, setCustomerPersonalInfo] = useState({
        name: '',
        email: '',
        email2: '',
        Phone: '',
        Website: '',
        Password: '',
        c_country: '',
        mobile: '',
        created_at: '',
        username: '',
        billingAddress: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        activity_type_id: 0,
        datasource_id: 0
    });

    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const customer = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Customer);
    const order = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Orders);

    const columns = [
        { Header: "Open Under", accessor: "website_url", width: "45%", align: "left" },
        {
            Header: "All Aqe", accessor: "opportunityCount", align: "center", Cell: ({ row }: any) => (
                <div>
                    Lead: {row.original.opportunityCount}
                    || Order: {row.original.orderCount}
                    || Free  Jobs: {row.original.freejobCount}
                </div>
            )
        },
        { Header: "Last Comm Dt", accessor: "lastcommdt", align: "center" },
        { Header: "Worth", accessor: "worth", align: "center" },
    ];

    const rows = [
        {
            id: 1,
            website_url: profile.website_url,
            opportunityCount: profile.opportunityCount,
            orderCount: profile.orderCount,
            freejobCount: profile.freejobCount,
            lastcommdt: 'Arp 20 2020 05:20 Am',
            worth: profile.worth,
        },
    ];

    const columnsContacts = [
        { Header: "contactperson", accessor: "contact_name", width: "45%", align: "left" },
        { Header: "position", accessor: "position", align: "left" },
        { Header: "state", accessor: "state", align: "center" },
        { Header: "phone", accessor: "phone_no", align: "center" },
        {
            Header: "social Media", accessor: "social", align: "center", Cell: ({ row }: CellProps<any>) => {
                return (
                    <>
                        {
                            customer?.["Customer Contact"]?.create &&
                            <MDButton className='add_btn' variant={"contained"} onClick={() => handleAddContactSocialMedia(row.original.customer_contact_id)} children={<Add />} />
                        }
                    </>
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            customer?.["Customer Contact"]?.update &&
                            <IconButton onClick={() => handleContactNavigateUpdate(record.row.original.customer_contact_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            customer?.["Customer Contact"]?.delete &&
                            <IconButton onClick={() => handleToggleContactDelete(record.row.original.customer_contact_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: '17%',
        },
    ]


    const columnsPreferences = [
        {
            Header: "site_bde",
            accessor: 'bde_name',
            width: '45%',
            align: 'left',
        },
        { Header: "business Type", accessor: "business_type", align: "center" },
        { Header: "life cycle stage", accessor: "life_cycle_stage_label", align: "left" },
        // { Header: "billingdays", accessor: "billing_cycle_days", align: "center" },
        {
            Header: "Billing days | Billing Type", accessor: "billing_cycle_days", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span>{row.original.billing_cycle_days} | </span>
                    <span>{row.original.billing_type_label}</span>
                </div>
            )
        },
        { Header: "credit limit currency", accessor: "credit_limit", align: "center" },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            customer?.["Customer Preference"]?.update &&
                            <IconButton onClick={() => handleUpdatePreferenceNavigate(record.row.original.customer_preference_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: '17%',
        },
    ]


    const columnsCustomer_Businesses = [
        { Header: "site Url", accessor: "website_url", width: "45%", align: "left" },
        { Header: "platform", accessor: "platform_master_id", align: "left" },
        { Header: "Design Score | Date", accessor: "design_score", align: "center" },
        {
            Header: "seo score | Date", accessor: "seo_score", align: "center", Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.seo_score}</div>
                    <div>{row.original.seo_score_date}</div>
                </div>
            )
        },
        {
            Header: "social Media", accessor: "social", align: "center", Cell: ({ row }: CellProps<any>) => {
                return (
                    <>
                        {
                            customer?.["Customer Social Media"]?.create &&
                            <MDButton className='add_btn' variant={"contained"} onClick={() => handleAddBusinessSocialMedia(row.original.customer_business_id)} children={<Add />} />
                        }
                    </>
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            customer?.["Customer Business"]?.edit &&
                            <IconButton onClick={() => handleBusinessNavigateUpdate(record.row.original.customer_business_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            customer?.["Customer Business"]?.delete &&
                            <IconButton onClick={() => handleToggleBusinessDelete(record.row.original.customer_business_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: '17%',
        },
    ]
    const columnsAttachments = [
        { Header: "File Name", accessor: "file_name", width: "45%", align: "left" },
        { Header: "File Type", accessor: "file_type", align: "left" },
        { Header: "File Size", accessor: "file_size", align: "center" },
        { Header: "File Add Date", accessor: "created_at", align: "center" },
        { Header: "Remarks", accessor: "remarks", align: "center" },
    ]

    const handleAddBusinessSocialMedia = (customer_business_id: number) => {
        dispatchData(addData({ key: "customer_business_id", data: customer_business_id }));
        history("/social-media/add");
    }

    const handleAddContactSocialMedia = (customer_contact_id: number) => {
        dispatchData(addData({ key: "customer_contact_id", data: customer_contact_id }));
        history("/social-media/add");
    }

    const handleBusinessNavigateUpdate = (id: number) => {
        history(`/business/update/${id}`);
    }

    const handleToggleBusinessDelete = async (id?: number) => {
        try {
            await service.makeAPICall({
                methodName: service.Methods.DELETE,
                apiUrl: service.API_URL.customer.deleteBusiness,
                params: id
            });
        } catch (error) {
            console.log(error);
        }
        fetchBusinessData();
    };

    const handleContactNavigateUpdate = (id: number) => {
        history(`/contact/update/${id}`);
    }

    const handleUpdatePreferenceNavigate = (id: number) => {
        history(`/preference/update/${id}`);
    }

    const handleToggleContactDelete = async (id?: number) => {
        try {
            await service.makeAPICall({
                methodName: service.Methods.DELETE,
                apiUrl: service.API_URL.customer.deleteContact,
                params: id
            });
        } catch (error) {
            console.log(error);
        }
        fetchContactData();
    };

    const handleSelectChange = (name: string, option: { id: number, label: string }) => {

        setCustomerPersonalInfo(prevData => ({
            ...prevData,
            [name]: option.id
        }));
    };


    const fetchBusinessSocialMediaData = async () => {
        const queryData = { customer_business_id: customerId.customer_business_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.listSocialMedia,
                query: queryData,
            });
            if (response && response.data && response.data.data) {
                // setPreference(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const fetchContactSocialMediaData = async () => {
        const queryData = { customer_contact_id: customerId.customer_contact_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.listSocialMedia,
                query: queryData,
            });
            if (response && response.data && response.data.data) {
                // setPreference(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const fetchPreferenceData = async () => {
        const queryData = { customer_id: customerId.customer_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.listPreference,
                query: queryData,
            });
            if (response && response.data && response.data.data) {
                setPreference(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const fetchContactData = async () => {
        const queryData = { customer_id: customerId.customer_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.listContact,
                query: queryData,
            });
            if (response && response.data && response.data.data) {
                setContacts(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBusinessData = async () => {
        const queryData = { customer_id: customerId.customer_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.listBusiness,
                query: queryData,
            });
            if (response && response.data && response.data.data) {
                setBusiness(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrderData = async () => {
        const bodyData = {
            customer_id: customerId.customer_id,
            try_jobs_list: true
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: bodyData,
            });
            const filteredRows = response?.data.data || [];
            const orderTotal = filteredRows.reduce((acc: number, item: any) => acc + item.total, 0); // Explicitly specify the type of 'item' or replace 'any' with 'unknown'
            setProfile(prevProfile => ({
                ...prevProfile,
                freejobCount: filteredRows.length,
                orderTotal: orderTotal,
                worth: prevProfile.opportunityTotal + orderTotal,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchFreejobData = async () => {
        const body = {
            customer_id: customerId.customer_id,
            try_jobs_list: false
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: body,
            });
            const filteredOrders = response?.data.data || [];
            let sum = 0;
            if (filteredOrders.length > 0) {
                sum = filteredOrders.reduce((acc: number, item: any) => acc + item.total, 0); // Explicitly specify the type of 'item' or replace 'any' with 'unknown'
            }
            setProfile(prevProfile => ({
                ...prevProfile,
                orderCount: filteredOrders.length,
                orderTotal: sum,
                worth: prevProfile.opportunityTotal + sum,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBillingData = async () => {
        const queryData = { customer_id: customerId.customer_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.list,
                query: queryData,
            });
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                const customerData: CustomerPersonalInfoData = response.data.data[0];
                Object.entries(customerData).forEach(([key, value]) => {
                    setValue(key as keyof CustomerPersonalInfoData, value);
                });
                // setCustomerPersonalInfo({
                //     name: customerData.name,
                //     email: customerData.email,
                //     email2: customerData.email_2,
                //     Phone: customerData.phone,
                //     Website: customerData.website_url,
                //     Password: customerData.password,
                //     c_country: customerData.country,
                //     mobile: customerData.mobile,
                //     created_at: customerData.created_at,
                //     username: customerData.username,
                //     billingAddress: customerData.address,
                //     city: customerData.city,
                //     state: customerData.state,
                //     country: customerData.country,
                //     zip_code: customerData.zip,
                //     activity_type_id: customerData.activity_type_id,
                //     datasource_id: customerData.datasource_id,
                // });
                // setProfile(prevProfile => ({
                //     ...prevProfile,
                //     website_url: customerData.website_url
                // }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetcOpportunityhData = async () => {
        const queryData = { customer_id: customerId.customer_id };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.opportunity.get,
                query: queryData,
            });
            console.log("res", response);
            if (response && response.data && response.data.data.opportunities) {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    opportunityCount: response.data.data.count,
                    opportunityTotal: response.data.data.totalAmount,
                    worth: prevProfile.orderTotal + response.data.data.totalAmount,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });
            setActivityType(response.data.data.activity_type);
            setDataSource(response.data.data.data_source);
        } catch (error) {
            console.log(error);
        }
    };

    const updateCustomer = async () => {
        try {
            await service.makeAPICall({
                apiUrl: `${service.API_URL.customer.updateCustomer}/${customerId.customer_id}`,
                methodName: service.Methods.PUT,
                body: customerPersonalInfo
            });
        } catch (error) {
            console.log(error);
        }
    }

    const paymentData = async () => {
        const query = {

            customer_id: customerId.customer_id || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.payment,
                query: query,
            });
            setTotalPaid(response?.data?.data.totalPaid);
            setTotalUnpaid(response?.data?.data.totalUnpaid);
            settotalNetAmount(response?.data?.data.totalNetAmount);
            setTotalBadDebt(response?.data?.data.totalBadDebt);
            console.log("net", totalPaid);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAttachmentData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customerDocument.list,
                query: { customer_id: customerId.customer_id }
            });
            if (response && response.data && response.data.data) {
                setAttachment(response.data.data);
                // rowsAttachments =response.data.data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    console.log("reduxvalue", customerId);

    useEffect(() => {
        console.log('hello', order)
        if (order?.["Payment"]?.view) {
            console.log('it me is payment')
            paymentData();
        }

        if (order?.["My Order"]?.view) {
            fetchFreejobData();
            fetchOrderData();
        }
        
        fetchData();

        if (customer?.["Customer Attachments"]?.view) {
            fetchAttachmentData();
        }

        if (customer?.["Customer Preferences"]?.view) {
            fetchPreferenceData();
        }
        fetchBillingData();
        if (customer?.["Customer Contact"]?.view) {
            fetchContactData();
        }
        if (customer?.["Customer Business"]?.view) {
            fetchBusinessData();
        }

        if (customer?.["Opportunity"]?.view) {
            fetcOpportunityhData();
        }

        if (customer?.["Customer Social Media"]?.view) {
            fetchContactSocialMediaData();
            fetchBusinessSocialMediaData();
        }

    }, [customerId]);

    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {/* First card */}
                    <Grid item xs={12} md={6} lg={4}>
                        {/* Left side of the first card */}
                        <div style={{ marginBottom: '50px' }}>
                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        {global_arcticgrey.title}
                                    </MDTypography>

                                    {/* <MDTypography variant="h4" color="white">
                                        <EditIcon color="warning" />
                                        <PersonOutlineOutlinedIcon color="success" />
                                        <RemoveOutlinedIcon color="inherit" />
                                    </MDTypography> */}
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.username}
                                            </MDTypography>
                                            <MDInput type="text" {...register("name", { required: requiredMessage })} InputLabelProps={{}} variant="standard" fullWidth />
                                            {errors?.country?.message && <ErrorShow error={errors?.country?.message} />}
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.password}
                                            </MDTypography>
                                            <MDInput type="password" {...register("password", { required: requiredMessage })} variant="standard" fullWidth />
                                            {errors?.password?.message && <ErrorShow error={errors?.password?.message} />}
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.website}
                                            </MDTypography>
                                            <MDInput type="text"  {...register("website_url", { required: requiredMessage })} variant="standard" fullWidth />
                                            {errors?.website_url?.message && <ErrorShow error={errors?.website_url?.message} />}
                                        </MDBox>
                                        <MDBox mb={2}>
                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.coutry}
                                            </MDTypography>
                                            <MDInput type="text" {...register("country", { required: requiredMessage })} value={customerPersonalInfo.c_country} variant="standard" fullWidth />
                                            {errors?.country?.message && <ErrorShow error={errors?.country?.message} />}
                                        </MDBox>
                                        <MDBox mb={2} display="flex"
                                            justifyContent="space-between"
                                            alignItems="center">
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.joined}: QeRetail
                                            </MDTypography>
                                            <MDTypography variant="h6" >
                                                {customerPersonalInfo.created_at}
                                            </MDTypography>

                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.alternate_email}
                                            </MDTypography>
                                            <MDTypography variant="h6" >
                                                <MDInput type="text" {...register("email_2", { required: requiredMessage })} value={customerPersonalInfo.email2} variant="standard" fullWidth />
                                                {errors?.email_2?.message && <ErrorShow error={errors?.email_2?.message} />}
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            {/* Left side of the second card */}
                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        {global_source.title}
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        <RemoveOutlinedIcon color="inherit" />
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_source.data_source}
                                            </MDTypography>
                                            {/* Dropdown/Select component with a placeholder label */}

                                            <Select placeholder="Data Source" options={dataSource} handleChange={(value) => handleSelectChange('data_source_id', value.target.value)} />
                                        </MDBox>
                                        <MDBox mb={2}>

                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_source.marketing_activity}
                                            </MDTypography>
                                            <Select placeholder="Data Source" options={activityType} handleChange={(value) => handleSelectChange('activity_type_id', value.target.value)} />
                                        </MDBox>

                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            {/* Left side of the Fourth card Billing */}
                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        {global_billing.title}
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        <RemoveOutlinedIcon color="inherit" />
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.address}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("address", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.address?.message && <ErrorShow error={errors?.address?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.city}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("city", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.city?.message && <ErrorShow error={errors?.city?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.zip}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("zip", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.zip?.message && <ErrorShow error={errors?.zip?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.state}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("state", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.state?.message && <ErrorShow error={errors?.state?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_billing.country}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("country", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.country?.message && <ErrorShow error={errors?.country?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.phone}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("phone", { required: requiredMessage, validate: validateContact })} variant="standard" fullWidth />
                                                {errors?.phone?.message && <ErrorShow error={errors?.phone?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.mobile}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("mobile", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.mobile?.message && <ErrorShow error={errors?.mobile?.message} />}
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.email}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" {...register("email", { required: requiredMessage })} variant="standard" fullWidth />
                                                {errors?.email?.message && <ErrorShow error={errors?.email?.message} />}
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>


                        <div style={{ marginBottom: '50px' }}>
                            {/* Left side of the Fifth card History */}

                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        {global_history.title}
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        <RemoveOutlinedIcon color="inherit" />
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2} display="flex"
                                            justifyContent="space-between"
                                            alignItems="center">
                                            <MDTypography variant="h6" >
                                                {global_history.created_by}
                                            </MDTypography>
                                        </MDBox>
                                        <hr></hr>
                                        <MDBox mb={2} display="flex"
                                            justifyContent="space-between"
                                            alignItems="center">
                                            <MDTypography variant="h6" >
                                                {global_history.created_date}
                                            </MDTypography>
                                            <MDTypography variant="h6" >
                                                18-Jan-2017 12:00Am
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>

                        <MDBox mt={4} mb={1} className='action_wrap'>
                            <MDButton className='action-button' variant="gradient" type="Button" onClick={updateCustomer}>
                                Update
                            </MDButton>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        {/* Right side of the first card */}
                        {
                            // customer?.["Customer Contact"]?.view &&
                            <div style={{ marginBottom: '50px' }}>
                                <Card className='module_wrap'>
                                    <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" className='module_head'>
                                        <MDTypography variant="h6" color="white">
                                            Table
                                        </MDTypography>

                                    </MDBox>
                                    <MDBox pt={3} className='table_custom'>
                                        {/* Render DataTable component with columns and rows */}
                                        <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                        <Grid p={3} className='row_bx d_flex'>
                                            <MDInput className='col_item' label="Net Amount:" value={`$${totalNetAmount}`} disabled={true} ></MDInput>
                                            <MDInput className='col_item' label="Paid Amount:" value={`$${totalPaid}`} disabled={true} ></MDInput>
                                            <MDInput className='col_item' label="Unpaid Amount:" value={`$${totalUnpaid}`} disabled={true} ></MDInput>
                                            <MDInput className='col_item' label="Total Bad debt" value={`$${totalBadDebt}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </div>
                        }

                        {/* Right side of the Second card */}

                        {
                            customer?.["Customer Contact"]?.view &&
                            <div style={{ marginBottom: '50px' }}>
                                <Card className='module_wrap'>
                                    <MDBox
                                        className='module_head'
                                        mx={2}
                                        mt={-3}
                                        py={3}
                                        px={2}
                                        variant="gradient"
                                        bgColor="info"
                                        borderRadius="lg"
                                        coloredShadow="info"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >

                                        <MDTypography variant="h6" color="white">
                                            Contact
                                        </MDTypography>

                                        {
                                            customer?.["Customer Contact"]?.create &&
                                            <MDButton className='add_btn' variant={"contained"} onClick={() => history("/contact/add")} children={<Add />} />
                                        }

                                    </MDBox>
                                    <MDBox pt={3} className='table_custom'>
                                        <DataTable
                                            table={{ columns: columnsContacts, rows: contacts }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </Card>
                            </div>
                        }
                        {/* Right side of the Third card */}
                        {
                            customer?.["Customer Preference"]?.view &&
                            <div style={{ marginBottom: '50px' }}>
                                <Card className='module_wrap'>
                                    <MDBox
                                        className='module_head'
                                        mx={2}
                                        mt={-3}
                                        py={3}
                                        px={2}
                                        variant="gradient"
                                        bgColor="info"
                                        borderRadius="lg"
                                        coloredShadow="info"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >

                                        <MDTypography variant="h6" color="white">
                                            Preferences
                                        </MDTypography>

                                        {
                                            customer?.["Customer Preference"]?.create &&
                                            <MDButton className='add_btn' variant={"contained"} onClick={() => history("/preference/add")} children={<Add />} />
                                        }

                                    </MDBox>
                                    <MDBox pt={3} className='table_custom'>
                                        <DataTable
                                            table={{ columns: columnsPreferences, rows: preference }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </Card>
                            </div>
                        }
                        {/* Right side of the Fourth card */}
                        {
                            customer?.["Customer Business"]?.view &&
                            <div style={{ marginBottom: '50px' }}>
                                <Card className='module_wrap'>
                                    <MDBox
                                        className='module_head'
                                        mx={2}
                                        mt={-3}
                                        py={3}
                                        px={2}
                                        variant="gradient"
                                        bgColor="info"
                                        borderRadius="lg"
                                        coloredShadow="info"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <MDTypography variant="h6" color="white">
                                            Customer Businesses
                                        </MDTypography>

                                        {
                                            customer?.["Customer Business"]?.create &&
                                            <MDButton className='add_btn' variant={"contained"} onClick={() => history("/business/add")} children={<Add />} />
                                        }

                                    </MDBox>
                                    <MDBox pt={3} className='table_custom'>
                                        <DataTable
                                            table={{ columns: columnsCustomer_Businesses, rows: business }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </Card>
                            </div>
                        }
                        {/* Right side of the Fifth card */}
                        {
                            customer?.["Customer Attachments"]?.view &&

                            <div style={{ marginBottom: '50px' }}>
                                <Card className='module_wrap'>
                                    <MDBox
                                        className='module_head'
                                        mx={2}
                                        mt={-3}
                                        py={3}
                                        px={2}

                                        variant="gradient"
                                        bgColor="info"
                                        borderRadius="lg"
                                        coloredShadow="info"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <MDTypography variant="h6" color="white">
                                            Attachments
                                        </MDTypography>

                                        {
                                            customer?.["Customer Attachments"]?.create &&
                                            <MDButton className='add_btn' variant={"contained"} onClick={() => history("/attachment/add")} children={<Add />} />
                                        }
                                    </MDBox>
                                    <MDBox pt={3} className='table_custom'>
                                        <DataTable
                                            table={{ columns: columnsAttachments, rows: attachment }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </Card>
                            </div>

                        }
                    </Grid>

                </Grid>
            </MDBox>
            <Footer />

        </>


    );
}

export default Customer;



