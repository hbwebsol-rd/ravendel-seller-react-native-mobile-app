import React, {useEffect, useState} from 'react';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import FeaturedImageComponents from '../../components/featuredImageComponents';
import {AddCategoryWrapper, FormWrapper, MetaSectiontitle} from './styles';
import {Query, gql, useQuery} from '@apollo/client';
import {useMutation} from '@apollo/client';
import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  GET_URL,
} from '../../../queries/productQueries';
import CustomPicker from '../../components/custom-picker';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import {unflatten} from '../../../utils/helper';
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native';
import URLComponents from '../../components/urlComponents';
import {mutation} from '../../../utils/service';
var categoryObject = {
  name: '',
  parentId: null,
  description: '',
  url: '',
  image: '',
  meta: {
    title: '',
    description: '',
    keywords: '',
  },
};

const AddCategoryView = ({navigation}) => {
  const Categories = useQuery(GET_CATEGORIES);
  const [categoryForm, setCategoryForm] = useState(categoryObject);
  const [allCategories, setAllCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [validation, setValdiation] = useState({
    name: '',
    description: '',
  });

  const [addCategory, {loading: addedLoading}] = useMutation(ADD_CATEGORY, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      GraphqlSuccess('Added successfully');
      setCategoryForm(categoryObject);
      navigation.goBack();
    },
  });

  const AddCategoryForm = () => {
    if (categoryForm.name === '') {
      setValdiation({...validation, name: 'Required'});
    } else if (categoryForm.description === '') {
      setValdiation({...validation, name: '', description: 'Required'});
    } else {
      setValdiation({
        ...validation,
        name: '',
        description: '',
      });
      addCategory({variables: categoryForm});
    }
  };

  useEffect(() => {
    if (Categories.data && Categories.data.productCategories) {
      var selectedCat = JSON.parse(
        JSON.stringify(Categories.data.productCategories.data),
      );
      if (selectedCat && selectedCat.length) {
        setAllCategories(unflatten(selectedCat));
      }
    }
  }, [Categories.data]);

  const isUrlExist = async url => {
    setLoader(true);
    console.log(url, 'uuu');
    let updatedUrl = await mutation(GET_URL, {url: url});
    setCategoryForm({
      ...categoryForm,
      url: updatedUrl.data.validateUrl.url,
    });
    setLoader(false);
  };

  const onBlurNameInput = value => {
    if (categoryForm.url === '' && categoryForm.name !== '') {
      isUrlExist(value);
    }
  };
  return (
    <>
      {addedLoading || loader ? <AppLoader /> : null}
      <FormActionsComponent
        onCancel={() => navigation.goBack()}
        onSubmit={AddCategoryForm}
        submitText="Add"
      />
      <AddCategoryWrapper>
        <FormWrapper>
          <Input
            label="Name"
            value={categoryForm.name}
            onChangeText={value =>
              setCategoryForm({...categoryForm, ['name']: value})
            }
            errorMessage={validation.name}
            onEndEditing={event => {
              let value =
                !!event.nativeEvent && !!event.nativeEvent.text
                  ? event.nativeEvent.text
                  : event;
              onBlurNameInput(value);
              if (categoryForm.meta && categoryForm.meta.title === '') {
                categoryForm.meta.title = value;
                setCategoryForm({
                  ...categoryForm,
                });
              }
            }}
          />
          <URLComponents
            url={categoryForm.url}
            updateOf="Product"
            changePermalink={value => inputChange('url', value)}
            updatePermalink={value => inputChange('url', value)}
          />
          <Text style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
            Parent Cateogry
          </Text>
          <Picker
            style={{marginBottom: 10}}
            selectedValue={categoryForm.parentId}
            onValueChange={itemValue => {
              setCategoryForm({...categoryForm, ['parentId']: itemValue});
            }}>
            <Picker.Item label="Select Key" value="" />
            {allCategories.map(value => (
              <Picker.Item key={value.id} label={value.name} value={value.id} />
            ))}
          </Picker>
          <Input
            label="Description"
            value={categoryForm.description}
            onChangeText={value =>
              setCategoryForm({...categoryForm, ['description']: value})
            }
            multiline
            numberOfLines={2}
            errorMessage={validation.description}
          />

          <FeaturedImageComponents
            image={categoryForm.image}
            inputChange={img => {
              setCategoryForm({...categoryForm, ['image']: img});
            }}
            removeImage={() =>
              setCategoryForm({...categoryForm, ['image']: ''})
            }
          />

          <MetaSectiontitle>Meta</MetaSectiontitle>
          <Input
            label="Meta Title"
            value={categoryForm.meta.title}
            onChangeText={value => {
              categoryForm.meta.title = value;
              setCategoryForm({
                ...categoryForm,
              });
            }}
          />
          <Input
            label="Meta Keyword"
            value={categoryForm.meta.keywords}
            onChangeText={value => {
              categoryForm.meta.keywords = value;
              setCategoryForm({
                ...categoryForm,
              });
            }}
          />
          <Input
            label="Meta Description"
            value={categoryForm.meta.description}
            onChangeText={value => {
              categoryForm.meta.description = value;
              setCategoryForm({
                ...categoryForm,
              });
            }}
            multiline
            numberOfLines={2}
          />
        </FormWrapper>
      </AddCategoryWrapper>
    </>
  );
};
export default AddCategoryView;
