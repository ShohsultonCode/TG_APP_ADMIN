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
                const response = await fetch('http://localhost:7002/api/orders');
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
                    <div className="d-flex justify-content-between"> 
                        <h3 className="titlecha">Orders:</h3>
                        <button type="button" className="btn btn-black/" onClick={() => navigate('/')}>Back</button>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>User Telegram ID</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order?._id}>
                                    <td>{order?.order_user_id?.user_telegram_id}</td>
                                    <td>{order?.order_product_id?.product_name}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:7002/api/images/${order?.order_product_id?.product_image}`}
                                            alt={order?.order_product_id?.product_name}
                                            className="card-img-top img-fluid product-image"
                                            style={{ maxWidth: '100px' }}
                                        />
                                    </td>
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
