import axios from 'axios'

export class ProductService {

    getProducts(params) {
        return axios.get('https://store-backend-ty8d.onrender.com/api/v1/products', {
            params: {
                page: params.first / 2,
                size: params.rows
            }
        }).then(res => res.data).catch(error => {
            console.error('There was an error!', error);
        });
    }

    saveProduct(product) {
        console.log("[ProductService] - Save Product Request Data", product)
        return axios.post('https://store-backend-ty8d.onrender.com/api/v1/products', product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    updateProduct(product, selectedProduct) {
        console.log("[ProductService] - Update Product By ProductId: ", selectedProduct.productId, product)
        return axios.put('https://store-backend-ty8d.onrender.com/api/v1/products/' + selectedProduct.productId, product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    deleteProduct(selectedProduct) {
        console.log("[ProductService] - Delete Product By ProductId: ", selectedProduct.productId)
        return axios.delete('https://store-backend-ty8d.onrender.com/api/v1/products/' + selectedProduct.productId)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

}
