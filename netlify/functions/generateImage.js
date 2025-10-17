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
        // Extract prompt from path: /generate/image/prompt/hello world
        const path = event.path;
        const promptMatch = path.match(/\/generate\/image\/prompt\/(.+)/);
        
        if (!promptMatch) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Invalid URL format. Use: /generate/image/prompt/your text here',
                    example: 'https://text2videoapi.netlify.app/generate/image/prompt/mountain landscape'
                })
            };
        }

        const prompt = decodeURIComponent(promptMatch[1]);
        console.log('Image prompt:', prompt);

        // Image API call - direct image data get karenge
        const imageApiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        
        console.log('Calling Image API:', imageApiUrl);
        
        // Image data as buffer mein receive karenge
        const imageResponse = await axios.get(imageApiUrl, {
            responseType: 'arraybuffer'
        });

        // Image data directly return karenge
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `inline; filename="generated-image.jpg"`,
                'Cache-Control': 'public, max-age=3600'
            },
            body: imageResponse.data.toString('base64'),
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('Image API Error:', error.message);
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Image generation failed',
                message: error.message
            })
        };
    }
};
