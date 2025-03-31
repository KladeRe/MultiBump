import { render, screen } from '@testing-library/react';
import RoomFull from '../menus/RoomFull';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('RoomFull component', () => {
  it('should include expected text', async () => {
    render(<RoomFull />);
    expect(screen.getByText('Room is already full, please join another room')).toBeInTheDocument();
  });
  it('should include all buttons', async () => {
    render(<RoomFull />);
    expect(screen.getByRole('button', { name: 'Return to room login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to room creation' })).toBeInTheDocument();
  });
});