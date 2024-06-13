import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://botproject.uz/webappbot/api/products/${productId}`);
                setProduct(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://botproject.uz/webappbot/api/categories/all');
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [productId]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://botproject.uz/webappbot/api/products/${productId}`);
            toast.success('Product successfully deleted!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!product) {
            toast.info('No changes to update');
            return;
        }

        const formData = new FormData();
        formData.append('product_id', productId);

        formData.append('product_name', product.product_name);
        formData.append('product_description', product.product_description);
        formData.append('product_price', String(product.product_price));
        formData.append('product_category', product.product_category);

        if (product.product_image) {
            formData.append('product_image', product.product_image);
        }

        try {
            await axios.put(`http://botproject.uz/webappbot/api/products/update/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Product successfully updated!');
            setTimeout(() => {
                navigate("/")
            }, 700);
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;

        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: newValue
        }));
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4 backbutton">
                <h2 className="mb-4">Product Details</h2>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
            </div>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    {product.product_image && (
                        <img src={`http://botproject.uz/webappbot/api/images/${product.product_image}`} className="card-img-top img-fluid product-image" alt={product.product_name} />
                    )}
                    <input
                        type="file"
                        className="form-control"
                        id="productImage"
                        name="product_image"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="product_name"
                        value={product.product_name}
                        onChange={handleChange}
                        required
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
                        required
                    ></textarea>
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
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productCategory" className="form-label">Product Category</label>
                    <select
                        className="form-select"
                        id="productCategory"
                        name="product_category"
                        value={product.product_category}
                        onChange={handleChange}
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
                <button type="submit" className="btn btn-primary">Update Product</button>
                <button type="button" className="btn btn-danger ms-2 w-100 mt-2" onClick={handleDelete}>Delete Product</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProductDetail;
