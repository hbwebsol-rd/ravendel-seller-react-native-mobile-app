import React, {useEffect, useState} from 'react';
import {
  ViewCustomerWrapper,
  CustomerProfileRow,
  CustomerProfileValue,
  CustomerProfileLable,
  AddressWrapper,
  AddressValue,
  AddressLabel,
  AddressRow,
  AddressTitle,
  DefaultAddress,
} from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';
import BottomDivider from '../../components/bottom-divider';
import {isEmpty} from '../../../utils/helper';

const SingleCustomerView = ({singleCustomerDetail, navigation}) => {
  const [singleCustomer, setSingleCustomer] = useState({});

  useEffect(() => {
    if (singleCustomerDetail) {
      setSingleCustomer(singleCustomerDetail);
    }
  }, [singleCustomerDetail]);
  console.log(singleCustomerDetail)
  return (
    <ViewCustomerWrapper>
      {!isEmpty(singleCustomer) ? (
        <>
          <CustomerProfileRow>
            <CustomerProfileLable>Name :</CustomerProfileLable>
            <CustomerProfileValue>
              {singleCustomer.firstName + ' ' + singleCustomer.lastName}
            </CustomerProfileValue>
          </CustomerProfileRow>
          <CustomerProfileRow>
            <CustomerProfileLable>Phone :</CustomerProfileLable>
            <CustomerProfileValue>{singleCustomer.phone}</CustomerProfileValue>
          </CustomerProfileRow>
          <CustomerProfileRow>
            <CustomerProfileLable>Email :</CustomerProfileLable>
            <CustomerProfileValue>
              {singleCustomer.email}
            </CustomerProfileValue>
          </CustomerProfileRow>
          {/* <CustomerProfileRow>
            <CustomerProfileLable>Company</CustomerProfileLable>
            <CustomerProfileValue>
              {singleCustomer.company}
            </CustomerProfileValue>
          </CustomerProfileRow> */}
          {singleCustomer.addressBook &&
          singleCustomer.addressBook.length > 0 ? (
            <>
              <AddressTitle>Address</AddressTitle>
              {singleCustomer.addressBook.map((address, i) => (
                <AddressWrapper key={i}>
                  {address.default_address ? (
                    <DefaultAddress>
                      <AntIcon name="star" size={20} color="#daa520" />
                    </DefaultAddress>
                  ) : null}
                  <AddressRow>
                    <AddressLabel>
                      {
                        address.addressType==='Home'?
                        <Icon name="home" size={16} color="#505050" />:<Icon  name="building" size={16} color="#505050" />
                      }
                      
                    </AddressLabel>
                    <AddressValue>
                      {' '}
                      {address.addressType}
                    </AddressValue>
                  </AddressRow>
                  <AddressRow>
                    <AddressLabel>
                      <Icon name="user-circle" size={16} color="#505050" />
                    </AddressLabel>
                    <AddressValue>
                      {' '}
                      {address.firstName + ' ' + address.lastName}
                    </AddressValue>
                  </AddressRow>
                  {/* <AddressRow>
                    <AddressLabel>
                      <Icon name="building" size={16} color="#505050" />
                    </AddressLabel>

                    <AddressValue>{address.company}</AddressValue>
                  </AddressRow> */}
                  <AddressRow>
                    <AddressLabel>
                      <Icon name="phone-alt" size={16} color="#505050" />
                    </AddressLabel>
                    <AddressValue>{address.phone}</AddressValue>
                  </AddressRow>
                  <AddressRow>
                    <AddressLabel>
                      <Icon name="address-card" size={16} color="#505050" />
                    </AddressLabel>
                    <AddressValue>
                      {address.addressLine1 +
                        ', ' +
                        address.addressLine2 +
                        ', ' +
                        address.city +
                        ', ' +
                        address.country +
                        ', ' +
                        address.state +
                        ', ' +
                        address.pincode}
                    </AddressValue>
                  </AddressRow>
                </AddressWrapper>
              ))}
            </>
          ) : null}
        </>
      ) : null}

      <BottomDivider />
    </ViewCustomerWrapper>
  );
};

export default SingleCustomerView;
