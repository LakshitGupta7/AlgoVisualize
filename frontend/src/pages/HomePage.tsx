import React from 'react';
import './HomePage.css';

interface HomePageProps {
    onNavigate: (page: string) => void;
}

const CATEGORIES = [
    {
        id: 'sorting',
        icon: '📊',
        title: 'Sorting Algorithms',
        description: 'Bubble, Quick, Merge, Heap, and more sorting algorithms visualized',
        algorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'],
        color: 'var(--color-cat-sorting)',
    },
    {
        id: 'searching',
        icon: '🔍',
        title: 'Searching Algorithms',
        description: 'Linear, Binary, Jump, and Interpolation search algorithms',
        algorithms: ['Linear Search', 'Binary Search', 'Jump Search'],
        color: 'var(--color-cat-searching)',
    },
    {
        id: 'graph',
        icon: '🔗',
        title: 'Graph Algorithms',
        description: 'BFS, DFS, Dijkstra, MST algorithms on interactive graphs',
        algorithms: ['BFS', 'DFS', 'Dijkstra', 'Kruskal', 'Prim'],
        color: 'var(--color-cat-graph)',
    },
    {
        id: 'tree',
        icon: '🌳',
        title: 'Tree Algorithms',
        description: 'Binary tree traversals and BST operations visualized',
        algorithms: ['Inorder', 'Preorder', 'Postorder', 'Level Order'],
        color: 'var(--color-cat-tree)',
    },
    {
        id: 'dp',
        icon: '🧮',
        title: 'Dynamic Programming',
        description: 'Classic DP problems with step-by-step table visualization',
        algorithms: ['Fibonacci', 'Knapsack', 'LCS', 'LIS'],
        color: 'var(--color-cat-dp)',
    },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Master <span className="text-gradient">Data Structures</span> &{' '}
                        <span className="text-gradient">Algorithms</span>
                    </h1>
                    <p className="hero-subtitle">
                        Interactive visualizations to help you understand how algorithms work.
                        Watch each step, control the speed, and learn by seeing.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => onNavigate('sorting')}>
                            🚀 Start Learning
                        </button>
                        <button className="btn btn-secondary btn-lg">
                            📖 Documentation
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <strong>25+</strong>
                            <span>Algorithms</span>
                        </div>
                        <div className="stat-item">
                            <strong>5</strong>
                            <span>Categories</span>
                        </div>
                        <div className="stat-item">
                            <strong>∞</strong>
                            <span>Visualizations</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-cards">
                        {[64, 34, 25, 12, 22, 11, 90].map((val, i) => (
                            <div
                                key={i}
                                className="floating-bar"
                                style={{
                                    height: `${val}%`,
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="categories">
                <h2>Explore Categories</h2>
                <div className="categories-grid">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className="category-card glass-card"
                            onClick={() => onNavigate(cat.id)}
                            style={{ '--accent-color': cat.color } as React.CSSProperties}
                        >
                            <div className="category-icon">{cat.icon}</div>
                            <h3>{cat.title}</h3>
                            <p>{cat.description}</p>
                            <div className="category-tags">
                                {cat.algorithms.slice(0, 3).map((algo) => (
                                    <span key={algo} className="tag">{algo}</span>
                                ))}
                                {cat.algorithms.length > 3 && (
                                    <span className="tag">+{cat.algorithms.length - 3}</span>
                                )}
                            </div>
                            <div className="category-arrow">→</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="features">
                <h2>Why AlgoVisualize?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">⚡</span>
                        <h3>Real-time Visualization</h3>
                        <p>Watch algorithms execute step-by-step with smooth animations</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🎛️</span>
                        <h3>Interactive Controls</h3>
                        <p>Play, pause, step through, and control animation speed</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">📚</span>
                        <h3>Learn by Doing</h3>
                        <p>Input your own data and see how algorithms handle it</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">📊</span>
                        <h3>Complexity Analysis</h3>
                        <p>Understand time and space complexity with real metrics</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
