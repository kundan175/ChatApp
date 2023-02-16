import {StyleSheet} from 'react-native';
import R from '../resources/R';

const HelperFonts = StyleSheet.create({
  font_W_Bold: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
  },
  font_W_Regular: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Regular',
  },
  font_B_Regular: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-Regular',
  },
  font_B_Bold: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-SemiBold',
  },
  mandatory_Regular: {
    color: R.colors.red,
    fontFamily: 'SemplicitaPro-Regular',
  },
  glodTitle : {
    color: R.colors.gold,
     fontFamily: 'SemplicitaPro-Bold',
    fontSize : 16
  }
});

export default HelperFonts;
