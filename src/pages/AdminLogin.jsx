import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, MailQuestion, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
    const [isForgot, setIsForgot] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isForgot) {
                await authApi.forgotPassword(formData.email);
                alert("Password reset instructions sent (Simulated)");
                setIsForgot(false);
            } else {
                const response = await authApi.login(formData.email, formData.password);
                const token = response.data.access_token;

                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('adminEmail', formData.email);
                    navigate('/dashboard');
                } else {
                    setError('Login successful but no token received. Please contact support.');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-page section container">
            <motion.div
                className="login-card-wrapper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-header">
                    <div className="login-logo">
                        <ShieldCheck size={40} />
                    </div>
                    <h2>Admin {isForgot ? 'Recovery' : 'Access'}</h2>
                    <p>{isForgot ? 'Enter your email to reset password' : 'Prove you have the keys to the kingdom'}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isForgot && (
                            <motion.div
                                key="pass"
                                className="form-group"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className="input-with-icon">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        required={!isForgot}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (isForgot ? 'Send Reset Link' : 'Login Now')} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-footer">
                    {isForgot ? (
                        <button onClick={() => setIsForgot(false)} className="text-btn">
                            Back to Login
                        </button>
                    ) : (
                        <button onClick={() => setIsForgot(true)} className="text-btn flex items-center gap-2">
                            <MailQuestion size={16} /> Forgot Password?
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
