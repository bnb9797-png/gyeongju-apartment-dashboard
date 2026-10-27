(function(g){
const key=r=>[r.name,r.town,r.address].join('|');
const value=r=>r.type==='rent'?+r.rent:+r.amount;
const median=a=>{const b=a.filter(Number.isFinite).sort((a,b)=>a-b),n=b.length;return n?(b[Math.floor((n-1)/2)]+b[Math.ceil((n-1)/2)])/2:null;};
const dateStart=(end,n)=>{if(n==='all')return '0000-01-01';const d=new Date(end+'T12:00:00Z');d.setUTCMonth(d.getUTCMonth()-Number(n)+1,1);return d.toISOString().slice(0,10);};
const areaMatch=(r,s)=>s==='all'||(s==='standard'&&r.area>=84&&r.area<=85)||(s==='small'&&r.area<=60)||(s==='medium'&&r.area>60&&r.area<=85)||(s==='large'&&r.area>85);
function filter(rows,s,end){const from=dateStart(end,s.period);return rows.filter(r=>r.type===s.type&&r.date>=from&&r.date<=end&&(!s.town||r.town===s.town)&&areaMatch(r,s.area)&&(!s.query||[r.name,r.town,r.address].join(' ').toLowerCase().includes(s.query.toLowerCase()))&&(s.min===''||value(r)>=Number(s.min))&&(s.max===''||value(r)<=Number(s.max))&&(!s.year||Number(r.year)>=Number(s.year)));}
function units(rows){const m=new Map;for(const r of rows){const k=key(r);if(!m.has(k))m.set(k,{key:k,name:r.name,town:r.town,address:r.address,year:r.year,rows:[]});m.get(k).rows.push(r);}return [...m.values()].map(u=>({...u,count:u.rows.length,latest:[...u.rows].sort((a,b)=>b.date.localeCompare(a.date))[0],median:median(u.rows.map(value)),pp:median(u.rows.map(r=>value(r)/(r.area/3.305785))),min:Math.min(...u.rows.map(value)),max:Math.max(...u.rows.map(value)),areas:[...new Set(u.rows.map(r=>Math.round(r.area*100)/100))].sort((a,b)=>a-b)}));}
function sort(units,mode){return [...units].sort((a,b)=>(mode==='high'?b.median-a.median:mode==='low'?a.median-b.median:mode==='pp'?b.pp-a.pp:mode==='volume'?b.count-a.count:mode==='year'?Number(b.year)-Number(a.year):b.latest.date.localeCompare(a.latest.date))||b.count-a.count||a.name.localeCompare(b.name));}
function monthly(rows){const m=new Map;for(const r of rows){const mo=r.date.slice(0,7);if(!m.has(mo))m.set(mo,[]);m.get(mo).push(r);}return [...m].sort(([a],[b])=>a.localeCompare(b)).map(([month,rr])=>({month,amount:median(rr.map(value)),count:rr.length}));}
const api={key,value,median,dateStart,areaMatch,filter,units,sort,monthly};if(typeof module!=='undefined')module.exports=api;else g.PortalCore=api;
})(typeof window==='undefined'?globalThis:window);
