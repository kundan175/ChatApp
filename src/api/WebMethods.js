import NetInfo from '@react-native-community/netinfo';
import WebUrls from './WebUrls';
import {Alert} from 'react-native';
import CustomFunctions from '../components/CustomFunctions';
import I18n from 'i18n-js';

const WebMethods = {
  async checkconnectivity() {
    await NetInfo.fetch().then(state => {
      if (state.type == 'none') {
        return true;
      } else {
        return false;
      }
    });
  },

  tokenRequest: (webUrl, params) => {
    const url = WebUrls.url.TOKEN_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  postRequest: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);

    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => {
        console.log(':::::', response);
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  postRequestWithHeader: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  putRequest: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);

    return fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  putRequestWithHeader: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);

    return fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  getRequest: webUrl => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  getRequestWithHeader: async webUrl => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result==search===>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  multipartRequest: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: params,
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },

  multipartRequestwithHeader: (webUrl, params) => {
    const url = WebUrls.url.BASE_URL + webUrl;
    console.log('url==>', url);
    console.log('params==>', params);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: params,
    })
      .then(response => {
        if (response.headers.get('AuthStatus') != null) {
          const defaultTxt = I18n.t('common.sessionOutMessage');
          const okTxt = I18n.t('settings.ok');
          Alert.alert(defaultTxt, '', [
            {text: okTxt, onPress: () => CustomFunctions.logout()},
          ]);
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json != null) {
          const result = JSON.parse(JSON.stringify(json));
          console.log('result=====>', result);
          return result;
        } else {
          console.log('return null');
          return null;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  },
};

export default WebMethods;
