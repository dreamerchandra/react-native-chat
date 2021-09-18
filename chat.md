{
  <user-id>: {
    private: {
      encryptionKey: String,
    }
  }
  <Chat>: {
    <sort(<id1, id2>)>: {
      <message>: {
         <msg1>: {
          message: String,
          createdAt: <timestamp>,
          createdBy: <user-id>,
          isDeleted: yes,
          readBy: Array<userid1, userid2>,
          isRead: <bool>,
          modifiedAt: <timestamp>,
          participants: Array<userId1, userId2>,
          delivered: Array<userId1, userId2>
        }
      }
    }
  }
}


once app is opened
 - Get all the matches user
 - Listen for update with Query with `participants` fields which includes my id in chat sub collection
 - In the chat user list view do decent sort by modified at field 
 - In the chat list view do decent sort by created at field


While listening for chat 
-> firebase -> redux -> react
                     -> storage
While making an update
-> react -> redux -> storage
                  -> firebase