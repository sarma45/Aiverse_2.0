import { register, login } from '../controllers/authController';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      req.body = { email: 'test@example.com', password: 'password', name: 'Test' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (User.create as jest.Mock).mockResolvedValue({ _id: '1', email: 'test@example.com', name: 'Test', role: 'user' });
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: 'User registered successfully',
        token: 'token'
      }));
    });

    it('should fail if user exists', async () => {
      req.body = { email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue({ _id: '1' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });
});
