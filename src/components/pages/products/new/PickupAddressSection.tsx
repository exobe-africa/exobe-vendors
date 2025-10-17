'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { MapPin } from 'lucide-react';

interface Props {
  pickupLocationName: string;
  pickupAddress: string;
  pickupCity: string;
  pickupProvince: string;
  pickupPostalCode: string;
  pickupCountry: string;
  pickupInstructions: string;
  onPickupLocationNameChange: (value: string) => void;
  onPickupAddressChange: (value: string) => void;
  onPickupCityChange: (value: string) => void;
  onPickupProvinceChange: (value: string) => void;
  onPickupPostalCodeChange: (value: string) => void;
  onPickupCountryChange: (value: string) => void;
  onPickupInstructionsChange: (value: string) => void;
}

const SA_PROVINCES = [
  { value: '', label: 'Select Province' },
  { value: 'Eastern Cape', label: 'Eastern Cape' },
  { value: 'Free State', label: 'Free State' },
  { value: 'Gauteng', label: 'Gauteng' },
  { value: 'KwaZulu-Natal', label: 'KwaZulu-Natal' },
  { value: 'Limpopo', label: 'Limpopo' },
  { value: 'Mpumalanga', label: 'Mpumalanga' },
  { value: 'Northern Cape', label: 'Northern Cape' },
  { value: 'North West', label: 'North West' },
  { value: 'Western Cape', label: 'Western Cape' },
];

export function PickupAddressSection({
  pickupLocationName,
  pickupAddress,
  pickupCity,
  pickupProvince,
  pickupPostalCode,
  pickupCountry,
  pickupInstructions,
  onPickupLocationNameChange,
  onPickupAddressChange,
  onPickupCityChange,
  onPickupProvinceChange,
  onPickupPostalCodeChange,
  onPickupCountryChange,
  onPickupInstructionsChange,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          <CardTitle>Pickup Address</CardTitle>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Where should the driver collect this product? This address will be used for order fulfillment.
        </p>
      </CardHeader>
      <div className="space-y-4">
        <Input
          label="Location Name *"
          placeholder="e.g. Main Warehouse, Store #1, Workshop"
          value={pickupLocationName}
          onChange={(e) => onPickupLocationNameChange(e.target.value)}
          helperText="Give this location a memorable name for easy reference"
          required
        />

        <Input
          label="Street Address *"
          placeholder="e.g. 123 Main Street, Unit 4"
          value={pickupAddress}
          onChange={(e) => onPickupAddressChange(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City *"
            placeholder="e.g. Johannesburg"
            value={pickupCity}
            onChange={(e) => onPickupCityChange(e.target.value)}
            required
          />

          <Select
            label="Province *"
            options={SA_PROVINCES}
            value={pickupProvince}
            onChange={(e) => onPickupProvinceChange(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Postal Code *"
            placeholder="e.g. 2000"
            value={pickupPostalCode}
            onChange={(e) => onPickupPostalCodeChange(e.target.value)}
            required
          />

          <Input
            label="Country"
            placeholder="South Africa"
            value={pickupCountry}
            onChange={(e) => onPickupCountryChange(e.target.value)}
            disabled
          />
        </div>

        <Textarea
          label="Special Instructions (Optional)"
          placeholder="e.g. Gate code is #1234, Call on arrival, Loading dock is at the back"
          value={pickupInstructions}
          onChange={(e) => onPickupInstructionsChange(e.target.value)}
          rows={3}
          helperText="Provide any special instructions for the driver to easily locate and collect the product"
        />
      </div>
    </Card>
  );
}

