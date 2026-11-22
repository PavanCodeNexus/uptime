import os
import json
import zipfile
import hashlib
import base64
import requests

source_html = r"F:\uptime\design-system\owner-web.html"
scratch_dir = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\scratch"
os.makedirs(scratch_dir, exist_ok=True)
archive_path = os.path.join(scratch_dir, "figma-import-owner-web.archive")

print(f"Creating ZIP archive from {source_html}...")
with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write(source_html, arcname="index.html")

with open(archive_path, "rb") as f:
    archive_bytes = f.read()

sha256_b64 = base64.b64encode(hashlib.sha256(archive_bytes).digest()).decode("ascii")
print(f"Archive created. Size: {len(archive_bytes)} bytes. SHA256 (b64): {sha256_b64}")

upload_info_path = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\.system_generated\steps\3218\output.txt"
with open(upload_info_path, "r", encoding="utf-8") as f:
    data = json.load(f)

upload_meta = data["upload"]
submit_url = upload_meta["submitUrl"]
fields = upload_meta["fields"]

form_data = []
for k, v in fields.items():
    form_data.append((k, (None, v)))

form_data.append(("Content-Type", (None, "application/octet-stream")))
form_data.append(("x-amz-checksum-sha256", (None, sha256_b64)))
form_data.append(("file", ("archive.zip", archive_bytes, "application/octet-stream")))

print(f"Uploading archive to {submit_url}...")
resp = requests.post(submit_url, files=form_data)
print(f"Response status: {resp.status_code}")
if resp.status_code in (200, 204):
    print("SUCCESS: Archive uploaded to Figma S3!")
else:
    print(f"Upload failed: {resp.status_code} - {resp.text}")
