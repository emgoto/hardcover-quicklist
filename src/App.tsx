import { useState } from "react";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { UserLists } from "./components/UserLists";
import { ImportList } from "./components/ImportList";
import { BookTable } from "./components/BookTable";
import { FindBooks } from "./components/FindBooks";
import { ApiCache } from "./api/find-book";
import { List } from "./api/get-user-lists";
import { InsertToList } from "./components/InsertToList";
import { ImportBook } from "./types";

const Status = ({ done }: { done: boolean }) => (done ? <>✅</> : <></>);

const App = () => {
  const [apiKey, setApiKey] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [selectedList, setSelectedList] = useState<List | undefined>();
  // Original list of books passed in by the user
  const [importBooks, setImportBooks] = useState<ImportBook[] | undefined>();
  // Store all results returned from the Hardcover book search API
  const [apiBooks, setApiBooks] = useState<ApiCache | undefined>();

  const onRemoveBook = (bookTitle: string) => {
    const newBooks = importBooks?.filter((book) => book.title !== bookTitle);
    setImportBooks(newBooks);
  };

  const updateApiBooks = (newBooks: ApiCache) => {
    setApiBooks({
      ...apiBooks,
      ...newBooks,
    });
  };

  return (
    <>
      <h1>Hardcover Quicklist</h1>
      <div className="app">
        <div>
          <h2>
            Step 1: Input API key <Status done={!!apiKey} />
          </h2>
          <ApiKeyForm setApiKey={setApiKey} />
          <h2>
            Step 2: Choose an existing list in Hardcover{" "}
            <Status done={!!selectedList} />
          </h2>
          <UserLists
            apiKey={apiKey}
            setList={setSelectedList}
            setUsername={setUsername}
          />
          <h2>
            Step 3: Import book list <Status done={!!importBooks} />
          </h2>
          <ImportList onSubmit={setImportBooks} />
          <h2>
            Step 4: Find books in Hardcover <Status done={!!apiBooks} />
          </h2>
          <FindBooks
            apiKey={apiKey}
            apiBooks={apiBooks}
            importBooks={importBooks}
            setApiBooks={updateApiBooks}
          />
          <h2>Step 5: Insert books into list</h2>
          <InsertToList
            key={selectedList?.id}
            list={selectedList}
            importBooks={importBooks}
            apiBooks={apiBooks}
            apiKey={apiKey}
            username={username}
          />
        </div>
        {importBooks && (
          <BookTable
            importBooks={importBooks}
            apiBooks={apiBooks}
            removeBook={onRemoveBook}
          />
        )}
      </div>
    </>
  );
};

export default App;
