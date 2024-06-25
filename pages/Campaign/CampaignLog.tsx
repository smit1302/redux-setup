import React, { useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import MDInput from 'components/MDInput';
import SelectComponent from "components/MDSelect";
import globalMessages from 'utils/global';
import { showFormattedDate } from "utils/common";

interface CampaignLogProps {
    method: string;
}
const CampaignLog: React.FC = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [campaignType, setCampaignType] = useState<any[]>([]);
    const [emailtemplates, setEmailTemplates] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [emailcampaignStatus, setEmailCampaignStatus] = useState<any[]>([]);
    const [customerAction, setCustomerAction] = useState<any[]>([]);
    const [promotioncode, setPromotionCode] = useState<any[]>([]);
    const [customerGroup, setCustomerGroup] = useState<any[]>([]);
    const [rows, setRows] = useState<any>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const [filter, setFilter] = useState({
        search: '',
    })

    const [selectedValues, setSelectedValues] = useState({
        email_campaign_status: '',
        mendrill_sennding_satus: '',
        customer_action: '',
        campaign_type: '',
        email_campaign: '',
        promocode: '',
        clientGroup: '',
        email_template_id: '',
        customer_group_id: '',

    })

    const columns = [
        { Header: 'ID', accessor: 'campaign_id' },
        { Header: 'Template', accessor: 'email_template_id', align: 'center', width: 150 },
        { Header: 'Subject', accessor: 'title' },
        { Header: 'From Name', accessor: 'from_name' },
        { Header: 'From Email', accessor: 'from_email' },
        { Header: 'Customer', accessor: 'client_group_id' },
        { Header: 'Status', accessor: 'status ' },
        {
            Header: 'Campaign Date', accessor: 'campaign_date',
            Cell: (record: any) => showFormattedDate(record.row.original.campaign_date), width: 150
        },
        {
            Header: 'Mail Sent Date', accessor: 'mail_sent_date',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at), width: 150
        }
    ];
    useEffect(() => {
        const fetchData = async () => {
            const query = {
                search: filter.search.length > 2 ? filter.search : "",
                email_campaign_status: (selectedValues.email_campaign_status !== "all" && selectedValues.email_campaign_status) ? selectedValues.email_campaign_status : "",
                customer_action: (selectedValues.customer_action !== "all" && selectedValues.customer_action) ? selectedValues.customer_action : "",
                campaign_type: (selectedValues.campaign_type !== "all" && selectedValues.campaign_type) ? selectedValues.campaign_type : "",
                email_template_id: (selectedValues.email_template_id !== "all" && selectedValues.email_template_id) ? selectedValues.email_template_id : "",
                email_campaign: (selectedValues.email_campaign !== "all" && selectedValues.email_campaign) ? selectedValues.email_campaign : "",
                promocode: (selectedValues.promocode !== "all" && selectedValues.promocode) ? selectedValues.promocode : "",
                client_group_id: (selectedValues.customer_group_id !== "all" && selectedValues.customer_group_id) ? selectedValues.customer_group_id : ""
            };
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.campaign.list,
                    query: query
                });
                setRows(response?.data?.data);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, [index, filter, selectedValues]);
    useEffect(() => {
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
        const fetchCampaignType = async () => {
            try {
                const response: any = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.masterSelect.get,
                });
                setCustomerAction(response.data.data.customer_action);
                setEmailCampaignStatus(response.data.data.email_campaign_status);
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
                    const promotions = response.data.data.map((promotion: any) => ({
                        id: promotion.promocode_id,
                        label: promotion.promocode_name,
                    }));
                    setPromotionCode(promotions);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchEmailTemplate();
        fetchPrmotion();
        fetchClientGroup();
        fetchCampaignType();

    }, []);

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, search: event.target.value });
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
    const convertToCSV = () => {
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action');
        const header = filteredColumns.map(col => col.Header);

        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map(col => row[col.accessor!])
                    .join(",")
            )
            .join("\n");

        return `${header.join(",")}\n${csv}`;
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card style={{ padding: "10px" }} className='module_wrap' >
                                <MDBox className='module_head' mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between" variant="h6" color="white">
                                        Campaign Log
                                        {/* <Grid>
                                            <MDButton variant="gradient" onClick={() => history(-1)}>
                                                {globalMessages.btn_text.back_button_text}
                                            </MDButton>
                                        </Grid> */}
                                    </MDTypography>
                                </MDBox>
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" Campaign Log variant="h6" color="white" style={{ padding: "10px" }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={3}>
                                            <MDInput
                                                label="Search Keyword"
                                                placeholder="Keyword"
                                                style={{ backgroundColor: "white" }}
                                                value={filter.search}
                                                onChange={handleSearchChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <SelectComponent
                                                defaultLabel={true}
                                                placeholder="Email Campaign Status"
                                                options={emailcampaignStatus.map(
                                                    (
                                                        method: any
                                                    ) => ({
                                                        value: method.id,
                                                        label: method.label,
                                                    })
                                                )}
                                                handleChange={(e) => handleSelectedValueChange("email_campaign_status", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <SelectComponent
                                                defaultLabel={true}
                                                placeholder="Customer Action"
                                                options={customerAction.map(
                                                    (
                                                        method: any
                                                    ) => ({
                                                        value: method.id,
                                                        label: method.label,
                                                    })
                                                )}
                                                handleChange={(e) => handleSelectedValueChange("customer_action", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <SelectComponent
                                                defaultLabel={true}
                                                placeholder="Campaign Type"
                                                options={campaignType?.map(
                                                    (
                                                        method: any
                                                    ) => ({
                                                        value: method.label,
                                                        label: method.label,
                                                    })
                                                )}
                                                handleChange={(e) => handleSelectedValueChange("campaign_type", e.target.value)}

                                            />
                                        </Grid>
                                        <Grid item container xs={12} spacing={4} alignItems="center">
                                            <Grid item xs={12} sm={3}>
                                                <SelectComponent
                                                    defaultLabel={true}
                                                    placeholder="Email Template"
                                                    options={emailtemplates?.map(
                                                        (
                                                            method: any
                                                        ) => ({
                                                            value: method.id,
                                                            label: method.label,
                                                        })
                                                    )}
                                                    handleChange={(e) => handleSelectedValueChangeById("email_template_id", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <SelectComponent
                                                    defaultLabel={true}
                                                    placeholder="Email Campaign"
                                                    options={emailcampaignStatus.map(
                                                        (
                                                            method: any
                                                        ) => ({
                                                            value: method.id,
                                                            label: method.label,
                                                        })
                                                    )}
                                                    handleChange={(e) => handleSelectedValueChangeById("email_campaign", e.target.value)}


                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <SelectComponent
                                                    defaultLabel={true}
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
                                            <Grid item xs={12} sm={3}>
                                                <SelectComponent
                                                    defaultLabel={true}
                                                    placeholder="Customer Group"
                                                    options={customerGroup.map((customer) => ({
                                                        value: customer.customer_group_id,
                                                        label: customer.name
                                                    }))}
                                                    handleChange={(e) => handleSelectedValueChange("customer_group_id", e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </MDTypography>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={3}>
                    <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                </MDBox>
                <Footer />
            </DashboardLayout>
        </>
    )
}

export default CampaignLog;


