import {View, Text, SafeAreaView, StyleSheet, Linking} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const Testing = (props) => {
  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    onPageLoad();
  }, []);

  const onPageLoad = () => {
    requiredCameraPermission();
  };
  
  const devices = useCameraDevices();
  const device = devices.back;

  const requiredCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission == 'denied') await Linking.openSettings();
  }, []);

  function renderCamera() {
    if (device !== null) {
      <View style={{flex: 1}}>
        <Camera
          style={{flex: 1}}
          device={device}
          isActive={true}
          enableZoomGesture
        />
      </View>;
    }
  }
  return (
    <SafeAreaView>
      <View>
        <Text>ScanningQr</Text>
      </View>
      {renderCamera()}
    </SafeAreaView>
  );
  const styles = StyleSheet.create({
    container: {},
  });
};
export default Testing;
