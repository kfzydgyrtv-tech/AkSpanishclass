"use strict";
const fs=require("node:fs");
const assert=require("node:assert/strict");
const source=fs.readFileSync("arcade-rules.js","utf8");
class Element{
  constructor(){this.attrs={};this.classNames=new Set();this.handlers={};this.hover=false;
    this.classList={add:x=>this.classNames.add(x),remove:x=>this.classNames.delete(x)};}
  addEventListener(type,fn){this.handlers[type]=fn}
  setAttribute(k,v){this.attrs[k]=String(v)}
  matches(q){return q===":hover"&&this.hover}
  blur(){this.handlers.blur?.()}
}
const ids=Object.fromEntries(["arcade-rules-widget","arcade-rules-button","arcade-rules-panel"].map(k=>[k,new Element()]));
const document={getElementById:k=>ids[k]};
const queued=new Map();let next=0;
const setTimeout=(fn,delay)=>{assert.equal(delay,5000,"Click must pin for 5 seconds");const id=++next;queued.set(id,fn);return id};
const clearTimeout=id=>queued.delete(id);
new Function("document","setTimeout","clearTimeout",source)(document,setTimeout,clearTimeout);
const widget=ids["arcade-rules-widget"],button=ids["arcade-rules-button"],panel=ids["arcade-rules-panel"];
const visible=()=>widget.classNames.has("rules-visible");
widget.handlers.pointerenter({pointerType:"mouse"});
assert.equal(visible(),true,"Mouse hover shows rules");
widget.handlers.pointerleave();
assert.equal(visible(),false,"Mouse leave hides rules");
button.handlers.click();
assert.equal(visible(),true,"Click shows rules");
assert.equal(queued.size,1,"Click has a timer");
widget.handlers.pointerleave();
assert.equal(visible(),true,"Pinned rules ignore mouse leave");
[...queued.values()][0]();queued.clear();
assert.equal(visible(),false,"Click rules hide at 5s");
widget.handlers.pointerenter({pointerType:"mouse"});
assert.equal(visible(),false,"Do not reopen automatically while still hovering");
widget.handlers.pointerleave();
widget.handlers.pointerenter({pointerType:"mouse"});
assert.equal(visible(),true,"Hover works again after pointer leaves");
button.handlers.click();
button.handlers.click();
assert.equal(queued.size,1,"Repeat click resets the timeout");
button.handlers.keydown({key:"Escape",preventDefault(){}});
assert.equal(visible(),false,"Escape closes the panel");
assert.equal(panel.attrs["aria-hidden"],"true");
assert.equal(button.attrs["aria-expanded"],"false");
console.log("PASS: hover, mouse leave, click, five-second timeout, repeat click and Escape.");
