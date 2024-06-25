import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate, } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../../common/ConfirmModal";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDInput from 'components/MDInput';
import { showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useSelector } from "react-redux";

const ListOrderSatus: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [filter, setFilter] = useState({
        search: '',
    });
    const status = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Settings?.["Order Status"]);


    const columns = [
        {
            Header: 'Select',
            accessor: 'select',
            Cell: (record: any) => {
                const id = record.row.original.order_status_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            status?.delete &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                    </>
                );
            },
            width: 200,
        },
        { Header: 'ID', accessor: 'order_status_id' },
        { Header: 'Name', accessor: 'order_status_name' },
        { Header: 'Display Label', accessor: 'is_for_order_job' },
        { Header: 'Shortform', accessor: 'order_status_short' },

        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <>
                        <Switch disabled={!status?.update} onClick={() => handleToggleStatus(record.row.original.order_status_id)} checked={record.row.original.is_active} />
                    </>
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                const id = record.row.original.order_status_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            status?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.order_status_id)} >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            status?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.order_status_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            status?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.order_status_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
    ];

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order_status.list,
                query: query,
            });
            setRows(response?.data?.data);

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [index, filter]);


    const handleDelete = async () => {
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    }
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

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });

    };
    const handleToggleDelete = (order_status_id?: number) => {
        setIndex(order_status_id || undefined);
        setDeleteOpen(prevState => !prevState);
        if (order_status_id === undefined) {
        }
    };

    const handleNavigateUpdate = (order_status_id: number) => {
        history(`/order-status/update/${order_status_id}`);
    }

    const handleToggleView = async (order_status_id: number) => {
        history(`/order-status/view/${order_status_id}`);
    };

    const handleNavigation = () => {
        history('/order-status/add');
    };

    const handleToggleStatus = (order_status_id?: number) => {
        setIndex(order_status_id || undefined);
        setUpdateOpen(prevState => !prevState);
        if (order_status_id === undefined) {
        }
    };
    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action" && col.accessor !== "select"
        );
        const header = filteredColumns.map((col) => col.Header);
        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map((col) => {
                        if (col.accessor === "created_at") {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Order_Status.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "10px" }}>
                                <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        Order Status
                                        <Grid>
                                            <MDButton variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {status?.create && <MDButton sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3}>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12}>
                                            <Card style={{ padding: "10px" }}>
                                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                    <Grid item xs={12} sm={2}>
                                                        <MDInput
                                                            label="Search Keyword"
                                                            placeholder="Keyword"
                                                            style={{ backgroundColor: "white" }}
                                                            value={filter.search}
                                                            onChange={handleSearchChange}
                                                        />

                                                    </Grid>
                                                </MDTypography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                </MDBox>
                            </Card>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "20px",
                                    marginRight: "40px",
                                }}
                            >
                                {
                                    status?.delete &&
                                    <MDButton onClick={handleDelete} color="error">
                                        Delete
                                    </MDButton>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm
                message="Do you want to delete the order Status?"
                method={service.Methods.DELETE}
                url={service.API_URL.order_status.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='are you sure, you want to delete OrderStatus?' method={service.Methods.DELETE} url={service.API_URL.order_status.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={[index]} />
            <Confirm message='are you sure, you want to update OrderSatus?' method={service.Methods.GET} url={service.API_URL.order_status.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}

export default ListOrderSatus;

