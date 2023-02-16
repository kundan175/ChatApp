import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import FastImage from 'react-native-fast-image';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import WebMethods from '../../api/WebMethods';
import WebUrls from '../../api/WebUrls';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Terms extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);
    var navPath = this.props.navigation.getParam('fromScreen');
    this.state = {
      isChecked: false,
      termsResponse: {},
      lastPageDirection: navPath,
    };
  }

  componentDidMount() {
    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.getTermsPageDefaults();

    if (this.state.lastPageDirection == 'OTP') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    } else {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackBtn);
    }
  }

  componentWillUnmount() {
    if (this.state.lastPageDirection == 'OTP') {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } else {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackBtn);
    }
  }

  handleBackBtn = () => {
    this.props.navigation.navigate('profile');
    return true;
  };

  handleBackPress = () => {
    this.props.navigation.navigate('login');
    return true;
  };

  getTermsPageDefaults = () => {
    WebMethods.getRequestWithHeader(WebUrls.url.getTermsPageDefaults).then(
      response => {
        this.setState({
          loaderVisible: false,
          termsResponse: response.data,
        });
      },
    );
  };

  onClickCheckBox = async () => {
    const AgreeStatus = await Preferences.getPreferences(
      Preferences.key.isFirstTimeLoggedIn,
    );
    this.setState({isChecked: !this.state.isChecked});
    await WebMethods.postRequestWithHeader(WebUrls.url.submitTerms).then(
      response => {
        if (!AgreeStatus) {
          Preferences.savePreferences(
            Preferences.key.isFirstTimeLoggedIn,
            'True',
          );
          this.props.navigation.navigate('home');
        } else {
          Preferences.savePreferences(
            Preferences.key.isFirstTimeLoggedIn,
            'True',
          );
          Preferences.savePreferences(Preferences.key.isTermsAgreed, 'True');
          this.props.navigation.navigate('ChangePassword');
        }
      },
    );
  };

  onPassNewPage = () => {
    const {lastPageDirection} = this.state;
    if (lastPageDirection == 'OTP') {
      this.handleBackPress();
    } else {
      this.handleBackBtn();
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
          <View style={Styles.container}>
            <Header
              navigation={this.props.navigation}
              isDrawerRequired={
                this.state.lastPageDirection == 'OTP' ? false : true
              }
            />
            <View style={Styles.coloumncontainer1}>
              <View style={Styles.headcont}>
                <TouchableOpacity
                  onPress={() => {
                    this.onPassNewPage();
                  }}>
                  <FastImage
                    source={R.images.prevlnk}
                    style={Styles.prevlnk}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.onPassNewPage();
                  }}>
                  <Text style={Styles.headingSubTittle}>
                    &nbsp; {I18n.t('common.termsUse')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={Styles.coloumncontainers2}>
              <WebView
                startInLoadingState={true}
                source={{
                  uri: this.state.termsResponse.termsofuseurl,
                }}
              />
            </View>
            {!this.state.termsResponse.isAgreed ? (
              <View style={Styles.coloumncontainers3}>
                <CheckBox
                  style={{padding: 15}}
                  onClick={() => this.onClickCheckBox()}
                  isChecked={this.state.isChecked}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'SemplicitaPro-Bold',
                    color: 'black',
                    marginTop: 15,
                    textAlign: 'left',
                  }}>
                  {I18n.t('termsUse.agreedOn')}
                </Text>
              </View>
            ) : (
              <View style={Styles.coloumncontainers3}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'SemplicitaPro-Bold',
                    color: 'black',
                    marginTop: 15,
                    textAlign: 'left',
                  }}>
                  {`${I18n.t('termsUse.agreedOn')}: ${
                    this.state.termsResponse.termsAgreedDate
                  }`}
                </Text>
              </View>
            )}

            <Footer />
          </View>
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
