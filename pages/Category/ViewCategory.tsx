import React from 'react';
import View from 'common/View';
import { service } from 'utils/Service/service';

// define category type with attributes which should be displayed in view
class CategoryType {
    constructor(
        readonly name?: string,
        readonly organization?: string,
        readonly is_active?: boolean,
        readonly parent_name?: string | null,
        readonly short_description?: string,
        readonly long_description?: string | null,
        readonly image?: string | null,
        readonly file?: string | null,
        readonly meta_title?: string | null,
        readonly meta_keyword?: string | null,
        readonly meta_description?: string | null,
        readonly created_by?: string | null,
        readonly updated_by?: string | null,
        readonly created_at?: string | null,
        readonly updated_at?: string | null) { }
}

const ViewCategory: React.FC = () => {

    // extracting keys from type declared
    const viewType = Object.keys(new CategoryType());

    return (
        <>
            <View fileKeys={["file"]} imageKeys={["image"]} url={service.API_URL.category.get} display={'View Category'} viewType={viewType} />
        </>
    );
}

export default ViewCategory;