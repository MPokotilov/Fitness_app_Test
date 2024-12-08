const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(function () {
      return mockAxios;
    }),
  };
  
  export default mockAxios;
  