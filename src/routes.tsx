import { lazy } from "react";

// @mui icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CategoryOutlined, Settings, ProductionQuantityLimitsRounded, PagesSharp, EmailOutlined, CardMembership, CircleNotifications, Curtains, Newspaper, Feedback, QuestionMark, Campaign, BookSharp, BatteryUnknown, SellOutlined, Code, SupervisedUserCircleOutlined, People, ArrowRightRounded, AccessTimeRounded, DashboardOutlined, Inbox, Report, List, CalendarMonth, Task, Person, Password, WorkOutline, Home, PaymentOutlined, Work, PeopleAlt, OpacityRounded, Shop, TollOutlined, CropOriginalOutlined, IntegrationInstructionsRounded, InboxRounded, GppGoodRounded, Email, House, InboxOutlined, CopyAll, Pages, WebhookSharp, Leaderboard, BusinessCenter, SupportAgent, BuildCircle, AdminPanelSettings, Sell, Groups, Description, QuestionAnswer, RateReview, WebAsset, Assistant, Face, Assessment, SensorOccupied, Psychology, ConnectWithoutContact, ShoppingCart, ChangeCircle, HourglassTop, CreditScore, Autorenew, Extension, AutoFixHigh, Notifications, Reply, Payments, CreditCard, PriceChange, PriceCheck, Schedule, Warehouse, CategoryRounded, Storefront, Recycling, Source, Block, AttachEmail, Summarize, FormatQuote, ChatBubble, CallToAction, HowToReg, AssignmentTurnedIn, AddCard, EnhancedEncryption, MoreHoriz, Telegram, Dashboard, SettingsAccessibilityTwoTone, CalendarMonthSharp, MarkAsUnread, GppGood } from "@mui/icons-material";

const PageConstruction = lazy(() => import("common/PageConstruction"));


const Dashboards = lazy(() => import("pages/DashBoard/Home"));
const ToDo = lazy(() => import("pages/ToDo/ToDo"));
const ViewCustomQuote = lazy(() => import("pages/CusomWorkQuote/ViewCustomWorkQuote"));
const AddCustomWorkQuote = lazy(() => import("pages/CusomWorkQuote/CusomWorkQuote"));
const UserSetting = lazy(() => import("pages/WebsiteConfig/WebsiteConfig"));
const Profile = lazy(() => import('layouts/profile'));
const ChangePassword = lazy(() => import("layouts/authentication/change-password/ChangePassword"));
const EditProfile = lazy(() => import("layouts/profile/EditProfile"))
const ListCustomWork = lazy(() => import("pages/Requirement/ViewCustomWork"));
const ListPlugin = lazy(() => import("pages/Requirement/ViewPlugins"))

const OrderTabs = lazy(() => import("pages/Orders/ViewOrderTab"));
const EmailActivity = lazy(() => import("pages/MessagePopUps/Email"));
const LogActivity = lazy(() => import("pages/MessagePopUps/LogActivity"));
const Note = lazy(() => import("pages/MessagePopUps/Note"));
const TaskActivity = lazy(() => import("pages/MessagePopUps/Task"));
const ScopeOfWork = lazy(() => import("pages/MessagePopUps/ScopeOfWork"));
const OrderAllocation = lazy(() => import("pages/Orders/OrderAllocation"));
const Reminder = lazy(() => import("pages/MessagePopUps/Reminder"));
const AddCustomWork = lazy(() => import("pages/Requirement/CustomWork"));
const AddAppRequirement = lazy(() => import("pages/Requirement/Plugins"));

const CustomerTabs = lazy(() => import("layouts/customer/CustomerTabs"));
const AddCustomer = lazy(() => import("layouts/customer/AddCustomer"));
const ViewOpportunity = lazy(() => import("layouts/customer/ViewOpportunity"));
const AddOpportunity = lazy(() => import("layouts/customer/AddOpportunity"));
const AddMockupRequest = lazy(() => import("layouts/customer/AddMockupRequest"));
const Cart = lazy(() => import("layouts/cart"));
const CartItem = lazy(() => import("layouts/cart/Cartitem"));
const AddService = lazy(() => import("layouts/customer/AddService"));
const AddPreferences = lazy(() => import("layouts/customer/AddPreferences"));
const AddAttachment = lazy(() => import("layouts/customer/AddAttachment"));
const AddSocialMedia = lazy(() => import("layouts/customer/AddSocialMedia"));
const ContactForm = lazy(() => import("layouts/customer/AddContact"));
const CustomerBusinessesForm = lazy(() => import("layouts/customer/AddBusinesses"));

