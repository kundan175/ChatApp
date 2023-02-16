import {StyleSheet, Platform} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  textContainer: {
    marginTop: 80,
    marginHorizontal: 35,
  },
  coloumncontainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 10,
    marginTop: 40,
  },
  textColoumnContainers: {
    marginBottom: 20,
  },
  headingTittle: {
    fontSize: 30,
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-SemiBold',
  },
  bodytext: {
    fontSize: 12,
    color: R.colors.lightgray,
    fontFamily: 'SemplicitaPro-Regular',
  },

  textFieldContainer: {},
  textInput: {
    color: R.colors.lightgray,
    fontSize: 12,
    height: 40,
    fontFamily: 'SemplicitaPro-Regular',
    backgroundColor: '#E8F0FE',
  },

  blueText: {
    color: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    textDecorationLine: 'underline',
    lineHeight: 27,
    marginVertical: -6,
  },
  grayText: {
    fontSize: 14,
    color: R.colors.grayText,
    fontFamily: 'SemplicitaPro-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 10,
  },
  signupTxt: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    borderRadius: 5,
    height: 40,
    lineHeight: 25,
    minWidth: 125,
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: Platform.OS == 'ios' ? 5 : 0,
  },
  button_1: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    borderRadius: 5,
    height: 40,
    lineHeight: 25,
    minWidth: 125,
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: Platform.OS == 'ios' ? 5 : 17,
  },
  SectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 1,
    borderColor: R.colors.mediumgray,
    borderRadius: 5,
  },
  FucusedSectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    color: R.colors.black,
    borderColor: R.colors.mediumgray,
    borderBottomWidth: 1,
  },
  titleText: {
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Bold',
    marginTop: 30,
    marginBottom: 10,
  },
  textRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 5,
    alignContent: 'flex-start',
  },
  inputText: {
    flex: 1,
    height: 60,
    padding: 10,
    color: R.colors.black,
    fontSize: 15,
    fontFamily: 'SemplicitaPro-Regular',
    paddingLeft: 10,
  },
  reqText: {
    color: R.colors.red,
  },

  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  forgot: {
    marginVertical: 20,
    alignSelf: 'flex-end',
  },
  btnar: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
export default Styles;
