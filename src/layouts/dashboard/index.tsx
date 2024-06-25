import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { Editor } from "@tinymce/tinymce-react";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
import { service } from "utils/Service/service";
import Confirm from "../../common/ConfirmModal";
import CommonModal from "common/modal/Modal";

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

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [editorContent, setEditorContent] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(true);
  const [userDataResponse, setUserDataResponse] = useState<Notification[]>([]);
  const [userId,setUserId] = useState()
  const [organizationId,setOrganizationId] = useState()

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

      console.log("response : " , response?.data)

      const updatedNotifications = userDataResponse.filter(notification => notification.id !== notificationId);
      setUserDataResponse(updatedNotifications);
    } catch (error) {
      console.error('Error replying to notification:', error);
    }
  };

  useEffect(()=>{
    console.log("organization , user : ", organizationId,userId)
  },[organizationId,userId])

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

  const handleChange = (content: string) => {
    const sanitizedContent = content.replace(/<[^>]*>?/gm, '');
    setEditorContent(sanitizedContent);
};

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
                          onEditorChange={(content, editor) => handleChange(content)}
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
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
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
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
