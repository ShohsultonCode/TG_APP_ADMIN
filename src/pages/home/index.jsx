import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("Unknown");
    const [lastName, setLastName] = useState("Unknown");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');

        if (userId) {
            setUserId(userId);
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch('https://shohsulton.uz/webappbot/api/products');
                const data = await response.json();
                setProducts(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`https://api.telegram.org/bot${YOUR_BOT_TOKEN}/getChat?chat_id=${userId}`);
                const data = await response.json();
                if (data && data.result) {
                    const { first_name, last_name } = data.result;
                    setFirstName(first_name || "Unknown");
                    setLastName(last_name || "Unknown");
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchProducts();
        if (userId) {
            fetchUserInfo();
        }
    }, [userId]);

    const handleDelete = async (productId) => {
        try {   
            await fetch(`https://shohsulton.uz/webappbot/api/products/${productId}`, {
                method: 'DELETE',
            });
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (productId) => {
        navigate(`/update/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="titlecha">Products:</h1>
                <button onClick={() => navigate("/add/product")} className='btn btn-outline-success'>Add Product</button>
            </div>
            <div>
                <h3>First Name: {firstName}</h3>
                <h3>Last Name: {lastName}</h3>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="row row-cols-2">
                    {products.map((product, index) => (
                        <div className="col-6 mb-4 rounded" key={index}>
                            <div className="card h-100" onClick={() => navigate(`/products/${product._id}`)}>
                                {product.product_image && (
                                    <img src={`https://shohsulton.uz/webappbot/api/images/${product.product_image}`} className="card-img-top img-fluid product-image" alt={product.product_name} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.product_name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Type: {product.product_category.category_name}</h6>
                                    <p className="card-text">Price: ${product.product_price.toFixed(2)}</p>
                                    <button className="btn btn-primary buttoncha">Order</button>
                                    {userId === '5171708849' && (
                                        <div className="mt-2">
                                            <button onClick={() => handleEdit(product._id)} className="btn btn-warning me-2">Edit</button>
                                            <button onClick={() => handleDelete(product._id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Index;
