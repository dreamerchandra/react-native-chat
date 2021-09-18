import React, { useEffect } from 'react';
import { StyleSheet, FlatList, Text, StatusBar, SafeAreaView } from 'react-native';
import UserInfo from './UserInfo';
import { useSelector, useDispatch } from 'react-redux'
import { userListSelector } from './chat-slice'
import chatManager from '../../src/firebase/chatManager';
import { getMyId } from '../../src/firebase/firebase';


export default function Chat ({ navigation }) {

  const userList = useSelector(userListSelector)
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`user list loading`, userList);
  }, [userList])

  useEffect(() => {
    chatManager.listenForIncomingMessage(getMyId(), dispatch)

    return chatManager.unSubscribeForIncomingMessage;
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userList}
        renderItem={({ item }) => (<UserInfo name={item.name} lastMessage={item.lastMessage} onPress={() => navigation.navigate('ChatList', { name: item.name, userId: item.id }) }/>)}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
});
