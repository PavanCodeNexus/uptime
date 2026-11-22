# -*- coding: utf-8 -*-
import os
import json
import re

# 1. OWNER WEB
from build_owner_web_full import screens_data as owner_screens
with open(r"F:\uptime\design-system\assemble_owner_web.py", "r", encoding="utf-8") as f:
    assemble_owner_content = f.read()

# 2. TECH WEB
from build_tech_web_full import screens_data as tech_screens
with open(r"F:\uptime\design-system\assemble_tech_web.py", "r", encoding="utf-8") as f:
    assemble_tech_content = f.read()

# 3. ADMIN WEB
with open(r"F:\uptime\design-system\build_admin_24_screens.py", "r", encoding="utf-8") as f:
    admin_build_content = f.read()

print(f"Loaded {len(owner_screens)} owner screens, {len(tech_screens)} tech screens")
