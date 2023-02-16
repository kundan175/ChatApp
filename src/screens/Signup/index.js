import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomDropDown from '../../components/CustomDropDown';
import HelperFonts from '../../Helper/HelperFonts';
import HelperStyles from '../../Helper/HelperStyles';
import I18n from '../../i18n/i18n';
import R from '../../resources/R';
import Footer from '../Footer';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderVisible: true,

      company_name: '',
      languageList: [],
      pickerSelectedLanguageVal: 0,
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      countryList: [],
      pickerSelectedCountryCodeVal: 0,
      pickerSelectedCountryVal: 0,
      mobile_number: '',
      fax_number: '',
      dropDownResponse: [],
      dropDownResponseCode: [],
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
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.getSignUpPageDefaults();

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

  getSignUpPageDefaults = () => {
    WebMethods.getRequest(WebUrls.url.getSignUpPageDefaults).then(response => {
      this.setState({
        countryList: response.data.countryList,

        loaderVisible: false,
      });
      this.setDropDownResponse(
        response.data.countryList,
        response.data.countryCodeList,
      );
    });
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
    let newResponseCode = codeList.map((item, index) => {
      {
        return {
          ...item,
          label: item.countryCode,
          value: item.countryID,
        };
      }
    });
    this.setState({
      dropDownResponse: newResponse,
      dropDownResponseCode: newResponseCode,
    });
  };

  localValidation = () => {
    this.setState({loaderVisible: true});

    if (this.state.company_name == '') {
      this.setState({loaderVisible: false});
      Toast.show('Please enter Company Name', Toast.SHORT);
    } else if (this.state.pickerSelectedLanguageVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectLanguage'), Toast.SHORT);
    } else if (this.state.first_name == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterFirstName'), Toast.SHORT);
    } else if (this.state.last_name == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterLastName'), Toast.SHORT);
    } else if (this.state.email == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.enterYourEmailID'), Toast.SHORT);
    } else if (this.state.address == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterAddress'), Toast.SHORT);
    } else if (this.state.city == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterCity'), Toast.SHORT);
    } else if (this.state.postal_code == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterPostalCode'), Toast.SHORT);
    } else if (this.state.pickerSelectedCountryVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCountry'), Toast.SHORT);
    } else if (this.state.pickerSelectedCountryCodeVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCountryCode'), Toast.SHORT);
    } else if (this.state.mobile_number == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterMobileNo'), Toast.SHORT);
    } else {
      if (!WebMethods.checkconnectivity()) {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.checkYourInternetConnection'),
          Toast.SHORT,
        );
      } else {
        this.submitSignUp();
      }
    }
  };

  submitSignUp = () => {
    var params = {
      firstName: this.state.first_name,
      lastName: this.state.last_name,
      emailID: this.state.email,
      address: this.state.address,
      city: this.state.city,
      zipCode: this.state.postal_code,
      state: this.state.state,
      countryID: this.state.pickerSelectedCountryVal,
      countryCode: this.state.pickerSelectedCountryCodeVal,
      mobileNo: this.state.mobile_number,
      faxNo: this.state.fax_number,
      companyName: this.state.company_name,
      languageID: this.state.pickerSelectedLanguageVal,
    };

    WebMethods.postRequest(WebUrls.url.submitSignUp, params).then(response => {
      if (response) {
        this.setState({loaderVisible: false});
        if (response.data == false) {
          Toast.show(I18n.t('tostMessages.emailRegisterd'), Toast.SHORT);
          return;
        }
        Toast.show(
          I18n.t('tostMessages.newUserCreatedSuccessfully'),
          Toast.SHORT,
        );
        this.props.navigation.navigate('login');
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToCreateNewUser'), Toast.SHORT);
      }
    });
  };

  render() {
    return !this.state.loaderVisible ? (
      <View style={{flex: 1}}>
        <SafeAreaView style={Styles.container}>
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
                      {I18n.t('common.signUp')}
                    </Text>
                    <Text style={Styles.bodytext}>
                      {I18n.t('signUp.fillDetailsCreateAccount')}
                    </Text>
                  </View>

                  <View style={Styles.textFieldContainer}>
                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.company')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={company_name_Text =>
                          this.setState({company_name: company_name_Text})
                        }
                        value={this.state.company_name}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('signUp.enterCompanyName')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.defaultLanguage')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View style={Styles.inputTexts}>
                      <CustomDropDown
                        dropDownData={this.state.countryResponse}
                        isRTL={global.languageID == '3' ? true : false}
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({
                            pickerSelectedLanguageVal: itemValue.key,
                          });
                        }}
                        selectedValue={this.state.pickerSelectedLanguageVal}
                        placeholder={I18n.t('userProfile.selectLanguage')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.firstName')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={first_name_Text =>
                          this.setState({first_name: first_name_Text})
                        }
                        value={this.state.first_name}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('signUp.enterFirstName')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.lastName')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={last_name_Text =>
                          this.setState({last_name: last_name_Text})
                        }
                        value={this.state.last_name}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('signUp.enterLastName')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.email')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('signUp.enterEmailID')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.address')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={addressText =>
                          this.setState({address: addressText})
                        }
                        value={this.state.address}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterAddress')}
                      />
                    </View>
                    {/* 
                    <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.city')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={cityText =>
                          this.setState({city: cityText})
                        }
                        value={this.state.city}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterCity')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.state')}
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={stateText =>
                          this.setState({state: stateText})
                        }
                        value={this.state.state}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterStateName')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.postalCode')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={postal_code_Text =>
                          this.setState({postal_code: postal_code_Text})
                        }
                        value={this.state.postal_code}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterPostalCode')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.country')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
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
                        placeholder={I18n.t('common.selectCountry')}
                      />
                    </View>
                    {/* 
                    <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('signUp.code')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View style={Styles.inputTexts}>
                      <CustomDropDown
                        dropDownData={this.state.dropDownResponseCode}
                        isRTL={global.languageID == '3' ? true : false}
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({
                            pickerSelectedCountryCodeVal: itemValue.countryID,
                          });
                        }}
                        selectedValue={this.state.pickerSelectedCountryCodeVal}
                        placeholder={I18n.t('signUp.selectCode')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.mobileNumber')}:{' '}
                        <Text style={[Styles.reqText]}>*</Text>
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={mobile_number_Text =>
                          this.setState({mobile_number: mobile_number_Text})
                        }
                        value={this.state.mobile_number}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterMobileNumber')}
                      />
                    </View>

                    {/* <View style={Styles.textRowContainer}>
                      <Text style={[Styles.titleText]}>
                        {I18n.t('common.faxNumber')}
                      </Text>
                    </View> */}
                    <View
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
                        onChangeText={fax_number_Text =>
                          this.setState({fax_number: fax_number_Text})
                        }
                        value={this.state.fax_number}
                        keyboardType="default"
                        maxLength={50}
                        placeholder={I18n.t('common.enterFaxNumber')}
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
                <View
                  style={{
                    bottom: 0,
                    alignSelf: 'flex-start',
                    left: 20,
                    paddingBottom: 10,
                  }}>
                  <Text style={[Styles.grayText, HelperFonts.font_B_Regular]}>
                    ©2022 Petra Catalog
                  </Text>
                </View>
                {/* <Footer /> */}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
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
