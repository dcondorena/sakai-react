import axios from 'axios'

export class OrderService {
    isProduction = false
    test = 'http://localhost:3300/api/v1'
    prod = 'https://store-backend-ty8d.onrender.com/api/v1'
    host = this.isProduction ? this.prod : this.test


    getOrders(params, globalFilterValue) {
        return axios.get(this.host + '/orders', {
            params: {
                page: params.first / 2,
                size: params.rows,
                orderNumber: globalFilterValue
            }
        }).then(res => res.data).catch(error => {
            console.error('There was an error!', error);
        });
    }

    getOrderById(orderId) {
        return axios.get(this.host + '/orders/' + orderId)
            .then(res => res.data).catch(error => {
                console.error('There was an error!', error);
            });
    }


    saveOrder(order) {
        console.log("[OrderService] - Save Order Request Data", order)
        return axios.post(this.host + '/orders', order)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    updateOrder(order, orderId) {
        console.log("[OrderService] - Update Order By OrderId: ", orderId)
        return axios.put(this.host + '/orders/' + orderId, order)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    deleteOrder(selectedOrder) {
        console.log("[OrderService] - Delete Order By OrderId: ", selectedOrder.orderId)
        return axios.delete(this.host + '/orders/' + selectedOrder.orderId)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

}
