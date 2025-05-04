// netlify/functions/advice-proxy.js 

const fetch = require('node-fetch');

exports.handler = async function (event) {
    const { queryStringParameters, path } = event;
    let apiUrl = 'https://api.adviceslip.com/advice';

    // If searching, append the search path
    if (queryStringParameters && queryStringParameters.search) {
        apiUrl = `https://api.adviceslip.com/advice/search/${encodeURIComponent(queryStringParameters.search)}`;
    }

    try {
        const apiRes = await fetch(apiUrl);
        const data = await apiRes.text(); // API returns JSON, but we forward as text

        return {
            statusCode: 200,
            body: data,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch advice.' })
        };
    }
};
