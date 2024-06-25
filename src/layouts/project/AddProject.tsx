import React, {useState } from 'react';

import {Grid } from "@mui/material";
import { Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
// import Select from 'common/Select';
import Select from 'components/MDSelect';
import MDInput from 'components/MDInput';
import Switch from "@mui/material/Switch";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AddProject: React.FC = () => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

    };
    const [workPackages, setWorkPackages] = useState([{ id: 1, subFields: [{ id: Date.now() }] }]);
    const handleAddField = () => {

        setWorkPackages((prevWorkPackages) => [
            ...prevWorkPackages,
            { id: Date.now(), subFields: [{ id: Date.now() }] },
        ]);
    };
    const handleAddsubField = (workPackageId: number) => {
        setWorkPackages((prevWorkPackages) =>
            prevWorkPackages.map((wp) =>
                wp.id === workPackageId ? { ...wp, subFields: [...wp.subFields, { id: Date.now() }] } : wp
            )
        );
    };
    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <MDBox ml={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={8} md={3} lg={4}>
                                <MDBox mb={3} ml={3} >
                                    <MDInput type="text" label="Project Template" fullWidth />
                                </MDBox>
                            </Grid>
                            <Grid item xs={8} md={3} lg={4}>
                                <MDBox mb={3} ml={3} >
                                    <Select
                                        placeholder="Select"
                                        options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]}
                                        handleChange={(e) => handleChange(e)}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={8} md={3} lg={4}>
                                <MDBox mb={3} ml={3} >
                                    <Switch />Is Active?
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox>
                        {workPackages.map((workPackage) => (
                            <MDBox mb={5} >
                                <Card key={workPackage.id}  >
                                    <Grid container spacing={3} mt={3} ml={3} mb={3}>
                                        <Grid item xs={8} md={3} lg={3}>
                                            <MDInput type="text" label="Work Package Title" fullWidth />
                                        </Grid>
                                        <Grid item xs={8} md={3} lg={3}>
                                            <MDInput type="text" label="WP Estimate Time" fullWidth />
                                        </Grid>
                                        <Grid item xs={8} md={3} lg={3}>
                                            <MDButton onClick={() => handleAddsubField(workPackage.id)} variant="contained" color="black">
                                                <AddCircleIcon />
                                            </MDButton>
                                        </Grid>
                                    </Grid>

                                    {workPackage.subFields.map((subField) => (
                                        <Grid container spacing={3} key={subField.id} ml={3}>
                                            <Grid item xs={8} md={6} lg={5}>
                                                <MDBox mb={3}>
                                                    <MDInput type="text" label="Select Task" fullWidth />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={8} md={6} lg={5}>
                                                <MDBox mb={3}>
                                                    <MDInput type="text" label="Time Estimate" fullWidth />
                                                </MDBox>
                                            </Grid>
                                        </Grid>

                                    ))}
                                </Card>
                            </MDBox>
                        ))}
                    </MDBox>
                    <MDBox ml={3} mt={2} display="flex"
                        justifyContent="space-between"
                        alignItems="center" >
                        <MDButton onClick={handleAddField} variant="contained" color="info" >
                            Add Work Package
                        </MDButton>
                        <MDButton variant="contained" color="dark" >
                            Copy Work Package
                        </MDButton>
                    </MDBox>


                </MDBox >
                <Footer />
            </DashboardLayout >



        </>
    )
}

export default AddProject;
