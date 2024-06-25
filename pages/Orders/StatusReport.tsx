import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import { service } from "utils/Service/service";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDInput from "components/MDInput";
import { showFormattedDate } from "utils/common";
import Select from "common/Select";
import { useForm } from "react-hook-form";
import SelectComponent from "components/MDSelect";

interface NewsLetterProps {
    method: string;
}

interface ReportData {
    order_id: number,
    order_product_id: number,
    today_status_id: number,
    memo: string
}

const ViewStatus: React.FC<NewsLetterProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const { register, handleSubmit, trigger, setValue, getValues, unregister } = useForm<ReportData[]>();
    const [rows, setRows] = useState<any>([]);
    const [orderStatus, setOrderStatus] = useState<any[]>([]);
    const [statusId, setStatusId] = useState<number[]>([]);

    const fetchOrderStatus = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order_status.list,
            });
            setOrderStatus(() => {
                return response?.data.data.map((status: any) => {
                    return { value: status.order_status_id, label: status.order_status_name };
                });
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchOrderStatus();

    }, [])

    // useEffect(() => {
    //     //   handleStatusChange(0, 0)
    // }, [])

    const columns = [
        {
            Header: "Sr. No.", accessor: "", align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <span>{row.index + 1}</span>
                </div>
            )
        },
        {
            Header: "Order Id", accessor: "order_id", align: "center"
        },
        {
            Header: "Order Date",
            accessor: "order_date",
            align: "center",
            Cell: (record: any) => showFormattedDate(record.row.original.order_date),
        },
        { Header: "Product", accessor: "product_name", align: "center" },
        { Header: "Customer", accessor: "user_email", align: "center" },
        { Header: "Pre Status", accessor: "pre_status", align: "center" },
        {
            Header: "Today Status", accessor: "today_status_id", align: "center",
            Cell: ({ row }: any) => (
                <>
                    <Grid item xs={12} className='col_p'>
                        <SelectComponent
                            value={statusId[row.index]}
                            {...register(`${row.index}.today_status_id`)}
                            placeholder='Today Status'
                            options={orderStatus}
                            handleChange={(event: any) => handleStatusChange(event.target, row.index)}
                        />
                        <MDBox
                            sx={{
                                width: '120px',
                            }}
                        />
                    </Grid>
                </>
            )
        },
        {
            Header: "Memo", accessor: "", align: "center",
            Cell: ({ row }: any) => (
                <div>
                    <span>
                        <MDInput {...register(`${row.index}.memo`)} />
                    </span>
                </div>
            )
        },
    ];

    const fetchData = async () => {
        const query = {
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.file_daily_report_list,
                query: query,
            });
            setRows(response?.data.data || []);
            response?.data.data.forEach((rowData: any, index: number) => {
                setValue(`${index}.order_id`, rowData.order_id);
                setValue(`${index}.order_product_id`, rowData.order_product_id);
                setValue(`${index}.today_status_id`, rowData.today_status_id);
                setValue(`${index}.memo`, rowData.memo);
                setStatusId((prevStatusIds) => {
                    const newStatusIds = [...prevStatusIds];
                    newStatusIds[index] = rowData.today_status_id;
                    return newStatusIds;
                });
            });
            trigger();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 100);
    }, []);

    const onSubmit = async (reportData: ReportData[]) => {
        try {
            const dataArray = Object.values(reportData);

            await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.file_daily_report_create,
                body: dataArray,
            });
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleStatusChange = (selectedOption: any, rowIndex: number) => {
        setStatusId((prevStatusIds) => {
            debugger
            const newStatusIds = [...prevStatusIds];
            newStatusIds[rowIndex] = selectedOption.value;
            return newStatusIds;
        });
        setValue(`${rowIndex}.today_status_id`, selectedOption.value);
        // trigger();
        trigger(`${rowIndex}.today_status_id`);
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: "20px" }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    File Daily Report
                                </MDTypography>
                            </MDBox>

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
                        <div className='action_wrap' style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginRight: "40px" }}>
                            <MDButton className='action-button' onClick={handleSubmit(onSubmit)} color={sidenavColor}>
                                Submit
                            </MDButton>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </>
    );
};

export default ViewStatus;
