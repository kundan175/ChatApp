import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from 'react-native';
import {formatNumber} from 'react-native-currency-input';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import CustomFunctions from '../../components/CustomFunctions';
import ImageSlider from '../../components/ImageSliderView';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Converterdetails extends React.Component {
  constructor(props) {
    super(props);

    var converter = this.props.navigation.getParam('converterID');
    var fromSearch = this.props.navigation.getParam('isFromSearch');
    var lot = this.props.navigation.getParam('lotID');

    this.state = {
      loaderVisible: true,

      converterID: converter,
      isFromSearch: fromSearch,
      lotID: lot,

      manufacturerName: '',
      makeName: '',
      converterRefNo: '',
      size: '',
      additionalDescription: '',
      converterValue: '',
      monolithValue: '',
      totalWeight: '',
      carrierName: '',
      weightOfCarrier: '',
      imageURLs: [],
      showImages: true,
      photoIndex: 0,
      isDotActive: true,

      membershipUserAccess: {},
      imageModalActive: false,
      sliderImagesData: [],
      converterImageThumbPath: '',
      converterImagePath: '',
      displayIndex: 2,
    };
  }

  componentDidMount() {
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.setState({ConverterID: this.props.navigation.getParam('converterID')});
    this.getMembershipUserAccess();
    this.getConverterDetailsPageDefaults();

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
    this.props.navigation.pop();
    return true;
  };

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );

    this.setState({membershipUserAccess: access});
  }

  async getConverterDetailsPageDefaults() {
    let status = await CustomFunctions.getCurrncyStatus();
    WebMethods.getRequestWithHeader(
      WebUrls.url.getConverterDetailsPageDefaults +
        '?converterID=' +
        this.state.converterID,
    ).then(response => {
      this.setState({
        manufacturerName: response.data.manufacturerName,
        converterRefNo: response.data.converterRefNo,
        makeName: response.data.makeName,
        additionalDescription: response.data.additionalDescription,
        size: response.data.size,
        totalWeight: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.totalWeight,
        ),
        carrierName: response.data.carrierName,
        weightOfCarrier: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.weightOfCarrier,
        ),
        catalogRefNo: response.data.catalogRefNo,
        analysisTypeName: response.data.analysisTypeName,
        analysisRefNo: response.data.analysisRefNo,
        analysisDate: response.data.analysisDate,
        converterValue: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.converterValue,
        ),
        monolithValue: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.monolithValue,
        ),
        pdContentGT: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.pdContentGT,
        ),
        ptContentGT: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.ptContentGT,
        ),
        rhContentGT: this.commanFunctionForDisplayCurrncy(
          status,
          response.data.rhContentGT,
        ),
        isDotActive: status,
        imageURLs: response.data.imageURLs,
        converterImagePath: response.data.converterImagePath,
        converterImageThumbPath: response.data.converterImageThumbPath,
        loaderVisible: false,
      });
      this.convertImageForSlide(response.data.imageURLs);
    });
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

  convertImageForSlide = foundUrls => {
    const {converterImagePath} = this.state;
    let newFormat = foundUrls.map((item, index) => {
      let imageURL = `${item}`;
      {
        return {
          url: imageURL,
        };
      }
    });
    this.setState({sliderImagesData: newFormat});
  };

  onClickImage = (modalStatus = false, index = 0) => {
    this.setState({imageModalActive: modalStatus, displayIndex: index});
  };

  renderImageList = ({item, index}) => (
    <>
      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => this.onClickImage(true, index)}>
        <FastImage source={{uri: `${item}`}} style={Styles.Convimg} />
      </TouchableOpacity>
    </>
  );

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
          {!this.state.imageModalActive ? (
            <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}>
                <View style={Styles.container}>
                  <Header navigation={this.props.navigation} />

                  <View style={Styles.coloumncontainer}>
                    <View style={Styles.textContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.pop();
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
                            {I18n.t('converterDetails.converterDetails')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {this.state.membershipUserAccess.manufacturer ||
                  this.state.membershipUserAccess.make ||
                  this.state.membershipUserAccess.reference ||
                  this.state.membershipUserAccess.additionalDescription ||
                  this.state.membershipUserAccess.size ||
                  this.state.membershipUserAccess.PGMValue ? (
                    <View style={Styles.coloumncontainers}>
                      <View style={Styles.blueBkg}>
                        <Text style={Styles.subTitle}>
                          {I18n.t('converterDetails.converter')}
                        </Text>
                      </View>
                      <View style={Styles.blueBkgInverted}>
                        <Text>&nbsp;</Text>
                      </View>

                      <View style={Styles.portlet}>
                        {this.state.membershipUserAccess.manufacturer && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.manufacturer')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.manufacturerName}
                            </Text>
                          </View>
                        )}

                        {this.state.membershipUserAccess.reference && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('common.converterReference')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.converterRefNo}
                            </Text>
                          </View>
                        )}

                        {this.state.membershipUserAccess.size && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('common.size')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.size}
                            </Text>
                          </View>
                        )}
                        {this.state.membershipUserAccess.PGMValue && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('common.value')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.converterValue}{' '}
                              {this.state.membershipUserAccess.CurrencySymbol}
                            </Text>
                          </View>
                        )}
                        {this.state.membershipUserAccess.make && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('common.make')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.makeName}
                            </Text>
                          </View>
                        )}

                        {this.state.membershipUserAccess
                          .additionalDescription && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.additionalDescription')}
                              :
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.additionalDescription}
                            </Text>
                          </View>
                        )}

                        {this.state.membershipUserAccess.PGMValue && (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.monolithvalue')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.monolithValue}{' '}
                              {this.state.membershipUserAccess.CurrencySymbol}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}

                  {this.state.membershipUserAccess.totalWeightinKg ||
                  this.state.membershipUserAccess.carrier ||
                  this.state.membershipUserAccess.weightofCarrierKg ? (
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
                        {this.state.membershipUserAccess.totalWeightinKg ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.totalWeight')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.totalWeight}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.carrier ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.carrier')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.carrierName}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.weightofCarrierKg ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('common.carrierWeightInKg')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.weightOfCarrier}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {this.state.membershipUserAccess.catalogReferenceNumber ? (
                    <View style={Styles.coloumncontainers}>
                      <View style={Styles.blueBkg}>
                        <Text style={Styles.subTitle}>
                          {I18n.t('converterDetails.referenceData')}
                        </Text>
                      </View>
                      <View style={Styles.blueBkgInverted}>
                        <Text>&nbsp;</Text>
                      </View>

                      <View style={Styles.portlet}>
                        {this.state.membershipUserAccess
                          .catalogReferenceNumber ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.converterID')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.catalogRefNo}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {this.state.membershipUserAccess.typeofAnalysis ||
                  this.state.membershipUserAccess.analysisRefNo ||
                  this.state.membershipUserAccess.analysisDate ||
                  this.state.membershipUserAccess.pdContentgT ||
                  this.state.membershipUserAccess.ptContentgT ||
                  this.state.membershipUserAccess.rhContentgT ? (
                    <View style={Styles.coloumncontainers}>
                      <View style={Styles.blueBkg}>
                        <Text style={Styles.subTitle}>
                          {I18n.t('converterDetails.analysisDetails')}
                        </Text>
                      </View>
                      <View style={Styles.blueBkgInverted}>
                        <Text>&nbsp;</Text>
                      </View>

                      <View style={Styles.portlet}>
                        {this.state.membershipUserAccess.typeofAnalysis ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.analyticalInstrument')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.analysisTypeName}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.analysisRefNo ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.analysisRef')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.analysisRefNo}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.analysisDate ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.analysisDate')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.analysisDate}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.ptContentgT ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.ptContent')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.ptContentGT}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.pdContentgT ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.pdContent')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.pdContentGT}
                            </Text>
                          </View>
                        ) : null}

                        {this.state.membershipUserAccess.rhContentgT ? (
                          <View style={Styles.formcont}>
                            <Text style={[Styles.formLbll, Styles.formmt]}>
                              {I18n.t('converterDetails.rhContent')}:
                            </Text>
                            <Text style={[Styles.formLblr, Styles.formmt]}>
                              {this.state.rhContentGT}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                  {this.state.imageURLs.length > 0 && (
                    <>
                      {this.state.membershipUserAccess.photos ? (
                        <View style={Styles.coloumncontainers}>
                          <View style={Styles.blueBkg}>
                            <Text style={Styles.subTitle}>
                              {I18n.t('converterDetails.converterPhotos')}
                            </Text>
                          </View>
                          <View style={Styles.blueBkgInverted}>
                            <Text>&nbsp;</Text>
                          </View>

                          <View
                            style={[
                              Styles.portlet,
                              Styles.marginBot,
                              Styles.Convimgcon,
                            ]}>
                            <FlatList
                              data={this.state.imageURLs}
                              renderItem={item => this.renderImageList(item)}
                              keyExtractor={item => item.id}
                              numColumns={3}
                            />
                          </View>
                        </View>
                      ) : null}
                    </>
                  )}
                  <View style={{flex: 1, paddingBottom: 80, paddingLeft: 20}}>
                    <TouchableOpacity
                      style={Styles.blubtn}
                      onPress={() => {
                        this.props.navigation.pop();
                      }}>
                      <Text style={[Styles.textStyle, HelperFonts.font_W_Bold]}>
                        {I18n.t('common.back')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
          ) : (
            <View style={{backgroundColor: '#1c3a69', height: '50%'}}>
              {this.state.imageModalActive && (
                <View style={{flex: 1}}>
                  <ImageSlider
                    imageArr={this.state.sliderImagesData}
                    extraMethodCall={() => this.onClickImage(false)}
                    displayImageTitleName={this.state.converterRefNo}
                    displayIndex={this.state.displayIndex}
                  />
                </View>
              )}
            </View>
          )}

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