const CategoryList = lazy(() => import('pages/Category/CategoryList'));
const ViewCategory = lazy(() => import("pages/Category/ViewCategory"));
const CategoryForm = lazy(() => import("pages/Category/CategoryForm"));
const ProductList = lazy(() => import('pages/Product/ProductList'));
const ViewProduct = lazy(() => import('pages/Product/ViewProduct'));
const ProductForm = lazy(() => import("pages/Product/ProductForm"));
const CmsPageList = lazy(() => import("pages/CmsPage/CmsPageList"));
const CmsPageForm = lazy(() => import("pages/CmsPage/CmsPageForm"));
const ViewCmsPage = lazy(() => import("pages/CmsPage/ViewCmsPage"));
const EmailNotificationList = lazy(() => import('pages/EmailNotificationTemplate/EmailNotificationTemplateList'));
const ViewEmailNotification = lazy(() => import('pages/EmailNotificationTemplate/ViewEmailNotificationTemplate'));
const EmailNotificationForm = lazy(() => import('pages/EmailNotificationTemplate/EmailNotificationTemplateForm'));
const NotificationList = lazy(() => import('pages/Notification/ListNotification'));
const NotificationForm = lazy(() => import('pages/Notification/AddNotification'));
const WorkTypeForm = lazy(() => import("pages/WorkType/WorkTypeForm"));
const ViewWorkType = lazy(() => import("pages/WorkType/ViewWorkType"));
const ProjectTemplateTab = lazy(() => import("pages/ProjectTemplateTab/ProjectTemplateTab"));
const ProjectTemplateForm = lazy(() => import("pages/ProjectTemplate/ProjectTemplateForm"));
const ViewProjectTemplate = lazy(() => import("pages/ProjectTemplate/ViewProjectTemplate"));
const OrderStatusList = lazy(() => import("pages/OrderStatus/OrderStatusList"));
const OrderStatusForm = lazy(() => import("pages/OrderStatus/OrderStatusForm"));
const ViewOrderStatus = lazy(() => import("pages/OrderStatus/ViewOrderStatus"));

const PromotionList = lazy(() => import("pages/Promotion/PromotionList"));
const ViewPromotion = lazy(() => import('pages/Promotion/ViewPromotion'));
const PromotionCodeForm = lazy(() => import("pages/Promotion/AddPromotionCodeForm"));
const ClientGroupList = lazy(() => import("pages/ClientGroup/ClientGroupList"));
const ViewClientGroup = lazy(() => import("pages/ClientGroup/ViewClientGroup"));
const ClientGroupForm = lazy(() => import("pages/ClientGroup/ClientGroupForm"));
const EmailTemplateList = lazy(() => import("pages/EmailTemplates/EmailTemplateList"));
const ViewEmailTemplate = lazy(() => import('pages/EmailTemplates/ViewTemplate'));
const EmailTemplateForm = lazy(() => import('pages/EmailTemplates/EmailTemplateForm'));
const CampaignList = lazy(() => import('pages/Campaign/CampaignList'));
const CampaignForm = lazy(() => import('pages/Campaign/AddCampaignForm'));
const ViewCampaign = lazy(() => import('pages/Campaign/ViewCampaign'));
const InquiryList = lazy(() => import("pages/WebForms/Inquiry/ListInquiry"));
const ViewInquiry = lazy(() => import("pages/WebForms/Inquiry/ViewInquiry"));
const FeedbackList = lazy(() => import("pages/WebForms/Feedback/ListFeedbacks"));
const ViewFeedback = lazy(() => import("pages/WebForms/Feedback/ViewFeedback"));
const FeedbackForm = lazy(() => import("pages/WebForms/Feedback/FeedbackForm"));
const NewsLetterList = lazy(() => import("pages/WebForms/Newsletter/ListNewsLetters"));
const ViewNewsLetter = lazy(() => import("pages/WebForms/Newsletter/ViewNewsLetter"));
const TestimonialList = lazy(() => import("pages/CustomerTestimonial/TestimonialList"));
const ViewTestimonial = lazy(() => import("pages/CustomerTestimonial/ViewTestimonial"));
const TestimonialForm = lazy(() => import("pages/CustomerTestimonial/AddTestimonial"));
const CampaignLog = lazy(() => import('pages/Campaign/CampaignLog'));
const CampaignDashboard = lazy(() => import('pages/Campaign/CampaignDashboard'));
const LandingPageList = lazy(() => import("pages/WebForms/LandingPage/ListLandingPages"));
const LandingPageForm = lazy(() => import("pages/WebForms/LandingPage/LandingPageForm"));
const ViewLandingPage = lazy(() => import("pages/WebForms/LandingPage/ViewLandingPages"));

