import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
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
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import RNFetchBlob from 'rn-fetch-blob';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
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

export default class Editlot extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
    var lot = this.props.navigation.getParam('lotID');
    this.state = {
      loaderVisible: true,

      lotID: lot,
      lotName: '',

      lotConverterList: [],
      lotConverters: [],

      lotCurrencySymbol: '',
      lotStatus: false,

      totalLotConverters: 0,
      totalLotValue: 0,
      avarageConverterValue: 0,

      showCreateLotOverview: false,

      exportTypeList: [
        {label: I18n.t('common.exportToExcel'), value: true},
        {label: I18n.t('common.exportToPDF'), value: false},
      ],
      radioSelectedExportTypeVal: true,
      exportTypeIndex: 0,

      emailID: '',

      tableHead: [
        I18n.t('lotDetails.reference'),
        I18n.t('common.volume'),
        I18n.t('lotDetails.qty'),
        I18n.t('lotDetails.value'),
        I18n.t('lotDetails.action'),
      ],
      isEdit: false,
      qtyTextInput: [],
      valuesTextInput: [],

      showAddCustomConverter: false,

      customConverterID: 0,
      customLotMasterID: 0,
      customConverterRef: '',

      converterVolumeList: [
        {label: '25%', value: 1},
        {label: '50%', value: 2},
        {label: '75%', value: 3},
        {label: '100%', value: 4},
      ],
      radioSelectedConverterVolumeVal: 4,
      converterVolumeIndex: 3,

      customConverterValue: 0,
      customConverterQuantity: 0,

      showDeleteConverter: false,
      deleteConverterID: 0,
      isDotActive: true,
      clickedStatus: false,
      downlodedImage: '',
    };
  }

  handleBackPress() {
    this.props.navigation.navigate('shopping');
    return true;
  }
  async componentDidMount() {
    const {navigation} = this.props;
    this.navFocusListener = navigation.addListener('didFocus', () => {
      this.getLotDetails();
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    let status = await CustomFunctions.getCurrncyStatus();
  }

  setDeafaultCurrncyValuesForComma(passingPrice, precision = 2) {
    const formattedValue = formatNumber(passingPrice, {
      separator: '.',
      precision: precision,
      delimiter: ',',
    });
    return formattedValue;
  }

  setDeafaultCurrncyValuesForDot(passingPrice, precision = 2) {
    const formattedValue = formatNumber(passingPrice, {
      separator: ',',
      precision: precision,
      delimiter: '.',
    });
    return formattedValue;
  }

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

  getLotDetails = async () => {
    let status = await CustomFunctions.getCurrncyStatus();
    const endPoint = `${WebUrls.url.getLotDetails}?lotID=${this.state.lotID}`;
    WebMethods.getRequestWithHeader(endPoint).then(response => {
      this.setState({
        lotName: response.data.lotDetails.lotName,
        lotConverterList: response.data.converterList,
        totalLotConverters: response.data.lotDetails.total_Converters,
        totalLotValue:
          this.commanFunctionForDisplayCurrncy(
            status,
            response.data.lotDetails.lot_Value,
          ) + response.data.lotDetails.currencySymbol,
        avarageConverterValue:
          this.commanFunctionForDisplayCurrncy(
            status,
            response.data.averageConverterValue,
          ) + response.data.lotDetails.currencySymbol,
        lotCurrencySymbol: response.data.lotDetails.currencySymbol,
        lotStatus: response.data.lotDetails.isActive,
        tableHead: [
          I18n.t('lotDetails.reference'),
          I18n.t('common.volume'),
          I18n.t('lotDetails.qty'),
          I18n.t('lotDetails.value') +
            ' ' +
            response.data.lotDetails.currencySymbol,
          I18n.t('lotDetails.action'),
        ],
        loaderVisible: false,
      });
      this.renderRows(response && response.data && response.data.converterList);
    });
  };

  editLotConverters = () => {
    if (this.state.lotConverterList.length > 0) {
      this.setState({isEdit: !this.state.isEdit});

      if (this.state.isEdit) {
        this.setState({loaderVisible: true});
        this.saveLotConverters();
      }
    } else {
      Toast.show(
        I18n.t('tostMessages.addAtleastOneConverterToLot'),
        Toast.SHORT,
      );
    }
  };

  calculateRecentResponse = () => {
    const {lotConverterList} = this.state;
    let arr = lotConverterList.map((item, index) =>
      Number(item.converterQuantity),
    );
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    const ans = arrSum(arr);
    this.setState({totalLotConverters: ans});
  };

  saveLotConverters = () => {
    WebMethods.postRequestWithHeader(
      WebUrls.url.saveLotConverters,
      this.state.lotConverterList,
    ).then(response => {
      if (response.data != null) {
        this.setState({
          loaderVisible: false,
          totalLotConverters: response.data.lotDetails.total_Converters,
          totalLotValue:
            response.data.lotDetails.lot_Value +
            ' ' +
            response.data.lotDetails.currencySymbol,
          avarageConverterValue:
            response.data.averageConverterValue +
            ' ' +
            response.data.lotDetails.currencySymbol,
        });
        Toast.show(
          I18n.t('tostMessages.recordsSavedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToSaveRecords'), Toast.SHORT);
      }
    });
  };

  changeLotStatus = () => {
    WebMethods.postRequestWithHeader(
      WebUrls.url.changeLotStatus +
        '?LotID=' +
        this.state.lotID +
        '&LotStatus=' +
        !this.state.lotStatus,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false, lotStatus: !this.state.lotStatus});
        Toast.show(
          I18n.t('tostMessages.lotStatusUpdatedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToUpdateLotStatus'), Toast.SHORT);
      }
    });
  };

  updateLotPrices = () => {
    this.setState({loaderVisible: true, clickedStatus: true});
    WebMethods.postRequestWithHeader(
      WebUrls.url.updateLotPrices + '?LotID=' + this.state.lotID,
    ).then(response => {
      if (response.data) {
        Toast.show(
          I18n.t('tostMessages.lotPricesUpdatedSuccessfully'),
          Toast.SHORT,
        );
        this.setState({loaderVisible: false});
        setTimeout(() => {
          this.setState({clickedStatus: false});
        }, 3000);
      } else {
        Toast.show(I18n.t('tostMessages.failedToUpdateLotPrices'), Toast.SHORT);
        this.setState({loaderVisible: false});
        setTimeout(() => {
          this.setState({clickedStatus: false});
        }, 3000);
      }
    });
  };

  viewConverterDetails = index => {
    if (this.state.lotConverterList[index].isCustomConverter) {
      const endPoint =
        WebUrls.url.getCustomConverterDetails +
        '?lotID=' +
        this.state.lotID +
        '&customConverterID=' +
        this.state.lotConverterList[index].converterID;
      WebMethods.getRequestWithHeader(endPoint).then(response => {
        if (response.success) {
          this.setState({
            customConverterID: response.data.customConverterID,
            customLotMasterID: response.data.lotMasterID,
            customConverterRef: response.data.converterRefNo,
            radioSelectedConverterVolumeVal: response.data.converterVolumeID,
            converterVolumeIndex: response.data.converterVolumeID - 1,
            customConverterValue: response.data.converterValue.toString(),
            customConverterQuantity: response.data.converterQuantity,
            showAddCustomConverter: true,
          });
        }
      });
    } else {
      this.props.navigation.navigate('converterdetails', {
        converterID: this.state.lotConverterList[index].converterID,
        isFromSearch: false,
        lotID: this.state.lotID,
      });
    }
  };

  localValidation_saveCustomConverter = () => {
    this.setState({loaderVisible: true});

    if (this.state.customConverterRef == 0) {
      this.setState({loaderVisible: false});
      Toast.show(
        I18n.t('tostMessages.pleaseEnterConverterReference'),
        Toast.SHORT,
      );
    } else if (this.state.radioSelectedConverterVolumeVal == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.selectConverterVolume'), Toast.SHORT);
    } else if (this.state.customConverterValue == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterConverterValue'), Toast.SHORT);
    } else if (this.state.customConverterQuantity == 0) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.addMinOneConverterQty'), Toast.SHORT);
    } else {
      this.saveCustomConverter();
    }
  };

  saveCustomConverter = () => {
    var params = {
      customConverterID: this.state.customConverterID,
      lotMasterID: this.state.customLotMasterID,
      converterRefNo: this.state.customConverterRef,
      converterVolumeID: this.state.radioSelectedConverterVolumeVal,
      converterQuantity: this.state.customConverterQuantity,
      converterValue: this.state.customConverterValue,
      converterTotalValue:
        this.state.customConverterQuantity * this.state.customConverterValue,
    };
    WebMethods.postRequestWithHeader(
      WebUrls.url.saveCustomConverter,
      params,
    ).then(response => {
      if (response.success) {
        this.setState({
          loaderVisible: false,
          showAddCustomConverter: false,
          customConverterID: 0,
          customLotMasterID: 0,
          customConverterRef: '',
          radioSelectedConverterVolumeVal: 4,
          converterVolumeIndex: 3,
          customConverterValue: 0,
          customConverterQuantity: 0,
          lotConverterList: response.data,
        });
        this.getLotDetails();
        Toast.show(
          I18n.t('tostMessages.customConverterSavedSuccessfully'),
          Toast.SHORT,
        );
      } else {
        this.setState({loaderVisible: false});
        Toast.show(
          I18n.t('tostMessages.failedToSaveCustomConverter'),
          Toast.SHORT,
        );
      }
    });
  };

  delete = index => {
    this.setState({
      deleteConverterID: index,
      showDeleteConverter: true,
    });
  };

  async deleteConverter() {
    let allLotData = [...this.state.lotConverterList];
    let foundID = this.state.deleteConverterID;
    if (this.state.lotConverterList == null) {
      return;
    }
    this.setState({loaderVisible: true});
    var params = {
      lotMasterID: allLotData[foundID].lotMasterID,
      lotDetailsID: allLotData[foundID].lotDetailsID,
      converterID: allLotData[foundID].converterID,
      isCustomConverter: allLotData[foundID].isCustomConverter,
    };
    allLotData[foundID].isRemoved = true;
    this.setState({lotConverterList: [...allLotData]});
    WebMethods.postRequestWithHeader(
      WebUrls.url.deleteLotConverters,
      params,
    ).then(response => {
      if (response.success) {
        this.setState({
          lotConverterList: [...response.data],
          showDeleteConverter: false,
          deleteConverterID: 0,
          loaderVisible: false,
        });
        this.forceUpdate();
        Toast.show(I18n.t('tostMessages.lotConverterDeleted'), Toast.SHORT);
        this.getLotDetails();
      } else {
        this.setState({
          loaderVisible: false,
          showDeleteConverter: false,
          deleteConverterID: 0,
        });
        Toast.show(
          I18n.t('tostMessages.failedToDeleteLotConverter'),
          Toast.SHORT,
        );
      }
    });
  }

  localValidation_sendEmail = () => {
    this.setState({loaderVisible: true});
    if (this.state.emailID == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.pleaseEnterEmailID'), Toast.SHORT);
    } else if (this.state.exportTypeIndex == -1) {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.selectExportType'), Toast.SHORT);
    } else {
      this.sendEmail();
    }
  };

  sendEmail = () => {
    WebMethods.postRequestWithHeader(
      WebUrls.url.sendLotSummary +
        '?lotID=' +
        this.state.lotID +
        '&formatType=' +
        this.state.radioSelectedExportTypeVal +
        '&emailID=' +
        this.state.emailID,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.emailSentSuccessfully'), Toast.SHORT);
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToSendEmail'), Toast.SHORT);
      }
    });
  };

  setTimeout = () => {
    RNFetchBlob.ios.previewDocument('file://' + res.path());
    RNFetchBlob.ios.openDocument(res.data);
  };

  download = async fileUrl => {
    var date = new Date();
    const {
      dirs: {DownloadDir, DocumentDir},
    } = RNFetchBlob.fs;
    const {config} = RNFetchBlob;
    const isIOS = Platform.OS == 'ios';
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    const isCheck = fileUrl.slice(-4);
    let fPath = '';
    if (isCheck == 'xlsx') {
      fPath = `${aPath}/${Math.floor(
        date.getTime() + date.getSeconds() / 2,
      )}.xlsx`;
    } else {
      fPath = `${aPath}/${Math.floor(
        date.getTime() + date.getSeconds() / 2,
      )}.pdf`;
    }
    this.setState({loaderVisible: true, showCreateLotOverview: false});

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
      },

      android: {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fPath,
          description: 'Downloading ...',
        },
      },
    });

    if (isIOS) {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          this.setState({overLoader: false});
          setTimeout(() => {
            const foundPath = res.data;
            const nextPath = `file://${res.path()}`;
            RNFetchBlob.ios.previewDocument(nextPath);
            Toast.show(
              I18n.t('tostMessages.fileDownloadSuccessfully'),
              Toast.SHORT,
            );
            this.setState({loaderVisible: false});
          }, 300);
        })
        .catch(errorMessage => {
          this.setState({overLoader: false});
          this.setState({loaderVisible: false});
          Toast.show(errorMessage, 2000);
        });
    } else {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          RNFetchBlob.android.actionViewIntent(res.path());
          this.setState({overLoader: false});
          this.setState({loaderVisible: false});
          Toast.show(I18n.t('tostMessages.fileDownloadSuccessfully'), 2000);
        })
        .catch((errorMessage, statusCode) => {
          this.setState({overLoader: false});
          this.setState({loaderVisible: false});
          Toast.show(errorMessage, 2000);
        });
    }
  };

  onClickDownload = async (recivedUrl = '') => {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'storage title',
          message: 'storage_permission',
        },
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.download(recivedUrl);
        } else {
          Alert.alert('Are you sure you want to download ?', '', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => this.download(recivedUrl)},
          ]);
        }
      });
    } catch (err) {
      console.log('error', err);
    }
  };

  downloadFile = async () => {
    const endPoint =
      WebUrls.url.downloadLotSummary +
      '?lotID=' +
      this.state.lotID +
      '&formatType=' +
      this.state.radioSelectedExportTypeVal;
    WebMethods.postRequestWithHeader(
      endPoint,
      this.state.radioSelectedExportTypeVal,
    ).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false});
        this.onClickDownload(response.data);
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToDownloadFile'), Toast.SHORT);
      }
    });
  };

  showCreateLotOverview = () => {
    this.setState({
      showCreateLotOverview: !this.state.showCreateLotOverview,
      emailID: '',
      radioSelectedExportTypeVal: true,
      exportTypeIndex: 0,
    });
  };

  renderRows = async (foundData = []) => {
    let status = await CustomFunctions.getCurrncyStatus();

    let actualArr = [];
    let listData =
      this.state.lotConverterList.length > 0
        ? this.state.lotConverterList
        : foundData;
    if (listData == null) {
      return;
    }
    listData.map(lotConverter => {
      if (
        lotConverter.isRemoved !== true ||
        lotConverter.isRemoved == undefined
      ) {
        actualArr.push([
          lotConverter.converterRefNo.toString(),
          lotConverter.converterVolumeName.toString(),
          lotConverter.converterQuantity.toString(),
          this.commanFunctionForDisplayCurrncy(
            status,
            lotConverter.converterValue,
          ),
          '',
        ]);
      }
    });
    this.setState({lotConverters: actualArr});
  };

  renderCell = (data, index) => {
    return (
      <View style={Styles.btnContainer1}>
        <Pressable
          onPress={() => this.viewConverterDetails(index)}
          style={Styles.blubtn}>
          <FastImage
            source={R.images.view}
            style={{width: 20, height: 16}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
        <Pressable onPress={() => this.delete(index)} style={Styles.blubtn}>
          <FastImage
            source={R.images.delete}
            style={{width: 20, height: 16}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
      </View>
    );
  };

  renderQtyCell = (data, index) => {
    return (
      <TextInput
        style={Styles.textInput}
        underlineColorAndroid="transparent"
        value={this.state.lotConverterList[index].converterQuantity.toString()}
        onChangeText={value => this.onChangeQuantity(index, value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        keyboardType="decimal-pad"
        maxLength={50}
        placeholder={I18n.t('lotDetails.qty')}
      />
    );
  };

  renderValueCell = (data, index) => {
    return (
      <TextInput
        style={Styles.textInput}
        underlineColorAndroid="transparent"
        value={this.state.lotConverterList[index].converterValue.toString()}
        onChangeText={value => this.onChangeValue(index, value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        keyboardType="decimal-pad"
        maxLength={50}
        placeholder={I18n.t('lotDetails.value')}
      />
    );
  };

  onChangeQuantity(index, text) {
    const lotConverterList = [...this.state.lotConverterList];
    lotConverterList[index].converterQuantity = text;

    const lotConverters = [...this.state.lotConverters];
    lotConverters[index][2] = text;

    this.setState({
      lotConverterList,
      lotConverters,
    });
  }

  onChangeValue(index, text) {
    const lotConverterList = [...this.state.lotConverterList];
    lotConverterList[index].converterValue = text;

    const lotConverters = [...this.state.lotConverters];
    lotConverters[index][3] = text;

    this.setState({
      lotConverterList,
      lotConverters,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.navFocusListener.remove();
  }

  renderRow = (rowData, index) => {
    return rowData.map((cellData, cellIndex) =>
      this.state.isEdit ? (
        <Cell
          key={cellIndex}
          data={
            cellIndex === 4
              ? this.renderCell(cellData, index)
              : !(cellIndex === 2)
              ? !(cellIndex === 3)
                ? cellData
                : this.renderValueCell(cellData, index)
              : this.renderQtyCell(cellData, index)
          }
          textStyle={[Styles.tbltext, HelperFonts.font_B_Regular]}
        />
      ) : (
        <Cell
          key={cellIndex}
          data={cellIndex === 4 ? this.renderCell(cellData, index) : cellData}
          textStyle={[Styles.tbltext, HelperFonts.font_B_Regular]}
        />
      ),
    );
  };

  changeConvertorValue = e => {
    this.setState({customConverterValue: e == null ? 0 : e});
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
          <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={Styles.container}>
                <Header navigation={this.props.navigation} />

                <View style={Styles.coloumncontainer}>
                  <View>
                    <View style={Styles.textContainer}>
                      {/* <Text
                        style={Styles.headingSubTittle}
                        onPress={() => {
                          this.props.navigation.replace('shopping');
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.replace('shopping');
                          }}>
                          <FastImage
                            source={R.images.prevlnk}
                            style={Styles.prevlnk}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                        &nbsp; {I18n.t('lotDetails.lotDetails')} (
                        {this.state.lotName})
                      </Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('shopping');
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
                            {I18n.t('lotDetails.lotDetails')} (
                            {this.state.lotName})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={Styles.topbtnContainer}>
                  <Pressable
                    onPress={() => {
                      this.editLotConverters();
                    }}
                    style={Styles.blubtn1}>
                    <FastImage
                      source={this.state.isEdit ? R.images.save : R.images.edit}
                      style={{width: 25, height: 18}}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.changeLotStatus();
                    }}
                    style={Styles.blubtn2}>
                    <View
                      style={
                        this.state.lotStatus
                          ? Styles.activeLot
                          : Styles.inActiveLot
                      }>
                      <FastImage
                        source={R.images.cart}
                        style={{width: 25, height: 20}}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.updateLotPrices();
                    }}
                    disabled={this.state.clickedStatus}
                    style={Styles.blubtn3}>
                    <FastImage
                      source={R.images.refresh}
                      style={{width: 17, height: 17}}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </Pressable>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.tblcontainer}>
                    <Table
                      borderStyle={{borderWidth: 1, borderColor: '#e2e2e2'}}>
                      <Row
                        data={this.state.tableHead}
                        style={Styles.tblhead}
                        textStyle={Styles.tblheadtext}
                      />
                      {this.state.lotConverters.map((rowData, index) => (
                        <TableWrapper key={index} style={Styles.row}>
                          {this.renderRow(rowData, index)}
                        </TableWrapper>
                      ))}
                    </Table>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={Styles.labelText}>
                        {I18n.t('common.totalNoConverters')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text
                        style={[Styles.alignright, HelperFonts.font_B_Regular]}>
                        {this.state.totalLotConverters}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={[Styles.itemleft]}>
                      <Text style={Styles.labelText}>
                        {I18n.t('common.totalLotValue')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {this.state.totalLotValue}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={Styles.labelText}>
                        {I18n.t('lotDetails.averageConverterValue')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {this.state.avarageConverterValue}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.btnContainer}>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.props.navigation.navigate('search', {
                          lotID: this.state.lotID,
                          isCustom: true,
                        });
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('lotDetails.addConverterLot')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.showCreateLotOverview();
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.createLotOverview')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.props.navigation.navigate('lotvaluereport', {
                          lotID: this.state.lotID,
                        });
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.lotValueReport')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.props.navigation.navigate('shopping');
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.back')}{' '}
                      </Text>
                    </Pressable>
                  </View>
                </View>

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
                        style={[Styles.headingModalContainers, Styles.modalbg]}>
                        <View style={Styles.headingModalContainer}>
                          <Text style={Styles.headingModal}>
                            {I18n.t('addCustomConverter.addCustomConverter')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
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
                            Styles.mandatoryLbl,
                            HelperFonts.mandatory_Regular,
                          ]}>
                          {I18n.t('common.mandatoryFields')}
                        </Text>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.coloumncontainer3}>
                          <View style={Styles.modalitem1}>
                            <Text style={[Styles.formLbl, Styles.formmt]}>
                              {I18n.t('common.lotName')}:{' '}
                              <Text style={Styles.mandatoryLbl}>*</Text>{' '}
                            </Text>
                          </View>
                          <View style={Styles.modalitem2}>
                            <Text style={[Styles.formLblnb, Styles.formmt]}>
                              {this.state.lotName}
                            </Text>
                          </View>
                        </View>

                        <Text style={[Styles.formLbl, Styles.formmt]}>
                          {I18n.t('common.converterReference')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <TextInput
                          style={Styles.textInput}
                          underlineColorAndroid="transparent"
                          onChangeText={customConverterRefText =>
                            this.setState({
                              customConverterRef: customConverterRefText,
                            })
                          }
                          value={this.state.customConverterRef}
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
                          <Text style={Styles.mandatoryLbl}>*</Text>
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
                          {I18n.t('common.value')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <PriceInput
                          style={Styles.textInput}
                          placeholder={I18n.t(
                            'addCustomConverter.enterConverterValue',
                          )}
                          precision={2}
                          maxLength={10}
                          keyboardType={'decimal-pad'}
                          setValue={this.changeConvertorValue}
                          value={`${parseInt(this.state.customConverterValue)}`}
                          delimiter={this.state.isDotActive ? ',' : '.'}
                          separator={this.state.isDotActive ? '.' : ','}
                          isRTL={global.languageID == '3' ? false : true}
                        />
                        <Text
                          style={[
                            Styles.formLbl,
                            Styles.formmt,
                            Styles.formmb,
                          ]}>
                          {I18n.t('common.quantity')}:{' '}
                          <Text style={Styles.mandatoryLbl}>*</Text>
                        </Text>
                        <NumericInput
                          value={this.state.customConverterQuantity}
                          onChange={value =>
                            this.setState({customConverterQuantity: value})
                          }
                          rightButtonBackgroundColor="#1c3a69"
                          leftButtonBackgroundColor="#1c3a69"
                          rounded
                          iconStyle={{color: 'white'}}
                        />
                      </View>

                      <View style={[Styles.btnContainercust, Styles.mgrT15]}>
                        <Pressable
                          style={Styles.modalcustBtn}
                          onPress={() =>
                            this.localValidation_saveCustomConverter()
                          }>
                          <Text style={Styles.textStyleB}>
                            {I18n.t('common.save')}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[Styles.custbutton, Styles.custbuttonClose]}
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
                  visible={this.state.showDeleteConverter}
                  onRequestClose={() => {
                    this.setState({
                      showDeleteConverter: !this.state.showDeleteConverter,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View style={[Styles.coloumncontainer, Styles.modalbg]}>
                        <View>
                          <Text style={Styles.headingModal}>
                            {I18n.t('deleteConverter.deleteConverter')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonClose1}
                            onPress={() => {
                              this.setState({
                                showDeleteConverter:
                                  !this.state.showDeleteConverter,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcontainer}>
                        <Text
                          style={[
                            Styles.bigfont,
                            Styles.alignleft,
                            {
                              fontFamily: 'SemplicitaPro-Regular',
                            },
                          ]}>
                          {I18n.t('deleteConverter.areSureDeleteConverter')}
                        </Text>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.modalbtnContainer}>
                          <Pressable
                            style={Styles.modalBtnSM}
                            onPress={() => {
                              this.deleteConverter();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('deleteLot.yes')}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={Styles.buttonCloseg}
                            onPress={() => {
                              this.setState({
                                showDeleteConverter:
                                  !this.state.showDeleteConverter,
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
                  visible={this.state.showCreateLotOverview}
                  onRequestClose={() => {
                    this.setState({
                      showCreateLotOverview: !this.state.showCreateLotOverview,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View
                        style={[Styles.headingModalContainers, Styles.modalbg]}>
                        <View style={Styles.headingModalContainer}>
                          <Text style={Styles.headingModal}>
                            {I18n.t('common.createLotOverview')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonCloseb}
                            onPress={() => {
                              this.setState({
                                showCreateLotOverview:
                                  !this.state.showCreateLotOverview,
                              });
                            }}>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.rowrev}>
                          <RadioForm formHorizontal={true} animation={true}>
                            {this.state.exportTypeList.map((obj, i) => {
                              var onPress = (value, index) => {
                                this.setState({
                                  radioSelectedExportTypeVal: value,
                                  exportTypeIndex: index,
                                });
                              };
                              return (
                                <RadioButton labelHorizontal={true} key={i}>
                                  <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={
                                      this.state.exportTypeIndex === i
                                    }
                                    onPress={onPress}
                                    buttonInnerColor={'#1c3a69'}
                                    buttonOuterColor={
                                      this.state.exportTypeIndex === i
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
                                      marginRight: 15,
                                      fontFamily: 'SemplicitaPro-Regular',
                                    }}
                                    labelWrapStyle={{}}
                                  />
                                </RadioButton>
                              );
                            })}
                          </RadioForm>
                        </View>

                        <View style={Styles.modalbtnContainer}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.downloadFile();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.download')} &nbsp;
                              <FastImage
                                source={R.images.download}
                                style={{width: 18, height: 18}}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </Text>
                          </Pressable>
                        </View>

                        <Text style={Styles.formLbl}>
                          {I18n.t('common.email')}:
                        </Text>
                        <TextInput
                          style={Styles.textInput}
                          onChangeText={emailIDText =>
                            this.setState({emailID: emailIDText})
                          }
                          value={this.state.emailID}
                          placeholder={I18n.t('common.email')}
                        />

                        <View style={Styles.modalbtnContainer}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.localValidation_sendEmail();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {' '}
                              {I18n.t('common.sendEmail')} &nbsp;
                              <FastImage
                                source={R.images.email}
                                style={{width: 23, height: 23}}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.modalbtnContainer}>
                        <Pressable
                          style={[Styles.button, Styles.buttonClose]}
                          onPress={() => {
                            this.setState({
                              showCreateLotOverview:
                                !this.state.showCreateLotOverview,
                            });
                          }}>
                          <Text style={Styles.textStyleB}>
                            {' '}
                            {I18n.t('common.close')}
                          </Text>
                        </Pressable>
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
