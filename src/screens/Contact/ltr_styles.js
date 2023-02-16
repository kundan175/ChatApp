import {StyleSheet} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  textContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  coloumncontainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  item :{
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
    fontSize:13,
    color: R.colors.red,
    textAlign: 'right',
    marginBottom: 5,
    alignItems: 'flex-end',
  },
  mandatory: {
    color: R.colors.red,
    fontSize:13,
  },
  textStyleB: {
    color: R.colors.white,
    fontFamily: 'SemplicitaPro-Bold',
  },
  formLbl: {
    color: R.colors.black,
    fontFamily: 'SemplicitaPro-SemiBold',
    fontSize: 15,
    marginBottom:5,
  },
  formmt: {
    marginTop:15,
  },
  formcontainer: {
    padding:20,
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
  },
  textInputm: {
    color: R.colors.lightgray,
    fontSize: 12,
    height: 100,
    fontFamily: 'SemplicitaPro-Regular',
    borderRadius: 5,
    backgroundColor: '#F6F9FA',
    borderColor: R.colors.mediumgray,
    borderWidth: 1,
    textAlignVertical: 'top',
    paddingLeft:10,
  },
  subBtn: {
    backgroundColor: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 10,
    marginTop:5,
    marginBottom:1,
    minWidth:80,
    alignItems: 'center',
    
  },
  canBtn: {
    backgroundColor: R.colors.darkgray,
    fontFamily: 'SemplicitaPro-Bold',
    borderRadius: 5,
    padding: 10,
    marginEnd: 10,
    marginTop:5,
    marginBottom:1,
    width:80,
    alignItems: 'center',
  },
  btncontainer : {
    display:'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft:20,
  },
  pdtop: {
    marginTop:5,
  },
  loadercontainer :{
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
