import {Platform, StyleSheet} from 'react-native';

import R from '../../resources/R';

const HeaderStyles = StyleSheet.create({
  headercontainer: {
    padding: 0,
    margin: 0,
    paddingTop: 10,
    backgroundColor: R.colors.blue,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },

  headerimage: {
    width: 552,
    height: 70,
    marginLeft: -10,
    marginTop: 20,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },

  Menudrawer: {
    zIndex: 555,
    position: 'absolute',
  },
  headerlogo: {
    position: 'absolute',
    left: 35,
    top: -30,
    zIndex: 1,
  },

  toggler: {
    top: 20,
    textAlign: 'right',
    marginLeft: Platform.OS == 'android' ? 0 : -5,
  },
  logoimage: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 80,
    resizeMode: 'contain',
  },
  logoimg: {
    aspectRatio: 1,
    flex: 1,
    marginTop: 37,
    marginLeft: 7,
    height: 72,
    maxWidth: 80,
  },

  toggle: {
    position: 'absolute',
    right: 15,
    top: 25,
    zIndex: 1,
  },

  body: {
    flex: 1,
    position: 'absolute',
  },

  draweruserbg: {
    backgroundColor: R.colors.blue,
    padding: 20,
    zIndex: 999,
  },

  draweruser: {
    fontSize: 18,
    color: R.colors.white,
    marginTop: 20,
    fontFamily: 'SemplicitaPro-Bold',
    zIndex: 999,
  },

  drawerclose: {
    fontSize: 18,
    color: R.colors.white,
    marginTop: 20,
    fontFamily: 'SemplicitaPro-Bold',
    marginRight: 25,
    paddingRight: 25,
  },

  drawermenu: {
    color: R.colors.blue,
    height: 65,
    borderColor: R.colors.softgray,
    borderBottomWidth: 1,
    zIndex: 999,
    paddingLeft: 20,
    justifyContent: 'center',
  },

  drawermenusub: {
    margin: 10,
    marginLeft: 0,
  },
  drawermenusubs: {
    paddingLeft: 15,
    marginTop: Platform.OS == 'android' ? 5 : -5,
  },
  drawermenusubst: {
    fontFamily: 'SemplicitaPro-SemiBold',
    marginTop: Platform.OS == 'android' ? 5 : -2,
    marginLeft: 20,
  },
  menuimg: {
    height: 23,
    width: 25,
    resizeMode: 'contain',
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  menuimg1: {
    height: 20,
    width: 23,
    resizeMode: 'contain',
  },
  animatedBox: {
    flex: 1,
    backgroundColor: 'black',
    marginRight: -10,
    marginLeft: 10,
    zIndex: 999,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginTop: -15,
  },
  modalView: {
    flex: 1,
    width: 230,
    padding: 0,
    marginTop: Platform.OS == 'android' ? 0 : 47,
    backgroundColor: 'white',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: R.colors.blue,
  },
  textStyle: {
    color: R.colors.white,
  },
  modalContainer: {
    flex: 1,
  },

  modalText: {
    marginBottom: 15,
  },
});

export default HeaderStyles;
