import { updateTool, deleteTool } from '../controllers/toolController';
import Tool from '../models/Tool';
import { AppError } from '../middleware/errorHandler';

jest.mock('../models/Tool');

describe('Tool Controller Security', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { params: { id: 'tool_123' }, body: {}, user: { id: 'user_1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('deleteTool', () => {
    it('should allow author to delete', async () => {
      (Tool.findById as jest.Mock).mockResolvedValue({ _id: 'tool_123', author: 'user_1' });
      (Tool.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      await deleteTool(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should deny non-author from deleting', async () => {
      (Tool.findById as jest.Mock).mockResolvedValue({ _id: 'tool_123', author: 'user_999' });
      req.user.id = 'user_1';

      await deleteTool(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });

    it('should allow admin to delete any tool', async () => {
      (Tool.findById as jest.Mock).mockResolvedValue({ _id: 'tool_123', author: 'user_999' });
      req.user.id = 'user_admin';
      req.user.role = 'admin';
      (Tool.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      await deleteTool(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
