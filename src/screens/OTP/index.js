import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo, {getManufacturerSync} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import HelperFonts from '../../Helper/HelperFonts';
import HelperStyles from '../../Helper/HelperStyles';
import I18n from '../../i18n/i18n';
import NavigationService from '../../navigator/NavigationService';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class OTP extends React.Component {
  constructor(props) {
    super(props);

    var otpParamsObj = this.props.navigation.getParam('otpParams');

    this.state = {
      loaderVisible: true,

      username: otpParamsObj.username,
      password: otpParamsObj.password,
      otpRequestID: otpParamsObj.otpRequestID,

      device_UniqueID: '',
      device_Manufacture: '',
      device_Name: '',
      device_Model_No: '',

      otp: '',
      isOTPTextFocus: false,
      hideOTP: true,
      isResend: false,
    };
  }

  componentDidMount() {
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.setState({loaderVisible: false});

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton = () => {
    this.props.navigation.replace('login');
    return true;
  };

  localValidation = () => {
    this.setState({loaderVisible: true});

    if (this.state.otp == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.enterValidOTP'), Toast.SHORT);
    } else {
      this.submitOTP();
    }
  };

  resendOTP() {
    this.setState({loaderVisible: true, isResend: false});

    WebMethods.postRequest(
      WebUrls.url.resendOTP + '?EmailID=' + this.state.username,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false, otpRequestID: response.message});

        Toast.show(I18n.t('tostMessages.reSendOTPSuccessfull'), Toast.SHORT);
      } else {
        this.setState({loaderVisible: false});

        Toast.show(I18n.t('tostMessages.failedToReSendOTP'), Toast.SHORT);
      }
    });
  }

  getDeviceInfo = () => {
    this.state.device_UniqueID = DeviceInfo.getUniqueId();
    this.state.device_Manufacture = getManufacturerSync();
    this.state.device_Name = DeviceInfo.getDeviceNameSync();
    this.state.device_Model_No = DeviceInfo.getModel();
  };

  getMembershipUserAccess = async () => {
    const LoginStatus = await Preferences.getPreferences(
      Preferences.key.isFirstTimeLoggedIn,
    );
    const TermsStatus = await Preferences.getPreferences(
      Preferences.key.isTermsAgreed,
    );
    WebMethods.getRequestWithHeader(WebUrls.url.getMembershipUserAccess).then(
      response => {
        if (response.data != null) {
          Preferences.saveObjPreferences(
            Preferences.key.MembershipAccess,
            response.data,
          );
          this.setState({loaderVisible: false});
          if (TermsStatus == 'False') {
            this.props.navigation.navigate('terms', {fromScreen: 'OTP'});
          } else if (LoginStatus == 'True') {
            this.props.navigation.navigate('ChangePassword');
          } else if (LoginStatus == 'True' && TermsStatus == 'False') {
            this.props.navigation.navigate('home');
          } else {
            this.props.navigation.navigate('home');
          }
        } else {
          this.setState({loaderVisible: false});

          Toast.show(I18n.t('tostMessages.loginFailed'), Toast.SHORT);

          NavigationService.navigate('login');
        }
      },
    );
  };

  getAccessToken = () => {
    var formBody = [];

    formBody.push(
      encodeURIComponent('username') +
        '=' +
        encodeURIComponent(this.state.username),
    );
    formBody.push(
      encodeURIComponent('password') +
        '=' +
        encodeURIComponent(this.state.password),
    );
    formBody.push(
      encodeURIComponent('grant_type') + '=' + encodeURIComponent('password'),
    );
    formBody = formBody.join('&');

    WebMethods.tokenRequest(WebUrls.url.login, formBody).then(response => {
      if (response.access_token != null) {
        Preferences.savePreferences(Preferences.key.ISLOGIN, 'true');
        Preferences.savePreferences(
          Preferences.key.TOKEN,
          response.access_token,
        );

        Preferences.savePreferences(Preferences.key.UserID, response.userId);
        Preferences.savePreferences(
          Preferences.key.UserName,
          response.userName,
        );
        Preferences.savePreferences(Preferences.key.Email, response.userEmail);
        Preferences.savePreferences(Preferences.key.CompanyLogo, response.companyLogoPath);

        Preferences.savePreferences(
          Preferences.key.isFirstTimeLoggedIn,
          response.firstTimeLoginFlag,
        );

        Preferences.savePreferences(
          Preferences.key.isTermsAgreed,
          response.isAgreed,
        );

        global.isLogin = 'true';
        global.token = response.access_token;
        global.languageID = response.languageId;

        this.setState({
          otp: '',
          username: '',
          password: '',
          otpRequestID: '',
        });

        this.getMembershipUserAccess();
      } else {
        this.setState({loaderVisible: false});

        Toast.show(I18n.t('tostMessages.loginFailed'), Toast.SHORT);

        NavigationService.navigate('login');
      }
    });
  };

  submitOTP = () => {
    var params = {};
    if (this.state.password == '') {
      params = {
        OTPPassword: this.state.otp,
        OTPRequestId: this.state.otpRequestID,
        EmailID: this.state.username,
        DeviceObj: null,
      };
    } else {
      this.getDeviceInfo();

      params = {
        OTPPassword: this.state.otp,
        OTPRequestId: this.state.otpRequestID,
        EmailID: this.state.username,
        DeviceObj: {
          Device_ID: this.state.device_UniqueID,
          Device_Manufacture: this.state.device_Manufacture,
          Device_Name: this.state.device_Name,
          Model_No: this.state.device_Model_No,
        },
      };
    }

    WebMethods.postRequest(WebUrls.url.submitOTP, params).then(response => {
      if (response.data) {
        if (this.state.password != '') {
          this.getAccessToken();
        } else {
          this.props.navigation.navigate('resetpassword', {
            userID: response.message,
          });
        }
      } else {
        this.setState({
          loaderVisible: false,
          otp: '',
          otpRequestID: '',
          isResend: true,
        });

        Toast.show(I18n.t('tostMessages.invalidOTP'), Toast.SHORT);
      }
    });
  };

  render() {
    return !this.state.loaderVisible ? (
      <View style={{flex: 1}}>
        <SafeAreaView style={Styles.container}>
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
                    <Text style={Styles.headingTittle}>
                      {I18n.t('otp.otp')}
                    </Text>
                  </View>

                  <View
                    style={
                      global.languageID !== '3'
                        ? HelperStyles.textInputReverseViewStyles
                        : HelperStyles.textInputViewStyles
                    }>
                    <View
                      style={
                        global.languageID == '3'
                          ? HelperStyles.insideTextInputReverseStyle
                          : HelperStyles.insideTextInputStyle
                      }>
                      <TextInput
                        style={Styles.inputText}
                        underlineColorAndroid="transparent"
                        onChangeText={otpText => this.setState({otp: otpText})}
                        value={this.state.otp}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder={I18n.t('otp.enterOTP')}
                        secureTextEntry={this.state.hideOTP}
                        onFocus={() =>
                          this.setState({
                            isOTPTextFocus: true,
                          })
                        }
                        ref={input => (this.otp = input)}
                        onSubmitEditing={() =>
                          this.setState({
                            isOTPTextFocus: false,
                          })
                        }
                      />

                      {/* <TouchableOpacity
                        style={{
                          justifyContent: 'flex-end',
                          paddingBottom: 5,
                          position: 'absolute',
                          right: 10,
                          bottom: 5,
                        }}
                        onPress={() => {
                          this.setState({hideOTP: !this.state.hideOTP});
                        }}>
                        <FastImage
                          source={R.images.pswd_icon}
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: -2,
                          }}
                          resizeMode={FastImage.resizeMode.contain}></FastImage>
                      </TouchableOpacity> */}
                    </View>
                  </View>

                  <View style={[Styles.btncontainer, Styles.mrTop30]}>
                    <Pressable
                      style={
                        this.state.otp.length < 6
                          ? Styles.subBtnA
                          : Styles.subBtn
                      }
                      onPress={() => this.localValidation()}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.submit')}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={
                        this.state.isResend ? Styles.canBtn : Styles.canBtnA
                      }
                      disabled={!this.state.isResend}
                      onPress={() => this.resendOTP()}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('otp.resentOTP')}
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
    );
  }
}
