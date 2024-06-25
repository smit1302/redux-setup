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
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import ExportToCsv from "utils/ExportToCsv";
import { showFormattedDate } from "utils/common";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";

interface NewsLetterProps {
    method: string;
}

const FeedbackList: React.FC<NewsLetterProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<any>(undefined);
    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [previousRows, setPreviousRows] = useState<any>([]);
    const feedback = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.Feedback);

    const columns = [
        { Header: "ID", accessor: "customer_feedback_id", align: "center" },
        {
            Header: "Action", accessor: "action", Cell: (record: any) => {
                const id = record.row.original.customer_feedback_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {feedback?.delete && <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(id)} />}
                        {
                            feedback?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.customer_feedback_id)}>
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            feedback?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.customer_feedback_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                );
            },
            width: 200,
        },
        { Header: "website", accessor: "website", align: "center" },
        { Header: "Date", accessor: "created_at", align: "center", Cell: (record: any) => showFormattedDate(record.row.original.created_at) },
        { Header: "Name", accessor: "user_name", align: "center" },
        { Header: "Email", accessor: "user_email", align: "center" },
        { Header: "Rating", accessor: "rating", align: "center" },
        { Header: "Feedback for", accessor: "feedback_for", align: "center" },
    ];

    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    const fetchFeedbackData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.feedback.list,
                query: query,
            });
            setRows(response?.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchFeedbackData();
        }, 100);
    }, [filter]);

    useEffect(() => {
        setPreviousRows(rows);
        if (previousRows.length > rows.length && selectedIds.length > 0) {
            setSelectedIds([]);
        }
    }, [previousRows, rows, selectedIds]);

    const handleDelete = async () => {
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchFeedbackData();
    }

    const handleToggleDelete = (id?: number) => {
        setIndex(id);
        setDeleteOpen((prevState) => !prevState);
        fetchFeedbackData();
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleToggleView = async (id: number) => {
        history(`/feedback/view/${id}`);
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleNavigation = () => {
        history('/feedback/add');
    };
    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
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
        const fileName: string = "Customer_feedbacks.csv";
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
                                        Customer Feedbacks
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {feedback?.create && <MDButton className='action-button' sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
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
                                            <MDInput label="From" type="date"
                                                className={filter.from_date ? "has-value" : ""}
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
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "20px",
                                    marginRight: "40px",
                                }}
                            >
                                {
                                    feedback?.delete &&
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
                message="Do you want to delete the feedback?"
                method={service.Methods.DELETE}
                url={service.API_URL.feedback.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm
                message="Do you want to delete the feedback?"
                method={service.Methods.DELETE}
                url={service.API_URL.feedback.delete}
                visible={deleteOpen}
                closeModal={handleToggleDelete}
                id={[index]}
            />
        </>
    );
};

export default FeedbackList;