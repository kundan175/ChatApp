import {formatNumber} from 'react-native-currency-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../navigator/NavigationService';
import Preferences from '../resources/Preferences';

const CustomFunctions = {
  
  async logout() {
    const storedKeys = [
      Preferences.key.ISLOGIN,
      Preferences.key.TOKEN,
      Preferences.key.UserID,
      Preferences.key.UserName,
      Preferences.key.Email,
      Preferences.key.LanguageID,
      Preferences.key.MembershipAccess,
    ];
    await AsyncStorage.multiRemove(storedKeys);
    global.isLogin = 'false';
    global.token = '';
    NavigationService.navigate('login');
  },

  setDeafaultCurrncyValues(isDotActive, passingPrice, precision = 2) {
    const formattedValue = formatNumber(passingPrice, {
      separator: isDotActive == true || isDotActive == 'true' ? '.' : ',', 
      precision: precision,
      delimiter: isDotActive == true || isDotActive == 'true' ? ',' : '.', 
    });
    return formattedValue;
  },
  setCurrncyStatus(status) {
    AsyncStorage.setItem('isDotActive', status.toString());
  },
  async getCurrncyStatus() {
    let currntStatus = await AsyncStorage.getItem('isDotActive');
    return currntStatus;
  },
};

export default CustomFunctions;
