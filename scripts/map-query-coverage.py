"""Extract the agreed public query annex; map intents to the four landing sections."""
import csv,re,json,sys
from pathlib import Path
source=Path(sys.argv[1]).read_text()
queries=[]
for line in source.splitlines():
 if re.match(r'^\s*(vendere |valutazione |quanto vale |dove vendere |chi compra |acquisto |compro |quali foto |come funziona |cosa incide |esperto valutazione )',line):
  queries.extend(re.split(r'\s{2,}',line.strip()))
assert len(queries)==446 and len(set(queries))==446,(len(queries),len(set(queries)))
cities=list(dict.fromkeys(re.findall(r"^vendere orologio usato a (.+)$", "\n".join(queries), re.M)))
rows=[]
for q in queries:
 brand=next((b for b in ['Rolex','Omega','Cartier'] if b in q),'orologio')
 page='/vendi-'+brand.lower()+'/'
 if any(q.endswith(' a '+city) for city in cities):section='territorio'
 elif 'foto' in q:section='foto'
 elif re.search('scatola|documenti|garanzia|online|Italia',q):section='domande'
 elif re.search('Submariner|Datejust|Daytona|GMT|Speedmaster|Seamaster|Constellation|De Ville|Santos|Tank|Panthère|Ballon Bleu',q):section='modelli'
 elif brand=='orologio' and any(b in q for b in ['Tudor','TAG Heuer','Breitling','Baume','Seiko','Hamilton','Bulgari','Zenith','Mido','Longines','IWC','Oris','Eberhard','Maurice','Jaeger','Franck']):section='marchi'
 elif re.search('valore|quanto vale|valutazione',q):section='valore'
 else:section='come-funziona'
 rows.append({'query':q,'landing':page,'sezione':section,'copertura':'intento trattato nei contenuti; non attestazione di posizionamento'})
with open('docs/query-coverage.csv','w') as f:
 w=csv.DictWriter(f,fieldnames=rows[0].keys(),lineterminator='\n');w.writeheader();w.writerows(rows)
print(json.dumps({'varianti':len(rows),'pagine':len(set(r['landing'] for r in rows))}))
