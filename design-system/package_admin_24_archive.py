import os
import tarfile

src_html = r"F:\uptime\design-system\admin-console.html"
archive_paths = [
    r"F:\uptime\design-system\admin-console.archive",
    r"C:\Users\Prachala\.gemini\antigravity\brain\510946ac-fde3-4158-8b75-ad69e7ce6983\scratch\figma-import-admin-24-screens.archive",
]

for ap in archive_paths:
    os.makedirs(os.path.dirname(ap), exist_ok=True)
    with tarfile.open(ap, "w:gz") as tar:
        tar.add(src_html, arcname="index.html")
    print(f"Created archive: {ap} ({os.path.getsize(ap)} bytes)")

with tarfile.open(archive_paths[0], "r:gz") as tar:
    print("Archive members:", tar.getnames())
