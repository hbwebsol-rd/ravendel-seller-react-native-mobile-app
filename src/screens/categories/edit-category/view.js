import React, {useState, useEffect} from 'react';
import {isEmpty, BASE_URL} from '../../../utils/helper';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import URLComponents from '../../components/urlComponents';
import FeaturedImageComponents from '../../components/featuredImageComponents';
import {EditCategoryWrapper, FormWrapper, MetaSectiontitle} from './styles';
import {Query, useQuery} from '@apollo/client';
import {useMutation} from '@apollo/client';
import {GET_CATEGORIES, UPDATE_CATEGORY} from '../../../queries/productQueries';
import CustomPicker from '../../components/custom-picker';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import {Text} from 'react-native';
import {ALERT_SUCCESS} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';

const EditCategoryView = ({navigation, singleCategoryDetail}) => {
  const dispatch = useDispatch();
  const {loading, error, data} = useQuery(GET_CATEGORIES);
  const allCategory = data.productCategories.data;
  const [categoryForm, setCategoryForm] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [validation, setValdiation] = useState({
    name: '',
    description: '',
  });
  const [featureImage, setFeatureImage] = useState('');

  const [updateCategory, {loading: addedLoading}] = useMutation(
    UPDATE_CATEGORY,
    {
      onError: error => {
        console.log(error);
        // GraphqlError(error);
      },
      onCompleted: data => {
        // GraphqlSuccess('Updated successfully');
        dispatch({type: ALERT_SUCCESS, payload: 'Updated successfully'});
        navigation.goBack();
        setCategoryForm({});
      },
    },
  );

  useEffect(() => {
    console.log(singleCategoryDetail.name, ' namm');
    if (data.productCategories) {
      const cat = data.productCategories.data.filter(
        item => item.name !== singleCategoryDetail.name,
      );
      // console.log(cat, 'aa');

      setAllCategories(cat);
    }
  }, [data?.productCategories, singleCategoryDetail]);

  useEffect(() => {
    if (singleCategoryDetail) {
      setCategoryForm(singleCategoryDetail);
    }
  }, [singleCategoryDetail]);

  const UpdateCategoryForm = () => {
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
      var categoryObject = {
        id: categoryForm.id,
        name: categoryForm.name,
        parentId: categoryForm.parentId,
        description: categoryForm.description,
        url: categoryForm.url,
        update_image: categoryForm.update_image
          ? categoryForm.update_image
          : '',
        meta: {
          title: categoryForm.meta.title,
          description: categoryForm.meta.description,
          keywords: categoryForm.meta.keywords,
        },
      };
      console.log(categoryObject, 'co');
      updateCategory({variables: categoryObject});
    }
  };

  return (
    <>
      {addedLoading ? <AppLoader /> : null}
      {!isEmpty(categoryForm) ? (
        <>
          <FormActionsComponent
            onCancel={() => navigation.goBack()}
            onSubmit={UpdateCategoryForm}
            submitText="Save"
          />
          <EditCategoryWrapper>
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
                updateOf="ProductCat"
                changePermalink={value =>
                  setCategoryForm({...categoryForm, ['url']: value})
                }
                updatePermalink={value =>
                  setCategoryForm({...categoryForm, ['url']: value})
                }
              />
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
              {allCategories.length ? (
                <CustomPicker
                  iosDropdown
                  pickerKey="name"
                  pickerVal="id"
                  androidPickerData={allCategories}
                  selectedValue={categoryForm.parentId}
                  iosPickerData={allCategories}
                  pickerValChange={val =>
                    setCategoryForm({...categoryForm, ['parentId']: val})
                  }
                  placeholder="Please Select"
                  label="Parent Category"
                />
              ) : null}

              {categoryForm.image && categoryForm.image.medium ? (
                <FeaturedImageComponents
                  image={
                    categoryForm.update_image
                      ? categoryForm.update_image
                      : BASE_URL + categoryForm.image.medium
                  }
                  inputChange={img => {
                    setCategoryForm({...categoryForm, ['update_image']: img});
                  }}
                  removeImage={() => {
                    setCategoryForm({...categoryForm, ['update_image']: ''});
                    setCategoryForm({...categoryForm, ['image']: ''});
                  }}
                />
              ) : (
                <FeaturedImageComponents
                  image={featureImage}
                  inputChange={img => {
                    setCategoryForm({...categoryForm, ['update_image']: img});
                    setFeatureImage(img);
                  }}
                  removeImage={() => setFeatureImage('')}
                />
              )}

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
          </EditCategoryWrapper>
        </>
      ) : null}
    </>
  );
};

export default EditCategoryView;
