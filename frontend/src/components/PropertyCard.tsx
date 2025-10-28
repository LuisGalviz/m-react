import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { PropertyDto } from '@/types/property';

interface PropertyCardProps {
  property: PropertyDto;
}

/**
 * Card component for displaying property information in a grid
 */
export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.idProperty}`}>
      <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">
            {property.name}
          </h3>

          <div className="mb-3 flex items-start gap-1 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p className="line-clamp-1">{property.address}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(property.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
