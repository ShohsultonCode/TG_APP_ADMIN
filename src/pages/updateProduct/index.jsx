import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://shohsulton.uz/webappbot/api/products/${productId}`);
                setProduct(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            product_id: productId,
            ...(product.product_name && { product_name: product.product_name }),
            ...(product.product_description && { product_description: product.product_description }),
            ...(product.product_category && { product_category: product.product_category }),
            ...(product.product_price && { product_price: product.product_price }),
        };

        try {
            await axios.put('https://shohsulton.uz/webappbot/api/products', updatedData);
            toast.success('Product updated successfully!');
            setTimeout(() => navigate('/'), 2000); // Redirect to home or product list page after 2 seconds
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product.');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Update Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="product_name"
                        value={product.product_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">Product Description</label>
                    <textarea
                        className="form-control"
                        id="productDescription"
                        name="product_description"
                        rows="3"
                        value={product.product_description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="productCategory" className="form-label">Product Category</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productCategory"
                        name="product_category"
                        value={product.product_category}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productPrice" className="form-label">Product Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="productPrice"
                        name="product_price"
                        value={product.product_price}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
