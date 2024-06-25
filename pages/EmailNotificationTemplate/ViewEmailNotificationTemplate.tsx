import React from 'react';
import { service } from 'utils/Service/service';
import View from 'common/View';

// email notification template interface
class EmailNotificationType {
    constructor(
        private readonly template_title?: string,
        private readonly organization?: string,
        private readonly is_active?: boolean,
        private readonly primary_template?: string,
        private readonly from_email?: string,
        private readonly from_name?: string,
        private readonly reply_email?: string,
        private readonly reply_name?: string,
        private readonly email_type?: string,
        private readonly email_subject?: string,
        private readonly email_description?: string,
        private readonly created_by?: string,
        private readonly updated_by?: string,
        private readonly created_at?: string,
        private readonly updated_at?: string,
    ) { }
}

const ViewEmailNotification: React.FC = () => {
    const viewType = Object.keys(new EmailNotificationType());

    return (
        <>
            <View url={service.API_URL.emailNotification.get} display={'View Email Notification Template'} viewType={viewType} />
        </>
    )
}


export default ViewEmailNotification;