import {NavigationActions, StackActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigateWithClearStack(routeName, params) {
    _navigator.dispatch(StackActions.reset({
        index: 0, actions: [NavigationActions.navigate({ routeName, params })]
    })
)}
  
function navigate(routeName, params) {
    _navigator.dispatch(
      StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName, params })]
    })
    )
}  

export default {
  navigate,
  setTopLevelNavigator,
};