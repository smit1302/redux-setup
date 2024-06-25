import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../../common/ConfirmModal";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDInput from 'components/MDInput';
import { showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SelectComponent from "components/MDSelect";
import { useSelector } from "react-redux";

const ListCampaign: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [campaignType, setCampaignType] = useState<any[]>([]);
    const [promotioncode, setPromotionCode] = useState<any[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [customerGroup, setCustomerGroup] = useState<any[]>([]);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const campaign = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.Campaign);

    const [filter, setFilter] = useState({
        search: '',
    })
    const [selectedValues, setSelectedValues] = useState({
        campaign_type: '',
        email_template_id: '',
        promocode: '',
        customer_group_id: '',
    })

    const columns = [
        {
            Header: 'Select',
            accessor: 'select',
            Cell: ({ row }: { row: any }) => {
                return (
                    <>
                        {
                            campaign?.delete &&
                            <Checkbox
                                checked={selectedIds.includes(row.original.campaign_id)}
                                onChange={() => handleCheckboxChange(row.original.campaign_id)}
                            />
                        }
                    </>
                )
            },
            disableSortBy: true,
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            campaign?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.campaign_id)} >
                                <VisibilityIcon />
                            </IconButton>
                        }
                        {
                            campaign?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.campaign_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            campaign?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.campaign_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
        { Header: 'ID', accessor: 'campaign_id' },
        { Header: 'Website', accessor: 'website' },
        { Header: 'Title', accessor: 'title' },
        { Header: 'From Name', accessor: 'from_name' },
        { Header: 'From Email', accessor: 'from_email' },
        { Header: 'Campaign_type', accessor: 'campaign_type' },
        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch disabled={!campaign?.update} onClick={() => handleToggleStatus(record.row.original.campaign_id)} checked={record.row.original.is_active} />
                )
            }
        },
    ];

    const fetchData = async () => {
        const query = {
            search: filter.search.length > 2 ? filter.search : "",
            campaign_type: selectedValues.campaign_type || "",
            email_template_id: selectedValues.email_template_id || "",
            promocode: selectedValues.promocode || "",
            client_group_id: selectedValues.customer_group_id || "",
        };

        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.campaign.list,
                query: query
            });
            setRows(response?.data.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const queryData = () => {
        const filteredValues = Object.fromEntries(
            Object.entries(filter).filter(([key, value]) => {
                if (key === 'search') {
                    return value.length > 2;
                }
                return value !== undefined && value !== '';
            })
        );
        return filteredValues;
    };
    useEffect(() => {
        fetchData();
    }, [index, filter, selectedValues]);

    useEffect(() => {
        const fetchCampaignType = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setCampaignType(response.data.data.campaign_type);

            } catch (error) {
                console.log(error);
            }
        };

        const fetchPrmotion = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.promotionalCode.list,
                });
                if (response && response.data && response.data.data) {
                    const promotions = response.data.data?.map((promotion: any) => ({
                        id: promotion.promocode_id,
                        label: promotion.promocode_name,
                    }));
                    setPromotionCode(promotions);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchEmailTemplate = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.email_marketing.list,
                });
                if (response && response.data && response.data.data) {
                    const templates = response.data.data?.map((templates: any) => ({
                        id: templates.email_marketing_id,
                        label: templates.title,
                    }));
                    setEmailTemplates(templates);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchClientGroup = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.customer_group.get,
                });
                setCustomerGroup(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchClientGroup()
        fetchEmailTemplate();
        fetchPrmotion();
        fetchCampaignType();

    }, [index]);
    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id
                );
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };
    const handleDelete = async () => {
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    }

    const handleSelectedValueChangeById = (
        name: string,
        value: number | boolean | { label: string, value: any }
    ) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: typeof value === 'object' ? value.value : value,
        }));
    };
    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleToggleDelete = (campaign_id?: number) => {
        setIndex(campaign_id || undefined);
        setDeleteOpen(prevState => !prevState);
        if (campaign_id === undefined) {
        }
    };
    const handleNavigateUpdate = (campaign_id: number) => {
        history(`/campaign/update/${campaign_id}`);
    }

    const handleToggleView = async (campaign_id: number) => {
        history(`/campaign/view/${campaign_id}`);
    };

    const handleNavigation = () => {
        history('/campaign/add');
    };
    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
    }

    const handleToggleStatus = (campaign_id?: number) => {
        setIndex(campaign_id || undefined);
        setUpdateOpen(prevState => !prevState);
        if (campaign_id === undefined) {
        }
    };
    const downloadCsv = () => {
        const filteredColumns = columns.filter(
            (col) => col.accessor && col.accessor !== "action" && col.accessor !== "select"
        );
        const header = filteredColumns?.map((col) => col.Header);
        const csv = rows
            ?.map((row: any) =>
                filteredColumns
                    ?.map((col) => {
                        if (col.accessor === "created_at") {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = "Campaign.csv";
        ExportToCsv(convertedData, fileName);
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "10px" }} className='module_wrap'>
                                <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        Campaign
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className="action-button" variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {campaign?.create && <MDButton className="action-button" sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3}>
                                    <Grid container spacing={5} className='col_bx_inner'>
                                        <Grid item xs={12}>
                                            <Card style={{ padding: "10px" }}>
                                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                                    <Grid container spacing={3} alignItems="center">
                                                        <Grid item xs={12} sm={3} className='col_p'>
                                                            <MDInput
                                                                label="Search Keyword"
                                                                placeholder="Keyword"
                                                                style={{ backgroundColor: "white" }}
                                                                value={filter.search}
                                                                onChange={handleSearchChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} >
                                                            <SelectComponent
                                                                placeholder="Campaign Type"
                                                                options={campaignType?.map((method: any) => ({ value: method.label, label: method.label }))}
                                                                handleChange={(e) => handleSelectedValueChange("campaign_type", e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={7}>
                                                            <SelectComponent
                                                                placeholder="Email Template"
                                                                options={emailTemplates?.map((method: any) => ({ value: method.id, label: method.label }))}
                                                                handleChange={(e) => handleSelectedValueChangeById("email_template_id", e.target.value)}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={7} >
                                                            <SelectComponent
                                                                placeholder="Promotion Code"
                                                                options={promotioncode.map(
                                                                    (
                                                                        method: any
                                                                    ) => ({
                                                                        value: method.label,
                                                                        label: method.label,
                                                                    })
                                                                )}
                                                                handleChange={(e) => handleSelectedValueChange("promocode", e.target.value)} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={8}>

                                                            <SelectComponent
                                                                placeholder="Customer Group"
                                                                options={customerGroup.map((customer) => ({
                                                                    value: customer.customer_group_id,
                                                                    label: customer.name
                                                                }))}
                                                                handleChange={(e) => handleSelectedValueChange("customer_group_id", e.target.value)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </MDTypography>
                                                <Grid container spacing={3} alignItems="center" justifyContent="space-between" style={{ marginTop: 8 }}> {/* Decreased spacing from 4 to 3 */}
                                                    <Grid item>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item>

                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </MDBox>

                                <MDBox pt={3} className='table_custom'>
                                    <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                </MDBox>
                            </Card>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "20px",
                                    marginRight: "40px",
                                }}
                            >
                                {
                                    campaign?.delete &&
                                    <MDButton onClick={handleDelete} color="error">
                                        Delete
                                    </MDButton>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            <Confirm
                message="Do you want to delete the Template?"
                method={service.Methods.DELETE}
                url={service.API_URL.campaign.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='are you sure, you want to delete campaign?' method={service.Methods.DELETE} url={service.API_URL.campaign.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={index} />
            <Confirm message='are you sure, you want to update campaign?' method={service.Methods.GET} url={service.API_URL.campaign.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}
export default ListCampaign;


