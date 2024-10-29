import React, {useState, useEffect} from 'react';
import {
  isEmpty,
  BASE_URL,
  SPECIAL_CHARACTER_REGEX,
} from '../../../utils/helper';
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
import {Text, View} from 'react-native';
import {ALERT_ERROR, ALERT_SUCCESS} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';
import Multiselect from '../../components/multiselect';
import ThemeColor from '../../../utils/color';

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
  const [thumbnailImage, setThumbnailImage] = useState('');

  const [updateCategory, {loading: addedLoading}] = useMutation(
    UPDATE_CATEGORY,
    {
      onError: error => {
        console.log(error);
        // GraphqlError(error);
      },
      onCompleted: data => {
        // GraphqlSuccess('Updated successfully');
        if (data.updateProductCategory.success) {
          dispatch({
            type: ALERT_SUCCESS,
            payload: data.updateProductCategory.message,
          });
          navigation.goBack();
          setCategoryForm({});
        } else {
          dispatch({
            type: ALERT_ERROR,
            payload: data.updateProductCategory.message,
          });
        }
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
      const single = {
        description: singleCategoryDetail.description,
        id: singleCategoryDetail.id,
        image: {
          uri: singleCategoryDetail.image
            ? BASE_URL + singleCategoryDetail.image
            : null,
        },
        thumbnail_image: {
          uri: singleCategoryDetail.thumbnail_image
            ? BASE_URL + singleCategoryDetail.thumbnail_image
            : null,
        },
        meta: {
          description: singleCategoryDetail?.meta?.description,
          keywords: singleCategoryDetail?.meta?.keywords,
          title: singleCategoryDetail?.meta?.title,
        },
        name: singleCategoryDetail.name,
        parentId: singleCategoryDetail.parentId,

        url: singleCategoryDetail.url,
      };
      console.log(single, 'single');
      setCategoryForm(single);
    }
  }, [singleCategoryDetail]);

  const UpdateCategoryForm = () => {
    if (isEmpty(categoryForm.name)) {
      setValdiation({...validation, name: 'Name is required'});
    } else if (isEmpty(categoryForm.description)) {
      setValdiation({
        ...validation,
        name: '',
        description: 'Description is required',
      });
    } else {
      setValdiation({
        ...validation,
        name: '',
        description: '',
      });
      var categoryObject = {
        id: categoryForm.id,
        name: categoryForm.name.trim(),
        parentId: categoryForm.parentId,
        description: categoryForm.description.trim(),
        url: categoryForm.url,
        upload_image: categoryForm.upload_image
          ? [categoryForm.upload_image]
          : '',
        upload_thumbnail_image: categoryForm.upload_thumbnail_image
          ? [categoryForm.upload_thumbnail_image]
          : '',
        meta: {
          title: categoryForm.meta.title,
          description: categoryForm.meta.description,
          keywords: categoryForm.meta.keywords,
        },
      };
      console.log(JSON.stringify(categoryObject), ' editcategory payload');
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
              <Text style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
                Parent Category
              </Text>
              {console.log(categoryForm.parentId, ' catt')}
              <Multiselect
                height={50}
                inititalselect={categoryForm.parentId}
                fieldname={'name'}
                ibw={0}
                inputBgColor={ThemeColor.whiteColor}
                data={allCategories ? allCategories : []}
                onchange={(name, itemValue) => {
                  console.log(itemValue, 'iiv');
                  setCategoryForm({...categoryForm, ['parentId']: itemValue});
                }}
                placeholder={''}
                ibbw={0.9}
                color="black"
                borderBottomColor={'#3C3C4360'}
                padding={0}
                searchenabled={true}
                fs={15}
                paddingLeft={0}
                fontColr={'#707070'}
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

              {isEmpty(categoryForm.upload_image) && categoryForm.image.uri ? (
                <View>
                  <Text
                    style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
                    Upload Feature Image
                  </Text>
                  <FeaturedImageComponents
                    image={categoryForm.image}
                    inputChange={img => {
                      setCategoryForm({...categoryForm, ['upload_image']: img});
                    }}
                    removeImage={() => {
                      setCategoryForm({
                        ...categoryForm,
                        ['upload_image']: '',
                        ['image']: '',
                      });
                    }}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
                    Upload Feature Image
                  </Text>
                  <FeaturedImageComponents
                    image={categoryForm.upload_image}
                    inputChange={img => {
                      setCategoryForm({...categoryForm, ['upload_image']: img});
                      setFeatureImage(img);
                    }}
                    removeImage={() => setFeatureImage('')}
                  />
                </View>
              )}
              {isEmpty(categoryForm.upload_thumbnail_image) &&
              categoryForm.thumbnail_image.uri ? (
                <View>
                  <Text
                    style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
                    Upload Thumbnail Image
                  </Text>
                  <FeaturedImageComponents
                    image={categoryForm.thumbnail_image}
                    inputChange={img => {
                      setCategoryForm({
                        ...categoryForm,
                        ['upload_thumbnail_image']: img,
                      });
                    }}
                    removeImage={() => {
                      setCategoryForm({
                        ...categoryForm,
                        ['upload_thumbnail_image']: '',
                        ['thumbnail_image']: '',
                      });
                    }}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
                    Upload Thumbnail Image
                  </Text>
                  <FeaturedImageComponents
                    image={categoryForm.upload_thumbnail_image}
                    inputChange={img => {
                      setCategoryForm({
                        ...categoryForm,
                        ['upload_thumbnail_image']: img,
                      });
                      setThumbnailImage(img);
                    }}
                    removeImage={() => setThumbnailImage('')}
                  />
                </View>
              )}
              <MetaSectiontitle>Meta</MetaSectiontitle>
              <Input
                label="Meta Title"
                value={categoryForm?.meta?.title}
                onChangeText={value => {
                  categoryForm.meta.title = value;
                  setCategoryForm({
                    ...categoryForm,
                  });
                }}
              />
              <Input
                label="Meta Keyword"
                value={categoryForm?.meta?.keywords}
                onChangeText={value => {
                  categoryForm.meta.keywords = value;
                  setCategoryForm({
                    ...categoryForm,
                  });
                }}
              />
              <Input
                label="Meta Description"
                value={categoryForm?.meta?.description}
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
