import { Tab, Tabs } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { SetStateAction, useEffect, useState } from "react";
import ProjectTemplateList from "../ProjectTemplate/ProjectTemplateList";
import WorkTypeList from "pages/WorkType/WorkTypeList";
import { useSelector } from "react-redux";


const ProjectTemplateTab: React.FC = () => {

    const [value, setValue] = useState(0);
    const reduxValue = useSelector((state: any) => state?.commonData.commonData);
    const tabItem = ['Project Templates', 'Work Type'];

    useEffect(() => {
        if (reduxValue?.project_template_tab_value !== undefined) {
            setValue(reduxValue.project_template_tab_value);
        }
    }, [reduxValue]);

    const handleChange = (event: any, newValue: SetStateAction<number>) => {
        setValue(newValue);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div>
                <MDBox pt={2} pb={1}>
                    <MDBox sx={{ width: '100%' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            {tabItem?.map((item) => (
                                <Tab label={item} />
                            ))}
                        </Tabs>
                    </MDBox>
                    {value === 0 && (
                        <MDBox>
                            <ProjectTemplateList />
                        </MDBox>
                    )}
                    {value === 1 && (
                        <MDBox>
                            <WorkTypeList />
                        </MDBox>
                    )}

                </MDBox>
            </div>
        </DashboardLayout>
    );
}

export default ProjectTemplateTab;