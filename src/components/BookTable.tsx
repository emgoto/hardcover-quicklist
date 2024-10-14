import { type ApiBook, type ApiCache } from "../api/find-book";
import { ImportBook } from "../types";

const FoundBook = ({ book }: { book?: ApiBook }) => {
  if (!book) return <></>;

  return (
    <div className="foundBook">
      {book.image && (
        <img
          src={book.image}
          alt={`Book cover for ${book.title}`}
          height="60px"
        />
      )}
      <a
        href={`https://hardcover.app/books/${book.slug}`}
        target="_blank"
        rel="noreferrer"
      >
        {book.title} by {book.author}
      </a>
    </div>
  );
};

export const BookTable = ({
  importBooks,
  apiBooks,
  removeBook,
}: {
  importBooks: ImportBook[];
  apiBooks?: ApiCache;
  removeBook: (bookTitle: string) => void;
}) => {

  return (
    <div>
      <h2>Books</h2>
      <p className="info">
        Once you have a list of books from step 3, you can populate this table with
        Hardcover's API in step 4.
      </p>
      <p className="info">
        If the book is not what you are expecting, you can remove it from the
        list, or modify the title/author in Step 3 and re-do Step 4.
      </p>
      <p className="info">Note this table will max out at 25 books.</p>
      {importBooks.length > 0 && <table>
        <tbody>
          <tr>
            <th>Your books</th>
            <th>Book from Hardcover</th>
            <th>Remove from list</th>
          </tr>
          {importBooks.map(({ title, author }) => (
            <tr key={`book-${title}`}>
              <td width="200" height="80">
                {title} {author && `by ${author}`}
              </td>
              <td width="300">
                {apiBooks && <FoundBook book={apiBooks[title]?.apiBook} />}
              </td>
              <td>
                {<button onClick={() => removeBook(title)}>Remove</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};
