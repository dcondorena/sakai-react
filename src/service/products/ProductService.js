import axios from 'axios'

export class ProductService {

    getCountries() {
        return axios.get('assets/demo/data/countries.json')
            .then(res => res.data.data);
    }

    getProducts(params) {
        return axios.get('https://morning-thicket-18297.herokuapp.com/api/v1/products', {
            params: {
                page: params.first / 2,
                size: params.rows
            }
        }).then(res => res.data);
    }

    saveProduct(product) {
        console.log("[ProductService] - Save Product Request Data", product)
        return axios.post('https://morning-thicket-18297.herokuapp.com/api/v1/products', product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    updateProduct(product, productId) {
        console.log("[ProductService] - Update Product By ProductId: ", productId)
        return axios.put('https://morning-thicket-18297.herokuapp.com/api/v1/products', product)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

}
