import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Card } from "@mui/material";
import { service } from "utils/Service/service";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import Select from "components/MDSelect";
import { Row } from "react-table";
import { showFormattedDate } from "utils/common";
import { useSelector } from "react-redux";

const ViewCustomerOrder = () => {
    const history = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [rows, setRows] = useState<any>([]);
    const [selectedValues, setSelectedValues] = useState({
        try_jobs: false,
        pm: "",
        bde: "",
        ss: "",
        product: "",
        vendor: "",
        try_jobs_list: false,
    });
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
    });
    const [pm, setPm] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
    const [quickFilters, setQuickFilters] = useState<any[]>([]);
    const [orderActions, setOrderActions] = useState<number[]>([]);
    const [selectedAction, setSelectedAction] = useState<number | null>(null);
    const [totalResponses, setTotalResponses] = useState<number>(0); // State to hold the total responses
    const [totalSum, setTotalSum] = useState<number>(0); // State to hold the sum of total fields
    const [thisPageTotal, setThisPageTotal] = useState<number>(0); // State to hold the sum of total fields
    const [product, setProduct] = useState<any[]>([]);

    const customerId = useSelector((state: any) => state?.commonData.commonData);
    console.log("   customer_id:", customerId)

    const columns = [
        {
            Header: 'Sr. No.',
            Cell: ({ row }: any) => (
                <div> <span>{row.index + 1}</span></div>
            )
        },
        { Header: "website", accessor: "website", align: "center" },
        { Header: "Job ID", accessor: "order_id", align: "center" },
        {
            Header: "Expected", accessor: "delivery_date", align: "center",
            Cell: (record: any) =>
                showFormattedDate(record.row.original.delivery_date),
        },
        { Header: "Order Product", accessor: "products", align: "center" },
        { Header: "SS", accessor: "ss", align: "center" },
        { Header: "BD", accessor: "bde", align: "center" },
        { Header: "Vendor/PM", accessor: "pm", align: "center" },
        // { Header: "Job Task", accessor: "", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        {
            Header: "Activity", align: "center", Cell: ({ row }: any) => (
                <div>
                    <span>Count: {(row.original.activities_count)}</span>
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
                            <Select
                                options={options}
                                value={selectedAction}
                                handleChange={(selectedOption: any) => {
                                    setSelectedAction(selectedOption.target.value);
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
        }


    ];

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

    const fetchDropdownData = async () => {
        try {
            const filterUserDataByRole = (userData: any[], roleName: string) => {
                return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
                    value: user.user_id,
                    label: user.name,
                }));
            };

            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const pm = filterUserDataByRole(userRoleWise, 'pm');
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            setPm(pm);
            setBde(bde);

        } catch (error) {
            console.log(error);
        }
    };
    const fetchOrderData = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });
            setOrderActions(response.data.data.order_action || []);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchDropdownData();
        fetchOrderData();
    }, [filter]);


    useEffect(() => {
        fetchData();
    }, [filter, selectedValues]);

    const fetchData = async () => {
        const bodyData = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            product: selectedValues.product || "",
            pm: selectedValues.pm || "",
            bde: selectedValues.bde || "",
            customer_id: customerId.customer_id,
            try_jobs_list: selectedValues.try_jobs_list,
            try_jobs: selectedValues.try_jobs,
        };

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: bodyData,
            });
            const filteredRows = response?.data.data || [];

            setRows(filteredRows);

            // Calculate and set the total responses
            if (response?.data.total) {
                setTotalResponses(response.data.total);
            }

            // Calculate and set the sum of total fields
            if (filteredRows.length > 0) {
                const sum = filteredRows.reduce((acc: number, item: any) => {
                    return acc + item.total;
                }, 0);
                setTotalSum(sum);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            console.log("API PRODUCT", product);
            setProduct(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };


    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (rows.length > 0) {
            const sum = rows.reduce((acc: number, item: any) => {
                return acc + item.total;
            }, 0);
            setThisPageTotal(sum);
        } else {
            setThisPageTotal(0); // Reset to 0 when there are no rows
        }
    }, [rows]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setPaymentMethods(response.data.data.payment_method);
                setPaymentStatuses(response.data.data.payment_status);
                setQuickFilters(response.data.data.quick_filter);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        fetchProduct();
    }, []);

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Orders
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2} pb={3} className='col_bx_inner'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: "20px" }}>
                                            <MDTypography
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                variant="h6"
                                                color="white"
                                            >
                                                <Grid container spacing={3} className='col_item'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <MDInput label="Search Keyword" placeholder="Keyword" value={filter.search} onChange={handleSearchChange} />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <MDInput label="From" type="date" className={filter.from_date ? "has-value" : ""} value={filter.from_date} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleChange("from_date", e.target.value)} />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <MDInput label="To" type="date" className={filter.to_date ? "has-value" : ""} value={filter.to_date}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                handleChange("to_date", e.target.value)} />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <Select placeholder="Select Products" options={product?.map(product => ({
                                                            value: product.id,
                                                            label: product.name,
                                                        }))}
                                                            handleChange={(e) => handleSelectedValueChange("product", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['product']} />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <Select placeholder="Select PM" options={pm}
                                                            handleChange={(e) => handleSelectedValueChange("pm", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['pm']} />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={2} className='col_bx_inner'>
                                                    <Grid item xs={12} className='col_p'>
                                                        <Select placeholder="Select BDE" options={bde}
                                                            handleChange={(e) => handleSelectedValueChange("bde", e.target.value)} optionFontSize="16px"
                                                            value={selectedValues['bde']} />
                                                    </Grid>
                                                </Grid>
                                            </MDTypography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MDBox>

                            <Card>
                                <MDBox pb={3}>
                                    <MDBox pt={1}>
                                        <DataTable
                                            table={{ columns, rows }}
                                            isSorted={true}
                                            entriesPerPage={true}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </MDBox>
                            </Card>
                            <MDBox>
                            </MDBox>
                            <MDBox>
                                <Card>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2} className='col_item'>
                                            <MDInput label="This Page Total" disabled={true} style={{ width: '800px' }}></MDInput>
                                        </Grid>
                                        <Grid >
                                            <MDInput value={`$${thisPageTotal}`} disabled />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2} className='col_item'>
                                            <MDInput label="All Page Total" disabled={true} style={{ width: '800px' }}></MDInput>
                                        </Grid>
                                        <Grid className='col_item'>
                                            <MDInput value={`$${totalSum}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </MDBox>
                        </Card >
                        <MDBox pt={6} pb={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card style={{ width: '100%', maxWidth: '600px', height: '100px' }}>
                                        Order Status
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card style={{ width: '100%', maxWidth: '600px', height: '100px' }}>
                                        Order Posted
                                    </Card>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid >
                </Grid >
            </MDBox >
            <Footer />
        </>
    );
};

export default ViewCustomerOrder;
