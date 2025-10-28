import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertyDto } from '@/types/property';

// Mock Next.js Link and Image
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('PropertyCard', () => {
  const mockProperty: PropertyDto = {
    idProperty: '1',
    idOwner: 'owner1',
    name: 'Beautiful House',
    address: '123 Main St',
    price: 250000,
    image: 'https://example.com/image.jpg',
  };

  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
  });

  it('renders without image', () => {
    const propertyWithoutImage = { ...mockProperty, image: undefined };
    render(<PropertyCard property={propertyWithoutImage} />);

    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
  });

  it('creates correct link to property detail page', () => {
    render(<PropertyCard property={mockProperty} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/properties/1');
  });
});
