import os
import json
import zipfile
import hashlib
import base64

scratch_dir = r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\scratch"
os.makedirs(scratch_dir, exist_ok=True)

archive_path = os.path.join(scratch_dir, "figma-import-white-theme.archive")
source_html = r"F:\uptime\design-system\index.html"

print(f"Packaging {source_html} into ZIP archive...")
with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write(source_html, arcname="index.html")

print("\nInspecting archive contents:")
with zipfile.ZipFile(archive_path, "r") as zf:
    for info in zf.infolist():
        print(f"  - {info.filename} ({info.file_size} uncompressed, {info.compress_size} compressed)")

with open(archive_path, "rb") as f:
    archive_bytes = f.read()

sha256_b64 = base64.b64encode(hashlib.sha256(archive_bytes).digest()).decode("ascii")
print(f"\nArchive size: {len(archive_bytes)} bytes")
print(f"SHA-256 Base64 Checksum: {sha256_b64}")
