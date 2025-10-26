import { gql } from '@apollo/client';

export const VENDOR_ORDER_BY_ID_QUERY = gql`
  query OrderById($orderId: String!) {
    orderById(orderId: $orderId) {
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
      shipping_address
      billing_address
      items {
        id
        sku
        title
        attributes
        price_cents
        quantity
        total_cents
        vendor_id
        product_id
        product {
          id
          title
          slug
          media {
            id
            url
            type
          }
        }
      }
      customer {
        id
        email
        first_name
        last_name
        phone
        mobile
      }
      events {
        id
        status
        payment_status
        description
        created_at
      }
    }
  }
`;

