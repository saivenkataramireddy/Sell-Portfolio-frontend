import React, { useState, useEffect } from 'react';
import { Mail, User, Clock, Loader2, Trash2 } from 'lucide-react';
import { contactApi } from '../../services/api';

const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await contactApi.getAll();
            setMessages(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactApi.delete(id);
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (err) {
            alert('Failed to delete message');
            console.error(err);
        }
    };

    return (
        <div className="manage-section">
            <div className="section-admin-header">
                <h3>Contact Messages</h3>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="admin-list">
                    {messages.length === 0 ? (
                        <p className="text-muted p-4">No messages yet.</p>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', position: 'relative' }}>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-red-500 hover:text-red-700"
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                    title="Delete Message"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="flex justify-between w-full">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '0.5rem', paddingRight: '2.5rem' }}>
                                        <div className="flex items-center gap-2 text-dark font-bold">
                                            <User size={16} /> {msg.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted">
                                            <Mail size={16} /> {msg.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted">
                                            <Clock size={16} /> {new Date(msg.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="message-content" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', width: '100%' }}>
                                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Subject: {msg.subject}</strong>
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewMessages;
