import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import WebUrls from '../../api/WebUrls';
import I18n from '../../i18n/i18n';
import NavigationService from '../../navigator/NavigationService';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSideMenu: false,
      modalVisible: false,

      userName: '',
      baseURL: WebUrls.url.TOKEN_URL,
      companyLogoPath: '',
      loaderVisible: false,
    };
  }

  componentDidMount() {
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    this.getHeaderDefaults();
  }

  async getHeaderDefaults() {
    var name = await Preferences.getPreferences(Preferences.key.UserName);
    var logo = await Preferences.getPreferences(Preferences.key.CompanyLogo);
    this.setState({
      userName: name,
      companyLogoPath: logo,
    });
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  async logout() {
    const storedKeys = [
      Preferences.key.ISLOGIN,
      Preferences.key.TOKEN,
      Preferences.key.UserID,
      Preferences.key.UserName,
      Preferences.key.Email,
      Preferences.key.LanguageID,
      Preferences.key.MembershipAccess,
    ];
    await AsyncStorage.multiRemove(storedKeys);
    global.isLogin = 'false';
    global.token = '';
    NavigationService.navigate('login');
    this.setState({loaderVisible: true});
  }

  navigateTo = (screenName = '') => {
    this.setState({modalVisible: false});
    this.props.navigation.replace(screenName);
  };

  render() {
    const {modalVisible} = this.state;
    const {isDrawerRequired = true} = this.props;
    return (
      <View>
        {!this.state.loaderVisible ? (
          <View style={Styles.headercontainer}>
            <ImageBackground
              source={R.images.header}
              resizeMode="contain"
              style={Styles.headerimage}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <View style={Styles.headerlogo}>
                    <FastImage
                      source={{uri: this.state.companyLogoPath}}
                      style={Styles.logoimg}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                </View>
                <View style={{flex: 1}}>
                  {isDrawerRequired == true && (
                    <TouchableOpacity
                      onPress={() => this.setModalVisible(true)}
                      hitSlop={{top: 75, bottom: 75, left: 75, right: 75}}
                      style={Styles.body}>
                      <View style={Styles.toggler}>
                        <FastImage
                          source={R.images.toggle}
                          style={{
                            height: 28,
                            width: 28,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ImageBackground>
            <View>
              <Modal
                animationType="fade"
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                useNativeDriver={true}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    this.setState({modalVisible: false});
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View>
                        <View style={Styles.draweruserbg}>
                          <Text style={Styles.draweruser}>
                            {this.state.userName}
                          </Text>
                        </View>

                        <View>
                          <TouchableOpacity
                            onPress={() => this.navigateTo('home')}>
                            <View style={Styles.drawermenu}>
                              <Text>
                                <FastImage
                                  source={R.images.home}
                                  style={Styles.menuimg1}
                                  resizeMode={FastImage.resizeMode.contain}
                                />
                                &nbsp;&nbsp;&nbsp;{' '}
                                <Text style={Styles.drawermenusubst}>
                                  {I18n.t('home.home')}
                                </Text>
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => this.navigateTo('profile')}>
                            <View style={Styles.drawermenu}>
                              <Text>
                                <FastImage
                                  source={R.images.profile}
                                  style={Styles.menuimg1}
                                  resizeMode={FastImage.resizeMode.contain}
                                />
                                &nbsp;&nbsp;&nbsp;{' '}
                                <Text style={Styles.drawermenusubst}>
                                  {I18n.t('home.profile')}
                                </Text>
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              this.logout();
                            }}>
                            <View style={Styles.drawermenu}>
                              <Text>
                                <FastImage
                                  source={R.images.logout}
                                  style={Styles.menuimg}
                                  resizeMode={FastImage.resizeMode.contain}
                                />
                                &nbsp;&nbsp;&nbsp;{' '}
                                <Text style={Styles.drawermenusubst}>
                                  {I18n.t('home.logOut')}
                                </Text>
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </View>
        ) : (
          <View style={Styles.loadercontainer}>
            <ActivityIndicator size="small" color="#000000" />
            <View style={{position: 'absolute'}}>
              <FastImage
                source={R.images.loader}
                style={{
                  height: 250,
                  width: 250,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}
