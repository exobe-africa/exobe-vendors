import { gql } from "@apollo/client";

export const PRODUCT_BY_ID = gql`
  query ProductById($id: String!) {
    productById(id: $id) {
      id
      title
      slug
      description
      status
      isActive
      vendorId
      categoryId
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
      slug
      status
      isActive
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      slug
      status
      isActive
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const CATEGORY_TREE = gql`
  query CategoryTree {
    categoryTree {
      id
      name
      path
      children { id name path }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String, $categoryId: String, $vendorId: String, $status: String, $isActive: Boolean, $cursor: String, $limit: Float) {
    searchProducts(query: $query, categoryId: $categoryId, vendorId: $vendorId, status: $status, isActive: $isActive, cursor: $cursor, limit: $limit)
  }
`;


