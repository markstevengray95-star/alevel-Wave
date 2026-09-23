(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const canvases=()=>["#simCanvas","#simProCanvas","#simDetailOverlay","#precisionOverlayV4"].map(s=>$(s)).filter(Boolean);
  let suspended=false,quality="auto",fps=60,last=performance.now(),frames=0;
  const scaleFor=()=>{if(quality==="high")return Math.min(devicePixelRatio||1,2);if(quality==="balanced")return Math.min(devicePixelRatio||1,1.35);if(quality==="eco")return 1;const memory=navigator.deviceMemory||4,coarse=matchMedia?.("(pointer: coarse)")?.matches;return Math.min(devicePixelRatio||1,(memory<=4||coarse)?1.2:1.5);};
  function install(){const toolbar=$(".sim-pro-toolbar");if(toolbar&&!$("#simQualityV6")){toolbar.insertAdjacentHTML("beforeend",'<label class="mini-badge perf-quality-v6">render <select id="simQualityV6"><option value="auto">Auto</option><option value="balanced">Balanced</option><option value="high">High detail</option><option value="eco">Battery saver</option></select></label><span class="mini-badge" id="simFpsV6">smooth</span>');$("#simQualityV6").value=quality;$("#simQualityV6").onchange=e=>{quality=e.target.value;applyQuality(true);};}
    document.addEventListener("visibilitychange",syncVisibility);
    const lab=$("#view-lab");if(lab)new MutationObserver(syncVisibility).observe(lab,{attributes:true,attributeFilter:["class"]});
    window.addEventListener("resize",()=>setTimeout(()=>applyQuality(false),40));
    new MutationObserver(()=>{install();if(!suspended)setTimeout(()=>applyQuality(false),20);}).observe(document.body,{childList:true,subtree:true});
    syncVisibility();requestAnimationFrame(meter);
  }
  function active(){const lab=$("#view-lab");return !document.hidden&&!!lab?.classList.contains("active-view");}
  function syncVisibility(){if(active())resume();else suspend();}
  function suspend(){if(suspended)return;suspended=true;canvases().forEach(c=>{if(c.width){c.dataset.prevWidth=String(c.width);c.dataset.prevHeight=String(c.height);c.width=0;c.height=0;}});const b=$("#simFpsV6");if(b)b.textContent="render paused off-screen";}
  function resume(){if(!suspended){applyQuality(false);return;}suspended=false;requestAnimationFrame(()=>requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));setTimeout(()=>applyQuality(false),30);}));}
  function applyQuality(force){if(suspended)return;const q=scaleFor();["#simCanvas","#simProCanvas"].forEach(sel=>{const c=$(sel);if(!c)return;const r=c.getBoundingClientRect();if(!r.width||!r.height)return;const w=Math.max(1,Math.round(r.width*q)),h=Math.max(1,Math.round(r.height*q));if(force||Math.abs(c.width-w)>2||Math.abs(c.height-h)>2){c.width=w;c.height=h;c.getContext("2d")?.setTransform(q,0,0,q,0,0);}});const tag=$("#simFpsV6");if(tag)tag.textContent=`render ${q.toFixed(1)}× · ${Math.round(fps)} fps`;}
  function meter(ts){frames++;if(ts-last>=800){fps=frames*1000/(ts-last);frames=0;last=ts;if(!suspended){const tag=$("#simFpsV6");if(tag)tag.textContent=`render ${scaleFor().toFixed(1)}× · ${Math.round(fps)} fps`;}}requestAnimationFrame(meter);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(install,350));else setTimeout(install,350);
})();