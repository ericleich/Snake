var g=void 0,k=!0,n=null,p=!1,r,s=this;function aa(a,b){var c=a.split("."),d=s;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var f;c.length&&(f=c.shift());)!c.length&&b!==g?d[f]=b:d=d[f]?d[f]:d[f]={}}
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function u(a){return"string"==typeof a}function ba(a){var b=typeof a;return"object"==b&&a!=n||"function"==b}var v="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),ca=0,da=Date.now||function(){return+new Date};function ea(a){var a=String(a),b=a.indexOf(".");-1==b&&(b=a.length);b=Math.max(0,2-b);return Array(b+1).join("0")+a};var w=Array.prototype,fa=w.indexOf?function(a,b,c){return w.indexOf.call(a,b,c)}:function(a,b,c){c=c==n?0:0>c?Math.max(0,a.length+c):c;if(u(a))return!u(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},ga=w.forEach?function(a,b,c){w.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=u(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)};var ha={ga:["BC","AD"],fa:["Before Christ","Anno Domini"],ia:"JFMAMJJASOND".split(""),pa:"JFMAMJJASOND".split(""),ha:"January February March April May June July August September October November December".split(" "),oa:"January February March April May June July August September October November December".split(" "),la:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),ra:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),va:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
ta:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),na:"Sun Mon Tue Wed Thu Fri Sat".split(" "),sa:"Sun Mon Tue Wed Thu Fri Sat".split(" "),ja:"SMTWTFS".split(""),qa:"SMTWTFS".split(""),ma:["Q1","Q2","Q3","Q4"],ka:["1st quarter","2nd quarter","3rd quarter","4th quarter"],da:["AM","PM"],ea:["EEEE, MMMM d, y","MMMM d, y","MMM d, y","M/d/yy"],ua:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],X:6,wa:[5,6],Y:5};function x(a,b,c){"number"==typeof a?(this.e=new Date(a,b||0,c||1),ia(this,c||1)):ba(a)?(this.e=new Date(a.getFullYear(),a.getMonth(),a.getDate()),ia(this,a.getDate())):(this.e=new Date(da()),this.e.setHours(0),this.e.setMinutes(0),this.e.setSeconds(0),this.e.setMilliseconds(0))}r=x.prototype;r.O=ha.X;r.P=ha.Y;r.p=function(){var a=new x(this.e);a.O=this.O;a.P=this.P;return a};r.getFullYear=function(){return this.e.getFullYear()};r.getYear=function(){return this.getFullYear()};r.getMonth=function(){return this.e.getMonth()};
r.getDate=function(){return this.e.getDate()};r.getUTCHours=function(){return this.e.getUTCHours()};r.M=function(a){return this.getYear()==a.getYear()&&this.getMonth()==a.getMonth()&&this.getDate()==a.getDate()};r.toString=function(){return[this.getFullYear(),ea(this.getMonth()+1),ea(this.getDate())].join("")+""};function ia(a,b){a.getDate()!=b&&a.e.setUTCHours(a.e.getUTCHours()+(a.getDate()<b?1:-1))}r.valueOf=function(){return this.e.valueOf()};var z,ja,A,ka;function la(){return s.navigator?s.navigator.userAgent:n}ka=A=ja=z=p;var B;if(B=la()){var ma=s.navigator;z=0==B.indexOf("Opera");ja=!z&&-1!=B.indexOf("MSIE");A=!z&&-1!=B.indexOf("WebKit");ka=!z&&!A&&"Gecko"==ma.product}var na=z,C=ja,D=ka,E=A,oa=s.navigator,pa=-1!=(oa&&oa.platform||"").indexOf("Mac"),qa;
a:{var F="",G;if(na&&s.opera)var ra=s.opera.version,F="function"==typeof ra?ra():ra;else if(D?G=/rv\:([^\);]+)(\)|;)/:C?G=/MSIE\s+([^\);]+)(\)|;)/:E&&(G=/WebKit\/(\S+)/),G)var sa=G.exec(la()),F=sa?sa[1]:"";if(C){var ta,ua=s.document;ta=ua?ua.documentMode:g;if(ta>parseFloat(F)){qa=String(ta);break a}}qa=F}var va={};
function H(a){var b;if(!(b=va[a])){b=0;for(var c=String(qa).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var h=c[e]||"",i=d[e]||"",l=RegExp("(\\d*)(\\D*)","g"),j=RegExp("(\\d*)(\\D*)","g");do{var q=l.exec(h)||["","",""],m=j.exec(i)||["","",""];if(0==q[0].length&&0==m[0].length)break;b=((0==q[1].length?0:parseInt(q[1],10))<(0==m[1].length?0:parseInt(m[1],10))?-1:(0==q[1].length?0:parseInt(q[1],
10))>(0==m[1].length?0:parseInt(m[1],10))?1:0)||((0==q[2].length)<(0==m[2].length)?-1:(0==q[2].length)>(0==m[2].length)?1:0)||(q[2]<m[2]?-1:q[2]>m[2]?1:0)}while(0==b)}b=va[a]=0<=b}return b}var wa={};function I(){return wa[9]||(wa[9]=C&&!!document.documentMode&&9<=document.documentMode)};var xa;!C||I();!D&&!C||C&&I()||D&&H("1.9.1");C&&H("9");function J(a,b){this.width=a;this.height=b}r=J.prototype;r.p=function(){return new J(this.width,this.height)};r.toString=function(){return"("+this.width+" x "+this.height+")"};r.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};r.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};r.scale=function(a){this.width*=a;this.height*=a;return this};function K(a){return u(a)?document.getElementById(a):a}function ya(a){for(var b;b=a.firstChild;)a.removeChild(b)}function L(a){return 9==a.nodeType?a:a.ownerDocument||a.document}function M(a,b){if("textContent"in a)a.textContent=b;else if(a.firstChild&&3==a.firstChild.nodeType){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=b}else ya(a),a.appendChild(L(a).createTextNode(b))}function N(a){this.H=a||s.document||document}N.prototype.createElement=function(a){return this.H.createElement(a)};
N.prototype.createTextNode=function(a){return this.H.createTextNode(a)};N.prototype.appendChild=function(a,b){a.appendChild(b)};
N.prototype.append=function(a,b){function c(a){a&&f.appendChild(u(a)?d.createTextNode(a):a)}for(var d=L(a),f=a,e=arguments,h=1;h<e.length;h++){var i=e[h],l=i,j=t(l);if(("array"==j||"object"==j&&"number"==typeof l.length)&&!(ba(i)&&0<i.nodeType)){l=ga;a:{if((j=i)&&"number"==typeof j.length){if(ba(j)){j="function"==typeof j.item||"string"==typeof j.item;break a}if("function"==t(j)){j="function"==typeof j.item;break a}}j=p}if(j)if(j=i.length,0<j){for(var q=Array(j),m=0;m<j;m++)q[m]=i[m];i=q}else i=[];
l(i,c)}else c(i)}};function za(a,b){if("FORM"==a.tagName)for(var c=a.elements,d=0;a=c[d];d++)za(a,b);else b==k&&a.blur(),a.disabled=b}function Aa(a){var b=a.type;if(b===g)return n;switch(b.toLowerCase()){case "checkbox":case "radio":return a.checked?a.value:n;case "select-one":return b=a.selectedIndex,0<=b?a.options[b].value:n;case "select-multiple":for(var b=[],c,d=0;c=a.options[d];d++)c.selected&&b.push(c.value);return b.length?b:n;default:return a.value!==g?a.value:n}};!C||I();var Ba=!C||I(),Ca=C&&!H("8");!E||H("528");D&&H("1.9b")||C&&H("8")||na&&H("9.5")||E&&H("528");D&&!H("8")||C&&H("9");function O(a,b){this.type=a;this.currentTarget=this.target=b}O.prototype.J=p;O.prototype.defaultPrevented=p;O.prototype.ba=k;O.prototype.preventDefault=function(){this.defaultPrevented=k;this.ba=p};function Da(a){Da[" "](a);return a}Da[" "]=function(){};function P(a,b){a&&this.D(a,b)}function Ea(){}Ea.prototype=O.prototype;P.ca=O.prototype;P.prototype=new Ea;r=P.prototype;r.target=n;r.relatedTarget=n;r.offsetX=0;r.offsetY=0;r.clientX=0;r.clientY=0;r.screenX=0;r.screenY=0;r.button=0;r.keyCode=0;r.charCode=0;r.ctrlKey=p;r.altKey=p;r.shiftKey=p;r.metaKey=p;r.aa=p;r.N=n;
r.D=function(a,b){var c=this.type=a.type;O.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(D){var f;a:{try{Da(d.nodeName);f=k;break a}catch(e){}f=p}f||(d=n)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=E||a.offsetX!==g?a.offsetX:a.layerX;this.offsetY=E||a.offsetY!==g?a.offsetY:a.layerY;this.clientX=a.clientX!==g?a.clientX:a.pageX;this.clientY=a.clientY!==g?a.clientY:a.pageY;this.screenX=a.screenX||
0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.aa=pa?a.metaKey:a.ctrlKey;this.state=a.state;this.N=a;a.defaultPrevented&&this.preventDefault();delete this.J};
r.preventDefault=function(){P.ca.preventDefault.call(this);var a=this.N;if(a.preventDefault)a.preventDefault();else if(a.returnValue=p,Ca)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};function Fa(){}var Ga=0;r=Fa.prototype;r.key=0;r.u=p;r.L=p;r.D=function(a,b,c,d,f,e){if("function"==t(a))this.S=k;else if(a&&a.handleEvent&&"function"==t(a.handleEvent))this.S=p;else throw Error("Invalid listener argument");this.F=a;this.V=b;this.src=c;this.type=d;this.capture=!!f;this.Q=e;this.L=p;this.key=++Ga;this.u=p};r.handleEvent=function(a){return this.S?this.F.call(this.Q||this.src,a):this.F.handleEvent.call(this.F,a)};var Q={},R={},S={},T={};
function Ha(a,b,c,d,f){if(b)if("array"==t(b))for(var e=0;e<b.length;e++)Ha(a,b[e],c,d,f);else{var d=!!d,h=R;b in h||(h[b]={j:0,t:0});h=h[b];d in h||(h[d]={j:0,t:0},h.j++);var h=h[d],i=a[v]||(a[v]=++ca),l;h.t++;if(h[i]){l=h[i];for(e=0;e<l.length;e++)if(h=l[e],h.F==c&&h.Q==f){if(h.u)break;return}}else l=h[i]=[],h.j++;var j=Ia,q=Ba?function(a){return j.call(q.src,q.key,a)}:function(a){a=j.call(q.src,q.key,a);if(!a)return a},e=q;e.src=a;h=new Fa;h.D(c,e,a,b,d,f);c=h.key;e.key=c;l.push(h);Q[c]=h;S[i]||
(S[i]=[]);S[i].push(h);a.addEventListener?(a==s||!a.Z)&&a.addEventListener(b,e,d):a.attachEvent(b in T?T[b]:T[b]="on"+b,e)}else throw Error("Invalid event type");}function Ja(a,b,c,d){if(!d.G&&d.U){for(var f=0,e=0;f<d.length;f++)d[f].u?d[f].V.src=n:(f!=e&&(d[e]=d[f]),e++);d.length=e;d.U=p;0==e&&(delete R[a][b][c],R[a][b].j--,0==R[a][b].j&&(delete R[a][b],R[a].j--),0==R[a].j&&delete R[a])}}
function Ka(a,b,c,d,f){var e=1,b=b[v]||(b[v]=++ca);if(a[b]){a.t--;a=a[b];a.G?a.G++:a.G=1;try{for(var h=a.length,i=0;i<h;i++){var l=a[i];l&&!l.u&&(e&=La(l,f)!==p)}}finally{a.G--,Ja(c,d,b,a)}}return Boolean(e)}
function La(a,b){if(a.L){var c=a.key;if(Q[c]){var d=Q[c];if(!d.u){var f=d.src,e=d.type,h=d.V,i=d.capture;f.removeEventListener?(f==s||!f.Z)&&f.removeEventListener(e,h,i):f.detachEvent&&f.detachEvent(e in T?T[e]:T[e]="on"+e,h);f=f[v]||(f[v]=++ca);if(S[f]){var h=S[f],l=fa(h,d);0<=l&&w.splice.call(h,l,1);0==h.length&&delete S[f]}d.u=k;if(d=R[e][i][f])d.U=k,Ja(e,i,f,d);delete Q[c]}}}return a.handleEvent(b)}
function Ia(a,b){if(!Q[a])return k;var c=Q[a],d=c.type,f=R;if(!(d in f))return k;var f=f[d],e,h;if(!Ba){var i;if(!(i=b))a:{i=["window","event"];for(var l=s;e=i.shift();)if(l[e]!=n)l=l[e];else{i=n;break a}i=l}e=i;i=k in f;l=p in f;if(i){if(0>e.keyCode||e.returnValue!=g)return k;a:{var j=p;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(q){j=k}if(j||e.returnValue==g)e.returnValue=k}}j=new P;j.D(e,this);e=k;try{if(i){for(var m=[],$=j.currentTarget;$;$=$.parentNode)m.push($);h=f[k];h.t=h.j;for(var y=m.length-
1;!j.J&&0<=y&&h.t;y--)j.currentTarget=m[y],e&=Ka(h,m[y],d,k,j);if(l){h=f[p];h.t=h.j;for(y=0;!j.J&&y<m.length&&h.t;y++)j.currentTarget=m[y],e&=Ka(h,m[y],d,p,j)}}else e=La(c,j)}finally{m&&(m.length=0)}return e}d=new P(b,this);return e=La(c,d)};function U(a,b,c,d){this.top=a;this.right=b;this.bottom=c;this.left=d}U.prototype.p=function(){return new U(this.top,this.right,this.bottom,this.left)};U.prototype.toString=function(){return"("+this.top+"t, "+this.right+"r, "+this.bottom+"b, "+this.left+"l)"};function V(a,b){var c=L(a);return c.defaultView&&c.defaultView.getComputedStyle&&(c=c.defaultView.getComputedStyle(a,n))?c[b]||c.getPropertyValue(b)||"":""}function Ma(){var a=20;"number"==typeof a&&(a=Math.round(a)+"px");return a}function Na(a){a=a.style;a.position="relative";C&&!H("8")?(a.zoom="1",a.display="inline"):a.display=D?H("1.9a")?"inline-block":"-moz-inline-box":"inline-block"}
function Oa(a,b,c,d){if(/^\d+px?$/.test(b))return parseInt(b,10);var f=a.style[c],e=a.runtimeStyle[c];a.runtimeStyle[c]=a.currentStyle[c];a.style[c]=b;b=a.style[d];a.style[c]=f;a.runtimeStyle[c]=e;return b}function Pa(a,b){return Oa(a,a.currentStyle?a.currentStyle[b]:n,"left","pixelLeft")}var Qa={thin:2,medium:4,thick:6};
function Ra(a,b){if("none"==(a.currentStyle?a.currentStyle[b+"Style"]:n))return 0;var c=a.currentStyle?a.currentStyle[b+"Width"]:n;return c in Qa?Qa[c]:Oa(a,c,"left","pixelLeft")};function W(){this.q=[]}W.prototype.g=0;W.prototype.h=0;function Sa(a){if(a.g!=a.h){var b=a.q[a.g];delete a.q[a.g];a.g++;return b}}W.prototype.clear=function(){this.h=this.g=this.q.length=0};W.prototype.B=function(){return this.q.slice(this.g,this.h)};function X(){this.k=k;this.l=p;this.w=10;this.a=this.A=this.map=n;this.R=p;this.v={};Ha(document,"keydown",this.$,p,this)}r=X.prototype;r.$=function(a){if(a)switch(a.keyCode){case 37:case 38:case 39:case 40:if(!this.l){var b=this.a;switch(a.keyCode){case 37:b.s!=Ta&&(b.m=3);break;case 38:2!=b.s&&(b.m=1);break;case 39:3!=b.s&&(b.m=Ta);break;case 40:1!=b.s&&(b.m=2)}}break;case 32:Ua(this);break;case 76:this.k&&this.T();break;case 78:this.k&&this.W();break;case 83:this.k||this.K()}};
r.W=function(){this.I=K("gameBoard");this.z=K("snakeSpeedForm");this.l=this.k=p;var a;a:if(a=this.z.elements.snakeSpeed,a.type)a=Aa(a);else{for(var b=0;b<a.length;b++){var c=Aa(a[b]);if(c){a=c;break a}}a=n}this.w=a;za(this.z,k);K("finalScore").style.display="none";M(K("counter"),"0");a=this.I;var c=L(a),b=C&&a.currentStyle,d;if(d=b)d="CSS1Compat"==(c?new N(L(c)):xa||(xa=new N)).H.compatMode&&"auto"!=b.width&&"auto"!=b.height&&!b.boxSizing;if(d)c=Oa(a,b.width,"width","pixelWidth"),a=Oa(a,b.height,
"height","pixelHeight"),a=new J(c,a);else{b=new J(a.offsetWidth,a.offsetHeight);if(C){c=Pa(a,"paddingLeft");d=Pa(a,"paddingRight");var f=Pa(a,"paddingTop"),e=Pa(a,"paddingBottom"),c=new U(f,d,e,c)}else c=V(a,"paddingLeft"),d=V(a,"paddingRight"),f=V(a,"paddingTop"),e=V(a,"paddingBottom"),c=new U(parseFloat(f),parseFloat(d),parseFloat(e),parseFloat(c));C?(d=Ra(a,"borderLeft"),f=Ra(a,"borderRight"),e=Ra(a,"borderTop"),a=Ra(a,"borderBottom"),a=new U(e,f,a,d)):(d=V(a,"borderLeftWidth"),f=V(a,"borderRightWidth"),
e=V(a,"borderTopWidth"),a=V(a,"borderBottomWidth"),a=new U(parseFloat(e),parseFloat(f),parseFloat(a),parseFloat(d)));a=new J(b.width-a.left-c.left-c.right-a.right,b.height-a.top-c.top-c.bottom-a.bottom)}this.f=a.scale(0.05).floor();Va(this);this.map=new Wa(this.f);a=new SnakeCoordinates(Math.floor(this.f.height/2),Math.floor(this.f.width/2));Xa(this.map,Y,a);this.a=new Z(1,a);Ya(this);this.move()};
function Va(a){ya(a.I);for(var b,c,d=0;d<a.f.height;d++){b=document.createElement("DIV");b.id="row"+d;for(var f=0;f<a.f.width;f++)c=document.createElement("DIV"),c.id="spot"+d+"-"+f,c.style.height=Ma(),c.style.width=Ma(),Na(c),b.appendChild(c);a.I.appendChild(b)}}
function Ya(a,b){for(var c=b?b.c:Math.floor(Math.random()*a.f.width),d=b?b.b:Math.floor(Math.random()*a.f.height);!Za(a.map,c,d);)c=Math.floor(Math.random()*a.f.width),d=Math.floor(Math.random()*a.f.height);a.A=new SnakeCoordinates(c,d)}
r.move=function(){if(!this.l){var a=this.a.move();switch($a(this.map,a)){case ab:Sa(this.a.d);bb(this);return;case cb:M(K("counter"),this.a.d.h-this.a.d.g-1+"");Ya(this);break;default:this.map.clear(Sa(this.a.d))}a=Xa(this.map,Y,a);a===db||a===Y?bb(this):setTimeout("snakeManager.move()",1E3/this.w)}};
function bb(a){a.k=k;M(K("finalScoreNum"),a.a.d.h-a.a.d.g-1+"");Na(K("finalScore"));za(a.z,p);var b=document.createElement("DIV");b.className="previous-scores-text";M(b,a.a.d.h-a.a.d.g-1+"");K("previousScores").appendChild(b)}r.K=function(){this.k||(this.v.snake=this.a.p(),this.v.snakeSpeed=this.w,this.v.gemCoordinates=this.A.p(),this.R=k)};
r.T=function(){if(this.k&&this.R){this.l=this.k=p;this.a=this.v.snake;this.w=this.v.snakeSpeed;this.A=this.v.gemCoordinates;this.K();for(var a=this.z.elements.snakeSpeed,b=0;b<a.length;b++)a[b].checked=parseInt(a[b].value,10)!=this.w?p:k;za(this.z,k);K("finalScore").style.display="none";M(K("counter"),this.a.d.h-this.a.d.g-1+"");Va(this);this.map=new Wa(this.f);Ya(this,this.A);ga(this.a.B(),function(a){this.a.head!==g&&this.a.head.M(a)?Xa(this.map,Y,a):Xa(this.map,db,a)},this);Ua(this)}};
function Ua(a){a.k||(a.l=!a.l,K("pauseButton").value=a.l?"Resume":"Pause",K("pauseGameOverlay").style.display=a.l?"block":"none",a.l||setTimeout("snakeManager.move()",1E3/a.w))}
function Z(a,b){this.id=a;switch((new x).getMonth()){case 9:this.o="url('images/head_halloween.png')";this.i="url('images/body_halloween.gif')";this.n="url('images/gem_halloween.png')";break;case 10:this.o="url('images/head_turkey.png')";this.i="url('images/body_turkey.png')";this.n="url('images/gem_turkey.png')";break;case 11:this.o="url('images/head_christmas.png')";this.i="url('images/body_christmas.png')";this.n="url('images/gem_christmas.png')";break;default:this.o="url('images/head_default.jpg')",
this.i="url('images/body_default.jpg')",this.n="url('images/gem_default.png')"}this.s=this.m=Ta;this.head=b;var c=this.d=new W;c.q[c.h++]=b}var Ta=4;Z.prototype.p=function(){var a=new Z(this.id,this.head);a.m=this.m;a.s=this.s;a.d=new W;ga(this.d.B(),function(b){a.append(b)},this);return a};Z.prototype.B=function(){return this.d.B()};Z.prototype.append=function(a){var b=this.head;this.head=a;var c=this.d;c.q[c.h++]=a;return b};
Z.prototype.move=function(){var a=this.head.p();switch(this.m){case 3:a.b--;break;case 1:a.c--;break;case Ta:a.b++;break;case 2:a.c++}this.head=a;var b=this.d;b.q[b.h++]=a;this.s=this.m;return a};SnakeCoordinates=function(a,b){this.c=a;this.b=b};SnakeCoordinates.prototype.p=function(){return new SnakeCoordinates(this.c,this.b)};SnakeCoordinates.prototype.M=function(a){return this.c===a.c&&this.b===a.b};
function Wa(a){this.size=a;this.r=[];for(a=0;a<this.size.height;a++)this.r[a]=[];switch((new x).getMonth()){case 9:this.o="url('images/head_halloween.png')";this.i="url('images/body_halloween.gif')";this.n="url('images/gem_halloween.png')";break;case 10:this.o="url('images/head_turkey.png')";this.i="url('images/body_turkey.png')";this.n="url('images/gem_turkey.png')";break;case 11:this.o="url('images/head_christmas.png')";this.i="url('images/body_christmas.png')";this.n="url('images/gem_christmas.png')";
break;default:this.o="url('images/head_default.jpg')",this.i="url('images/body_default.jpg')",this.n="url('images/gem_default.png')"}}function $a(a,b){var c=ab;eb(a,b)&&(c=a.r[b.c][b.b]||fb);return c}
function Xa(a,b,c){var d=$a(a,c);if(eb(a,c)){a.r[c.c][c.b]=b;var f=K("spot"+c.c+"-"+c.b);switch(b){case fb:f.style.backgroundImage="";break;case Y:f.style.backgroundImage=a.o;a.C&&$a(a,a.C)===Y&&(K("spot"+a.C.c+"-"+a.C.b).style.backgroundImage=a.i);a.C=c;break;case db:f.style.backgroundImage=a.i}}return d}Wa.prototype.clear=function(a){eb(this,a)&&(this.r[a.c][a.b]=fb,K("spot"+a.c+"-"+a.b).style.backgroundImage="")};
function Za(a,b,c){var d=new SnakeCoordinates(b,c);if(!eb(a,d)||!(a.r[d.c][d.b]!=db&&a.r[d.c][d.b]!=Y))return p;a.r[b][c]=cb;K("spot"+b+"-"+c).style.backgroundImage=a.n;a.ya=b;a.xa=c;return k}function eb(a,b){return 0<=b.c&&b.c<a.size.height&&0<=b.b&&b.b<a.size.width}var ab=0,fb=1,Y=2,db=3,cb=4;aa("Snake",Z);aa("SnakeManager",X);aa("SnakeState",{});X.prototype.move=X.prototype.move;X.prototype.startGame=X.prototype.W;X.prototype.saveGame=X.prototype.K;X.prototype.loadGame=X.prototype.T;