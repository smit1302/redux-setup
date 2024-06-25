import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
import { useSelector } from "react-redux";

const ViewCustomerPayment = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [totalPaid, setTotalPaid] = useState<number>();
    const [totalUnpaid, setTotalUnpaid] = useState<number>();
    const [totalNetAmount, settotalNetAmount] = useState<number>();
    const [totalBadDebt, setTotalBadDebt] = useState<number>();
    const [rows, setRows] = useState<any>([]);
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
        customer_id: customerId.customer_id,
        payment_status: "",
        payment_method: "",
    });
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
    const [quickFilters, setQuickFilters] = useState<any[]>([]);

    const columns = [
        { Header: "Sr. No.", accessor: "", align: "center" },
        { Header: "Order ID", accessor: "order_id", align: "center" },
        { Header: "Order Date", accessor: "order_date", align: "center" },
        { Header: "Net Amount", accessor: "", align: "center" },
        { Header: "Installment", accessor: "user_email", align: "center" },
        { Header: "I. Amount", accessor: "amount", align: "center" },
        { Header: "Expected Date", accessor: "delivery_date", align: "center" },
        { Header: "Status", accessor: "payment_status", align: "center" },
        { Header: "Paid Date", accessor: "payment_date", align: "center" },
        { Header: "Mode", accessor: "payment_mode", align: "center" },
        { Header: "Remarks", accessor: "", align: "center" },
    ];

    const paymentData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            customer_id: filter.customer_id || "",
            payment_method: filter.payment_method || "",
            order_payment_status: filter.payment_status || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.payment,
                query: query,
            });
            setRows(response?.data?.data.orderPayments);
            setTotalPaid(response?.data?.data.totalPaid);
            setTotalUnpaid(response?.data?.data.totalUnpaid);
            settotalNetAmount(response?.data?.data.totalNetAmount);
            setTotalBadDebt(response?.data?.data.totalBadDebt);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSelectData = async () => {
        try {
            const orderMaster: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.master,
            });
            const masterData = orderMaster.data.data;
            const paymentMethods = filterMasterDataByType(masterData, 'payment_method_master');
            const paymentStatuses = filterMasterDataByType(masterData, 'payment_status_master');
            setPaymentMethods(paymentMethods);
            setPaymentStatuses(paymentStatuses);
        } catch (error) {
            console.log(error);
        }
    };

    const filterMasterDataByType = (masterData: any[], type: string) => {
        return masterData.filter((item: any) => item.type === type).map((typeItem: any) => ({
            value: typeItem.id,
            label: typeItem.name,
        }));
    };

    useEffect(() => {
        setTimeout(() => {
            // fetchSelectData();
            paymentData();
        }, 100);
    }, [filter]);



    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };


    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                // setPaymentMethods(response.data.data.payment_method);
                // setPaymentStatuses(response.data.data.payment_status);
                setQuickFilters(response.data.data.quick_filter);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        fetchSelectData();
    }, [filter]);

    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card className='module_wrap'>
                            <MDBox
                                className='module_head'
                                mx={2}
                                mt={-3}
                                py={2}
                                px={2}
                                variant="gradient"
                                bgColor={sidenavColor}
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    variant="h6"
                                    color="white"
                                >
                                    Order Payment
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2} pb={3}>
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

                                                <MDInput
                                                    label="Search Keyword"
                                                    placeholder="Keyword"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        color: "white",
                                                    }}
                                                    value={filter.search}
                                                    onChange={handleSearchChange}
                                                />
                                                <MDInput
                                                    label="From"
                                                    type="date"
                                                    className={filter.from_date ? "has-value" : ""}
                                                    value={filter.from_date}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        handleChange(
                                                            "from_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <MDInput
                                                    label="To"
                                                    type="date"
                                                    className={filter.to_date ? "has-value" : ""}
                                                    value={filter.to_date}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        handleChange(
                                                            "to_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />


                                                <Select placeholder="Select Order Payment Status" options={paymentStatuses}
                                                    value={filter['payment_status']}
                                                    handleChange={(value) => handleChange("payment_status", value.target.value)} />

                                                <Select placeholder="Select Payment Method" options={paymentMethods}
                                                    value={filter['payment_method']}
                                                    handleChange={(value) => handleChange("payment_method", value.target.value)} />


                                                {/* <Select
                                            placeholder="Quick Filter"
                                            options={quickFilters.map(
                                                (
                                                    status: any
                                                ) => ({
                                                    value: status.id,
                                                    label: status.label,
                                                })
                                            )}
                                            handleChange={(
                                                value: string
                                            ) => {
                                                // Handle selected payment status
                                            }}
                                        /> */}

                                            </MDTypography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MDBox>

                            <MDBox pt={6} pb={3}>
                                <Card>
                                    <MDBox pt={1} className='table_custom'>
                                        <DataTable
                                            table={{ columns, rows }}
                                            isSorted={true}
                                            entriesPerPage={true}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    </MDBox>
                                </Card>
                                <Card style={{ marginTop: "30px" }}>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2}>
                                            <MDInput label="Total Net Amount" disabled={true} style={{ width: '800px' }}></MDInput>
                                        </Grid>
                                        <Grid mb={2}>
                                            <MDInput label="$" value={`$${totalNetAmount}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2}>
                                            <MDInput label="Total Paid Amount" disabled={true} style={{ width: '800px' }} ></MDInput>
                                        </Grid>
                                        <Grid mb={2}>
                                            <MDInput label="$" value={`$${totalPaid}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2} >
                                            <MDInput label="Total Unpaid Amount" disabled={true} style={{ width: '800px' }} ></MDInput>
                                        </Grid>
                                        <Grid mb={2}>
                                            <MDInput label="$" value={`$${totalUnpaid}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className='row_bx gap_15'>
                                        <Grid ml={4} mb={2}>
                                            <MDInput label="Total Bad debt" disabled={true} style={{ width: '800px' }}></MDInput>
                                        </Grid>
                                        <Grid mb={2}>
                                            <MDInput label="$" value={`$${totalBadDebt}`} disabled={true} ></MDInput>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </MDBox>
                        </Card>
                        <MDBox pt={6} pb={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card style={{ width: '100%', maxWidth: '600px', height: '100px', padding: '20px' }}>
                                        Paid And Unpaid Amount
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card style={{ width: '100%', maxWidth: '600px', height: '100px', padding: '20px' }}>
                                        Month Wise Payment
                                    </Card>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </>
    );
};

export default ViewCustomerPayment;
