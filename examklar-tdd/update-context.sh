#!/bin/bash

# Central script to update context from project root
# Usage: ./update-context.sh "description of what you did"

if [ $# -eq 0 ]; then
    echo "Usage: ./update-context.sh \"description of what you did\""
    exit 1
fi

cd Contextsystem && python3 update_context.py "$1"