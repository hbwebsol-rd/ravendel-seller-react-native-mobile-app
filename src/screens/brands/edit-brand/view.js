import React, {useState, useEffect} from 'react';
import {isEmpty, BASE_URL} from '../../../utils/helper';
import AppLoader from '../../components/loader';
import {Input} from '@rneui/themed';
import URLComponents from '../../components/urlComponents';
import FeaturedImageComponents from '../../components/featuredImageComponents';
import {EditCategoryWrapper, FormWrapper, MetaSectiontitle} from './styles';
import {useMutation} from '@apollo/client';
import {UPDATE_BRAND} from '../../../queries/brandsQueries';
import FormActionsComponent from '../../components/formAction';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const EditBrandView = ({navigation, singleBrandDetail}) => {
  const [brandFrom, setBrandForm] = useState({});
  const [featureImage, setFeatureImage] = useState('');
  const [updateBrand, {loading: addedLoading}] = useMutation(UPDATE_BRAND, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      GraphqlSuccess('Updated successfully');
      setBrandForm({});
      navigation.goBack();
    },
  });

  useEffect(() => {
    if (singleBrandDetail) {
      setBrandForm(singleBrandDetail);
    }
  }, [singleBrandDetail]);

  const UpdateBrandsForm = () => {
    var updateBrandObject = {
      id: brandFrom.id,
      name: brandFrom.name,
      url: brandFrom.url,
      brand_logo:
        brandFrom.brand_logo === '' || brandFrom.brand_logo === null
          ? featureImage
          : brandFrom.brand_logo,
      meta: {
        title: brandFrom.meta.title,
        description: brandFrom.meta.description,
        keywords: brandFrom.meta.keywords,
      },
    };
    updateBrand({variables: updateBrandObject});
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

              {brandFrom.brand_logo ? (
                <FeaturedImageComponents
                  image={BASE_URL + brandFrom.brand_logo}
                  inputChange={img => {
                    setBrandForm({...brandFrom, ['brand_logo']: img});
                  }}
                  removeImage={() =>
                    setBrandForm({...brandFrom, ['brand_logo']: ''})
                  }
                />
              ) : (
                <>
                  <FeaturedImageComponents
                    image={featureImage}
                    inputChange={img => setFeatureImage(img)}
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
