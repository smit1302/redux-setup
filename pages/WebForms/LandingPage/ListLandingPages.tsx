import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Checkbox, Grid } from "@mui/material";
import Confirm from "../../../common/ConfirmModal";
import { IconButton, Card } from "@mui/material";
import { service } from "utils/Service/service";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import EditIcon from '@mui/icons-material/Edit';
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useSelector } from "react-redux";

const ListLandingPage: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteMultipleOpen, setDeleteMultipleOpen] =
        useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<any>(undefined);
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const landingPage = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.["Landing Page"]);

    const columns = [
        { Header: "ID", accessor: "landing_page_id", align: "center" },
        {
            Header: "Action",
            accessor: "action",
            Cell: (record: any) => {
                const id = record.row.original.landing_page_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            landingPage?.update &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                        {
                            landingPage?.view &&
                            <IconButton
                                onClick={() =>
                                    handleToggleView(
                                        record.row.original.landing_page_id
                                    )
                                }
                            >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            landingPage?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.landing_page_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            landingPage?.delete &&
                            <IconButton
                                onClick={() =>
                                    handleToggleDelete(
                                        record.row.original.landing_page_id
                                    )
                                }
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                );
            },
            width: 200,
        },
        {
            Header: "Landing Page Name",
            accessor: "page_name",
            align: "center",
        },
        {
            Header: "Landing Page URL",
            accessor: "page_url",
            align: "center",
        },
        { Header: "Request Type", accessor: "request_type", align: "center" },
        { Header: "Lead Owner Name", accessor: "lead_owner", align: "center" },
        {
            Header: "Landing Page Owner Name",
            accessor: "page_owner",
            align: "center",
        },
        { Header: "Admin Email", accessor: "admin_email", align: "center" },
        { Header: "Subject Line", accessor: "email_subject", align: "center" },
        {
            Header: "Send Registration Email",
            accessor: "send_registration_email",
            align: "center",
            Cell: (record: any) =>
                record.value ? "Yes" : "No",
        },
        {
            Header: "Send Contact Email",
            accessor: "send_contact_email",
            align: "center",
            Cell: (record: any) =>
                record.value ? "Yes" : "No",
        },
    ];

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

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.landingPage.list,
                query: query,
            });
            setRows(response?.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 100);
    }, [filter]);

    const handleToggleDelete = (id?: number) => {
        setIndex(id);
        setDeleteOpen((prevState) => !prevState);
        fetchData();
    };

    const handleDelete = async () => {
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleToggleView = async (id: number) => {
        history(`/landing-page/view/${id}`);
    };

    const handleNavigateUpdate = (id: number) => {
        history(`/landing-page/update/${id}`);
    }

    const handleNavigation = () => {
        history("/landing-page/add");
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };
    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
        );
        const header = filteredColumns.map((col) => col.Header);
        const csv = rows
            .map((row: any) =>
                filteredColumns.map((col) => row[col.accessor!]).join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Landing Pages.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card className='module_wrap'>
                                <MDBox className='module_head' mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Landing Pages
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {landingPage?.create && <MDButton className='action-button' sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDInput label="Search Keyword" placeholder="Keyword"
                                                value={filter.search} onChange={handleSearchChange} />
                                        </Grid>
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDInput label="From" type="date" className={filter.from_date ? "has-value" : ""}
                                                value={filter.from_date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("from_date", e.target.value)} />
                                        </Grid>
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDInput label="To" type="date" className={filter.to_date ? "has-value" : ""}
                                                value={filter.to_date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("to_date", e.target.value)} />
                                        </Grid>
                                    </Grid>
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
                            {
                                landingPage?.delete &&
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "20px",
                                        marginRight: "40px",
                                    }}
                                >
                                    <MDButton onClick={handleDelete} color="error">
                                        Delete
                                    </MDButton>
                                </div>
                            }
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm
                message="Do you want to delete the Landing Pages?"
                method={service.Methods.DELETE}
                url={service.API_URL.landingPage.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm
                message="Do you want to delete the Landing Page?"
                method={service.Methods.DELETE}
                url={service.API_URL.landingPage.delete}
                visible={deleteOpen}
                closeModal={handleToggleDelete}
                id={[index]}
            />
        </>
    );
};

export default ListLandingPage;
