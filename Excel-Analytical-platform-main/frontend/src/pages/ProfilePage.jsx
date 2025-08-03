import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../components/AuthContext';

const ProfilePage = () => {
    // REASON: Gets the global user object to display their role.
    const { user: authUser } = useAuth();
    // REASON: Local state to hold the user's full profile details fetched from the API.
    const [profile, setProfile] = useState({ name: '', email: '' });
    // REASON: State to toggle between viewing and editing the profile.
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // REASON: Fetches the user's profile data when the component first loads.
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfile(res.data);
            } catch (err) {
                toast.error("Could not fetch profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // REASON: This function is called when the user clicks the "Save" button.
    const handleSaveChanges = async () => {
        try {
            const res = await api.put('/auth/profile', { name: profile.name, email: profile.email });
            setProfile(res.data);
            toast.success("Profile updated successfully!");
            setIsEditing(false); // REASON: Switches back to display mode after saving.
        } catch (err) {
            toast.error("Failed to update profile.");
        }
    };

    if (isLoading) return <div>Loading Profile...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiUser className="mr-3 text-teal-600" />
                    User Profile
                </h2>
                {/* REASON: Toggles between the Edit and Save buttons based on the 'isEditing' state. */}
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600">
                        <FiEdit className="mr-2" /> Edit
                    </button>
                ) : (
                    <button onClick={handleSaveChanges} className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600">
                        <FiSave className="mr-2" /> Save
                    </button>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    {isEditing ? (
                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full text-lg p-2 border rounded mt-1" />
                    ) : (
                        <p className="text-lg text-gray-800 p-2 bg-gray-50 rounded mt-1">{profile.name}</p>
                    )}
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                    {/* REASON: Email is displayed but not editable in this implementation for simplicity. */}
                    <p className="text-lg text-gray-800 p-2 bg-gray-50 rounded mt-1">{profile.email}</p>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600">User Role</label>
                    <p className="text-lg text-gray-800 p-2 bg-gray-50 rounded mt-1 capitalize">{authUser?.role}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;