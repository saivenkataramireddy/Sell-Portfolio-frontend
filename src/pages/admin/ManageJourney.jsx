import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { journeyApi } from '../../services/api';

const ManageJourney = () => {
    const [journey, setJourney] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        type: 'work'
    });

    useEffect(() => {
        fetchJourney();
    }, []);

    const fetchJourney = async () => {
        try {
            const response = await journeyApi.getAll();
            setJourney(response.data);
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
                await journeyApi.update(editId, formData);
            } else {
                await journeyApi.create(formData);
            }
            resetForm();
            fetchJourney();
        } catch (err) {
            alert("Error saving journey entry");
        }
    };

    const resetForm = () => {
        setFormData({ title: '', company: '', location: '', start_date: '', end_date: '', description: '', type: 'work' });
        setIsAdding(false);
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this entry?")) {
            try {
                await journeyApi.delete(id);
                fetchJourney();
            } catch (err) {
                alert("Error deleting entry");
            }
        }
    };

    const startEdit = (item) => {
        setEditId(item.id);
        setFormData({ ...item });
        setIsAdding(true);
    };

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Manage Journey</h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setIsAdding(true); setEditId(null); }}>
                    <Plus size={16} /> Add Entry
                </button>
            </div>

            {isAdding && (
                <div className="admin-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                placeholder="Title (e.g. Senior Developer)"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="work">Work</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <input
                                placeholder="Company/University"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                placeholder="Start Date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                            <input
                                placeholder="End Date (Blank if Current)"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%' }}
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
                    {journey.map(item => (
                        <div key={item.id} className="admin-list-item">
                            <div className="item-info">
                                <strong>{item.title}</strong>
                                <span>{item.company} | {item.start_date} - {item.end_date || 'Present'}</span>
                            </div>
                            <div className="item-btns">
                                <button onClick={() => startEdit(item)}><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageJourney;
