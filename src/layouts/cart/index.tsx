import React, { useEffect, useState } from 'react';
import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';
import Select from 'components/MDSelect';
import { Add } from '@mui/icons-material';
import MDInput from 'components/MDInput';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { service } from 'utils/Service/service';
import ExportToCsv from 'utils/ExportToCsv';
import { showFormattedDate, showFormattedDateTime } from 'utils/common';
import { useMaterialUIController } from 'context';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useSelector } from 'react-redux';


const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const [cart, setCart] = useState([]);
    const { sidenavColor } = controller;
    const [createdBy, setCreatedBy] = useState<{ value: any; label: any; }[]>([]);
    const customerCart = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Customer?.Cart);

    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
        customer_id: "",
    });

    useEffect(() => {
        fetchData();
    }, [filter]);
    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNavigation = () => {
        navigate('/cart-item')
    };

    const fetchData = async () => {
        try {
            const query = {
                search: filter.search.length > 2 ? filter.search : "",
                from_date: filter.from_date || "",
                to_date: filter.to_date || "",
                customer_id: filter.customer_id || "",
            };
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.cart.view,
                query: query
            });
            const mergedCart = response?.data.reduce((acc: any[], cur: { cartId: any; productName: any; }) => {
                const existingCart = acc.find(item => item.cartId === cur.cartId);
                if (existingCart) {
                    // If a cart with the same ID exists, merge the products
                    existingCart.productName += `, ${cur.productName}`;
                } else {
                    // If not, add the cart to the accumulator
                    acc.push(cur);
                }
                return acc;
            }, []);
            console.log("merged Cart : ", mergedCart)
            setCart(mergedCart)
            const uniqueCreatedBy = Array.from(new Set(response?.data.map((item: any) => item.createdBy)));
            let options = uniqueCreatedBy.map((createdBy: any, index: any) => ({
                value: index + 1, // Start index from 1
                label: createdBy, // Use createdBy as the label
            }));
            console.log(options)
            if (createdBy.length <= 0) {
                options = [{ value: "all", label: "All" }, ...options]
                setCreatedBy(options);
            }
        } catch (err) {
            console.log("err : ", err)
        }
    }

    const downloadCsv = () => {
        // Exclude columns by checking if they have an accessor property and are not the action column
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'cart');
        // Extract headers for the remaining columns
        const header = filteredColumns.map(col => col.Header);
        // Generate CSV rows
        const csv = cart
            .map((row: any) =>
                filteredColumns
                    .map(col => {
                        if (col.accessor === 'created_at') {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        // Combine header and CSV rows
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = 'cart';
        ExportToCsv(convertedData, fileName)
    };

    const columns = [
        {
            Header: "Cart Website",
            accessor: "organizationName",
            align: "center",
        },
        {
            Header: "Customer Id",
            accessor: "customerId",
            align: "center",
        },
        {
            Header: "Cart Id",
            accessor: "cartId",
            align: "center",
        },
        {
            Header: "Cart Date",
            accessor: "createdAt",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <MDTypography variant="body1" color="text" align="center">
                    {showFormattedDateTime(row.original.createdAt)}
                </MDTypography>
            ),
        },
        {
            Header: "Customer",
            accessor: "customerName",
            align: "center",
        },
        {
            Header: "Created By",
            accessor: "createdBy",
            align: "center",
        },
        {
            Header: "Cart Total",
            accessor: "totalAmount",
            align: "center",
        },
        {
            Header: "Cart Product",
            accessor: "productName",
            align: "center",
        },
        customerCart ?
            {
                Header: "Cart",
                accessor: "cart",
                align: "center",
                Cell: ({ row }: { row: any }) => (
                    <ShoppingCartOutlinedIcon onClick={() => navigate(`/cart-item/${row.original.customerId}/${row.original.cartId}`)} fontSize='large' color='success' />
                ),
            } :
            {
                accessor: "null",
            }
    ];

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleSelectChange = (event: any) => {
        setFilter({ ...filter, customer_id: event.target.value });
    }

    return (
        <>
            <DashboardLayout>
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
                                        Cart
                                        <div className='action_wrap d_flex'>

                                            <MDButton sx={{ marginLeft: '20px' }} className='action-button' variant={'contained'} color={sidenavColor} onClick={downloadCsv} children={<SystemUpdateAltIcon />} />
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
                                                                value={filter.search}
                                                                onChange={handleSearchChange}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <MDInput
                                                                label="From"
                                                                type="date"
                                                                className={filter.from_date ? 'has-value' : ''}
                                                                value={filter.from_date}
                                                                onChange={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) =>
                                                                    handleChange(
                                                                        "from_date",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <MDInput
                                                                label="To"
                                                                type="date"
                                                                className={filter.to_date ? 'has-value' : ''}
                                                                value={filter.to_date}
                                                                onChange={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) =>
                                                                    handleChange(
                                                                        "to_date",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <Select
                                                                value={filter.customer_id}
                                                                placeholder='Cart Created By'
                                                                options={createdBy}
                                                                handleChange={(e) => handleSelectChange(e)}
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
                                <DataTable table={{ columns, rows: cart }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox >
                <Footer />
            </DashboardLayout >
        </>
    )
}

export default Cart;
