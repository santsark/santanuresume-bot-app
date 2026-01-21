
/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@upstash/redis', () => ({
    Redis: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@upstash/ratelimit', () => ({
    Ratelimit: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue({ success: true }),
    })),
}));

const mockModel = { id: 'gpt-4o' };
jest.mock('@ai-sdk/openai', () => ({
    openai: jest.fn().mockReturnValue({ id: 'gpt-4o' }),
}));

jest.mock('ai', () => ({
    streamText: jest.fn().mockReturnValue({
        toDataStreamResponse: jest.fn().mockReturnValue(new Response('Mock Stream')),
    }),
}));

describe('Content API Integration', () => {
    it('should return 400 for invalid input', async () => {
        const req = new NextRequest('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages: "invalid" }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it('should pass valid input to streamText', async () => {
        const req = new NextRequest('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        // We could verify streamText was called with specific args if we assigned the mock to a variable
        const { streamText } = require('ai');
        expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
            temperature: 0.7,
            model: expect.anything(),
        }));
    });
});
