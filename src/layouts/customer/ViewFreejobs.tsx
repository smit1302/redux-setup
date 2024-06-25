import React, { useState, useEffect } from 'react';
import { Box, Card, Grid } from '@mui/material';
import { service } from 'utils/Service/service';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import { useMaterialUIController } from 'context';
import { showFormattedDate } from 'utils/common';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
import MDInput from 'components/MDInput';
import ExportToCsv from 'utils/ExportToCsv';
import { useSelector } from 'react-redux';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const ViewFreejobs = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [rows, setRows] = useState<any>([]);
    const [orderStatus, setOrderStatus] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
        order_status: "",
        try_jobs_list: true,
    });
    const customerId = useSelector((state: any) => state?.commonData.commonData);

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
        { Header: "PM", accessor: "pm", align: "center" },
        // { Header: "Job Task", accessor: "", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },

    ];

    useEffect(() => {
        setTimeout(() => {
            fetchData();
            fetchDropdownData();
        }, 100);
    }, [filter]);


    const fetchDropdownData = async () => {
        try {
            const orderStatus: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order_status.list,
            });
            setOrderStatus(orderStatus?.data?.data)
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        const bodyData = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            order_status: filter.order_status || "",
            customer_id: customerId.customer_id,
            try_jobs_list: filter.try_jobs_list,
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.listOrder,
                body: bodyData,
            });
            setRows(Array.isArray(response?.data.data) ? response?.data.data : []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleChange = (name: string, value: any) => {
        setFilter((prevData) => ({ ...prevData, [name]: value.target.value }));
    };

    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
        );
        const header = filteredColumns?.map((col) => col.Header);
        const csv = rows
            ?.map((row: any) =>
                filteredColumns
                    ?.map((col) => {
                        if (col.accessor === "registered_date") {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Customer_freejobs.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Customer Free Jobs
                                    <MDButton className="action-button" onClick={downloadCsv} color={'white'} children={<SystemUpdateAltIcon />} />
                                </MDTypography>
                            </MDBox>

                            <MDBox pb={3} className='col_bx_inner'>
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
                                                        <MDInput
                                                            label="Search Keyword"
                                                            placeholder="Keyword"
                                                            value={filter.search}
                                                            onChange={handleSearchChange}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Box m={1} />
                                                <Grid container spacing={3} className='col_item'>
                                                    <Grid item xs={12} className='col_p'>
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
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={3} className='col_item'>
                                                    <Grid item xs={12} className='col_p'>
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
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box m={1} />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Select placeholder="Select Order Status" options={orderStatus.map((status: any) => ({
                                                            value: status.order_status_id,
                                                            label: status.order_status_name
                                                        }))}
                                                            value={filter['order_status']}
                                                            handleChange={(value: string) => handleChange("order_status", value)} /></Grid>
                                                </Grid>
                                            </MDTypography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MDBox>
                            <MDBox pt={6} pb={3}>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: '20px' }}>
                                            <MDBox pt={2} pb={3}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                            {/* You can add any additional components or elements here */}
                                                        </MDTypography>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                            <MDBox pt={1} className='table_custom'>
                                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Footer />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>

    );
};

export default ViewFreejobs;


