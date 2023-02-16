import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomDropDown from '../../components/CustomDropDown';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';
import HelperFonts from '../../Helper/HelperFonts';

var Styles = LStyles;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,

      company_name: '',
      user_role: '',
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      countryList: [],
      pickerSelectedCountryVal: 0,
      postal_code: '',
      mobile_number: '',
      fax_number: '',
      languageList: [],
      pickerSelectedLanguageVal: 0,
      tokenBalance: 0,
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
      isShowSelectLang: true,
      dropDownResponse: [],
      codeResponse: [],
      codeSelectedKey: 0,
      countryResponse: [
        {
          label: 'English',
          value: '1',
          key: '1',
        },
        {
          label: 'French',
          value: '2',
          key: '2',
        },
        {
          label: 'Arabic',
          value: '3',
          key: '3',
        },
      ],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.getProfilePageDefaults();
    this.getMembershipUserAccess();
  }

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    const LoginStatus = await Preferences.getPreferences(
      Preferences.key.isFirstTimeLoggedIn,
    );
    const TermsStatus = await Preferences.getPreferences(
      Preferences.key.isTermsAgreed,
    );
    this.setState({isShowSelectLang: access.selectLanguage});
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.replace('home');
    return true;
  };

  handleBackButton = () => {
    this.props.navigation.navigate('home');
    return true;
  };

  getProfilePageDefaults = () => {
    WebMethods.getRequestWithHeader(WebUrls.url.getProfilePageDefaults).then(
      response => {
        this.setState({
          company_name: response.data.companyName,
          user_role: response.data.membershipRoleName,
          first_name: response.data.firstName,
          last_name: response.data.lastName,
          email: response.data.emailID,
          address: response.data.address,
          city: response.data.city,
          state: response.data.state,
          countryList: response.data.countryList,
          pickerSelectedCountryVal: response.data.countryID,
          postal_code: response.data.zipCode,
          mobile_number: response.data.mobileNo,
          fax_number: response.data.faxNo,
          pickerSelectedLanguageVal: response.data.languageID,
          tokenBalance: response.data.currentTokenBalance,
          codeSelectedKey: response.data.countryCode,
          loaderVisible: false,
        });
        this.setDropDownResponse(
          response.data.countryList,
          response.data.countryCodeList,
        );
      },
    );
  };

  setDropDownResponse = (foundResponse = [], codeList = []) => {
    let newResponse = foundResponse.map((item, index) => {
      {
        return {
          ...item,
          label: item.countryName,
          value: item.countryID,
        };
      }
    });
    let newCodeResponse = codeList.map((item, index) => {
      {
        return {
          ...item,
          label: parseInt(item.countryCode),
          value: item.countryID,
        };
      }
    });
    this.setState({
      dropDownResponse: newResponse,
      codeResponse: newCodeResponse,
    });
  };

  localValidation_submitProfile = () => {
    this.setState({loaderVisible: true});

    if (this.state.address == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterAddress'), Toast.SHORT);
    } else if (this.state.city == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterCity'), Toast.SHORT);
    } else if (this.state.pickerSelectedCountryVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCountry'), Toast.SHORT);
    } else if (this.state.postal_code == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterPostalCode'), Toast.SHORT);
    } else if (this.state.pickerSelectedLanguageVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectLanguage'), Toast.SHORT);
    } else {
      this.submitProfile();
    }
  };

  submitProfile = () => {
    var params = {
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      countryID: this.state.pickerSelectedCountryVal,
      countryCode: this.state.codeSelectedKey.toString(),
      zipCode: this.state.postal_code,
      mobileNo: this.state.mobile_number,
      faxNo: this.state.fax_number,
      languageID: this.state.pickerSelectedLanguageVal.toString(),
    };
    WebMethods.postRequestWithHeader(WebUrls.url.submitProfile, params).then(
      response => {
        if (response.success) {
          Preferences.savePreferences(
            Preferences.key.LanguageID,
            this.state.pickerSelectedLanguageVal.toString(),
          );
          global.languageID = this.state.pickerSelectedLanguageVal.toString();
          Styles = global.languageID == '3' ? RStyles : LStyles;
          this.setState({
            loaderVisible: false,
          });
          Toast.show(
            I18n.t('tostMessages.profileUpdateSuccessfully'),
            Toast.SHORT,
          );
          this.setState({});
        } else {
          this.setState({
            loaderVisible: false,
          });
          Toast.show(I18n.t('tostMessages.failedToUpdateProfile'), Toast.SHORT);
        }
      },
    );
  };

  clear = () => {
    this.state.oldPassword = '';
    this.state.password = '';
    this.state.confirmPassword = '';
    this.state.isOldPasswordFocus = false;
    this.state.isPasswordTextFocus = false;
    this.state.isConfirmedPasswordTextFocus = false;
    this.state.hideoldPassword = true;
    this.state.hidePassword = true;
    this.state.hideConfirmPassword = true;
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
        Toast.show(
          I18n.t('tostMessages.passwordChangedSuccessfully'),
          Toast.SHORT,
        );
        this.setState({loaderVisible: false, showChangePassword: false});
      } else {
        Toast.show(I18n.t('tostMessages.failedToChangePassword'), Toast.SHORT);
        this.setState({loaderVisible: false});
      }
    });
  };

  render() {
    return !this.state.loaderVisible ? (
      <View style={{flex: 1}}>
        <SafeAreaProvider style={Styles.container}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={Styles.container}>
                <Header navigation={this.props.navigation} />

                <View style={Styles.coloumncontainer}>
                  <View style={Styles.item}>
                    <View style={Styles.textContainer}>
                      {/* <Text
                        style={Styles.headingSubTittle}
                        onPress={() => {
                          this.props.navigation.replace('home');
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.replace('home');
                          }}>
                          <FastImage
                            source={R.images.prevlnk}
                            style={Styles.prevlnk}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                        &nbsp; {I18n.t('userProfile.userProfile')}
                      </Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.replace('home');
                        }}
                        style={Styles.headerTxt}>
                        <View>
                          <FastImage
                            source={R.images.prevlnk}
                            style={Styles.prevlnk}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </View>
                        <View style={{paddingHorizontal: 5}}>
                          <Text style={HelperFonts.glodTitle}>
                            {I18n.t('userProfile.userProfile')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={Styles.item}>
                    <View style={Styles.textContainer}>
                      <Text
                        style={[
                          Styles.mandatoryLbl,
                          HelperFonts.mandatory_Regular,
                        ]}>
                        {I18n.t('common.mandatoryFields')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.blueBkg}>
                    <Text style={Styles.subTitle}>
                      {I18n.t('userProfile.userData')}
                    </Text>
                  </View>

                  <View style={Styles.blueBkgInverted}>
                    <Text>&nbsp;</Text>
                  </View>

                  <View style={Styles.portlet}>
                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbll, Styles.formmt]}>
                        {I18n.t('common.company')}:
                      </Text>
                      <Text style={[Styles.formLblr, Styles.formmt]}>
                        {this.state.company_name}
                      </Text>
                    </View>

                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbll, Styles.formmt]}>
                        {I18n.t('userProfile.userRole')}:
                      </Text>
                      <Text style={[Styles.formLblr, Styles.formmt]}>
                        {this.state.user_role}
                      </Text>
                    </View>

                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbll, Styles.formmt]}>
                        {I18n.t('common.firstName')}:
                      </Text>
                      <Text style={[Styles.formLblr, Styles.formmt]}>
                        {this.state.first_name}
                      </Text>
                    </View>

                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbll, Styles.formmt]}>
                        {I18n.t('common.lastName')}:
                      </Text>
                      <Text style={[Styles.formLblr, Styles.formmt]}>
                        {this.state.last_name}
                      </Text>
                    </View>

                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbll, Styles.formmt]}>
                        {I18n.t('common.email')}:
                      </Text>
                      <Text style={[Styles.formLblr, Styles.formmt]}>
                        {this.state.email}
                      </Text>
                    </View>

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.address')}:{' '}
                      <Text style={HelperFonts.mandatory_Regular}>*</Text>
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={addressText =>
                        this.setState({address: addressText})
                      }
                      value={this.state.address}
                      keyboardType="default"
                      maxLength={50}
                      placeholder={I18n.t('common.enterAddress')}
                    />

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.city')}:{' '}
                      <Text style={Styles.mandatory}>*</Text>
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={cityText => this.setState({city: cityText})}
                      value={this.state.city}
                      keyboardType="default"
                      maxLength={50}
                      placeholder={I18n.t('common.enterCity')}
                    />

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.state')}:{' '}
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={stateText =>
                        this.setState({state: stateText})
                      }
                      value={this.state.state}
                      keyboardType="default"
                      maxLength={50}
                      placeholder={I18n.t('common.enterStateName')}
                    />

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.country')}:{' '}
                      <Text style={Styles.mandatory}>*</Text>
                    </Text>
                    <View style={Styles.inputTexts}>
                      <CustomDropDown
                        dropDownData={this.state.dropDownResponse}
                        isRTL={global.languageID == '3' ? true : false}
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({
                            pickerSelectedCountryVal: itemValue.countryID,
                          });
                        }}
                        selectedValue={this.state.pickerSelectedCountryVal}
                      />
                    </View>

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.postalCode')}:{' '}
                      <Text style={Styles.mandatory}>*</Text>
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={postalCodeText =>
                        this.setState({postal_code: postalCodeText})
                      }
                      value={this.state.postal_code}
                      keyboardType="default"
                      maxLength={50}
                      placeholder={I18n.t('common.enterPostalCode')}
                    />
                    <>
                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('signUp.code')}:{' '}
                        <Text style={Styles.mandatory}>*</Text>
                      </Text>
                      <View style={Styles.inputTexts}>
                        <CustomDropDown
                          dropDownData={this.state.codeResponse}
                          isRTL={global.languageID == '3' ? true : false}
                          onValueChange={(itemValue, itemIndex) => {
                            this.setState({
                              codeSelectedKey: itemValue.value,
                            });
                          }}
                          selectedValue={this.state.codeSelectedKey}
                          search={false}
                        />
                      </View>
                    </>

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.mobileNumber')}:{' '}
                      <Text style={Styles.mandatory}>*</Text>
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={mobileNumberText =>
                        this.setState({mobile_number: mobileNumberText})
                      }
                      value={this.state.mobile_number}
                      keyboardType="number-pad"
                      maxLength={50}
                      placeholder={I18n.t('common.enterMobileNumber')}
                    />

                    <Text style={[Styles.formLbl, Styles.formmt]}>
                      {I18n.t('common.faxNumber')}:{' '}
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      style={Styles.textInput}
                      underlineColorAndroid="transparent"
                      onChangeText={faxNumberText =>
                        this.setState({fax_number: faxNumberText})
                      }
                      value={this.state.fax_number}
                      keyboardType="number-pad"
                      maxLength={50}
                      placeholder={I18n.t('common.enterFaxNumber')}
                    />
                    {this.state.isShowSelectLang && (
                      <>
                        <Text style={[Styles.formLbl, Styles.formmt]}>
                          {I18n.t('common.defaultLanguage')}:{' '}
                          <Text style={Styles.mandatory}>*</Text>
                        </Text>
                        <View style={Styles.inputTexts}>
                          <CustomDropDown
                            dropDownData={this.state.countryResponse}
                            isRTL={global.languageID == '3' ? true : false}
                            onValueChange={(itemValue, itemIndex) => {
                              this.setState({
                                pickerSelectedLanguageVal: itemValue.key,
                              });
                            }}
                            selectedValue={`${this.state.pickerSelectedLanguageVal}`}
                          />
                        </View>
                      </>
                    )}
                    <View style={Styles.formcont}>
                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('common.tokenBalance')}:{' '}
                      </Text>
                      <Text
                        style={[
                          Styles.formLblr,
                          Styles.tokenBal,
                          Styles.formmt,
                        ]}>
                        {this.state.tokenBalance}
                      </Text>
                    </View>

                    <View style={Styles.btncontainer}>
                      <Pressable
                        style={Styles.subBtns}
                        onPress={() => {
                          this.localValidation_submitProfile();
                        }}>
                        <Text style={Styles.textStyleB}>
                          {I18n.t('common.save')}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={Styles.canBtn}
                        onPress={() => {
                          this.props.navigation.replace('home');
                        }}>
                        <Text style={Styles.textStyleB}>
                          {I18n.t('common.close')}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.blueBkg}>
                    <Text style={Styles.subTitle}>
                      {I18n.t('userProfile.authentication')}
                    </Text>
                  </View>
                  <View style={Styles.blueBkgInverted}>
                    <Text>&nbsp;</Text>
                  </View>
                  <View style={Styles.portlet}>
                    <Pressable
                      style={Styles.subBtn}
                      onPress={() => {
                        this.setState({
                          showChangePassword: !this.state.showChangePassword,
                        });
                        this.clear();
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.changePassword')}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.blueBkg}>
                    <Text style={Styles.subTitle}>
                      {I18n.t('common.termsUse')}
                    </Text>
                  </View>
                  <View style={Styles.blueBkgInverted}>
                    <Text>&nbsp;</Text>
                  </View>
                  <View style={[Styles.portlet, Styles.marginBot]}>
                    <Pressable
                      style={Styles.subBtn}
                      onPress={() => {
                        this.props.navigation.navigate('terms', {
                          fromScreen: 'Profile',
                        });
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.termsUse')}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showChangePassword}
                  onRequestClose={() => () => {
                    this.setState({
                      showChangePassword: !this.state.showChangePassword,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View
                        style={[Styles.headingModalContainers, Styles.modalbg]}>
                        <View style={Styles.headingModalContainer}>
                          <Text style={Styles.headingModal}>
                            {I18n.t('common.changePassword')}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() =>
                            this.setState({
                              showChangePassword:
                                !this.state.showChangePassword,
                            })
                          }
                          style={[Styles.headingBtn]}>
                          <View style={Styles.buttonCloseb}>
                            <Text style={Styles.textStyle}>X</Text>
                          </View>
                        </Pressable>
                      </View>

                      <View style={Styles.formcontainer}>
                        <Text
                          style={[
                            Styles.mandatoryLbl,
                            HelperFonts.mandatory_Regular,
                          ]}>
                          {I18n.t('common.mandatoryFields')}
                        </Text>
                      </View>

                      <View>
                        <View style={Styles.formcontainer1}>
                          <Text style={Styles.formLbl}>
                            {I18n.t('changePassword.oldPassword')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <TextInput
                            autoCapitalize="none"
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
                              resizeMode={
                                FastImage.resizeMode.contain
                              }></FastImage>
                          </TouchableOpacity>
                        </View>

                        <View style={Styles.formcontainer1}>
                          <Text style={[Styles.formLbl, Styles.formmt]}>
                            {I18n.t('changePassword.newPassword')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <TextInput
                            autoCapitalize="none"
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
                              resizeMode={
                                FastImage.resizeMode.contain
                              }></FastImage>
                          </TouchableOpacity>
                        </View>

                        <View style={Styles.formcontainer1}>
                          <Text style={[Styles.formLbl, Styles.formmt]}>
                            {I18n.t('changePassword.confirmPassword')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <TextInput
                            autoCapitalize="none"
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
                            placeholder={I18n.t(
                              'changePassword.confirmPassword',
                            )}
                          />
                          <TouchableOpacity
                            style={Styles.pswdicon}
                            onPress={() => {
                              this.setState({
                                hideConfirmPassword:
                                  !this.state.hideConfirmPassword,
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
                              resizeMode={
                                FastImage.resizeMode.contain
                              }></FastImage>
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

                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showChangePassword:
                                  !this.state.showChangePassword,
                              });
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.close')}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
        </SafeAreaProvider>

        <Footer />
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
