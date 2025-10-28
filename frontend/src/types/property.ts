/**
 * Property data transfer objects matching the backend DTOs
 */

export interface PropertyDto {
  idProperty: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image?: string;
}

export interface OwnerDto {
  idOwner: string;
  name: string;
  address: string;
  photo?: string;
}

export interface PropertyDetailDto {
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  image?: string;
  owner?: OwnerDto;
  additionalImages: string[];
}

export interface PropertyFilterDto {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}
