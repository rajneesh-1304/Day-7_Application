import { CreateUserData, GetChatsData, SendMessageData, SendMessageVariables, ListUsersData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useGetChats(options?: useDataConnectQueryOptions<GetChatsData>): UseDataConnectQueryResult<GetChatsData, undefined>;
export function useGetChats(dc: DataConnect, options?: useDataConnectQueryOptions<GetChatsData>): UseDataConnectQueryResult<GetChatsData, undefined>;

export function useSendMessage(options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;
export function useSendMessage(dc: DataConnect, options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
