'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { propertyService } from '@/services/propertyService';
import { formatCurrency, getInitials } from '@/lib/utils';
import { ArrowLeft, MapPin, Calendar, Home, User, Loader2 } from 'lucide-react';

/**
 * Property detail page showing full information about a property
 */
export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-800">
              {error instanceof Error ? error.message : 'Property not found'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg bg-gray-100">
              {property.image ? (
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <Home className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Additional Images */}
            {property.additionalImages.length > 0 && (
              <div className="mb-6 grid grid-cols-3 gap-4">
                {property.additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-32 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`${property.name} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{property.name}</h1>

              <div className="mb-4 flex items-start gap-2 text-gray-600">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                <p>{property.address}</p>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-primary-600">
                  {formatCurrency(property.price)}
                </p>
              </div>

              <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Internal Code</p>
                  <p className="font-medium text-gray-900">{property.codeInternal}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-medium text-gray-900">{property.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Owner Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Owner Information</h2>

              {property.owner ? (
                <div>
                  {/* Owner Avatar */}
                  <div className="mb-4 flex items-center gap-4">
                    {property.owner.photo ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={property.owner.photo}
                          alt={property.owner.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                        <span className="text-lg font-semibold text-primary-700">
                          {getInitials(property.owner.name)}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-900">{property.owner.name}</p>
                      <p className="text-sm text-gray-600">Property Owner</p>
                    </div>
                  </div>

                  {/* Owner Address */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <User className="mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-gray-900">{property.owner.address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No owner information available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
