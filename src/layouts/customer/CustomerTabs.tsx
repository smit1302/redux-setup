import { SetStateAction, useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Tab, Tabs } from '@mui/material';
import CustomerDashboard from './CustomerDashboard';
import ViewCustomer from './ViewCustomer';
import Customer from './Index';
import ViewOpportunity from './ViewOpportunity';
import ViewCustomerCart from './ViewCustomerCart';
import ViewCustomerOrder from './ViewCustomerOrder';
import ViewCustomerPayment from './ViewCustomerPayment';
import ViewFreejobs from './ViewFreejobs';
import MDBox from 'components/MDBox';
import ViewMessage from 'pages/Orders/ViewMessage';
import { useSelector } from "react-redux";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from "react-redux";
import ViewCustomerMessage from './ViewCustomerMessage';


function ViewCustomerTabs() {

    const dispatchData = useDispatch();
    const reduxValue = useSelector((state: any) => state?.commonData.commonData);
    const [value, setValue] = useState(reduxValue.value ? reduxValue.value : 1);
    const permission = useSelector((state: any) => state.commonData.commonData.userData?.permissions);
    const tabs = [
        { label: "Dashboard", component: <CustomerDashboard /> },
        { label: "List", component: <ViewCustomer method={''} /> },
        { label: "Profile", component: <Customer /> },
        { label: "Messages", component: <ViewCustomerMessage /> },
    ];

    const handleChange = (event: any, newValue: SetStateAction<number>) => {
        setValue(newValue);
        dispatchData(addData({ key: "value", data: undefined }));
    };

    if (permission?.Customer?.["Opportunity"]?.view) {
        tabs.push({ label: "Opportunity", component: <ViewOpportunity /> })
    }

    if (permission?.Customer?.["Cart"]?.view) {
        tabs.push({ label: "Cart", component: <ViewCustomerCart /> });
    }

    if (permission?.Orders?.["My Order"]?.view) {
        tabs.push({ label: "Free Jobs", component: <ViewFreejobs /> });
        tabs.push({ label: "Orders", component: <ViewCustomerOrder /> });
    }

    if (permission?.Orders?.Payment?.view) {
        tabs.push({ label: "Payment", component: <ViewCustomerPayment /> });
    }
    useEffect(() => {
        if (reduxValue?.value !== undefined) {
            setValue(reduxValue.value);
        }
    }, [reduxValue]);

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <div>
                    <MDBox pt={2} pb={1} className='customer_mycust_page'>
                        <MDBox sx={{ width: '100%' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='nav_tabs'>
                                {tabs.map((tab, index) => (
                                    <Tab key={index} label={tab.label} />
                                ))}
                            </Tabs>
                        </MDBox>
                        {tabs.map((tab, index) => (
                            <MDBox key={index} className={`customer_${tab.label.toLowerCase().replace(/\s/g, '_')}`}>
                                {value === index && tab.component}
                            </MDBox>
                        ))}
                    </MDBox>
                </div>
            </DashboardLayout>
        </>
    );
}

export default ViewCustomerTabs;
