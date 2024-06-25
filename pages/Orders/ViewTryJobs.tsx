import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
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
import Select from "common/Select";
import { showFormattedDate } from "utils/common";
import { useDispatch, useSelector } from "react-redux";
import ExportToCsv from "utils/ExportToCsv";
import { addData } from "../../redux/features/commonData/commonData";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SelectComponent from "components/MDSelect";
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import MessageIcon from '@mui/icons-material/Message';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface ViewOrderProps {
    method: string;
}

const ViewTryJobs: React.FC<ViewOrderProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [pm, setPm] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [ss, setSs] = useState<any[]>([]);
    const [vendor, setVendor] = useState<any[]>([]);
    const [orderStatus, setOrderStatus] = useState<any[]>([]);
    const [quickFilters, setQuickFilters] = useState<any[]>([]);
    const [platform, setPlatform] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const organizationId = useSelector((state: any) => state?.commonData.commonData);
    const [keyword, setKeyword] = useState<string>("");
    const [resetState, setResetState] = useState(false);
    const [selectedValues, setSelectedValues] = useState({
        platform: "",
        from_date: "",
        to_date: "",
        pm: "",
        bde: "",
        order_status: "",
        ss: "",
        product: "",
        vendor: "",
        scope_of_work: "",
        try_jobs_list: true // To display only try jobs
    });
    console.log("CHECKING", selectedValues);
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
                        onChange={() => handleCheckboxChange(row.original.order_id)}
                    /> <span>{row.index + 1}</span>
                </div>
            )
        },
        {
            Header: "Website", accessor: "website", align: "center", width: 150,
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.website}
                        <IconButton onClick={() => handleAllocationNavigation(row.original.order_id)}>
                            <ArticleIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                        <IconButton onClick={() => handleMessageNavigation(row.original.order_product_id)}>
                            <MessageIcon />
                        </IconButton>
                        <IconButton onClick={() => handleScopeNavigation(row.original.order_product_id)}>
                            <InsertDriveFileIcon />
                        </IconButton>
                    </div>
                </div>
            ),
        },
        {
            Header: "Job ID",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.order_id}</div>
                    <div>{showFormattedDate(row.original.order_date)}
                    </div>
                </div>
            ),
        },
        {
            Header: "Customer",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <MDTypography color={sidenavColor}><div onClick={() => handleProfileNavigation(row.original.customer_id)} >{row.original.user_name}</div></MDTypography>
                    <div>{row.original.user_email}</div>
                </div>
            ),
        },
        { Header: "Order Product", accessor: "products", align: "center" },
        {
            Header: "Team", align: "center", Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.pm} (PM)</div>
                    <div>{row.original.bde} (BDE)</div>
                    <div>{row.original.ss} (SS)</div>
                </div>
            ),
        },
        {
            Header: "Job Task", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span> 0%</span> {/*Count of progress of task based on task allocation which will be done in the next phase */}
                </div>)
        },
        { Header: "Status", accessor: "status", align: "center" },
        {
            Header: "Expected", align: "center", Cell: ({ row }: any) => (
                <div>
                    <div>{showFormattedDate(row.original.delivery_date)}</div>
                </div>
            )
        },
        {
            Header: "Activity", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span>Count: {(row.original.activities_count)}</span>
                </div>
            )
        },
    ];

    const fetchFreeJobData = async () => {
        try {
            console.log("ORGANIZATION ID", organizationId.organization_id)
            const bodyData: any = {
                search: filter.search.length > 2 ? filter.search : "",
                from_date: filter.from_date || "",
                to_date: filter.to_date || "",
                order_status: selectedValues.order_status || "",
                platform: selectedValues.platform || "",
                pm: selectedValues.pm || "",
                bde: selectedValues.bde || "",
                ss: selectedValues.ss || "",
                vendor: selectedValues.vendor || "",
                scope_of_work: selectedValues.scope_of_work || "",
                try_jobs_list: selectedValues.try_jobs_list,
            };
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: bodyData,
            });
            setRows(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchSelectData();
        fetchFreeJobData();
    }, [index]);

    useEffect(() => {
        if (resetState) {
            fetchFreeJobData();
            setResetState(false)
        }
    }, [resetState]);

    const fetchSelectData = async () => {
        try {
            const orderStatus: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order_status.list,
            });
            setOrderStatus(orderStatus?.data?.data)

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

        } catch (error) {
            console.log(error);
        }
    };

    const filterUserDataByRole = (userData: any[], roleName: string) => {
        return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
            value: user.user_id,
            label: user.name,
        }));
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (order_id: number) => {
        setSelectedOrder(order_id);
        dispatchData(addData({ key: "order_id", data: order_id }));
    };

    const handleMessageNavigation = (id?: number) => {
        dispatchData(addData({ key: "order_product_id", data: id }));
        dispatchData(addData({ key: "value", data: 3 }));
        history(`/my-order`);
    };

    const handleScopeNavigation = (id?: number) => {
        dispatchData(addData({ key: "order_product_id", data: id }));
        dispatchData(addData({ key: "value", data: 3 }));
        history("/scope-of-work");
    };

    const handleAllocationNavigation = (id?: number) => {
        dispatchData(addData({ key: "order_id", data: id }));
        dispatchData(addData({ key: "value", data: 3 }));
        history("/order-allocation");
    };

    const handleProfileNavigation = (id?: number) => {
        dispatchData(addData({ key: "customer_id", data: id }));
        dispatchData(addData({ key: "value", data: 6 }));
        history(`/my-order`);
    };

    const handleReset = () => {
        setSelectedValues({
            platform: "",
            scope_of_work: "",
            from_date: "",
            to_date: "",
            pm: "",
            bde: "",
            order_status: "",
            ss: "",
            product: "",
            vendor: "",
            try_jobs_list: true
        });
        setFilter({
            from_date: "",
            to_date: "",
            search: "",
        })
        setResetState(true);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleSearch = () => {
        fetchFreeJobData();
    };

    const downloadCsv = () => {
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action');
        const header = filteredColumns?.map(col => col.Header);
        const csv = rows
            ?.map((row: any) =>
                filteredColumns
                    ?.map(col => {
                        if (col.accessor === 'created_at') {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Try_jobs.csv";
        ExportToCsv(convertedData, fileName)
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: "20px" }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Try Jobs
                                    <div className='action_wrap d_flex'>
                                        <MDButton className='action-button' onClick={downloadCsv} color={'white'} children={<SystemUpdateAltIcon />} />
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
                                                    <Grid item xs={11} className='col_p'>
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
                                                    <Grid item xs={16} style={{ marginTop: "40px" }}></Grid>
                                                </Grid>

                                                <Box m={1} />
                                                {/*Column 2 */}
                                                <Grid container spacing={2} className='col_bx_inner' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                                    <Grid item xs={12} className='col_p action_wrap' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <Grid item xs={16} style={{ marginTop: "40px" }}>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />

                                                {/*Column 5 */}
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Select Vendor" options={vendor?.map((status: any) => ({
                                                            value: status.user_id,
                                                            label: status.name
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("vendor", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['vendor']} />
                                                    </Grid>
                                                    <Grid item xs={12} className='col_p'>
                                                        <SelectComponent placeholder="Quick Filter" options={quickFilters?.map((status: any) => ({
                                                            value: status.id,
                                                            label: status.label,
                                                        }))}
                                                            handleChange={(value: string) => { }} />
                                                    </Grid>
                                                    <Grid item xs={16} style={{ marginTop: "40px" }} ></Grid>
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
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </>
    );
};
export default ViewTryJobs;
