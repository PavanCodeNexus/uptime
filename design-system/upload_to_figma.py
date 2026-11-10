import os
import zipfile
import hashlib
import base64
import requests

archive_path = "F:/uptime/design-system/figma-import.archive"
source_dir = "F:/uptime/design-system"

print(f"Creating ZIP archive at {archive_path}...")
with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    # Only put index.html at root of archive
    zf.write(os.path.join(source_dir, 'index.html'), arcname='index.html')

print("Archive created. Files in archive:")
with zipfile.ZipFile(archive_path, 'r') as zf:
    for info in zf.infolist():
        print(f" - {info.filename} ({info.file_size} bytes)")

# Compute sha256 binary and base64
with open(archive_path, 'rb') as f:
    archive_bytes = f.read()

sha256_digest = hashlib.sha256(archive_bytes).digest()
b64_checksum = base64.b64encode(sha256_digest).decode('ascii')
print(f"Computed SHA256 base64 checksum: {b64_checksum}")

# Fields from step 2390
fields = {
    'key': 'uploads/make_folder_imports/2419982736338157735/81318c70-081f-42ab-836a-60d8eb1b98fe.archive',
    'acl': 'private',
    'x-amz-checksum-algorithm': 'SHA256',
    'policy': 'eyJleHBpcmF0aW9uIjoiMjAyNi0xMS0wOVQyMjoyMDozM1oiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJmaWdtYS1hZ2VudHBsYXQtdWdpdC11cy1wcm9kdWN0aW9uIn0seyJrZXkiOiJ1cGxvYWRzL21ha2VfZm9sZGVyX2ltcG9ydHMvMjQxOTk4MjczNjMzODE1NzczNS84MTMxOGM3MC0wODFmLTQyYWItODM2YS02MGQ4ZWIxYjk4ZmUuYXJjaGl2ZSJ9LHsiYWNsIjoicHJpdmF0ZSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDEsMTA3Mzc0MTgyNF0sWyJzdGFydHMtd2l0aCIsIiR4LWFtei1jaGVja3N1bS1zaGEyNTYiLCIiXSxbInN0YXJ0cy13aXRoIiwiJENvbnRlbnQtVHlwZSIsIiJdLHsieC1hbXotY2hlY2tzdW0tYWxnb3JpdGhtIjoiU0hBMjU2In0seyJ4LWFtei1jcmVkZW50aWFsIjoiQVNJQVE0R09TRldDNlU1VVNRNzUvMjAyNjExMDkvdXMtd2VzdC0yL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMjYxMTA5VDIxMjAzM1oifSx7IngtYW16LXNlY3VyaXR5LXRva2VuIjoiSVFvSmIzSnBaMmx1WDJWakVHVWFDWFZ6TFhkbGMzUXRNaUpITUVVQ0lRRHVCY3hWVmVxV3ptMHNWcVhqVkJBKzZzdDJEL1ZCb1BwbDM4OHFiSGJGNFFJZ0NWL3pOL0RSU1Y3aUk1MVFwZTB6ZnBPaDJqRnZDUEJ0a2x2U05BbUJkS1Fxd2dVSUxoQUFHZ3d3TmpBMU5qSTNORFkzTlRjaUROcUFoc0lZOVlDWkNwQUJCeXFmQlpOY0RsbUZRYjQ1VEhIbVh5NUJGTmk0TDBGRklqR0ZPU0FoZ3lJdmNKc25DcmZ1MHZLOVRaTHZZSXU2YXVsNWtjR0JPRXhLb2NmMFJlcTRjYmNIZTM3ZVNWcjNzMnUyL1MzQ05HWlZzdXdBQWFpOUFHazVNSWVyLzJOamp6U25tdHEyNGZOTHRvOVhidEtSTGtETGJ4VFRjZWQvYytOTGlHMU5XUHJPM3l2NGpWaEtyaDBxckFvZEFCRXN1RlVlVHMyZlJiU0VpeEVaeWI3RFhYeXhXOFRDTDUwcFRWYTRNQ2w3NWJGbVNPb0gwQTJjSDM3bDRxVlFZOUFPdm40T09uZ1UzUTNJcFNDU0RZM1JSMkVkZkxBa0pQU0llSW43MUxld0hEY2IzaVhqVDUwU0ZxY3E2ZTdjZUl6V1JWcUUxQnQ5RmcwQ1VCZDN1UzNKZU0xSmZyN25iZlJDU29rN01zK3pTbUJXK2F1ZXpISFppcVJJNTJzSFhRcytwUGo5MGcvU25IcDBrTmFaRi9iZ2ZSMWdPaWJBTHJHbGZFNWQzVG9UMS9TTkcxK1dYclB6dXFwM0ZGNVpkNURyVjFpZW1QNGwrb0x1S1hMVHdDRVJlcDVLeGxKTFdnM0EzM0h6UVdDMDJuWFVMcnFvcGkyUXc1Zk9YRUlENXVGc0RmbzJEWUpieUNtbHF6KzdsZ2xkTjh5WFk5M2dhK1hxUUE5V1h0NmdlbGoyTVB0SHdEZ0ZvOUdlU2pCNGtMVEVRaE1sTCsvVGlrbVh1ZE5DTzBQTHV1N2NLVlVUUUxhR1ZTTHI1czQvakhuZEczK3pnbHZJY1pJdmFoTlltNlJLd2NkSVI0VnVJZXpVaUJpNVI3WmszaThjczI2VEFUMFEvZDN3ZFFoVkVlQW9Bc2J1cmpadXRNMDZTaEV6YzRNVkNybnI3Y2o2ay9jVEU5Q3N3YmF3ZTE2bEVuck8zN3NCMmtaek9OcDdINURqVUZIN2svTFUwR2NXaHp6MHM5SlNQQ3NYaEl4U2JvS1Jkdk16K0hxOG05NzRqZGE2L2FCZzdGMHpEMzdUZmZZU1Vkam51OXNjb2ZxSGtSa2d4M0l5SFQxSFJFempiMVp3M2U2eEZwM1JwdEdQbkFSRFVCWnN6MmxkU2V3YVg0ZVhzdGJMSVFjdGdGeTdhTXZSY3VGYVpLT3JNUHpteU5jR09wa0I0ZTVweTRCNEg4NVBhWW9vZW5NbHh0Q2Y0ejUvUFd6Nll4R3UyOFZtUmhackpkQkdCak04eWc5VUNOYVlHTVJQSE0zampDT3N5eXFyQ2FmSEVZc3Y1NFY2VEhCN3k5TWpwNXJEOTZkQTBoOExRQUZ1N2JtbUgwT0l3R1BoSmpVNGVvb0FqbU5nS3NkeHlVVitXd1JDQ3Z6U3E1WFEyQWdhZXBETGp3VWpjazA0NmEzc3JKaUZOTGlHbGpqdko5VUVQMjNuN3pXOXJzdXcifV19',
    'x-amz-credential': 'ASIAQ4GOSFWC6U5USQ75/20261109/us-west-2/s3/aws4_request',
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    'x-amz-date': '20261109T212033Z',
    'x-amz-security-token': 'IQoJb3JpZ2luX2VjEGUaCXVzLXdlc3QtMiJHMEUCIQDuBcxVVeqWzm0sVqXjVBA+6st2D/VBoPpl388qbHbF4QIgCV/zN/DRSV7iI51Qpe0zfpOh2jFvCPBtklvSNAmBdKQqwgUILhAAGgwwNjA1NjI3NDY3NTciDNqAhsIY9YCZCpABByqfBZNcDlmFQb45THHmXy5BFNi4L0FFIjGFOSAhgyIvcJsnCrfu0vK9TZLvYIu6aul5kcGBOExKocf0Req4cbcHe37eSVr3s2u2/S3CNGZVsuwAAai9AGk5MIer/2NjjzSnmtq24fNLto9XbtKRLkDLbxTTced/c+NLiG1NWPrO3yv4jVhKrh0qrAodABEsuFUeTs2fRbSEixEZyb7DXXyxW8TCL50pTVa4MCl75bFmSOoH0A2cH37l4qVQY9AOvn4OOngU3Q3IpSCSDY3RR2EdfLAkJPSIeIn71LewHDcb3iXjT50SFqcq6e7ceIzWRVqE1Bt9Fg0CUBd3uS3JeM1Jfr7nbfRCSok7Ms+zSmBW+auezHHZiqRI52sHXQs+pPj90g/SnHp0kNaZF/bgfR1gOibALrGlfE5d3ToT1/SNG1+WXrPzuqp3FF5Zd5DrV1iemP4l+oLuKXLTwCERep5KxlJLWg3A33HzQWC02nXULrqopi2Qw5fOXEID5uFsDfo2DYJbyCmlqz+7lgldN8yXY93ga+XqQA9WXt6gelj2MPtHwDgFo9GeSjB4kLTEQhMlL+/TikmXudNCO0PLuu7cKVUTQLaGVSLr5s4/jHndG3+zglvIcZIvahNYm6RKwcdIR4VuIezUiBi5R7Zk3i8cs26TAT0Q/d3wdQhVEeAoAsburjZutM06ShEzc4MVCrnr7cj6k/cTE9Cswbawe16lEnrO37sB2kZzONp7H5DjUFH7k/LU0GcWhzz0s9JSPCsXhIxSboKRdvMz+Hq8m974jda6/aBg7F0zD37TffYSUdjnu9scofqHkRkgx3IyHT1HREzjb1Zw3e6xFp3RptGPnARDUBZsz2ldSewaX4eXstbLIQctgFy7aMvRcuFaZKOrMPzmyNcGOpkB4e5py4B4H85PaYooenMlxtCf4z5/PWz6YxGu28VmRhZrJdBGBjM8yg9UCNaYGMRPHM3jjCOsyyqrCafHEYsv54V6THB7y9Mjp5rD96dA0h8LQAFu7bmmH0OIwGPhJjU4eooAjmNgKsdxyUV+WwRCCvzSq5XQ2AgaepDLjwUjck046a3srJiFNLiGljjvJ9UEP23n7zW9rsuw',
    'x-amz-signature': '3e14721d4eeb2535e94c712ac8c63969110edc1856666d1187580af7ed143a6f',
    'Content-Type': 'application/octet-stream',
    'x-amz-checksum-sha256': b64_checksum
}

url = 'https://www.figma.com/blobs/us/upload/figma-agentplat-ugit-us-production'

files = {
    'file': ('figma-import.archive', archive_bytes, 'application/octet-stream')
}

print(f"Uploading to {url}...")
resp = requests.post(url, data=fields, files=files)
print(f"Response status: {resp.status_code}")
print(f"Response body: {resp.text[:500]}")
if resp.status_code in [200, 204]:
    print("UPLOAD SUCCESSFUL!")
else:
    print(f"UPLOAD FAILED with code {resp.status_code}")