const UserList = lazy(() => import('layouts/people/UserList'));
const UserForm = lazy(() => import("layouts/people/UserForm"));
const ViewUser = lazy(() => import("layouts/people/ViewUser"));
const UserActionRight = lazy(() => import("layouts/people/UserActionRight"));
const RoleAssignment = lazy(() => import("layouts/people/RoleAssignment"));

const ResetPassword = lazy(() => import('layouts/authentication/reset-password/ResetPass'));

// Define a TypeScript interface for the route objects

interface Permission {
    [key: string]: string;
}

interface MenuPermissions {
    [key: string]: Permission;
}

interface Icon {
    icon: JSX.Element;
}

interface ParentIcon {
    [key: string]: Icon;
}

interface ChildIcon {
    [key: string]: Icon;
}

interface Route {
    type: string;
    name: string;
    key: string;
    icon: JSX.Element | null;
    dropdown: boolean;
    collapse: CollapseRoute[];
}

interface CollapseRoute {
    type: string;
    name: string;
    key: string;
    icon: JSX.Element | null;
    route: string;
    collapse: NestedRoute[]; // Change this to NestedRoute array
    component?: JSX.Element;
}

interface NestedRoute { // Define a new interface for nested routes
    type: string;
    name: string;
    key: string;
    route: string;
    component?: JSX.Element;
}

const parentIcon: ParentIcon = {
    "Dashboard": {
        icon: <Home />
    },
    "Orders": {
        icon: <BusinessCenter />
    },
    "Customer": {
        icon: <AccountCircleIcon />
    },
    "Settings": {
        icon: <Settings />
    },
    "Marketing": {
        icon: <SupportAgent />
    },
    "People": {
        icon: <People />
    },
    "Tools": {
        icon: <BuildCircle />
    },
    "Integration": {
        icon: <IntegrationInstructionsRounded />
    },
    "Configuration": {
        icon: <AdminPanelSettings />
    }
};

