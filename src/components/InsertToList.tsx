import { useState } from "react";
import { addBookToList } from "../api/add-book-to-list";
import { ApiBook, ApiCache } from "../api/find-book";
import { List } from "../api/get-user-lists";
import { ImportBook } from "../types";

// API seems to die if you try and add 2 books to the list at once (fair enough)
let delay = -1000;
const delayIncrement = 1000;

export const InsertToList = ({
  list,
  importBooks,
  apiBooks,
  apiKey,
  username,
}: {
  list?: List;
  importBooks?: ImportBook[];
  apiBooks?: ApiCache;
  apiKey?: string;
  username?: string;
}) => {
  const [successfullyAddedBooks, setSuccessfullyAddedBooks] = useState<
    number | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (!importBooks || !apiBooks || !list || !apiKey) return null;

  const booksToAdd: ApiBook[] = [];
  importBooks.forEach((importBook) => {
    const book: ApiBook | undefined = apiBooks[importBook.title]?.apiBook;
    book && booksToAdd.push(book);
  });
  if (booksToAdd.length === 0) return null;

  const addBooksToList = async () => {
    const promises = booksToAdd.map((book) => {
      if (!book?.id) return null;
      delay += delayIncrement;
      return new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => addBookToList(book.id, list.id, apiKey))
        .then(
          (response) =>
            response &&
            setSuccessfullyAddedBooks((count) =>
              count ? (count += 1) : (count = 1),
            ),
        );
    });

    const results = await Promise.all(promises);

    const successCount = results.filter((result) => result !== null);
    setSuccessfullyAddedBooks(successCount.length);
    setIsLoading(false);
  };

  const onClick = () => {
    setIsLoading(true);
    setSuccessfullyAddedBooks(undefined);
    addBooksToList();
  };

  return (
    <>
      <p className="info">
        If you add the wrong books, you will have to manually delete them from
        the list.
      </p>
      <p className="info">
        I recommend trying this out on a test list first!
      </p>
      <button onClick={onClick} disabled={isLoading}>
        Add {booksToAdd.length} book(s) to "{list.name}"
      </button>
      {isLoading && <span>Adding books...</span>}
      {successfullyAddedBooks && (
        <span>Added {successfullyAddedBooks} book(s)</span>
      )}
      {!isLoading && successfullyAddedBooks && username && (
        <span>
          {" "}
          to{" "}
          <a
            href={`https://hardcover.app/@${username}/lists/${list.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            {list.name}
          </a>
        </span>
      )}
    </>
  );
};
