var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=globalThis,u=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,d=Symbol(),f=new WeakMap,p=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(u&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=f.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&f.set(t,e))}return e}toString(){return this.cssText}},m=e=>new p(typeof e==`string`?e:e+``,void 0,d),h=(e,...t)=>new p(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,d),g=(e,t)=>{if(u)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=l.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},_=u?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return m(t)})(e):e,{is:v,defineProperty:y,getOwnPropertyDescriptor:ee,getOwnPropertyNames:te,getOwnPropertySymbols:b,getPrototypeOf:x}=Object,ne=globalThis,re=ne.trustedTypes,S=re?re.emptyScript:``,C=ne.reactiveElementPolyfillSupport,ie=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?S:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},T=(e,t)=>!v(e,t),E={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:T};Symbol.metadata??=Symbol(`metadata`),ne.litPropertyMetadata??=new WeakMap;var D=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=E){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&y(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ee(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??E}static _$Ei(){if(this.hasOwnProperty(ie(`elementProperties`)))return;let e=x(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ie(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ie(`properties`))){let e=this.properties,t=[...te(e),...b(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(_(e))}else e!==void 0&&t.push(_(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return g(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?w:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?w:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??T)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};D.elementStyles=[],D.shadowRootOptions={mode:`open`},D[ie(`elementProperties`)]=new Map,D[ie(`finalized`)]=new Map,C?.({ReactiveElement:D}),(ne.reactiveElementVersions??=[]).push(`2.1.2`);var ae=globalThis,oe=e=>e,O=ae.trustedTypes,se=O?O.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,ce=`$lit$`,le=`lit$${Math.random().toFixed(9).slice(2)}$`,ue=`?`+le,de=`<${ue}>`,fe=document,pe=()=>fe.createComment(``),me=e=>e===null||typeof e!=`object`&&typeof e!=`function`,k=Array.isArray,he=e=>k(e)||typeof e?.[Symbol.iterator]==`function`,ge=`[ 	
\f\r]`,_e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ve=/-->/g,ye=/>/g,be=RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),xe=/'/g,Se=/"/g,Ce=/^(?:script|style|textarea|title)$/i,A=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),j=Symbol.for(`lit-noChange`),M=Symbol.for(`lit-nothing`),we=new WeakMap,Te=fe.createTreeWalker(fe,129);function Ee(e,t){if(!k(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return se===void 0?t:se.createHTML(t)}var De=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=_e;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===_e?c[1]===`!--`?o=ve:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=be):(Ce.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=be):o=ye:o===be?c[0]===`>`?(o=i??_e,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?be:c[3]===`"`?Se:xe):o===Se||o===xe?o=be:o===ve||o===ye?o=_e:(o=be,i=void 0);let d=o===be&&e[t+1].startsWith(`/>`)?` `:``;a+=o===_e?n+de:l>=0?(r.push(s),n.slice(0,l)+ce+n.slice(l)+le+d):n+le+(l===-2?t:d)}return[Ee(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Oe=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=De(t,n);if(this.el=e.createElement(l,r),Te.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Te.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(ce)){let t=u[o++],n=i.getAttribute(e).split(le),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ne:r[1]===`?`?Pe:r[1]===`@`?Fe:Me}),i.removeAttribute(e)}else e.startsWith(le)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ce.test(i.tagName)){let e=i.textContent.split(le),t=e.length-1;if(t>0){i.textContent=O?O.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],pe()),Te.nextNode(),c.push({type:2,index:++a});i.append(e[t],pe())}}}else if(i.nodeType===8)if(i.data===ue)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(le,e+1))!==-1;)c.push({type:7,index:a}),e+=le.length-1}a++}}static createElement(e,t){let n=fe.createElement(`template`);return n.innerHTML=e,n}};function ke(e,t,n=e,r){if(t===j)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=me(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=ke(e,i._$AS(e,t.values),i,r)),t}var Ae=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??fe).importNode(t,!0);Te.currentNode=r;let i=Te.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new je(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ie(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Te.nextNode(),a++)}return Te.currentNode=fe,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},je=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ke(this,e,t),me(e)?e===M||e==null||e===``?(this._$AH!==M&&this._$AR(),this._$AH=M):e!==this._$AH&&e!==j&&this._(e):e._$litType$===void 0?e.nodeType===void 0?he(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==M&&me(this._$AH)?this._$AA.nextSibling.data=e:this.T(fe.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Oe.createElement(Ee(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ae(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=we.get(e.strings);return t===void 0&&we.set(e.strings,t=new Oe(e)),t}k(t){k(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(pe()),this.O(pe()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=oe(e).nextSibling;oe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=ke(this,e,t,0),a=!me(e)||e!==this._$AH&&e!==j,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=ke(this,r[n+o],t,o),s===j&&(s=this._$AH[o]),a||=!me(s)||s!==this._$AH[o],s===M?e=M:e!==M&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ne=class extends Me{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===M?void 0:e}},Pe=class extends Me{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==M)}},Fe=class extends Me{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=ke(this,e,t,0)??M)===j)return;let n=this._$AH,r=e===M&&n!==M||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==M&&(n===M||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ie=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){ke(this,e)}},Le={M:ce,P:le,A:ue,C:1,L:De,R:Ae,D:he,V:ke,I:je,H:Me,N:Pe,U:Fe,B:Ne,F:Ie},Re=ae.litHtmlPolyfillSupport;Re?.(Oe,je),(ae.litHtmlVersions??=[]).push(`3.3.2`);var ze=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new je(t.insertBefore(pe(),e),e,void 0,n??{})}return i._$AI(e),i},Be=globalThis,N=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ze(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};N._$litElement$=!0,N.finalized=!0,Be.litElementHydrateSupport?.({LitElement:N});var Ve=Be.litElementPolyfillSupport;Ve?.({LitElement:N}),(Be.litElementVersions??=[]).push(`4.2.2`);var P=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},He={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:T},Ue=(e=He,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function F(e){return(t,n)=>typeof n==`object`?Ue(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function I(e){return F({...e,state:!0,attribute:!1})}var We=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function L(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return We(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return We(n,r,{get(){return a(this)}})}}var R=new class{constructor(){this.baseUrl=``}async _fetch(e,t={}){let n=`${this.baseUrl}${e}`,r={...t.headers};t.body instanceof FormData||(r[`Content-Type`]=r[`Content-Type`]||`application/json`);let i=await fetch(n,{...t,headers:r});if(!i.ok){let e=await i.json().catch(()=>({message:i.statusText})),t=Error(e.message||`API Error: ${i.status}`);throw e.details&&(t.details=e.details),t}return i.status===204||i.headers.get(`content-length`)===`0`?null:i.json()}async getCollection(e){return this._fetch(`api/${e}`)}async getItem(e,t){return this._fetch(`api/${e}/${t}`)}async createItem(e,t){let n={...t};return`id`in n&&delete n.id,`grid_snap_mm`in n&&delete n.grid_snap_mm,this._fetch(`api/${e}`,{method:`POST`,body:JSON.stringify(n)})}async updateItem(e,t,n){let r={...n};return`grid_snap_mm`in r&&delete r.grid_snap_mm,this._fetch(`api/${e}/${t}`,{method:`PUT`,body:JSON.stringify(r)})}async deleteItem(e,t){return this._fetch(`api/${e}/${t}`,{method:`DELETE`})}async getLayouts(){return this.getCollection(`layout`)}async updateLayout(e,t){return this.updateItem(`layout`,e,t)}async getDisplayTypes(){return this.getCollection(`display_type`)}async getImages(e={}){let t=new URLSearchParams;for(let[n,r]of Object.entries(e))r!=null&&r!==``&&t.append(n,r.toString());let n=t.toString(),r=`api/image${n?`?${n}`:``}`;return(await this._fetch(r)).items}async updateImage(e,t){return this.updateItem(`image`,e,t)}async uploadImage(e){let t=new FormData;return t.append(`file`,e),this._fetch(`api/image`,{method:`POST`,body:t})}async getKeywords(){return this._fetch(`api/image/keywords`)}async ping(){try{return(await fetch(`${this.baseUrl}api/ping`)).ok}catch{return!1}}},Ge=class{constructor(e){this.host=e,this.connected=!1,this.displayTypes=[],this.layouts=[],this.images=[],this.scenes=[],this.activeLayout=null,this.activeScene=null,this.selectedItemId=null,this.selectedImageId=null,this.selectedDisplayTypeId=null,this.isAddingNew=!1,this.isAddingNewLayout=!1,this.activeSection=`layouts`,this.message=``,this._originalLayout=null,this.isSaving=!1,this.viewMode=`graphical`,this.host.addController(this)}get isDirty(){return this.activeLayout?JSON.stringify(this.activeLayout)!==this._originalLayout:!1}async hostConnected(){window.addEventListener(`hashchange`,()=>this._applyHash()),await this.refresh()}async refresh(){if(this.connected=await R.ping(),this.connected)try{if(this.displayTypes=await R.getCollection(`display_type`),this.layouts=await R.getCollection(`layout`),this.images=await R.getImages(),this.scenes=await R.getCollection(`scene`),this.layouts.length>0){if(!this.activeLayout)this.activeLayout=this.layouts[0];else{let e=this.layouts.find(e=>e.id===this.activeLayout?.id);e&&(this.activeLayout=e)}this._originalLayout=JSON.stringify(this.activeLayout)}else await this.createDefaultLayout();if(this.scenes.length>0&&this.activeScene){let e=this.scenes.find(e=>e.id===this.activeScene?.id);e&&(this.activeScene=e)}this.host.requestUpdate(),this._ensureSelection(),this._applyHash()}catch(e){console.error(`Fetch failed`,e),this.showMessage(`Fetch failed: ${e.message}`,`error`)}}async refreshImages(e={}){if(!(!this.connected&&(this.connected=await R.ping(),!this.connected)))try{this.images=await R.getImages(e),this.host.requestUpdate()}catch(e){console.error(`Image fetch failed`,e)}}async createDefaultLayout(){let e=await R.createItem(`layout`,{name:`Main Layout`,canvas_width_mm:500,canvas_height_mm:500,grid_snap_mm:5,items:[]});this.activeLayout=e,this.layouts=[e],this._originalLayout=JSON.stringify(e)}async saveActiveLayout(){if(this.activeLayout){this.isSaving=!0,this.host.requestUpdate(),this.isAddingNewLayout&&this.activeLayout.id&&delete this.activeLayout.id;try{this.activeLayout.id?await R.updateItem(`layout`,this.activeLayout.id,this.activeLayout):this.activeLayout=await R.createItem(`layout`,this.activeLayout),this.isAddingNewLayout=!1,this._originalLayout=JSON.stringify(this.activeLayout),this.showMessage(`Layout saved!`,`success`),await this.refresh(),this._updateHash()}catch(e){let t=e.details?`${e.message}: ${e.details}`:e.message;this.showMessage(`Failed to save: ${t}`,`error`)}finally{this.isSaving=!1,this.host.requestUpdate()}}}async saveDisplayType(e){this.isSaving=!0,this.host.requestUpdate();try{let t;t=e.id&&this.displayTypes.some(t=>t.id===e.id)?await R.updateItem(`display_type`,e.id,e):await R.createItem(`display_type`,e),this.selectedDisplayTypeId=t.id,this._updateHash(),await this.refresh(),this.isSaving=!1,this.showMessage(`Display type "${t.name}" saved!`,`success`)}catch(e){this.showMessage(`Failed to save display type: ${e.message}`,`error`)}finally{this.isSaving=!1,this.host.requestUpdate()}}async deleteDisplayType(e){if(this.layouts.some(t=>t.items.some(t=>t.display_type_id===e.id)))return this.showMessage(`Cannot delete "${e.name}": It is in use.`,`error`),!1;try{let t=this.displayTypes.findIndex(t=>t.id===e.id);if(await R.deleteItem(`display_type`,e.id),await this.refresh(),this.showMessage(`Display type "${e.name}" deleted.`,`success`),this.selectedDisplayTypeId===e.id)if(this.displayTypes.length>0){let e=Math.min(t,this.displayTypes.length-1);this.selectedDisplayTypeId=this.displayTypes[e].id}else this.selectedDisplayTypeId=null;return this._updateHash(),!0}catch(e){return this.showMessage(`Failed to delete: ${e.message}`,`error`),!1}}async deleteLayout(e){try{let t=this.layouts.findIndex(t=>t.id===e.id);if(await R.deleteItem(`layout`,e.id),await this.refresh(),this.showMessage(`Layout "${e.name}" deleted.`,`success`),this.activeLayout?.id===e.id)if(this.layouts.length>0){let e=Math.min(t,this.layouts.length-1);this.activeLayout=this.layouts[e],this._originalLayout=JSON.stringify(this.activeLayout)}else this.activeLayout=null,this._originalLayout=null;return this._updateHash(),!0}catch(e){return this.showMessage(`Failed to delete: ${e.message}`,`error`),!1}}async deleteImage(e){try{return await R.deleteItem(`image`,e.id),this.selectedImageId===e.id&&(this.selectedImageId=null),await this.refresh(),this.showMessage(`Image "${e.name}" deleted.`,`success`),this._updateHash(),!0}catch(e){return this.showMessage(`Failed to delete image: ${e.message}`,`error`),!1}}async createScene(e,t){this.isSaving=!0,this.host.requestUpdate();try{let n={name:e,layout:t},r=await R.createItem(`scene`,n);return this.activeScene=r,this._updateHash(),await this.refresh(),this.isSaving=!1,this.showMessage(`Scene "${e}" created!`,`success`),r}catch(e){return this.showMessage(`Failed to create scene: ${e.message}`,`error`),null}finally{this.isSaving=!1,this.host.requestUpdate()}}async updateScene(e,t){this.isSaving=!0,this.host.requestUpdate();try{let n={...this.scenes.find(t=>t.id===e),...t};await R.updateItem(`scene`,e,n),await this.refresh(),this.activeScene?.id===e&&(this.activeScene=this.scenes.find(t=>t.id===e)||this.activeScene),this.showMessage(`Scene updated!`,`success`),this._updateHash()}catch(e){this.showMessage(`Failed to update scene: ${e.message}`,`error`)}finally{this.isSaving=!1,this.host.requestUpdate()}}async deleteScene(e){try{let t=this.scenes.findIndex(t=>t.id===e.id);if(await R.deleteItem(`scene`,e.id),await this.refresh(),this.showMessage(`Scene "${e.name}" deleted.`,`success`),this.activeScene?.id===e.id)if(this.scenes.length>0){let e=Math.min(t,this.scenes.length-1);this.activeScene=this.scenes[e]}else this.activeScene=null;return this._updateHash(),!0}catch(e){return this.showMessage(`Failed to delete scene: ${e.message}`,`error`),!1}}showMessage(e,t=`info`){this.message=e,this.host.requestUpdate(),setTimeout(()=>{this.message=``,this.host.requestUpdate()},3e3)}switchLayout(e){this.activeLayout=e,this._originalLayout=JSON.stringify(e),this.selectedItemId=null,this.host.requestUpdate(),this._updateHash()}switchScene(e){this.selectScene(e.id)}selectScene(e){this.activeScene=this.scenes.find(t=>t.id===e)||null,this.host.requestUpdate(),this._updateHash()}discardChanges(){!this.activeLayout||!this._originalLayout||(this.activeLayout=JSON.parse(this._originalLayout),this.selectedItemId=null,this.host.requestUpdate())}updateActiveLayout(e,t=!1){if(t&&(this.isAddingNewLayout=!e.id),!this.activeLayout||t)this.activeLayout={...this.activeLayout?{...this.activeLayout}:{name:`New Layout`,canvas_width_mm:500,canvas_height_mm:500,items:[]},...e},t&&!e.id&&delete this.activeLayout.id;else{if(this.isAddingNewLayout&&!this.activeLayout.id&&e.id)return;this.activeLayout={...this.activeLayout,...e}}this.host.requestUpdate()}updateItem(e,t){if(!this.activeLayout)return;let n=this.activeLayout.items.map(n=>n.id===e?{...n,...t}:n);this.activeLayout={...this.activeLayout,items:n},this.host.requestUpdate()}setSection(e){this.activeSection=e,this.host.requestUpdate(),this._updateHash()}selectItem(e){this.selectedItemId=e,this.host.requestUpdate(),this._updateHash()}selectImage(e){this.selectedImageId=e,this.host.requestUpdate(),this._updateHash()}selectDisplayType(e){this.isAddingNew=e===null,this.selectedDisplayTypeId=e,this.host.requestUpdate(),this._updateHash()}setViewMode(e){this.viewMode=e,this.host.requestUpdate(),this._updateHash()}_updateHash(){let e=`#/${this.activeSection}`;this.activeSection===`layouts`&&this.activeLayout?(e+=`/${this.activeLayout.id}`,this.selectedItemId&&(e+=`/item/${this.selectedItemId}`)):this.activeSection===`scenes`&&this.activeScene?e+=`/${this.activeScene.id}`:this.activeSection===`images`&&this.selectedImageId?e+=`/${this.selectedImageId}`:this.activeSection===`display-types`&&this.selectedDisplayTypeId&&(e+=`/${this.selectedDisplayTypeId}`),this.viewMode===`yaml`&&(e+=`?mode=yaml`),window.location.hash!==e&&(window.location.hash=e)}_applyHash(){let[e,t]=(window.location.hash||`#/layouts`).split(`?`),n=e.substring(2).split(`/`),r=new URLSearchParams(t||``).get(`mode`);(r===`yaml`||r===`graphical`)&&(this.viewMode=r);let i=n[0];if([`display-types`,`layouts`,`images`,`scenes`].includes(i)&&this.activeSection!==i&&(this.activeSection=i,this.isAddingNew=!1),this.activeSection===`layouts`){let e=n[1];if(e){let t=this.layouts.find(t=>t.id===e);t&&this.activeLayout?.id!==e&&(this.activeLayout=t,this._originalLayout=JSON.stringify(t))}let t=n[2]===`item`&&n[3]?n[3]:null;this.selectedItemId!==t&&(this.selectedItemId=t)}else if(this.activeSection===`scenes`){let e=n[1]||null;this.activeScene?.id!==e&&(this.activeScene=(e?this.scenes.find(t=>t.id===e):null)||null)}else if(this.activeSection===`images`){let e=n[1]||null;this.selectedImageId!==e&&(this.selectedImageId=e)}else if(this.activeSection===`display-types`){let e=n[1]||null;this.selectedDisplayTypeId!==e&&(this.selectedDisplayTypeId=e,e!==null&&(this.isAddingNew=!1))}this._ensureSelection(),this.host.requestUpdate()}_ensureSelection(){!this.activeLayout&&this.layouts.length>0&&(this.activeLayout=this.layouts[0],this._originalLayout=JSON.stringify(this.activeLayout)),!this.selectedDisplayTypeId&&this.displayTypes.length>0&&(this.isAddingNew||(this.selectedDisplayTypeId=this.displayTypes[0].id)),!this.activeScene&&this.scenes.length>0&&(this.activeScene=this.scenes[0])}},z=h`
  :host {
    --primary-colour: #03a9f4;
    --primary-hover: #0288d1;
    --danger-colour: #f44336;
    --danger-hover: #d32f2f;
    --text-colour: #333;
    --text-muted: #666;
    --border-colour: #ddd;
    --bg-light: #f8f9fa;
    --shadow-small: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-medium: 0 4px 15px rgba(0,0,0,0.15);
    --shadow-large: 0 15px 35px rgba(0,0,0,0.25);
    --border-radius: 6px;
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  button {
    background: var(--primary-colour);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  button:hover {
    background: var(--primary-hover);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.secondary {
    background: white;
    color: var(--primary-colour);
    border: 1px solid var(--primary-colour);
  }

  button.secondary:hover {
    background: #f0faff;
  }

  button.danger {
    background: white;
    color: var(--danger-colour);
    border: 1px solid var(--danger-colour);
  }

  button.danger:hover {
    background: #fff1f0;
    border-color: #f5222d;
    color: #f5222d;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-colour);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  input:focus, select:focus {
    outline: none;
    border-color: var(--primary-colour);
  }

  .draggable-item {
    cursor: grab;
    user-select: none;
    transition: background-color 0.2s, opacity 0.2s, transform 0.2s;
  }

  .draggable-item:active {
    cursor: grabbing;
  }

  .draggable-item.dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }

  .drag-handle {
    cursor: grab;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .drag-handle:hover {
    color: var(--primary-colour);
  }

  .drag-handle:active {
    cursor: grabbing;
  }
`;function B(e,t){if(typeof Reflect==`object`&&typeof Reflect.metadata==`function`)return Reflect.metadata(e,t)}function V(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Ke=class extends N{constructor(...e){super(...e),this.activeSection=`layouts`,this.connected=!1,this.message=``,this.isSaving=!1,this.isDirty=!1,this.canDelete=!1,this.viewMode=`graphical`}static{this.styles=[z,h`
      header {
        background-color: var(--primary-colour);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-small);
        z-index: 10;
      }
      .header-title {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .nav-group {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: rgba(255,255,255,0.15);
        padding: 4px;
        border-radius: 8px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: transparent;
        padding: 0;
      }
      .nav-item:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
      .nav-item.active {
        background: white;
        color: var(--primary-colour);
      }
      .header-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .message-badge {
        font-size: 13px;
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
      }
      .status-dot {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 0.5rem;
      }
      header button:not(.nav-item) {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
    `]}_dispatch(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}_dispatchSection(e){this.dispatchEvent(new CustomEvent(`set-section`,{detail:e,bubbles:!0,composed:!0}))}get _sectionLabel(){return{"display-types":`Display Types`,layouts:`Layouts`,images:`Images`,scenes:`Scenes`}[this.activeSection]||this.activeSection}render(){return A`
      <header>
        <div class="header-title">
          <div class="nav-group">
            <button class="nav-item ${this.activeSection===`display-types`?`active`:``}" 
              @click="${()=>this._dispatchSection(`display-types`)}" title="Display Types">
              <span class="material-icons">settings_input_component</span>
            </button>
            <button class="nav-item ${this.activeSection===`layouts`?`active`:``}" 
              @click="${()=>this._dispatchSection(`layouts`)}" title="Layouts">
              <span class="material-icons">dashboard</span>
            </button>
            <button class="nav-item ${this.activeSection===`images`?`active`:``}" 
              @click="${()=>this._dispatchSection(`images`)}" title="Images">
              <span class="material-icons">image</span>
            </button>
            <button class="nav-item ${this.activeSection===`scenes`?`active`:``}" 
              @click="${()=>this._dispatchSection(`scenes`)}" title="Scenes">
              <span class="material-icons">landscape</span>
            </button>
          </div>
          <div><strong>eInk Layout Manager - ${this._sectionLabel}</strong></div>
        </div>

        <div class="header-actions">
          ${this.message?A`<span class="message-badge">${this.message}</span>`:``}
          
          ${this.activeSection===`images`?``:A`
          <button class="secondary" @click="${()=>this._dispatch(`toggle-view-mode`)}" title="Switch to ${this.viewMode===`graphical`?`YAML`:`Graphical`} Mode">
            <span class="material-icons">${this.viewMode===`graphical`?`code`:`dashboard`}</span>
          </button>
          `}

          <button class="secondary" @click="${()=>this._dispatch(`add-item`)}" title="Add New Item">
            <span class="material-icons">add</span>
          </button>

          ${this.activeSection===`images`?``:A`
          <button class="secondary" @click="${()=>this._dispatch(`discard-changes`)}" ?disabled="${!this.isDirty||this.isSaving}" title="Discard Changes">
            <span class="material-icons">history</span>
          </button>
          `}

          <button class="secondary" @click="${()=>this._dispatch(`delete-item`)}" ?disabled="${!this.canDelete||this.isSaving}" title="Delete Current Item">
            <span class="material-icons" style="color: var(--danger-colour);">delete</span>
          </button>
          
          ${this.activeSection===`images`?``:A`
          <button class="secondary" @click="${()=>this._dispatch(`save-changes`)}" ?disabled="${this.isSaving}" title="${this.isSaving?`Saving...`:`Save Changes`}">
            <span class="material-icons">${this.isSaving?`sync`:`save`}</span>
          </button>
          `}

          <span class="status-dot">${this.connected?`Online`:`Offline`}</span>
        </div>
      </header>
    `}};V([F({type:String}),B(`design:type`,Object)],Ke.prototype,`activeSection`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],Ke.prototype,`connected`,void 0),V([F({type:String}),B(`design:type`,Object)],Ke.prototype,`message`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],Ke.prototype,`isSaving`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],Ke.prototype,`isDirty`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],Ke.prototype,`canDelete`,void 0),V([F({type:String}),B(`design:type`,String)],Ke.prototype,`viewMode`,void 0),Ke=V([P(`app-header`)],Ke);var qe=class extends N{constructor(...e){super(...e),this.displayTypes=[],this.activeLayout=null,this.selectedItemId=null}static{this.styles=[z,h`
      :host {
        width: 320px;
        flex-shrink: 0;
        background-color: white;
        border-right: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      .sidebar-section {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        flex: 1;
        overflow-y: auto;
      }
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      h3 { margin: 0; font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
      
      .list-item {
        padding: 0.75rem;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }
      .list-item:hover { border-color: var(--primary-colour); background: #f0faff; }
      .list-item.selected { 
        border-color: var(--primary-colour); 
        background: #e1f5fe; 
        box-shadow: 0 2px 8px rgba(3,169,244,0.1); 
      }
      
      .item-details { display: flex; justify-content: space-between; align-items: center; }
      .item-info { flex: 1; }
      .item-name { font-weight: 600; display: block; }
      .item-meta { font-size: 11px; color: #888; }
      .item-actions { display: flex; gap: 4px; }
      
      .sidebar button.secondary,
      .sidebar button.danger {
        padding: 4px;
        border-radius: 4px;
        min-width: 24px;
        height: 24px;
      }
    `]}_dispatch(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){return A`
      <div class="sidebar-section" style="flex: 2;">
        <h3>Layout Items</h3>
        ${(this.activeLayout?.items||[]).map((e,t)=>{let n=this.displayTypes.find(t=>t.id===e.display_type_id);return A`
            <div 
              class="list-item ${this.selectedItemId===e.id?`selected`:``}" 
              @click="${()=>this._dispatch(`select-item`,{id:e.id})}"
              @dblclick="${()=>this._dispatch(`edit-item`,{id:e.id})}"
            >
              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">#${t+1}: ${n?.name||`Unknown`}</span>
                  <span class="item-meta">Pos: ${e.x_mm}, ${e.y_mm} | Orient: ${e.orientation}</span>
                </div>
                <div class="item-actions">
                  <button class="secondary" title="Settings" @click="${t=>{t.stopPropagation(),this._dispatch(`edit-item`,{id:e.id})}}">
                    <span class="material-icons" style="font-size: 16px;">settings</span>
                  </button>
                </div>
              </div>
            </div>
          `})||``}
      </div>
    `}};V([F({type:Array}),B(`design:type`,Array)],qe.prototype,`displayTypes`,void 0),V([F({type:Object}),B(`design:type`,Object)],qe.prototype,`activeLayout`,void 0),V([F({type:String}),B(`design:type`,Object)],qe.prototype,`selectedItemId`,void 0),qe=V([P(`side-bar`)],qe);var H=class extends N{constructor(...e){super(...e),this.width_mm=0,this.height_mm=0,this.border_width_mm=0,this.panel_width_mm=0,this.panel_height_mm=0,this.frame_colour=`#000`,this.mat_colour=`#fff`,this.scale=1,this.orientation=`landscape`}static{this.styles=h`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .preview-layer {
      position: absolute;
      box-shadow: 4px 4px 10px rgba(0,0,0,0.15);
      transition: all 0.2s ease-out;
    }
    .preview-frame { z-index: 10; border-radius: 2px; }
    .preview-mat { z-index: 20; border-radius: 1px; }
    .preview-display { 
      z-index: 30; 
      background: #fff; 
      border: 1px solid rgba(0,0,0,0.1);
    }
  `}render(){let e=this.orientation===`portrait`,t=e?this.height_mm||0:this.width_mm||0,n=e?this.width_mm||0:this.height_mm||0,r=this.border_width_mm||0,i=e?this.panel_height_mm||0:this.panel_width_mm||0,a=e?this.panel_width_mm||0:this.panel_height_mm||0,o=t-2*r,s=n-2*r,c=(o-i)/2,l=(s-a)/2;return A`
      <div class="assembly" style="${`width: ${t*this.scale}px; height: ${n*this.scale}px;`}">
        <div class="preview-layer preview-frame" style="${`width: 100%; height: 100%; background: ${this.frame_colour};`}"></div>
        <div class="preview-layer preview-mat" style="${`
      top: ${r*this.scale}px; 
      left: ${r*this.scale}px; 
      width: ${o*this.scale}px; 
      height: ${s*this.scale}px; 
      background: ${this.mat_colour};
    `}"></div>
        <div class="preview-layer preview-display" style="${`
      top: ${(r+l)*this.scale}px; 
      left: ${(r+c)*this.scale}px; 
      width: ${i*this.scale}px; 
      height: ${a*this.scale}px;
    `}"></div>
      </div>
    `}};V([F({type:Number}),B(`design:type`,Object)],H.prototype,`width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],H.prototype,`height_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],H.prototype,`border_width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],H.prototype,`panel_width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],H.prototype,`panel_height_mm`,void 0),V([F({type:String}),B(`design:type`,Object)],H.prototype,`frame_colour`,void 0),V([F({type:String}),B(`design:type`,Object)],H.prototype,`mat_colour`,void 0),V([F({type:Number}),B(`design:type`,Object)],H.prototype,`scale`,void 0),V([F({type:String}),B(`design:type`,String)],H.prototype,`orientation`,void 0),H=V([P(`hardware-preview`)],H);var U=class extends N{constructor(...e){super(...e),this.layouts=[],this.displayTypes=[],this.activeLayout=null,this.mousePos={x:null,y:null},this._showMenu=!1,this._showDisplayMenu=!1}static{this.styles=[z,h`
      :host {
        background: white;
        display: flex;
        flex: 1;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
      }
      .dropdown {
        position: relative;
        display: inline-block;
      }
      .dropdown-trigger {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: var(--border-radius);
        transition: background 0.2s;
      }
      .dropdown-trigger:hover { background: #f0f2f5; }
      .dropdown-trigger span { font-size: 1.1rem; font-weight: 700; color: #333; }
      .dropdown-trigger .chevron { font-size: 0.8rem; color: #666; transition: transform 0.2s; }
      .dropdown-trigger.active .chevron { transform: rotate(180deg); }
      
      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        min-width: 220px;
        box-shadow: var(--shadow-medium);
        border: 1px solid #eee;
        border-radius: 8px;
        margin-top: 0.5rem;
        z-index: 100;
        overflow: hidden;
        display: none;
      }
      .dropdown-menu.show {
        display: block;
        animation: slideIn 0.2s ease;
      }
      .dropdown-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
      }
      .dropdown-item:hover { background: #f0faff; color: var(--primary-colour); }
      .dropdown-item.selected { background: #e1f5fe; color: var(--primary-colour); font-weight: 600; }
      .dropdown-divider { height: 1px; background: #eee; margin: 4px 0; }
      .dropdown-item.action { color: var(--primary-colour); font-weight: 600; }

      .pos-value { color: var(--primary-colour); font-weight: 600; }
      .canvas-dim { padding-left: 1rem; border-left: 1px solid #ddd; }

      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .settings-button {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }
      .settings-button:hover {
        background: #e4e6e9;
        border-color: #ccc;
        color: #333;
      }
      .settings-button .material-icons {
        font-size: 20px;
      }
      
      .display-type-item {
        padding: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: background 0.2s;
        border-bottom: 1px solid #f0f0f0;
      }
      .display-type-item:last-child { border-bottom: none; }
      .display-type-item:hover { background: #f0faff; }
      
      .display-type-preview {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        border-radius: 4px;
        flex-shrink: 0;
      }
      
      .display-type-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }
      .display-type-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: #333;
      }
      .display-type-meta {
        font-size: 0.75rem;
        color: #888;
      }

      .mouse-info { 
        font-size: 12px; 
        color: #666; 
        display: flex; 
        align-items: center; 
        gap: 1rem;
        margin-left: auto;
      }
    `]}connectedCallback(){super.connectedCallback(),this._handleGlobalClick=e=>{let t=e.composedPath().some(e=>e.classList?.contains(`dropdown`));this._showMenu&&!t&&(this._showMenu=!1),this._showDisplayMenu&&!t&&(this._showDisplayMenu=!1)},window.addEventListener(`click`,this._handleGlobalClick)}disconnectedCallback(){super.disconnectedCallback(),this._handleGlobalClick&&window.removeEventListener(`click`,this._handleGlobalClick)}_dispatch(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),this._showMenu=!1,this._showDisplayMenu=!1}render(){return A`
      <div class="toolbar-actions">
        <div class="dropdown">
          <button id="btn-add-display" class="settings-button" @click="${()=>{this._showDisplayMenu=!this._showDisplayMenu,this._showDisplayMenu&&(this._showMenu=!1)}}" title="Add Display Type">
            <span class="material-icons">add_box</span>
          </button>
          <div id="menu-display-types" class="dropdown-menu ${this._showDisplayMenu?`show`:``}" style="min-width: 280px;">
            ${this.displayTypes.map(e=>A`
              <div class="display-type-item" @click="${()=>this._dispatch(`add-item-to-layout`,e)}">
                <div class="display-type-preview">
                  <hardware-preview
                    .width_mm="${e.width_mm}"
                    .height_mm="${e.height_mm}"
                    .border_width_mm="${e.frame.border_width_mm}"
                    .panel_width_mm="${e.panel_width_mm}"
                    .panel_height_mm="${e.panel_height_mm}"
                    .frame_colour="${e.frame.colour}"
                    .mat_colour="${e.mat.colour}"
                    .scale="${40/Math.max(e.width_mm,e.height_mm)}"
                  ></hardware-preview>
                </div>
                <div class="display-type-info">
                  <span class="display-type-name">${e.name}</span>
                  <span class="display-type-meta">${e.width_mm}x${e.height_mm}mm | ${e.colour_type}</span>
                </div>
              </div>
            `)}
          </div>
        </div>

        <button id="btn-layout-settings" class="settings-button" @click="${()=>this._dispatch(`edit-layout`)}" title="Layout Settings">
          <span class="material-icons">settings</span>
        </button>

        <div class="dropdown">
          <div id="trigger-layouts" class="dropdown-trigger ${this._showMenu?`active`:``}" @click="${()=>{this._showMenu=!this._showMenu,this._showMenu&&(this._showDisplayMenu=!1)}}">
            <span>${this.activeLayout?.name||`Loading...`}</span>
            <div class="chevron">▼</div>
          </div>
          <div id="menu-layouts" class="dropdown-menu ${this._showMenu?`show`:``}">
            ${this.layouts.map(e=>A`
              <div class="dropdown-item ${this.activeLayout?.id===e.id?`selected`:``}" @click="${()=>this._dispatch(`switch-layout`,e)}">
                ${e.name}
                ${this.activeLayout?.id===e.id?A`✓`:``}
              </div>
            `)}
          </div>
        </div>
      </div>

      <div class="mouse-info">
        ${this.mousePos.x===null?``:A`
          <span class="pos-value">X: ${this.mousePos.x}mm, Y: ${this.mousePos.y}mm</span>
        `}
        <span class="canvas-dim">
          Canvas: ${this.activeLayout?.canvas_width_mm}x${this.activeLayout?.canvas_height_mm}mm
        </span>
      </div>
    `}};V([F({type:Array}),B(`design:type`,Array)],U.prototype,`layouts`,void 0),V([F({type:Array}),B(`design:type`,Array)],U.prototype,`displayTypes`,void 0),V([F({type:Object}),B(`design:type`,Object)],U.prototype,`activeLayout`,void 0),V([F({type:Object}),B(`design:type`,Object)],U.prototype,`mousePos`,void 0),V([I(),B(`design:type`,Object)],U.prototype,`_showMenu`,void 0),V([I(),B(`design:type`,Object)],U.prototype,`_showDisplayMenu`,void 0),U=V([P(`app-toolbar`)],U);var Je={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ye=e=>(...t)=>({_$litDirective$:e,values:t}),Xe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},{I:Ze}=Le,W=e=>e,Qe=e=>e.strings===void 0,$e=()=>document.createComment(``),et=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new Ze(r.insertBefore($e(),i),r.insertBefore($e(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=W(e).nextSibling;W(r).insertBefore(e,i),e=t}}}return n},tt=(e,t,n=e)=>(e._$AI(t,n),e),nt={},rt=(e,t=nt)=>e._$AH=t,it=e=>e._$AH,at=e=>{e._$AR(),e._$AA.remove()},ot=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},st=Ye(class extends Xe{constructor(e){if(super(e),e.type!==Je.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=it(e),{values:a,keys:o}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=o,a;let s=this.ut??=[],c=[],l,u,d=0,f=i.length-1,p=0,m=a.length-1;for(;d<=f&&p<=m;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(s[d]===o[p])c[p]=tt(i[d],a[p]),d++,p++;else if(s[f]===o[m])c[m]=tt(i[f],a[m]),f--,m--;else if(s[d]===o[m])c[m]=tt(i[d],a[m]),et(e,c[m+1],i[d]),d++,m--;else if(s[f]===o[p])c[p]=tt(i[f],a[p]),et(e,i[d],i[f]),f--,p++;else if(l===void 0&&(l=ot(o,p,m),u=ot(s,d,f)),l.has(s[d]))if(l.has(s[f])){let t=u.get(o[p]),n=t===void 0?null:i[t];if(n===null){let t=et(e,i[d]);tt(t,a[p]),c[p]=t}else c[p]=tt(n,a[p]),et(e,i[d],n),i[t]=null;p++}else at(i[f]),f--;else at(i[d]),d++;for(;p<=m;){let t=et(e,c[m+1]);tt(t,a[p]),c[p++]=t}for(;d<=f;){let e=i[d++];e!==null&&at(e)}return this.ut=o,rt(e,c),j}}),ct=c(o(((e,t)=>{(function(n,r){typeof e==`object`&&t!==void 0?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self).interact=r()})(e,(function(){function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function n(t){for(var n=1;n<arguments.length;n++){var r=arguments[n]==null?{}:arguments[n];n%2?e(Object(r),!0).forEach((function(e){s(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function r(e){return r=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},r(e)}function i(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,m(r.key),r)}}function o(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),Object.defineProperty(e,`prototype`,{writable:!1}),e}function s(e,t,n){return(t=m(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Super expression must either be null or a function`);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,`prototype`,{writable:!1}),t&&u(e,t)}function l(e){return l=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},l(e)}function u(e,t){return u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},u(e,t)}function d(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function f(e){var t=function(){if(typeof Reflect>`u`||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy==`function`)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch{return!1}}();return function(){var n,r=l(e);if(t){var i=l(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return function(e,t){if(t&&(typeof t==`object`||typeof t==`function`))return t;if(t!==void 0)throw TypeError(`Derived constructors may only return object or undefined`);return d(e)}(this,n)}}function p(){return p=typeof Reflect<`u`&&Reflect.get?Reflect.get.bind():function(e,t,n){var r=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&(e=l(e))!==null;);return e}(e,t);if(r){var i=Object.getOwnPropertyDescriptor(r,t);return i.get?i.get.call(arguments.length<3?e:n):i.value}},p.apply(this,arguments)}function m(e){var t=function(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}(e,`string`);return typeof t==`symbol`?t:t+``}var h=function(e){return!(!e||!e.Window)&&e instanceof e.Window},g=void 0,_=void 0;function v(e){g=e;var t=e.document.createTextNode(``);t.ownerDocument!==e.document&&typeof e.wrap==`function`&&e.wrap(t)===t&&(e=e.wrap(e)),_=e}function y(e){return h(e)?e:(e.ownerDocument||e).defaultView||_.window}typeof window<`u`&&window&&v(window);var ee=function(e){return!!e&&r(e)===`object`},te=function(e){return typeof e==`function`},b={window:function(e){return e===_||h(e)},docFrag:function(e){return ee(e)&&e.nodeType===11},object:ee,func:te,number:function(e){return typeof e==`number`},bool:function(e){return typeof e==`boolean`},string:function(e){return typeof e==`string`},element:function(e){if(!e||r(e)!==`object`)return!1;var t=y(e)||_;return/object|function/.test(typeof Element>`u`?`undefined`:r(Element))?e instanceof Element||e instanceof t.Element:e.nodeType===1&&typeof e.nodeName==`string`},plainObject:function(e){return ee(e)&&!!e.constructor&&/function Object\b/.test(e.constructor.toString())},array:function(e){return ee(e)&&e.length!==void 0&&te(e.splice)}};function x(e){var t=e.interaction;if(t.prepared.name===`drag`){var n=t.prepared.axis;n===`x`?(t.coords.cur.page.y=t.coords.start.page.y,t.coords.cur.client.y=t.coords.start.client.y,t.coords.velocity.client.y=0,t.coords.velocity.page.y=0):n===`y`&&(t.coords.cur.page.x=t.coords.start.page.x,t.coords.cur.client.x=t.coords.start.client.x,t.coords.velocity.client.x=0,t.coords.velocity.page.x=0)}}function ne(e){var t=e.iEvent,n=e.interaction;if(n.prepared.name===`drag`){var r=n.prepared.axis;if(r===`x`||r===`y`){var i=r===`x`?`y`:`x`;t.page[i]=n.coords.start.page[i],t.client[i]=n.coords.start.client[i],t.delta[i]=0}}}var re={id:`actions/drag`,install:function(e){var t=e.actions,n=e.Interactable,r=e.defaults;n.prototype.draggable=re.draggable,t.map.drag=re,t.methodDict.drag=`draggable`,r.actions.drag=re.defaults},listeners:{"interactions:before-action-move":x,"interactions:action-resume":x,"interactions:action-move":ne,"auto-start:check":function(e){var t=e.interaction,n=e.interactable,r=e.buttons,i=n.options.drag;if(i&&i.enabled&&(!t.pointerIsDown||!/mouse|pointer/.test(t.pointerType)||(r&n.options.drag.mouseButtons)!=0))return e.action={name:`drag`,axis:i.lockAxis===`start`?i.startAxis:i.lockAxis},!1}},draggable:function(e){return b.object(e)?(this.options.drag.enabled=!1!==e.enabled,this.setPerAction(`drag`,e),this.setOnEvents(`drag`,e),/^(xy|x|y|start)$/.test(e.lockAxis)&&(this.options.drag.lockAxis=e.lockAxis),/^(xy|x|y)$/.test(e.startAxis)&&(this.options.drag.startAxis=e.startAxis),this):b.bool(e)?(this.options.drag.enabled=e,this):this.options.drag},beforeMove:x,move:ne,defaults:{startAxis:`xy`,lockAxis:`xy`},getCursor:function(){return`move`},filterEventType:function(e){return e.search(`drag`)===0}},S=re,C={init:function(e){var t=e;C.document=t.document,C.DocumentFragment=t.DocumentFragment||ie,C.SVGElement=t.SVGElement||ie,C.SVGSVGElement=t.SVGSVGElement||ie,C.SVGElementInstance=t.SVGElementInstance||ie,C.Element=t.Element||ie,C.HTMLElement=t.HTMLElement||C.Element,C.Event=t.Event,C.Touch=t.Touch||ie,C.PointerEvent=t.PointerEvent||t.MSPointerEvent},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function ie(){}var w=C,T={init:function(e){var t=w.Element,n=e.navigator||{};T.supportsTouch=`ontouchstart`in e||b.func(e.DocumentTouch)&&w.document instanceof e.DocumentTouch,T.supportsPointerEvent=!1!==n.pointerEnabled&&!!w.PointerEvent,T.isIOS=/iP(hone|od|ad)/.test(n.platform),T.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),T.isIe9=/MSIE 9/.test(n.userAgent),T.isOperaMobile=n.appName===`Opera`&&T.supportsTouch&&/Presto/.test(n.userAgent),T.prefixedMatchesSelector=`matches`in t.prototype?`matches`:`webkitMatchesSelector`in t.prototype?`webkitMatchesSelector`:`mozMatchesSelector`in t.prototype?`mozMatchesSelector`:`oMatchesSelector`in t.prototype?`oMatchesSelector`:`msMatchesSelector`,T.pEventTypes=T.supportsPointerEvent?w.PointerEvent===e.MSPointerEvent?{up:`MSPointerUp`,down:`MSPointerDown`,over:`mouseover`,out:`mouseout`,move:`MSPointerMove`,cancel:`MSPointerCancel`}:{up:`pointerup`,down:`pointerdown`,over:`pointerover`,out:`pointerout`,move:`pointermove`,cancel:`pointercancel`}:null,T.wheelEvent=w.document&&`onmousewheel`in w.document?`mousewheel`:`wheel`},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null},E=T;function D(e,t){if(e.contains)return e.contains(t);for(;t;){if(t===e)return!0;t=t.parentNode}return!1}function ae(e,t){for(;b.element(e);){if(O(e,t))return e;e=oe(e)}return null}function oe(e){var t=e.parentNode;if(b.docFrag(t)){for(;(t=t.host)&&b.docFrag(t););return t}return t}function O(e,t){return _!==g&&(t=t.replace(/\/deep\//g,` `)),e[E.prefixedMatchesSelector](t)}var se=function(e){return e.parentNode||e.host};function ce(e,t){for(var n,r=[],i=e;(n=se(i))&&i!==t&&n!==i.ownerDocument;)r.unshift(i),i=n;return r}function le(e,t,n){for(;b.element(e);){if(O(e,t))return!0;if((e=oe(e))===n)return O(e,t)}return!1}function ue(e){return e.correspondingUseElement||e}function de(e){var t=e instanceof w.SVGElement?e.getBoundingClientRect():e.getClientRects()[0];return t&&{left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width||t.right-t.left,height:t.height||t.bottom-t.top}}function fe(e){var t,n=de(e);if(!E.isIOS7&&n){var r={x:(t=(t=y(e))||_).scrollX||t.document.documentElement.scrollLeft,y:t.scrollY||t.document.documentElement.scrollTop};n.left+=r.x,n.right+=r.x,n.top+=r.y,n.bottom+=r.y}return n}function pe(e){for(var t=[];e;)t.push(e),e=oe(e);return t}function me(e){return!!b.string(e)&&(w.document.querySelector(e),!0)}function k(e,t){for(var n in t)e[n]=t[n];return e}function he(e,t,n){return e===`parent`?oe(n):e===`self`?t.getRect(n):ae(n,e)}function ge(e,t,n,r){var i=e;return b.string(i)?i=he(i,t,n):b.func(i)&&(i=i.apply(void 0,r)),b.element(i)&&(i=fe(i)),i}function _e(e){return e&&{x:`x`in e?e.x:e.left,y:`y`in e?e.y:e.top}}function ve(e){return!e||`x`in e&&`y`in e||((e=k({},e)).x=e.left||0,e.y=e.top||0,e.width=e.width||(e.right||0)-e.x,e.height=e.height||(e.bottom||0)-e.y),e}function ye(e,t,n){e.left&&(t.left+=n.x),e.right&&(t.right+=n.x),e.top&&(t.top+=n.y),e.bottom&&(t.bottom+=n.y),t.width=t.right-t.left,t.height=t.bottom-t.top}function be(e,t,n){var r=n&&e.options[n];return _e(ge(r&&r.origin||e.options.origin,e,t,[e&&t]))||{x:0,y:0}}function xe(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:function(e){return!0},r=arguments.length>3?arguments[3]:void 0;if(r||={},b.string(e)&&e.search(` `)!==-1&&(e=Se(e)),b.array(e))return e.forEach((function(e){return xe(e,t,n,r)})),r;if(b.object(e)&&(t=e,e=``),b.func(t)&&n(e))r[e]=r[e]||[],r[e].push(t);else if(b.array(t))for(var i=0,a=t;i<a.length;i++){var o=a[i];xe(e,o,n,r)}else if(b.object(t))for(var s in t)xe(Se(s).map((function(t){return`${e}${t}`})),t[s],n,r);return r}function Se(e){return e.trim().split(/ +/)}var Ce=function(e,t){return Math.sqrt(e*e+t*t)},A=[`webkit`,`moz`];function j(e,t){e.__set||={};var n=function(n){if(A.some((function(e){return n.indexOf(e)===0})))return 1;typeof e[n]!=`function`&&n!==`__set`&&Object.defineProperty(e,n,{get:function(){return n in e.__set?e.__set[n]:e.__set[n]=t[n]},set:function(t){e.__set[n]=t},configurable:!0})};for(var r in t)n(r);return e}function M(e,t){e.page=e.page||{},e.page.x=t.page.x,e.page.y=t.page.y,e.client=e.client||{},e.client.x=t.client.x,e.client.y=t.client.y,e.timeStamp=t.timeStamp}function we(e){e.page.x=0,e.page.y=0,e.client.x=0,e.client.y=0}function Te(e){return e instanceof w.Event||e instanceof w.Touch}function Ee(e,t,n){return e||=`page`,(n||={}).x=t[e+`X`],n.y=t[e+`Y`],n}function De(e,t){return t||={x:0,y:0},E.isOperaMobile&&Te(e)?(Ee(`screen`,e,t),t.x+=window.scrollX,t.y+=window.scrollY):Ee(`page`,e,t),t}function Oe(e){return b.number(e.pointerId)?e.pointerId:e.identifier}function ke(e,t,n){var r=t.length>1?je(t):t[0];De(r,e.page),function(e,t){t||={},E.isOperaMobile&&Te(e)?Ee(`screen`,e,t):Ee(`client`,e,t)}(r,e.client),e.timeStamp=n}function Ae(e){var t=[];return b.array(e)?(t[0]=e[0],t[1]=e[1]):e.type===`touchend`?e.touches.length===1?(t[0]=e.touches[0],t[1]=e.changedTouches[0]):e.touches.length===0&&(t[0]=e.changedTouches[0],t[1]=e.changedTouches[1]):(t[0]=e.touches[0],t[1]=e.touches[1]),t}function je(e){for(var t={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<e.length;n++){var r=e[n];for(var i in t)t[i]+=r[i]}for(var a in t)t[a]/=e.length;return t}function Me(e){if(!e.length)return null;var t=Ae(e),n=Math.min(t[0].pageX,t[1].pageX),r=Math.min(t[0].pageY,t[1].pageY),i=Math.max(t[0].pageX,t[1].pageX),a=Math.max(t[0].pageY,t[1].pageY);return{x:n,y:r,left:n,top:r,right:i,bottom:a,width:i-n,height:a-r}}function Ne(e,t){var n=t+`X`,r=t+`Y`,i=Ae(e);return Ce(i[0][n]-i[1][n],i[0][r]-i[1][r])}function Pe(e,t){var n=t+`X`,r=t+`Y`,i=Ae(e),a=i[1][n]-i[0][n],o=i[1][r]-i[0][r];return 180*Math.atan2(o,a)/Math.PI}function Fe(e){return b.string(e.pointerType)?e.pointerType:b.number(e.pointerType)?[void 0,void 0,`touch`,`pen`,`mouse`][e.pointerType]:/touch/.test(e.type||``)||e instanceof w.Touch?`touch`:`mouse`}function Ie(e){var t=b.func(e.composedPath)?e.composedPath():e.path;return[ue(t?t[0]:e.target),ue(e.currentTarget)]}var Le=function(){function e(t){i(this,e),this.immediatePropagationStopped=!1,this.propagationStopped=!1,this._interaction=t}return o(e,[{key:`preventDefault`,value:function(){}},{key:`stopPropagation`,value:function(){this.propagationStopped=!0}},{key:`stopImmediatePropagation`,value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),e}();Object.defineProperty(Le.prototype,`interaction`,{get:function(){return this._interaction._proxy},set:function(){}});var Re=function(e,t){for(var n=0;n<t.length;n++){var r=t[n];e.push(r)}return e},ze=function(e){return Re([],e)},Be=function(e,t){for(var n=0;n<e.length;n++)if(t(e[n],n,e))return n;return-1},N=function(e,t){return e[Be(e,t)]},Ve=function(e){c(n,e);var t=f(n);function n(e,r,a){var o;i(this,n),(o=t.call(this,r._interaction)).dropzone=void 0,o.dragEvent=void 0,o.relatedTarget=void 0,o.draggable=void 0,o.propagationStopped=!1,o.immediatePropagationStopped=!1;var s=a===`dragleave`?e.prev:e.cur,c=s.element,l=s.dropzone;return o.type=a,o.target=c,o.currentTarget=c,o.dropzone=l,o.dragEvent=r,o.relatedTarget=r.target,o.draggable=r.interactable,o.timeStamp=r.timeStamp,o}return o(n,[{key:`reject`,value:function(){var e=this,t=this._interaction.dropState;if(this.type===`dropactivate`||this.dropzone&&t.cur.dropzone===this.dropzone&&t.cur.element===this.target)if(t.prev.dropzone=this.dropzone,t.prev.element=this.target,t.rejected=!0,t.events.enter=null,this.stopImmediatePropagation(),this.type===`dropactivate`){var r=t.activeDrops,i=Be(r,(function(t){var n=t.dropzone,r=t.element;return n===e.dropzone&&r===e.target}));t.activeDrops.splice(i,1);var a=new n(t,this.dragEvent,`dropdeactivate`);a.dropzone=this.dropzone,a.target=this.target,this.dropzone.fire(a)}else this.dropzone.fire(new n(t,this.dragEvent,`dragleave`))}},{key:`preventDefault`,value:function(){}},{key:`stopPropagation`,value:function(){this.propagationStopped=!0}},{key:`stopImmediatePropagation`,value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),n}(Le);function P(e,t){for(var n=0,r=e.slice();n<r.length;n++){var i=r[n],a=i.dropzone,o=i.element;t.dropzone=a,t.target=o,a.fire(t),t.propagationStopped=t.immediatePropagationStopped=!1}}function He(e,t){for(var n=function(e,t){for(var n=[],r=0,i=e.interactables.list;r<i.length;r++){var a=i[r];if(a.options.drop.enabled){var o=a.options.drop.accept;if(!(b.element(o)&&o!==t||b.string(o)&&!O(t,o)||b.func(o)&&!o({dropzone:a,draggableElement:t})))for(var s=0,c=a.getAllElements();s<c.length;s++){var l=c[s];l!==t&&n.push({dropzone:a,element:l,rect:a.getRect(l)})}}}return n}(e,t),r=0;r<n.length;r++){var i=n[r];i.rect=i.dropzone.getRect(i.element)}return n}function Ue(e,t,n){for(var r=e.dropState,i=e.interactable,a=e.element,o=[],s=0,c=r.activeDrops;s<c.length;s++){var l=c[s],u=l.dropzone,d=l.element,f=l.rect,p=u.dropCheck(t,n,i,a,d,f);o.push(p?d:null)}var m=function(e){for(var t,n,r,i=[],a=0;a<e.length;a++){var o=e[a],s=e[t];if(o&&a!==t)if(s){var c=se(o),l=se(s);if(c!==o.ownerDocument)if(l!==o.ownerDocument)if(c!==l){i=i.length?i:ce(s);var u=void 0;if(s instanceof w.HTMLElement&&o instanceof w.SVGElement&&!(o instanceof w.SVGSVGElement)){if(o===l)continue;u=o.ownerSVGElement}else u=o;for(var d=ce(u,s.ownerDocument),f=0;d[f]&&d[f]===i[f];)f++;var p=[d[f-1],d[f],i[f]];if(p[0])for(var m=p[0].lastChild;m;){if(m===p[1]){t=a,i=d;break}if(m===p[2])break;m=m.previousSibling}}else r=s,(parseInt(y(n=o).getComputedStyle(n).zIndex,10)||0)>=(parseInt(y(r).getComputedStyle(r).zIndex,10)||0)&&(t=a);else t=a}else t=a}return t}(o);return r.activeDrops[m]||null}function F(e,t,n){var r=e.dropState,i={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return n.type===`dragstart`&&(i.activate=new Ve(r,n,`dropactivate`),i.activate.target=null,i.activate.dropzone=null),n.type===`dragend`&&(i.deactivate=new Ve(r,n,`dropdeactivate`),i.deactivate.target=null,i.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(i.leave=new Ve(r,n,`dragleave`),n.dragLeave=i.leave.target=r.prev.element,n.prevDropzone=i.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(i.enter=new Ve(r,n,`dragenter`),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),n.type===`dragend`&&r.cur.dropzone&&(i.drop=new Ve(r,n,`drop`),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),n.type===`dragmove`&&r.cur.dropzone&&(i.move=new Ve(r,n,`dropmove`),n.dropzone=r.cur.dropzone)),i}function I(e,t){var n=e.dropState,r=n.activeDrops,i=n.cur,a=n.prev;t.leave&&a.dropzone.fire(t.leave),t.enter&&i.dropzone.fire(t.enter),t.move&&i.dropzone.fire(t.move),t.drop&&i.dropzone.fire(t.drop),t.deactivate&&P(r,t.deactivate),n.prev.dropzone=i.dropzone,n.prev.element=i.element}function We(e,t){var n=e.interaction,r=e.iEvent,i=e.event;if(r.type===`dragmove`||r.type===`dragend`){var a=n.dropState;t.dynamicDrop&&(a.activeDrops=He(t,n.element));var o=r,s=Ue(n,o,i);a.rejected=a.rejected&&!!s&&s.dropzone===a.cur.dropzone&&s.element===a.cur.element,a.cur.dropzone=s&&s.dropzone,a.cur.element=s&&s.element,a.events=F(n,0,o)}}var L={id:`actions/drop`,install:function(e){var t=e.actions,n=e.interactStatic,r=e.Interactable,i=e.defaults;e.usePlugin(S),r.prototype.dropzone=function(e){return function(e,t){if(b.object(t)){if(e.options.drop.enabled=!1!==t.enabled,t.listeners){var n=xe(t.listeners),r=Object.keys(n).reduce((function(e,t){return e[/^(enter|leave)/.test(t)?`drag${t}`:/^(activate|deactivate|move)/.test(t)?`drop${t}`:t]=n[t],e}),{}),i=e.options.drop.listeners;i&&e.off(i),e.on(r),e.options.drop.listeners=r}return b.func(t.ondrop)&&e.on(`drop`,t.ondrop),b.func(t.ondropactivate)&&e.on(`dropactivate`,t.ondropactivate),b.func(t.ondropdeactivate)&&e.on(`dropdeactivate`,t.ondropdeactivate),b.func(t.ondragenter)&&e.on(`dragenter`,t.ondragenter),b.func(t.ondragleave)&&e.on(`dragleave`,t.ondragleave),b.func(t.ondropmove)&&e.on(`dropmove`,t.ondropmove),/^(pointer|center)$/.test(t.overlap)?e.options.drop.overlap=t.overlap:b.number(t.overlap)&&(e.options.drop.overlap=Math.max(Math.min(1,t.overlap),0)),`accept`in t&&(e.options.drop.accept=t.accept),`checker`in t&&(e.options.drop.checker=t.checker),e}return b.bool(t)?(e.options.drop.enabled=t,e):e.options.drop}(this,e)},r.prototype.dropCheck=function(e,t,n,r,i,a){return function(e,t,n,r,i,a,o){var s=!1;if(!(o||=e.getRect(a)))return!!e.options.drop.checker&&e.options.drop.checker(t,n,s,e,a,r,i);var c=e.options.drop.overlap;if(c===`pointer`){var l=be(r,i,`drag`),u=De(t);u.x+=l.x,u.y+=l.y;var d=u.x>o.left&&u.x<o.right,f=u.y>o.top&&u.y<o.bottom;s=d&&f}var p=r.getRect(i);if(p&&c===`center`){var m=p.left+p.width/2,h=p.top+p.height/2;s=m>=o.left&&m<=o.right&&h>=o.top&&h<=o.bottom}return p&&b.number(c)&&(s=Math.max(0,Math.min(o.right,p.right)-Math.max(o.left,p.left))*Math.max(0,Math.min(o.bottom,p.bottom)-Math.max(o.top,p.top))/(p.width*p.height)>=c),e.options.drop.checker&&(s=e.options.drop.checker(t,n,s,e,a,r,i)),s}(this,e,t,n,r,i,a)},n.dynamicDrop=function(t){return b.bool(t)?(e.dynamicDrop=t,n):e.dynamicDrop},k(t.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),t.methodDict.drop=`dropzone`,e.dynamicDrop=!1,i.actions.drop=L.defaults},listeners:{"interactions:before-action-start":function(e){var t=e.interaction;t.prepared.name===`drag`&&(t.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]})},"interactions:after-action-start":function(e,t){var n=e.interaction,r=(e.event,e.iEvent);if(n.prepared.name===`drag`){var i=n.dropState;i.activeDrops=[],i.events={},i.activeDrops=He(t,n.element),i.events=F(n,0,r),i.events.activate&&(P(i.activeDrops,i.events.activate),t.fire(`actions/drop:start`,{interaction:n,dragEvent:r}))}},"interactions:action-move":We,"interactions:after-action-move":function(e,t){var n=e.interaction,r=e.iEvent;if(n.prepared.name===`drag`){var i=n.dropState;I(n,i.events),t.fire(`actions/drop:move`,{interaction:n,dragEvent:r}),i.events={}}},"interactions:action-end":function(e,t){if(e.interaction.prepared.name===`drag`){var n=e.interaction,r=e.iEvent;We(e,t),I(n,n.dropState.events),t.fire(`actions/drop:end`,{interaction:n,dragEvent:r})}},"interactions:stop":function(e){var t=e.interaction;if(t.prepared.name===`drag`){var n=t.dropState;n&&(n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1)}}},getActiveDrops:He,getDrop:Ue,getDropEvents:F,fireDropEvents:I,filterEventType:function(e){return e.search(`drag`)===0||e.search(`drop`)===0},defaults:{enabled:!1,accept:null,overlap:`pointer`}},R=L;function Ge(e){var t=e.interaction,n=e.iEvent,r=e.phase;if(t.prepared.name===`gesture`){var i=t.pointers.map((function(e){return e.pointer})),a=r===`start`,o=r===`end`,s=t.interactable.options.deltaSource;if(n.touches=[i[0],i[1]],a)n.distance=Ne(i,s),n.box=Me(i),n.scale=1,n.ds=0,n.angle=Pe(i,s),n.da=0,t.gesture.startDistance=n.distance,t.gesture.startAngle=n.angle;else if(o||t.pointers.length<2){var c=t.prevEvent;n.distance=c.distance,n.box=c.box,n.scale=c.scale,n.ds=0,n.angle=c.angle,n.da=0}else n.distance=Ne(i,s),n.box=Me(i),n.scale=n.distance/t.gesture.startDistance,n.angle=Pe(i,s),n.ds=n.scale-t.gesture.scale,n.da=n.angle-t.gesture.angle;t.gesture.distance=n.distance,t.gesture.angle=n.angle,b.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(t.gesture.scale=n.scale)}}var z={id:`actions/gesture`,before:[`actions/drag`,`actions/resize`],install:function(e){var t=e.actions,n=e.Interactable,r=e.defaults;n.prototype.gesturable=function(e){return b.object(e)?(this.options.gesture.enabled=!1!==e.enabled,this.setPerAction(`gesture`,e),this.setOnEvents(`gesture`,e),this):b.bool(e)?(this.options.gesture.enabled=e,this):this.options.gesture},t.map.gesture=z,t.methodDict.gesture=`gesturable`,r.actions.gesture=z.defaults},listeners:{"interactions:action-start":Ge,"interactions:action-move":Ge,"interactions:action-end":Ge,"interactions:new":function(e){e.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0}},"auto-start:check":function(e){if(!(e.interaction.pointers.length<2)){var t=e.interactable.options.gesture;if(t&&t.enabled)return e.action={name:`gesture`},!1}}},defaults:{},getCursor:function(){return``},filterEventType:function(e){return e.search(`gesture`)===0}},B=z;function V(e,t,n,r,i,a,o){if(!t)return!1;if(!0===t){var s=b.number(a.width)?a.width:a.right-a.left,c=b.number(a.height)?a.height:a.bottom-a.top;if(o=Math.min(o,Math.abs((e===`left`||e===`right`?s:c)/2)),s<0&&(e===`left`?e=`right`:e===`right`&&(e=`left`)),c<0&&(e===`top`?e=`bottom`:e===`bottom`&&(e=`top`)),e===`left`){var l=s>=0?a.left:a.right;return n.x<l+o}if(e===`top`){var u=c>=0?a.top:a.bottom;return n.y<u+o}if(e===`right`)return n.x>(s>=0?a.right:a.left)-o;if(e===`bottom`)return n.y>(c>=0?a.bottom:a.top)-o}return!!b.element(r)&&(b.element(t)?t===r:le(r,t,i))}function Ke(e){var t=e.iEvent,n=e.interaction;if(n.prepared.name===`resize`&&n.resizeAxes){var r=t;n.interactable.options.resize.square?(n.resizeAxes===`y`?r.delta.x=r.delta.y:r.delta.y=r.delta.x,r.axes=`xy`):(r.axes=n.resizeAxes,n.resizeAxes===`x`?r.delta.y=0:n.resizeAxes===`y`&&(r.delta.x=0))}}var qe,H,U={id:`actions/resize`,before:[`actions/drag`],install:function(e){var t=e.actions,n=e.browser,r=e.Interactable,i=e.defaults;U.cursors=function(e){return e.isIe9?{x:`e-resize`,y:`s-resize`,xy:`se-resize`,top:`n-resize`,left:`w-resize`,bottom:`s-resize`,right:`e-resize`,topleft:`se-resize`,bottomright:`se-resize`,topright:`ne-resize`,bottomleft:`ne-resize`}:{x:`ew-resize`,y:`ns-resize`,xy:`nwse-resize`,top:`ns-resize`,left:`ew-resize`,bottom:`ns-resize`,right:`ew-resize`,topleft:`nwse-resize`,bottomright:`nwse-resize`,topright:`nesw-resize`,bottomleft:`nesw-resize`}}(n),U.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(t){return function(e,t,n){return b.object(t)?(e.options.resize.enabled=!1!==t.enabled,e.setPerAction(`resize`,t),e.setOnEvents(`resize`,t),b.string(t.axis)&&/^x$|^y$|^xy$/.test(t.axis)?e.options.resize.axis=t.axis:t.axis===null&&(e.options.resize.axis=n.defaults.actions.resize.axis),b.bool(t.preserveAspectRatio)?e.options.resize.preserveAspectRatio=t.preserveAspectRatio:b.bool(t.square)&&(e.options.resize.square=t.square),e):b.bool(t)?(e.options.resize.enabled=t,e):e.options.resize}(this,t,e)},t.map.resize=U,t.methodDict.resize=`resizable`,i.actions.resize=U.defaults},listeners:{"interactions:new":function(e){e.interaction.resizeAxes=`xy`},"interactions:action-start":function(e){(function(e){var t=e.iEvent,n=e.interaction;if(n.prepared.name===`resize`&&n.prepared.edges){var r=t,i=n.rect;n._rects={start:k({},i),corrected:k({},i),previous:k({},i),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}})(e),Ke(e)},"interactions:action-move":function(e){(function(e){var t=e.iEvent,n=e.interaction;if(n.prepared.name===`resize`&&n.prepared.edges){var r=t,i=n.interactable.options.resize.invert,a=i===`reposition`||i===`negate`,o=n.rect,s=n._rects,c=s.start,l=s.corrected,u=s.delta,d=s.previous;if(k(d,l),a){if(k(l,o),i===`reposition`){if(l.top>l.bottom){var f=l.top;l.top=l.bottom,l.bottom=f}if(l.left>l.right){var p=l.left;l.left=l.right,l.right=p}}}else l.top=Math.min(o.top,c.bottom),l.bottom=Math.max(o.bottom,c.top),l.left=Math.min(o.left,c.right),l.right=Math.max(o.right,c.left);for(var m in l.width=l.right-l.left,l.height=l.bottom-l.top,l)u[m]=l[m]-d[m];r.edges=n.prepared.edges,r.rect=l,r.deltaRect=u}})(e),Ke(e)},"interactions:action-end":function(e){var t=e.iEvent,n=e.interaction;if(n.prepared.name===`resize`&&n.prepared.edges){var r=t;r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}},"auto-start:check":function(e){var t=e.interaction,n=e.interactable,r=e.element,i=e.rect,a=e.buttons;if(i){var o=k({},t.coords.cur.page),s=n.options.resize;if(s&&s.enabled&&(!t.pointerIsDown||!/mouse|pointer/.test(t.pointerType)||(a&s.mouseButtons)!=0)){if(b.object(s.edges)){var c={left:!1,right:!1,top:!1,bottom:!1};for(var l in c)c[l]=V(l,s.edges[l],o,t._latestPointer.eventTarget,r,i,s.margin||U.defaultMargin);c.left=c.left&&!c.right,c.top=c.top&&!c.bottom,(c.left||c.right||c.top||c.bottom)&&(e.action={name:`resize`,edges:c})}else{var u=s.axis!==`y`&&o.x>i.right-U.defaultMargin,d=s.axis!==`x`&&o.y>i.bottom-U.defaultMargin;(u||d)&&(e.action={name:`resize`,axes:(u?`x`:``)+(d?`y`:``)})}return!e.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:`xy`,margin:NaN,edges:null,invert:`none`},cursors:null,getCursor:function(e){var t=e.edges,n=e.axis,r=e.name,i=U.cursors,a=null;if(n)a=i[r+n];else if(t){for(var o=``,s=0,c=[`top`,`bottom`,`left`,`right`];s<c.length;s++){var l=c[s];t[l]&&(o+=l)}a=i[o]}return a},filterEventType:function(e){return e.search(`resize`)===0},defaultMargin:null},Je=U,Ye={id:`actions`,install:function(e){e.usePlugin(B),e.usePlugin(Je),e.usePlugin(S),e.usePlugin(R)}},Xe=0,Ze={request:function(e){return qe(e)},cancel:function(e){return H(e)},init:function(e){if(qe=e.requestAnimationFrame,H=e.cancelAnimationFrame,!qe)for(var t=[`ms`,`moz`,`webkit`,`o`],n=0;n<t.length;n++){var r=t[n];qe=e[`${r}RequestAnimationFrame`],H=e[`${r}CancelAnimationFrame`]||e[`${r}CancelRequestAnimationFrame`]}qe&&=qe.bind(e),H&&=H.bind(e),qe||(qe=function(t){var n=Date.now(),r=Math.max(0,16-(n-Xe)),i=e.setTimeout((function(){t(n+r)}),r);return Xe=n+r,i},H=function(e){return clearTimeout(e)})}},W={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(e){W.isScrolling=!0,Ze.cancel(W.i),e.autoScroll=W,W.interaction=e,W.prevTime=W.now(),W.i=Ze.request(W.scroll)},stop:function(){W.isScrolling=!1,W.interaction&&(W.interaction.autoScroll=null),Ze.cancel(W.i)},scroll:function(){var e=W.interaction,t=e.interactable,n=e.element,r=e.prepared.name,i=t.options[r].autoScroll,a=Qe(i.container,t,n),o=W.now(),s=(o-W.prevTime)/1e3,c=i.speed*s;if(c>=1){var l={x:W.x*c,y:W.y*c};if(l.x||l.y){var u=$e(a);b.window(a)?a.scrollBy(l.x,l.y):a&&(a.scrollLeft+=l.x,a.scrollTop+=l.y);var d=$e(a),f={x:d.x-u.x,y:d.y-u.y};(f.x||f.y)&&t.fire({type:`autoscroll`,target:n,interactable:t,delta:f,interaction:e,container:a})}W.prevTime=o}W.isScrolling&&(Ze.cancel(W.i),W.i=Ze.request(W.scroll))},check:function(e,t){return e.options[t].autoScroll?.enabled},onInteractionMove:function(e){var t=e.interaction,n=e.pointer;if(t.interacting()&&W.check(t.interactable,t.prepared.name))if(t.simulation)W.x=W.y=0;else{var r,i,a,o,s=t.interactable,c=t.element,l=t.prepared.name,u=s.options[l].autoScroll,d=Qe(u.container,s,c);if(b.window(d))o=n.clientX<W.margin,r=n.clientY<W.margin,i=n.clientX>d.innerWidth-W.margin,a=n.clientY>d.innerHeight-W.margin;else{var f=de(d);o=n.clientX<f.left+W.margin,r=n.clientY<f.top+W.margin,i=n.clientX>f.right-W.margin,a=n.clientY>f.bottom-W.margin}W.x=i?1:o?-1:0,W.y=a?1:r?-1:0,W.isScrolling||(W.margin=u.margin,W.speed=u.speed,W.start(t))}}};function Qe(e,t,n){return(b.string(e)?he(e,t,n):e)||y(n)}function $e(e){return b.window(e)&&(e=window.document.body),{x:e.scrollLeft,y:e.scrollTop}}var et={id:`auto-scroll`,install:function(e){var t=e.defaults,n=e.actions;e.autoScroll=W,W.now=function(){return e.now()},n.phaselessTypes.autoscroll=!0,t.perAction.autoScroll=W.defaults},listeners:{"interactions:new":function(e){e.interaction.autoScroll=null},"interactions:destroy":function(e){e.interaction.autoScroll=null,W.stop(),W.interaction&&=null},"interactions:stop":W.stop,"interactions:action-move":function(e){return W.onInteractionMove(e)}}};function tt(e,t){var n=!1;return function(){return n||=(_.console.warn(t),!0),e.apply(this,arguments)}}function nt(e,t){return e.name=t.name,e.axis=t.axis,e.edges=t.edges,e}function rt(e){return b.bool(e)?(this.options.styleCursor=e,this):e===null?(delete this.options.styleCursor,this):this.options.styleCursor}function it(e){return b.func(e)?(this.options.actionChecker=e,this):e===null?(delete this.options.actionChecker,this):this.options.actionChecker}var at={id:`auto-start/interactableMethods`,install:function(e){var t=e.Interactable;t.prototype.getAction=function(t,n,r,i){var a=function(e,t,n,r,i){var a={action:null,interactable:e,interaction:n,element:r,rect:e.getRect(r),buttons:t.buttons||{0:1,1:4,3:8,4:16}[t.button]};return i.fire(`auto-start:check`,a),a.action}(this,n,r,i,e);return this.options.actionChecker?this.options.actionChecker(t,n,a,this,i,r):a},t.prototype.ignoreFrom=tt((function(e){return this._backCompatOption(`ignoreFrom`,e)}),`Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).`),t.prototype.allowFrom=tt((function(e){return this._backCompatOption(`allowFrom`,e)}),`Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).`),t.prototype.actionChecker=it,t.prototype.styleCursor=rt}};function ot(e,t,n,r,i){return t.testIgnoreAllow(t.options[e.name],n,r)&&t.options[e.name].enabled&&lt(t,n,e,i)?e:null}function st(e,t,n,r,i,a,o){for(var s=0,c=r.length;s<c;s++){var l=r[s],u=i[s],d=l.getAction(t,n,e,u);if(d){var f=ot(d,l,u,a,o);if(f)return{action:f,interactable:l,element:u}}}return{action:null,interactable:null,element:null}}function ct(e,t,n,r,i){var a=[],o=[],s=r;function c(e){a.push(e),o.push(s)}for(;b.element(s);){a=[],o=[],i.interactables.forEachMatch(s,c);var l=st(e,t,n,a,o,r,i);if(l.action&&!l.interactable.options[l.action.name].manualStart)return l;s=oe(s)}return{action:null,interactable:null,element:null}}function G(e,t,n){var r=t.action,i=t.interactable,a=t.element;r||={name:null},e.interactable=i,e.element=a,nt(e.prepared,r),e.rect=i&&r.name?i.getRect(a):null,ft(e,n),n.fire(`autoStart:prepared`,{interaction:e})}function lt(e,t,n,r){var i=e.options,a=i[n.name].max,o=i[n.name].maxPerElement,s=r.autoStart.maxInteractions,c=0,l=0,u=0;if(!(a&&o&&s))return!1;for(var d=0,f=r.interactions.list;d<f.length;d++){var p=f[d],m=p.prepared.name;if(p.interacting()&&(++c>=s||p.interactable===e&&((l+=+(m===n.name))>=a||p.element===t&&(u++,m===n.name&&u>=o))))return!1}return s>0}function ut(e,t){return b.number(e)?(t.autoStart.maxInteractions=e,this):t.autoStart.maxInteractions}function dt(e,t,n){var r=n.autoStart.cursorElement;r&&r!==e&&(r.style.cursor=``),e.ownerDocument.documentElement.style.cursor=t,e.style.cursor=t,n.autoStart.cursorElement=t?e:null}function ft(e,t){var n=e.interactable,r=e.element,i=e.prepared;if(e.pointerType===`mouse`&&n&&n.options.styleCursor){var a=``;if(i.name){var o=n.options[i.name].cursorChecker;a=b.func(o)?o(i,n,r,e._interacting):t.actions.map[i.name].getCursor(i)}dt(e.element,a||``,t)}else t.autoStart.cursorElement&&dt(t.autoStart.cursorElement,``,t)}var pt={id:`auto-start/base`,before:[`actions`],install:function(e){var t=e.interactStatic,n=e.defaults;e.usePlugin(at),n.base.actionChecker=null,n.base.styleCursor=!0,k(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),t.maxInteractions=function(t){return ut(t,e)},e.autoStart={maxInteractions:1/0,withinInteractionLimit:lt,cursorElement:null}},listeners:{"interactions:down":function(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget;n.interacting()||G(n,ct(n,r,i,a,t),t)},"interactions:move":function(e,t){(function(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget;n.pointerType!==`mouse`||n.pointerIsDown||n.interacting()||G(n,ct(n,r,i,a,t),t)})(e,t),function(e,t){var n=e.interaction;if(n.pointerIsDown&&!n.interacting()&&n.pointerWasMoved&&n.prepared.name){t.fire(`autoStart:before-start`,e);var r=n.interactable,i=n.prepared.name;i&&r&&(r.options[i].manualStart||!lt(r,n.element,n.prepared,t)?n.stop():(n.start(n.prepared,r,n.element),ft(n,t)))}}(e,t)},"interactions:stop":function(e,t){var n=e.interaction,r=n.interactable;r&&r.options.styleCursor&&dt(n.element,``,t)}},maxInteractions:ut,withinInteractionLimit:lt,validateAction:ot},mt={id:`auto-start/dragAxis`,listeners:{"autoStart:before-start":function(e,t){var n=e.interaction,r=e.eventTarget,i=e.dx,a=e.dy;if(n.prepared.name===`drag`){var o=Math.abs(i),s=Math.abs(a),c=n.interactable.options.drag,l=c.startAxis,u=o>s?`x`:o<s?`y`:`xy`;if(n.prepared.axis=c.lockAxis===`start`?u[0]:c.lockAxis,u!==`xy`&&l!==`xy`&&l!==u){n.prepared.name=null;for(var d=r,f=function(e){if(e!==n.interactable){var i=n.interactable.options.drag;if(!i.manualStart&&e.testIgnoreAllow(i,d,r)){var a=e.getAction(n.downPointer,n.downEvent,n,d);if(a&&a.name===`drag`&&function(e,t){if(!t)return!1;var n=t.options.drag.startAxis;return e===`xy`||n===`xy`||n===e}(u,e)&&pt.validateAction(a,e,d,r,t))return e}}};b.element(d);){var p=t.interactables.forEachMatch(d,f);if(p){n.prepared.name=`drag`,n.interactable=p,n.element=d;break}d=oe(d)}}}}}};function ht(e){var t=e.prepared&&e.prepared.name;if(!t)return null;var n=e.interactable.options;return n[t].hold||n[t].delay}var gt={id:`auto-start/hold`,install:function(e){var t=e.defaults;e.usePlugin(pt),t.perAction.hold=0,t.perAction.delay=0},listeners:{"interactions:new":function(e){e.interaction.autoStartHoldTimer=null},"autoStart:prepared":function(e){var t=e.interaction,n=ht(t);n>0&&(t.autoStartHoldTimer=setTimeout((function(){t.start(t.prepared,t.interactable,t.element)}),n))},"interactions:move":function(e){var t=e.interaction,n=e.duplicate;t.autoStartHoldTimer&&t.pointerWasMoved&&!n&&(clearTimeout(t.autoStartHoldTimer),t.autoStartHoldTimer=null)},"autoStart:before-start":function(e){var t=e.interaction;ht(t)>0&&(t.prepared.name=null)}},getHoldDuration:ht},_t={id:`auto-start`,install:function(e){e.usePlugin(pt),e.usePlugin(gt),e.usePlugin(mt)}},K=function(e){return/^(always|never|auto)$/.test(e)?(this.options.preventDefault=e,this):b.bool(e)?(this.options.preventDefault=e?`always`:`never`,this):this.options.preventDefault};function vt(e){var t=e.interaction,n=e.event;t.interactable&&t.interactable.checkAndPreventDefault(n)}var yt={id:`core/interactablePreventDefault`,install:function(e){var t=e.Interactable;t.prototype.preventDefault=K,t.prototype.checkAndPreventDefault=function(t){return function(e,t,n){var r=e.options.preventDefault;if(r!==`never`)if(r!==`always`){if(t.events.supportsPassive&&/^touch(start|move)$/.test(n.type)){var i=y(n.target).document,a=t.getDocOptions(i);if(!a||!a.events||!1!==a.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(n.type)||b.element(n.target)&&O(n.target,`input,select,textarea,[contenteditable=true],[contenteditable=true] *`)||n.preventDefault()}else n.preventDefault()}(this,e,t)},e.interactions.docEvents.push({type:`dragstart`,listener:function(t){for(var n=0,r=e.interactions.list;n<r.length;n++){var i=r[n];if(i.element&&(i.element===t.target||D(i.element,t.target)))return void i.interactable.checkAndPreventDefault(t)}}})},listeners:[`down`,`move`,`up`,`cancel`].reduce((function(e,t){return e[`interactions:${t}`]=vt,e}),{})};function q(e,t){if(t.phaselessTypes[e])return!0;for(var n in t.map)if(e.indexOf(n)===0&&e.substr(n.length)in t.phases)return!0;return!1}function bt(e){var t={};for(var n in e){var r=e[n];b.plainObject(r)?t[n]=bt(r):b.array(r)?t[n]=ze(r):t[n]=r}return t}var xt=function(){function e(t){i(this,e),this.states=[],this.startOffset={left:0,right:0,top:0,bottom:0},this.startDelta=void 0,this.result=void 0,this.endResult=void 0,this.startEdges=void 0,this.edges=void 0,this.interaction=void 0,this.interaction=t,this.result=St(),this.edges={left:!1,right:!1,top:!1,bottom:!1}}return o(e,[{key:`start`,value:function(e,t){var n,r,i=e.phase,a=this.interaction,o=function(e){var t=e.interactable.options[e.prepared.name],n=t.modifiers;return n&&n.length?n:[`snap`,`snapSize`,`snapEdges`,`restrict`,`restrictEdges`,`restrictSize`].map((function(e){var n=t[e];return n&&n.enabled&&{options:n,methods:n._methods}})).filter((function(e){return!!e}))}(a);this.prepareStates(o),this.startEdges=k({},a.edges),this.edges=k({},this.startEdges),this.startOffset=(n=a.rect,r=t,n?{left:r.x-n.left,top:r.y-n.top,right:n.right-r.x,bottom:n.bottom-r.y}:{left:0,top:0,right:0,bottom:0}),this.startDelta={x:0,y:0};var s=this.fillArg({phase:i,pageCoords:t,preEnd:!1});return this.result=St(),this.startAll(s),this.result=this.setAll(s)}},{key:`fillArg`,value:function(e){var t=this.interaction;return e.interaction=t,e.interactable=t.interactable,e.element=t.element,e.rect||=t.rect,e.edges||=this.startEdges,e.startOffset=this.startOffset,e}},{key:`startAll`,value:function(e){for(var t=0,n=this.states;t<n.length;t++){var r=n[t];r.methods.start&&(e.state=r,r.methods.start(e))}}},{key:`setAll`,value:function(e){var t=e.phase,n=e.preEnd,r=e.skipModifiers,i=e.rect,a=e.edges;e.coords=k({},e.pageCoords),e.rect=k({},i),e.edges=k({},a);for(var o=r?this.states.slice(r):this.states,s=St(e.coords,e.rect),c=0;c<o.length;c++){var l,u=o[c],d=u.options,f=k({},e.coords),p=null;(l=u.methods)!=null&&l.set&&this.shouldDo(d,n,t)&&(e.state=u,p=u.methods.set(e),ye(e.edges,e.rect,{x:e.coords.x-f.x,y:e.coords.y-f.y})),s.eventProps.push(p)}k(this.edges,e.edges),s.delta.x=e.coords.x-e.pageCoords.x,s.delta.y=e.coords.y-e.pageCoords.y,s.rectDelta.left=e.rect.left-i.left,s.rectDelta.right=e.rect.right-i.right,s.rectDelta.top=e.rect.top-i.top,s.rectDelta.bottom=e.rect.bottom-i.bottom;var m=this.result.coords,h=this.result.rect;return m&&h&&(s.changed=s.rect.left!==h.left||s.rect.right!==h.right||s.rect.top!==h.top||s.rect.bottom!==h.bottom||m.x!==s.coords.x||m.y!==s.coords.y),s}},{key:`applyToInteraction`,value:function(e){var t=this.interaction,n=e.phase,r=t.coords.cur,i=t.coords.start,a=this.result,o=this.startDelta,s=a.delta;n===`start`&&k(this.startDelta,a.delta);for(var c=0,l=[[i,o],[r,s]];c<l.length;c++){var u=l[c],d=u[0],f=u[1];d.page.x+=f.x,d.page.y+=f.y,d.client.x+=f.x,d.client.y+=f.y}var p=this.result.rectDelta,m=e.rect||t.rect;m.left+=p.left,m.right+=p.right,m.top+=p.top,m.bottom+=p.bottom,m.width=m.right-m.left,m.height=m.bottom-m.top}},{key:`setAndApply`,value:function(e){var t=this.interaction,n=e.phase,r=e.preEnd,i=e.skipModifiers,a=this.setAll(this.fillArg({preEnd:r,phase:n,pageCoords:e.modifiedCoords||t.coords.cur.page}));if(this.result=a,!a.changed&&(!i||i<this.states.length)&&t.interacting())return!1;if(e.modifiedCoords){var o=t.coords.cur.page,s={x:e.modifiedCoords.x-o.x,y:e.modifiedCoords.y-o.y};a.coords.x+=s.x,a.coords.y+=s.y,a.delta.x+=s.x,a.delta.y+=s.y}this.applyToInteraction(e)}},{key:`beforeEnd`,value:function(e){var t=e.interaction,n=e.event,r=this.states;if(r&&r.length){for(var i=!1,a=0;a<r.length;a++){var o=r[a];e.state=o;var s=o.options,c=o.methods,l=c.beforeEnd&&c.beforeEnd(e);if(l)return this.endResult=l,!1;i||=!i&&this.shouldDo(s,!0,e.phase,!0)}i&&t.move({event:n,preEnd:!0})}}},{key:`stop`,value:function(e){var t=e.interaction;if(this.states&&this.states.length){var n=k({states:this.states,interactable:t.interactable,element:t.element,rect:null},e);this.fillArg(n);for(var r=0,i=this.states;r<i.length;r++){var a=i[r];n.state=a,a.methods.stop&&a.methods.stop(n)}this.states=null,this.endResult=null}}},{key:`prepareStates`,value:function(e){this.states=[];for(var t=0;t<e.length;t++){var n=e[t],r=n.options,i=n.methods,a=n.name;this.states.push({options:r,methods:i,index:t,name:a})}return this.states}},{key:`restoreInteractionCoords`,value:function(e){var t=e.interaction,n=t.coords,r=t.rect,i=t.modification;if(i.result){for(var a=i.startDelta,o=i.result,s=o.delta,c=o.rectDelta,l=0,u=[[n.start,a],[n.cur,s]];l<u.length;l++){var d=u[l],f=d[0],p=d[1];f.page.x-=p.x,f.page.y-=p.y,f.client.x-=p.x,f.client.y-=p.y}r.left-=c.left,r.right-=c.right,r.top-=c.top,r.bottom-=c.bottom}}},{key:`shouldDo`,value:function(e,t,n,r){return!(!e||!1===e.enabled||r&&!e.endOnly||e.endOnly&&!t||n===`start`&&!e.setStart)}},{key:`copyFrom`,value:function(e){this.startOffset=e.startOffset,this.startDelta=e.startDelta,this.startEdges=e.startEdges,this.edges=e.edges,this.states=e.states.map((function(e){return bt(e)})),this.result=St(k({},e.result.coords),k({},e.result.rect))}},{key:`destroy`,value:function(){for(var e in this)this[e]=null}}]),e}();function St(e,t){return{rect:t,coords:e,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function Ct(e,t){var n=e.defaults,r={start:e.start,set:e.set,beforeEnd:e.beforeEnd,stop:e.stop},i=function(e){var i=e||{};for(var a in i.enabled=!1!==i.enabled,n)a in i||(i[a]=n[a]);var o={options:i,methods:r,name:t,enable:function(){return i.enabled=!0,o},disable:function(){return i.enabled=!1,o}};return o};return t&&typeof t==`string`&&(i._defaults=n,i._methods=r),i}function wt(e){var t=e.iEvent,n=e.interaction.modification.result;n&&(t.modifiers=n.eventProps)}var Tt={id:`modifiers/base`,before:[`actions`],install:function(e){e.defaults.perAction.modifiers=[]},listeners:{"interactions:new":function(e){var t=e.interaction;t.modification=new xt(t)},"interactions:before-action-start":function(e){var t=e.interaction,n=e.interaction.modification;n.start(e,t.coords.start.page),t.edges=n.edges,n.applyToInteraction(e)},"interactions:before-action-move":function(e){var t=e.interaction,n=t.modification,r=n.setAndApply(e);return t.edges=n.edges,r},"interactions:before-action-end":function(e){var t=e.interaction,n=t.modification,r=n.beforeEnd(e);return t.edges=n.startEdges,r},"interactions:action-start":wt,"interactions:action-move":wt,"interactions:action-end":wt,"interactions:after-action-start":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:after-action-move":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:stop":function(e){return e.interaction.modification.stop(e)}}},Et={base:{preventDefault:`auto`,deltaSource:`page`},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},Dt=function(e){c(n,e);var t=f(n);function n(e,r,a,o,s,c,l){var u;i(this,n),(u=t.call(this,e)).relatedTarget=null,u.screenX=void 0,u.screenY=void 0,u.button=void 0,u.buttons=void 0,u.ctrlKey=void 0,u.shiftKey=void 0,u.altKey=void 0,u.metaKey=void 0,u.page=void 0,u.client=void 0,u.delta=void 0,u.rect=void 0,u.x0=void 0,u.y0=void 0,u.t0=void 0,u.dt=void 0,u.duration=void 0,u.clientX0=void 0,u.clientY0=void 0,u.velocity=void 0,u.speed=void 0,u.swipe=void 0,u.axes=void 0,u.preEnd=void 0,s||=e.element;var f=e.interactable,p=(f&&f.options||Et).deltaSource,m=be(f,s,a),h=o===`start`,g=o===`end`,_=h?d(u):e.prevEvent,v=h?e.coords.start:g?{page:_.page,client:_.client,timeStamp:e.coords.cur.timeStamp}:e.coords.cur;return u.page=k({},v.page),u.client=k({},v.client),u.rect=k({},e.rect),u.timeStamp=v.timeStamp,g||(u.page.x-=m.x,u.page.y-=m.y,u.client.x-=m.x,u.client.y-=m.y),u.ctrlKey=r.ctrlKey,u.altKey=r.altKey,u.shiftKey=r.shiftKey,u.metaKey=r.metaKey,u.button=r.button,u.buttons=r.buttons,u.target=s,u.currentTarget=s,u.preEnd=c,u.type=l||a+(o||``),u.interactable=f,u.t0=h?e.pointers[e.pointers.length-1].downTime:_.t0,u.x0=e.coords.start.page.x-m.x,u.y0=e.coords.start.page.y-m.y,u.clientX0=e.coords.start.client.x-m.x,u.clientY0=e.coords.start.client.y-m.y,u.delta=h||g?{x:0,y:0}:{x:u[p].x-_[p].x,y:u[p].y-_[p].y},u.dt=e.coords.delta.timeStamp,u.duration=u.timeStamp-u.t0,u.velocity=k({},e.coords.velocity[p]),u.speed=Ce(u.velocity.x,u.velocity.y),u.swipe=g||o===`inertiastart`?u.getSwipe():null,u}return o(n,[{key:`getSwipe`,value:function(){var e=this._interaction;if(e.prevEvent.speed<600||this.timeStamp-e.prevEvent.timeStamp>150)return null;var t=180*Math.atan2(e.prevEvent.velocityY,e.prevEvent.velocityX)/Math.PI;t<0&&(t+=360);var n=112.5<=t&&t<247.5,r=202.5<=t&&t<337.5;return{up:r,down:!r&&22.5<=t&&t<157.5,left:n,right:!n&&(292.5<=t||t<67.5),angle:t,speed:e.prevEvent.speed,velocity:{x:e.prevEvent.velocityX,y:e.prevEvent.velocityY}}}},{key:`preventDefault`,value:function(){}},{key:`stopImmediatePropagation`,value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}},{key:`stopPropagation`,value:function(){this.propagationStopped=!0}}]),n}(Le);Object.defineProperties(Dt.prototype,{pageX:{get:function(){return this.page.x},set:function(e){this.page.x=e}},pageY:{get:function(){return this.page.y},set:function(e){this.page.y=e}},clientX:{get:function(){return this.client.x},set:function(e){this.client.x=e}},clientY:{get:function(){return this.client.y},set:function(e){this.client.y=e}},dx:{get:function(){return this.delta.x},set:function(e){this.delta.x=e}},dy:{get:function(){return this.delta.y},set:function(e){this.delta.y=e}},velocityX:{get:function(){return this.velocity.x},set:function(e){this.velocity.x=e}},velocityY:{get:function(){return this.velocity.y},set:function(e){this.velocity.y=e}}});var J=o((function e(t,n,r,a,o){i(this,e),this.id=void 0,this.pointer=void 0,this.event=void 0,this.downTime=void 0,this.downTarget=void 0,this.id=t,this.pointer=n,this.event=r,this.downTime=a,this.downTarget=o})),Ot=function(e){return e.interactable=``,e.element=``,e.prepared=``,e.pointerIsDown=``,e.pointerWasMoved=``,e._proxy=``,e}({}),kt=function(e){return e.start=``,e.move=``,e.end=``,e.stop=``,e.interacting=``,e}({}),At=0,jt=function(){function e(t){var n=this,r=t.pointerType,a=t.scopeFire;i(this,e),this.interactable=null,this.element=null,this.rect=null,this._rects=void 0,this.edges=null,this._scopeFire=void 0,this.prepared={name:null,axis:null,edges:null},this.pointerType=void 0,this.pointers=[],this.downEvent=null,this.downPointer={},this._latestPointer={pointer:null,event:null,eventTarget:null},this.prevEvent=null,this.pointerIsDown=!1,this.pointerWasMoved=!1,this._interacting=!1,this._ending=!1,this._stopped=!0,this._proxy=void 0,this.simulation=null,this.doMove=tt((function(e){this.move(e)}),`The interaction.doMove() method has been renamed to interaction.move()`),this.coords={start:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},prev:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},cur:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},delta:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},velocity:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},this._id=At++,this._scopeFire=a,this.pointerType=r;var o=this;this._proxy={};var s=function(e){Object.defineProperty(n._proxy,e,{get:function(){return o[e]}})};for(var c in Ot)s(c);var l=function(e){Object.defineProperty(n._proxy,e,{value:function(){return o[e].apply(o,arguments)}})};for(var u in kt)l(u);this._scopeFire(`interactions:new`,{interaction:this})}return o(e,[{key:`pointerMoveTolerance`,get:function(){return 1}},{key:`pointerDown`,value:function(e,t,n){var r=this.updatePointer(e,t,n,!0),i=this.pointers[r];this._scopeFire(`interactions:down`,{pointer:e,event:t,eventTarget:n,pointerIndex:r,pointerInfo:i,type:`down`,interaction:this})}},{key:`start`,value:function(e,t,n){return!(this.interacting()||!this.pointerIsDown||this.pointers.length<(e.name===`gesture`?2:1)||!t.options[e.name].enabled)&&(nt(this.prepared,e),this.interactable=t,this.element=n,this.rect=t.getRect(n),this.edges=this.prepared.edges?k({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:`start`})&&!this._stopped,this._interacting)}},{key:`pointerMove`,value:function(e,t,n){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(e,t,n,!1);var r,i,a=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,i=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=Ce(r,i)>this.pointerMoveTolerance);var o,s,c,l=this.getPointerIndex(e),u={pointer:e,pointerIndex:l,pointerInfo:this.pointers[l],event:t,type:`move`,eventTarget:n,dx:r,dy:i,duplicate:a,interaction:this};a||(o=this.coords.velocity,s=this.coords.delta,c=Math.max(s.timeStamp/1e3,.001),o.page.x=s.page.x/c,o.page.y=s.page.y/c,o.client.x=s.client.x/c,o.client.y=s.client.y/c,o.timeStamp=c),this._scopeFire(`interactions:move`,u),a||this.simulation||(this.interacting()&&(u.type=null,this.move(u)),this.pointerWasMoved&&M(this.coords.prev,this.coords.cur))}},{key:`move`,value:function(e){e&&e.event||we(this.coords.delta),(e=k({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},e||{})).phase=`move`,this._doPhase(e)}},{key:`pointerUp`,value:function(e,t,n,r){var i=this.getPointerIndex(e);i===-1&&(i=this.updatePointer(e,t,n,!1));var a=/cancel$/i.test(t.type)?`cancel`:`up`;this._scopeFire(`interactions:${a}`,{pointer:e,pointerIndex:i,pointerInfo:this.pointers[i],event:t,eventTarget:n,type:a,curEventTarget:r,interaction:this}),this.simulation||this.end(t),this.removePointer(e,t)}},{key:`documentBlur`,value:function(e){this.end(e),this._scopeFire(`interactions:blur`,{event:e,type:`blur`,interaction:this})}},{key:`end`,value:function(e){var t;this._ending=!0,e||=this._latestPointer.event,this.interacting()&&(t=this._doPhase({event:e,interaction:this,phase:`end`})),this._ending=!1,!0===t&&this.stop()}},{key:`currentAction`,value:function(){return this._interacting?this.prepared.name:null}},{key:`interacting`,value:function(){return this._interacting}},{key:`stop`,value:function(){this._scopeFire(`interactions:stop`,{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null}},{key:`getPointerIndex`,value:function(e){var t=Oe(e);return this.pointerType===`mouse`||this.pointerType===`pen`?this.pointers.length-1:Be(this.pointers,(function(e){return e.id===t}))}},{key:`getPointerInfo`,value:function(e){return this.pointers[this.getPointerIndex(e)]}},{key:`updatePointer`,value:function(e,t,n,r){var i,a,o,s=Oe(e),c=this.getPointerIndex(e),l=this.pointers[c];return r=!1!==r&&(r||/(down|start)$/i.test(t.type)),l?l.pointer=e:(l=new J(s,e,t,null,null),c=this.pointers.length,this.pointers.push(l)),ke(this.coords.cur,this.pointers.map((function(e){return e.pointer})),this._now()),i=this.coords.delta,a=this.coords.prev,o=this.coords.cur,i.page.x=o.page.x-a.page.x,i.page.y=o.page.y-a.page.y,i.client.x=o.client.x-a.client.x,i.client.y=o.client.y-a.client.y,i.timeStamp=o.timeStamp-a.timeStamp,r&&(this.pointerIsDown=!0,l.downTime=this.coords.cur.timeStamp,l.downTarget=n,j(this.downPointer,e),this.interacting()||(M(this.coords.start,this.coords.cur),M(this.coords.prev,this.coords.cur),this.downEvent=t,this.pointerWasMoved=!1)),this._updateLatestPointer(e,t,n),this._scopeFire(`interactions:update-pointer`,{pointer:e,event:t,eventTarget:n,down:r,pointerInfo:l,pointerIndex:c,interaction:this}),c}},{key:`removePointer`,value:function(e,t){var n=this.getPointerIndex(e);if(n!==-1){var r=this.pointers[n];this._scopeFire(`interactions:remove-pointer`,{pointer:e,event:t,eventTarget:null,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1),this.pointerIsDown=!1}}},{key:`_updateLatestPointer`,value:function(e,t,n){this._latestPointer.pointer=e,this._latestPointer.event=t,this._latestPointer.eventTarget=n}},{key:`destroy`,value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null}},{key:`_createPreparedEvent`,value:function(e,t,n,r){return new Dt(this,e,this.prepared.name,t,this.element,n,r)}},{key:`_fireEvent`,value:function(e){var t;(t=this.interactable)==null||t.fire(e),(!this.prevEvent||e.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=e)}},{key:`_doPhase`,value:function(e){var t=e.event,n=e.phase,r=e.preEnd,i=e.type,a=this.rect;if(a&&n===`move`&&(ye(this.edges,a,this.coords.delta[this.interactable.options.deltaSource]),a.width=a.right-a.left,a.height=a.bottom-a.top),!1===this._scopeFire(`interactions:before-action-${n}`,e))return!1;var o=e.iEvent=this._createPreparedEvent(t,n,r,i);return this._scopeFire(`interactions:action-${n}`,e),n===`start`&&(this.prevEvent=o),this._fireEvent(o),this._scopeFire(`interactions:after-action-${n}`,e),!0}},{key:`_now`,value:function(){return Date.now()}}]),e}();function Mt(e){Nt(e.interaction)}function Nt(e){if(!function(e){return!(!e.offset.pending.x&&!e.offset.pending.y)}(e))return!1;var t=e.offset.pending;return Ft(e.coords.cur,t),Ft(e.coords.delta,t),ye(e.edges,e.rect,t),t.x=0,t.y=0,!0}function Pt(e){var t=e.x,n=e.y;this.offset.pending.x+=t,this.offset.pending.y+=n,this.offset.total.x+=t,this.offset.total.y+=n}function Ft(e,t){var n=e.page,r=e.client,i=t.x,a=t.y;n.x+=i,n.y+=a,r.x+=i,r.y+=a}kt.offsetBy=``;var It={id:`offset`,before:[`modifiers`,`pointer-events`,`actions`,`inertia`],install:function(e){e.Interaction.prototype.offsetBy=Pt},listeners:{"interactions:new":function(e){e.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}}},"interactions:update-pointer":function(e){return function(e){e.pointerIsDown&&(Ft(e.coords.cur,e.offset.total),e.offset.pending.x=0,e.offset.pending.y=0)}(e.interaction)},"interactions:before-action-start":Mt,"interactions:before-action-move":Mt,"interactions:before-action-end":function(e){var t=e.interaction;if(Nt(t))return t.move({offset:!0}),t.end(),!1},"interactions:stop":function(e){var t=e.interaction;t.offset.total.x=0,t.offset.total.y=0,t.offset.pending.x=0,t.offset.pending.y=0}}},Lt=function(){function e(t){i(this,e),this.active=!1,this.isModified=!1,this.smoothEnd=!1,this.allowResume=!1,this.modification=void 0,this.modifierCount=0,this.modifierArg=void 0,this.startCoords=void 0,this.t0=0,this.v0=0,this.te=0,this.targetOffset=void 0,this.modifiedOffset=void 0,this.currentOffset=void 0,this.lambda_v0=0,this.one_ve_v0=0,this.timeout=void 0,this.interaction=void 0,this.interaction=t}return o(e,[{key:`start`,value:function(e){var t=this.interaction,n=Rt(t);if(!n||!n.enabled)return!1;var r=t.coords.velocity.client,i=Ce(r.x,r.y),a=this.modification||=new xt(t);if(a.copyFrom(t.modification),this.t0=t._now(),this.allowResume=n.allowResume,this.v0=i,this.currentOffset={x:0,y:0},this.startCoords=t.coords.cur.page,this.modifierArg=a.fillArg({pageCoords:this.startCoords,preEnd:!0,phase:`inertiastart`}),this.t0-t.coords.cur.timeStamp<50&&i>n.minSpeed&&i>n.endSpeed)this.startInertia();else{if(a.result=a.setAll(this.modifierArg),!a.result.changed)return!1;this.startSmoothEnd()}return t.modification.result.rect=null,t.offsetBy(this.targetOffset),t._doPhase({interaction:t,event:e,phase:`inertiastart`}),t.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),t.modification.result.rect=null,this.active=!0,t.simulation=this,!0}},{key:`startInertia`,value:function(){var e=this,t=this.interaction.coords.velocity.client,n=Rt(this.interaction),r=n.resistance,i=-Math.log(n.endSpeed/this.v0)/r;this.targetOffset={x:(t.x-i)/r,y:(t.y-i)/r},this.te=i,this.lambda_v0=r/this.v0,this.one_ve_v0=1-n.endSpeed/this.v0;var a=this.modification,o=this.modifierArg;o.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},a.result=a.setAll(o),a.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+a.result.delta.x,y:this.targetOffset.y+a.result.delta.y}),this.onNextFrame((function(){return e.inertiaTick()}))}},{key:`startSmoothEnd`,value:function(){var e=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.onNextFrame((function(){return e.smoothEndTick()}))}},{key:`onNextFrame`,value:function(e){var t=this;this.timeout=Ze.request((function(){t.active&&e()}))}},{key:`inertiaTick`,value:function(){var e,t,n,r,i,a,o,s=this,c=this.interaction,l=Rt(c).resistance,u=(c._now()-this.t0)/1e3;if(u<this.te){var d,f=1-(Math.exp(-l*u)-this.lambda_v0)/this.one_ve_v0;this.isModified?(e=0,t=0,n=this.targetOffset.x,r=this.targetOffset.y,i=this.modifiedOffset.x,a=this.modifiedOffset.y,d={x:Bt(o=f,e,n,i),y:Bt(o,t,r,a)}):d={x:this.targetOffset.x*f,y:this.targetOffset.y*f};var p={x:d.x-this.currentOffset.x,y:d.y-this.currentOffset.y};this.currentOffset.x+=p.x,this.currentOffset.y+=p.y,c.offsetBy(p),c.move(),this.onNextFrame((function(){return s.inertiaTick()}))}else c.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end()}},{key:`smoothEndTick`,value:function(){var e=this,t=this.interaction,n=t._now()-this.t0,r=Rt(t).smoothEndDuration;if(n<r){var i={x:Vt(n,0,this.targetOffset.x,r),y:Vt(n,0,this.targetOffset.y,r)},a={x:i.x-this.currentOffset.x,y:i.y-this.currentOffset.y};this.currentOffset.x+=a.x,this.currentOffset.y+=a.y,t.offsetBy(a),t.move({skipModifiers:this.modifierCount}),this.onNextFrame((function(){return e.smoothEndTick()}))}else t.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end()}},{key:`resume`,value:function(e){var t=e.pointer,n=e.event,r=e.eventTarget,i=this.interaction;i.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),i.updatePointer(t,n,r,!0),i._doPhase({interaction:i,event:n,phase:`resume`}),M(i.coords.prev,i.coords.cur),this.stop()}},{key:`end`,value:function(){this.interaction.move(),this.interaction.end(),this.stop()}},{key:`stop`,value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,Ze.cancel(this.timeout)}}]),e}();function Rt(e){var t=e.interactable,n=e.prepared;return t&&t.options&&n.name&&t.options[n.name].inertia}var zt={id:`inertia`,before:[`modifiers`,`actions`],install:function(e){var t=e.defaults;e.usePlugin(It),e.usePlugin(Tt),e.actions.phases.inertiastart=!0,e.actions.phases.resume=!0,t.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}},listeners:{"interactions:new":function(e){var t=e.interaction;t.inertia=new Lt(t)},"interactions:before-action-end":function(e){var t=e.interaction,n=e.event;return(!t._interacting||t.simulation||!t.inertia.start(n))&&null},"interactions:down":function(e){var t=e.interaction,n=e.eventTarget,r=t.inertia;if(r.active)for(var i=n;b.element(i);){if(i===t.element){r.resume(e);break}i=oe(i)}},"interactions:stop":function(e){var t=e.interaction.inertia;t.active&&t.stop()},"interactions:before-action-resume":function(e){var t=e.interaction.modification;t.stop(e),t.start(e,e.interaction.coords.cur.page),t.applyToInteraction(e)},"interactions:before-action-inertiastart":function(e){return e.interaction.modification.setAndApply(e)},"interactions:action-resume":wt,"interactions:action-inertiastart":wt,"interactions:after-action-inertiastart":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:after-action-resume":function(e){return e.interaction.modification.restoreInteractionCoords(e)}}};function Bt(e,t,n,r){var i=1-e;return i*i*t+2*i*e*n+e*e*r}function Vt(e,t,n,r){return-n*(e/=r)*(e-2)+t}var Ht=zt;function Ut(e,t){for(var n=0;n<t.length;n++){var r=t[n];if(e.immediatePropagationStopped)break;r(e)}}var Wt=function(){function e(t){i(this,e),this.options=void 0,this.types={},this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.global=void 0,this.options=k({},t||{})}return o(e,[{key:`fire`,value:function(e){var t,n=this.global;(t=this.types[e.type])&&Ut(e,t),!e.propagationStopped&&n&&(t=n[e.type])&&Ut(e,t)}},{key:`on`,value:function(e,t){var n=xe(e,t);for(e in n)this.types[e]=Re(this.types[e]||[],n[e])}},{key:`off`,value:function(e,t){var n=xe(e,t);for(e in n){var r=this.types[e];if(r&&r.length)for(var i=0,a=n[e];i<a.length;i++){var o=a[i],s=r.indexOf(o);s!==-1&&r.splice(s,1)}}}},{key:`getRect`,value:function(e){return null}}]),e}(),Gt=function(){function e(t){i(this,e),this.currentTarget=void 0,this.originalEvent=void 0,this.type=void 0,this.originalEvent=t,j(this,t)}return o(e,[{key:`preventOriginalDefault`,value:function(){this.originalEvent.preventDefault()}},{key:`stopPropagation`,value:function(){this.originalEvent.stopPropagation()}},{key:`stopImmediatePropagation`,value:function(){this.originalEvent.stopImmediatePropagation()}}]),e}();function Kt(e){return b.object(e)?{capture:!!e.capture,passive:!!e.passive}:{capture:!!e,passive:!1}}function qt(e,t){return e===t||(typeof e==`boolean`?!!t.capture===e&&!!t.passive==0:!!e.capture==!!t.capture&&!!e.passive==!!t.passive)}var Jt={id:`events`,install:function(e){var t,n=[],r={},i=[],a={add:o,remove:s,addDelegate:function(e,t,n,a,s){var u=Kt(s);if(!r[n]){r[n]=[];for(var d=0;d<i.length;d++){var f=i[d];o(f,n,c),o(f,n,l,!0)}}var p=r[n],m=N(p,(function(n){return n.selector===e&&n.context===t}));m||(m={selector:e,context:t,listeners:[]},p.push(m)),m.listeners.push({func:a,options:u})},removeDelegate:function(e,t,n,i,a){var o,u=Kt(a),d=r[n],f=!1;if(d)for(o=d.length-1;o>=0;o--){var p=d[o];if(p.selector===e&&p.context===t){for(var m=p.listeners,h=m.length-1;h>=0;h--){var g=m[h];if(g.func===i&&qt(g.options,u)){m.splice(h,1),m.length||(d.splice(o,1),s(t,n,c),s(t,n,l,!0)),f=!0;break}}if(f)break}}},delegateListener:c,delegateUseCapture:l,delegatedEvents:r,documents:i,targets:n,supportsOptions:!1,supportsPassive:!1};function o(e,t,r,i){if(e.addEventListener){var o=Kt(i),s=N(n,(function(t){return t.eventTarget===e}));s||(s={eventTarget:e,events:{}},n.push(s)),s.events[t]||(s.events[t]=[]),N(s.events[t],(function(e){return e.func===r&&qt(e.options,o)}))||(e.addEventListener(t,r,a.supportsOptions?o:o.capture),s.events[t].push({func:r,options:o}))}}function s(e,t,r,i){if(e.addEventListener&&e.removeEventListener){var o=Be(n,(function(t){return t.eventTarget===e})),c=n[o];if(c&&c.events)if(t!==`all`){var l=!1,u=c.events[t];if(u){if(r===`all`){for(var d=u.length-1;d>=0;d--){var f=u[d];s(e,t,f.func,f.options)}return}for(var p=Kt(i),m=0;m<u.length;m++){var h=u[m];if(h.func===r&&qt(h.options,p)){e.removeEventListener(t,r,a.supportsOptions?p:p.capture),u.splice(m,1),u.length===0&&(delete c.events[t],l=!0);break}}}l&&!Object.keys(c.events).length&&n.splice(o,1)}else for(t in c.events)c.events.hasOwnProperty(t)&&s(e,t,`all`)}}function c(e,t){for(var n=Kt(t),i=new Gt(e),a=r[e.type],o=Ie(e)[0],s=o;b.element(s);){for(var c=0;c<a.length;c++){var l=a[c],u=l.selector,d=l.context;if(O(s,u)&&D(d,o)&&D(d,s)){var f=l.listeners;i.currentTarget=s;for(var p=0;p<f.length;p++){var m=f[p];qt(m.options,n)&&m.func(i)}}}s=oe(s)}}function l(e){return c(e,!0)}return(t=e.document)==null||t.createElement(`div`).addEventListener(`test`,null,{get capture(){return a.supportsOptions=!0},get passive(){return a.supportsPassive=!0}}),e.events=a,a}},Yt={methodOrder:[`simulationResume`,`mouseOrPen`,`hasPointer`,`idle`],search:function(e){for(var t=0,n=Yt.methodOrder;t<n.length;t++){var r=Yt[n[t]](e);if(r)return r}return null},simulationResume:function(e){var t=e.pointerType,n=e.eventType,r=e.eventTarget,i=e.scope;if(!/down|start/i.test(n))return null;for(var a=0,o=i.interactions.list;a<o.length;a++){var s=o[a],c=r;if(s.simulation&&s.simulation.allowResume&&s.pointerType===t)for(;c;){if(c===s.element)return s;c=oe(c)}}return null},mouseOrPen:function(e){var t,n=e.pointerId,r=e.pointerType,i=e.eventType,a=e.scope;if(r!==`mouse`&&r!==`pen`)return null;for(var o=0,s=a.interactions.list;o<s.length;o++){var c=s[o];if(c.pointerType===r){if(c.simulation&&!Xt(c,n))continue;if(c.interacting())return c;t||=c}}if(t)return t;for(var l=0,u=a.interactions.list;l<u.length;l++){var d=u[l];if(!(d.pointerType!==r||/down/i.test(i)&&d.simulation))return d}return null},hasPointer:function(e){for(var t=e.pointerId,n=0,r=e.scope.interactions.list;n<r.length;n++){var i=r[n];if(Xt(i,t))return i}return null},idle:function(e){for(var t=e.pointerType,n=0,r=e.scope.interactions.list;n<r.length;n++){var i=r[n];if(i.pointers.length===1){var a=i.interactable;if(a&&(!a.options.gesture||!a.options.gesture.enabled))continue}else if(i.pointers.length>=2)continue;if(!i.interacting()&&t===i.pointerType)return i}return null}};function Xt(e,t){return e.pointers.some((function(e){return e.id===t}))}var Zt=Yt,Qt=[`pointerDown`,`pointerMove`,`pointerUp`,`updatePointer`,`removePointer`,`windowBlur`];function $t(e,t){return function(n){var r=t.interactions.list,i=Fe(n),a=Ie(n),o=a[0],s=a[1],c=[];if(/^touch/.test(n.type)){t.prevTouchTime=t.now();for(var l=0,u=n.changedTouches;l<u.length;l++){var d=u[l],f={pointer:d,pointerId:Oe(d),pointerType:i,eventType:n.type,eventTarget:o,curEventTarget:s,scope:t},p=en(f);c.push([f.pointer,f.eventTarget,f.curEventTarget,p])}}else{var m=!1;if(!E.supportsPointerEvent&&/mouse/.test(n.type)){for(var h=0;h<r.length&&!m;h++)m=r[h].pointerType!==`mouse`&&r[h].pointerIsDown;m=m||t.now()-t.prevTouchTime<500||n.timeStamp===0}if(!m){var g={pointer:n,pointerId:Oe(n),pointerType:i,eventType:n.type,curEventTarget:s,eventTarget:o,scope:t},_=en(g);c.push([g.pointer,g.eventTarget,g.curEventTarget,_])}}for(var v=0;v<c.length;v++){var y=c[v],ee=y[0],te=y[1],b=y[2];y[3][e](ee,n,te,b)}}}function en(e){var t=e.pointerType,n=e.scope,r={interaction:Zt.search(e),searchDetails:e};return n.fire(`interactions:find`,r),r.interaction||n.interactions.new({pointerType:t})}function tn(e,t){var n=e.doc,r=e.scope,i=e.options,a=r.interactions.docEvents,o=r.events,s=o[t];for(var c in r.browser.isIOS&&!i.events&&(i.events={passive:!1}),o.delegatedEvents)s(n,c,o.delegateListener),s(n,c,o.delegateUseCapture,!0);for(var l=i&&i.events,u=0;u<a.length;u++){var d=a[u];s(n,d.type,d.listener,l)}}var nn={id:`core/interactions`,install:function(e){for(var t={},n=0;n<Qt.length;n++){var r=Qt[n];t[r]=$t(r,e)}var a,s=E.pEventTypes;function l(){for(var t=0,n=e.interactions.list;t<n.length;t++){var r=n[t];if(r.pointerIsDown&&r.pointerType===`touch`&&!r._interacting)for(var i=function(){var t=o[a];e.documents.some((function(e){return D(e.doc,t.downTarget)}))||r.removePointer(t.pointer,t.event)},a=0,o=r.pointers;a<o.length;a++)i()}}(a=w.PointerEvent?[{type:s.down,listener:l},{type:s.down,listener:t.pointerDown},{type:s.move,listener:t.pointerMove},{type:s.up,listener:t.pointerUp},{type:s.cancel,listener:t.pointerUp}]:[{type:`mousedown`,listener:t.pointerDown},{type:`mousemove`,listener:t.pointerMove},{type:`mouseup`,listener:t.pointerUp},{type:`touchstart`,listener:l},{type:`touchstart`,listener:t.pointerDown},{type:`touchmove`,listener:t.pointerMove},{type:`touchend`,listener:t.pointerUp},{type:`touchcancel`,listener:t.pointerUp}]).push({type:`blur`,listener:function(t){for(var n=0,r=e.interactions.list;n<r.length;n++)r[n].documentBlur(t)}}),e.prevTouchTime=0,e.Interaction=function(t){c(r,t);var n=f(r);function r(){return i(this,r),n.apply(this,arguments)}return o(r,[{key:`pointerMoveTolerance`,get:function(){return e.interactions.pointerMoveTolerance},set:function(t){e.interactions.pointerMoveTolerance=t}},{key:`_now`,value:function(){return e.now()}}]),r}(jt),e.interactions={list:[],new:function(t){t.scopeFire=function(t,n){return e.fire(t,n)};var n=new e.Interaction(t);return e.interactions.list.push(n),n},listeners:t,docEvents:a,pointerMoveTolerance:1},e.usePlugin(yt)},listeners:{"scope:add-document":function(e){return tn(e,`add`)},"scope:remove-document":function(e){return tn(e,`remove`)},"interactable:unset":function(e,t){for(var n=e.interactable,r=t.interactions.list.length-1;r>=0;r--){var i=t.interactions.list[r];i.interactable===n&&(i.stop(),t.fire(`interactions:destroy`,{interaction:i}),i.destroy(),t.interactions.list.length>2&&t.interactions.list.splice(r,1))}}},onDocSignal:tn,doOnInteractions:$t,methodNames:Qt},rn=function(e){return e[e.On=0]=`On`,e[e.Off=1]=`Off`,e}(rn||{}),an=function(){function e(t,n,r,a){i(this,e),this.target=void 0,this.options=void 0,this._actions=void 0,this.events=new Wt,this._context=void 0,this._win=void 0,this._doc=void 0,this._scopeEvents=void 0,this._actions=n.actions,this.target=t,this._context=n.context||r,this._win=y(me(t)?this._context:t),this._doc=this._win.document,this._scopeEvents=a,this.set(n)}return o(e,[{key:`_defaults`,get:function(){return{base:{},perAction:{},actions:{}}}},{key:`setOnEvents`,value:function(e,t){return b.func(t.onstart)&&this.on(`${e}start`,t.onstart),b.func(t.onmove)&&this.on(`${e}move`,t.onmove),b.func(t.onend)&&this.on(`${e}end`,t.onend),b.func(t.oninertiastart)&&this.on(`${e}inertiastart`,t.oninertiastart),this}},{key:`updatePerActionListeners`,value:function(e,t,n){var r=this,i=this._actions.map[e]?.filterEventType,a=function(e){return(i==null||i(e))&&q(e,r._actions)};(b.array(t)||b.object(t))&&this._onOff(rn.Off,e,t,void 0,a),(b.array(n)||b.object(n))&&this._onOff(rn.On,e,n,void 0,a)}},{key:`setPerAction`,value:function(e,t){var n=this._defaults;for(var r in t){var i=r,a=this.options[e],o=t[i];i===`listeners`&&this.updatePerActionListeners(e,a.listeners,o),b.array(o)?a[i]=ze(o):b.plainObject(o)?(a[i]=k(a[i]||{},bt(o)),b.object(n.perAction[i])&&`enabled`in n.perAction[i]&&(a[i].enabled=!1!==o.enabled)):b.bool(o)&&b.object(n.perAction[i])?a[i].enabled=o:a[i]=o}}},{key:`getRect`,value:function(e){return e||=b.element(this.target)?this.target:null,b.string(this.target)&&(e||=this._context.querySelector(this.target)),fe(e)}},{key:`rectChecker`,value:function(e){var t=this;return b.func(e)?(this.getRect=function(n){var r=k({},e.apply(t,n));return`width`in r||(r.width=r.right-r.left,r.height=r.bottom-r.top),r},this):e===null?(delete this.getRect,this):this.getRect}},{key:`_backCompatOption`,value:function(e,t){if(me(t)||b.object(t)){for(var n in this.options[e]=t,this._actions.map)this.options[n][e]=t;return this}return this.options[e]}},{key:`origin`,value:function(e){return this._backCompatOption(`origin`,e)}},{key:`deltaSource`,value:function(e){return e===`page`||e===`client`?(this.options.deltaSource=e,this):this.options.deltaSource}},{key:`getAllElements`,value:function(){var e=this.target;return b.string(e)?Array.from(this._context.querySelectorAll(e)):b.func(e)&&e.getAllElements?e.getAllElements():b.element(e)?[e]:[]}},{key:`context`,value:function(){return this._context}},{key:`inContext`,value:function(e){return this._context===e.ownerDocument||D(this._context,e)}},{key:`testIgnoreAllow`,value:function(e,t,n){return!this.testIgnore(e.ignoreFrom,t,n)&&this.testAllow(e.allowFrom,t,n)}},{key:`testAllow`,value:function(e,t,n){return!e||!!b.element(n)&&(b.string(e)?le(n,e,t):!!b.element(e)&&D(e,n))}},{key:`testIgnore`,value:function(e,t,n){return!(!e||!b.element(n))&&(b.string(e)?le(n,e,t):!!b.element(e)&&D(e,n))}},{key:`fire`,value:function(e){return this.events.fire(e),this}},{key:`_onOff`,value:function(e,t,n,r,i){b.object(t)&&!b.array(t)&&(r=n,n=null);var a=xe(t,n,i);for(var o in a){o===`wheel`&&(o=E.wheelEvent);for(var s=0,c=a[o];s<c.length;s++){var l=c[s];q(o,this._actions)?this.events[e===rn.On?`on`:`off`](o,l):b.string(this.target)?this._scopeEvents[e===rn.On?`addDelegate`:`removeDelegate`](this.target,this._context,o,l,r):this._scopeEvents[e===rn.On?`add`:`remove`](this.target,o,l,r)}}return this}},{key:`on`,value:function(e,t,n){return this._onOff(rn.On,e,t,n)}},{key:`off`,value:function(e,t,n){return this._onOff(rn.Off,e,t,n)}},{key:`set`,value:function(e){var t=this._defaults;for(var n in b.object(e)||(e={}),this.options=bt(t.base),this._actions.methodDict){var r=n,i=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,k(k({},t.perAction),t.actions[r])),this[i](e[r])}for(var a in e)a===`getRect`?this.rectChecker(e.getRect):b.func(this[a])&&this[a](e[a]);return this}},{key:`unset`,value:function(){if(b.string(this.target))for(var e in this._scopeEvents.delegatedEvents)for(var t=this._scopeEvents.delegatedEvents[e],n=t.length-1;n>=0;n--){var r=t[n],i=r.selector,a=r.context,o=r.listeners;i===this.target&&a===this._context&&t.splice(n,1);for(var s=o.length-1;s>=0;s--)this._scopeEvents.removeDelegate(this.target,this._context,e,o[s][0],o[s][1])}else this._scopeEvents.remove(this.target,`all`)}}]),e}(),on=function(){function e(t){var n=this;i(this,e),this.list=[],this.selectorMap={},this.scope=void 0,this.scope=t,t.addListeners({"interactable:unset":function(e){var t=e.interactable,r=t.target,i=b.string(r)?n.selectorMap[r]:r[n.scope.id],a=Be(i,(function(e){return e===t}));i.splice(a,1)}})}return o(e,[{key:`new`,value:function(e,t){t=k(t||{},{actions:this.scope.actions});var n=new this.scope.Interactable(e,t,this.scope.document,this.scope.events);return this.scope.addDocument(n._doc),this.list.push(n),b.string(e)?(this.selectorMap[e]||(this.selectorMap[e]=[]),this.selectorMap[e].push(n)):(n.target[this.scope.id]||Object.defineProperty(e,this.scope.id,{value:[],configurable:!0}),e[this.scope.id].push(n)),this.scope.fire(`interactable:new`,{target:e,options:t,interactable:n,win:this.scope._win}),n}},{key:`getExisting`,value:function(e,t){var n=t&&t.context||this.scope.document,r=b.string(e),i=r?this.selectorMap[e]:e[this.scope.id];if(i)return N(i,(function(t){return t._context===n&&(r||t.inContext(e))}))}},{key:`forEachMatch`,value:function(e,t){for(var n=0,r=this.list;n<r.length;n++){var i=r[n],a=void 0;if((b.string(i.target)?b.element(e)&&O(e,i.target):e===i.target)&&i.inContext(e)&&(a=t(i)),a!==void 0)return a}}}]),e}(),sn=function(){function e(){var t=this;i(this,e),this.id=`__interact_scope_${Math.floor(100*Math.random())}`,this.isInitialized=!1,this.listenerMaps=[],this.browser=E,this.defaults=bt(Et),this.Eventable=Wt,this.actions={map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}},this.interactStatic=function(e){var t=function t(n,r){var i=e.interactables.getExisting(n,r);return i||((i=e.interactables.new(n,r)).events.global=t.globalEvents),i};return t.getPointerAverage=je,t.getTouchBBox=Me,t.getTouchDistance=Ne,t.getTouchAngle=Pe,t.getElementRect=fe,t.getElementClientRect=de,t.matchesSelector=O,t.closest=ae,t.globalEvents={},t.version=`1.10.27`,t.scope=e,t.use=function(e,t){return this.scope.usePlugin(e,t),this},t.isSet=function(e,t){return!!this.scope.interactables.get(e,t&&t.context)},t.on=tt((function(e,t,n){if(b.string(e)&&e.search(` `)!==-1&&(e=e.trim().split(/ +/)),b.array(e)){for(var r=0,i=e;r<i.length;r++){var a=i[r];this.on(a,t,n)}return this}if(b.object(e)){for(var o in e)this.on(o,e[o],t);return this}return q(e,this.scope.actions)?this.globalEvents[e]?this.globalEvents[e].push(t):this.globalEvents[e]=[t]:this.scope.events.add(this.scope.document,e,t,{options:n}),this}),`The interact.on() method is being deprecated`),t.off=tt((function(e,t,n){if(b.string(e)&&e.search(` `)!==-1&&(e=e.trim().split(/ +/)),b.array(e)){for(var r=0,i=e;r<i.length;r++){var a=i[r];this.off(a,t,n)}return this}if(b.object(e)){for(var o in e)this.off(o,e[o],t);return this}var s;return q(e,this.scope.actions)?e in this.globalEvents&&(s=this.globalEvents[e].indexOf(t))!==-1&&this.globalEvents[e].splice(s,1):this.scope.events.remove(this.scope.document,e,t,n),this}),`The interact.off() method is being deprecated`),t.debug=function(){return this.scope},t.supportsTouch=function(){return E.supportsTouch},t.supportsPointerEvent=function(){return E.supportsPointerEvent},t.stop=function(){for(var e=0,t=this.scope.interactions.list;e<t.length;e++)t[e].stop();return this},t.pointerMoveTolerance=function(e){return b.number(e)?(this.scope.interactions.pointerMoveTolerance=e,this):this.scope.interactions.pointerMoveTolerance},t.addDocument=function(e,t){this.scope.addDocument(e,t)},t.removeDocument=function(e){this.scope.removeDocument(e)},t}(this),this.InteractEvent=Dt,this.Interactable=void 0,this.interactables=new on(this),this._win=void 0,this.document=void 0,this.window=void 0,this.documents=[],this._plugins={list:[],map:{}},this.onWindowUnload=function(e){return t.removeDocument(e.target)};var n=this;this.Interactable=function(e){c(r,e);var t=f(r);function r(){return i(this,r),t.apply(this,arguments)}return o(r,[{key:`_defaults`,get:function(){return n.defaults}},{key:`set`,value:function(e){return p(l(r.prototype),`set`,this).call(this,e),n.fire(`interactable:set`,{options:e,interactable:this}),this}},{key:`unset`,value:function(){p(l(r.prototype),`unset`,this).call(this);var e=n.interactables.list.indexOf(this);e<0||(n.interactables.list.splice(e,1),n.fire(`interactable:unset`,{interactable:this}))}}]),r}(an)}return o(e,[{key:`addListeners`,value:function(e,t){this.listenerMaps.push({id:t,map:e})}},{key:`fire`,value:function(e,t){for(var n=0,r=this.listenerMaps;n<r.length;n++){var i=r[n].map[e];if(i&&!1===i(t,this,e))return!1}}},{key:`init`,value:function(e){return this.isInitialized?this:function(e,t){return e.isInitialized=!0,b.window(t)&&v(t),w.init(t),E.init(t),Ze.init(t),e.window=t,e.document=t.document,e.usePlugin(nn),e.usePlugin(Jt),e}(this,e)}},{key:`pluginIsInstalled`,value:function(e){var t=e.id;return t?!!this._plugins.map[t]:this._plugins.list.indexOf(e)!==-1}},{key:`usePlugin`,value:function(e,t){if(!this.isInitialized||this.pluginIsInstalled(e))return this;if(e.id&&(this._plugins.map[e.id]=e),this._plugins.list.push(e),e.install&&e.install(this,t),e.listeners&&e.before){for(var n=0,r=this.listenerMaps.length,i=e.before.reduce((function(e,t){return e[t]=!0,e[cn(t)]=!0,e}),{});n<r;n++){var a=this.listenerMaps[n].id;if(a&&(i[a]||i[cn(a)]))break}this.listenerMaps.splice(n,0,{id:e.id,map:e.listeners})}else e.listeners&&this.listenerMaps.push({id:e.id,map:e.listeners});return this}},{key:`addDocument`,value:function(e,t){if(this.getDocIndex(e)!==-1)return!1;var n=y(e);t=t?k({},t):{},this.documents.push({doc:e,options:t}),this.events.documents.push(e),e!==this.document&&this.events.add(n,`unload`,this.onWindowUnload),this.fire(`scope:add-document`,{doc:e,window:n,scope:this,options:t})}},{key:`removeDocument`,value:function(e){var t=this.getDocIndex(e),n=y(e),r=this.documents[t].options;this.events.remove(n,`unload`,this.onWindowUnload),this.documents.splice(t,1),this.events.documents.splice(t,1),this.fire(`scope:remove-document`,{doc:e,window:n,scope:this,options:r})}},{key:`getDocIndex`,value:function(e){for(var t=0;t<this.documents.length;t++)if(this.documents[t].doc===e)return t;return-1}},{key:`getDocOptions`,value:function(e){var t=this.getDocIndex(e);return t===-1?null:this.documents[t].options}},{key:`now`,value:function(){return(this.window.Date||Date).now()}}]),e}();function cn(e){return e&&e.replace(/\/.*$/,``)}var ln=new sn,Y=ln.interactStatic,un=typeof globalThis<`u`?globalThis:window;ln.init(un);var dn=Object.freeze({__proto__:null,edgeTarget:function(){},elements:function(){},grid:function(e){var t=[[`x`,`y`],[`left`,`top`],[`right`,`bottom`],[`width`,`height`]].filter((function(t){var n=t[0],r=t[1];return n in e||r in e})),n=function(n,r){for(var i=e.range,a=e.limits,o=a===void 0?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:a,s=e.offset,c=s===void 0?{x:0,y:0}:s,l={range:i,grid:e,x:null,y:null},u=0;u<t.length;u++){var d=t[u],f=d[0],p=d[1],m=Math.round((n-c.x)/e[f]),h=Math.round((r-c.y)/e[p]);l[f]=Math.max(o.left,Math.min(o.right,m*e[f]+c.x)),l[p]=Math.max(o.top,Math.min(o.bottom,h*e[p]+c.y))}return l};return n.grid=e,n.coordFields=t,n}}),fn={id:`snappers`,install:function(e){var t=e.interactStatic;t.snappers=k(t.snappers||{},dn),t.createSnapGrid=t.snappers.grid}},pn={start:function(e){var t=e.state,r=e.rect,i=e.edges,a=e.pageCoords,o=t.options,s=o.ratio,c=o.enabled,l=t.options,u=l.equalDelta,d=l.modifiers;s===`preserve`&&(s=r.width/r.height),t.startCoords=k({},a),t.startRect=k({},r),t.ratio=s,t.equalDelta=u;var f=t.linkedEdges={top:i.top||i.left&&!i.bottom,left:i.left||i.top&&!i.right,bottom:i.bottom||i.right&&!i.top,right:i.right||i.bottom&&!i.left};if(t.xIsPrimaryAxis=!(!i.left&&!i.right),t.equalDelta){var p=(f.left?1:-1)*(f.top?1:-1);t.edgeSign={x:p,y:p}}else t.edgeSign={x:f.left?-1:1,y:f.top?-1:1};if(!1!==c&&k(i,f),d!=null&&d.length){var m=new xt(e.interaction);m.copyFrom(e.interaction.modification),m.prepareStates(d),t.subModification=m,m.startAll(n({},e))}},set:function(e){var t=e.state,r=e.rect,i=e.coords,a=t.linkedEdges,o=k({},i),s=t.equalDelta?mn:hn;if(k(e.edges,a),s(t,t.xIsPrimaryAxis,i,r),!t.subModification)return null;var c=k({},r);ye(a,c,{x:i.x-o.x,y:i.y-o.y});var l=t.subModification.setAll(n(n({},e),{},{rect:c,edges:a,pageCoords:i,prevCoords:i,prevRect:c})),u=l.delta;return l.changed&&(s(t,Math.abs(u.x)>Math.abs(u.y),l.coords,l.rect),k(i,l.coords)),l.eventProps},defaults:{ratio:`preserve`,equalDelta:!1,modifiers:[],enabled:!1}};function mn(e,t,n){var r=e.startCoords,i=e.edgeSign;t?n.y=r.y+(n.x-r.x)*i.y:n.x=r.x+(n.y-r.y)*i.x}function hn(e,t,n,r){var i=e.startRect,a=e.startCoords,o=e.ratio,s=e.edgeSign;if(t){var c=r.width/o;n.y=a.y+(c-i.height)*s.y}else{var l=r.height*o;n.x=a.x+(l-i.width)*s.x}}var gn=Ct(pn,`aspectRatio`),_n=function(){};_n._defaults={};var vn=_n;function yn(e,t,n){return b.func(e)?ge(e,t.interactable,t.element,[n.x,n.y,t]):ge(e,t.interactable,t.element)}var bn={start:function(e){var t=e.rect,n=e.startOffset,r=e.state,i=e.interaction,a=e.pageCoords,o=r.options,s=o.elementRect,c=k({left:0,top:0,right:0,bottom:0},o.offset||{});if(t&&s){var l=yn(o.restriction,i,a);if(l){var u=l.right-l.left-t.width,d=l.bottom-l.top-t.height;u<0&&(c.left+=u,c.right+=u),d<0&&(c.top+=d,c.bottom+=d)}c.left+=n.left-t.width*s.left,c.top+=n.top-t.height*s.top,c.right+=n.right-t.width*(1-s.right),c.bottom+=n.bottom-t.height*(1-s.bottom)}r.offset=c},set:function(e){var t=e.coords,n=e.interaction,r=e.state,i=r.options,a=r.offset,o=yn(i.restriction,n,t);if(o){var s=function(e){return!e||`left`in e&&`top`in e||((e=k({},e)).left=e.x||0,e.top=e.y||0,e.right=e.right||e.left+e.width,e.bottom=e.bottom||e.top+e.height),e}(o);t.x=Math.max(Math.min(s.right-a.right,t.x),s.left+a.left),t.y=Math.max(Math.min(s.bottom-a.bottom,t.y),s.top+a.top)}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}},xn=Ct(bn,`restrict`),Sn={top:1/0,left:1/0,bottom:-1/0,right:-1/0},Cn={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function wn(e,t){for(var n=0,r=[`top`,`left`,`bottom`,`right`];n<r.length;n++){var i=r[n];i in e||(e[i]=t[i])}return e}var Tn={noInner:Sn,noOuter:Cn,start:function(e){var t,n=e.interaction,r=e.startOffset,i=e.state,a=i.options;a&&(t=_e(yn(a.offset,n,n.coords.start.page))),t||={x:0,y:0},i.offset={top:t.y+r.top,left:t.x+r.left,bottom:t.y-r.bottom,right:t.x-r.right}},set:function(e){var t=e.coords,n=e.edges,r=e.interaction,i=e.state,a=i.offset,o=i.options;if(n){var s=k({},t),c=yn(o.inner,r,s)||{},l=yn(o.outer,r,s)||{};wn(c,Sn),wn(l,Cn),n.top?t.y=Math.min(Math.max(l.top+a.top,s.y),c.top+a.top):n.bottom&&(t.y=Math.max(Math.min(l.bottom+a.bottom,s.y),c.bottom+a.bottom)),n.left?t.x=Math.min(Math.max(l.left+a.left,s.x),c.left+a.left):n.right&&(t.x=Math.max(Math.min(l.right+a.right,s.x),c.right+a.right))}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}},En=Ct(Tn,`restrictEdges`),Dn=k({get elementRect(){return{top:0,left:0,bottom:1,right:1}},set elementRect(e){}},bn.defaults),On=Ct({start:bn.start,set:bn.set,defaults:Dn},`restrictRect`),kn={width:-1/0,height:-1/0},An={width:1/0,height:1/0},jn=Ct({start:function(e){return Tn.start(e)},set:function(e){var t=e.interaction,n=e.state,r=e.rect,i=e.edges,a=n.options;if(i){var o=ve(yn(a.min,t,e.coords))||kn,s=ve(yn(a.max,t,e.coords))||An;n.options={endOnly:a.endOnly,inner:k({},Tn.noInner),outer:k({},Tn.noOuter)},i.top?(n.options.inner.top=r.bottom-o.height,n.options.outer.top=r.bottom-s.height):i.bottom&&(n.options.inner.bottom=r.top+o.height,n.options.outer.bottom=r.top+s.height),i.left?(n.options.inner.left=r.right-o.width,n.options.outer.left=r.right-s.width):i.right&&(n.options.inner.right=r.left+o.width,n.options.outer.right=r.left+s.width),Tn.set(e),n.options=a}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}},`restrictSize`),Mn={start:function(e){var t,n=e.interaction,r=e.interactable,i=e.element,a=e.rect,o=e.state,s=e.startOffset,c=o.options,l=c.offsetWithOrigin?function(e){var t=e.interaction.element;return _e(ge(e.state.options.origin,null,null,[t]))||be(e.interactable,t,e.interaction.prepared.name)}(e):{x:0,y:0};if(c.offset===`startCoords`)t={x:n.coords.start.page.x,y:n.coords.start.page.y};else{var u=ge(c.offset,r,i,[n]);(t=_e(u)||{x:0,y:0}).x+=l.x,t.y+=l.y}var d=c.relativePoints;o.offsets=a&&d&&d.length?d.map((function(e,n){return{index:n,relativePoint:e,x:s.left-a.width*e.x+t.x,y:s.top-a.height*e.y+t.y}})):[{index:0,relativePoint:null,x:t.x,y:t.y}]},set:function(e){var t=e.interaction,n=e.coords,r=e.state,i=r.options,a=r.offsets,o=be(t.interactable,t.element,t.prepared.name),s=k({},n),c=[];i.offsetWithOrigin||(s.x-=o.x,s.y-=o.y);for(var l=0,u=a;l<u.length;l++)for(var d=u[l],f=s.x-d.x,p=s.y-d.y,m=0,h=i.targets.length;m<h;m++){var g=i.targets[m],_=void 0;(_=b.func(g)?g(f,p,t._proxy,d,m):g)&&c.push({x:(b.number(_.x)?_.x:f)+d.x,y:(b.number(_.y)?_.y:p)+d.y,range:b.number(_.range)?_.range:i.range,source:g,index:m,offset:d})}for(var v={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},y=0;y<c.length;y++){var ee=c[y],te=ee.range,x=ee.x-s.x,ne=ee.y-s.y,re=Ce(x,ne),S=re<=te;te===1/0&&v.inRange&&v.range!==1/0&&(S=!1),v.target&&!(S?v.inRange&&te!==1/0?re/te<v.distance/v.range:te===1/0&&v.range!==1/0||re<v.distance:!v.inRange&&re<v.distance)||(v.target=ee,v.distance=re,v.range=te,v.inRange=S,v.delta.x=x,v.delta.y=ne)}return v.inRange&&(n.x=v.target.x,n.y=v.target.y),r.closest=v,v},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}},Nn=Ct(Mn,`snap`),Pn={start:function(e){var t=e.state,n=e.edges,r=t.options;if(!n)return null;e.state={options:{targets:null,relativePoints:[{x:+!n.left,y:+!n.top}],offset:r.offset||`self`,origin:{x:0,y:0},range:r.range}},t.targetFields=t.targetFields||[[`width`,`height`],[`x`,`y`]],Mn.start(e),t.offsets=e.state.offsets,e.state=t},set:function(e){var t=e.interaction,n=e.state,r=e.coords,i=n.options,a=n.offsets,o={x:r.x-a[0].x,y:r.y-a[0].y};n.options=k({},i),n.options.targets=[];for(var s=0,c=i.targets||[];s<c.length;s++){var l=c[s],u=void 0;if(u=b.func(l)?l(o.x,o.y,t):l){for(var d=0,f=n.targetFields;d<f.length;d++){var p=f[d],m=p[0],h=p[1];if(m in u||h in u){u.x=u[m],u.y=u[h];break}}n.options.targets.push(u)}}var g=Mn.set(e);return n.options=i,g},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}},Fn=Ct(Pn,`snapSize`),In={aspectRatio:gn,restrictEdges:En,restrict:xn,restrictRect:On,restrictSize:jn,snapEdges:Ct({start:function(e){var t=e.edges;return t?(e.state.targetFields=e.state.targetFields||[[t.left?`left`:`right`,t.top?`top`:`bottom`]],Pn.start(e)):null},set:Pn.set,defaults:k(bt(Pn.defaults),{targets:void 0,range:void 0,offset:{x:0,y:0}})},`snapEdges`),snap:Nn,snapSize:Fn,spring:vn,avoid:vn,transform:vn,rubberband:vn},Ln={id:`modifiers`,install:function(e){var t=e.interactStatic;for(var n in e.usePlugin(Tt),e.usePlugin(fn),t.modifiers=In,In){var r=In[n],i=r._defaults;i._methods=r._methods,e.defaults.perAction[n]=i}}},Rn=function(e){c(n,e);var t=f(n);function n(e,r,a,o,s,c){var l;if(i(this,n),j(d(l=t.call(this,s)),a),a!==r&&j(d(l),r),l.timeStamp=c,l.originalEvent=a,l.type=e,l.pointerId=Oe(r),l.pointerType=Fe(r),l.target=o,l.currentTarget=null,e===`tap`){var u=s.getPointerIndex(r);l.dt=l.timeStamp-s.pointers[u].downTime;var f=l.timeStamp-s.tapTime;l.double=!!s.prevTap&&s.prevTap.type!==`doubletap`&&s.prevTap.target===l.target&&f<500}else e===`doubletap`&&(l.dt=r.timeStamp-s.tapTime,l.double=!0);return l}return o(n,[{key:`_subtractOrigin`,value:function(e){var t=e.x,n=e.y;return this.pageX-=t,this.pageY-=n,this.clientX-=t,this.clientY-=n,this}},{key:`_addOrigin`,value:function(e){var t=e.x,n=e.y;return this.pageX+=t,this.pageY+=n,this.clientX+=t,this.clientY+=n,this}},{key:`preventDefault`,value:function(){this.originalEvent.preventDefault()}}]),n}(Le),zn={id:`pointer-events/base`,before:[`inertia`,`modifiers`,`auto-start`,`actions`],install:function(e){e.pointerEvents=zn,e.defaults.actions.pointerEvents=zn.defaults,k(e.actions.phaselessTypes,zn.types)},listeners:{"interactions:new":function(e){var t=e.interaction;t.prevTap=null,t.tapTime=0},"interactions:update-pointer":function(e){var t=e.down,n=e.pointerInfo;!t&&n.hold||(n.hold={duration:1/0,timeout:null})},"interactions:move":function(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget;e.duplicate||n.pointerIsDown&&!n.pointerWasMoved||(n.pointerIsDown&&Hn(e),Bn({interaction:n,pointer:r,event:i,eventTarget:a,type:`move`},t))},"interactions:down":function(e,t){(function(e,t){for(var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget,o=e.pointerIndex,s=n.pointers[o].hold,c=pe(a),l={interaction:n,pointer:r,event:i,eventTarget:a,type:`hold`,targets:[],path:c,node:null},u=0;u<c.length;u++)l.node=c[u],t.fire(`pointerEvents:collect-targets`,l);if(l.targets.length){for(var d=1/0,f=0,p=l.targets;f<p.length;f++){var m=p[f].eventable.options.holdDuration;m<d&&(d=m)}s.duration=d,s.timeout=setTimeout((function(){Bn({interaction:n,eventTarget:a,pointer:r,event:i,type:`hold`},t)}),d)}})(e,t),Bn(e,t)},"interactions:up":function(e,t){Hn(e),Bn(e,t),function(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget;n.pointerWasMoved||Bn({interaction:n,eventTarget:a,pointer:r,event:i,type:`tap`},t)}(e,t)},"interactions:cancel":function(e,t){Hn(e),Bn(e,t)}},PointerEvent:Rn,fire:Bn,collectEventTargets:Vn,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function Bn(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget,o=e.type,s=e.targets,c=s===void 0?Vn(e,t):s,l=new Rn(o,r,i,a,n,t.now());t.fire(`pointerEvents:new`,{pointerEvent:l});for(var u={interaction:n,pointer:r,event:i,eventTarget:a,targets:c,type:o,pointerEvent:l},d=0;d<c.length;d++){var f=c[d];for(var p in f.props||{})l[p]=f.props[p];var m=be(f.eventable,f.node);if(l._subtractOrigin(m),l.eventable=f.eventable,l.currentTarget=f.node,f.eventable.fire(l),l._addOrigin(m),l.immediatePropagationStopped||l.propagationStopped&&d+1<c.length&&c[d+1].node!==l.currentTarget)break}if(t.fire(`pointerEvents:fired`,u),o===`tap`){var h=l.double?Bn({interaction:n,pointer:r,event:i,eventTarget:a,type:`doubletap`},t):l;n.prevTap=h,n.tapTime=h.timeStamp}return l}function Vn(e,t){var n=e.interaction,r=e.pointer,i=e.event,a=e.eventTarget,o=e.type,s=n.getPointerIndex(r),c=n.pointers[s];if(o===`tap`&&(n.pointerWasMoved||!c||c.downTarget!==a))return[];for(var l=pe(a),u={interaction:n,pointer:r,event:i,eventTarget:a,type:o,path:l,targets:[],node:null},d=0;d<l.length;d++)u.node=l[d],t.fire(`pointerEvents:collect-targets`,u);return o===`hold`&&(u.targets=u.targets.filter((function(e){var t,r;return e.eventable.options.holdDuration===((t=n.pointers[s])==null||(r=t.hold)==null?void 0:r.duration)}))),u.targets}function Hn(e){var t=e.interaction,n=e.pointerIndex,r=t.pointers[n].hold;r&&r.timeout&&(clearTimeout(r.timeout),r.timeout=null)}var Un=Object.freeze({__proto__:null,default:zn});function Wn(e){var t=e.interaction;t.holdIntervalHandle&&=(clearInterval(t.holdIntervalHandle),null)}var Gn={id:`pointer-events/holdRepeat`,install:function(e){e.usePlugin(zn);var t=e.pointerEvents;t.defaults.holdRepeatInterval=0,t.types.holdrepeat=e.actions.phaselessTypes.holdrepeat=!0},listeners:[`move`,`up`,`cancel`,`endall`].reduce((function(e,t){return e[`pointerEvents:${t}`]=Wn,e}),{"pointerEvents:new":function(e){var t=e.pointerEvent;t.type===`hold`&&(t.count=(t.count||0)+1)},"pointerEvents:fired":function(e,t){var n=e.interaction,r=e.pointerEvent,i=e.eventTarget,a=e.targets;if(r.type===`hold`&&a.length){var o=a[0].eventable.options.holdRepeatInterval;o<=0||(n.holdIntervalHandle=setTimeout((function(){t.pointerEvents.fire({interaction:n,eventTarget:i,type:`hold`,pointer:r,event:r},t)}),o))}}})},Kn={id:`pointer-events/interactableTargets`,install:function(e){var t=e.Interactable;t.prototype.pointerEvents=function(e){return k(this.events.options,e),this};var n=t.prototype._backCompatOption;t.prototype._backCompatOption=function(e,t){var r=n.call(this,e,t);return r===this&&(this.events.options[e]=t),r}},listeners:{"pointerEvents:collect-targets":function(e,t){var n=e.targets,r=e.node,i=e.type,a=e.eventTarget;t.interactables.forEachMatch(r,(function(e){var t=e.events,o=t.options;t.types[i]&&t.types[i].length&&e.testIgnoreAllow(o,r,a)&&n.push({node:r,eventable:t,props:{interactable:e}})}))},"interactable:new":function(e){var t=e.interactable;t.events.getRect=function(e){return t.getRect(e)}},"interactable:set":function(e,t){var n=e.interactable,r=e.options;k(n.events.options,t.pointerEvents.defaults),k(n.events.options,r.pointerEvents||{})}}};if(Y.use(yt),Y.use(It),Y.use({id:`pointer-events`,install:function(e){e.usePlugin(Un),e.usePlugin(Gn),e.usePlugin(Kn)}}),Y.use(Ht),Y.use(Ln),Y.use(_t),Y.use(Ye),Y.use(et),Y.use({id:`reflow`,install:function(e){var t=e.Interactable;e.actions.phases.reflow=!0,t.prototype.reflow=function(t){return function(e,t,n){for(var r=e.getAllElements(),i=n.window.Promise,a=i?[]:null,o=function(){var o=r[s],c=e.getRect(o);if(!c)return 1;var l,u=N(n.interactions.list,(function(n){return n.interacting()&&n.interactable===e&&n.element===o&&n.prepared.name===t.name}));if(u)u.move(),a&&(l=u._reflowPromise||new i((function(e){u._reflowResolve=e})));else{var d=ve(c);l=function(e,t,n,r,i){var a=e.interactions.new({pointerType:`reflow`}),o={interaction:a,event:i,pointer:i,eventTarget:n,phase:`reflow`};a.interactable=t,a.element=n,a.prevEvent=i,a.updatePointer(i,i,n,!0),we(a.coords.delta),nt(a.prepared,r),a._doPhase(o);var s=e.window.Promise,c=s?new s((function(e){a._reflowResolve=e})):void 0;return a._reflowPromise=c,a.start(r,t,n),a._interacting?(a.move(o),a.end(i)):(a.stop(),a._reflowResolve()),a.removePointer(i,i),c}(n,e,o,t,function(e){return{coords:e,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}}}({page:{x:d.x,y:d.y},client:{x:d.x,y:d.y},timeStamp:n.now()}))}a&&a.push(l)},s=0;s<r.length&&!o();s++);return a&&i.all(a).then((function(){return e}))}(this,t,e)}},listeners:{"interactions:stop":function(e,t){var n=e.interaction;n.pointerType===`reflow`&&(n._reflowResolve&&n._reflowResolve(),function(e,t){e.splice(e.indexOf(t),1)}(t.interactions.list,n))}}}),Y.default=Y,(t===void 0?`undefined`:r(t))===`object`&&t)try{t.exports=Y}catch{}return Y.default=Y,Y}))}))(),1),G=class extends N{constructor(...e){super(...e),this.x=0,this.y=0,this.width=0,this.height=0,this.orientation=`landscape`,this.itemIndex=0,this.name=``,this.selected=!1,this.invalid=!1,this.readOnly=!1,this.border_width_mm=0,this.panel_width_mm=0,this.panel_height_mm=0,this.frame_colour=``,this.mat_colour=``}static{this.styles=[z,h`
      :host {
        display: block;
        position: absolute;
        box-sizing: border-box;
        cursor: move;
        transition: transform 0.2s ease;
        overflow: visible;
      }
      :host([readOnly]) {
        cursor: default;
      }
      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 2px solid #333;
        box-shadow: var(--shadow-small);
      }
      :host([selected]) .container { border-color: var(--primary-colour); box-shadow: 0 0 0 2px rgba(3,169,244,0.3); z-index: 10; }
      :host([invalid]) .container { border-color: var(--danger-colour); background-color: rgba(244, 67, 54, 0.1); }
      
      .label {
        position: absolute;
        z-index: 5;
        font-size: 10px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        text-align: center;
        pointer-events: none;
      }
      
      .actions {
        position: absolute;
        top: -15px; right: -15px;
        display: flex; gap: 12px;
        opacity: 0; visibility: hidden;
        background: white; padding: 6px 10px; border-radius: 20px;
        box-shadow: var(--shadow-medium); z-index: 50;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: scale(calc(0.8 / var(--editor-scale, 1)));
      }
      :host(:hover:not([readOnly])) .actions { opacity: 1; visibility: visible; transform: scale(calc(1 / var(--editor-scale, 1))); }
      
      .action-icon {
        cursor: pointer; color: #555; width: 24px; height: 24px;
        display: flex; align-items: center; justify-content: center;
        transition: color 0.2s, transform 0.1s;
      }
      .action-icon:hover { color: var(--primary-colour); transform: scale(1.2); }
      .action-icon.delete:hover { color: var(--danger-colour); }
      
      .item-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 60px;
        font-weight: 900;
        color: rgba(0, 0, 0, 0.15);
        pointer-events: none;
        z-index: 35;
        font-family: 'Outfit', sans-serif;
      }
    `]}updated(e){if((e.has(`x`)||e.has(`y`))&&(this.style.transform=`translate(${this.x}px, ${this.y}px)`),e.has(`orientation`)||e.has(`width`)||e.has(`height`)){let e=this.orientation===`portrait`;this.style.width=`${e?this.height:this.width}px`,this.style.height=`${e?this.width:this.height}px`}}_dispatch(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}render(){return A`
      <div class="container" style="width: 100%; height: 100%;">
        <hardware-preview
          .width_mm="${this.width}"
          .height_mm="${this.height}"
          .border_width_mm="${this.border_width_mm}"
          .panel_width_mm="${this.panel_width_mm}"
          .panel_height_mm="${this.panel_height_mm}"
          .frame_colour="${this.frame_colour}"
          .mat_colour="${this.mat_colour}"
          .scale="${1}"
          .orientation="${this.orientation}"
        ></hardware-preview>

        <div class="item-number">
          ${this.itemIndex}
        </div>

        <div class="label">
          ${this.name} ${this.invalid?`(Overlap!)`:``}
        </div>

        <div class="actions">
          <div class="action-icon" title="Settings" @click="${()=>this._dispatch(`item-edit`)}">
            <span class="material-icons" style="font-size: 16px;">settings</span>
          </div>
          <div class="action-icon" title="Rotate" @click="${e=>{e.stopPropagation(),this._dispatch(`item-rotate`)}}">
            <span class="material-icons" style="font-size: 16px;">rotate_right</span>
          </div>
          <div class="action-icon delete" title="Delete" @click="${e=>{e.stopPropagation(),this._dispatch(`item-delete`)}}">
            <span class="material-icons" style="font-size: 16px;">delete_outline</span>
          </div>
        </div>
      </div>
    `}};V([F({type:Number}),B(`design:type`,Object)],G.prototype,`x`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`y`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`width`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`height`,void 0),V([F({type:String}),B(`design:type`,String)],G.prototype,`orientation`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`itemIndex`,void 0),V([F({type:String}),B(`design:type`,Object)],G.prototype,`name`,void 0),V([F({type:Boolean,reflect:!0}),B(`design:type`,Object)],G.prototype,`selected`,void 0),V([F({type:Boolean,reflect:!0}),B(`design:type`,Object)],G.prototype,`invalid`,void 0),V([F({type:Boolean,reflect:!0}),B(`design:type`,Object)],G.prototype,`readOnly`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`border_width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`panel_width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],G.prototype,`panel_height_mm`,void 0),V([F({type:String}),B(`design:type`,Object)],G.prototype,`frame_colour`,void 0),V([F({type:String}),B(`design:type`,Object)],G.prototype,`mat_colour`,void 0),G=V([P(`layout-box`)],G);var lt=class extends N{static{this.styles=h`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      overflow: auto;
      box-sizing: border-box;
      padding: 40px;
    }
    :host([hidden]) {
      display: none !important;
    }
    .viewport {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      min-height: 0;
    }
    .scaling-container {
      display: block;
      position: relative;
      flex-shrink: 0;
    }
    .canvas-wrapper {
      transform-origin: top left;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .canvas {
      background-color: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      position: relative;
      border: 1px solid #ccc;
      box-sizing: content-box; /* Match physical mm exactly */
    }
    .canvas.resizing {
      border-color: #03a9f4;
      box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    .grid-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      background-image: 
      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
      background-size: var(--grid-size, 10px) var(--grid-size, 10px);
    }
    /* Resize handles hints */
    .canvas::after {
      content: '';
      position: absolute;
      right: -5px; bottom: -5px;
      width: 15px; height: 15px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, #ccc 50%, #ccc 60%, transparent 60%, transparent 70%, #ccc 70%);
      opacity: 0.5;
    }
    .canvas:hover::after { opacity: 1; }
    :host([readOnly]) .canvas::after {
      display: none;
    }
  `}constructor(){super(),this.width_mm=500,this.height_mm=500,this.gridSnap=5,this.items=[],this.displayTypes=[],this.selectedIds=[],this.readOnly=!1,this._scale=1,this._resizeObserver=new ResizeObserver(e=>{e[0]&&this._updateScale(e[0].contentRect)})}connectedCallback(){super.connectedCallback(),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver.disconnect()}firstUpdated(){this._setupInteractions(),this._validateLayout(),this._updateScale()}updated(e){(e.has(`gridSnap`)||e.has(`items`))&&(this._setupInteractions(),this._validateLayout()),(e.has(`width_mm`)||e.has(`height_mm`))&&this._updateScale()}_updateScale(e=null){if(!e){let t=this.getBoundingClientRect();e={width:t.width,height:t.height}}let t=Math.max(0,(e.width||0)-80),n=Math.max(0,(e.height||0)-80);if(t>0&&n>0){let e=t/this.width_mm,r=n/this.height_mm,i=Math.min(e,r,4);Math.abs(this._scale-i)>.001&&(this._scale=i)}}_setupInteractions(){let e=this.shadowRoot?.querySelector(`.canvas`);e&&((0,ct.default)(e).unset(),(0,ct.default)(`layout-box`,{context:this.shadowRoot}).unset(),!this.readOnly&&((0,ct.default)(`layout-box`,{context:this.shadowRoot}).draggable({modifiers:[ct.default.modifiers.restrictRect({restriction:`parent`,endOnly:!0}),ct.default.modifiers.snap({targets:[ct.default.snappers.grid({x:this.gridSnap,y:this.gridSnap})],range:1/0,relativePoints:[{x:0,y:0}]})],listeners:{move:e=>{let t=e.target,n=t.getAttribute(`data-id`),r=this.items.find(e=>e.id===n);if(r){let n=e.dx/this._scale,i=e.dy/this._scale,a=r.x_mm+n,o=r.y_mm+i;r.x_mm=Math.round(a/this.gridSnap)*this.gridSnap,r.y_mm=Math.round(o/this.gridSnap)*this.gridSnap,t.x=r.x_mm,t.y=r.y_mm,this._validateLayout(),this._triggerRequestUpdate()}},end:e=>{let t=e.target.getAttribute(`data-id`),n=this.items.find(e=>e.id===t);n&&this.dispatchEvent(new CustomEvent(`item-moved`,{detail:{id:t,x:n.x_mm,y:n.y_mm},bubbles:!0,composed:!0}))}}}),(0,ct.default)(e).resizable({edges:{right:!0,bottom:!0,left:!1,top:!1},modifiers:[ct.default.modifiers.snap({targets:[ct.default.snappers.grid({x:this.gridSnap,y:this.gridSnap})],range:1/0,relativePoints:[{x:0,y:0}]}),ct.default.modifiers.restrictSize({min:{width:100,height:100}})],listeners:{start:()=>{e.classList.add(`resizing`)},move:e=>{this.width_mm=Math.round(e.rect.width/this._scale/this.gridSnap)*this.gridSnap,this.height_mm=Math.round(e.rect.height/this._scale/this.gridSnap)*this.gridSnap,this._updateScale(),this._validateLayout()},end:()=>{e.classList.remove(`resizing`),this.dispatchEvent(new CustomEvent(`layout-resized`,{detail:{width:this.width_mm,height:this.height_mm},bubbles:!0,composed:!0}))}}})))}_validateLayout(){this.items.forEach(e=>e.invalid=!1);for(let e=0;e<this.items.length;e++){let t=this.items[e],n=this.displayTypes.find(e=>e.id===t.display_type_id);if(!n)continue;let r=t.orientation===`portrait`,i=r?n.height_mm:n.width_mm,a=r?n.width_mm:n.height_mm;(t.x_mm<0||t.y_mm<0||t.x_mm+i>this.width_mm||t.y_mm+a>this.height_mm)&&(t.invalid=!0);for(let t=e+1;t<this.items.length;t++){let n=this.items[e],r=this.items[t],i=this.displayTypes.find(e=>e.id===n.display_type_id),a=this.displayTypes.find(e=>e.id===r.display_type_id);if(!i||!a)continue;let o=n.orientation===`portrait`,s=o?i.height_mm:i.width_mm,c=o?i.width_mm:i.height_mm,l=r.orientation===`portrait`,u=l?a.height_mm:a.width_mm,d=l?a.width_mm:a.height_mm;n.x_mm<r.x_mm+u&&n.x_mm+s>r.x_mm&&n.y_mm<r.y_mm+d&&n.y_mm+c>r.y_mm&&(n.invalid=!0,r.invalid=!0)}}}_triggerRequestUpdate(){this.items=[...this.items],this.requestUpdate()}_handleBoxSelect(e){if(this.readOnly){let t=this.selectedIds.includes(e)?this.selectedIds.filter(t=>t!==e):[...this.selectedIds,e];this.dispatchEvent(new CustomEvent(`selection-change`,{detail:{ids:t},bubbles:!0,composed:!0}))}else this.dispatchEvent(new CustomEvent(`select-item`,{detail:{id:e}}))}_handleBoxEdit(e){this.dispatchEvent(new CustomEvent(`edit-item`,{detail:{id:e}}))}_handleMouseMove(e){let t=this.shadowRoot?.querySelector(`.canvas`);if(!t)return;let n=t.getBoundingClientRect(),r=(e.clientX-n.left)/this._scale,i=(e.clientY-n.top)/this._scale;this.dispatchEvent(new CustomEvent(`mouse-move`,{detail:{x:Math.round(r),y:Math.round(i)},bubbles:!0,composed:!0}))}_handleMouseLeave(){this.dispatchEvent(new CustomEvent(`mouse-move`,{detail:{x:null,y:null},bubbles:!0,composed:!0}))}_handleBoxRotate(e){this.dispatchEvent(new CustomEvent(`rotate-item`,{detail:{id:e}}))}render(){let e=this.gridSnap<5?10:this.gridSnap;return A`
      <div class="viewport">
        <div class="scaling-container" style="width: ${this.width_mm*this._scale}px; height: ${this.height_mm*this._scale}px;">
          <div class="canvas-wrapper" style="transform: scale(${this._scale});">
            <div 
              class="canvas" 
              style="width: ${this.width_mm}px; height: ${this.height_mm}px; --grid-size: ${e}px; --editor-scale: ${this._scale};"
              @mousemove="${this._handleMouseMove}"
              @mouseleave="${this._handleMouseLeave}"
            >
              <div class="grid-overlay"></div>
              ${st(this.items,e=>e.id||Math.random().toString(),(e,t)=>{let n=this.displayTypes.find(t=>t.id===e.display_type_id);return n?A`
                  <layout-box
                    data-id="${e.id}"
                    .itemIndex="${t+1}"
                    .x="${e.x_mm}"
                    .y="${e.y_mm}"
                    .width="${n.width_mm}"
                    .height="${n.height_mm}"
                    .orientation="${e.orientation}"
                    .name="${n.name}"
                    .border_width_mm="${n.frame?.border_width_mm||0}"
                    .panel_width_mm="${n.panel_width_mm}"
                    .panel_height_mm="${n.panel_height_mm}"
                    .frame_colour="${n.frame?.colour}"
                    .mat_colour="${n.mat?.colour}"
                    ?selected="${this.selectedIds.includes(e.id)}"
                    ?invalid="${e.invalid}"
                    .readOnly="${this.readOnly}"
                    @mousedown="${()=>this._handleBoxSelect(e.id)}"
                    @item-edit="${()=>this._handleBoxEdit(e.id)}"
                    @item-rotate="${()=>this._handleBoxRotate(e.id)}"
                    @item-delete="${()=>this.dispatchEvent(new CustomEvent(`item-delete`,{detail:{id:e.id}}))}"
                  ></layout-box>
                `:``})}
            </div>
          </div>
        </div>
      </div>
    `}};V([F({type:Number}),B(`design:type`,Object)],lt.prototype,`width_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],lt.prototype,`height_mm`,void 0),V([F({type:Number}),B(`design:type`,Object)],lt.prototype,`gridSnap`,void 0),V([F({type:Array}),B(`design:type`,Array)],lt.prototype,`items`,void 0),V([F({type:Array}),B(`design:type`,Array)],lt.prototype,`displayTypes`,void 0),V([F({type:Array}),B(`design:type`,Array)],lt.prototype,`selectedIds`,void 0),V([F({type:Boolean,reflect:!0}),B(`design:type`,Object)],lt.prototype,`readOnly`,void 0),V([I(),B(`design:type`,Object)],lt.prototype,`_scale`,void 0),lt=V([P(`layout-editor`),B(`design:paramtypes`,[])],lt);var ut=class extends Xe{constructor(e){if(super(e),this.it=M,e.type!==Je.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===M||e==null)return this._t=void 0,this.it=e;if(e===j)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};ut.directiveName=`unsafeHTML`,ut.resultType=1;var dt=Ye(ut);function ft(e){return e==null}function pt(e){return typeof e==`object`&&!!e}function mt(e){return Array.isArray(e)?e:ft(e)?[]:[e]}function ht(e,t){var n,r,i,a;if(t)for(a=Object.keys(t),n=0,r=a.length;n<r;n+=1)i=a[n],e[i]=t[i];return e}function gt(e,t){var n=``,r;for(r=0;r<t;r+=1)n+=e;return n}function _t(e){return e===0&&1/e==-1/0}var K={isNothing:ft,isObject:pt,toArray:mt,repeat:gt,isNegativeZero:_t,extend:ht};function vt(e,t){var n=``,r=e.reason||`(unknown reason)`;return e.mark?(e.mark.name&&(n+=`in "`+e.mark.name+`" `),n+=`(`+(e.mark.line+1)+`:`+(e.mark.column+1)+`)`,!t&&e.mark.snippet&&(n+=`

`+e.mark.snippet),r+` `+n):r}function yt(e,t){Error.call(this),this.name=`YAMLException`,this.reason=e,this.mark=t,this.message=vt(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=Error().stack||``}yt.prototype=Object.create(Error.prototype),yt.prototype.constructor=yt,yt.prototype.toString=function(e){return this.name+`: `+vt(this,e)};var q=yt;function bt(e,t,n,r,i){var a=``,o=``,s=Math.floor(i/2)-1;return r-t>s&&(a=` ... `,t=r-s+a.length),n-r>s&&(o=` ...`,n=r+s-o.length),{str:a+e.slice(t,n).replace(/\t/g,`→`)+o,pos:r-t+a.length}}function xt(e,t){return K.repeat(` `,t-e.length)+e}function St(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||=79,typeof t.indent!=`number`&&(t.indent=1),typeof t.linesBefore!=`number`&&(t.linesBefore=3),typeof t.linesAfter!=`number`&&(t.linesAfter=2);for(var n=/\r?\n|\r|\0/g,r=[0],i=[],a,o=-1;a=n.exec(e.buffer);)i.push(a.index),r.push(a.index+a[0].length),e.position<=a.index&&o<0&&(o=r.length-2);o<0&&(o=r.length-1);var s=``,c,l,u=Math.min(e.line+t.linesAfter,i.length).toString().length,d=t.maxLength-(t.indent+u+3);for(c=1;c<=t.linesBefore&&!(o-c<0);c++)l=bt(e.buffer,r[o-c],i[o-c],e.position-(r[o]-r[o-c]),d),s=K.repeat(` `,t.indent)+xt((e.line-c+1).toString(),u)+` | `+l.str+`
`+s;for(l=bt(e.buffer,r[o],i[o],e.position,d),s+=K.repeat(` `,t.indent)+xt((e.line+1).toString(),u)+` | `+l.str+`
`,s+=K.repeat(`-`,t.indent+u+3+l.pos)+`^
`,c=1;c<=t.linesAfter&&!(o+c>=i.length);c++)l=bt(e.buffer,r[o+c],i[o+c],e.position-(r[o]-r[o+c]),d),s+=K.repeat(` `,t.indent)+xt((e.line+c+1).toString(),u)+` | `+l.str+`
`;return s.replace(/\n$/,``)}var Ct=St,wt=[`kind`,`multi`,`resolve`,`construct`,`instanceOf`,`predicate`,`represent`,`representName`,`defaultStyle`,`styleAliases`],Tt=[`scalar`,`sequence`,`mapping`];function Et(e){var t={};return e!==null&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}function Dt(e,t){if(t||={},Object.keys(t).forEach(function(t){if(wt.indexOf(t)===-1)throw new q(`Unknown option "`+t+`" is met in definition of "`+e+`" YAML type.`)}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=Et(t.styleAliases||null),Tt.indexOf(this.kind)===-1)throw new q(`Unknown kind "`+this.kind+`" is specified for "`+e+`" YAML type.`)}var J=Dt;function Ot(e,t){var n=[];return e[t].forEach(function(e){var t=n.length;n.forEach(function(n,r){n.tag===e.tag&&n.kind===e.kind&&n.multi===e.multi&&(t=r)}),n[t]=e}),n}function kt(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},t,n;function r(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(t=0,n=arguments.length;t<n;t+=1)arguments[t].forEach(r);return e}function At(e){return this.extend(e)}At.prototype.extend=function(e){var t=[],n=[];if(e instanceof J)n.push(e);else if(Array.isArray(e))n=n.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(n=n.concat(e.explicit));else throw new q(`Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })`);t.forEach(function(e){if(!(e instanceof J))throw new q(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);if(e.loadKind&&e.loadKind!==`scalar`)throw new q(`There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.`);if(e.multi)throw new q(`There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.`)}),n.forEach(function(e){if(!(e instanceof J))throw new q(`Specified list of YAML types (or a single Type object) contains a non-Type object.`)});var r=Object.create(At.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(n),r.compiledImplicit=Ot(r,`implicit`),r.compiledExplicit=Ot(r,`explicit`),r.compiledTypeMap=kt(r.compiledImplicit,r.compiledExplicit),r};var jt=At,Mt=new J(`tag:yaml.org,2002:str`,{kind:`scalar`,construct:function(e){return e===null?``:e}}),Nt=new J(`tag:yaml.org,2002:seq`,{kind:`sequence`,construct:function(e){return e===null?[]:e}}),Pt=new J(`tag:yaml.org,2002:map`,{kind:`mapping`,construct:function(e){return e===null?{}:e}}),Ft=new jt({explicit:[Mt,Nt,Pt]});function It(e){if(e===null)return!0;var t=e.length;return t===1&&e===`~`||t===4&&(e===`null`||e===`Null`||e===`NULL`)}function Lt(){return null}function Rt(e){return e===null}var zt=new J(`tag:yaml.org,2002:null`,{kind:`scalar`,resolve:It,construct:Lt,predicate:Rt,represent:{canonical:function(){return`~`},lowercase:function(){return`null`},uppercase:function(){return`NULL`},camelcase:function(){return`Null`},empty:function(){return``}},defaultStyle:`lowercase`});function Bt(e){if(e===null)return!1;var t=e.length;return t===4&&(e===`true`||e===`True`||e===`TRUE`)||t===5&&(e===`false`||e===`False`||e===`FALSE`)}function Vt(e){return e===`true`||e===`True`||e===`TRUE`}function Ht(e){return Object.prototype.toString.call(e)===`[object Boolean]`}var Ut=new J(`tag:yaml.org,2002:bool`,{kind:`scalar`,resolve:Bt,construct:Vt,predicate:Ht,represent:{lowercase:function(e){return e?`true`:`false`},uppercase:function(e){return e?`TRUE`:`FALSE`},camelcase:function(e){return e?`True`:`False`}},defaultStyle:`lowercase`});function Wt(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Gt(e){return 48<=e&&e<=55}function Kt(e){return 48<=e&&e<=57}function qt(e){if(e===null)return!1;var t=e.length,n=0,r=!1,i;if(!t)return!1;if(i=e[n],(i===`-`||i===`+`)&&(i=e[++n]),i===`0`){if(n+1===t)return!0;if(i=e[++n],i===`b`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(i!==`0`&&i!==`1`)return!1;r=!0}return r&&i!==`_`}if(i===`x`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(!Wt(e.charCodeAt(n)))return!1;r=!0}return r&&i!==`_`}if(i===`o`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(!Gt(e.charCodeAt(n)))return!1;r=!0}return r&&i!==`_`}}if(i===`_`)return!1;for(;n<t;n++)if(i=e[n],i!==`_`){if(!Kt(e.charCodeAt(n)))return!1;r=!0}return!(!r||i===`_`)}function Jt(e){var t=e,n=1,r;if(t.indexOf(`_`)!==-1&&(t=t.replace(/_/g,``)),r=t[0],(r===`-`||r===`+`)&&(r===`-`&&(n=-1),t=t.slice(1),r=t[0]),t===`0`)return 0;if(r===`0`){if(t[1]===`b`)return n*parseInt(t.slice(2),2);if(t[1]===`x`)return n*parseInt(t.slice(2),16);if(t[1]===`o`)return n*parseInt(t.slice(2),8)}return n*parseInt(t,10)}function Yt(e){return Object.prototype.toString.call(e)===`[object Number]`&&e%1==0&&!K.isNegativeZero(e)}var Xt=new J(`tag:yaml.org,2002:int`,{kind:`scalar`,resolve:qt,construct:Jt,predicate:Yt,represent:{binary:function(e){return e>=0?`0b`+e.toString(2):`-0b`+e.toString(2).slice(1)},octal:function(e){return e>=0?`0o`+e.toString(8):`-0o`+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?`0x`+e.toString(16).toUpperCase():`-0x`+e.toString(16).toUpperCase().slice(1)}},defaultStyle:`decimal`,styleAliases:{binary:[2,`bin`],octal:[8,`oct`],decimal:[10,`dec`],hexadecimal:[16,`hex`]}}),Zt=RegExp(`^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);function Qt(e){return!(e===null||!Zt.test(e)||e[e.length-1]===`_`)}function $t(e){var t=e.replace(/_/g,``).toLowerCase(),n=t[0]===`-`?-1:1;return`+-`.indexOf(t[0])>=0&&(t=t.slice(1)),t===`.inf`?n===1?1/0:-1/0:t===`.nan`?NaN:n*parseFloat(t,10)}var en=/^[-+]?[0-9]+e/;function tn(e,t){var n;if(isNaN(e))switch(t){case`lowercase`:return`.nan`;case`uppercase`:return`.NAN`;case`camelcase`:return`.NaN`}else if(e===1/0)switch(t){case`lowercase`:return`.inf`;case`uppercase`:return`.INF`;case`camelcase`:return`.Inf`}else if(e===-1/0)switch(t){case`lowercase`:return`-.inf`;case`uppercase`:return`-.INF`;case`camelcase`:return`-.Inf`}else if(K.isNegativeZero(e))return`-0.0`;return n=e.toString(10),en.test(n)?n.replace(`e`,`.e`):n}function nn(e){return Object.prototype.toString.call(e)===`[object Number]`&&(e%1!=0||K.isNegativeZero(e))}var rn=new J(`tag:yaml.org,2002:float`,{kind:`scalar`,resolve:Qt,construct:$t,predicate:nn,represent:tn,defaultStyle:`lowercase`}),an=Ft.extend({implicit:[zt,Ut,Xt,rn]}),on=an,sn=RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`),cn=RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);function ln(e){return e===null?!1:sn.exec(e)!==null||cn.exec(e)!==null}function Y(e){var t,n,r,i,a,o,s,c=0,l=null,u,d,f;if(t=sn.exec(e),t===null&&(t=cn.exec(e)),t===null)throw Error(`Date resolve error`);if(n=+t[1],r=t[2]-1,i=+t[3],!t[4])return new Date(Date.UTC(n,r,i));if(a=+t[4],o=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+=`0`;c=+c}return t[9]&&(u=+t[10],d=+(t[11]||0),l=(u*60+d)*6e4,t[9]===`-`&&(l=-l)),f=new Date(Date.UTC(n,r,i,a,o,s,c)),l&&f.setTime(f.getTime()-l),f}function un(e){return e.toISOString()}var dn=new J(`tag:yaml.org,2002:timestamp`,{kind:`scalar`,resolve:ln,construct:Y,instanceOf:Date,represent:un});function fn(e){return e===`<<`||e===null}var pn=new J(`tag:yaml.org,2002:merge`,{kind:`scalar`,resolve:fn}),mn=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function hn(e){if(e===null)return!1;var t,n,r=0,i=e.length,a=mn;for(n=0;n<i;n++)if(t=a.indexOf(e.charAt(n)),!(t>64)){if(t<0)return!1;r+=6}return r%8==0}function gn(e){var t,n,r=e.replace(/[\r\n=]/g,``),i=r.length,a=mn,o=0,s=[];for(t=0;t<i;t++)t%4==0&&t&&(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)),o=o<<6|a.indexOf(r.charAt(t));return n=i%4*6,n===0?(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)):n===18?(s.push(o>>10&255),s.push(o>>2&255)):n===12&&s.push(o>>4&255),new Uint8Array(s)}function _n(e){var t=``,n=0,r,i,a=e.length,o=mn;for(r=0;r<a;r++)r%3==0&&r&&(t+=o[n>>18&63],t+=o[n>>12&63],t+=o[n>>6&63],t+=o[n&63]),n=(n<<8)+e[r];return i=a%3,i===0?(t+=o[n>>18&63],t+=o[n>>12&63],t+=o[n>>6&63],t+=o[n&63]):i===2?(t+=o[n>>10&63],t+=o[n>>4&63],t+=o[n<<2&63],t+=o[64]):i===1&&(t+=o[n>>2&63],t+=o[n<<4&63],t+=o[64],t+=o[64]),t}function vn(e){return Object.prototype.toString.call(e)===`[object Uint8Array]`}var yn=new J(`tag:yaml.org,2002:binary`,{kind:`scalar`,resolve:hn,construct:gn,predicate:vn,represent:_n}),bn=Object.prototype.hasOwnProperty,xn=Object.prototype.toString;function Sn(e){if(e===null)return!0;var t=[],n,r,i,a,o,s=e;for(n=0,r=s.length;n<r;n+=1){if(i=s[n],o=!1,xn.call(i)!==`[object Object]`)return!1;for(a in i)if(bn.call(i,a))if(!o)o=!0;else return!1;if(!o)return!1;if(t.indexOf(a)===-1)t.push(a);else return!1}return!0}function Cn(e){return e===null?[]:e}var wn=new J(`tag:yaml.org,2002:omap`,{kind:`sequence`,resolve:Sn,construct:Cn}),Tn=Object.prototype.toString;function En(e){if(e===null)return!0;var t,n,r,i,a,o=e;for(a=Array(o.length),t=0,n=o.length;t<n;t+=1){if(r=o[t],Tn.call(r)!==`[object Object]`||(i=Object.keys(r),i.length!==1))return!1;a[t]=[i[0],r[i[0]]]}return!0}function Dn(e){if(e===null)return[];var t,n,r,i,a,o=e;for(a=Array(o.length),t=0,n=o.length;t<n;t+=1)r=o[t],i=Object.keys(r),a[t]=[i[0],r[i[0]]];return a}var On=new J(`tag:yaml.org,2002:pairs`,{kind:`sequence`,resolve:En,construct:Dn}),kn=Object.prototype.hasOwnProperty;function An(e){if(e===null)return!0;var t,n=e;for(t in n)if(kn.call(n,t)&&n[t]!==null)return!1;return!0}function jn(e){return e===null?{}:e}var Mn=new J(`tag:yaml.org,2002:set`,{kind:`mapping`,resolve:An,construct:jn}),Nn=on.extend({implicit:[dn,pn],explicit:[yn,wn,On,Mn]}),Pn=Object.prototype.hasOwnProperty,Fn=1,In=2,Ln=3,Rn=4,zn=1,Bn=2,Vn=3,Hn=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Un=/[\x85\u2028\u2029]/,Wn=/[,\[\]\{\}]/,Gn=/^(?:!|!!|![a-z\-]+!)$/i,Kn=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function qn(e){return Object.prototype.toString.call(e)}function Jn(e){return e===10||e===13}function Yn(e){return e===9||e===32}function Xn(e){return e===9||e===32||e===10||e===13}function Zn(e){return e===44||e===91||e===93||e===123||e===125}function Qn(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function $n(e){return e===120?2:e===117?4:e===85?8:0}function er(e){return 48<=e&&e<=57?e-48:-1}function tr(e){return e===48?`\0`:e===97?`\x07`:e===98?`\b`:e===116||e===9?`	`:e===110?`
`:e===118?`\v`:e===102?`\f`:e===114?`\r`:e===101?`\x1B`:e===32?` `:e===34?`"`:e===47?`/`:e===92?`\\`:e===78?``:e===95?`\xA0`:e===76?`\u2028`:e===80?`\u2029`:``}function nr(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function rr(e,t,n){t===`__proto__`?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:n}):e[t]=n}for(var ir=Array(256),ar=Array(256),or=0;or<256;or++)ir[or]=+!!tr(or),ar[or]=tr(or);function sr(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Nn,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function cr(e,t){var n={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return n.snippet=Ct(n),new q(t,n)}function X(e,t){throw cr(e,t)}function lr(e,t){e.onWarning&&e.onWarning.call(null,cr(e,t))}var ur={YAML:function(e,t,n){var r,i,a;e.version!==null&&X(e,`duplication of %YAML directive`),n.length!==1&&X(e,`YAML directive accepts exactly one argument`),r=/^([0-9]+)\.([0-9]+)$/.exec(n[0]),r===null&&X(e,`ill-formed argument of the YAML directive`),i=parseInt(r[1],10),a=parseInt(r[2],10),i!==1&&X(e,`unacceptable YAML version of the document`),e.version=n[0],e.checkLineBreaks=a<2,a!==1&&a!==2&&lr(e,`unsupported YAML version of the document`)},TAG:function(e,t,n){var r,i;n.length!==2&&X(e,`TAG directive accepts exactly two arguments`),r=n[0],i=n[1],Gn.test(r)||X(e,`ill-formed tag handle (first argument) of the TAG directive`),Pn.call(e.tagMap,r)&&X(e,`there is a previously declared suffix for "`+r+`" tag handle`),Kn.test(i)||X(e,`ill-formed tag prefix (second argument) of the TAG directive`);try{i=decodeURIComponent(i)}catch{X(e,`tag prefix is malformed: `+i)}e.tagMap[r]=i}};function dr(e,t,n,r){var i,a,o,s;if(t<n){if(s=e.input.slice(t,n),r)for(i=0,a=s.length;i<a;i+=1)o=s.charCodeAt(i),o===9||32<=o&&o<=1114111||X(e,`expected valid JSON character`);else Hn.test(s)&&X(e,`the stream contains non-printable characters`);e.result+=s}}function fr(e,t,n,r){var i,a,o,s;for(K.isObject(n)||X(e,`cannot merge mappings; the provided source object is unacceptable`),i=Object.keys(n),o=0,s=i.length;o<s;o+=1)a=i[o],Pn.call(t,a)||(rr(t,a,n[a]),r[a]=!0)}function pr(e,t,n,r,i,a,o,s,c){var l,u;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),l=0,u=i.length;l<u;l+=1)Array.isArray(i[l])&&X(e,`nested arrays are not supported inside keys`),typeof i==`object`&&qn(i[l])===`[object Object]`&&(i[l]=`[object Object]`);if(typeof i==`object`&&qn(i)===`[object Object]`&&(i=`[object Object]`),i=String(i),t===null&&(t={}),r===`tag:yaml.org,2002:merge`)if(Array.isArray(a))for(l=0,u=a.length;l<u;l+=1)fr(e,t,a[l],n);else fr(e,t,a,n);else !e.json&&!Pn.call(n,i)&&Pn.call(t,i)&&(e.line=o||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,X(e,`duplicated mapping key`)),rr(t,i,a),delete n[i];return t}function mr(e){var t=e.input.charCodeAt(e.position);t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):X(e,`a line break is expected`),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function Z(e,t,n){for(var r=0,i=e.input.charCodeAt(e.position);i!==0;){for(;Yn(i);)i===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),i=e.input.charCodeAt(++e.position);if(t&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if(Jn(i))for(mr(e),i=e.input.charCodeAt(e.position),r++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return n!==-1&&r!==0&&e.lineIndent<n&&lr(e,`deficient indentation`),r}function hr(e){var t=e.position,n=e.input.charCodeAt(t);return!!((n===45||n===46)&&n===e.input.charCodeAt(t+1)&&n===e.input.charCodeAt(t+2)&&(t+=3,n=e.input.charCodeAt(t),n===0||Xn(n)))}function gr(e,t){t===1?e.result+=` `:t>1&&(e.result+=K.repeat(`
`,t-1))}function _r(e,t,n){var r,i,a,o,s,c,l,u,d=e.kind,f=e.result,p=e.input.charCodeAt(e.position);if(Xn(p)||Zn(p)||p===35||p===38||p===42||p===33||p===124||p===62||p===39||p===34||p===37||p===64||p===96||(p===63||p===45)&&(i=e.input.charCodeAt(e.position+1),Xn(i)||n&&Zn(i)))return!1;for(e.kind=`scalar`,e.result=``,a=o=e.position,s=!1;p!==0;){if(p===58){if(i=e.input.charCodeAt(e.position+1),Xn(i)||n&&Zn(i))break}else if(p===35){if(r=e.input.charCodeAt(e.position-1),Xn(r))break}else if(e.position===e.lineStart&&hr(e)||n&&Zn(p))break;else if(Jn(p))if(c=e.line,l=e.lineStart,u=e.lineIndent,Z(e,!1,-1),e.lineIndent>=t){s=!0,p=e.input.charCodeAt(e.position);continue}else{e.position=o,e.line=c,e.lineStart=l,e.lineIndent=u;break}s&&=(dr(e,a,o,!1),gr(e,e.line-c),a=o=e.position,!1),Yn(p)||(o=e.position+1),p=e.input.charCodeAt(++e.position)}return dr(e,a,o,!1),e.result?!0:(e.kind=d,e.result=f,!1)}function vr(e,t){var n=e.input.charCodeAt(e.position),r,i;if(n!==39)return!1;for(e.kind=`scalar`,e.result=``,e.position++,r=i=e.position;(n=e.input.charCodeAt(e.position))!==0;)if(n===39)if(dr(e,r,e.position,!0),n=e.input.charCodeAt(++e.position),n===39)r=e.position,e.position++,i=e.position;else return!0;else Jn(n)?(dr(e,r,i,!0),gr(e,Z(e,!1,t)),r=i=e.position):e.position===e.lineStart&&hr(e)?X(e,`unexpected end of the document within a single quoted scalar`):(e.position++,i=e.position);X(e,`unexpected end of the stream within a single quoted scalar`)}function yr(e,t){var n,r,i,a,o,s=e.input.charCodeAt(e.position);if(s!==34)return!1;for(e.kind=`scalar`,e.result=``,e.position++,n=r=e.position;(s=e.input.charCodeAt(e.position))!==0;)if(s===34)return dr(e,n,e.position,!0),e.position++,!0;else if(s===92){if(dr(e,n,e.position,!0),s=e.input.charCodeAt(++e.position),Jn(s))Z(e,!1,t);else if(s<256&&ir[s])e.result+=ar[s],e.position++;else if((o=$n(s))>0){for(i=o,a=0;i>0;i--)s=e.input.charCodeAt(++e.position),(o=Qn(s))>=0?a=(a<<4)+o:X(e,`expected hexadecimal character`);e.result+=nr(a),e.position++}else X(e,`unknown escape sequence`);n=r=e.position}else Jn(s)?(dr(e,n,r,!0),gr(e,Z(e,!1,t)),n=r=e.position):e.position===e.lineStart&&hr(e)?X(e,`unexpected end of the document within a double quoted scalar`):(e.position++,r=e.position);X(e,`unexpected end of the stream within a double quoted scalar`)}function br(e,t){var n=!0,r,i,a,o=e.tag,s,c=e.anchor,l,u,d,f,p,m=Object.create(null),h,g,_,v=e.input.charCodeAt(e.position);if(v===91)u=93,p=!1,s=[];else if(v===123)u=125,p=!0,s={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),v=e.input.charCodeAt(++e.position);v!==0;){if(Z(e,!0,t),v=e.input.charCodeAt(e.position),v===u)return e.position++,e.tag=o,e.anchor=c,e.kind=p?`mapping`:`sequence`,e.result=s,!0;n?v===44&&X(e,`expected the node content, but found ','`):X(e,`missed comma between flow collection entries`),g=h=_=null,d=f=!1,v===63&&(l=e.input.charCodeAt(e.position+1),Xn(l)&&(d=f=!0,e.position++,Z(e,!0,t))),r=e.line,i=e.lineStart,a=e.position,Dr(e,t,Fn,!1,!0),g=e.tag,h=e.result,Z(e,!0,t),v=e.input.charCodeAt(e.position),(f||e.line===r)&&v===58&&(d=!0,v=e.input.charCodeAt(++e.position),Z(e,!0,t),Dr(e,t,Fn,!1,!0),_=e.result),p?pr(e,s,m,g,h,_,r,i,a):d?s.push(pr(e,null,m,g,h,_,r,i,a)):s.push(h),Z(e,!0,t),v=e.input.charCodeAt(e.position),v===44?(n=!0,v=e.input.charCodeAt(++e.position)):n=!1}X(e,`unexpected end of the stream within a flow collection`)}function xr(e,t){var n,r,i=zn,a=!1,o=!1,s=t,c=0,l=!1,u,d=e.input.charCodeAt(e.position);if(d===124)r=!1;else if(d===62)r=!0;else return!1;for(e.kind=`scalar`,e.result=``;d!==0;)if(d=e.input.charCodeAt(++e.position),d===43||d===45)zn===i?i=d===43?Vn:Bn:X(e,`repeat of a chomping mode identifier`);else if((u=er(d))>=0)u===0?X(e,`bad explicit indentation width of a block scalar; it cannot be less than one`):o?X(e,`repeat of an indentation width identifier`):(s=t+u-1,o=!0);else break;if(Yn(d)){do d=e.input.charCodeAt(++e.position);while(Yn(d));if(d===35)do d=e.input.charCodeAt(++e.position);while(!Jn(d)&&d!==0)}for(;d!==0;){for(mr(e),e.lineIndent=0,d=e.input.charCodeAt(e.position);(!o||e.lineIndent<s)&&d===32;)e.lineIndent++,d=e.input.charCodeAt(++e.position);if(!o&&e.lineIndent>s&&(s=e.lineIndent),Jn(d)){c++;continue}if(e.lineIndent<s){i===Vn?e.result+=K.repeat(`
`,a?1+c:c):i===zn&&a&&(e.result+=`
`);break}for(r?Yn(d)?(l=!0,e.result+=K.repeat(`
`,a?1+c:c)):l?(l=!1,e.result+=K.repeat(`
`,c+1)):c===0?a&&(e.result+=` `):e.result+=K.repeat(`
`,c):e.result+=K.repeat(`
`,a?1+c:c),a=!0,o=!0,c=0,n=e.position;!Jn(d)&&d!==0;)d=e.input.charCodeAt(++e.position);dr(e,n,e.position,!1)}return!0}function Sr(e,t){var n,r=e.tag,i=e.anchor,a=[],o,s=!1,c;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=a),c=e.input.charCodeAt(e.position);c!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,X(e,`tab characters must not be used in indentation`)),!(c!==45||(o=e.input.charCodeAt(e.position+1),!Xn(o))));){if(s=!0,e.position++,Z(e,!0,-1)&&e.lineIndent<=t){a.push(null),c=e.input.charCodeAt(e.position);continue}if(n=e.line,Dr(e,t,Ln,!1,!0),a.push(e.result),Z(e,!0,-1),c=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&c!==0)X(e,`bad indentation of a sequence entry`);else if(e.lineIndent<t)break}return s?(e.tag=r,e.anchor=i,e.kind=`sequence`,e.result=a,!0):!1}function Cr(e,t,n){var r,i,a,o,s,c,l=e.tag,u=e.anchor,d={},f=Object.create(null),p=null,m=null,h=null,g=!1,_=!1,v;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=d),v=e.input.charCodeAt(e.position);v!==0;){if(!g&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,X(e,`tab characters must not be used in indentation`)),r=e.input.charCodeAt(e.position+1),a=e.line,(v===63||v===58)&&Xn(r))v===63?(g&&(pr(e,d,f,p,m,null,o,s,c),p=m=h=null),_=!0,g=!0,i=!0):g?(g=!1,i=!0):X(e,`incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line`),e.position+=1,v=r;else{if(o=e.line,s=e.lineStart,c=e.position,!Dr(e,n,In,!1,!0))break;if(e.line===a){for(v=e.input.charCodeAt(e.position);Yn(v);)v=e.input.charCodeAt(++e.position);if(v===58)v=e.input.charCodeAt(++e.position),Xn(v)||X(e,`a whitespace character is expected after the key-value separator within a block mapping`),g&&(pr(e,d,f,p,m,null,o,s,c),p=m=h=null),_=!0,g=!1,i=!1,p=e.tag,m=e.result;else if(_)X(e,`can not read an implicit mapping pair; a colon is missed`);else return e.tag=l,e.anchor=u,!0}else if(_)X(e,`can not read a block mapping entry; a multiline key may not be an implicit key`);else return e.tag=l,e.anchor=u,!0}if((e.line===a||e.lineIndent>t)&&(g&&(o=e.line,s=e.lineStart,c=e.position),Dr(e,t,Rn,!0,i)&&(g?m=e.result:h=e.result),g||(pr(e,d,f,p,m,h,o,s,c),p=m=h=null),Z(e,!0,-1),v=e.input.charCodeAt(e.position)),(e.line===a||e.lineIndent>t)&&v!==0)X(e,`bad indentation of a mapping entry`);else if(e.lineIndent<t)break}return g&&pr(e,d,f,p,m,null,o,s,c),_&&(e.tag=l,e.anchor=u,e.kind=`mapping`,e.result=d),_}function wr(e){var t,n=!1,r=!1,i,a,o=e.input.charCodeAt(e.position);if(o!==33)return!1;if(e.tag!==null&&X(e,`duplication of a tag property`),o=e.input.charCodeAt(++e.position),o===60?(n=!0,o=e.input.charCodeAt(++e.position)):o===33?(r=!0,i=`!!`,o=e.input.charCodeAt(++e.position)):i=`!`,t=e.position,n){do o=e.input.charCodeAt(++e.position);while(o!==0&&o!==62);e.position<e.length?(a=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):X(e,`unexpected end of the stream within a verbatim tag`)}else{for(;o!==0&&!Xn(o);)o===33&&(r?X(e,`tag suffix cannot contain exclamation marks`):(i=e.input.slice(t-1,e.position+1),Gn.test(i)||X(e,`named tag handle cannot contain such characters`),r=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);a=e.input.slice(t,e.position),Wn.test(a)&&X(e,`tag suffix cannot contain flow indicator characters`)}a&&!Kn.test(a)&&X(e,`tag name cannot contain such characters: `+a);try{a=decodeURIComponent(a)}catch{X(e,`tag name is malformed: `+a)}return n?e.tag=a:Pn.call(e.tagMap,i)?e.tag=e.tagMap[i]+a:i===`!`?e.tag=`!`+a:i===`!!`?e.tag=`tag:yaml.org,2002:`+a:X(e,`undeclared tag handle "`+i+`"`),!0}function Tr(e){var t,n=e.input.charCodeAt(e.position);if(n!==38)return!1;for(e.anchor!==null&&X(e,`duplication of an anchor property`),n=e.input.charCodeAt(++e.position),t=e.position;n!==0&&!Xn(n)&&!Zn(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&X(e,`name of an anchor node must contain at least one character`),e.anchor=e.input.slice(t,e.position),!0}function Er(e){var t,n,r=e.input.charCodeAt(e.position);if(r!==42)return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;r!==0&&!Xn(r)&&!Zn(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&X(e,`name of an alias node must contain at least one character`),n=e.input.slice(t,e.position),Pn.call(e.anchorMap,n)||X(e,`unidentified alias "`+n+`"`),e.result=e.anchorMap[n],Z(e,!0,-1),!0}function Dr(e,t,n,r,i){var a,o,s,c=1,l=!1,u=!1,d,f,p,m,h,g;if(e.listener!==null&&e.listener(`open`,e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=o=s=Rn===n||Ln===n,r&&Z(e,!0,-1)&&(l=!0,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)),c===1)for(;wr(e)||Tr(e);)Z(e,!0,-1)?(l=!0,s=a,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)):s=!1;if(s&&=l||i,(c===1||Rn===n)&&(h=Fn===n||In===n?t:t+1,g=e.position-e.lineStart,c===1?s&&(Sr(e,g)||Cr(e,g,h))||br(e,h)?u=!0:(o&&xr(e,h)||vr(e,h)||yr(e,h)?u=!0:Er(e)?(u=!0,(e.tag!==null||e.anchor!==null)&&X(e,`alias node should not have any properties`)):_r(e,h,Fn===n)&&(u=!0,e.tag===null&&(e.tag=`?`)),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):c===0&&(u=s&&Sr(e,g))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag===`?`){for(e.result!==null&&e.kind!==`scalar`&&X(e,`unacceptable node kind for !<?> tag; it should be "scalar", not "`+e.kind+`"`),d=0,f=e.implicitTypes.length;d<f;d+=1)if(m=e.implicitTypes[d],m.resolve(e.result)){e.result=m.construct(e.result),e.tag=m.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!==`!`){if(Pn.call(e.typeMap[e.kind||`fallback`],e.tag))m=e.typeMap[e.kind||`fallback`][e.tag];else for(m=null,p=e.typeMap.multi[e.kind||`fallback`],d=0,f=p.length;d<f;d+=1)if(e.tag.slice(0,p[d].tag.length)===p[d].tag){m=p[d];break}m||X(e,`unknown tag !<`+e.tag+`>`),e.result!==null&&m.kind!==e.kind&&X(e,`unacceptable node kind for !<`+e.tag+`> tag; it should be "`+m.kind+`", not "`+e.kind+`"`),m.resolve(e.result,e.tag)?(e.result=m.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):X(e,`cannot resolve a node with !<`+e.tag+`> explicit tag`)}return e.listener!==null&&e.listener(`close`,e),e.tag!==null||e.anchor!==null||u}function Or(e){var t=e.position,n,r,i,a=!1,o;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(o=e.input.charCodeAt(e.position))!==0&&(Z(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||o!==37));){for(a=!0,o=e.input.charCodeAt(++e.position),n=e.position;o!==0&&!Xn(o);)o=e.input.charCodeAt(++e.position);for(r=e.input.slice(n,e.position),i=[],r.length<1&&X(e,`directive name must not be less than one character in length`);o!==0;){for(;Yn(o);)o=e.input.charCodeAt(++e.position);if(o===35){do o=e.input.charCodeAt(++e.position);while(o!==0&&!Jn(o));break}if(Jn(o))break;for(n=e.position;o!==0&&!Xn(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(n,e.position))}o!==0&&mr(e),Pn.call(ur,r)?ur[r](e,r,i):lr(e,`unknown document directive "`+r+`"`)}if(Z(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,Z(e,!0,-1)):a&&X(e,`directives end mark is expected`),Dr(e,e.lineIndent-1,Rn,!1,!0),Z(e,!0,-1),e.checkLineBreaks&&Un.test(e.input.slice(t,e.position))&&lr(e,`non-ASCII line breaks are interpreted as content`),e.documents.push(e.result),e.position===e.lineStart&&hr(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,Z(e,!0,-1));return}if(e.position<e.length-1)X(e,`end of the stream or a document separator is expected`);else return}function kr(e,t){e=String(e),t||={},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var n=new sr(e,t),r=e.indexOf(`\0`);for(r!==-1&&(n.position=r,X(n,`null byte is not allowed in input`)),n.input+=`\0`;n.input.charCodeAt(n.position)===32;)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)Or(n);return n.documents}function Ar(e,t,n){typeof t==`object`&&t&&n===void 0&&(n=t,t=null);var r=kr(e,n);if(typeof t!=`function`)return r;for(var i=0,a=r.length;i<a;i+=1)t(r[i])}function jr(e,t){var n=kr(e,t);if(n.length!==0){if(n.length===1)return n[0];throw new q(`expected a single document in the stream, but found more`)}}var Mr={loadAll:Ar,load:jr},Nr=Object.prototype.toString,Pr=Object.prototype.hasOwnProperty,Fr=65279,Ir=9,Lr=10,Rr=13,zr=32,Br=33,Vr=34,Hr=35,Ur=37,Wr=38,Gr=39,Kr=42,qr=44,Jr=45,Yr=58,Xr=61,Zr=62,Qr=63,$r=64,ei=91,ti=93,ni=96,ri=123,ii=124,ai=125,oi={};oi[0]=`\\0`,oi[7]=`\\a`,oi[8]=`\\b`,oi[9]=`\\t`,oi[10]=`\\n`,oi[11]=`\\v`,oi[12]=`\\f`,oi[13]=`\\r`,oi[27]=`\\e`,oi[34]=`\\"`,oi[92]=`\\\\`,oi[133]=`\\N`,oi[160]=`\\_`,oi[8232]=`\\L`,oi[8233]=`\\P`;var si=[`y`,`Y`,`yes`,`Yes`,`YES`,`on`,`On`,`ON`,`n`,`N`,`no`,`No`,`NO`,`off`,`Off`,`OFF`],ci=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function li(e,t){var n,r,i,a,o,s,c;if(t===null)return{};for(n={},r=Object.keys(t),i=0,a=r.length;i<a;i+=1)o=r[i],s=String(t[o]),o.slice(0,2)===`!!`&&(o=`tag:yaml.org,2002:`+o.slice(2)),c=e.compiledTypeMap.fallback[o],c&&Pr.call(c.styleAliases,s)&&(s=c.styleAliases[s]),n[o]=s;return n}function ui(e){var t=e.toString(16).toUpperCase(),n,r;if(e<=255)n=`x`,r=2;else if(e<=65535)n=`u`,r=4;else if(e<=4294967295)n=`U`,r=8;else throw new q(`code point within a string may not be greater than 0xFFFFFFFF`);return`\\`+n+K.repeat(`0`,r-t.length)+t}var di=1,fi=2;function pi(e){this.schema=e.schema||Nn,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=K.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=li(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType=e.quotingType===`"`?fi:di,this.forceQuotes=e.forceQuotes||!1,this.replacer=typeof e.replacer==`function`?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result=``,this.duplicates=[],this.usedDuplicates=null}function mi(e,t){for(var n=K.repeat(` `,t),r=0,i=-1,a=``,o,s=e.length;r<s;)i=e.indexOf(`
`,r),i===-1?(o=e.slice(r),r=s):(o=e.slice(r,i+1),r=i+1),o.length&&o!==`
`&&(a+=n),a+=o;return a}function hi(e,t){return`
`+K.repeat(` `,e.indent*t)}function gi(e,t){var n,r,i;for(n=0,r=e.implicitTypes.length;n<r;n+=1)if(i=e.implicitTypes[n],i.resolve(t))return!0;return!1}function _i(e){return e===zr||e===Ir}function vi(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==Fr||65536<=e&&e<=1114111}function yi(e){return vi(e)&&e!==Fr&&e!==Rr&&e!==Lr}function bi(e,t,n){var r=yi(e),i=r&&!_i(e);return(n?r:r&&e!==qr&&e!==ei&&e!==ti&&e!==ri&&e!==ai)&&e!==Hr&&!(t===Yr&&!i)||yi(t)&&!_i(t)&&e===Hr||t===Yr&&i}function xi(e){return vi(e)&&e!==Fr&&!_i(e)&&e!==Jr&&e!==Qr&&e!==Yr&&e!==qr&&e!==ei&&e!==ti&&e!==ri&&e!==ai&&e!==Hr&&e!==Wr&&e!==Kr&&e!==Br&&e!==ii&&e!==Xr&&e!==Zr&&e!==Gr&&e!==Vr&&e!==Ur&&e!==$r&&e!==ni}function Si(e){return!_i(e)&&e!==Yr}function Ci(e,t){var n=e.charCodeAt(t),r;return n>=55296&&n<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1),r>=56320&&r<=57343)?(n-55296)*1024+r-56320+65536:n}function wi(e){return/^\n* /.test(e)}var Ti=1,Ei=2,Di=3,Oi=4,ki=5;function Ai(e,t,n,r,i,a,o,s){var c,l=0,u=null,d=!1,f=!1,p=r!==-1,m=-1,h=xi(Ci(e,0))&&Si(Ci(e,e.length-1));if(t||o)for(c=0;c<e.length;l>=65536?c+=2:c++){if(l=Ci(e,c),!vi(l))return ki;h&&=bi(l,u,s),u=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(l=Ci(e,c),l===Lr)d=!0,p&&(f||=c-m-1>r&&e[m+1]!==` `,m=c);else if(!vi(l))return ki;h&&=bi(l,u,s),u=l}f||=p&&c-m-1>r&&e[m+1]!==` `}return!d&&!f?h&&!o&&!i(e)?Ti:a===fi?ki:Ei:n>9&&wi(e)?ki:o?a===fi?ki:Ei:f?Oi:Di}function ji(e,t,n,r,i){e.dump=function(){if(t.length===0)return e.quotingType===fi?`""`:`''`;if(!e.noCompatMode&&(si.indexOf(t)!==-1||ci.test(t)))return e.quotingType===fi?`"`+t+`"`:`'`+t+`'`;var a=e.indent*Math.max(1,n),o=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),s=r||e.flowLevel>-1&&n>=e.flowLevel;function c(t){return gi(e,t)}switch(Ai(t,s,e.indent,o,c,e.quotingType,e.forceQuotes&&!r,i)){case Ti:return t;case Ei:return`'`+t.replace(/'/g,`''`)+`'`;case Di:return`|`+Mi(t,e.indent)+Ni(mi(t,a));case Oi:return`>`+Mi(t,e.indent)+Ni(mi(Pi(t,o),a));case ki:return`"`+Ii(t)+`"`;default:throw new q(`impossible error: invalid scalar style`)}}()}function Mi(e,t){var n=wi(e)?String(t):``,r=e[e.length-1]===`
`;return n+(r&&(e[e.length-2]===`
`||e===`
`)?`+`:r?``:`-`)+`
`}function Ni(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Pi(e,t){for(var n=/(\n+)([^\n]*)/g,r=function(){var r=e.indexOf(`
`);return r=r===-1?e.length:r,n.lastIndex=r,Fi(e.slice(0,r),t)}(),i=e[0]===`
`||e[0]===` `,a,o;o=n.exec(e);){var s=o[1],c=o[2];a=c[0]===` `,r+=s+(!i&&!a&&c!==``?`
`:``)+Fi(c,t),i=a}return r}function Fi(e,t){if(e===``||e[0]===` `)return e;for(var n=/ [^ ]/g,r,i=0,a,o=0,s=0,c=``;r=n.exec(e);)s=r.index,s-i>t&&(a=o>i?o:s,c+=`
`+e.slice(i,a),i=a+1),o=s;return c+=`
`,e.length-i>t&&o>i?c+=e.slice(i,o)+`
`+e.slice(o+1):c+=e.slice(i),c.slice(1)}function Ii(e){for(var t=``,n=0,r,i=0;i<e.length;n>=65536?i+=2:i++)n=Ci(e,i),r=oi[n],!r&&vi(n)?(t+=e[i],n>=65536&&(t+=e[i+1])):t+=r||ui(n);return t}function Li(e,t,n){var r=``,i=e.tag,a,o,s;for(a=0,o=n.length;a<o;a+=1)s=n[a],e.replacer&&(s=e.replacer.call(n,String(a),s)),(Hi(e,t,s,!1,!1)||s===void 0&&Hi(e,t,null,!1,!1))&&(r!==``&&(r+=`,`+(e.condenseFlow?``:` `)),r+=e.dump);e.tag=i,e.dump=`[`+r+`]`}function Ri(e,t,n,r){var i=``,a=e.tag,o,s,c;for(o=0,s=n.length;o<s;o+=1)c=n[o],e.replacer&&(c=e.replacer.call(n,String(o),c)),(Hi(e,t+1,c,!0,!0,!1,!0)||c===void 0&&Hi(e,t+1,null,!0,!0,!1,!0))&&((!r||i!==``)&&(i+=hi(e,t)),e.dump&&Lr===e.dump.charCodeAt(0)?i+=`-`:i+=`- `,i+=e.dump);e.tag=a,e.dump=i||`[]`}function zi(e,t,n){var r=``,i=e.tag,a=Object.keys(n),o,s,c,l,u;for(o=0,s=a.length;o<s;o+=1)u=``,r!==``&&(u+=`, `),e.condenseFlow&&(u+=`"`),c=a[o],l=n[c],e.replacer&&(l=e.replacer.call(n,c,l)),Hi(e,t,c,!1,!1)&&(e.dump.length>1024&&(u+=`? `),u+=e.dump+(e.condenseFlow?`"`:``)+`:`+(e.condenseFlow?``:` `),Hi(e,t,l,!1,!1)&&(u+=e.dump,r+=u));e.tag=i,e.dump=`{`+r+`}`}function Bi(e,t,n,r){var i=``,a=e.tag,o=Object.keys(n),s,c,l,u,d,f;if(e.sortKeys===!0)o.sort();else if(typeof e.sortKeys==`function`)o.sort(e.sortKeys);else if(e.sortKeys)throw new q(`sortKeys must be a boolean or a function`);for(s=0,c=o.length;s<c;s+=1)f=``,(!r||i!==``)&&(f+=hi(e,t)),l=o[s],u=n[l],e.replacer&&(u=e.replacer.call(n,l,u)),Hi(e,t+1,l,!0,!0,!0)&&(d=e.tag!==null&&e.tag!==`?`||e.dump&&e.dump.length>1024,d&&(e.dump&&Lr===e.dump.charCodeAt(0)?f+=`?`:f+=`? `),f+=e.dump,d&&(f+=hi(e,t)),Hi(e,t+1,u,!0,d)&&(e.dump&&Lr===e.dump.charCodeAt(0)?f+=`:`:f+=`: `,f+=e.dump,i+=f));e.tag=a,e.dump=i||`{}`}function Vi(e,t,n){var r,i=n?e.explicitTypes:e.implicitTypes,a,o,s,c;for(a=0,o=i.length;a<o;a+=1)if(s=i[a],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof t==`object`&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(n?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag=`?`,s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,Nr.call(s.represent)===`[object Function]`)r=s.represent(t,c);else if(Pr.call(s.represent,c))r=s.represent[c](t,c);else throw new q(`!<`+s.tag+`> tag resolver accepts not "`+c+`" style`);e.dump=r}return!0}return!1}function Hi(e,t,n,r,i,a,o){e.tag=null,e.dump=n,Vi(e,n,!1)||Vi(e,n,!0);var s=Nr.call(e.dump),c=r,l;r&&=e.flowLevel<0||e.flowLevel>t;var u=s===`[object Object]`||s===`[object Array]`,d,f;if(u&&(d=e.duplicates.indexOf(n),f=d!==-1),(e.tag!==null&&e.tag!==`?`||f||e.indent!==2&&t>0)&&(i=!1),f&&e.usedDuplicates[d])e.dump=`*ref_`+d;else{if(u&&f&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),s===`[object Object]`)r&&Object.keys(e.dump).length!==0?(Bi(e,t,e.dump,i),f&&(e.dump=`&ref_`+d+e.dump)):(zi(e,t,e.dump),f&&(e.dump=`&ref_`+d+` `+e.dump));else if(s===`[object Array]`)r&&e.dump.length!==0?(e.noArrayIndent&&!o&&t>0?Ri(e,t-1,e.dump,i):Ri(e,t,e.dump,i),f&&(e.dump=`&ref_`+d+e.dump)):(Li(e,t,e.dump),f&&(e.dump=`&ref_`+d+` `+e.dump));else if(s===`[object String]`)e.tag!==`?`&&ji(e,e.dump,t,a,c);else if(s===`[object Undefined]`)return!1;else{if(e.skipInvalid)return!1;throw new q(`unacceptable kind of an object to dump `+s)}e.tag!==null&&e.tag!==`?`&&(l=encodeURI(e.tag[0]===`!`?e.tag.slice(1):e.tag).replace(/!/g,`%21`),l=e.tag[0]===`!`?`!`+l:l.slice(0,18)===`tag:yaml.org,2002:`?`!!`+l.slice(18):`!<`+l+`>`,e.dump=l+` `+e.dump)}return!0}function Ui(e,t){var n=[],r=[],i,a;for(Wi(e,n,r),i=0,a=r.length;i<a;i+=1)t.duplicates.push(n[r[i]]);t.usedDuplicates=Array(a)}function Wi(e,t,n){var r,i,a;if(typeof e==`object`&&e)if(i=t.indexOf(e),i!==-1)n.indexOf(i)===-1&&n.push(i);else if(t.push(e),Array.isArray(e))for(i=0,a=e.length;i<a;i+=1)Wi(e[i],t,n);else for(r=Object.keys(e),i=0,a=r.length;i<a;i+=1)Wi(e[r[i]],t,n)}function Gi(e,t){t||={};var n=new pi(t);n.noRefs||Ui(e,n);var r=e;return n.replacer&&(r=n.replacer.call({"":r},``,r)),Hi(n,0,r,!0,!0)?n.dump+`
`:``}var Ki={dump:Gi};function qi(e,t){return function(){throw Error(`Function yaml.`+e+` is removed in js-yaml 4. Use yaml.`+t+` instead, which is now safe by default.`)}}var Ji={Type:J,Schema:jt,FAILSAFE_SCHEMA:Ft,JSON_SCHEMA:an,CORE_SCHEMA:on,DEFAULT_SCHEMA:Nn,load:Mr.load,loadAll:Mr.loadAll,dump:Ki.dump,YAMLException:q,types:{binary:yn,float:rn,map:Pt,null:zt,pairs:On,set:Mn,timestamp:dn,bool:Ut,int:Xt,merge:pn,omap:wn,seq:Nt,str:Mt},safeLoad:qi(`safeLoad`,`load`),safeLoadAll:qi(`safeLoadAll`,`loadAll`),safeDump:qi(`safeDump`,`dump`)},Yi=c(o(((e,t)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,r={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/\u00a0/g,` `)},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,`__id`,{value:++n}),e.__id},clone:function e(t,n){n||={};var r,a;switch(i.util.type(t)){case`Object`:if(a=i.util.objId(t),n[a])return n[a];for(var o in r={},n[a]=r,t)t.hasOwnProperty(o)&&(r[o]=e(t[o],n));return r;case`Array`:return a=i.util.objId(t),n[a]?n[a]:(r=[],n[a]=r,t.forEach(function(t,i){r[i]=e(t,n)}),r);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return`none`},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,`gi`),``),e.classList.add(`language-`+n)},currentScript:function(){if(typeof document>`u`)return null;if(document.currentScript&&document.currentScript.tagName===`SCRIPT`)return document.currentScript;try{throw Error()}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var t=document.getElementsByTagName(`script`);for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var r=`no-`+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(r))return!1;e=e.parentElement}return!!n}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,t){var n=i.util.clone(i.languages[e]);for(var r in t)n[r]=t[r];return n},insertBefore:function(e,t,n,r){r||=i.languages;var a=r[e],o={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var c in n)n.hasOwnProperty(c)&&(o[c]=n[c]);n.hasOwnProperty(s)||(o[s]=a[s])}var l=r[e];return r[e]=o,i.languages.DFS(i.languages,function(t,n){n===l&&t!=e&&(this[t]=o)}),o},DFS:function e(t,n,r,a){a||={};var o=i.util.objId;for(var s in t)if(t.hasOwnProperty(s)){n.call(t,s,t[s],r||s);var c=t[s],l=i.util.type(c);l===`Object`&&!a[o(c)]?(a[o(c)]=!0,e(c,n,null,a)):l===`Array`&&!a[o(c)]&&(a[o(c)]=!0,e(c,n,s,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var r={callback:n,container:e,selector:`code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code`};i.hooks.run(`before-highlightall`,r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),i.hooks.run(`before-all-elements-highlight`,r);for(var a=0,o;o=r.elements[a++];)i.highlightElement(o,t===!0,r.callback)},highlightElement:function(t,n,r){var a=i.util.getLanguage(t),o=i.languages[a];i.util.setLanguage(t,a);var s=t.parentElement;s&&s.nodeName.toLowerCase()===`pre`&&i.util.setLanguage(s,a);var c={element:t,language:a,grammar:o,code:t.textContent};function l(e){c.highlightedCode=e,i.hooks.run(`before-insert`,c),c.element.innerHTML=c.highlightedCode,i.hooks.run(`after-highlight`,c),i.hooks.run(`complete`,c),r&&r.call(c.element)}if(i.hooks.run(`before-sanity-check`,c),s=c.element.parentElement,s&&s.nodeName.toLowerCase()===`pre`&&!s.hasAttribute(`tabindex`)&&s.setAttribute(`tabindex`,`0`),!c.code){i.hooks.run(`complete`,c),r&&r.call(c.element);return}if(i.hooks.run(`before-highlight`,c),!c.grammar){l(i.util.encode(c.code));return}if(n&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){l(e.data)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else l(i.highlight(c.code,c.grammar,c.language))},highlight:function(e,t,n){var r={code:e,grammar:t,language:n};if(i.hooks.run(`before-tokenize`,r),!r.grammar)throw Error(`The language "`+r.language+`" has no grammar.`);return r.tokens=i.tokenize(r.code,r.grammar),i.hooks.run(`after-tokenize`,r),a.stringify(i.util.encode(r.tokens),r.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var r in n)t[r]=n[r];delete t.rest}var i=new c;return l(i,i.head,e),s(e,i,t,i.head,0),d(i)},hooks:{all:{},add:function(e,t){var n=i.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=i.hooks.all[e];if(!(!n||!n.length))for(var r=0,a;a=n[r++];)a(t)}},Token:a};e.Prism=i;function a(e,t,n,r){this.type=e,this.content=t,this.alias=n,this.length=(r||``).length|0}a.stringify=function e(t,n){if(typeof t==`string`)return t;if(Array.isArray(t)){var r=``;return t.forEach(function(t){r+=e(t,n)}),r}var a={type:t.type,content:e(t.content,n),tag:`span`,classes:[`token`,t.type],attributes:{},language:n},o=t.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(a.classes,o):a.classes.push(o)),i.hooks.run(`wrap`,a);var s=``;for(var c in a.attributes)s+=` `+c+`="`+(a.attributes[c]||``).replace(/"/g,`&quot;`)+`"`;return`<`+a.tag+` class="`+a.classes.join(` `)+`"`+s+`>`+a.content+`</`+a.tag+`>`};function o(e,t,n,r){e.lastIndex=t;var i=e.exec(n);if(i&&r&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function s(e,t,n,r,c,d){for(var f in n)if(!(!n.hasOwnProperty(f)||!n[f])){var p=n[f];p=Array.isArray(p)?p:[p];for(var m=0;m<p.length;++m){if(d&&d.cause==f+`,`+m)return;var h=p[m],g=h.inside,_=!!h.lookbehind,v=!!h.greedy,y=h.alias;if(v&&!h.pattern.global){var ee=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,ee+`g`)}for(var te=h.pattern||h,b=r.next,x=c;b!==t.tail&&!(d&&x>=d.reach);x+=b.value.length,b=b.next){var ne=b.value;if(t.length>e.length)return;if(!(ne instanceof a)){var re=1,S;if(v){if(S=o(te,x,e,_),!S||S.index>=e.length)break;var C=S.index,ie=S.index+S[0].length,w=x;for(w+=b.value.length;C>=w;)b=b.next,w+=b.value.length;if(w-=b.value.length,x=w,b.value instanceof a)continue;for(var T=b;T!==t.tail&&(w<ie||typeof T.value==`string`);T=T.next)re++,w+=T.value.length;re--,ne=e.slice(x,w),S.index-=x}else if(S=o(te,0,ne,_),!S)continue;var C=S.index,E=S[0],D=ne.slice(0,C),ae=ne.slice(C+E.length),oe=x+ne.length;d&&oe>d.reach&&(d.reach=oe);var O=b.prev;D&&(O=l(t,O,D),x+=D.length),u(t,O,re);var se=new a(f,g?i.tokenize(E,g):E,y,E);if(b=l(t,O,se),ae&&l(t,b,ae),re>1){var ce={cause:f+`,`+m,reach:oe};s(e,t,n,b.prev,x,ce),d&&ce.reach>d.reach&&(d.reach=ce.reach)}}}}}}function c(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function l(e,t,n){var r=t.next,i={value:n,prev:t,next:r};return t.next=i,r.prev=i,e.length++,i}function u(e,t,n){for(var r=t.next,i=0;i<n&&r!==e.tail;i++)r=r.next;t.next=r,r.prev=t,e.length-=i}function d(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}if(!e.document)return e.addEventListener&&(i.disableWorkerMessageHandler||e.addEventListener(`message`,function(t){var n=JSON.parse(t.data),r=n.language,a=n.code,o=n.immediateClose;e.postMessage(i.highlight(a,i.languages[r],r)),o&&e.close()},!1)),i;var f=i.util.currentScript();f&&(i.filename=f.src,f.hasAttribute(`data-manual`)&&(i.manual=!0));function p(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m===`loading`||m===`interactive`&&f&&f.defer?document.addEventListener(`DOMContentLoaded`,p):window.requestAnimationFrame?window.requestAnimationFrame(p):window.setTimeout(p,16)}return i}(typeof window<`u`?window:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?self:{});t!==void 0&&t.exports&&(t.exports=n),typeof global<`u`&&(global.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside[`attr-value`].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside[`internal-subset`].inside=n.languages.markup,n.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(n.languages.markup.tag,`addInlined`,{value:function(e,t){var r={};r[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i[`language-`+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:i},n.languages.insertBefore(`markup`,`cdata`,a)}}),Object.defineProperty(n.languages.markup.tag,`addAttribute`,{value:function(e,t){n.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend(`markup`,{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend(`clike`,{"class-name":[n.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),n.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),n.languages.markup&&(n.languages.markup.tag.addInlined(`script`,`javascript`),n.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),n.languages.js=n.languages.javascript,(function(){if(n===void 0||typeof document>`u`)return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e=`Loading…`,t=function(e,t){return`✖ Error `+e+` while fetching file: `+t},r=`✖ Error: File does not exist or is empty`,i={js:`javascript`,py:`python`,rb:`ruby`,ps1:`powershell`,psm1:`powershell`,sh:`bash`,bat:`batch`,h:`c`,tex:`latex`},a=`data-src-status`,o=`loading`,s=`loaded`,c=`failed`,l=`pre[data-src]:not([`+a+`="`+s+`"]):not([`+a+`="`+o+`"])`;function u(e,n,i){var a=new XMLHttpRequest;a.open(`GET`,e,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?n(a.responseText):a.status>=400?i(t(a.status,a.statusText)):i(r))},a.send(null)}function d(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||``);if(t){var n=Number(t[1]),r=t[2],i=t[3];return r?i?[n,Number(i)]:[n,void 0]:[n,n]}}n.hooks.add(`before-highlightall`,function(e){e.selector+=`, `+l}),n.hooks.add(`before-sanity-check`,function(t){var r=t.element;if(r.matches(l)){t.code=``,r.setAttribute(a,o);var f=r.appendChild(document.createElement(`CODE`));f.textContent=e;var p=r.getAttribute(`data-src`),m=t.language;if(m===`none`){var h=(/\.(\w+)$/.exec(p)||[,`none`])[1];m=i[h]||h}n.util.setLanguage(f,m),n.util.setLanguage(r,m);var g=n.plugins.autoloader;g&&g.loadLanguages(m),u(p,function(e){r.setAttribute(a,s);var t=d(r.getAttribute(`data-range`));if(t){var i=e.split(/\r\n?|\n/g),o=t[0],c=t[1]==null?i.length:t[1];o<0&&(o+=i.length),o=Math.max(0,Math.min(o-1,i.length)),c<0&&(c+=i.length),c=Math.max(0,Math.min(c,i.length)),e=i.slice(o,c).join(`
`),r.hasAttribute(`data-start`)||r.setAttribute(`data-start`,String(o+1))}f.textContent=e,n.highlightElement(f)},function(e){r.setAttribute(a,c),f.textContent=e})}}),n.plugins.fileHighlight={highlight:function(e){for(var t=(e||document).querySelectorAll(l),r=0,i;i=t[r++];)n.highlightElement(i)}};var f=!1;n.fileHighlight=function(){f||=(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()}))(),1);(function(e){var t=/[*&][^\s[\]{},]+/,n=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r=`(?:`+n.source+`(?:[ 	]+`+t.source+`)?|`+t.source+`(?:[ 	]+`+n.source+`)?)`,i=`(?:[^\\s\\x00-\\x08\\x0e-\\x1f!"#%&'*,\\-:>?@[\\]\`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \\t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*`.replace(/<PLAIN>/g,function(){return`[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]`}),a=`"(?:[^"\\\\\\r\\n]|\\\\.)*"|'(?:[^'\\\\\\r\\n]|\\\\.)*'`;function o(e,t){t=(t||``).replace(/m/g,``)+`m`;var n=`([:\\-,[{]\\s*(?:\\s<<prop>>[ \\t]+)?)(?:<<value>>)(?=[ \\t]*(?:$|,|\\]|\\}|(?:[\\r\\n]\\s*)?#))`.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return e});return RegExp(n,t)}e.languages.yaml={scalar:{pattern:RegExp(`([\\-:]\\s*(?:\\s<<prop>>[ \\t]+)?[|>])[ \\t]*(?:((?:\\r?\\n|\\r)[ \\t]+)\\S[^\\r\\n]*(?:\\2[^\\r\\n]+)*)`.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:`string`},comment:/#.*/,key:{pattern:RegExp(`((?:^|[:\\-,[{\\r\\n?])[ \\t]*(?:<<prop>>[ \\t]+)?)<<key>>(?=\\s*:\\s)`.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return`(?:`+i+`|`+a+`)`})),lookbehind:!0,greedy:!0,alias:`atrule`},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:`important`},datetime:{pattern:o(`\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \\t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \\t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?`),lookbehind:!0,alias:`number`},boolean:{pattern:o(`false|true`,`i`),lookbehind:!0,alias:`important`},null:{pattern:o(`null|~`,`i`),lookbehind:!0,alias:`important`},string:{pattern:o(a),lookbehind:!0,greedy:!0},number:{pattern:o(`[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)`,`i`),lookbehind:!0},tag:n,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism);var Xi,Zi,Qi=class extends N{constructor(...e){super(...e),this.data=null,this.schemaName=`Object`,this._yamlText=``,this._errorMessage=``}static{this.styles=[z,h`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
      }
      :host([hidden]) {
        display: none !important;
      }
      .editor-container {
        flex: 1;
        position: relative;
        overflow: hidden;
        background: #1e1e1e;
      }
      .editor-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 24px;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
        tab-size: 2;
        margin: 0;
        border: none;
        overflow: auto;
      }
      textarea {
        background: transparent;
        color: transparent;
        caret-color: #03a9f4;
        z-index: 2;
        resize: none;
        outline: none;
        -webkit-text-fill-color: transparent;
      }
      pre {
        z-index: 1;
        pointer-events: none;
        background: transparent;
        color: #d4d4d4;
      }
      code {
        font-family: inherit;
      }
      .status-bar {
        padding: 6px 16px;
        font-size: 11px;
        background: #252526;
        border-top: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
      }
      .status-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .error {
        color: var(--danger-colour);
      }
      .success {
        color: #4caf50;
      }

      /* Prism YAML Theme Overrides (Dark+) */
      .token.comment { color: #6a9955; }
      .token.atrule { color: #c586c0; }
      .token.attr-name { color: #9cdcfe; }
      .token.string { color: #ce9178; }
      .token.boolean, .token.number { color: #b5cea8; }
      .token.key { color: #9cdcfe; }
      .token.keyword { color: #569cd6; }
      .token.punctuation { color: #d4d4d4; }
      .token.important { color: #569cd6; font-weight: bold; }
    `]}willUpdate(e){if(e.has(`data`)&&this.data){let e=this._getCleanData(this.data),t=this._dumpYaml(e);(this._yamlText===``||!this._isYamlEqual(this._yamlText,t))&&(this._yamlText=t)}}updated(e){super.updated(e)}_getCleanData(e){let t=JSON.parse(JSON.stringify(e)),n=e=>{if(!(!e||typeof e!=`object`)){if(Array.isArray(e)){e.forEach(n);return}Object.keys(e).forEach(t=>{t.startsWith(`_`)||t===`invalid`||t===`grid_snap_mm`?delete e[t]:n(e[t])})}};return n(t),t}_dumpYaml(e){return Ji.dump(e,{indent:2,noRefs:!0,sortKeys:!1,lineWidth:-1})}_isYamlEqual(e,t){if(e===t)return!0;try{let n=Ji.load(e),r=Ji.load(t);return this._isDeepEqual(n,r)}catch{return!1}}_isDeepEqual(e,t){if(e===t)return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;let n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(let r of n)if(!Object.prototype.hasOwnProperty.call(t,r)||!this._isDeepEqual(e[r],t[r]))return!1;return!0}_handleInput(e){let t=e.target.value;this._yamlText=t,this._validateAndSync(t)}_validateAndSync(e){try{let t=Ji.load(e);t&&typeof t==`object`?(this._errorMessage=``,this.dispatchEvent(new CustomEvent(`data-update`,{detail:t,bubbles:!0,composed:!0}))):this._errorMessage=`Invalid YAML structure`}catch(e){this._errorMessage=e.reason||e.message}}_handleScroll(){this._highlightLayer.scrollTop=this._textarea.scrollTop,this._highlightLayer.scrollLeft=this._textarea.scrollLeft}render(){let e=Yi.default.highlight(this._yamlText,Yi.default.languages.yaml,`yaml`);return A`
      <div class="editor-container">
        <textarea
          class="editor-layer"
          .value="${this._yamlText}"
          @input="${this._handleInput}"
          @scroll="${this._handleScroll}"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        ></textarea>
        <pre class="editor-layer" aria-hidden="true"><code class="language-yaml">${dt(e)}</code></pre>
      </div>
      <div class="status-bar">
        <div class="status-item ${this._errorMessage?`error`:`success`}">
          <span class="material-icons" style="font-size: 14px;">
            ${this._errorMessage?`error_outline`:`check_circle_outline`}
          </span>
          ${this._errorMessage||`Valid YAML`}
        </div>
        <div class="status-item">
          <span>Schema: ${this.schemaName}</span>
        </div>
      </div>
    `}};V([F({type:Object}),B(`design:type`,Object)],Qi.prototype,`data`,void 0),V([F({type:String}),B(`design:type`,Object)],Qi.prototype,`schemaName`,void 0),V([I(),B(`design:type`,Object)],Qi.prototype,`_yamlText`,void 0),V([I(),B(`design:type`,Object)],Qi.prototype,`_errorMessage`,void 0),V([L(`textarea`),B(`design:type`,typeof(Xi=typeof HTMLTextAreaElement<`u`&&HTMLTextAreaElement)==`function`?Xi:Object)],Qi.prototype,`_textarea`,void 0),V([L(`pre`),B(`design:type`,typeof(Zi=typeof HTMLPreElement<`u`&&HTMLPreElement)==`function`?Zi:Object)],Qi.prototype,`_highlightLayer`,void 0),Qi=V([P(`yaml-editor`)],Qi);var $i=class extends N{static{this.styles=h`
    :host {
      display: flex;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .left-bar {
      width: 320px;
      flex-shrink: 0;
      background: white;
      border-right: 1px solid var(--border-colour);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .right-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background: #f0f2f5;
    }
    .right-top-bar {
      height: 60px;
      flex-shrink: 0;
      background: white;
      border-bottom: 1px solid var(--border-colour);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      z-index: 5;
    }
    .right-main {
      flex: 1;
      overflow: auto;
      position: relative;
    }
  `}render(){return A`
      <div class="left-bar">
        <slot name="left-bar"></slot>
      </div>
      <div class="right-content">
        <div class="right-top-bar">
          <slot name="right-top-bar"></slot>
        </div>
        <div class="right-main">
          <slot name="right-main"></slot>
        </div>
      </div>
    `}};$i=V([P(`section-layout`)],$i);var Q=Ye(class extends Xe{constructor(e){if(super(e),e.type!==Je.PROPERTY&&e.type!==Je.ATTRIBUTE&&e.type!==Je.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Qe(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===j||t===M)return t;let n=e.element,r=e.name;if(e.type===Je.PROPERTY){if(t===n[r])return j}else if(e.type===Je.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(r))return j}else if(e.type===Je.ATTRIBUTE&&n.getAttribute(r)===t+``)return j;return rt(e),t}}),ea=class extends N{constructor(...e){super(...e),this.title=``}static{this.styles=[z,h`
      :host {
        display: block;
      }
      dialog {
        border: none;
        border-radius: 12px;
        padding: 0;
        box-shadow: var(--shadow-large);
        width: var(--dialog-width, 450px);
        max-width: 95vw;
        background: #fff;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
      }
      .dialog-container {
        padding: 0;
        display: flex;
        flex-direction: column;
      }
      header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      header h2 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .dialog-body {
        padding: 1.5rem;
        max-height: 70vh;
        overflow-y: auto;
      }
      footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        background: #fff;
      }
    `]}show(){this.renderRoot.querySelector(`dialog`).showModal()}close(){this.renderRoot.querySelector(`dialog`).close()}render(){return A`
      <dialog>
        <div class="dialog-container">
          <header>
            <h2>${this.title}</h2>
          </header>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <footer>
            <slot name="footer"></slot>
          </footer>
        </div>
      </dialog>
    `}};V([F({type:String}),B(`design:type`,Object)],ea.prototype,`title`,void 0),ea=V([P(`base-dialog`)],ea);var ta=class extends N{constructor(...e){super(...e),this.value=5,this._steps=[1,5,10,20]}static{this.styles=[z,h`
      :host {
        display: block;
        padding: 10px 0;
      }

      .slider-container {
        position: relative;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .slider-track {
        position: absolute;
        width: 100%;
        height: 6px;
        background: #e1e4e8;
        border-radius: 3px;
        z-index: 1;
      }

      .active-track {
        position: absolute;
        height: 6px;
        background: var(--primary-colour);
        border-radius: 3px;
        z-index: 2;
        transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      input[type="range"] {
        position: absolute;
        width: 100%;
        appearance: none;
        background: none;
        height: 24px;
        margin: 0;
        z-index: 3;
        cursor: pointer;
        padding: 0;
      }

      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--primary-colour);
        box-shadow: var(--shadow-small);
        transition: transform 0.1s;
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }

      input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--primary-colour);
        box-shadow: var(--shadow-small);
      }

      .labels {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        padding: 0 4px;
      }

      .label-item {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.2s;
        flex: 1;
        text-align: center;
      }

      .label-item:first-child { text-align: left; }
      .label-item:last-child { text-align: right; }

      .label-item.active {
        color: var(--primary-colour);
      }

      .ticks {
        position: absolute;
        top: 21px; /* Center with track */
        width: calc(100% - 22px);
        left: 11px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        z-index: 1;
      }

      .tick {
        width: 2px;
        height: 6px;
        background: #ccc;
      }
    `]}_onInput(e){let t=parseInt(e.target.value);this.value=this._steps[t],this._dispatchChange()}_dispatchChange(){this.dispatchEvent(new CustomEvent(`change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}_setStep(e){this.value=this._steps[e],this._dispatchChange()}render(){let e=this._steps.indexOf(this.value);return A`
      <div class="slider-container">
        <div class="slider-track"></div>
        <div class="active-track" style="width: ${e/(this._steps.length-1)*100}%"></div>
        <div class="ticks">
          ${this._steps.map(()=>A`<div class="tick"></div>`)}
        </div>
        <input 
          type="range" 
          min="0" 
          max="3" 
          step="1" 
          .value="${e.toString()}"
          @input="${this._onInput}"
        >
      </div>
      <div class="labels">
        ${this._steps.map((e,t)=>A`
          <span 
            class="label-item ${this.value===e?`active`:``}"
            @click="${()=>this._setStep(t)}"
          >
            ${e}mm
          </span>
        `)}
      </div>
    `}};V([F({type:Number}),B(`design:type`,Object)],ta.prototype,`value`,void 0),ta=V([P(`grid-snap-slider`)],ta);var na=class extends N{constructor(...e){super(...e),this.settings=null}static{this.styles=[z,h`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `]}async show(e){this.settings=JSON.parse(JSON.stringify(e)),await this.updateComplete,(this.shadowRoot?.querySelector(`base-dialog`)).show()}_handleSubmit(e){e.preventDefault(),this.dispatchEvent(new CustomEvent(`save`,{detail:{settings:this.settings}})),(this.shadowRoot?.querySelector(`base-dialog`)).close()}render(){return A`
      <base-dialog title="Layout Settings">
        <form id="layout-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Layout Name</label>
            <input 
              type="text" 
              required 
              .value="${Q(this.settings?.name||``)}" 
              @input="${e=>this.settings?this.settings.name=e.target.value:null}"
            >
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Canvas Width (mm)</label>
              <input 
                type="number" 
                required 
                .value="${Q(this.settings?.canvas_width_mm?.toString()||``)}" 
                @input="${e=>this.settings?this.settings.canvas_width_mm=parseInt(e.target.value):null}"
              >
            </div>
            <div class="form-group">
              <label>Canvas Height (mm)</label>
              <input 
                type="number" 
                required 
                .value="${Q(this.settings?.canvas_height_mm?.toString()||``)}" 
                @input="${e=>this.settings?this.settings.canvas_height_mm=parseInt(e.target.value):null}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Snap to Grid</label>
            <grid-snap-slider 
              .value="${this.settings?.grid_snap_mm||5}"
              @change="${e=>this.settings?this.settings.grid_snap_mm=e.detail.value:null}"
            ></grid-snap-slider>
          </div>

        </form>

        <div slot="footer">
          <button class="secondary" @click="${()=>(this.shadowRoot?.querySelector(`base-dialog`)).close()}">Cancel</button>
          <button class="primary" @click="${()=>(this.shadowRoot?.getElementById(`layout-form`)).requestSubmit()}">Save Settings</button>
        </div>
      </base-dialog>
    `}};V([F({type:Object}),B(`design:type`,Object)],na.prototype,`settings`,void 0),na=V([P(`layout-settings-dialog`)],na);var ra,ia=class extends N{constructor(...e){super(...e),this.layouts=[],this.displayTypes=[],this.activeLayout=null,this.selectedItemId=null,this.viewMode=`graphical`,this.isSaving=!1,this._mousePos={x:null,y:null},this._originalLayout=null}static{this.styles=[z,h`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .editor-container {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        background: white;
        height: 100%;
      }
      layout-editor, yaml-editor {
        flex: 1;
      }
    `]}willUpdate(e){if(e.has(`activeLayout`)){let t=e.get(`activeLayout`);(!this._originalLayout||!t||this.activeLayout&&t.id!==this.activeLayout.id)&&this.resetBaseline(),this._updateState()}}updated(e){super.updated(e)}resetBaseline(){this._originalLayout=JSON.stringify(this.activeLayout)}_updateState(){this.dispatchEvent(new CustomEvent(`dirty-state-change`,{detail:{isDirty:this.isDirty},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`can-delete-change`,{detail:{canDelete:!!this.activeLayout},bubbles:!0,composed:!0}))}get isDirty(){return this.activeLayout?JSON.stringify(this.activeLayout)!==this._originalLayout:!1}get canDelete(){return!!this.activeLayout}async save(){this.dispatchEvent(new CustomEvent(`save-layout`,{detail:{layout:this.activeLayout},bubbles:!0,composed:!0}))}async discard(){if(this._originalLayout){let e=JSON.parse(this._originalLayout);this._updateActiveLayout(e,!0),this.selectedItemId=null}}async addNew(){let e={name:`New Layout`,canvas_width_mm:500,canvas_height_mm:500,grid_snap_mm:5,items:[]};this._updateActiveLayout(e,!0),await this._layoutSettingsDialog.show(e)}async requestDelete(){this.activeLayout&&this.dispatchEvent(new CustomEvent(`delete-layout`,{detail:{layout:this.activeLayout},bubbles:!0,composed:!0}))}_onAddItemToLayout(e){let t=Math.random().toString(36).substr(2,9),n={id:t,display_type_id:e.detail.id,x_mm:50,y_mm:50,orientation:`landscape`};if(this.activeLayout){let e={items:[...this.activeLayout.items||[],n]};this._updateActiveLayout(e),this._selectItem(t)}}_updateActiveLayout(e,t=!1){this.dispatchEvent(new CustomEvent(`update-active-layout`,{detail:{updates:e,replace:t},bubbles:!0,composed:!0}))}_selectItem(e){this.dispatchEvent(new CustomEvent(`select-item`,{detail:{id:e},bubbles:!0,composed:!0}))}_updateItem(e,t){this.dispatchEvent(new CustomEvent(`update-item`,{detail:{id:e,updates:t},bubbles:!0,composed:!0}))}async _onEditItem(e){this.dispatchEvent(new CustomEvent(`edit-item`,{detail:e.detail,bubbles:!0,composed:!0}))}async _onDeleteItem(e){this.dispatchEvent(new CustomEvent(`delete-item`,{detail:e.detail,bubbles:!0,composed:!0}))}render(){return A`
      <section-layout>
        <side-bar
          slot="left-bar"
          .displayTypes="${this.displayTypes}"
          .activeLayout="${this.activeLayout}"
          .selectedItemId="${this.selectedItemId}"
          @add-display-type="${()=>this.dispatchEvent(new CustomEvent(`set-section`,{detail:`display-types`,bubbles:!0,composed:!0}))}"
          @edit-display-type="${()=>this.dispatchEvent(new CustomEvent(`set-section`,{detail:`display-types`,bubbles:!0,composed:!0}))}"
          @delete-display-type="${e=>this.dispatchEvent(new CustomEvent(`delete-display-type`,{detail:e.detail,bubbles:!0,composed:!0}))}"
          @add-item-to-layout="${this._onAddItemToLayout}"
          @select-item="${e=>this._selectItem(e.detail.id)}"
          @edit-item="${this._onEditItem}"
          @rotate-item="${e=>this._updateItem(e.detail.id,{orientation:this.activeLayout?.items.find(t=>t.id===e.detail.id)?.orientation===`landscape`?`portrait`:`landscape`})}"
          @delete-item="${this._onDeleteItem}"
        ></side-bar>

        <app-toolbar
          slot="right-top-bar"
          .layouts="${this.layouts}"
          .displayTypes="${this.displayTypes}"
          .activeLayout="${this.activeLayout}"
          .mousePos="${this._mousePos}"
          @switch-layout="${e=>this.dispatchEvent(new CustomEvent(`switch-layout`,{detail:e.detail,bubbles:!0,composed:!0}))}"
          @create-layout="${this.addNew}"
          @edit-layout="${()=>this.activeLayout&&this._layoutSettingsDialog.show(this.activeLayout)}"
          @add-item-to-layout="${this._onAddItemToLayout}"
        ></app-toolbar>

        <div slot="right-main" style="height: 100%; display: flex; flex-direction: column;">
          <layout-editor
            ?hidden="${this.viewMode!==`graphical`||!this.activeLayout}"
            .width_mm="${this.activeLayout?.canvas_width_mm||0}"
            .height_mm="${this.activeLayout?.canvas_height_mm||0}"
            .gridSnap="${this.activeLayout?.grid_snap_mm||5}"
            .items="${this.activeLayout?.items||[]}"
            .displayTypes="${this.displayTypes}"
            .selectedIds="${this.selectedItemId?[this.selectedItemId]:[]}"
            @item-moved="${e=>this._updateItem(e.detail.id,{x_mm:e.detail.x,y_mm:e.detail.y})}"
            @select-item="${e=>this._selectItem(e.detail.id)}"
            @edit-item="${e=>this._onEditItem(e)}"
            @mouse-move="${e=>this._mousePos=e.detail}"
            @rotate-item="${e=>this._updateItem(e.detail.id,{orientation:this.activeLayout?.items.find(t=>t.id===e.detail.id)?.orientation===`landscape`?`portrait`:`landscape`})}"
            @item-delete="${e=>this._onDeleteItem(e)}"
            @layout-resized="${e=>this._updateActiveLayout({canvas_width_mm:e.detail.width,canvas_height_mm:e.detail.height})}"
          ></layout-editor>

          <yaml-editor
            ?hidden="${this.viewMode!==`yaml`||!this.activeLayout}"
            .data="${this.activeLayout}"
            .schemaName="Layout"
            @data-update="${e=>this._updateActiveLayout(e.detail)}"
          ></yaml-editor>
        </div>
      </section-layout>

      <layout-settings-dialog @save="${e=>{let t=!e.detail.settings.id;this.dispatchEvent(new CustomEvent(`update-active-layout`,{detail:{updates:e.detail.settings,replace:t},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`show-message`,{detail:{text:`Settings applied`,type:`success`},bubbles:!0,composed:!0}))}}"></layout-settings-dialog>
    `}};V([F({type:Array}),B(`design:type`,Array)],ia.prototype,`layouts`,void 0),V([F({type:Array}),B(`design:type`,Array)],ia.prototype,`displayTypes`,void 0),V([F({type:Object}),B(`design:type`,Object)],ia.prototype,`activeLayout`,void 0),V([F({type:String}),B(`design:type`,Object)],ia.prototype,`selectedItemId`,void 0),V([F({type:String}),B(`design:type`,String)],ia.prototype,`viewMode`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],ia.prototype,`isSaving`,void 0),V([I(),B(`design:type`,Object)],ia.prototype,`_mousePos`,void 0),V([I(),B(`design:type`,Object)],ia.prototype,`_originalLayout`,void 0),V([L(`layout-settings-dialog`),B(`design:type`,typeof(ra=na!==void 0&&na)==`function`?ra:Object)],ia.prototype,`_layoutSettingsDialog`,void 0),ia=V([P(`layouts-view`)],ia);var aa=class extends N{constructor(...e){super(...e),this.title=``,this.icon=`info`,this.message=`This section is not yet implemented.`}static{this.styles=h`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      text-align: center;
      padding: 2rem;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 1.5rem;
      opacity: 0.3;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #777;
      font-weight: 600;
    }
    p {
      margin: 0;
      max-width: 400px;
      line-height: 1.5;
    }
  `}render(){return A`
      <span class="material-icons icon">${this.icon}</span>
      <h2>${this.title}</h2>
      <p>${this.message}</p>
    `}};V([F({type:String}),B(`design:type`,Object)],aa.prototype,`title`,void 0),V([F({type:String}),B(`design:type`,Object)],aa.prototype,`icon`,void 0),V([F({type:String}),B(`design:type`,Object)],aa.prototype,`message`,void 0),aa=V([P(`empty-view`)],aa);var oa=class extends N{constructor(...e){super(...e),this.displayTypes=[],this.selectedId=null,this.isNew=!0,this.viewMode=`graphical`,this.isAdding=!1,this._isDirtyState=!1,this._PRESETS=[{name:`White`,colour:`#ffffff`},{name:`Black`,colour:`#000000`},{name:`Brown`,colour:`#5d4037`},{name:`Silver`,colour:`#c0c0c0`}]}static{this.styles=[z,h`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .view-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .toolbar-title {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }
    .toolbar-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      height: 100%;
      overflow: hidden;
    }

    .list-sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-items {
      flex: 1;
      overflow-y: auto;
    }

    .sidebar-item {
      padding: 12px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: #fff;
    }

    .sidebar-item:hover { background: #f0faff; }
    .sidebar-item.selected { 
      background: #e1f5fe; 
      border-left: 4px solid var(--primary-colour);
      padding-left: 8px;
    }

    .sidebar-thumbnail {
      width: 80px;
      height: 60px;
      background: #eee;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: var(--shadow-small);
    }

    .sidebar-name {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-colour);
      text-align: center;
      word-break: break-all;
    }

    .sidebar-item.add-new:hover { background: #f0faff; }
    .sidebar-item.add-new.selected { background: #e1f5fe; }

    form {
      padding: 2rem;
      overflow-y: auto;
      border-right: 1px solid #eee;
      background: white;
    }

    .preview-column {
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1.5rem;
      gap: 1.5rem;
      overflow-y: auto;
      position: relative;
    }

    .preview-canvas {
      width: 300px;
      height: 300px;
      background: #e9ecef;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      position: relative;
      overflow: hidden;
    }

    .preview-label {
      font-size: 11px;
      font-weight: bold;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .summary-panel {
      background: white;
      border: 1px solid #eee;
      border-radius: 12px;
      box-shadow: var(--shadow-small);
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .summary-content {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 14px;
      transition: all 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-colour);
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
    }
    .row {
      display: flex;
      gap: 1.5rem;
    }
    .row > * { flex: 1; }
    
    button {
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button:hover { filter: brightness(0.95); }
    button:active { transform: translateY(1px); }
    button:disabled { 
      opacity: 0.5; 
      cursor: not-allowed; 
      transform: none;
    }
    .primary { background: var(--primary-colour); color: white; }
    .secondary { background: #eee; color: #555; }
    .danger { background: var(--danger-colour); color: white; }
    
    .section-header {
      margin-top: 2rem;
      margin-bottom: 1.25rem;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
      font-size: 13px;
      font-weight: 800;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .swatch-group {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      margin-bottom: 12px;
    }
    .swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: all 0.2s ease;
      position: relative;
    }
    .swatch:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: var(--primary-colour);
    }
    .swatch.selected {
      border: 2px solid var(--primary-colour);
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.2);
    }
    .colour-input-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid #eee;
    }
    input[type="color"] {
      width: 44px;
      height: 38px;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      padding: 2px;
    }
    .hex-value {
      font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
      font-size: 13px;
      color: #555;
      text-transform: uppercase;
      font-weight: 600;
      flex: 1;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 12px;
    }
    .summary-table th, .summary-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .summary-table th {
      background: #f8f9fa;
      color: #666;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 40%;
    }
    .summary-table tr:last-child td, .summary-table tr:last-child th {
      border-bottom: none;
    }
    .summary-table .val {
      font-weight: 600;
      color: #333;
    }
    .summary-table .unit {
      color: #aaa;
      margin-left: 2px;
      font-weight: normal;
    }
    `]}get isDirty(){return this._isDirtyState}get canDelete(){return!this.isNew&&!!this.displayType}_getDefaultDisplayType(){return{id:``,name:``,width_mm:0,height_mm:0,panel_width_mm:0,panel_height_mm:0,width_px:0,height_px:0,colour_type:`MONO`,frame:{border_width_mm:0,colour:`#000000`},mat:{colour:`#ffffff`}}}connectedCallback(){super.connectedCallback(),this._syncSelection(),this._updateDirtyState()}willUpdate(e){(e.has(`selectedId`)||e.has(`displayTypes`)||e.has(`isAdding`))&&this._syncSelection(),(e.has(`displayType`)||e.has(`displayTypes`)||e.has(`isNew`))&&(this._updateDirtyState(),this._updateDeleteState())}updated(e){super.updated(e)}_syncSelection(){let e=this.selectedId?this.displayTypes.find(e=>e.id===this.selectedId):null;e?(this.displayType?.id!==e.id||this.isNew)&&(this.displayType=JSON.parse(JSON.stringify(e)),this.isNew=!1):this.isAdding?(!this.isNew||!this.displayType)&&(this.displayType=this._getDefaultDisplayType(),this.isNew=!0):(this.displayType=void 0,this.isNew=!0)}_updateDeleteState(){this.dispatchEvent(new CustomEvent(`can-delete-change`,{detail:{canDelete:!this.isNew&&!!this.displayType},bubbles:!0,composed:!0}))}_isDirty(){if(!this.displayType)return!1;if(this.isNew){let e=this._getDefaultDisplayType();return JSON.stringify(this.displayType)!==JSON.stringify(e)}let e=this.displayTypes.find(e=>e.id===this.displayType?.id);return e?JSON.stringify(this.displayType)!==JSON.stringify(e):!0}_updateDirtyState(){let e=this._isDirty();this._isDirtyState!==e&&(this._isDirtyState=e,this.dispatchEvent(new CustomEvent(`dirty-state-change`,{detail:{isDirty:e},bubbles:!0,composed:!0})))}save(){let e=this.shadowRoot?.querySelector(`form`);e?.checkValidity()?this._handleSubmit(new Event(`submit`)):e?.reportValidity()}discard(){this._handleSelect(this.isNew?null:this.displayType?.id||null)}_requestConfirmation(e,t){this.dispatchEvent(new CustomEvent(`request-confirmation`,{detail:{config:e,callback:t},bubbles:!0,composed:!0}))}addNew(){this._handleSelect(null)}async _handleSelect(e){if(this.displayType?.id===e&&!this.isNew||e===null&&this.isNew)return;let t=()=>{this.dispatchEvent(new CustomEvent(`select-display-type`,{detail:{id:e},bubbles:!0,composed:!0}))};this._isDirty()?this._requestConfirmation({title:`Unsaved Changes`,message:`You have unsaved changes to "${this.displayType?.name}". What would you like to do?`,buttons:[{text:`Save`,value:`save`,type:`primary`},{text:`Discard`,value:`discard`,type:`danger`},{text:`Cancel`,value:`cancel`,type:`secondary`}]},async e=>{if(e===`save`){let e=this.shadowRoot?.querySelector(`form`);e?.checkValidity()?(this._handleSubmit(new Event(`submit`)),t()):e?.reportValidity()}else e===`discard`&&t()}):t()}requestDelete(){this._handleDelete()}_handleDelete(){!this.displayType||this.isNew||this.dispatchEvent(new CustomEvent(`delete-display-type`,{detail:this.displayType}))}_handleSubmit(e){e.preventDefault(),this.displayType&&(this.dispatchEvent(new CustomEvent(`save`,{detail:{displayType:this.displayType}})),this.isNew=!1,this.requestUpdate(),this._updateDirtyState())}_renderColourPicker(e,t,n){return A`
      <div class="form-group">
        <label>${e}</label>
        <div class="swatch-group">
          ${this._PRESETS.map(e=>A`
            <div 
              class="swatch ${t.toLowerCase()===e.colour.toLowerCase()?`selected`:``}" 
              style="background: ${e.colour}"
              title="${e.name}"
              @click="${()=>n(e.colour)}"
            ></div>
          `)}
        </div>
        <div class="colour-input-container">
          <input 
            type="color" 
            .value="${Q(t)}" 
            @input="${e=>{n(e.target.value),this._updateDirtyState()}}"
          >
          <div class="hex-value">${t}</div>
        </div>
      </div>
    `}_formatDim(e){return parseFloat(e.toFixed(1)).toString()}render(){let e=this.displayType?.width_mm||0,t=this.displayType?.height_mm||0,n=this.displayType?.frame?.border_width_mm||0,r=this.displayType?.panel_width_mm||0,i=this.displayType?.panel_height_mm||0,a=e-2*n,o=t-2*n,s=(a-r)/2,c=(o-i)/2,l=e>0&&t>0?240/Math.max(e,t):1;return A`
      <section-layout>
        <!-- Sidebar: Display Types List -->
        <div slot="left-bar" class="list-sidebar">
          <div class="sidebar-items">
            ${this.displayTypes.map(e=>{let t=60/Math.max(e.width_mm,e.height_mm);return A`
                <div 
                  class="sidebar-item ${this.displayType?.id===e.id&&!this.isNew?`selected`:``}" 
                  @click="${()=>this._handleSelect(e.id)}"
                >
                  <div class="sidebar-thumbnail">
                    <hardware-preview
                      .width_mm="${e.width_mm}"
                      .height_mm="${e.height_mm}"
                      .border_width_mm="${e.frame.border_width_mm}"
                      .panel_width_mm="${e.panel_width_mm}"
                      .panel_height_mm="${e.panel_height_mm}"
                      .frame_colour="${e.frame.colour}"
                      .mat_colour="${e.mat.colour}"
                      .scale="${t}"
                    ></hardware-preview>
                  </div>
                  <span class="sidebar-name">${e.name}</span>
                </div>
              `})}
          </div>
        </div>

        <!-- Toolbar -->
        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${this.displayType?this.isNew?`Create New Display Type`:`Editing: ${this.displayType.name}`:`Display Types`}
          </div>
          <div class="toolbar-actions">
          </div>
        </div>

        <!-- Main Content -->
        <div slot="right-main" class="${this.displayType?`editor-layout`:``}">
          ${this.displayType?A`
            ${this.viewMode===`graphical`?A`
              <form id="display-type-form" @submit="${this._handleSubmit}" @input="${()=>{this.requestUpdate(),this._updateDirtyState()}}">
                <div class="form-group">
                  <label>Identifier/Name</label>
                  <input 
                    type="text" 
                    required 
                    .value="${Q(this.displayType?.name||``)}"
                    @input="${e=>this.displayType.name=e.target.value}"
                    placeholder="e.g. Living Room Display"
                  >
                </div>

                <!-- Device Dimensions Section -->
                <div class="section-header">Device Dimensions</div>
                <div class="row">
                  <div class="form-group">
                    <label>Frame Outer Width (mm)</label>
                    <input type="number" required .value="${Q(this.displayType?.width_mm||0)}" @input="${e=>this.displayType.width_mm=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group">
                    <label>Frame Outer Height (mm)</label>
                    <input type="number" required .value="${Q(this.displayType?.height_mm||0)}" @input="${e=>this.displayType.height_mm=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group">
                    <label>Frame Border Width (mm)</label>
                    <input type="number" required .value="${Q(this.displayType?.frame?.border_width_mm||0)}" @input="${e=>this.displayType.frame.border_width_mm=parseInt(e.target.value)}">
                  </div>
                </div>

                <div class="row">
                  <div class="form-group">
                    <label>Display Panel Width (mm)</label>
                    <input type="number" required .value="${Q(this.displayType?.panel_width_mm||0)}" @input="${e=>this.displayType.panel_width_mm=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group">
                    <label>Display Panel Height (mm)</label>
                    <input type="number" required .value="${Q(this.displayType?.panel_height_mm||0)}" @input="${e=>this.displayType.panel_height_mm=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group">
                    <label>Colour Type</label>
                    <select .value="${Q(this.displayType?.colour_type||`MONO`)}" @change="${e=>{this.displayType.colour_type=e.target.value,this.requestUpdate(),this._updateDirtyState()}}">
                      <option value="MONO">MONO (B/W)</option>
                      <option value="BWR">BWR (Red)</option>
                      <option value="BWY">BWY (Yellow)</option>
                      <option value="BWRY">BWRY (Red/Yellow)</option>
                      <option value="BWGBRY">BWGBRY (Spectra 6)</option>
                      <option value="GRAYSCALE_4">Greyscale (4-bit)</option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group">
                    <label>Resolution Width (px)</label>
                    <input type="number" required .value="${Q(this.displayType?.width_px||0)}" @input="${e=>this.displayType.width_px=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group">
                    <label>Resolution Height (px)</label>
                    <input type="number" required .value="${Q(this.displayType?.height_px||0)}" @input="${e=>this.displayType.height_px=parseInt(e.target.value)}">
                  </div>
                  <div class="form-group"></div> <!-- Placeholder for 3rd column alignment -->
                </div>

                <div class="section-header">Aesthetics</div>
                <div class="row">
                  ${this._renderColourPicker(`Frame Colour`,this.displayType.frame.colour,e=>{this.displayType.frame.colour=e,this.requestUpdate()})}
                  ${this._renderColourPicker(`Mat Colour`,this.displayType.mat.colour,e=>{this.displayType.mat.colour=e,this.requestUpdate()})}
                </div>

                <div style="display: none;">
                  <button id="real-submit" type="submit"></button>
                </div>
              </form>
            `:A`
              <yaml-editor
                .data="${this.displayType}"
                .schemaName="DisplayType"
                @data-update="${e=>{this.displayType=e.detail,this.requestUpdate(),this._updateDirtyState()}}"
              ></yaml-editor>
            `}

            <div class="preview-column">
              <div class="preview-label">Visual Layout</div>
              <div class="preview-canvas">
                <hardware-preview
                  .width_mm="${this.displayType.width_mm}"
                  .height_mm="${this.displayType.height_mm}"
                  .border_width_mm="${this.displayType.frame.border_width_mm}"
                  .panel_width_mm="${this.displayType.panel_width_mm}"
                  .panel_height_mm="${this.displayType.panel_height_mm}"
                  .frame_colour="${this.displayType.frame.colour}"
                  .mat_colour="${this.displayType.mat.colour}"
                  .scale="${l}"
                ></hardware-preview>
              </div>

              <div class="summary-panel">
                <div class="summary-content">
                  <div class="preview-label" style="margin-bottom: 12px;">Dimension Summary</div>
                  <table class="summary-table">
                    <tr><th>Overall Frame</th><td><span class="val">${this._formatDim(e)} x ${this._formatDim(t)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Mat (Aperture)</th><td><span class="val">${this._formatDim(a)} x ${this._formatDim(o)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Display Panel</th><td><span class="val">${this._formatDim(r)} x ${this._formatDim(i)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Cutout Position</th><td><span class="val">${this._formatDim(s)} x ${this._formatDim(c)}</span><span class="unit">mm</span></td></tr>
                  </table>
                </div>
              </div>
            </div>
          `:A`
            <empty-view
              title="Display Types"
              icon="settings_input_component"
              message="Manage your hardware display types here. Add your first display type to get started."
            ></empty-view>
          `}
        </div>
      </section-layout>
    `}};V([F({type:Object}),B(`design:type`,Object)],oa.prototype,`displayType`,void 0),V([F({type:Array}),B(`design:type`,Array)],oa.prototype,`displayTypes`,void 0),V([F({type:String}),B(`design:type`,Object)],oa.prototype,`selectedId`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],oa.prototype,`isNew`,void 0),V([F({type:String}),B(`design:type`,String)],oa.prototype,`viewMode`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],oa.prototype,`isAdding`,void 0),V([I(),B(`design:type`,Object)],oa.prototype,`_isDirtyState`,void 0),oa=V([P(`display-types-view`)],oa);var sa,ca,la=class extends N{constructor(...e){super(...e),this.min=0,this.max=100,this.valueLow=0,this.valueHigh=100,this.label=``}static{this.styles=[z,h`
      :host {
        display: block;
        padding-top: 10px;
        padding-bottom: 20px;
      }

      .slider-container {
        position: relative;
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
      }

      .slider-track {
        position: absolute;
        width: 100%;
        height: 6px;
        background: #e1e4e8;
        border-radius: 3px;
        z-index: 1;
      }

      .active-track {
        position: absolute;
        height: 6px;
        background: var(--primary-colour);
        border-radius: 3px;
        z-index: 2;
      }

      input[type="range"] {
        position: absolute;
        width: 100%;
        pointer-events: none;
        appearance: none;
        height: 6px;
        background: none;
        z-index: 3;
        margin: 0;
      }

      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        pointer-events: auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--primary-colour);
        cursor: pointer;
        box-shadow: var(--shadow-small);
        transition: transform 0.1s;
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 0 0 5px rgba(3, 169, 244, 0.1);
      }

      input[type="range"]::-webkit-slider-thumb:active {
        transform: scale(1.1);
        background: var(--primary-colour);
      }

      input[type="range"]::-moz-range-thumb {
        pointer-events: auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--primary-colour);
        cursor: pointer;
        box-shadow: var(--shadow-small);
      }

      .labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .value-bubble {
        font-weight: 600;
        color: var(--primary-hover);
      }
    `]}_onInput(e){let t=e.target.id===`low`,n=parseInt(this._lowInput.value),r=parseInt(this._highInput.value);t?n>=r&&(n=r-1,this._lowInput.value=String(n)):r<=n&&(r=n+1,this._highInput.value=String(r)),this.valueLow=n,this.valueHigh=r,this.dispatchEvent(new CustomEvent(`range-change`,{detail:{low:n,high:r},bubbles:!0,composed:!0}))}render(){let e=(this.valueLow-this.min)/(this.max-this.min)*100,t=(this.valueHigh-this.min)/(this.max-this.min)*100;return A`
      <label>${this.label}</label>
      <div class="slider-container">
        <div class="slider-track"></div>
        <div 
          class="active-track" 
          style="left: ${e}%; width: ${t-e}%"
        ></div>
        <input 
          type="range" 
          id="low" 
          .min="${String(this.min)}" 
          .max="${String(this.max)}" 
          .value="${String(this.valueLow)}"
          @input="${this._onInput}"
        >
        <input 
          type="range" 
          id="high" 
          .min="${String(this.min)}" 
          .max="${String(this.max)}" 
          .value="${String(this.valueHigh)}"
          @input="${this._onInput}"
        >
      </div>
      <div class="labels">
        <span>${this.min}</span>
        <span class="value-bubble">${this.valueLow} — ${this.valueHigh}</span>
        <span>${this.max}</span>
      </div>
    `}};V([F({type:Number}),B(`design:type`,Object)],la.prototype,`min`,void 0),V([F({type:Number}),B(`design:type`,Object)],la.prototype,`max`,void 0),V([F({type:Number}),B(`design:type`,Object)],la.prototype,`valueLow`,void 0),V([F({type:Number}),B(`design:type`,Object)],la.prototype,`valueHigh`,void 0),V([F({type:String}),B(`design:type`,Object)],la.prototype,`label`,void 0),V([L(`#low`),B(`design:type`,typeof(sa=typeof HTMLInputElement<`u`&&HTMLInputElement)==`function`?sa:Object)],la.prototype,`_lowInput`,void 0),V([L(`#high`),B(`design:type`,typeof(ca=typeof HTMLInputElement<`u`&&HTMLInputElement)==`function`?ca:Object)],la.prototype,`_highInput`,void 0),la=V([P(`range-slider`)],la);var ua,da=class extends N{constructor(...e){super(...e),this.keywords=[],this.validate=!1,this._allKeywords=[]}static{this.styles=[z,h`
      :host {
        display: block;
      }

      .keyword-input-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 6px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        background: white;
        min-height: 42px;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
        align-items: center;
      }

      .keyword-input-container:focus-within {
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
      }

      .keyword-chip {
        display: inline-flex;
        align-items: center;
        background: #e1f5fe;
        color: var(--primary-hover);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        animation: fadeIn 0.2s ease-out;
        border: 1px solid transparent;
        transition: all 0.2s;
      }

      .keyword-chip.invalid {
        background: #fff1f0;
        color: var(--danger-colour);
        border-color: #ffa39e;
      }

      .keyword-chip .invalid-icon {
        margin-right: 4px;
        font-size: 14px;
        display: none;
      }

      .keyword-chip.invalid .invalid-icon {
        display: block;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }

      .keyword-chip .remove-btn {
        display: flex;
        align-items: center;
        margin-left: 6px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .keyword-chip .remove-btn:hover {
        opacity: 1;
      }

      .keyword-chip .remove-btn .material-icons {
        font-size: 14px;
      }

      input {
        flex: 1;
        min-width: 120px;
        border: none !important;
        padding: 4px 8px !important;
        margin: 0 !important;
        height: 28px !important;
        font-size: 14px !important;
      }

      input:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      .suggestion-help {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .suggestion-help .material-icons {
        font-size: 14px;
      }
    `]}async connectedCallback(){super.connectedCallback();try{this._allKeywords=await R.getKeywords()}catch(e){console.error(`Failed to load keywords`,e)}}_addKeyword(e){let t=e.trim();return t&&!this.keywords.includes(t)?(this.keywords=[...this.keywords,t],this._dispatchEvent(),!0):!1}_removeKeyword(e){this.keywords=this.keywords.filter(t=>t!==e),this._dispatchEvent()}_handleKeyDown(e){e.key===`Enter`||e.key===`,`?(e.preventDefault(),this._addKeyword(this._inputElement.value)&&(this._inputElement.value=``)):e.key===`Backspace`&&this._inputElement.value===``&&this.keywords.length>0&&this._removeKeyword(this.keywords[this.keywords.length-1])}_handleInput(){let e=this._inputElement.value;this._allKeywords.some(t=>t.keyword===e)&&(this._addKeyword(e),this._inputElement.value=``)}_dispatchEvent(){this.dispatchEvent(new CustomEvent(`keywords-changed`,{detail:{keywords:this.keywords},bubbles:!0,composed:!0}))}render(){return A`
      <div class="keyword-input-container" @click="${()=>this._inputElement.focus()}">
        ${this.keywords.map(e=>A`
            <div class="keyword-chip ${this.validate&&!this._allKeywords.some(t=>t.keyword===e)?`invalid`:``}">
              <span class="material-icons invalid-icon">report_problem</span>
              ${e}
              <span class="remove-btn" @click="${t=>{t.stopPropagation(),this._removeKeyword(e)}}">
                <span class="material-icons">close</span>
              </span>
            </div>
          `)}
        <input 
          type="text" 
          placeholder="${this.keywords.length===0?`Add keywords...`:``}"
          list="keyword-suggestions"
          @keydown="${this._handleKeyDown}"
          @input="${this._handleInput}"
        >
        <datalist id="keyword-suggestions">
          ${this._allKeywords.filter(e=>!this.keywords.includes(e.keyword)).map(e=>A`<option value="${e.keyword}">${e.keyword} (${e.count})</option>`)}
        </datalist>
      </div>
      <div class="suggestion-help">
        <span class="material-icons">info</span>
        Press Enter or comma to add. Existing tags will be suggested as you type.
      </div>
    `}};V([F({type:Array}),B(`design:type`,Array)],da.prototype,`keywords`,void 0),V([F({type:Boolean}),B(`design:type`,Object)],da.prototype,`validate`,void 0),V([I(),B(`design:type`,Array)],da.prototype,`_allKeywords`,void 0),V([L(`input`),B(`design:type`,typeof(ua=typeof HTMLInputElement<`u`&&HTMLInputElement)==`function`?ua:Object)],da.prototype,`_inputElement`,void 0),da=V([P(`keyword-input`)],da);var $=class extends N{constructor(...e){super(...e),this.images=[],this.selectedImageId=null,this._filterTitle=``,this._filterDescription=``,this._filterArtist=``,this._filterCollection=``,this._minWidth=0,this._maxWidth=4e3,this._minHeight=0,this._maxHeight=4e3,this._keywords=[],this._sortFields=[{field:`name`,direction:`asc`}],this._isAddMenuOpen=!1,this._draggedIndex=null,this._dragOverIndex=null,this._debounceTimer=null}static{this.styles=[z,h`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .image-card {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-small);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }

      .image-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-medium);
      }

      .image-card.selected {
        outline: 2px solid var(--primary-colour);
        background: #f0faff;
        box-shadow: var(--shadow-medium);
      }

      .thumbnail-container {
        aspect-ratio: 1 / 1;
        background-color: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
      }

      .thumbnail-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .image-info {
        padding: 0.75rem;
        border-top: 1px solid var(--border-colour);
      }

      .image-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-colour);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }

      .image-meta {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 4px;
      }

      .sidebar-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
        overflow-y: auto;
      }

      .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .sidebar-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .sidebar-title .material-icons {
        font-size: 14px;
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .reset-button {
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
        opacity: 0;
        visibility: hidden;
        background: white;
        padding: 6px;
        border-radius: 20px;
        box-shadow: var(--shadow-medium);
        z-index: 10;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: translateY(-5px) scale(0.9);
      }

      .image-card:hover .actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .action-icon {
        cursor: pointer;
        color: #555;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, transform 0.1s;
      }

      .action-icon:hover {
        color: var(--primary-colour);
        transform: scale(1.1);
      }

      .sort-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .sort-item {
        display: flex;
        align-items: center;
        background: white;
        padding: 0.5rem;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        gap: 0.5rem;
        font-size: 13px;
        color: var(--text-colour);
      }

      .sort-item.drag-over {
        border-top: 2px solid var(--primary-colour);
      }

      .sort-item .field-label {
        flex: 1;
        font-weight: 500;
        cursor: default;
      }

      .sort-item .sort-actions {
        display: flex;
        gap: 4px;
      }

      .sort-action {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-muted);
        border-radius: 4px;
        transition: all 0.2s;
      }

      .sort-action:hover {
        background: #f0f2f5;
        color: var(--primary-colour);
      }

      .sort-action.remove:hover {
        color: var(--danger-colour);
      }

      .add-sort-container {
        position: relative;
        margin-top: 0.5rem;
      }

      .add-sort-button {
        width: 100%;
        font-size: 12px;
        padding: 6px 12px;
      }

      .add-sort-menu {
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 100;
        margin-bottom: 4px;
        overflow: hidden;
      }

      .add-sort-item {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      }

      .add-sort-item:hover {
        background: #f0faff;
        color: var(--primary-colour);
      }
    `]}get canDelete(){return!!this.selectedImageId}requestDelete(){let e=this.images.find(e=>e.id===this.selectedImageId);e&&this.dispatchEvent(new CustomEvent(`delete-image`,{detail:{image:e},bubbles:!0,composed:!0}))}_triggerFilterChange(e=!1){this._debounceTimer&&clearTimeout(this._debounceTimer);let t=()=>{let e=this._sortFields.map(e=>`${e.field}:${e.direction}`).join(`,`),t={title:this._filterTitle,description:this._filterDescription,artist:this._filterArtist,collection:this._filterCollection,min_width:this._minWidth>0?this._minWidth:void 0,max_width:this._maxWidth<4e3?this._maxWidth:void 0,min_height:this._minHeight>0?this._minHeight:void 0,max_height:this._maxHeight<4e3?this._maxHeight:void 0,keyword:this._keywords.length>0?this._keywords.join(`,`):void 0,sort:e||void 0};this.dispatchEvent(new CustomEvent(`filter-change`,{detail:t,bubbles:!0,composed:!0}))};e?t():this._debounceTimer=setTimeout(t,300)}_resetFilters(){this._filterTitle=``,this._filterDescription=``,this._filterArtist=``,this._filterCollection=``,this._minWidth=0,this._maxWidth=4e3,this._minHeight=0,this._maxHeight=4e3,this._keywords=[],this._sortFields=[{field:`name`,direction:`asc`}],this._isAddMenuOpen=!1,this._triggerFilterChange(!0)}render(){return A`
      <section-layout>
        <div slot="left-bar" class="sidebar-content">
          <!-- General Search -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">search</span>
              General Search
            </div>
            <div class="form-group">
              <label>Title / Name</label>
              <input 
                type="text" 
                placeholder="Search by title..."
                .value="${this._filterTitle}"
                @input="${e=>{this._filterTitle=e.target.value,this._triggerFilterChange()}}"
              >
            </div>
            <div class="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="Search description..."
                .value="${this._filterDescription}"
                @input="${e=>{this._filterDescription=e.target.value,this._triggerFilterChange()}}"
              >
            </div>
            <div class="filter-grid">
              <div class="form-group">
                <label>Artist</label>
                <input 
                  type="text" 
                  placeholder="Artist"
                  .value="${this._filterArtist}"
                  @input="${e=>{this._filterArtist=e.target.value,this._triggerFilterChange()}}"
                >
              </div>
              <div class="form-group">
                <label>Collection</label>
                <input 
                  type="text" 
                  placeholder="Collection"
                  .value="${this._filterCollection}"
                  @input="${e=>{this._filterCollection=e.target.value,this._triggerFilterChange()}}"
                >
              </div>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">aspect_ratio</span>
              Dimensions (px)
            </div>
            <range-slider
              label="Width"
              .min="${0}"
              .max="${4e3}"
              .valueLow="${this._minWidth}"
              .valueHigh="${this._maxWidth}"
              @range-change="${e=>{this._minWidth=e.detail.low,this._maxWidth=e.detail.high,this._triggerFilterChange(!0)}}"
            ></range-slider>
            <range-slider
              label="Height"
              .min="${0}"
              .max="${4e3}"
              .valueLow="${this._minHeight}"
              .valueHigh="${this._maxHeight}"
              @range-change="${e=>{this._minHeight=e.detail.low,this._maxHeight=e.detail.high,this._triggerFilterChange(!0)}}"
            ></range-slider>
          </div>

          <!-- Classification -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">sell</span>
              Classification
            </div>
            <div class="form-group">
              <label>Keywords</label>
              <keyword-input
                .keywords="${this._keywords}"
                .validate="${!0}"
                @keywords-changed="${e=>{this._keywords=e.detail.keywords,this._triggerFilterChange(!0)}}"
              ></keyword-input>
            </div>
          </div>

          <!-- Sorting -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">sort</span>
              Sort Priority
            </div>
            
            <div class="sort-list">
              ${this._sortFields.map((e,t)=>this._renderSortItem(e,t))}
            </div>

            <div class="add-sort-container">
              <button 
                class="secondary add-sort-button" 
                ?disabled="${this._getAvailableFields().length===0}"
                @click="${()=>this._isAddMenuOpen=!this._isAddMenuOpen}"
              >
                <span class="material-icons" style="font-size: 16px;">add</span>
                Add Sort Field
              </button>
              
              ${this._isAddMenuOpen?A`
                <div class="add-sort-menu">
                  ${this._getAvailableFields().map(e=>A`
                    <div class="add-sort-item" @click="${()=>this._addSortField(e)}">
                      ${this._getFieldLabel(e)}
                    </div>
                  `)}
                </div>
              `:``}
            </div>
          </div>

          <!-- Reset -->
          <div class="reset-button">
            <button class="secondary" style="width: 100%;" @click="${this._resetFilters}">
              <span class="material-icons">filter_alt_off</span>
              Reset Filters
            </button>
          </div>
        </div>

        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          Image Library
        </div>

        <div slot="right-main">
          ${this.images.length===0?A`
            <empty-view 
              title="No Images Found"
              icon="image"
              message="Upload images to start building your library."
            ></empty-view>
          `:A`
            <div class="image-grid">
              ${this.images.map(e=>this._renderImage(e))}
            </div>
          `}
        </div>
      </section-layout>
    `}_renderImage(e){return A`
      <div 
        class="image-card ${e.id===this.selectedImageId?`selected`:``}" 
        @click="${()=>this._handleImageClick(e)}"
        @dblclick="${t=>this._handleEditImage(e,t)}"
      >
        <div class="thumbnail-container">
          <img 
            src="/api/image/${e.id}/thumbnail" 
            alt="${e.name}"
            loading="lazy"
          >
          <div class="actions">
            <div 
              class="action-icon" 
              title="Edit Metadata" 
              @click="${t=>this._handleEditImage(e,t)}"
            >
              <span class="material-icons" style="font-size: 18px;">settings</span>
            </div>
          </div>
        </div>
        <div class="image-info">
          <p class="image-name" title="${e.name}">${e.name}</p>
          <div class="image-meta">
            ${e.dimensions.width} &times; ${e.dimensions.height} &bull; ${e.file_type}
          </div>
        </div>
      </div>
    `}_handleImageClick(e){this.dispatchEvent(new CustomEvent(`image-click`,{detail:{image:e},bubbles:!0,composed:!0}))}_handleEditImage(e,t){t.stopPropagation(),this.dispatchEvent(new CustomEvent(`edit-image`,{detail:{image:e},bubbles:!0,composed:!0}))}_renderSortItem(e,t){let n=this._draggedIndex===t,r=this._dragOverIndex===t;return A`
      <div 
        class="sort-item draggable-item ${n?`dragging`:``} ${r?`drag-over`:``}"
        draggable="true"
        @dragstart="${e=>this._onDragStart(e,t)}"
        @dragover="${e=>this._onDragOver(e,t)}"
        @dragleave="${()=>this._dragOverIndex=null}"
        @dragend="${this._onDragEnd}"
        @drop="${e=>this._onDrop(e,t)}"
      >
        <span class="material-icons drag-handle">drag_indicator</span>
        <span class="field-label">${this._getFieldLabel(e.field)}</span>
        <div class="sort-actions">
          <div class="sort-action" @click="${()=>this._toggleSortDirection(t)}">
            <span class="material-icons">
              ${e.direction===`asc`?`north`:`south`}
            </span>
          </div>
          <div class="sort-action remove" @click="${()=>this._removeSortField(t)}">
            <span class="material-icons">close</span>
          </div>
        </div>
      </div>
    `}_getFieldLabel(e){return{name:`Name`,artist:`Artist`,collection:`Collection`,width:`Width`,height:`Height`}[e]}_getAvailableFields(){let e=[`name`,`artist`,`collection`,`width`,`height`],t=this._sortFields.map(e=>e.field);return e.filter(e=>!t.includes(e))}_addSortField(e){this._sortFields=[...this._sortFields,{field:e,direction:`asc`}],this._isAddMenuOpen=!1,this._triggerFilterChange(!0)}_removeSortField(e){this._sortFields=this._sortFields.filter((t,n)=>n!==e),this._triggerFilterChange(!0)}_toggleSortDirection(e){let t=[...this._sortFields];t[e]={...t[e],direction:t[e].direction===`asc`?`desc`:`asc`},this._sortFields=t,this._triggerFilterChange(!0)}_onDragStart(e,t){this._draggedIndex=t,e.dataTransfer&&(e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,t.toString()))}_onDragOver(e,t){e.preventDefault(),this._draggedIndex!==t&&(this._dragOverIndex=t)}_onDragEnd(){this._draggedIndex=null,this._dragOverIndex=null}_onDrop(e,t){if(e.preventDefault(),this._dragOverIndex=null,this._draggedIndex===null||this._draggedIndex===t)return;let n=[...this._sortFields],r=n.splice(this._draggedIndex,1)[0];n.splice(t,0,r),this._sortFields=n,this._draggedIndex=null,this._triggerFilterChange(!0)}};V([F({type:Array}),B(`design:type`,Array)],$.prototype,`images`,void 0),V([F({type:String}),B(`design:type`,Object)],$.prototype,`selectedImageId`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_filterTitle`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_filterDescription`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_filterArtist`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_filterCollection`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_minWidth`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_maxWidth`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_minHeight`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_maxHeight`,void 0),V([I(),B(`design:type`,Array)],$.prototype,`_keywords`,void 0),V([I(),B(`design:type`,Array)],$.prototype,`_sortFields`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_isAddMenuOpen`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_draggedIndex`,void 0),V([I(),B(`design:type`,Object)],$.prototype,`_dragOverIndex`,void 0),$=V([P(`images-view`)],$);var fa=class extends N{constructor(...e){super(...e),this.item=null,this.displayTypes=[]}static{this.styles=[z,h`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `]}async show(e,t){this.item=JSON.parse(JSON.stringify(e)),this.displayTypes=t,await this.updateComplete,(this.shadowRoot?.querySelector(`base-dialog`)).show()}_handleSubmit(e){e.preventDefault(),this.item&&(this.dispatchEvent(new CustomEvent(`save`,{detail:{id:this.item.id,updates:{x_mm:parseInt(this.item.x_mm),y_mm:parseInt(this.item.y_mm),display_type_id:this.item.display_type_id,orientation:this.item.orientation}}})),(this.shadowRoot?.querySelector(`base-dialog`)).close())}_handleDelete(){this.item&&(this.dispatchEvent(new CustomEvent(`delete`,{detail:{id:this.item.id}})),(this.shadowRoot?.querySelector(`base-dialog`)).close())}render(){return A`
      <base-dialog title="Display Settings">
        <form id="item-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Display Type</label>
            <select .value="${Q(this.item?.display_type_id||``)}" @change="${e=>this.item?this.item.display_type_id=e.target.value:null}">
              ${this.displayTypes.map(e=>A`
                <option value="${e.id}">${e.name} (${e.width_mm}x${e.height_mm}mm)</option>
              `)}
            </select>
          </div>

          <div class="grid">
            <div class="form-group">
              <label>X Position (mm)</label>
              <input 
                type="number" 
                required 
                .value="${Q(this.item?.x_mm.toString()||`0`)}" 
                @input="${e=>this.item?this.item.x_mm=e.target.value:null}"
              >
            </div>
            <div class="form-group">
              <label>Y Position (mm)</label>
              <input 
                type="number" 
                required 
                .value="${Q(this.item?.y_mm.toString()||`0`)}" 
                @input="${e=>this.item?this.item.y_mm=e.target.value:null}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Orientation</label>
            <select 
              .value="${Q(this.item?.orientation||`landscape`)}" 
              @change="${e=>this.item?this.item.orientation=e.target.value:null}"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
        </form>

        <div slot="footer" style="display: flex; width: 100%; gap: 1rem;">
          <button class="danger" style="margin-right: auto;" @click="${this._handleDelete}">Delete</button>
          <button class="secondary" @click="${()=>(this.shadowRoot?.querySelector(`base-dialog`)).close()}">Cancel</button>
          <button class="primary" @click="${()=>(this.shadowRoot?.getElementById(`item-form`)).requestSubmit()}">Apply</button>
        </div>
      </base-dialog>
    `}};V([F({type:Object}),B(`design:type`,Object)],fa.prototype,`item`,void 0),V([F({type:Array}),B(`design:type`,Array)],fa.prototype,`displayTypes`,void 0),fa=V([P(`item-settings-dialog`)],fa);var pa=class extends N{constructor(...e){super(...e),this._uploadedImage=null,this._editingImage=null,this._isUploading=!1,this._error=null,this._keywords=[],this._imageName=``,this._artist=``,this._collection=``,this._description=``}static{this.styles=[z,h`
      :host {
        --dialog-width: 960px;
      }

      .dialog-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 0.5rem 0;
        width: 100%;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .metadata-fields {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .upload-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--border-colour);
        border-radius: var(--border-radius);
        background: var(--bg-light);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        padding: 2rem;
        text-align: center;
      }

      .upload-section:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
        transform: translateY(-2px);
      }

      .upload-section .material-icons {
        font-size: 64px;
        color: #ccd0d4;
        margin-bottom: 1.5rem;
        transition: color 0.2s;
      }

      .upload-section:hover .material-icons {
        color: var(--primary-colour);
      }

      .upload-section p {
        margin: 0;
        color: var(--text-colour);
        font-weight: 500;
        font-size: 15px;
      }

      .upload-section .hint {
        font-weight: normal;
        font-size: 13px;
        margin-top: 0.5rem;
        color: var(--text-muted);
      }

      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
        transition: border-color 0.2s;
      }

      textarea:focus {
        outline: none;
        border-color: var(--primary-colour);
      }

      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: var(--border-radius);
      }

      .media-section {
        display: flex;
        flex-direction: column;
      }

      .error-message {
        background: #fff1f0;
        border: 1px solid #ffa39e;
        color: #f5222d;
        padding: 0.75rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `]}async show(e){this._editingImage=e||null,this._uploadedImage=e||null,this._isUploading=!1,this._error=null,this._keywords=e?.keywords||[],this._imageName=e?.name||``,this._artist=e?.artist||``,this._collection=e?.collection||``,this._description=e?.description||``,await this.updateComplete,(this.shadowRoot?.querySelector(`base-dialog`)).show()}_handleUploadClick(){this.shadowRoot?.querySelector(`input[type="file"]`)?.click()}async _onFileChange(e){let t=e.target;t.files&&t.files[0]&&await this._processFile(t.files[0])}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`),this.shadowRoot?.querySelector(`.upload-section`)?.classList.add(`drag-over`)}_onDragLeave(){this.shadowRoot?.querySelector(`.upload-section`)?.classList.remove(`drag-over`)}async _onDrop(e){e.preventDefault(),this._onDragLeave();let t=e.dataTransfer?.files[0];t&&t.type.startsWith(`image/`)&&await this._processFile(t)}async _handleCancel(){if(!this._editingImage&&this._uploadedImage)try{await R.deleteItem(`image`,this._uploadedImage.id)}catch(e){console.error(`Failed to cleanup uploaded image:`,e)}this._uploadedImage=null,this._editingImage=null,(this.shadowRoot?.querySelector(`base-dialog`)).close()}async _processFile(e){this._isUploading=!0,this._error=null;try{let t=await R.uploadImage(e);this._uploadedImage=t,this._imageName=t.name}catch(e){this._error=e.message||`Failed to upload image`,console.error(`Upload error:`,e)}finally{this._isUploading=!1}}_handleKeywordsChanged(e){this._keywords=e.detail.keywords}async _handleSave(){if(!(!this._uploadedImage||!this._imageName.trim())){this._isUploading=!0,this._error=null;try{let e={name:this._imageName,artist:this._artist,collection:this._collection,description:this._description,keywords:this._keywords};this._editingImage?await R.updateImage(this._editingImage.id,{...this._editingImage,...e}):await R.updateImage(this._uploadedImage.id,{...this._uploadedImage,...e}),this.dispatchEvent(new CustomEvent(`image-saved`,{bubbles:!0,composed:!0})),this._uploadedImage=null,this._editingImage=null,(this.shadowRoot?.querySelector(`base-dialog`)).close()}catch(e){this._error=e.message||`Failed to save image metadata`,console.error(`Save error:`,e)}finally{this._isUploading=!1}}}render(){return A`
      <base-dialog title="${this._editingImage?`Edit Image`:`Add New Image`}">
        <div class="dialog-content">
          <!-- Metadata Fields (Left) -->
          <div class="metadata-fields">
            ${this._error?A`
              <div class="error-message">
                <span class="material-icons" style="font-size: 18px;">error_outline</span>
                ${this._error}
              </div>
            `:``}

            <div class="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Optional - defaults to filename"
                .value="${this._imageName}"
                @input="${e=>this._imageName=e.target.value}"
              >
            </div>
            
            <div class="grid">
              <div class="form-group">
                <label>Artist</label>
                <input 
                  type="text" 
                  placeholder="Who created this?"
                  .value="${this._artist}"
                  @input="${e=>this._artist=e.target.value}"
                >
              </div>
              <div class="form-group">
                <label>Collection</label>
                <input 
                  type="text" 
                  placeholder="e.g. Landscapes, Personal"
                  .value="${this._collection}"
                  @input="${e=>this._collection=e.target.value}"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Keywords</label>
              <keyword-input 
                .keywords="${this._keywords}"
                @keywords-changed="${this._handleKeywordsChanged}"
              ></keyword-input>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Description</label>
              <textarea 
                placeholder="Describe the image..."
                .value="${this._description}"
                @input="${e=>this._description=e.target.value}"
              ></textarea>
            </div>
          </div>

          <!-- Media & Technical Info (Right) -->
          <div class="media-section">
            <div 
              class="upload-section"
              style="${this._editingImage?`cursor: default; border-style: solid; opacity: 0.9;`:``}"
              @click="${this._editingImage?null:this._handleUploadClick}"
              @dragover="${this._editingImage?e=>e.preventDefault():this._onDragOver}"
              @dragleave="${this._editingImage?null:this._onDragLeave}"
              @drop="${this._editingImage?e=>e.preventDefault():this._onDrop}"
            >
              ${this._uploadedImage?A`
                <img 
                  src="api/image/${this._uploadedImage.id}/thumbnail" 
                  class="preview-image"
                  alt="Thumbnail preview"
                >
              `:A`
                <span class="material-icons">
                  ${this._isUploading?`sync`:`cloud_upload`}
                </span>
                <p>${this._isUploading?`Uploading...`:`Drag & Drop Image`}</p>
                <p class="hint">${this._isUploading?`This may take a moment`:`or click to browse your files`}</p>
              `}
              ${this._editingImage?``:A`
                <input 
                  type="file" 
                  style="display: none;" 
                  accept="image/*"
                  @change="${this._onFileChange}"
                >
              `}
            </div>

            <div class="grid" style="margin-top: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Dimensions</label>
                <input 
                  type="text" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?`${this._uploadedImage.dimensions.width} × ${this._uploadedImage.dimensions.height} px`:``}"
                >
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Format</label>
                <input 
                  type="text" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?.file_type||``}"
                >
              </div>
            </div>

            <div class="form-group" style="margin-top: 1rem; margin-bottom: 0;">
              <label>Colour Depth</label>
              <input 
                type="text" 
                readonly 
                placeholder="Auto-detected"
                .value="${this._uploadedImage?.colour_depth||``}"
              >
            </div>
          </div>
        </div>

        <div slot="footer" class="footer-actions">
          <button 
            class="secondary" 
            @click="${this._handleCancel}"
          >
            Cancel
          </button>
          <button 
            ?disabled="${this._isUploading||!this._uploadedImage||!this._imageName.trim()}"
            @click="${this._handleSave}"
          >
            <span class="material-icons">save</span>
            ${this._editingImage?`Update Image`:`Save Image`}
          </button>
        </div>
      </base-dialog>
    `}};V([I(),B(`design:type`,Object)],pa.prototype,`_uploadedImage`,void 0),V([I(),B(`design:type`,Object)],pa.prototype,`_editingImage`,void 0),V([I(),B(`design:type`,Object)],pa.prototype,`_isUploading`,void 0),V([I(),B(`design:type`,Object)],pa.prototype,`_error`,void 0),V([I(),B(`design:type`,Array)],pa.prototype,`_keywords`,void 0),V([I(),B(`design:type`,String)],pa.prototype,`_imageName`,void 0),V([I(),B(`design:type`,String)],pa.prototype,`_artist`,void 0),V([I(),B(`design:type`,String)],pa.prototype,`_collection`,void 0),V([I(),B(`design:type`,String)],pa.prototype,`_description`,void 0),pa=V([P(`image-dialog`)],pa);var ma,ha=class extends N{constructor(...e){super(...e),this._config={title:`Confirm`,message:`Are you sure?`,confirmText:`Confirm`,type:`primary`,buttons:[]},this._resolve=null}static{this.styles=[z,h`
      :host {
        display: block;
      }
      p { color: var(--text-muted); line-height: 1.5; margin: 0; }
    `]}show(e){return this._config={...this._config,...e},(this.shadowRoot?.querySelector(`base-dialog`)).show(),new Promise(e=>{this._resolve=e})}_handleChoice(e){this._resolve?.(e),(this.shadowRoot?.querySelector(`base-dialog`)).close()}render(){return A`
      <base-dialog .title="${this._config.title}">
        <p>${this._config.message}</p>
        <div slot="footer">
          ${this._config.buttons&&this._config.buttons.length>0?this._config.buttons.map(e=>A`
                <button class="${e.type||`primary`}" @click="${()=>this._handleChoice(e.value)}">
                  ${e.text}
                </button>
              `):A`
                <button class="secondary" @click="${()=>this._handleChoice(!1)}">Cancel</button>
                <button class="${this._config.type===`danger`?`danger`:`primary`}" @click="${()=>this._handleChoice(!0)}">
                  ${this._config.confirmText}
                </button>
              `}
        </div>
      </base-dialog>
    `}};V([I(),B(`design:type`,typeof(ma=typeof Required<`u`&&Required)==`function`?ma:Object)],ha.prototype,`_config`,void 0),ha=V([P(`confirm-dialog`)],ha);var ga=class extends N{constructor(...e){super(...e),this._name=``,this._layout=``,this.layouts=[],this.scene=null}static{this.styles=[z,h`
      :host {
        display: block;
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 14px;
        transition: all 0.2s;
      }
      input:focus {
        outline: none;
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
      }
      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `]}async show(e=null){this.scene=e,this._name=e?e.name:``,this._layout=e?e.layout:this.layouts.length>0?this.layouts[0].id:``,await this.updateComplete,(this.shadowRoot?.querySelector(`base-dialog`)).show()}_handleSubmit(){if(!this._name.trim()||!this._layout)return;let e=this.scene?`save`:`create`;this.dispatchEvent(new CustomEvent(e,{detail:{name:this._name,layout:this._layout,id:this.scene?.id},bubbles:!0,composed:!0})),(this.shadowRoot?.querySelector(`base-dialog`)).close()}_handleCancel(){(this.shadowRoot?.querySelector(`base-dialog`)).close()}render(){return A`
      <base-dialog .title="${this.scene?`Edit Smart Scene`:`Create New Smart Scene`}">
        <div class="form-group">
          <label>Scene Name</label>
          <input 
            type="text" 
            placeholder="e.g. Movie Night" 
            .value="${this._name}"
            @input="${e=>this._name=e.target.value}"
            @keyup="${e=>e.key===`Enter`&&this._handleSubmit()}"
            autofocus
          >
        </div>

        <div class="form-group">
          <label>Layout</label>
          <select 
            .value="${this._layout}"
            @change="${e=>this._layout=e.target.value}"
            ?disabled="${this.scene!==null}"
            title="${this.scene?`Layout cannot be changed after creation`:``}"
          >
            ${this.layouts.length===0?A`<option value="" disabled>No layouts available</option>`:``}
            ${this.layouts.map(e=>A`
              <option value="${e.id}" ?selected="${this._layout===e.id}">${e.name}</option>
            `)}
          </select>
          ${this.scene?A`
            <div style="font-size: 11px; color: #888; margin-top: 4px;">
              <span class="material-icons" style="font-size: 12px; vertical-align: middle;">info</span>
              Layout is fixed after a scene is created.
            </div>
          `:``}
        </div>

        <div slot="footer" class="footer-actions">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" ?disabled="${!this._name.trim()||!this._layout}" @click="${this._handleSubmit}">
            <span class="material-icons">${this.scene?`save`:`add`}</span>
            ${this.scene?`Save Changes`:`Create Scene`}
          </button>
        </div>
      </base-dialog>
    `}};V([I(),B(`design:type`,Object)],ga.prototype,`_name`,void 0),V([I(),B(`design:type`,Object)],ga.prototype,`_layout`,void 0),V([F({type:Array}),B(`design:type`,Array)],ga.prototype,`layouts`,void 0),V([F({type:Object}),B(`design:type`,Object)],ga.prototype,`scene`,void 0),ga=V([P(`scene-dialog`)],ga);var _a=class extends N{constructor(...e){super(...e),this.item=null}static{this.styles=[z,h`
      :host {
        display: block;
      }
      .placeholder-content {
        padding: 1rem;
        text-align: center;
        color: var(--text-muted);
      }
      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `]}async show(e){this.item=e,await this.updateComplete,(this.shadowRoot?.querySelector(`base-dialog`)).show()}_handleOk(){(this.shadowRoot?.querySelector(`base-dialog`)).close()}_handleCancel(){(this.shadowRoot?.querySelector(`base-dialog`)).close()}render(){return A`
      <base-dialog title="Item Settings">
        <div class="placeholder-content">
          <p>This is a placeholder for scene item settings.</p>
          <p>Item ID: ${this.item?.id}</p>
        </div>

        <div slot="footer" class="footer-actions">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" @click="${this._handleOk}">Ok</button>
        </div>
      </base-dialog>
    `}};V([F({type:Object}),B(`design:type`,Object)],_a.prototype,`item`,void 0),_a=V([P(`scene-item-settings-dialog`)],_a);var va,ya,ba=class extends N{constructor(...e){super(...e),this.scenes=[],this.activeScene=null,this.viewMode=`graphical`,this._selectedDisplayIds=[],this._selectedItemId=null}static{this.styles=[z,h`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .scenes-sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .sidebar-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
      }
      .sidebar-item {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .sidebar-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
      }
      .sidebar-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      .sidebar-item-icon {
        color: #888;
      }
      .sidebar-item.selected .sidebar-item-icon {
        color: var(--primary-colour);
      }
      .sidebar-item-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-colour);
      }
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        width: 100%;
      }
      .toolbar-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .settings-button {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }
      .settings-button:hover {
        background: #e4e6e9;
        border-color: #ccc;
        color: #333;
      }
      .settings-button .material-icons {
        font-size: 20px;
      }
      
      /* Scene Workspace Layout */
      .workspace {
        display: flex;
        height: 100%;
        width: 100%;
        background: #f0f2f5;
        overflow: hidden;
      }
      .preview-pane {
        flex: 1;
        min-width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .content-pane {
        width: 320px;
        background: white;
        border-left: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: -2px 0 10px rgba(0,0,0,0.02);
        z-index: 2;
      }
      .pane-header {
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
      }
      .pane-title {
        font-weight: 800;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-muted);
      }
      .pane-toolbar {
        display: flex;
        gap: 0.4rem;
      }
      .tool-button {
        width: 34px;
        height: 34px;
        padding: 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid #efefef;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        color: #555;
      }
      .tool-button:hover:not(:disabled) {
        background: var(--bg-light);
        border-color: var(--primary-colour);
        color: var(--primary-colour);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(3, 169, 244, 0.15);
      }
      .tool-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        background: #f5f5f5;
        border-color: #eee;
      }
      .tool-button .material-icons {
        font-size: 18px;
      }
      .content-list {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem 1rem;
      }
      .placeholder-item {
        padding: 1rem;
        border: 1px solid #f0f0f0;
        border-radius: 12px;
        margin-bottom: 1rem;
        background: white;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid #f0f0f0;
        cursor: default;
      }
      .placeholder-item:hover {
        border-color: #e0e0e0;
        border-left-color: var(--primary-colour);
        box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        transform: translateX(4px);
      }
      .placeholder-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        border-left-color: var(--primary-colour);
        box-shadow: 0 4px 12px rgba(3, 169, 244, 0.1);
      }
      .placeholder-item-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #aaa;
      }
      .placeholder-item-info {
        flex: 1;
      }
      .placeholder-item-name {
        font-weight: 700;
        font-size: 13px;
        color: var(--text-colour);
        margin-bottom: 3px;
      }
      .placeholder-item-details {
        font-size: 11px;
        color: #999;
        font-weight: 500;
      }
      .empty-content-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #bbb;
        text-align: center;
        gap: 1rem;
      }
      .empty-content-state .material-icons {
        font-size: 48px;
        opacity: 0.3;
      }
      .empty-content-state span {
        font-size: 13px;
        font-weight: 500;
      }
    `]}updated(e){super.updated(e),e.has(`activeScene`)&&(this.dispatchEvent(new CustomEvent(`can-delete-change`,{detail:{canDelete:!!this.activeScene},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`dirty-state-change`,{detail:{isDirty:!1},bubbles:!0,composed:!0})),this._selectedItemId=null)}addNew(){this._sceneDialog.show()}async requestDelete(){this.activeScene&&this.dispatchEvent(new CustomEvent(`delete-scene`,{detail:{scene:this.activeScene},bubbles:!0,composed:!0}))}get isDirty(){return!1}get canDelete(){return!!this.activeScene}_handleSelect(e){this._selectedDisplayIds=[],this._selectedItemId=null,this.dispatchEvent(new CustomEvent(`select-scene`,{detail:{scene:e},bubbles:!0,composed:!0}))}_handleItemClick(e){this._selectedItemId=e}_handleItemDoubleClick(e){this._selectedItemId=e.id,this._itemSettingsDialog.show(e)}_handleEditItem(){let e=this.state?.activeScene||this.activeScene;if(!e||!this._selectedItemId)return;let t=e.items?.find(e=>e.id===this._selectedItemId);t&&this._itemSettingsDialog.show(t)}async _handleCreateSingleDisplayItems(){let e=this.state?.activeScene||this.activeScene;if(!e||this._selectedDisplayIds.length===0)return;let t=this._selectedDisplayIds.map(e=>({id:crypto.randomUUID(),type:`image`,displays:[e],images:[]})),n=e.items||[];await this.state.updateScene(e.id,{items:[...n,...t]}),this._selectedDisplayIds=[],this.state.showMessage(`Added ${t.length} display item(s)`,`success`)}async _handleCreateMultiDisplayItem(){let e=this.state?.activeScene||this.activeScene;if(!e||this._selectedDisplayIds.length<=1)return;let t={id:crypto.randomUUID(),type:`tile`,displays:[...this._selectedDisplayIds],images:[]},n=e.items||[];await this.state.updateScene(e.id,{items:[...n,t]}),this._selectedDisplayIds=[],this.state.showMessage(`Added multi-display tile item`,`success`)}render(){let e=this.state?.scenes||this.scenes||[],t=this.state?.activeScene||this.activeScene,n=t?this.state?.layouts.find(e=>e.id===t.layout):null;return A`
      <section-layout>
        <div slot="left-bar" class="scenes-sidebar">
          <div class="sidebar-items">
            ${e.map(e=>A`
              <div 
                class="sidebar-item ${t?.id===e.id?`selected`:``}" 
                @click="${()=>this._handleSelect(e)}"
              >
                <span class="material-icons sidebar-item-icon">landscape</span>
                <span class="sidebar-item-name">${e.name}</span>
              </div>
            `)}
            ${e.length===0?A`
              <div style="padding: 1rem; color: #666; font-size: 14px; text-align: center;">
                No scenes found.
              </div>
            `:``}
          </div>
        </div>

        <div slot="right-top-bar" class="toolbar">
          ${t?A`
            <button id="btn-scene-settings" class="settings-button" @click="${()=>this._sceneDialog.show(t)}" title="Scene Settings">
              <span class="material-icons">settings</span>
            </button>
            <div class="toolbar-title">
              <span>${t.name}</span>
            </div>
          `:A`
            <div class="toolbar-title">Smart Scenes Toolbar</div>
          `}
        </div>

        ${this.viewMode===`yaml`&&t?A`
          <yaml-editor
            slot="right-main"
            .data="${t}"
            .schemaName="Scene"
            @data-update="${e=>this.state.updateScene(t.id,e.detail)}"
          ></yaml-editor>
        `:t&&n?A`
          <div slot="right-main" class="workspace">
            <div class="preview-pane">
              <layout-editor
                .width_mm="${n.canvas_width_mm}"
                .height_mm="${n.canvas_height_mm}"
                .items="${n.items}"
                .displayTypes="${this.state.displayTypes}"
                .readOnly="${!0}"
                .selectedIds="${this._selectedDisplayIds}"
                @selection-change="${e=>this._selectedDisplayIds=e.detail.ids}"
              ></layout-editor>
            </div>
            
            <div class="content-pane">
              <div class="pane-header">
                <div class="pane-title">Scene Content</div>
                <div class="pane-toolbar">
                  <button 
                    class="tool-button" 
                    title="New Single Display" 
                    ?disabled="${this._selectedDisplayIds.length<1}"
                    @click="${this._handleCreateSingleDisplayItems}"
                  >
                    <span class="material-icons">add_photo_alternate</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="New Multi-Display (Tiled)"
                    ?disabled="${this._selectedDisplayIds.length<2}"
                    @click="${this._handleCreateMultiDisplayItem}"
                  >
                    <span class="material-icons">grid_view</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="Edit Item"
                    ?disabled="${!this._selectedItemId}"
                    @click="${this._handleEditItem}"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="Delete Item"
                    ?disabled="${!this._selectedItemId}"
                  >
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
              
              <div class="content-list">
                ${t.items?.map((e,t)=>A`
                  <div 
                    class="placeholder-item ${this._selectedItemId===e.id?`selected`:``}"
                    @click="${()=>this._handleItemClick(e.id)}"
                    @dblclick="${()=>this._handleItemDoubleClick(e)}"
                  >
                    <div class="placeholder-item-icon">
                      <span class="material-icons">
                        ${e.type===`image`?`image`:`grid_on`}
                      </span>
                    </div>
                    <div class="placeholder-item-info">
                      <div class="placeholder-item-name">Scene Item #${t+1}</div>
                      <div class="placeholder-item-details">
                        Displays: ${e.displays.map(e=>{let t=n.items.find(t=>t.id===e);return this.state.displayTypes.find(e=>e.id===t?.display_type_id)?.name||e}).join(`, `)} • ${e.type.charAt(0).toUpperCase()+e.type.slice(1)}
                      </div>
                    </div>
                  </div>
                `)}
                
                ${!t.items||t.items.length===0?A`
                  <div class="empty-content-state">
                    <span class="material-icons">post_add</span>
                    <span>No scene items. Select displays in the layout and click "+" to add them.</span>
                  </div>
                `:``}
              </div>
            </div>
          </div>
        `:A`
          <empty-view 
            slot="right-main"
            title="Smart Scenes"
            icon="landscape"
            message="${t?n?``:`Layout for "${t.name}" not found.`:`Compose complex scenes by combining layouts, images and live data.`}"
          ></empty-view>
        `}
      </section-layout>
      <scene-dialog 
        .layouts="${this.state?.layouts||[]}"
        @create="${e=>this.state.createScene(e.detail.name,e.detail.layout)}"
        @save="${e=>this.state.updateScene(e.detail.id,{name:e.detail.name,layout:e.detail.layout})}"
      ></scene-dialog>
      <scene-item-settings-dialog></scene-item-settings-dialog>
    `}};V([F({type:Object}),B(`design:type`,Object)],ba.prototype,`state`,void 0),V([F({type:Array}),B(`design:type`,Array)],ba.prototype,`scenes`,void 0),V([F({type:Object}),B(`design:type`,Object)],ba.prototype,`activeScene`,void 0),V([F({type:String}),B(`design:type`,String)],ba.prototype,`viewMode`,void 0),V([I(),B(`design:type`,Array)],ba.prototype,`_selectedDisplayIds`,void 0),V([I(),B(`design:type`,Object)],ba.prototype,`_selectedItemId`,void 0),V([L(`scene-dialog`),B(`design:type`,typeof(va=ga!==void 0&&ga)==`function`?va:Object)],ba.prototype,`_sceneDialog`,void 0),V([L(`scene-item-settings-dialog`),B(`design:type`,typeof(ya=_a!==void 0&&_a)==`function`?ya:Object)],ba.prototype,`_itemSettingsDialog`,void 0),ba=V([P(`scenes-view`)],ba);var xa,Sa,Ca,wa,Ta,Ea,Da=class extends N{constructor(...e){super(...e),this.state=new Ge(this),this._isDirty=!1,this._canDelete=!1}static{this.styles=h`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    main {
      flex: 1;
      display: flex;
      background-color: #f0f2f5;
      overflow: hidden;
    }
  `}get _activeView(){return this.state.activeSection===`layouts`?this._layoutsView:this.state.activeSection===`display-types`?this._displayTypesView:this.state.activeSection===`images`?this._imagesView:this.state.activeSection===`scenes`?this._scenesView:null}updated(e){super.updated(e),e.has(`activeSection`)&&this._updateHeaderState()}_updateHeaderState(){let e=this._activeView;e?(this._isDirty=e.isDirty,this._canDelete=e.canDelete):(this._isDirty=!1,this._canDelete=!1)}async _handleSave(){await this._activeView?.save()}async _handleDiscard(){let e=this.state.activeSection===`layouts`?`layout`:`display type`;await this._confirmDialog.show({title:`Discard Changes?`,message:`Are you sure you want to discard all unsaved changes to this ${e}?`,confirmText:`Discard`,type:`danger`})&&(await this._activeView?.discard(),this.state.showMessage(`Changes discarded`,`info`))}async _onHeaderAddItem(){this.state.activeSection===`images`?this._imageDialog.show():this.state.activeSection===`display-types`?this.state.selectDisplayType(null):await this._activeView?.addNew()}async _onHeaderDeleteItem(){await this._activeView?.requestDelete()}async _onDeleteLayout(e){await this._confirmDialog.show({title:`Delete Layout?`,message:`Are you sure you want to permanently remove "${e.detail.layout.name}"? This action cannot be undone.`,confirmText:`Delete`,type:`danger`})&&await this.state.deleteLayout(e.detail.layout)}async _onDeleteDisplayType(e){await this._confirmDialog.show({title:`Delete Display Type?`,message:`Are you sure you want to permanently remove "${e.detail.name}"? This action cannot be undone.`,confirmText:`Delete`,type:`danger`})&&await this.state.deleteDisplayType(e.detail)}async _onDeleteScene(e){await this._confirmDialog.show({title:`Delete Scene?`,message:`Are you sure you want to permanently remove "${e.detail.scene.name}"? This action cannot be undone.`,confirmText:`Delete`,type:`danger`})&&(await this.state.deleteScene(e.detail.scene),this._updateHeaderState())}async _onDeleteImage(e){await this._confirmDialog.show({title:`Delete Image?`,message:`Are you sure you want to permanently remove "${e.detail.image.name}"? This action cannot be undone.`,confirmText:`Delete`,type:`danger`})&&(await this.state.deleteImage(e.detail.image),this._updateHeaderState())}async _onDeleteItem(e){let t=this.state.activeLayout?.items.find(t=>t.id===e.detail.id),n=this.state.displayTypes.find(e=>e.id===t?.display_type_id);await this._confirmDialog.show({title:`Delete display?`,message:`Are you sure you want to remove the "${n?.name||`unknown`}" display from this layout?`,confirmText:`Delete`,type:`danger`})&&(this.state.updateActiveLayout({items:this.state.activeLayout?.items.filter(t=>t.id!==e.detail.id)}),this.state.selectedItemId===e.detail.id&&this.state.selectItem(null),this.state.showMessage(`Item deleted`,`success`))}render(){return A`
      <app-header 
        .connected="${this.state.connected}"
        .message="${this.state.message}"
        .isSaving="${this.state.isSaving}"
        .isDirty="${this._isDirty}"
        .viewMode="${this.state.viewMode}"
        .activeSection="${this.state.activeSection}"
        .canDelete="${this._canDelete}"
        @save-changes="${this._handleSave}"
        @discard-changes="${this._handleDiscard}"
        @delete-item="${this._onHeaderDeleteItem}"
        @add-item="${this._onHeaderAddItem}"
        @toggle-view-mode="${()=>this.state.setViewMode(this.state.viewMode===`graphical`?`yaml`:`graphical`)}"
        @set-section="${e=>this.state.setSection(e.detail)}"
      ></app-header>

      ${this.state.activeSection===`layouts`?this._renderLayoutsSection():this.state.activeSection===`display-types`?this._renderDisplayTypesSection():this.state.activeSection===`images`?this._renderImagesSection():this.state.activeSection===`scenes`?this._renderScenesSection():this._renderEmptySection()}

      <item-settings-dialog 
        @save="${e=>this.state.updateItem(e.detail.id,e.detail.updates)}"
        @delete="${e=>this._onDeleteItem(e)}"
      ></item-settings-dialog>
      <image-dialog @image-saved="${()=>this.state.refreshImages()}"></image-dialog>
      <confirm-dialog></confirm-dialog>
    `}_renderLayoutsSection(){return A`
      <layouts-view
        .layouts="${this.state.layouts}"
        .displayTypes="${this.state.displayTypes}"
        .activeLayout="${this.state.activeLayout}"
        .selectedItemId="${this.state.selectedItemId}"
        .viewMode="${this.state.viewMode}"
        .isSaving="${this.state.isSaving}"
        @switch-layout="${e=>this.state.switchLayout(e.detail)}"
        @update-active-layout="${e=>this.state.updateActiveLayout(e.detail.updates,e.detail.replace)}"
        @update-item="${e=>this.state.updateItem(e.detail.id,e.detail.updates)}"
        @select-item="${e=>this.state.selectItem(e.detail.id)}"
        @edit-item="${e=>this._itemDialog.show(this.state.activeLayout?.items.find(t=>t.id===e.detail.id),this.state.displayTypes)}"
        @delete-item="${this._onDeleteItem}"
        @delete-layout="${this._onDeleteLayout}"
        @save-layout="${async()=>{await this.state.saveActiveLayout(),this._layoutsView&&this._layoutsView.resetBaseline()}}"
        @dirty-state-change="${e=>this._isDirty=e.detail.isDirty}"
        @can-delete-change="${e=>this._canDelete=e.detail.canDelete}"
        @show-message="${e=>this.state.showMessage(e.detail.text,e.detail.type)}"
        @set-section="${e=>this.state.setSection(e.detail)}"
        @delete-display-type="${this._onDeleteDisplayType}"
      ></layouts-view>
    `}_renderDisplayTypesSection(){return A`
      <display-types-view
        .displayTypes="${this.state.displayTypes}"
        .selectedId="${this.state.selectedDisplayTypeId}"
        .viewMode="${this.state.viewMode}"
        .isAdding="${this.state.isAddingNew}"
        @select-display-type="${e=>this.state.selectDisplayType(e.detail.id)}"
        @save="${e=>this.state.saveDisplayType(e.detail.displayType)}"
        @delete-display-type="${this._onDeleteDisplayType}"
        @dirty-state-change="${e=>this._isDirty=e.detail.isDirty}"
        @can-delete-change="${e=>this._canDelete=e.detail.canDelete}"
        @request-confirmation="${async e=>{let t=await this._confirmDialog.show(e.detail.config);e.detail.callback(t)}}"
      ></display-types-view>
    `}_renderImagesSection(){return A`
      <images-view
        .images="${this.state.images}"
        .selectedImageId="${this.state.selectedImageId}"
        @edit-image="${e=>this._imageDialog.show(e.detail.image)}"
        @image-click="${e=>{this.state.selectImage(e.detail.image.id),this._updateHeaderState()}}"
        @delete-image="${this._onDeleteImage}"
        @filter-change="${e=>this.state.refreshImages(e.detail)}"
      ></images-view>
    `}_renderScenesSection(){return A`
      <scenes-view
        .state="${this.state}"
        .scenes="${this.state.scenes}"
        .activeScene="${this.state.activeScene}"
        .viewMode="${this.state.viewMode}"
        @select-scene="${e=>{this.state.switchScene(e.detail.scene),this._updateHeaderState()}}"
        @delete-scene="${this._onDeleteScene}"
        @can-delete-change="${e=>this._canDelete=e.detail.canDelete}"
        @dirty-state-change="${e=>this._isDirty=e.detail.isDirty}"
      ></scenes-view>
    `}_renderEmptySection(){let e={scenes:{title:`Smart Scenes`,icon:`landscape`,message:`Compose complex scenes by combining layouts, images and live data.`}}[this.state.activeSection];return A`
      <section-layout>
        <div slot="left-bar" style="padding: 1rem; color: #666; font-size: 14px;">
          Sidebar for ${e.title} section coming soon.
        </div>
        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          ${e.title} Toolbar
        </div>
        <empty-view 
          slot="right-main"
          .title="${e.title}"
          .icon="${e.icon}"
          .message="${e.message}"
        ></empty-view>
      </section-layout>
    `}};V([I(),B(`design:type`,Object)],Da.prototype,`_isDirty`,void 0),V([I(),B(`design:type`,Object)],Da.prototype,`_canDelete`,void 0),V([L(`item-settings-dialog`),B(`design:type`,typeof(xa=fa!==void 0&&fa)==`function`?xa:Object)],Da.prototype,`_itemDialog`,void 0),V([L(`image-dialog`),B(`design:type`,typeof(Sa=pa!==void 0&&pa)==`function`?Sa:Object)],Da.prototype,`_imageDialog`,void 0),V([L(`confirm-dialog`),B(`design:type`,typeof(Ca=ha!==void 0&&ha)==`function`?Ca:Object)],Da.prototype,`_confirmDialog`,void 0),V([L(`display-types-view`),B(`design:type`,typeof(wa=oa!==void 0&&oa)==`function`?wa:Object)],Da.prototype,`_displayTypesView`,void 0),V([L(`layouts-view`),B(`design:type`,typeof(Ta=ia!==void 0&&ia)==`function`?Ta:Object)],Da.prototype,`_layoutsView`,void 0),V([L(`images-view`),B(`design:type`,Object)],Da.prototype,`_imagesView`,void 0),V([L(`scenes-view`),B(`design:type`,typeof(Ea=ba!==void 0&&ba)==`function`?Ea:Object)],Da.prototype,`_scenesView`,void 0),Da=V([P(`app-root`)],Da);