import React, {Component} from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      isShowSelectLang: true,
      showChangePassword: false,
      oldPassword: '',
      password: '',
      confirmPassword: '',
      isOldPasswordFocus: false,
      isPasswordTextFocus: false,
      isConfirmedPasswordTextFocus: false,
      hideoldPassword: true,
      hidePassword: true,
      hideConfirmPassword: true,
      loaderVisible: true,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    this.getMembershipUserAccess();
  }

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    this.setState({isShowSelectLang: access.selectLanguage});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('login');
    return true;
  };

  localValidation = () => {
    this.setState({loaderVisible: true});

    if (this.state.oldPassword == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterOldPassword'), Toast.SHORT);
    } else if (this.state.password == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterNewPassword'), Toast.SHORT);
    } else if (this.state.confirmPassword == '') {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.pleaseEnterConfirmPassword'),
        Toast.SHORT,
      );
    } else if (this.state.oldPassword == this.state.password) {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.confirmOldPasswordNewPassword'),
        Toast.SHORT,
      );
    } else if (this.state.password != this.state.confirmPassword) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.confirmPasswordMisMatch'), Toast.SHORT);
    } else {
      this.checkValidPassword(this.state.password, this.state.confirmPassword);
    }
  };

  checkValidPassword = (newPassword = '', confirmPassword = '') => {
    // let passwordCondition =
    //   /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
    let passwordCondition = /^[a-z0-9A-Z_ @./#&+-]{5,}$/;
    let firstAns = passwordCondition.test(newPassword);
    if (!firstAns) {
      Toast.show(I18n.t('tostMessages.newPassCondition'), Toast.SHORT);
    } else {
      this.changePassword();
    }
  };

  changePassword = () => {
    var params = {
      OldPassword: this.state.oldPassword,
      NewPassword: this.state.password,
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.submitChangePassword,
      params,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false, showChangePassword: false});
        Toast.show(
          I18n.t('tostMessages.passwordChangedSuccessfully'),
          Toast.SHORT,
        );
        Preferences.savePreferences(
          Preferences.key.isFirstTimeLoggedIn,
          'False',
        );
        this.props.navigation.navigate('home');
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToChangePassword'), Toast.SHORT);
      }
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={Styles.container}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
            // hidden
          />
          <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={Styles.container}>
                <View style={Styles.textContainer}>
                  <View style={Styles.coloumncontainer}>
                    <FastImage
                      source={R.images.logo}
                      style={{
                        height: 97,
                        width: 200,
                        marginBottom: 40,
                      }}
                    />
                  </View>
                  <View style={Styles.formcontainer1}>
                    <Text style={Styles.formLbl}>
                      {I18n.t('changePassword.oldPassword')}:{' '}
                      <Text style={Styles.mandatoryLbl}>*</Text>
                    </Text>
                    <TextInput
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={oldPasswordText =>
                        this.setState({oldPassword: oldPasswordText})
                      }
                      value={this.state.oldPassword}
                      keyboardType="default"
                      maxLength={50}
                      secureTextEntry={this.state.hideoldPassword}
                      placeholder={I18n.t('changePassword.oldPassword')}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={Styles.pswdicon}
                      onPress={() => {
                        this.setState({
                          hideoldPassword: !this.state.hideoldPassword,
                        });
                      }}>
                      <FastImage
                        source={R.images.pswd_icon}
                        style={{
                          height: 18,
                          width: 18,
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        resizeMode={FastImage.resizeMode.contain}></FastImage>
                    </TouchableOpacity>
                  </View>

                  <View style={Styles.formcontainer1}>
                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('changePassword.newPassword')}:{' '}
                      <Text style={Styles.mandatoryLbl}>*</Text>
                    </Text>
                    <TextInput
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={passwordText =>
                        this.setState({password: passwordText})
                      }
                      value={this.state.password}
                      keyboardType="default"
                      maxLength={50}
                      secureTextEntry={this.state.hidePassword}
                      placeholder={I18n.t('changePassword.newPassword')}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={Styles.pswdicon}
                      onPress={() => {
                        this.setState({
                          hidePassword: !this.state.hidePassword,
                        });
                      }}>
                      <FastImage
                        source={R.images.pswd_icon}
                        style={{
                          height: 18,
                          width: 18,
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        resizeMode={FastImage.resizeMode.contain}></FastImage>
                    </TouchableOpacity>
                  </View>

                  <View style={Styles.formcontainer1}>
                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('changePassword.confirmPassword')}:{' '}
                      <Text style={Styles.mandatoryLbl}>*</Text>
                    </Text>
                    <TextInput
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={confirmPasswordText =>
                        this.setState({
                          confirmPassword: confirmPasswordText,
                        })
                      }
                      value={this.state.confirmPassword}
                      keyboardType="default"
                      maxLength={50}
                      secureTextEntry={this.state.hideConfirmPassword}
                      placeholder={I18n.t('changePassword.confirmPassword')}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={Styles.pswdicon}
                      onPress={() => {
                        this.setState({
                          hideConfirmPassword: !this.state.hideConfirmPassword,
                        });
                      }}>
                      <FastImage
                        source={R.images.pswd_icon}
                        style={{
                          height: 18,
                          width: 18,
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        resizeMode={FastImage.resizeMode.contain}></FastImage>
                    </TouchableOpacity>
                  </View>
                  <View style={Styles.btncontainer}>
                    <Pressable
                      style={[Styles.button, Styles.modalBtn]}
                      onPress={() => this.localValidation()}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.save')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
          <View
            style={{
              bottom: 0,
              alignSelf: 'flex-start',
              left: 20,
              paddingBottom: Platform.OS == 'android' ? 10 : 20,
            }}>
            <Text style={[Styles.grayText, HelperFonts.font_B_Regular]}>
              ©2022 Petra Catalog
            </Text>
          </View>
          {/* <Footer /> */}
        </SafeAreaView>
      </View>
    );
  }
}
