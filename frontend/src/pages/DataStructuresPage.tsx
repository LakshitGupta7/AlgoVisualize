import React, { useState, useCallback } from 'react';
import './DataStructuresPage.css';

type DataStructure = 'array' | 'stack' | 'queue' | 'linkedlist' | 'hashtable';

interface StackItem {
    value: number;
    id: number;
    isNew?: boolean;
    isPopping?: boolean;
}

interface QueueItem {
    value: number;
    id: number;
    isNew?: boolean;
    isDequeuing?: boolean;
}

const DATA_STRUCTURES = [
    { id: 'array' as DataStructure, name: 'Array', description: 'Contiguous memory storage' },
    { id: 'stack' as DataStructure, name: 'Stack', description: 'LIFO - Last In First Out' },
    { id: 'queue' as DataStructure, name: 'Queue', description: 'FIFO - First In First Out' },
    { id: 'linkedlist' as DataStructure, name: 'Linked List', description: 'Sequential nodes with pointers' },
    { id: 'hashtable' as DataStructure, name: 'Hash Table', description: 'Key-value storage with hashing' },
];

export const DataStructuresPage: React.FC = () => {
    const [selectedDS, setSelectedDS] = useState<DataStructure>('array');

    // Stack state
    const [stack, setStack] = useState<StackItem[]>([]);
    const [stackNextId, setStackNextId] = useState(0);
    const [peekValue, setPeekValue] = useState<number | null>(null);

    // Queue state
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [queueNextId, setQueueNextId] = useState(0);
    const [frontValue, setFrontValue] = useState<number | null>(null);

    // Shared state
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 2000);
    };

    // Stack Operations
    const push = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }

        const newItem: StackItem = { value, id: stackNextId, isNew: true };
        setStack(prev => [...prev, newItem]);
        setStackNextId(prev => prev + 1);
        setInputValue('');
        setPeekValue(null);

        setTimeout(() => {
            setStack(prev => prev.map(item =>
                item.id === newItem.id ? { ...item, isNew: false } : item
            ));
        }, 300);

        showMessage(`Pushed ${value}`);
    }, [inputValue, stackNextId]);

    const pop = useCallback(() => {
        if (stack.length === 0) {
            showMessage('Stack is empty!');
            return;
        }

        setStack(prev => prev.map((item, index) =>
            index === prev.length - 1 ? { ...item, isPopping: true } : item
        ));

        setTimeout(() => {
            setStack(prev => {
                const popped = prev[prev.length - 1];
                showMessage(`Popped ${popped.value}`);
                return prev.slice(0, -1);
            });
        }, 300);

        setPeekValue(null);
    }, [stack]);

    const peek = useCallback(() => {
        if (stack.length === 0) {
            showMessage('Stack is empty!');
            return;
        }

        const topValue = stack[stack.length - 1].value;
        setPeekValue(topValue);
        showMessage(`Top element: ${topValue}`);
    }, [stack]);

    const clearStack = useCallback(() => {
        setStack([]);
        setPeekValue(null);
        showMessage('Stack cleared');
    }, []);

    // Queue Operations
    const enqueue = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }

        const newItem: QueueItem = { value, id: queueNextId, isNew: true };
        setQueue(prev => [...prev, newItem]);
        setQueueNextId(prev => prev + 1);
        setInputValue('');
        setFrontValue(null);

        setTimeout(() => {
            setQueue(prev => prev.map(item =>
                item.id === newItem.id ? { ...item, isNew: false } : item
            ));
        }, 300);

        showMessage(`Enqueued ${value}`);
    }, [inputValue, queueNextId]);

    const dequeue = useCallback(() => {
        if (queue.length === 0) {
            showMessage('Queue is empty!');
            return;
        }

        setQueue(prev => prev.map((item, index) =>
            index === 0 ? { ...item, isDequeuing: true } : item
        ));

        setTimeout(() => {
            setQueue(prev => {
                const removed = prev[0];
                showMessage(`Dequeued ${removed.value}`);
                return prev.slice(1);
            });
        }, 300);

        setFrontValue(null);
    }, [queue]);

    const front = useCallback(() => {
        if (queue.length === 0) {
            showMessage('Queue is empty!');
            return;
        }

        const frontVal = queue[0].value;
        setFrontValue(frontVal);
        showMessage(`Front element: ${frontVal}`);
    }, [queue]);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setFrontValue(null);
        showMessage('Queue cleared');
    }, []);

    // Array state
    const [array, setArray] = useState<number[]>([10, 25, 8, 42, 15, 33]);
    const [arrayIndex, setArrayIndex] = useState('');
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

    // Array Operations
    const insertAtEnd = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        setArray(prev => [...prev, value]);
        setInputValue('');
        setHighlightIndex(array.length);
        setTimeout(() => setHighlightIndex(null), 500);
        showMessage(`Inserted ${value} at index ${array.length}`);
    }, [inputValue, array.length]);

    const insertAtIndex = useCallback(() => {
        const value = parseInt(inputValue);
        const index = parseInt(arrayIndex);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        if (isNaN(index) || index < 0 || index > array.length) {
            showMessage(`Invalid index (0-${array.length})`);
            return;
        }
        const newArray = [...array];
        newArray.splice(index, 0, value);
        setArray(newArray);
        setInputValue('');
        setArrayIndex('');
        setHighlightIndex(index);
        setTimeout(() => setHighlightIndex(null), 500);
        showMessage(`Inserted ${value} at index ${index}`);
    }, [inputValue, arrayIndex, array]);

    const deleteAtIndex = useCallback(() => {
        const index = parseInt(arrayIndex);
        if (isNaN(index) || index < 0 || index >= array.length) {
            showMessage(`Invalid index (0-${array.length - 1})`);
            return;
        }
        const deleted = array[index];
        setHighlightIndex(index);
        setTimeout(() => {
            setArray(prev => prev.filter((_, i) => i !== index));
            setHighlightIndex(null);
            showMessage(`Deleted ${deleted} from index ${index}`);
        }, 300);
        setArrayIndex('');
    }, [arrayIndex, array]);

    const accessIndex = useCallback(() => {
        const index = parseInt(arrayIndex);
        if (isNaN(index) || index < 0 || index >= array.length) {
            showMessage(`Invalid index (0-${array.length - 1})`);
            return;
        }
        setHighlightIndex(index);
        showMessage(`arr[${index}] = ${array[index]}`);
        setTimeout(() => setHighlightIndex(null), 1500);
    }, [arrayIndex, array]);

    const clearArray = useCallback(() => {
        setArray([]);
        setHighlightIndex(null);
        showMessage('Array cleared');
    }, []);

    const currentDS = DATA_STRUCTURES.find(ds => ds.id === selectedDS);

    return (
        <div className="ds-page">
            {/* Header */}
            <div className="ds-header">
                <h1 className="ds-title">
                    <span className="ds-icon">🗃️</span>
                    Data Structures
                </h1>
                <p className="ds-subtitle">Interactive visualization of fundamental data structures</p>
            </div>

            {/* Data Structure Selection */}
            <div className="ds-selection">
                {DATA_STRUCTURES.map(ds => (
                    <button
                        key={ds.id}
                        className={`ds-btn ${selectedDS === ds.id ? 'active' : ''}`}
                        onClick={() => setSelectedDS(ds.id)}
                    >
                        <span className="ds-btn-name">{ds.name}</span>
                        <span className="ds-btn-desc">{ds.description}</span>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="ds-content">
                {/* Visualizer Panel */}
                <div className="ds-visualizer-panel">
                    <div className="panel-header">
                        <h2>{currentDS?.name} Visualization</h2>
                    </div>

                    {/* Array Visualizer */}
                    {selectedDS === 'array' && (
                        <div className="array-visualizer">
                            <div className="array-container">
                                {array.length === 0 ? (
                                    <div className="array-empty">
                                        <span>Array is empty</span>
                                        <span className="array-hint">Add elements to get started</span>
                                    </div>
                                ) : (
                                    <div className="array-items">
                                        {array.map((value, index) => (
                                            <div
                                                key={index}
                                                className={`array-item ${highlightIndex === index ? 'highlighted' : ''}`}
                                            >
                                                <span className="array-value">{value}</span>
                                                <span className="array-index">{index}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="array-info">
                                <div className="info-item">
                                    <span className="info-label">Length:</span>
                                    <span className="info-value">{array.length}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Indices:</span>
                                    <span className="info-value">0 - {Math.max(0, array.length - 1)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stack Visualizer */}
                    {selectedDS === 'stack' && (
                        <div className="stack-visualizer">
                            <div className="stack-container">
                                {stack.length === 0 ? (
                                    <div className="stack-empty">
                                        <span>Stack is empty</span>
                                        <span className="stack-hint">Push elements to get started</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="stack-top-pointer">
                                            <span>TOP →</span>
                                        </div>
                                        <div className="stack-items">
                                            {stack.slice().reverse().map((item, reversedIndex) => {
                                                const actualIndex = stack.length - 1 - reversedIndex;
                                                const isTop = actualIndex === stack.length - 1;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`stack-item ${isTop ? 'top' : ''} ${item.isNew ? 'entering' : ''} ${item.isPopping ? 'exiting' : ''} ${peekValue !== null && isTop ? 'peeking' : ''}`}
                                                    >
                                                        <span className="stack-value">{item.value}</span>
                                                        <span className="stack-index">[{actualIndex}]</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="stack-base">
                                            <span>BOTTOM</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="stack-info">
                                <div className="info-item">
                                    <span className="info-label">Size:</span>
                                    <span className="info-value">{stack.length}</span>
                                </div>
                                {peekValue !== null && (
                                    <div className="info-item highlight">
                                        <span className="info-label">Top:</span>
                                        <span className="info-value">{peekValue}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Queue Visualizer */}
                    {selectedDS === 'queue' && (
                        <div className="queue-visualizer">
                            <div className="queue-container">
                                {queue.length === 0 ? (
                                    <div className="queue-empty">
                                        <span>Queue is empty</span>
                                        <span className="queue-hint">Enqueue elements to get started</span>
                                    </div>
                                ) : (
                                    <div className="queue-wrapper">
                                        <div className="queue-pointer front-pointer">
                                            <span>FRONT</span>
                                            <span className="pointer-arrow">↓</span>
                                        </div>
                                        <div className="queue-items">
                                            {queue.map((item, index) => {
                                                const isFront = index === 0;
                                                const isRear = index === queue.length - 1;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`queue-item ${isFront ? 'front' : ''} ${isRear ? 'rear' : ''} ${item.isNew ? 'entering' : ''} ${item.isDequeuing ? 'exiting' : ''} ${frontValue !== null && isFront ? 'peeking' : ''}`}
                                                    >
                                                        <span className="queue-value">{item.value}</span>
                                                        <span className="queue-index">[{index}]</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="queue-pointer rear-pointer">
                                            <span>REAR</span>
                                            <span className="pointer-arrow">↓</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="queue-info">
                                <div className="info-item">
                                    <span className="info-label">Size:</span>
                                    <span className="info-value">{queue.length}</span>
                                </div>
                                {frontValue !== null && (
                                    <div className="info-item highlight">
                                        <span className="info-label">Front:</span>
                                        <span className="info-value">{frontValue}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedDS === 'linkedlist' && (
                        <div className="coming-soon">
                            <span className="coming-soon-icon">🚧</span>
                            <span>Linked List visualization coming soon!</span>
                        </div>
                    )}

                    {selectedDS === 'hashtable' && (
                        <div className="coming-soon">
                            <span className="coming-soon-icon">🚧</span>
                            <span>Hash Table visualization coming soon!</span>
                        </div>
                    )}
                </div>

                {/* Controls Panel */}
                <div className="ds-controls-panel">
                    <div className="panel-header">
                        <h2>Operations</h2>
                    </div>

                    {/* Array Controls */}
                    {selectedDS === 'array' && (
                        <div className="array-controls">
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Value"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Index:</label>
                                    <input
                                        type="number"
                                        value={arrayIndex}
                                        onChange={(e) => setArrayIndex(e.target.value)}
                                        placeholder="0-..."
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="op-btn insert-end" onClick={insertAtEnd}>
                                    <span className="op-icon">➕</span>
                                    Insert End
                                </button>
                                <button className="op-btn insert-at" onClick={insertAtIndex}>
                                    <span className="op-icon">📍</span>
                                    Insert At
                                </button>
                                <button className="op-btn delete-at" onClick={deleteAtIndex} disabled={array.length === 0}>
                                    <span className="op-icon">🗑️</span>
                                    Delete At
                                </button>
                                <button className="op-btn access" onClick={accessIndex} disabled={array.length === 0}>
                                    <span className="op-icon">🔍</span>
                                    Access
                                </button>
                            </div>

                            <button className="op-btn clear full-width" onClick={clearArray} disabled={array.length === 0}>
                                <span className="op-icon">🗑️</span>
                                Clear All
                            </button>

                            {message && (
                                <div className="message-display">
                                    {message}
                                </div>
                            )}

                            <div className="operations-info">
                                <h3>Array Properties</h3>
                                <ul>
                                    <li><strong>Access:</strong> O(1) - Direct index access</li>
                                    <li><strong>Insert End:</strong> O(1) - Amortized</li>
                                    <li><strong>Insert At:</strong> O(n) - Shift elements</li>
                                    <li><strong>Delete:</strong> O(n) - Shift elements</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Stack Controls */}
                    {selectedDS === 'stack' && (
                        <div className="stack-controls">
                            <div className="input-group">
                                <label>Value:</label>
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && push()}
                                    placeholder="Enter a number"
                                />
                            </div>

                            <div className="button-group">
                                <button className="op-btn push" onClick={push}>
                                    <span className="op-icon">⬆️</span>
                                    Push
                                </button>
                                <button className="op-btn pop" onClick={pop} disabled={stack.length === 0}>
                                    <span className="op-icon">⬇️</span>
                                    Pop
                                </button>
                                <button className="op-btn peek" onClick={peek} disabled={stack.length === 0}>
                                    <span className="op-icon">👁️</span>
                                    Peek
                                </button>
                                <button className="op-btn clear" onClick={clearStack} disabled={stack.length === 0}>
                                    <span className="op-icon">🗑️</span>
                                    Clear
                                </button>
                            </div>

                            {message && (
                                <div className="message-display">
                                    {message}
                                </div>
                            )}

                            <div className="operations-info">
                                <h3>Stack Properties</h3>
                                <ul>
                                    <li><strong>Push:</strong> O(1) - Add to top</li>
                                    <li><strong>Pop:</strong> O(1) - Remove from top</li>
                                    <li><strong>Peek:</strong> O(1) - View top element</li>
                                    <li><strong>Type:</strong> LIFO (Last In First Out)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Queue Controls */}
                    {selectedDS === 'queue' && (
                        <div className="queue-controls">
                            <div className="input-group">
                                <label>Value:</label>
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                                    placeholder="Enter a number"
                                />
                            </div>

                            <div className="button-group">
                                <button className="op-btn enqueue" onClick={enqueue}>
                                    <span className="op-icon">➡️</span>
                                    Enqueue
                                </button>
                                <button className="op-btn dequeue" onClick={dequeue} disabled={queue.length === 0}>
                                    <span className="op-icon">⬅️</span>
                                    Dequeue
                                </button>
                                <button className="op-btn front-btn" onClick={front} disabled={queue.length === 0}>
                                    <span className="op-icon">👁️</span>
                                    Front
                                </button>
                                <button className="op-btn clear" onClick={clearQueue} disabled={queue.length === 0}>
                                    <span className="op-icon">🗑️</span>
                                    Clear
                                </button>
                            </div>

                            {message && (
                                <div className="message-display">
                                    {message}
                                </div>
                            )}

                            <div className="operations-info">
                                <h3>Queue Properties</h3>
                                <ul>
                                    <li><strong>Enqueue:</strong> O(1) - Add to rear</li>
                                    <li><strong>Dequeue:</strong> O(1) - Remove from front</li>
                                    <li><strong>Front:</strong> O(1) - View front element</li>
                                    <li><strong>Type:</strong> FIFO (First In First Out)</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
