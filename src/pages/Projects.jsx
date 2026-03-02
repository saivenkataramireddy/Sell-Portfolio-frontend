import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { projectsApi } from '../services/api';
import './Projects.css';

const demoProjects = [
    {
        title: "E-Commerce Platform",
        category: "Full Stack",
        description: "A modern e-commerce solution with real-time inventory management and secure payment integration.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tech: ["React", "FastAPI", "Stripe", "PostgreSQL"],
        link: "#",
        github: "#"
    },
    {
        title: "AI Image Generator",
        category: "Frontend",
        description: "Interactive dashboard for generating images using AI models. Features include prompt history and sharing.",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tech: ["React", "Stable Diffusion", "Tailwind CSS"],
        link: "#",
        github: "#"
    },
    {
        title: "Crypto Tracker",
        category: "Web App",
        description: "Real-time cryptocurrency monitoring tool with interactive charts and portfolio tracking features.",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tech: ["Vue.js", "Chart.js", "CoinGecko API"],
        link: "#",
        github: "#"
    }
];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsApi.getAll();
                const formatted = response.data.map(p => ({
                    ...p,
                    tech: p.technologies ? p.technologies.split(',') : [],
                    image: p.image_url || "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                }));
                setProjects(formatted.length > 0 ? formatted : demoProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects(demoProjects);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="projects-page section container">
            <div className="section-header">
                <span className="section-subtitle">My Creative Work</span>
                <h2 className="section-title">Selected Projects</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <motion.div
                    className="projects-grid"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {projects.map((proj, idx) => (
                        <motion.div key={idx} className="project-card" variants={item}>
                            <div className="project-image-wrapper">
                                <img src={proj.image} alt={proj.title} />
                                <div className="project-overlay">
                                    <div className="overlay-btns">
                                        <a href={proj.github} className="overlay-btn"><Github size={20} /></a>
                                        <a href={proj.link} className="overlay-btn"><ExternalLink size={20} /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="project-content">
                                <span className="project-cat">{proj.category}</span>
                                <h3>{proj.title}</h3>
                                <p>{proj.description}</p>
                                <div className="project-tech">
                                    {proj.tech.map(t => (
                                        <span key={t} className="tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Projects;
