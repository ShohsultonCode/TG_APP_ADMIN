import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productCounts, setProductCounts] = useState({});
    const [telegramUserId, setTelegramUserId] = useState(localStorage.getItem('telegramUserId'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectedProducts = async () => {
            try {
                const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
                console.log(selectedProducts);
                if (selectedProducts.length === 0) {
                    setLoading(false);
                    return;
                }

                const productIds = selectedProducts.map(item => item.productId);
                const response = await fetch('https://shohsulton.uz/webappbot/api/products/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productIds)
                });
                const data = await response.json();
                if (response.ok) {
                    setProducts(data.data);
                    const counts = {};
                    selectedProducts.forEach(item => {
                        counts[item.productId] = item.count;
                    });
                    setProductCounts(counts);
                    setLoading(false);
                } else {
                    toast.error(data.message || 'Failed to fetch product details');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchSelectedProducts();

        // Clear localStorage when the app is closed
        window.addEventListener('beforeunload', () => {
            localStorage.clear();
        });
    }, []);

    const handlePay = async () => {
        try {
            const orderData = products.map((product) => ({
                order_telegram_id: telegramUserId,
                order_product_id: product._id,
                order_count: productCounts[product._id]
            }));
            console.log(orderData);
            const response = await fetch('https://shohsulton.uz/webappbot/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Order placed successfully!');
                localStorage.removeItem('selectedProducts');
                setTimeout(() => {
                    navigate('/');
                }, 800);
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        }
    };

    const handleBack = () => {
        localStorage.removeItem('selectedProducts');
        navigate("/");
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-4">Product Details</h3>
                <button type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Count</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.product_name}</td>
                            <td>
                                <img
                                    src={`https://shohsulton.uz/webappbot/api/images/${product.product_image}`}
                                    className="img-fluid"
                                    alt={product.product_name}
                                    style={{ height: "100px", width: "100px", objectFit: "cover" }}
                                />
                            </td>
                            <td>{productCounts[product._id] || 1}</td>
                            <td>${product.product_price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary w-100 paycha" onClick={handlePay}>Pay</button>
            <ToastContainer />
        </div>
    );
};

export default Index;
