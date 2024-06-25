import React, { useState, useEffect } from 'react';
import { Card, Grid } from '@mui/material';
import { service } from 'utils/Service/service';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import { useMaterialUIController } from 'context';
import { showFormattedDate } from 'utils/common';
import { useNavigate } from 'react-router-dom';
import MDButton from 'components/MDButton';
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../redux/features/commonData/commonData";

const ViewOpportunity = () => {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [opportunities, setOpportunities] = useState([]);
    const history = useNavigate();
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const order = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Orders?.["My Order"]);
    const dispatchData = useDispatch();

    const columns = [
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <div className="action_wrap d_flex">
                        <MDButton className='action-button'
                            size='small'
                            variant={'contained'}
                            color={sidenavColor}
                            onClick={() => handleConvertOpportunity(record.row.original, record.row.original.customer_id, record.row.original.customer_opportunity_id)}
                            children='Add To Cart' />
                    </div>
                )
            },
            width: '10%',
        },
        { Header: 'Customer Opportunity ID', accessor: 'customer_opportunity_id' },
        { Header: 'Customer ID', accessor: 'customer_id' },
        { Header: 'Service Type', accessor: 'product.name' },
        { Header: 'Amount', accessor: 'amount' },
        {
            Header: 'Projection Date', accessor: 'projection_time', Cell: (record: any) =>
                showFormattedDate(record.row.original.projection_time)
        },
        {
            Header: 'Follow Up', accessor: 'follow_up', Cell: (record: any) =>
                record.value ? "YEs" : "No",
        },
        { Header: 'Website URL', accessor: 'website_url' },
        { Header: 'Platform', accessor: 'platformType.name' },
        { Header: 'Opportunity By', accessor: 'bde.name' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const queryData = { customer_id: customerId.customer_id }
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.opportunity.get,
                    query: queryData,
                });
                console.log("res", response);
                if (response && response.data && response.data.data.opportunities) {
                    setOpportunities(response.data.data.opportunities);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [customerId]);


    const handleAddOpportunity = () => {
        history('/opportunity/add');
    };


    const handleAddMockupRequest = () => {
        history('/opportunity/mockup-request');
    };

    const handleConvertOpportunity = async (row: any, id: number, opportunityId: any) => {
        console.log("any ite", row)
        dispatchData(addData({ key: "opportunityId", data: opportunityId }));
        dispatchData(addData({ key: "product", data: row.product }))
        history(`/cart-item/${id}`)
    };

    return (
        <>
            <MDBox pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography mb={1} display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Customer Opportunities
                                    {
                                        order?.create &&
                                        <div className="action_wrap d_flex">
                                            <MDButton className='action-button' variant={'contained'} color={sidenavColor} onClick={handleAddOpportunity} children='Add Opportunity' />
                                            <MDButton className='action-button' variant={'contained'} color={sidenavColor} onClick={handleAddMockupRequest} children='Add Mockup Request' />
                                        </div>
                                    }
                                </MDTypography>
                            </MDBox>
                            <MDBox pb={3}>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: '20px' }}>
                                            <MDBox pt={1} className='table_custom'>
                                                <DataTable table={{ columns, rows: opportunities }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                            </MDBox>
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

export default ViewOpportunity;


