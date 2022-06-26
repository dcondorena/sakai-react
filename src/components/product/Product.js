import React, {useState, useEffect, useRef} from 'react';
import {ProductService} from "../../service/products/ProductService";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {useForm, Controller} from "react-hook-form";
import {classNames} from 'primereact/utils';
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch} from "primereact/inputswitch";
import {InputNumber} from "primereact/inputnumber";

const Product = (props) => {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 2,
        page: 1
    });
    const [visibleRight, setVisibleRight] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const productService = new ProductService();

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

    const onPage = (event) => {
        console.log("[ProductComponent] - Change Page Datable: ", event);
        setLazyParams(event);
    }

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedProducts(value);
        // setSelectAll(value.length === totalRecords);
    }

    const representativeBodyTemplate = (rowData) => {

        const selectedData = (event) => {
            console.log("[ProductComponent] - Selected Data: ", rowData)
            setSelectedProduct(rowData)
            setVisibleRight(true)
            setValue("name", "CAkess")
            setValue("category", "Cookies")
            setValue("unitPrice", 12)
            setValue("active", true)
        }

        return (
            <React.Fragment>
                <Button label="Edit" className="p-button-raised p-button-rounded" onClick={selectedData}/>
                {/*<img alt={rowData.representative.name} src={`images/avatar/${rowData.representative.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />*/}
                {/*<span className="image-text">{rowData.representative.name}</span>*/}
            </React.Fragment>
        );
    }


    const createProduct = (event) => {
        const value = event.value;
        setVisibleRight(true);
        // setSelectAll(value.length === totalRecords);
    }
    /**
     * Create Product
     */
    const defaultValues = {
        name: '',
        category: null
    }
    const categoryList = [
        {label: 'Cookies', value: 'Cookies'},
        {label: 'Candies', value: 'Candies'},
        {label: 'Cakes', value: 'Cakes'},
        {label: 'Desserts', value: 'Desserts'},
        {label: 'Drinks', value: 'Drinks'}
    ];


    const {control, formState: {errors}, handleSubmit, reset, setValue} = useForm({defaultValues});
    const [formData, setFormData] = useState({});

    const onSubmit = (data) => {
        setFormData(data);
        console.log("[ProductComponent] - Form Data: ", data);
        if (selectedProduct) {
            productService.saveProduct(data).then(data => {
                console.log("[ProductComponent]:  Result Save Product Request: ", data);
                reset();
                setVisibleRight(false);
                setSelectedProduct(null);
                setLazyParams({
                    first: 0,
                    rows: 2,
                    page: 1
                })
            });
        } else {
            productService.saveProduct(data).then(data => {
                console.log("[ProductComponent]:  Result Save Product Request: ", data);
                reset();
                setVisibleRight(false);
                setSelectedProduct(null);
                setLazyParams({
                    first: 0,
                    rows: 2,
                    page: 1
                })
            });
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };


    // const [submitted, setSubmitted] = useState();
    // const {register, handleSubmit, control, formState: {errors}} = useForm({
    //     // defaultValues: {
    //     //     category: []
    //     // }
    // });

    // const onSubmit = (data) => {
    //     setSubmitted(data);
    //     console.log("[ProductComponent] - Form Data: ", data);
    // };
    //
    //
    // const [selectedCategory, setCategory] = useState(null);
    //
    // const onCategoryChange = (e) => {
    //     setCategory(e.value);
    // }


    return (
        <div className="grid p-fluid">
            <div className="col">
                <div className="card">
                    <div className="grid">
                        <div className="col-12">
                            <label>Productos</label>
                        </div>

                        <div className="col-3 col-offset-9">
                            <Button label="Create Product" className="p-button-raised p-button-rounded" onClick={createProduct}/>
                        </div>
                        <div className="col-12">
                            <DataTable value={products} lazy responsiveLayout="scroll" dataKey="id"
                                       paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords} onPage={onPage}
                                       loading={loading}
                                       selection={selectedProducts} onSelectionChange={onSelectionChange}
                            >
                                <Column field="name" header="Name"/>
                                <Column field="options" header="Options" body={representativeBodyTemplate}/>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar visible={visibleRight} position="right" style={{width: '35em'}} onHide={() => setVisibleRight(false)}>
                <h3>Create Product</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid" style={{paddingTop: '40px'}}>
                        <div className="col-3"><b>Name: </b></div>
                        <div className="col-9">
                            {/*<InputText style={{width: '100%'}} name="name" {...register("name", {required: true, maxLength: 20})} />*/}
                            {/*{errors.name?.type === 'required' && "Name is required"}*/}
                            <div className="field">
                                <Controller name="name" control={control} rules={{required: 'Name is required.'}} render={({field, fieldState}) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({'p-invalid': fieldState.invalid})}/>
                                )}/>
                            </div>
                            <div className="col-12">
                                {getFormErrorMessage('name')}
                            </div>
                        </div>

                        <div className="col-3"><b>Category: </b></div>
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


                        <div className="col-3"><b>Unit price: </b></div>
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

                        <div className="col-3"><b>Active: </b></div>
                        <div className="col-9">
                            <div className="field">
                                <Controller name="active" rules={{required: 'Status is required.'}} control={control} render={({field}) => (
                                    <InputSwitch id={field.name} checked={field.value} onChange={(e) => field.onChange(e.value)}/>
                                )}/>
                            </div>
                            <div className="col-12">
                                {getFormErrorMessage('active')}
                            </div>

                        </div>


                        <div className="col-4" style={{paddingTop: '40px'}}>
                            <Button label="Save" className="p-button-raised p-button-rounded" style={{width: '100%'}} type="submit"/>
                        </div>
                        <div className="col-4 col-offset-4" style={{paddingTop: '40px'}}>
                            <Button label="Cancel" className="p-button-raised p-button-rounded" style={{width: '100%'}} onClick={() => {
                                setVisibleRight(false);
                            }}/>
                        </div>
                    </div>
                </form>
            </Sidebar>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Product, comparisonFn);
