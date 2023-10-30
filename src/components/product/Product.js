import React, {useState, useEffect} from 'react';
import {ProductService} from "../../service/products/ProductService";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {useForm, Controller} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch} from "primereact/inputswitch";
import {InputNumber} from "primereact/inputnumber";
import Swal from "sweetalert2";

const Product = (props) => {
    /**
     * Products
     * */
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const productService = new ProductService();

    /**
     * Sidebar
     * */
    const [visibleRight, setVisibleRight] = useState(false);

    /**
     * Load Products
     * */
    useEffect(() => {
        loadLazyData();
    }, [lazyParams]) // eslint-disable-line react-hooks/exhaustive-deps


    const loadLazyData = () => {
        setLoading(true);
        productService.getProducts(lazyParams).then(data => {
            console.log("[ProductComponent] - Result Product Request: ", data);
            setTotalRecords(data.totalItems);
            setProducts(data.products);
            setLoading(false);
        });

    }

    /**
     * Change Page DataTable
     * */
    const onPage = (event) => {
        console.log("[ProductComponent] - Change Page DataTable: ", event);
        setLazyParams(event);
    }

    /**
     * Change Selection DataTable
     * */

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedProducts(value);
        // setSelectAll(value.length === totalRecords);
    }


    /**
     * DataTable Options
     * */

    const representativeBodyTemplate = (rowData) => {
        /**
         * Update product
         * */
        const selectedData = (event) => {
            console.log("[ProductComponent] - Selected Data: ", rowData)
            reset();
            setSelectedProduct(rowData)
            setVisibleRight(true)
            setValue("name", rowData.name)
            setValue("category", rowData.category)
            setValue("unitPrice", rowData.unitPrice)
            setValue("active", rowData.active)
        }
        /**
         * Delete product
         * */

        const onDelete = (event) => {
            console.log("[ProductComponent] - Selected Data: ", rowData)
            productService.deleteProduct(rowData).then(data => {
                console.log("[ProductComponent]:  Result Delete Product Request: ", data);
                reset();
                setSelectedProduct(null);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Task done',
                    showConfirmButton: false,
                    timer: 1500
                })
                setLazyParams({
                    first: 0,
                    rows: 10,
                    page: 1
                })
            });
        }

        return (
            <React.Fragment>
                <div className="grid">
                    <div className="col-6">
                        <Button label="Editar" className="p-button-raised p-button-rounded p-button-warning" onClick={selectedData}/>
                    </div>
                    <div className="col-6">
                        <Button label="Borrar" className="p-button-raised p-button-rounded p-button-danger" onClick={onDelete}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    /**
     * Status Template DataTable
     * */

    const statusTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.active ? <div>Active</div> : <div>Inactive</div>}
            </React.Fragment>
        );
    }

    /**
     * Unit Price Template DataTable
     * */

    const unitPriceTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.unitPrice} bolivianos
            </React.Fragment>
        );
    }

    /**
     * Create Product
     */

    const createProduct = (event) => {
        reset()
        setSelectedProduct(null);
        setVisibleRight(true);
    }

    const defaultValues = {
        name: '',
        // category: null,
        // unitePrice: null,
        // active: null
    }
    const categoryList = [
        {label: 'Pantalones', value: 'Pantalones'},
        {label: 'Sudaderas', value: 'Sudaderas'},
        {label: 'Poleras', value: 'Poleras'}
       
    ];


    const {control, formState: {errors}, handleSubmit, reset, setValue} = useForm({defaultValues});
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(null);

    const onSubmit = (data) => {
        setFormData(data);
        console.log("[ProductComponent] - Form Data: ", data);
        if (submitted) {
            if (selectedProduct) {
                productService.updateProduct(data, selectedProduct).then(data => {
                    console.log("[ProductComponent]:  Result Update Product Request: ", data);
                    reset();
                    setVisibleRight(false);
                    setSelectedProduct(null);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Task done',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setLazyParams({
                        first: 0,
                        rows: 10,
                        page: 1
                    })
                });
            } else {
                productService.saveProduct(data).then(data => {
                    console.log("[ProductComponent]:  Result Save Product Request: ", data);
                    reset();
                    setVisibleRight(false);
                    setSelectedProduct(null);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Task done',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setLazyParams({
                        first: 0,
                        rows: 10,
                        page: 1
                    })
                });
            }
        }

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onCancel = () => {
        setSubmitted(false);
        setVisibleRight(false);
        reset()
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
                            <h3>Productos</h3>
                        </div>

                        <div className="col-3 col-offset-9">
                            <Button label="Crear Producto" className="p-button-raised p-button-rounded p-button-success" onClick={createProduct}/>
                        </div>
                        <div className="col-12">
                            <DataTable value={products} lazy responsiveLayout="scroll" dataKey="id"
                                       paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords} onPage={onPage}
                                       loading={loading}
                                       selection={selectedProducts} onSelectionChange={onSelectionChange}
                            >
                                <Column field="productNumber" header="N°" body={(data, props) =>
                                    <div className="grid">
                                        <div className="col-12">
                                            {props.rowIndex + 1}
                                        </div>
                                    </div>
                                }/>
                                <Column field="name" header="Nombre"/>
                                <Column field="category" header="Categoria"/>
                                <Column field="unitPrice" header="Precio Unitario" body={unitPriceTemplate}/>
                                <Column field="active" header="Estado" body={statusTemplate}/>
                                <Column field="options" header="Opciones" body={representativeBodyTemplate}/>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar visible={visibleRight} position="right" style={{width: '35em'}} onHide={onCancel}>
                <div className="grid p-fluid">
                    <div className="col">
                        <div className="card">
                            <h3>Product</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid" style={{paddingTop: '40px'}}>
                                    <div className="col-3"><b>Nombre: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="name" control={control} rules={{required: 'Name is required.'}} render={({field}) => (
                                                <InputText id={field.name} {...field} autoFocus/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('name')}
                                        </div>
                                    </div>

                                    <div className="col-3"><b>Categoria: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="category" rules={{required: 'Category is required.'}} control={control} render={({field}) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={categoryList} showClear={true}/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('category')}
                                        </div>

                                    </div>
                                    <div className="col-3"><b>Precio Unitario: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="unitPrice" rules={{required: 'Unit price is required.'}} control={control} render={({field}) => (
                                                <InputNumber inputId="integeronly" id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)}/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('unitPrice')}
                                        </div>

                                    </div>

                                    <div className="col-3"><b>Activo: </b></div>
                                    <div className="col-9">
                                        <div className="field">
                                            <Controller name="active" control={control} render={({field}) => (
                                                <InputSwitch id={field.name} checked={field.value} onChange={(e) => field.onChange(e.value)}/>
                                            )}/>
                                        </div>
                                        <div className="col-12">
                                            {getFormErrorMessage('active')}
                                        </div>

                                    </div>
                                    <div className="col-4" style={{paddingTop: '40px'}}>
                                        <Button label="Save" className="p-button-raised p-button-rounded" style={{width: '100%'}} onClick={() => {
                                            setSubmitted(true);
                                        }} type="submit"/>
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
    }
;

export default React.memo(Product, comparisonFn);
