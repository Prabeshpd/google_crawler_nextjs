import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import AppPage from './page';
import { fetchCurrentUserAction } from '../actions/action';

jest.mock('../actions/action', () => ({
  fetchCurrentUserAction: jest.fn(),
}));

describe('AppPage', () => {
  it('renders the component', async () => {
    (fetchCurrentUserAction as jest.Mock).mockResolvedValue({ name: 'John' });
    render(<AppPage />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to Application John')).toBeInTheDocument();
    });
  });
});
