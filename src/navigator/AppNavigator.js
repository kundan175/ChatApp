import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Splash from '../screens/Splash';
import Login from '../screens/Login';
import OTP from '../screens/OTP';
import Signup from '../screens/Signup';
import Forgotpassword from '../screens/Forgotpassword';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Converterdetails from '../screens/Converterdetails';
import Shopping from '../screens/Shopping';
import Editlot from '../screens/Editlot';
import Lotvaluereport from '../screens/Lotvaluereport';
import Calculator from '../screens/Calculator';
import Settings from '../screens/Settings';
import Contact from '../screens/Contact';
import Profile from '../screens/Profile';
import Terms from '../screens/Terms';
import Resetpassword from '../screens/Resetpassword';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import Testing from '../screens/Testing/Testing';
import {Platform} from 'react-native';

const RootStack = createStackNavigator({
  splash: {screen: Splash, navigationOptions: {header: () => false}},

  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {header: () => false},
  },
  otp: {screen: OTP, navigationOptions: {header: () => false}},
  home: {
    screen: Home,
    navigationOptions: {
      header: () => false,
      gestureEnabled: Platform.OS == 'ios' && false,
    },
  },
  login: {screen: Login, navigationOptions: {header: () => false}},
  signup: {screen: Signup, navigationOptions: {header: () => false}},
  forgotpassword: {
    screen: Forgotpassword,
    navigationOptions: {header: () => false},
  },
  resetpassword: {
    screen: Resetpassword,
    navigationOptions: {header: () => false},
  },
  search: {screen: Search, navigationOptions: {header: () => false}},
  converterdetails: {
    screen: Converterdetails,
    navigationOptions: {header: () => false},
  },
  shopping: {screen: Shopping, navigationOptions: {header: () => false}},
  editlot: {screen: Editlot, navigationOptions: {header: () => false}},
  lotvaluereport: {
    screen: Lotvaluereport,
    navigationOptions: {header: () => false},
  },
  calculator: {screen: Calculator, navigationOptions: {header: () => false}},
  settings: {screen: Settings, navigationOptions: {header: () => false}},
  contact: {screen: Contact, navigationOptions: {header: () => false}},
  profile: {
    screen: Profile,
    navigationOptions: {
      header: () => false,
      gestureEnabled: Platform.OS == 'ios' && false,
    },
  },
  terms: {screen: Terms, navigationOptions: {header: () => false}},
  Testing: {screen: Testing, navigationOptions: {header: () => false}},
});

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;
