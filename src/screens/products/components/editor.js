import React, {useRef, useState, useEffect, useMemo} from 'react';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {isEmpty} from '../../../utils/helper';

const Editor = ({data, onEditorChange, edit}) => {
  const EditorRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [editorHeight, setEditorHeight] = useState(150);
  const themeBg = {backgroundColor: Colors.primaryColor};
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const insertHTML = () => {
    EditorRef.current?.insertHTML('');
  };

  useEffect(() => {
    if (!edit && !isKeyboardVisible) {
      console.log('Data change just NOW', data);
      // EditorRef.current?.insertHTML('');
      EditorRef.current?.setContentHTML(data);
    }
  }, [data]);

  const handleChange = html => {
    onEditorChange(html);
  };

  const handleHeightChange = height => {
    console.log(height);
    setEditorHeight(height);
  };
  useEffect(() => {
    if (disabled) {
      setTimeout(() => {
        setDisabled(false);
      }, 500);
    }
  }, [disabled]);

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? '' : null}
        enabled>
        <View style={{minHeight: 150}}>
          {!isEmpty(data) && edit ? (
            <RichEditor
              editorStyle={{backgroundColor: '#eee'}}
              ref={EditorRef}
              disabled={disabled}
              placeholder={'Please enter description'}
              initialContentHTML={data}
              onChange={handleChange}
              onHeightChange={handleHeightChange}
              style={{flex: 1}}
              useContainer={true}
            />
          ) : !edit ? (
            <RichEditor
              editorStyle={{backgroundColor: '#eee'}}
              ref={EditorRef}
              disabled={disabled}
              placeholder={'Please enter description'}
              initialContentHTML={data}
              onChange={handleChange}
              onHeightChange={() => handleHeightChange()}
              style={{flex: 1}}
              useContainer={true}
            />
          ) : null}
        </View>
        <RichToolbar
          style={[styles.richBar, themeBg]}
          editor={EditorRef}
          disabled={disabled}
          iconTint={'#ddd'}
          selectedIconTint={'#0F0'}
          disabledIconTint={'#8b8b8b'}
          iconSize={35}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            'customAction',
          ]}
          iconMap={{
            customAction: () => (
              <View style={{marginLeft: 10}}>
                <Icon name="check" color="#4caf50" size={18} />
              </View>
            ),
          }}
          insertHTML={insertHTML}
          customAction={() => {
            setDisabled(true);
            Keyboard.dismiss();
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    // paddingHorizontal: 15
  },

  input: {
    flex: 1,
  },

  tib: {
    textAlign: 'center',
    color: '#515156',
  },
});

export default Editor;
