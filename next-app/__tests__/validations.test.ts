import { UserSchema, ToolSchema } from '@/lib/validations';

describe('Zod Schema Validations', () => {
  test('UserSchema should validate correct user data', () => {
    const validUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  test('UserSchema should fail on invalid email', () => {
    const invalidUser = { name: 'Test User', email: 'invalid-email', password: 'password123' };
    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  test('ToolSchema should validate correct tool data', () => {
    const validTool = {
      name: 'Test Tool',
      description: 'A tool for testing purposes.',
      category: 'chat',
      url: 'https://testtool.com',
      pricingModel: 'free'
    };
    const result = ToolSchema.safeParse(validTool);
    expect(result.success).toBe(true);
  });
});
