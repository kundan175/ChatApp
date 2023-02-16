import {StyleSheet} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    flex: 1,
  },

  textContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },

  coloumncontainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // paddingBottom: 10,
  },

  headingTittle: {
    fontSize: 18,
    color: R.colors.blue,
    fontFamily: 'SemplicitaPro-Bold',
    textAlign: 'center',
  },

  item: {
    flex: 0.5,
    width: '100%',
    padding: 5,
  },

  itemBox: {
    padding: 3,
    borderWidth: 3,
    borderColor: '#0F2D58',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  itemBoxgr: {
    borderRightWidth: 3,
    borderEndColor: '#cecfd6',
    borderRadius: 15,
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  boxHeight: {
    height: 50,
    width: 90,
    // marginBottom: 10,
  },
});
export default Styles;
