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
import { useSelector } from "react-redux";
import { showFormattedDate } from "utils/common";
import SelectComponent from "components/MDSelect";
import MDButton from "components/MDButton";

interface OrderPaymentProps {
    method: string;
}

const ViewOrderPayment: React.FC<OrderPaymentProps> = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const orderId = useSelector((state: any) => state?.commonData.commonData);
    const history = useNavigate();
    const [rows, setRows] = useState<any>([]);
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
    const [totalPaid, setTotalPaid] = useState<number>();
    const [totalUnpaid, setTotalUnpaid] = useState<number>();
    const [totalNetAmount, settotalNetAmount] = useState<number>();
    const [totalBadDebt, setTotalBadDebt] = useState<number>();
    const [orderPaymentStatus, setOrderPaymentStatus] = useState<string>();
    const [quickFilters, setQuickFilters] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [selectedValues, setSelectedValues] = useState({
        payment_method: "",
        payment_status: "",
        quick_filter: "",
    });
    const columns = [
        {
            Header: 'Select',
            //accessor: 'sr_no',
            Cell: ({ row }: any) => (
                <input
                    type="checkbox"
                    checked={selectedOrder === row.original.order_id}
                    onChange={() => handleCheckboxChange(row.original.order_id)}
                />
            )
        },
        { Header: "Website", accessor: "website", align: "center", width: 150 },
        {
            Header: "Order ID",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.order_id}</div>
                    <div>{showFormattedDate(row.original.order_date)}</div>
                </div>
            ),
        },
        {
            Header: "Customer",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.user_name}</div>
                    <div>{row.original.user_email}</div>
                </div>
            ),
        },
        { Header: "Order Product", accessor: "products", align: "center" },
        {
            Header: "Payment",
            align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.amount}</div>
                    <div>{row.original.amount_status}</div>
                </div>
            ),
        },
        {
            Header: "Team", accessor: "pm", align: "center",
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

    const paymentData = async () => {
        const query = {
            order_id: orderId.order_id,
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            payment_method: selectedValues.payment_method || "",
            payment_status: selectedValues.payment_status || "",
        };
        console.log("ORDERID", orderId.order_id)
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
            setOrderPaymentStatus(response?.data?.data.orderPaymentStatus)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchSelectData();
            paymentData();
        }, 100);
    }, [filter, selectedValues]);

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id
                );
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: "20px" }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Order Payments
                                </MDTypography>
                            </MDBox>
                            <MDBox className='table_custom' mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'>
                                <Grid container spacing={3}>
                                    <Grid item xs={8} md={3} lg={2}>
                                        <MDInput label="Search Keyword" placeholder="Keyword" style={{ backgroundColor: "white" }} value={filter.search} onChange={handleSearchChange} />
                                    </Grid>
                                    <Grid item xs={8} md={3} lg={2}>
                                        <MDInput label="From" type="date" className={filter.from_date ? "has-value" : ""} value={filter.from_date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("from_date", e.target.value)} />
                                    </Grid>
                                    <Grid item xs={8} md={3} lg={2}>
                                        <MDInput label="To" type="date" className={filter.to_date ? "has-value" : ""} value={filter.to_date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("to_date", e.target.value)} />
                                    </Grid>
                                    <Grid item xs={8} md={3} >
                                        <SelectComponent placeholder="Select Payment Method" options={paymentMethods}
                                            handleChange={(e) => handleSelectedValueChange("payment_method", e.target.value)} optionFontSize="16px"
                                            value={selectedValues['payment_method']} />
                                    </Grid>
                                    <Grid item xs={8} md={3} >
                                        <SelectComponent placeholder="Select Payment Status" options={paymentStatuses}
                                            handleChange={(e) => handleSelectedValueChange("payment_status", e.target.value)} optionFontSize="16px"
                                            value={selectedValues['payment_status']} />
                                    </Grid>
                                    <Grid item xs={8} md={3} lg={2}>
                                        {/* <Select placeholder="Quick Filter" options={quickFilters.map((status: any) => ({
                                            value: status.id,
                                            label: status.label,
                                        }))}
                                            handleChange={() => { }} /> It will be covered in part 2*/}
                                    </Grid>
                                </Grid>
                            </MDBox>
                            <MDBox pt={1}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={true}
                                    entriesPerPage={true}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>

                            <Card>
                                <Grid container spacing={2} className='row_bx gap_15'>
                                    <Grid ml={4} mb={2} className='col_item'>
                                        <MDInput label="Total Net Amount" disabled={true} style={{ width: '900px' }}></MDInput>
                                    </Grid>
                                    <Grid className='col_item'>
                                        <MDInput label={`$ ${totalNetAmount}`} disabled={true} ></MDInput>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className='row_bx gap_15'>
                                    <Grid ml={4} mb={2} className='col_item'>
                                        <MDInput label="Total Paid Amount" disabled={true} style={{ width: '900px' }} ></MDInput>
                                    </Grid>
                                    <Grid className='col_item'>
                                        <MDInput label={`$ ${totalPaid}`} disabled={true} ></MDInput>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className='row_bx gap_15'>
                                    <Grid ml={4} mb={2} className='col_item'>
                                        <MDInput label="Total Unpaid Amount" disabled={true} style={{ width: '900px' }} ></MDInput>
                                    </Grid>
                                    <Grid className='col_item'>
                                        <MDInput label={`$ ${totalUnpaid}`} disabled={true} ></MDInput>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className='row_bx gap_15'>
                                    <Grid ml={4} mb={2} className='col_item'>
                                        <MDInput label="Total Bad debt" disabled={true} style={{ width: '900px' }}></MDInput>
                                    </Grid>
                                    <Grid className='col_item'>
                                        <MDInput label={`$ ${totalBadDebt}`} disabled={true} ></MDInput>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Card>

                        <Grid container spacing={2} className='mt-0'>
                            <Grid item xs={12} md={6} lg={4} className='col_item'>
                                <MDBox className='col_heading mt-0' mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="h5" color="white">
                                        Order Payment Status
                                    </MDTypography>
                                </MDBox>
                                <MDBox className='content_bx' ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                    <MDTypography variant="h5" color="black" aligncontent="center">
                                        {`${orderPaymentStatus}`}
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} className='col_item'>
                                <MDBox className='col_heading mt-0' mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="h5" color="white">
                                        Order Amount & Recieved Amount
                                    </MDTypography>
                                </MDBox>
                                <MDBox className='content_bx' ml={3} pt={3} style={{ width: '100%', height: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                    <MDTypography variant="h5" color="black" aligncontent="center">
                                        <> <div> Recieved Amount  {`${totalPaid}`} </div>
                                            <div>Order Amount {`${totalNetAmount}`}</div>
                                        </>
                                    </MDTypography>
                                </MDBox>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>
            </MDBox >
            <Footer />
        </>
    );
};

export default ViewOrderPayment;
