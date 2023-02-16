const WebUrls = {
  url: {
    //Production//
    TOKEN_URL: 'https://petramobileapi.petra.net/',
    BASE_URL: 'https://petramobileapi.petra.net/api/',

    // UAT
    // TOKEN_URL: 'https://uatpetramobileapi.petra.net/',
    // BASE_URL: 'https://uatpetramobileapi.petra.net/api/',

    //Common API URL
    getCarrierList: 'Common/GetCarrierList',
    getManufacturerList: 'Common/GetManufacturerList',
    getMakeList: 'Common/GetMakeList',
    getCurrencyList: 'Common/GetCurrencyList',
    getCountryList: 'Common/GetCountryList',

    //API URL
    getSignUpPageDefaults: 'RegisterUser/GetRegisterUserInfoPageDefaults',
    submitSignUp: 'RegisterUser/SubmitRegisterUserInfo',

    validateUser: 'Account/ValidateUser',
    login: 'token',
    submitOTP: 'Account/SubmitOTP',
    resendOTP: 'Account/ResendOTP',

    submitForgetPassword: 'Account/SubmitForgetPassword',
    submitResetPassword: 'Account/SubmitResetPassword',

    getMembershipUserAccess: 'Account/GetUserAccess',

    getProfilePageDefaults: 'Account/GetProfilePageDefault',
    submitProfile: 'Account/SubmitProfile',

    submitChangePassword: 'Account/SubmitChangePassword',
    getTermsPageDefaults: 'Account/GetTermOfUsePageDefaults',
    submitTerms: 'Account/SubmitTermsAgreed',

    getConverterSearchPageDefaults:
      'ManageConverter/GetConverterListPageDefaults',
    updateTokenBalance: 'ManageConverter/UpdateTokenBalance',
    getConverterDetailsPageDefaults:
      'ManageConverter/GetConverterDetailsPageDefaults',
    submitConverterToLot: 'ManageConverter/SubmitConverterToLot',
    updateConverterToLot: 'ManageConverter/UpdateConverterToLot',

    submitCustomConverter: 'ShoppingCart/SubmitCustomConverter',

    getLotListPageDefaults: 'ShoppingCart/GetLotListPageDefault',
    submitLot: 'ShoppingCart/SubmitLot',

    getLotDetails: 'ShoppingCart/GetLotInfo',
    changeLotStatus: 'ShoppingCart/ChangeLotStatus',
    updateLotPrices: 'ShoppingCart/UpdateLotPrices',
    deleteLot: 'ShoppingCart/DeleteLot',
    saveLotConverters: 'ShoppingCart/SubmitLotConverters',
    getCustomConverterDetails: 'ShoppingCart/GetCustomConverterDetails',
    saveCustomConverter: 'ShoppingCart/SubmitCustomConverter',
    deleteLotConverters: 'ShoppingCart/DeleteLotConverter',
    sendLotSummary: 'ShoppingCart/SendLotSummary',
    sendLotValue: 'ShoppingCart/SendLotValueReport',
    downloadLotSummary: 'ShoppingCart/DownloadLotSummary',
    downloadLotValue: 'ShoppingCart/DownloadLotValueReport',

    getLotValueReportPageDefaults: 'ShoppingCart/GetLotValueReport',

    getCalculatorPageDefaults: 'ManageConverter/GetMetalCalculatorPageDefaults',
    submitCalculator: 'ManageConverter/SubmitCalculator',

    getSettingsPageDefaults: 'Settings/GetSettingsPageDefault',
    updateUserDiscount: 'Settings/UpdateUserDiscount',
    updateUserLanguage: 'Settings/UpdateUserLanguage',
    updateUserNumberFormat: 'Settings/UpdateNumberFormat',
    updateUserMetalPrice: 'Settings/UpdateUserMetalPrice',
    resetUserMetalPrice: 'Settings/ResetMetalPrice',
    updateUserCurrencyValue: 'Settings/UpdateCurrencyValue',
    resetUserCurrencyValue: 'Settings/ResetCurrencyValue',

    submitContactUs: 'ContactUs/SaveContactUs',
    newSubmitContactUs: 'ContactUs/NewSaveContactUs',
    getAdminWhatsappNumber: 'Account/WhatsAppNumber',
  },
};

export default WebUrls;
