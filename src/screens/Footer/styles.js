import {StyleSheet} from 'react-native';

import R from '../../resources/R';

const FooterStyles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#1c3a69',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopColor: '#FFEB99',
    borderTopWidth: 4,
    padding: 5,
  },

  textStyle: {
    color: R.colors.white,
  }
});

export default FooterStyles;