import { Box, Grid, IconButton } from "@mui/material";
import { Card } from "@mui/material";
import { service } from "utils/Service/service";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import { useNavigate } from 'react-router-dom';
import MDInput from 'components/MDInput';
import Select from "components/MDSelect";
import { useState, useEffect } from 'react';
import { Row } from "react-table";
import { showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Country } from 'country-state-city';
import { ShoppingCartOutlined, Visibility } from "@mui/icons-material";

interface ViewCustomerProps {
    method: string;
}

const ViewCustomer: React.FC<ViewCustomerProps> = ({ method }) => {

    const [controller, dispatch] = useMaterialUIController();
    const dispatchData = useDispatch();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [buisnessType, setBuisnessType] = useState<any[]>([]);
    const [customerActions, setCustomerActions] = useState<any[]>([]);
    const [product, setProduct] = useState<any[]>([]);
    const [orderStatus, setOrderStatus] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<number | null>(null);
    const [lifeCycleStage, setLifeCycleStage] = useState<any[]>([]);
    const customer = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Customer);


    const [filter, setFilter] = useState({
        from_date: "",
        to_date: "",
        search: "",
        order_status: "",
        business_type: "",
        product: "",
        country: "",
        bde: "",
        life_cycle_stage: "",
        activity_count_to: "",
        activity_count_from: "",
        worth_to: "",
        worth_from: "",
    });



    const columns = [
        {
            Header: 'Select',
            //accessor: 'sr_no',
            Cell: ({ row }: any) => (
                <input
                    type="checkbox"
                    checked={selectedCustomer === row.original.sr_no}
                    onChange={() => handleCheckboxChange(row.original.sr_no)}
                />
            )
        },
        {
            Header: 'SR NO.',
            accessor: 'sr_no',
            Cell: ({ row }: any) => (
                <div>
                    {row.original.sr_no}
                </div>
            )
        },
        // { Header: 'Owner',accessor: 'organization'  },
        {
            Header: 'Customer ', accessor: 'name',
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.name}</div>
                    <div>{row.original.email}</div>
                    {
                        customer?.Cart?.create &&
                        <IconButton
                            onClick={() =>
                                handleNavigate(row.original?.sr_no)
                            }
                        >
                            <ShoppingCartOutlined color="success" fontSize="small" />
                        </IconButton>
                    }
                </div>
            )
        },
        { Header: 'Location', accessor: 'address' },
        {
            Header: 'Buisness', accessor: 'total_order_amount',
            Cell: ({ value }: any) => (<div><div>Orders: {value}</div></div>)
        },
        {
            Header: 'Opportunity', accessor: 'total_opportunity_amount',
            Cell: ({ value }: any) => (<div><div>Total: {value}</div></div>)
        },
        // { Header: 'Last Activity' ,accessor: '' },
        {
            Header: 'Assigned on', accessor: 'registered_date', align: "center",
            Cell: (record: any) =>
                showFormattedDate(record.row.original.registered_date),
        },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }: { row: Row }) => {
                const options = customerActions.map((method: any) => ({
                    value: method.id,
                    label: method.label,
                }));
                return (
                    <>
                        <Grid item xs={12} className='col_p'>
                            <Select
                                value={selectedAction}
                                options={options}
                                handleChange={(selectedOption: any) => {
                                    setSelectedAction(selectedOption.target.value);
                                }}
                                placeholder={"Actions"}
                            />
                            <MDBox
                                sx={{
                                    width: '100px',
                                }}
                            />
                        </Grid>
                    </>
                );
            }
        },
    ];
    const customerId = useSelector((state: any) => state?.commonData.commonData);

    useEffect(() => {
        if (selectedAction !== null) {
            switch (selectedAction) {
                case 1:
                    history("/email-activity");
                    break;
                case 2:
                    history("/log-activity");
                    break;
                case 3:
                    history("/note");
                    break;
                case 4:
                    history("/task");
                    break;
                case 5:
                    history("/reminder");
                    break;
                case 6:
                    history("/scope-of-work");
                    break;
                case 7:
                    history("/order-allocation");
                    break;
                default:
                    break;
            }
        }
    }, [selectedAction]);


    useEffect(() => {
        fetchData();
    }, [filter])

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            from_date: filter.from_date || "",
            to_date: filter.to_date || "",
            order_status: filter.order_status || "",
            business_type: filter.business_type || "",
            product: filter.product || "",
            country: filter.country || "",
            bde: filter.bde || "",
            life_cycle_stage: filter.life_cycle_stage || "",
            activity_count_to: filter.activity_count_to || "",
            activity_count_from: filter.activity_count_from || "",
            worth_to: filter.worth_to || "",
            worth_from: filter.worth_from || "",
        };
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer.list,
                query: query,
            });
            if (response?.data?.data && response.data.data.length > 0) {
                setSelectedCustomer(response?.data?.data[0].sr_no);
                dispatchData(addData({ key: 'customer_id', data: response.data.data[0].sr_no }));
            }
            setRows(response?.data?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDropdownData = async () => {
        try {
            const response: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.masterSelect.get,
            });
            setOrderStatus(Array.isArray(response?.data?.data?.active_options) ? response?.data?.data?.active_options : [])
            setBuisnessType(response.data.data.buisness_type);
        } catch (error) {
            console.log(error)
        }

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.product.list,
            });
            setProduct(response?.data?.data);
        } catch (error) {
            console.log(error)
        }

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.customer_group.lifecycleStage,
            });
            setLifeCycleStage(response?.data?.data);
        } catch (error) {
            console.log(error)
        }

        try {
            const filterUserDataByRole = (userData: any[], roleName: string) => {
                return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
                    value: user.user_id,
                    label: user.name,
                }));
            };
            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            setBde(bde);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCountries = async () => {
        const countryList = Country.getAllCountries();
        setCountries(() => {
            return countryList.map((country: any) => {
                return { value: country.name, label: country.name, countryCode: country.isoCode };
            });
        });
    };

    const handleNavigate = (id: number) => {
        history(`/cart-item/${id}`)
    }

    // Fetch data from the API and set it into the state
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setCustomerActions(response?.data?.data?.order_action);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCountries();
        fetchDropdownData();
        fetchData();
    }, []);

    const handleCheckboxChange = (customer_id: number) => {
        setSelectedCustomer(customer_id);
        dispatchData(addData({ key: "customer_id", data: customer_id }));
    };

    const handleAddNavigation = () => {
        history('/my-customer/add');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, search: event.target.value });
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };

    const downloadCsv = () => {
        const header = [
            "sr_no",
            "Customer",
            "Location",
            "Buisness",
            "Opportunity",
            "Assigned on",
            // Add other columns here
        ];

        const csv = rows.map((row: any) => {
            const name = `${row.name}, ${row.email}`;
            const registered_date = `${showFormattedDate(row.registered_date)}`;
            const rowData = [
                row.sr_no,
                `"${name}"`,
                row.address,
                row.total_order_amount,
                row.total_opportunity_amount,
                `"${registered_date}"`,
                // Add other column data here
            ].join(",");
            return rowData;
        }).join("\n");

        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Customers.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card className='module_wrap'>
                            <MDBox mx={2} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    Customer
                                    <Grid className='action_wrap d_flex'>
                                        <MDButton className='action-button' onClick={downloadCsv} color={'white'} children={<SystemUpdateAltIcon />} />
                                        {customer?.["My Customer"]?.create && <MDButton className='action-button' sx={{ marginLeft: '20px' }} variant={'contained'} color={'white'} onClick={handleAddNavigation} children='+' />}
                                    </Grid>
                                </MDTypography>
                            </MDBox>

                            <Grid container spacing={6}>
                                <Grid item xs={12}>
                                    <Card style={{ padding: "20px" }}>
                                        <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                            <Grid container spacing={2} className='col_bx_inner'>
                                                <Grid item xs={12} className='col_p' >
                                                    <MDInput
                                                        label="Search Keyword"
                                                        placeholder="Keyword"
                                                        value={filter.search}
                                                        onChange={handleSearchChange}
                                                        fullWidth
                                                    />
                                                </Grid>

                                                <Grid item xs={12} className='col_p' >
                                                    <Select placeholder="Buisness Type" options={buisnessType}
                                                        value={filter.business_type}
                                                        handleChange={(e) => handleChange("business_type", e.target.value)} />
                                                </Grid>
                                                <Grid item xs={12} className='col_p' >
                                                    <Select placeholder="Products in cart"
                                                        options={product.map(product => ({
                                                            value: product.id,
                                                            label: product.name,
                                                        }))}
                                                        value={filter.product}
                                                        handleChange={(e) => handleChange("product", e.target.value)} />
                                                </Grid>
                                            </Grid>
                                            <Box m={1} />
                                            <Grid container spacing={2} className='col_bx_inner'>
                                                <Grid item xs={12} className='col_p' >
                                                    <MDInput
                                                        label="From"
                                                        type="date"
                                                        className={filter.from_date ? "has-value" : ""}
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
                                                <Grid item xs={12} className='col_p'>
                                                    <Select placeholder="Country"
                                                        options={countries}
                                                        value={filter.country}
                                                        handleChange={(e) => handleChange("country", e.target.value)} />
                                                </Grid>
                                                <Grid item xs={12} className='col_p'>
                                                    <Select placeholder="Life Cycle Stage"
                                                        options={lifeCycleStage.map(lifeCycleStage => ({
                                                            value: lifeCycleStage.life_cycle_stage_id,
                                                            label: lifeCycleStage.name
                                                        }))}
                                                        value={filter.life_cycle_stage}
                                                        handleChange={(e) => handleChange("life_cycle_stage", e.target.value)} />

                                                </Grid>
                                            </Grid>
                                            <Box m={1} />
                                            <Grid container spacing={2} className='col_bx_inner'>
                                                <Grid item xs={12} className='col_p' >
                                                    <MDInput
                                                        label="To"
                                                        type="date"
                                                        className={filter.to_date ? "has-value" : ""}
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
                                                <Grid item xs={12} className='col_p'>
                                                    <MDInput onChange={(e: any) => setFilter(prev => ({ ...prev, "worth_from": e.target.value }))} label="Worth From" type="number" fullWidth />
                                                </Grid>

                                                <Grid item xs={12} className='col_p' >
                                                    <MDInput onChange={(e: any) => setFilter(prev => ({ ...prev, "activity_count_to": e.target.value }))} label="Activity Count To" type="number" fullWidth />
                                                </Grid>

                                            </Grid>
                                            <Box m={1} />
                                            <Grid container spacing={2} className='col_bx_inner'>

                                                <Grid item xs={12} className='col_p' >
                                                    <Select placeholder="Select Order Status" options={orderStatus.map((status: any) => ({
                                                        value: status.value,
                                                        label: status.label
                                                    }))}
                                                        value={filter.order_status}
                                                        handleChange={(e) => handleChange("order_status", e.target.value)} />

                                                </Grid>

                                                <Grid item xs={12} className='col_p'>
                                                    <MDInput onChange={(e: any) => setFilter(prev => ({ ...prev, "worth_to": e.target.value }))} label="Worth To" type="number" fullWidth />
                                                </Grid>

                                                <Grid item xs={12} className='col_p'>
                                                    <MDInput style={{ opacity: "0" }} label="Worth To" type="number" fullWidth />
                                                </Grid>
                                            </Grid>
                                            <Box m={1} />
                                            <Grid container spacing={2} className='col_bx_inner'>
                                                <Grid item xs={12} className='col_p' >
                                                    <MDInput onChange={(e: any) => setFilter(prev => ({ ...prev, "activity_count_from": e.target.value }))} label="Activity Count From" type="number" fullWidth />
                                                </Grid>

                                                <Grid item xs={12} className='col_p'>

                                                    <Select placeholder="Select Lead Owner"
                                                        options={bde}
                                                        value={filter.bde}
                                                        handleChange={(e) => handleChange("bde", e.target.value)} />
                                                </Grid>
                                                <Grid item xs={12} className='col_p'>
                                                    <MDInput style={{ opacity: "0" }} label="Worth To" type="number" fullWidth />
                                                </Grid>
                                            </Grid>

                                        </MDTypography>
                                    </Card>
                                </Grid>
                            </Grid>
                            <MDBox pt={1} >
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />

        </>
    )
}

export default ViewCustomer;
