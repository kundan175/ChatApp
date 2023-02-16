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
    flexDirection: 'row-reverse',
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

  activeLot: {
    backgroundColor: R.colors.blue,
    borderRadius: 5,
    padding: 5,
    margin: -3,
    width: 35,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 3,
  },
  inActiveLot: {
    backgroundColor: R.colors.darkgray,
    borderRadius: 5,
    padding: 5,
    margin: -3,
    width: 35,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 3,
  },

  formLbl: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-Regular',
    fontSize: 16,
    marginBottom: 5,
    // fontWeight: '600',
    textAlign: 'right',
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
    paddingRight: 10,
    textAlign: 'right',
    justifyContent: 'center',
  },

  inputLayout: {
    marginTop: 5,
    color: R.colors.lightgray,
    fontFamily: 'SemplicitaPro-Regular',
    borderBottomColor: R.colors.orange,
    borderBottomWidth: 1.5,
  },

  tblcontainer: {
    flex: 1,
    marginBottom: 20,
  },
  tblhead: {
    backgroundColor: '#f3f3f3',
    height: 40,
    fontWeight: 'bold',
    fontFamily: 'SemplicitaPro-Bold',
    flexDirection: 'row-reverse',
  },
  tblheadtext: {
    fontWeight: 'bold',
    fontFamily: 'SemplicitaPro-Bold',
    paddingLeft: 5,
    fontSize: 12,
    flexDirection: 'row-reverse',
  },

  tbltext: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    flexDirection: 'row-reverse',
  },
  btnContainer1: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 3,
    alignContent: 'center',
    alignItems: 'center',
  },
  containertwocols: {
    flexDirection: 'row-reverse',
    paddingBottom: 5,
    paddingTop: 5,
    justifyContent: 'space-between',
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  itemleft: {
    textAlign: 'right',
    width: '50%',
  },
  itemright: {
    textAlign: 'left',
    width: '50%',
  },
  alignright: {
    textAlign: 'left',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  topbtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    marginRight: 15,
  },
  modalbtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
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
  buttonClose1: {
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
  },

  headingModalContainer: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    padding: 7,
  },
  headingModalContainers: {
    flexDirection: 'row-reverse',
    marginRight: -5,
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
  alignRight: {
    textAlign: 'right',
    alignItems: 'flex-end',
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
    paddingTop: 5,
    fontFamily: 'SemplicitaPro-Bold',
  },
  modalBtnSM: {
    backgroundColor: R.colors.blue,
    padding: 10,
    color: R.colors.white,
    borderRadius: 5,
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'SemplicitaPro-Bold',
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: R.colors.darkgray,
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
  buttonCloseg: {
    backgroundColor: R.colors.darkgray,
    fontFamily: 'SemplicitaPro-Bold',
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  row: {flexDirection: 'row-reverse'},
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  blubtn: {
    backgroundColor: R.colors.blue,
    borderRadius: 5,
    padding: 5,
    margin: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  blubtn1: {
    backgroundColor: R.colors.blue,
    borderRadius: 5,
    padding: 5,
    margin: 2,
    width: 35,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 8,
    marginRight: 10,
  },
  blubtn2: {
    backgroundColor: R.colors.blue,
    borderRadius: 5,
    padding: 5,
    margin: 2,
    width: 35,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 5,
    marginRight: 3,
  },
  blubtn3: {
    backgroundColor: R.colors.blue,
    borderRadius: 5,
    padding: 5,
    margin: 2,
    width: 35,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  prevlnk: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  },
  rowrev: {
    flexDirection: 'row-reverse',
  },

  formmt: {
    marginTop: 12,
  },

  formmb: {
    marginBottom: 7,
  },

  coloumncontainer3: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  modalitem1: {
    flex: 0.5,
    width: '60%',
  },
  modalitem2: {
    flex: 0.5,
    width: '40%',
  },
  formLblnb: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-Regular',
    fontSize: 15,
    marginBottom: 5,
  },
  btnContainercust: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  modalcustBtn: {
    backgroundColor: R.colors.blue,
    padding: 10,
    color: R.colors.white,
    borderRadius: 5,
    fontSize: 14,
    marginTop: 10,
    paddingLeft: 7,
    paddingRight: 7,
    fontFamily: 'SemplicitaPro-Bold',
  },
  mandatoryLbl: {
    fontSize: 13,
    color: R.colors.red,
    textAlign: 'right',
    marginBottom: 5,
    alignItems: 'flex-end',
  },
   labelText: {
    color: R.colors.black,
     fontFamily: 'SemplicitaPro-Regular',
    textAlign:"right"
  },
  headerTxt : {flexDirection:"row-reverse",alignItems : "center"},

});
export default Styles;
