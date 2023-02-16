import {StyleSheet} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  textContainer: {
    marginTop: 20,
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
    fontFamily: 'SemplicitaPro-Bold',
    textAlign: 'center',
    lineHeight: 20,
    marginLeft: 10,
  },
  signupTxt: {
    flexDirection: 'row-reverse',
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
    minWidth: 140,
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    paddingHorizontal: Platform.OS == 'ios' ? 5 : 0,
    display: 'flex',
    flexDirection: 'row',
  },
  SectionStyle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 45,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#F6F9FA',
  },
  FucusedSectionStyle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 40,
    color: R.colors.black,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    backgroundColor: '#F6F9FA',
  },
  titleText: {
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Bold',
    marginTop: 30,
    marginBottom: 10,
  },
  textRowContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 5,
    alignContent: 'flex-start',
  },
  inputText: {
    flex: 1,
    height: 40,
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Regular',
    paddingRight: 10,
    flexDirection: 'row-reverse',
    textAlign: 'right',
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
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  btnar: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
});
export default Styles;
