import json
import hashlib
import base64
import requests

instructions_file = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\.system_generated\steps\2537\output.txt"
archive_path = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\scratch\figma-import-702d4a59ee7fc2bd43bc48762e96e662174a83774cac5efdab1b496e7aee2228.archive"

with open(instructions_file, "r", encoding="utf-8") as f:
    data = json.load(f)

upload_cfg = data["upload"]
submit_url = upload_cfg["submitUrl"]
fields = dict(upload_cfg["fields"])

with open(archive_path, "rb") as f:
    archive_bytes = f.read()

b64_checksum = base64.b64encode(hashlib.sha256(archive_bytes).digest()).decode("ascii")
fields["Content-Type"] = "application/octet-stream"
fields["x-amz-checksum-sha256"] = b64_checksum

files = {
    "file": ("figma-import-702d4a59ee7fc2bd43bc48762e96e662174a83774cac5efdab1b496e7aee2228.archive", archive_bytes, "application/octet-stream")
}

print(f"Uploading 38-Screen Dedicated Owner App archive ({len(archive_bytes)} bytes) to Figma S3...")
resp = requests.post(submit_url, data=fields, files=files, timeout=60)
print(f"HTTP Status: {resp.status_code}")
if resp.status_code in (200, 204):
    print("SUCCESS: 38-Screen Owner App archive uploaded cleanly!")
else:
    print(f"ERROR: {resp.status_code} - {resp.text}")
    raise SystemExit(1)
