import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate, useParams } from "react-router-dom";
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
import Select from "common/Select";
import { showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SelectComponent from "components/MDSelect";
import { useSelector } from "react-redux";

const ListEmailTemplate: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [typeOfUse, setTypeOfUse] = useState<any[]>([]);
    const [contentType, setContentType] = useState<any[]>([]);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [previousRows, setPreviousRows] = useState<any>([]);
    const template = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.["Template"]);

    const [filter, setFilter] = useState({
        search: '',
    })
    const [selectedValues, setSelectedValues] = useState({
        type_of_use: '',
        content_type: ''
    })

    const columns = [
        {
            Header: 'Select',
            accessor: 'select',
            Cell: (record: any) => {
                const id = record.row.original.email_marketing_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            template?.delete &&
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
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            template?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.email_marketing_id)} >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            template?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.email_marketing_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            template?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.email_marketing_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
        { Header: 'ID', accessor: 'email_marketing_id' },
        { Header: 'Website', accessor: 'website', align: 'center', width: 150 },
        { Header: 'Title', accessor: 'title' },
        { Header: 'Type Of Use', accessor: 'type_of_use' },
        { Header: 'Content Type', accessor: 'content_type' },
        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch disabled={!template?.update} onClick={() => handleToggleStatus(record.row.original.email_marketing_id)} checked={record.row.original.is_active} />
                )
            }
        },
    ];

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            type_of_use: (selectedValues.type_of_use !== "all" && selectedValues.type_of_use) ? selectedValues.type_of_use : "",
            content_type: selectedValues.content_type !== "all" && selectedValues.content_type ? selectedValues.content_type : "",
        };
        try {
            // call api for get backend data
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.email_marketing.list,
                query: query,
            });
            setRows(response?.data?.data);

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 100);
    }, [index, filter, selectedValues]);


    useEffect(() => {
        const fetchDropdownOption = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setTypeOfUse(response.data.data.type_of_use);
                setContentType(response.data.data.content_type);

            } catch (error) {
                console.log(error);
            }
        };
        fetchDropdownOption();
    }, []);
    // handle checkbox for select multiple id 
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

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleToggleDelete = (id?: number) => {
        setIndex(id);
        setDeleteOpen((prevState) => !prevState);
        fetchData();
    };

    useEffect(() => {
        setPreviousRows(rows);
        if (previousRows.length > rows.length && selectedIds.length > 0) {
            setSelectedIds([]);
        }
    }, [previousRows, rows, selectedIds]);

    const handleDelete = async () => {
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    }

    const handleNavigateUpdate = (email_marketing_id: number) => {
        history(`/template/update/${email_marketing_id}`);
    }

    const handleToggleView = async (email_marketing_id: number) => {
        history(`/template/view/${email_marketing_id}`);
    };

    const handleNavigation = () => {
        history('/template/add');
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });

    };
    // update status of each id 
    const handleToggleStatus = (email_marketing_id?: number) => {
        setIndex(email_marketing_id || undefined);
        setUpdateOpen(prevState => !prevState);
        if (email_marketing_id === undefined) {
        }
    };
    //generate CSV five when click on download csv file icon
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
        const fileName: string = "Email Templates.csv";
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
                                        Email Template
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            <MDButton className='action-button' sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3}>
                                    <Grid container spacing={5} className='col_bx_inner'>
                                        <Grid item xs={12}>
                                            <Card style={{ padding: "10px" }}>
                                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                    <Grid container spacing={3} alignItems="center">
                                                        <Grid item xs={12} sm={3} className='col_p'>
                                                            <MDInput
                                                                label="Search Keyword"
                                                                placeholder="Keyword"
                                                                style={{ backgroundColor: "white" }}
                                                                value={filter.search}
                                                                onChange={handleSearchChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4} className='col_p'>
                                                            <SelectComponent
                                                                placeholder="Types Of Use"
                                                                options={typeOfUse.map(
                                                                    (method: any) => ({
                                                                        value: method.label,
                                                                        label: method.label,
                                                                    })
                                                                )}
                                                                defaultLabel={true}
                                                                handleChange={(e) => handleSelectedValueChange("type_of_use", e.target.value)}
                                                            />

                                                        </Grid>
                                                        <Grid item xs={12} sm={5} className='col_p'>
                                                            <SelectComponent
                                                                placeholder="Content Type"
                                                                options={contentType.map(
                                                                    (method: any) => ({
                                                                        value: method.label,
                                                                        label: method.label,
                                                                    })
                                                                )}
                                                                defaultLabel={true}
                                                                handleChange={(e) => handleSelectedValueChange("content_type", e.target.value)}
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
                                    template?.delete &&
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
                message="Do you want to delete the Template?"
                method={service.Methods.DELETE}
                url={service.API_URL.email_marketing.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='are you sure, you want to delete Template?' method={service.Methods.DELETE} url={service.API_URL.email_marketing.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={[index]} />
            <Confirm message='are you sure, you want to update Template?' method={service.Methods.GET} url={service.API_URL.email_marketing.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}

export default ListEmailTemplate;
