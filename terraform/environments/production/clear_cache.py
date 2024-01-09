import requests
import os

cloudflare_api_token = os.getenv('CLOUDFLARE_API_TOKEN')
url = "https://api.cloudflare.com/client/v4/zones/4ce351acd1e6e5281e4db785a6a95b7d/purge_cache"

payload = {"purge_everything":True}
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {cloudflare_api_token}"
}

response = requests.request("POST", url, json=payload, headers=headers)

print(response.text)