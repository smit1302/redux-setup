import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { Link } from "react-router-dom";


interface PageConstructionProps {
    url?: string;
}
const PageConstruction: React.FC<PageConstructionProps> = ({ url }) => {
    return (<>
        <DashboardLayout>
            <DashboardNavbar />
            < h1 > Page under construction</h1 >
            {
                url ?
                    <MDBox>
                        <p>However you may like to visit this page <Link to={url}> click here </Link> </p>
                    </MDBox > :
                    <MDBox>
                        <p>Sorry, this page is under construction.</p>
                    </MDBox>
            }
        </DashboardLayout>
    </>)
}

export default PageConstruction;