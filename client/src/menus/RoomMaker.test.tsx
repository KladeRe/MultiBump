import { render, screen } from '@testing-library/react';
import RoomMaker from '../menus/RoomMaker';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Login component', () => {
  it('should include expected text', async () => {
    render(<RoomMaker />);
    expect(screen.getByText('Room creator')).toBeInTheDocument();
  });
  it('should include a return button', async () => {
    render(<RoomMaker />);
    expect(screen.getByRole('button', { name: 'Create Room' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to room login' })).toBeInTheDocument();
  });
});