import React from 'react';
import {useStore} from "effector-react";
import {$user, getUser} from "../stores/user";
import {useSsrEffect} from "../stores/ssr";

export const App = () => {
  const [userId, setUserId] = React.useState(1);

  return (
    <>
      <button onClick={() => setUserId(userId + 1)}>
        Next user
      </button>
      <User id={userId}/>
    </>
  );
};


export const User = ({id}) => {
  useSsrEffect(async () => {
    await getUser(id);
  }, [id]);

  const user = useStore($user);

  return user ? (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  ) : null;
};
