import { useState } from "react";
import { findBook, type ApiCache } from "../api/find-book";
import { ImportBook } from "../types";

export const FindBooks = ({
  apiKey,
  importBooks,
  apiBooks,
  setApiBooks,
}: {
  apiKey?: string;
  importBooks?: ImportBook[];
  apiBooks?: ApiCache;
  setApiBooks: (books: ApiCache) => void;
}) => {
  const canSearch = apiKey && importBooks && importBooks.length > 0;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();

  const onClick = async () => {
    if (canSearch) {
      const ignoreAlreadyCachedBooks = importBooks.filter((book) => {
        if (!apiBooks) return true;
        // We don't want to re-fetch from Hardcover's API if we've already found the book
        if (apiBooks[book.title]) {
          // If the user's made a modification to the author's name, we want to refetch the book
          if (apiBooks[book.title].author !== book.author) {
            return true;
          }
          return false;
        }
        return true;
      });

      if (ignoreAlreadyCachedBooks.length === 0) {
        setMessage("All books have already been fetched.");
        return;
      }

      setMessage(undefined);
      setIsLoading(true);
      const books = await Promise.all(
        ignoreAlreadyCachedBooks.map((book) => findBook(book, apiKey)),
      );
      const booksMap: ApiCache = {};
      books.forEach((book) => {
        if (book) {
          const { title, ...rest } = book;
          booksMap[title] = rest;
        }
      });
      setApiBooks(booksMap);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button disabled={!canSearch} onClick={onClick}>
        Find books in Hardcover
      </button>
      {isLoading && <span>Fetching...</span>}
      {message && <span>{message}</span>}
    </>
  );
};
