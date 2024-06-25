import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Switch } from "@mui/material";
import Confirm from "../../common/ConfirmModal";
import { IconButton, Card } from "@mui/material";
import { service } from "utils/Service/service";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import Select from 'components/MDSelect';
import { Add } from '@mui/icons-material';
import ExportToCsv from 'utils/ExportToCsv';
import globalMessages from 'utils/global';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';


const WorkTypeList: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [filter, setfilter] = useState({
        name: '',
        is_active: ''
    })
    const [activeOptions, setActiveOptions] = useState([]);


    const columns = [
        { Header: 'ID', accessor: 'work_type_id', width: "15%" },
        { Header: 'Work Type', accessor: 'name', align: 'center', width: "40%" },
        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch onClick={() => handleToggleStatus(record.row.original.work_type_id)} checked={record.row.original.is_active} />
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        <IconButton onClick={() => handleToggleView(record.row.original.work_type_id)} >
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleNavigateUpdate(record.row.original.work_type_id)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleToggleDelete(record.row.original.work_type_id)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </>
                )
            },
            width: "25%",
        },
    ];

    const queryData = () => {
        const filteredValues = Object.fromEntries(
            Object.entries(filter).filter(([key, value]) => {
                if (key === 'name') {
                    return value.length > 2;
                }
                return value !== undefined && value !== '';
            })
        );
        return filteredValues;
    };

    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.workType.list,
                query: queryData()
            });
            setRows(response?.data?.data.reverse());
        } catch (error) {
            console.log(error)
        }
    }

    // function to fetch options for dropdown
    const fetchOptions = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });

            setActiveOptions(Array.isArray(response?.data?.data?.active_options) ? response?.data?.data?.active_options : []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setTimeout(() => { fetchData(); }, 100)
    }, [index, filter])

    useEffect(() => { 
        fetchOptions();
    }, [])

    const handleToggleDelete = (id?: number) => {
        setIndex(id || undefined)
        setDeleteOpen(prevState => !prevState)
    };

    const handleToggleStatus = (id?: number) => {
        setIndex(id || undefined)
        setUpdateOpen(prevState => !prevState)
        if (id === undefined) {
            fetchData();
        }
    };

    const handleNavigateUpdate = (id: number) => {
        history(`/work-type/update/${id}`);
    }

    const handleToggleView = async (id: number) => {
        history(`/work-type/view/${id}`);
    };

    const handleNavigation = () => {
        history('/work-type/add');
    };

    const handleChange = (name: string, value: string) => {
        setfilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const downloadCsv = () => {
        // Exclude columns by checking if they have an accessor property and are not the action column
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action');
        // Extract headers for the remaining columns
        const header = filteredColumns.map(col => col.Header);
        // Generate CSV rows
        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map(col => row[col.accessor!])
                    .join(",")
            )
            .join("\n");
        // Combine header and CSV rows
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = globalMessages.download_csv.work_type;
        ExportToCsv(convertedData, fileName)
    };


    // const activeOptions = [
    //     { value: 'all', label: "All" },
    //     { value: "true", label: "Active" },
    //     { value: "false", label: "Inactive" },
    // ];


    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    {globalMessages.work_type.table_name}
                                    <Grid className='action_wrap d_flex'>
                                        <MDButton className='action-button' onClick={downloadCsv} color={'white'} children={<SystemUpdateAltIcon />} />
                                        <MDButton className='action-button' variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />
                                    </Grid>
                                </MDTypography>

                            </MDBox>
                            <MDBox mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'>
                                <Grid container spacing={3}>
                                    <Grid item xs={8} md={3} lg={2}>
                                        <MDInput
                                            value={filter.name}
                                            // InputLabelProps={{ shrink: true }}
                                            label={globalMessages.work_type.search}
                                            onChange={(e: { target: { value: string; }; }) => handleChange("name", e.target.value)} />
                                    </Grid>
                                    <Grid item xs={8} md={3} lg={2}>
                                        <MDBox fontSize='medium' alignItems='center'>
                                            <Select defaultLabel={true} value={filter.is_active} placeholder={globalMessages.work_type.select_status} options={activeOptions} handleChange={(e) => handleChange("is_active", e.target.value)} />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                            </MDBox>

                            <MDBox pt={1} className='table_custom'>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
            <Confirm message={globalMessages.work_type.delete_confirm} method={service.Methods.DELETE} url={service.API_URL.workType.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={index} />
            <Confirm message={globalMessages.work_type.status_update_confirm} method={service.Methods.GET} url={service.API_URL.workType.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />

        </>
    )
}

export default WorkTypeList;
