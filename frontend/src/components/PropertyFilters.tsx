'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { PropertyFilterDto } from '@/types/property';

const filterSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  minPrice: z.union([z.string(), z.number()]).optional(),
  maxPrice: z.union([z.string(), z.number()]).optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface PropertyFiltersProps {
  onFilter: (filters: PropertyFilterDto) => void;
  isLoading?: boolean;
}

/**
 * Component for filtering properties by name, address, and price range
 * With responsive mobile hamburger menu
 */
export function PropertyFilters({ onFilter, isLoading }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
  });

  const formValues = watch();
  const hasFilters = formValues.name || formValues.address || formValues.minPrice || formValues.maxPrice;

  const onSubmit = (data: FilterFormData) => {
    const filters: PropertyFilterDto = {
      name: data.name || undefined,
      address: data.address || undefined,
      minPrice: data.minPrice ? Number(data.minPrice) : undefined,
      maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
    };
    onFilter(filters);
    // Close mobile menu after search
    setIsOpen(false);
  };

  const handleReset = () => {
    reset();
    onFilter({});
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-600 bg-white px-4 py-3 text-primary-600 shadow-sm transition-colors hover:bg-primary-50"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="font-medium">
            {hasFilters ? 'Filters Active' : 'Filter Properties'}
          </span>
          {hasFilters && (
            <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel - Desktop: always visible, Mobile: toggleable */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`rounded-lg bg-white p-6 shadow-md transition-all ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        {/* Header with close button for mobile */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Filter Properties</h2>
            <p className="text-sm text-gray-600">
              Search for properties by name, address, or price range
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden rounded-full p-2 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Fields */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Name Filter */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Property Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="e.g. Beautiful House"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Address Filter */}
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register('address')}
              type="text"
              id="address"
              placeholder="e.g. Main Street"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Min Price Filter */}
          <div>
            <label htmlFor="minPrice" className="mb-1 block text-sm font-medium text-gray-700">
              Min Price ($)
            </label>
            <input
              {...register('minPrice', {
                setValueAs: (v) => (v === '' ? undefined : v),
              })}
              type="number"
              id="minPrice"
              placeholder="0"
              min="0"
              step="10000"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Max Price Filter */}
          <div>
            <label htmlFor="maxPrice" className="mb-1 block text-sm font-medium text-gray-700">
              Max Price ($)
            </label>
            <input
              {...register('maxPrice', {
                setValueAs: (v) => (v === '' ? undefined : v),
              })}
              type="number"
              id="maxPrice"
              placeholder="999999999"
              min="0"
              step="10000"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {isLoading ? 'Searching...' : 'Search Properties'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
}
