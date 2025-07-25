import csv
import requests
import os
import json
from collections import defaultdict

CACHE_FILE = 'translate_cache.json'

try:
    with open(CACHE_FILE, 'r') as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}


def translate_text(text):
    text = text.strip()
    if text == '' or text.lower() == 'n/a':
        return text
    if text in cache:
        return cache[text]
    url = 'https://translate.googleapis.com/translate_a/single'
    params = {
        'client': 'gtx',
        'sl': 'en',
        'tl': 'fr',
        'dt': 't',
        'q': text,
    }
    try:
        r = requests.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        translated = ''.join(part[0] for part in data[0])
    except Exception as e:
        print('Translation failed for:', text, 'error:', e)
        translated = text
    cache[text] = translated
    return translated


def process_file(filename, lang_col, text_cols):
    rows = []
    with open(filename, newline='', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        for row in reader:
            # pad row to length if needed
            if len(row) < lang_col:
                row += [''] * (lang_col - len(row) + 1)
            row[lang_col-1] = 'fr'
            for col in text_cols:
                if col-1 < len(row):
                    row[col-1] = translate_text(row[col-1])
            rows.append(row)
    outname = filename.replace('_en.csv', '_fr.csv')
    with open(outname, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerows(rows)
    print('Wrote', outname, len(rows), 'rows')


def main():
    configs = {
        '20250724_045500_capacity_en.csv': (10, [11,12]),
        '20250724_045500_capacitytype_en.csv': (2, [3]),
        '20250724_045500_characters_en.csv': (2, [3]),
        '20250724_045500_damagebufftype_en.csv': (2, [3]),
        '20250724_045500_damagetype_en.csv': (2, [3]),
        '20250724_045500_haircuts_en.csv': (3, [4,5]),
        '20250724_045500_outfits_en.csv': (3, [4,5]),
        '20250724_045500_pictos_en.csv': (8, [9,11]),
        # Weapon names are proper nouns, keep them untranslated
        '20250724_045500_weapons_en.csv': (6, []),
    }
    for file, (lang_col, text_cols) in configs.items():
        if os.path.exists(os.path.join('data', file)):
            process_file(os.path.join('data', file), lang_col, text_cols)

    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
