import React from 'react';
import styled from 'styled-components';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native';
import {isEmpty} from '../../../utils/helper';

const FeaturedImage = ({image, removeImage, addImage}) => {
  return (
    <>
      {!isEmpty(image) ? (
        <FeatureImageWrapper>
          <Image source={{uri: image}} style={{width: 200, height: 200}} />
          <RemoveFeatureImageText onPress={removeImage}>
            <Icon name="close" color={Colors.deleteColor} size={14} /> Remove
            Image
          </RemoveFeatureImageText>
        </FeatureImageWrapper>
      ) : (
        <FeaturedImageUpload onPress={addImage}>
          <FeaturedImageUploadText>Upload Image</FeaturedImageUploadText>
        </FeaturedImageUpload>
      )}
    </>
  );
};

export const FeaturedImageUpload = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  background-color: #eee;
  margin-top: 10px;
`;
export const FeaturedImageUploadText = styled.Text`
  font-size: 18px;
  text-transform: uppercase;
  opacity: 0.5;
  color: #000;
`;
export const FeatureImageWrapper = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #eee;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;
export const RemoveFeatureImageText = styled.Text`
  color: ${Colors.deleteColor};
  margin-top: 10px;
`;

export default FeaturedImage;
