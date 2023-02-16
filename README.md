# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

# Deployement Process

For createing new build for android
step 1 - Make sure you selected LIVE/UAT url for creating a build
step 2 - cd ios && pod install
step 3 - in terminal hit command : react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
step 4 - in terminal hit command : cd android && ./gradlew assembleDebug

For createing new build for IOS
step 1 - Make sure you selected LIVE/UAT url for creating a build
step 2 - Add the +1 in latest version number from Xcode
step 3 - In Xcode select Product -> Archive(it will take some time to success build) -> distrubute app -> Kepp proceed with next till Upload
step 4 - Go to testflight -> select Manage -> select "No" 
