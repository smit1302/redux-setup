import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Switch } from "@mui/material";
import { Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import { Add, Person } from '@mui/icons-material';
import Checkbox from "@mui/material/Checkbox";
import './style.css'
import { service } from 'utils/Service/service';
import Confirm from "common/ConfirmModal";
import { useDispatch, useSelector } from 'react-redux';
import { addData } from "../../redux/features/commonData/commonData";
import EditIcon from "@mui/icons-material/Edit";
import globalMessages from 'utils/global';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMaterialUIController } from 'context';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ExportToCsv from 'utils/ExportToCsv';
import MDSelect from 'components/MDSelect';

// interface for listing users
interface UserData {
    user_id: string;
    organization: string;
    user_name: string;
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    organizationName: string;
    is_active: boolean;
}

const UserList: React.FC = () => {
    // necessary states and variables
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [selectedId, setSelectedId] = useState<number[]>([]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData[]>([]);
    const [options, setOptions] = useState([]);
    const dispatchData = useDispatch();
    const [index, setIndex] = useState<undefined | number[]>(undefined);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [roleOption, setRoleOption] = useState<{ id: any; display_name: any; }[] | undefined>(undefined);
    const [filter, setFilter] = useState({ from_date: "", to_date: "", search: "", is_active: "", role: "" });
    const user = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.People?.User);

    // fetch options on component mount
    useEffect(() => {
        fetchOptions();
        FetchUserRole();
    }, [])

    // fetch data on filter change
    useEffect(() => {
        fetchData();
    }, [filter]);

    // function to fetch the user records
    const fetchData = async () => {
        let query = {}
        if (filter.search.length > 2) {
            query = { search: filter.search }
        }
        if (filter.from_date) {
            query = { ...query, from: filter.from_date }
        }

        if (filter.to_date) {
            query = { ...query, to: filter.to_date }
        }

        if (filter.role) {
            query = { ...query, role_id: filter.role }
        }

        if (filter.is_active !== undefined) {
            query = { ...query, is_active: filter.is_active }
        }

        try {
            const userDatalistResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: `${service.API_URL.people.list}`,
                query: query,
            });

            setUserData(userDatalistResponse?.data?.data || []);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    // function to fetch user Role options
    const FetchUserRole = async () => {
        try {
            const userRoleResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.userRole,
                query: { forSelect: true }
            })
            const Roles = userRoleResponse?.data.data
            if (Roles && Array.isArray(Roles)) {
                const UserRole = Roles?.map(role => ({ id: role.id, display_name: role.display_name }));
                setRoleOption(UserRole);
            }

        } catch (err) {
            console.error("Error fetching user Role:", err);
        }
    }

    // function to fetch options for dropdown
    const fetchOptions = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });
            setOptions(response?.data?.data?.active_options);
        } catch (error) {
            console.log(error);
        }
    }

    // function to handle search change
    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    };

    // function to handle date change
    const handleDateChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    // function to handle active attribute change
    const handleChange = (event: any) => {
        setFilter({ ...filter, is_active: event.target.value });
    };

    // function to handle role attribute change
    const ChangeValue = (event: any, fieldName: string) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            role: String(event.target.value),
        }));
    };

    // function to handle selected users
    const handleCheckboxChange = (id: number) => {
        setSelectedId((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id
                );
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    // function to navigate to view user
    const handleToggleView = (id: number) => {
        navigate(`/user/view/${id}`);
    }

    // function to navigate to update user
    const handleNavigateUpdate = (id: number) => {
        navigate(`/user/update/${id}`);
    }

    // function to navigate to user action right page
    const navigateToUserAction = (id: number) => {
        dispatchData(addData({ key: "currentUser", data: id }));
        navigate(`/user-action-right`);
    }

    // columns for the table
    const columns = [
        {
            accessor: "checkbox",
            width: 10,
            Cell: (record: any) => {
                const id = record.row.original.id;
                const isChecked = selectedId.includes(id);
                return (
                    <>
                        {
                            user?.delete &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                    </>
                );
            },
        },
        {
            Header: 'Action',
            align: 'center',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            user?.view &&
                            <IconButton
                                onClick={() =>
                                    handleToggleView(record.row.original.id)
                                }
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        }
                        {
                            user?.update &&
                            <IconButton
                                onClick={() =>
                                    handleNavigateUpdate(record.row.original.id)
                                }
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        }
                        {
                            user?.delete &&
                            <IconButton
                                onClick={() =>
                                    handleToggleDelete(record.row.original.id)
                                }
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        }
                        <IconButton className="action-button" onClick={() => navigateToUserAction(record.row.original.id)}>
                            <Person fontSize="small" />
                        </IconButton>

                    </>
                );
            }
        },
        {
            Header: "ID",
            accessor: "id",
            align: "center",

        },
        {
            Header: "Organization",
            accessor: "organization",
            align: "center",

        },
        {
            Header: "User Name",
            accessor: "username",
            align: "center",

        },
        {
            Header: "Name",
            accessor: "name",
            align: "center",

        },
        {
            Header: "Address",
            accessor: "address",
            align: "center",

        },
        {
            Header: "City",
            accessor: "city",
            align: "center",

        },
        {
            Header: "State",
            accessor: "state",
            align: "center",

        },
        {
            Header: "Phone",
            accessor: "phone",
            align: "center",

        },
        {
            Header: "Email",
            accessor: "email",
            align: "center",

        },
        {
            Header: "is Active",
            accessor: "is_active",
            align: "center",
            Cell: ({ row }: { row: any }) => {
                return (
                    <Switch
                        checked={row.original.is_active}
                        disabled={!(user?.update)}
                        onChange={() => handleToggleStatus(row.original.id)} // Pass id to handleToggle
                    />
                );
            },
        }

    ]

    const rows = userData?.map(user => ({
        id: user.user_id,
        organization: user.organization,
        username: user.user_name,
        name: user.name,
        address: user.address,
        city: user.city,
        state: user.state,
        phone: user.phone,
        email: user.email,
        is_active: user.is_active,
    }));

    // function to navigate to add user
    const handleNavigation = () => {
        navigate('/user/add');
    };

    // function to handle toggle of is_active 
    const handleToggleStatus = (id?: number | boolean) => {
        setUpdateOpen((prevState) => !prevState);
        setIndex((typeof id === 'number') ? [id] : undefined);
        if (id === true) {
            fetchData();
        }
    };

    // function to handle delete of user
    const handleToggleDelete = (id?: number | boolean) => {
        setDeleteOpen((prevState) => !prevState);
        setSelectedId((typeof id === 'number') ? [id] : []);
        if (typeof id)
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
                            <Card style={{ padding: "10px" }} className='module_wrap'>
                                <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        {globalMessages.user.table}

                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' sx={{ mr: 2 }} onClick={downloadCSV} variant={'contained'} children={<  SystemUpdateAltIcon />} />
                                            <MDButton className='action-button' variant={'contained'} onClick={handleNavigation} children={<Add />} />
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox mx={2} mt={3} display='flex' justifyContent='space-around' alignItems='center'  >

                                    <MDBox fontSize='medium' flex='6' display='flex' alignItems='center'>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} sm={2}>
                                                <MDInput
                                                    label={globalMessages.user.search}
                                                    placeholder={globalMessages.user.search}
                                                    style={{ backgroundColor: "white" }}
                                                    value={filter.search}
                                                    onChange={handleSearchChange}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <MDInput
                                                    label={globalMessages.user.from_date}
                                                    className={filter.from_date ? "has-value" : ""}
                                                    type="date"
                                                    value={filter.from_date}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        handleDateChange(
                                                            "from_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <MDInput
                                                    label={globalMessages.user.to_date}
                                                    type="date"
                                                    value={filter.to_date}
                                                    className={filter.to_date ? "has-value" : ""}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        handleDateChange(
                                                            "to_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <MDSelect
                                                    defaultLabel={true}
                                                    placeholder={globalMessages.user.select_role}
                                                    options={(roleOption || [])?.map(role => ({ value: role.id, label: role.display_name }))}
                                                    handleChange={(event: any) => ChangeValue(event, "role")}
                                                    value={filter.role}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <MDSelect
                                                    defaultLabel={true}
                                                    value={filter.is_active}
                                                    placeholder={
                                                        globalMessages.user.select_status
                                                    }
                                                    handleChange={handleChange}
                                                    options={options}
                                                />
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                                <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                <MDBox mt={4} ml={3} mb={1}>
                                    <MDButton disabled={selectedId.length === 0} onClick={() => setDeleteOpen(true)} color="error">
                                        Delete
                                    </MDButton>

                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox >
                <Footer />
            </DashboardLayout >

            <Confirm message={globalMessages.user.update_confirm} method={service.Methods.POST} url={service.API_URL.people.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
            <Confirm message={globalMessages.user.delete_confirm} method={service.Methods.DELETE} url={service.API_URL.people.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={selectedId} />

        </>
    )
}

export default UserList;