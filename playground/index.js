/* eslint-env browser */

import React, { useCallback, useState } from "https://cdn.skypack.dev/react";
import { render } from "https://cdn.skypack.dev/react-dom";

import {
  Editor,
  EditorContext,
  WithEditorActions,
} from "https://cdn.skypack.dev/@atlaskit/editor-core";

import { fromADF } from "https://cdn.skypack.dev/mdast-util-from-adf";
import { gfmToMarkdown } from "https://cdn.skypack.dev/mdast-util-gfm";
import { toMarkdown } from "https://cdn.skypack.dev/mdast-util-to-markdown";

const example = {
  version: 1,
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hello ",
        },
        {
          type: "text",
          text: "ADF",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/",
              },
            },
            {
              type: "strong",
            },
          ],
        },
        {
          type: "text",
          text: "!",
        },
      ],
    },
  ],
};

function convert(value) {
  return toMarkdown(fromADF(value), { extensions: [gfmToMarkdown()] });
}

function Heading({ children }) {
  return <h2 className="font-bold mb-2">{children}</h2>;
}

function Code({ children }) {
  return (
    <pre className="max-w-full bg-gray-100 p-2 border rounded text-xs overflow-auto">
      <code>{children}</code>
    </pre>
  );
}


function InternalEditor({ actions, onChange }) {
  const update = useCallback(async () => {
    const value = await actions.getValue();
    onChange(value);
  }, [actions]);

  return (
    <Editor appearance="comment" defaultValue={example} onChange={update} />
  );
}

function EditorWrapper({ onChange }) {
  return (
    <EditorContext>
      <WithEditorActions
        render={(actions) => (
          <InternalEditor actions={actions} onChange={onChange} />
        )}
      />
    </EditorContext>
  );
}

function App() {
  const [value, setValue] = useState();
  const [markdown, setMarkdown] = useState();

  const onChange = useCallback(
    (value) => {
      setMarkdown(convert(value));
      setValue(value);
    },
    [setMarkdown, setValue]
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div>
        <Heading>Editor</Heading>
        <EditorWrapper onChange={onChange} />
      </div>
      <div>
        <Heading>ADF</Heading>
        <Code>{JSON.stringify(value, null, 2)}</Code>
      </div>
      <div>
        <Heading>Markdown</Heading>
        <Code>{markdown}</Code>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
render(<App />, root);
