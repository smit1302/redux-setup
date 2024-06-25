import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { service } from "utils/Service/service";
import { Grid } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import { useForm } from "react-hook-form";
import ErrorShow from "common/ErrorShow";
import { requiredMessage, integerNumber, showFormattedDate } from "utils/common";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import SelectComponent from "components/MDSelect";
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from "react-redux";

interface OrderAllocationFormProps {
    method: string;
}

interface OrderAllocationData {
    order_id: number;
    created_at: Date;
    record_type: string;
    order_product: string;
    order_current_status: string;
    website_url: string;
    platform_id: number;
    allocation_date: Date;
    delivery_date: Date;
    vendor_delivery_date: Date;
    allocation_purpose: string;
    priority: string;
    vendor_id: number;
    pm_id: number;
    bde_id: number;
    designer_id: number;
    supervisor_id: number;
    project_start_date: Date;
    project_end_date: Date;
    estimated_time: number;
    spent_time: number;
    created_by: number;
    updated_by: number;
    purpose: string;
    special_note: string;
}

const OrderAllocation: React.FC<OrderAllocationFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const dispatchData = useDispatch();
    const orderProductId = useSelector((state: any) => state?.commonData.commonData);
    const { sidenavColor } = controller;
    const { register, handleSubmit, getValues, formState: { errors }, setValue, trigger, watch } = useForm<OrderAllocationData>();
    const history = useNavigate();
    const { id } = useParams();
    const [platform, setPlatform] = useState<any[]>([]);
    const [pm, setPm] = useState<any[]>([]);
    const [bde, setBde] = useState<any[]>([]);
    const [ss, setSs] = useState<any[]>([]);
    const [vendor, setVendor] = useState<any[]>([]);
    const [designer, setDesigner] = useState<any[]>([]);
    const [priority, setPriority] = useState<any[]>([]);
    const [allocation_purpose, setAllocation_purpose] = useState<any[]>([]);

    const fetchSelectData = async () => {
        try {
            const platform = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.platform.list,
            });
            setPlatform(platform?.data?.data);
            const userRole: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.people.list,
            });
            const userRoleWise = userRole.data.data;
            const pm = filterUserDataByRole(userRoleWise, 'pm');
            const bde = filterUserDataByRole(userRoleWise, 'bde');
            const ss = filterUserDataByRole(userRoleWise, 'sales_manager');
            const vendor = filterUserDataByRole(userRoleWise, 'vendor');
            const designer = filterUserDataByRole(userRoleWise, 'designer');
            setPm(pm);
            setBde(bde);
            setSs(ss);
            setVendor(vendor);
            setDesigner(designer);


            const orderMaster: any = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.master,
            });
            const masterData = orderMaster.data.data;
            const priority = filterMasterDataByType(masterData, 'priority');
            const allocation_purpose = filterMasterDataByType(masterData, 'allocation_purpose');
            setPriority(priority);
            setAllocation_purpose(allocation_purpose);

        } catch (error) {
            console.log(error);
        }
    };

    const filterMasterDataByType = (masterData: any[], type: string) => {
        return masterData.filter((item: any) => item.type === type)?.map((typeItem: any) => ({
            value: typeItem.id,
            label: typeItem.name,
        }));
    };

    const filterUserDataByRole = (userData: any[], roleName: string) => {
        return userData.filter((user: any) => user.role_name === roleName).map((user: any) => ({
            value: user.user_id,
            label: user.name,
        }));
    };

    const fetchOrderData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.editorderallocation,
                params: orderProductId.order_id,
            });
            const orderallocation: OrderAllocationData = response?.data?.data[0];
            console.log("orderallocation", orderallocation)
            if (orderallocation) {
                Object.entries(orderallocation).forEach(([key, value]) => {
                    setValue(key as keyof OrderAllocationData, value);

                });
                trigger('platform_id')
                trigger('pm_id')
                trigger('bde_id')
                trigger('designer_id')
                trigger('supervisor_id')
                trigger('priority')
                trigger('allocation_purpose')
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.order.allocate_order,
                params: id,
            });
            // set default values of react hook form
            const orderAllocationData: OrderAllocationData = response?.data.data;
            // Set form values using setValue
            Object.entries(orderAllocationData).forEach(([key, value]) => {
                setValue(key as keyof OrderAllocationData, value);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            fetchSelectData();
        },);
    }, []);
    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleNavigation = () => {
        dispatchData(addData({ key: "value", data: 1 }));
        history(-1);
    };

    const onSubmit = async (orderAllocationData: OrderAllocationData) => {
        try {
            console.log("DATA", orderAllocationData)
            await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.allocate_order,
                body: orderAllocationData,
            });
            history(-1);
        } catch (error) {
            console.log(error);
        }
    };

    const ChangeValue = (event: any, type: keyof OrderAllocationData) => {
        const selectedValue = event.target.value;
        setValue(type, selectedValue);
        trigger(type); // Manually trigger validation for the changed field
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Card className='module_wrap'>
                        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" className='module_head'>
                            <MDTypography variant="h6" color="white">
                                Order Allocation
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={8} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        Order ID:
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        Record Type
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Order Current Status
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Website Platform
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Allocation Date
                                    </MDBox>
                                    <MDBox mb={7} ml={3} >
                                        Vendor delivery Date
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Allocation Purpose:
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Supervisor
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        PM
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Name of Executer
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Project Start Date
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Estimate Hours
                                    </MDBox>
                                </Grid>

                                <Grid item xs={2} md={3} lg={3}>
                                    <MDBox mb={3} ml={3} >
                                        {getValues("order_id") ? getValues("order_id") : "-"}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        {getValues("record_type") ? getValues("record_type") : "-"}
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        {getValues("order_current_status") ? getValues("order_current_status") : "-"}
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent
                                            value={getValues('platform_id') ? String(getValues('platform_id')) : null}
                                            {...register("platform_id")}
                                            placeholder='Order Platform'
                                            options={platform.map((platformType: any) => ({
                                                value: platformType.platform_master_id,
                                                label: platformType.name,
                                            }))}
                                            handleChange={(event: any) => ChangeValue(event, "platform_id")}
                                        />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            type="date"
                                            label="Allocation Date"
                                            className={watch('allocation_date') ? "has-value" : ""}
                                            InputLabelProps={getValues('allocation_date') && { shrink: true }}
                                            {...register("allocation_date")}
                                            fullWidth
                                        />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            type="date"
                                            label="Vendor Delivery Date"
                                            className={watch('vendor_delivery_date') ? "has-value" : ""}
                                            InputLabelProps={getValues('vendor_delivery_date') && { shrink: true }}
                                            value={getValues('vendor_delivery_date') ? String(getValues('vendor_delivery_date')) : null}
                                            {...register("vendor_delivery_date")}
                                            fullWidth
                                        />
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        <SelectComponent
                                            value={getValues('allocation_purpose') ? String(getValues('allocation_purpose')) : null}
                                            {...register("allocation_purpose")}
                                            placeholder='Allocation Purpose '
                                            options={allocation_purpose}
                                            handleChange={(event: any) => ChangeValue(event, "allocation_purpose")}
                                        />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select Supervisor" options={ss}
                                            value={getValues('supervisor_id') ? String(getValues('supervisor_id')) : null}
                                            handleChange={(value: any) => ChangeValue(value, "supervisor_id")} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select PM" options={pm}
                                            value={getValues('pm_id') ? String(getValues('pm_id')) : null}
                                            // value={getValues('pm_id')}
                                            handleChange={(event: any) => ChangeValue(event, "pm_id")} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select Designer" options={designer}
                                            value={getValues('designer_id') ? String(getValues('designer_id')) : null}
                                            handleChange={(event: any) => ChangeValue(event, "designer_id")} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            type="date"
                                            label="Project Start Date"
                                            className={watch('project_start_date') ? "has-value" : ""}
                                            InputLabelProps={getValues('project_start_date') && { shrink: true }}
                                            {...register("project_start_date")}
                                            fullWidth
                                        />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            label="Total Estimate Hour"
                                            type="text"
                                            InputLabelProps={getValues('estimated_time') && { shrink: true }}
                                            {...register("estimated_time")}
                                            fullWidth

                                        />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={2} md={3} lg={3} >
                                    <MDBox mb={3} ml={3} >
                                        Order Date
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        Order Product
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Website Url
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        -
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Delivery Date
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        -
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Priority
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Vendor
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        BDE
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        Special Note
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Project End Date
                                    </MDBox>
                                    <MDBox mb={6} ml={3} >
                                        Actual Spent Hours
                                    </MDBox>
                                </Grid>
                                <Grid item xs={2} md={3} lg={3} >
                                    <MDBox mb={3} ml={3} >
                                        {showFormattedDate(getValues("created_at")) ? showFormattedDate(getValues("created_at")) : "-"}
                                    </MDBox>
                                    <MDBox mb={3} ml={3} >
                                        {getValues("order_product") ? getValues("order_product") : "-"}
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >

                                        {getValues("website_url") ? getValues("website_url") : "-"}
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        -
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>

                                        <MDInput
                                            type="date"
                                            label="Delivery Date"
                                            className={watch('delivery_date') ? "has-value" : ""}
                                            {...register("delivery_date")}
                                            fullWidth
                                            InputLabelProps={getValues('delivery_date') && { shrink: true }}
                                        />
                                    </MDBox>
                                    <MDBox mb={5} ml={3} >
                                        -
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select Priority" options={priority}
                                            value={getValues('priority') ? String(getValues('priority')) : null}
                                            handleChange={(event: any) => ChangeValue(event, "priority")} />

                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select Vendor" options={vendor}
                                            value={getValues('vendor_id')}
                                            handleChange={(event: any) => ChangeValue(event, "vendor_id")} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} >
                                        <SelectComponent placeholder="Select BDE" options={bde}
                                            value={getValues('bde_id') ? String(getValues('bde_id')) : null}
                                            handleChange={(event: any) => ChangeValue(event, "bde_id")} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput label="Special Note" type="text"  {...register("special_note")} fullWidth
                                            InputLabelProps={getValues('special_note') && { shrink: true }} />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            type="date"
                                            label="Project End Date"
                                            value={getValues('project_end_date') ? String(getValues('project_end_date')) : null}
                                            className={watch('project_end_date') ? "has-value" : ""}
                                            {...register("project_end_date")}
                                            fullWidth
                                            InputLabelProps={getValues('project_end_date') && { shrink: true }}
                                        />
                                    </MDBox>
                                    <MDBox mb={4} ml={3} mr={9}>
                                        <MDInput
                                            type="text"
                                            label="Actual Spent Time"
                                            InputLabelProps={getValues('spent_time') && { shrink: true }}
                                            {...register("spent_time")}
                                            fullWidth
                                        />
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                        <MDBox pt={3} ml={3} pb={2}>
                            <MDButton variant="gradient" color="info" onClick={handleSubmit(onSubmit)}>Submit</MDButton>
                            <MDButton style={{ marginLeft: '10px' }} onClick={handleNavigation} variant="gradient" color="error" >
                                Cancel
                            </MDButton>
                        </MDBox>
                    </Card>
                </MDBox>
                <Footer />
            </DashboardLayout>
        </>
    );
};

export default OrderAllocation;
