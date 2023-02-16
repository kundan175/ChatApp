import axios from 'axios';
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
import ImgToBase64 from 'react-native-image-base64';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import WebUrls from '../../api/WebUrls';
import HelperFonts from '../../Helper/HelperFonts';
import I18n from '../../i18n/i18n';
import NavigationService from '../../navigator/NavigationService';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,

      description: '',

      fileUri: '',
      fileData: '',
      fileName: '',
      staticFile: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    Styles = global.languageID == '3' ? RStyles : LStyles;
    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    this.setState({loaderVisible: false});
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
    return true;
  };

  logout = () => {
    Preferences.savePreferences(Preferences.key.ISLOGIN, 'false');
    Preferences.savePreferences(Preferences.key.TOKEN, '');

    global.isLogin = 'false';
    global.token = '';

    NavigationService.navigate('login');
  };

  chooseFile = () => {
    let options = {
      mediaType: 'photo',
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      originalRotation: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        this.setState({fileUri: '', fileData: ''});
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        this.setState({fileUri: '', fileData: ''});
        Toast.show(I18n.t('tostMessages.cameraUnavailable'), Toast.SHORT);
        return;
      } else if (response.errorCode == 'permission') {
        this.setState({fileUri: '', fileData: ''});
        Toast.show(I18n.t('tostMessages.accessPermission'), Toast.SHORT);
        return;
      } else if (response.errorCode == 'others') {
        this.setState({fileUri: '', fileData: ''});
        Toast.show(I18n.t('tostMessages.somthingWentWrong'), Toast.SHORT);
        return;
      } else {
        this.setState({
          fileUri: response.assets[0].uri,
          fileData: 'data:image/jpeg;base64,' + response.assets[0].uri,
          fileName: response.assets[0].fileName,
          staticFile: response.assets[0].uri,
        });
        this.convertToBase64(response.assets[0].uri);
      }
    });
  };

  localValidation = () => {
    this.setState({loaderVisible: true});

    if (this.state.description == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.enterDescription'), Toast.SHORT);
    } else if (this.state.fileData == '') {
      this.setState({loaderVisible: false});
      Toast.show(I18n.t('tostMessages.selectImage'), Toast.SHORT);
    } else {
      this.submitContactUs();
    }
  };

  async convertToBase64(fileuri) {
    ImgToBase64.getBase64String(fileuri)
      .then(base64String => this.setState({fileUri: base64String}))
      .catch(err => console.log(err));
  }

  submitContactUs = async () => {
    const params = JSON.stringify({
      contatctimage: this.state.fileUri,
      description: this.state.description,
    });
    await this.postRequestForContactUs(WebUrls.url.newSubmitContactUs, params);
  };

  postRequestForContactUs = (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    axios
      .post(url, params, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.status == 200) {
          Toast.show(
            I18n.t('tostMessages.recordSubmittedSuccessfully'),
            Toast.SHORT,
          );
          this.setState({loaderVisible: false});
          this.props.navigation.replace('home');
        } else {
          Toast.show(I18n.t('tostMessages.somthingWentWrong'), Toast.SHORT);
          this.setState({loaderVisible: false});
          this.props.navigation.replace('home');
        }
      })
      .catch(error => {
        this.setState({loaderVisible: false});
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
                      {/* <Text style={Styles.headingSubTittle} onPress={() => {
                            this.props.navigation.replace('home');
                          }} >
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
                        &nbsp; {I18n.t('common.contactUs')}
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
                            {I18n.t('common.contactUs')}
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

                <View style={Styles.formcontainer}>
                  <Text style={[Styles.formLbl, HelperFonts.font_B_Bold]}>
                    {I18n.t('contactUs.uploadConverterPhoto')}
                  </Text>

                  <TouchableOpacity onPress={() => this.chooseFile()}>
                    <FastImage
                      style={{
                        paddingVertical: 15,
                        width: 75,
                        height: 75,
                        borderRadius: 37,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      source={
                        this.state.staticFile != ''
                          ? {uri: this.state.staticFile}
                          : R.images.upload
                      }
                    />
                  </TouchableOpacity>

                  <Text
                    style={[Styles.formLbl, Styles.mandatory, Styles.pdtop]}>
                    {I18n.t('contactUs.fileFormats')}
                  </Text>

                  <Text style={[Styles.formLbl, Styles.formmt]}>
                    {I18n.t('contactUs.description')}:{' '}
                    <Text style={Styles.mandatory}>*</Text>
                  </Text>

                  <TextInput
                    multiline={true}
                    style={Styles.textInputm}
                    underlineColorAndroid="transparent"
                    onChangeText={descriptionText =>
                      this.setState({description: descriptionText})
                    }
                    value={this.state.description}
                    keyboardType="default"
                    numberOfLines={7}
                    placeholder={I18n.t('contactUs.writeDescription')}
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
                      this.props.navigation.replace('home');
                    }}>
                    <Text style={Styles.textStyleB}>
                      {I18n.t('common.cancel')}
                    </Text>
                  </Pressable>
                </View>
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
