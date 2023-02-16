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
import Accordion from 'react-native-collapsible/Accordion';
import {formatNumber} from 'react-native-currency-input';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Toast from 'react-native-simple-toast';
import {Rows, Table} from 'react-native-table-component';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomDropDown from '../../components/CustomDropDown';
import CustomFunctions from '../../components/CustomFunctions';
import PriceInput from '../../components/PriceInput';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Shopping extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,

      filtersList: [
        {label: I18n.t('common.all'), value: 0},
        {label: I18n.t('shoppingBaskets.active'), value: 1},
        {label: I18n.t('shoppingBaskets.inactive'), value: 2},
      ],
      radioSelectedFilterVal: 0,
      filterIndex: 0,

      showLotList: false,

      masterLotList: [],
      lotList: [],
      activeLots: [],

      showCreateNewBasket: false,

      currencyList: [],

      lotName: '',

      marginTypesList: [
        {label: I18n.t('common.percentage'), value: true},
        {label: I18n.t('common.absolutelyCurrency'), value: false},
      ],
      radioSelectedMarginTypeVal: true,
      marginTypeIndex: 0,

      lotMargin: '0',

      pickerSelectedCurrencyVal: 0,

      showViewLot: false,
      viewLot: {},

      showEditLot: false,

      editLotMasterID: 0,
      editLotName: '',

      editMarginTypesList: [
        {label: I18n.t('common.percentage'), value: true},
        {label: I18n.t('common.absolutelyCurrency'), value: false},
      ],
      editRadioSelectedMarginTypeVal: false,
      editMarginTypeIndex: 0,

      editLotMargin: 0,

      editPickerSelectedCurrencyVal: 0,

      showDeleteLot: false,
      deleteLotID: 0,
      isDotActive: true,
      dropDownResponse: [],
      lotID: 0,
      previousLotMargin: 0,
      previousLotType: 0,
      saveWithRefreshModal: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.navFocusListener = navigation.addListener('didFocus', () => {
      this.getLotList(0);
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.navFocusListener.remove();
  }

  handleBackPress = () => {
    this.props.navigation.replace('home');
    return true;
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

  async getLotList(filterID) {
    let status = await CustomFunctions.getCurrncyStatus();
    WebMethods.getRequestWithHeader(WebUrls.url.getLotListPageDefaults).then(
      response => {
        let allData = response && response.data && response.data.lotList;
        let newConversion = allData.map((item, index) => {
          return {
            ...item,
            lot_Value: this.commanFunctionForDisplayCurrncy(
              status,
              item.lot_Value,
            ),
            lotMargin: this.commanFunctionForDisplayCurrncy(
              status,
              item.marginValue,
            ),
          };
        });
        this.setState({
          masterLotList: newConversion,
          lotList: newConversion,
          currencyList: response.data.currencyList,
          showLotList: true,
          loaderVisible: false,
          isDotActive: status,
        });
        this.setDropDownResponse(response.data.currencyList);
        this.filterLotList(filterID, filterID);
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

  filterLotList = (value, index) => {
    this.setState({radioSelectedFilterVal: value, filterIndex: index});
    var list =
      value == 0
        ? this.state.masterLotList
        : value == 1
        ? this.state.masterLotList.filter(item => item.isActive)
        : this.state.masterLotList.filter(item => !item.isActive);
    this.setState({lotList: list, activeLots: []});
  };

  localValidation_Create = () => {
    this.setState({loaderVisible: true});

    if (this.state.lotName == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterLotName'), Toast.SHORT);
    } else if (this.state.lotMargin == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterLotMargin'), Toast.SHORT);
    } else if (this.state.pickerSelectedCurrencyVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCurrency'), Toast.SHORT);
    } else {
      this.createNewBasket();
    }
  };

  localValidation_Edit = () => {
    this.setState({loaderVisible: true});

    if (this.state.editLotName == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterLotName'), Toast.SHORT);
    } else if (this.state.editLotMargin == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterLotMargin'), Toast.SHORT);
    } else if (this.state.editPickerSelectedCurrencyVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseSelectCurrency'), Toast.SHORT);
    } else {
      this.updateLot();
    }
  };

  showCreateNewBasket = () => {
    this.setState({
      lotName: '',
      radioSelectedFilterVal: 0,
      filterIndex: 0,
      lotMargin: '',
      pickerSelectedCurrencyVal: 0,

      showCreateNewBasket: true,
    });
  };

  createNewBasket = () => {
    var params = {
      lotName: this.state.lotName,
      marginType: this.state.radioSelectedMarginTypeVal,
      marginValue: this.state.lotMargin,
      currencyID: this.state.pickerSelectedCurrencyVal,
    };

    WebMethods.postRequestWithHeader(WebUrls.url.submitLot, params).then(
      response => {
        if (response.data.status) {
          this.setState({
            masterLotList: response.data.lotList,
            lotList: response.data.lotList,
            radioSelectedFilterVal: 0,
            filterIndex: 0,
            showCreateNewBasket: false,

            loaderVisible: false,
          });
          Toast.show(
            I18n.t('tostMessages.newLotCreatedSuccessfully'),
            Toast.SHORT,
          );
        } else {
          this.setState({loaderVisible: false});
          Toast.show(I18n.t('tostMessages.faildToCreateNewLot'), Toast.SHORT);
        }
      },
    );
  };

  viewLot = lot => {
    lot.marginValue = this.commanFunctionForDisplayCurrncy(
      this.state.isDotActive,
      this.convertValueIntoSimpleNumber(lot.marginValue),
    );
    this.setState({
      showViewLot: true,
      showEditLot: false,

      viewLot: lot,
    });
  };

  editLot = () => {
    if (this.state.showEditLot) {
      this.localValidation_Edit();
    } else {
      this.setState({
        showEditLot: true,
        editLotMasterID: this.state.viewLot.lotMasterID,
        editLotName: this.state.viewLot.lotName,
        editRadioSelectedMarginTypeVal: this.state.viewLot.marginType,
        editMarginTypeIndex: this.state.viewLot.marginType ? 0 : 1,
        editLotMargin: this.convertValueIntoSimpleNumber(
          this.state.viewLot.marginValue,
        ).toFixed(2),
        // editLotMargin: this.state.viewLot.marginValue,
        editPickerSelectedCurrencyVal: this.state.viewLot.currencyID,
        previousLotMargin: this.convertValueIntoSimpleNumber(
          this.state.viewLot.marginValue,
        ).toFixed(2),
        previousLotType: this.state.viewLot.marginType,
      });
    }
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

  updateLot = () => {
    const {
      editLotMargin,
      editMarginTypeIndex,
      previousLotMargin,
      previousLotType,
      editRadioSelectedMarginTypeVal,
    } = this.state;
    if (
      editLotMargin == previousLotMargin &&
      editRadioSelectedMarginTypeVal === previousLotType
    ) {
      this.normalSave();
    } else {
      this.setState({
        showViewLot: !this.state.showViewLot,
        loaderVisible: false,
        saveWithRefreshModal: true,
      });
    }
  };

  normalSave = status => {
    var params = {
      lotMasterID: this.state.editLotMasterID,
      lotName: this.state.editLotName,
      marginType: this.state.editRadioSelectedMarginTypeVal,
      marginValue: this.state.editLotMargin,
      currencyID: this.state.editPickerSelectedCurrencyVal,
    };
    WebMethods.postRequestWithHeader(WebUrls.url.submitLot, params).then(
      response => {
        if (response.data.status) {
          if (status == true) {
            this.updateLotPrices();
          }
          this.setState({
            masterLotList: response.data.lotList,
            lotList: response.data.lotList,
            showEditLot: false,
            showViewLot: false,
            loaderVisible: false,
            saveWithRefreshModal: false,
          });
          Toast.show(
            I18n.t('tostMessages.lotUpdatedSuccessfully'),
            Toast.SHORT,
          );
        } else {
          this.setState({loaderVisible: false});
          Toast.show(I18n.t('tostMessages.failedtoUdpateLot'), Toast.SHORT);
        }
      },
    );
  };

  delete = lot => {
    this.setState({
      deleteLotID: lot.lotMasterID,
      showDeleteLot: true,
    });
  };

  deleteLot = () => {
    this.setState({loaderVisible: true});

    WebMethods.postRequestWithHeader(
      WebUrls.url.deleteLot + '?lotMasterID=' + this.state.deleteLotID,
    ).then(response => {
      if (response.data) {
        this.setState({
          masterLotList: response.data.lotList,
          lotList: response.data.lotList,
          deleteLotID: 0,
          showDeleteLot: false,

          loaderVisible: false,
        });
        Toast.show(I18n.t('tostMessages.lotDeletedSuccessfully'), Toast.SHORT);
      } else {
        this.setState({
          deleteLotID: 0,
          showDeleteLot: false,

          loaderVisible: false,
        });
        Toast.show(I18n.t('tostMessages.failedToDeleteLot'), Toast.SHORT);
      }
    });
  };

  async returnData(data) {
    this.getLotList(data.filterID);
  }

  editLotDetails(lot) {
    var parseData = {
      from: 'shopping',
      lotID: lot.lotMasterID,
      filterID: this.state.radioSelectedFilterVal,
      returnData: this.returnData.bind(this),
    };
    this.setState({lotID: lot.lotMasterID});

    this.props.navigation.navigate('editlot', {
      lotID: lot.lotMasterID,
      from: 'shopping',
    });
  }

  renderHeader = lot => {
    let index = this.state.activeLots[0];
    let currentObj = this.state.lotList[index];
    return (
      <View>
        <View style={Styles.headers}>
          <FastImage
            style={{height: 20, width: 20, marginTop: 5}}
            source={currentObj == lot ? R.images.up : R.images.down}
            resizeMode={FastImage.resizeMode.contain}
          />

          <Text style={Styles.headersText}>&nbsp; {lot.lotName}</Text>
        </View>
      </View>
    );
  };

  renderContent = lot => {
    let tableData = [
      [
        I18n.t('common.totalLotValue'),
        lot.lot_Value + ' ' + lot.currencySymbol,
      ],
      [I18n.t('shoppingBaskets.convertertypes'), lot.converter_Types],
      [I18n.t('common.totalNoConverters'), lot.total_Converters],
      [
        I18n.t('common.status'),
        lot.isActive
          ? I18n.t('shoppingBaskets.active')
          : I18n.t('shoppingBaskets.inactive'),
      ],
    ];
    return (
      <View style={Styles.content}>
        <Table>
          <Rows
            data={tableData}
            textStyle={Styles.tabletext}
            style={Styles.tabletext}
          />
          <View style={Styles.btnContainer1}>
            <Pressable
              onPress={() => {
                this.editLotDetails(lot);
              }}
              style={Styles.blubtn2}>
              <FastImage
                source={R.images.edit}
                style={{width: 20, height: 20}}
                resizeMode={FastImage.resizeMode.contain}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                this.viewLot(lot);
              }}
              style={Styles.blubtn2}>
              <FastImage
                source={R.images.view}
                style={{width: 20, height: 20}}
                resizeMode={FastImage.resizeMode.contain}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                this.delete(lot);
              }}
              style={Styles.blubtn2}>
              <FastImage
                source={R.images.delete}
                style={{width: 20, height: 20}}
                resizeMode={FastImage.resizeMode.contain}
              />
            </Pressable>
          </View>
        </Table>
      </View>
    );
  };

  updateSections = activeLots => {
    this.setState({activeLots});
  };

  marginMethod = e => {
    this.setState({lotMargin: e == null ? 0 : e});
  };

  detailMarginMethod = e => {
    this.setState({editLotMargin: e == null ? 0 : e});
  };

  updateLotPrices = () => {
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateLotPrices + '?LotID=' + this.state.editLotMasterID,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false, saveWithRefreshModal: false});
      } else {
        this.setState({loaderVisible: false, saveWithRefreshModal: false});
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
                  <View style={[Styles.item1]}>
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
                        &nbsp; {I18n.t('shoppingBaskets.lots')}
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
                            {I18n.t('shoppingBaskets.lots')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={Styles.item2}>
                    <View style={Styles.textContainer}>
                      <Text style={Styles.headingBalance}>
                        <TouchableOpacity
                          style={Styles.blubtn}
                          onPress={() => this.showCreateNewBasket()}>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('common.createNewBasket')}
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={Styles.coloumncontainer1}>
                  <View style={Styles.boxcontainer}>
                    <Text style={[Styles.formLbl, Styles.formmb]}>
                      {I18n.t('common.status')}
                    </Text>
                    <View style={Styles.rowrev}>
                      <RadioForm formHorizontal={true} animation={true}>
                        {this.state.filtersList.map((obj, i) => {
                          var onPress = (value, index) => {
                            this.filterLotList(value, index);
                          };
                          return (
                            <RadioButton labelHorizontal={true} key={i}>
                              <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={this.state.filterIndex === i}
                                onPress={onPress}
                                buttonInnerColor={'#1c3a69'}
                                buttonOuterColor={
                                  this.state.filterIndex === i
                                    ? '#1c3a69'
                                    : '#1c3a69'
                                }
                                buttonSize={15}
                                buttonStyle={{}}
                                buttonWrapStyle={{marginLeft: 0}}
                              />
                              <RadioButtonLabel
                                obj={obj}
                                index={i}
                                onPress={onPress}
                                labelStyle={{
                                  color: '#000',
                                  marginLeft: 10,
                                  fontFamily: 'SemplicitaPro-Regular',
                                  marginRight: 30,
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
                {this.state.showLotList ? (
                  <View style={Styles.coloumncontainer3}>
                    <Text style={Styles.lotHeader}>
                      {I18n.t('common.lotName')}
                    </Text>
                    <Accordion
                      sections={this.state.lotList}
                      activeSections={this.state.activeLots}
                      renderHeader={this.renderHeader}
                      renderContent={this.renderContent}
                      onChange={this.updateSections}
                      duration={500}
                      underlayColor="#fff"
                    />
                  </View>
                ) : null}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showCreateNewBasket}
                  onRequestClose={() => {
                    this.setState({
                      showCreateNewBasket: !this.state.showCreateNewBasket,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View style={[Styles.coloumncontainer, Styles.modalbg]}>
                        <View>
                          <Text style={Styles.headingModal}>
                            {I18n.t('common.createNewBasket')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
                            onPress={() => {
                              this.setState({
                                showCreateNewBasket:
                                  !this.state.showCreateNewBasket,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <Text
                        style={[
                          Styles.mandatoryLbl,
                          HelperFonts.mandatory_Regular,
                        ]}>
                        {I18n.t('common.mandatoryFields')}
                      </Text>

                      <View style={Styles.formcontainer}>
                        <Text style={Styles.formLbl}>
                          {I18n.t('common.lotName')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <TextInput
                          style={Styles.textInput}
                          underlineColorAndroid="transparent"
                          onChangeText={lotNameText =>
                            this.setState({lotName: lotNameText})
                          }
                          value={this.state.lotName}
                          keyboardType="default"
                          maxLength={50}
                          placeholder={I18n.t('createNewBasket.enterLotName')}
                        />

                        <Text style={[Styles.formLbl, Styles.formmt]}>
                          {I18n.t('common.margin')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <View style={Styles.rowrev}>
                          <RadioForm formHorizontal={true} animation={true}>
                            {this.state.marginTypesList.map((obj, i) => {
                              var onPress = (value, index) => {
                                this.setState({
                                  radioSelectedMarginTypeVal: value,
                                  marginTypeIndex: index,
                                });
                              };
                              return (
                                <RadioButton labelHorizontal={true} key={i}>
                                  <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={
                                      this.state.marginTypeIndex === i
                                    }
                                    onPress={onPress}
                                    buttonInnerColor={'#1c3a69'}
                                    buttonOuterColor={
                                      this.state.marginTypeIndex === i
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
                        {/* 
                        <PriceInput
                          style={[
                            Styles.textInput,
                            Styles.formmt,
                            HelperFonts.font_B_Regular,
                          ]}
                          precision={2}
                          maxLength={10}
                          placeholder={I18n.t('common.entermargin')}
                          keyboardType={'decimal-pad'}
                          setValue={this.marginMethod}
                          value={`${this.state.lotMargin}`}
                          delimiter={true ? ',' : '.'}
                          separator={true ? '.' : ','}
                        isRTL={global.languageID == "3" ? false : true}
                        /> */}
                        <TextInput
                          style={[
                            Styles.textInput,
                            Styles.formmt,
                            HelperFonts.font_B_Regular,
                          ]}
                          placeholder={I18n.t('common.entermargin')}
                          maxLength={10}
                          keyboardType={'decimal-pad'}
                          onChangeText={e => this.setState({lotMargin: e})}
                          value={`${this.state.lotMargin}`}
                        />

                        <Text style={[Styles.formLbl, Styles.formmt]}>
                          {I18n.t('common.currency')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <View style={Styles.inputTexts}>
                          <CustomDropDown
                            dropDownData={this.state.dropDownResponse}
                            isRTL={global.languageID == '3' ? true : false}
                            onValueChange={(itemValue, itemIndex) => {
                              this.setState({
                                pickerSelectedCurrencyVal:
                                  itemValue.currencyConversionChartID,
                              });
                            }}
                            selectedValue={this.state.pickerSelectedCurrencyVal}
                            placeholder={I18n.t('common.selectcurrency')}
                          />
                        </View>

                        <View style={[Styles.btnContainer, Styles.mgrT15]}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => this.localValidation_Create()}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.save')}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showCreateNewBasket:
                                  !this.state.showCreateNewBasket,
                              });
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.cancel')}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showViewLot}
                  onRequestClose={() => {
                    this.setState({showViewLot: !this.state.showViewLot});
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View style={[Styles.coloumncontainer, Styles.modalbg]}>
                        <View>
                          <Text style={Styles.headingModal}>
                            {!this.state.showEditLot
                              ? I18n.t('viewLot.viewLot')
                              : I18n.t('editLot.editLot')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
                            onPress={() => {
                              this.setState({
                                showViewLot: !this.state.showViewLot,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcont}>
                        <Text style={[Styles.formLbll, Styles.formmt]}>
                          {I18n.t('common.lotName')}:
                        </Text>
                        {!this.state.showEditLot ? (
                          <Text style={[Styles.formLblr, Styles.formmt]}>
                            {this.state.viewLot.lotName}
                          </Text>
                        ) : null}
                      </View>
                      {this.state.showEditLot ? (
                        <View style={Styles.formcontainer}>
                          <TextInput
                            style={Styles.textInput}
                            underlineColorAndroid="transparent"
                            onChangeText={editLotNameText =>
                              this.setState({editLotName: editLotNameText})
                            }
                            value={this.state.editLotName}
                            keyboardType="default"
                            maxLength={50}
                            placeholder={I18n.t('createNewBasket.enterLotName')}
                          />
                        </View>
                      ) : null}

                      <View style={Styles.formcont}>
                        <Text style={[Styles.formLbll, Styles.formmt]}>
                          {I18n.t('common.margin')}:
                        </Text>
                        {!this.state.showEditLot ? (
                          <Text style={[Styles.formLblr, Styles.formmt]}>
                            {this.state.viewLot.marginType
                              ? I18n.t('common.percentage')
                              : I18n.t('common.absolutelyCurrency')}
                          </Text>
                        ) : null}
                      </View>
                      {this.state.showEditLot ? (
                        <View style={Styles.rowrev}>
                          <RadioForm formHorizontal={true} animation={true}>
                            {this.state.marginTypesList.map((obj, i) => {
                              var onPress = (value, index) => {
                                this.setState({
                                  editRadioSelectedMarginTypeVal: value,
                                  editMarginTypeIndex: index,
                                });
                              };
                              return (
                                <RadioButton labelHorizontal={true} key={i}>
                                  <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={
                                      this.state.editMarginTypeIndex === i
                                    }
                                    onPress={onPress}
                                    buttonInnerColor={'#1c3a69'}
                                    buttonOuterColor={
                                      this.state.editMarginTypeIndex === i
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
                      ) : null}

                      <View style={Styles.formcont}>
                        <Text style={[Styles.formLbll, Styles.formmt]}>
                          {I18n.t('common.percentage')}:
                        </Text>
                        {!this.state.showEditLot && (
                          <Text style={[Styles.formLblr, Styles.formmt]}>
                            {`${this.state.viewLot.marginValue}`}
                          </Text>
                        )}
                      </View>
                      {this.state.showEditLot ? (
                        <View style={Styles.formcontainer}>
                          {/* <PriceInput
                            style={Styles.textInput}
                            precision={2}
                            maxLength={10}
                            placeholder={I18n.t('common.entermargin')}
                            keyboardType={'decimal-pad'}
                            setValue={this.detailMarginMethod}
                            value={this.state.editLotMargin}
                            delimiter={true ? ',' : '.'}
                        isRTL={global.languageID == "3" ? false : true}
                            separator={true ? '.' : ','}
                          /> */}
                          <TextInput
                            style={Styles.textInput}
                            placeholder={I18n.t('common.entermargin')}
                            maxLength={20}
                            keyboardType={'decimal-pad'}
                            onChangeText={e =>
                              this.setState({editLotMargin: e})
                            }
                            value={`${this.state.editLotMargin}`}
                          />
                        </View>
                      ) : null}

                      <View style={Styles.formcont}>
                        <Text style={[Styles.formLbll, Styles.formmt]}>
                          {I18n.t('common.currency')}:
                        </Text>
                        <Text style={[Styles.formLblr, Styles.formmt]}>
                          {this.state.viewLot.currencyName +
                            ' (' +
                            this.state.viewLot.currencySymbol +
                            ')'}
                        </Text>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.btnContainer}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.editLot();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {this.state.showEditLot
                                ? I18n.t('common.save')
                                : I18n.t('viewLot.edit')}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showViewLot: !this.state.showViewLot,
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

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showDeleteLot}
                  onRequestClose={() => {
                    this.setState({showDeleteLot: !this.state.showDeleteLot});
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View style={[Styles.coloumncontainer, Styles.modalbg]}>
                        <View>
                          <Text style={Styles.headingModal}>
                            {I18n.t('deleteLot.deleteLot')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
                            onPress={() => {
                              this.setState({
                                showDeleteLot: !this.state.showDeleteLot,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcontainer}>
                        <Text style={[Styles.bigfont, Styles.alignleft]}>
                          {I18n.t('deleteLot.areYouSure')}
                        </Text>
                        <Text style={Styles.alignleft}>
                          {I18n.t('deleteLot.reallyWantDeleteLot')}
                        </Text>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.btnContainer}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.deleteLot();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {' '}
                              {I18n.t('deleteLot.yes')}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.setState({
                                showDeleteLot: !this.state.showDeleteLot,
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

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.saveWithRefreshModal}
                  onRequestClose={() => {
                    this.setState({
                      saveWithRefreshModal: !this.state.saveWithRefreshModal,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View style={[Styles.coloumncontainer, Styles.modalbg]}>
                        <View>
                          <Text style={Styles.headingModal}>
                            {I18n.t('shoppingBaskets.updateTitle')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
                            onPress={() => {
                              this.setState({
                                saveWithRefreshModal:
                                  !this.state.saveWithRefreshModal,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcontainer}>
                        {/* <Text style={[Styles.bigfont, Styles.alignleft]}>
                          {I18n.t('shoppingBaskets.updateWarning')}
                        </Text> */}
                        <Text style={Styles.alignleft}>
                          {I18n.t('shoppingBaskets.updateWarning')}
                        </Text>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.btnContainer}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.normalSave(true);
                            }}>
                            <Text style={Styles.textStyleB}>
                              {' '}
                              {I18n.t('deleteLot.yes')}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => {
                              this.normalSave(false);
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
