import React, { useEffect, useState } from 'react';
import './chat.css';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/slice';
import Picker from 'emoji-picker-react'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; 


interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface Message {
  text: string;
  sender: 'me' | 'other';
}

const Chat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };

  const getPost = async () => {
    const postCol = collection(db, 'auth');
    const postSnapshot = await getDocs(postCol);
    const postList = postSnapshot.docs.map(doc => doc.data());
    setUsers(postList);
  };

  useEffect(() => {
    getPost();
  }, []);

  const currUser = useSelector((state: RootState) => state.currUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // User info popup state
  const [showUserInfo, setShowUserInfo] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: 'me' }]);
    setMessage('');
  };

  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="top-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton onClick={() => setShowUserInfo(true)}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <span className="username">{currUser?.name}</span>
        </div>

        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </div>

      <Dialog open={showUserInfo} onClose={() => setShowUserInfo(false)}>
        <DialogTitle>User Info</DialogTitle>
        <DialogContent>
           <p><strong>Name:</strong> {currUser?.name || 'N/A'}</p>
    <p><strong>Email:</strong> {currUser?.email || 'N/A'}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="bottom">
        <div className="left">
          <div className="chat-title">Chats</div>
          {users.map(user => (
            <div
              key={user.id}
              className={`chat-user ${selectedUser?.id === user.id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.email}
            </div>
          ))}
        </div>

        <div className="right">
          {selectedUser ? (
            <>
              <div className="chat-header">{selectedUser.email}</div>

              <div className="chat-body">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <InsertEmoticonIcon />
                </IconButton>

                {showEmojiPicker && (
                  <div style={{ position: 'absolute', bottom: '60px', left: '10px', zIndex: 1000 }}>
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <IconButton onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </div>
            </>
          ) : (
            <div className="empty-chat">Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
