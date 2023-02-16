import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Pressable,
  SafeAreaView,
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
import I18n from '../../i18n/i18n';
import NavigationService from '../../navigator/NavigationService';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Resetpassword extends React.Component {
  constructor(props) {
    super(props);

    var user = this.props.navigation.getParam('userID');

    this.state = {
      loaderVisible: true,

      userID: user,

      newPassword: '',
      confirmPassword: '',

      hideNewPassword: true,
      hideConfirmPassword: true,
      isNewPasswordTextFocus: false,
      isConfirmPasswordTextFocus: false,
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

  localValidation_submitResetPassword = () => {
    this.setState({loaderVisible: true});

    if (this.state.newPassword == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterNewPassword'), Toast.SHORT);
    } else if (this.state.confirmPassword == '') {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.pleaseEnterConfirmPassword'),
        Toast.SHORT,
      );
    } else if (this.state.newPassword != this.state.confirmPassword) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.confirmPasswordMisMatch'), Toast.SHORT);
    } else {
      this.submitResetPassword();
    }
  };

  submitResetPassword = () => {
    var params = {
      userID: this.state.userID,
      password: this.state.newPassword,
    };

    WebMethods.postRequest(WebUrls.url.submitResetPassword, params).then(
      response => {
        if (response.data) {
          this.setState({
            userID: '',
            newPassword: '',
            confirmPassword: '',

            loaderVisible: false,
          });

          Toast.show(
            I18n.t('tostMessages.passwordChangedSuccessfully'),
            Toast.SHORT,
          );

          NavigationService.navigate('login');
        } else {
          this.setState({loaderVisible: false});
          Toast.show(
            I18n.t('tostMessages.failedToChangePassword'),
            Toast.SHORT,
          );
        }
      },
    );
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
                      {I18n.t('resetPassword.resetPassword')}
                    </Text>
                  </View>

                  <View style={Styles.textFieldContainer}>
                    <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('changePassword.newPassword')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View>

                    <View
                      style={
                        this.state.isNewPasswordTextFocus
                          ? Styles.FucusedSectionStyle
                          : Styles.SectionStyle
                      }>
                      <TextInput
                        autoCapitalize="none"
                        style={Styles.inputText}
                        underlineColorAndroid="transparent"
                        onChangeText={newPasswordText =>
                          this.setState({newPassword: newPasswordText})
                        }
                        value={this.state.newPassword}
                        keyboardType="default"
                        maxLength={20}
                        placeholder={I18n.t('changePassword.newPassword')}
                        secureTextEntry={this.state.hideNewPassword}
                        onFocus={() =>
                          this.setState({
                            isNewPasswordTextFocus: false,
                            isConfirmPasswordTextFocus: true,
                          })
                        }
                        ref={input => (this.newPassword = input)}
                        onSubmitEditing={() =>
                          this.setState({
                            isNewPasswordTextFocus: false,
                            isConfirmPasswordTextFocus: false,
                          })
                        }
                      />

                      <TouchableOpacity
                        style={{
                          justifyContent: 'flex-end',
                          paddingBottom: 5,
                          position: 'absolute',
                          right: 10,
                          bottom: 5,
                        }}
                        onPress={() => {
                          this.setState({
                            hideNewPassword: !this.state.hideNewPassword,
                          });
                        }}>
                        <FastImage
                          source={R.images.pswd_icon}
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: -2,
                          }}
                          resizeMode={FastImage.resizeMode.contain}></FastImage>
                      </TouchableOpacity>
                    </View>

                    <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('changePassword.confirmPassword')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View>

                    <View
                      style={
                        this.state.isConfirmPasswordTextFocus
                          ? Styles.FucusedSectionStyle
                          : Styles.SectionStyle
                      }>
                      <TextInput
                        autoCapitalize="none"
                        style={Styles.inputText}
                        underlineColorAndroid="transparent"
                        onChangeText={confirmPasswordText =>
                          this.setState({confirmPassword: confirmPasswordText})
                        }
                        value={this.state.confirmPassword}
                        keyboardType="default"
                        maxLength={20}
                        placeholder={I18n.t('changePassword.confirmPassword')}
                        secureTextEntry={this.state.hideConfirmPassword}
                        onFocus={() =>
                          this.setState({
                            isNewPasswordTextFocus: false,
                            isConfirmPasswordTextFocus: true,
                          })
                        }
                        ref={input => (this.confirmPassword = input)}
                        onSubmitEditing={() =>
                          this.setState({
                            isNewPasswordTextFocus: false,
                            isConfirmPasswordTextFocus: false,
                          })
                        }
                      />

                      <TouchableOpacity
                        style={{
                          justifyContent: 'flex-end',
                          paddingBottom: 5,
                          position: 'absolute',
                          right: 10,
                          bottom: 5,
                        }}
                        onPress={() => {
                          this.setState({
                            hideConfirmPassword:
                              !this.state.hideConfirmPassword,
                          });
                        }}>
                        <FastImage
                          source={R.images.pswd_icon}
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: -2,
                          }}
                          resizeMode={FastImage.resizeMode.contain}></FastImage>
                      </TouchableOpacity>
                    </View>

                    <View style={Styles.btncontainer}>
                      <Pressable
                        style={Styles.subBtn}
                        onPress={() => {
                          this.localValidation_submitResetPassword();
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

          <Footer />
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
