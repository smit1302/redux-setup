import React, { useEffect, useState } from 'react';
import { Grid, Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from 'context';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from 'utils/Service/service';
import MDButton from 'components/MDButton';
import { minutesToTime, showFormattedDate } from 'utils/common';
import globalMessages from 'utils/global';
import MDInput from 'components/MDInput';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';

interface Task {
    project_template_task_id: number;
    task_title: string;
    task_time: number;
}

interface WorkPackage {
    project_template_work_package_id: number;
    work_package_title: string;
    work_package_time: number;
    tasks: Task[];
}

interface ProjectTemplateType {
    project_template_id: number;
    template_name: string;
    work_type: number;
    is_active: boolean;
    work_package: WorkPackage[];
}


const ViewProjectTemplate: React.FC = () => {
    const { id } = useParams();
    const history = useNavigate();
    const dispatchData = useDispatch();
    const [controller, dispatch] = useMaterialUIController();
    const [template, setTemplate] = useState<ProjectTemplateType | null>(null);
    const { sidenavColor } = controller;


    const fetchTemplate = async (id: string | undefined) => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.projectTemplate.get,
                params: id
            });
            return response?.data?.data;
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    useEffect(() => {
        fetchTemplate(id).then((data: ProjectTemplateType) => { setTemplate(data) }).catch((error) => { console.log(error) });
    }, [])

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    const removeKey = ['created_by', 'updated_by', 'deleted_at', 'deleted_by', 'work_package', 'work_type', 'organization_id']

    return (
        <>
            <DashboardLayout>
                <MDBox pt={2} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <MDBox mb={3} mx={2} mt={-3} py={2.5} px={2} varia nt="gradient" display='flex' justifyContent='space-between' bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                    {template?.template_name}
                                </MDTypography>
                                <MDButton variant="contained" color={'white'} onClick={() => {
                                    dispatchData(addData({ key: "project_template_tab_value", data: 0 }));
                                    history(-1)
                                }}>
                                    Go back
                                </MDButton>
                            </MDBox>
                            <MDBox>
                                <MDBox mb={3}>
                                    {
                                        template && Object.entries(template).filter(([key, value]) => {
                                            return !removeKey.includes(key);
                                        }).map(([key, value]) => {
                                            return (
                                                <>
                                                    <MDBox key={key} variant='div' display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
                                                        <MDTypography style={{ fontSize: '1.1rem' }} variant="span" flex='2'>{modifyKey(key)} :</MDTypography>
                                                        {
                                                            key === 'created_at' || key === 'updated_at' ?
                                                                <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>{showFormattedDate(value) || 'No value'}</MDTypography>
                                                                :
                                                                typeof value === 'boolean' ?
                                                                    <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>{value === true ? 'Yes' : 'No' || 'No value'}</MDTypography>
                                                                    :
                                                                    <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>{value || 'No value'}</MDTypography>
                                                        }
                                                    </MDBox>
                                                    <MDTypography component='hr' style={{ border: `1px solid #EDEFF0` }} />
                                                </>
                                            )
                                        })
                                    }
                                </MDBox>

                                {
                                    template?.work_package.map((workPackage: WorkPackage) => (
                                        <>
                                            <MDBox mb={5} >
                                                <Card key={workPackage.project_template_work_package_id}  >
                                                    <Grid container spacing={3} mt={0} ml={3} mb={3} >
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDInput
                                                                value={workPackage.project_template_work_package_id}
                                                                type="text"
                                                                InputLabelProps={{ shrink: true }}
                                                                label={globalMessages.project_template.work_package_id}
                                                                fullWidth required />
                                                        </Grid>
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDInput
                                                                value={workPackage.work_package_title}
                                                                type="text"
                                                                InputLabelProps={{ shrink: true }}
                                                                label={globalMessages.project_template.work_package_title}
                                                                fullWidth required />
                                                        </Grid>
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDInput
                                                                value={minutesToTime(workPackage.work_package_time)}
                                                                type="text"
                                                                InputLabelProps={{ shrink: true }}
                                                                label={globalMessages.project_template.work_package_time}
                                                                fullWidth required />
                                                        </Grid>
                                                    </Grid>

                                                    {workPackage.tasks.map((task) => (
                                                        <>
                                                            <MDBox ml={10} >

                                                                <Grid container spacing={3} mt={0} ml={3} mb={3}>
                                                                    <Grid item xs={8} md={3} lg={3}>
                                                                        <MDInput
                                                                            value={task.project_template_task_id}
                                                                            type="text"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            label={globalMessages.project_template.task_id}
                                                                            fullWidth required />
                                                                    </Grid>
                                                                    <Grid item xs={8} md={3} lg={3}>
                                                                        <MDInput
                                                                            value={task.task_title}
                                                                            type="text"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            label={globalMessages.project_template.task_title}
                                                                            fullWidth required />
                                                                    </Grid>
                                                                    <Grid item xs={8} md={3} lg={3}>
                                                                        <MDInput
                                                                            value={minutesToTime(task.task_time)}
                                                                            type="text"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            label={globalMessages.project_template.task_time}
                                                                            fullWidth required />
                                                                    </Grid>
                                                                </Grid>
                                                            </MDBox>

                                                        </>
                                                    ))}
                                                </Card >

                                            </MDBox>
                                        </>
                                    ))}
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
}

export default ViewProjectTemplate;