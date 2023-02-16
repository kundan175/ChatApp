import {StyleSheet} from 'react-native';
import R from '../resources/R';

const HelperStyles = StyleSheet.create({
  textInputViewStyles: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    height: 60,
    color: R.colors.black,
    borderColor: R.colors.mediumgray,
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  textInputReverseViewStyles: {
    // flexDirection: 'row-reverse',
    // alignItems: 'flex-end',
    height: 60,
    color: R.colors.black,
    borderColor: R.colors.mediumgray,
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  insideTextInputStyle: {
    flex: 1,
    height: 60,
    padding: 10,
    color: R.colors.black,
    fontSize: 15,
    fontFamily: 'SemplicitaPro-Regular',
    paddingLeft: 10,
  },
  insideTextInputReverseStyle: {
    flex: 1,
    height: 60,
    padding: 10,
    color: R.colors.black,
    fontSize: 15,
    fontFamily: 'SemplicitaPro-Regular',
    textAlign: 'right',
    paddingLeft: 10,
  },
});

export default HelperStyles;
