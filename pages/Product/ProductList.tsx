import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
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
import ConfirmStatus from 'common/ConfirmStatus';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import MDSelect from 'components/MDSelect';
import { useSelector } from 'react-redux';

// interface for listing products
interface ProductType {
    id: number,
    category_id: number,
    category_name: string,
    name: string,
    organization: string,
    is_active: boolean,
    parent_id: number,
    short_description: string,
    long_description: string,
    product_image: string,
    product_icon: string,
    meta_title: string,
    meta_description: string,
}


interface Category {
    value: string;
    label: string;
}

const ProductList: React.FC = () => {
    // necessary states and variables
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [filter, setFilter] = useState({ search: '', category_id: '', is_active: '' })
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<ProductType[]>([]);
    const [index, setIndex] = useState<number[] | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<number[]>([]);
    const [options, setOptions] = useState([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const product = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Settings?.Product);

    // columns of tables
    const columns = [
        {
            Header: 'Action', align: 'center',
            Cell: (record: any) => {
                const id = record.row.original.id;
                const isChecked = selectedId.includes(id);
                return (
                    <>
                        {
                            (product?.update || product?.delete) &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                        {
                            product?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.id)} >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            product?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            product?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                );
            }
        },
        { Header: 'ID', accessor: 'id', align: 'center' },
        { Header: 'Organization', align: 'center', accessor: 'organization' },
        { Header: 'Product Name', align: 'center', accessor: 'name' },
        {
            Header: 'Categories', align: 'center', accessor: 'categories',
            Cell: (record: any) => {
                const categories = record.row.original.categories
                return (
                    <>
                        {categories?.map((category: any, index: any) => {
                            return (
                                <span key={category.id}>
                                    {category.name}
                                    {index !== categories.length - 1 ? ', ' : ''}
                                    {index % 2 === 1 && <div></div>}
                                </span>
                            )
                        })}
                    </>
                )
            },
        },
        { Header: 'Member Price', align: 'center', accessor: 'member_price' },
        { Header: 'Price', accessor: 'price', align: 'center' },
        {
            Header: 'Product Image', accessor: 'product_image', align: "center",
            Cell: (record: any) => {
                return (
                    <>
                        {
                            record.row.original.product_image ?
                                <img src={record.row.original.product_image} alt={record.row.original.name} style={{ width: '50px', height: '50px' }} />
                                : <></>
                        }
                    </>
                )
            }
        },
        {
            Header: 'Is Active',
            accessor: 'is_active',
            align: 'center',
            Cell: (record: any) => {
                return (
                    <Switch onClick={() => handleToggleStatus(record.row.original.id)} disabled={!(product?.update)} checked={record.row.original.is_active ? true : false} />
                )
            }
        },
    ];

    // function to fetch the product records
    const fetchData = async () => {
        let query = {}
        if (filter.search.length > 2) {
            query = { search: filter.search }
        }

        query = { ...query, is_active: filter.is_active, category_id: filter.category_id }

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
                query: query
            });

            setRows(Array.isArray(response?.data?.data) ? response?.data?.data : []);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.category.list,
                query: { column: true, forSelect: true },
            });
            const categoriesData = response?.data?.data;
            if (categoriesData && Array.isArray(categoriesData)) {
                const categoriesOptions: Category[] = categoriesData.map((category: any) => ({
                    value: category.id,
                    label: category.name
                }));
                setCategories(categoriesOptions);
            }

        } catch (error) {
            console.log(error);
        }
    }

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
        fetchCategories();
    }, [])

    // fetch data on filter change
    useEffect(() => {
        setTimeout(() => { fetchData(); }, 100)
    }, [filter])

    // function to handle selected products
    const handleCheckboxChange = (id: number) => {
        setSelectedId((prevSelectedId) => {
            if (prevSelectedId.includes(id)) {
                return prevSelectedId.filter(
                    (selectedId) => selectedId !== id
                );
            } else {
                return [...prevSelectedId, id];
            }
        });
    };

    // function to handle delete of product
    const handleToggleDelete = (id?: number | boolean) => {
        setSelectedId([]);
        setIndex((typeof id === 'number') ? [id] : undefined);
        setDeleteOpen(prevState => !prevState);
        if (id === true) {
            setTimeout(() => { fetchData(); }, 400)
        }
    };

    // function to handle toggle of is_active
    const handleToggleStatus = (id?: number | boolean) => {
        setSelectedId([]);
        setIndex((typeof id === 'number') ? [id] : undefined);
        setUpdateOpen(prevState => !prevState);
        if (id === true) {
            fetchData();
        }
    };

    // function to navigate to update product
    const handleNavigateUpdate = (id: number) => {
        history(`/product/update/${id}`);
    }

    // function to navigate to view product
    const handleToggleView = async (id: number) => {
        history(`/product/view/${id}`);
    };

    // function to navigate to add product
    const handleNavigation = () => {
        history('/product/add');
    }
    // function to handle category change
    const handleCategoryChange = (event: any) => {
        console.log('category change', event.target.value)
        setFilter({ ...filter, category_id: String(event.target.value) });
    }

    // function to handle active attribute change
    const handleChange = (event: any) => {
        setFilter({ ...filter, is_active: event.target.value });
    }

    // function to handle search change
    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    }

    // function to download CSV
    const downloadCSV = () => {
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
        const fileName = `${globalMessages.download_csv.products}.csv`;
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
                                <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        {globalMessages.product.table}
                                        <div className='action_wrap d_flex'>
                                            <MDButton className='action-button' sx={{ mr: 2 }} onClick={downloadCSV} children={<  SystemUpdateAltIcon />} />
                                            {
                                                product?.create &&
                                                <MDButton className='action-button' variant={'contained'} onClick={handleNavigation} children={<Add />} />
                                            }

                                        </div>
                                    </MDTypography>
                                </MDBox>
                                <MDBox mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'>
                                    <MDBox fontSize='medium' flex='8' display='flex' alignItems='center'>
                                        <MDInput value={filter.search} onChange={handleSearchChange} label={globalMessages.product.search} />
                                        <MDBox sx={{ mr: 1 }} />
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDSelect defaultLabel={true} value={filter.category_id} placeholder={globalMessages.product.category_placeholder} handleChange={handleCategoryChange} options={categories} />
                                        </Grid>
                                        <MDBox sx={{ mr: 1 }} />
                                        <Grid item xs={8} md={3} lg={2}>
                                            <MDSelect defaultLabel={true} value={filter.is_active} placeholder={globalMessages.product.select_status} handleChange={handleChange} options={options} />
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                                <MDBox pt={3} className='table_custom'>
                                    <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                </MDBox>
                            </Card>

                            <MDBox pt={3} className='action_wrap d_flex'>
                                {
                                    product?.update &&
                                    <MDButton sx={{ mr: 2 }} disabled={selectedId.length === 0} onClick={() => setUpdateOpen(true)} color={sidenavColor}> Update</MDButton>
                                }
                                {
                                    product?.delete &&
                                    <MDButton disabled={selectedId.length === 0} onClick={() => setDeleteOpen(true)} color="error"> Delete</MDButton>
                                }
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm message={globalMessages.product.delete_confirm} method={service.Methods.DELETE} url={service.API_URL.product.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={selectedId.length > 0 ? selectedId : index} />
            {
                selectedId.length > 0 ?
                    <ConfirmStatus message={globalMessages.product.update_confirm} method={service.Methods.POST} url={service.API_URL.product.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={selectedId} />
                    :
                    <Confirm message={globalMessages.product.update_confirm} method={service.Methods.POST} url={service.API_URL.product.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
            }
        </>
    )
}

export default ProductList;
