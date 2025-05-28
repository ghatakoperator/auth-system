import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import configData from '../config/index.json';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        age: '',
        dob: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const expressURL = configData.express_url;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Live validation effects
    useEffect(() => {
        if (formData.email && !emailRegex.test(formData.email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }
    }, [formData.email]);

    useEffect(() => {
        if (formData.password && formData.password.length < 6) {
            setErrors((prev) => ({ ...prev, password: 'Password should be at least 6 characters' }));
        } else {
            setErrors((prev) => ({ ...prev, password: '' }));
        }
    }, [formData.password]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
            setImageFile(file);
        } else {
            setImageFile(null);
            MySwal.fire({ icon: 'error', title: 'Error', text: 'Please upload a PNG or JPG image' });
        }
    };

    const isSubmitDisabled = () => {
        const { name, email, password, company, age, dob } = formData;
        return (
            !name ||
            !email ||
            !password ||
            !company ||
            !age ||
            !dob ||
            !imageFile ||
            errors.email ||
            errors.password
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.email || errors.password) return;
        setIsLoading(true);

        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, val]) => payload.append(key, val));
            payload.append('image', imageFile);

            const response = await axios.post(
                `${expressURL}/user/create`,
                payload,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 201) {
                await MySwal.fire({
                    icon: 'success',
                    title: 'User Created',
                    text: 'Your account has been created successfully.',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                });
                navigate('/');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            await MySwal.fire({ icon: 'error', title: 'Error', text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="full-page-wrapper">
            <div className="login-page">
                <div className="login-container container-fluid" style={{ minHeight: '100vh' }}>
                    <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                        <div className="col-md-8 col-lg-6 px-3">
                            <div className="right-panel shadow-sm" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                                <h6 className="c-black text-center mb-4">REGISTER</h6>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="login-form p-4">

                                        {/* Name */}
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Name <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </Form.Group>

                                        {/* Email */}
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email ID <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter Email ID"
                                                isInvalid={!!errors.email}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid" className="text-start">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Password */}
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Password <span className="c-red">*</span></Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Password"
                                                    isInvalid={!!errors.password}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid" className="text-start">
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            </div>
                                        </Form.Group>

                                        {/* Company */}
                                        <Form.Group className="mb-3" controlId="company">
                                            <Form.Label>Company Name <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                placeholder="Enter Company Name"
                                                required
                                            />
                                        </Form.Group>

                                        {/* Age */}
                                        <Form.Group className="mb-3" controlId="age">
                                            <Form.Label>Age <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                placeholder="Enter Age"
                                                min="0"
                                                required
                                            />
                                        </Form.Group>

                                        {/* DOB */}
                                        <Form.Group className="mb-3" controlId="dob">
                                            <Form.Label>Date of Birth <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>

                                        {/* Image Upload */}
                                        <Form.Group className="mb-3" controlId="image">
                                            <Form.Label>Upload Image <span className="c-red">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </Form.Group>

                                        <button
                                            type="submit"
                                            className="btn primary-btn w-100 mt-3"
                                            disabled={isSubmitDisabled() || isLoading}
                                        >
                                            {isLoading ? 'Submitting...' : 'Register'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;