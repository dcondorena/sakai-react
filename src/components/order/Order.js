import React, {useState, useEffect} from 'react';
import {ProductService} from "../../service/products/ProductService";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {useForm, Controller} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {OrderService} from "../../service/orders/OrderService";
import {MultiSelect} from "primereact/multiselect";
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";

const Order = (props) => {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [orders, setOrders] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 2,
        page: 1
    });
    const [visibleRight, setVisibleRight] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    /**
     * Service
     * */
    const orderService = new OrderService();

    /**
     * Routing
     * */

    const history = useHistory();

    /**
     * Load Orders
     * */
    useEffect(() => {
        loadLazyData();
    }, [lazyParams]) // eslint-disable-line react-hooks/exhaustive-deps


    const loadLazyData = () => {
        setLoading(true);
        orderService.getOrders(lazyParams).then(data => {
            console.log("[OrderComponent] - Result Order Request: ", data);
            setTotalRecords(data.totalItems);
            setOrders(data.orders);
            setLoading(false);
        });

    }
    /**
     * Change OrderPage
     * */
    const onPage = (event) => {
        console.log("[OrderComponent] - Change Page DataTable: ", event);
        setLazyParams(event);
    }

    /**
     * Options DataTable
     * */
    const representativeBodyTemplate = (rowData) => {
        /**
         * Update order
         * */
        const selectedData = (event) => {
            console.log("[OrderComponent] - Selected Data: ", rowData)
            setSelectedOrder(rowData)
            history.push({pathname: '/orderDetail', state: {rowData}})
        }

        /**
         * Delete order
         * */

        const onDelete = (event) => {
            console.log("[OrderComponent] - Selected Data: ", rowData)
            orderService.deleteOrder(rowData).then(data => {
                console.log("[OrderComponent]:  Result Delete Order Request: ", data);
                reset();
                setSelectedOrder(null);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Task done',
                    showConfirmButton: false,
                    timer: 1500
                })
                setLazyParams({
                    first: 0,
                    rows: 2,
                    page: 1
                })
            });
        }

        return (
            <React.Fragment>
                <div className="grid">
                    <div className="col-6">
                        <Button label="Detail" className="p-button-raised p-button-rounded p-button-warning" onClick={selectedData}/>
                    </div>
                    <div className="col-6">
                        <Button label="Delete" className="p-button-raised p-button-rounded p-button-danger" onClick={onDelete}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    /**
     * Amounts DataTable
     * */
    const totalAmountTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.totalAmount} $
            </React.Fragment>
        );
    }

    /**
     * Create Order
     */
    const createOrder = (event) => {
        loadProducts();
        reset()
        setSelectedOrder(null);
        setVisibleRight(true);
    }

    const defaultValues = {
        customer: '',
        items: []
    }

    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});
    const [formData, setFormData] = useState({});

    const onSubmit = (data) => {
        setFormData(data);
        console.log("[OrderComponent] - Form Data: ", data);
        orderService.saveOrder(data).then(data => {
            console.log("[OrderComponent]:  Result Save Order Request: ", data);
            reset();
            setVisibleRight(false);
            setSelectedOrder(null);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Task done',
                showConfirmButton: false,
                timer: 1500
            })
            setLazyParams({
                first: 0,
                rows: 2,
                page: 1
            })
        });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onCancel = () => {
        reset()
        setVisibleRight(false);
    }

    /**
     * Load Products
     * */
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const productService = new ProductService();

    const loadProducts = () => {
        setLoadingProducts(true);
        productService.getProducts({
            first: 0,
            rows: 1000
        }).then(data => {
            console.log("[OrderComponent] - Result Product Request: ", data);
            setProducts(data.products);
            setLoadingProducts(false);
        });

    }


    /**
     * View
     * */

    return (
        <div className="grid p-fluid">
            <div className="col">
                <div className="card">
                    <div className="grid">
                        <div className="col-12">
                            <h3>Orders</h3>
                        </div>

                        <div className="col-3 col-offset-9">
                            <Button label="Create Order" className="p-button-raised p-button-rounded p-button-success" onClick={createOrder}/>
                        </div>
                        <div className="col-12">
                            <DataTable value={orders} lazy responsiveLayout="scroll" dataKey="id"
                                       paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords} onPage={onPage}
                                       loading={loading}
                            >
                                <Column field="orderNumber" header="N°"/>
                                <Column field="customer" header="Consumer"/>
                                <Column field="status" header="Status"/>
                                <Column field="registerDate" header="Date"/>
                                <Column field="totalAmount" header="Total" body={totalAmountTemplate}/>
                                <Column field="actions" header="Actions" body={representativeBodyTemplate}/>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar visible={visibleRight} position="right" style={{width: '35em'}} onHide={onCancel}>
                <div className="grid p-fluid">
                    <div className="col">
                        <div className="card">
                            <h3>Order</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid" style={{paddingTop: '40px'}}>
                                    <div className="col-3"><b>Customer: </b></div>
                                    <div className="col-9">
                                        {/*<InputText style={{width: '100%'}} name="name" {...register("name", {required: true, maxLength: 20})} />*/}
                                        {/*{errors.name?.type === 'required' && "Name is required"}*/}
                                        <div className="field">
                                            <Controller name="customer" control={control} rules={{required: 'Customer is required.'}} render={({field}) => (
                                                <InputText id={field.name} {...field} autoFocus/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('customer')}
                                        </div>
                                    </div>

                                    <div className="col-3"><b>Products: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="items" rules={{required: 'Items is required.'}} control={control} render={({field}) => (
                                                <MultiSelect filter id={field.name} value={field.value} options={products} onChange={(e) => field.onChange(e.value)} optionLabel="name" placeholder="Select Items" maxSelectedLabels={3}/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('items')}
                                        </div>

                                    </div>

                                    <div className="col-4" style={{paddingTop: '40px'}}>
                                        <Button label="Save" className="p-button-raised p-button-rounded" style={{width: '100%'}} type="submit"/>
                                    </div>
                                    <div className="col-4 col-offset-4" style={{paddingTop: '40px'}}>
                                        <Button label="Cancel" className="p-button-raised p-button-rounded" style={{width: '100%'}} onClick={onCancel}/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Order, comparisonFn);
