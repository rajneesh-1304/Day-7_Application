import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ChatMembership_Key {
  chatId: UUIDString;
  userId: UUIDString;
  __typename?: 'ChatMembership_Key';
}

export interface Chat_Key {
  id: UUIDString;
  __typename?: 'Chat_Key';
}

export interface Contact_Key {
  user1Id: UUIDString;
  user2Id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface GetChatsData {
  chats: ({
    id: UUIDString;
    name?: string | null;
    type: string;
  } & Chat_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    displayName: string;
  } & User_Key)[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface SendMessageData {
  message_insert: Message_Key;
}

export interface SendMessageVariables {
  chatId: UUIDString;
  content: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface GetChatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetChatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetChatsData, undefined>;
  operationName: string;
}
export const getChatsRef: GetChatsRef;

export function getChats(): QueryPromise<GetChatsData, undefined>;
export function getChats(dc: DataConnect): QueryPromise<GetChatsData, undefined>;

interface SendMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  operationName: string;
}
export const sendMessageRef: SendMessageRef;

export function sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;
export function sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

