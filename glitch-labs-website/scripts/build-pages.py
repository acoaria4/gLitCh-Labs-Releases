"""Build shared page shells from local content; never writes outside glitch-labs-website."""
from pathlib import Path
import re, html
ROOT=Path(__file__).resolve().parents[1]
PRODUCTS={'expenses':('Expenses','#0b0b12'),'aura':('AURA','#f2ede5'),'lumen':('Lumen','#f8e7ed'),'studio':('gLitCh Labs','#0b0d10')}
LABELS={'privacy':'Privacy','support':'Support','delete-account':'Delete account','data-controls':'Data controls','invite':'Group invite','about':'About','contact':'Contact'}
def styles(prefix):
 return ''.join(f'<link rel="stylesheet" href="{prefix}{name}.css?v=unified-1">' for name in ['fonts','styles','product-themes','typography','documents','navigation'])
def resources(slug,prefix=''):
 return ''.join(f'<a href="{prefix}{key}.html">{LABELS[key]}</a>' for key in ('privacy','support','delete-account','data-controls') if (ROOT/'content'/slug/(key+'.html')).exists())
for slug,(name,color) in PRODUCTS.items():
 studio=slug=='studio';prefix='' if studio else '../';theme='studio-site' if studio else slug;asset='glitchlabs' if studio else slug
 folder=ROOT if studio else ROOT/slug
 for source in sorted((ROOT/'content'/slug).glob('*.html')):
  key=source.stem;body=source.read_text();title=re.sub('<[^>]+>',' ',re.search(r'<h1>([\s\S]*?)</h1>',body).group(1)).strip()
  toc=[]
  def heading(m):
   attrs,label=m.group(1),m.group(2)
   existing=re.search(r'id="([^"]+)"',attrs)
   ident=existing.group(1) if existing else 'topic-'+str(len(toc)+1)
   toc.append((ident,re.sub('<[^>]+>','',label)))
   return f'<h2{attrs if existing else attrs+" id="+chr(34)+ident+chr(34)}>{label}</h2>'
  body=re.sub(r'<h2([^>]*)>([\s\S]*?)</h2>',heading,body)
  if key=='privacy':
   links=''.join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i,t in toc)
   body=re.sub(r'(</h1>)',r'\1'+f'<details class="document-toc"><summary>On this page</summary><ol>{links}</ol></details>',body,count=1)
  body=body.replace('class="cta"','class="doc-action"')
  sidebar=''.join(f'<a href="{p.stem}.html"'+(' aria-current="page"' if p.stem==key else '')+f'>{LABELS[p.stem]}</a>' for p in sorted((ROOT/'content'/slug).glob('*.html')))
  if not studio:sidebar='<a href="index.html">Overview</a><a href="get/index.html">Get the app</a>'+sidebar
  navbrand=f'<a class="brand" href="index.html"><img src="{prefix}assets/{asset}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a>'
  navlinks='<a href="about.html">About</a><a href="index.html#expenses">Our apps ↗</a>' if studio else f'<a href="support.html">Support</a><a class="contact-link" href="../index.html#{slug}">All apps ↗</a>'
  footer_links=resources(slug) if not studio else '<a href="about.html">About</a><a href="contact.html">Contact</a>'
  footer=f'<a href="{prefix}index.html">← gLitCh Labs</a><nav aria-label="Product resources">{footer_links}</nav><span>© 2026 gLitCh Labs</span>'
  script='<script src="../invite.js" defer></script>' if key=='invite' else ''
  page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="{color}"><meta name="description" content="{html.escape(title)} — {name} by gLitCh Labs."><title>{html.escape(title)} — {name}</title><link rel="icon" href="{prefix}assets/{asset}.png">{styles(prefix)}{script}</head><body class="product-site document-site {theme}"><a class="skip" href="#content">Skip to content</a><header class="navigation">{navbrand}<nav aria-label="Main navigation">{navlinks}</nav></header><main class="document-shell"><aside class="document-sidebar"><p class="eyebrow">{name}</p><nav aria-label="{name} pages">{sidebar}</nav></aside><article class="document-content" id="content">{body}</article></main><footer class="product-footer">{footer}</footer></body></html>'''
  (folder/(key+'.html')).write_text(page)
# Apply shared typography and local resources to the four existing marketing pages.
for slug,(name,color) in PRODUCTS.items():
 if slug=='studio':continue
 p=ROOT/slug/'index.html';s=p.read_text()
 for sheet in ('fonts','typography','navigation'):
  if f'../{sheet}.css' not in s:s=s.replace('</head>',f'<link rel="stylesheet" href="../{sheet}.css"></head>')
 s=re.sub(r'<h1 id="product-title">.*?</h1>',f'<h1 id="product-title">{name}<span class="name-dot" aria-hidden="true">.</span></h1>',s)
 s=re.sub(r'<a class="brand" href="../index.html">[\s\S]*?</a>',f'<a class="brand" href="../index.html#{slug}"><img src="../assets/{slug}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a>',s,count=1)
 s=re.sub(r'<nav aria-label="Product resources">.*?</nav>',f'<nav aria-label="Product resources">{resources(slug)}<a href="get/index.html">Get the app</a></nav>',s)
 p.write_text(s)
 # Short /get destination shares the exact live download controls and identity.
 title=re.search(r'<h1 id="product-title">.*?</h1>',s).group(0)
 desc=re.search(r'<p class="description">.*?</p>',s).group(0)
 stores=re.search(r'<div class="store-links"[\s\S]*?</div>',s).group(0)
 note=re.search(r'<p class="release-note">.*?</p>',s).group(0)
 getdir=ROOT/slug/'get';getdir.mkdir(exist_ok=True)
 getdir.joinpath('index.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="{color}"><meta name="description" content="Get {name} by gLitCh Labs. Download availability and beta links."><title>Get {name} — gLitCh Labs</title><link rel="icon" href="../../assets/{slug}.png">{styles('../../')}</head><body class="product-site get-site {slug}"><header class="navigation"><a class="brand" href="../index.html"><img src="../../assets/{slug}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a><nav aria-label="Main navigation"><a href="../support.html">Support</a><a href="../../index.html#{slug}">All apps ↗</a></nav></header><main class="product-landing"><div class="landing-visual"><img class="landing-icon" src="../../assets/{slug}.png" alt="" width="1280" height="1280"></div><div class="landing-copy">{title}{desc}{stores}{note}</div></main><footer class="product-footer"><a href="../../index.html">gLitCh Labs</a><nav aria-label="Product resources">{resources(slug,'../')}</nav></footer></body></html>''')
p=ROOT/'index.html';s=p.read_text()
for sheet in ('fonts','typography','navigation'):
 if f'href="{sheet}.css"' not in s:s=s.replace('</head>',f'<link rel="stylesheet" href="{sheet}.css"></head>')
for slug in ('expenses','aura','lumen'):
 s=s.replace(f'https://acoaria4.github.io/gLitCh-Labs-Releases/{slug}/privacy.html',f'{slug}/privacy.html')
s=s.replace('https://acoaria4.github.io/gLitCh-Labs-Releases/about.html','about.html')
s=s.replace('<a href="mailto:glitchlabsio@gmail.com">Contact</a>','<a href="contact.html">Contact</a>')
p.write_text(s)
print('Built supporting pages and /get pages; linked shared typography and local resources.')
