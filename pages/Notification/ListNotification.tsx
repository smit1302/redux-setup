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

const ListNotification = () => {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [notification, setNotification] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('')
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const emailNotification = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Settings?.["Notification"]);

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
                apiUrl: service.API_URL.notification.viewNotification,
                query: qurryData

            });
            console.log("response : " + JSON.stringify(response?.data?.data))
            setNotification(response?.data?.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    const columns = [
        { Header: 'id', accessor: 'id' },
        { Header: 'CreatedBy', accessor: 'created_user_name' },
        {
            Header: 'Notification for',
            accessor: 'notification_for',
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.noti_for_name}</div>
                </div>
            )
        },
        { Header: 'Notification', accessor: 'message' },
        {
            Header: 'Reply Mandatory', accessor: 'mandatory_reply',
            Cell: ({ value }: any) => (value ? 'Yes' : 'No') // Conditionally render Yes or No
        },
        {
            Header: 'Remind Later', accessor: 'remind_later',
            Cell: ({ value }: any) => (value ? 'Yes' : 'No') // Conditionally render Yes or No
        },
        {
            Header: 'Reply',
            accessor: 'reply',
            Cell: ({ row }: any) => (
                <div>
                    {row.original.noti_reply_user_name ? ( // Check if reply data exists
                        <a href="#" onClick={() => handleToggleNotification(row.original.id)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                            {row.original.noti_reply_user_name}
                        </a>
                    ) : null}
                </div>
            )
        },

    ];

    const navigateToAddPage = () => {
        navigate('/notification/add')
    }

    const handleChange = (name: string, value: string) => {
        setSearchQuery(value);
    };
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
        const fileName: string = "notification.csv";
        ExportToCsv(convertedData, fileName);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card style={{ padding: '20px' }} className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" borderRadius="lg" bgColor={sidenavColor} coloredShadow="info" display="flex" justifyContent="space-between" className='module_head v-align'>
                                <MDTypography variant="h6" color="white">
                                    Notification
                                </MDTypography>
                                <MDButton color={'white'} onClick={downloadCsv} children={<SystemUpdateAltIcon />} />
                                {emailNotification?.create && <MDButton variant={'contained'} color={sidenavColor} onClick={navigateToAddPage} children={<Add />} />}
                            </MDBox>
                            <MDBox pt={2} pb={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card style={{ padding: "20px" }}>
                                            <MDTypography
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                variant="h6"
                                                color="white"
                                            >
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <MDInput
                                                            label="Search Notification For"
                                                            placeholder="Keyword"
                                                            value={searchQuery}
                                                            onChange={(e: { target: { value: string } }) => handleChange("notification_for", e.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>

                                            </MDTypography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MDBox>
                            <MDBox>

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
            {showMessage && (
                <CommonModal
                    message={message}
                    visible={showMessage}
                    closeModal={closeModle}
                    cancelButtonText="Cancel"
                />
            )}
            <Footer />
        </DashboardLayout>
    );
}

export default ListNotification;
