import json
import os
import time
from googletrans import Translator

SOURCE_JSON = 'frontend/src/locales/en.json'
OUT_DIR = 'frontend/public/locales'
TARGET_LANGS = ['hi', 'ta', 'te', 'kn', 'ml']
# Add 'en' to also copy the english file into the public directory correctly
ALL_LANGS = TARGET_LANGS + ['en']

def setup_dirs():
    for lang in ALL_LANGS:
        os.makedirs(os.path.join(OUT_DIR, lang), exist_ok=True)

translator = Translator()

def translate_value(text, dest_lang):
    if not isinstance(text, str):
        return text
    if not text.strip():
        return text
        
    # Ignore translation placeholders like {{price}} conceptually by translating carefully 
    # Or just let google translate handle it and hope the curly braces survive. 
    # Usually googletrans keeps {{name}} intact but adds spaces like { { name } }.
    try:
        # Simple backoff buffer
        res = translator.translate(text, dest=dest_lang)
        time.sleep(0.1) 
        output = res.text
        
        # fix curly brace mangling
        output = output.replace('{ {', '{{').replace('} }', '}}').replace('{ ', '{').replace(' }', '}')
        return output
    except Exception as e:
        print(f"Error translating '{text}': {e}")
        return text

def translate_dict(d, dest_lang):
    if isinstance(d, dict):
        new_d = {}
        for k, v in d.items():
            new_d[k] = translate_dict(v, dest_lang)
        return new_d
    elif isinstance(d, str):
        return translate_value(d, dest_lang)
    else:
        return d

def main():
    print("Loading source translation...")
    with open(SOURCE_JSON, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    setup_dirs()
    
    # Save English copy
    with open(os.path.join(OUT_DIR, 'en', 'translation.json'), 'w', encoding='utf-8') as f:
        json.dump(en_data, f, indent=2, ensure_ascii=False)
        
    print("Starting translation cascade...")
    for lang in TARGET_LANGS:
        print(f"Translating to {lang}...")
        translated_data = translate_dict(en_data, lang)
        
        out_path = os.path.join(OUT_DIR, lang, 'translation.json')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, indent=2, ensure_ascii=False)
        print(f"Finished writing {out_path}.")
        
    print("All translations generated perfectly.")

if __name__ == '__main__':
    main()
