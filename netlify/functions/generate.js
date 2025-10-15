const axios = require('axios');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const path = event.path;
        const promptMatch = path.match(/\/generate\/prompt\/(.+)/);
        
        if (!promptMatch) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt not found' })
            };
        }

        const prompt = decodeURIComponent(promptMatch[1]);
        
        // Original API call
        const apiUrl = `https://texttovideoapi.anshapi.workers.dev/generate?prompt=${encodeURIComponent(prompt)}`;
        const apiResponse = await axios.get(apiUrl);

        // YAHAN CHANGE KARNA HAI - developer field
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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};
