import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://shohsulton.uz/webappbot/api/orders');
                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mt-5">
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4 backbutton">
                        <h1 className="titlecha">Orders:</h1>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>User Telegram ID</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.order_user_id.user_telegram_id}</td>
                                    <td>{order.order_product_id.product_name}</td>
                                    <td>
                                        <img
                                            src={`https://shohsulton.uz/webappbot/api/images/${order.order_product_id.product_image}`}
                                            alt={order.order_product_id.product_name}
                                            className="img-fluid"
                                            style={{ maxWidth: '100px' }}
                                        />
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Index;
