'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import type { PropertyFilterDto } from '@/types/property';
import { Loader2, Home } from 'lucide-react';

/**
 * Main component for displaying and filtering property listings
 */
export function PropertyList() {
  const [filters, setFilters] = useState<PropertyFilterDto>({});

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
  });

  const handleFilter = (newFilters: PropertyFilterDto) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-800">
          Error loading properties: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PropertyFilters onFilter={handleFilter} isLoading={isLoading} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading properties...</span>
        </div>
      ) : properties && properties.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.idProperty} property={property} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <Home className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your filters or clearing them to see all properties.
          </p>
        </div>
      )}
    </div>
  );
}
