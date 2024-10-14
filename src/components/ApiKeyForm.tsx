interface SettingsFormElements extends HTMLFormControlsCollection {
  apiKey: HTMLInputElement;
}
interface SettingsFormElement extends HTMLFormElement {
  readonly elements: SettingsFormElements;
}

export const ApiKeyForm = ({
  setApiKey,
}: {
  setApiKey: (key: string) => void;
}) => {
  const onSubmit = (event: React.FormEvent<SettingsFormElement>) => {
    event.preventDefault();
    const apiKey = event.currentTarget.elements.apiKey.value;
    setApiKey(apiKey);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="apiKey">
        Input your{" "}
        <a
          href="https://hardcover.app/account/api"
          target="_blank"
          rel="noreferrer"
        >
          Hardcover API key
        </a>
      </label>
      <span className="info">
        ⚠️ This is like a password - please do not share it with anybody.
      </span>
      <textarea id="apiKey" name="apiKey"></textarea>
      <button type="submit">Save</button>
    </form>
  );
};
