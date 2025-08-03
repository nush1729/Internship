import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.token);
            toast.success('🚀 Login successful! Welcome back.');
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                try {
                    const checkUserRes = await api.get(`/auth/check/${email}`);
                    if (!checkUserRes.data.exists) {
                        toast.error('User does not exist. Please Sign Up.');
                        setTimeout(() => navigate('/register'), 2000);
                    } else {
                        toast.error('Invalid credentials. Please try again.');
                    }
                } catch (checkErr) {
                    toast.error('An error occurred while verifying your email.');
                }
            } else {
                toast.error('An unexpected server error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back!</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};
export default LoginPage;