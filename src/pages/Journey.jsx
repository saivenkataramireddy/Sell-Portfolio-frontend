import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Loader2 } from 'lucide-react';
import { journeyApi } from '../services/api';
import './Journey.css';

const Journey = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    const demoExperiences = [
        {
            type: "work",
            title: "Senior Full Stack Developer",
            company: "Tech Solutions Inc.",
            date: "2022 - Present",
            description: "Leading the development of complex web applications using React and FastAPI. Mentoring junior developers and optimizing system architecture.",
            icon: <Briefcase size={20} />
        },
        {
            type: "work",
            title: "Web Developer",
            company: "Digital Agency",
            date: "2020 - 2022",
            description: "Developed responsive and interactive user interfaces for various clients. Integrated third-party APIs and managed database migrations.",
            icon: <Briefcase size={20} />
        },
        {
            type: "education",
            title: "B.S. in Computer Science",
            company: "State University",
            date: "2016 - 2020",
            description: "Focused on software engineering, data structures, and algorithms. Graduated with honors.",
            icon: <GraduationCap size={20} />
        }
    ];

    useEffect(() => {
        const fetchJourney = async () => {
            try {
                const response = await journeyApi.getAll();
                const formatted = response.data.map(item => ({
                    ...item,
                    date: `${item.start_date} - ${item.end_date || 'Present'}`,
                    icon: item.type === 'education' ? <GraduationCap size={20} /> : <Briefcase size={20} />
                }));
                setExperiences(formatted.length > 0 ? formatted : demoExperiences);
            } catch (error) {
                console.error("Error fetching journey:", error);
                setExperiences(demoExperiences);
            } finally {
                setLoading(false);
            }
        };
        fetchJourney();
    }, []);

    return (
        <div className="journey-page section container">
            <div className="section-header">
                <span className="section-subtitle">My Career Path</span>
                <h2 className="section-title">The Journey So Far</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <div className="timeline">
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={idx}
                            className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="timeline-content">
                                <div className="timeline-date">
                                    <Calendar size={14} /> {exp.date}
                                </div>
                                <div className="timeline-icon-box">
                                    {exp.icon}
                                </div>
                                <h3>{exp.title}</h3>
                                <span className="timeline-company">{exp.company}</span>
                                <p>{exp.description}</p>
                            </div>
                            <div className="timeline-dot"></div>
                        </motion.div>
                    ))}
                    <div className="timeline-line"></div>
                </div>
            )}
        </div>
    );
};

export default Journey;
