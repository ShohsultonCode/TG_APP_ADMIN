import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://shohsulton.uz/webappbot/api/categories/all');
                setCategories(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('product_description', productDescription);
        formData.append('product_category', productCategory);
        formData.append('product_price', productPrice);
        formData.append('product_image', productImage);

        try {
            const response = await axios.post('https://shohsulton.uz/webappbot/api/products/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsSubmitted(true);
            toast.success('Product successfully created!');
            setTimeout(() => navigate('/'), 2000); // Redirect to home or product list page after 2 seconds
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Error creating product: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Create Product for Admin</h1>
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="form"
            >
                <div className="form-grid">
                    <div className="left-side">
                        <div className="mb-3">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productDescription" className="form-label">Product Description</label>
                            <textarea
                                className="form-control"
                                id="productDescription"
                                rows="3"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPrice" className="form-label">Product Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="productPrice"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="mb-3">
                            <label htmlFor="productCategory" className="form-label">Product Category</label>
                            <select
                                className="form-select"
                                id="productCategory"
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productImage" className="form-label">Product Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="productImage"
                                onChange={handleImageChange}
                                required
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </motion.form>
            <ToastContainer />
        </div>
    );
};

export default Index;
