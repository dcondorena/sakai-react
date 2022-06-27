import React, {useEffect, useState} from 'react';

import {Button} from "primereact/button";
import {useHistory, useLocation} from "react-router-dom";
import {OrderService} from "../../service/orders/OrderService";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputNumber} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";
import {Sidebar} from "primereact/sidebar";
import {Controller, useForm} from "react-hook-form";
import {MultiSelect} from "primereact/multiselect";
import {ProductService} from "../../service/products/ProductService";
import Swal from "sweetalert2";


const OrderDetail = (props) => {
    const history = useHistory();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const orderService = new OrderService();
    const [products, setProducts] = useState(null);


    const goBack = () => {
        console.log(location.state.rowData);
        history.push('/orders')
    }

    useEffect(() => {
        loadOrder();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const loadOrder = () => {
        if (!location.state) {
            history.push('/orders')
        } else {
            orderService.getOrderById(location.state?.rowData.orderId).then(data => {
                console.log("[OrderDetailComponent] - Result Order By OrderId Request: ", data);
                setOrder(data);
                setProducts(data.items)
            });
        }
    }

    const onRowEditComplete = (e) => {
        console.log("[OrderDetailComponent] - OnRowEditComplete: ", e);
        let _products = [...products];
        let {newData, index} = e;
        _products[index] = newData;
        setProducts(_products)
        orderService.updateOrder({items: _products, status: order?.status}, order?.orderId).then(data => {
            console.log("[OrderDetailComponent] - Result Update Order By OrderId Request: ", data);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Updated order',
                showConfirmButton: false,
                timer: 1500
            })
            loadOrder();
        });
    }
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    }

    const numberEditor = (options) => {

        return <InputNumber inputId="integeronly" value={options.value} onValueChange={(e) => options.editorCallback(e.target.value)}/>
        // return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    }

    const statusTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.active ? <div>Active</div> : <div>Inactive</div>}
            </React.Fragment>
        );
    }

    const changeOrderStatus = (orderStatus) => {
        orderService.updateOrder({items: order?.items, status: orderStatus}, order?.orderId).then(data => {
            console.log("[OrderDetailComponent] - Result Update Order By OrderId Request: ", data);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Updated order',
                showConfirmButton: false,
                timer: 1500
            })
            loadOrder();
        });
    }
    /**
     * Add Item
     */

    const [visibleRight, setVisibleRight] = useState(false);

    const defaultValues = {
        items: []
    }

    const {control, formState: {errors}, handleSubmit, reset} = useForm({defaultValues});
    const [setFormData] = useState({});

    const onSubmit = (data) => {
        setFormData(data);
        console.log("[OrderComponent] - Form Data: ", data.items);

        if (submitted) {
            for (let item of data.items) {
                products.push(item)
            }
            console.log("[OrderComponent] - Final Items: ", products);
            orderService.updateOrder({items: products, status: order?.status}, order?.orderId).then(data => {
                console.log("[OrderDetailComponent] - Result Update Order By OrderId Request: ", data);
                reset();
                setVisibleRight(false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Updated order',
                    showConfirmButton: false,
                    timer: 1500
                })
                loadOrder();
            });
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onCancel = () => {
        setSubmitted(false);
        reset()
        setVisibleRight(false);
    }
    /**
     * Load Items
     * */
    const [items, setItems] = useState([]);
    const [setLoadingItems] = useState(false);
    const productService = new ProductService();
    const [submitted, setSubmitted] = useState(null);

    const loadProducts = () => {
        setLoadingItems(true);
        productService.getProducts({
            first: 0,
            rows: 100
        }).then(data => {
            console.log("[OrderDetailComponent] - Result Product Request: ", data);
            reset()
            setItems(data.products);
            setLoadingItems(false);
            setVisibleRight(true);
        });

    }

    const addItem = () => {
        loadProducts();
    }


    return (
        <div className="grid p-fluid">
            <div className="col">
                <div className="card">
                    <div className="grid">
                        <div className="col-4 col-offset-4">
                            <h3>Order Detail</h3>
                        </div>
                        <div className="col-4">
                            <Button label="Go Back" className="p-button-raised p-button-rounded p-button-success" onClick={goBack}/>
                        </div>
                        <div className="col-12">
                            <h2>Order N° {order?.orderNumber}</h2>

                        </div>
                        <div className="col-12">
                            <b>Customer: </b> {order?.customer}
                        </div>
                        <div className="col-12">
                            <b>Status: </b> {order?.status}
                        </div>
                        <div className="col-12">
                            <b>Date: </b> {order?.registerDate}
                        </div>
                        <div className="col-3 col-offset-9">
                            <Button label="Add" className="p-button-raised p-button-rounded p-button-info" onClick={() => addItem()}/>
                        </div>
                        <div className="col-12">
                            <DataTable value={products} editMode="row" dataKey="productId" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll">
                                <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{width: '20%'}}/>
                                <Column field="category" header="Category"/>
                                <Column field="unitPrice" header="Unit Price" editor={(options) => numberEditor(options)} style={{width: '20%'}}/>
                                <Column field="active" header="Status" body={statusTemplate}/>
                                <Column rowEditor headerStyle={{width: '10%', minWidth: '8rem'}} bodyStyle={{textAlign: 'center'}}/>
                            </DataTable>
                        </div>
                        <div className="col-4 col-offset-7">
                            <h5>Subtotal: {order?.subtotal} $</h5>
                        </div>
                        <div className="col-4 col-offset-7">
                            <h5>Taxes:</h5>
                        </div>
                        <div className="col-3 col-offset-8">
                            <h6>Total City Tax: {order?.cityTaxAmount} $</h6>
                        </div>
                        <div className="col-3 col-offset-8">
                            <h6>Total County Tax: {order?.countyTaxAmount} $</h6>
                        </div>
                        <div className="col-3 col-offset-8">
                            <h6>Total State Tax: {order?.stateTaxAmount} $</h6>
                        </div>
                        <div className="col-3 col-offset-8">
                            <h6>Total Federal Tax: {order?.federalTaxAmount} $</h6>
                        </div>
                        <div className="col-4 col-offset-7">
                            <h5>Total Taxes: {order?.totalTaxesAmount} $</h5>
                        </div>
                        <div className="col-4 col-offset-7">
                            <h5>Total: {order?.totalAmount} $</h5>
                        </div>

                        <div className="col-6 col-offset-6">
                            <div className="grid">
                                <div className="col-6">
                                    <Button label="Complete Order" className="p-button-raised p-button-rounded p-button-success" onClick={() => changeOrderStatus('Completed')}/>
                                </div>
                                <div className="col-6">
                                    <Button label="Reject Order" className="p-button-raised p-button-rounded p-button-danger" onClick={() => changeOrderStatus('Rejected')}/>
                                </div>
                            </div>
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
                                    <div className="col-3"><b>Products: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="items" rules={{required: 'Items is required.'}} control={control} render={({field}) => (
                                                <MultiSelect filter id={field.name} value={field.value} options={items} onChange={(e) => field.onChange(e.value)} optionLabel="name" placeholder="Select Items" maxSelectedLabels={3}/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('items')}
                                        </div>

                                    </div>

                                    <div className="col-4" style={{paddingTop: '40px'}}>
                                        <Button label="Save" className="p-button-raised p-button-rounded" style={{width: '100%'}} type="submit" onClick={() => {
                                            setSubmitted(true);
                                        }}/>
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

export default React.memo(OrderDetail, comparisonFn);
