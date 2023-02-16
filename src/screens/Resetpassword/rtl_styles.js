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
  },
  
  headingTittle: {
    fontSize: 30,
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-Bold',
  },
  
 
  textFieldContainer:{

  },
  textInput: {
    color: R.colors.lightgray,
    fontSize: 12,
    height: 40,
    fontFamily: 'SemplicitaPro-Regular',
    backgroundColor: '#E8F0FE',

  },
 
  SectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#F6F9FA',
    
   
  },
  FucusedSectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    color: R.colors.black,
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    backgroundColor: '#F6F9FA',
    textAlign: 'right'
  },
  titleText: {
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Regular',
    marginTop: 30,
    marginBottom: 10,
  },
  textRowContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
    marginTop: 5,
  },
  inputText: {
    flex: 1,
    height: 40,
    color: R.colors.black,
    fontSize: 12,
    fontFamily: 'SemplicitaPro-Regular',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign:'right'
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
    marginTop:5,
    marginBottom:1,
    alignItems: 'center',
    width:100,
    
  },
  canBtn: {
    backgroundColor: R.colors.darkgray,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 10,
    marginTop:5,
    marginBottom:1,
    alignItems: 'center',
    width:100,
  },
  btncontainer : {
    display:'flex',
    flexDirection: 'row-reverse',
    paddingTop: 10,
    paddingLeft:0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadercontainer :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  }
});
export default Styles;
