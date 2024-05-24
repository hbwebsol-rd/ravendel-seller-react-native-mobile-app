import gql from 'graphql-tag';

const ATTRIBUTE_TILE = gql`
  fragment AttributeTile on productAttribute {
    id
    name
    values
    date
    updated
    allow_filter
  }
`;

const GENERAL_RESPONSE_TILE = gql`
  fragment GeneralRsponseTile on attributeResponse {
    id
    success
    message
  }
`;

const GET_ATTRIBUTES = gql`
  {
    productAttributes {
      data {
        ...AttributeTile
      }
      message {
        message
        success
      }
    }
  }
  ${ATTRIBUTE_TILE}
`;

const GET_ATTRIBUTE = gql`
  query ($id: ID!) {
    productAttribute(id: $id) {
      data {
        ...AttributeTile
      }
      message {
        message
        success
      }
    }
  }
  ${ATTRIBUTE_TILE}
`;

const ADD_ATTRIBUTE = gql`
  mutation ($attribute: AttributeInput) {
    addAttribute(attribute: $attribute) {
      message
      success
    }
  }
`;

const UPDATE_ATTRIBUTE = gql`
  mutation ($attribute: AttributeInput) {
    updateAttribute(attribute: $attribute) {
      message
      success
    }
  }
`;
const DELETE_ATTRIBUTE = gql`
  mutation ($id: ID!) {
    deleteAttribute(id: $id) {
      message
      success
    }
  }
`;
export {
  GET_ATTRIBUTES,
  GET_ATTRIBUTE,
  ADD_ATTRIBUTE,
  UPDATE_ATTRIBUTE,
  DELETE_ATTRIBUTE,
};
