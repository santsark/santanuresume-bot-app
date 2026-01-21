import { logger } from '../../../lib/logger';

describe('Logger', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should log info messages correctly', () => {
        logger.info('Test message', { key: 'value' });
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('"level":"info"')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('"message":"Test message"')
        );
    });
});
