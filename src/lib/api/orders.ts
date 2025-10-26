import { gql } from '@apollo/client';

export const MY_VENDOR_ORDERS_QUERY = gql`
  query MyVendorOrders {
    myVendorOrders {
      id
      order_number
      email
      status
      payment_status
      subtotal_cents
      shipping_cents
      vat_cents
      total_cents
      created_at
      items {
        id
        sku
        title
        price_cents
        quantity
        total_cents
      }
    }
  }
`;


