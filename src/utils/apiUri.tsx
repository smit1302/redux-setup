const baseUrl = process.env.REACT_APP_API_URL;

export const API_URL = {
    base: baseUrl,
    cart: {
        view: "customer-cart/list",
        create: 'customer-cart/create',
        get: "customer-cart/get",
        update: "customer-cart/update",
    },

    default: {
        file: "app/file"
    },

    todo: {
        fetchToDo: 'to-do/list',
        postToDo: 'to-do/create',
        updateToDo: 'to-do/update',
        deleteToDo: 'to-do/delete',
    },

    orderPayment: 'order-payment',
    notification: {
        viewNotification: 'notification/list',
        saveNotification: 'notification/create',
        replyNotification: 'notification-replies/create',
        replyedMessage: 'notification-replies'
    },

    master: {
        platforms: 'platforms',
    },

    customWorkQoute: {
        add: 'custom-work-quotes/create',
        view: 'custom-work-quotes/list',
        update: 'custom-work-quotes/update',
        reply: 'custom-work-message/create',
        incrementRemainder: 'custom-work-quotes/update-remainder-request-quote',
        replyMessage: 'custom-work-message'
    },
    webConfig: {
        companyConfig: 'company-config/create'
    },

    requirement: {
        customWork: 'custom-work/create',
        addAppRequirement: 'app-requirements/create',
        listAppRequirement: 'app-requirements/list',
        listCustomWork: 'custom-work/list'
    },

    profile: {
        profile: 'system-user/profile',
        getUser: 'User',
        getList: 'list',
        getSystemUser: 'system-user/profile-user',
        fetchImTypeList: 'im-types',

    },

    category: {
        get: "category",
        list: "category/list",
        update: "category/update",
        updateStatus: "category/update-status",
        create: "category/create",
        delete: "category/delete",
    },

    product: {
        get: "product",
        list: "product/list",
        update: "product/update",
        updateStatus: "product/update",
        create: "product/create",
        delete: "product/delete",
    },

    emailNotification: {
        get: "email-notification-template",
        list: "email-notification-template/list",
        create: "email-notification-template/create",
        update: "email-notification-template/update",
        updateStatus: "email-notification-template/update-status",
        delete: "email-notification-template/delete",
    },

    customerDocument: {
        create: 'customer-documents/create',
        list: 'customer-documents/list',
    },

    auth: {
        login: "login",
        signUp: "registration",
        changePassword: "change-password",
        resetPassword: "reset-password",
        forgotPassword: "forget-password",
        getuser:"get-user"
    },

    order: {
        listOrder: "order/list",
        listFreeJob: 'order/listFreeJobs',
        payment: 'order-payment/list-order-payment',
        status: 'order/order-status',
        master: 'order/master-order/data',
        status_list: 'order-status/list',
        allocate_order: 'order/allocate-order',
        file_daily_report_list: 'file-daily-report/order-status',
        file_daily_report_create: 'file-daily-report/create-data',
        pastOrder: 'order/list-past-orders',
        editorderallocation: 'order/allocate-order',
        mockup: 'order/create-mockup',
        create: 'order/create-order',
    },

    masterSelect: {
        get: "app/constant/data",
    },

    newsLetter: {
        get: "newsletter",
        list: "newsletter-subscriber/list",
        view: "newsletter-subscriber",
        delete: "newsletter-subscriber/delete",
    },

    cms: {
        get: "cms",
        list: "cms/list",
        update: "cms/update",
        updateStatus: "cms/update-status",
        create: "cms/create",
        delete: "cms/delete",
    },

    promotionalCode: {
        view: "promotion",
        create: "promotion/create",
        update: "promotion/update",
        delete: "promotion/delete",
        list: "promotion/list",
        updateStatus: "promotion/update-status",
    },


    feedback: {
        create: "customer-feedback/create",
        update: "customer-feedback/update",
        get: "feedback",
        list: "customer-feedback/list",
        view: "customer-feedback",
        delete: "customer-feedback/delete",
    },


    inquiry: {
        get: "inquiry",
        list: "contact-inquiry/list",
        view: "contact-inquiry",
        delete: "contact-inquiry/delete",
    },

    user: {
        get: 'get-user',
        list: 'user/list',
        getUserByRole: 'user',
        changePassword: 'change-password',
        getOrganizationRoles: 'user/get-organization-role',
        toggleOrganizationRole: 'user/update-organization-role',
    },

    projectTemplate: {
        get: 'Project-template',
        list: 'Project-template/list',
        create: 'Project-template/create',
        update: 'Project-template/update',
        updateStatus: 'Project-template/update-status',
        delete: 'Project-template/delete',
    },

    workType: {
        get: 'work-type',
        list: 'work-type/list',
        update: 'work-type/update',
        updateStatus: 'work-type/update-status',
        create: 'work-type/create',
        delete: 'work-type/delete',
    },

    roleAccess: {
        roleRight: 'permission/role-right',
        userRight: 'permission/user-right',
        toggleRolePermission: 'permission/update/role-permission',
        toggleUserPermission: 'permission/update/user-permission',
        getRoles: 'user-role'
    },

    customer: {
        list: 'customer/list',
        create: 'customer/create',
        addBusiness: 'customer-business/create',
        createContact: 'customer-contact/create',
        listContact: 'customer-contact/list/CustomerContacts',
        listBusiness: 'customer-business/CustomerBusiness',
        deleteBusiness: 'customer-business/delete',
        updateBusiness: 'customer-business/update',
        createSocialMedia: 'customer-sm-account/create',
        listSocialMedia: 'customer-sm-account/list',
        deleteContact: 'customer-contact/delete',
        updateContact: 'customer-contact/update',
        getContact: 'customer-contact',
        getBusiness: 'customer-business',
        getPreference: 'customer-preference',
        createPreference: 'customer-preference/create',
        updatePreference: 'customer-preference/update',
        listPreference: 'customer-preference/list',
        updateCustomer: 'customer/update',
        emailPreferences: 'customer-preference/list-email-preference',
    },


    opportunity: {
        list: 'opportunity/list',
        get: 'opportunity/CustomerOpportunities',
        create: 'opportunity/create',
        convert: 'opportunity/convert'
    },

    platform: {
        create: 'platform-type/create',
        list: 'platform-type/list',
    },
    email_marketing: {
        list: 'email-marketing/list',
        View: 'email-marketing',
        add: 'email-marketing/create',
        update: 'email-marketing/update',
        delete: 'email-marketing/delete',
        updateStatus: 'email-marketing/update-status'
    },
    campaign: {
        create: 'campaign/create',
        update: 'campaign/update',
        View: 'campaign',
        list: 'campaign/list',
        delete: 'campaign/delete',
        updateStatus: 'campaign/update-status'
    },
    order_status: {
        create: 'order-status/create',
        update: 'order-status/update',
        list: 'order-status/list',
        view: 'order-status',
        delete: 'order-status/delete',
        updateStatus: "order-status/update-status",
    },
    testimonial: {
        create: 'customer-testimonial/create',
        update: 'customer-testimonial/update',
        delete: 'customer-testimonial/delete',
        view: 'customer-testimonial',
        list: 'customer-testimonial/list',
        email: 'customer-testimonial/email',
        updateStatus: 'customer-testimonial/update-status'
    },
    apprequirement: {
        addAppRequirement: 'app-requirements'
    },
    customer_group: {
        get: 'customer-group/list',
        create: 'customer-group/create',
        update: 'customer-group/update',
        delete: 'customer-group/delete',
        view: 'customer-group',
        namelist: 'customer-group',
        lifecycleStage: 'life-cycle-stage/list',
        activity: 'marketing-activity-type/list',
        blockedSituation: 'customer-block-situation/list',
        category: 'category/list',
        prodcut: 'product/list',
        contact: 'contact-data-source/list',
        platform: 'platform-type/list',
        updateStatus: 'customer-group/update-status',
    },

    ImType: {
        List: 'im-types',
    },

    landingPage: {
        create: 'landing-page/create',
        list: 'landing-page/list',
        update: 'landing-page/update',
        delete: 'landing-page/delete',
        get: 'landing-page'
    },

    dashBoard: {
        list: 'dash-board/list'
    },

    people: {
        addUser: 'user/create',
        userRole: 'user-role',
        imType: 'im-types',
        list: 'user/list',
        delete: 'user/delete',
        get: 'user',
        update: 'user/update',
        updateStatus: 'user/update'
    },

    message_thread: {
        list: 'message-activity/list-message-thread'
    },

    message_activity: {
        note: 'message-activity/create-note-activity',
        scope: 'message-activity/create-scope-activity',
        log: 'message-activity/create-log-activity',
        reminder: 'message-activity/create-reminder-activity',
        email: 'message-activity/create-email-activity',
        task: 'message-activity/create-task-activity',
        list: 'message-activity/list-activities'
    },

    cartProduct: {
        create: 'cart-products'
    }

};
