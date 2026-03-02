import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Wrench, Layout, Loader2 } from 'lucide-react';
import { skillsApi } from '../services/api';
import './Skills.css';

const demoSkills = [
    {
        title: "Frontend Development",
        icon: <Layout className="icon" />,
        skills: ["React", "Vue.js", "Tailwind CSS", "Framer Motion", "TypeScript"]
    },
    {
        title: "Backend Development",
        icon: <Server className="icon" />,
        skills: ["FastAPI", "Python", "PostgreSQL", "MongoDB", "Auth0"]
    },
    {
        title: "Tools & DevOps",
        icon: <Wrench className="icon" />,
        skills: ["Git", "Docker", "AWS", "GitHub Actions", "Firebase"]
    }
];

const Skills = () => {
    const [skillCategories, setSkillCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await skillsApi.getAll();
                // Group skills by category for display
                const grouped = response.data.reduce((acc, skill) => {
                    const cat = skill.category || "General";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill.name);
                    return acc;
                }, {});

                const formatted = Object.keys(grouped).map(cat => ({
                    title: cat,
                    icon: cat.includes("Frontend") ? <Layout className="icon" /> : cat.includes("Backend") ? <Server className="icon" /> : <Wrench className="icon" />,
                    skills: grouped[cat]
                }));

                // If no skills in DB, use static for demo
                setSkillCategories(formatted.length > 0 ? formatted : demoSkills);
            } catch (error) {
                console.error("Error fetching skills:", error);
                setSkillCategories(demoSkills);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <div className="skills-page section container">
            <div className="section-header">
                <span className="section-subtitle">What I'm Good At</span>
                <h2 className="section-title">Technical Expertise</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <motion.div
                    className="skills-grid"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {skillCategories.map((cat, idx) => (
                        <motion.div key={idx} className="skill-category-card" variants={item}>
                            <div className="card-icon">{cat.icon}</div>
                            <h3>{cat.title}</h3>
                            <div className="skills-list">
                                {cat.skills.map(skill => (
                                    <div key={skill} className="skill-pill">
                                        {skill}
                                    </div>
                                ))}
                            </div>

                            <div className="card-progress">
                                <div className="progress-label">Proficiency</div>
                                <div className="progress-bar-bg">
                                    <motion.div
                                        className="progress-bar-fill"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: idx === 0 ? "90%" : idx === 1 ? "85%" : "75%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Skills;
