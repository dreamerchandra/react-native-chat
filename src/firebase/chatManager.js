import { ref, convertFirestoreTimestampToDate, getServerTimeStamp } from "./firebase"
import { updateIncomingMessage, updateOutgoingMessage } from "../../Component/Chat/chat-slice"
import { getMyId } from "./firebase"
import { serverTimeStampToLocalTimeStamp } from "./firebase"

class ChatManager {

  updateRedux = (dispatch, { firestoreData, otherId, msgId }) => {
    dispatch(updateIncomingMessage({ firestoreData, otherId, msgId }))
  }

  listenForIncomingMessage = (myId, dispatch) => {
    console.log('starting to listen for updates')
    this.removeIncomingListener = ref.myChat(myId).onSnapshot((querySnap) => {
      if (!querySnap) return
      querySnap.docChanges().forEach((change) => {
        const firestoreData = {
          ...convertFirestoreTimestampToDate(change.doc.data()),
          id: change.doc.id,
        }
        const removeMyId = (id) => id !== myId
        const [otherId] = firestoreData.participants.filter(removeMyId)
        const msgId = change.doc.id;
        console.log(`an update from ${otherId} and the update is: ${JSON.stringify(firestoreData)}`)
        this.updateRedux(dispatch, { firestoreData, otherId, msgId })
      })

    })
  }

  unSubscribeForIncomingMessage = () => {
    console.log('unsubscribing from firebase')
    return this.removeIncomingListener();
  }

  sendMessage = (dispatch, { message, otherId, myId, messageId }) => {
    const snap = this.toFirestore({
      message,
      otherId,
      senderId: getMyId(),
    });
    const msgRef = ref.sendChat(myId, otherId).doc(messageId)
    const reduxData = () => ({
      firestoreData: {
        ...snap,
        createdAt: serverTimeStampToLocalTimeStamp(snap.createdAt),
        modifiedAt: serverTimeStampToLocalTimeStamp(snap.modifiedAt),
        id: msgRef.id,
      },
      otherId,
      msgId: msgRef.id
    })
    const toRedux = ({ inFlight, error }) => dispatch(updateOutgoingMessage({ ...reduxData(), inFlight, error }))
    toRedux({ inFlight: true, error: null });
    msgRef
      .set(snap)
      .then(() => toRedux({ inFlight: false, error: null }))
      .catch((error) => {
        console.log(`firebase data sending error to ${otherId} and err is ${error}`)
        toRedux({ inFlight: false, error });
      })
  }

  toFirestore = ({ message, createdAt = getServerTimeStamp(), senderId: createdBy, otherId }) => {
    return {
      message,
      createdAt,
      createdBy,
      readBy: [createdBy],
      isRead: false,
      modifiedAt: getServerTimeStamp(),
      participants: [createdBy, otherId],
      delivered: [createdBy],
    }
  }

}

export default new ChatManager()