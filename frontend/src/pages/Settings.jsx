import { useState, useEffect } from 'react';
import { User, Lock, Trash2, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const CUISINES = ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American'];

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({ name: '', email: '' });
    const [preferences, setPreferences] = useState({
        dietary_restrictions: [],
        allergies: [],
        preferred_cuisines: [],
        default_servings: 4,
        measurement_unit: 'metric'
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => { fetchUserData(); }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/users/profile');
            const { user: u, preferences: prefs } = response.data.data;
            setProfile({ name: u?.name || '', email: u?.email || '' });
            if (prefs) {
                setPreferences({
                    dietary_restrictions: prefs.dietary_restrictions || [],
                    allergies: prefs.allergies || [],
                    preferred_cuisines: prefs.preferred_cuisines || [],
                    default_servings: prefs.default_servings || 4,
                    measurement_unit: prefs.measurement_unit || 'metric'
                });
            }
        } catch {
            toast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/users/profile', profile);
            toast.success('Profile updated successfully');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePreferencesUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/users/preferences', preferences);
            toast.success('Preferences updated successfully');
        } catch {
            toast.error('Failed to update preferences');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setSaving(true);
        try {
            await api.put('/users/password', {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch {
            toast.error('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account?')) return;
        const confirmation = prompt('Type "DELETE" to confirm:');
        if (confirmation !== 'DELETE') return toast.error('Cancelled');
        try {
            await api.delete('/users');
            toast.success('Account deleted');
            logout();
            navigate('/login');
        } catch {
            toast.error('Failed to delete account');
        }
    };

    const toggleDietary = (option) => {
        setPreferences(prev => ({
            ...prev,
            dietary_restrictions: prev.dietary_restrictions.includes(option)
                ? prev.dietary_restrictions.filter(d => d !== option)
                : [...prev.dietary_restrictions, option]
        }));
    };

    const toggleCuisine = (cuisine) => {
        setPreferences(prev => ({
            ...prev,
            preferred_cuisines: prev.preferred_cuisines.includes(cuisine)
                ? prev.preferred_cuisines.filter(c => c !== cuisine)
                : [...prev.preferred_cuisines, cuisine]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-dashed rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

                {/* Profile Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                            <p className="text-sm text-gray-500">Update your personal information</p>
                        </div>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className={inputClass}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> Save Profile
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                            <p className="text-sm text-gray-500">Keep your account secure</p>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className={labelClass}>Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Lock className="w-4 h-4" /> Change Password
                        </button>
                    </form>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Save className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Food Preferences</h2>
                            <p className="text-sm text-gray-500">Customize your recipe recommendations</p>
                        </div>
                    </div>
                    <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                        {/* Dietary Restrictions */}
                        <div>
                            <label className={labelClass}>Dietary Restrictions</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {DIETARY_OPTIONS.map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => toggleDietary(option)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                            preferences.dietary_restrictions.includes(option)
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferred Cuisines */}
                        <div>
                            <label className={labelClass}>Preferred Cuisines</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {CUISINES.map(cuisine => (
                                    <button
                                        key={cuisine}
                                        type="button"
                                        onClick={() => toggleCuisine(cuisine)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                            preferences.preferred_cuisines.includes(cuisine)
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                                        }`}
                                    >
                                        {cuisine}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Default Servings */}
                        <div>
                            <label className={labelClass}>Default Servings</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={preferences.default_servings}
                                onChange={(e) => setPreferences({ ...preferences, default_servings: parseInt(e.target.value) })}
                                className={`${inputClass} w-24`}
                            />
                        </div>

                        {/* Measurement Unit */}
                        <div>
                            <label className={labelClass}>Measurement Unit</label>
                            <div className="flex gap-3 mt-2">
                                {['metric', 'imperial'].map(unit => (
                                    <button
                                        key={unit}
                                        type="button"
                                        onClick={() => setPreferences({ ...preferences, measurement_unit: unit })}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${
                                            preferences.measurement_unit === unit
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                                        }`}
                                    >
                                        {unit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> Save Preferences
                        </button>
                    </form>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-xl border border-red-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Delete Account</h2>
                            <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;