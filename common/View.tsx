import React, { useEffect, useState } from 'react';
import { Grid, Switch, Card, IconButton } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from 'context';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from 'utils/Service/service';
import MDButton from 'components/MDButton';
import { decodeHTML, showFormattedDateTime } from 'utils/common';
import globalMessages from 'utils/global';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from "@mui/icons-material/Edit";

// View modal props
interface ViewProps {
    url: string;
    display: string;
    viewType: string[];
    editUrl?: string;
    imageKeys?: string[];
    fileKeys?: string[];
}

const View: React.FC<ViewProps> = ({ viewType, url, display, editUrl, imageKeys, fileKeys }) => {
    const { id, ...rest } = useParams();
    const history = useNavigate();
    const [controller] = useMaterialUIController();
    const [data, setData] = useState<typeof viewType | null>(null);
    const { sidenavColor } = controller;

    // function to fetch the data
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: url,
                params: id,
                query: rest || {}
            });

            if (typeof response?.data?.data === "object") {

                const filteredData = viewType.reduce((obj: any, key) => {
                    if (response?.data?.data.hasOwnProperty(key)) {
                        obj[key] = (key === 'created_at' || key === 'updated_at') ? showFormattedDateTime(response.data.data[key]) : response.data.data[key];
                    }
                    return obj;
                }, {});


                setData(filteredData);
            }
        } catch (error) {
            console.log(error)
        }
    }

    // use effect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [id])

    // function to modify key
    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={2} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Card className='module_wrap'>
                                <MDBox className='module_head' mx={2} mt={-3} py={2.5} px={2} varia nt="gradient" display='flex' justifyContent='space-between' bgColor={sidenavColor} borderRadius="lg" coloredShadow="info">
                                    <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                                        {display}

                                        {
                                            editUrl ?
                                                <>
                                                    <IconButton
                                                        onClick={() =>
                                                            history(editUrl)
                                                        }
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </> :
                                                <MDButton variant="contained" onClick={() => history(-1)}>
                                                    {globalMessages.btn_text.back_button_text}
                                                </MDButton>

                                        }
                                    </MDTypography>
                                </MDBox>
                                <MDBox>
                                    {
                                        data && Object.entries(data).map(([key, value]) => {
                                            return (
                                                <>
                                                    <MDBox key={key} variant='div' display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
                                                        <MDTypography style={{ fontSize: '1.1rem' }} variant="span" flex='2'>{modifyKey(key)} :</MDTypography>
                                                        {
                                                            typeof value === 'boolean' ?
                                                                <MDBox flex='8' textAlign="left"> <Switch checked={value} disabled /> </MDBox>
                                                                :
                                                                (
                                                                    imageKeys?.includes(key) ?
                                                                        (
                                                                            value ?
                                                                                <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>
                                                                                    <img src={value} alt={key} style={{ width: '100px', height: '100px' }} />
                                                                                </MDTypography>
                                                                                :
                                                                                ""
                                                                        )
                                                                        :
                                                                        fileKeys?.includes(key) ?
                                                                            (
                                                                                value ?
                                                                                    <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>
                                                                                        <a href={value} download={true}>Download file</a>
                                                                                    </MDTypography>
                                                                                    :
                                                                                    ""
                                                                            )
                                                                            :
                                                                            <MDTypography flex='8' textAlign="left" variant="span" style={{ fontSize: '1rem' }}>{value != undefined && value != null ? decodeHTML(value) : '-'}</MDTypography>
                                                                )
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

export default View;