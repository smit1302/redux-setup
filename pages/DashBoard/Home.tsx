import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { Editor } from "@tinymce/tinymce-react";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import { SetStateAction, useEffect, useState } from "react";
import { service } from "utils/Service/service";
import CommonModal from "common/modal/Modal";
import { Card, Tab, Tabs } from "@mui/material";
import PaidOrders from "./PaidOrders";
import TryJobs from "./TryJobs";
import OrderDelivered from "./OrderDelivered";
import OrderInProgress from "./OrderInProgress";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Notification {
	id: number;
	organization_id: number;
	notification_for: number;
	message: string;
	mandatory_reply: boolean;
	is_active: boolean;
	remind_later: boolean;
	created_by: number;
	created_at: string;
	updated_by: number | null;
	updated_at: string;
	deleted_by: number | null;
	deleted_at: string | null;
}

const Dashboard: React.FC = () => {
	const { sales, tasks } = reportsLineChartData;
	const [editorContent, setEditorContent] = useState('');
	const [notificationOpen, setNotificationOpen] = useState(true);
	const [userDataResponse, setUserDataResponse] = useState<Notification[]>([]);
	const [userId, setUserId] = useState()
	const [organizationId, setOrganizationId] = useState()
	const [data, setData] = useState<any>();
	const [rows, setRows] = useState<any>([]);

	const columns = [
		{ Header: 'BDE', accessor: 'bde' },
		{ Header: 'Open Cart Count', accessor: 'open_cart_count' },
		{ Header: 'Amount', accessor: 'amount' },
	]

	const handleToggleNotification = () => {
		setNotificationOpen(!notificationOpen);
	};

	const handleNotificationReply = async (notificationId?: number, reply?: string) => {
		try {
			const response = await service.makeAPICall({
				methodName: service.Methods.POST,
				apiUrl: service.API_URL.notification.replyNotification,
				body: {
					notification_id: notificationId,
					user_id: userId,
					notification_reply: editorContent,
					created_by: userId
				}
			});

			console.log("response : ", response?.data)

			const updatedNotifications = userDataResponse.filter(notification => notification.id !== notificationId);
			setUserDataResponse(updatedNotifications);
		} catch (error) {
			console.error('Error replying to notification:', error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await service.makeAPICall({
					methodName: service.Methods.GET,
					apiUrl: service.API_URL.dashBoard.list,
				});
				if (response?.data.data) {
					setData(response?.data.data);
					setRows(response?.data.data.bde_wise_open_cart);
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchData()
	}, [setData])

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userDataResponse = await service.makeAPICall({
					methodName: service.Methods.GET,
					apiUrl: service.API_URL.user.get,
				});
				setOrganizationId(userDataResponse?.data?.data?.organization_id)
				setUserId(userDataResponse?.data?.data?.user_id)
				setUserDataResponse(userDataResponse?.data?.data?.notifications || []);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	const handleEditorChange = (content: string) => {
		const sanitizedContent = content.replace(/<[^>]*>?/gm, '');
		setEditorContent(sanitizedContent);
	};

	const [value, setValue] = useState(0);

	const handleChange = (event: any, newValue: SetStateAction<number>) => {
		setValue(newValue);
	};

	const temp = ['Paid Orders', 'Try Jobs', 'Order Delivered', 'Order In Progress'];

	return (
		<DashboardLayout>
			<DashboardNavbar />

			<div>
				{userDataResponse?.map(notification => {
					return (
						<>
							{
								notification?.id ?
									<CommonModal
										id={notification?.id}
										message={
											<div>
												{notification?.message}
												<Editor
													apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"
													onEditorChange={(content, editor) => handleEditorChange(content)}
												/>

											</div>

										}
										visible={notificationOpen}
										closeModal={handleToggleNotification}
										onSubmit={() => handleNotificationReply(notification.id)}
										confirmButtonText="Confirm"
										cancelButtonText="Cancel"
									/> : ""
							}

						</>
					)
				})}
			</div>

			{data ?
				<MDBox py={3}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6} lg={3}>
							<MDBox mb={1.5}>
								<ComplexStatisticsCard
									color="dark"
									icon={<BusinessCenterIcon />}
									title="New Orders"
									count={data.new_orders || 0}
								/>
							</MDBox>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<MDBox mb={1.5}>
								<ComplexStatisticsCard
									icon="leaderboard"
									title="Order Paid"
									count={data.orders_paid || 0}
								/>
							</MDBox>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<MDBox mb={1.5}>
								<ComplexStatisticsCard
									color="success"
									icon={<AssignmentIcon />}
									title="Free Job requested"
									count={data.free_job_requested || 0}
								/>
							</MDBox>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<MDBox mb={1.5}>
								<ComplexStatisticsCard
									color="primary"
									icon={<ShoppingCartIcon />}
									title={`Worth products in ${data.carts || 0} cart`}
									count={`$${data.worth_products || 0}`}
								/>
							</MDBox>
						</Grid>
					</Grid>


					<div>
						<MDBox pt={2} pb={1}>
							<MDBox sx={{ width: '100%' }}>
								<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

									{temp?.map((item) => (
										<Tab label={item} />
									))}
									{/* <Tab label="Dashboard" />
                            <Tab label="List" />
                            <Tab label="Profile" />
                            <Tab label="Messages" />
                            <Tab label="Opportunity" />
                            <Tab label="Cart" />
                            <Tab label="Free Jobs" />
                            <Tab label="Orders" />
                            <Tab label="Payment" /> */}
								</Tabs>
							</MDBox>
							{value === 0 && (
								<MDBox>
									<PaidOrders data={data.paid_orders} />
								</MDBox>
							)}
							{value === 1 && (
								<MDBox>
									<TryJobs data={data.try_jobs} />
								</MDBox>
							)}
							{value === 2 && (
								<MDBox>
									<OrderDelivered data={data.order_delivered} />
								</MDBox>
							)}
							{value === 3 && (
								<MDBox>
									<OrderInProgress data={data.order_in_progress} />
								</MDBox>
							)}

						</MDBox>
					</div>

					<Card>
						<MDBox pt={1} style={{ border: "1px solid black" }} width={"50%"}>
							<MDTypography mx={2} display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="black">
								BDE Wise Open Cart
							</MDTypography>
							<DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
						</MDBox>
					</Card>



					{/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
					{/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}

				</MDBox>
				: (
					<div>Loading...</div>
				)}
			<Footer />
		</DashboardLayout>
	);
}

export default Dashboard;
