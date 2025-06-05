const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtDecode } = require('jwt-decode');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

// guardar conversaciones de chat en memoria RAM (en lugar de una base de datos)
const chatSessions = {}

router.post("/", async (req, res) => {
    const { message } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    // search for the user in the database
    const user = await User.findById(decodedToken.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Invalid message format - message must be a string' });
    }

    // Initialize chat session for the user if it doesn't exist
    if (!chatSessions[user._id]) {
        chatSessions[user._id] = ai.chats.create({
            model: "gemini-2.0-flash",
            systemInstruction: "eres una asistente que resuelve las dudas de los usuarios en una plataforma llamada 'Dashboard de sostenibilidad'. Tu objetivo es ayudar a los usuarios a entender y utilizar la plataforma de manera efectiva. Responde a las preguntas de los usuarios de manera clara y concisa, proporcionando información útil y relevante.",
            history: [{
                role: "model",
                content: "Hi! How can I help you today?"
            }]
        });
    }

    const chat = chatSessions[user._id];

    try{
        const stream = await chat.sendMessageStream({
            message,
            generationConfig:{
                maxOutputTokens: 500,
                temperature: 1.3,
            }
        });
        let response = '';

        for await (const chunk of stream) {
            response += chunk.text;
        }
        // Save the message and  response to the chat history
        chat.history.push({
            role: 'user',
            content: message
        });
        chat.history.push({
            role: 'model',
            content: response
        });
        return res.status(200).json({ response });

    }catch (error) {
        console.error('Error in /api/agents route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});

// Endpoint to clear chat session for a user
router.post("/clear", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    // search for the user in the database
    const user = await User.findById(decodedToken.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Clear chat session for the user
    if (chatSessions[user._id]) {
        delete chatSessions[user._id];
    }

    return res.status(200).json({ message: 'Chat session cleared' });
});

module.exports = router;
