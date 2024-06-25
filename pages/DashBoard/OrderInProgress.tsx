import { Grid } from "@mui/material"
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"


interface FormProps {
    data: any;
}


const OrderInProgress: React.FC<FormProps> = ({ data }) => {

    const dataKey = ["open_invoices", "total_amount", "net_amount", "member_discount", "promo_discount", "part_payments_received", "outstanding_amount", "already_due", "less_than_30_days", "between_30_to_60_days", "between_60_to_90_days", "greater_than_90_days", "in_future",]

    const modifyKey = (key: string): string => {
        let words = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return words;
    }

    const keyForLine = ['total_amount','promo_discount','outstanding_amount']

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

export default OrderInProgress