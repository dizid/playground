import { Configuration, OpenAIApi } from 'openai';

// Load environment variables from .env.local (Netlify handles this)
const apiKey = process.env.VITE_CHATGPT_APIKEY;

export async function handler(event) {
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'VITE_CHATGPT_APIKEY environment variable not set.' }),
        };
    }

    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const requestBody = JSON.parse(event.body);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // Or any other suitable model
            messages: requestBody.messages,
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: completion.data.choices[0].message }),
        };
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to call OpenAI API' }),
        };
    }
}