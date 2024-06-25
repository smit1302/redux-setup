import { SetStateAction, useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Tab, Tabs } from '@mui/material';
import ViewOrder from './ViewOrder';
import ViewTryJobs from './ViewTryJobs';
import MDBox from 'components/MDBox';
import ViewMessage from './ViewMessage';
import ViewOrderPayment from './ViewOrderPayment';
import ViewStatus from './StatusReport';
import ViewCustomerProfile from './ViewCustomerProfile';
import ViewOrderDashboard from './ViewOrderDashboard';
import { useSelector } from "react-redux";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from "react-redux";

function ViewOrderTabs() {
    const dispatchData = useDispatch();
    const reduxValue = useSelector((state: any) => state?.commonData.commonData);
    const [value, setValue] = useState(reduxValue.value ? reduxValue.value : 0);
    const permission = useSelector((state: any) => state.commonData.commonData.userData?.permissions);
    console.log('permission', permission)

    const handleChange = (event: any, newValue: SetStateAction<number>) => {
        console.log('evemt', event.target.value);
        setValue(newValue);
        dispatchData(addData({ key: "value", data: undefined }));
    };

    useEffect(() => {
        if (reduxValue?.value !== undefined) {
            setValue(reduxValue.value);
        }
    }, [reduxValue]);

    const renderTab = (label: string, component: React.ReactNode) => {
        return (
            <Tab label={label} />
        );
    };

    const tabs = [
        { label: "Dashboard", component: <ViewOrderDashboard /> },
        { label: "My Orders", component: <ViewOrder method={''} /> },
        { label: "Try Jobs", component: <ViewTryJobs method={''} /> },
        { label: "Messages", component: <ViewMessage /> },
    ];

    if (permission?.Settings?.["Order Status"]?.view) {
        tabs.push({ label: "Status Report", component: <ViewStatus method={''} /> });
    }

    if (permission?.Customer) {
        tabs.push({ label: "Customer Profile", component: <ViewCustomerProfile /> });
    }

    if (permission?.Orders?.Payment?.view) {
        tabs.splice(3, 0, { label: "Payments", component: <ViewOrderPayment method={''} /> });
    }

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={2} pb={1} className='order_detail_page'>
                    <MDBox sx={{ width: '100%' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='nav_tabs'>
                            {tabs.map((tab, index) => (
                                <Tab key={index} label={tab.label} />
                            ))}
                        </Tabs>
                    </MDBox>
                    {tabs.map((tab, index) => (
                        <MDBox key={index} className={`order_${tab.label.toLowerCase().replace(/\s/g, '_')}`}>
                            {value === index && tab.component}
                        </MDBox>
                    ))}
                </MDBox>
            </DashboardLayout>
        </>
    );
}
export default ViewOrderTabs;
