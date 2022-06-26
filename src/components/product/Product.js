import React, {useState, useEffect, useRef} from 'react';
import {ProductService} from "../../service/products/ProductService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";


const Product = (props) => {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1
    });
    const [visibleRight, setVisibleRight] = useState(false);

    const productService = new ProductService();

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]) // eslint-disable-line react-hooks/exhaustive-deps


    const loadLazyData = () => {
        setLoading(true);

        productService.getProducts({lazyEvent: JSON.stringify(lazyParams)}).then(data => {
            console.log("[ProductComponent]:  Result Product Request: ", data);
            setTotalRecords(data.totalItems);
            setProducts(data.products);
            setLoading(false);
        });

    }

    const onPage = (event) => {
        setLazyParams(event);
    }

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedProducts(value);
        // setSelectAll(value.length === totalRecords);
    }

    const representativeBodyTemplate = (rowData) => {

        const selectedData = (event) => {
           console.log("[ProductComponent]: Selected Data: ", rowData )
        }

        return (
            <React.Fragment>
                <Button label="Show" className="p-button-raised p-button-rounded" onClick={selectedData} />
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


    return (
        <div className="grid p-fluid">
            <div className="col">
                <div className="card">
                    <div className="grid">
                        <div className="col-12">
                            <label>Productos</label>
                        </div>

                        <div className="col-3 col-offset-9">
                            <Button label="Create Product" className="p-button-raised p-button-rounded" onClick={createProduct} />
                        </div>
                        <div className="col-12">
                            <DataTable value={products} lazy responsiveLayout="scroll" dataKey="id"
                                       paginator first={lazyParams.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                                       loading={loading}
                                       selection={selectedProducts} onSelectionChange={onSelectionChange}
                                        >
                                <Column field="name" header="Name"/>
                                <Column field="options" header="Options" body={representativeBodyTemplate} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <h3>Create Product</h3>
            </Sidebar>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Product, comparisonFn);
