import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { skillsApi } from '../../services/api';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', level: 80 });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillsApi.getAll();
            setSkills(response.data);
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
                await skillsApi.update(editId, formData);
            } else {
                await skillsApi.create(formData);
            }
            setFormData({ name: '', category: '', level: 80 });
            setIsAdding(false);
            setEditId(null);
            fetchSkills();
        } catch (err) {
            alert("Error saving skill");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this skill?")) {
            try {
                await skillsApi.delete(id);
                fetchSkills();
            } catch (err) {
                alert("Error deleting skill");
            }
        }
    };

    const startEdit = (skill) => {
        setEditId(skill.id);
        setFormData({ name: skill.name, category: skill.category, level: skill.level });
        setIsAdding(true);
    };

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Manage Skills</h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setIsAdding(true); setEditId(null); setFormData({ name: '', category: '', level: 80 }) }}>
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {isAdding && (
                <div className="admin-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                placeholder="Skill Name (e.g. React)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Category (e.g. Frontend)"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Level (0-100)"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-text" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Save'} <Check size={16} /></button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="admin-list">
                    {skills.map(skill => (
                        <div key={skill.id} className="admin-list-item">
                            <div className="item-info">
                                <strong>{skill.name}</strong>
                                <span>{skill.category} ({skill.level}%)</span>
                            </div>
                            <div className="item-btns">
                                <button onClick={() => startEdit(skill)}><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(skill.id)} className="text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageSkills;
