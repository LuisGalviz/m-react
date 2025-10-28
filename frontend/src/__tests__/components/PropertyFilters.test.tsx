import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyFilters } from '@/components/PropertyFilters';

describe('PropertyFilters', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<PropertyFilters onFilter={mockOnFilter} />);
    expect(container).toBeTruthy();
  });

  it('calls onFilter with empty object when clear is clicked', () => {
    render(<PropertyFilters onFilter={mockOnFilter} />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockOnFilter).toHaveBeenCalledWith({});
  });

  it('shows loading state when isLoading is true', () => {
    render(<PropertyFilters onFilter={mockOnFilter} isLoading={true} />);

    expect(screen.getByText(/searching.../i)).toBeInTheDocument();
  });

  it('disables buttons when isLoading is true', () => {
    render(<PropertyFilters onFilter={mockOnFilter} isLoading={true} />);

    const searchButton = screen.getByRole('button', { name: /searching.../i });
    const clearButton = screen.getByRole('button', { name: /clear filters/i });

    expect(searchButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
});
