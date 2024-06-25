import React, { useEffect, useState } from 'react';
import { Grid, Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import { Add } from '@mui/icons-material';
import { useMaterialUIController } from 'context';
import { service } from 'utils/Service/service';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import CommonModal from 'common/modal/Modal';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ExportToCsv from 'utils/ExportToCsv';
import { showFormattedDate } from 'utils/common';
import { useSelector } from 'react-redux';

const ListPlugin = () => {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [notification, setNotification] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('')
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const plugin = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Orders?.["App Requirement"]);

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleToggleNotification = async (notificationId: any) => {
        const response = await service.makeAPICall({
            methodName: service.Methods.GET,
            apiUrl: service.API_URL.notification.replyedMessage,
            params: notificationId
        });
        console.log(response?.data)
        setMessage(response?.data)
        setShowMessage(!showMessage);
    };
    const closeModle = async () => {
        setShowMessage(!showMessage);
    }

    const fetchData = async () => {
        console.log(searchQuery)
        try {
            const qurryData = { notification_for: searchQuery.length > 2 ? searchQuery : "" }

            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.requirement.listAppRequirement
            });
            console.log("response : " + JSON.stringify(response?.data?.data))
            setNotification(response?.data?.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    const columns = [
        { Header: 'Id', accessor: 'appReq_id' },
        { Header: 'Title', accessor: 'appReq_title' },
        { Header: 'Description', accessor: 'appReq_description' },
        { Header: 'Organization', accessor: 'organizationName' },
        { Header: 'Platform', accessor: 'platformName' },
    ];

    const navigateToAddPage = () => {
        navigate('/app-requirement/add')
    }


    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
        );
        const header = filteredColumns.map((col) => col.Header);
        const csv = notification
            .map((row: any) =>
                filteredColumns
                    .map((col) => {
                        if (col.accessor === "registered_date") {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "app-requirement.csv";
        ExportToCsv(convertedData, fileName);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    App Requirement
                                    <Grid className='action_wrap d_flex'>
                                        <MDButton className='action-button' color={'white'} onClick={downloadCsv} children={<SystemUpdateAltIcon />} />
                                        {plugin?.create && <MDButton className='action-button' variant={'contained'} color={sidenavColor} onClick={navigateToAddPage} children={<Add />} />}
                                    </Grid>
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2} pb={3} className='table_custom'>
                                <DataTable table={{
                                    columns, rows: notification
                                }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ListPlugin;
