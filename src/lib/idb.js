import { get, set, del } from 'idb-keyval';

// Keys
const CONVERSATIONS_KEY = 'kisanai_conversations';
const OFFLINE_QUEUE_KEY = 'kisanai_offline_queue';

// Conversations
export const saveConversations = async (conversations) => {
  try {
    await set(CONVERSATIONS_KEY, conversations);
  } catch (error) {
    console.error('Error saving conversations to IndexedDB', error);
  }
};

export const getConversations = async () => {
  try {
    const val = await get(CONVERSATIONS_KEY);
    return val || [];
  } catch (error) {
    console.error('Error getting conversations from IndexedDB', error);
    return [];
  }
};

// Offline Actions Queue
export const saveOfflineAction = async (action) => {
  try {
    const queue = await getOfflineQueue();
    queue.push(action);
    await set(OFFLINE_QUEUE_KEY, queue);
  } catch (error) {
    console.error('Error saving offline action', error);
  }
};

export const getOfflineQueue = async () => {
  try {
    const val = await get(OFFLINE_QUEUE_KEY);
    return val || [];
  } catch (error) {
    console.error('Error getting offline queue', error);
    return [];
  }
};

export const clearOfflineQueue = async () => {
  try {
    await del(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing offline queue', error);
  }
};

export const removeOfflineAction = async (actionId) => {
  try {
    let queue = await getOfflineQueue();
    queue = queue.filter(action => action.id !== actionId);
    await set(OFFLINE_QUEUE_KEY, queue);
  } catch (error) {
    console.error('Error removing offline action', error);
  }
};
