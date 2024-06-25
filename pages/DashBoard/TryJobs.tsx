import { Grid } from "@mui/material"
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"


interface FormProps {
    data: any;
}


const TryJobs: React.FC<FormProps> = ({ data }) => {

    const dataKey = ["try_jobs_requested", "dcline", "posted", "preferences_requested", "preferences_received", "acceptwed", "allocated", "on_hold", "awaiting_input", "under_production", "delivered", "pending_decision", "rejected", "converted_to_order",]

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    const keyForLine = ['dcline','preferences_received','delivered']

    return (
        <>

            <MDBox pt={4} pb={3}>
                <Grid container spacing={2}>
                    {dataKey.map((key) => {
                        return (
                            <>
                                <Grid item xs={5} md={3} lg={1.3}>
                                    <MDBox mb={3} ml={3} height={'100px'} width='80px' justifyContent="center" alignItems="center" textAlign="center">
                                        <MDTypography my={1} variant="h5" color="black" >
                                            {data[key] || 0}
                                        </MDTypography>
                                        <MDTypography component='hr' style={{ borderLeft: `1px solid black` }} />
                                        <MDTypography my={1} variant="h5" color="black" >
                                            {modifyKey(key)}
                                        </MDTypography>
                                    </MDBox>
                                </Grid>
                                {
                                    keyForLine.includes(key)  ? 
                                    <p style={{ height:'120px',marginLeft:"25px",marginTop:"10px",borderWidth: "2px", borderStyle: "dashed" }}></p>
                                    : <></>
                                }
                            </>
                        )
                    })}

                </Grid>
            </MDBox>
        </>
    )
}

export default TryJobs