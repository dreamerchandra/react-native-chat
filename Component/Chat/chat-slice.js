import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  snap: {},
  msgIds: {},
  userListInfo: [], // https://codesandbox.io/s/object-in-same-reducer-226cl?file=/src/Counter.js having peers in different store doesn't improve performance
}

const getUpdatedUserList = (state, otherId, lastMessage) => {
  const userListWithoutOtherId = state?.userListInfo?.filter(info => info.id !== otherId) ?? []
  const userInfo = {
    id: otherId,
    lastMessage
  }
  return [userInfo, ...userListWithoutOtherId];
}

const updateMessage = (state, payload) => {
  const { firestoreData, otherId, msgId, inFlight, error } = payload;
  if (!state.snap[otherId]) state.snap[otherId] = {};
  state.snap[otherId][msgId] = { ...firestoreData, inFlight, error };
  if (!state.msgIds[otherId]) state.msgIds[otherId] = [];
  if (!state.msgIds[otherId].includes(msgId)) state.msgIds[otherId].push(msgId);
  state.userListInfo = getUpdatedUserList(state, otherId, firestoreData.message)
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    updateIncomingMessage (state, { payload }) {
      updateMessage(state, { ...payload, inFlight: false, error: null });
    },

    updateOutgoingMessage (state, { payload }) {
      updateMessage(state, payload);
    }
  },
})

export const { updateIncomingMessage, updateOutgoingMessage } = chatSlice.actions

export const userListSelector = store => store.chat.userListInfo
export const chatIdSelector = userId => store => store.chat.msgIds[userId]
export const chatSelector = ({ chatId, otherId }) => store => store.chat.snap?.[otherId]?.[chatId]


export const isChatContinued = ({ chatId, otherId }) => store => {
  const chatInfo = store.chat.snap?.[otherId]?.[chatId];
  if (!chatInfo) return;
  const chatSendBy = chatInfo.createdBy;
  const preChatIndex = store.chat.msgIds[otherId].indexOf(chatId) - 1;
  if (preChatIndex < 0) return;
  const preChatId = store.chat.msgIds[otherId][preChatIndex]
  const preChatInfo = store.chat.snap?.[otherId]?.[preChatId];

  if (!preChatInfo) return;
  const preChatSendBy = preChatInfo.createdBy;
  return preChatSendBy === chatSendBy;
}
export default chatSlice.reducer