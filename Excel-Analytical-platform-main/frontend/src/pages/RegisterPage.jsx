import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../components/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
    const navigate = useNavigate();
    const { login } = useAuth();
    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            return toast.error('Passwords do not match');
        }
        try {
            const res = await api.post('/auth/register', { name, email, password });
            login(res.data.token);
            toast.success('🎉 Registration successful! Welcome.');
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                toast.error(err.response.data.msg);
                if (err.response.data.msg === 'User already exists!') {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                toast.error('Registration failed. Please check the backend console for errors.');
                console.error("Frontend Registration Error:", err);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <input type="password" name="password" minLength="6" value={password} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Confirm Password</label>
                        <input type="password" name="password2" value={password2} onChange={onChange} required className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
};
export default RegisterPage;