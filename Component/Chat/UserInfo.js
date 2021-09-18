import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function UserInfo ({
  name,
  lastMessage,
  onPress = console.log,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <View
        style={styles.userInfo}
      >
        <Image source={{ uri: "https://picsum.photos/200", width: 70, height: 70 }} style={styles.image}/>
        <View>
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
          <Text numberOfLines={1} style={styles.message}>{lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 2,
    padding: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    margin: 5,
  },
  name: {
    fontSize: 14,
  },
  message: {
    fontSize: 10,
  },
});