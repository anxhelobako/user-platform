import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login when unauthenticated', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
