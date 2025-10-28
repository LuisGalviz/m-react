import { api } from '@/lib/axios';
import type { PropertyDto, PropertyDetailDto, PropertyFilterDto } from '@/types/property';

/**
 * Service for property-related API calls
 */
export const propertyService = {
  /**
   * Get all properties with optional filters
   */
  async getProperties(filters?: PropertyFilterDto): Promise<PropertyDto[]> {
    const params = new URLSearchParams();

    if (filters?.name) params.append('name', filters.name);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await api.get<PropertyDto[]>(`/properties?${params.toString()}`);
    return response.data;
  },

  /**
   * Get property details by ID
   */
  async getPropertyById(id: string): Promise<PropertyDetailDto> {
    const response = await api.get<PropertyDetailDto>(`/properties/${id}`);
    return response.data;
  },
};
