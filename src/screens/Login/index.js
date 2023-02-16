import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Linking,
} from 'react-native';
import DeviceInfo, {getManufacturerSync} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import SimpleReactValidator from 'simple-react-validator';
import I18n from '../../i18n/i18n';
import NavigationService from '../../navigator/NavigationService';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';
import HelperStyles from '../../Helper/HelperStyles';
import HelperFonts from '../../Helper/HelperFonts';

var Styles = LStyles;

var emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var passwordRegex = /^[0-9]+$/;

export default class Login extends React.Component {
  constructor(props) {
    // this.validator = new SimpleReactValidator();
    // this.validator = new SimpleReactValidator({autoForceUpdate: this});
    // var validator = new SimpleReactValidator({
    //   messages: {
    //     email: 'That is not an email.',
    //     default: 'Validation has failed!', // will override all messages
    //   },
    // });
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,

      email: '',
      password: '',

      hidePassword: true,
      isEmailTextFocus: false,
      isPasswordTextFocus: false,

      device_UniqueID: '',
      device_Manufacture: '',
      device_Name: '',
      device_Model_No: '',
      allResponseByToken: {},
      allValid: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.setState({loaderVisible: false});
  }

  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }

  handleBackPress = () => {
    const firstTxt = I18n.t('tostMessages.dubbleTap');
    const secondTxt = I18n.t('common.cancel');
    const thirdTxt = I18n.t('deleteLot.yes');
    Alert.alert(firstTxt, '', [
      {
        text: secondTxt,
        onPress: () => null,
        style: 'cancel',
      },
      {text: thirdTxt, onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackButton = () => {
    this.props.navigation.replace('login');
    return true;
  };

  localValidation = () => {
    const isValid = this.validator.allValid();
    this.setState({allValid: isValid});
    if (isValid) {
      console.log('pass');
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
    // const formValid = this.simpleValidator.current.allValid();
    // console.log(
    //   '-----formValid',
    //   formValid,
    //   // this.simpleValidator.current.showMessages(),
    // );
    // //else
    // this.simpleValidator.current.showMessages();
    this.setState({loaderVisible: true});

    if (this.state.email == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.enterYourEmailID'), Toast.SHORT, [
        'UIAlertController',
      ]);
    } else if (this.state.password == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.enterYourPassword'), Toast.SHORT);
    } else {
      WebMethods.checkconnectivity().then(result => {
        if (result == true) {
          this.setState({loaderVisible: false});
          Toast.show(
            I18n.t('tostMessages.checkYourInternetConnection'),
            Toast.SHORT,
          );
        } else {
          this.login();
        }
      });
    }
  };

  getDeviceInfo = () => {
    this.state.device_UniqueID = DeviceInfo.getUniqueId();
    this.state.device_Manufacture = getManufacturerSync();
    this.state.device_Name = DeviceInfo.getDeviceNameSync();
    this.state.device_Model_No = DeviceInfo.getModel();
  };

  getMembershipUserAccess = async () => {
    const {allResponseByToken} = this.state;
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

          Toast.show(I18n.t('tostMessages.loginSuccess'), Toast.SHORT);

          if (allResponseByToken.isAgreed == 'False') {
            this.props.navigation.navigate('terms', {fromScreen: 'OTP'});
          } else if (allResponseByToken.firstTimeLoginFlag == 'True') {
            this.props.navigation.navigate('ChangePassword');
          } else if (
            allResponseByToken.isAgreed == 'True' &&
            allResponseByToken.firstTimeLoginFlag == 'False'
          ) {
            this.props.navigation.navigate('home');
          } else {
            NavigationService.navigate('login');
          }
        } else {
          this.setState({loaderVisible: false});

          Toast.show(I18n.t('tostMessages.loginFailed'), Toast.SHORT);

          NavigationService.navigate('login');
        }
      },
    );
  };

  getAccessToken = async () => {
    var formBody = [];
    formBody.push(
      encodeURIComponent('username') +
        '=' +
        encodeURIComponent(this.state.email),
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
        this.setState({allResponseByToken: response});
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
        Preferences.savePreferences(
          Preferences.key.CompanyLogo,
          response.companyLogoPath,
        );

        Preferences.savePreferences(
          Preferences.key.isFirstTimeLoggedIn,
          response.firstTimeLoginFlag,
        );

        Preferences.savePreferences(
          Preferences.key.isTermsAgreed,
          response.isAgreed,
        );

        Preferences.savePreferences(
          Preferences.key.LanguageID,
          response.languageId,
        );

        global.isLogin = 'true';
        global.token = response.access_token;
        global.languageID = response.languageId;

        this.setState({loaderVisible: false});

        this.setState({
          email: '',
          password: '',
        });

        this.getMembershipUserAccess();
      } else {
        this.setState({loaderVisible: false});

        Toast.show(I18n.t('tostMessages.loginFailed'), Toast.SHORT);
      }
    });
  };

  login = () => {
    Keyboard.dismiss();

    this.getDeviceInfo();

    var params = {
      EmailID: this.state.email,
      Password: this.state.password,
      DeviceObj: {
        Device_ID: this.state.device_UniqueID,
        Device_Manufacture: this.state.device_Manufacture,
        Device_Name: this.state.device_Name,
        Model_No: this.state.device_Model_No,
      },
    };
    WebMethods.postRequest(WebUrls.url.validateUser, params).then(response => {
      if (response.data) {
        if (response.statusCode == 0) {
          this.setState({loaderVisible: false});
          Toast.show(response.errorMessage, Toast.SHORT);
        } else {
          if (response.message == '0') {
            this.getAccessToken();
          } else {
            var otpParamsObj = {
              username: this.state.email,
              password: this.state.password,
              otpRequestID: response.message,
            };
            this.setState({loaderVisible: false});
            Toast.show(response.errorMessage, Toast.SHORT);
            this.props.navigation.navigate('otp', {otpParams: otpParamsObj});
          }
        }
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.loginFailed'), Toast.SHORT);
      }
    });
  };

  // onPressWhatsapp = async() => {
  //   // await console.log('------->') this.fetchAdminWhatsappNumber()
  //   Linking.openURL(`whatsapp://send?text=${7385816591}`);
  // };
  onPressWhatsapp = async () => {
    let userInfo = await this.fetchAdminWhatsappDetails();
    let msg = userInfo.defaultMessage;
    let mobile = userInfo.whatsappNumber;
    let countryCode = userInfo.countryCode;
    if (mobile) {
      let url = `whatsapp://send?text=${msg}&phone=${countryCode}${mobile}`;
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened successfully ' + data);
        })
        .catch(() => {
          alert('Make sure WhatsApp installed on your device');
        });
    } else {
      alert('Please enter mobile no');
    }
  };

  fetchAdminWhatsappDetails = async () => {
    return {
      whatsappNumber: '9730997224',
      countryCode: '+91',
      defaultMessage: '',
    };
    // WebMethods.getRequest(WebUrls.url.getAdminWhatsappNumber).then(response => {
    //   if (response.data != null) {

    //   } else {
    //   }
    // });
  };

  render() {
    return !this.state.loaderVisible ? (
      <SafeAreaProvider style={Styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
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
                  <Text style={Styles.headingTittle}>
                    {I18n.t('login.login')}
                  </Text>
                </View>

                <View style={Styles.textFieldContainer}>
                  <View
                    style={
                      global.languageID !== '3'
                        ? HelperStyles.textInputReverseViewStyles
                        : HelperStyles.textInputViewStyles
                    }>
                    <TextInput
                      autoCapitalize="none"
                      style={
                        global.languageID == '3'
                          ? HelperStyles.insideTextInputReverseStyle
                          : HelperStyles.insideTextInputStyle
                      }
                      underlineColorAndroid="transparent"
                      onChangeText={emailText =>
                        this.setState({email: emailText})
                      }
                      value={this.state.email}
                      keyboardType="email-address"
                      maxLength={50}
                      onBlur={() => this.validator.showMessageFor('email')}
                      placeholder={I18n.t('common.email')}
                      onFocus={() =>
                        this.setState({
                          isEmailTextFocus: true,
                          isPasswordTextFocus: false,
                        })
                      }
                      ref={input => (this.email = input)}
                      onSubmitEditing={() =>
                        this.setState(
                          {
                            isEmailTextFocus: false,
                            isPasswordTextFocus: false,
                          },
                          () => this.password.focus(),
                        )
                      }
                    />
                  </View>
                  {/* {!this.state.allValid && (
                    <Text style={{color: 'red'}}>
                      {this.validator.message(
                        'email',
                        this.state.email,
                        'required|email',
                      )}
                    </Text>
                  )} */}

                  <View
                    // style={
                    //   this.state.isPasswordTextFocus
                    //     ? Styles.FucusedSectionStyle
                    //     : Styles.SectionStyle
                    // }
                    style={
                      global.languageID !== '3'
                        ? HelperStyles.textInputReverseViewStyles
                        : HelperStyles.textInputViewStyles
                    }>
                    <TextInput
                      autoCapitalize="none"
                      style={
                        global.languageID == '3'
                          ? HelperStyles.insideTextInputReverseStyle
                          : HelperStyles.insideTextInputStyle
                      }
                      underlineColorAndroid="transparent"
                      onChangeText={passwordText =>
                        this.setState({password: passwordText})
                      }
                      value={this.state.password}
                      keyboardType="default"
                      maxLength={20}
                      placeholder={I18n.t('common.password')}
                      secureTextEntry={this.state.hidePassword}
                      onFocus={() =>
                        this.setState({
                          isEmailTextFocus: false,
                          isPasswordTextFocus: true,
                        })
                      }
                      ref={input => (this.password = input)}
                      onSubmitEditing={() =>
                        this.setState({
                          isEmailTextFocus: false,
                          isPasswordTextFocus: false,
                        })
                      }
                      onBlur={() => this.validator.showMessageFor('password')}
                    />
                  </View>
                  {/* {!this.state.allValid && (
                    <Text style={{color: 'red'}}>
                      {this.validator.message(
                        'password',
                        this.state.password,
                        'required|min:1',
                      )}
                    </Text>
                  )} */}
                  <View style={Styles.buttonContainer}>
                    <TouchableOpacity
                      style={Styles.button}
                      onPress={() => this.localValidation()}>
                      <View>
                        <Text
                          style={{
                            color: R.colors.white,
                            fontSize: 13,
                            fontFamily: 'SemplicitaPro-Bold',
                          }}>
                          {I18n.t('login.login')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={Styles.button_1}
                      onPress={() => {
                        this.props.navigation.navigate('forgotpassword');
                      }}>
                      <View>
                        <Text
                          style={{
                            color: R.colors.white,
                            fontSize: 13,
                            fontFamily: 'SemplicitaPro-Bold',
                          }}>
                          {I18n.t('login.forgetPassword')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={Styles.textColoumnContainers}>
                    <View style={Styles.signupTxt}>
                      <Text style={Styles.grayText}>
                        {I18n.t('login.dontAccount')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('signup');
                        }}>
                        <Text style={Styles.blueText}>
                          {I18n.t('common.signUp')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* <TouchableOpacity onPress={() => this.onPressWhatsapp()}>
                    <Image
                      style={{height: 40, width: 40}}
                      source={R.images.whatsapp}
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <View style={{bottom: 0, alignSelf: 'flex-start', left: 20}}>
            <Text style={Styles.grayText}>@2022 Petra Catalog</Text>
          </View> */}
        </KeyboardAwareScrollView>
        {/* <Footer /> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          {/* <TouchableOpacity
            onPress={() => this.onPressWhatsapp()}
            style={{marginLeft: 20, top: -15}}>
            <Image style={{height: 40, width: 40}} source={R.images.chatLogo} />
          </TouchableOpacity> */}
        </View>
      </SafeAreaProvider>
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
