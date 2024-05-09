import React from 'react';
import styled from 'styled-components';
import {Picker} from '@react-native-picker/picker';
import {isEmpty} from '../../../utils/helper';

const TaxComponent = ({taxState, onTaxChange, tax_class}) => {
  return (
    <TaxWrapper>
      {!isEmpty(taxState) ? (
        !taxState.data.global.is_global ? (
          <Picker
            selectedValue={tax_class}
            onValueChange={(itemValue, itemIndex) => {
              onTaxChange(itemValue);
            }}>
            <Picker.Item
              value={null}
              label={'Select Tax'}
              color="rgba(0,0,0,0.5)"
            />

            {taxState?.data?.taxClass &&
              taxState.data.taxClass.map(tax => {
                return (
                  <Picker.Item key={tax._id} label={tax.name} value={tax._id} />
                );
              })}
          </Picker>
        ) : (
          <GlobalTaxActiveText>
            The global tax option is on currently. To configure the tax for
            individual products, please turn off the global tax option first.
          </GlobalTaxActiveText>
        )
      ) : null}
    </TaxWrapper>
  );
};

const GlobalTaxActiveText = styled.Text`
  font-style: italic;
  background-color: #ffffe0;
`;
const TaxWrapper = styled.View``;

export default TaxComponent;
