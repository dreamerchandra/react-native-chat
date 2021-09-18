import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app'

const messageParentId = (id1, id2) =>  [id1, id2].sort().join('--');

const ref = {
  //TODO: check collectionGroup vs collection
  myChat: (myId) => firestore().collectionGroup('message').where('participants', 'array-contains', myId).orderBy('createdAt'),
  sendChat: (myId, otherId) => firestore().collection('Chat').doc(messageParentId(myId, otherId)).collection('message')
}


export const serverTimeStampToLocalTimeStamp = (serverTimeStamp) => `${serverTimeStamp?.toDate?.() ?? new Date()}`;

export function convertFirestoreTimestampToDate (firebaseData, timestampKey = ["createdAt", 'modifiedAt']) {
  let result = {
    ...firebaseData
  }
  timestampKey.forEach((key) => {
    result[key] = serverTimeStampToLocalTimeStamp(result[key])
  })
  return result;
}

export function getServerTimeStamp () {
  return firebase.firestore.FieldValue.serverTimestamp()
}

export function getMyId () {
  return 'test'
}
export { firestore, ref }