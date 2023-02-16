import React, {useState} from 'react';
import {Modal , View , Text} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HelperFonts from '../Helper/HelperFonts';
import R from '../resources/R';

const ImageSlider = props => {
  const {imageArr, extraMethodCall , displayImageTitleName , displayIndex} = props;
  const [modalState, setModalState] = useState(true);

  const visibleModal = () => {
    setModalState(!modalState);
  };

  return (
    <Modal
      visible={modalState}
      statusBarTranslucent={true}
      transparent={true}
      onRequestClose={() => {
        visibleModal(false);
        extraMethodCall();
      }}>
      <>
        
      <AntDesign
        style={{top: 80, zIndex: 999, alignSelf: 'flex-end', marginRight: 10, }}
        name={'closecircle'}
        size={30}
        color={'#fff'}
        onPress={() => extraMethodCall()}
        />
        {displayImageTitleName && (
        <View style={{backgroundColor : R.colors.blue , paddingHorizontal:10 , paddingVertical:15}}  >  
        <Text style={[{color : "#fff" ,fontSize:18},HelperFonts.font_W_Bold]}  >{displayImageTitleName}</Text>
        </View>
        )}
      <ImageViewer imageUrls={imageArr} index={displayIndex} />
      </>
    </Modal>
  );
};

export default ImageSlider;
