import os
import re

src_dir = r"d:\Projects\quantum_p2\quantum-universe\src"

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # First fix the broken ones
            content = content.replace("\\'@types/quantum\\'", "'@types/quantum'")
            content = content.replace('\\"@types/quantum\\"', "'@types/quantum'")

            # Now properly make sure everything from '@types/quantum' is an `import type`
            # Look for `import { ... } from '@types/quantum'`
            # Don't replace if it already has `import type`
            def replace_match(match):
                if 'import type' in match.group(0):
                    return match.group(0)
                # Group 1 is the stuff inside the braces
                return f"import type {{{match.group(1)}}} from '@types/quantum';"

            new_content = re.sub(
                r'import\s+type\s*{([^}]+)}\s*from\s*[\'"]@types/quantum[\'"];?',
                lambda m: f"import type {{{m.group(1)}}} from '@types/quantum';",
                content,
                flags=re.DOTALL
            )
            
            new_content = re.sub(
                r'import\s*{([^}]+)}\s*from\s*[\'"]@types/quantum[\'"];?',
                lambda m: f"import type {{{m.group(1)}}} from '@types/quantum';",
                new_content,
                flags=re.DOTALL
            )
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
