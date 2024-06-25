import React, { useState, useEffect } from 'react';
import { Grid, Card, Box } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import Footer from 'examples/Footer';
import { Add } from '@mui/icons-material';
import { useMaterialUIController } from 'context';
import { service } from 'utils/Service/service';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';
// import Select from 'common/Select';
import Select from 'components/MDSelect';
import { Editor } from "@tinymce/tinymce-react";
import CommonModal from 'common/modal/Modal';
import MDInput from 'components/MDInput';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { showFormattedDate } from 'utils/common';
import ExportToCsv from 'utils/ExportToCsv';
import Link from '@mui/material/Link';

interface CustomWorkQuote {
  cwq_id: number;
  cwq_quote: string;
  cwq_quote_request_time: number;
  cwq_reminder_count: number;
  cwq_attachment: string;
  cwq_created_at: string;
  createdByName: string;
  assignToName: string;
  delayHours: number | null;
}

const ViewCustomQoute = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState<any>({});
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const [notification, setNotification] = useState<CustomWorkQuote[]>([]);
  const [rows, setRowData] = useState<CustomWorkQuote[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [qouteReply, setQouteReply] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectNotification, setSelectedNotification] = useState<CustomWorkQuote | null>(null);
  const [reply, setReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleNotificationReply = async (id: any) => {
    console.log("text:", reply);
    console.log("notification_id:", id);
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.POST,
        apiUrl: service.API_URL.customWorkQoute.reply,
        body: {
          custom_work_quote_id: id,
          message: reply
        }
      });
      setNotificationOpen(false); // Close the modal after reply
    } catch (error) {
      console.error('Error replying to notification:', error);
    }
  };

  useEffect(() => {
    fetchDropDown();
    fetchData();
    // setValue('description','Description')
  }, [searchQuery]);

  const fetchDropDown = async () => {
    try {
      const response: any = await service.makeAPICall({
        methodName: service.Methods.GET,
        apiUrl: service.API_URL.masterSelect.get,
      });
      console.log("response:", response.data.data.qoute_reply);
      setQouteReply(() => {
        return (
          response.data.data.qoute_reply?.map((item: any) => (
            { value: item.id, label: item.label }
          ))
        )
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (name: string, value: string) => {
    setSearchQuery(value);
  };

  const fetchData = async () => {
    try {
      const qurryData = { assign_to: searchQuery.length > 2 ? searchQuery : "" }
      const response = await service.makeAPICall({
        methodName: service.Methods.GET,
        apiUrl: service.API_URL.customWorkQoute.view,
        query: qurryData
      });
      console.log("str of response :  ", response?.data.data);
      setRowData(response?.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSelectChange = async (selectedOption: any, id: number | undefined) => {
    if (id === undefined) {
      // Handle the case when id is undefined
      console.error('ID is undefined');
      return;
    }

    console.log("selectedOption:", parseInt(selectedOption.target.value));
    const selectedNotification = rows.find(item => item?.cwq_id === id);
    setSelect((prev: any) => ({ ...prev, [id]: selectedOption.target.value }))
    setSelectedNotification(selectedNotification || null);
    console.log("Selected Notification:", selectedNotification);
    try {
      const response: any = await service.makeAPICall({
        methodName: service.Methods.PUT,
        apiUrl: service.API_URL.customWorkQoute.update,
        body: {
          id: selectedNotification?.cwq_id,
          quote_request_time: parseInt(selectedOption.target.value)
        }
      });
      console.log("response:", response.data.data.qoute_reply);
      setQouteReply(response.data.data.qoute_reply);
    } catch (error) {
      console.log(error);
    }
  };


  const calculateDelay = (created_at: string) => {
    const createdDate = new Date(created_at);
    const currentTime = new Date();
    const delayMilliseconds = Math.max(0, currentTime.getTime() - createdDate.getTime());
    const delayDays = Math.floor(delayMilliseconds / (24 * 60 * 60 * 1000));
    const remainingHours = Math.floor((delayMilliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${delayDays} days ${remainingHours} hours`;
  };

  const incrementRemainder = async (id: number) => {
    console.log("id : ", id);
    try {
      const response = await service.makeAPICall({
        methodName: service.Methods.PUT,
        apiUrl: service.API_URL.customWorkQoute.incrementRemainder,
        body: { id: id }
      });
      console.log("response : ", response?.data.data);
    } catch (error) {
      console.log("error : ", error);
    }
  }

  const columns = [
    { Header: 'ID', accessor: 'cwq_id' },
    {
      Header: 'Assign Date',
      Cell: ({ row }: any) => (
        <div>
          <div>{showFormattedDate(row.original.cwq_created_at)}</div>
        </div>
      ),
    },

    { Header: 'Assign By', accessor: 'createdByName' },
    { Header: 'Assign Name', accessor: 'assignToName' },
    {
      Header: 'Task',
      Cell: ({ row }: any) => (
        <Grid item xs={12}>
          <Link
            color="primary"
            underline="always"
            onClick={() => handleReply(row.original.cwq_id)}
            style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
          >
            View Detail And Reply
          </Link>
        </Grid>
      )
    },
    { Header: 'Status', accessor: 'replyMsg' },
    {
      Header: 'Quote Reply',
      accessor: 'cwq_quote_request_time',
      width: '300px',
      Cell: ({ row }: any) => {
        // Access the ID of the row directly from row.original
        const rowId = row.original.cwq_id;

        // Determine if the dropdown should be enabled or disabled    
        return (
          <Grid item xs={12}>
            <Select
              placeholder='select'
              options={qouteReply}
              value={select[rowId]}
              handleChange={(selectedOption: any) => handleSelectChange(selectedOption, rowId)}
            />
          </Grid>
        );
      }
    },
    {
      Header: 'Reminder',
      Cell: ({ row }: any) => (
        <Grid item xs={12}>
          <Link
            onClick={() => incrementRemainder(row.original.cwq_id)}
            style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Send Reminder
          </Link>
        </Grid>
      )
    },
    {
      Header: 'Delay',
      Cell: ({ row }: { row: any }) => (
        calculateDelay(row.original.cwq_created_at)
      )
    }
  ];

  const handleChange = (content: string) => {
    const sanitizedContent = content.replace(/<[^>]*>?/gm, '');
    setEditorContent(sanitizedContent);
  };

  const handleReply = async (id: number) => {
    setNotificationOpen(true);
    const response = await service.makeAPICall({
      methodName: service.Methods.GET,
      apiUrl: service.API_URL.customWorkQoute.replyMessage,
      params: id
    });
    console.log(response?.data);
    setReply(response?.data);
    const selectedNotification = rows.find(item => item?.cwq_id === id);
    setSelectedNotification(selectedNotification || null);
  };
  const downloadCsv = () => {
    const filteredColumns = columns.filter(
      (col) => col.accessor && col.accessor !== "action"
    );
    const header = filteredColumns.map((col) => col.Header);
    const csv = rows
      .map((row: any) =>
        filteredColumns
          .map((col) => {
            if (col.accessor === "registered_date") {
              return showFormattedDate(row[col.accessor!]);
            }
            return row[col.accessor!];
          })
          .join(",")
      )
      .join("\n");
    const convertedData: string = `${header.join(",")}\n${csv}`;
    const fileName: string = "customWorkQuote.csv";
    ExportToCsv(convertedData, fileName);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className='module_wrap'>
              <MDBox mx={1} mt={-6} py={2} px={4} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                <MDTypography display="flex" alignItems="center" justifyContent="space-between" variant="h6" color="white">
                  My Task
                  <Grid className='action_wrap d_flex'>
                    <MDButton className='action-button' color={'white'} onClick={downloadCsv} children={<SystemUpdateAltIcon />} />
                    <MDButton className='action-button' variant={'contained'} color={sidenavColor} onClick={() => navigate('/my-task/add')} children={<Add />} />
                  </Grid>
                </MDTypography>
              </MDBox>
              <MDBox pt={2} pb={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card style={{ padding: "20px" }}>
                      <MDTypography
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        variant="h6"
                        color="white"
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <MDInput
                              label="Search"
                              placeholder="Keyword"
                              value={searchQuery}
                              onChange={(e: { target: { value: string } }) => handleSearchChange("assign_to", e.target.value)}
                            />
                          </Grid>
                        </Grid>

                      </MDTypography>
                    </Card>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={2} pb={3} className='table_custom'>
                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={false} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {notificationOpen && (
        <CommonModal
          id={selectNotification?.cwq_id}
          message={
            <div>
              {selectNotification?.cwq_quote}
              <Editor
                value={reply}
                apiKey="i8xz2joijgn1npvpe46dgiten04jx850hb7dpmvuwj6fhilk"
                onEditorChange={(newValue, editor) => {
                  setReply(editor.getContent({ format: 'text' }))
                }}
              />
            </div>
          }
          visible={notificationOpen}
          closeModal={handleToggleNotification}
          onSubmit={() => handleNotificationReply(selectNotification?.cwq_id)}
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default ViewCustomQoute;
