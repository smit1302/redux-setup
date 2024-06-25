import React, { useEffect, useState } from 'react';
import { Grid, Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from 'context';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from 'utils/Service/service';
import MDButton from 'components/MDButton';
import { showFormattedDate } from 'utils/common';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';

interface WorkTypeInterface {
    work_type_id: number,
    name: string,
    is_active: boolean
}



const fetchWorkType = async (id: string | undefined) => {
    try {
        const response = await service.makeAPICall({
            methodName: service.Methods.GET,
            apiUrl: service.API_URL.workType.get,
            params: id
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error)
    }
    return null;
}


const ViewWorkType: React.FC = () => {
    const { id } = useParams();
    const history = useNavigate();
    const dispatchData = useDispatch();
    const [controller, dispatch] = useMaterialUIController();
    const [workType, setWorkType] = useState<WorkTypeInterface | null>(null);
    const { sidenavColor } = controller;

    useEffect(() => {
        fetchWorkType(id).then((data: WorkTypeInterface) => { setWorkType(data) }).catch((error) => { console.log(error) });
    }, [])

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    const decodeHTML = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const removeKey = ['created_by', 'updated_by', 'deleted_at', 'deleted_by', 'organization_id']


    return (
        <>
            <DashboardLayout>
                <MDBox pt={2} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox mx={2} mt={-3} py={2.5} px={2} varia nt="gradient" display='flex' justifyContent='space-between' bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        {workType?.name}
                                    </MDTypography>
                                    <MDButton variant="contained" color={'white'} onClick={() => {
                                        dispatchData(addData({ key: "project_template_tab_value", data: 1 }));
                                        history(-1)
                                    }}>
                                        Go back
                                    </MDButton>
                                </MDBox>
                                <MDBox>
                                    {
                                        workType && Object.entries(workType).filter(([key, value]) => {
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
                                                                    <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>{decodeHTML(value) || 'No value'}</MDTypography>
                                                        }
                                                    </MDBox>
                                                    <MDTypography component='hr' style={{ border: `1px solid #EDEFF0` }} />
                                                </>
                                            )
                                        })
                                    }
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
        </>
    );
}

export default ViewWorkType;