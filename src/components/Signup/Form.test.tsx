import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SignUpForm } from './Form';

describe('SignUp Form:', () => {
  const handleFormSubmit = jest.fn();

  it('renders the component', () => {
    render(<SignUpForm handleFormSubmit={handleFormSubmit} />);

    const inputNameElement = screen.getByPlaceholderText('Name');
    expect(inputNameElement).toHaveAttribute('type', 'text');
    expect(inputNameElement).toHaveValue('');

    const inputEmailElement = screen.getByPlaceholderText('email');
    expect(inputEmailElement).toHaveAttribute('type', 'email');
    expect(inputEmailElement).toHaveValue('');

    const inputPasswordElement = screen.getByPlaceholderText('password');
    expect(inputPasswordElement).toHaveAttribute('type', 'password');
    expect(inputPasswordElement).toHaveValue('');

    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButtonElement).toHaveAttribute('type', 'submit');

    const resetButtonElement = screen.getByRole('button', { name: 'Cancel' });
    expect(resetButtonElement).toHaveAttribute('type', 'reset');
  });

  it('submits the form"s input values on submit', async () => {
    render(<SignUpForm handleFormSubmit={handleFormSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Name'), 'John');
    await user.type(screen.getByPlaceholderText('email'), 'john.dee@gmail.com');
    await user.type(screen.getByPlaceholderText('password'), 'Admin@123');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() =>
      expect(handleFormSubmit).toHaveBeenCalledWith({
        email: 'john.dee@gmail.com',
        name: 'John',
        password: 'Admin@123',
      })
    );
  });
});
