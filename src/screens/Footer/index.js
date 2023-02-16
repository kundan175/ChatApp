import React from 'react';
import {View, Text} from 'react-native';
import HelperFonts from '../../Helper/HelperFonts';

import FooterStyles from './styles';

export default class Footer extends React.Component {
  render() {
    return (
      <View style={FooterStyles.bottomView}>
        <Text style={[FooterStyles.textStyle, HelperFonts.font_W_Regular]}>
          &copy; {new Date().getFullYear()} Petra Catalog
        </Text>
      </View>
    );
  }
}
