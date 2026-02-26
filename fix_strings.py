import re

files = [
    "src/pages/user/latihan-soal-kecermatan-exam.tsx",
    "src/pages/user/soal-kecermatan-detail.tsx",
    "src/pages/user/latihan-kecermatan/riwayat-detail.tsx",
    "src/pages/user/detail-riwayat-kecermatan.tsx",
    "src/pages/admin/manage-soal-kecermatan/history-detail.tsx",
    "src/pages/admin/manage-latihan-kecermatan/history-detail.tsx"
]

def process_file(file_path):
    print("Processing", file_path)
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        def replace_in_func(func_name, text):
            # We want to match all the way to the end of the function.
            # Easiest way for this specific code block: match from const funcName to '  };' at the start of a line
            pattern = re.compile(r"(const " + func_name + r"\s*=\s*\([^)]+\)\s*=>\s*\{)(.*?\n\s*\};)", re.DOTALL)
            match = pattern.search(text)
            if not match:
                return text
            
            p1, body = match.groups()
            body = body.replace(' and ', ' dan ')
            body = body.replace(' or ', ' atau ')
            body = body.replace(' with ', ' dengan ')
            body = body.replace(' And ', ' Dan ')
            body = body.replace(' Or ', ' Atau ')
            body = body.replace(' With ', ' Dengan ')
            
            return text[:match.start()] + p1 + body + text[match.end():]
        
        orig_content = content
        content = replace_in_func("getPankerCategory", content)
        content = replace_in_func("getTiankerCategory", content)
        content = replace_in_func("getHankerCategory", content)
        content = replace_in_func("getFinalCategory", content)
        
        if orig_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("Fixed", file_path)
        else:
            print("No changes needed in", file_path)
    except FileNotFoundError:
        print("File not found:", file_path)

for f in files:
    process_file(f)

