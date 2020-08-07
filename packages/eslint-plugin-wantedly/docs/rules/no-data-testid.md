# Check if disallowed prop does not appeared in jsx

## Rule Details

#### Valid

```jsx
const Component = () => {
  return (
    <div>
      Content
    </div>
  );
}
```

#### Invalid

```jsx
const Component = () => {
  return (
    <div data-testid="foo">     // <- data-testid must not be set as a prop
      Content
    </div>
  );
}
```

## Options

#### `denyKeyList`

The list of name which is not allowed to assign as prop. Default is `["data-testid"]`.

```json
{
  "rule": {
    "wantedly/no-data-testid": ["error": { "denyKeyList": ["data-testid", "data-test-id"] }]
  }
}
```

```js
/* eslint wantedly/no-data-testid: ["error", { "denyKeyList": ["data-testid"] }] */
```
