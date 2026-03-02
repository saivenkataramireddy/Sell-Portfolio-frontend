import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { certsApi } from '../services/api';
import './Certifications.css';

const demoCertifications = [
    {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "Oct 2023",
        link: "#",
    },
    {
        name: "Professional Cloud Developer",
        issuer: "Google Cloud",
        date: "Mar 2023",
        link: "#",
    },
    {
        name: "Meta Front-End Developer",
        issuer: "Coursera / Meta",
        date: "Aug 2022",
        link: "#",
    }
];

const Certifications = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const response = await certsApi.getAll();
                setCertifications(response.data.length > 0 ? response.data : demoCertifications);
            } catch (error) {
                console.error("Error fetching certifications:", error);
                setCertifications(demoCertifications);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div className="certs-page section container">
            <div className="section-header">
                <span className="section-subtitle">Credentials</span>
                <h2 className="section-title">Professional Certifications</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <div className="certs-grid">
                    {certifications.map((cert, idx) => (
                        <motion.div
                            key={idx}
                            className="cert-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="cert-badge">
                                <Award size={30} />
                            </div>
                            <div className="cert-info">
                                <h3>{cert.name}</h3>
                                <p className="cert-issuer">{cert.issuer}</p>
                                <div className="cert-footer">
                                    <span className="cert-date"><Calendar size={14} /> {cert.date}</span>
                                    <a href={cert.link} className="cert-link">Verify <ExternalLink size={14} /></a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Certifications;
