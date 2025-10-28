import { getProperties, getPropertyById } from '@/services/propertyService';
import { api } from '@/lib/axios';
import type { PropertyDto, PropertyDetailDto } from '@/types/property';

// Mock axios
jest.mock('@/lib/axios');
const mockedApi = api as jest.Mocked<typeof api>;

describe('propertyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('fetches properties without filters', async () => {
      const mockProperties: PropertyDto[] = [
        {
          idProperty: '1',
          idOwner: 'owner1',
          name: 'House 1',
          address: '123 Main St',
          price: 250000,
        },
      ];

      mockedApi.get.mockResolvedValue({ data: mockProperties });

      const result = await getProperties();

      expect(mockedApi.get).toHaveBeenCalledWith('/properties', { params: {} });
      expect(result).toEqual(mockProperties);
    });

    it('fetches properties with name filter', async () => {
      const mockProperties: PropertyDto[] = [];
      mockedApi.get.mockResolvedValue({ data: mockProperties });

      await getProperties({ name: 'Villa' });

      expect(mockedApi.get).toHaveBeenCalledWith('/properties', {
        params: { name: 'Villa' },
      });
    });

    it('fetches properties with address filter', async () => {
      const mockProperties: PropertyDto[] = [];
      mockedApi.get.mockResolvedValue({ data: mockProperties });

      await getProperties({ address: 'Main St' });

      expect(mockedApi.get).toHaveBeenCalledWith('/properties', {
        params: { address: 'Main St' },
      });
    });

    it('fetches properties with price range filters', async () => {
      const mockProperties: PropertyDto[] = [];
      mockedApi.get.mockResolvedValue({ data: mockProperties });

      await getProperties({ minPrice: 100000, maxPrice: 500000 });

      expect(mockedApi.get).toHaveBeenCalledWith('/properties', {
        params: { minPrice: 100000, maxPrice: 500000 },
      });
    });

    it('fetches properties with all filters combined', async () => {
      const mockProperties: PropertyDto[] = [];
      mockedApi.get.mockResolvedValue({ data: mockProperties });

      await getProperties({
        name: 'Luxury',
        address: 'Beach',
        minPrice: 200000,
        maxPrice: 1000000,
      });

      expect(mockedApi.get).toHaveBeenCalledWith('/properties', {
        params: {
          name: 'Luxury',
          address: 'Beach',
          minPrice: 200000,
          maxPrice: 1000000,
        },
      });
    });

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network Error';
      mockedApi.get.mockRejectedValue(new Error(errorMessage));

      await expect(getProperties()).rejects.toThrow(errorMessage);
    });

    it('handles empty response', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      const result = await getProperties();

      expect(result).toEqual([]);
    });
  });

  describe('getPropertyById', () => {
    it('fetches property by id successfully', async () => {
      const mockProperty: PropertyDetailDto = {
        idProperty: '1',
        idOwner: 'owner1',
        name: 'Luxury Villa',
        address: '100 Sunset Blvd',
        price: 500000,
        codeInternal: 'LV001',
        year: 2020,
      };

      mockedApi.get.mockResolvedValue({ data: mockProperty });

      const result = await getPropertyById('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/properties/1');
      expect(result).toEqual(mockProperty);
    });

    it('handles property not found', async () => {
      mockedApi.get.mockRejectedValue({
        response: { status: 404 },
      });

      await expect(getPropertyById('nonexistent')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('handles network errors', async () => {
      const errorMessage = 'Network Error';
      mockedApi.get.mockRejectedValue(new Error(errorMessage));

      await expect(getPropertyById('1')).rejects.toThrow(errorMessage);
    });

    it('calls API with correct property id', async () => {
      const testId = 'test-property-123';
      mockedApi.get.mockResolvedValue({ data: {} });

      await getPropertyById(testId);

      expect(mockedApi.get).toHaveBeenCalledWith(`/properties/${testId}`);
    });

    it('handles special characters in property id', async () => {
      const specialId = 'property-123-abc';
      mockedApi.get.mockResolvedValue({ data: {} });

      await getPropertyById(specialId);

      expect(mockedApi.get).toHaveBeenCalledWith(`/properties/${specialId}`);
    });
  });
});
