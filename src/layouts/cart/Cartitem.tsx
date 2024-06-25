import React, { useEffect, useState } from 'react';
import { Grid, Icon } from "@mui/material";
import { Card } from "@mui/material";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import Footer from 'examples/Footer';
import MDButton from 'components/MDButton';
import Select from 'components/MDSelect';
// import Select from 'common/Select';
import MDInput from 'components/MDInput';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import './style.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Modal, Fade, } from '@mui/material';
import { service } from 'utils/Service/service';
import { useForm } from 'react-hook-form';
import { getLocationData, requiredMessage } from 'utils/common';
import ErrorShow from 'common/ErrorShow';
import { useNavigate, useParams } from 'react-router-dom';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ConfirmModal from 'common/ConfirmModal';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch, useSelector } from 'react-redux';


interface PaymentData {
    cart_part_payment_id?: number;
    paymentExpectedDate: string;
    paymentInstallmentLabel: string;
    totalAmount: number;
    comment: string;
}

interface ProductData {
    cart_product_id?: number;
    productName: string;
    productId: number;
    websiteUrl: string;
    memberPrice: number;
    qty: number;
    regularPrice: number;
    promotionDiscount: number;
    totalAmount: number;
    memberDiscount: number;
    netAmount: number;
}

interface CartData {
    customerId: number;
    cartTotal: number;
    cartProductsCount: number;
    promotionCode: string;
    totalDiscount: number;
    cartNetAmount: number;
    products: ProductData[];
    payments: PaymentData[];
}
const Cartitem: React.FC = () => {
    const { id, cartId } = useParams();
    const [pastorderModal, setpastorderModal] = useState(false);
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, watch, unregister } = useForm<CartData>();
    const [productOptions, setProductOptions] = useState<any>([
        {
            "value": 1,
            "label": "Product Name",
            "price": 10,
        },
        {
            "value": 2,
            "label": "Product Name 2",
            "price": 50
        },
        {
            "value": 3,
            "label": "Product Name 3",
            "price": 70
        }
    ]
    );
    const [products, setProducts] = useState<any>([]);
    const [convertopportunityModal, setconvertopportunityModal] = useState(false);
    const [product, setProduct] = useState<any>({})
    const history = useNavigate();
    const [user, setUser] = useState('')
    const [qty, setqty] = useState(0)
    const [selectedProducts, setSelectedProducts] = useState<any>({});
    const [data, setData] = useState<any>({});
    const [placeOrder, setPlaceOrder] = useState(false)
    const dispatchData = useDispatch();
    const [apiPastOrder, setApiPastOrder] = useState()
    const opportunityId = useSelector((state: any) => state.commonData.commonData?.opportunityId);
    const productToAdd = useSelector((state: any) => state.commonData.commonData?.product);
    const handlepastorderModal = () => {
        setpastorderModal(true);
    };
    const handleconvertopportunityModal = () => {
        setconvertopportunityModal(true)
    };

    const handleModalClose = () => {
        setpastorderModal(false);
        setconvertopportunityModal(false)
    };


    // function to fetch category data for update
    const fetchData = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.cart.get,
                params: { id, cartId },
            });
            // set default values of react hook form
            const cartData: any = await response?.data.data;
            console.log('RESPONSE', cartData)
            setData(cartData);
            // Set form values using setValue
            setValue('customerId', cartData[0].customer_id);
            setValue('cartProductsCount', cartData[0].cart_products_count);
            setValue('promotionCode', cartData[0].promotion_code);
            setValue('totalDiscount', cartData[0].total_discount);
            setValue('cartNetAmount', cartData[0].cart_net_amount);
            setValue('cartTotal', cartData[0].cart_total);

            setValue('products', []);

            cartData[0]?.cartProducts?.map(async (cartProduct: any, index: number) => {
                // debugger
                if (index > 0) {
                    const newproductRows = {
                        no: index + 1,
                        websiteUrl: cartProduct.website_url,
                        ProductName: cartProduct.product_name,
                        ProductId: cartProduct.product_id,
                        regularPrice: cartProduct.regular_price,
                        MemberPrice: cartProduct.member_price,
                        qty: cartProduct.quantity,
                        promo: cartProduct.promotion_discount,
                        memb: cartProduct.member_discount,
                        totalAmount: cartProduct.total_amount,
                        created_by: "",
                    };

                    //     // Assuming setProductRows and setSelectedProducts are asynchronous functions
                    await setProductRows((prevProductRows: any) => [...prevProductRows, newproductRows]);
                }
                await setSelectedProducts((prevSelectedProducts: any) => ({
                    ...prevSelectedProducts,
                    [index + 1]: {
                        value: cartProduct.product_id,
                        label: cartProduct.product_name,
                        price: cartProduct.regular_price
                    }
                }
                ));

                setValue(`products.${index + 1}.cart_product_id`, cartProduct.cart_product_id);
                setValue(`products.${index + 1}.productName`, cartProduct.product_name);
                setValue(`products.${index + 1}.productId`, cartProduct.product_id);
                setValue(`products.${index + 1}.websiteUrl`, cartProduct.website_url);
                setValue(`products.${index + 1}.memberPrice`, cartProduct.member_price);
                setValue(`products.${index + 1}.qty`, cartProduct.quantity);
                setValue(`products.${index + 1}.regularPrice`, cartProduct.regular_price);
                setValue(`products.${index + 1}.promotionDiscount`, cartProduct.promotion_discount);
                setValue(`products.${index + 1}.memberDiscount`, cartProduct.member_discount);
                setValue(`products.${index + 1}.netAmount`, cartProduct.net_amount);
                setValue(`products.${index + 1}.totalAmount`, cartProduct.total_amount);

                trigger(`products.${index + 1}`)
            })

            setValue('payments', []);
            cartData[0]?.cartPartPayments?.map((cartPartPayment: any, index: number) => {
                const newPaymentRow = {
                    no: index + 1,
                    description: "",
                    amt: cartPartPayment.amount,
                    p_date: cartPartPayment.payment_expected_date,
                    comment: cartPartPayment.payment_description
                };
                if (index > 0) {
                    setPaymentRows((prev: any) => [...prev, newPaymentRow]);
                }

                setValue(`payments.${index + 1}.cart_part_payment_id`, cartPartPayment.cart_part_payment_id);
                setValue(`payments.${index + 1}.paymentExpectedDate`, cartPartPayment.payment_expected_date);
                setValue(`payments.${index + 1}.paymentInstallmentLabel`, cartPartPayment.payment_installment_label);
                setValue(`payments.${index + 1}.totalAmount`, cartPartPayment.amount);
            })
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.product.list,
                });
                const options = response?.data?.data.map((item: any) => ({ value: item.id, label: item.name }))

                setProductOptions(options);
                setProducts(response?.data?.data.map((item: any) => ({ value: item.id, name: item.name, price: item.price })));
            } catch (er) {
                console.log(er)
            }
        }
        const fetchUser = async () => {
            try {
                const userDataResponse = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.user.get,
                });
                setUser(userDataResponse?.data?.data.name)

            } catch (er) {
                console.log(er)
            }
        }
        const fromPastOrder = async () => {
            try {
                const fromPastOrder = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.order.pastOrder,
                });
                console.log("fromPastOrder : ", fromPastOrder?.data.data)
                setApiPastOrder(fromPastOrder?.data?.data)

            } catch (er) {
                console.log(er)
            }
        }
        fetch()
        fetchUser()
        fromPastOrder()
    }, [])

    useEffect(() => {

        if (opportunityId) {

            setValue('products', []);
            let index = 1;
            setProductRows([
                {
                    no: "1",
                    webkitURL: "",
                    ProductName: productToAdd?.name,
                    ProductId: productToAdd?.id,
                    regularPrice: productToAdd.price,
                    MemberPrice: productToAdd.member_price,
                    qty: 1,
                    promo: '',
                    memb: productToAdd.member_price,
                    created_by: "",
                }
            ])

            setSelectedProducts((prevSelectedProducts: any) => ({
                ...prevSelectedProducts,
                1: {
                    value: productToAdd.id,
                    label: productToAdd.name,
                    price: productToAdd.price
                }
            }
            ));

            setValue(`products.${1}.productName`, productToAdd.name);
            setValue(`products.${1}.productId`, productToAdd.id);
            setValue(`products.${1}.websiteUrl`, '');
            setValue(`products.${1}.memberPrice`, productToAdd.member_price);
            setValue(`products.${1}.qty`, 1);
            setValue(`products.${1}.regularPrice`, productToAdd.price);
            setValue(`products.${1}.promotionDiscount`, 0);
            setValue(`products.${1}.memberDiscount`, 0);
            setValue(`products.${1}.netAmount`, 1 * productToAdd.price);
            setValue(`products.${1}.totalAmount`, 1 * productToAdd.price);



        }

        return () => {
            if (opportunityId) {
                dispatchData(addData({ key: "opportunityId", data: undefined }));
            }
        }
    }, [opportunityId])

    useEffect(() => {
        if (id && cartId) {
            console.log('YP I MAAA FETCHING THE DATA')
            fetchData();
        }
    }, [id])


    const handleChange = (selectedOption?: any, rowId?: any) => {
        setSelectedProducts((prevSelected: any) => ({
            ...prevSelected,
            selectedProducts: selectedOption,
        }));
    };

    let columns = [

        {
            Header: "No",
            accessor: "no",
            align: "center",

        },
        {
            Header: "Domain",
            accessor: "websiteUrl",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDInput  {...register(`products.${row.original.no}.websiteUrl`)} type="text" label="Domain" inputLabelProps={{ shrink: true }} fullWidth />
                </>
            ),

        },
        {
            Header: "Product",
            accessor: "ProductName",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>

                    <Select
                        {...register(`products.${row.original.no}.productName`, { required: requiredMessage })}
                        placeholder="Select Product"
                        options={productOptions}
                        handleChange={(e) => handleProductChange(e, row.original.no)}
                        value={selectedProducts[row.original.no]?.value}
                    />
                    {errors?.products?.[row.original.no]?.productName?.message && (
                        <ErrorShow error={errors.products?.[row.original.no]?.productName?.message || ''} />)}
                    <MDInput type="text" {...register(`products.${row.original.no}.productName`)} style={{ marginTop: '10px' }} label="Product" fullWidth inputLabelProps={{ shrink: true }} />
                </>
            ),

        },
        {
            Header: "Rate($)",
            accessor: "rate",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDInput  {...register(`products.${row.original.no}.regularPrice`, { required: requiredMessage })}
                        style={{ marginBottom: '10px' }} type="number" label="Product Price" fullWidth inputLabelProps={{ shrink: true }} />
                    {errors?.products?.[row.original.no]?.regularPrice?.message && (
                        <ErrorShow error={errors.products?.[row.original.no]?.regularPrice?.message || ''} />)}
                </>
            ),
        },
        {
            Header: "Qty",
            accessor: "qty",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDInput inputLabelProps={{ shrink: true }} {...register(`products.${row.original.no}.qty`, {
                        required: requiredMessage,
                        onChange: (e: any) => {
                            setValue(`products.${row.original.no}.qty`, parseInt(e.target.value))
                            setValue(`products.${row.original.no}.netAmount`, getValues(`products.${row.original.no}.regularPrice`) * getValues(`products.${row.original.no}.qty`) || 0);
                            setValue(`products.${row.original.no}.memberPrice`, getValues(`products.${row.original.no}.netAmount`) || 0);
                            setTotalAmount()
                        },
                        onBlur: () => { trigger() }
                    })} type="number" fullWidth />
                    {errors?.products?.[row.original.no]?.qty?.message && (
                        <ErrorShow error={errors.products?.[row.original.no]?.qty?.message || ''} />)}
                </>
            ),

        },
        {
            Header: "Discount",
            accessor: "discount",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDTypography>Promo:{row.original.promo}</MDTypography>
                </>
            ),

        },
        {
            Header: "Net Amount",
            accessor: "totalAmount",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDTypography>{getValues(`products.${row.original.no}.netAmount`)}</MDTypography>
                </>
            ),

        },
        {
            Header: "Created By",
            accessor: "created_by",
            align: "center",
            Cell: ({ row }: { row: any }) => (<>{user}</>),

        },
        {
            Header: "Action",
            accessor: "cart",
            align: "center",
            Cell: ({ row, }: { row: any }) => (
                <>
                    {row.index === 0 ? (
                        <MDButton variant="gradient" color="success" onClick={addproductRows}><AddCircleIcon /></MDButton>
                    ) : (
                        <MDButton variant="gradient" color="dark" onClick={() => deleteProductRows(row.original.no)}>
                            <RemoveCircleOutlineIcon />
                        </MDButton>
                    )}
                </>
            ),
        }
    ]

    let payment = [
        {
            Header: "No",
            accessor: "no",
            align: "center",
        },
        {
            Header: "Description",
            accessor: "description",
            align: "center",
            Cell: ({ row, rows }: { row: any; rows: any[] }) => {
                const totalRows = rows.length;
                const currentRowNumber = parseInt(row.original.no);
                const installmentLabel = `${currentRowNumber} of ${totalRows} Installments`;
                setValue(`payments.${row.original.no}.paymentInstallmentLabel`, installmentLabel);
                return installmentLabel;
            },
        },
        {
            Header: "Amount",
            accessor: "amt",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDInput inputLabelProps={{ shrink: true }} {...register(`payments.${row.original.no}.totalAmount`, {
                        required: requiredMessage,
                        onChange: (e) => {
                            checkInstallmentTotal()
                        }
                    })} type="number" fullWidth />
                    {errors?.payments?.[row.original.no]?.totalAmount?.message && (
                        <ErrorShow error={errors.payments?.[row.original.no]?.totalAmount?.message || ''} />)}
                </>
            ),
        },
        {
            Header: "Payment Date",
            accessor: "p_date",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <>
                    <MDInput className={watch(`payments.${row.original.no}.paymentExpectedDate`) ? "has-value" : ""} {...register(`payments.${row.original.no}.paymentExpectedDate`, {
                        required: requiredMessage
                    })} type="date" fullWidth />
                    {errors?.payments?.[row.original.no]?.paymentExpectedDate?.message && (
                        <ErrorShow error={errors.payments?.[row.original.no]?.paymentExpectedDate?.message || ''} />)}
                </>
            ),
        },
        {
            Header: "Comment",
            accessor: "comment",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <MDInput inputLabelProps={{ shrink: true }} type="text" {...register(`payments.${row.original.no}.comment`)} placeholder="Comment" fullWidth />

            ),
        },
        {
            Header: "Action",
            accessor: "cart",
            align: "center",
            Cell: ({ row, }: { row: any }) => (
                <>
                    {row.index === 0 ? (
                        <MDButton variant="gradient" color="dark" onClick={addPaymentRow}><AddCircleIcon /></MDButton>
                    ) : (
                        <MDButton variant="gradient" color="dark" onClick={() => deletePaymentRow(row.original.no)}>
                            <RemoveCircleOutlineIcon />
                        </MDButton>
                    )}
                </>
            ),
        }


    ];

    const pastOrder = [
        {
            Header: "Order Date",
            accessor: "order_date",
            align: "center",
        },
        {
            Header: "Order Id",
            accessor: "order_id",
            align: "center",

        },
        {
            Header: 'Product Name ',
            accessor: 'product_name',
            Cell: ({ row }: any) => (
                <div>
                    <div>{row.original.product_name}</div>
                    <div>{row.original.quantity}</div>
                </div>
            )
        },
        // {
        //     Header: "Product Name ",
        //     accessor: "product_name",
        //     align: "center",

        // },
        {
            Header: "Amount",
            accessor: "amount",
            align: "center",

        },
        {
            Header: "Action",
            accessor: "cart",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <MDButton variant="gradient" color="info" >
                    Add to Cart
                </MDButton>
            ),
        },
    ];
    const convertopportunity = [
        {
            Header: "Action",
            accessor: "cart",
            align: "center",
            Cell: ({ row }: { row: any }) => (
                <MDButton variant="gradient" color="info" >
                    Add to Cart
                </MDButton>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            align: "center",
        },
        {
            Header: "Service Details",
            accessor: user,
            align: "center",
        },
        {
            Header: "Website & Platform ",
            accessor: "website_platform",
            align: "center",

        },
        {
            Header: "Created date ",
            accessor: "c_date",
            align: "center",

        },
        {
            Header: "Projection Date",
            accessor: "p_date",
            align: "center",

        },

    ];


    const [productRows, setProductRows] = useState<any>([
        { no: "1", websiteUrl: "....", ProductName: "", ProductId: 1, regularPrice: "0", MemberPrice: "3266", qty: 1, promo: "$0.00", memb: "$0.00", totalAmount: "123", created_by: "test" },
    ])
    // Add more rows as needed
    const addproductRows = () => {
        const newproductRows = {
            no: `${productRows.length + 1}`,
            websiteUrl: "",
            ProductName: "",
            ProductId: "",
            regularPrice: "",
            MemberPrice: "",
            qty: "",
            promo: "",
            memb: "",
            totalAmount: "",
            created_by: "",

        };
        setProductRows([...productRows, newproductRows]);
    };
    // delete rows of cart table based on the 'no' value
    const deleteProductRows = (no: string) => {
        console.log("calling deletePaymentRow with no:", no);
        const selected = Object.keys(selectedProducts).filter(objKey =>
            Number(objKey) !== Number(no)).reduce((newObj: any, key: any) => {
                newObj[key] = selectedProducts[key];
                return newObj;
            }, {}
            );
        setSelectedProducts(selected)

        setProductRows((prevRows: any[]) => {
            // Filter out the row with the specified 'no'
            const updatedRows = prevRows.filter(row => row.no !== no);
            unregister(`products.${Number(no)}`)
            trigger(`products.${Number(no)}`)
            return updatedRows;
        });

    };

    //payment rows
    const [paymentrows, setPaymentRows] = useState<any>([
        { no: "1", description: "Order Payment", amt: "7896", p_date: "2023-11-23", comment: "" },

    ]);
    // add rows of payment table 
    const addPaymentRow = () => {
        const newPaymentRow = {
            no: `${paymentrows.length + 1}`,
            description: "",
            amt: "",
            p_date: "",
            comment: ""
        };
        setPaymentRows([...paymentrows, newPaymentRow]);
    };

    // delete rows of payment table based on the 'no' value
    const deletePaymentRow = (no: string) => {
        console.log("calling deletePaymentRow with no:", no);
        setPaymentRows((prevRows: any[]) => {
            // Filter out the row with the specified 'no'
            const updatedRows = prevRows.filter(row => row.no !== no);
            unregister(`payments.${Number(no)}`)
            trigger(`payments.${Number(no)}`)
            return updatedRows;
        });
    };



    const pastOrderrow = [
        { srno: "01", order_date: "23-11-2023", order_id: "7896", p_name: "3266", amt: "Qty:1 $456" },
        { srno: "02", order_date: "23-11-2023", order_id: "7896", p_name: "3266", amt: "Qty:1 $456" },
        // Add more rows as needed
    ];

    const convertopportunityrow = [
        { status: "01", service_details: "Face Lift $849.00", website_platform: "7896", c_date: "23 November 2023", p_date: "08 December 2023" },
        { status: "02", service_details: "Face Lift $849.00", website_platform: "7896", c_date: "23 November 2023", p_date: "08 December 2023" },
        // Add more rows as needed
    ];
    const handleProductChange = (selectedOption: any, rowValue: any) => {
        productOptions.map((proItem: any) => {
            if (proItem.value == selectedOption?.target.value && rowValue) { // Ensure 'value' is the correct field to compare
                let product = products.find((item: any) => item.value == selectedOption?.target.value);
                console.log('this', product)
                setSelectedProducts((prev: any) => ({
                    ...prev,
                    [rowValue]: product
                }));
                setValue(`products.${rowValue}.productName`, product.name)
                setValue(`products.${rowValue}.regularPrice`, parseInt(product.price))
                setValue(`products.${rowValue}.productId`, Number(product.value))
                setValue(`products.${rowValue}.netAmount`, getValues(`products.${rowValue}.regularPrice`) * getValues(`products.${rowValue}.qty`))
                return proItem
            }
        });
        const updatedRows = productRows?.map((row: any) => {
            if (row.no === rowValue) {
                return { ...row, ProductId: selectedOption.value, ProductName: selectedOption.label, regularPrice: selectedOption.price };
            }
            return row;
        });
        setProductRows(updatedRows)

    };

    const checkInstallmentTotal = () => {
        let installmentTotal = 0;
        paymentrows.forEach((row: any) => {
            const installment = getValues(`payments.${row.no}.totalAmount`) || 0;
            installmentTotal += installment;
        });
    };

    const setTotalAmount = () => {
        let totalNetAmount = 0;
        let totalProducts = 0;
        productRows.forEach((row: any) => {
            const netAmount = getValues(`products.${row.no}.netAmount`) || 0;
            const productsQty = Number(getValues(`products.${row.no}.qty`).toString()) || 0;
            totalNetAmount += netAmount
            totalProducts += productsQty
            setValue(`products.${row.no}.totalAmount`, totalNetAmount || 0);
        });
        setValue('cartNetAmount', totalNetAmount)
        setValue('cartTotal', totalNetAmount)
        setValue('cartProductsCount', totalProducts)
        trigger('cartNetAmount');
    }

    const onSubmit = async (allData: CartData) => {
        allData.customerId = Number(id);
        try {

            let locationData = await getLocationData();
            locationData.customer_id = Number(id);
            locationData.location_of = "cart";

            const filteredProducts = Object.values(allData.products)
                .map((product: any) => {
                    return {
                        ...product,
                        promotionDiscount: 11,
                        memberDiscount: 1,
                        qty: Number(product.qty)
                    };
                });

            const filteredPayments = Object.values(allData.payments)
                .map((payment: any) => {
                    return {
                        ...payment,
                        totalAmount: Number(payment.totalAmount),
                    };
                });

            const formattedData = {
                ...allData,
                promotionCode: 'ahds',
                totalDiscount: 10,
                products: filteredProducts,
                payments: filteredPayments,
            };

            const apiMethod = id && cartId ? service.Methods.PUT : service.Methods.POST;
            const url = id && cartId ? service.API_URL.cart.update : service.API_URL.cart.create;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                params: cartId ? { id, cartId } : '',
                body: { ...formattedData, locationData },
                showAlert: true,
            });

            history(-1)
        } catch (error) {
            console.log(error);
        }

    }

    const handlePlaceOrder = async (data: CartData) => {
        try {
            let orderData: any = {};
            orderData.customer_id = Number(id);
            orderData.cart_Total = data.cartTotal;
            orderData.cart_products_count = data.cartProductsCount;
            orderData.total = data.cartNetAmount;
            orderData.cart_net_amount = data.cartNetAmount;
            orderData.promotion_code = data.promotionCode;
            orderData.total_discount = data.totalDiscount;
            orderData.record_type = "Paid Order";
            orderData.is_member = "Yes";
            orderData.order_type = "New_Order";
            orderData.company_id = 1;
            orderData.organization_id = 1;
            data.products.shift();
            data.payments.shift();
            orderData.products = data.products?.map(product => {
                if (product) {
                    return {
                        product_id: product.productId,
                        product_name: product.productName,
                        regular_price: product.regularPrice,
                        member_price: product.memberPrice,
                        quantity: product.qty,
                        promotion_discount: product.promotionDiscount,
                        member_discount: product.memberDiscount,
                        total_amount: product.totalAmount,
                        website_url: product.websiteUrl,
                        status_updated_by: 1
                    }
                }
            });

            orderData.payments = data.payments?.map(payment => {
                return {
                    payment_date: payment.paymentExpectedDate,
                    payment_installment_label: payment.paymentInstallmentLabel,
                    amount: Number(payment.totalAmount),
                    payment_status: 1
                }
            })

            let locationData = await getLocationData();
            locationData.customer_id = Number(id);
            locationData.location_of = "order";

            await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.order.create,
                body: { ...orderData, locationData },
                params: cartId,
                showAlert: true,
            });

            history(-1)
        } catch (error) {
            console.log(errors)
        }
    }

    const handleApplyPromo = () => {
        try {

        } catch (error) {
            console.log(errors)
        }
    }

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <MDBox mb={5} >
                        <Card >

                            <MDBox
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center">

                                <MDTypography ml={3} mt={3} >Cart Item</MDTypography>

                                <MDButton onClick={handleSubmit(onSubmit)} variant="gradient" color="info">
                                    <Icon fontSize='large'>save</Icon>Save Cart&nbsp;
                                </MDButton>

                                <MDButton
                                    variant="gradient"
                                    color="info"
                                    style={{ marginLeft: '10px' }}
                                    onClick={handlepastorderModal} // Trigger modal on button click
                                >
                                    From Past Order
                                </MDButton>
                                <MDButton
                                    variant="gradient"
                                    color="warning"
                                    style={{ marginLeft: '10px' }}
                                    onClick={handleconvertopportunityModal} // Trigger modal on button click
                                >
                                    <ShoppingCartOutlinedIcon />
                                    Convert Opportunity
                                </MDButton>

                            </MDBox>

                            <Modal
                                open={pastorderModal}
                                onClose={handleModalClose}
                                closeAfterTransition>
                                <Fade in={pastorderModal}>
                                    <Card style={{ maxWidth: '70%', margin: '200px auto', padding: '30px' }}>
                                        <MDBox p={3}>
                                            <MDTypography variant="h6"> From Past Order</MDTypography>

                                            <DataTable table={{ columns: pastOrder, rows: apiPastOrder }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                            <MDButton variant="gradient" color="error" onClick={handleModalClose}>
                                                Cancel
                                            </MDButton>
                                        </MDBox>
                                    </Card>
                                </Fade>
                            </Modal>
                            <Modal
                                open={convertopportunityModal}
                                onClose={handleModalClose}
                                closeAfterTransition>
                                <Fade in={convertopportunityModal}>
                                    <Card style={{ maxWidth: '70%', margin: '200px auto', padding: '30px' }}>
                                        <MDBox p={3}>
                                            <MDTypography variant="h6">Convert Opportunity</MDTypography>

                                            <DataTable table={{ columns: convertopportunity, rows: convertopportunityrow }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                                            <MDButton variant="gradient" color="error" onClick={handleModalClose}>
                                                Cancel
                                            </MDButton>
                                        </MDBox>


                                    </Card>
                                </Fade>
                            </Modal>
                            <DataTable table={{ columns, rows: productRows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                            <div className='div'>
                                <div style={{ display: 'flex', alignItems: 'center', width: '71%', marginLeft: '50px' }}>
                                    <MDInput inputLabelProps={{ shrink: true }} style={{ marginRight: '10px' }}></MDInput>
                                    <MDButton variant="gradient" color="success" onClick={handleApplyPromo}>Apply</MDButton>
                                </div>
                                <div style={{ marginRight: '10px', width: '7%', marginLeft: '10px' }}>Total:</div>
                                <div >{getValues(`cartNetAmount`) || 0}</div>
                            </div>
                        </Card>
                    </MDBox>
                    <MDBox mb={5} >
                        <Card >

                            <MDTypography ml={3} mt={3}>Payment Details</MDTypography>

                            <DataTable table={{ columns: payment, rows: paymentrows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />

                            <div className='div'>
                                <div style={{ display: 'flex', alignItems: 'center', width: '71%', marginLeft: '20%' }}>
                                    <div >Total Part Amount:</div>
                                    <div style={{ marginRight: ' 10px', width: '7%', marginLeft: '10%' }}>{getValues(`cartNetAmount`) || 0}</div>
                                </div>
                            </div>
                        </Card>
                    </MDBox>

                    <MDBox pt={3} ml={3} pb={2}>
                        {
                            placeOrder &&
                            <ConfirmModal message="Do you want to place order ?" visible={placeOrder} handleFunction={handleSubmit(handlePlaceOrder)} closeModal={() => setPlaceOrder(false)} />
                        }
                        <MDButton variant="gradient" onClick={handleSubmit(onSubmit)} color="info">Save Cart</MDButton>
                        <MDButton variant="gradient" color="dark" style={{ marginLeft: '10px' }} onClick={() => setPlaceOrder(true)}>Place Order</MDButton>
                    </MDBox>

                </MDBox >
                <Footer />
            </DashboardLayout >


        </>
    )
}

export default Cartitem;


