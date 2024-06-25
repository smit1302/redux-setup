import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, Grid, Switch } from "@mui/material";
import Confirm from "../../common/ConfirmModal";
import { IconButton, Card } from "@mui/material";
import { service } from 'utils/Service/service';
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
import SelectComponent from "components/MDSelect";
import { Add, } from '@mui/icons-material';
import { showFormattedDate } from 'utils/common';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ExportToCsv from 'utils/ExportToCsv';
import globalMessages from 'utils/global';
import { useSelector } from 'react-redux';

const ListPromotion: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [promotionalType, setPromotionalType] = useState<any[]>([]);
    const [promotionalFor, setPromotionalFor] = useState<any[]>([]);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [previousRows, setPreviousRows] = useState<any>([]);
    const [product, setProduct] = useState<any[]>([]);
    const promotion = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.["Promotional Code"]);


    const [filter, setFilter] = useState({
        search: '',
    })
    const [selectedValues, setSelectedValues] = useState({
        promotional_type: '',
        promotional_for: '',
        apply_to_product: '',

    })

    const columns = [
        {
            Header: 'Select',
            accessor: 'select',
            Cell: (record: any) => {
                const id = record.row.original.promocode_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            promotion?.delete &&
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
                const id = record.row.original.promocode_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            promotion?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.promocode_id)} >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            promotion?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.promocode_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            promotion?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.promocode_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
        { Header: 'ID', accessor: 'promocode_id' },
        { Header: 'Website', accessor: 'website', align: 'center', width: 150 },
        {
            Header: 'Created Date', accessor: 'created_at', align: 'center',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at), width: 150
        },
        { Header: 'Promotional Code', accessor: 'promocode_name' },
        { Header: 'Promotional Type', accessor: 'promotional_type' },
        { Header: 'Apply in', accessor: 'apply_to_product' },
        { Header: 'Customer', accessor: 'promotional_for' },
        {
            Header: 'Valid From', accessor: 'start_date',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at), width: 150
        },
        {
            Header: 'Valid To', accessor: 'end_date',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at), width: 150
        },

        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch disabled={!promotion?.update} onClick={() => handleToggleStatus(record.row.original.promocode_id)} checked={record.row.original.is_active} />
                )
            }
        },
    ];

    const fetchData = async () => {
        try {
            const query = {
                search: filter.search.length > 2 ? filter.search : "",
                promotional_type: (selectedValues.promotional_type !== "all" && selectedValues.promotional_type) ? selectedValues.promotional_type : "",
                promotional_for: (selectedValues.promotional_for !== "all" && selectedValues.promotional_for) ? selectedValues.promotional_for : "",
                apply_to_product: (selectedValues.apply_to_product !== "all" && selectedValues.apply_to_product) ? selectedValues.apply_to_product : ""
            };
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.promotionalCode.list,
                query: query
            });
            setRows(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [index, filter, selectedValues])

    const handleToggleDelete = (id?: number) => {
        setIndex(id || undefined);
        setDeleteOpen(prevState => !prevState);
        if (id === undefined) {
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            setProduct(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setPromotionalFor(response.data.data.promotion_for);
                setPromotionalType(response.data.data.promotional_type);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProduct();
        fetchData();
    }, []);

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

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleToggleStatus = (promocode_id?: number) => {
        setIndex(promocode_id || undefined)
        setUpdateOpen(prevState => !prevState)
    };

    const handleNavigateUpdate = async (promocode_id: number) => {
        history(`/promotional-code/update/${promocode_id}`);

    };
    const handleToggleView = async (promocode_id: number) => {
        history(`/promotional-code/view/${promocode_id}`);
    };

    const handleNavigation = () => {
        history('/promotional-code/add');
    };
    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    }

    const downloadCsv = () => {
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action' && col.accessor !== 'customer_photo' && col.accessor !== "select");
        const header = filteredColumns.map(col => col.Header);
        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map(col => {
                        if (col.accessor === 'created_at' || col.accessor === 'start_date' || col.accessor === 'end_date') {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = globalMessages.download_csv.Promotion;
        ExportToCsv(convertedData, fileName)
    };

    return (
        <> <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} >
                        <Card style={{ padding: "10px" }} className='module_wrap'>
                            <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between" variant="h6" color="white">
                                    Promotional Code
                                    <div className='action_wrap d_flex'>
                                        <MDButton variant="contained" className='action-button' onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                        {promotion?.create && <MDButton sx={{ marginLeft: '20px' }} className='action-button' variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
                                    </div>
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={1} pb={3}>
                                <Grid container spacing={5}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: "10px" }}>
                                            <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <MDInput
                                                            label="Search Keyword"
                                                            placeholder="Keyword"
                                                            fullWidth
                                                            onChange={handleSearchChange} // Attach the onChange handler
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <SelectComponent
                                                            defaultLabel={true}
                                                            placeholder="Promotional Type"
                                                            options={promotionalType?.map(
                                                                (
                                                                    method: any
                                                                ) => ({
                                                                    value: method.label,
                                                                    label: method.label,
                                                                })
                                                            )}

                                                            handleChange={(e) => handleSelectedValueChange("promotional_type", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <SelectComponent
                                                            placeholder="Promotional For"
                                                            options={promotionalFor?.map(
                                                                (
                                                                    method: any
                                                                ) => ({
                                                                    value: method.label,    
                                                                    label: method.label,
                                                                })
                                                            )}

                                                            handleChange={(e) => handleSelectedValueChange("promotional_for", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <SelectComponent
                                                            placeholder="Select Products"
                                                            defaultLabel={true}
                                                            options={product?.map(product => ({
                                                                value: product.name,
                                                                label: product.name,
                                                            }))}
                                                            handleChange={(e) => handleSelectedValueChange("apply_to_product", e.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </MDTypography>
                                            <Grid container spacing={4} alignItems="center" justifyContent="space-between" style={{ marginTop: 8 }}>
                                                <Grid item>
                                                    <Grid container spacing={2} alignItems="center">

                                                    </Grid>
                                                </Grid>
                                            </Grid>
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
                            <MDButton onClick={handleDelete} color="error">
                                Delete
                            </MDButton>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
            <Confirm
                message="Do you want to delete the Template?"
                method={service.Methods.DELETE}
                url={service.API_URL.promotionalCode.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='Are you sure you want to delete this promotion?' method={service.Methods.DELETE} url={service.API_URL.promotionalCode.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={[index]} />
            <Confirm message='Are you sure you want to update this promotion?' method={service.Methods.GET} url={service.API_URL.promotionalCode.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}

export default ListPromotion;