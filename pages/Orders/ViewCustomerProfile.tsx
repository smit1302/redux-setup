import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { useNavigate } from "react-router-dom";
import globalMessages from "utils/global";
import { useSelector } from "react-redux";
import { service } from "utils/Service/service";
import { ChangeEvent, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Select from "common/Select";

const ViewCustomerProfile = () => {
    const global_arcticgrey = globalMessages.arcticgrey
    const global_source = globalMessages.source
    // const global_block = globalMessages.block
    const global_billing = globalMessages.billing
    const global_history = globalMessages.history
    // const global_ip_tracking = globalMessages.ip_tracking
    // const global_misc = globalMessages.misc
    // const global_btn_text = globalMessages.btn_text
    const history = useNavigate()
    const [contacts, setContacts] = useState([]);
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
        website_name: '',
        last_commubication_date: '',
        worth: 0,
    });

    console.log("profilestate", profile);
    const [business, setBusiness] = useState([]);
    const [activityType, setActivityType] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [attachment, setAttachment] = useState<any[]>([]);
    const customer = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Customer);
    const order = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Order);

    // const [order, setOrder] = useState([]);
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
        data_source_id: 0
    });

    const customerId = useSelector((state: any) => state?.commonData.commonData);

    const columns = [
        { Header: "Open Under", accessor: "website_name", width: "45%", align: "left" },
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
            website_name: profile.website_name,
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

    const columnsAttachments = [
        { Header: "File Name", accessor: "file_name", width: "45%", align: "left" },
        { Header: "File Type", accessor: "file_type", align: "left" },
        { Header: "File Size", accessor: "file_size", align: "center" },
        { Header: "File Add Date", accessor: "upload_date", align: "center" },
        { Header: "Remarks", accessor: "remarks", align: "center" },
    ]

    const rowsAttachments = [
        { id: 1, file_name: '', file_type: '', file_size: '', file_add_date: '', remarks: '' },
        // Add more rows as needed
    ];

    const handleContactNavigateUpdate = (id: number) => {
        history(`/add-contact/update/${id}`);
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
            setProfile(prevProfile => ({
                ...prevProfile,
                freejobCount: filteredRows.length, // setting the count directly
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
            // Initialize sum outside the if block
            let sum = 0;
            // Calculate sum if filteredRows is not empty
            if (filteredOrders.length > 0) {
                sum = filteredOrders.reduce((acc: number, item: any) => {
                    return acc + item.total;
                }, 0);
            }
            // Set orderCount and opportunityAmount in profile
            setProfile(prevProfile => ({
                ...prevProfile,
                orderCount: filteredOrders.length, // setting the count directly
                orderTotal: sum,
            }));
        } catch (error) {
            console.log(error);
        }
    }

    const fetchBillingData = async () => {
        const queryData = { customer_id: customerId.customer_id }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.list,
                query: queryData,
            });
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                const customerData = response.data.data[0];
                console.log("customerData", customerData);
                setCustomerPersonalInfo({
                    name: customerData.name,
                    email: customerData.email,
                    email2: customerData.email_2,
                    Phone: customerData.phone,
                    Website: customerData.website_name,
                    Password: customerData.password,
                    c_country: customerData.country,
                    mobile: customerData.mobile,
                    created_at: customerData.created_at,
                    username: customerData.username,
                    billingAddress: customerData.address,
                    city: customerData.city,
                    state: customerData.state,
                    country: customerData.country,
                    zip_code: customerData.zip_code,
                    activity_type_id: customerData.activity_type_id,
                    data_source_id: customerData.data_source_id,
                });
                setProfile(prevProfile => ({
                    ...prevProfile,
                    website_name: customerData.website_name
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetcOpportunityhData = async () => {
        const queryData = { customer_id: customerId.customer_id }
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
                    worth: calculateWorth(),
                }));
            }
        } catch (error) {
            console.log(error);
        }

    };
    const calculateWorth = () => {
        return profile.orderTotal + profile.opportunityTotal;
    }
    const fetchPaymentData = async () => {
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


    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        console.log("checkpointvalue", value);
        setCustomerPersonalInfo(prevData => ({ ...prevData, [name]: value }));
        console.log("checkpoint", customerPersonalInfo);
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

    useEffect(() => {

        if (order?.["My Order"]?.view) {
            fetchFreejobData();
            fetchOrderData();
        }
        fetchData();

        if (order?.["Payment"]?.view) {
            fetchPaymentData();
        }

        if (customer?.["Customer Attachments"]?.view) {
            fetchAttachmentData();
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


    }, [customerId]);


    return (
        <>
            <MDBox pt={2} pb={3}>
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
                                        {"Company Name"}
                                    </MDTypography>

                                    <MDTypography variant="h4" color="white">
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.username}
                                            </MDTypography>
                                            <MDInput type="text" name="username" value={customerPersonalInfo.username} onChange={handleChange} variant="standard" fullWidth />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.password}
                                            </MDTypography>
                                            <MDInput type="password" name="password" value={customerPersonalInfo.Password} onChange={handleChange} variant="standard" fullWidth />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.website}
                                            </MDTypography>
                                            <MDInput type="text" name="Website" value={customerPersonalInfo.Website} onChange={handleChange} variant="standard" fullWidth />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_arcticgrey.coutry}
                                            </MDTypography>
                                            <MDInput type="text" name="c_country" value={customerPersonalInfo.c_country} onChange={handleChange} variant="standard" fullWidth />
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
                                                <MDInput type="text" name="email2" value={customerPersonalInfo.email2} onChange={handleChange} variant="standard" fullWidth />
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

                                            <Select placeholder="Data Source" options={dataSource} handleChange={(value) => handleSelectChange('data_source_id', value)} />
                                        </MDBox>
                                        <MDBox mb={2}>

                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_source.marketing_activity}
                                            </MDTypography>
                                            <Select placeholder="Data Source" options={activityType} handleChange={(value) => handleSelectChange('activity_type_id', value)} />
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
                                                <MDInput type="text" name="billingAddress" value={customerPersonalInfo.billingAddress} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.city}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="city" value={customerPersonalInfo.city} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.zip}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="zipCode" value={customerPersonalInfo.zip_code} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.state}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="state" value={customerPersonalInfo.state} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            {/* Dropdown/Select component with a placeholder label */}
                                            <MDTypography variant="h6" >
                                                {global_billing.country}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="country" value={customerPersonalInfo.country} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.phone}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="Phone" value={customerPersonalInfo.Phone} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.mobile}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="mobile" value={customerPersonalInfo.mobile} onChange={handleChange} variant="standard" fullWidth />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" >
                                                {global_billing.email}
                                            </MDTypography>
                                            <MDBox mb={2}>
                                                <MDInput type="text" name="email" value={customerPersonalInfo.email} onChange={handleChange} variant="standard" fullWidth />
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
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        {/* Right side of the first card */}
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
                        {/* Right side of the Second card */}
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
                        {/* Right side of the Third card */}
                        {/* Right side of the Fourth card */}
                        {/* Right side of the Fifth card */}
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
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </>
    );
}

export default ViewCustomerProfile;



