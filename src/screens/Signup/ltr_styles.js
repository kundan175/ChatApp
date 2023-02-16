import {StyleSheet} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
    paddingTop: 40,
  },
  textContainer: {
    marginTop: 20,
    marginHorizontal: 35,
    paddingBottom: 10,
  },
  coloumncontainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 10,
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

  titleText: {
    color: R.colors.black,
    fontSize: 14,
    fontFamily: 'SemplicitaPro-SemiBold',
    marginTop: 10,
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
    height: 40,
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Regular',
    paddingLeft: 10,
  },
  inputTexts: {
    borderColor: R.colors.mediumgray,
    borderBottomWidth: 1,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    marginVertical: 20,
  },
  textInput: {
    color: R.colors.lightgray,
    fontSize: 12,
    height: 40,
    fontFamily: 'SemplicitaPro-Regular',
    borderRadius: 5,
    backgroundColor: '#F6F9FA',
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    paddingLeft: 10,
  },
  reqText: {
    color: R.colors.red,
  },

  textStyleB: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
  },
  subBtn: {
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 10,
    marginTop: 5,
    marginBottom: 1,
    alignItems: 'center',
    width: 120,
  },
  canBtn: {
    backgroundColor: R.colors.darkgray,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 10,
    marginTop: 5,
    marginBottom: 1,
    alignItems: 'center',
    width: 120,
  },
  btncontainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
});
export default Styles;
