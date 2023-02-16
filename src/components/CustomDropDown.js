import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HelperFonts from '../Helper/HelperFonts';

const CustomDropDown = props => {
  const {dropDownData, onValueChange, selectedValue, placeholder, search , isRTL} =
    props;

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={ isRTL ?  [styles.placeholderStyle, HelperFonts.font_B_Regular] : [styles.placeholderStyle_1, HelperFonts.font_B_Regular]}
      selectedTextStyle={[styles.selectedTextStyle , HelperFonts.font_B_Regular]}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={dropDownData}
      search={search}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder ? placeholder : 'Select item'}
      searchPlaceholder="Search..."
      value={selectedValue}
      onChange={onValueChange}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      )}
    />
  );
};

export default CustomDropDown;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    fontFamily: 'SemplicitaPro-Bold',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    textAlign: "right"
  },
  placeholderStyle_1: {
     fontSize: 16,
    textAlign: "left"
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    textAlign:"right"
  },
});
