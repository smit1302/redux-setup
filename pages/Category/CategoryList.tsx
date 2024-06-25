import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox, Grid, Switch } from "@mui/material";
import Confirm from "../../common/ConfirmModal";
import { IconButton, Card } from "@mui/material";
import { service } from "utils/Service/service";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import globalMessages from 'utils/global';
import { Add } from '@mui/icons-material';
import ExportToCsv from 'utils/ExportToCsv';
import ConfirmStatus from "common/ConfirmStatus";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import MDSelect from "components/MDSelect";
import { useSelector } from "react-redux";

// interface for listing categories
interface CategoryType {
    id: number;
    name: string;
    organization: string;
    is_active: boolean;
    parent_id: number;
    short_description: string;
    long_description: string;
    image: string;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
}

const CategoryList: React.FC = () => {
    // necessary states and variables
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [filter, setFilter] = useState({ search: "", is_active: "" });
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<CategoryType[]>([]);
    const [index, setIndex] = useState<number[] | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<number[]>([]);
    const [options, setOptions] = useState([]);
    const category = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Settings?.Category);

    // columns of table
    const columns = [
        {
            Header: 'Action',
            align: 'center',
            Cell: (record: any) => {
                const id = record.row.original.id;
                const isChecked = selectedId.includes(id);
                return (
                    <>
                        {
                            (category?.update || category?.delete) &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                        {
                            category?.view &&
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id)
                                }
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        }
                        {
                            category?.update &&
                            <IconButton
                                onClick={() =>
                                    handleNavigateUpdate(record.row.original.id)
                                }
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        }
                        {
                            category?.delete &&
                            <IconButton
                                onClick={() =>
                                    handleToggleDelete(record.row.original.id)
                                }
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        }
                    </>
                );
            }
        },
        { Header: "ID", accessor: "id", align: "center" },
        { Header: "Organization", accessor: "organization", align: "center" },
        {
            Header: "Category Name",
            accessor: "name",
            align: "center",
            width: 150,
        },
        {
            Header: 'Image', accessor: 'image', align: "center",
            Cell: (record: any) => {
                return (
                    <>
                        {
                            record.row.original.image ?
                                <img src={record.row.original.image} alt={record.row.original.name} style={{ width: '50px', height: '50px' }} />
                                : <></>
                        }
                    </>
                )
            }
        },
        {
            Header: "Is Active",
            accessor: "is_active",
            align: "center",
            Cell: (record: any) => {
                return (
                    <Switch
                        onClick={() =>
                            handleToggleStatus(record.row.original.id)
                        }
                        disabled={!(category?.update)}
                        checked={record.row.original.is_active}
                    />
                );
            },
        },
    ];

    // function to fetch the category records
    const fetchData = async () => {
        let query = {}
        if (filter.search.length > 2) {
            query = { search: filter.search }
        }

        query = { ...query, is_active: filter.is_active }

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.list,
                query: query,
            });

            setRows(Array.isArray(response?.data?.data) ? response?.data?.data : []);
        } catch (error) {
            console.log(error);
        }
    };


    // function to fetch options for dropdown
    const fetchOptions = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });

            setOptions(Array.isArray(response?.data?.data?.active_options) ? response?.data?.data?.active_options : []);
        } catch (error) {
            console.log(error);
        }
    }

    // fetch options on component mount
    useEffect(() => {
        fetchOptions();
    }, [])

    // fetch data on filter change
    useEffect(() => {
        fetchData();
    }, [filter])

    // function to handle selected categories
    const handleCheckboxChange = (id: number) => {
        setSelectedId((prevSelectedId) => {
            if (prevSelectedId.includes(id)) {
                return prevSelectedId.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedId, id];
            }
        });
    };

    // function to navigate to update category
    const handleNavigateUpdate = (id: number) => {
        history(`/category/update/${id}`);
    };

    // function to navigate to view category
    const handleToggleView = async (id: number) => {
        history(`/category/view/${id}`);
    };

    // function to navigate to add category
    const handleNavigation = () => {
        history("/category/add");
    };

    // function to handle active attribute change
    const handleChange = (event: any) => {
        setFilter({ ...filter, is_active: event.target.value });
    };

    // function to handle search change
    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    // function to handle toggle of is_active 
    const handleToggleStatus = (id?: number | boolean) => {
        setSelectedId([]);
        setIndex((typeof id === 'number') ? [id] : undefined);
        setUpdateOpen((prevState) => !prevState);
        if (id === true) {
            fetchData();
        }
    };

    // function to handle delete of category
    const handleToggleDelete = (id?: number | boolean) => {
        setSelectedId([]);
        setIndex((typeof id === 'number') ? [id] : undefined);
        setDeleteOpen((prevState) => !prevState);
        if (id === true) {
            fetchData();
        }
    };

    // function to download CSV
    const downloadCSV = () => {
        // Exclude columns by checking if they have an accessor property and are not the action column
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
        );

        // Extract headers for the remaining columns
        const header = filteredColumns?.map((col) => col.Header);

        // Generate CSV rows
        const csv = rows?.map((row: any) =>
            filteredColumns?.map((col) => row[col.accessor!]).join(",")
        )
            .join("\n");

        // Combine header and CSV rows
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName = `${globalMessages.download_csv.categories}.csv`;
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
                                        {globalMessages.category.table}
                                        <div className='action_wrap d_flex'>

                                            <MDButton className='action-button' sx={{ mr: 2 }} onClick={downloadCSV} children={<  SystemUpdateAltIcon />} />
                                            {
                                                category?.create &&
                                                <MDButton
                                                    className='action-button'
                                                    variant={"contained"}
                                                    onClick={handleNavigation}
                                                    children={<Add />}
                                                />
                                            }

                                        </div>
                                    </MDTypography>
                                </MDBox>
                                <MDBox
                                    className='export_btn'
                                    mx={2}
                                    mt={3}
                                    display="flex"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <MDBox
                                        className='item_left'
                                        fontSize="medium"
                                        flex="8"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <MDInput
                                            className='form-control'
                                            sx={{ mr: 1 }}
                                            value={filter.search}
                                            onChange={handleSearchChange}
                                            label={
                                                globalMessages.category.search
                                            }
                                        />
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDSelect
                                                defaultLabel={true}
                                                value={filter.is_active}
                                                placeholder={
                                                    globalMessages.category.select_status
                                                }
                                                handleChange={handleChange}
                                                options={options}
                                            />
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                                <MDBox pt={3} className='table_custom'>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={true}
                                        entriesPerPage={true}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                            <MDBox
                                className='action_wrap mt-30'
                            >

                                {
                                    category?.update &&
                                    <MDButton sx={{ mr: 2 }} disabled={selectedId.length === 0} onClick={() => setUpdateOpen(true)} color={sidenavColor}> Update</MDButton>
                                }
                                {
                                    category?.delete &&
                                    <MDButton disabled={selectedId.length === 0} onClick={() => setDeleteOpen(true)} color="error"> Delete</MDButton>
                                }
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm message={globalMessages.category.delete_confirm} method={service.Methods.DELETE} url={service.API_URL.category.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={selectedId.length > 0 ? selectedId : index} />
            {
                selectedId.length > 0 ?
                    <ConfirmStatus message={globalMessages.category.update_confirm} method={service.Methods.POST} url={service.API_URL.category.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={selectedId} />
                    :
                    <Confirm message={globalMessages.category.update_confirm} method={service.Methods.POST} url={service.API_URL.category.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
            }
        </>
    );
};

export default CategoryList;
