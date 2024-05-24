import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Text, View} from 'react-native';
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
import {Input} from '@rneui/base';
import {isEmpty} from '../../../utils/helper';

const AllAttributesView = ({navigation}) => {
  const isFocused = useIsFocused();
  const {loading, error, data, refetch} = useQuery(GET_ATTRIBUTES, {
    notifyOnNetworkStatusChange: true,
  });
  const [inpvalue, setInpvalue] = useState('');
  const [AllAttribute, setAllAttribute] = useState([]);

  useEffect(() => {
    if (data && data?.productAttributes?.data)
      setAllAttribute(data?.productAttributes?.data);
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

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

  const handleinpiut = e => {
    setInpvalue(e);
  };

  useEffect(() => {
    let array;
    if (isEmpty(inpvalue)) {
      array = data?.productAttributes?.data;
    } else if (!isEmpty(inpvalue)) {
      let reg = new RegExp(inpvalue.toLowerCase());
      array = data.productAttributes.data.filter(item => {
        let name = item.name;
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    }
    setAllAttribute(array);
  }, [inpvalue]);

  const Item = ({attr, i}) => (
    <>
      <AttrCard key={i}>
        <AttrHeader>
          <AttrName>{attr.name}</AttrName>
          <AttrActionWrapper>
            <AttrActionBtn
              onPress={() => {
                navigation.navigate('EditAttribute', {
                  id: attr.id,
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
              <Icon name="trash" size={15} color={ThemeColor.deleteColor} />
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
    </>
  );

  const renderItem = ({item, i}) => <Item attr={item} i={i} />;

  if (loading) {
    return <AppLoader />;
  }
  return (
    <MainContainer>
      <AttributesWrapper>
        {/* {loading && <AppLoader />} */}
        {error && <Text>Something went wrong. Please try again later</Text>}
        <Input
          // keyboardType="numeric"
          // type="number"
          label="Search Attribute"
          value={inpvalue}
          onChangeText={handleinpiut}
        />
        {data && data.productAttributes && (
          <>
            <FlatList
              initialNumToRender={10}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              data={AllAttribute}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      alignSelf: 'center',
                      color: 'grey',
                    }}>
                    No Records Found
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </AttributesWrapper>
    </MainContainer>
  );
};

export default AllAttributesView;
