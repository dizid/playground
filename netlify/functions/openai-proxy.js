// netlify/functions/openai-proxy.js

// Load environment variables from .env file during development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const OpenAI = require('openai');

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const { messages, extraInstruction } = body;

        // Verify API key is available
        if (!process.env.VITE_CHATGPT_APIKEY) {
            console.error('VITE_CHATGPT_APIKEY key is missing');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Create OpenAI client using environment variable
        const openai = new OpenAI({
            apiKey: process.env.VITE_CHATGPT_APIKEY,
            organization: process.env.VITE_CHATGPT_ORG // Optional, if you have an org ID
        });

        // Prepare system message with personality if selected
        let systemMessage = "You are a helpful assistant.";
        if (extraInstruction) {
            systemMessage = `You are a helpful assistant with a ${extraInstruction} personality. Always respond in a ${extraInstruction} tone.`;
        }

        // Prepare API request
        const chatMessages = [
            { role: "system", content: systemMessage },
            ...messages
        ];

        // Make API call
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: chatMessages
        });

        // Return the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: completion.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing your request' })
        };
    }
};