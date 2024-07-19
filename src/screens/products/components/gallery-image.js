import React from 'react';
import styled from 'styled-components';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native';

const GalleryImage = ({images, removeImage, addImage}) => {
  return (
    <GalleryImageWrapper>
      {images.length
        ? images.map((img, i) => (
            <GalleryImageCard key={i}>
              <Image source={{uri: img}} style={{width: 70, height: 70}} />
              <GalleryImageRemove
                onPress={() => {
                  removeImage(img);
                }}>
                <Icon name="close" color="#fff" size={14} />
              </GalleryImageRemove>
            </GalleryImageCard>
          ))
        : null}
      <GalleryImageCard onPress={addImage}>
        <GalleryImageAdd>
          <Icon name="plus" color="#3a3a3a" onPress={addImage} size={25} />
        </GalleryImageAdd>
      </GalleryImageCard>
    </GalleryImageWrapper>
  );
};

const GalleryImageWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
`;
const GalleryImageCard = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  background-color: #eee;
  margin: 5px;
  padding: 10px;
  position: relative;
  justify-content: center;
  align-items: center;
`;
const GalleryImageRemove = styled.TouchableOpacity`
  background-color: ${Colors.deleteColor};
  position: absolute;
  top: -5px;
  right: -5px;
  border-radius: 50px;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
`;
const GalleryImageAdd = styled.TouchableOpacity``;

export default GalleryImage;
