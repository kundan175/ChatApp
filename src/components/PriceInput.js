import React from 'react';
import {View , StyleSheet } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import HelperFonts from '../Helper/HelperFonts';

const PriceInput = props => {
  const {
    value,
    setValue,
    delimiter,
    separator,
    style,
    prefix,
    placeholder,
    keyboardType,
    precision,
    maxLength,
    onBlur,
    isRTL
  } = props;

  return (
    <View style={style}>
      <CurrencyInput
        value={value}
        onChangeValue={setValue}
        prefix={prefix}
        delimiter={delimiter}
        separator={separator}
        precision={precision}
        maxLength={maxLength}
        onBlur={onBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        style={isRTL ? [styles.leftTxt ,  HelperFonts.font_B_Regular] : [styles.rightText ,  HelperFonts.font_B_Regular]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  leftTxt: {
    textAlign:"left"
  },
  rightText: {
    textAlign:"right"
  }

})

export default PriceInput;
