import axios from 'axios'

export class ProductService {

    getCountries() {
        return axios.get('assets/demo/data/countries.json')
            .then(res => res.data.data);
    }
    getProducts(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        return fetch('https://morning-thicket-18297.herokuapp.com/api/v1/products?' + queryParams).then(res => res.json())
    }
}
