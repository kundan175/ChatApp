import {StyleSheet} from 'react-native';
import R from '../../resources/R';



const Styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
    position:'relative',
    },
    heading:{
      fontSize: 32,
      color: R.colors.black,
    },
    logo: {
      width: '50%',
      height: '100%',
      resizeMode: 'contain',
      right:0,
      left:0,
      alignSelf: 'center',
    },
    topicon: {
      position:'absolute',
      right:-100,
      top: -70,
      width:300,
      height:200,
    },
    boticon: {
      position:'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: -100,
      width:'100%',
      height:200,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 0
    },

});
export default Styles;