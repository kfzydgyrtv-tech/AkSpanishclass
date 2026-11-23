#!/usr/bin/env python3
"""Reproducible FreeDict import: source-tagged static Spanish / English headwords."""
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET
import hashlib,json,re,tarfile,unicodedata,urllib.request
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'data'; NS='{http://www.tei-c.org/ns/1.0}'
SOURCES={'spa-eng':('0.3.1','7ad87dba7c9f8d2ff48ad822e8483792370ee98315982aa6a0932ea4fb511595'),
'eng-spa':('2025.11.23','dd724fb48c5701395c15d7d648a9e6f6b75d6ff4269e465dce6d3a292700198d')}
def clean(s): return re.sub(r'\s+',' ',s or '').strip()
def txt(e): return clean(''.join(e.itertext())) if e is not None else ''
def fold(s): return ''.join(c for c in unicodedata.normalize('NFD',s.casefold()) if unicodedata.category(c)!='Mn')
def letter(s):
 c=fold(s[:1])
 return c if c.isascii() and c.isalpha() else '_'
def entries(pair):
 version,digest=SOURCES[pair];name=f'freedict-{pair}-{version}.src.tar.xz';path=ROOT/name
 if not path.is_file():
  url=f'https://download.freedict.org/dictionaries/{pair}/{version}/{name}'
  request=urllib.request.Request(url,headers={'User-Agent':'AkSpanishClass/2.1'})
  with urllib.request.urlopen(request,timeout=90) as response:path.write_bytes(response.read())
 actual=hashlib.sha256(path.read_bytes()).hexdigest()
 if actual!=digest:raise RuntimeError(f'Wrong FreeDict SHA256 for {pair}: {actual}')
 with tarfile.open(path,'r:xz') as archive:
  members=[m for m in archive.getmembers() if m.name.endswith(pair+'.tei')]
  if len(members)!=1:raise RuntimeError('Missing TEI for '+pair)
  xml=archive.extractfile(members[0]).read()
 return ET.fromstring(xml).findall('.//'+NS+'text/'+NS+'body/'+NS+'entry')
def main():
 OUT.mkdir(exist_ok=True); es=defaultdict(lambda:{'direct':[],'reverse':[]});en=defaultdict(list)
 for e in entries('spa-eng'):
  word=txt(e.find('./'+NS+'form/'+NS+'orth'))
  if not word:continue
  direct=es[word]['direct'];seen=set(direct)
  for sense in e.findall('./'+NS+'sense'):
   for q in sense.findall('./'+NS+'cit/'+NS+'quote'):
    value=txt(q)
    if value and value not in seen:direct.append(value);seen.add(value)
 for e in entries('eng-spa'):
  word=txt(e.find('./'+NS+'form/'+NS+'orth'))
  if not word:continue
  pos=txt(e.find('./'+NS+'gramGrp/'+NS+'pos'))
  prons=[txt(p) for p in e.findall('./'+NS+'form/'+NS+'pron')]
  ipa=next((p for p in prons if p.startswith('/') and p.endswith('/') and '-' not in p),'')
  senses=[]
  for sense in e.findall('./'+NS+'sense'):
   definition=' | '.join(filter(None,[txt(d) for d in sense.findall('./'+NS+'def')]))
   if not definition: definition=' | '.join(filter(None,[txt(d) for d in sense.findall('./'+NS+'sense/'+NS+'def')]))
   translations=[]
   for q in sense.findall('./'+NS+'cit/'+NS+'quote'):
    spanish=txt(q)
    if not spanish:continue
    if spanish not in translations:translations.append(spanish)
    if len(spanish)<=85 and re.search(r'[a-záéíóúüñ]',spanish,re.I) and not re.search(r'[\n\t\\<>{}\[\]|=+*_\d]',spanish):
     es[spanish]['reverse'].append([word,definition,pos])
   if translations:senses.append([definition,translations])
  if senses: en[word].append({'pos':pos,'ipa':ipa,'senses':senses})
 for record in es.values():
  unique=list(dict.fromkeys(tuple(row) for row in record['reverse']))
  record['reverse_count']=len(unique)
  unique.sort(key=lambda x:(len(x[0].split())>2,len(x[0]),fold(x[0])))
  record['reverse']=[list(row) for row in unique[:40]]
 for lang,data in [('es',es),('en',en)]:
  by_letter=defaultdict(dict);directory=OUT/lang;directory.mkdir(exist_ok=True)
  for word,value in data.items():by_letter[letter(word)][word]=value
  for initial,group in by_letter.items():
   (directory/(initial+'.json')).write_text(json.dumps(group,ensure_ascii=False,separators=(',',':')),encoding='utf8')
 counts={'spanish_terms':len(es),'english_terms':len(en),'spanish_direct_entries':sum(bool(v['direct']) for v in es.values())}
 index={'es':sorted(es.keys(),key=fold),'en':sorted(en.keys(),key=fold),'counts':counts}
 (OUT/'index.js').write_text('window.DIC_INDEX='+json.dumps(index,ensure_ascii=False,separators=(',',':'))+';',encoding='utf8')
 (OUT/'manifest.json').write_text(json.dumps({'version':'2.1','counts':counts,'sources':SOURCES,'warning':'Reverse translations are not validated Spanish definitions or synonyms.'},ensure_ascii=False,indent=2),encoding='utf8')
 print('Diccionario Vivo built:',counts)
if __name__=='__main__':main()
