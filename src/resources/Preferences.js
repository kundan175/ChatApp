import AsyncStorage from '@react-native-async-storage/async-storage';

const Preferences = {
  key: {
    ISLOGIN: 'islogin',
    TOKEN: 'token',

    UserID: 'userID',
    UserName: 'userName',
    Email: 'email',
    CompanyLogo: 'companyLogo',

    LanguageID: 'languageID',

    MembershipAccess: 'membershipAccess',
    isFirstTimeLoggedIn: 'isFirstTimeLoggedIn',
    isTermsAgreed: 'isTermsAgreed',
  },

  async savePreferences(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  },

  async getPreferences(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  },

  async saveObjPreferences(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  },

  async getObjPreferences(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.log('Something went wrong', error);
    }
  },

  async clearPreferences() {
    AsyncStorage.clear();

    global.isLogin = '';
    global.token = '';

    global.userID = '';
    global.userName = '';
    global.email = '';
    global.companyLogo = '';

    global.languageID = '';

    global.MembershipAccess = '';
  },
};

export default Preferences;
