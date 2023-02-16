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
import RNFetchBlob from 'rn-fetch-blob';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomFunctions from '../../components/CustomFunctions';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class LotValueReport extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      loaderVisible: true,

      lotID: this.props.navigation.getParam('lotID'),
      lotName: '',

      lotConverterList: [],
      activeLotConverters: [],
      IsHedged: false,
      profitMargin: 0,
      avarageLotValuePerConverter: 0,
      avarageCatalogValuePerConverter: 0,
      avarageProfitPerConverter: 0,
      avarageValuePerKGMonolith: 0,
      showExportLotValueReport: false,
      exportTypeList: [
        {label: I18n.t('common.exportToExcel'), value: true},
        {label: I18n.t('common.exportToPDF'), value: false},
      ],
      radioSelectedExportTypeVal: true,
      exportTypeIndex: 0,
      emailID: '',
      isDotActive: true,
      lotCurrncy: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';
    this.getLotValueReportPageDefaults();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress() {
    this.props.navigation.goBack();
    return true;
  }

  handleBackButton = () => {
    this.props.navigation.navigate('editlot');
    return true;
  };

  getLotValueReportPageDefaults = () => {
    WebMethods.getRequestWithHeader(
      WebUrls.url.getLotValueReportPageDefaults + '?lotID=' + this.state.lotID,
    ).then(response => {
      this.setState({
        lotName: response.data.lotDetails.lotName,
        lotCurrncy: response.data.lotDetails.currencySymbol,
        lotConverterList: response.data.lotValueReportList,
        IsHedged: response.data.isHedged,
        profitMargin: response.data.profitMargin,
        avarageLotValuePerConverter: response.data.avarageLotValuePerConverter,
        avarageCatalogValuePerConverter:
          response.data.avarageCatalogValuePerConverter,
        avarageProfitPerConverter: response.data.avarageProfitPerConverter,
        avarageValuePerKGMonolith: response.data.avarageValuePerKGMonolith,
        ptHedged: response.data.platinum.toFixed(2),
        pdHedged: response.data.palladium.toFixed(2),
        rhHedged: response.data.rhodium.toFixed(2),
        loaderVisible: false,
      });
      this.setAllValuesIntoNewFormat();
    });
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

  async setAllValuesIntoNewFormat() {
    let status = await CustomFunctions.getCurrncyStatus();
    const {
      profitMargin,
      avarageLotValuePerConverter,
      avarageCatalogValuePerConverter,
      avarageProfitPerConverter,
      avarageValuePerKGMonolith,
      ptHedged,
      pdHedged,
      rhHedged,
    } = this.state;
    let newprofitMargin = this.commanFunctionForDisplayCurrncy(
      status,
      profitMargin,
    );
    let newavarageLotValuePerConverter = this.commanFunctionForDisplayCurrncy(
      status,
      avarageLotValuePerConverter,
    );
    let newavarageCatalogValuePerConverter =
      this.commanFunctionForDisplayCurrncy(
        status,
        avarageCatalogValuePerConverter,
      );
    let newavarageProfitPerConverter = this.commanFunctionForDisplayCurrncy(
      status,
      avarageProfitPerConverter,
    );
    let newavarageValuePerKGMonolith = this.commanFunctionForDisplayCurrncy(
      status,
      avarageValuePerKGMonolith,
    );
    let newptHedged = this.commanFunctionForDisplayCurrncy(status, ptHedged);
    let newpdHedged = this.commanFunctionForDisplayCurrncy(status, pdHedged);
    let newrhHedged = this.commanFunctionForDisplayCurrncy(status, rhHedged);

    this.setState({
      profitMargin: newprofitMargin,
      avarageLotValuePerConverter: newavarageLotValuePerConverter,
      avarageCatalogValuePerConverter: newavarageCatalogValuePerConverter,
      avarageProfitPerConverter: newavarageProfitPerConverter,
      avarageValuePerKGMonolith: newavarageValuePerKGMonolith,
      ptHedged: newptHedged,
      pdHedged: newpdHedged,
      rhHedged: newrhHedged,
      isDotActive: status,
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
    const endPoint =
      WebUrls.url.sendLotValue +
      '?lotID=' +
      this.state.lotID +
      '&formatType=' +
      this.state.radioSelectedExportTypeVal +
      '&emailID=' +
      this.state.emailID;
    WebMethods.postRequestWithHeader(endPoint).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false, emailID: ''});
        Toast.show(I18n.t('tostMessages.emailSentSuccessfully'), Toast.SHORT);
      } else {
        this.setState({loaderVisible: false, emailID: ''});
        Toast.show(I18n.t('tostMessages.failedToSendEmail'), Toast.SHORT);
      }
    });
  };

  renderHeader = converter => {
    let index = this.state.activeLotConverters[0];
    let currentObj = this.state.lotConverterList[index];

    return (
      <View>
        <View style={Styles.headers}>
          <FastImage
            style={{height: 20, width: 20}}
            source={currentObj == converter ? R.images.up : R.images.down}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={Styles.headersText}>{[converter.converterRefNo]}</Text>
          <Text style={Styles.headersTexts}>
            {[converter.converterVolumeName]}
          </Text>
        </View>
      </View>
    );
  };

  renderContent = converter => {
    let tableData = [
      [I18n.t('common.quantity'), converter.converterQuantity],
      [
        I18n.t('lotValueReport.converterLotPrice'),
        converter.userConverterValue.toFixed(2) + this.state.lotCurrncy,
      ],
      [
        I18n.t('lotValueReport.totalValueLotPrice'),
        converter.converterUserTotalValue.toFixed(2) + this.state.lotCurrncy,
      ],
      [
        I18n.t('lotValueReport.converterCatalogPrice'),
        converter.converterValue.toFixed(2) + this.state.lotCurrncy,
      ],
      [
        I18n.t('lotValueReport.totalValueCatalogPrice'),
        converter.converterTotalValue.toFixed(2) + this.state.lotCurrncy,
      ],
      [
        I18n.t('lotValueReport.totalProfitConverter'),
        converter.converterProfit.toFixed(2) + this.state.lotCurrncy,
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
        </Table>
      </View>
    );
  };

  updateSections = activeLotConverters => {
    this.setState({activeLotConverters});
  };

  downloadFile = async () => {
    const endPoint =
      WebUrls.url.downloadLotValue +
      '?lotID=' +
      this.state.lotID +
      '&formatType=' +
      this.state.radioSelectedExportTypeVal;
    WebMethods.postRequestWithHeader(endPoint).then(response => {
      if (response.data) {
        this.setState({loaderVisible: false});
        this.onClickDownload(response.data);
      } else {
        this.setState({loaderVisible: false});
        Toast.show(I18n.t('tostMessages.failedToDownloadFile'), Toast.SHORT);
      }
    });
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
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
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
    this.setState({loaderVisible: true, showExportLotValueReport: false});
    if (isIOS) {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          this.setState({overLoader: false});
          setTimeout(() => {
            const foundPath = res.data;
            RNFetchBlob.ios.previewDocument(foundPath);
            Toast.show(
              I18n.t('tostMessages.fileDownloadSuccessfully'),
              Toast.SHORT,
            );
            this.setState({loaderVisible: false});
          }, 300);
        })
        .catch(errorMessage => {
          this.setState({overLoader: false});
          Toast.show(errorMessage, 2000);
          this.setState({loaderVisible: false});
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
                          this.props.navigation.navigate('editlot');
                        }}
                        >
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('editlot');
                          }}>
                          <FastImage
                            source={R.images.prevlnk}
                            style={Styles.prevlnk}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                        &nbsp; {I18n.t('common.lotValueReport')} (
                        {this.state.lotName})
                      </Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('editlot');
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
                            {I18n.t('common.lotValueReport')} (
                            {this.state.lotName})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={Styles.coloumncontainers}>
                  <View style={Styles.coloumncontainer3}>
                    <Text style={Styles.lotHeader1}>
                      {I18n.t('common.converterReference')}
                    </Text>
                    <Text style={Styles.lotHeader2}>
                      {I18n.t('common.volume')}
                    </Text>
                  </View>

                  <View>
                    <Accordion
                      sections={this.state.lotConverterList}
                      activeSections={this.state.activeLotConverters}
                      renderHeader={this.renderHeader}
                      renderContent={this.renderContent}
                      onChange={this.updateSections}
                      duration={500}
                      underlayColor="#fff"
                    />
                  </View>

                  <View>
                    <Text
                      style={[Styles.marginTB10, HelperFonts.font_B_Regular]}>
                      {I18n.t('lotValueReport.estimatedLotMargin')}
                    </Text>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                        {I18n.t('lotValueReport.profitMargin')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {`${this.state.profitMargin}%`}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                        {I18n.t('lotValueReport.averageValuePerConverter')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {`${this.state.avarageLotValuePerConverter}${this.state.lotCurrncy}`}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                        {I18n.t(
                          'lotValueReport.averageCatalogValuePerConverter',
                        )}
                        :
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {`${this.state.avarageCatalogValuePerConverter}${this.state.lotCurrncy}`}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                        {I18n.t('lotValueReport.averageProfitPerConverter')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {`${this.state.avarageProfitPerConverter}${this.state.lotCurrncy}`}
                      </Text>
                    </View>
                  </View>

                  <View style={Styles.containertwocols}>
                    <View style={Styles.itemleft}>
                      <Text style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                        {I18n.t('lotValueReport.averageValuePerMonolith')}:
                      </Text>
                    </View>
                    <View style={Styles.itemright}>
                      <Text style={Styles.alignright}>
                        {`${this.state.avarageValuePerKGMonolith}${
                          this.state.lotCurrncy
                        } ${I18n.t('common.Kg')}`}
                      </Text>
                    </View>
                  </View>

                  {this.state.IsHedged ? (
                    <View>
                      <View style={Styles.containertwocols}>
                        <View style={Styles.itemleft}>
                          <Text
                            style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                            {/* Platinum (Pt) to be hedged **:
                             */}
                            {I18n.t('lotValueReport.lotValuePt')}
                          </Text>
                        </View>
                        <View style={Styles.itemright}>
                          <Text style={Styles.alignright}>
                            {this.state.ptHedged + ' '}
                            {I18n.t('common.Kg')}
                          </Text>
                        </View>
                      </View>

                      <View style={Styles.containertwocols}>
                        <View style={Styles.itemleft}>
                          <Text
                            style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                            {I18n.t('lotValueReport.lotValuePd')}
                          </Text>
                        </View>
                        <View style={Styles.itemright}>
                          <Text style={Styles.alignright}>
                            {this.state.pdHedged + ' '}
                            {I18n.t('common.Kg')}
                          </Text>
                        </View>
                      </View>
                      <View style={Styles.containertwocols}>
                        <View style={Styles.itemleft}>
                          <Text
                            style={[Styles.alignleft, HelperFonts.font_B_Bold]}>
                            {I18n.t('lotValueReport.lotValueRh')}
                          </Text>
                        </View>
                        <View style={Styles.itemright}>
                          <Text style={Styles.alignright}>
                            {this.state.rhHedged + ' '}
                            {I18n.t('common.Kg')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={[Styles.marginTB10, HelperFonts.font_B_Regular]}>
                        {I18n.t('lotValueReport.atLeastCondition')}
                      </Text>
                    </View>
                  )}

                  <View>
                    <Text
                      style={[Styles.marginTB10, HelperFonts.font_B_Regular]}>
                      {I18n.t(
                        'lotValueReport.calculationWithoutCustomConverters',
                      )}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={[Styles.marginTB10, HelperFonts.font_B_Regular]}>
                      {I18n.t('lotValueReport.information')}
                    </Text>
                  </View>

                  <View style={Styles.btnContainer}>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.setState({
                          showExportLotValueReport:
                            !this.state.showExportLotValueReport,
                        });
                      }}>
                      <Text style={Styles.textStyleB}>
                        {I18n.t('common.exportLotValueReport')}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={Styles.btn}
                      onPress={() => {
                        this.props.navigation.navigate('editlot');
                      }}>
                      <Text style={Styles.textStyleB}>
                        {' '}
                        {I18n.t('common.back')}{' '}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showExportLotValueReport}
                  onRequestClose={() => {
                    this.setState({
                      showExportLotValueReport:
                        !this.state.showExportLotValueReport,
                    });
                  }}>
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <View
                        style={[Styles.headingModalContainer, Styles.modalbg]}>
                        <View style={Styles.headingModalContainer}>
                          <Text style={Styles.headingModal}>
                            {I18n.t('common.exportLotValueReport')}
                          </Text>
                        </View>
                        <View style={Styles.headingBtn}>
                          <Pressable
                            style={Styles.buttonCloseb}
                            onPress={() =>
                              this.setState({
                                showExportLotValueReport:
                                  !this.state.showExportLotValueReport,
                              })
                            }>
                            <Text style={Styles.textStyle}>X</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={Styles.formcontainer}>
                        <View style={Styles.radioContainer}>
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

                        <View style={[Styles.modalbtnContainer]}>
                          <Pressable
                            style={Styles.modalBtn}
                            onPress={() => {
                              this.downloadFile();
                            }}>
                            <Text style={Styles.textStyleB}>
                              {I18n.t('common.download')} &nbsp;
                              <FastImage
                                source={R.images.download}
                                style={{width: 23, height: 23}}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </Text>
                          </Pressable>
                        </View>

                        <Text style={Styles.emailLabel}>
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
                              {I18n.t('common.sendEmail')} &nbsp;
                              <FastImage
                                source={R.images.email}
                                style={{width: 23, height: 23}}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </Text>
                          </Pressable>
                        </View>

                        <View style={Styles.modalbtnContainer}>
                          <Pressable
                            style={Styles.modalBtng}
                            onPress={() =>
                              this.setState({
                                showExportLotValueReport:
                                  !this.state.showExportLotValueReport,
                              })
                            }>
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
