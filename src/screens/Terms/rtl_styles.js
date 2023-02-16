import {StyleSheet} from 'react-native';
import R from '../../resources/R';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.white,
    position: 'relative',
  },
  coloumncontainer1: {
    flexDirection: 'column',
    zIndex: 5,
  },
  coloumncontainers2: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -35,
    backgroundColor: 'rgba(255,255,255,0)',
    zIndex: 0,
  },
  coloumncontainers3: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    height: 100,
  },
  headingSubTittle: {
    fontSize: 18,
    color: R.colors.gold,
    fontFamily: 'SemplicitaPro-Bold',
    textAlign: 'right',
    marginTop: -5,
    // paddingHorizontal: 3,
  },
  headcont: {
    marginTop: 20,
    flexDirection: 'row-reverse',
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 20,
    zIndex: 3,
    backgroundColor: R.colors.white,
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
    transform: [{scaleX: -1}],
  },
});
export default Styles;
