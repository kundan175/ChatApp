import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import I18n from '../../i18n/i18n';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Footer from '../Footer';
import Header from '../Header';
import LStyles from './ltr_styles';
import RStyles from './rtl_styles';

var Styles = LStyles;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state = {
      loaderVisible: true,
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Styles = (await global.languageID) == '3' ? RStyles : LStyles;

    I18n.locale =
      global.languageID == '1' ? 'en' : global.languageID == '2' ? 'fr' : 'ar';

    await this.getMembershipUserAccess();
    this.setState({loaderVisible: false});
  }

  getNewValues() {
    var parseData = {
      from: 'home',
      returnData: this.returnData.bind(this),
    };
    this.props.navigation.replace('settings', {
      parseData: parseData,
      from: 'home',
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const firstTxt = I18n.t('tostMessages.dubbleTap');
    const secondTxt = I18n.t('common.cancel');
    const thirdTxt = I18n.t('deleteLot.yes');
    Alert.alert(firstTxt, '', [
      {
        text: secondTxt,
        onPress: () => null,
        style: 'cancel',
      },
      {text: thirdTxt, onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  async getMembershipUserAccess() {
    var access = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );
    this.setState({membershipUserAccess: access});
  }

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

              <View style={Styles.textContainer}>
                <View style={Styles.coloumncontainer}>
                  <TouchableOpacity
                    style={Styles.item}
                    onPress={() => {
                      this.props.navigation.navigate('search', {
                        lotID: 0,
                        isCustom: false,
                      });
                    }}>
                    <View style={Styles.itemBoxgr}>
                      <View style={Styles.itemBox}>
                        <FastImage
                          source={R.images.converter_search}
                          style={Styles.boxHeight}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={Styles.headingTittle}>
                          {I18n.t('common.converterSearch')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {this.state.membershipUserAccess.shoppingCart ? (
                    <TouchableOpacity
                      style={Styles.item}
                      onPress={() => {
                        this.props.navigation.navigate('shopping');
                      }}>
                      <View style={Styles.itemBoxgr}>
                        <View style={Styles.itemBox}>
                          <FastImage
                            source={R.images.shopping_basket}
                            style={Styles.boxHeight}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text style={Styles.headingTittle}>
                            {I18n.t('home.shoppingBaskets')}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={Styles.item}
                      onPress={() => {
                        this.props.navigation.navigate('calculator');
                      }}>
                      <View style={Styles.itemBoxgr}>
                        <View style={Styles.itemBox}>
                          <FastImage
                            source={R.images.calculator}
                            style={Styles.boxHeight}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text style={Styles.headingTittle}>
                            {I18n.t('common.calculator')}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {!this.state.membershipUserAccess.shoppingCart ? (
                  <View style={Styles.coloumncontainer}>
                    <TouchableOpacity
                      style={Styles.item}
                      onPress={() => this.getNewValues()}>
                      <View style={Styles.itemBoxgr}>
                        <View style={Styles.itemBox}>
                          <FastImage
                            source={R.images.settings}
                            style={Styles.boxHeight}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text style={Styles.headingTittle}>
                            {I18n.t('common.settings')}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={Styles.item}
                      onPress={() => {
                        this.props.navigation.navigate('contact');
                      }}>
                      <View style={Styles.itemBoxgr}>
                        <View style={Styles.itemBox}>
                          <FastImage
                            source={R.images.contact}
                            style={Styles.boxHeight}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text style={Styles.headingTittle}>
                            {I18n.t('common.contactUs')}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={Styles.coloumncontainer}>
                      <TouchableOpacity
                        style={Styles.item}
                        onPress={() => {
                          this.props.navigation.navigate('calculator');
                        }}>
                        <View style={Styles.itemBoxgr}>
                          <View style={Styles.itemBox}>
                            <FastImage
                              source={R.images.calculator}
                              style={Styles.boxHeight}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={Styles.headingTittle}>
                              {I18n.t('common.calculator')}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={Styles.item}
                        onPress={() => {
                          this.props.navigation.navigate('settings');
                        }}>
                        <View style={Styles.itemBoxgr}>
                          <View style={Styles.itemBox}>
                            <FastImage
                              source={R.images.settings}
                              style={Styles.boxHeight}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={Styles.headingTittle}>
                              {I18n.t('common.settings')}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={Styles.coloumncontainer}>
                      <TouchableOpacity
                        style={Styles.item}
                        onPress={() => {
                          this.props.navigation.navigate('contact');
                        }}>
                        <View style={Styles.itemBoxgr}>
                          <View style={Styles.itemBox}>
                            <FastImage
                              source={R.images.contact}
                              style={Styles.boxHeight}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={Styles.headingTittle}>
                              {I18n.t('common.contactUs')}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
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
