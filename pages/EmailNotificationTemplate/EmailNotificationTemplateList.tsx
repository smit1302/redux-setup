import React, { useEffect, useState } from "react";
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
import Select from "common/Select";
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import globalMessages from 'utils/global';
import { Add } from '@mui/icons-material';
import ExportToCsv from 'utils/ExportToCsv';
import MDSelect from "components/MDSelect";
import { useSelector } from "react-redux";

// interface for listing email notification templates
interface EmailNotificationType {
    id: number;
    organization_id: number;
    primary_template: string;
    from_email: string;
    from_name: string;
    reply_email: string;
    reply_name: string;
    template_title: string;
    send_to_admin: boolean;
    send_to_supervisor: boolean;
    send_to_team: boolean;
    send_to_bde: boolean;
    send_to_pm: boolean;
    send_to_customer: boolean;
    is_active: boolean;
}

const EmailNotificationList: React.FC = () => {
    // necessary states and variables
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [index, setIndex] = useState<undefined | number[]>(undefined);
    const [filter, setFilter] = useState({ search: '', is_active: '' })
    const [updateOpen, setUpdateOpen] = useState(false);
    const [rows, setRows] = useState<EmailNotificationType[]>([]);
    const [selectedId, setSelectedId] = useState<number[]>([]);
    const [options, setOptions] = useState([]);
    const notification = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Settings?.["Email Notification Template"]);

    // columns of tables
    const columns = [
        {
            Header: "Action",
            accessor: "action",
            Cell: (record: any) => {

                return (
                    <>
                        {notification?.update &&
                            <IconButton
                                onClick={() =>
                                    handleNavigateUpdate(record.row.original.id)
                                }
                            >
                                <EditIcon />
                            </IconButton>}
                    </>
                );

            },
            width: 200,
        },
        {
            Header: "BDE",
            accessor: "send_to_bde",
            Cell: (record: any) => {
                return (
                    <>
                        {
                            (notification?.view && record.row.original.send_to_bde) ?
                                <IconButton
                                    onClick={() =>
                                        handleToggleView(record.row.original.id, 'bde')
                                    }
                                >
                                    <VisibilityIcon />
                                </IconButton> :
                                <></>
                        }
                    </>
                );
            },
        },
        {
            Header: "PM",
            accessor: "send_to_pm",
            Cell: (record: any) => {
                return (
                    <>
                        {(notification?.view && record.row.original.send_to_pm) ?
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id, 'pm')
                                }
                            >
                                <VisibilityIcon />
                            </IconButton> :
                            <></>
                        }
                    </>
                );
            },
        },
        {
            Header: "Admin",
            accessor: "send_to_admin",
            Cell: (record: any) => {
                return (
                    <>
                        {(notification?.view && record.row.original.send_to_admin) ?
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id, 'admin')
                                }
                            >
                                <VisibilityIcon />
                            </IconButton> :
                            <></>
                        }
                    </>
                );
            },
        },
        {
            Header: "Team",
            accessor: "send_to_team",
            Cell: (record: any) => {
                return (
                    <>
                        {(notification?.view && record.row.original.send_to_team) ?
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id, 'team')
                                }
                            >
                                <VisibilityIcon />
                            </IconButton> :
                            <></>
                        }
                    </>
                );
            },
        },
        {
            Header: "Customer",
            accessor: "send_to_customer",
            Cell: (record: any) => {
                return (
                    <>
                        {(notification?.view && record.row.original.send_to_customer) ?
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id, 'customer')
                                }
                            >
                                <VisibilityIcon />
                            </IconButton> :
                            <></>
                        }
                    </>
                );
            },
        },
        {
            Header: "Supervisor",
            accessor: "send_to_supervisor",
            Cell: (record: any) => {
                return (
                    <>
                        {(notification?.view && record.row.original.send_to_supervisor) ?
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id, 'supervisor')
                                }
                            >
                                <VisibilityIcon />
                            </IconButton> :
                            <></>
                        }
                    </>
                );
            },
        },
        { Header: "ID", accessor: "id" },
        { Header: "Organization", accessor: "organization" },
        { Header: "Template Title", accessor: "template_title" },
        {
            Header: "Primary Template",
            accessor: "primary_template",
            align: "center",
            width: 150,
        },
        {
            Header: "Is Active",
            accessor: "is_active",
            Cell: (record: any) => {
                return (
                    <>
                        <Switch
                            onClick={() =>
                                handleToggleStatus(record.row.original.id)
                            }
                            disabled={!(notification?.update)}
                            checked={record.row.original.is_active}
                        />

                    </>
                );
            },
        },
        // { Header: 'Image', accessor: 'image' },
        { Header: "From Email", accessor: "from_email" },
        { Header: "Reply Email", accessor: "reply_email" },
    ];

    // function to fetch the email notification template records
    const fetchData = async () => {
        let query = {}
        if (filter.search.length > 2) {
            query = { search: filter.search }
        }

        query = { ...query, is_active: filter.is_active }

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.emailNotification.list,
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

    // function to handle selected email notification templates
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

    // function to handle toggle of is_active
    const handleToggleStatus = (id?: number | boolean) => {
        setUpdateOpen((prevState) => !prevState);
        setIndex((typeof id === 'number') ? [id] : undefined);
        if (id === true) {
            fetchData();
        }
    };

    // function to navigate to update email notification template
    const handleNavigateUpdate = (id: number) => {
        history(`/email-notification-template/update/${id}`);
    };

    // function to navigate to view email notification template
    const handleToggleView = async (id: number, userType: string) => {
        history(`/email-notification-template/view/${userType}/${id}`);
    };

    // function to navigate to add email notification template
    const handleNavigation = () => {
        history("/email-notification-template/add");
    };

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
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action"
        );

        // Extract headers for the remaining columns
        const header = filteredColumns.map((col) => col.Header);

        // Generate CSV rows
        const csv = rows
            .map((row: any) =>
                filteredColumns.map((col) => row[col.accessor!]).join(",")
            )
            .join("\n");

        // Combine header and CSV rows
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName = `${globalMessages.download_csv.email_notification}.csv`;
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pb={3}>
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
                                        {globalMessages.email_notification.table}
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' sx={{ mr: 2 }} onClick={downloadCSV} children={<  SystemUpdateAltIcon />} />
                                            {notification?.create && <MDButton className='action-button' variant={"contained"} onClick={handleNavigation} children={<Add />} />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>

                                <MDBox mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'>
                                    <MDBox className='action_wrap' fontSize='medium' flex='8' display='flex' alignItems='center'>
                                        <MDInput sx={{ mr: 1 }} value={filter.search} onChange={handleSearchChange} label={globalMessages.email_notification.search} />

                                        <Grid item xs={1.5}>
                                            <MDSelect defaultLabel={true} value={filter.is_active} placeholder={globalMessages.email_notification.select_status} handleChange={handleChange} options={options} />
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
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm message={globalMessages.email_notification.update_confirm} method={service.Methods.POST} url={service.API_URL.emailNotification.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>

    )

}

export default EmailNotificationList;