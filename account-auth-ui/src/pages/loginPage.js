import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import illustration from '../assets/images/login-illustration.png';
import { Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import configData from '../config/index.json';

function LoginPage() {
    const [emailError, setEmailError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [cookies, setCookie] = useCookies(['email']);

    const expressURL = configData.express_url;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const togglePasswordVisibility = () => setShowPassword((s) => !s);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email' && value && !emailRegex.test(value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isSubmitDisabled = () =>
        formData.email.trim() === '' || formData.password.trim().length < 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(formData.email)) {
            setEmailError('Invalid email format');
            return;
        }
        setEmailError('');
        setError('');

        try {
            const response = await axios.post(
                `${expressURL}user/verify`,
                { email: formData.email, password: formData.password }
            );

            if (response.data.statusCode === 200) {
                setCookie('email', formData.email, { path: '/', maxAge: 3600 });
                await MySwal.fire({
                    title: 'OTP Sent Successfully',
                    text: 'Please enter the OTP sent to your email.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                });
                navigate('/otp', { state: { email: formData.email } });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
            await MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="full-page-wrapper">
            <div className="login-page">
                <div className="login-container container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center px-5">
                            <div className="left-panel">
                                <h5 className="f-20 fw-bold">
                                    Secure Verification for a <br /> Brighter Future
                                </h5>
                                <img
                                    src={illustration}
                                    alt="illustration"
                                    className="illustration mobile-hide"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 px-5">
                            <div className="right-panel shadow-sm">
                                <h6 className="c-black">LOGIN</h6>
                                <form onSubmit={handleSubmit}>
                                    <div className="login-form">
                                        <div className="col-md-12">
                                            <label className="control-label fw-normal">
                                                Email ID<span className="c-red"> *</span>
                                            </label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter Email ID"
                                                required
                                            />
                                            {emailError && (
                                                <label className="f-12 text-danger">{emailError}</label>
                                            )}
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <label className="control-label fw-normal">
                                                Password<span className="c-red"> *</span>
                                            </label>
                                            <div className="col-md-12 position-relative">
                                                <Form.Control
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Password"
                                                    required
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className="eye-toggle-icon cursor-pointer"
                                                >
                          {showPassword ? (
                              <i className="bi bi-eye" />
                          ) : (
                              <i className="bi bi-eye-slash" />
                          )}
                        </span>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn primary-btn col-md-12 mt-4 mb-2"
                                            disabled={isSubmitDisabled()}
                                        >
                                            Proceed
                                        </button>
                                        <Link to="/register" className="d-block text-center mt-2 f-12">
                                            Don't have an account?{' '}
                                            <span className="text-primary">Create one</span>
                                        </Link>
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

export default LoginPage;
