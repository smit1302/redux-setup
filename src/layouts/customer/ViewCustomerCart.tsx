import React, { useState, useEffect } from 'react';
import { Card, Grid } from '@mui/material';
import { service } from 'utils/Service/service';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import { useMaterialUIController } from 'context';
import { useNavigate, useParams } from 'react-router-dom';
import MDButton from 'components/MDButton';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from 'common/Alert';

const ViewCustomerCart = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [cart, setCart] = useState([]);
    const dispatchData = useDispatch();
    const [selectedCart, setSelectedCart] = useState<number | null>(null);
    const { customer_id } = useParams();
    const history = useNavigate();
    const customerId = useSelector((state: any) => state?.commonData.commonData);

    const columns = [
        {
            Header: 'Select',
            Cell: ({ row }: any) => (
                <input
                    type="checkbox"
                    checked={selectedCart === row.original.cartId}
                    onChange={() => handleCheckboxChange(row.original)}
                />
            )
        },
        { Header: 'Sr No', accessor: 'cartId' },
        { Header: 'Website', accessor: 'websiteName' },
        { Header: 'Product', accessor: 'productName' },
        // { Header: 'Rate($)', accessor: '' },
        { Header: 'Rate', accessor: 'netAmount' },
        { Header: 'Qty', accessor: 'quantity' },
        { Header: 'Amount', accessor: 'cartTotal' },
        { Header: 'Promo Discount', accessor: 'promotionCode' },
        { Header: 'Net Amount', accessor: 'totalAmount' },
        { Header: 'Created By', accessor: 'createdBy' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.cart.view,
                    query: customerId.customer_id
                });
                console.log("response : ", response?.data)
                if (response && response.data) {
                    setCart(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [customerId]);

    useEffect(() => {
        console.log("data", cart);
    }, [cart]);

    const handleAddService = () => {
        if (selectedCart) {
            history(`/service/add`);
        } else {
            AlertMessage("error", "Please select a cart to add service", 2000, "top-center")
        }
    };

    const handleCheckboxChange = (row: any) => {
        setSelectedCart(row.cartId);
        dispatchData(addData({ key: "cartId", data: row.cartId }));
        dispatchData(addData({ key: "cartCustomer", data: row.customerId }));
    };

    const handleConvertOpportunity = () => {
        dispatchData(addData({ key: "value", data: 4 }));
        history(`/my-customer`);
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Customer Cart
                                    <div className="action_wrap d_flex">
                                        <MDButton className='action-button' variant={'contained'} onClick={handleAddService} children='Add Service' />
                                        <MDButton className='action-button' variant={'contained'} sx={{ marginLeft: '20px' }} onClick={handleConvertOpportunity} children='Convert Opportunity' />
                                    </div>
                                </MDTypography>
                            </MDBox>

                            <MDBox pb={3}>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: '20px' }}>
                                            <MDBox pb={3}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                            {/* You can add any additional components or elements here */}
                                                        </MDTypography>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                            <Card>
                                                <MDBox className='table_custom'>
                                                    <DataTable table={{ columns, rows: cart }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                                </MDBox>
                                            </Card>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Footer />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>

    );
};


export default ViewCustomerCart;


