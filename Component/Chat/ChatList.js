import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, FlatList, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { chatIdSelector, chatSelector, isChatContinued } from './chat-slice';
import { getMyId } from '../../src/firebase/firebase';
import chatManager from '../../src/firebase/chatManager';
  
const dateToHoursMin = (dateStr) => {
  const date = new Date(dateStr);
  const isAm = date.getHours() % 12 === date.getHours()
  const hours = date.getHours() % 12;
  const mins = date.getMinutes();
  return `${hours}:${mins} ${isAm ? 'am' : 'pm'}`
}

const changeServerTimeStampToRenderFormat = (data, timeKey = 'createdAt') => {
  return {
    ...data,
    [timeKey]: dateToHoursMin(data[timeKey])
  }
}

const Chat = ({ id, userId }) => {

  const chat = useSelector(chatSelector({ chatId: id, otherId: userId }));
  const isContinued = useSelector(isChatContinued({ chatId: id, otherId: userId }));
  const myId = getMyId()

  const { message, createdAt, createdBy } = changeServerTimeStampToRenderFormat(chat)
  useEffect(() => {
    console.log(`got chat for  ${id} is chat ${JSON.stringify({ message, createdAt, createdBy })}`)
  }, [message, createdAt, createdBy, id])

  let rootStyle = createdBy === myId ? styles.my : styles.their;
  rootStyle = isContinued ? StyleSheet.compose(rootStyle, styles.continued) : rootStyle;
  return (
    <View style={rootStyle}>
      <Text style={styles.msg}>{message}</Text>
      <Text style={styles.info}>{createdAt}</Text>
    </View>
  )
}

const SendMsg = ({ userId }) => {

  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const myId = getMyId();

  const onSend = () => {
    chatManager.sendMessage(dispatch, {
      message,
      myId,
      otherId: userId
    })
    setMessage('')
  }

  return (
    <View style={styles.inputRoot}>
      <TextInput
        onChangeText={setMessage}
        value={message}
        style={{
          maxHeight: 40,
          width: '80%',
          borderColor: 'gray',
          borderWidth: 1,
          marginRight: 10,
          borderRadius: 10,
          flexGrow: 1,
        }} />
      <Button title="Send" onPress={onSend}>Send</Button>
    </View>
  )
}


export default function ChatList ({ navigation, route }) {
  const { userId } = route.params;
  const chatIds = useSelector(chatIdSelector(userId))

  useEffect(() => {
    console.log('chat list ', JSON.stringify(chatIds));
  }, [chatIds])

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={chatIds}
          renderItem={({ item }) => (<Chat id={item} userId={userId} />)}
          keyExtractor={(item) => item}
        />
      </SafeAreaView>
      <SendMsg userId={userId}/>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FCD2D1',
    padding: 15,
    flexGrow: 1,
  },
  my: {
    alignSelf: 'flex-end',
    marginTop: 2,
    maxWidth: '95%',
    borderRadius: 15,
    backgroundColor: '#add8e6',
    borderTopRightRadius: 0,
    padding: 10,
  },
  their: {
    alignSelf: 'flex-start',
    marginTop: 2,
    maxWidth: '95%',
    borderRadius: 15,
    backgroundColor: '#ffff',
    padding: 10,
    borderTopLeftRadius: 0,
  },
  msg: {
    fontSize: 13,
  },
  info: {
    textAlign: 'right',
    fontSize: 10,
    opacity: 0.5,
    margin: 0,
    paddingVertical: 3,
  },
  continued: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  inputRoot: {
    display: 'flex',
    flexDirection: 'row',
  }
});
