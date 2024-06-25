import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { service } from "utils/Service/service";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../../common/ConfirmModal";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDInput from 'components/MDInput';
import MDButton from "components/MDButton";
import { showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useSelector } from "react-redux";


const ListClientGroup: React.FC = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [rows, setRows] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const group = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.["Client Group"]);
    const history = useNavigate();
    const [filter, setFilter] = useState({
        search: "",
        from_date: "",
        to_date: "",
    });
    const columns = [
        {
            Header: 'Select', accessor: 'select',
            Cell: ({ row }: { row: any }) => {
                return (
                    <>
                        {
                            group?.delete &&
                            <Checkbox
                                checked={selectedIds.includes(row.original.customer_group_id)}
                                onChange={() => handleCheckboxChange(row.original.customer_group_id)}
                            />
                        }
                    </>
                )
            }, disableSortBy: true,
        },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }: { row: any }) => (
                <>
                    {
                        group.view &&
                        <IconButton onClick={() => handleToggleView(row.original.customer_group_id)}>
                            <VisibilityIcon />
                        </IconButton>
                    }
                    {
                        group.update &&
                        <IconButton onClick={() => handleNavigateUpdate(row.original.customer_group_id)}>
                            <EditIcon />
                        </IconButton>
                    }
                    {
                        group.delete &&
                        <IconButton onClick={() => handleToggleDelete(row.original.customer_group_id)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    }
                </>
            ),
        },
        { Header: 'ID', accessor: 'customer_group_id' },
        { Header: 'Website', accessor: 'website', align: 'center', width: 150 },
        {
            Header: 'Created Date', accessor: 'created_at',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at), width: 150
        },
        { Header: 'Client Group Title', accessor: 'name' },
        {
            Header: 'Is Active', accessor: 'is_active',
            Cell: ({ row }: { row: any }) => (
                <Switch disabled={!group.update} onClick={() => handleToggleStatus(row.original.customer_group_id)} checked={row.original.is_active} />
            ),
        },
    ];

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.get,
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
    const handleDelete = async () => {
        console.log("IDS SELECTED", selectedIds)
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    }

    const handleToggleStatus = (customer_group_id?: number) => {
        setIndex(customer_group_id || undefined);
        setUpdateOpen(prevState => !prevState);
        if (customer_group_id === undefined) {
        }
    };
    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleToggleDelete = (customer_group_id?: number) => {
        setIndex(customer_group_id || undefined);
        setDeleteOpen(prevState => !prevState);
        if (customer_group_id === undefined) {
        }
    };

    const handleNavigateUpdate = (customer_group_id: number) => {
        history(`/client-group/update/${customer_group_id}`);
    }

    const handleToggleView = async (customer_group_id: number) => {
        history(`/client-group/view/${customer_group_id}`);
    };

    const handleNavigation = () => {
        history('/client-group/add');
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
        const fileName: string = "Client_group.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "10px" }} className='module_wrap'>
                                <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        Client Group
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className="action-button" variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {group?.create && <MDButton sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} className="action-button" />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3}>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12}>
                                            <Card style={{ padding: "10px" }}>
                                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={2}>

                                                            <MDInput
                                                                label="From"
                                                                type="date"

                                                                value={filter.from_date}
                                                                className={filter.from_date ? "has-value" : ""}
                                                                onChange={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) =>
                                                                    handleChange(
                                                                        "from_date",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={2}>
                                                            <MDInput
                                                                label="To"
                                                                type="date"

                                                                value={filter.to_date}
                                                                className={filter.to_date ? "has-value" : ""}
                                                                onChange={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) =>
                                                                    handleChange(
                                                                        "to_date",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </MDTypography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </MDBox>

                                <MDBox pt={3} className='table_custom'>
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
                                    group?.delete &&
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
                message="Do you want to delete the client group?"
                method={service.Methods.DELETE}
                url={service.API_URL.customer_group.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='are you sure, you want to delete client Group?' method={service.Methods.DELETE} url={service.API_URL.customer_group.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={[index]} />
            <Confirm message='are you sure, you want to update client Group?' method={service.Methods.GET} url={service.API_URL.customer_group.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />       </>
    )
}

export default ListClientGroup;
