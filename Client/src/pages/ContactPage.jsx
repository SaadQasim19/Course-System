import { useState } from 'react';

export const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message. We will respond shortly.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <article className="ocw-panel ocw-static">
            <h2>Contact Us</h2>
            <div className="ocw-contact-grid">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            id="subject"
                            type="text"
                            required
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={5}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc' }}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="ocw-btn-primary">Submit</button>
                </form>

                <div className="ocw-contact-info">
                    <h3>Virtual University of Pakistan</h3>
                    <p>M.A. Jinnah Campus, Defence Road,<br />Off Raiwind Road, Lahore, Pakistan</p>
                    <p><strong>Phone:</strong> +92-42-111-880-880</p>
                    <p><strong>Email:</strong> info@vu.edu.pk</p>
                    <p><strong>Website:</strong> www.vu.edu.pk</p>
                </div>
            </div>
        </article>
    );
};
