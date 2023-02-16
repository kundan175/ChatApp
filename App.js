import React from 'react';

import AppNavigator from './src/navigator/AppNavigator';
import NavigationService from './src/navigator/NavigationService';
import Preferences from './src/resources/Preferences';

import I18n from 'react-native-i18n';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRoute: 'Splash',
    };
  }

  async componentDidMount() {
    this.setLanguage();
    this.getPreferences();
  }

  async setLanguage() {
    global.languageID = await Preferences.getPreferences(Preferences.key.LanguageID);
    
    if (global.languageID == null || global.languageID == "") {
      var langID = (I18n.currentLocale().substring(0, 2) == "ar") ? "3" : ((I18n.currentLocale().substring(0, 2) == "fr") ? "2" : "1");
      Preferences.savePreferences(Preferences.key.LanguageID, langID);
      global.languageID = langID;
    }
  }

  async getPreferences() {
    global.isLogin = await Preferences.getPreferences(Preferences.key.ISLOGIN);
    global.token = await Preferences.getPreferences(Preferences.key.TOKEN);
  }

  render() {
    return (
      <InternetConnectionAlert
        onChange={connectionState => {
          console.log('Connection State: ', connectionState);
        }}>
        <AppNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </InternetConnectionAlert>
    );
  }
}
