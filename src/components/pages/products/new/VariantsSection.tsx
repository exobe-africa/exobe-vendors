'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Props {
  variantLabels: string[];
}

export function VariantsSection({ variantLabels }: Props) {
  if (variantLabels.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Variant</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {variantLabels.map((value, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">{value}</td>
                <td className="py-3 px-4">
                  <Input placeholder="SKU" className="text-sm" />
                </td>
                <td className="py-3 px-4">
                  <Input type="number" placeholder="0.00" className="text-sm" />
                </td>
                <td className="py-3 px-4">
                  <Input type="number" placeholder="0" className="text-sm" />
                </td>
                <td className="py-3 px-4">
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


