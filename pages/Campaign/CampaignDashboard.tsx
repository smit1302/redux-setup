import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox, Typography, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../../common/ConfirmModal";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import globalMessages from 'utils/global';
import { useSelector } from "react-redux";

interface CampaignDashboardProps {
    method: string;
}

const CampaignDashBoard: React.FC<CampaignDashboardProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const campaign = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.Campaign);

    const columns = [
        { Header: 'ID', accessor: 'campaign_id' },
        { Header: 'Website', accessor: 'website' },
        { Header: 'Title', accessor: 'title' },
        { Header: 'From Name', accessor: 'from_name' },
        { Header: 'From Email', accessor: 'from_email' },
        { Header: 'Campaign Type', accessor: 'campaign_type' },
        { Header: 'Promocode', accessor: 'promocode' },
        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch disabled={!campaign?.update} onClick={() => handleToggleStatus(record.row.original.campaign_id)} checked={record.row.original.is_active} />
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                const id = record.row.original.campaign_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            campaign?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.campaign_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            campaign?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.campaign_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.campaign.list,
                });
                setRows(response?.data?.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, [index]);

    const handleToggleDelete = (campaign_id?: number) => {
        setIndex(campaign_id || undefined);
        setDeleteOpen(prevState => !prevState);
        if (campaign_id === undefined) {
        }
    };

    const handleNavigateUpdate = (campaign_id: number) => {
        history(`/campaign/update/${campaign_id}`);
    }

    const handleToggleStatus = (id?: number) => {
        setIndex(id || undefined);
        setUpdateOpen(prevState => !prevState);
        if (id === undefined) {
        }
    };
    const convertToCSV = () => {
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action');
        const header = filteredColumns.map(col => col.Header);

        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map(col => row[col.accessor!])
                    .join(",")
            )
            .join("\n");

        return `${header.join(",")}\n${csv}`;
    };
    const downloadCSV = () => {
        const csvData = convertToCSV()
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${globalMessages.download_csv.categories}_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "10px" }} className='module_wrap'>
                                <MDBox className='module_head' mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        Campaign Dashboard
                                        {/* <Grid>
                                            <MDButton variant="gradient" onClick={() => history(-1)}>
                                                {globalMessages.btn_text.back_button_text}
                                            </MDButton>
                                        </Grid> */}
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "18px", backgroundColor: "blue" }}>
                                                <Typography variant="h4" style={{ color: "white" }}>3</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Templates Names</Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "20px", backgroundColor: "black" }}>
                                                <Typography variant="h4" style={{ color: "white" }}>4</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Campaign Total</Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "17px", backgroundColor: "green" }}>
                                                <Typography variant="h4" style={{ color: "white" }}>3</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Schedule Email 9</Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "23px", backgroundColor: "orange" }}>
                                                <Typography variant="h4" style={{ color: "white" }}>7</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Mail Failed </Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "21px", backgroundColor: "blue" }}>
                                                <Typography variant="h3" style={{ color: "white" }}>5</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Sent+Queued</Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Card style={{ padding: "20px", backgroundColor: "red" }}>
                                                <Typography variant="h4" style={{ color: "white" }}>2</Typography>
                                                <Typography variant="h6" style={{ color: "white" }}>Email In Queue</Typography>
                                                <a href="/email-in-queue" style={{ color: "white" }}>More Info</a>
                                            </Card>
                                        </Grid>

                                    </Grid>

                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                    <MDBox pt={3}>
                        <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                    </MDBox>

                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm message='are you sure, you want to delete campaign?' method={service.Methods.DELETE} url={service.API_URL.campaign.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={index} />
            <Confirm message='are you sure, you want to update campaign?' method={service.Methods.GET} url={service.API_URL.campaign.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}

export default CampaignDashBoard;

