import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import illustration from '../assets/images/login-illustration.png';
import { Form } from "react-bootstrap";
import { useCookies } from 'react-cookie';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import configData from "../config/index.json";

function OTPPage() {
    const [cookies] = useCookies(['email']);
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ OTP: "" });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    let expressURL = configData.express_url;

    const isSubmitDisabled = () => {
        return formData.OTP === "";
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(fd => ({ ...fd, [name]: value }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(expressURL + "user/verifyotp", {
                email: cookies.email,
                otp: formData.OTP,
            });

            if (response.data.statusCode === 200) {
                setIsLoading(false);
                await MySwal.fire({
                    title: "OTP Verified",
                    text: "Your OTP has been verified successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                });
                navigate("/thank-you");
            }
        } catch (err) {
            setIsLoading(false);
            console.error("OTP verify error:", err);

            const backendMsg = err.response?.data?.message;
            if (backendMsg === "Invalid or expired OTP") {
                const next = attempts + 1;
                setAttempts(next);

                if (next >= 3) {
                    await MySwal.fire({
                        icon: "error",
                        title: "Too Many Attempts",
                        text: "You have consumed all your login attempts. Please try again later.",
                        confirmButtonText: "OK",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                    });
                    return navigate("/error-page");
                } else {
                    setError(`${backendMsg}. You have ${3 - next} attempts remaining.`);
                }
            } else if (backendMsg) {
                setError(backendMsg);
            } else {
                await MySwal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: "Please try again!",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="full-page-wrapper">
            <div className="login-page">
                <div className="login-container container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center px-5">
                            <div className="left-panel">
                                <h5 className="f-20 fw-bold">Secure Verification for a <br />Brighter Future</h5>
                                <img src={illustration} alt="illustration" className="illustration mobile-hide" />
                            </div>
                        </div>
                        <div className="col-md-6 px-5">
                            <div className="right-panel shadow-sm">
                                <h6 className="c-black">LOGIN</h6>
                                <form onSubmit={handleSubmit}>
                                    <div className="login-form">
                                        <div className="col-md-12">
                                            <label className="control-label fw-normal">OTP<span className="c-red"> *</span></label>
                                            <Form.Control
                                                type="text"
                                                className="form-control f-12 c-gray"
                                                placeholder="Enter OTP"
                                                name="OTP"
                                                value={formData.OTP}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {error && <label style={{ color: "red" }} className="f-12">{error}</label>}
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn primary-btn col-md-12 mt-4 mb-2 col-12"
                                            disabled={isSubmitDisabled()}
                                        >
                                            Proceed
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

export default OTPPage;
