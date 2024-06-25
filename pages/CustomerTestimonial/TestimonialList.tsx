import React, { useEffect, useState } from "react";
import { IconButton, Grid, Switch, Card, Checkbox } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
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
import globalMessages from 'utils/global';
import { decodeHTML, showFormattedDate } from "utils/common";
import ExportToCsv from "utils/ExportToCsv";
import { Add } from "@mui/icons-material";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SelectComponent from "components/MDSelect";
import { useSelector } from "react-redux";

const ListTestimonial: React.FC = ({ }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const history = useNavigate();
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<any>([]);
    const [customername, setCustomerName] = useState<any[]>([]);
    const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [index, setIndex] = useState<number | undefined>(undefined);
    const testimonial = useSelector((state: any) => state.commonData.commonData.userData?.permissions?.Marketing?.["Testimonials"]);
    const [filter, setFilter] = useState({
        search: "",
        from_date: "",
        to_date: "",
        customer_name: "",
    });
    const [selectedValues, setSelectedValues] = useState({
        customer_name: "",
    })


    const columns = [
        {
            Header: 'Select',
            accessor: 'select',
            Cell: (record: any) => {
                const id = record.row.original.testimonial_id;
                const isChecked = selectedIds.includes(id);
                return (
                    <>
                        {
                            testimonial?.delete &&
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(id)}
                            />
                        }
                    </>
                );
            },
            width: 200,
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: (record: any) => {
                return (
                    <>
                        {
                            testimonial?.view &&
                            <IconButton onClick={() => handleToggleView(record.row.original.testimonial_id)} >
                                <VisibilityIcon />
                            </IconButton>

                        }
                        {
                            testimonial?.update &&
                            <IconButton onClick={() => handleNavigateUpdate(record.row.original.testimonial_id)}>
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            testimonial?.delete &&
                            <IconButton onClick={() => handleToggleDelete(record.row.original.testimonial_id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                    </>
                )
            },
            width: 200,
        },
        { Header: 'ID', accessor: 'testimonial_id', width: '100px' },
        { Header: 'Customer Link', accessor: 'customer_link', align: 'center' },
        { Header: 'Customer Name', accessor: 'customer_name' },
        { Header: 'Customer Company', accessor: 'customer_company' },
        { Header: 'Customer Designation', accessor: 'customer_designation' },
        {
            Header: 'Description',
            accessor: 'description',
            Cell: (record: any) => decodeHTML(record.row.original.description),
            width: "10%"
        },
        { Header: 'Ratings', accessor: 'rating' },
        { Header: 'Image', accessor: 'customer_photo' },
        {
            Header: 'Created BY', accessor: 'created_by_user',
        },
        {
            Header: 'Created Date',
            accessor: 'created_at',
            Cell: (record: any) => showFormattedDate(record.row.original.created_at),
        },
        { Header: 'Updated BY', accessor: 'updated_by_user' },
        {
            Header: 'Updated Date',
            accessor: 'updated_at',
            Cell: (record: any) => showFormattedDate(record.row.original.updated_at),
        },

        {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: (record: any) => {
                return (
                    <Switch disabled={!testimonial?.update} onClick={() => handleToggleStatus(record.row.original.testimonial_id)} checked={record.row.original.is_active} />
                )
            }
        },
    ];

    const fetchData = async () => {
        try {
            const query = {
                search: filter.search.length > 2 ? filter.search : "",
                from_date: filter.from_date || "",
                to_date: filter.to_date || "",
                customer_name: selectedValues.customer_name
            };

            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.testimonial.list,
                query: query,
            });

            if (response && response.data && response.data.data) {
                const customer = response.data.data?.map((customer: any) => ({
                    id: customer.testimonial_id,
                    label: customer.customer_name,
                }));
                setCustomerName(customer);

                setRows(response.data.data);
            } else {
                console.error("Failed to fetch data: Response is undefined or data is missing.");
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [index, filter]);

    //handle selected checkbox
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

    const handleToggleDelete = (email_marketing_id?: number) => {
        setIndex(email_marketing_id || undefined);
        setDeleteOpen(prevState => !prevState);
    };

    const handleDelete = async () => {
        console.log("IDS SELECTED", selectedIds)
        setDeleteMultipleOpen((prevState) => !prevState);
        fetchData();
    }

    const handleNavigateUpdate = (email_marketing_id: number) => {
        history(`/testimonial/update/${email_marketing_id}`);
    }

    const handleToggleView = async (email_marketing_id: number) => {
        history(`/testimonial/view/${email_marketing_id}`);
    };

    const handleNavigation = () => {
        history('/testimonial/add');
    };

    const handleToggleStatus = (testimonial_id?: number) => {
        setIndex(testimonial_id || undefined);
        setUpdateOpen(prevState => !prevState);
    };

    const downloadCsv = () => {
        const filteredColumns = columns.filter(col => col.accessor && col.accessor !== 'action' && col.accessor !== 'customer_photo' && col.accessor !== "select");
        const header = filteredColumns.map(col => col.Header);
        const csv = rows
            .map((row: any) =>
                filteredColumns
                    .map(col => {
                        if (col.accessor === 'created_at' || col.accessor === 'updated_at') {
                            return showFormattedDate(row[col.accessor!]);
                        }
                        return row[col.accessor!];
                    })
                    .join(",")
            )
            .join("\n");
        const convertedData: string = `${header.join(",")}\n${csv}`;
        const fileName: string = globalMessages.download_csv.customer_testimonial;
        ExportToCsv(convertedData, fileName)
    };

    const handleSelectedValueChange = (name: string, value: any) => {
        setSelectedValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
        setFilter({ ...filter, customer_name: typeof value === 'object' ? value.label : value });
    };

    const handleSearchChange = (event: any) => {
        setFilter({ ...filter, customer_name: event.target.value });
    };

    const handleChange = (name: string, value: string) => {
        setFilter((prevData) => ({ ...prevData, [name]: value }));
    };
    //remmove html tag from the data
    const decodeHTML = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
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
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        Customer Testimonial
                                        <Grid className='action_wrap d_flex'>
                                            <MDButton className='action-button' variant="contained" onClick={downloadCsv}> {<SystemUpdateAltIcon />}</MDButton>
                                            {testimonial?.create && <MDButton className='action-button' sx={{ marginLeft: '20px' }} variant={'contained'} color={sidenavColor} onClick={handleNavigation} children={<Add />} />}
                                        </Grid>
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={1} pb={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={2}>
                                            <MDInput label="Search Keyword"
                                                placeholder="Keyword"
                                                value={filter.search}
                                                onChange={handleSearchChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
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
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
                                            <MDInput
                                                label="To"
                                                type="date"

                                                value={filter.to_date}
                                                className={filter.to_date ? "has-value" : ""}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    handleChange(
                                                        "to_date",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <SelectComponent
                                                placeholder="Select"
                                                options={customername.map(
                                                    (
                                                        method: any
                                                    ) => ({
                                                        value: method.label,
                                                        label: method.label,
                                                    })

                                                )}
                                                handleChange={(e) => handleSelectedValueChange("customer_name", e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </MDBox>
                                <MDBox pt={1} className='table_custom'>
                                    <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                                </MDBox>
                                {
                                    testimonial?.delete &&
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "20px",
                                            marginRight: "40px",
                                        }}
                                    >
                                        <MDButton onClick={handleDelete} color="error">
                                            Delete
                                        </MDButton>
                                    </div>
                                }
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
            {/* handle select multiple id for delete */}
            <Confirm
                message="Do you want to delete the Testimonial?"
                method={service.Methods.DELETE}
                url={service.API_URL.testimonial.delete}
                visible={deleteMultipleOpen}
                closeModal={handleDelete}
                id={selectedIds}
            />
            <Confirm message='are you sure, you want to delete testimonial?' method={service.Methods.DELETE} url={service.API_URL.testimonial.delete} visible={deleteOpen} closeModal={handleToggleDelete} id={[index]} />
            <Confirm message='are you sure, you want to update testimonial?' method={service.Methods.GET} url={service.API_URL.testimonial.updateStatus} visible={updateOpen} closeModal={handleToggleStatus} id={index} />
        </>
    )
}

export default ListTestimonial;

