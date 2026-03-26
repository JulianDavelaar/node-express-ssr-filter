require("dotenv").config(); 
const headers={
  Authorization:"Bearer "+process.env.DIRECTUS_TOKEN,
  "Content-Type":"application/json"
}; 

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms)); 

(async()=>
  { const base=process.env.DIRECTUS_URL; 
    const list=await (await fetch(base+"/collections?filter[collection][starts_with]=toolgankelijk_&limit=5000",{headers})).json(); 
    const cols=(list.data||[]).map(x=>x.collection); cols.sort((a,b)=>a.length-b.length||a.localeCompare(b)); 
    console.log("toolgankelijk collections:",cols.length); 
    const colSet=new Set(cols); 
    const relRes=await fetch(base+"/relations?limit=5000",{headers}); 
    const relJson=await relRes.json(); const rels=(relJson.data||[]).filter(r=>colSet.has(r.collection)||colSet.has(r.related_collection)); 
    console.log("relations to delete",rels.length); let relOk=0; for(const r of rels){ const del=await fetch(base+`/relations/${r.collection}/${encodeURIComponent(r.field)}`,{method:"DELETE",headers}); 
    if(del.status===200||del.status===204){ relOk++; } await sleep(50); 

  } console.log("relations deleted",relOk); 
});



// delete collections, junction first (longer names) const delCols=[...cols].sort((a,b)=>b.length-a.length||b.localeCompare(a)); let colOk=0; for(const c of delCols){ const res=await fetch(base+`/collections/${c}`,{method:"DELETE",headers}); if(res.status===200||res.status===204){ colOk++; } else { const t=await res.text(); console.log("failed delete",c,"status",res.status,"body",t.slice(0,200)); } await sleep(100); } console.log("collections deleted",colOk); })().catch(e=>{console.error(e); process.exit(1);