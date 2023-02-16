import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
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
import CustomFunctions from '../../components/CustomFunctions';
import PriceInput from '../../components/PriceInput';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      loaderVisible: true,
      pt_Content: '',
      pd_Content: '',
      rh_Content: '',
      weight_Material: '',
      currencyList: [],
      pickerSelectedCurrencyVal: 0,
      pickerSelectedCurrencyRate: '0',
      pickerSelectedCurrencySymbol: '',
      converterValue: 0,
      isDotActive: true,
      dropDownResponse: [],
      membershipUserAccess: {},
      defaultCurrncy: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    this.getCalculatorPageDefaults();
    this.getMembershipUserAccess();
  }

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    this.setState({
      membershipUserAccess: access,
      pickerSelectedCurrencyVal: access.userCurrencyID,
      converterValue: access.CurrencySymbol + 0,
      defaultCurrncy: access.CurrencySymbol,
      pickerSelectedCurrencySymbol: access.CurrencySymbol,
      pickerSelectedCurrencyRate: access.userCurrencyConversionRate,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  handleBackButton = () => {
    this.props.navigation.replace('home');
  };

  async getCalculatorPageDefaults() {
    let status = await CustomFunctions.getCurrncyStatus();
    let storedId = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    let newCurrncyArr = [];
    WebMethods.getRequestWithHeader(WebUrls.url.getCalculatorPageDefaults).then(
      response => {
        response.data.currencyList.map((item, index) => {
          if (item.currencyConversionChartID == storedId.userCurrencyID) {
            newCurrncyArr.push(item);
          }
        });
        this.setState({
          currencyList: response.data.currencyList,
          pickerSelectedCurrencyVal: newCurrncyArr[0].currencyConversionChartID,
          pickerSelectedCurrencyRate: newCurrncyArr[0].conversionRate,
          pickerSelectedCurrencySymbol: newCurrncyArr[0].currencySymbol,
          converterValue: newCurrncyArr[0].currencySymbol + 0,
          loaderVisible: false,
          isDotActive: status,
        });
        this.setDropDownResponse(response.data.currencyList);
      },
    );
  }

  setDropDownResponse = (foundResponse = []) => {
    let newResponse = foundResponse.map((item, index) => {
      {
        return {
          ...item,
          label: item.currencyName,
          value: item.currencyConversionChartID,
        };
      }
    });
    this.setState({dropDownResponse: newResponse});
  };

  async getCalculatedPGMValue(item = {}) {
    if (item == {}) {
      Toast.show(I18n.t('tostMessages.updateAllFields'), Toast.SHORT);
    }
    this.setState({
      converterValue: 0,
      loaderVisible: true,
    });
    var params = {
      currencyId:
        item.currencyConversionChartID != undefined
          ? item.currencyConversionChartID
          : this.state.pickerSelectedCurrencyVal,
      currencyValue:
        item.conversionRate != undefined
          ? item.conversionRate
          : this.state.pickerSelectedCurrencyRate,
      ptContentGT: this.state.pt_Content,
      pdContentGT: this.state.pd_Content,
      rhContentGT: this.state.rh_Content,
      weight: this.state.weight_Material,
    };
    await WebMethods.postRequestWithHeader(
      WebUrls.url.submitCalculator,
      params,
    ).then(response => {
      if (response.success) {
        this.setState({
          converterValue:
            this.state.pickerSelectedCurrencySymbol + response.data.toFixed(2),
          loaderVisible: false,
        });
      } else {
        Toast.show(
          I18n.t('tostMessages.failedToCalculateConverterValue'),
          Toast.SHORT,
        );
      }
    });
  }

  clear = () => {
    this.setState({
      pt_Content: 0,
      pd_Content: 0,
      rh_Content: 0,
      weight_Material: 0,
      converterValue: this.state.defaultCurrncy + 0,
    });
  };

  setCurrecyConversionRate = item => {
    let currencyID = item.currencyConversionChartID;
    this.setState({pickerSelectedCurrencyVal: currencyID});
    var index = this.state.currencyList.findIndex(
      e => e.currencyConversionChartID === currencyID,
    );

    this.setState({
      pickerSelectedCurrencyRate:
        index !== -1 ? this.state.currencyList[index].conversionRate : 0,
      pickerSelectedCurrencySymbol:
        index !== -1 ? this.state.currencyList[index].currencySymbol : '',
    });

    this.getCalculatedPGMValue(item);
  };

  ptContentppmMethod = e => {
    this.setState({pt_Content: e == null ? 0 : e});
  };

  pdContentppmMethod = e => {
    this.setState({pd_Content: e == null ? 0 : e});
  };

  rhContentppmMethod = e => {
    this.setState({rh_Content: e == null ? 0 : e});
  };

  weightmaterialMethod = e => {
    this.setState({weight_Material: e == null ? 0 : e});
  };

  render() {
    return !this.state.loaderVisible ? (
      <SafeAreaProvider style={Styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
          // hidden
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
                      &nbsp; {I18n.t('common.calculator')}
                    </Text> */}
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.replace('home');
                      }}
                      style={Styles.headerTxt}>
                      <View style={{paddingHorizontal: 5}}>
                        <FastImage
                          source={R.images.prevlnk}
                          style={Styles.prevlnk}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                      <View>
                        <Text style={HelperFonts.glodTitle}>
                          {I18n.t('common.calculator')}
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
                <View style={[Styles.portlet, Styles.valuecont]}>
                  <Text
                    style={
                      this.state.converterValue.toString().length > 10
                        ? Styles.textStylelarge_1
                        : Styles.textStylelarge
                    }>
                    {this.state.converterValue}
                  </Text>
                  <Pressable style={Styles.subBtn} onPress={() => this.clear()}>
                    <Text style={Styles.textStyleB}>
                      {I18n.t('calculator.clear')}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={Styles.coloumncontainers}>
                <View style={Styles.blueBkg}>
                  <Text style={Styles.subTitle}>
                    {I18n.t('calculator.metalContent')}
                  </Text>
                </View>
                <View style={Styles.blueBkgInverted}>
                  <Text>&nbsp;</Text>
                </View>
                <View style={Styles.portlet}>
                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('calculator.ptContentppm')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>
                  {/* <PriceInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    precision={2}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    setValue={this.ptContentppmMethod}
                    value={`${this.state.pt_Content}`}
                    delimiter={this.state.isDotActive ? ',' : '.'}
                    separator={this.state.isDotActive ? '.' : ','}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  /> */}
                  <TextInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    onChangeText={e => this.setState({pt_Content: e})}
                    value={`${this.state.pt_Content}`}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  />

                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('calculator.pdContentppm')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>
                  {/* <PriceInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    precision={2}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    setValue={this.pdContentppmMethod}
                    value={`${this.state.pd_Content}`}
                    delimiter={this.state.isDotActive ? ',' : '.'}
                    separator={this.state.isDotActive ? '.' : ','}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  /> */}
                  <TextInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    onChangeText={e => this.setState({pd_Content: e})}
                    value={`${this.state.pd_Content}`}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  />

                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('calculator.rhContentppm')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>
                  {/* <PriceInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    precision={2}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    setValue={this.rhContentppmMethod}
                    value={`${this.state.rh_Content}`}
                    delimiter={this.state.isDotActive ? ',' : '.'}
                    separator={this.state.isDotActive ? '.' : ','}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  /> */}
                  <TextInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    onChangeText={e => this.setState({rh_Content: e})}
                    value={`${this.state.rh_Content}`}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  />
                </View>
              </View>

              <View style={Styles.coloumncontainers}>
                <View style={Styles.blueBkg}>
                  <Text style={Styles.subTitle}>
                    {I18n.t('common.weightData')}
                  </Text>
                </View>
                <View style={Styles.blueBkgInverted}>
                  <Text>&nbsp;</Text>
                </View>
                <View style={Styles.portlet}>
                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('calculator.weightmaterial')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>
                  {/* <PriceInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    precision={2}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    setValue={this.weightmaterialMethod}
                    value={`${this.state.weight_Material}`}
                    delimiter={this.state.isDotActive ? ',' : '.'}
                    separator={this.state.isDotActive ? '.' : ','}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  /> */}
                  <TextInput
                    style={Styles.textInput}
                    placeholder={'0'}
                    maxLength={20}
                    keyboardType={'decimal-pad'}
                    onChangeText={e => this.setState({weight_Material: e})}
                    value={`${this.state.weight_Material}`}
                    onBlur={() => {
                      this.getCalculatedPGMValue();
                    }}
                  />
                </View>
              </View>

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
                    {I18n.t('common.currency')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>
                  <View style={Styles.inputTexts}>
                    <CustomDropDown
                      dropDownData={this.state.dropDownResponse}
                      isRTL={global.languageID == '3' ? true : false}
                      placeholder={I18n.t('common.selectcurrency')}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setCurrecyConversionRate(itemValue);
                      }}
                      selectedValue={this.state.pickerSelectedCurrencyVal}
                    />
                  </View>

                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('common.exchangeRate')}
                  </Text>
                  <TextInput
                    style={Styles.textInput}
                    editable={false}
                    underlineColorAndroid="transparent"
                    value={`${this.state.pickerSelectedCurrencyRate}`}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>

        <Footer />
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
