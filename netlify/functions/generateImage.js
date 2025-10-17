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
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid URL format. Use: /generate/image/prompt/your text here',
                    example: 'https://text2videoapi.netlify.app/generate/image/prompt/mountain landscape'
                })
            };
        }

        const prompt = decodeURIComponent(promptMatch[1]);
        console.log('Image prompt:', prompt);

        // Image API call - direct URL bana rahe hain
        const imageApiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        
        // We'll return the direct URL (no modification needed)
        const responseData = {
            success: true,
            prompt: prompt,
            url: imageApiUrl,
            type: "image",
            generated_at: new Date().toISOString()
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('Image API Error:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Image generation failed',
                message: error.message
            })
        };
    }
};
