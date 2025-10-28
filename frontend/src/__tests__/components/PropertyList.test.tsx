import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyList } from '@/components/PropertyList';
import { propertyService } from '@/services/propertyService';
import type { PropertyDto } from '@/types/property';

// Mock the propertyService
jest.mock('@/services/propertyService');
const mockedPropertyService = propertyService as jest.Mocked<typeof propertyService>;

// Mock PropertyFilters component
jest.mock('@/components/PropertyFilters', () => ({
  PropertyFilters: ({ onFilter }: { onFilter: (filters: any) => void }) => (
    <div data-testid="property-filters">Filters</div>
  ),
}));

// Mock PropertyCard component
jest.mock('@/components/PropertyCard', () => ({
  PropertyCard: ({ property }: { property: PropertyDto }) => (
    <div data-testid="property-card">{property.name}</div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('PropertyList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProperties: PropertyDto[] = [
    {
      idProperty: '1',
      idOwner: 'owner1',
      name: 'Beautiful House',
      address: '123 Main St',
      price: 250000,
      image: 'https://example.com/image1.jpg',
    },
    {
      idProperty: '2',
      idOwner: 'owner2',
      name: 'Modern Apartment',
      address: '456 Oak Ave',
      price: 180000,
      image: 'https://example.com/image2.jpg',
    },
  ];

  it('renders loading state initially', () => {
    mockedPropertyService.getProperties.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<PropertyList />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading properties/i)).toBeInTheDocument();
  });

  it('renders properties when data is loaded', async () => {
    mockedPropertyService.getProperties.mockResolvedValue(mockProperties);

    render(<PropertyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    });

    const propertyCards = screen.getAllByTestId('property-card');
    expect(propertyCards).toHaveLength(2);
  });

  it('renders empty state when no properties', async () => {
    mockedPropertyService.getProperties.mockResolvedValue([]);

    render(<PropertyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/no properties found/i)).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    mockedPropertyService.getProperties.mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<PropertyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/error loading properties/i)).toBeInTheDocument();
    });
  });

  it('renders property count', async () => {
    mockedPropertyService.getProperties.mockResolvedValue(mockProperties);

    render(<PropertyList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/found 2 properties/i)).toBeInTheDocument();
    });
  });
});
