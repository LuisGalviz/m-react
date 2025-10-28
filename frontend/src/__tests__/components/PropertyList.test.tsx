import { render, screen } from '@testing-library/react';
import { PropertyList } from '@/components/PropertyList';
import type { PropertyDto } from '@/types/property';

// Mock PropertyCard component
jest.mock('@/components/PropertyCard', () => ({
  PropertyCard: ({ property }: { property: PropertyDto }) => (
    <div data-testid="property-card">{property.name}</div>
  ),
}));

describe('PropertyList', () => {
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

  it('renders all properties when provided', () => {
    render(<PropertyList properties={mockProperties} />);

    const propertyCards = screen.getAllByTestId('property-card');
    expect(propertyCards).toHaveLength(2);
    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
  });

  it('renders empty state when no properties provided', () => {
    render(<PropertyList properties={[]} />);

    expect(screen.getByText(/no properties found/i)).toBeInTheDocument();
    expect(screen.queryByTestId('property-card')).not.toBeInTheDocument();
  });

  it('renders grid layout with correct classes', () => {
    const { container } = render(<PropertyList properties={mockProperties} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles single property correctly', () => {
    const singleProperty = [mockProperties[0]];
    render(<PropertyList properties={singleProperty} />);

    const propertyCards = screen.getAllByTestId('property-card');
    expect(propertyCards).toHaveLength(1);
    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
  });

  it('handles large number of properties', () => {
    const manyProperties = Array.from({ length: 20 }, (_, i) => ({
      idProperty: `${i + 1}`,
      idOwner: `owner${i + 1}`,
      name: `Property ${i + 1}`,
      address: `${i + 1} Street`,
      price: 100000 + i * 10000,
    }));

    render(<PropertyList properties={manyProperties} />);

    const propertyCards = screen.getAllByTestId('property-card');
    expect(propertyCards).toHaveLength(20);
  });
});
