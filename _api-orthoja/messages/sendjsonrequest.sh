#!/bin/bash

JSON_FILE=$1

curl -d @"$JSON_FILE" -X POST http://localhost:3100 --header "Content-Type: application/json" | python -m json.tool
