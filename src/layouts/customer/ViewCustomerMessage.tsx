import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";
import Select from "components/MDSelect";
import globalMessages from "utils/global";
import { useEffect, useState } from "react";
import { service } from "utils/Service/service";
import React from "react";
import { useSelector } from "react-redux";

const ViewCustomerMessage = () => {
    const history = useNavigate();
    const handleNavigation = (route: any) => {
        history(route);
    };
    const customerId = useSelector((state: any) => state?.commonData.commonData);
    const global_arcticgrey = globalMessages.arcticgrey
    const global_source = globalMessages.source

    const handleChange = (event: any) => {
        const { name, value } = event.target;

    };
    const [note, setNote] = useState<any[]>([]);
    const fetchMessageThread = async () => {
        try {
            const query = {
                customer_id: customerId.customer_id,
            };
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.message_thread.list,
                query: query,
            });
            setNote(response?.data?.data || []);
        } catch (error) {
            console.log(error);
        }
        return null;
    };

    useEffect(() => {
        fetchMessageThread();
    }, []);

    const stripHtmlTags = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const modifyKey = (key: string): string => {
        let words = key
            .split("_")
            .map((word, index) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .filter((word) => word !== "")
            .join(" ");
        return words;
    };
    const removeKey = ['created_by', 'updated_by', 'deleted_at', 'deleted_by', 'activity_log_id'];

    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6} lg={4}>
                        {/* Left side First Card */}
                        <div style={{ marginBottom: '50px' }}>
                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Create
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <MDButton variant="gradient" color="error" onClick={() => handleNavigation("/email-activity")}>
                                            Email
                                        </MDButton>
                                        <MDButton variant="gradient" color="warning" onClick={() => handleNavigation("/task")}>
                                            Task
                                        </MDButton>
                                        <MDButton variant="gradient" color="dark" onClick={() => handleNavigation("/note")}>
                                            Note
                                        </MDButton>
                                    </MDBox>
                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">

                                        <MDButton variant="gradient" color="success" onClick={() => handleNavigation("/log-activity")}>
                                            Log Activity
                                        </MDButton>
                                        <MDButton variant="gradient" color="info" onClick={() => handleNavigation("/scope-of-work")}>
                                            Scope of Work
                                        </MDButton>
                                    </MDBox>
                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <MDButton variant="gradient" color="error" onClick={() => handleNavigation("/reminder")}>
                                            Reminder
                                        </MDButton>

                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>
                        {/* Left side Second Card */}
                        <div style={{ marginBottom: '50px' }}>
                            {/* Left side of the second card */}
                            <Card className='module_wrap'>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Filter
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        Reset
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>

                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">

                                        <MDTypography variant="h6" >
                                            <MDInput label="Search here" />
                                        </MDTypography>


                                        <MDButton variant="gradient" color="info" >
                                            GO
                                        </MDButton>

                                    </MDBox>

                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <MDTypography variant="h6" >
                                            <MDInput label="From Date" />

                                        </MDTypography>
                                        <MDTypography variant="h6" >
                                            <MDInput label="To Date" />
                                        </MDTypography>
                                    </MDBox>


                                </MDBox>
                            </Card>
                        </div>
                        {/* Left side Third Card */}
                        <div style={{ marginBottom: '50px' }}>
                            {/* Left side of the second card */}
                            <Card>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Related to
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        Select All
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox component="form" role="form">
                                        <MDBox mb={2}>
                                            <Checkbox />Leads
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <Checkbox defaultChecked={true} />Try Jobs
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <Select
                                                placeholder='Select Order'
                                                options={[{ value: '1', label: 'Option 1' }, { value: 'india', label: 'Canada' }]}
                                                handleChange={(e) => handleChange(e)}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <Checkbox />Orders
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <Select
                                                placeholder='Select Order'
                                                options={[{ value: '1', label: 'Option 1' }, { value: 'india', label: 'Canada' }]}
                                                handleChange={(e) => handleChange(e)}
                                            />
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>
                        {/* Left side Fourth Card */}
                        <div style={{ marginBottom: '50px' }}>
                            <Card>
                                <MDBox
                                    className='module_head'
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="success"
                                    mx={2}
                                    mt={-3}
                                    p={3}
                                    mb={1}
                                    textAlign="left"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Action
                                    </MDTypography>
                                    <MDTypography variant="h6" color="white">
                                        Select All
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox mb={2} display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <MDTypography variant="h6" >
                                            <Checkbox />Email
                                        </MDTypography>
                                        <MDTypography variant="h6" >
                                            1
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </div>
                    </Grid>
                    {/* Right side  Card */}

                    <Grid item xs={12} md={6} lg={8}>
                        <Grid container spacing={3}>
                            {note.map((noteItem: any, index: number) => (
                                <Grid item xs={12} key={index}>
                                    <Card style={{ height: '100%', width: '100%' }}>
                                        <MDBox p={2}>
                                            <MDBox
                                                className='module_head'
                                                variant="gradient"
                                                bgColor="info"
                                                borderRadius="lg"
                                                coloredShadow="success"
                                                mx={2}
                                                mt={-3}
                                                p={3}
                                                mb={1}
                                                textAlign="left"
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <MDTypography variant="h6" color="white" >
                                                    {index === 0 && (noteItem.note_activity_id || noteItem.scope_activity_id) ?
                                                        `${modifyKey(Object.keys(noteItem)[0])} ${noteItem[noteItem.note_activity_id ? 'note_activity_id' : 'scope_activity_id']}`
                                                        : ''
                                                    }
                                                </MDTypography>
                                            </MDBox>
                                            {Object.entries(noteItem).filter(([key, _]) => !removeKey.includes(key)).map(([key, value], innerIndex) => (
                                                <MDBox mx={2} mb={2}>
                                                    <React.Fragment key={key}>
                                                        {innerIndex !== 0 && (
                                                            <MDTypography variant="body1">
                                                                {modifyKey(key)}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (typeof value === 'string' ? stripHtmlTags(value) : value)}
                                                            </MDTypography>
                                                        )}
                                                    </React.Fragment>
                                                </MDBox>
                                            ))}
                                        </MDBox>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Grid>
            </MDBox>
            <Footer />
        </>

    );
}

export default ViewCustomerMessage;


