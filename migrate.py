#!/usr/bin/env python3
"""
Migrate all pages from TownNav to NavBar/Footer.
Run from project root: python3 migrate.py
"""

import re
import os
import sys

# Files to migrate (from grep results)
files = [
    'src/app/andover/page.tsx',
    'src/app/blog/grandparent-adu-massachusetts/page.tsx',
    'src/app/blog/massachusetts-adu-year-one/page.tsx',
    'src/app/blog/page.tsx',
    'src/app/boston/page.tsx',
    'src/app/challenge/new/page.tsx',
    'src/app/challenge/page.tsx',
    'src/app/compare/page.tsx',
    'src/app/duxbury/page.tsx',
    'src/app/falmouth/page.tsx',
    'src/app/leaderboard/page.tsx',
    'src/app/lexington/page.tsx',
    'src/app/methodology/page.tsx',
    'src/app/milton/page.tsx',
    'src/app/my-town/page.tsx',
    'src/app/needham/page.tsx',
    'src/app/newton/page.tsx',
    'src/app/next-steps/page.tsx',
    'src/app/plymouth/page.tsx',
    'src/app/quiz/page.tsx',
    'src/app/revere/page.tsx',
    'src/app/scorecards/page.tsx',
    'src/app/sudbury/page.tsx',
    'src/app/town/[name]/page.tsx',
    'src/app/town/page.tsx',
    'src/app/towns/[slug]/TownSEOPageClient.tsx',
]

# Also need to handle: estimate, map, statewide, admin if they have TownNav

def migrate_file(filepath):
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'TownNav' not in content:
        print(f"  SKIP (no TownNav): {filepath}")
        return False
    
    original = content
    
    # 1. Extract the current page name from TownNav usage
    current_match = re.search(r'<TownNav\s+current=["\']([^"\']+)["\']', content)
    current_name = current_match.group(1) if current_match else 'Home'
    
    # 2. Replace TownNav import with NavBar + Footer imports
    # Handle various import patterns
    content = re.sub(
        r"import\s+TownNav\s+from\s+['\"]@/components/TownNav['\"];?\n?",
        "import NavBar from '@/components/NavBar'\nimport Footer from '@/components/Footer'\n",
        content
    )
    
    # 3. Remove the entire <header>...</header> block (which contains logo + TownNav)
    # This handles both single-line and multi-line headers
    # The header block typically looks like:
    # <header className="border-b border-gray-800">
    #   <div ...>
    #     <div ...>
    #       <Link ...>ADU Pulse</Link>
    #       <TownNav current="X" />
    #     </div>
    #   </div>
    # </header>
    
    # Replace the header block with <NavBar current="X" />
    # Use a regex that matches <header...>...</header> including newlines
    header_pattern = r'\n?\s*<header\b[^>]*>.*?</header>\s*\n?'
    content = re.sub(header_pattern, f'\n      <NavBar current="{current_name}" />\n\n      ', content, flags=re.DOTALL)
    
    # 4. Also handle any standalone club banner that sits between header and main
    # (some pages have a Link banner right after header - keep it)
    
    # 5. Replace the <footer>...</footer> block with <Footer />
    footer_pattern = r'\s*<footer\b[^>]*>.*?</footer>\s*'
    content = re.sub(footer_pattern, '\n      <Footer />\n    ', content, flags=re.DOTALL)
    
    # 6. Clean up any remaining TownNav references (just in case)
    content = content.replace('<TownNav current=', '<NavBar current=')
    
    # 7. Remove duplicate NavBar imports if the file already had one
    lines = content.split('\n')
    seen_navbar = False
    seen_footer = False
    cleaned = []
    for line in lines:
        if "import NavBar from '@/components/NavBar'" in line:
            if seen_navbar:
                continue
            seen_navbar = True
        if "import Footer from '@/components/Footer'" in line:
            if seen_footer:
                continue
            seen_footer = True
        cleaned.append(line)
    content = '\n'.join(cleaned)
    
    # 8. Remove any leftover Link import for the logo if it was only used there
    # (Don't do this - Link is likely used elsewhere in the page)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  ✅ MIGRATED: {filepath} (current=\"{current_name}\")")
        return True
    else:
        print(f"  ⚠️  NO CHANGES: {filepath}")
        return False


def main():
    print("ADU Pulse: TownNav → NavBar/Footer Migration")
    print("=" * 50)
    
    migrated = 0
    skipped = 0
    
    for filepath in files:
        if migrate_file(filepath):
            migrated += 1
        else:
            skipped += 1
    
    print()
    print(f"Done! {migrated} files migrated, {skipped} skipped.")
    print()
    print("Next steps:")
    print("1. Run 'npm run dev' and check each page")
    print("2. If any page looks off, the header/footer pattern may have been unusual")
    print("3. You can safely delete src/components/TownNav.tsx once all pages look good")


if __name__ == '__main__':
    main()
