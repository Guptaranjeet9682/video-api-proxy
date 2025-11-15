const axios = require('axios');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Extract prompt from path: /generate/video/prompt/hello world
        const path = event.path;
        const promptMatch = path.match(/\/generate\/video\/prompt\/(.+)/);
        
        if (!promptMatch) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid URL format. Use: /generate/video/prompt/your text here',
                    example: 'https://text2videoapi.netlify.app/generate/video/prompt/beautiful sunset'
                })
            };
        }

        const prompt = decodeURIComponent(promptMatch[1]);
        console.log('Video prompt:', prompt);

        // Your actual Video API call
        const apiUrl = `https://texttovideov2.alphaapi.workers.dev/api/?prompt=${encodeURIComponent(prompt)}`;
        const apiResponse = await axios.get(apiUrl);

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
        console.error('Video API Error:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Video generation failed',
                message: error.message
            })
        };
    }
};
