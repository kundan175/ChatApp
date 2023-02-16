import {StyleSheet} from 'react-native';
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

  headingSubTittle: {
    fontSize: 18,
    color: R.colors.gold,
    fontFamily: 'SemplicitaPro-Bold',
  },

  textStyle: {
    color: R.colors.white,
  },
  textStyleB: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
    fontSize: 16,
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
    paddingLeft:10
  },

  inputLayout: {
    marginTop: 5,
    color: R.colors.lightgray,
    fontFamily: 'SemplicitaPro-Regular',
    borderBottomColor: R.colors.orange,
    borderBottomWidth: 1.5,
  },

  containertwocols: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5,
    justifyContent: 'space-between',
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    marginTop: 0,
  },
  itemleft: {
    textAlign: 'left',
    width: '50%',
  },
  itemright: {
    textAlign: 'right',
    width: '50%',
  },
  alignright: {
    textAlign: 'right',
  },
  alignleft: {
    textAlign: 'left',
    // fontFamily: 'SemplicitaPro-Medium',
    // fontWeight: '700',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },

  modalbtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  modalView: {
    margin: 10,
    marginTop: 50,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 5,
    display: 'flex',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
  },
  headingModalContainer: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    padding: 7,
  },
  headingModal: {
    fontSize: 16,
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
  },
  modalbg: {
    backgroundColor: R.colors.blue,
    padding: 2,
    paddingEnd: 10,
    paddingTop: 5,
    paddingLeft: 10,
    marginBottom: 10,
    width: '103%',
    marginLeft: -5,
    marginTop: -5,
  },
  headingBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  formcontainer: {
    padding: 10,
  },
  formcontainer_1: {
    alignItems: "flex-start",
    padding: 10,
  },
  alignRight: {
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  radioContainer: {
    alignItems: 'flex-start',
  },

  modalBtn: {
    backgroundColor: R.colors.blue,
    paddingBottom: 10,
    color: R.colors.white,
    borderRadius: 5,
    fontSize: 14,
    marginTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: 'SemplicitaPro-Bold',
  },
  modalBtng: {
    backgroundColor: R.colors.darkgray,
    padding: 10,
    color: R.colors.white,
    borderRadius: 5,
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'SemplicitaPro-Bold',
  },
  buttonClose: {
    backgroundColor: R.colors.grey,
    fontFamily: 'SemplicitaPro-Bold',
    marginBottom: 10,
    marginRight: 5,
  },
  textStyleB: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
    fontSize: 13,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    width: 80,
    textAlign: 'center',
    alignItems: 'center',
  },
  marginTB10: {
    marginTop: 10,
    marginBottom: 10,
  },

  lotHeader1: {
    backgroundColor: R.colors.blue,
    color: R.colors.white,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'SemplicitaPro-Bold',
    fontSize: 16,
    marginBottom: -1,
    width: '70%',
  },
  lotHeader2: {
    backgroundColor: R.colors.blue,
    color: R.colors.white,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'SemplicitaPro-Bold',
    fontSize: 16,
    marginBottom: -1,
    width: '30%',
  },
  coloumncontainer3: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#EAE6E6',
    padding: 10,
    width: '100%',
    elevation: 2,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    marginTop: 3,
    fontFamily: 'SemplicitaPro-SemiBold',
    color: R.colors.black,
    fontSize: 16,
  },
  headerText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SemplicitaPro-Bold',
    color: R.colors.black,
  },
  headers: {
    backgroundColor: '#EAE6E6',
    padding: 10,
    width: '100%',
    elevation: 2,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    fontFamily: 'SemplicitaPro-SemiBold',
    color: R.colors.black,
    fontSize: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headersText: {
    fontFamily: 'SemplicitaPro-SemiBold',
    color: R.colors.black,
    fontSize: 16,
    lineHeight: 25,
    width: '60%',
    marginLeft: 10,
  },

  headersTexts: {
    fontFamily: 'SemplicitaPro-SemiBold',
    color: R.colors.black,
    fontSize: 16,
    marginTop: 5,
    lineHeight: 20,
    textAlign: 'center',
    width: '40%',
  },
  tableHead: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'SemplicitaPro-Bold',
    color: R.colors.black,
  },
  tabletext: {
    padding: 7,
    fontFamily: 'SemplicitaPro-Regular',
    color: R.colors.black,
  },

  content: {
    padding: 20,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
  },
  active: {
    backgroundColor: R.colors.blue,
  },
  inactive: {
    backgroundColor: R.colors.gray,
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
  emailLabel: {
    fontFamily: 'SemplicitaPro-Regular',
    paddingBottom:2,
  },
headerTxt : {flexDirection:"row",alignItems : "center"},

});
export default Styles;
