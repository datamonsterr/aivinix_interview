# AI Usage

This document expands the AI disclosure requested by `REQUIREMENTS.md`.

## Did I use AI tools?
Yes.

## Which AI tools did I use?
- **Harness:** Opencode
- OpenAI GPT 5.4
- opencode-go DeepSeek v4 Pro
- multiple models routed through 9router depending on task complexity and subagent configuration

## Which parts did AI help with?
- scaffolding and repo navigation
- turning requirements into implementation steps
- test-first iteration support
- documentation drafting and refinement
- verification checklist execution

## Which parts did I manually review or modify?
- cache behavior and stale-while-revalidate flow
- HTTP error mapping and status codes
- retry/backoff behavior
- rate-limit design and its tradeoffs
- benchmark and TS-config decisions
- final README / SPEC / ARCHITECTURE / AI_USAGE wording
- decisions about what stayed process-local vs what should move to Redis later

## Which part of the code am I most confident about?
The list caching flow, route behavior, and test pyramid coverage around cache hit/miss/stale behavior.

## Which part of the code am I least confident about?
The current process-local rate limiting and metrics approach for multi-instance production deployment.

## How AI was used in practice
- read repository requirements and existing files
- implement and run test, repeat until pass 
- proposed minimal implementation paths
- generated and updated tests before or alongside changes
- helped summarize architecture and operational tradeoffs
- ran verification commands and reported failures for follow-up fixes

## What I still take ownership of
- Technical decision 
- Specification, scope of work
- Test plan
- Agent harness setup and workflow
- Design patterns and coding principles (tdd, spec-driven)
