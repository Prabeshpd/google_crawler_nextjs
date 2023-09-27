import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Login } from './Form';

describe('Login Form:', () => {
  const handleFormSubmit = jest.fn();

  it('renders the component', () => {
    render(<Login handleFormSubmit={handleFormSubmit} />);

    const inputEmailElement = screen.getByPlaceholderText('email');
    expect(inputEmailElement).toHaveAttribute('type', 'email');
    expect(inputEmailElement).toHaveValue('');

    const inputPasswordElement = screen.getByPlaceholderText('password');
    expect(inputPasswordElement).toHaveAttribute('type', 'password');
    expect(inputPasswordElement).toHaveValue('');

    const submitButtonElement = screen.getByRole('button', { name: 'Login' });
    expect(submitButtonElement).toHaveAttribute('type', 'submit');

    const resetButtonElement = screen.getByRole('button', { name: 'Cancel' });
    expect(resetButtonElement).toHaveAttribute('type', 'reset');
  });

  it('submits the form"s input values on submit', async () => {
    render(<Login handleFormSubmit={handleFormSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('email'), 'john.dee@gmail.com');
    await user.type(screen.getByPlaceholderText('password'), 'Admin@123');

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(handleFormSubmit).toHaveBeenCalledWith({
        email: 'john.dee@gmail.com',
        password: 'Admin@123',
      })
    );
  });
});
