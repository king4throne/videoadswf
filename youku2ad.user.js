﻿// ==UserScript==
// @name        opengghost2
// @namespace   opengghost2
// @include     http://*/*
// @version     1
// ==/UserScript==
// 
//JSON.stringify(object) 将object转json 格式字符串 
//
// {
//            find: /http:\/\/www\.iqiyi\.com\/player\/\d+\/player\.swf/i,
//            replace: iqiyi
//            },
//            {
//            find: /http:\/\/player\.video\.i?qiyi\.com\/([^\/]*)\/.*/i,
//            replace: iqiyi5 + '?vid=$1'
//            },
//
//
//

(function () {
    //Goddamn sina weibo.
    //'use strict';
    var  huburl= 'https://github.com/king4throne/videoadswf/raw/master/';
    var Global = this;
    var window = this.window||window;
    var unsafeWindow = unsafeWindow;
    var unsafeGlobal = unsafeWindow; // Let's assume that...
    var loader =huburl+ 'loader.swf';
    var ku6 = huburl+'ku6.swf';
    var iqiyi = huburl+'iqiyi.swf';
    var iqiyi5 = huburl+'iqiyi5.swf';
    var nplayer =huburl+'nplayer.swf';
    var TudouYoukuPlayer_Homer_9 =huburl+'TudouYoukuPlayer_Homer_9.swf';
    var PortalPlayer_7 =huburl+'PortalPlayer_7.swf';
    var TudouVideoPlayer_Homer_238 =huburl+'TudouVideoPlayer_Homer_238.swf';

    var CONSTANTS = {
        PLAYER_DOM:    ['object','embed','iframe'],
        PLAYERS: [
	    {
            find: /http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*\/v\.swf/i,
            replace: loader + '?showAd=0&VideoIDS=$1'
            },
	   
	    {
		find: /http:\/\/player\.ku6cdn\.com\/default\/common\/player\/\d*\/player\.swf/,
		replace: ku6
	    },
            {
                find: /^http:\/\/static\.youku\.com\/.*?q?(player|loader)(_[^.]+)?\.swf/,
                replace: loader
            },
            {
                find: /^http:\/\/js\.tudouui\.com\/.*?\/TudouYoukuPlayer_Homer[^.]*?\.swf/,
                replace: TudouYoukuPlayer_Homer_9.swf
            },
            {
                find: /^http:\/\/js\.tudouui\.com\/.*?\/PortalPlayer[^.]*?\.swf/,
                replace: PortalPlayer_7.swf
            },
            {
                find: /^http:\/\/js\.tudouui\.com\/.*?\/TudouVideoPlayer_Homer_[^.]*?.swf/,
                replace: TudouVideoPlayer_Homer_238.swf
            },
            {
                find: /^http:\/\/player\.youku\.com\/player\.php\//,
                replace: 'http://localhost/opengg/player.php/'
            },
            {
                find: /^http:\/\/dp\.tudou\.com\/nplayer[^.]*?\.swf|http:\/\/js\.tudouui\.com\/doupao\/nplayer[^.]*?\.swf/,
                replace: nplayer.swf
            },
            {
                find: /^http:\/\/www.tudou.com\/(([a-z]|programs)\/.*)/,
                replace: 'http://localhost/opengg/td.php/$1'
            }
        ],
        SHARE_DOM: '#panel_share input,input#copyInput.txt',
        SHARES: [
            {
                find: /http:\/\/player\.youku\.com\/player\.php\//,
                replace: 'http://localhost/opengg/player.php/'
            },
            {
                find: /http:\/\/www.tudou.com\/(.*v\.swf)/,
                replace: 'http://localhost/opengg/td.php/$1'
            }
        ],
        TIPS_HOLDER: '#miniheader,#gTop',
        TIPS: '<div class="tips_container">OpenGG.Clean.Player \u5DF2\u542F\u7528&emsp;<span class="tips_toggleWide">\u5bbd\u5c4f/\u7a84\u5c4f&emsp;</span><a href="http://opengg.me/781/opengg-clean-player/" style="color:blue" target="_blank">\u53CD\u9988</a>&emsp;<a href="http://opengg.me/donation/" style="color:red" title="\u6211\u8981\u6350\u52A9\u6B64\u9879\u76EE" target="_blank">\u6350\u52A9</a><a class="tips_close" href="#" style="color:red">X</a></div>',
        STYLE: '.playBox_thx #player.player,.playBox_thx #player.player object{min-height:' + Math.max(Global.innerHeight * 0.6, 580) + 'px !important}.tips_container{position:absolute;top:3em;padding:1em 2em;right:50px;color:green;opacity:0.4;background:#ddd;z-index:999999}.tips_container:hover{opacity:0.8}.tips_container .tips_toggleWide{color:red;cursor:pointer;display:none}.tips_close{position:absolute;right:3px;top:3px}',
        NODEINSERTED_HACK: '@-moz-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@-webkit-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@-o-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}embed,object{animation-duration:.001s;-ms-animation-duration:.001s;-moz-animation-duration:.001s;-webkit-animation-duration:.001s;-o-animation-duration:.001s;animation-name:nodeInserted;-ms-animation-name:nodeInserted;-moz-animation-name:nodeInserted;-webkit-animation-name:nodeInserted;-o-animation-name:nodeInserted;}',
        TOGGLE_BTN: '.tips_container .tips_toggleWide'
    };
    var DONE = [];

    //***********
    //
    //UTIL
    //
    var UTIL = {
        addCss: function (str) {
            var style = document.createElement('style');
            style.textContent = str;
            document.head.appendChild(style);
        },
        proxy: function(callback, imports) {
            if(typeof (unsafeWindow)!=='undefined' && Global.navigator && Global.navigator.userAgent.indexOf('Firefox')!==-1){
                callback.call(unsafeGlobal, unsafeGlobal, imports);
                return;
            }
            var script = document.createElement('script');
            script.textContent = '(' + callback.toString() + ')(this.window||window, '+JSON.stringify(imports)+');';
            document.body.appendChild(script);
        },
        procFlash: function (elem, fn) {
            if (DONE.indexOf(elem) !== -1) {
                return;
            }
            if (fn(elem)) {
                DONE.push(elem);
            }
        },
        forEach: function (arr, callback) {
            if (this.isArrayLike(arr)) {
                if (Array.prototype.forEach) {
                    Array.prototype.forEach.call(arr, callback);
                } else {
                    var i = 0;
                    for (i = 0; i < arr.length; ++i) {
                        callback.call(arr[i], arr[i]);
                    }
                }
            }
        },
        isArrayLike: function (obj) {
            if (typeof obj !== 'object') {
                return false;
            }
            var types = ['Array', 'NodeList', 'HTMLCollection'];
            var i = 0;
            for (i = 0; i < types.length; ++i) {
                if (Object.prototype.toString.call(obj).indexOf(types[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
    };//UTIL end
//***************



    var STORE;
    //
    //***********
    //function
    //
    //
    (function(){
        var isStorage = true;
        if(!Global.localStorage){
            isStorage = false;
        }else{
            try{
                var key = String(Math.random());
                localStorage.setItem(key,'test');
                if(localStorage.getItem(key)!=='test'){
                    throw 'not equal';
                }
                localStorage.removeItem(key);
            }catch(e){
                isStorage=false;
            }
        }
        STORE = {
            getItem: function(key){
                if(isStorage){
                    return localStorage.getItem(key);
                }
            },
            setItem: function(key, value){
                if(isStorage){
                    localStorage.setItem(key, value);
                }
            }
        };
    })();
    //*****************

    //**************
    //function onLoad 
    //
    //
    //
    function onLoad(tagNameList, fn) {
        var lowerTagNameList = [];
        UTIL.forEach(tagNameList, function(a){
            lowerTagNameList.push(a.toLowerCase());
        });
        function onDOMNodeInsertedHandler(e) {
            var target = e.target;
            if (target.nodeType === 1 && lowerTagNameList.indexOf(target.nodeName.toLowerCase())!==-1) {
                fn(target);
            }
        }
        function onAnimationStartHandler(e) {
            if (e.animationName === 'nodeInserted') {
                var target = e.target;
                if (target.nodeType === 1 && lowerTagNameList.indexOf(target.nodeName.toLowerCase())!==-1) {
                    fn(target);
                }
            }
        }
        function animationNotSupported(){
            var style = document.createElement('div').style;
            var arr = ['animation', 'MozAnimation', 'webkitAnimation', 'OAnimation'];
            for(var i =0;i<arr.length;++i){
                if( arr[i] in style){
                    return false;
                }
            }
            return true;
        }
        /* animationstart not invoked in background tabs of chrome 21 */
        var all = document.querySelectorAll(lowerTagNameList.join(','));
        for(var i=0;i<all.length;++i){
            fn(all[i]);
        }
        UTIL.addCss(CONSTANTS.NODEINSERTED_HACK);
        /*Firefox*/
        document.body.addEventListener('animationstart', onAnimationStartHandler, false);
        /*/Firefox*/
        /*Chrome*/
        document.body.addEventListener('webkitAnimationEnd', onAnimationStartHandler, false);
        /*/Chrome*/
        /*Opera 12+*/
        document.body.addEventListener('oAnimationStart', onAnimationStartHandler, false);
        /*/Opera 12+*/
        /*IE, but I never tested this*/
        document.body.addEventListener('msAnimationStart', onAnimationStartHandler, false);
        /*/IE, but I never tested this*/
        if (animationNotSupported()) {
            /*Old fashion, slower maybe*/
            document.body.addEventListener('DOMNodeInserted', onDOMNodeInsertedHandler, false);
            var matches = document.body.querySelectorAll(lowerTagNameList.join(','));
            UTIL.forEach(matches, function (elem) {
                fn(elem);
            });
        }
    }
    
    //******** ******
    //
    //function tips()
    //
    function tips() {
        var holder = document.body.querySelector(CONSTANTS.TIPS_HOLDER);
        if (holder) {
            var div = document.createElement('div');
            // if (document.defaultView.getComputedStyle(holder, null).getPropertyValue('position') !== 'relative') {
            //     div.style.position = 'relative';
            // }
            div.innerHTML = CONSTANTS.TIPS;
            div.querySelector('.tips_close').addEventListener('click',function(e){
                if(e.preventDefault){
                    e.preventDefault();
                }
                div.parentNode.removeChild(div);
                return false;
            },false);
            holder.appendChild(div);
            UTIL.addCss(CONSTANTS.STYLE);
        }
    }


//***
//
//

    function share(elem) {
        var pairs = CONSTANTS.SHARES;
        UTIL.forEach(pairs, function (item) {
            elem.value = elem.value.replace(item.find, item.replace);
        });
    }
    function setTHX(opt){
        var player = document.querySelector('object#movie_player');
        var parent = document.body.querySelector('.playBox');
        var wide = document.body.querySelector('.playBox_thx');
        if(opt&&player){
            UTIL.proxy(function(Global, imports){
                var player = Global.document.querySelector('object#movie_player');
                player.setTHX(imports.opt);
            },{
                opt: opt
            });
            switch(opt){
                case 'on':
                    if (parent && !wide) {
                        parent.className += ' playBox_thx';
                    }
                    break;
                case 'off':
                    if (parent && wide) {
                        parent.className = 'playBox';
                    }
                    break;
            }
        }
    }
    var CONTROLLER = [
        {
            host: '.',
            fn: function () {
                var known = [];
                onLoad(CONSTANTS.PLAYER_DOM, function (elem) {
                    var attrs = ['data', 'src'];
                    var players = CONSTANTS.PLAYERS;
                    var reloaded = false;
                    if(known.indexOf(elem)!==-1){
                        return;
                    }
                    UTIL.forEach(attrs, function (attr) {
                        UTIL.forEach(players, function (player) {
                            var find = player.find;
                            var replace = player.replace;
                            var value = elem[attr];
                            var movie = elem.querySelector('param[name="movie"]');

                            if(movie&&movie.value){
                                movie.value = movie.value.replace(find,replace);
                                reloaded = true;
                            }
                            if (value && find.test(value)) {
                                var nextSibling = elem.nextSibling;
                                var parentNode = elem.parentNode;
                                var clone = elem.cloneNode(true);
                                clone[attr] = value.replace(find, replace);
                                parentNode.removeChild(elem);
                                parentNode.insertBefore(clone, nextSibling);
                                //Baidu tieba shit.
                                if(clone && getComputedStyle(clone).display==='none' && clone.style){
                                    clone.style.display='block';
                                }
                                reloaded = true;
                            }
                        });
                    });
                    if(reloaded){
                        known.push(elem);
                    }
                });
            }
        },
        {
            host: 'youku.com',
            fn: function () {
                var matches = document.body.querySelectorAll(CONSTANTS.SHARE_DOM);
                UTIL.forEach(matches, share);

                tips();

                if(STORE.getItem('THX')==='on'){
                    setTHX(STORE.getItem('THX'));
                }

                var toggle = document.body.querySelector(CONSTANTS.TOGGLE_BTN);
                if(toggle){
                    toggle.style.display='inline';
                    toggle.addEventListener('click',function(){
                        STORE.setItem('THX',STORE.getItem('THX')==='on'?'off':'on');
                        setTHX(STORE.getItem('THX'));
                    },false);
                }
            }
        },
        {
            host: 'tudou.com',
            fn: function () {
                UTIL.proxy(function(Global, imports){
                    function hack(){
                        var TUI_copyToClip = Global.TUI&&Global.TUI.copyToClip;
                        if(TUI_copyToClip&&TUI_copyToClip.toString().indexOf('arguments')===-1){
                            Global.TUI.copyToClip = function () {
                                var matches = document.body.querySelectorAll(imports.selector);
                                UTIL.forEach(matches, share);
                                TUI_copyToClip.apply(Global.TUI, arguments);
                            };
                            clearInterval(inter);
                        }
                    }
                    var inter = setInterval(hack,100);
                    try{
                        Global.playerEx.event.fire('scale',[true]);
                    }catch(e){}
                },{
                    selector: CONSTANTS.SHARE_DOM
                });
                tips();
                var tudouPlayer = document.body.querySelector('#playerObject');
                var normalDom = document.querySelector('.normal');
                if (tudouPlayer && normalDom) {
                    normalDom.className = normalDom.className.replace('normal','widescreen');
                }
            }
        }
    ];
    var host = location.host;
    function PROC(item) {
        if (host.indexOf(item.host) !== -1) {
            item.fn();
            return;
        }
    }
    UTIL.forEach(CONTROLLER, PROC);
})();