const childIcon: ChildIcon = {

    // dashboard submenus
    "Dashboard": {
        icon: <Home />
    },
    "Inbox": {
        icon: <InboxOutlined />
    },
    "My Daily Report": {
        icon: <Assessment />
    },
    "My To Do": {
        icon: <HourglassTop />
    },
    "My Calendar": {
        icon: <CalendarMonthSharp />
    },
    "My Tasks": {
        icon: <AutoFixHigh />
    },
    "Profile": {
        icon: <AccountCircleIcon />
    },
    "Change Password": {
        icon: <ChangeCircle />
    },

    // projects submenus
    "My Order": {
        icon: <WorkOutline />
    },
    "New Order": {
        icon: <AddCard />
    },
    "New Jobs": {
        icon: <EnhancedEncryption />
    },
    "App Requirement": {
        icon: <Extension />
    },
    "Custom Work Requirement": {
        icon: <AutoFixHigh />
    },

    // Customer submenus
    "My Customer": {
        icon: <SupervisedUserCircleOutlined />
    },
    "Cart": {
        icon: <ShoppingCart />
    },

    // Settings submenus
    "Category": {
        icon: <CategoryOutlined />
    },
    "Product": {
        icon: <ProductionQuantityLimitsRounded />
    },
    "Page": {
        icon: <CopyAll />
    },
    "Email Notification Template": {
        icon: <EmailOutlined />
    },
    "Notification": {
        icon: <Notifications />
    },
    "Project Template": {
        icon: <Pages />
    },
    "Order Status": {
        icon: <MoreHoriz />
    },

    // Marketing submenus
    "Promotional Code": {
        icon: <Sell />
    },
    "Client Group": {
        icon: <Groups />
    },
    "Template": {
        icon: <Description />
    },
    "Campaign": {
        icon: <Campaign />
    },
    "Inquiry": {
        icon: <QuestionAnswer />
    },
    "Feedback": {
        icon: <RateReview />
    },
    "News Subscriber List": {
        icon: <Email />
    },
    "Testimonials": {
        icon: <Assistant />
    },
    "Campaign Log": {
        icon: <Telegram />
    },
    "Campaign Dashboard": {
        icon: <Dashboard />
    },
    "Landing Page": {
        icon: <Dashboard />
    },

    // People submenus
    "User": {
        icon: <Face />
    },
    "User Action Right": {
        icon: <HowToReg />
    },
    "Role Assignment": {
        icon: <AssignmentTurnedIn />
    },

    // Tools submenus
    "Organization Setting": {
        icon: <SettingsAccessibilityTwoTone />
    },

    // Integration submenus
    "Drop Box": {
        icon: <MarkAsUnread />
    },
    "Good Day": {
        icon: <GppGood />
    },
    "Email": {
        icon: <AttachEmail />
    },

    // Configuration submenus

    "Order Payment Status": {
        icon: <Payments />
    },
    "Order Payment Type": {
        icon: <CreditCard />
    },
    "Part Payment Status": {
        icon: <PriceChange />
    },
    "Part Payment Method": {
        icon: <PriceCheck />
    },
    "Platform": {
        icon: <Code />
    },
    "Timezone": {
        icon: <Schedule />
    },
    "Industry": {
        icon: <Warehouse />
    },
    "Business Category": {
        icon: <CategoryRounded />
    },
    "Marketing Activity": {
        icon: <Storefront />
    },
    "Contact Data Source": {
        icon: <Source />
    },
    "Order Payments": {
        icon: <CreditScore />
    },

};

// url component type
type UrlComponent = {
    [key: string]: {
        view?: { [key: string]: JSX.Element | null }[];
        create?: { [key: string]: JSX.Element }[];
        update?: { [key: string]: JSX.Element }[];
        assign?: { [key: string]: JSX.Element }[];
    }
}

