const axios = require('axios');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Extract prompt from path
        const path = event.path;
        console.log('Full path:', path);
        
        // Pattern: /generate/prompt/your prompt here
        const promptMatch = path.match(/\/generate\/prompt\/(.+)/);
        
        if (!promptMatch) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid URL format. Use: /generate/prompt/your text here' })
            };
        }

        const prompt = decodeURIComponent(promptMatch[1]);
        console.log('Extracted prompt:', prompt);

        // Your actual API call
        const apiUrl = `https://texttovideoapi.anshapi.workers.dev/generate?prompt=${encodeURIComponent(prompt)}`;
        console.log('Calling API:', apiUrl);
        
        const apiResponse = await axios.get(apiUrl);
        console.log('API Response:', apiResponse.data);

        // Modify developer field
        const modifiedData = {
            ...apiResponse.data,
            developer: "t.me/Tech_Anish"
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(modifiedData)
        };

    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                details: error.response?.data
            })
        };
    }
};
