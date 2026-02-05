import React from 'react';
import './CodeModal.css';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    code: {
        [key: string]: string;
    };
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, title, code }) => {
    const [activeTab, setActiveTab] = React.useState(Object.keys(code)[0]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-tabs">
                    {Object.keys(code).map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="code-container">
                    <pre>
                        <code>{code[activeTab]}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default CodeModal;
