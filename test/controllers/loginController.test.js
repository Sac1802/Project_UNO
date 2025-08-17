import * as loginController from '../../controllers/loginController.js';
import { LoginService } from '../../services/loginService.js';

jest.mock('../../services/loginService.js');

describe('loginController', () => {
  let req, res, next, mockLoginService;

  beforeEach(() => {
    req = { body: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();

    mockLoginService = {
      loginUser: jest.fn(),
      logoutUser: jest.fn()
    };
    LoginService.mockImplementation(() => mockLoginService);
  });

  describe('login', () => {
    it('should return 200 if login is successful', async () => {
      req.body = { username: 'test', password: '123' };
      const mockResult = { isRight: jest.fn().mockReturnValue(true) };
      mockLoginService.loginUser.mockResolvedValue(mockResult);

      await loginController.login(req, res, next);

      expect(mockLoginService.loginUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return error if login fails', async () => {
      req.body = { username: 'wrong', password: 'bad' };
      const mockError = { statusCode: 401, message: 'Invalid credentials' };
      const mockResult = {
        isRight: jest.fn().mockReturnValue(false),
        getError: jest.fn().mockReturnValue(mockError)
      };
      mockLoginService.loginUser.mockResolvedValue(mockResult);

      await loginController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should call next on exception', async () => {
      const err = new Error('Boom');
      mockLoginService.loginUser.mockRejectedValue(err);

      await loginController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('logout', () => {
    it('should return 200 when logout successful', async () => {
      req.headers.autorization = 'token123';
      mockLoginService.logoutUser.mockResolvedValue({ success: true });

      await loginController.logout(req, res, next);

      expect(mockLoginService.logoutUser).toHaveBeenCalledWith('token123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should call next if logout throws error', async () => {
      const err = new Error('Logout failed');
      req.headers.autorization = 'token123';
      mockLoginService.logoutUser.mockRejectedValue(err);

      await loginController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });

    it('should call logout with undefined if token missing', async () => {
      req.headers = {}; // no token
      mockLoginService.logoutUser.mockResolvedValue({ success: true });

      await loginController.logout(req, res, next);

      expect(mockLoginService.logoutUser).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
