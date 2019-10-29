import axios from 'axios';
import {createEffect} from "effector";
import {ssrDomain} from "./ssr";

const HOST = 'https://jsonplaceholder.typicode.com';

export const getUser = createEffect({
  handler: async (id) => {
    console.log('REQUEST for user', id);
    const {data} = await axios.get(`${HOST}/users/${id % 10 + 1}`);
    return data;
  }
});

export const $user = ssrDomain.store(null);

$user.on(getUser.done, (state, {result}) => result);
