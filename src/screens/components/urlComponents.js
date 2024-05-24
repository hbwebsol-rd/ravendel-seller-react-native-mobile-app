import React, {useState} from 'react';
import {Input} from '@rneui/themed';
import styled from 'styled-components';
import Colors from '../../utils/color';
import {BASE_URL} from '../../utils/helper';
import AppLoader from './loader';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import {GET_URL} from '../../queries/productQueries';
import {mutation} from '../../utils/service';
import {Divider} from '@rneui/base';

const URLComponents = ({url, updateOf, changePermalink, updatePermalink}) => {
  const [editPremalink, setEditPermalink] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeUrl = () => {
    if (editPremalink) {
      setLoading(true);
      isUrlExist(url);
      setLoading(false);
    }
    setEditPermalink(!editPremalink);
  };

  const isUrlExist = async url => {
    let updatedUrl = await mutation(GET_URL, {url: url});
    updatePermalink(updatedUrl.data.validateUrl.url);
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      <URLWrapper edit={editPremalink}>
        {editPremalink ? (
          <Input
            label="Url"
            value={url}
            onChangeText={value => changePermalink(value)}
          />
        ) : (
          <URLLinkWrapper>
            <URLLabel>URL:</URLLabel>
            <URLValue>{url}</URLValue>
          </URLLinkWrapper>
        )}
        <Divider />
        <URLBtn onPress={changeUrl}>
          <URLBtnText>{editPremalink ? 'Ok' : 'Edit'}</URLBtnText>
        </URLBtn>
      </URLWrapper>
    </>
  );
};

export default URLComponents;

const URLWrapper = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
  padding-left: ${props => (props.edit ? '0px' : '15px')};
  padding-right: ${props => (props.edit ? '0px' : '15px')};
`;
const URLLinkWrapper = styled.View`
  flex-direction: row;
  border-color: #ddd;
  padding-bottom: 5px;
  width: 90%;
`;
const URLLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  padding-right: 10px;
`;
const URLValue = styled.Text`
  font-size: 16px;
`;
const URLBtn = styled.TouchableOpacity`
  background-color: ${Colors.primaryColor};
  padding: 5px 10px;
  width: 75px;
  align-self: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const URLBtnText = styled.Text`
  color: #fff;
  text-align: center;
`;
