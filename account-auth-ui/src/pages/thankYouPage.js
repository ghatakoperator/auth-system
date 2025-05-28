import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCookies } from 'react-cookie';
import configData from '../config/index.json';

function ThankYouPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [cookies, , removeCookie] = useCookies(['email']);

    const expressURL = configData.express_url;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.post(
                    `${expressURL}user/get`,
                    { email: cookies.email }
                );
                if (response.data.statusCode === 200) {
                    setUser(response.data.data);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                MySwal.fire({ icon: 'error', title: 'Error', text: 'Failed to load user data.' });
            } finally {
                setIsLoading(false);
            }
        };

        if (cookies.email) fetchUser();
        else navigate('/login');
    }, [cookies.email,  navigate]);

    const handleDelete = async () => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: 'This action will delete your account permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.post(
                    `${expressURL}user/delete`,
                    { email: cookies.email }
                );
                removeCookie('email', { path: '/' });
                await MySwal.fire({ icon: 'success', title: 'Deleted', text: 'Your account has been deleted.' });
                navigate('/register');
            } catch (err) {
                console.error('Error deleting account:', err);
                MySwal.fire({ icon: 'error', title: 'Error', text: 'Could not delete account.' });
            }
        }
    };

    if (isLoading) return <div className="text-center mt-5">Loading...</div>;

    // Handle image data (Buffer or base64 string)
    let imageSrc = null;
    if (user.image) {
        let base64Str = '';
        let mime = 'jpeg';
        if (typeof user.image === 'string') {
            base64Str = user.image;
            if (base64Str.startsWith('iVBOR')) mime = 'png';
        } else if (user.image.data) {
            const bytes = new Uint8Array(user.image.data);
            const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '');
            base64Str = window.btoa(binary);
            mime = bytes[0] === 0x89 ? 'png' : 'jpeg';
        }
        imageSrc = `data:image/${mime};base64,${base64Str}`;
    }

    return (
        <div className="full-page-wrapper">
            <div className="login-page">
                <div className="login-container container-fluid" style={{ minHeight: '100vh' }}>
                    <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                        <div className="col-md-8 col-lg-6 px-3">
                            <div className="right-panel shadow-sm" style={{ padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
                                <h4 className="text-center mb-4">Thank You, {user.name}!</h4>

                                {imageSrc && (
                                    <div className="text-center mb-4">
                                        <img
                                            src={imageSrc}
                                            alt="Profile"
                                            className="img-fluid rounded-circle"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}

                                <div className="user-details mb-4">
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Company:</strong> {user.company}</p>
                                    <p><strong>Age:</strong> {user.age}</p>
                                    <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                                </div>

                                <button
                                    className="btn primary-btn w-100"
                                    onClick={handleDelete}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThankYouPage;
