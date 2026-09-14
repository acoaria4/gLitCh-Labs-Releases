from pathlib import Path
import urllib.request, re
root=Path(__file__).resolve().parents[1]
folder=root/'assets/fonts'
url='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap'
request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
css=urllib.request.urlopen(request,timeout=30).read().decode()
blocks=re.findall(r'@font-face\s*\{[^}]+\}',css)
output=[]
seen={}
for block in blocks:
 if 'unicode-range:' in block and 'U+0000-00FF' not in block:continue
 src=re.search(r'url\((https://[^)]+)\)',block).group(1)
 if src not in seen:
  name=f'font-{len(seen)+1}.'+('woff2' if '.woff2' in src else 'ttf')
  (folder/name).write_bytes(urllib.request.urlopen(src,timeout=30).read())
  seen[src]=name
 output.append(block.replace(src,'assets/fonts/'+seen[src]))
(root/'fonts.css').write_text('/* Self-hosted Google Fonts; see assets/fonts/README.md for sources and licenses. */\n'+'\n'.join(output))
for family,path in [('Manrope','manrope'),('DM Sans','dmsans'),('Outfit','outfit'),('Cormorant Garamond','cormorantgaramond')]:
 license_url=f'https://raw.githubusercontent.com/google/fonts/main/ofl/{path}/OFL.txt'
 (folder/(path+'-OFL.txt')).write_bytes(urllib.request.urlopen(license_url,timeout=30).read())
(folder/'README.md').write_text('Self-hosted fonts from Google Fonts (https://fonts.google.com). Families: Manrope, DM Sans, Outfit, Cormorant Garamond. SIL Open Font License texts are included. Latin subsets are used when available; local system fallback handles other characters. Regenerate with scripts/fetch-fonts.py. No runtime requests to a font provider are required.\n')
print(f'Saved {len(seen)} font files and four licenses.')
