import React from 'react';
import {StatusBar, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preferences from '../../resources/Preferences';
import R from '../../resources/R';
import Styles from './styles';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.getPreferences();
  }

  async getPreferences() {
    global.isLogin = await Preferences.getPreferences(Preferences.key.ISLOGIN);
    global.token = await Preferences.getPreferences(Preferences.key.TOKEN);

    const LoginStatus = await Preferences.getPreferences(
      Preferences.key.isFirstTimeLoggedIn,
    );

    const TermsStatus = await Preferences.getPreferences(
      Preferences.key.isTermsAgreed,
    );

    var membershipAccess = await Preferences.getObjPreferences(
      Preferences.key.MembershipAccess,
    );

    if (
      global.isLogin == 'true' &&
      global.token != null &&
      TermsStatus != null &&
      LoginStatus != null &&
      membershipAccess != null
    ) {
      setTimeout(() => {
        if (TermsStatus == 'False') {
          this.props.navigation.navigate('terms', {fromScreen: 'OTP'});
        } else if (LoginStatus == 'True') {
          this.props.navigation.navigate('ChangePassword');
        } else if (TermsStatus == 'True' && LoginStatus == 'False') {
          this.props.navigation.navigate('home');
        } else {
          this.props.navigation.navigate('home');
        }
      }, 4000);
    } else {
      setTimeout(() => {
        this.props.navigation.replace('login');
      }, 4000);
    }
  }

  render() {
    return (
      <LinearGradient
        colors={['#fff', '#fff', '#fff']}
        style={Styles.linearGradient}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
            // hidden
          />

          {/* <Image
            source={R.images.splash_topicon}
            style={Styles.topicon}
            resizeMode="contain"
          /> */}

          <Image source={R.images.logo} style={Styles.logo} />

          {/* <Image
            source={R.images.splash_boticon}
            style={Styles.boticon}
            resizeMode="contain"
          /> */}
        </View>
      </LinearGradient>
    );
  }
}
