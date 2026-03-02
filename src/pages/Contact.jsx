import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { contactApi } from '../services/api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await contactApi.send(formData);
            alert("Message sent successfully!");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page section container">
            <div className="section-header">
                <span className="section-subtitle">Get In Touch</span>
                <h2 className="section-title">Let's Work Together</h2>
            </div>

            <div className="contact-grid">
                <motion.div
                    className="contact-info"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="info-item">
                        <div className="info-icon"><Mail /></div>
                        <div>
                            <h3>Email</h3>
                            <p>hello@portfolio.com</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><Phone /></div>
                        <div>
                            <h3>Phone</h3>
                            <p>+1 (555) 000-0000</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><MapPin /></div>
                        <div>
                            <h3>Location</h3>
                            <p>San Francisco, CA</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="contact-form-wrapper"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows="5"
                                required
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={isSending}>
                            {isSending ? <Loader2 className="animate-spin" size={18} /> : 'Send Message'} <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
