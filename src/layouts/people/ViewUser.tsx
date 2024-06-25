import React from 'react';
import View from 'common/View';
import { service } from 'utils/Service/service';

class UserType {
    constructor(
        readonly name?: string,
        readonly user_name?: string,
        readonly email?: string,
        readonly is_active?: boolean,
        readonly role_name?: string | null,
        //readonly image?: string | null,
        readonly title?: string | null,
        readonly address1?: string | null,
        readonly address2?: string | null,
        readonly city?: string | null,
        readonly state?: string | null,
        readonly country?: string | null,
        readonly zip?: string | null,
        readonly phone?: string | null,
        readonly mobile?: string | null,
        readonly linkedin?: string | null,
        readonly facebook?: string | null,
        readonly twitter?: string | null,
        readonly joining_date?: string | null,
        readonly relevation_date?: string | null,
        readonly birth_date?: string | null,
        readonly blog?: string | null,
        readonly qualification?: string | null,
        readonly experience?: string | null,
        readonly skills?: string | null,
        readonly im_id?: string | null,
        readonly im_type?: string | null,
        readonly created_by?: string | null,
        readonly updated_by?: string | null,
        readonly created_at?: string | null,
        readonly updated_at?: string | null) { }
}

const ViewCategory: React.FC = () => {

    const viewType = Object.keys(new UserType());

    return (
        <>
            <View url={service.API_URL.people.get} display={'View User'} viewType={viewType} />
        </>
    );
}
    
export default ViewCategory;