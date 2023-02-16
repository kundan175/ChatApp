import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {formatNumber} from 'react-native-currency-input';
import HelperFonts from '../../Helper/HelperFonts';
import FastImage from 'react-native-fast-image';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Toast from 'react-native-simple-toast';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomDropDown from '../../components/CustomDropDown';
import CustomFunctions from '../../components/CustomFunctions';
import PriceInput from '../../components/PriceInput';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,

      minDiscount: 0,
      maxDiscount: 100,
      userDiscount: 0,
      globalDiscount: [0],

      languageList: [
        {label: 'English', value: 0},
        {label: 'French', value: 1},
        {label: 'Arabic', value: 2},
      ],
      radioSelectedLanguageVal: 0,
      languageIndex: 0,

      numberFormatList: [
        {label: '(.) Dot', value: true},
        {label: '(,) Comma', value: false},
      ],
      radioSelectedNumberFormatVal: true,
      numberFormatIndex: 0,

      userPtPrice: null,
      userPdPrice: null,
      userRhPrice: null,

      currencyList: [],
      pickerSelectedCurrencyVal: 0,
      pickerSelectedCurrencyRate: '0',
      pickerSelectedCurrencySymbol: '',
      isDotActive: 'false',
      dropDownResponse: [],
      isShowContets: {
        enterMetalPrice: true,
        selectLanguage: true,
        selectCurrency: true,
      },
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.getSettingsPageDefaults();
    this.getMembershipUserAccess();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onPressBack();
    return true;
  };

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    this.setState({
      isShowContets: {
        enterMetalPrice: access.enterMetalPrice,
        selectLanguage: access.selectLanguage,
        selectCurrency: access.selectCurrency,
      },
    });
    this.setState({membershipUserAccess: access});
  }

  handleBackButton = () => {
    this.props.navigation.replace('home');
    return true;
  };

  getSettingsPageDefaults = () => {
    WebMethods.getRequestWithHeader(WebUrls.url.getSettingsPageDefaults).then(
      response => {
        let index = response.data.currencyList.findIndex(
          e => e.currencyConversionChartID === response.data.currencyID,
        );
        this.setState({
          userDiscount: response.data.userDiscount,
          globalDiscount: [response.data.userDiscount],
          radioSelectedLanguageVal: response.data.languageID - 1,
          languageIndex: response.data.languageID - 1,
          radioSelectedNumberFormatVal: response.data.numberFormat ? 0 : 1,
          numberFormatIndex: response.data.numberFormat ? 0 : 1,
          currencyList: response.data.currencyList,
          pickerSelectedCurrencyVal: response.data.currencyID,
          pickerSelectedCurrencyRate: response.data.conversionRate,
          pickerSelectedCurrencySymbol:
            index !== -1
              ? response.data.currencyList[index].currencySymbol.toString()
              : '',
          loaderVisible: false,
        });

        CustomFunctions.setCurrncyStatus(response.data.numberFormat);
        this.setDeafaultCurrncyValues(
          response.data.userPtPrice,
          response.data.userPdPrice,
          response.data.userRhPrice,
        );
        this.setDropDownResponse(response.data.currencyList);
      },
    );
  };

  setDropDownResponse = async (foundResponse = []) => {
    let status = await CustomFunctions.getCurrncyStatus();
    let newResponse = foundResponse.map((item, index) => {
      {
        return {
          ...item,
          label: item.currencyName,
          value: item.currencyConversionChartID,
          conversionRate: this.commanFunctionForDisplayCurrncy(
            status,
            this.convertValueIntoSimpleNumber(item.conversionRate),
          ),
        };
      }
    });
    this.setState({dropDownResponse: newResponse, currencyList: newResponse});
  };

  async setDeafaultCurrncyValues(
    userPtPrice,
    userPdPrice,
    userRhPrice,
    currencyValue = null,
  ) {
    let status = await CustomFunctions.getCurrncyStatus();
    let foundUserPtPrice = this.commanFunctionForDisplayCurrncy(
      status,
      this.convertValueIntoSimpleNumber(userPtPrice),
    );
    let foundUserPdPrice = this.commanFunctionForDisplayCurrncy(
      status,
      this.convertValueIntoSimpleNumber(userPdPrice),
    );
    let foundUserRhPrice = this.commanFunctionForDisplayCurrncy(
      status,
      this.convertValueIntoSimpleNumber(userRhPrice),
    );
    let formattedCurrencyValue = null;
    if (currencyValue != null) {
      formattedCurrencyValue = this.commanFunctionForDisplayCurrncy(
        status,
        this.convertValueIntoSimpleNumber(Number(currencyValue)),
      );
    } else {
      formattedCurrencyValue = this.commanFunctionForDisplayCurrncy(
        status,
        this.convertValueIntoSimpleNumber(
          this.state.pickerSelectedCurrencyRate,
        ),
      );
    }
    this.setState({
      userPtPrice: foundUserPtPrice,
      userPdPrice: foundUserPdPrice,
      userRhPrice: foundUserRhPrice,
      pickerSelectedCurrencyRate: formattedCurrencyValue,
      isDotActive: JSON.parse(status),
    });
  }

  convertValueIntoSimpleNumber(stringValue) {
    if (typeof stringValue == 'number') return stringValue;
    stringValue = stringValue.trim();
    var result = stringValue.replace(/[^0-9]/g, '');
    if (/[,\.]\d{2}$/.test(stringValue)) {
      result = result.replace(/(\d{2})$/, '.$1');
    }
    return parseFloat(result);
  }

  setCurrecyConversionRate = item => {
    let currencyID = item.currencyConversionChartID;
    this.setState({pickerSelectedCurrencyVal: currencyID});
    let index = this.state.currencyList.findIndex(
      e => e.currencyConversionChartID === currencyID,
    );
    this.setState({
      pickerSelectedCurrencyRate:
        index !== -1
          ? this.state.currencyList[index].conversionRate.toString()
          : 0,
      pickerSelectedCurrencySymbol:
        index !== -1
          ? this.state.currencyList[index].currencySymbol.toString()
          : '',
    });
  };

  updateUserDiscount = () => {
    this.setState({loaderVisible: true});

    WebMethods.postRequestWithHeader(
      WebUrls.url.updateUserDiscount +
        '?userDiscount=' +
        this.state.userDiscount,
    ).then(response => {
      if (response.data) {
        var membershipAccess = this.state.membershipUserAccess;
        membershipAccess.userDiscount = this.state.userDiscount;

        this.setState({
          userDiscount: this.state.userDiscount,
          globalDiscount: [this.state.userDiscount],
          membershipUserAccess: membershipAccess,
          loaderVisible: false,
        });

        Preferences.saveObjPreferences(
          Preferences.key.MembershipAccess,
          membershipAccess,
        );

        Toast.show(
          I18n.t('tostMessages.globalDiscountUpdatedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToUpdateGlobalDiscount'),
          Toast.SHORT,
        );
      }
    });
  };

  updateUserLanguage = (value, index) => {
    this.setState({
      radioSelectedLanguageVal: value,
      languageIndex: index,
      loaderVisible: true,
    });

    WebMethods.postRequestWithHeader(
      WebUrls.url.updateUserLanguage + '?languageID=' + (value + 1),
    ).then(response => {
      if (response.data) {
        Preferences.savePreferences(
          Preferences.key.LanguageID,
          (value + 1).toString(),
        );
        global.languageID = (value + 1).toString();
        I18n.locale =
          global.languageID == 1 ? 'en' : global.languageID == 2 ? 'fr' : 'ar';
        Styles = global.languageID == '3' ? RStyles : LStyles;
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.userLanguageUpdatedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToUpdateUserLanguage'),
          Toast.SHORT,
        );
      }
    });
  };

  updateUserNumberFormat = async (value, index) => {
    const {userPtPrice, userPdPrice, userRhPrice} = this.state;
    this.setState({
      radioSelectedNumberFormatVal: value,
      numberFormatIndex: index,
      loaderVisible: true,
      isDotActive: index == 0 ? 'true' : 'false',
    });
    CustomFunctions.setCurrncyStatus(value);
    await this.setDeafaultCurrncyValues(userPtPrice, userPdPrice, userRhPrice);
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateUserNumberFormat + '?numberFormat=' + value,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.userNumberFormatUpdatedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToUpdateUserNumberFormat'),
          Toast.SHORT,
        );
      }
    });
  };

  localValidation_updateUserMetalPrice = () => {
    this.setState({loaderVisible: true});

    if (this.state.userPtPrice == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterPtPrice'), Toast.SHORT);
    } else if (this.state.userPdPrice == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterPdPrice'), Toast.SHORT);
    } else if (this.state.userRhPrice == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterRhPrice'), Toast.SHORT);
    } else {
      this.updateUserMetalPrice();
    }
  };

  updateUserMetalPrice = () => {
    // if number format selected as comma
    //1,200 = 1.20
    //1.200 = 1200
    //1.200,35 = 1200.35
    //1,200. = dot should not allow after comma

    //1.200,00 1.200,00 1.200,35

    // if number format selected as dot
    //1,200 = 1200
    //1.200 = 1.200
    //1,200.35 = 1200.35
    //1.200, = comma should not allow after dot
    const {userPtPrice, userPdPrice, userRhPrice, pickerSelectedCurrencyRate} =
      this.state;
    let pt_Price = this.convertValueIntoSimpleNumber(userPtPrice);
    let pd_Price = this.convertValueIntoSimpleNumber(userPdPrice);
    let rh_Price = this.convertValueIntoSimpleNumber(userRhPrice);

    var params = {
      ptPrice: pt_Price.toFixed(2),
      pdPrice: pd_Price.toFixed(2),
      rhPrice: rh_Price.toFixed(2),
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateUserMetalPrice,
      params,
    ).then(response => {
      if (response.data) {
        var membershipAccess = this.state.membershipUserAccess;
        membershipAccess.userPtPrice = this.state.userPtPrice;
        membershipAccess.userPdPrice = this.state.userPdPrice;
        membershipAccess.userRhPrice = this.state.userRhPrice;

        this.setState({
          loaderVisible: false,
          membershipUserAccess: membershipAccess,
        });

        Preferences.saveObjPreferences(
          Preferences.key.MembershipAccess,
          membershipAccess,
        );

        Toast.show(
          I18n.t('tostMessages.userPGMPriceUpdatedSuccssfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToUpdateUserPGMPrice'),
          Toast.SHORT,
        );
      }
    });
  };

  resetUserMetalPrice = () => {
    this.setState({loaderVisible: true});

    WebMethods.postRequestWithHeader(WebUrls.url.resetUserMetalPrice).then(
      response => {
        if (response.data) {
          var membershipAccess = this.state.membershipUserAccess;
          membershipAccess.userPtPrice = response.data.ptPrice;
          membershipAccess.userPdPrice = response.data.pdPrice;
          membershipAccess.userRhPrice = response.data.rhPrice;
          this.setDeafaultCurrncyValues(
            response.data.ptPrice.toString(),
            response.data.pdPrice.toString(),
            response.data.rhPrice.toString(),
          );
          this.setState({
            // userPtPrice: response.data.ptPrice.toString(),
            // userPdPrice: response.data.pdPrice.toString(),
            // userRhPrice: response.data.rhPrice.toString(),
            membershipUserAccess: membershipAccess,
            loaderVisible: false,
          });

          Preferences.saveObjPreferences(
            Preferences.key.MembershipAccess,
            membershipAccess,
          );

          Toast.show(
            I18n.t('tostMessages.userPGMPriceResetSuccessfully'),
            Toast.SHORT,
          );
        } else {
          this.setState({loaderVisible: false});
          Toast.show(
            I18n.t('tostMessages.failedToResetUserPGMPrice'),
            Toast.SHORT,
          );
        }
      },
    );
  };

  localValidation_updateUserCurrencyValue = () => {
    this.setState({loaderVisible: true});

    if (this.state.pickerSelectedCurrencyVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCurrency'), Toast.SHORT);
    } else if (this.state.pickerSelectedCurrencyRate == '') {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.pleaseEnterCurrencyExchageRate'),
        Toast.SHORT,
      );
    } else {
      this.updateUserCurrencyValue();
    }
  };

  setSelectedValuesAfterLang = async (foundID = 0, rate, symbol) => {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    let sampleArr = [];
    sampleArr.push(access);
    let finalObj = sampleArr.map((item, index) => {
      return {
        ...item,
        userCurrencyID: foundID,
        userCurrencyConversionRate: rate,
        CurrencySymbol: symbol,
      };
    });

    Preferences.saveObjPreferences(
      Preferences.key.MembershipAccess,
      finalObj[0],
    );
  };

  updateUserCurrencyValue = () => {
    const {pickerSelectedCurrencyRate} = this.state;
    let currencyPrice = this.convertValueIntoSimpleNumber(
      pickerSelectedCurrencyRate,
    );
    var params = {
      currencyID: this.state.pickerSelectedCurrencyVal,
      conversionRate: currencyPrice.toFixed(2),
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateUserCurrencyValue,
      params,
    ).then(response => {
      if (response.data) {
        this.setState({
          loaderVisible: false,
        });

        this.setSelectedValuesAfterLang(
          this.state.pickerSelectedCurrencyVal,
          this.state.pickerSelectedCurrencyRate,
          this.state.pickerSelectedCurrencySymbol,
        );

        Toast.show(
          I18n.t('tostMessages.userCurrencyUpdatedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToUpdateUserCurrency'),
          Toast.SHORT,
        );
      }
    });
  };

  resetUserCurrencyValue = () => {
    this.setState({loaderVisible: true});
    const {userPtPrice, userPdPrice, userRhPrice} = this.state;

    WebMethods.postRequestWithHeader(WebUrls.url.resetUserCurrencyValue).then(
      response => {
        if (response.data) {
          var membershipAccess = this.state.membershipUserAccess;
          membershipAccess.userCurrencyID =
            this.state.pickerSelectedCurrencyVal;
          membershipAccess.userCurrencyConversionRate =
            this.state.pickerSelectedCurrencyRate;
          membershipAccess.CurrencySymbol =
            this.state.pickerSelectedCurrencySymbol;
          this.setState({
            pickerSelectedCurrencyVal: response.data.currencyID,
            pickerSelectedCurrencyRate: response.data.conversionRate.toString(),
            membershipUserAccess: membershipAccess,
            loaderVisible: false,
          });
          this.setDeafaultCurrncyValues(
            userPtPrice,
            userPdPrice,
            userRhPrice,
            response.data.conversionRate.toString(),
          );

          Preferences.saveObjPreferences(
            Preferences.key.MembershipAccess,
            membershipAccess,
          );

          Toast.show(
            I18n.t('tostMessages.userCurrencyResetSuccessfully'),
            Toast.SHORT,
          );
        } else {
          this.setState({loaderVisible: false});
          Toast.show(
            I18n.t('tostMessages.failedToResetUserCurrency'),
            Toast.SHORT,
          );
        }
      },
    );
  };

  globalDiscountChange = values => {
    this.setState({
      userDiscount: values[0],
      globalDiscount: values[0],
    });
  };

  addAmountMethod_userPtPrice = e => {
    this.setState({userPtPrice: e == null ? 0 : e});
  };
  addAmountMethod_userPdPrice = e => {
    this.setState({userPdPrice: e == null ? 0 : e});
  };
  addAmountMethod_userRhPrice = e => {
    this.setState({userRhPrice: e == null ? 0 : e});
  };

  selectCurrncy = e => {
    this.setState({pickerSelectedCurrencyRate: e == null ? 0 : e});
  };

  commanFunctionForDisplayCurrncy(
    storageDotActiveStatus,
    passingPrice,
    precision = 2,
  ) {
    if (storageDotActiveStatus == 'true' || storageDotActiveStatus == true) {
      const dotActive = formatNumber(passingPrice, {
        separator: '.',
        precision: precision,
        delimiter: ',',
      });
      return dotActive;
    } else {
      const commaActive = formatNumber(passingPrice, {
        separator: ',',
        precision: precision,
        delimiter: '.',
      });
      return commaActive;
    }
  }

  returnData(data) {
    this.setState({});
  }

  onPressBack = () => {
    this.props.navigation.replace('home');
  };

  handleValidation = (pattern, value) => {
    const conditions = pattern.map(rule => new RegExp(rule, 'g'));
    return conditions.map(condition => condition.test(value));
  };

  render() {
    return !this.state.loaderVisible ? (
      <View style={{flex: 1}}>
        <SafeAreaProvider style={Styles.container}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
            // hidden
          />
          <KeyboardAwareScrollView
            style={{flex: 1}}
            keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
            // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            scrollIndicatorInsets={{right: 1}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={Styles.container}>
                <Header navigation={this.props.navigation} />

                <View style={Styles.coloumncontainer}>
                  <View>
                    <View style={Styles.textContainer}>
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
                        <View>
                          <Text style={HelperFonts.glodTitle}>
                            {I18n.t('common.settings')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.blueBkg}>
                    <Text style={Styles.subTitle}>
                      {I18n.t('settings.globalDiscount')}
                    </Text>
                  </View>
                  <View style={Styles.blueBkgInverted}>
                    <Text>&nbsp;</Text>
                  </View>
                  <View style={Styles.portlet}>
                    <View style={{marginLeft: 15}}>
                      <MultiSlider
                        values={[this.state.globalDiscount[0]]}
                        onValuesChange={this.globalDiscountChange}
                        enabledOne={true}
                        selectedStyle={{backgroundColor: R.colors.blue}}
                        trackStyle={{
                          backgroundColor: '#CECECE',
                          height: 4,
                        }}
                        pressedMarkerStyle={{
                          height: 26,
                          width: 34,
                          borderRadius: 0,
                          justifyContent: 'center',
                          backgroundColor: R.colors.white,
                          elevation: 6,
                          shadowColor: '#000000',
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowRadius: 1,
                          shadowOpacity: 0.1,
                        }}
                        markerStyle={{
                          height: 26,
                          width: 34,
                          borderRadius: 0,
                          justifyContent: 'center',
                          backgroundColor: R.colors.white,
                          elevation: 6,
                          shadowColor: '#000000',
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowRadius: 1,
                          shadowOpacity: 0.1,
                        }}
                        Style={{color: R.colors.blue}}
                        enabledTwo={false}
                        min={this.state.minDiscount}
                        max={this.state.maxDiscount}
                        step={1}
                      />
                    </View>
                    <View style={Styles.btncontainer}>
                      <TouchableOpacity
                        style={Styles.subBtn}
                        onPress={() => this.updateUserDiscount()}>
                        <Text style={Styles.textStyleB}>
                          {I18n.t('settings.ok')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {this.state.isShowContets.selectLanguage && (
                  <View style={Styles.coloumncontainers}>
                    <View style={Styles.blueBkg}>
                      <Text style={Styles.subTitle}>
                        {I18n.t('settings.language')}
                      </Text>
                    </View>
                    <View style={Styles.blueBkgInverted}>
                      <Text>&nbsp;</Text>
                    </View>
                    <View style={Styles.portlet}>
                      <View style={Styles.revrow}>
                        <RadioForm formHorizontal={true} animation={true}>
                          {this.state.languageList.map((obj, i) => {
                            var onPress = (value, index) => {
                              this.updateUserLanguage(value, index);
                            };
                            return (
                              <RadioButton labelHorizontal={true} key={i}>
                                <RadioButtonInput
                                  obj={obj}
                                  index={i}
                                  isSelected={this.state.languageIndex === i}
                                  onPress={onPress}
                                  buttonInnerColor={'#1c3a69'}
                                  buttonOuterColor={
                                    this.state.languageIndex === i
                                      ? '#1c3a69'
                                      : '#1c3a69'
                                  }
                                  buttonSize={15}
                                  buttonStyle={{}}
                                  buttonWrapStyle={{marginLeft: 10}}
                                />
                                <RadioButtonLabel
                                  obj={obj}
                                  index={i}
                                  onPress={onPress}
                                  labelStyle={{
                                    // fontWeight: '600',
                                    color: '#333',
                                    marginLeft: 10,
                                    fontFamily: 'SemplicitaPro-Regular',
                                  }}
                                  labelWrapStyle={{}}
                                />
                              </RadioButton>
                            );
                          })}
                        </RadioForm>
                      </View>
                    </View>
                  </View>
                )}
                <View style={Styles.coloumncontainers}>
                  <View style={Styles.blueBkg}>
                    <Text style={Styles.subTitle}>
                      {I18n.t('settings.numberFormat')}
                    </Text>
                  </View>
                  <View style={Styles.blueBkgInverted}>
                    <Text>&nbsp;</Text>
                  </View>
                  <View style={[Styles.portlet]}>
                    <View style={Styles.revrow}>
                      <RadioForm formHorizontal={true} animation={true}>
                        {this.state.numberFormatList.map((obj, i) => {
                          var onPress = (value, index) => {
                            this.updateUserNumberFormat(value, index);
                          };
                          return (
                            <RadioButton labelHorizontal={true} key={i}>
                              <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={this.state.numberFormatIndex === i}
                                onPress={onPress}
                                buttonInnerColor={'#1c3a69'}
                                buttonOuterColor={
                                  this.state.numberFormatIndex === i
                                    ? '#1c3a69'
                                    : '#1c3a69'
                                }
                                buttonSize={15}
                                buttonStyle={{}}
                                buttonWrapStyle={{marginLeft: 10}}
                              />
                              <RadioButtonLabel
                                obj={obj}
                                index={i}
                                onPress={onPress}
                                labelStyle={{
                                  // fontWeight: '600',
                                  color: '#333',
                                  marginLeft: 10,
                                  fontFamily: 'SemplicitaPro-Regular',
                                }}
                                labelWrapStyle={{}}
                              />
                            </RadioButton>
                          );
                        })}
                      </RadioForm>
                    </View>
                  </View>
                </View>
                {this.state.isShowContets.enterMetalPrice && (
                  <View style={Styles.coloumncontainers}>
                    <View style={Styles.blueBkg}>
                      <Text style={Styles.subTitle}>
                        {I18n.t('settings.enterPGMPrice')}
                      </Text>
                    </View>
                    <View style={Styles.blueBkgInverted}>
                      <Text>&nbsp;</Text>
                    </View>
                    <View style={[Styles.portlet]}>
                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('settings.ptUSDtoz')}:
                      </Text>

                      {/* <PriceInput
                        style={Styles.textInput}
                        precision={2}
                        isRTL={global.languageID == '3' ? false : true}
                        keyboardType={'decimal-pad'}
                        setValue={this.addAmountMethod_userPtPrice}
                        value={this.state.userPtPrice}
                        delimiter={this.state.isDotActive ? ',' : '.'}
                        separator={this.state.isDotActive ? '.' : ','}
                      /> */}
                      <TextInput
                        style={Styles.textInput}
                        placeholder={'0'}
                        maxLength={20}
                        keyboardType={'decimal-pad'}
                        onChangeText={e => this.setState({userPtPrice: e})}
                        value={`${this.state.userPtPrice}`}
                      />

                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('settings.pdUSDtoz')}:
                      </Text>

                      {/* <PriceInput
                        style={Styles.textInput}
                        precision={2}
                        isRTL={global.languageID == '3' ? false : true}
                        keyboardType={'decimal-pad'}
                        setValue={this.addAmountMethod_userPdPrice}
                        value={`${this.state.userPdPrice}`}
                        delimiter={this.state.isDotActive ? ',' : '.'}
                        separator={this.state.isDotActive ? '.' : ','}
                      /> */}
                      <TextInput
                        style={Styles.textInput}
                        placeholder={'0'}
                        maxLength={20}
                        keyboardType={'decimal-pad'}
                        // onChangeText={e => this.updatePdPrice(e)}
                        onChangeText={e => this.setState({userPdPrice: e})}
                        value={`${this.state.userPdPrice}`}
                      />

                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('settings.rhUSDtoz')}:
                      </Text>

                      {/* <PriceInput
                        style={Styles.textInput}
                        isRTL={global.languageID == '3' ? false : true}
                        precision={2}
                        keyboardType={'decimal-pad'}
                        setValue={this.addAmountMethod_userRhPrice}
                        value={`${this.state.userRhPrice}`}
                        delimiter={this.state.isDotActive ? ',' : '.'}
                        separator={this.state.isDotActive ? '.' : ','}
                      /> */}
                      <TextInput
                        style={Styles.textInput}
                        placeholder={'0'}
                        maxLength={20}
                        keyboardType={'decimal-pad'}
                        onChangeText={e => this.setState({userRhPrice: e})}
                        value={`${this.state.userRhPrice}`}
                      />

                      <View style={Styles.btncontainer}>
                        <Pressable
                          style={Styles.subBtn}
                          onPress={() => {
                            this.resetUserMetalPrice();
                          }}>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('settings.reset')}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={Styles.subBtn}
                          onPress={() => {
                            this.localValidation_updateUserMetalPrice();
                          }}>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('settings.ok')}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
                {this.state.isShowContets.selectCurrency && (
                  <View style={Styles.coloumncontainers}>
                    <View style={Styles.blueBkg}>
                      <Text style={Styles.subTitle}>
                        {I18n.t('common.selectcurrency')}
                      </Text>
                    </View>
                    <View style={Styles.blueBkgInverted}>
                      <Text>&nbsp;</Text>
                    </View>
                    <View style={[Styles.portlet, Styles.marginBot]}>
                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('common.currency')}:
                      </Text>
                      <View style={Styles.inputTexts}>
                        <CustomDropDown
                          dropDownData={this.state.dropDownResponse}
                          isRTL={global.languageID == '3' ? true : false}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setCurrecyConversionRate(itemValue)
                          }
                          selectedValue={this.state.pickerSelectedCurrencyVal}
                        />
                      </View>

                      <Text style={[Styles.formLbl, Styles.formmt]}>
                        {I18n.t('common.exchangeRate')}
                      </Text>

                      {/* <PriceInput
                        style={Styles.textInput}
                        precision={2}
                        isRTL={global.languageID == "3" ? false : true}

                        keyboardType={'decimal-pad'}
                        setValue={this.selectCurrncy}
                        value={`${this.state.pickerSelectedCurrencyRate}`}
                        delimiter={this.state.isDotActive ? ',' : '.'}
                        separator={this.state.isDotActive ? '.' : ','}
                      /> */}
                      <TextInput
                        style={Styles.textInput}
                        placeholder={'0'}
                        maxLength={20}
                        keyboardType={'decimal-pad'}
                        onChangeText={e =>
                          this.setState({pickerSelectedCurrencyRate: e})
                        }
                        value={`${this.state.pickerSelectedCurrencyRate}`}
                      />

                      <View style={Styles.btncontainer}>
                        <Pressable
                          style={Styles.subBtn}
                          onPress={() => {
                            this.resetUserCurrencyValue();
                          }}>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('settings.reset')}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={Styles.subBtn}
                          onPress={() => {
                            this.localValidation_updateUserCurrencyValue();
                          }}>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('settings.ok')}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}

                <View style={Styles.coloumncontainer}></View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>

          <Footer />
        </SafeAreaProvider>
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
