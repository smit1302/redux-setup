import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { service } from "utils/Service/service";
import ConfirmModal from "common/ConfirmModal";
import globalMessages from "utils/global";
import Select from "common/Select";
import MultipleSelect from "components/MDSelect";

// Define the table columns
interface TableColumn {
    Header: string;
    accessor: string;
    Cell?: ({ row }: { row: any }) => JSX.Element;
}

const RoleAssignment = () => {
    const [columns, setColumns] = useState<TableColumn[]>([]);
    const [rows, setRows] = useState([]);
    const [body, setBody] = useState({});
    const [options, setOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState<string | undefined>('');

    // Fetch organization and assigned from the API
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.getOrganizationRoles,
                params: selectedUser
            });

            // Extract organizations from the response
            const organizations = response?.data?.data?.organizations || [];

            // Map over organizations to create column headers and toggle switches
            const newColumns = organizations?.map((organization: any) => ({
                Header: organization.display_name || organization.name,
                accessor: organization.name,
                Cell: ({ row }: { row: any }) => (
                    <Switch
                        checked={row.original[organization.name]?.assigned}
                        onChange={() => handleToggleChange(row, organization?.name)}
                        disabled={(row.original[organization.name]?.assigned && row.original.role_name === 'No role to this site')}
                    />
                )
            }));

            const roleColumn = [{
                Header: "Roles",
                accessor: "role_name"
            }];

            if (newColumns?.length > 0) {
                setColumns([...roleColumn, ...newColumns]);
                setRows(response?.data?.data?.rows || []);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // Fetch user options from the API
    const fetchOptions = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.user.list
            });

            if (Array.isArray(response?.data?.data)) {
                setOptions(() => {
                    return response?.data?.data?.map((data: any) => {
                        return { value: data.user_id, label: data.name || data.user_name };
                    });
                });
                
                setSelectedUser(String(response?.data?.data[0]?.user_id));
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch options on component mount
    useEffect(() => {
        fetchOptions();
    }, [])

    // Fetch data when a user is selected
    useEffect(() => {
        if (selectedUser) {
            fetchData();
        }
    }, [selectedUser]);

    // Close the modal and fetch data
    const handleClose = (callApi?: boolean) => {
        if (callApi) {
            setTimeout(() => fetchData(), 500);
        }
        setBody({});
    }

    // function to handle the role assignment
    const handleToggleChange = async (row: any, organizationName: any) => {

        // case 1: select role
        if (row.original.role_id) {
            setBody({
                user_id: Number(selectedUser),
                role_id: Number(row.original.role_id),
                organization_id: Number(row.original[organizationName]?.organization_id),
                toggle: !row.original[organizationName]?.assigned,
            })
        }
        // case 2: update default organization 
        else if (row.original.role_name === 'Default Organization') {
            setBody({
                user_id: Number(selectedUser),
                organization_id: Number(row.original[organizationName]?.organization_id),
                is_default: !row.original[organizationName]?.assigned,
            })
        }
        // case 3: no role for organization
        else {
            setBody({
                user_id: Number(selectedUser),
                organization_id: Number(row.original[organizationName]?.organization_id),
                noRole: !row.original[organizationName]?.assigned,
            })
        }
    };

    // handle select user
    const handleChange = (event: any) => {
        setSelectedUser(String(event.target.value));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6} lg={12}>
                        <div style={{ marginBottom: '50px' }}>
                            <Card className='module_wrap'>
                                <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography variant="h6" color="white">
                                    {globalMessages.actionRight.role_assignment}
                                    </MDTypography>
                                </MDBox>
                                <MDBox pl={2} display='flex' alignItems='center' my={3} fontSize="medium">
                                    <Grid item xs={1.5}>
                                    <MultipleSelect
                                        value={selectedUser}
                                        placeholder={globalMessages.actionRight.select_user}
                                        options={options}
                                        handleChange={(e) => handleChange(e)}
                                    />
                                    </Grid>
                                </MDBox>
                                <MDBox pt={3}>
                                    {
                                        columns && rows &&
                                        <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                    }
                                </MDBox>
                            </Card>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
            <ConfirmModal message={globalMessages.actionRight.confirm} method={service.Methods.POST} url={service.API_URL.user.toggleOrganizationRole} visible={Object.keys(body).length !== 0} closeModal={handleClose} id={body} />

        </DashboardLayout>
    );
};

export default RoleAssignment;
