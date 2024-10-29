import React, {useState} from 'react';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import {AddBrandsWrapper, FormWrapper, NotesForBrands} from './styles';
import {useMutation} from '@apollo/client';
import {ADD_BRAND} from '../../../queries/brandsQueries';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import {ALERT_ERROR} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';
import {isEmpty, SPECIAL_CHARACTER_REGEX} from '../../../utils/helper';

const AddBrandView = ({navigation}) => {
  const dispatch = useDispatch();
  const [brands, setBrands] = useState('');
  const [validation, setValdiation] = useState({
    name: '',
  });

  const [addBrands, {loading: addedLoading}] = useMutation(ADD_BRAND, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data);
      if (data.addBrand.success) {
        GraphqlSuccess('Added successfully');
        setBrands('');
        navigation.goBack();
      } else {
        dispatch({type: ALERT_ERROR, payload: data.addBrand.message});
      }
    },
  });

  const AddBrandSubmit = () => {
    if (isEmpty(brands)) {
      setValdiation({...validation, name: 'Brand Name is required'});
    } else if (!SPECIAL_CHARACTER_REGEX.test(brands)) {
      setValdiation({
        ...validation,
        name: 'brands should contain only letters and numbers',
      });
    } else {
      setValdiation({
        ...validation,
        name: '',
      });
      var string = brands;
      var newBrandArr = string.split('\n').map(brand => {
        return {
          name: brand.trim(),
        };
      });
      addBrands({variables: {brands: newBrandArr}});
    }
  };

  return (
    <>
      {addedLoading ? <AppLoader /> : null}
      <FormActionsComponent
        onCancel={() => navigation.goBack()}
        onSubmit={AddBrandSubmit}
        submitText="Add"
      />
      <AddBrandsWrapper>
        <FormWrapper>
          <Input
            label="Brand Name"
            value={brands}
            onChangeText={value => setBrands(value)}
            multiline
            numberOfLines={3}
            errorMessage={validation.name}
          />
          <NotesForBrands>
            Brands can be associated with products, allowing your customers to
            shop by browsing their favorite brands. Add brands by typing them
            into the text box, one brand per line.
          </NotesForBrands>
        </FormWrapper>
      </AddBrandsWrapper>
    </>
  );
};
export default AddBrandView;
