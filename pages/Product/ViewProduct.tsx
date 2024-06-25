import React from 'react';
import { service } from 'utils/Service/service';
import View from 'common/View';

// product interface
class ProductType {
    constructor(
        private id?: number,
        private name?: string,
        private organization?: string,
        private categories?: string,
        private price?: string,
        private sales_price?: string,
        private member_price?: number,
        private is_active?: boolean,
        private alias?: string,
        private short_description?: string,
        private product_image?: string | null,
        private product_icon?: string,
        private product_type?: number,
        private qty_apply?: boolean,
        private long_description?: string | null,
        private meta_title?: string | null,
        private meta_description?: string | null,
        readonly created_by?: string | null,
        readonly updated_by?: string | null,
        readonly created_at?: string | null,
        readonly updated_at?: string | null) { }
}

const ViewProduct: React.FC = () => {
    const viewType = Object.keys(new ProductType());

    return (
        <>
            <View url={service.API_URL.product.get} imageKeys={['product_icon', 'product_image']} display={'View Product'} viewType={viewType} />
        </>
    );
}

export default ViewProduct;