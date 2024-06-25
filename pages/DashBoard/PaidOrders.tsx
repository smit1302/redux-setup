import { Grid } from "@mui/material"
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"


interface FormProps {
    data: any;
}


const PaidOrders: React.FC<FormProps> = ({ data }) => {

    const dataKey = ["order", "order_products", "posted", "decline", "accepted", "allocated", "under_production", "on_hold", "change_request", "awaiting_input", "production_complete", "qc", "products_delivered", "sign_off"]

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    const keyForLine = ['order_products','qc']

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
                                    <p style={{ height:'120px',marginLeft:"20px",marginTop:"10px",borderWidth: "2px", borderStyle: "dashed" }}></p>
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

export default PaidOrders