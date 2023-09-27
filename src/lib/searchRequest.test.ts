/**
 * @jest-environment node
 */

import searchRequest, { USER_AGENT_HEADER } from './searchRequest';

jest.mock('./searchRequest', () => {
  const originalModule = jest.requireActual('./searchRequest');

  return {
    __esModule: true,
    getUserAgentHeader: jest.fn(),
    ...originalModule,
  };
});

describe('Axios Request', () => {
  it('increases retry count if error is thrown on response', async () => {
    await expect(
      searchRequest.interceptors.response.handlers[0].rejected({
        response: { status: 500 },
        config: { retryCount: 1 },
      })
    ).rejects.toMatchObject({ config: { retryCount: 2 } });
  });

  it('adds user agent header if it is not present on the request header', async () => {
    const result = searchRequest.interceptors.request.handlers[0].fulfilled({ headers: {} });

    expect(result.headers).toHaveProperty(USER_AGENT_HEADER);
  });
});