const components: UrlComponent = {

    // Dashboard Routes
    "Dashboard": {
        view: [{ '/dashboard': <Dashboards /> }],
    },
    "Inbox": {
        view: [{ '/inbox': <PageConstruction /> }]
    },
    "My Daily Report": {
        view: [{ '/my-daily-report': <PageConstruction /> }]
    },
    "My To Do": {
        view: [{ '/my-to-do': <ToDo /> }],
    },
    "My Calendar": {
        view: [{ '/my-calendar': <PageConstruction /> }]
    },
    "My Tasks": {
        view: [{ '/my-task': <ViewCustomQuote /> }, { '/my-task/add': <AddCustomWorkQuote /> }],
    },
    "Profile": {
        view: [{ '/profile': <Profile /> }, { '/edit-profile': <EditProfile /> }],
    },
    "Change Password": {
        view: [{ '/change-password': <ChangePassword /> }],
    },

    // Orders   
    "My Order": {
        view: [{ '/my-order': <OrderTabs /> }, { '/order-allocation': <OrderAllocation method={""} /> },],
    },
    "New Order": {
        view: [{ '/new-order': <PageConstruction /> }],
    },
    "New Jobs": {
        view: [{ '/new-job': <PageConstruction /> }],
    },
    "Payment": {
        view: [{ '/payment': <PageConstruction /> }]
    },
    "App Requirement": {
        view: [{ 'app-requirement': <ListPlugin /> }],
        create: [{ '/app-requirement/add': <AddAppRequirement /> }]
    },
    "Custom Work Requirement": {
        view: [{ 'custom-work-requirement': <ListCustomWork /> }],
        create: [{ '/custom-work-requirement/add': <AddCustomWork /> }]
    },

    // Customer
    "My Customer": {
        view: [{ '/my-customer': <CustomerTabs /> }],
        create: [{ '/my-customer/add': <AddCustomer /> },],
    },
    "Cart": {
        view: [{ '/cart': <Cart /> }],
        create: [{ '/cart-item/:id': <CartItem /> }],
        update: [{ '/cart-item/:id/:cartId': <CartItem /> }],
    },
    "Opportunity": {
        view: [{ '/opportunity': <ViewOpportunity /> }],
        create: [{ '/opportunity/add': <AddOpportunity /> }, { 'opportunity/mockup-request': <AddMockupRequest /> }]
    },
    "Customer Contact": {
        create: [{ 'contact/add': <ContactForm method={'POST'} /> }],
        update: [{ '/contact/update/:id': <ContactForm method={'PUT'} /> }]
    },
    "Customer Business": {
        create: [{ 'business/add': <CustomerBusinessesForm method="POST" /> }],
        update: [{ 'business/update/:id': <CustomerBusinessesForm method="PUT" /> }]
    },
    // "Customer Preferences": {
    //     create: [{ 'preference/add': <AddPreferences /> }],
    // },
    "Customer Attachments": {
        create: [{ 'attachment/add': <AddAttachment /> }],
    },
    "Customer Social Media": {
        create: [{ 'social-media/add': <AddSocialMedia /> }],
    },
    "Customer Service": {
        create: [{ 'service/add': <AddService /> }],
    },

    // Settings Routes
    "Category": {
        view: [{ '/category': <CategoryList /> }, { '/category/view/:id': <ViewCategory /> }],
        create: [{ '/category/add': <CategoryForm method="POST" /> }],
        update: [{ '/category/update/:id': <CategoryForm method="PUT" /> }],
    },
    "Product": {
        view: [{ '/product': <ProductList /> }, { '/product/view/:id': <ViewProduct /> }],
        create: [{ '/product/add': <ProductForm method="POST" /> }],
        update: [{ '/product/update/:id': <ProductForm method="PUT" /> }],
    },
    "Email Notification Template": {
        view: [{ '/email-notification-template': <EmailNotificationList /> }, { '/email-notification-template/view/:email_user_type/:id': <ViewEmailNotification /> }],
        create: [{ '/email-notification-template/add': <EmailNotificationForm method="POST" /> }],
        update: [{ '/email-notification-template/update/:id': <EmailNotificationForm method="PUT" /> }],
    },
    "Notification": {
        view: [{ '/notification': <NotificationList /> }],
        create: [{ "notification/add": <NotificationForm /> }]
    },
    "Page": {
        view: [{ '/page': <CmsPageList /> }, { '/page/view/:id': <ViewCmsPage /> }],
        create: [{ '/page/add': <CmsPageForm method="POST" /> }],
        update: [{ '/page/update/:id': <CmsPageForm method="PUT" /> }],
    },
    "Project Template": {
        view: [{ '/project-template': <ProjectTemplateTab /> }, { '/project-template/view/:id': <ViewProjectTemplate /> }],
        create: [{ '/project-template/add': <ProjectTemplateForm method="POST" /> }],
        update: [{ '/project-template/update/:id': <ProjectTemplateForm method="PUT" /> }],
    },
    "Work Type": {
        view: [{ '/work-type/view/:id': <ViewWorkType /> }],
        create: [{ '/work-type/add': <WorkTypeForm method="POST" /> }],
        update: [{ '/work-type/update/:id': <WorkTypeForm method="PUT" /> }],
    },
    "Order Status": {
        view: [{ '/order-status': <OrderStatusList /> }, { '/order-status/view/:id': <ViewOrderStatus /> }],
        create: [{ '/order-status/add': <OrderStatusForm method="POST" /> }],
        update: [{ '/order-status/update/:id': <OrderStatusForm method="PUT" /> }],
    },

    // marketing
    "Promotional Code": {
        view: [{ '/promotional-code': <PromotionList /> }, { '/promotional-code/view/:id': <ViewPromotion /> }],
        create: [{ '/promotional-code/add': <PromotionCodeForm method="POST" /> }],
        update: [{ '/promotional-code/update/:id': <PromotionCodeForm method="PUT" /> }],
    },
    "Client Group": {
        view: [{ '/client-group': <ClientGroupList /> }, { '/client-group/view/:id': <ViewClientGroup /> }],
        create: [{ '/client-group/add': <ClientGroupForm method="POST" /> }],
        update: [{ '/client-group/update/:id': <ClientGroupForm method="PUT" /> }],
    },
    "Template": {
        view: [{ '/template': <EmailTemplateList /> }, { '/template/view/:id': <ViewEmailTemplate /> }],
        create: [{ '/template/add': <EmailTemplateForm method="POST" /> }],
        update: [{ '/template/update/:id': <EmailTemplateForm method="PUT" /> }],
    },
    "Campaign": {
        view: [{ '/campaign': <CampaignList /> }, { "/campaign/view/:id": <ViewCampaign /> }],
        create: [{ '/campaign/add': <CampaignForm method="POST" /> }],
        update: [{ '/campaign/update/:id': <CampaignForm method="PUT" /> }],
    },
    "Inquiry": {
        view: [{ '/inquiry': <InquiryList method="" /> }, { '/inquiry/view/:id': <ViewInquiry /> }]
    },
    "Feedback": {
        view: [{ '/feedback': <FeedbackList method="" /> }, { '/feedback/view/:id': <ViewFeedback /> }],
        create: [{ '/feedback/add': <FeedbackForm method="POST" /> }],
    },
    "News Subscriber List": {
        view: [{ '/news-subscriber-list': <NewsLetterList method="GET" /> }, { '/news-subscriber-list/view/:id': <ViewNewsLetter /> }],
    },
    "Testimonials": {
        view: [{ '/testimonial': <TestimonialList /> }, { '/testimonial/view/:id': <ViewTestimonial /> }],
        create: [{ '/testimonial/add': <TestimonialForm method="POST" /> }],
        update: [{ '/testimonial/update/:id': <TestimonialForm method="PUT" /> }],
    },
    "Campaign Log": {
        view: [{ "/campaign-log": <CampaignLog /> }],
    },
    "Campaign Dashboard": {
        view: [{ "/campaign-dashboard": <CampaignDashboard method="" /> }],
    },
    "Landing Page": {
        view: [{ "/landing-page": <LandingPageList /> }],
        create: [{ "/landing-page/add": <LandingPageForm method="POST" /> }, { "/landing-page/view/:id": <ViewLandingPage /> }],
        update: [{ "/landing-page/update/:id": <LandingPageForm method="PUT" /> }],
    },

    // people
    "User": {
        view: [{ '/user': <UserList /> }, { '/user/view/:id': <ViewUser /> }],
        create: [{ '/user/add': <UserForm method="POST" /> }],
        update: [{ '/user/update/:id': <UserForm method="PUT" /> }],
    },
    "User Action Right": {
        view: [{ '/user-action-right': <UserActionRight /> }],
        assign: [{ '/user-action-right': <UserActionRight /> }],
    },
    "Role Assignment": {
        view: [{ '/role-assignment': <RoleAssignment /> }],
    },

    // Tools
    "Organization Setting": {
        create: [{ '/organization-setting': <UserSetting /> }]
    },

    // Integration
    "Drop Box": {
        view: [{ '/drop-box': <PageConstruction /> }]
    },
    "Good Day": {
        view: [{ '/good-day': <PageConstruction /> }]
    },
    "Email": {
        view: [{ '/email': <PageConstruction /> }]
    },

    // Configurations
    "Order Payment Status": {
        view: [{ '/order-payment-status': <PageConstruction /> }]
    },
    "Order Payment Type": {
        view: [{ '/order-payment-type': <PageConstruction /> }]
    },
    "Part Payment Status": {
        view: [{ '/part-payment-status': <PageConstruction /> }]
    },
    "Part Payment Method": {
        view: [{ '/part-payment-method': <PageConstruction /> }]
    },
    "Platform": {
        view: [{ '/platform': <PageConstruction /> }]
    },
    "Timezone": {
        view: [{ '/timezone': <PageConstruction /> }]
    },
    "Industry": {
        view: [{ '/industry': <PageConstruction /> }]
    },
    "Business Category": {
        view: [{ '/business-category': <PageConstruction /> }]
    },
    "Marketing Activity": {
        view: [{ '/marketing-activity': <PageConstruction /> }]
    },
    "Contact Data Source": {
        view: [{ '/contact-data-source': <PageConstruction /> }]
    },
    "Work Package Status": {
        view: [{ '/work-package-status': <PageConstruction /> }]
    },
}

