import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, IconButton, Switch } from "@mui/material";
import { Card } from "@mui/material";
import { service } from "utils/Service/service";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import { Row } from "react-table";
import { showFormattedDate } from "utils/common";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";
import ExportToCsv from "utils/ExportToCsv";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SelectComponent from "components/MDSelect";
import globalMessages from "utils/global";
import PaidIcon from "@mui/icons-material/Paid";
import EmailIcon from "@mui/icons-material/Email";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsPieChartData from "layouts/dashboard/data/reportsPieChartData";
import PieChart from "examples/Charts/PieChart";

interface ViewOrderProps {
    method: string;
}

const ViewOrder: React.FC<ViewOrderProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
    const [orderPaymentTypes, setOrderPaymentTypes] = useState<any[]>([]);
    const [orderPaymentStatus, setOrderPaymentStatus] = useState<any[]>([]);
    const [scopeOfWork, setScopeOfWork] = useState<any[]>([]);
    const [product, setProduct] = useState<any[]>([]);
    const [pm, setPm] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [ss, setSs] = useState<any[]>([]);
    const [vendor, setVendor] = useState<any[]>([]);
    const [orderStatus, setOrderStatus] = useState<any[]>([]);
    const [platform, setPlatform] = useState<any[]>([]);
    const [orderActions, setOrderActions] = useState<number[]>([]);
    const [selectedAction, setSelectedAction] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const organizationId = useSelector((state: any) => state?.commonData.commonData);
    const [keyword, setKeyword] = useState<string>("");
    const [resetState, setResetState] = useState(false);
    const [selectedValues, setSelectedValues] = useState({
        platform: "",
        scope_of_work: "",
        try_jobs: false,
        from_date: "",
        to_date: "",
        pm: "",
        bde: "",
        order_payment_type: "",
        order_payment_status: "",
        order_status: "",
        ss: "",
        payment_method: "",
        product: "",
        vendor: "",
        payment_status: "",
        try_jobs_list: false,
    });

    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
    });

    const columns = [
        {
            Header: 'Sr. No.',
            Cell: ({ row }: any) => (
                <div>
                    <input
                        type="checkbox"
                        checked={selectedOrder === row.original.order_id}
                        onChange={() => handleCheckboxChange(row.original.order_id, row.original.customer_id)}
                    /> <span>{row.index + 1}</span>
                </div>
            )
        },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }: { row: Row }) => {
                const options = orderActions?.map((method: any) => ({
                    value: method.id,
                    label: method.label,
                }));
                return (
                    <>
                        <Grid item xs={12} className='col_p'>
                            <SelectComponent
                                options={options}
                                handleChange={(selectedOption: any) => {
                                    handleActionChange(selectedOption, row); // Pass both selectedOption and row
                                }}
                                placeholder={"Actions"}
                            />
                            <MDBox
                                sx={{
                                    width: '100px',
                                }}
                            />
                        </Grid>
                    </>
                );

            }

        },
        { Header: "Website", accessor: "website", align: "center", width: 150 },
        {
            Header: "Order ID", align: "center", accessor: "order_id",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.order_id}</div>
                    <div>{showFormattedDate(row.original.order_date)}</div>
                </div>
            ),
        },
        {
            Header: "Customer", align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <MDTypography color={sidenavColor}><div onClick={() => handleProfileNavigation(row.original.customer_id)} >{row.original.user_name}</div></MDTypography>
                    <div onClick={() => handleProfileNavigation(row.original.customer_id)}>{row.original.user_email}</div>
                    <div><IconButton onClick={() => handlePaymentNavigation(row.original.order_product_id)}>
                        <PaidIcon />
                    </IconButton>
                        <IconButton onClick={() => handleMessageNavigation(row.original.order_product_id, row)}>
                            <EmailIcon />
                        </IconButton></div>
                </div >
            ),
        },
        { Header: "Order Product", accessor: "products", align: "center" },
        {
            Header: "Payment",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.amount}</div>
                    <div>{row.original.payment_type}</div>
                    <div>[{row.original.payment_status}]</div>
                </div>
            ),
        },
        {
            Header: "Team", align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.pm} (PM)</div>
                    <div>{row.original.bde} (BDE)</div>
                    <div>{row.original.ss} (SS)</div>
                </div>
            ),
        },
        {
            Header: "Task", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span> 0%</span> {/*Count of progress of task based on task allocation which will be done in the next phase */}
                </div>)
        },
        { Header: "Status", accessor: "status", align: "center" },
        {
            Header: "Expected", Cell: ({ row }: any) => (
                <div>
                    <div>{showFormattedDate(row.original.delivery_date)}</div>
                </div>
            ), align: "center", accessor: 'delivery_date'
        },
        {
            Header: "Activity", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span>Count: {(row.original.activities_count)}</span>
                </div>
            )
        },
    ];

    const fetchProduct = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            setProduct(Array.isArray(response?.data?.data) ? response?.data?.data : []);
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    const fetchSelectData = async () => {
        try {
            const orderMaster: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.master,
            });
            const masterData = orderMaster.data.data;
            const orderPaymentTypes = filterMasterDataByType(masterData, 'order_payment_type_master');
            const orderPaymentStatus = filterMasterDataByType(masterData, 'order_payment_status_master');
            const paymentMethods = filterMasterDataByType(masterData, 'payment_method_master');
            const paymentStatuses = filterMasterDataByType(masterData, 'payment_status_master');
            const scopeOfWork = filterMasterDataByType(masterData, 'scope_of_work');

            setOrderPaymentTypes(orderPaymentTypes);
            setOrderPaymentStatus(orderPaymentStatus);
            setPaymentMethods(paymentMethods);
            setPaymentStatuses(paymentStatuses);
            // setScopeOfWork(scopeOfWork);

            var scop: any = [];
            const scopeOfWork1 = scopeOfWork.map((item, index) => {
                scop.push({ 'value': index === 0 ? 1 : 3, 'label': item.label });
            });
            setScopeOfWork(scop);

            const orderStatus: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order_status.list,
            });
            setOrderStatus(orderStatus?.data.data)

            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const pm = filterUserDataByRole(userRoleWise, 'pm');
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            const ss = filterUserDataByRole(userRoleWise, 'sales_manager');
            const vendor = filterUserDataByRole(userRoleWise, 'vendor');
            setPm(pm);
            setBde(bde);
            setSs(ss);
            setVendor(vendor);

            const platform = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            setPlatform(platform?.data?.data);

            const action = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            })
            setOrderActions(action?.data.data.order_action)
        } catch (error) {
            console.log(error);
        }
    };

    const filterMasterDataByType = (masterData: any[], type: string) => {
        return masterData.filter((item: any) => item.type === type)?.map((typeItem: any) => ({
            value: typeItem.id,
            label: typeItem.name,
        }));
    };

    const filterUserDataByRole = (userData: any[], roleName: string) => {
        return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
            value: user.user_id,
            label: user.name,
        }));
    };

    const fetchOrderData = async () => {
        const bodyData: any = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            order_status: selectedValues.order_status || "",
            platform: selectedValues.platform || "",
            product: selectedValues.product || "",
            pm: selectedValues.pm || "",
            bde: selectedValues.bde || "",
            ss: selectedValues.ss || "",
            vendor: selectedValues.vendor || "",
            scope_of_work: selectedValues.scope_of_work,
            order_payment_type: selectedValues.order_payment_type || "",
            order_payment_status: selectedValues.order_payment_status || "",
            payment_method: selectedValues.payment_method || "",
            payment_status: selectedValues.payment_status || "",
            try_jobs: selectedValues.try_jobs,
            try_jobs_list: selectedValues.try_jobs_list,
        };
        if (organizationId.organization_id) {
            bodyData.organization_id = organizationId.organization_id;
        }
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: bodyData,
            });
            setRows(response?.data?.data);

            const firstRowOrderId = response?.data?.data[0]?.order_id;
            const firstRowCustomerId = response?.data?.data[0]?.customer_id;
            const firstRowOrderProductId = response?.data?.data[0]?.order_product_id;
            console.log("CHECKING CUSTOMER ID", firstRowCustomerId)
            dispatchData(addData({ key: "order_id", data: firstRowOrderId }));
            dispatchData(addData({ key: "customer_id", data: firstRowCustomerId }));
            dispatchData(addData({ key: "order_product_id", data: firstRowOrderProductId }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrderData();
        fetchProduct();
        fetchSelectData();
    }, [index, filter]);

    useEffect(() => {
        if (resetState) {
            fetchOrderData();
            setResetState(false)
        }
    }, [resetState]);

    const handleActionChange = (selectedOption: any, row: any) => {
        setSelectedAction(selectedOption.target.value);
        if (row && row.original && row.original.product_id) {
            dispatchData(addData({ key: "order_id", data: row.original.order_id }));
            dispatchData(addData({ key: "order_product_id", data: row.original.order_product_id }));
            dispatchData(addData({ key: "product_id", data: row.original.product_id }));
            dispatchData(addData({ key: "customer_id", data: row.original.customer_id }));
            dispatchData(addData({ key: "organization_id", data: row.original.organization_id }));
        }
    };

    useEffect(() => {
        if (selectedAction !== null) {
            switch (selectedAction) {
                case 1:
                    history("/email-activity");
                    break;
                case 2:
                    history("/log-activity");
                    break;
                case 3:
                    history("/note");
                    break;
                case 4:
                    history("/task");
                    break;
                case 5:
                    history("/reminder");
                    break;
                case 6:
                    history("/scope-of-work");
                    break;
                case 7:
                    history("/order-allocation");
                    break;
                default:
                    break;
            }
        }
    }, [selectedAction]);

    const handleSearch = () => {
        fetchOrderData();
    };

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleProfileNavigation = (id?: number) => {
        dispatchData(addData({ key: "customer_id", data: id }));
        dispatchData(addData({ key: "value", data: 6 }));
        history(`/my-order`);
    };

    const handlePaymentNavigation = (id?: number) => {
        dispatchData(addData({ key: "order_id", data: id }));
        dispatchData(addData({ key: "value", data: 5 }));
        history(`/my-order`);
    };

    const handleMessageNavigation = (id?: number, row?: any) => {
        dispatchData(addData({ key: "order_id", data: row.original.order_id }));
        dispatchData(addData({ key: "order_product_id", data: id }));
        dispatchData(addData({ key: "value", data: 3 }));
        history(`/my-order`);
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            try_jobs: event.target.checked,
        }));
    };

    const handleCheckboxChange = (order_id: number, customer_id: number) => {
        setSelectedOrder(order_id);
        dispatchData(addData({ key: "order_id", data: order_id }));
        dispatchData(addData({ key: "customer_id", data: customer_id }));
    };

    const handleReset = () => {
        setSelectedValues({
            from_date: "",
            to_date: "",
            platform: "",
            scope_of_work: "",
            try_jobs: false,
            pm: "",
            bde: "",
            order_payment_type: "",
            order_payment_status: "",
            order_status: "",
            ss: "",
            payment_method: "",
            product: "",
            vendor: "",
            payment_status: "",
            try_jobs_list: false
        });
        setFilter({
            from_date: "",
            to_date: "",
            search: "",
        })
        setResetState(true);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const downloadCsv = () => {
        const header = [
            "Website",
            "Order ID",
            "Customer",
            "Order Product",
            "Payment",
            "Team",
            //"Task",
            "Status",
            "Expected",
            "Activity",
            // Add other columns here
        ];

        const csv = rows.map((row: any) => {
            const order = `${row.order_id}, ${showFormattedDate(row.order_date)}`;
            const customer = `${row.user_name}, ${row.user_email}`;
            const payment = `${row.amount}, ${row.payment_type},${row.payment_status}`;
            const team = `${row.pm}, ${row.bde},${row.ss}`;
            const expected = `${showFormattedDate(row.delivery_date)}`;
            const activities = `${row.activities_count}`;
            const rowData = [
                row.website,
                `"${order}"`,
                `"${customer}"`,
                row.products,
                `"${payment}"`,
                `"${team}"`,
                row.status,
                `"${expected}"`,
                `"${activities}"`,
                // Add other column data here
            ].join(",");
            return rowData;
        }).join("\n");

        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = globalMessages.download_csv.my_orders;
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: "20px" }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    My Orders
                                    <div className='action_wrap d_flex'>
                                        <MDButton className='action-button' onClick={downloadCsv} children={<SystemUpdateAltIcon />} />
                                    </div>
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2} pb={3}>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: "20px" }}>
                                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    {/*Column 1 */}
                                                    <Grid item xs={12} className='col_p'>
                                                        <MDInput label="Search Keyword" placeholder="Keyword" style={{ backgroundColor: "white" }}
                                                            value={filter.search} onChange={handleSearchChange} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Platform" options={platform?.map((platformType: any) => ({
                                                            value: platformType.platform_master_id,
                                                            label: platformType.name,
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("platform", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['platform']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Scope of Work" options={scopeOfWork}
                                                            handleChange={(e) => handleSelectedValueChange("scope_of_work", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['scope_of_work']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <MDTypography variant="label" fontSize={"0.8em"} fontWeight="regular" color="text"
                                                            onClick={handleCheckboxChange}
                                                            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            Include Try Jobs&nbsp;
                                                        </MDTypography>
                                                        <Switch onChange={handleToggleChange} name="try_jobs" />
                                                    </Grid>
                                                </Grid>

                                                <Box m={1} />
                                                {/*Column 2 */}
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={11} className='col_p'>
                                                        <MDInput label="From" type="date"
                                                            value={filter.from_date}
                                                            className={filter.from_date ? "has-value" : ""}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                handleChange("from_date", e.target.value)} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select PM" options={pm}
                                                            handleChange={(e) => handleSelectedValueChange("pm", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['pm']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent
                                                            placeholder="Select Order Payment Type"
                                                            options={orderPaymentTypes}
                                                            handleChange={(e) => handleSelectedValueChange("order_payment_type", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['order_payment_type']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p action_wrap' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <MDButton className='action-button' variant={"contained"} color={sidenavColor} onClick={handleSearch} children="Search" />
                                                    </Grid>
                                                </Grid>

                                                <Box m={1} />
                                                {/*Column 3 */}
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={11} className='col_p'>
                                                        <MDInput label="To" type="date"
                                                            value={filter.to_date}
                                                            className={filter.to_date ? "has-value" : ""}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                handleChange("to_date", e.target.value)} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select BDE" options={bde}
                                                            handleChange={(e) => handleSelectedValueChange("bde", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['bde']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Order Payment Status" options={orderPaymentStatus}
                                                            handleChange={(e) => handleSelectedValueChange("order_payment_status", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['order_payment_status']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p action_wrap' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <MDButton className='action-button' variant={"contained"} color={sidenavColor} onClick={handleReset} children="Reset" />
                                                    </Grid>
                                                </Grid>

                                                <Box m={1} />
                                                {/*Column 4 */}
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Order Status" options={orderStatus?.map((status: any) => ({
                                                            value: status.order_status_id,
                                                            label: status.order_status_name
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("order_status", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['order_status']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select SS" options={ss}
                                                            handleChange={(e) => handleSelectedValueChange("ss", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['ss']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Payment Method" options={paymentMethods}
                                                            handleChange={(e) => handleSelectedValueChange("payment_method", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['payment_method']} />
                                                    </Grid>
                                                    <Grid item xs={16} style={{ marginTop: "40px" }}>
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />

                                                {/*Column 5 */}
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Products" options={product?.map(product => ({
                                                            value: product.id,
                                                            label: product.name,
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("product", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['product']} />                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Vendor" options={vendor?.map((status: any) => ({
                                                            value: status.user_id,
                                                            label: status.name
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("vendor", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['vendor']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Payment Status" options={paymentStatuses}
                                                            handleChange={(e) => handleSelectedValueChange("payment_status", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['payment_status']} />
                                                    </Grid>
                                                    <Grid item xs={16} className='col_p' style={{ marginTop: "40px" }}>
                                                    </Grid>
                                                </Grid>
                                            </MDTypography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MDBox>
                            <MDBox pt={3} className='table_custom'>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={true}
                                    entriesPerPage={true}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                            <MDBox mt={4.5}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} md={6} >
                                        <MDBox mb={3}>
                                            <PieChart
                                                //color="success"
                                                title="Order Status"

                                                //  date="updated 4 min ago"
                                                chart={reportsPieChartData}

                                            />
                                            {/* <PieChart
                                                // color="primary"
                                                title="Order Status"
                                                chart={{
                                                    labels: ['Completed', 'Pending', 'Cancelled'],
                                                    datasets: [{
                                                        label: "Sales",
                                                        data: [300, 50, 100],
                                                        backgroundColor: ['green', 'orange', 'red'], // Custom colors for each data point
                                                    }],
                                                }}
                                            /> */}
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <MDBox mb={3}>
                                            <ReportsBarChart
                                                color="info"
                                                title="Order Status wise Project"

                                                date="campaign sent 2 days ago"
                                                chart={reportsBarChartData}
                                            />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>

                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </>
    );
};
export default ViewOrder;
