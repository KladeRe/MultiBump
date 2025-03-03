import { render, screen } from '@testing-library/react';
import Login from '../menus/Login';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Login component', () => {
  it('should include expected text', async () => {
    render(<Login/>);
    expect(screen.getByText('Welcome to multiBump')).toBeInTheDocument();
  });
  it('should include all buttons', async () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: 'Join Room' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Room' })).toBeInTheDocument();
  });
});