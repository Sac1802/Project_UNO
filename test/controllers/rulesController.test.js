import { jest } from '@jest/globals';
import { nextTurn, skipPlayer, reverseOrder, carPlay } from '../../controllers/rulesController.js';
import { rulesService } from '../../controllers/rulesController.js';

jest.mock('../../services/rulesServices.js', () => ({
    RulesService: jest.fn().mockImplementation(() => ({
        nextTurn: jest.fn(),
        skipPlayer: jest.fn(),
        reverseOrder: jest.fn(),
        carPlay: jest.fn(),
    })),
}));

describe('rulesController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('nextTurn', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            rulesService.nextTurn.mockResolvedValue(response);
            req.body.idGame = 1;
            await nextTurn(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return 404 and error message', async () => {
            const error = { message: 'Error' };
            const response = { isRight: () => false, left: error };
            rulesService.nextTurn.mockResolvedValue(response);
            req.body.idGame = 1;
            await nextTurn(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
        });
    });

    describe('skipPlayer', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            rulesService.skipPlayer.mockResolvedValue(response);
            req.body.idGame = 1;
            req.body.cardId = 1;
            await skipPlayer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return 404 and error message', async () => {
            const error = { message: 'Error' };
            const response = { isRight: () => false, left: error };
            rulesService.skipPlayer.mockResolvedValue(response);
            req.body.idGame = 1;
            req.body.cardId = 1;
            await skipPlayer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
        });
    });

    describe('reverseOrder', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            rulesService.reverseOrder.mockResolvedValue(response);
            req.body.idGame = 1;
            await reverseOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return 404 and error message', async () => {
            const error = { message: 'Error' };
            const response = { isRight: () => false, left: error };
            rulesService.reverseOrder.mockResolvedValue(response);
            req.body.idGame = 1;
            await reverseOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
        });
    });

    describe('carPlay', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            rulesService.carPlay.mockResolvedValue(response);
            req.body.idGame = 1;
            req.user.playerId = 1;
            await carPlay(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return 404 and error message', async () => {
            const error = { message: 'Error' };
            const response = { isRight: () => false, left: error };
            rulesService.carPlay.mockResolvedValue(response);
            req.body.idGame = 1;
            req.user.playerId = 1;
            await carPlay(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
        });
    });
});