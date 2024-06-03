import React, {useState} from 'react';
import styled from 'styled-components';
import Colors from '../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image, PermissionsAndroid} from 'react-native';
import {isEmpty} from '../../utils/helper';
import {BottomSheet, ListItem} from '@rneui/themed';
import * as ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';

const FeaturedImageComponents = ({image, inputChange, removeImage}) => {
  /* =============================States============================= */
  const [uploadModal, setUploadModal] = useState(false);
  console.log(image);
  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Gallery'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality: 0.5,
    maxWidth: 500,
    maxHeight: 500,
  };

  /* =============================Upload Featured Image============================= */
  const UploadImage = response => {
    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log(response, 'resiiiu');
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      if (response && response.assets[0].uri) {
        ImgToBase64.getBase64String(response.assets[0].uri).then(
          base64String => {
            const file = {
              uri: response.assets[0].uri,
              file: 'data:image/png;base64,' + base64String,
            };
            inputChange(file);
          },
        );
      }
      console.log('response.uri', response.uri);
    }
    setUploadModal(false);
  };

  /* =============================Upload Featured Image============================= */
  const uploadModalBtn = [
    {
      title: 'Take Photo',
      onPress: () => {
        requestCameraPermission();
        // ImagePicker.launchCamera(options, response => {
        //   UploadImage(response);
        // });
      },
    },
    {
      title: 'Choose from library',
      onPress: () => {
        ImagePicker.launchImageLibrary(options, response => {
          UploadImage(response);
        });
      },
    },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: Colors.deleteColor},
      titleStyle: {color: 'white'},
      onPress: () => setUploadModal(false),
    },
  ];

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(options, response => {
          UploadImage(response);
        });
      } else {
        Alert.alert('Camera permission denied', '', [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      {!isEmpty(image) ? (
        <FeatureImageWrapper>
          <Image source={{uri: image.uri}} style={{width: 200, height: 200}} />
          <RemoveFeatureImageText onPress={removeImage}>
            <Icon name="close" color={Colors.deleteColor} size={14} /> Remove
            Image
          </RemoveFeatureImageText>
        </FeatureImageWrapper>
      ) : (
        <FeaturedImageUpload onPress={() => setUploadModal(true)}>
          <FeaturedImageUploadText>Upload Image</FeaturedImageUploadText>
        </FeaturedImageUpload>
      )}
      <BottomSheet isVisible={uploadModal}>
        {uploadModalBtn.map((l, i) => (
          <ListItem
            bottomDivider
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
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

export default FeaturedImageComponents;
