import axios from 'axios'

export class ProductService {
    isProduction = false
    test = 'http://localhost:3300/api/v1'
    prod = this.host + ''
    host = this.isProduction ? this.prod : this.test

    getProducts(params) {
        return axios.get(this.host + '/products', {
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
        return axios.post(this.host + '/products', product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    updateProduct(product, selectedProduct) {
        console.log("[ProductService] - Update Product By ProductId: ", selectedProduct.productId, product)
        return axios.put(this.host + '/products/' + selectedProduct.productId, product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    deleteProduct(selectedProduct) {
        console.log("[ProductService] - Delete Product By ProductId: ", selectedProduct.productId)
        return axios.delete(this.host + '/products/' + selectedProduct.productId)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

}
