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
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import HelperFonts from '../../Helper/HelperFonts';
import HelperStyles from '../../Helper/HelperStyles';
import I18n from '../../i18n/i18n';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Forgotpassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderVisible: true,

      email: '',
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

    if (this.state.email == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterEmailID'), Toast.SHORT);
    } else {
      this.submitForgetPassword();
    }
  };

  submitForgetPassword = () => {
    WebMethods.postRequest(
      WebUrls.url.submitForgetPassword + '?emailID=' + this.state.email,
    ).then(response => {
      if (response.data) {
        var otpParamsObj = {
          username: this.state.email,
          password: '',
          otpRequestID: response.message,
        };

        this.setState({loaderVisible: false, email: ''});

        Toast.show(I18n.t('tostMessages.otpSentToEmailID'), Toast.SHORT);

        this.props.navigation.navigate('otp', {otpParams: otpParamsObj});
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToSentOTPToEmailID'),
          Toast.SHORT,
        );
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
                      {I18n.t('login.forgetPassword')}
                    </Text>
                  </View>

                  <View style={Styles.textFieldContainer}>
                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.email')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}

                    <View
                      // style={
                      //   this.state.isEmailTextFocus
                      //     ? Styles.FucusedSectionStyle
                      //     : Styles.SectionStyle
                      // }
                      style={
                        global.languageID !== '3'
                          ? HelperStyles.textInputReverseViewStyles
                          : HelperStyles.textInputViewStyles
                      }>
                      <TextInput
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
                        placeholder={I18n.t('common.email')}
                        maxLength={50}
                      />
                    </View>

                    <View style={Styles.btncontainer}>
                      <Pressable
                        style={Styles.subBtn}
                        onPress={() => {
                          this.localValidation();
                        }}>
                        <Text style={Styles.textStyleB}>
                          {I18n.t('common.submit')}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={Styles.canBtn}
                        onPress={() => {
                          this.props.navigation.navigate('login');
                        }}>
                        <Text style={Styles.textStyleB}>
                          {I18n.t('common.cancel')}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>

          {/* <Footer /> */}
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
