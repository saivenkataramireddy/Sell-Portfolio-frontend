import React, { useState, useEffect } from 'react';
import { Save, Loader2, User, Mail, FileText, Upload } from 'lucide-react';
import { authApi } from '../../services/api';

const ManageProfile = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        bio: '',
        profile_picture: '',
        resume_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Use the backend base URL for images
    const BACKEND_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authApi.getMe();
            setProfile(response.data);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await authApi.uploadProfilePic(formData);
            setProfile({ ...profile, profile_picture: response.data.url });
            setMessage({ type: 'success', text: 'Image uploaded! Remember to save profile.' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Image upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await authApi.uploadResume(formData);
            setProfile({ ...profile, resume_url: response.data.url });
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Resume upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await authApi.updateProfile(profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            localStorage.setItem('adminEmail', profile.email);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Error updating profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Admin Profile Settings</h3>
                <p className="text-muted">Manage your personal information and profile picture</p>
            </div>

            <div className="admin-form-card" style={{ maxWidth: '800px', margin: '2rem 0' }}>
                {message.text && (
                    <div className={`message-banner ${message.type}`} style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fee2e2'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Profile Picture Upload */}
                    <div className="profile-upload-row" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <div className="preview-container" style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <img
                                src={profile.profile_picture ? (profile.profile_picture.startsWith('http') ? profile.profile_picture : `${BACKEND_URL}${profile.profile_picture}`) : 'https://ui-avatars.com/api/?name=Admin&background=random'}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            {uploading && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Loader2 className="animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                        <div className="upload-actions">
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Profile Photo</h4>
                            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
                                <Upload size={16} /> {uploading ? 'Uploading...' : 'Change Photo'}
                                <input type="file" onChange={handleImageUpload} hidden />
                            </label>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Full freedom: Upload any image file here.</p>
                        </div>
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="stat-label">Full Name</label>
                            <div className="input-with-icon-admin" style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Your Name"
                                    style={{ paddingLeft: '3rem', width: '100%', height: '45px', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="stat-label">Email</label>
                            <div className="input-with-icon-admin" style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    value={profile.email || ''}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    placeholder="Email Address"
                                    style={{ paddingLeft: '3rem', width: '100%', height: '45px', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="stat-label">Resume / CV (Any file type supported)</label>
                        <div className="upload-box" style={{
                            padding: '1.5rem',
                            background: '#f8fafc',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div className="flex items-center gap-3">
                                <FileText size={24} className="text-primary" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{profile.resume_url ? 'Resume is uploaded' : 'No resume uploaded yet'}</p>
                                    {profile.resume_url && <a href={`${BACKEND_URL}${profile.resume_url}`} target="_blank" rel="noopener noreferrer" className="text-primary" style={{ fontSize: '0.85rem' }}>View Current Resume</a>}
                                </div>
                            </div>
                            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Upload size={16} /> {uploading ? 'Processing...' : (profile.resume_url ? 'Update Resume' : 'Upload Resume')}
                                <input type="file" onChange={handleResumeUpload} hidden />
                            </label>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving || uploading} style={{ padding: '0.8rem 2rem' }}>
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Profile Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageProfile;
