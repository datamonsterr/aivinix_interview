#!/usr/bin/env bash
set -euo pipefail
curl -fsS http://localhost:8080/api/items
curl -fsS http://localhost:8080/api/items/1
curl -fsS http://localhost:8080/api/openapi
