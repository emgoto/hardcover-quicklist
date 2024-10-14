export const addBookToList = async (
  bookId: number,
  listId: number,
  apiKey: string,
) => {
  const query = `mutation addBookToList($bookId: Int!, $listId: Int!)
        {
            insert_list_book(object: {book_id: $bookId, list_id: $listId}) {
                id
            }
        }
    `;

  const variables = {
    bookId,
    listId,
  };

  return fetch("https://api.hardcover.app/v1/graphql", {
    headers: {
      "content-type": "application/json",
      authorization: apiKey,
    },
    body: JSON.stringify({ query, variables, operationName: "addBookToList" }),
    method: "POST",
  }).then((response) => response.json());
};
