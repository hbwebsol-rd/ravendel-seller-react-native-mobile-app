import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';

const BottomModal = ({children, modalOpen, setModalOpen}) => {
  const bottomSheetModalRef = useRef(null);

  // variables

  const snapPoints = useMemo(() => ['60%'], []); // For Bottomsheet Modal
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      console.log('hiiii');
      bottomSheetModalRef.current?.present();
      //   handlePresentModalPress();
    } else {
      //   console.log('biiii');
      bottomSheetModalRef.current?.dismiss();
    }
  }, [modalOpen]);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheetModal
      onDismiss={() => setModalOpen(false)}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      style={{flex: 1, elevation: 10, paddingHorizontal: 15}}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BottomModal;
