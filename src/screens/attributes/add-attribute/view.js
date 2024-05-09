import React, {useState} from 'react';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import {AddAttributeWrapper, FormWrapper, NotesForAttribute} from './styles';
import {useMutation} from '@apollo/client';
import {ADD_ATTRIBUTE} from '../../../queries/attributesQueries';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const AddAttrView = ({navigation}) => {
  const [attribute, setAttribute] = useState({
    name: '',
    value: '',
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
      GraphqlSuccess('Added successfully');
      setAttribute({
        name: '',
        value: '',
        arrayValue: [],
      });
      navigation.goBack();
    },
  });

  const AddAttributeSubmit = () => {
    if (attribute.name === '') {
      setValdiation({...validation, name: 'Required'});
    } else if (attribute.value === '') {
      setValdiation({...validation, name: '', value: 'Required'});
    } else {
      setValdiation({
        ...validation,
        name: '',
        value: '',
      });
      var string = attribute.value;
      var valuesArray = string.split('\n').map(val => {
        return {
          name: val,
        };
      });
      attribute.arrayValue = valuesArray;
      setAttribute({...attribute});

      var attrObject = {
        name: attribute.name,
        values: attribute.arrayValue,
      };

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
        </FormWrapper>
      </AddAttributeWrapper>
    </>
  );
};
export default AddAttrView;
