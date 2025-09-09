
import { jest } from '@jest/globals';
import { dealtCards, playCard, drawCard, sayUno, challengerSayUno, finishGame, getStatusGame, getPlayerCards, getHistoryTurns } from '../../controllers/dealtCardsController.js';
import { PlayCarService } from '../../services/dealtCardsService.js';

jest.mock('../../services/dealtCardsService.js');

describe('dealtCardsController', () => {
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
    });

    describe('dealtCards', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.dealtCard.mockResolvedValue(response);
            req.body.idGame = 1;
            req.body.maxCardsPerPlayer = 7;
            await dealtCards(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.dealtCard.mockResolvedValue(response);
            req.body.idGame = 1;
            req.body.maxCardsPerPlayer = 7;
            await dealtCards(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('playCard', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.playCard.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.cardId = 1;
            req.body.idGame = 1;
            await playCard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.playCard.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.cardId = 1;
            req.body.idGame = 1;
            await playCard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('drawCard', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.drawCard.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await drawCard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.drawCard.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await drawCard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('sayUno', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.sayUno.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await sayUno(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.sayUno.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await sayUno(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('challengerSayUno', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.challengerSayUno.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idPlayerDefender = 2;
            req.body.idGame = 1;
            await challengerSayUno(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.challengerSayUno.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idPlayerDefender = 2;
            req.body.idGame = 1;
            await challengerSayUno(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('finishGame', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.finishGame.mockResolvedValue(response);
            req.body.idGame = 1;
            await finishGame(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.finishGame.mockResolvedValue(response);
            req.body.idGame = 1;
            await finishGame(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('getStatusGame', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.getGameStatus.mockResolvedValue(response);
            req.body.idGame = 1;
            await getStatusGame(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.getGameStatus.mockResolvedValue(response);
            req.body.idGame = 1;
            await getStatusGame(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('getPlayerCards', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.getCardsPlayer.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await getPlayerCards(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.getCardsPlayer.mockResolvedValue(response);
            req.user.playerId = 1;
            req.body.idGame = 1;
            await getPlayerCards(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('getHistoryTurns', () => {
        it('should return 200 and the response from the service', async () => {
            const response = { isRight: () => true, right: 'success' };
            PlayCarService.prototype.getHistory.mockResolvedValue(response);
            req.body.idGame = 1;
            await getHistoryTurns(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('success');
        });

        it('should return error status and message', async () => {
            const error = { statusCode: 400, message: 'Error' };
            const response = { isRight: () => false, getError: () => error };
            PlayCarService.prototype.getHistory.mockResolvedValue(response);
            req.body.idGame = 1;
            await getHistoryTurns(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });
});
