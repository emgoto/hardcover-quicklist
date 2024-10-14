import { ChangeEvent, useState } from "react";
import { getUsernameAndLists, type List } from "../api/get-user-lists";

export const UserLists = ({
  setList,
  setUsername,
  apiKey,
}: {
  setList: (list: List) => void;
  setUsername: (username?: string) => void;
  apiKey: string | undefined;
}) => {
  const [userLists, setUserLists] = useState<List[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickFetch = () => {
    setIsLoading(true);
    apiKey &&
      getUsernameAndLists(apiKey).then((data) => {
        setUserLists(data?.lists);
        setUsername(data?.username);
        if (data?.lists && data.lists.length > 0) {
          setList(data.lists[0]);
        }
        setIsLoading(false);
      });
  };

  const onChangeSelectOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const listId = Number(event.target.value);
    const list = userLists?.find((list) => list.id === listId);

    if (!list) return;
    list && setList(list);
  };

  return (
    <>
      <div className="userLists">
        <button disabled={!apiKey} onClick={onClickFetch}>
          Fetch all your lists
        </button>
        {!isLoading && userLists && (
          <select onChange={onChangeSelectOption}>
            {userLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        )}
        {isLoading && <span>Fetching...</span>}
      </div>
      {userLists && userLists.length === 0 && (
        <span className="info">We couldn't find any lists.</span>
      )}
    </>
  );
};
