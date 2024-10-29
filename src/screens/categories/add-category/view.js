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
import {BASE_URL, unflatten} from '../../../utils/helper';
import {Picker} from '@react-native-picker/picker';
import {Text, View} from 'react-native';
import URLComponents from '../../components/urlComponents';
import {mutation} from '../../../utils/service';
import ThemeColor from '../../../utils/color';
import Multiselect from '../../components/multiselect';
import {ALERT_ERROR, ALERT_SUCCESS} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';
var categoryObject = {
  name: '',
  parentId: null,
  description: '',
  url: '',
  image: '',
  thumbnail_image: '',
  meta: {
    title: '',
    description: '',
    keywords: '',
  },
};

const AddCategoryView = ({navigation}) => {
  const dispatch = useDispatch();

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
      console.log(data);
      if (data.addProductCategory.success) {
        // GraphqlSuccess('Added successfully');
        dispatch({
          type: ALERT_SUCCESS,
          payload: data.addProductCategory.message,
        });
        setCategoryForm(categoryObject);
        navigation.goBack();
      } else {
        dispatch({type: ALERT_ERROR, payload: data.addProductCategory.message});
      }
    },
  });

  const AddCategoryForm = () => {
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
      const catDetail = {
        name: categoryForm.name.trim(),
        parentId: categoryForm.parentId,
        description: categoryForm.description.trim(),
        url: categoryForm.url,
        // image: [categoryForm.image],
        // thumbnail_image: [categoryForm.thumbnail_image],
        meta: {
          title: categoryForm.meta.title,
          description: categoryForm.meta.description,
          keywords: categoryForm.meta.keywords,
        },
      };

      if (categoryForm.image) {
        catDetail.image = [categoryForm.image];
      }
      if (categoryForm.thumbnail_image) {
        catDetail.thumbnail_image = [categoryForm.thumbnail_image];
      }
      console.log('Add category payload', catDetail);
      addCategory({variables: catDetail});
    }
  };

  useEffect(() => {
    if (Categories.data && Categories.data.productCategories) {
      var selectedCat = JSON.parse(
        JSON.stringify(Categories.data.productCategories.data),
      );
      if (selectedCat && selectedCat.length) {
        setAllCategories(selectedCat);
      }
    }
  }, [Categories.data]);

  const isUrlExist = async url => {
    setLoader(true);
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
            Parent Category
          </Text>
          <Multiselect
            height={50}
            inititalselect={categoryForm.parentId}
            fieldname={'name'}
            ibw={0}
            inputBgColor={ThemeColor.whiteColor}
            data={allCategories ? allCategories : []}
            onchange={(name, itemValue) => {
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
          {/* <Picker
            style={{marginBottom: 10}}
            selectedValue={categoryForm.parentId}
            onValueChange={itemValue => {
              setCategoryForm({...categoryForm, ['parentId']: itemValue});
            }}>
            <Picker.Item label="Select Category" value="" />
            {allCategories.map(value => (
              <Picker.Item key={value.id} label={value.name} value={value.id} />
            ))}
          </Picker> */}
          <Input
            labelStyle={{marginTop: 10}}
            label="Description"
            value={categoryForm.description}
            onChangeText={value =>
              setCategoryForm({...categoryForm, ['description']: value})
            }
            multiline
            numberOfLines={2}
            errorMessage={validation.description}
          />

          <View>
            <Text
              style={{
                fontSize: 15,
                marginLeft: 8,
                fontWeight: '600',
                color: ThemeColor.blackColor,
              }}>
              Upload Feature Image
            </Text>
            <FeaturedImageComponents
              image={categoryForm.image}
              inputChange={img => {
                setCategoryForm({...categoryForm, ['image']: img});
              }}
              removeImage={() =>
                setCategoryForm({...categoryForm, ['image']: ''})
              }
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                marginLeft: 8,
                fontWeight: '600',
                marginTop: 10,
                color: ThemeColor.blackColor,
              }}>
              Upload Thumbnail Image
            </Text>
            <FeaturedImageComponents
              image={categoryForm.thumbnail_image}
              inputChange={img => {
                setCategoryForm({...categoryForm, ['thumbnail_image']: img});
              }}
              removeImage={() =>
                setCategoryForm({...categoryForm, ['thumbnail_image']: ''})
              }
            />
          </View>
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
