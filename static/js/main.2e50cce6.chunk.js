(this["webpackJsonpgithub-friends"]=this["webpackJsonpgithub-friends"]||[]).push([[0],{206:function(n,e,t){n.exports={container:"Graph_container__2Kff7"}},214:function(n,e,t){},232:function(n,e){},234:function(n,e){},243:function(n,e){},245:function(n,e){},270:function(n,e){},271:function(n,e){},276:function(n,e){},278:function(n,e){},285:function(n,e){},304:function(n,e){},343:function(n,e){},460:function(n,e,t){"use strict";t.r(e);var r=t(13),o=t.n(r),i=t(204),c=t.n(i),a=(t(214),t(31)),u=t(22),f=t.n(u),l=t(44),s=t(34),d=t(205),h=Object(d.client)("2dc94bbd29451f930a2ffd7c2607c11d7030f8d7"),p=function(n){var e=h.user(n);return{apiGetInfo:function(){var n=Object(l.a)(f.a.mark((function n(){var t,r,o;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.infoAsync();case 2:return t=n.sent,r=Object(a.a)(t,1),o=r[0],n.abrupt("return",o);case 6:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),apiGetFollowers:function(){var n=Object(l.a)(f.a.mark((function n(){var t,r,o,i,c=arguments;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t=c.length>0&&void 0!==c[0]?c[0]:1,n.next=3,e.followersAsync({page:t,per_page:100});case 3:return r=n.sent,o=Object(a.a)(r,1),i=o[0],n.abrupt("return",i.map((function(n){return n.login})));case 7:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),apiGetFollowing:function(){var n=Object(l.a)(f.a.mark((function n(){var t,r,o,i,c=arguments;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t=c.length>0&&void 0!==c[0]?c[0]:1,n.next=3,e.followingAsync({page:t,per_page:100});case 3:return r=n.sent,o=Object(a.a)(r,1),i=o[0],n.abrupt("return",i.map((function(n){return n.login})));case 7:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()}},b=t(106),j=Object(b.createRegion)(0),g=function(){return j.set((function(n){return n+1}))},O=j.useValue,m=Object(b.createRegion)({follow:!0,moreThanOne:!0,all:!0}),w=m.getValue,v=m.useValue,x=function(n){n.target.checked?m.set((function(n){return{follow:!0,moreThanOne:n.moreThanOne,all:!1}})):m.set((function(n){return{follow:!1,moreThanOne:n.moreThanOne,all:!1}}))},k=function(n){n.target.checked?m.set((function(n){return{follow:n.follow,moreThanOne:!0,all:!1}})):m.set((function(n){return{follow:n.follow,moreThanOne:!1,all:!1}}))},y=function(n){n.target.checked?m.set((function(n){return{follow:!0,moreThanOne:!0,all:!0}})):m.set((function(n){return{follow:!0,moreThanOne:!0,all:!1}}))},T=Promise.resolve(),_=function(n){var e=function(){return new Promise((function(e){setTimeout((function(){e(n())}),99)}))};T=T.then(e,e)},F={},E=function(n){return s.flatten(F[n].followersList).filter((function(n){return n}))},C=function(n){return s.flatten(F[n].followingList).filter((function(n){return n}))},L=function(n){if(!F[n])return"\u521d\u59cb\u5316...";var e=E(n),t=C(n);if(e.length+t.length<F[n].info.followers+F[n].info.following){var r=((e.length+t.length)/(F[n].info.followers+F[n].info.following)*100).toFixed(0);return"\u52a0\u8f7d\u4e00\u5ea6\u597d\u53cb\u4e2d\uff0c".concat(r,"%")}var o=0,i=0,c=0;F[n].friends.forEach((function(n){if(F[n]){o++;var e=E(n),t=C(n);i+=e.length+t.length,c+=Math.min(800,F[n].info.followers),c+=Math.min(800,F[n].info.following)}}));var a=F[n].friends.length;if(o<a){var u=0===c?0:(o/a*100).toFixed(0);return"\u52a0\u8f7d\u597d\u53cb\u4fe1\u606f\u4e2d\uff0c".concat(u,"%")}var f=0===c?0:(i/c*100).toFixed(0);return"100"===f?"\u5df2\u5b8c\u6210":"\u52a0\u8f7d\u4e8c\u5ea6\u597d\u53cb\u4e2d\uff0c".concat(f,"%")},G=function(n,e){F[n]||(F[n]={info:e,followersList:[],followingList:[],friends:[]},g())},M=function(n){for(var e=p(n),t=e.apiGetFollowers,r=e.apiGetFollowing,o=Math.min(8,Math.ceil(F[n].info.followers/100)),i=Math.min(8,Math.ceil(F[n].info.following/100)),c=function(e){if(e<=o){_((function(){return t(e).then((function(t){return function(n,e,t){var r=F[n].friends;F[n].followersList[e-1]=t;var o=E(n),i=C(n);F[n].friends=s.intersection(o,i),s.isEqual(r,F[n].friends)||g()}(n,e,t)}))}))}if(e<=i){_((function(){return r(e).then((function(t){return function(n,e,t){var r=F[n].friends;F[n].followingList[e-1]=t;var o=E(n),i=C(n);F[n].friends=s.intersection(o,i),s.isEqual(r,F[n].friends)||g()}(n,e,t)}))}))}},a=1;a<=Math.max(o,i);a++)c(a)},A=function(){var n=Object(l.a)(f.a.mark((function n(e){var t;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:t=function(){F[e].friends.forEach((function(n){_((function(){return p(n).apiGetInfo().then((function(e){return G(n,e)}))}))})),F[e].friends.forEach((function(n){_((function(){return M(n)}))}))},_((function(){return p(e).apiGetInfo().then((function(n){return G(e,n)}))})),_((function(){M(e),_(t)}));case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),S=t(207),N=["me","friend","friend-friend+follower","friend-friend","friend-following+follower"],I=t(206),P=t.n(I),V=t(4),R=null,q=function(n){var e=n.nodes,t=n.links,o=Object(r.useRef)(null);return Object(r.useLayoutEffect)((function(){o.current&&(R=Object(S.a)(o.current))}),[]),Object(r.useEffect)((function(){if(R){var n=function(n,e){return n.forEach((function(n){return n.name=n.id,n})),{legend:{data:["HTMLElement","WebGL","SVG","CSS","Other"]},series:[{type:"graph",layout:"force",animation:!1,label:{position:"right",formatter:"{b}"},draggable:!0,data:n,categories:N.map((function(n){return{name:n}})),force:{edgeLength:50,repulsion:20,gravity:.2},edges:e}]}}(e,t);R.setOption(n)}}),[e,t]),Object(V.jsx)("div",{className:P.a.container,ref:o})},B=t(60),D=t.n(B),J=function(n){var e=n.id;O();var t=function(n){if(!F[n])return[[{id:n,category:"me"}],[]];var e=w(),t=[],r=[];t.push({id:n,category:"me",fixed:!0});var o=E(n),i=F[n].friends;return i.forEach((function(e){t.push({id:e,category:"friend"}),r.push({source:n,target:e})})),i.forEach((function(n){var i=F[n];i&&i.friends.forEach((function(i){r.push({source:n,target:i}),t.find((function(n){return n.id===i}))||(e.follow&&o.includes(i)?t.push({id:i,category:"friend-friend+follower"}):(e.moreThanOne&&r.filter((function(n){return n.target===i})).length>1||e.all)&&t.push({id:i,category:"friend-friend"}))}))})),[t,r]}(e),r=Object(a.a)(t,2),o=r[0],i=r[1];return Object(V.jsx)(q,{nodes:o,links:i})},K=function(n){var e=n.id;return O(),Object(V.jsx)("div",{className:D.a.description,children:L(e)})},H=function(n){var e=n.children;return Object(V.jsx)("div",{className:D.a.line,children:e})},U=function(){var n=v(),e=Object(r.useState)(""),t=Object(a.a)(e,2),o=t[0],i=t[1],c=Object(r.useState)(""),u=Object(a.a)(c,2),f=u[0],l=u[1],s=Object(r.useCallback)((function(n){l(n.target.value)}),[]),d=Object(r.useCallback)((function(){i(f),A(f)}),[f]),h=Object(r.useCallback)((function(n){"Enter"!==n.code&&"NumpadEnter"!==n.code||d()}),[d]);return Object(V.jsxs)(V.Fragment,{children:[o&&Object(V.jsx)(J,{id:o}),Object(V.jsx)("div",{className:D.a.context,children:o?Object(V.jsxs)(V.Fragment,{children:[Object(V.jsx)(H,{children:Object(V.jsx)(K,{id:o})}),Object(V.jsxs)(H,{children:[Object(V.jsx)("input",{type:"checkbox",id:"follow",disabled:n.all,checked:n.follow,onChange:x}),Object(V.jsx)("label",{htmlFor:"follow",children:"\u663e\u793a\u5173\u6ce8\u6211\u7684\u4e8c\u5ea6\u597d\u53cb"})]}),Object(V.jsxs)(H,{children:[Object(V.jsx)("input",{type:"checkbox",id:"moreThanOne",disabled:n.all,checked:n.moreThanOne,onChange:k}),Object(V.jsx)("label",{htmlFor:"moreThanOne",children:"\u663e\u793a\u6709\u4e24\u4e2a\u5171\u540c\u597d\u53cb\u7684\u4e8c\u5ea6\u597d\u53cb"})]}),Object(V.jsxs)(H,{children:[Object(V.jsx)("input",{type:"checkbox",id:"all",checked:n.all,onChange:y}),Object(V.jsx)("label",{htmlFor:"all",children:"\u663e\u793a\u6240\u6709\u4e8c\u5ea6\u597d\u53cb"})]})]}):Object(V.jsxs)(H,{children:[Object(V.jsx)("input",{placeholder:"\u8f93\u5165 id",value:f,onChange:s,onKeyDown:h}),Object(V.jsx)("span",{className:D.a.button,onClick:d,children:"\u5f00\u59cb"})]})})]})},W=function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,464)).then((function(e){var t=e.getCLS,r=e.getFID,o=e.getFCP,i=e.getLCP,c=e.getTTFB;t(n),r(n),o(n),i(n),c(n)}))};c.a.render(Object(V.jsx)(o.a.StrictMode,{children:Object(V.jsx)(U,{})}),document.getElementById("root")),W()},60:function(n,e,t){n.exports={context:"App_context__10UXM",line:"App_line__3xSd4",button:"App_button__13pio",description:"App_description__1hmAY"}}},[[460,1,2]]]);
//# sourceMappingURL=main.2e50cce6.chunk.js.map