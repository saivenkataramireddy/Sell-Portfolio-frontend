import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Loader2, Calendar } from 'lucide-react';
import { certsApi } from '../../services/api';

const ManageCertifications = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', issuer: '', date: '', link: '' });

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        try {
            const response = await certsApi.getAll();
            setCerts(response.data);
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
                await certsApi.update(editId, formData);
            } else {
                await certsApi.create(formData);
            }
            resetForm();
            fetchCerts();
        } catch (err) {
            alert("Error saving certification");
        }
    };

    const resetForm = () => {
        setFormData({ name: '', issuer: '', date: '', link: '' });
        setIsAdding(false);
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this certification?")) {
            try {
                await certsApi.delete(id);
                fetchCerts();
            } catch (err) {
                alert("Error deleting certification");
            }
        }
    };

    const startEdit = (cert) => {
        setEditId(cert.id);
        setFormData({ ...cert });
        setIsAdding(true);
    };

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Manage Certifications</h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setIsAdding(true); setEditId(null); }}>
                    <Plus size={16} /> Add Certification
                </button>
            </div>

            {isAdding && (
                <div className="admin-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                placeholder="Certification Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Issuer"
                                value={formData.issuer}
                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                placeholder="Date (e.g. Oct 2023)"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                            <input
                                placeholder="Verification Link"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
                    {certs.map(cert => (
                        <div key={cert.id} className="admin-list-item">
                            <div className="item-info">
                                <strong>{cert.name}</strong>
                                <span><Calendar size={12} /> {cert.issuer} | {cert.date}</span>
                            </div>
                            <div className="item-btns">
                                <button onClick={() => startEdit(cert)}><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(cert.id)} className="text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageCertifications;
