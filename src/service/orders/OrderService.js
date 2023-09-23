import axios from 'axios'

export class OrderService {

    getOrders(params) {
        return axios.get('https://store-backend-ty8d.onrender.com/api/v1/orders', {
            params: {
                page: params.first / 2,
                size: params.rows
            }
        }).then(res => res.data).catch(error => {
            console.error('There was an error!', error);
        });
    }

    getOrderById(orderId) {
        return axios.get('https://store-backend-ty8d.onrender.com/api/v1/orders/' + orderId)
            .then(res => res.data).catch(error => {
            console.error('There was an error!', error);
        });
    }


    saveOrder(order) {
        console.log("[OrderService] - Save Order Request Data", order)
        return axios.post('https://store-backend-ty8d.onrender.com/api/v1/orders', order)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    updateOrder(order, orderId) {
        console.log("[OrderService] - Update Order By OrderId: ", orderId)
        return axios.put('https://store-backend-ty8d.onrender.com/api/v1/orders/' + orderId, order)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    deleteOrder(selectedOrder) {
        console.log("[OrderService] - Delete Order By OrderId: ", selectedOrder.orderId)
        return axios.delete('https://store-backend-ty8d.onrender.com/api/v1/orders/' + selectedOrder.orderId)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

}
