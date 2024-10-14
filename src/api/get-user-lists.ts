export type List = {
  id: number;
  name: string;
  slug: string;
};

type ListsApiResponse = {
  data: {
    me: [
      {
        username: string;
        lists: List[];
      },
    ];
  };
};

export const getUsernameAndLists = async (
  apiKey: string,
): Promise<{ username: string; lists: List[] } | undefined> => {
  const query = `
        {
            me {
                username
                lists (order_by: { created_at: desc}) {
                    id
                    name
                    slug
                }
            }
            }
    `;

  return fetch("https://api.hardcover.app/v1/graphql", {
    headers: {
      "content-type": "application/json",
      authorization: apiKey,
    },
    body: JSON.stringify({ query }),
    method: "POST",
  })
    .then((response) => response.json())
    .then(({ data }: ListsApiResponse) => {
      return { username: data.me[0].username, lists: data.me[0].lists };
    });
};
