import {StyleSheet} from 'react-native';
import Colors from '../utils/color';

const Styles = StyleSheet.create({
  pickerWrapper: {
    marginBottom: 7,
    marginTop: 7,
    // paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#15405059',
  },
  pickerLabel: {
    color: Colors.primaryColor,
    opacity: 0.5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: Colors.deleteColor,
    margin: 5,
    minWidth: 140,
  },
  submitBtn: {
    margin: 5,
    minWidth: 140,
  },
  intertLost: {
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
  },
  intertLostText: {
    color: '#fff',
    textAlign: 'center',
  },
  headerSepratorWrapper: {
    backgroundColor: Colors.primaryColor,
    height: 20,
  },
  headerSeprator: {
    backgroundColor: '#f2f2f2',
    height: 20,
  },
});

export default Styles;
