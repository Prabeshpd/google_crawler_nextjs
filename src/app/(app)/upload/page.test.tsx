import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import Upload from './page';

describe('Upload', () => {
  it('renders the component', async () => {
    render(<Upload />);

    await waitFor(() => {
      expect(screen.getByText('Upload CSV file with keywords')).toBeInTheDocument();
    });
  });
});
