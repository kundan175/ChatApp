import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {formatNumber} from 'react-native-currency-input';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NumericInput from 'react-native-numeric-input';
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
import ImageSlider from '../../components/ImageSliderView';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;
var displayList = [];
var tableData = [];

const {height} = Dimensions.get('window');

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
    var lot = this.props.navigation.getParam('lotID');
    var custom = this.props.navigation.getParam('isCustom');
    this.state = {
      loaderVisible: true,
      lotID: lot,
      isCustom: custom,
      lotName: '',
      lotMarginType: false,
      lotMarginValue: 0,
      lotCurrencySymbol: '',
      lotCurrencyRate: 0,
      userCurrencySymbol: '',
      userCurrencyRate: 0,
      showFilters: false,
      searchConverterRefNo: '',
      showConverterList: false,
      activeConverters: [],
      carrierList: [],
      manufacturerList: [],
      makeList: [],
      masterConverterList: [],
      converterList: [],
      valueFrom: 0,
      valueTo: 0,
      sizeFrom: 0,
      sizeTo: 0,
      carrierFrom: 0,
      carrierTo: 0,
      userValueFrom: 0,
      userValueTo: 0,
      userSizeFrom: 0,
      userSizeTo: 0,
      userCarrierFrom: 0,
      userCarrierTo: 0,
      value: [0, 0],
      size: [0, 0],
      carrierWeight: [0, 0],
      pickerSelectedCarrierVal: 0,
      pickerSelectedManufacturerVal: 0,
      pickerSelectedMakeVal: 0,
      exactSearch: false,
      converterTokenBalance: 0,
      showAddCustomConverter: false,
      lotList: [],
      pickerSelectedLotVal: 0,
      converterVolumeList: [
        {label: '25%', value: 1},
        {label: '50%', value: 2},
        {label: '75%', value: 3},
        {label: '100%', value: 4},
      ],
      radioSelectedConverterVolumeVal: 4,
      converterVolumeIndex: 3,
      showAddConverterToLot: false,
      converterID: 0,
      converterRef: '',
      converterPGMValue: 0,
      converterValue: 0,
      converterQuantity: 0,
      converterUserValue: 0,
      converterTotalValue: 0,
      showAlreadyExist: false,
      redirectTo: false,
      membershipUserAccess: {},
      isDotActive: true,
      carrierListDropDown: [],
      manufacturerDropDown: [],
      makeDropDown: [],
      dropDownResponse: [],
      zeroTokenMessage: I18n.t('tostMessages.tokenBalanceExhausted'),
      isTokenExpired: false,
      isDisplayList: false,
      displayingList: [],
      selectedItem: '',
      isShowImageModal: false,
      displayImage: '',
      imageModalActive: false,
      sliderImagesData: [],
      displayImageTitleName: '',
      isReturntoSearch: true,
      newTableData: [],
      isShowExpandView: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    this.getMembershipUserAccess();
    this.getConverterSearchPageDefaults();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('home');
    return true;
  };

  async getMembershipUserAccess() {
    console.log('-------------------1>');
    let status = await CustomFunctions.getCurrncyStatus();
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    this.setState({
      membershipUserAccess: access,
      isDotActive: status == 'true' ? true : false,
    });
  }

  getConverterSearchPageDefaults = () => {
    console.log('-------------------2>', new Date());
    this.setState({loaderVisible: false});
    const endPoint =
      WebUrls.url.getConverterSearchPageDefaults +
      '?lotID=' +
      this.state.lotID +
      '&isCustom=' +
      this.state.isCustom;
    console.log('---endPoint', endPoint);
    WebMethods.getRequestWithHeader(endPoint).then(response => {
      this.setState({
        converterList: response.data.converterList,
        carrierList: response.data.carrierList,
        manufacturerList: response.data.manufacturerList,
        makeList: response.data.makeList,
        masterConverterList: response.data.converterList,
        converterTokenBalance: response.data.currentTokenBalance,
        lotList: response.data.lotMasterList,
        userCurrencySymbol: response.data.userCurrencySymbol,
        userCurrencyRate: response.data.UserCurrencyConversionRate,
        valueFrom: response.data.rangeFilter.valueFrom,
        valueTo: response.data.rangeFilter.valueTo,
        sizeFrom: response.data.rangeFilter.converterSizeFrom,
        sizeTo: response.data.rangeFilter.converterSizeTo,
        carrierFrom: response.data.rangeFilter.weightOfCarrierFrom,
        carrierTo: response.data.rangeFilter.weightOfCarrierTo,
        userValueFrom: response.data.rangeFilter.valueFrom,
        userValueTo: response.data.rangeFilter.valueTo,
        userSizeFrom: response.data.rangeFilter.converterSizeFrom,
        userSizeTo: response.data.rangeFilter.converterSizeTo,
        userCarrierFrom: response.data.rangeFilter.weightOfCarrierFrom,
        userCarrierTo: response.data.rangeFilter.weightOfCarrierTo,
        value: [
          response.data.rangeFilter.valueFrom,
          response.data.rangeFilter.valueTo,
        ],
        size: [
          response.data.rangeFilter.converterSizeFrom,
          response.data.rangeFilter.converterSizeTo,
        ],
        carrierWeight: [
          response.data.rangeFilter.weightOfCarrierFrom,
          response.data.rangeFilter.weightOfCarrierTo,
        ],
        lotName: this.state.isCustom ? response.data.lotInfo.lotName : '',
        lotMarginType: this.state.isCustom
          ? response.data.lotInfo.marginType
          : false,
        lotMarginValue: this.state.isCustom
          ? response.data.lotInfo.marginValue
          : 0,
        lotCurrencySymbol: this.state.isCustom
          ? response.data.lotInfo.currencySymbol
          : '',
        lotCurrencyRate: this.state.isCustom
          ? response.data.lotInfo.currencyConversionRate
          : 0,
        loaderVisible: false,
      });
      this.setDropDownResponse(response.data.lotMasterList);
      this.setAllDataRecords(
        response.data.carrierList,
        response.data.manufacturerList,
        response.data.makeList,
      );
    });
    console.log('-------------------3>', new Date(), this.state.carrierList);
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

  setDropDownResponse = (foundResponse = []) => {
    if (foundResponse == null) return;
    let newResponse = foundResponse.map((item, index) => {
      {
        return {
          ...item,
          label: item.lotName,
          value: item.lotMasterID,
        };
      }
    });
    this.setState({dropDownResponse: newResponse});
  };

  setAllDataRecords = (carrier = [], manufacturer = [], make = []) => {
    let carrierResponse = carrier.map((item, index) => {
      {
        return {
          ...item,
          label: item.carrierName,
          value: item.carrierID,
        };
      }
    });

    let manufacturerResponse = manufacturer.map((item, index) => {
      {
        return {
          ...item,
          label: item.manufacturerName,
          value: item.manufacturerID,
        };
      }
    });
    let makeResponse = make.map((item, index) => {
      {
        return {
          ...item,
          label: item.makeName,
          value: item.makeID,
        };
      }
    });
    this.setState({
      carrierListDropDown: carrierResponse,
      manufacturerDropDown: manufacturerResponse,
      makeDropDown: makeResponse,
    });
  };

  searchConverters = async (isDirectlySelected = false, isSelectedItem) => {
    this.updateTokenBalance({});
    this.setState({isDisplayList: false});
    const {
      converterTokenBalance,
      zeroTokenMessage,
      searchConverterRefNo,
      exactSearch,
      masterConverterList,
      pickerSelectedCarrierVal,
    } = this.state;
    this.setState({showConverterList: true, loaderVisible: true});
    if (converterTokenBalance == 0) {
      Toast.show(zeroTokenMessage);
      this.setState({showConverterList: false, isTokenExpired: true});
    }
    var localConverterList = masterConverterList;
    localConverterList =
      searchConverterRefNo != ''
        ? exactSearch == false && isDirectlySelected == true
          ? localConverterList.filter(item => {
              return (
                item.converterRefNo.toLowerCase() ===
                isSelectedItem.toLowerCase()
              );
            })
          : exactSearch == true && isDirectlySelected == false
          ? localConverterList.filter(item => {
              return (
                item.converterRefNo.toLowerCase() ===
                searchConverterRefNo.toLowerCase()
              );
            })
          : localConverterList.filter(item => {
              return (
                item.converterRefNo
                  .toLowerCase()
                  .indexOf(searchConverterRefNo.toLowerCase()) >= 0
              );
            })
        : localConverterList;

    localConverterList =
      pickerSelectedCarrierVal != 0
        ? localConverterList.filter(item => {
            return item.carrierID == pickerSelectedCarrierVal;
          })
        : localConverterList;

    localConverterList =
      this.state.pickerSelectedManufacturerVal != 0
        ? localConverterList.filter(item => {
            return (
              item.manufacturerID == this.state.pickerSelectedManufacturerVal
            );
          })
        : localConverterList;

    localConverterList =
      this.state.pickerSelectedMakeVal != 0
        ? localConverterList.filter(item => {
            return item.makeID == this.state.pickerSelectedMakeVal;
          })
        : localConverterList;

    localConverterList = localConverterList.filter(item => {
      return (
        parseFloat(item.PGMValue) >= this.state.userValueFrom &&
        parseFloat(item.PGMValue) <= this.state.userValueTo
      );
    });

    localConverterList = localConverterList.filter(item => {
      return (
        parseFloat(item.size) >= this.state.userSizeFrom &&
        parseFloat(item.size) <= this.state.userSizeTo
      );
    });

    localConverterList = localConverterList.filter(item => {
      return (
        parseFloat(item.weightOfCarrier) >= this.state.userCarrierFrom &&
        parseFloat(item.weightOfCarrier) <= this.state.userCarrierTo
      );
    });

    this.setState({
      loaderVisible: false,
      converterList: localConverterList,
      showFilters: false,
    });
  };

  updateTokenBalance = activeConverter => {
    console.log('-------------------token minus function call');
    WebMethods.postRequestWithHeader(WebUrls.url.updateTokenBalance).then(
      response => {
        if (response.success) {
          this.setState({
            activeConverters: activeConverter,
            converterTokenBalance: response.data,

            loaderVisible: false,
          });
        } else {
          Toast.show(
            I18n.t('tostMessages.failedToUpdateTokenBalance'),
            Toast.SHORT,
          );
        }
      },
    );
  };

  setDeafaultCurrncyValuesForDot = (passingPrice, precision = 2) => {
    const formattedValue = formatNumber(passingPrice, {
      separator: ',',
      precision: precision,
      delimiter: '.',
    });
    return formattedValue;
  };

  convertValueIntoSimpleNumber(stringValue) {
    if (typeof stringValue == 'number') return stringValue;
    stringValue = stringValue.trim();
    var result = stringValue.replace(/[^0-9]/g, '');
    if (/[,\.]\d{2}$/.test(stringValue)) {
      result = result.replace(/(\d{2})$/, '.$1');
    }
    return parseFloat(result);
  }

  calculateLotConverterPrice = (
    marginType,
    marginValue,
    converterVolume,
    converterValue,
    lotCurrencySymbol,
    lotCurrencyRate,
  ) => {
    let newConvertValue = this.convertValueIntoSimpleNumber(converterValue);
    var value =
      this.state.userCurrencySymbol == lotCurrencySymbol
        ? newConvertValue
        : (newConvertValue / this.state.userCurrencyRate) * lotCurrencyRate;
    value = marginType
      ? value - (value * marginValue) / 100
      : value - marginValue;
    value = (value * converterVolume) / 100;
    return value.toFixed(2);
  };

  showAddCustomConverter = () => {
    this.setState({
      pickerSelectedLotVal: 0,
      converterRef: '',
      radioSelectedConverterVolumeVal: 4,
      converterVolumeIndex: 3,
      converterValue: 0,
      converterQuantity: 1,

      showAddCustomConverter: true,
    });
  };

  customLotChanged = (value, index) => {
    var lotObj = this.getLotDetails(value.lotMasterID)[0];
    this.setState({
      lotID: lotObj.lotMasterID,
      lotName: lotObj.lotName,
      lotMarginType: lotObj.marginType,
      lotMarginValue: lotObj.marginValue,
      lotCurrencySymbol: lotObj.currencySymbol,
      lotCurrencyRate: lotObj.currencyConversionRate,
      pickerSelectedLotVal: value.lotMasterID,
    });
  };

  localValidation_submitCustomConverter = returnTo => {
    this.setState({loaderVisible: true});

    if (this.state.converterRef == 0) {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.pleaseEnterConverterReference'),
        Toast.SHORT,
      );
    } else if (this.state.radioSelectedConverterVolumeVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.selectConverterVolume'), Toast.SHORT);
    } else if (this.state.converterValue == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterConverterValue'), Toast.SHORT);
    } else if (this.state.converterQuantity == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.addMinOneConverterQty'), Toast.SHORT);
    } else if (!this.state.isCustom) {
      if (this.state.pickerSelectedLotVal == 0) {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.pleaseSelectLot'), Toast.SHORT);
      } else {
        this.submitCustomConverter(returnTo);
      }
    } else {
      this.submitCustomConverter(returnTo);
    }
  };

  submitCustomConverter = returnTo => {
    var params = {
      lotMasterID: this.state.isCustom
        ? this.state.lotID
        : this.state.pickerSelectedLotVal,
      converterRefNo: this.state.converterRef,
      converterVolumeID: this.state.radioSelectedConverterVolumeVal,
      converterValue: this.state.converterValue,
      converterQuantity: this.state.converterQuantity,
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.submitCustomConverter,
      params,
    ).then(response => {
      if (response.data) {
        this.setState({
          loaderVisible: false,
          showAddCustomConverter: !this.state.showAddCustomConverter,
        });
        Toast.show(
          I18n.t('tostMessages.customConverterAddedSucessfully'),
          Toast.SHORT,
        );
        if (returnTo) {
          this.props.navigation.navigate('editlot', {
            from: 'search',
            lotID: params.lotMasterID,
          });
        }
      } else {
        Toast.show(
          I18n.t('tostMessages.failedToAddCustomConverter'),
          Toast.SHORT,
        );
        this.setState({loaderVisible: false});
      }
    });
  };

  updateConverterQty = value => {
    this.setState({
      converterQuantity: value,
      converterTotalValue: this.state.converterUserValue * value,
    });
  };

  showAddConverter = converter => {
    var ConverterVol =
      this.state.radioSelectedConverterVolumeVal == 1
        ? 25
        : this.state.radioSelectedConverterVolumeVal == 2
        ? 50
        : this.state.radioSelectedConverterVolumeVal == 3
        ? 75
        : 100;
    var ConverterVal = this.state.isCustom
      ? this.calculateLotConverterPrice(
          this.state.lotMarginType,
          this.state.lotMarginValue,
          ConverterVol,
          converter.PGMValue,
          this.state.lotCurrencySymbol,
          this.state.lotCurrencyRate,
        )
      : 0;
    this.setState({
      converterID: converter.converterID,
      converterRef: converter.converterRefNo,
      radioSelectedConverterVolumeVal: 4,
      converterVolumeIndex: 3,
      pickerSelectedLotVal: 0,
      converterQuantity: 1,
      converterPGMValue: converter.PGMValue,
      converterValue: this.state.isCustom ? ConverterVal : 0,
      converterUserValue: this.state.isCustom ? ConverterVal : 0,
      converterTotalValue: this.state.isCustom ? ConverterVal * 1 : 0,
      showAddConverterToLot: true,
    });
  };

  getLotDetails = lotID => {
    return this.state.lotList.filter(item => {
      return item.lotMasterID == lotID;
    });
  };

  volumeChanged = (value, index) => {
    var ConverterVol =
      value == 1 ? 25 : value == 2 ? 50 : value == 3 ? 75 : 100;
    var ConverterVal = this.calculateLotConverterPrice(
      this.state.lotMarginType,
      this.state.lotMarginValue,
      ConverterVol,
      this.state.converterPGMValue,
      this.state.lotCurrencySymbol,
      this.state.lotCurrencyRate,
    );
    this.setState({
      radioSelectedConverterVolumeVal: value,
      converterVolumeIndex: index,
      converterValue: ConverterVal,
      converterUserValue: ConverterVal,
      converterTotalValue: ConverterVal * this.state.converterQuantity,
    });
  };

  lotChanged = (value, index) => {
    var lotObj = this.getLotDetails(value.lotMasterID)[0];
    var ConverterVol =
      this.state.radioSelectedConverterVolumeVal == 1
        ? 25
        : this.state.radioSelectedConverterVolumeVal == 2
        ? 50
        : this.state.radioSelectedConverterVolumeVal == 3
        ? 75
        : 100;
    var ConverterVal =
      lotObj != null
        ? this.calculateLotConverterPrice(
            lotObj.marginType,
            lotObj.marginValue,
            ConverterVol,
            this.state.converterPGMValue,
            lotObj.currencySymbol,
            lotObj.currencyConversionRate,
          )
        : 0;

    this.setState({
      lotID: lotObj.lotMasterID,
      lotName: lotObj.lotName,
      lotMarginType: lotObj.marginType,
      lotMarginValue: lotObj.marginValue,
      lotCurrencySymbol: lotObj.currencySymbol,
      lotCurrencyRate: lotObj.currencyConversionRate,
      pickerSelectedLotVal: value.lotMasterID,
      converterValue: ConverterVal,
      converterUserValue: ConverterVal,
      converterTotalValue: ConverterVal * this.state.converterQuantity,
    });
    this.setState({});
  };

  priceChanged = converterUserValueText => {
    this.setState({
      converterUserValue: converterUserValueText,
      converterTotalValue:
        converterUserValueText * this.state.converterQuantity,
    });
  };

  localValidation_submitConverterToLot = returnTo => {
    this.setState({loaderVisible: true, isReturntoSearch: returnTo});
    if (this.state.radioSelectedConverterVolumeVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.selectConverterVolume'), Toast.SHORT);
    } else if (this.state.converterQuantity == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.addMinOneConverterQty'), Toast.SHORT);
    } else if (this.state.converterValue == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterConverterValue'), Toast.SHORT);
    } else if (!this.state.isCustom) {
      if (this.state.pickerSelectedLotVal == 0) {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.pleaseSelectLot'), Toast.SHORT);
      } else {
        this.submitConverterToLot(returnTo);
      }
    } else {
      this.submitConverterToLot(returnTo);
    }
  };

  returnData() {
    this.setState({});
  }

  submitConverterToLot = returnTo => {
    var params = {
      lotDetailsID: 0,
      converterID: this.state.converterID,
      converterVolumeID: this.state.radioSelectedConverterVolumeVal,
      lotMasterID: this.state.isCustom
        ? this.state.lotID
        : this.state.pickerSelectedLotVal,
      converterQuantity: this.state.converterQuantity,
      converterValue: this.state.converterValue,
      userConverterValue: this.state.converterUserValue,
      converterTotalValue: this.state.converterTotalValue,
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.submitConverterToLot,
      params,
    ).then(response => {
      if (response.data) {
        this.setState({
          loaderVisible: false,
          showAddConverterToLot: !this.state.showAddConverterToLot,
        });

        Toast.show(
          I18n.t('tostMessages.converterAddedSuccessfully'),
          Toast.SHORT,
        );
        if (returnTo == true) {
          var parseData = {
            from: 'search',
            returnData: this.returnData.bind(this),
            lotID: params.lotMasterID,
          };
          this.props.navigation.navigate('editlot', {
            parseData: parseData,
            lotID: params.lotMasterID,
            from: 'search',
          });
        }
      } else {
        if (response.message == '1') {
          this.setState({
            redirectTo: returnTo,
            showAddConverterToLot: false,
            showAlreadyExist: true,
            loaderVisible: false,
          });
        } else {
          Toast.show(I18n.t('tostMessages.failedToAddConverter'), Toast.SHORT);
          this.setState({loaderVisible: false});
        }
      }
    });
  };

  updateConverterToLot = () => {
    var params = {
      lotDetailsID: 0,
      converterID: this.state.converterID,
      converterVolumeID: this.state.radioSelectedConverterVolumeVal,
      lotMasterID: this.state.lotID,
      converterQuantity: this.state.converterQuantity,
      converterValue: this.state.converterValue,
      userConverterValue: this.state.converterUserValue,
      converterTotalValue: this.state.converterTotalValue,
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateConverterToLot,
      params,
    ).then(response => {
      if (response.data) {
        this.setState({
          loaderVisible: false,
          showAlreadyExist: false,
          redirectTo: '',
        });
        Toast.show(
          I18n.t('tostMessages.converterQtyUpdatedToLot'),
          Toast.SHORT,
        );
        if (this.state.isReturntoSearch == true) {
          this.props.navigation.navigate('editlot', {
            lotID: this.state.lotID,
          });
        } else {
          this.setState({
            showAlreadyExist: false,
          });
        }
      } else {
        Toast.show(
          I18n.t('tostMessages.failedToUpdateConverterQtyToLot'),
          Toast.SHORT,
        );
        this.setState({loaderVisible: false});
      }
    });
  };

  renderHeader = converter => {
    let index = this.state.activeConverters[0];
    let currentObj = this.state.converterList[index];
    return (
      <View style={Styles.headercon}>
        <FastImage
          style={{height: 20, width: 20}}
          source={currentObj == converter ? R.images.up : R.images.down}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={Styles.header}> &nbsp; {converter.converterRefNo}</Text>
      </View>
    );
  };

  renderContent = (converter, index) => {
    const {isDotActive, isShowExpandView, converterList} = this.state;
    converterList.forEach((item, index1) => {
      if (index1 !== index) item.isOpenView = false;
    });
    if (
      converterList[index].isOpenView == false ||
      converterList[index].isOpenView == undefined
    ) {
      converterList[index].isOpenView = true;
    } else {
      converterList[index].isOpenView = false;
    }
    converter.weightOfCarrier = this.commanFunctionForDisplayCurrncy(
      isDotActive,
      this.convertValueIntoSimpleNumber(converter.weightOfCarrier),
    );
    converter.PGMValue = this.commanFunctionForDisplayCurrncy(
      isDotActive,
      this.convertValueIntoSimpleNumber(converter.PGMValue),
    );
    if (this.state.membershipUserAccess.carrier) {
      tableData = [];

      tableData.push([
        I18n.t('converterSearch.carrierMaterial') + ':',
        converter.carrierName,
      ]);
    }
    if (!isShowExpandView) {
      this.updateTokenBalance(converter);
    }
    if (this.state.membershipUserAccess.weightofCarrierKg) {
      tableData.push([
        I18n.t('converterSearch.carrierWeight') + ':',
        converter.weightOfCarrier,
      ]);
    }
    if (converter.makeThumbImagePath != null) {
      tableData.push([
        I18n.t('common.make') + ':',
        converter.makeThumbImagePath,
      ]);
    } else {
      tableData.push([I18n.t('common.make') + ':', converter.makeName]);
    }

    if (this.state.membershipUserAccess.PGMValue) {
      tableData.push([
        I18n.t('common.value') + ':',
        converter.PGMValue + ' ' + this.state.userCurrencySymbol,
      ]);
    }

    if (converter.converterThumbImagePath != null) {
      let newImageArr = [];
      newImageArr.push(converter.converterThumbImagePath);
      if (converter.converterImage.length > 0) {
        converter.converterImage.map((item, index) => {
          newImageArr.push(item.imagePath);
        });
      }
      tableData.push([I18n.t('common.Image') + ':', newImageArr]);
    } else {
      tableData.push([I18n.t('common.Image') + ':', 'No Photos available']);
    }
    this.setState({isShowExpandView: !isShowExpandView});
  };

  onPressedImage = (foundImage, ImgTitle, imageType) => {
    if (imageType == 'Make:') return;
    let wholeArr = [];
    foundImage.map((item, index) => index != 0 && wholeArr.push({url: item}));
    this.setState({
      isShowImageModal: true,
      displayImage: foundImage,
      sliderImagesData: wholeArr,
      imageModalActive: true,
      displayImageTitleName: ImgTitle,
    });
  };

  onValueChange = values => {
    this.setState({
      value: values,
      userValueFrom: Number(values[0]).toFixed(2),
      userValueTo: Number(values[1]).toFixed(2),
    });
  };

  onSizeChange = sizes => {
    this.setState({
      size: sizes,
      userSizeFrom: sizes[0],
      userSizeTo: sizes[1],
    });
  };

  onCarrierWeightChange = carrierWeights => {
    this.setState({
      carrierWeight: carrierWeights,
      userCarrierFrom: Number(carrierWeights[0]).toFixed(2),
      userCarrierTo: Number(carrierWeights[1]).toFixed(2),
    });
  };

  enterValueMethod = e => {
    this.setState({converterValue: e == null ? 0 : e});
  };

  onPassValue = item => {
    let final = item.carrierID;
    this.setState({pickerSelectedCarrierVal: final});
  };

  searchItems = (matchedTxt = '', exactSearchStatus = false) => {
    this.setState({
      searchConverterRefNo: matchedTxt,
    });
    const {masterConverterList, converterList} = this.state;

    if (matchedTxt.length == 0) {
      this.setState({displayingList: []});
      return;
    }
    displayList = [];
    const exactSearchOn = this.state.exactSearch;
    masterConverterList.filter(function (item, index) {
      const condition = exactSearchOn
        ? item.converterRefNo.toLowerCase() == matchedTxt.toLowerCase()
        : item.converterRefNo.toLowerCase().includes(matchedTxt.toLowerCase());
      if (condition) {
        displayList.push(item);
      }
    });
    this.setState({isDisplayList: true});
    this.setState({displayingList: displayList});
  };

  onPressName = async (name = '', item) => {
    this.setState({isDisplayList: false});
    this.setState({
      searchConverterRefNo: name,
    });
    await this.searchConverters(true, name);
  };

  onClickImage = (modalStatus = false) => {
    this.setState({imageModalActive: modalStatus});
  };

  onPressOutside = () => {
    Keyboard.dismiss;
    this.setState({isDisplayList: false});
  };

  onPressView = item => {
    this.updateTokenBalance({});
    this.props.navigation.navigate('converterdetails', {
      converterID: item.converterID,
      isFromSearch: true,
      lotID: 0,
    });
  };

  MainFunction = ({item, index}) => {
    return (
      <>
        <Pressable
          style={{margin: 1}}
          onPress={() => this.renderContent(item, index)}>
          <View style={Styles.headercon}>
            <View style={Styles.headerTxtList}>
              <FastImage
                style={{height: 20, width: 20}}
                source={
                  item.isOpenView != true ||
                  item.isOpenView == null ||
                  item.isOpenView == undefined
                    ? R.images.down
                    : R.images.up
                }
                resizeMode={'contain'}
              />
              <Text style={Styles.header}> &nbsp; {item.converterRefNo}</Text>
            </View>
          </View>
          {item.isOpenView == true &&
            item.isOpenView != undefined &&
            item.isOpenView !== null && (
              <>
                <View style={Styles.content}>
                  {tableData &&
                    tableData.map((item1, index1) => {
                      return (
                        <>
                          <View
                            key={`${index1}` + 1}
                            style={Styles.expandViewRow}>
                            <View style={Styles.expandViewKey}>
                              <Text
                                style={[
                                  HelperFonts.font_B_Regular,
                                  global.languageID == '3'
                                    ? {textAlign: 'right'}
                                    : {textAlign: 'left'},
                                ]}>
                                {item1[0]}
                              </Text>
                            </View>
                            <View style={Styles.expandViewValue}>
                              {index1 == 2 || index1 == 4 ? (
                                <>
                                  {(
                                    index1 == 2
                                      ? item1[1].includes('https')
                                      : item1[1][0].includes('https')
                                  ) ? (
                                    <Pressable
                                      onPress={() =>
                                        this.onPressedImage(
                                          item1[1],
                                          item.converterRefNo,
                                          item1[0],
                                        )
                                      }>
                                      <FastImage
                                        style={{height: 60, width: 60}}
                                        source={{
                                          uri:
                                            index1 == 4
                                              ? item1[1][0]
                                              : item1[1],
                                        }}
                                        resizeMode={
                                          FastImage.resizeMode.contain
                                        }
                                      />
                                    </Pressable>
                                  ) : (
                                    <Text style={[HelperFonts.font_B_Regular]}>
                                      {item1[1]}
                                    </Text>
                                  )}
                                </>
                              ) : (
                                <Text style={[HelperFonts.font_B_Regular]}>
                                  {item1[1]}
                                </Text>
                              )}
                            </View>
                          </View>
                        </>
                      );
                    })}
                  <View style={Styles.expandViewRow}>
                    <View style={Styles.expandViewKey}>
                      <Text
                        style={[
                          HelperFonts.font_B_Regular,
                          global.languageID == '3'
                            ? {textAlign: 'right'}
                            : {textAlign: 'left'},
                        ]}>
                        {I18n.t('lotDetails.action') + ':'}
                      </Text>
                    </View>
                    <View style={[Styles.expandViewValue_1]}>
                      <Pressable
                        onPress={() => {
                          this.onPressView(item);
                        }}
                        style={Styles.blubtn3}>
                        <Text
                          style={{marginTop: Platform.OS == 'android' ? 0 : 0}}>
                          <FastImage
                            source={R.images.view}
                            style={{width: 22, height: 17}}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </Text>
                      </Pressable>
                      <Pressable
                        style={Styles.blubtn3}
                        onPress={() => {
                          this.showAddConverter(item);
                        }}>
                        <Text
                          style={{marginTop: Platform.OS == 'android' ? 0 : 0}}>
                          <FastImage
                            source={R.images.cart}
                            style={{width: 22, height: 17}}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </>
            )}
        </Pressable>
      </>
    );
  };

  render() {
    return !this.state.loaderVisible ? (
      <View style={{flex: 1}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {!this.state.imageModalActive ? (
          <SafeAreaProvider style={Styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>
              <TouchableWithoutFeedback
                onPress={() => this.onPressOutside()}
                accessible={false}>
                <View style={Styles.container}>
                  <Header navigation={this.props.navigation} />

                  <View style={Styles.coloumncontainer}>
                    <View style={Styles.textContainer}>
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
                            {I18n.t('common.converterSearch')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={Styles.textContainer1}>
                      <Text style={Styles.headingBalance}>
                        {I18n.t('common.tokenBalance')}: &nbsp;
                      </Text>
                      <Text style={Styles.Balance}>
                        {this.state.converterTokenBalance}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.coloumncontainer1}>
                    <View style={Styles.boxcontainer}>
                      <TextInput
                        style={Styles.textInput}
                        onChangeText={txt => this.searchItems(txt)}
                        value={this.state.searchConverterRefNo}
                        placeholder={I18n.t(
                          'converterSearch.searchConverterRefrenceNumber',
                        )}
                      />
                      {this.state.showFilters && (
                        <View>
                          {this.state.membershipUserAccess.carrier && (
                            <View style={Styles.inputTexts}>
                              <CustomDropDown
                                dropDownData={this.state.carrierListDropDown}
                                isRTL={global.languageID == '3' ? true : false}
                                onValueChange={(itemValue, itemIndex) => {
                                  this.setState({
                                    pickerSelectedCarrierVal:
                                      itemValue.carrierID,
                                  });
                                }}
                                placeholder={I18n.t(
                                  'converterSearch.selectCarrier',
                                )}
                                selectedValue={
                                  this.state.pickerSelectedCarrierVal
                                }
                              />
                            </View>
                          )}

                          {this.state.membershipUserAccess.manufacturer && (
                            <View style={Styles.inputTexts}>
                              <CustomDropDown
                                dropDownData={this.state.manufacturerDropDown}
                                isRTL={global.languageID == '3' ? true : false}
                                placeholder={I18n.t(
                                  'converterSearch.selectManufacturer',
                                )}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.setState({
                                    pickerSelectedManufacturerVal:
                                      itemValue.manufacturerID,
                                  })
                                }
                                selectedValue={
                                  this.state.pickerSelectedManufacturerVal
                                }
                              />
                            </View>
                          )}

                          {this.state.membershipUserAccess.make && (
                            <View style={Styles.inputTexts}>
                              <CustomDropDown
                                dropDownData={this.state.makeDropDown}
                                isRTL={global.languageID == '3' ? true : false}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.setState({
                                    pickerSelectedMakeVal: itemValue.makeID,
                                  })
                                }
                                placeholder={I18n.t(
                                  'converterSearch.selectMake',
                                )}
                                selectedValue={this.state.pickerSelectedMakeVal}
                              />
                            </View>
                          )}

                          <View style={Styles.rangecontainer}>
                            <Text style={Styles.formLblb}>
                              {I18n.t('common.value')}:
                            </Text>
                            <View
                              style={{marginLeft: 20}}
                              pointerEvents={
                                this.state.membershipUserAccess.PGMValue
                                  ? 'auto'
                                  : 'none'
                              }>
                              <MultiSlider
                                values={[
                                  this.state.value[0],
                                  this.state.value[1],
                                ]}
                                onValuesChange={this.onValueChange}
                                enabledTwo={true}
                                selectedStyle={{
                                  backgroundColor: this.state
                                    .membershipUserAccess.PGMValue
                                    ? R.colors.blue
                                    : '#CECECE',
                                }}
                                trackStyle={{
                                  backgroundColor: '#CECECE',
                                  height: 4,
                                }}
                                pressedMarkerStyle={[
                                  {
                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                  },
                                  Styles.pressedMarkerStyle,
                                ]}
                                markerStyle={[
                                  {
                                    opacity: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 1
                                      : 0.8,

                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                    shadowColor: this.state.membershipUserAccess
                                      .PGMValue
                                      ? '#000000'
                                      : '#a2a2a2',
                                  },
                                  Styles.markerStyle,
                                ]}
                                Style={{color: R.colors.blue}}
                                min={this.state.valueFrom}
                                max={this.state.valueTo}
                                step={0.01}
                              />
                            </View>
                          </View>

                          <View style={Styles.rangecontainer}>
                            <Text style={Styles.formLblb}>
                              {I18n.t('common.size')}:
                            </Text>
                            <View
                              style={{marginLeft: 20}}
                              pointerEvents={
                                this.state.membershipUserAccess.size
                                  ? 'auto'
                                  : 'none'
                              }>
                              <MultiSlider
                                values={[
                                  this.state.size[0],
                                  this.state.size[1],
                                ]}
                                onValuesChange={this.onSizeChange}
                                enabledTwo={true}
                                selectedStyle={{
                                  backgroundColor: this.state
                                    .membershipUserAccess.size
                                    ? R.colors.blue
                                    : '#CECECE',
                                }}
                                trackStyle={{
                                  backgroundColor: '#CECECE',
                                  height: 4,
                                }}
                                pressedMarkerStyle={[
                                  {
                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                  },
                                  Styles.pressedMarkerStyle,
                                ]}
                                markerStyle={[
                                  {
                                    opacity: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 1
                                      : 0.8,

                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                    shadowColor: this.state.membershipUserAccess
                                      .PGMValue
                                      ? '#000000'
                                      : '#a2a2a2',
                                  },
                                  Styles.markerStyle,
                                ]}
                                Style={{color: R.colors.blue}}
                                min={this.state.sizeFrom}
                                max={this.state.sizeTo}
                                step={1}
                              />
                            </View>
                          </View>

                          <View style={Styles.rangecontainer}>
                            <Text style={Styles.formLblb}>
                              {I18n.t('converterSearch.carrierWeight')}:
                            </Text>
                            <View
                              style={{marginLeft: 20}}
                              pointerEvents={
                                this.state.membershipUserAccess
                                  .weightofCarrierKg
                                  ? 'auto'
                                  : 'none'
                              }>
                              <MultiSlider
                                values={[
                                  this.state.carrierWeight[0],
                                  this.state.carrierWeight[1],
                                ]}
                                onValuesChange={this.onCarrierWeightChange}
                                enabledTwo={true}
                                selectedStyle={{
                                  backgroundColor: this.state
                                    .membershipUserAccess.weightofCarrierKg
                                    ? R.colors.blue
                                    : '#CECECE',
                                }}
                                trackStyle={{
                                  backgroundColor: '#CECECE',
                                  height: 4,
                                }}
                                pressedMarkerStyle={[
                                  {
                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                  },
                                  Styles.pressedMarkerStyle,
                                ]}
                                markerStyle={[
                                  {
                                    opacity: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 1
                                      : 0.8,

                                    elevation: this.state.membershipUserAccess
                                      .PGMValue
                                      ? 6
                                      : 3,
                                    shadowColor: this.state.membershipUserAccess
                                      .PGMValue
                                      ? '#000000'
                                      : '#a2a2a2',
                                  },
                                  Styles.markerStyle,
                                ]}
                                Style={{color: R.colors.blue}}
                                min={this.state.carrierFrom}
                                max={this.state.carrierTo}
                                step={0.01}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                      <View style={Styles.flexContainer}>
                        <TouchableOpacity
                          style={Styles.blubtn}
                          onPress={() => this.searchConverters()}>
                          <FastImage
                            source={R.images.search}
                            style={{
                              height: 20,
                              width: 20,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={Styles.blubtn}
                          onPress={() =>
                            this.setState({
                              showFilters: !this.state.showFilters,
                            })
                          }>
                          <FastImage
                            source={R.images.filter}
                            style={{
                              height: 20,
                              width: 20,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.checkboxcont}>
                          <CheckBox
                            disabled={false}
                            style={Styles.checkbox}
                            value={this.state.exactSearch}
                            onValueChange={() => {
                              this.setState({
                                exactSearch: !this.state.exactSearch,
                              });
                            }}
                            tintColors={{true: '#a2a2a2', false: 'mediumgray'}}
                          />
                          <Text
                            style={Styles.chklabel}
                            onPress={() =>
                              this.setState({
                                exactSearch: !this.state.exactSearch,
                              })
                            }>
                            {I18n.t('converterSearch.exactSearch')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={Styles.blubtn1}
                          onPress={() => this.showAddCustomConverter()}>
                          <FastImage
                            source={R.images.addconverter}
                            style={{
                              height: 20,
                              width: 42,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {this.state.isDisplayList &&
                    this.state.displayingList &&
                    this.state.displayingList.map((item, index) => {
                      return (
                        <ScrollView
                          style={[
                            Styles.autoSearch,
                            {
                              height: '50%',
                              borderBottomWidth:
                                index == this.state.displayingList.length - 1
                                  ? 1
                                  : 0,
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onPressName(item.converterRefNo, item);
                            }}>
                            <Text style={Styles.smartSearchText}>
                              {item.converterRefNo}
                            </Text>
                          </TouchableOpacity>
                        </ScrollView>
                      );
                    })}

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showAddCustomConverter}
                    onRequestClose={() => {
                      this.setState({
                        showAddCustomConverter:
                          !this.state.showAddCustomConverter,
                      });
                    }}>
                    <View style={Styles.centeredView}>
                      <View style={Styles.modalView}>
                        <View
                          style={[
                            Styles.headingModalContainers,
                            Styles.modalbg,
                          ]}>
                          <View style={Styles.headingModalContainer}>
                            <Text style={Styles.headingModal}>
                              {I18n.t('addCustomConverter.addCustomConverter')}
                            </Text>
                          </View>
                          <View style={Styles.headingBtn}>
                            <Pressable
                              style={Styles.buttonCloseb}
                              onPress={() => {
                                this.setState({
                                  showAddCustomConverter:
                                    !this.state.showAddCustomConverter,
                                });
                              }}>
                              <Text style={Styles.textStyle}>X</Text>
                            </Pressable>
                          </View>
                        </View>

                        <View>
                          <Text
                            style={[
                              [
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ],
                              HelperFonts.mandatory_Regular,
                            ]}>
                            {I18n.t('common.mandatoryFields')}
                          </Text>
                        </View>

                        <View style={Styles.formcontainer}>
                          {!this.state.isCustom ? (
                            <View>
                              <Text style={Styles.formLbl}>
                                {I18n.t('common.lotName')}:
                                <Text
                                  style={[
                                    Styles.mandatoryLbl,
                                    HelperFonts.mandatory_Regular,
                                  ]}>
                                  *
                                </Text>
                              </Text>
                              <View style={Styles.inputTexts1}>
                                <CustomDropDown
                                  dropDownData={this.state.dropDownResponse}
                                  isRTL={
                                    global.languageID == '3' ? true : false
                                  }
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.customLotChanged(itemValue, itemIndex)
                                  }
                                  selectedValue={
                                    this.state.pickerSelectedLotVal
                                  }
                                  placeholder={I18n.t(
                                    'addCustomConverter.selectLot',
                                  )}
                                />
                              </View>
                            </View>
                          ) : (
                            <View style={Styles.coloumncontainer3}>
                              <View style={Styles.modalitem1}>
                                <Text style={[Styles.formLbl, Styles.formmt]}>
                                  {I18n.t('common.lotName')}:
                                  <Text
                                    style={[
                                      Styles.mandatoryLbl,
                                      HelperFonts.mandatory_Regular,
                                    ]}>
                                    *
                                  </Text>
                                </Text>
                              </View>
                              <View style={Styles.modalitem2}>
                                <Text style={[Styles.formLblnb, Styles.formmt]}>
                                  {this.state.lotName}
                                </Text>
                              </View>
                            </View>
                          )}

                          <Text style={[Styles.formLbl, Styles.formmt]}>
                            {I18n.t('common.converterReference')}:
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <TextInput
                            style={Styles.textInput}
                            underlineColorAndroid="transparent"
                            onChangeText={converterRefText =>
                              this.setState({converterRef: converterRefText})
                            }
                            value={22}
                            keyboardType="default"
                            maxLength={50}
                            placeholder={I18n.t(
                              'addCustomConverter.enterConverterReference',
                            )}
                          />

                          <Text
                            style={[
                              Styles.formLbl,
                              Styles.formmt,
                              Styles.formmb,
                            ]}>
                            {I18n.t('addCustomConverter.converterVolume')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <View style={Styles.rowrev}>
                            <RadioForm formHorizontal={true} animation={true}>
                              {this.state.converterVolumeList.map((obj, i) => {
                                var onPress = (value, index) => {
                                  this.setState({
                                    radioSelectedConverterVolumeVal: value,
                                    converterVolumeIndex: index,
                                  });
                                };

                                return (
                                  <RadioButton labelHorizontal={true} key={i}>
                                    <RadioButtonInput
                                      obj={obj}
                                      index={i}
                                      isSelected={
                                        this.state.converterVolumeIndex === i
                                      }
                                      onPress={onPress}
                                      buttonInnerColor={'#1c3a69'}
                                      buttonOuterColor={
                                        this.state.converterVolumeIndex === i
                                          ? '#1c3a69'
                                          : '#1c3a69'
                                      }
                                      buttonSize={15}
                                      buttonStyle={{}}
                                      buttonWrapStyle={{marginLeft: 15}}
                                    />
                                    <RadioButtonLabel
                                      obj={obj}
                                      index={i}
                                      onPress={onPress}
                                      labelStyle={{
                                        color: '#000',
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
                          <Text style={[Styles.formLbl, Styles.formmt]}>
                            {I18n.t('common.value')}{' '}
                            {'(In ' + this.state.lotCurrencySymbol + ' )'}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>

                          <TextInput
                            style={Styles.textInput}
                            placeholder={I18n.t(
                              'addCustomConverter.enterConverterValue',
                            )}
                            maxLength={20}
                            keyboardType={'decimal-pad'}
                            onChangeText={e =>
                              this.setState({converterValue: e})
                            }
                            value={`${this.state.converterValue}`}
                          />

                          <Text
                            style={[
                              Styles.formLbl,
                              Styles.formmt,
                              Styles.formmb,
                            ]}>
                            {I18n.t('common.quantity')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <NumericInput
                            value={this.state.converterQuantity}
                            totalWidth={80}
                            minValue={0}
                            onChange={value =>
                              this.setState({converterQuantity: value})
                            }
                            rightButtonBackgroundColor="#1c3a69"
                            leftButtonBackgroundColor="#1c3a69"
                            rounded
                            iconStyle={{color: 'white'}}
                          />

                          <View style={[Styles.alignRight, Styles.formmt]}>
                            <Pressable
                              style={Styles.modalBtn}
                              onPress={() =>
                                this.localValidation_submitCustomConverter(
                                  false,
                                )
                              }>
                              <Text style={Styles.textStyleB}>
                                {I18n.t('addCustomConverter.addReturnSearch')}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={Styles.modalBtn}
                              onPress={() =>
                                this.localValidation_submitCustomConverter(true)
                              }>
                              <Text style={Styles.textStyleB}>
                                {I18n.t(
                                  'addCustomConverter.addReturnLotDetails',
                                )}
                              </Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={[Styles.alignRight, Styles.formcontainer]}>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showAddCustomConverter:
                                  !this.state.showAddCustomConverter,
                              });
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.cancel')}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showAddConverterToLot}
                    onRequestClose={() => {
                      this.setState({
                        showAddConverterToLot:
                          !this.state.showAddConverterToLot,
                      });
                    }}>
                    <View style={Styles.centeredView}>
                      <View style={Styles.modalView}>
                        <View
                          style={[
                            Styles.headingModalContainers,
                            Styles.modalbg,
                          ]}>
                          <View style={Styles.headingModalContainer}>
                            <Text style={Styles.headingModal}>
                              {I18n.t('addConverterToLot.addConverterToLot')}
                            </Text>
                          </View>
                          <View style={Styles.headingBtn}>
                            <Pressable
                              style={Styles.buttonCloseb}
                              onPress={() => {
                                this.setState({
                                  showAddConverterToLot:
                                    !this.state.showAddConverterToLot,
                                });
                              }}>
                              <Text style={Styles.textStyle}>X</Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={Styles.formcontainer}>
                          <Text
                            style={[
                              Styles.mandatoryLbl,
                              HelperFonts.mandatory_Regular,
                            ]}>
                            {I18n.t('common.mandatoryFields')}
                          </Text>

                          <View
                            style={[Styles.coloumncontainer3, Styles.formmt]}>
                            <View style={Styles.modalitem1}>
                              <Text style={[Styles.formLbl, Styles.formmt]}>
                                {I18n.t('common.converterReference')}:
                                <Text
                                  style={[
                                    Styles.mandatoryLbl,
                                    HelperFonts.mandatory_Regular,
                                  ]}>
                                  *
                                </Text>
                              </Text>
                            </View>
                            <View style={Styles.modalitem2}>
                              <Text style={[Styles.formLblnb, Styles.formmt]}>
                                {this.state.converterRef}
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={[
                              Styles.formLbl,
                              Styles.formmt,
                              Styles.formmb,
                            ]}>
                            {I18n.t('addCustomConverter.converterVolume')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <View style={Styles.rowrev}>
                            <RadioForm formHorizontal={true} animation={true}>
                              {this.state.converterVolumeList.map((obj, i) => {
                                var onPress = (value, index) => {
                                  this.volumeChanged(value, index);
                                };
                                return (
                                  <RadioButton labelHorizontal={true} key={i}>
                                    <RadioButtonInput
                                      obj={obj}
                                      index={i}
                                      isSelected={
                                        this.state.converterVolumeIndex === i
                                      }
                                      onPress={onPress}
                                      buttonInnerColor={'#1c3a69'}
                                      buttonOuterColor={
                                        this.state.converterVolumeIndex === i
                                          ? '#1c3a69'
                                          : '#1c3a69'
                                      }
                                      buttonSize={15}
                                      buttonStyle={{}}
                                      buttonWrapStyle={{marginLeft: 5}}
                                    />
                                    <RadioButtonLabel
                                      obj={obj}
                                      index={i}
                                      onPress={onPress}
                                      labelStyle={{
                                        color: '#000',
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

                          {!this.state.isCustom ? (
                            <View>
                              <Text style={[Styles.formLbl, Styles.formmt]}>
                                {I18n.t('common.lotName')}:{' '}
                                <Text
                                  style={[
                                    Styles.mandatoryLbl,
                                    HelperFonts.mandatory_Regular,
                                  ]}>
                                  *
                                </Text>
                              </Text>
                              <View style={Styles.inputTexts1}>
                                <CustomDropDown
                                  dropDownData={this.state.dropDownResponse}
                                  isRTL={
                                    global.languageID == '3' ? true : false
                                  }
                                  onValueChange={(itemValue, itemIndex) => {
                                    this.lotChanged(itemValue, itemIndex);
                                  }}
                                  selectedValue={
                                    this.state.pickerSelectedLotVal
                                  }
                                />
                              </View>
                            </View>
                          ) : (
                            <View
                              style={[Styles.coloumncontainer3, Styles.formmt]}>
                              <View style={Styles.modalitem1}>
                                <Text style={[Styles.formLbl, Styles.formmt]}>
                                  {I18n.t('common.lotName')}:{' '}
                                  <Text
                                    style={[
                                      Styles.mandatoryLbl,
                                      HelperFonts.mandatory_Regular,
                                    ]}>
                                    *
                                  </Text>
                                </Text>
                              </View>
                              <View style={Styles.modalitem2}>
                                <Text style={[Styles.formLblnb, Styles.formmt]}>
                                  {this.state.lotName}
                                </Text>
                              </View>
                            </View>
                          )}
                          <Text
                            style={[
                              Styles.formLbl,
                              Styles.formmt,
                              Styles.formmb,
                            ]}>
                            {I18n.t('common.quantity')}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <NumericInput
                            value={this.state.converterQuantity}
                            totalWidth={80}
                            minValue={0}
                            onChange={value => {
                              this.updateConverterQty(value);
                            }}
                            rightButtonBackgroundColor="#1c3a69"
                            leftButtonBackgroundColor="#1c3a69"
                            rounded
                            iconStyle={{color: 'white'}}
                          />

                          <Text style={[Styles.formLbl, Styles.formmt]}>
                            {I18n.t('addConverterToLot.Price')}{' '}
                            {'(In ' + this.state.lotCurrencySymbol + ' )'}:{' '}
                            <Text
                              style={[
                                Styles.mandatoryLbl,
                                HelperFonts.mandatory_Regular,
                              ]}>
                              *
                            </Text>
                          </Text>
                          <TextInput
                            style={Styles.textInput}
                            underlineColorAndroid="transparent"
                            onChangeText={converterUserValueText => {
                              this.priceChanged(converterUserValueText);
                            }}
                            value={this.state.converterUserValue}
                            keyboardType="decimal-pad"
                            maxLength={10}
                            placeholder={I18n.t('addConverterToLot.enterPrice')}
                          />

                          <View
                            style={[Styles.coloumncontainer3, Styles.formmt]}>
                            <View style={Styles.modalitem1}>
                              <Text style={[Styles.formLbl, Styles.formmt]}>
                                {I18n.t('addConverterToLot.totalPrice')}:{' '}
                                <Text
                                  style={[
                                    Styles.mandatoryLbl,
                                    HelperFonts.mandatory_Regular,
                                  ]}>
                                  *
                                </Text>
                              </Text>
                            </View>
                            <View style={Styles.modalitem2}>
                              <Text style={[Styles.formLblnb, Styles.formmt]}>
                                {this.state.converterTotalValue}
                              </Text>
                            </View>
                          </View>

                          <View style={[Styles.alignRight, Styles.formmt]}>
                            <Pressable
                              style={Styles.modalBtn}
                              onPress={() =>
                                this.localValidation_submitConverterToLot(false)
                              }>
                              <Text style={Styles.textStyleB}>
                                {I18n.t('addCustomConverter.addReturnSearch')}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={Styles.modalBtn}
                              onPress={() =>
                                this.localValidation_submitConverterToLot(true)
                              }>
                              <Text style={Styles.textStyleB}>
                                {I18n.t(
                                  'addCustomConverter.addReturnLotDetails',
                                )}
                              </Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={[Styles.alignRight, Styles.formcontainer]}>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showAddConverterToLot:
                                  !this.state.showAddConverterToLot,
                              });
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.cancel')}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showAlreadyExist}
                    onRequestClose={() => {
                      this.setState({
                        showAlreadyExist: !this.state.showAlreadyExist,
                      });
                    }}>
                    <View style={Styles.centeredView}>
                      <View style={Styles.modalView}>
                        <View
                          style={[
                            Styles.headingModalContainers,
                            Styles.modalbg,
                          ]}>
                          <View style={Styles.headingModalContainer}>
                            <Text style={Styles.headingModal}>
                              {I18n.t('alreadyExist.confirmation')}
                            </Text>
                          </View>
                          <View style={Styles.headingBtn}>
                            <Pressable
                              style={Styles.buttonClose1}
                              onPress={() => {
                                this.setState({
                                  showAlreadyExist:
                                    !this.state.showAlreadyExist,
                                });
                              }}>
                              <Text style={Styles.textStyle}>X</Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={Styles.formcontainer}>
                          <Text style={[Styles.bigfont, Styles.aligncenter]}>
                            {I18n.t('alreadyExist.alreadyExist')}
                          </Text>
                          <Text style={[Styles.aligncenter, Styles.Notebg]}>
                            {I18n.t('alreadyExist.note')}
                          </Text>
                        </View>

                        <View style={Styles.formcontainer}>
                          <View style={Styles.btnContainer2}>
                            <Pressable
                              style={[Styles.modalBtn, Styles.mrgR]}
                              onPress={() => {
                                this.updateConverterToLot();
                              }}>
                              <Text style={Styles.textStyleB}>
                                {I18n.t('deleteLot.yes')}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={Styles.modalBtn}
                              onPress={() => {
                                this.setState({
                                  showAlreadyExist:
                                    !this.state.showAlreadyExist,
                                });
                              }}>
                              <Text style={Styles.textStyleB}>
                                {I18n.t('deleteLot.no')}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                  {this.state.isTokenExpired == true && (
                    <View style={{height: height}}>
                      <Text style={Styles.formLcen}>
                        {this.state.zeroTokenMessage}
                      </Text>
                    </View>
                  )}

                  {this.state.showConverterList ? (
                    this.state.converterList.length == 0 ? (
                      <View style={{height: height}}>
                        <Text style={Styles.formLcen}>
                          {I18n.t('converterSearch.noRecord')}
                        </Text>
                      </View>
                    ) : (
                      <View style={Styles.coloumncontainer2}>
                        <Text style={Styles.lotHeader}>
                          {I18n.t('common.converterReference')}
                        </Text>
                        {!this.state.isDisplayList && (
                          <>
                            {Platform.OS == 'android' ? (
                              <FlatList
                                data={this.state.converterList}
                                renderItem={(item, index) =>
                                  this.MainFunction(item, index)
                                }
                              />
                            ) : (
                              <FlatList
                                style={{flex: 0}}
                                data={this.state.converterList}
                                initialNumToRender={
                                  this.state.converterList.length
                                }
                                renderItem={(item, index) =>
                                  this.MainFunction(item, index)
                                }
                              />
                            )}
                          </>
                        )}
                      </View>
                    )
                  ) : (
                    <View style={{height: height}}></View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
          </SafeAreaProvider>
        ) : (
          <View style={{backgroundColor: '#1c3a69', height: '50%'}}>
            {this.state.imageModalActive && (
              <View style={{flex: 1}}>
                <ImageSlider
                  imageArr={this.state.sliderImagesData}
                  extraMethodCall={() => this.onClickImage(false)}
                  displayImageTitleName={this.state.displayImageTitleName}
                />
              </View>
            )}
          </View>
        )}
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
