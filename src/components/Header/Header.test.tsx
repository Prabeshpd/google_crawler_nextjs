import React from 'react';

import { render, screen } from '@testing-library/react';
import { useSelectedLayoutSegment } from 'next/navigation';

import Header from './Header';

jest.mock('next/navigation', () => ({ useSelectedLayoutSegment: jest.fn() }));

describe('Header', () => {
  describe('renders the component', () => {
    it('renders the header component', async () => {
      render(<Header />);

      expect(useSelectedLayoutSegment as jest.Mock).toHaveBeenCalled();
      expect(screen.getByText('Upload Keywords')).toBeInTheDocument();
      expect(screen.getByText('Log out')).toBeInTheDocument();
    });
  });

  describe('given the page is in navbar', () => {
    it('adds active property to class name', async () => {
      (useSelectedLayoutSegment as jest.Mock).mockReturnValue('upload');

      render(<Header />);

      const element = screen.getByText('Upload Keywords');

      expect(element.classList.contains('app-header__link--active')).toBe(true);
    });
  });
});
