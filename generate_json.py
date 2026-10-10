# python3 generate_json.py
import os
import json
import re

img_dir = './images'

def natural_keys(text):
    return [int(c) if c.isdigit() else c for c in re.split(r'(\d+)', text)]

photos = []
global_id = 1

subfolders = [f for f in os.listdir(img_dir) if os.path.isdir(os.path.join(img_dir, f)) and not f.startswith('.')]
subfolders.sort(key=natural_keys)

for folder_name in subfolders:
    folder_path = os.path.join(img_dir, folder_name)
    
    files = [f for f in os.listdir(folder_path) if not f.startswith('.')]
    files.sort(key=natural_keys)
    
    for file_name in files:
        if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.heic')):
            continue
            
        photos.append({
            "id": f"{global_id:03d}",
            "url": f"images/{folder_name}/{file_name}",
            "category": folder_name.lower(),
            "categoryName": folder_name.upper()
        })
        global_id += 1

os.makedirs('./data', exist_ok=True)
with open('./data/photos.json', 'w', encoding='utf-8') as f:
    json.dump(photos, f, ensure_ascii=False, indent=2)

print(f"JSON generated successfully! Total {len(photos)} photos processed.")