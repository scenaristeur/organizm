- https://jqlang.github.io/jq/manual/#object-identifier-index

```bash
jq '.' ./data/*
{
  "foo": 42,
  "bar": "less interesting data"
}
{
  "foo": 46,
  "bar": "less interesting data"
}

```


```bash
jq '.foo' ./data/*
42
46

```