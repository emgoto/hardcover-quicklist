import { ImportBook } from "../types";

interface FormElements extends HTMLFormControlsCollection {
  books: HTMLInputElement;
}
interface FormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const MAX_BOOKS = 25;

const placeholder = `Title,Author
Harry Potter,J.K. Rowling
Dune
Foundation,Isaac Asimov
Ender's Game,Orson Scott Card
"Guns, Germs, and Steel: The Fates of Human Societies", Jared Diamond
`;

export const ImportList = ({
  onSubmit,
}: {
  onSubmit: (books: ImportBook[]) => void;
}) => {
  const onSubmitBooks = (event: React.FormEvent<FormElement>) => {
    event.preventDefault();

    const books = event.currentTarget.elements.books.value;

    // Split text on newline and filter out any empty lines
    const booksList = books
      .split(/[\n]/)
      .filter((str) => /\S/.test(str))
      .map((book) => {
        // Hardcover's API only likes a certain type of quotation mark
        // + super hacky regex courtesy of https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
        // which will split the line on comma, but ignore comma inside of quotes
        const bookObject = book
          .replace("’", `'`)
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        // Remove any quotation marks or empty spaces around the book's name
        return {
          title: bookObject[0].trim().replace(/^"|"$/g, ""),
          author: bookObject[1]?.trim(),
        };
        // Remove first line of .csv file
      })
      .filter((book) => book.title.toLowerCase() !== "title");

    onSubmit(booksList.slice(0, MAX_BOOKS));
  };

  return (
    <form onSubmit={onSubmitBooks}>
      <label htmlFor="books">
        Enter list of titles and authors in a .csv format. (Authors are
        optional).
      </label>
      <span className="info">
        If you have a .csv file, you can rename it to a .txt and then copy-paste
        its contents below.
      </span>
      <span className="info">
        💡 Or you can ask{" "}
        <a href="https://chatgpt.com/" target="__blank">
          ChatGPT
        </a>{" "}
        to create lists in a .csv format for you.
      </span>
      <textarea
        rows={5}
        id="books"
        name="books"
        placeholder={placeholder}
      ></textarea>
      <button type="submit">Import</button>
    </form>
  );
};
