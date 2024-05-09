import React from 'react';
import {Alert, Text} from 'react-native';
import {
  AttributesWrapper,
  AttrCard,
  AttrName,
  AttrVal,
  AttrActionWrapper,
  AttrActionBtn,
  AttrValTitle,
  AttrValWrapper,
  AttrHeader,
} from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import ThemeColor from '../../../utils/color';
import {Query, useQuery} from '@apollo/client';
import {
  GET_ATTRIBUTES,
  DELETE_ATTRIBUTE,
} from '../../../queries/attributesQueries';
import AppLoader from '../../components/loader';
import {useIsFocused} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const AllAttributesView = ({navigation}) => {
  const isFocused = useIsFocused();
  const {loading, error, data, refetch} = useQuery(GET_ATTRIBUTES);
  console.log(data, 'cddd');
  const useDeleteAttribute = () => {
    const [deleteAttributeMutation, {loading, error}] = useMutation(
      DELETE_ATTRIBUTE,
      {
        refetchQueries: [{query: GET_ATTRIBUTES}],
        onError: error => {
          // Handle error as needed
          console.error('Error deleting attribute:', error);
        },
        onCompleted: data => {
          // Handle completion as needed
          console.log('Attribute deleted successfully:', data);
        },
      },
    );

    // return { deleteAttribute, loading, error };
  };

  // const deleteAttribute = id => {
  const [deleteAttribute, {loadings, errors}] = useMutation(DELETE_ATTRIBUTE, {
    refetchQueries: [{query: GET_ATTRIBUTES}],
    onError: error => {
      // Handle error as needed
      console.error('Error deleting attribute:', error);
    },
    onCompleted: data => {
      // Handle completion as needed
      GraphqlSuccess('Deleted successfully');
      console.log('Attribute deleted successfully:', data);
    },
  });

  const deleteAttributeFun = id => {
    console.log(id);
    deleteAttribute(id);
  };
  return (
    <MainContainer>
      <AttributesWrapper>
        {loading && <AppLoader />}
        {error && <Text>Something went wrong. Please try again later</Text>}

        {data && data.productAttributes && (
          <>
            {data.productAttributes.data.map((attr, i) => (
              <AttrCard key={i}>
                <AttrHeader>
                  <AttrName>{attr.name}</AttrName>
                  <AttrActionWrapper>
                    <AttrActionBtn
                      onPress={() => {
                        navigation.navigate('AttrbutesScreen', {
                          screen: 'EditAttribute',
                          params: {id: attr.id},
                        });
                      }}>
                      <Icon name="pencil" size={15} color="#000" />
                    </AttrActionBtn>
                    <AttrActionBtn
                      onPress={() => {
                        Alert.alert(
                          'Are you sure?',
                          '',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: () =>
                                deleteAttributeFun({
                                  variables: {id: attr.id},
                                }),
                            },
                          ],
                          {cancelable: false},
                        );
                      }}>
                      <Icon
                        name="trash"
                        size={15}
                        color={ThemeColor.deleteColor}
                      />
                    </AttrActionBtn>
                  </AttrActionWrapper>
                </AttrHeader>

                {attr.values && attr.values.length ? (
                  <AttrValWrapper>
                    <AttrValTitle>Values</AttrValTitle>
                    <AttrVal>
                      {attr.values.map((val, i) => val.name).join(', ')}
                    </AttrVal>
                  </AttrValWrapper>
                ) : null}
              </AttrCard>
            ))}
          </>
        )}
      </AttributesWrapper>
    </MainContainer>
  );
};

export default AllAttributesView;
