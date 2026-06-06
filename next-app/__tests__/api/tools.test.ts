import { GET } from '@/app/api/tools/route';

jest.mock('@/lib/db', () => jest.fn());
jest.mock('@/lib/models/Tool', () => ({
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: '1', name: 'Mock Tool', description: 'A mock tool' }
      ])
    })
  })
}));
jest.mock('@/lib/cache', () => ({
  fetchWithCache: jest.fn().mockImplementation((key, fetcher) => fetcher())
}));

describe('/api/tools GET', () => {
  it('should return a list of tools', async () => {
    const req = new Request('http://localhost:3000/api/tools');
    const res = await GET(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.data.tools.length).toBe(1);
    expect(data.data.tools[0].name).toBe('Mock Tool');
  });
});
