import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { projectsApi } from '../../services/api';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        technologies: '',
        link: '',
        github: '',
        image_url: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsApi.getAll();
            setProjects(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await projectsApi.update(editId, formData);
            } else {
                await projectsApi.create(formData);
            }
            resetForm();
            fetchProjects();
        } catch (err) {
            alert("Error saving project");
        }
    };

    const resetForm = () => {
        setFormData({ title: '', category: '', description: '', technologies: '', link: '', github: '', image_url: '' });
        setIsAdding(false);
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this project?")) {
            try {
                await projectsApi.delete(id);
                fetchProjects();
            } catch (err) {
                alert("Error deleting project");
            }
        }
    };

    const startEdit = (proj) => {
        setEditId(proj.id);
        setFormData({ ...proj });
        setIsAdding(true);
    };

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Manage Projects</h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setIsAdding(true); setEditId(null); }}>
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {isAdding && (
                <div className="admin-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                placeholder="Project Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                placeholder="Technologies (comma separated)"
                                value={formData.technologies}
                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            />
                            <input
                                placeholder="Image URL"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                placeholder="Live Link"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                            <input
                                placeholder="GitHub Link"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-text" onClick={resetForm}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Save'} <Check size={16} /></button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="admin-list">
                    {projects.map(proj => (
                        <div key={proj.id} className="admin-list-item">
                            <div className="item-info">
                                <strong>{proj.title}</strong>
                                <span>{proj.category}</span>
                            </div>
                            <div className="item-btns">
                                <button onClick={() => startEdit(proj)}><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(proj.id)} className="text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
