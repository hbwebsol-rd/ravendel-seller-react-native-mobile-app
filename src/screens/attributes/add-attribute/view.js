import React, {useState} from 'react';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import {AddAttributeWrapper, FormWrapper, NotesForAttribute} from './styles';
import {useMutation} from '@apollo/client';
import {ADD_ATTRIBUTE} from '../../../queries/attributesQueries';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import CustomCheckbox from '../../components/custom-checkbox';
import {ALERT_ERROR} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';
import {SPECIAL_CHARACTER_REGEX, isEmpty} from '../../../utils/helper';

const AddAttrView = ({navigation}) => {
  const dispatch = useDispatch();
  const [attribute, setAttribute] = useState({
    name: '',
    value: '',
    allow_filter: false,
    arrayValue: [],
  });
  const [validation, setValdiation] = useState({
    name: '',
    value: '',
  });

  const [addAttribute, {loading: addedLoading}] = useMutation(ADD_ATTRIBUTE, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data, 'add attri');
      if (data.addAttribute.success) {
        GraphqlSuccess('Added successfully');
        setAttribute({
          name: '',
          value: '',
          arrayValue: [],
        });
        navigation.goBack();
      } else {
        dispatch({type: ALERT_ERROR, payload: data?.addAttribute?.message});
      }
      return;
    },
  });

  const AddAttributeSubmit = () => {
    if (isEmpty(attribute.name)) {
      setValdiation({...validation, name: 'Name is required'});
    } else if (isEmpty(attribute.value)) {
      setValdiation({...validation, name: '', value: 'Value is required'});
    } else if (!SPECIAL_CHARACTER_REGEX.test(attribute.value)) {
      setValdiation({
        ...validation,
        name: '',
        value: 'Attribute can only contain  letters and numbers',
      });
    } else {
      setValdiation({
        ...validation,
        name: '',
        value: '',
      });
      var string = attribute.value;
      var valuesArray = string.split('\n').map(val => {
        return {
          name: val.trim(),
        };
      });
      attribute.arrayValue = valuesArray;
      setAttribute({...attribute});
      var attrObject = {
        name: attribute.name.trim(),
        values: attribute.arrayValue,
        allow_filter: attribute.allow_filter,
      };
      console.log('addattribute payload', attrObject);
      addAttribute({
        variables: {
          attribute: attrObject,
        },
      });
    }
  };

  return (
    <>
      {addedLoading ? <AppLoader /> : null}
      <FormActionsComponent
        onCancel={() => navigation.goBack()}
        onSubmit={AddAttributeSubmit}
        submitText="Add"
      />
      <AddAttributeWrapper>
        <FormWrapper>
          <Input
            label="Name"
            value={attribute.name}
            onChangeText={value =>
              setAttribute({...attribute, ['name']: value})
            }
            errorMessage={validation.name}
          />
          <Input
            label="Items"
            value={attribute.value}
            onChangeText={value =>
              setAttribute({...attribute, ['value']: value})
            }
            multiline
            numberOfLines={3}
            errorMessage={validation.value}
          />
          <NotesForAttribute>
            Add attribute by typing them into the text box, one attribute per
            line.
          </NotesForAttribute>
          <CustomCheckbox
            label={'Allow Filter'}
            isChecked={attribute.allow_filter}
            onChange={() =>
              setAttribute({
                ...attribute,
                allow_filter: !attribute.allow_filter,
              })
            }
          />
        </FormWrapper>
      </AddAttributeWrapper>
    </>
  );
};
export default AddAttrView;
