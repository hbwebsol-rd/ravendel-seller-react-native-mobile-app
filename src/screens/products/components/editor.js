import React, {useRef, useState, useEffect, useMemo} from 'react';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Keyboard,
} from 'react-native';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';

const Editor = ({data, onEditorChange}) => {
  const EditorRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [editorHeight, setEditorHeight] = useState(150);
  const themeBg = {backgroundColor: Colors.primaryColor};

  const insertHTML = () => {
    EditorRef.current?.insertHTML(
      '<span style="color: blue; padding:0 10px;">HTML</span>',
    );
  };

  useEffect(() => {
    console.log('running now', data);
    EditorRef.current?.insertHTML(data);
  }, []);

  const handleChange = html => {
    onEditorChange(html);
  };

  const handleHeightChange = height => {
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
      <KeyboardAvoidingView behavior={'position'} enabled>
        <View style={{height: editorHeight}}>
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
