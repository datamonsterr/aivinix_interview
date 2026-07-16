# Technical Assessment: Public API Cache Service

## Purpose

This assessment is designed to evaluate practical backend engineering skills, code ownership, problem-solving ability, and communication.

We understand that different engineers work in different ways, and AI tools are allowed. What matters most is that you understand the solution you submit and can explain the decisions you made. During the follow-up interview, we may ask you to walk through parts of your code and make a small change together.

---

## Overview

Build a small API service that fetches data from a public external API, caches selected data, and exposes clean API endpoints.

You may use one of the following public APIs, or another public API with similar characteristics:

- Marvel API (https://marvelapp.com/developers/) - This is fun, but you need graphQL knowledge, and learn how to mange the access token, too.
- PokéAPI (https://pokeapi.co/) - I will pick this for simple API endpoint.
- Harry Porter Characters API (https://potterdb.com/characters) - This will require tiny skill on web debugging, additionally.
- Open Library API (https://openlibrary.org/dev/docs/api/search) - This is a serious API. Try with the search endpoint. You will need to handle cache carefully due to the amount of data API returns. For this assignment purpose, pick the endpoint in Examples section should be fine.
- Fake Store API - most simple. Try to find a fake store that have more than 500 items
- GitHub public API - This requires searching skill in Github to get the actual API endpoint

The chosen API should return a list of items and support fetching details for a single item.

---

## Technology Requirements

You may use one of the following stacks:

- Node.js
- TypeScript

Framework choices are flexible, using Javascript / Typescript base:

- Express.js
- NestJS
- NextJS


A database is optional unless you decide your caching strategy requires one.

---

## Required Endpoints

### 1. `GET /items`

Returns an array of item IDs.

Example response:

```json
[1, 2, 3, 4, 5]
```

Requirements:

- Fetch item data from the selected external API.
- If the external API is paginated, your service must handle pagination.
- The endpoint should not call the external API on every request.
- Implement a caching strategy to reduce latency for repeated calls.
- Your caching strategy should account for the possibility that new items may be added to the external API in the future.

---

### 2. `GET /items/:id`

Returns selected details for a single item.

Example response:

```json
{
  "id": 1,
  "name": "Example item",
  "description": "Example description"
}
```

Requirements:

- Return only selected fields, not the entire external API response.
- Return a proper error response if the item does not exist.
- Handle external API failure or timeout gracefully.

---

## Caching Requirements

Implement caching for `GET /items`.

Your implementation should consider:

- Cache hit behavior
- Cache miss behavior
- Cache expiration or refresh
- How new external records are eventually discovered
- What happens if the external API fails during refresh
- What happens if multiple requests hit the endpoint while the cache is empty

You may use:

- In-memory cache
- File-based cache
- Redis
- Database-backed cache
- Any other reasonable approach

The implementation does not need to be perfect. We are more interested in your reasoning, tradeoffs, and ability to explain the approach clearly.

---

## Error Handling Requirements

Your API should handle common failure cases gracefully.

Examples:

- External API timeout
- External API returns an error
- Invalid item ID
- Item not found
- Cache refresh failure
- Unexpected internal error

Use appropriate HTTP status codes where possible.

---

## OpenAPI / Swagger

Provide API documentation using OpenAPI or Swagger.

The documentation should include:

- `GET /items`
- `GET /items/:id`
- Request parameters
- Example responses
- Error responses

The documentation may be served from the application or provided as a separate OpenAPI file.

---

## Testing Requirements

Include automated tests.

At minimum, tests should cover:

- Successful list fetching
- Pagination handling, if applicable
- Cache hit behavior
- Cache miss behavior
- Successful item detail fetching
- Item not found behavior
- External API failure behavior

Tests should not depend on calling the real external API every time.

Mocking, fake clients, or test fixtures are acceptable.

---

## Security Requirements

- Do not commit API keys, tokens, or secrets.
- Use environment variables or a local config file for secrets.
- Include an example config file such as `.env.example`.
- If the selected public API does not require authentication, mention this in the README.

---

## Required Documentation

Your repository should include the following files.

### `README.md`

The README should explain:

- What the project does
- Which public API you selected
- How to install dependencies
- How to configure environment variables
- How to run the application
- How to run tests
- How to access Swagger/OpenAPI documentation
- Any assumptions you made

---

### `ARCHITECTURE.md`

Explain your technical decisions.

Please include:

1. Overall application structure
2. Data flow from external API to your API response
3. Caching strategy
4. Cache expiration or refresh strategy
5. How new external records are discovered
6. How external API failures are handled
7. How simultaneous requests are handled when the cache is empty
8. What changes would be needed if the service runs on multiple instances
9. How you would monitor this service in production
10. What you would improve with more time

---

### AI Usage Section

In your `README.md`, include a section called `AI Usage`.

Please answer:

- Did you use AI tools?
- Which AI tool did you use, if any?
- Which parts did AI help with?
- Which parts did you manually review or modify?
- Which part of the code are you most confident about?
- Which part of the code are you least confident about?

Using AI is not a negative signal.

Please just be open about how you used it. We care more about whether you reviewed, understood, and can explain the submitted solution.

---

## Submission Requirements

Submit a GitHub repository containing:

- Source code
- `README.md`
- `ARCHITECTURE.md`
- OpenAPI / Swagger documentation
- Automated tests
- `.env.example`
- Clear commit history

The application should be runnable locally.

Suggested local URL:

```txt
http://localhost:8080
```

### Once you have completed it

Great! Once your project is ready and running locally, please send it to us via [`recruit@aivinix.com`](mailto:recruit@aivinix.com).

Please include:

- Your name and contact information
- Your GitHub repository URL
- Any required `.env` values or setup notes needed to run the project locally

No need to over-polish the project. A clear, working submission with honest notes about assumptions, tradeoffs, and improvements is more valuable than a perfect-looking project that is difficult to explain.

---

## Follow-up Interview

During the follow-up interview, we will mainly discuss your submission. You may be asked to:

- Demonstrate the application
- Explain the architecture
- Explain your caching strategy
- Explain how your code handles external API failure
- Walk through your test cases
- Modify a small part of the code live
- Debug a small issue
- Explain what you would improve for production

Example small follow-up changes may include:

- Add a `limit` query parameter to `GET /items`
- Add an `X-Cache: HIT` or `X-Cache: MISS` response header
- Add case-insensitive search
- Add a `forceRefresh=true` query parameter
- Improve error handling for an invalid item ID

---

## Optional Senior-Level Bonus

These are not required, but they are useful for senior candidates.

- Use stale-while-revalidate caching
- Prevent cache stampede
- Add request timeout and retry with backoff
- Add structured logging
- Add metrics for cache hit/miss
- Add Dockerfile or Docker Compose
- Add CI workflow
- Add integration tests
- Add rate-limit protection
- Add production deployment notes