export const generateRoutes = (permissions: any): Route[] => {

    const routes: Route[] = [];

    for (const parentMenu in permissions) {
        const parentCollapse: Route = {
            type: "collapse",
            name: parentMenu,
            key: parentMenu.toLowerCase(),
            icon: parentIcon[parentMenu]?.icon || null,
            dropdown: true,
            collapse: []
        };

        for (const childMenu in permissions[parentMenu]) {
            if (components[childMenu] === undefined) {
                continue;
            }

            //@ts-ignore
            if (Array.isArray(components[childMenu]?.view) && Object.keys(components[childMenu]?.view[0])) {
                const childCollapse: CollapseRoute = {
                    type: childIcon[childMenu] ? "collapse" : "title",
                    name: childMenu,
                    key: childMenu.split(" ").join("-").toLowerCase(),
                    icon: childIcon[childMenu]?.icon || null,
                    //@ts-ignore
                    route: Object.keys(components[childMenu]?.view[0])[0],
                    collapse: []
                };

                for (const action in permissions[parentMenu][childMenu]) {
                    //@ts-ignore
                    components[childMenu][action]?.map((component: any) => {
                        //@ts-ignore
                        childCollapse.collapse.push({ type: "title", name: action, key: childMenu + action.toLowerCase(), route: Object.keys(component)[0] === "assign" ? "view" : Object.keys(component)[0], component: component[Object.keys(component)[0] === "assign" ? "view" : Object.keys(component)[0]] });

                    });
                }
                parentCollapse.collapse.push(childCollapse);
            } else {
                const childCollapse: CollapseRoute = {
                    type: childIcon[childMenu] ? "collapse" : "title",
                    name: childMenu,
                    key: childMenu.split(" ").join("-").toLowerCase(),
                    icon: childIcon[childMenu]?.icon || null,
                    //@ts-ignore
                    route: Object.keys(components[childMenu]?.create[0])[0],
                    collapse: []
                };

                for (const action in permissions[parentMenu][childMenu]) {
                    //@ts-ignore
                    components[childMenu][action]?.map((component: any) => {
                        //@ts-ignore
                        childCollapse.collapse.push({ type: "title", name: action, key: childMenu + action.toLowerCase(), route: Object.keys(component)[0] === "assign" ? "view" : Object.keys(component)[0], component: component[Object.keys(component)[0]] });

                    });
                }
                parentCollapse.collapse.push(childCollapse);

            }
        }

        routes.push(parentCollapse);
    }

    return routes;
};


export const authRequireRoute = [
    { key: "1", path: "/dashboard", element: <Dashboards /> },
    { key: "2", path: "/reset-password", element: <ResetPassword /> },
    { key: "3", path: '/email-activity', element: <EmailActivity /> },
    { key: "4", path: '/log-activity', element: <LogActivity /> },
    { key: "5", path: '/note', element: <Note /> },
    { key: "6", path: '/reminder', element: <Reminder /> },
    { key: "7", path: '/scope-of-work', element: <ScopeOfWork /> },
    { key: "8", path: '/task', element: <TaskActivity /> },
]
