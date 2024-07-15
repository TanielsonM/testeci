#!/bin/bash

# Set the Cloudflare API token
CLOUDFLARE_API_TOKEN=$1

# Define the URL for the purge cache endpoint
url="https://api.cloudflare.com/client/v4/zones/4ce351acd1e6e5281e4db785a6a95b7d/purge_cache"

# Define the payload
payload='{"purge_everything":true}'

# Make the POST request using curl
response=$(curl -s -X POST "$url" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d "$payload")

# Print the response
echo "$response"
