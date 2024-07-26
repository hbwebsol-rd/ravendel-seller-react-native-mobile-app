import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/color';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

const Accordion = ({title, children, defaultOpen, dense, withCheckbox}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  const onAccordionChange = () => {
    setOpen(!open);
  };

  const HeaderOpenStyle = {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  };

  const AccordionWrapper = styled.View`
    background-color: #fff;
    padding: ${dense ? '5px' : '10px'};
    margin-top: ${dense ? '5px' : '10px'};
    margin-bottom: ${dense ? '5px' : '10px'};
  `;
  const AccordionHeader = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `;
  const AccordionTitle = styled.Text`
    font-size: ${dense ? '14px' : '16px'};
    font-weight: bold;
    color: ${Colors.primaryColor};
  `;
  const AccordionBody = styled.View`
    overflow: hidden;
  `;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={onAccordionChange}
        style={
          open
            ? styles.header
            : {
                ...styles.header,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderColor: '#ddd',
              }
        }>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryColor,
          }}>
          {title}
        </Text>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          color={Colors.primaryColor}
          size={dense ? 12 : 16}
        />
      </TouchableOpacity>
      <View
        style={{
          // paddingHorizontal : 7,
          display: open ? 'flex' : 'none',
          // height: open ? 'auto' : 0,
          paddingTop: open ? 10 : 0,
          paddingBottom: open ? 10 : 0,
          backgroundColor: '#f2f2f2',
        }}>
        {children}
      </View>
    </View>
  );

  return (
    <AccordionWrapper>
      <AccordionHeader
        // onPress={onAccordionChange}
        style={open ? HeaderOpenStyle : {}}>
        <AccordionTitle>{title}</AccordionTitle>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          color={Colors.primaryColor}
          size={dense ? 12 : 16}
        />
      </AccordionHeader>
      <AccordionBody
        style={{
          // paddingHorizontal : 7,
          height: open ? 'auto' : 0,
          paddingTop: open ? 10 : 0,
          paddingBottom: open ? 10 : 0,
          backgroundColor: '#f2f2f2',
        }}>
        {children}
      </AccordionBody>
    </AccordionWrapper>
  );
};

export default Accordion;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
