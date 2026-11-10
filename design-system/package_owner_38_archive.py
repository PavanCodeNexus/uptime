import os
import json
import zipfile
import hashlib
import base64

scratch_dir = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\scratch"
os.makedirs(scratch_dir, exist_ok=True)

archive_path = os.path.join(scratch_dir, "figma-import-702d4a59ee7fc2bd43bc48762e96e662174a83774cac5efdab1b496e7aee2228.archive")
source_html = r"F:\uptime\design-system\index.html"

# Clean up temporary syntax check file if present
temp_js = r"F:\uptime\design-system\check_syntax.js"
if os.path.exists(temp_js):
    os.remove(temp_js)

print(f"Creating clean unconfigured HTML ZIP archive at:\n  {archive_path}")
with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write(source_html, arcname="index.html")

print("\nInspecting archive contents:")
with zipfile.ZipFile(archive_path, "r") as zf:
    for info in zf.infolist():
        print(f"  - {info.filename} (uncompressed: {info.file_size} bytes, compressed: {info.compress_size} bytes)")

with open(archive_path, "rb") as f:
    archive_bytes = f.read()

sha256_b64 = base64.b64encode(hashlib.sha256(archive_bytes).digest()).decode("ascii")
print(f"\nArchive size: {len(archive_bytes)} bytes")
print(f"SHA-256 Base64 Checksum: {sha256_b64}")
