import {StyleSheet, Dimensions} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
    position: 'relative',
    paddingBottom: 15,
  },
  textContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  coloumncontainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  coloumncontainers: {
    flexDirection: 'column',
    padding: 20,
  },

  item: {
    flex: 0.5,
    width: '50%',
    padding: 0,
  },
  headingSubTittle: {
    fontSize: 18,
    color: R.colors.gold,
    fontFamily: 'SemplicitaPro-Bold',
  },
  mandatoryLbl: {
    fontSize: 13,
    color: R.colors.red,
    textAlign: 'right',
    marginBottom: 5,
    alignItems: 'flex-end',
  },
  mandatory: {
    color: R.colors.red,
    fontSize: 13,
  },

  textStyleB: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
    fontSize: 16,
  },
  textStylelarge_1: {
    color: R.colors.black,
    fontSize: 20,
    fontFamily: 'SemplicitaPro-Bold',
    marginRight: 20,
    paddingTop: 5,
    alignItems:"center"
  },
   textStylelarge: {
    color: R.colors.black,
    fontSize: 30,
    fontFamily: 'SemplicitaPro-Bold',
    marginRight: 20,
    paddingTop: 5,
    alignItems:"center"
  },
  valuecont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:"center"
  },
  blueBkg: {
    backgroundColor: R.colors.blue,
    padding: 10,
    width: '104%',
    marginTop: 1,
    paddingLeft: 20,
    borderBottomEndRadius: 15,
    elevation: 5,
    marginLeft: -15,
    paddingBottom: 15,
  },
  blueBkgInverted: {
    backgroundColor: R.colors.blue,
    padding: 12,
    width: 10,
    left: 14,
    top: Platform.OS == 'android' ? 64 : 60,
    position: 'absolute',
    transform: [{rotate: '-30deg'}],
  },
  subTitle: {
    color: R.colors.white,
    fontSize: 18,
    fontFamily: 'SemplicitaPro-Bold',
  },
  portlet: {
    borderColor: '#e2e2e2',
    borderWidth: 1,
    width: '100%',
    padding: 15,
    borderTopWidth: 0,
    marginTop: -5,
    elevation: 1,
    marginBottom: 10,
    backgroundColor: R.colors.white,
    borderRadius: 7,
  },
  formLbl: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-Regular',
    fontSize: 16,
    marginBottom: 5,
  },
  formmt: {
    marginTop: 15,
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
    justifyContent: 'center',
  },
  inputTexts: {
    color: R.colors.lightgray,
    fontSize: 12,
    height: 40,
    fontFamily: 'SemplicitaPro-Regular',
    borderRadius: 5,
    backgroundColor: '#F6F9FA',
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
  },

  marginBot: {
    marginBottom: 30,
  },
  subBtn: {
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 0,
    marginEnd: 10,
    height: 42,
    width: 80,
    paddingTop: 7,
    alignItems: 'center',
    marginTop: 10,
  },

  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  prevlnk: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
  },
  headerTxt : {flexDirection:"row",alignItems : "center"},
});
export default Styles;
