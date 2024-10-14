import { ImportBook } from "../types";

export type ApiBook = {
  id: number;
  title: string;
  author: string;
  slug: string;
  image?: string;
};

export type ApiCache = {
  [bookName: string]: {
    author?: string;
    apiBook?: ApiBook | undefined;
  };
};

type BooksApiResponse = {
  data: {
    books: {
      id: number;
      title: string;
      slug: string;
      cached_contributors: {
        author: {
          name: string;
        };
      }[];
      image?: {
        url: string;
      };
    }[];
  };
};

export const findBook = async (
  book: ImportBook,
  apiKey: string,
): Promise<
  { title: string; author?: string; apiBook: ApiBook } | undefined
> => {
  const filterQuery = book.author
    ? `{_and: [{title: {_ilike:  "%${book.title}%"}}, {contributions: {author: {name: {_ilike: "%${book.author}%"}}}}]}`
    : `{title: {_ilike: "%${book.title}%"}}`;
  const query = `
        {
            books(
                order_by: {users_read_count: desc}
                where: ${filterQuery}
                limit: 1
            ) {
                id
                slug
                title
                image {
                    url
                }
                cached_contributors
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
    .then(({ data }: BooksApiResponse) => {
      if (!data || !data.books || data.books.length === 0) {
        console.log("Failed to find book for ", book.title);
        return undefined;
      }
      const { id, title, image, cached_contributors, slug } = data.books[0];

      return {
        title: book.title,
        author: book.author,
        apiBook: {
          id,
          title,
          image: image?.url,
          author: cached_contributors[0].author.name,
          slug,
        },
      };
    });
};
