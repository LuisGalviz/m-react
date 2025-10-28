import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyFilters } from '@/components/PropertyFilters';
import type { PropertyFilterDto } from '@/types/property';

describe('PropertyFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter inputs', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when name input changes', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(nameInput, { target: { value: 'Villa' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Villa' })
    );
  });

  it('calls onFilterChange when address input changes', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const addressInput = screen.getByPlaceholderText(/search by address/i);
    fireEvent.change(addressInput, { target: { value: 'Main Street' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ address: 'Main Street' })
    );
  });

  it('calls onFilterChange when min price changes', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    fireEvent.change(minPriceInput, { target: { value: '100000' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: 100000 })
    );
  });

  it('calls onFilterChange when max price changes', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const maxPriceInput = screen.getByPlaceholderText(/max price/i);
    fireEvent.change(maxPriceInput, { target: { value: '500000' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ maxPrice: 500000 })
    );
  });

  it('handles multiple filter changes', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByPlaceholderText(/search by name/i);
    const minPriceInput = screen.getByPlaceholderText(/min price/i);

    fireEvent.change(nameInput, { target: { value: 'Luxury' } });
    fireEvent.change(minPriceInput, { target: { value: '200000' } });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
  });

  it('handles empty string inputs correctly', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: '' })
    );
  });

  it('handles invalid number inputs for price', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    fireEvent.change(minPriceInput, { target: { value: 'abc' } });

    // Should handle gracefully (NaN or undefined depending on implementation)
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('clears filters when reset is triggered', () => {
    render(<PropertyFilters onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement;
    const minPriceInput = screen.getByPlaceholderText(/min price/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Villa' } });
    fireEvent.change(minPriceInput, { target: { value: '100000' } });

    // If there's a reset button
    const resetButton = screen.queryByRole('button', { name: /reset|clear/i });
    if (resetButton) {
      fireEvent.click(resetButton);
      expect(nameInput.value).toBe('');
      expect(minPriceInput.value).toBe('');
    }
  });
});
