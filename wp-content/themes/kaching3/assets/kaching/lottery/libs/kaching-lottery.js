if (typeof Object.prototype.extend !== 'function') {
    Object.defineProperty(Object.prototype, "extend", {
        value: function(obj) {
            for (var i in obj) {
              if (obj.hasOwnProperty(i)) {
                 this[i] = obj[i];
              }
           }
        },
        enumerable : false
    });
}
(function(window){
    'use strict';
    function KachingLottery(element, settings) {
        var _ = this;
        _.options = {
            totalColumn: 8,
            elementH: 440,
            imageSrc: kachingAppConfig.wpTemplateUri + '/assets/kaching/lottery/libs/imagestrip@2x.png'
        };
        _.timer = undefined;
        _.element = element;
        if (_.element.length === 1) {
            _.element = _.element.get(0);
        }
        if (settings && typeof settings === 'object') {
            _.settings = settings;
        }
        _.initControl();
    }
    KachingLottery.prototype.initControl = function() {
        var _ = this;
        if (_.element && typeof _.element !== 'object') {
            return;
        }
        _.options.extend(_.settings);
        for (var i=0; i<_.options.totalColumn; i++) {
            var child = document.createElement('div');
            var image = document.createElement('img');
            child.className = 'lottery-item';
            image.className = 'lottery-item-image';
            image.src = _.options.imageSrc;
            child.append(image);
            _.element.append(child);
        }
        _.options.itemH = _.options.elementH / 10;
        _.options.ignoreList = [];
        _.startAnimation();
    };
    KachingLottery.prototype.resetImageObj = function(imgObj) {
        imgObj.style.position= 'relative';
        imgObj.style.left = '0px';
        imgObj.style.top = '0px';
    }
    KachingLottery.prototype.stopItem = function(index, number) {
        var _ = this;
        var interval = 1;
        var imageList = document.getElementsByClassName('lottery-item-image');
        var item = imageList[index];
        var currentPos = parseInt(item.style.top.slice(0,-2));
        var stopPos = _.options.itemH * number;
        var i = 0;
        if (!_.options.ignoreList.includes(index)) {
            _.options.ignoreList.push(index);
        }
        var stop = new Promise(
            function (resolve, reject) {
                (function decelerate() {
                    i++;
                    if (Math.abs(currentPos) == stopPos) {
                        resolve(true);
                        return;
                    } else {
                        if (Math.abs(currentPos) == _.options.elementH - _.options.itemH) {
                            currentPos = 0;
                        }
                        currentPos--;
                        item.style.top = currentPos + 'px';
                        window.setTimeout(decelerate, Math.floor(i/10));
                    }
                })();
            }
        );
        return stop;
    }
    KachingLottery.prototype.startAnimation = function(currentPos) {
        var _ = this;
        var pos = currentPos || 0;
        var imageList = document.getElementsByClassName('lottery-item-image');
        for (var i=0; i<imageList.length; i++) {
            _.resetImageObj(imageList[i]);
        }
        _.timer = setInterval(moveAll, 1);
        function moveAll() {
            if (Math.abs(pos) == _.options.elementH - _.options.itemH) {
                for (var i=0; i<imageList.length; i++) {
                    if (_.options.ignoreList && _.options.ignoreList.includes(i)) {
                        continue;
                    }
                    _.resetImageObj(imageList[i]);
                }
                pos = 0;
            }
            pos-=5.5;
            for (var i=0; i<imageList.length; i++) {
                if (_.options.ignoreList && _.options.ignoreList.includes(i)) {
                    continue;
                }
                imageList[i].style.top = pos + 'px';
            }
        }
    }
    return window.KachingLottery = KachingLottery;
})(window);
