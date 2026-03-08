# API Reference

## Endpoints

### Health

`GET /health` - Returns `{"status": "OK"}` when the server is running.

### Navigation

`GET /navigation` - Returns the full navigation tree organized by section (hero, offline, not-found).

`GET /navigation/:nodeId` - Returns navigation nodes for a specific section. Returns 404 if the section doesn't exist.

### Translation

`GET /translation` - Returns all translations grouped by language code.

`GET /translation/:lang` - Returns translations for a specific language. The language is determined by (in order): URL parameter, `lang` query parameter, `Accept-Language` header, or defaults to `en`.

## Caching

All data endpoints include an `ETag` header. Clients can send `If-None-Match` to receive `304 Not Modified` when content hasn't changed, reducing bandwidth for unchanged responses.

## Supported Languages

- `en` - English
- `de` - German
