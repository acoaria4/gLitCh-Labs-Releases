from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.ids=set();self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  for key in ('href','src'):
   if a.get(key):self.links.append(a[key])
excluded={'content','old_main_website','glitch-labs-website','.git','.cache','.venv','venv','node_modules','__pycache__'}
pages={p:Page(p.read_text(encoding='utf-8')) for p in ROOT.rglob('*.html') if not excluded.intersection(p.relative_to(ROOT).parts) and not p.name.startswith('google')}
for p,page in pages.items():
 assert page.h1==1,(p,'heading count',page.h1)
 for url in page.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  target=(p.parent/unquote(u.path)).resolve() if u.path else p
  if target.is_dir():target/= 'index.html'
  assert target.is_file(),(p,url,'missing file')
  if u.fragment and target in pages:assert u.fragment in pages[target].ids,(p,url,'missing anchor')
documents=[ROOT/'content/expenses/privacy.html']
documents+=sorted((ROOT/'content/aura').glob('*.html'))
documents+=sorted((ROOT/'content/lumen').glob('*.html'))
for document in documents:
 source=document.read_text(encoding='utf-8')
 output=(ROOT/document.parent.name/document.name).read_text(encoding='utf-8')
 article=re.search(r'<article class="document-content"[^>]*>([\s\S]*?)</article>',output).group(1)
 article=re.sub(r'<details[\s\S]*?</details>','',article)
 plain=lambda s:' '.join(re.sub('<[^>]*>',' ',s).split())
 assert plain(source)==plain(article),(document,'document wording changed')
for slug, name in (('aura','AURA'), ('lumen','Lumen')):
 for p in (ROOT/slug).rglob('*.html'):
  text=p.read_text(encoding='utf-8')
  footer=re.search(r'<nav aria-label="Product resources">([\s\S]*?)</nav>',text)
  assert footer,(p,'missing product resources')
  required=('privacy.html','terms.html','support.html','data-controls.html')
  if slug=='lumen':required+=('delete-account.html',)
  prefix='../' if p.parent.name=='get' else ''
  assert all(f'href="{prefix}{item}"' in footer[1] for item in required),(p,'missing legal resource')
  if p.name not in ('index.html',):
   sidebar=re.search(fr'<nav aria-label="{name} pages">([\s\S]*?)</nav>',text)
   assert sidebar and all(f'href="{item}"' in sidebar[1] for item in required),(p,'missing sidebar resource')
deletion=(ROOT/'content/lumen/delete-account.html').read_text(encoding='utf-8')
assert 'mailto:glitchlabsio@gmail.com?subject=Lumen%20account%20deletion%20request' in deletion,'Missing private deletion request route'
for p in ROOT.glob('*.css'):
 for path in re.findall(r'url\(([^)]+)\)',p.read_text(encoding='utf-8')):
  path=path.strip('\'"')
  if not path.startswith(('data:','http')):assert (p.parent/path).exists(),(p,path)
print(f'PASS: {len(pages)} pages, local links/anchors/assets, headings, source document text, AURA/Lumen legal navigation and Lumen deletion request route.')
