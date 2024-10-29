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
import {useMutation} from '@apollo/client';
import {UPDATE_BRAND} from '../../../queries/brandsQueries';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import {ALERT_ERROR, ALERT_SUCCESS} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';

const EditBrandView = ({navigation, singleBrandDetail}) => {
  const dispatch = useDispatch();
  const [brandFrom, setBrandForm] = useState({});
  const [featureImage, setFeatureImage] = useState('');
  const [validation, setValdiation] = useState({
    name: '',
  });

  const [updateBrand, {loading: addedLoading}] = useMutation(UPDATE_BRAND, {
    onError: error => {
      console.log(error);
      dispatch({type: ALERT_ERROR, payload: 'Something went wrong'});
    },
    onCompleted: data => {
      console.log(data, ' update success');
      if (data.updateBrand.success) {
        dispatch({type: ALERT_SUCCESS, payload: data.updateBrand.message});

        setBrandForm({});
        navigation.goBack();
      } else {
        dispatch({type: ALERT_ERROR, payload: data.updateBrand.message});
      }
    },
  });

  useEffect(() => {
    if (!isEmpty(singleBrandDetail)) {
      const data = {
        url: singleBrandDetail.url,
        name: singleBrandDetail.name,
        brand_logo: {
          uri: singleBrandDetail.brand_logo
            ? BASE_URL + singleBrandDetail.brand_logo
            : null,
        },
        meta: {
          description: singleBrandDetail.meta.description,
          keywords: singleBrandDetail.meta.keywords,
          title: singleBrandDetail.meta.title,
        },
      };
      setFeatureImage(data.image);
      setBrandForm(data);
    }
  }, [singleBrandDetail]);

  const UpdateBrandsForm = () => {
    if (isEmpty(brandFrom.name)) {
      setValdiation({...validation, name: 'Brand Name is required'});
    } else if (!SPECIAL_CHARACTER_REGEX.test(brandFrom.name)) {
      setValdiation({
        ...validation,
        name: 'brands should contain only letters and numbers',
      });
    } else {
      var updateBrandObject = {
        id: singleBrandDetail.id,
        name: brandFrom.name.trim(),
        url: brandFrom.url,
        updated_brand_logo: brandFrom.updated_brand_logo
          ? [brandFrom.updated_brand_logo]
          : '',
        meta: {
          title: brandFrom.meta.title.trim(),
          description: brandFrom.meta.description.trim(),
          keywords: brandFrom.meta.keywords.trim(),
        },
      };
      console.log('update brand payload: ', updateBrandObject);
      updateBrand({variables: updateBrandObject});
    }
  };

  return (
    <>
      {addedLoading ? <AppLoader /> : null}
      {!isEmpty(brandFrom) ? (
        <>
          <FormActionsComponent
            onCancel={() => navigation.goBack()}
            onSubmit={UpdateBrandsForm}
            submitText="Save"
          />
          <EditCategoryWrapper>
            <FormWrapper>
              <Input
                label="Brand Name"
                value={brandFrom.name}
                onChangeText={value =>
                  setBrandForm({...brandFrom, ['name']: value})
                }
                onEndEditing={event => {
                  let value =
                    !!event.nativeEvent && !!event.nativeEvent.text
                      ? event.nativeEvent.text
                      : event;
                  if (brandFrom.meta && brandFrom.meta.title === '') {
                    brandFrom.meta.title = value;
                    setBrandForm({
                      ...brandFrom,
                    });
                  }
                }}
                errorMessage={validation.name}
              />
              <URLComponents
                url={brandFrom.url}
                updateOf="ProductBrand"
                changePermalink={value =>
                  setBrandForm({...brandFrom, ['url']: value})
                }
                updatePermalink={value =>
                  setBrandForm({...brandFrom, ['url']: value})
                }
              />
              {isEmpty(brandFrom.updated_brand_logo) &&
              brandFrom.brand_logo.uri ? (
                <FeaturedImageComponents
                  image={brandFrom.brand_logo}
                  inputChange={img => {
                    setBrandForm({...brandFrom, ['updated_brand_logo']: img});
                    setFeatureImage(img);
                  }}
                  removeImage={() =>
                    setBrandForm({
                      ...brandFrom,
                      ['updated_brand_logo']: '',
                      ['brand_logo']: '',
                    })
                  }
                />
              ) : (
                <>
                  <FeaturedImageComponents
                    image={featureImage}
                    inputChange={img => {
                      setBrandForm({
                        ...brandFrom,
                        ['update_brand_logo']: img,
                      });
                      setFeatureImage(img);
                    }}
                    removeImage={() => setFeatureImage('')}
                  />
                </>
              )}

              <MetaSectiontitle>Meta</MetaSectiontitle>
              <Input
                label="Meta Title"
                value={brandFrom.meta.title}
                onChangeText={value => {
                  brandFrom.meta.title = value;
                  setBrandForm({
                    ...brandFrom,
                  });
                }}
              />
              <Input
                label="Meta Keyword"
                value={brandFrom.meta.keywords}
                onChangeText={value => {
                  brandFrom.meta.keywords = value;
                  setBrandForm({
                    ...brandFrom,
                  });
                }}
              />
              <Input
                label="Meta Description"
                value={brandFrom.meta.description}
                onChangeText={value => {
                  brandFrom.meta.description = value;
                  setBrandForm({
                    ...brandFrom,
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

export default EditBrandView;
