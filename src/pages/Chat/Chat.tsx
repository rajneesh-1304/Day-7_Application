import React, { useEffect, useRef, useState } from 'react';
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
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, updateDoc, doc, startAt, endAt, startAfter, } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogout as logout } from '../../redux/slice/slice';
import Picker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar } from '@mui/material';
import { serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";



interface Message {
  text: string;
  sender: 'me' | 'other';
}

const Chat = () => {



  const [users, setUsers] = useState<any[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUser = useSelector((state: RootState) => state.currUser);
  const [chatIddd, setChatIddd] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisibleUser, setLastVisibleUser] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const getChatId = (id1: string, id2: string) => {
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  const handleLogout = async () => {
  try {
    if (!currUser) return;

    const userRef = doc(db, "auth", currUser.id);

    await updateDoc(userRef, {
      isOnline: false,
    });

    await signOut(auth);

    dispatch(logout());
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  useEffect(() => {
    if (!currUser) return;

    const userRef = doc(db, "auth", currUser.id);

    updateDoc(userRef, {
      isOnline: true,
    });

    return () => {
      updateDoc(userRef, {
        isOnline: false,
      });
    };
  }, [currUser]);


  useEffect(() => {
    if (!currUser) return;

    const q = collection(db, "auth");

    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id !== currUser.id) list.push(data);
      });
      setUsers(list);
    });

    return () => unsub();
  }, [currUser]);


  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fetchUsers = async (search = '', loadMore = false) => {
    if (!currUser) return;

    setLoadingMore(true);

    let q: any;

    if (search) {
      q = query(
        collection(db, "auth"),
        orderBy("name"),
        startAt(search),
        endAt(search + "\uf8ff"),
        limit(10)
      );
    } else {
      q = query(
        collection(db, "auth"),
        orderBy("name"),
        limit(10),
        ...(lastVisibleUser && loadMore ? [startAfter(lastVisibleUser)] : [])
      );
    }

    const snapshot = await getDocs(q);

    const fetchedUsers: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as any;
      if (data.id !== currUser.id) fetchedUsers.push(data);
    });

    if (loadMore) {
      setUsers(prev => [...prev, ...fetchedUsers]);
    } else {
      setUsers(fetchedUsers);
    }

    setLastVisibleUser(snapshot.docs[snapshot.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    setLastVisibleUser(null);
    fetchUsers(searchTerm, false);
  }, [searchTerm]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;

    if (bottom && !loadingMore) {
      fetchUsers(searchTerm, true);
    }
  };



  const loadMessages = async (receiver: any) => {
    if (!currUser) return;

    setSelectedUser(receiver);
    try {


      const chatId = getChatId(currUser.id, receiver.id);
      setChatIddd(chatId);

      const realTimeMessage = query(collection(db, "chats", chatId, "messages")
      );
      const messages = await getDocs(realTimeMessage);
      console.log('messages: ', messages);

      const msgList: any[] = [];
      messages.forEach((doc) => msgList.push(doc.data()));

      setMessages(msgList);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (!chatIddd) return;

    const q = query(
      collection(db, "chats", chatIddd, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList: any[] = [];
      snapshot.forEach((doc) => {
        msgList.push({ id: doc.id, ...doc.data() });
      });

      setMessages(msgList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatIddd]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !currUser || !chatIddd) return;

    const newMessage = {
      text: message,
      sender: currUser.id,
      receiver: selectedUser.id,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatIddd, "messages"), newMessage);

    setMessage("");

  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="top-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton onClick={handleClick}>
            {currUser?.photoUrl ? (
              <Avatar
                src={currUser.photoUrl}
                alt={currUser.name}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled sx={{ display: 'flex', gap: 1 }}>
              {currUser?.photoUrl && (
                <Avatar
                  src={currUser.photoUrl}
                  alt={currUser.name}
                  sx={{ width: 32, height: 32 }}
                />
              )}
              <strong>{currUser?.name || 'N/A'}</strong>
            </MenuItem>

            <MenuItem disabled>
              {currUser?.email || 'N/A'}
            </MenuItem>

          </Menu>

          <span className="username">{currUser?.name}</span>
        </div>

        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </div>

      <div className="bottom">
        <div className="left" onScroll={handleScroll} style={{ overflowY: 'auto', height: '80vh' }}>
          <div className="chat-title">Chats</div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
      width: '100%',
      margin: '10px auto',
      padding: '5px 10px',
      borderRadius: '15px',
      border: '1px solid gray',
      display: 'block'
    }}
          />

          {users.map(user => (
            <div
              key={user.id}
              className={`chat-user ${selectedUser?.id === user.id ? "active" : ""}`}
              onClick={() => loadMessages(user)}
            >
              <div className="user-row">
                <span>{user.name}</span>
                <span className={`status ${user.isOnline ? "online" : "offline"}`}>
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ))}
        </div>


        <div className="right">
          {selectedUser ? (
            <>
              <div className="chat-header">{selectedUser.name}</div>

              <div className="chat-body">
                {messages.map((msg, index) => {
                  const isMe = msg.sender === currUser?.id;
                  return (
                    <div key={index} className={`ccc${isMe ? "me" : "them"}`}  >
                      <div className="msg">
                        <span className="textt">{msg.text}</span>
                        <span className="times">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
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
