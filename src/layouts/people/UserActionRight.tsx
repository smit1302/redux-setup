import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Switch from "@mui/material/Switch";
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useEffect, useState } from "react";
import { service } from "utils/Service/service";
import Confirm from "common/ConfirmModal";
import globalMessages from "utils/global";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../redux/features/commonData/commonData";
import MultipleSelect from "components/MDSelect";

// interface for row
interface Row {
    id: number | null;
    Page: string;
    create: { permission_id: number, permission: boolean, flag: boolean };
    view: { permission_id: number, permission: boolean, flag: boolean };
    update: { permission_id: number, permission: boolean, flag: boolean };
    delete: { permission_id: number, permission: boolean, flag: boolean };
}

// interface for type permission
interface Permission {
    view: { permission_id: number, permission: boolean, flag: boolean };
    create: { permission_id: number, permission: boolean, flag: boolean };
    update: { permission_id: number, permission: boolean, flag: boolean };
    delete: { permission_id: number, permission: boolean, flag: boolean };
}

// interface incoming permission data
interface MenuResponse {
    id: number;
    menu_name: string;
    permissions: Permission;
}

// interface for dropdown
interface Dropdown {
    value: any;
    label: any;
}


const UserActionRight = () => {
    const currentUser = useSelector((state: any) => state?.commonData.commonData?.currentUser);
    const dispatchData = useDispatch();
    const [selectedValue, setSelectedValue] = useState(currentUser ? 'User Wise' : 'User Role Wise'); // Default selected value
    const [selectedUser, setSelectedUser] = useState<string | undefined>(currentUser || '');
    const [body, setBody] = useState({});
    const [rows, setRows] = useState<Row[]>([]);
    const [options, setOptions] = useState<Dropdown[]>([]);

    // function to fetch the permissions
    const fetchData = async () => {
        try {
            const api = selectedValue === 'User Role Wise' ? service.API_URL.roleAccess.roleRight : service.API_URL.roleAccess.userRight;
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: api,
                params: selectedUser,
                query: { forSelect: true }
            });

            const transformedArray: Row[] = response?.data.data?.map((item: MenuResponse) => {
                const row: Row = {
                    id: item.id,
                    Page: item.menu_name,
                    create: item.permissions.create,
                    view: item.permissions.view,
                    update: item.permissions.update,
                    delete: item.permissions.delete
                };
                return row;
            });
            setRows(transformedArray);
        } catch (error) {
            console.log('Error:', error); // Log any errors
        }
    };

    // function to fetch options for dropdown
    const fetchOptions = async () => {
        try {
            // according to selected value options will be fetched
            const url = selectedValue === 'User Role Wise' ? service.API_URL.roleAccess.getRoles : service.API_URL.user.list;
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: url,
                query: { forSelect: true }
            });
            const data = response?.data.data;
            if (Array.isArray(data)) {
                setOptions(() => {
                    return data?.map((data: any) => {
                        return { value: data.id || data.user_id, label: data.display_name || data.name || data.user_name };
                    });
                });
                if (currentUser === undefined) {
                    setSelectedUser(data[0]?.user_id ? String(data[0]?.user_id) : String(data[0]?.id));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect to fetch options and data
    useEffect(() => {
        fetchOptions();
        return () => {
            if (currentUser) {
                dispatchData(addData({ key: "currentUser", data: undefined }));
            }
        }
    }, [selectedValue])

    // useEffect to fetch data according to the selected user
    useEffect(() => {
        if (selectedUser) {
            fetchData();
        }
    }, [selectedUser]);


    // function to handle change in dropdown
    const handleChange = (event: any) => {
        console.log(event);
        setSelectedUser(String(event.target.value));
    };

    // function to handle change in dropdown
    const handleSelectChange = (event: any) => {
        setSelectedValue(event.target.value);
        setSelectedUser(String(event.target.value));
        setRows([]);
    }

    // function to handle click on select and unselect
    const handleClick = (data: any, toggle: boolean) => {
        let permission_ids: number[] = [];
        const row: any = rows[data?.row?.index]

        for (const key in row) {
            if (["create", "view", "update", "delete"].includes(key)) {
                permission_ids = [...permission_ids, row[key]?.permission_id];
            }
        }

        setBody(selectedValue === "User Role Wise" ? { role_id: Number(selectedUser) } : { user_id: Number(selectedUser) })
        setBody(prev => { return { ...prev, permission_ids, toggle } })
    }

    // function to handle close of confirm modal
    const handleClose = (callApi?: boolean) => {
        if (callApi) {
            setTimeout(() => fetchData(), 500);
        }
        setBody({});
    }

    // function to handle toggle change
    const handleToggleChange = async (row: any) => {
        setBody(selectedValue === "User Role Wise" ? { role_id: Number(selectedUser) } : { user_id: Number(selectedUser) })
        setBody(prev => { return { ...prev, permission_ids: [row.permission_id], toggle: !row.permission } });
    };

    // columns for the table
    const columns = [
        {
            Header: "Page",
            accessor: "Page",
        },
        {
            Header: "action",
            align: "center",
            columns: [
                {
                    Header: "Create",
                    accessor: "create",
                    align: "center",
                    Cell: ({ row }: { row: any }) => {

                        return (
                            <>
                                {
                                    row.original.create.permission_id &&
                                    <Switch
                                        checked={row.original.create.permission}
                                        onChange={() => handleToggleChange(row.original.create)}
                                        disabled={row.original.create.flag}
                                    />
                                }
                            </>)

                    },
                },

                {
                    Header: "View",
                    accessor: "view",
                    align: "center",
                    Cell: ({ row }: { row: any }) => {
                        return (
                            <>
                                {
                                    row.original.view.permission_id &&
                                    <Switch
                                        checked={row.original.view.permission}
                                        onChange={() => handleToggleChange(row.original.view)}
                                        disabled={row.original.view.flag}
                                    />
                                }
                            </>
                        )

                    },
                },
                {
                    Header: "Update",
                    accessor: "update",
                    align: "center",
                    Cell: ({ row }: { row: any }) => {
                        return (
                            <>
                                {
                                    row.original.update.permission_id &&
                                    <Switch
                                        checked={row.original.update.permission}
                                        onChange={() => handleToggleChange(row.original.update)}
                                        disabled={row.original.update.flag}
                                    />
                                }
                            </>
                        )

                    },
                },
                {
                    Header: "Delete",
                    accessor: "delete",
                    align: "center",
                    Cell: ({ row }: { row: any }) => {
                        return (
                            <>
                                {
                                    row.original.delete.permission_id &&
                                    <Switch
                                        checked={row.original.delete.permission}
                                        color={row.original.create.flag ? 'secondary' : 'default'}
                                        onChange={() => handleToggleChange(row.original.delete)}
                                        disabled={row.original.delete.flag}
                                    />
                                }
                            </>
                        )

                    },
                },
                {
                    Header: "Select/Unselect Row",
                    accessor: "select_unselect_Row",
                    align: "center",
                    Cell: (row: any) => (
                        <>
                            <MDButton variant="gradient" color="info" onClick={() => handleClick(row, true)}>Select</MDButton>
                            <MDButton variant="gradient" color="warning" onClick={() => handleClick(row, false)}>Un Select</MDButton>
                        </>
                    ),
                }
            ]
        },
    ]

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6} lg={12}>
                        {/* Right side of the first card */}
                        <div style={{ marginBottom: '50px' }}>
                            <Card className='module_wrap'>
                                <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography variant="h6" color="white">
                                        {globalMessages.actionRight.action_title}
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <Grid container spacing={3}>
                                        <Grid ml={3}>
                                            <MDBox pt={3} ml={3}>
                                                <RadioGroup value={selectedValue} onChange={handleSelectChange}>
                                                    <FormControlLabel value="User Role Wise" control={<Radio />} label={globalMessages.actionRight.user_role_wise_label} />
                                                </RadioGroup>
                                            </MDBox>
                                            <MDBox ml={3}>
                                                <RadioGroup value={selectedValue} onChange={handleSelectChange}>
                                                    <FormControlLabel value="User Wise" control={<Radio />} label={globalMessages.actionRight.user_wise_label} />
                                                </RadioGroup>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={11} sm={9} md={5} lg={15} xl={4}>
                                            <MDBox fontSize={'medium'} pt={3} ml={3}>
                                                <MultipleSelect
                                                    value={selectedUser}
                                                    placeholder={selectedValue === "User Wise" ? globalMessages.actionRight.select_user : globalMessages.actionRight.select_role}
                                                    options={options}
                                                    handleChange={(e) => handleChange(e)}
                                                />
                                            </MDBox>
                                        </Grid>
                                    </Grid>

                                </MDBox>
                                <MDBox pt={3} className='table_custom'>
                                    {/* Render DataTable component with columns and rows */}
                                    <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                </MDBox>
                            </Card>
                        </div>


                    </Grid>

                </Grid>
            </MDBox>
            <Footer />
            <Confirm message={globalMessages.actionRight.confirm} method={service.Methods.POST} url={selectedValue === 'User Role Wise' ? service.API_URL.roleAccess.toggleRolePermission : service.API_URL.roleAccess.toggleUserPermission} visible={Object.keys(body).length !== 0} closeModal={handleClose} id={body} />

        </DashboardLayout>

    );
}

export default UserActionRight;



