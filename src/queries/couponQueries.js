import gql from 'graphql-tag';
const GET_COUPONS = gql`
  {
    coupons {
      data {
        id
        code
        description
        discountType
        discountValue
        freeShipping
        expire
        minimumSpend
        maximumSpend
        product
        excludeProducts
        includeProducts
        category
        includeCategories
        excludeCategories
        date
        updated
        categoryTree
      }
      message {
        message
        success
      }
    }
  }
`;

const GET_COUPON = gql`
  query ($id: ID!) {
    coupon(id: $id) {
      data {
        id
        code
        description
        discountType
        discountValue
        freeShipping
        expire
        minimumSpend
        maximumSpend
        product
        excludeProducts
        includeProducts
        category
        includeCategories
        excludeCategories
        date
        updated
      }
      message {
        message
        success
      }
    }
  }
`;

const ADD_COUPON = gql`
  mutation (
    $code: String
    $description: String
    $discountType: String
    $discountValue: Float
    $freeShipping: Boolean
    $expire: String
    $minimumSpend: Int
    $maximumSpend: Int
    $product: Boolean
    $includeProducts: customArray
    $excludeProducts: customArray
    $category: Boolean
    $includeCategories: customArray
    $excludeCategories: customArray
    $categoryTree: customArray
  ) {
    addCoupon(
      code: $code
      description: $description
      discountType: $discountType
      discountValue: $discountValue
      freeShipping: $freeShipping
      expire: $expire
      minimumSpend: $minimumSpend
      maximumSpend: $maximumSpend
      product: $product
      includeProducts: $includeProducts
      excludeProducts: $excludeProducts
      category: $category
      includeCategories: $includeCategories
      excludeCategories: $excludeCategories
      categoryTree: $categoryTree
    ) {
      message
      success
    }
  }
`;

const UPDATE_COUPON = gql`
  mutation (
    $id: ID!
    $code: String
    $description: String
    $discountType: String
    $discountValue: Float
    $freeShipping: Boolean
    $expire: String
    $minimumSpend: Int
    $maximumSpend: Int
    $product: Boolean
    $includeProducts: customArray
    $excludeProducts: customArray
    $category: Boolean
    $includeCategories: customArray
    $excludeCategories: customArray
  ) {
    updateCoupon(
      id: $id
      code: $code
      description: $description
      discountType: $discountType
      discountValue: $discountValue
      freeShipping: $freeShipping
      expire: $expire
      minimumSpend: $minimumSpend
      maximumSpend: $maximumSpend
      product: $product
      includeProducts: $includeProducts
      excludeProducts: $excludeProducts
      category: $category
      includeCategories: $includeCategories
      excludeCategories: $excludeCategories
    ) {
      message
      success
    }
  }
`;

const DELETE_COUPON = gql`
  mutation ($id: ID!) {
    deleteCoupon(id: $id) {
      message
      success
    }
  }
`;

export {GET_COUPONS, GET_COUPON, ADD_COUPON, UPDATE_COUPON, DELETE_COUPON};
