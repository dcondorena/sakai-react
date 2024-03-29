import React from 'react';
import {Button} from 'primereact/button';
import {useHistory} from "react-router-dom";

const Home = (props) => {
    const history = useHistory();

    const routeComponent = (path) => {
        history.push('/' + path)
    }
    return (
        <div className="grid">
            <div className="col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ordenes/Pedidos       </span>
                            <div className="text-900 font-medium text-xl">
                                <Button label="Agregar" className="p-button-raised p-button-rounded" onClick={() => routeComponent('orders')}/>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Productos</span>
                            <div className="text-900 font-medium text-xl">
                                <Button label="Agregar" className="p-button-raised p-button-rounded" onClick={() => routeComponent('products')}/>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Home, comparisonFn);
