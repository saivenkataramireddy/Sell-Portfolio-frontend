import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { authApi } from '../services/api';
import { BACKEND_URL } from '../config';
import './Home.css';

const Home = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch current user/admin profile
                const response = await authApi.getMe().catch(() => ({ data: null }));
                if (response.data) {
                    setProfile(response.data);
                }
            } catch (err) {
                console.log("Profile fetch failed or offline");
            }
        };
        fetchProfile();
    }, []);

    const displayName = profile?.full_name || "Creative Developer";
    const displayBio = profile?.bio || "I am a passionate developer specializing in building beautiful, functional, and user-centered digital products. Let's turn your ideas into reality.";
    const displayDescription = profile?.description || displayBio;


    return (
        <div className="home-container">
            <section className="hero section container">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="hero-badge">Available for projects</span>
                        <h1 className="hero-title">
                            Hi, I'm <span className="gradient-text">{displayName}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {displayDescription}
                        </p>

                        <div className="hero-actions">
                            <NavLink to="/projects" className="btn btn-primary">
                                View My Projects <ArrowRight size={18} />
                            </NavLink>
                            {profile?.resume_url && (
                                <a
                                    href={`${BACKEND_URL}${profile.resume_url}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                >
                                    Download Resume <Download size={18} />
                                </a>
                            )}
                        </div>

                        <div className="social-links">
                            {profile?.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <Github size={20} />
                                </a>
                            )}
                            {profile?.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            <a href="#!" className="social-icon"><Twitter size={20} /></a>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-image-container"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="hero-blob"></div>
                    <div className="hero-img-wrapper">
                        {profile?.profile_picture ? (
                            <img
                                src={profile.profile_picture.startsWith('http') ? profile.profile_picture : `${BACKEND_URL}${profile.profile_picture}`}
                                alt={displayName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                onError={(e) => {
                                    console.error("Image load failed:", e.target.src);
                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=random';
                                }}
                            />
                        ) : (
                            <div className="placeholder-image">
                                <span className="dev-emoji">👨‍💻</span>
                            </div>
                        )}
                    </div>

                    <motion.div
                        className="floating-card card-1"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                        <span>UI/UX Design</span>
                    </motion.div>
                    <motion.div
                        className="floating-card card-2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                        <span>React Pro</span>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
