const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'websocket-server' });
});

// Active visualization sessions
const sessions = new Map();

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join visualization room
    socket.on('join-visualization', (data) => {
        const { sessionId, algorithm } = data;
        socket.join(sessionId);
        sessions.set(socket.id, { sessionId, algorithm, step: 0 });
        console.log(`Client ${socket.id} joined session ${sessionId}`);

        socket.emit('joined', { sessionId, message: 'Connected to visualization session' });
    });

    // Start visualization playback
    socket.on('start-playback', (data) => {
        const { steps, speed = 500 } = data;
        const session = sessions.get(socket.id);

        if (!session) {
            socket.emit('error', { message: 'No active session' });
            return;
        }

        let currentStep = 0;
        session.playing = true;
        session.interval = setInterval(() => {
            if (!session.playing || currentStep >= steps.length) {
                clearInterval(session.interval);
                session.playing = false;
                socket.emit('playback-complete', { totalSteps: steps.length });
                return;
            }

            socket.emit('step', {
                step: steps[currentStep],
                stepIndex: currentStep,
                totalSteps: steps.length
            });
            currentStep++;
        }, speed);
    });

    // Pause playback
    socket.on('pause-playback', () => {
        const session = sessions.get(socket.id);
        if (session && session.interval) {
            clearInterval(session.interval);
            session.playing = false;
            socket.emit('paused', { message: 'Playback paused' });
        }
    });

    // Step forward/backward
    socket.on('step-control', (data) => {
        const { direction, steps, currentIndex } = data;
        let newIndex = direction === 'forward'
            ? Math.min(currentIndex + 1, steps.length - 1)
            : Math.max(currentIndex - 1, 0);

        socket.emit('step', {
            step: steps[newIndex],
            stepIndex: newIndex,
            totalSteps: steps.length
        });
    });

    // Speed change
    socket.on('change-speed', (data) => {
        const session = sessions.get(socket.id);
        if (session) {
            session.speed = data.speed;
            socket.emit('speed-changed', { speed: data.speed });
        }
    });

    // Collaborative features - broadcast to room
    socket.on('cursor-move', (data) => {
        const session = sessions.get(socket.id);
        if (session) {
            socket.to(session.sessionId).emit('remote-cursor', {
                id: socket.id,
                ...data
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const session = sessions.get(socket.id);
        if (session) {
            if (session.interval) clearInterval(session.interval);
            sessions.delete(socket.id);
        }
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});

module.exports = { app, server, io };
