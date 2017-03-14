(function($){
(function() {
  var picker;

  picker = angular.module('daterangepicker', []);

  picker.constant('dateRangePickerConfig', {
    clearLabel: 'Clear',
    locale: {
      separator: ' - ',
      format: 'YYYY-MM-DD'
    }
  });

  picker.directive('dateRangePicker', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', function($compile, $timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        min: '=',
        max: '=',
        model: '=ngModel',
        opts: '=options',
        clearable: '='
      },
      link: function($scope, element, attrs, modelCtrl) {
        var _clear, _init, _initBoundaryField, _mergeOpts, _picker, _setDatePoint, _setEndDate, _setStartDate, _validate, _validateMax, _validateMin, customOpts, el, opts;
        _mergeOpts = function() {
          var extend, localeExtend;
          localeExtend = angular.extend.apply(angular, Array.prototype.slice.call(arguments).map(function(opt) {
            return opt != null ? opt.locale : void 0;
          }).filter(function(opt) {
            return !!opt;
          }));
          extend = angular.extend.apply(angular, arguments);
          extend.locale = localeExtend;
          return extend;
        };
        el = $(element);
        customOpts = $scope.opts;
        opts = _mergeOpts({}, dateRangePickerConfig, customOpts);
        _picker = null;
        _clear = function() {
          _picker.setStartDate();
          return _picker.setEndDate();
        };
        _setDatePoint = function(setter) {
          return function(newValue) {
            if (_picker && newValue) {
              return setter(moment(newValue));
            }
          };
        };
        _setStartDate = _setDatePoint(function(m) {
          if (_picker.endDate < m) {
            _picker.setEndDate(m);
          }
          opts.startDate = m;
          return _picker.setStartDate(m);
        });
        _setEndDate = _setDatePoint(function(m) {
          if (_picker.startDate > m) {
            _picker.setStartDate(m);
          }
          opts.endDate = m;
          return _picker.setEndDate(m);
        });
        _validate = function(validator) {
          return function(boundary, actual) {
            if (boundary && actual) {
              return validator(moment(boundary), moment(actual));
            } else {
              return true;
            }
          };
        };
        _validateMin = _validate(function(min, start) {
          return min.isBefore(start) || min.isSame(start, 'day');
        });
        _validateMax = _validate(function(max, end) {
          return max.isAfter(end) || max.isSame(end, 'day');
        });
        modelCtrl.$formatters.push(function(objValue) {
          var f;
          f = function(date) {
            if (!moment.isMoment(date)) {
              return moment(date).format(opts.locale.format);
            } else {
              return date.format(opts.locale.format);
            }
          };
          if (opts.singleDatePicker && objValue) {
            return f(objValue);
          } else if (objValue.startDate) {
            return [f(objValue.startDate), f(objValue.endDate)].join(opts.locale.separator);
          } else {
            return '';
          }
        });
        modelCtrl.$render = function() {
          if (modelCtrl.$modelValue && modelCtrl.$modelValue.startDate) {
            _setStartDate(modelCtrl.$modelValue.startDate);
            _setEndDate(modelCtrl.$modelValue.endDate);
          } else {
            _clear();
          }
          return el.val(modelCtrl.$viewValue);
        };
        modelCtrl.$parsers.push(function(val) {
          var f, objValue, x;
          f = function(value) {
            return moment(value, opts.locale.format);
          };
          objValue = {
            startDate: null,
            endDate: null
          };
          if (angular.isString(val) && val.length > 0) {
            if (opts.singleDatePicker) {
              objValue = f(val);
            } else {
              x = val.split(opts.locale.separator).map(f);
              objValue.startDate = x[0];
              objValue.endDate = x[1];
            }
          }
          return objValue;
        });
        modelCtrl.$isEmpty = function(val) {
          return !(angular.isString(val) && val.length > 0);
        };
        _init = function() {
          var eventType, results;
          el.daterangepicker(angular.extend(opts, {
            autoUpdateInput: false
          }), function(start, end) {
            return $scope.$apply(function() {
              return $scope.model = opts.singleDatePicker ? start : {
                startDate: start,
                endDate: end
              };
            });
          });
          _picker = el.data('daterangepicker');
          results = [];
          for (eventType in opts.eventHandlers) {
            results.push(el.on(eventType, function(e) {
              var eventName;
              eventName = e.type + '.' + e.namespace;
              return $scope.$evalAsync(opts.eventHandlers[eventName]);
            }));
          }
          return results;
        };
        _init();
        $scope.$watch('model.startDate', function(n) {
          return _setStartDate(n);
        });
        $scope.$watch('model.endDate', function(n) {
          return _setEndDate(n);
        });
        _initBoundaryField = function(field, validator, modelField, optName) {
          if (attrs[field]) {
            modelCtrl.$validators[field] = function(value) {
              return value && validator(opts[optName], value[modelField]);
            };
            return $scope.$watch(field, function(date) {
              opts[optName] = date ? moment(date) : false;
              return _init();
            });
          }
        };
        _initBoundaryField('min', _validateMin, 'startDate', 'minDate');
        _initBoundaryField('max', _validateMax, 'endDate', 'maxDate');
        if (attrs.options) {
          $scope.$watch('opts', function(newOpts) {
            opts = _mergeOpts(opts, newOpts);
            return _init();
          }, true);
        }
        if (attrs.clearable) {
          $scope.$watch('clearable', function(newClearable) {
            if (newClearable) {
              opts = _mergeOpts(opts, {
                locale: {
                  cancelLabel: opts.clearLabel
                }
              });
            }
            _init();
            if (newClearable) {
              return el.on('cancel.daterangepicker', function() {
                return $scope.$apply(function() {
                  return $scope.model = opts.singleDatePicker ? null : {
                    startDate: null,
                    endDate: null
                  };
                });
              });
            }
          });
        }
        return $scope.$on('$destroy', function() {
          return _picker != null ? _picker.remove() : void 0;
        });
      }
    };
  }]);

}).call(this);

"use strict";angular.module("com.2fdevs.videogular",["ngSanitize"]).run(["$templateCache",function(a){a.put("vg-templates/vg-media-video","<video></video>"),a.put("vg-templates/vg-media-audio","<audio></audio>"),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e})}]),angular.module("com.2fdevs.videogular").constant("VG_STATES",{PLAY:"play",PAUSE:"pause",STOP:"stop"}).constant("VG_VOLUME_KEY","videogularVolume"),angular.module("com.2fdevs.videogular").controller("vgController",["$scope","$window","vgConfigLoader","vgFullscreen","VG_UTILS","VG_STATES","VG_VOLUME_KEY",function(a,b,c,d,e,f,g){var h=null,i=!1,j=!1,k=!1,l=!1;this.videogularElement=null,this.clearMedia=function(){this.mediaElement[0].src="",this.mediaElement[0].removeEventListener("canplay",this.onCanPlay.bind(this),!1),this.mediaElement[0].removeEventListener("loadedmetadata",this.onLoadMetaData.bind(this),!1),this.mediaElement[0].removeEventListener("waiting",this.onStartBuffering.bind(this),!1),this.mediaElement[0].removeEventListener("ended",this.onComplete.bind(this),!1),this.mediaElement[0].removeEventListener("playing",this.onStartPlaying.bind(this),!1),this.mediaElement[0].removeEventListener("play",this.onPlay.bind(this),!1),this.mediaElement[0].removeEventListener("pause",this.onPause.bind(this),!1),this.mediaElement[0].removeEventListener("volumechange",this.onVolumeChange.bind(this),!1),this.mediaElement[0].removeEventListener("playbackchange",this.onPlaybackChange.bind(this),!1),this.mediaElement[0].removeEventListener("timeupdate",this.onUpdateTime.bind(this),!1),this.mediaElement[0].removeEventListener("progress",this.onProgress.bind(this),!1),this.mediaElement[0].removeEventListener("seeking",this.onSeeking.bind(this),!1),this.mediaElement[0].removeEventListener("seeked",this.onSeeked.bind(this),!1),this.mediaElement[0].removeEventListener("error",this.onVideoError.bind(this),!1)},this.onRouteChange=function(){(void 0===this.clearMediaOnNavigate||this.clearMediaOnNavigate===!0)&&this.clearMedia()},this.onCanPlay=function(b){this.isBuffering=!1,a.$parent.$digest(a.vgCanPlay({$event:b})),!k&&(this.startTime>0||0===this.startTime)&&(this.seekTime(this.startTime),k=!0)},this.onVideoReady=function(){this.isReady=!0,this.autoPlay=a.vgAutoPlay,this.playsInline=a.vgPlaysInline,this.nativeFullscreen=a.vgNativeFullscreen||!0,this.cuePoints=a.vgCuePoints,this.startTime=a.vgStartTime,this.virtualClipDuration=a.vgVirtualClipDuration,this.clearMediaOnNavigate=a.vgClearMediaOnNavigate||!0,this.currentState=f.STOP,j=!0,l=this.startTime>=0&&this.virtualClipDuration>0,e.supportsLocalStorage()&&this.setVolume(parseFloat(b.localStorage.getItem(g)||"1")),a.vgConfig?c.loadConfig(a.vgConfig).then(this.onLoadConfig.bind(this)):a.vgPlayerReady({$API:this})},this.onLoadConfig=function(b){this.config=b,a.vgTheme=this.config.theme,a.vgAutoPlay=this.config.autoPlay,a.vgPlaysInline=this.config.playsInline,a.vgNativeFullscreen=this.config.nativeFullscreen,a.vgCuePoints=this.config.cuePoints,a.vgClearMediaOnNavigate=this.config.clearMediaOnNavigate,a.vgStartTime=this.config.startTime,a.vgVirtualClipDuration=this.config.virtualClipDuration,l=a.vgStartTime>=0&&a.vgVirtualClipDuration>0,a.vgPlayerReady({$API:this})},this.onLoadMetaData=function(a){this.isBuffering=!1,this.onUpdateTime(a)},this.onProgress=function(b){this.updateBuffer(b),a.$parent.$digest()},this.updateBuffer=function(a){a.target.buffered.length&&(this.buffered=a.target.buffered,this.bufferEnd=1e3*a.target.buffered.end(a.target.buffered.length-1),this.bufferEnd>this.totalTime&&(this.bufferEnd=this.totalTime))},this.onUpdateTime=function(b){var c=1e3*b.target.currentTime;this.updateBuffer(b),b.target.duration!=1/0&&null!=b.target.duration&&void 0!=b.target.duration&&1.7976931348623157e308!=b.target.duration?(l?k&&(b.target.currentTime<this.startTime||b.target.currentTime-this.startTime>this.virtualClipDuration)?this.onComplete():(this.currentTime=Math.max(0,c-1e3*this.startTime),this.totalTime=1e3*this.virtualClipDuration,this.timeLeft=1e3*this.virtualClipDuration-this.currentTime):(this.currentTime=c,this.totalTime=1e3*b.target.duration,this.timeLeft=1e3*(b.target.duration-b.target.currentTime)),this.isLive=!1):(this.currentTime=c,this.isLive=!0);var d=l?this.currentTime/1e3:b.target.currentTime,e=l?this.totalTime/1e3:b.target.duration;this.cuePoints&&this.checkCuePoints(d),a.vgUpdateTime({$currentTime:d,$duration:e}),"$apply"!=a.$$phase&&"$digest"!=a.$$phase&&a.$parent.$digest()},this.checkCuePoints=function(a){for(var b in this.cuePoints)for(var c=0,d=this.cuePoints[b].length;d>c;c++){var e=this.cuePoints[b][c],f=parseInt(a,10),g=parseInt(e.timeLapse.start,10);e.timeLapse.end||(e.timeLapse.end=e.timeLapse.start+1),a<e.timeLapse.end&&(e.$$isCompleted=!1),e.$$isDirty||f!==g||"function"!=typeof e.onEnter||(e.onEnter(a,e.timeLapse,e.params),e.$$isDirty=!0),a>e.timeLapse.start?(a<e.timeLapse.end&&(e.onUpdate&&e.onUpdate(a,e.timeLapse,e.params),e.$$isDirty||"function"!=typeof e.onEnter||e.onEnter(a,e.timeLapse,e.params)),a>=e.timeLapse.end&&e.onComplete&&!e.$$isCompleted&&(e.$$isCompleted=!0,e.onComplete(a,e.timeLapse,e.params)),e.$$isDirty=!0):(e.onLeave&&e.$$isDirty&&e.onLeave(a,e.timeLapse,e.params),e.$$isDirty=!1)}},this.onPlay=function(){this.setState(f.PLAY),a.$parent.$digest()},this.onPause=function(){var b=l?this.currentTime:this.mediaElement[0].currentTime;0==b?this.setState(f.STOP):this.setState(f.PAUSE),a.$parent.$digest()},this.onVolumeChange=function(){this.volume=this.mediaElement[0].volume,a.$parent.$digest()},this.onPlaybackChange=function(){this.playback=this.mediaElement[0].playbackRate,a.$parent.$digest()},this.onSeeking=function(b){a.vgSeeking({$currentTime:b.target.currentTime,$duration:b.target.duration})},this.onSeeked=function(b){a.vgSeeked({$currentTime:b.target.currentTime,$duration:b.target.duration})},this.seekTime=function(a,b){var c;if(b)l?(a=Math.max(0,Math.min(a,100)),c=a*this.virtualClipDuration/100,this.mediaElement[0].currentTime=this.startTime+c):(c=a*this.mediaElement[0].duration/100,this.mediaElement[0].currentTime=c);else if(l){var d=a/this.mediaElement[0].duration;c=k?this.virtualClipDuration*d:0,this.mediaElement[0].currentTime=k?this.startTime+c:this.startTime}else c=a,this.mediaElement[0].currentTime=c;this.currentTime=1e3*c},this.playPause=function(){this.mediaElement[0].paused?this.play():this.pause()},this.setState=function(b){return b&&b!=this.currentState&&(a.vgUpdateState({$state:b}),this.currentState=b),this.currentState},this.play=function(){this.mediaElement[0].play(),this.setState(f.PLAY)},this.pause=function(){this.mediaElement[0].pause(),this.setState(f.PAUSE)},this.stop=function(){try{this.mediaElement[0].pause();var a=l?this.startTime:0;this.mediaElement[0].currentTime=a,this.currentTime=a,this.buffered=[],this.bufferEnd=0,this.setState(f.STOP)}catch(b){return b}},this.toggleFullScreen=function(){d.isAvailable&&this.nativeFullscreen?this.isFullScreen?e.isMobileDevice()||d.exit():e.isMobileDevice()?e.isiOSDevice()?j?this.enterElementInFullScreen(this.mediaElement[0]):(i=!0,this.play()):this.enterElementInFullScreen(this.mediaElement[0]):this.enterElementInFullScreen(this.videogularElement[0]):(this.isFullScreen?(this.videogularElement.removeClass("fullscreen"),this.videogularElement.css("z-index","auto")):(this.videogularElement.addClass("fullscreen"),this.videogularElement.css("z-index",e.getZIndex())),this.isFullScreen=!this.isFullScreen)},this.enterElementInFullScreen=function(a){d.request(a)},this.changeSource=function(b){a.vgChangeSource({$source:b})},this.setVolume=function(c){c=Math.max(Math.min(c,1),0),a.vgUpdateVolume({$volume:c}),this.mediaElement[0].volume=c,this.volume=c,e.supportsLocalStorage()&&b.localStorage.setItem(g,c.toString())},this.setPlayback=function(b){a.vgUpdatePlayback({$playBack:b}),this.mediaElement[0].playbackRate=b,this.playback=b},this.updateTheme=function(a){var b,c,d=document.getElementsByTagName("link");if(h)for(b=0,c=d.length;c>b;b++)if(d[b].outerHTML.indexOf(h)>=0){d[b].parentNode.removeChild(d[b]);break}if(a){var e=angular.element(document).find("head"),f=!1;for(b=0,c=d.length;c>b&&!(f=d[b].outerHTML.indexOf(a)>=0);b++);f||e.append("<link rel='stylesheet' href='"+a+"'>"),h=a}},this.onStartBuffering=function(b){this.isBuffering=!0,a.$parent.$digest()},this.onStartPlaying=function(b){this.isBuffering=!1,a.$parent.$digest()},this.onComplete=function(b){a.vgComplete(),this.setState(f.STOP),this.isCompleted=!0,l&&this.stop(),a.$parent.$digest()},this.onVideoError=function(b){a.vgError({$event:b})},this.addListeners=function(){this.mediaElement[0].addEventListener("canplay",this.onCanPlay.bind(this),!1),this.mediaElement[0].addEventListener("loadedmetadata",this.onLoadMetaData.bind(this),!1),this.mediaElement[0].addEventListener("waiting",this.onStartBuffering.bind(this),!1),this.mediaElement[0].addEventListener("ended",this.onComplete.bind(this),!1),this.mediaElement[0].addEventListener("playing",this.onStartPlaying.bind(this),!1),this.mediaElement[0].addEventListener("play",this.onPlay.bind(this),!1),this.mediaElement[0].addEventListener("pause",this.onPause.bind(this),!1),this.mediaElement[0].addEventListener("volumechange",this.onVolumeChange.bind(this),!1),this.mediaElement[0].addEventListener("playbackchange",this.onPlaybackChange.bind(this),!1),this.mediaElement[0].addEventListener("timeupdate",this.onUpdateTime.bind(this),!1),this.mediaElement[0].addEventListener("progress",this.onProgress.bind(this),!1),this.mediaElement[0].addEventListener("seeking",this.onSeeking.bind(this),!1),this.mediaElement[0].addEventListener("seeked",this.onSeeked.bind(this),!1),this.mediaElement[0].addEventListener("error",this.onVideoError.bind(this),!1)},this.init=function(){this.isReady=!1,this.isCompleted=!1,this.buffered=[],this.bufferEnd=0,this.currentTime=0,this.totalTime=0,this.timeLeft=0,this.isLive=!1,this.isFullScreen=!1,this.playback=1,this.isConfig=void 0!=a.vgConfig,this.mediaElement=[{play:function(){},pause:function(){},stop:function(){},addEventListener:function(){},removeEventListener:function(){}}],d.isAvailable&&(this.isFullScreen=d.isFullScreen()),this.updateTheme(a.vgTheme),this.addBindings(),d.isAvailable&&document.addEventListener(d.onchange,this.onFullScreenChange.bind(this))},this.onUpdateTheme=function(a){this.updateTheme(a)},this.onUpdateAutoPlay=function(a){a&&!this.autoPlay&&(this.autoPlay=a,this.play(this))},this.onUpdateStartTime=function(a){if(a&&a!=this.startTime){this.mediaElement[0].currentTime=a,this.startTime=a,l=this.startTime>=0&&this.virtualClipDuration>0;var b={target:this.mediaElement[0]};this.onUpdateTime(b,!0)}},this.onUpdateVirtualClipDuration=function(a){if(a&&a!=this.virtualClipDuration){this.virtualClipDuration=a,l=this.startTime>=0&&this.virtualClipDuration>0;var b={target:this.mediaElement[0]};this.onUpdateTime(b,!0)}},this.onUpdatePlaysInline=function(a){this.playsInline=a},this.onUpdateNativeFullscreen=function(a){void 0==a&&(a=!0),this.nativeFullscreen=a},this.onUpdateCuePoints=function(a){this.cuePoints=a,this.checkCuePoints(this.currentTime)},this.onUpdateClearMediaOnNavigate=function(a){this.clearMediaOnNavigate=a},this.addBindings=function(){a.$watch("vgTheme",this.onUpdateTheme.bind(this)),a.$watch("vgAutoPlay",this.onUpdateAutoPlay.bind(this)),a.$watch("vgStartTime",this.onUpdateStartTime.bind(this)),a.$watch("vgVirtualClipDuration",this.onUpdateVirtualClipDuration.bind(this)),a.$watch("vgPlaysInline",this.onUpdatePlaysInline.bind(this)),a.$watch("vgNativeFullscreen",this.onUpdateNativeFullscreen.bind(this)),a.$watch("vgCuePoints",this.onUpdateCuePoints.bind(this)),a.$watch("vgClearMediaOnNavigate",this.onUpdateClearMediaOnNavigate.bind(this))},this.onFullScreenChange=function(b){this.isFullScreen=d.isFullScreen(),a.$parent.$digest()},a.$on("$destroy",this.clearMedia.bind(this)),a.$on("$routeChangeStart",this.onRouteChange.bind(this)),this.init()}]),angular.module("com.2fdevs.videogular").directive("vgCrossorigin",[function(){return{restrict:"A",require:"^videogular",link:{pre:function(a,b,c,d){var e;a.setCrossorigin=function(a){a?d.mediaElement.attr("crossorigin",a):d.mediaElement.removeAttr("crossorigin")},d.isConfig?a.$watch(function(){return d.config},function(){d.config&&a.setCrossorigin(d.config.crossorigin)}):a.$watch(c.vgCrossorigin,function(b,c){e&&b==c||!b?a.setCrossorigin():(e=b,a.setCrossorigin(e))})}}}}]),angular.module("com.2fdevs.videogular").directive("vgLoop",[function(){return{restrict:"A",require:"^videogular",link:{pre:function(a,b,c,d){var e;a.setLoop=function(a){a?d.mediaElement.attr("loop",a):d.mediaElement.removeAttr("loop")},d.isConfig?a.$watch(function(){return d.config},function(){d.config&&a.setLoop(d.config.loop)}):a.$watch(c.vgLoop,function(b,c){e&&b==c||!b?a.setLoop():(e=b,a.setLoop(e))})}}}}]),angular.module("com.2fdevs.videogular").directive("vgMedia",["$timeout","VG_UTILS","VG_STATES",function(a,b,c){return{restrict:"E",require:"^videogular",templateUrl:function(a,b){var c=b.vgType||"video";return b.vgTemplate||"vg-templates/vg-media-"+c},scope:{vgSrc:"=?",vgType:"=?"},link:function(d,e,f,g){var h;f.vgType&&"video"!==f.vgType?f.vgType="audio":f.vgType="video",d.onChangeSource=function(a,b){h&&a==b||!a||(h=a,g.currentState!==c.PLAY&&(g.currentState=c.STOP),g.sources=h,d.changeSource())},d.changeSource=function(){if(angular.isArray(h)){var c="";if(g.mediaElement[0].canPlayType){for(var d=0,e=h.length;e>d;d++)if(c=g.mediaElement[0].canPlayType(h[d].type),"maybe"==c||"probably"==c){g.mediaElement.attr("src",h[d].src),g.mediaElement.attr("type",h[d].type),g.changeSource(h[d]);break}}else g.mediaElement.attr("src",h[0].src),g.mediaElement.attr("type",h[0].type),g.changeSource(h[0])}else g.mediaElement.attr("src",h),g.changeSource(h);b.isMobileDevice()&&g.mediaElement[0].load(),a(function(){!g.autoPlay||!b.isCordova()&&b.isMobileDevice()||g.play()}),""==c&&g.onVideoError()},g.mediaElement=e.find(f.vgType),g.sources=d.vgSrc,g.addListeners(),g.onVideoReady(),d.$watch("vgSrc",d.onChangeSource),d.$watch(function(){return g.sources},d.onChangeSource),d.$watch(function(){return g.playsInline},function(a,b){a?g.mediaElement.attr("webkit-playsinline",""):g.mediaElement.removeAttr("webkit-playsinline")}),g.isConfig&&d.$watch(function(){return g.config},function(){g.config&&(d.vgSrc=g.config.sources)})}}}]),angular.module("com.2fdevs.videogular").directive("vgNativeControls",[function(){return{restrict:"A",require:"^videogular",link:{pre:function(a,b,c,d){var e;a.setControls=function(a){a?d.mediaElement.attr("controls",a):d.mediaElement.removeAttr("controls")},d.isConfig?a.$watch(function(){return d.config},function(){d.config&&a.setControls(d.config.controls)}):a.$watch(c.vgNativeControls,function(b,c){e&&b==c||!b?a.setControls():(e=b,a.setControls(e))})}}}}]),angular.module("com.2fdevs.videogular").directive("vgPreload",[function(){return{restrict:"A",require:"^videogular",link:{pre:function(a,b,c,d){var e;a.setPreload=function(a){a?d.mediaElement.attr("preload",a):d.mediaElement.removeAttr("preload")},d.isConfig?a.$watch(function(){return d.config},function(){d.config&&a.setPreload(d.config.preload)}):a.$watch(c.vgPreload,function(b,c){e&&b==c||!b?a.setPreload():(e=b,a.setPreload(e))})}}}}]),angular.module("com.2fdevs.videogular").directive("vgTracks",[function(){return{restrict:"A",require:"^videogular",link:{pre:function(a,b,c,d){var e,f,g,h=!1;a.onLoadMetaData=function(){h=!0,a.updateTracks()},a.updateTracks=function(){var b=d.mediaElement.children();for(f=0,g=b.length;g>f;f++)b[f].remove&&b[f].remove();if(e)for(f=0,g=e.length;g>f;f++){var c=document.createElement("track");for(var h in e[f])c[h]=e[f][h];c.addEventListener("load",a.onLoadTrack.bind(a,c)),d.mediaElement[0].appendChild(c)}},a.onLoadTrack=function(b){b["default"]?b.mode="showing":b.mode="hidden";for(var c=0,e=d.mediaElement[0].textTracks.length;e>c;c++)b.label==d.mediaElement[0].textTracks[c].label&&(b["default"]?d.mediaElement[0].textTracks[c].mode="showing":d.mediaElement[0].textTracks[c].mode="disabled");b.removeEventListener("load",a.onLoadTrack.bind(a,b))},a.setTracks=function(b){e=b,d.tracks=b,h?a.updateTracks():d.mediaElement[0].addEventListener("loadedmetadata",a.onLoadMetaData.bind(a),!1)},d.isConfig?a.$watch(function(){return d.config},function(){d.config&&a.setTracks(d.config.tracks)}):a.$watch(c.vgTracks,function(b,c){e&&b==c||a.setTracks(b)},!0)}}}}]),angular.module("com.2fdevs.videogular").directive("videogular",[function(){return{restrict:"EA",scope:{vgTheme:"=?",vgAutoPlay:"=?",vgStartTime:"=?",vgVirtualClipDuration:"=?",vgPlaysInline:"=?",vgNativeFullscreen:"=?",vgClearMediaOnNavigate:"=?",vgCuePoints:"=?",vgConfig:"@",vgCanPlay:"&",vgComplete:"&",vgUpdateVolume:"&",vgUpdatePlayback:"&",vgUpdateTime:"&",vgUpdateState:"&",vgPlayerReady:"&",vgChangeSource:"&",vgSeeking:"&",vgSeeked:"&",vgError:"&"},controller:"vgController",controllerAs:"API",link:{pre:function(a,b,c,d){d.videogularElement=angular.element(b)}}}}]),angular.module("com.2fdevs.videogular").service("vgConfigLoader",["$http","$q","$sce",function(a,b,c){this.loadConfig=function(d){var e=b.defer();return a({method:"GET",url:d}).then(function(a){for(var b=a.data,d=0,f=b.sources.length;f>d;d++)b.sources[d].src=c.trustAsResourceUrl(b.sources[d].src);e.resolve(b)},function(){e.reject()}),e.promise}}]),angular.module("com.2fdevs.videogular").service("vgFullscreen",["VG_UTILS",function(a){function b(){var a=!1;return a=c?null!=document[d.element]||c.webkitDisplayingFullscreen:null!=document[d.element]}var c,d=null,e={w3:{enabled:"fullscreenEnabled",element:"fullscreenElement",request:"requestFullscreen",exit:"exitFullscreen",onchange:"fullscreenchange",onerror:"fullscreenerror"},newWebkit:{enabled:"webkitFullscreenEnabled",element:"webkitFullscreenElement",request:"webkitRequestFullscreen",exit:"webkitExitFullscreen",onchange:"webkitfullscreenchange",onerror:"webkitfullscreenerror"},oldWebkit:{enabled:"webkitIsFullScreen",element:"webkitCurrentFullScreenElement",request:"webkitRequestFullScreen",exit:"webkitCancelFullScreen",onchange:"webkitfullscreenchange",onerror:"webkitfullscreenerror"},moz:{enabled:"mozFullScreen",element:"mozFullScreenElement",request:"mozRequestFullScreen",exit:"mozCancelFullScreen",onchange:"mozfullscreenchange",onerror:"mozfullscreenerror"},ios:{enabled:"webkitFullscreenEnabled",element:"webkitFullscreenElement",request:"webkitEnterFullscreen",exit:"webkitExitFullscreen",onchange:"webkitfullscreenchange",onerror:"webkitfullscreenerror"},ms:{enabled:"msFullscreenEnabled",element:"msFullscreenElement",request:"msRequestFullscreen",exit:"msExitFullscreen",onchange:"MSFullscreenChange",onerror:"MSFullscreenError"}};for(var f in e)if(e[f].enabled in document){d=e[f];break}a.isiOSDevice()&&(d=e.ios),this.isAvailable=null!=d,d&&(this.onchange=d.onchange,this.onerror=d.onerror,this.isFullScreen=b,this.exit=function(){document[d.exit]()},this.request=function(a){c=a,c[d.request]()})}]),angular.module("com.2fdevs.videogular").service("VG_UTILS",["$window",function(a){this.fixEventOffset=function(a){var b=navigator.userAgent.match(/Firefox\/(\d+)/i);if(b&&Number.parseInt(b.pop())<39){var c=a.currentTarget.currentStyle||window.getComputedStyle(a.target,null),d=parseInt(c.borderLeftWidth,10),e=parseInt(c.borderTopWidth,10),f=a.currentTarget.getBoundingClientRect(),g=a.clientX-d-f.left,h=a.clientY-e-f.top;a.offsetX=g,a.offsetY=h}return a},this.getZIndex=function(){for(var a,b=1,c=document.getElementsByTagName("*"),d=0,e=c.length;e>d;d++)a=parseInt(window.getComputedStyle(c[d])["z-index"]),a>b&&(b=a+1);return b},this.isMobileDevice=function(){return"undefined"!=typeof window.orientation||-1!==navigator.userAgent.indexOf("IEMobile")},this.isiOSDevice=function(){return navigator.userAgent.match(/ip(hone|ad|od)/i)&&!navigator.userAgent.match(/(iemobile)[\/\s]?([\w\.]*)/i)},this.isCordova=function(){return-1===document.URL.indexOf("http://")&&-1===document.URL.indexOf("https://")},this.supportsLocalStorage=function(){var b="videogular-test-key";try{var c=a.sessionStorage;return c.setItem(b,"1"),c.removeItem(b),"localStorage"in a&&null!==a.localStorage}catch(d){return!1}}}]);
/*
 angular-file-upload v2.3.4
 https://github.com/nervgh/angular-file-upload
*/

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["angular-file-upload"]=t():e["angular-file-upload"]=t()}(this,function(){return function(e){function t(n){if(o[n])return o[n].exports;var r=o[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}var r=o(1),i=n(r),s=o(2),a=n(s),l=o(3),u=n(l),p=o(4),c=n(p),f=o(5),d=n(f),h=o(6),y=n(h),m=o(7),_=n(m),v=o(8),g=n(v),F=o(9),b=n(F),O=o(10),C=n(O),I=o(11),U=n(I),w=o(12),A=n(w);angular.module(i["default"].name,[]).value("fileUploaderOptions",a["default"]).factory("FileUploader",u["default"]).factory("FileLikeObject",c["default"]).factory("FileItem",d["default"]).factory("FileDirective",y["default"]).factory("FileSelect",_["default"]).factory("FileDrop",g["default"]).factory("FileOver",b["default"]).directive("nvFileSelect",C["default"]).directive("nvFileDrop",U["default"]).directive("nvFileOver",A["default"]).run(["FileUploader","FileLikeObject","FileItem","FileDirective","FileSelect","FileDrop","FileOver",function(e,t,o,n,r,i,s){e.FileLikeObject=t,e.FileItem=o,e.FileDirective=n,e.FileSelect=r,e.FileDrop=i,e.FileOver=s}])},function(e,t){e.exports={name:"angularFileUpload"}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={url:"/",alias:"file",headers:{},queue:[],progress:0,autoUpload:!1,removeAfterUpload:!1,method:"POST",filters:[],formData:[],queueLimit:Number.MAX_VALUE,withCredentials:!1,disableMultipart:!1}},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t,o,n,i,s,a){var m=n.File,_=n.FormData,v=function(){function n(t){r(this,n);var o=l(e);u(this,o,t,{isUploading:!1,_nextIndex:0,_failFilterIndex:-1,_directives:{select:[],drop:[],over:[]}}),this.filters.unshift({name:"queueLimit",fn:this._queueLimitFilter}),this.filters.unshift({name:"folder",fn:this._folderFilter})}return n.prototype.addToQueue=function(e,t,o){var n=this,r=this.isArrayLikeObject(e)?e:[e],i=this._getFilters(o),l=this.queue.length,u=[];p(r,function(e){var o=new s(e);if(n._isValidFile(o,i,t)){var r=new a(n,e,t);u.push(r),n.queue.push(r),n._onAfterAddingFile(r)}else{var l=i[n._failFilterIndex];n._onWhenAddingFileFailed(o,l,t)}}),this.queue.length!==l&&(this._onAfterAddingAll(u),this.progress=this._getTotalProgress()),this._render(),this.autoUpload&&this.uploadAll()},n.prototype.removeFromQueue=function(e){var t=this.getIndexOfItem(e),o=this.queue[t];o.isUploading&&o.cancel(),this.queue.splice(t,1),o._destroy(),this.progress=this._getTotalProgress()},n.prototype.clearQueue=function(){for(;this.queue.length;)this.queue[0].remove();this.progress=0},n.prototype.uploadItem=function(e){var t=this.getIndexOfItem(e),o=this.queue[t],n=this.isHTML5?"_xhrTransport":"_iframeTransport";o._prepareToUploading(),this.isUploading||(this._onBeforeUploadItem(o),o.isCancel||(o.isUploading=!0,this.isUploading=!0,this[n](o),this._render()))},n.prototype.cancelItem=function(e){var t=this,o=this.getIndexOfItem(e),n=this.queue[o],r=this.isHTML5?"_xhr":"_form";n&&(n.isCancel=!0,n.isUploading?n[r].abort():!function(){var e=[void 0,0,{}],o=function(){t._onCancelItem.apply(t,[n].concat(e)),t._onCompleteItem.apply(t,[n].concat(e))};i(o)}())},n.prototype.uploadAll=function(){var e=this.getNotUploadedItems().filter(function(e){return!e.isUploading});e.length&&(p(e,function(e){return e._prepareToUploading()}),e[0].upload())},n.prototype.cancelAll=function(){var e=this.getNotUploadedItems();p(e,function(e){return e.cancel()})},n.prototype.isFile=function(e){return this.constructor.isFile(e)},n.prototype.isFileLikeObject=function(e){return this.constructor.isFileLikeObject(e)},n.prototype.isArrayLikeObject=function(e){return this.constructor.isArrayLikeObject(e)},n.prototype.getIndexOfItem=function(e){return f(e)?e:this.queue.indexOf(e)},n.prototype.getNotUploadedItems=function(){return this.queue.filter(function(e){return!e.isUploaded})},n.prototype.getReadyItems=function(){return this.queue.filter(function(e){return e.isReady&&!e.isUploading}).sort(function(e,t){return e.index-t.index})},n.prototype.destroy=function(){var e=this;p(this._directives,function(t){p(e._directives[t],function(e){e.destroy()})})},n.prototype.onAfterAddingAll=function(e){},n.prototype.onAfterAddingFile=function(e){},n.prototype.onWhenAddingFileFailed=function(e,t,o){},n.prototype.onBeforeUploadItem=function(e){},n.prototype.onProgressItem=function(e,t){},n.prototype.onProgressAll=function(e){},n.prototype.onSuccessItem=function(e,t,o,n){},n.prototype.onErrorItem=function(e,t,o,n){},n.prototype.onCancelItem=function(e,t,o,n){},n.prototype.onCompleteItem=function(e,t,o,n){},n.prototype.onCompleteAll=function(){},n.prototype._getTotalProgress=function(e){if(this.removeAfterUpload)return e||0;var t=this.getNotUploadedItems().length,o=t?this.queue.length-t:this.queue.length,n=100/this.queue.length,r=(e||0)*n/100;return Math.round(o*n+r)},n.prototype._getFilters=function(e){if(!e)return this.filters;if(h(e))return e;var t=e.match(/[^\s,]+/g);return this.filters.filter(function(e){return-1!==t.indexOf(e.name)})},n.prototype._render=function(){t.$$phase||t.$apply()},n.prototype._folderFilter=function(e){return!(!e.size&&!e.type)},n.prototype._queueLimitFilter=function(){return this.queue.length<this.queueLimit},n.prototype._isValidFile=function(e,t,o){var n=this;return this._failFilterIndex=-1,t.length?t.every(function(t){return n._failFilterIndex++,t.fn.call(n,e,o)}):!0},n.prototype._isSuccessCode=function(e){return e>=200&&300>e||304===e},n.prototype._transformResponse=function(e,t){var n=this._headersGetter(t);return p(o.defaults.transformResponse,function(t){e=t(e,n)}),e},n.prototype._parseHeaders=function(e){var t,o,n,r={};return e?(p(e.split("\n"),function(e){n=e.indexOf(":"),t=e.slice(0,n).trim().toLowerCase(),o=e.slice(n+1).trim(),t&&(r[t]=r[t]?r[t]+", "+o:o)}),r):r},n.prototype._headersGetter=function(e){return function(t){return t?e[t.toLowerCase()]||null:e}},n.prototype._xhrTransport=function(e){var t,o=this,n=e._xhr=new XMLHttpRequest;if(e.disableMultipart?t=e._file:(t=new _,p(e.formData,function(e){p(e,function(e,o){t.append(o,e)})}),t.append(e.alias,e._file,e.file.name)),"number"!=typeof e._file.size)throw new TypeError("The file specified is no longer valid");n.upload.onprogress=function(t){var n=Math.round(t.lengthComputable?100*t.loaded/t.total:0);o._onProgressItem(e,n)},n.onload=function(){var t=o._parseHeaders(n.getAllResponseHeaders()),r=o._transformResponse(n.response,t),i=o._isSuccessCode(n.status)?"Success":"Error",s="_on"+i+"Item";o[s](e,r,n.status,t),o._onCompleteItem(e,r,n.status,t)},n.onerror=function(){var t=o._parseHeaders(n.getAllResponseHeaders()),r=o._transformResponse(n.response,t);o._onErrorItem(e,r,n.status,t),o._onCompleteItem(e,r,n.status,t)},n.onabort=function(){var t=o._parseHeaders(n.getAllResponseHeaders()),r=o._transformResponse(n.response,t);o._onCancelItem(e,r,n.status,t),o._onCompleteItem(e,r,n.status,t)},n.open(e.method,e.url,!0),n.withCredentials=e.withCredentials,p(e.headers,function(e,t){n.setRequestHeader(t,e)}),n.send(t)},n.prototype._iframeTransport=function(e){var t=this,o=y('<form style="display: none;" />'),n=y('<iframe name="iframeTransport'+Date.now()+'">'),r=e._input;e._form&&e._form.replaceWith(r),e._form=o,r.prop("name",e.alias),p(e.formData,function(e){p(e,function(e,t){var n=y('<input type="hidden" name="'+t+'" />');n.val(e),o.append(n)})}),o.prop({action:e.url,method:"POST",target:n.prop("name"),enctype:"multipart/form-data",encoding:"multipart/form-data"}),n.bind("load",function(){var o="",r=200;try{o=n[0].contentDocument.body.innerHTML}catch(i){r=500}var s={response:o,status:r,dummy:!0},a={},l=t._transformResponse(s.response,a);t._onSuccessItem(e,l,s.status,a),t._onCompleteItem(e,l,s.status,a)}),o.abort=function(){var i,s={status:0,dummy:!0},a={};n.unbind("load").prop("src","javascript:false;"),o.replaceWith(r),t._onCancelItem(e,i,s.status,a),t._onCompleteItem(e,i,s.status,a)},r.after(o),o.append(r).append(n),o[0].submit()},n.prototype._onWhenAddingFileFailed=function(e,t,o){this.onWhenAddingFileFailed(e,t,o)},n.prototype._onAfterAddingFile=function(e){this.onAfterAddingFile(e)},n.prototype._onAfterAddingAll=function(e){this.onAfterAddingAll(e)},n.prototype._onBeforeUploadItem=function(e){e._onBeforeUpload(),this.onBeforeUploadItem(e)},n.prototype._onProgressItem=function(e,t){var o=this._getTotalProgress(t);this.progress=o,e._onProgress(t),this.onProgressItem(e,t),this.onProgressAll(o),this._render()},n.prototype._onSuccessItem=function(e,t,o,n){e._onSuccess(t,o,n),this.onSuccessItem(e,t,o,n)},n.prototype._onErrorItem=function(e,t,o,n){e._onError(t,o,n),this.onErrorItem(e,t,o,n)},n.prototype._onCancelItem=function(e,t,o,n){e._onCancel(t,o,n),this.onCancelItem(e,t,o,n)},n.prototype._onCompleteItem=function(e,t,o,n){e._onComplete(t,o,n),this.onCompleteItem(e,t,o,n);var r=this.getReadyItems()[0];return this.isUploading=!1,d(r)?void r.upload():(this.onCompleteAll(),this.progress=this._getTotalProgress(),void this._render())},n.isFile=function(e){return m&&e instanceof m},n.isFileLikeObject=function(e){return e instanceof s},n.isArrayLikeObject=function(e){return c(e)&&"length"in e},n.inherit=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.super_=t},n}();return v.prototype.isHTML5=!(!m||!_),v.isHTML5=v.prototype.isHTML5,v}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i;var s=o(1),a=(n(s),angular),l=a.copy,u=a.extend,p=a.forEach,c=a.isObject,f=a.isNumber,d=a.isDefined,h=a.isArray,y=a.element;i.$inject=["fileUploaderOptions","$rootScope","$http","$window","$timeout","FileLikeObject","FileItem"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){return function(){function e(t){r(this,e);var o=u(t),n=o?t.value:t,i=p(n)?"FakePath":"Object",s="_createFrom"+i;this[s](n)}return e.prototype._createFromFakePath=function(e){this.lastModifiedDate=null,this.size=null,this.type="like/"+e.slice(e.lastIndexOf(".")+1).toLowerCase(),this.name=e.slice(e.lastIndexOf("/")+e.lastIndexOf("\\")+2)},e.prototype._createFromObject=function(e){this.lastModifiedDate=l(e.lastModifiedDate),this.size=e.size,this.type=e.type,this.name=e.name},e}()}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i;var s=o(1),a=(n(s),angular),l=a.copy,u=a.isElement,p=a.isString},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){return function(){function o(e,n,i){r(this,o);var s=c(n),a=s?p(n):null,f=s?null:n;u(this,{url:e.url,alias:e.alias,headers:l(e.headers),formData:l(e.formData),removeAfterUpload:e.removeAfterUpload,withCredentials:e.withCredentials,disableMultipart:e.disableMultipart,method:e.method},i,{uploader:e,file:new t(n),isReady:!1,isUploading:!1,isUploaded:!1,isSuccess:!1,isCancel:!1,isError:!1,progress:0,index:null,_file:f,_input:a}),a&&this._replaceNode(a)}return o.prototype.upload=function(){try{this.uploader.uploadItem(this)}catch(e){this.uploader._onCompleteItem(this,"",0,[]),this.uploader._onErrorItem(this,"",0,[])}},o.prototype.cancel=function(){this.uploader.cancelItem(this)},o.prototype.remove=function(){this.uploader.removeFromQueue(this)},o.prototype.onBeforeUpload=function(){},o.prototype.onProgress=function(e){},o.prototype.onSuccess=function(e,t,o){},o.prototype.onError=function(e,t,o){},o.prototype.onCancel=function(e,t,o){},o.prototype.onComplete=function(e,t,o){},o.prototype._onBeforeUpload=function(){this.isReady=!0,this.isUploading=!1,this.isUploaded=!1,this.isSuccess=!1,this.isCancel=!1,this.isError=!1,this.progress=0,this.onBeforeUpload()},o.prototype._onProgress=function(e){this.progress=e,this.onProgress(e)},o.prototype._onSuccess=function(e,t,o){this.isReady=!1,this.isUploading=!1,this.isUploaded=!0,this.isSuccess=!0,this.isCancel=!1,this.isError=!1,this.progress=100,this.index=null,this.onSuccess(e,t,o)},o.prototype._onError=function(e,t,o){this.isReady=!1,this.isUploading=!1,this.isUploaded=!0,this.isSuccess=!1,this.isCancel=!1,this.isError=!0,this.progress=0,this.index=null,this.onError(e,t,o)},o.prototype._onCancel=function(e,t,o){this.isReady=!1,this.isUploading=!1,this.isUploaded=!1,this.isSuccess=!1,this.isCancel=!0,this.isError=!1,this.progress=0,this.index=null,this.onCancel(e,t,o)},o.prototype._onComplete=function(e,t,o){this.onComplete(e,t,o),this.removeAfterUpload&&this.remove()},o.prototype._destroy=function(){this._input&&this._input.remove(),this._form&&this._form.remove(),delete this._form,delete this._input},o.prototype._prepareToUploading=function(){this.index=this.index||++this.uploader._nextIndex,this.isReady=!0},o.prototype._replaceNode=function(t){var o=e(t.clone())(t.scope());o.prop("value",null),t.css("display","none"),t.after(o)},o}()}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i;var s=o(1),a=(n(s),angular),l=a.copy,u=a.extend,p=a.element,c=a.isElement;i.$inject=["$compile","FileLikeObject"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){var e=function(){function e(t){r(this,e),l(this,t),this.uploader._directives[this.prop].push(this),this._saveLinks(),this.bind()}return e.prototype.bind=function(){for(var e in this.events){var t=this.events[e];this.element.bind(e,this[t])}},e.prototype.unbind=function(){for(var e in this.events)this.element.unbind(e,this.events[e])},e.prototype.destroy=function(){var e=this.uploader._directives[this.prop].indexOf(this);this.uploader._directives[this.prop].splice(e,1),this.unbind()},e.prototype._saveLinks=function(){for(var e in this.events){var t=this.events[e];this[t]=this[t].bind(this)}},e}();return e.prototype.events={},e}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i;var s=o(1),a=(n(s),angular),l=a.extend},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){return function(t){function o(e){r(this,o);var n=p(e,{events:{$destroy:"destroy",change:"onChange"},prop:"select"}),s=i(this,t.call(this,n));return s.uploader.isHTML5||s.element.removeAttr("multiple"),s.element.prop("value",null),s}return s(o,t),o.prototype.getOptions=function(){},o.prototype.getFilters=function(){},o.prototype.isEmptyAfterSelection=function(){return!!this.element.attr("multiple")},o.prototype.onChange=function(){var t=this.uploader.isHTML5?this.element[0].files:this.element[0],o=this.getOptions(),n=this.getFilters();this.uploader.isHTML5||this.destroy(),this.uploader.addToQueue(t,o,n),this.isEmptyAfterSelection()&&(this.element.prop("value",null),this.element.replaceWith(e(this.element.clone())(this.scope)))},o}(t)}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var l=o(1),u=(n(l),angular),p=u.extend;a.$inject=["$compile","FileDirective"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return function(e){function t(o){r(this,t);var n=p(o,{events:{$destroy:"destroy",drop:"onDrop",dragover:"onDragOver",dragleave:"onDragLeave"},prop:"drop"});return i(this,e.call(this,n))}return s(t,e),t.prototype.getOptions=function(){},t.prototype.getFilters=function(){},t.prototype.onDrop=function(e){var t=this._getTransfer(e);if(t){var o=this.getOptions(),n=this.getFilters();this._preventAndStop(e),c(this.uploader._directives.over,this._removeOverClass,this),this.uploader.addToQueue(t.files,o,n)}},t.prototype.onDragOver=function(e){var t=this._getTransfer(e);this._haveFiles(t.types)&&(t.dropEffect="copy",this._preventAndStop(e),c(this.uploader._directives.over,this._addOverClass,this))},t.prototype.onDragLeave=function(e){e.currentTarget!==this.element[0]&&(this._preventAndStop(e),c(this.uploader._directives.over,this._removeOverClass,this))},t.prototype._getTransfer=function(e){return e.dataTransfer?e.dataTransfer:e.originalEvent.dataTransfer},t.prototype._preventAndStop=function(e){e.preventDefault(),e.stopPropagation()},t.prototype._haveFiles=function(e){return e?e.indexOf?-1!==e.indexOf("Files"):e.contains?e.contains("Files"):!1:!1},t.prototype._addOverClass=function(e){e.addOverClass()},t.prototype._removeOverClass=function(e){e.removeOverClass()},t}(e)}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var l=o(1),u=(n(l),angular),p=u.extend,c=u.forEach;a.$inject=["FileDirective"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return function(e){function t(o){r(this,t);var n=p(o,{events:{$destroy:"destroy"},prop:"over",overClass:"nv-file-over"});return i(this,e.call(this,n))}return s(t,e),t.prototype.addOverClass=function(){this.element.addClass(this.getOverClass())},t.prototype.removeOverClass=function(){this.element.removeClass(this.getOverClass())},t.prototype.getOverClass=function(){return this.overClass},t}(e)}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var l=o(1),u=(n(l),angular),p=u.extend;a.$inject=["FileDirective"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t,o){return{link:function(n,r,i){var s=n.$eval(i.uploader);if(!(s instanceof t))throw new TypeError('"Uploader" must be an instance of FileUploader');var a=new o({uploader:s,element:r,scope:n});a.getOptions=e(i.options).bind(a,n),a.getFilters=function(){return i.filters}}}}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r;var i=o(1);n(i);r.$inject=["$parse","FileUploader","FileSelect"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t,o){return{link:function(n,r,i){var s=n.$eval(i.uploader);if(!(s instanceof t))throw new TypeError('"Uploader" must be an instance of FileUploader');if(s.isHTML5){var a=new o({uploader:s,element:r});a.getOptions=e(i.options).bind(a,n),a.getFilters=function(){return i.filters}}}}}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r;var i=o(1);n(i);r.$inject=["$parse","FileUploader","FileDrop"]},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){return{link:function(o,n,r){var i=o.$eval(r.uploader);if(!(i instanceof e))throw new TypeError('"Uploader" must be an instance of FileUploader');var s=new t({uploader:i,element:n});s.getOverClass=function(){return r.overClass||s.overClass}}}}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r;var i=o(1);n(i);r.$inject=["FileUploader","FileOver"]}])});
//# sourceMappingURL=angular-file-upload.min.js.map
/*!
 * clipboard.js v1.5.12
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Clipboard=t()}}(function(){var t,e,n;return function t(e,n,o){function i(a,c){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!c&&s)return s(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return i(n?n:t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){var o=t("matches-selector");e.exports=function(t,e,n){for(var i=n?t:t.parentNode;i&&i!==document;){if(o(i,e))return i;i=i.parentNode}}},{"matches-selector":5}],2:[function(t,e,n){function o(t,e,n,o,r){var a=i.apply(this,arguments);return t.addEventListener(n,a,r),{destroy:function(){t.removeEventListener(n,a,r)}}}function i(t,e,n,o){return function(n){n.delegateTarget=r(n.target,e,!0),n.delegateTarget&&o.call(t,n)}}var r=t("closest");e.exports=o},{closest:1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){var e=Object.prototype.toString.call(t);return"[object Function]"===e}},{}],4:[function(t,e,n){function o(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!c.string(e))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(t))return i(t,e,n);if(c.nodeList(t))return r(t,e,n);if(c.string(t))return a(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}function r(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}function a(t,e,n){return s(document.body,t,e,n)}var c=t("./is"),s=t("delegate");e.exports=o},{"./is":3,delegate:2}],5:[function(t,e,n){function o(t,e){if(r)return r.call(t,e);for(var n=t.parentNode.querySelectorAll(e),o=0;o<n.length;++o)if(n[o]==t)return!0;return!1}var i=Element.prototype,r=i.matchesSelector||i.webkitMatchesSelector||i.mozMatchesSelector||i.msMatchesSelector||i.oMatchesSelector;e.exports=o},{}],6:[function(t,e,n){function o(t){var e;if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName)t.focus(),t.setSelectionRange(0,t.value.length),e=t.value;else{t.hasAttribute("contenteditable")&&t.focus();var n=window.getSelection(),o=document.createRange();o.selectNodeContents(t),n.removeAllRanges(),n.addRange(o),e=n.toString()}return e}e.exports=o},{}],7:[function(t,e,n){function o(){}o.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function o(){i.off(t,o),e.apply(n,arguments)}var i=this;return o._=e,this.on(t,o,n)},emit:function(t){var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,i=n.length;for(o;i>o;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],i=[];if(o&&e)for(var r=0,a=o.length;a>r;r++)o[r].fn!==e&&o[r].fn._!==e&&i.push(o[r]);return i.length?n[t]=i:delete n[t],this}},e.exports=o},{}],8:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","select"],r);else if("undefined"!=typeof o)r(n,e("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(t,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(e),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){function t(e){o(this,t),this.resolveOptions(e),this.initSelection()}return t.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action=e.action,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""},t.prototype.initSelection=function t(){this.text?this.selectFake():this.target&&this.selectTarget()},t.prototype.selectFake=function t(){var e=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px",this.fakeElem.style.top=(window.pageYOffset||document.documentElement.scrollTop)+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()},t.prototype.removeFake=function t(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)},t.prototype.selectTarget=function t(){this.selectedText=(0,i.default)(this.target),this.copyText()},t.prototype.copyText=function t(){var e=void 0;try{e=document.execCommand(this.action)}catch(n){e=!1}this.handleResult(e)},t.prototype.handleResult=function t(e){e?this.emitter.emit("success",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)}):this.emitter.emit("error",{action:this.action,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})},t.prototype.clearSelection=function t(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()},t.prototype.destroy=function t(){this.removeFake()},a(t,[{key:"action",set:function t(){var e=arguments.length<=0||void 0===arguments[0]?"copy":arguments[0];if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function t(){return this._action}},{key:"target",set:function t(e){if(void 0!==e){if(!e||"object"!==("undefined"==typeof e?"undefined":r(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function t(){return this._target}}]),t}();t.exports=c})},{select:6}],9:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,e("./clipboard-action"),e("tiny-emitter"),e("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(t,e,n,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var l=i(e),u=i(n),f=i(o),d=function(t){function e(n,o){r(this,e);var i=a(this,t.call(this));return i.resolveOptions(o),i.listenClick(n),i}return c(e,t),e.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText},e.prototype.listenClick=function t(e){var n=this;this.listener=(0,f.default)(e,"click",function(t){return n.onClick(t)})},e.prototype.onClick=function t(e){var n=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new l.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})},e.prototype.defaultAction=function t(e){return s("action",e)},e.prototype.defaultTarget=function t(e){var n=s("target",e);return n?document.querySelector(n):void 0},e.prototype.defaultText=function t(e){return s("text",e)},e.prototype.destroy=function t(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)},e}(u.default);t.exports=d})},{"./clipboard-action":8,"good-listener":4,"tiny-emitter":7}]},{},[9])(9)});
/**
 * Owl Carousel v2.1.6
 * Copyright 2013-2016 David Deutsch
 * Licensed under MIT (https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE)
 */
!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g--;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;d>c;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.settings.center&&(this.$stage.children(".center").removeClass("center"),this.$stage.children().eq(this.current()).addClass("center"))}}],e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var b,c,e;b=this.$element.find("img"),c=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,e=this.$element.children(c).width(),b.length&&0>=e&&this.preloadAutoWidthImages(b)}this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+' class="'+this.settings.stageClass+'"/>').wrap('<div class="'+this.settings.stageOuterClass+'"/>'),this.$element.append(this.$stage.parent()),this.replace(this.$element.children().not(this.$stage.parent())),this.$element.is(":visible")?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){b>=a&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};c>b;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return this._items.length?this._width===this.$element.width()?!1:this.$element.is(":visible")?(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized"))):!1:!1},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),this.settings.responsive!==!1&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var d=-1,e=30,f=this.width(),g=this.coordinates();return this.settings.freeDrag||a.each(g,a.proxy(function(a,h){return"left"===c&&b>h-e&&h+e>b?d=a:"right"===c&&b>h-f-e&&h-f+e>b?d=a+1:this.op(b,"<",h)&&this.op(b,">",g[a+1]||h-f)&&(d="left"===c?a+1:a),-1===d},this)),this.settings.loop||(this.op(b,">",g[this.minimum()])?d=b=this.minimum():this.op(b,"<",g[this.maximum()])&&(d=b=this.maximum())),d},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){a=this.normalize(a),a!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||1>c?a=d:(0>a||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){for(b=this._items.length,c=this._items[--b].width(),d=this.$element.width();b--&&(c+=this._items[b].width()+this.settings.margin,!(c>d)););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2===0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(0>e),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=-1*f*g),a=c+e,d=((a-h)%g+g)%g+h,d!==a&&i>=d-e&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.$element.is(":visible")&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){return a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0))?!1:(this.leave("animating"),void this.trigger("translated"))},e.prototype.viewport=function(){var d;if(this.options.responsiveBaseElement!==b)d=a(this.options.responsiveBaseElement).width();else if(b.innerWidth)d=b.innerWidth;else{if(!c.documentElement||!c.documentElement.clientWidth)throw"Can not detect viewport width.";d=c.documentElement.clientWidth}return d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){a=this.normalize(a,!0),a!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),this.settings.responsive!==!1&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:c>a;case">":return d?c>a:a>c;case">=":return d?c>=a:a>=c;case"<=":return d?a>=c:c>=a}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&-1!==a.namespace.indexOf("owl")?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.$element.is(":visible"),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.$element.is(":visible")!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type))for(var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&-1*e||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":"url("+g+")",opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"==a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.$stage.children().toArray().slice(b,c),e=[],f=0;a.each(d,function(b,c){e.push(a(c).height())}),f=Math.max.apply(null,e),this._core.$stage.parent().height(f).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?'style="width:'+c.width+"px;height:"+c.height+'px;"':"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(a){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?'<div class="owl-video-tn '+j+'" '+i+'="'+a+'"></div>':'<div class="owl-video-tn" style="opacity:1;background-image:url('+a+')"></div>',b.after(d),b.after(e)};return b.wrap('<div class="owl-video-wrapper"'+g+"></div>"),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length?(l(h.attr(i)),h.remove(),!1):void("youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}}))},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),"youtube"===f.type?c='<iframe width="'+g+'" height="'+h+'" src="//www.youtube.com/embed/'+f.id+"?autoplay=1&v="+f.id+'" frameborder="0" allowfullscreen></iframe>':"vimeo"===f.type?c='<iframe src="//player.vimeo.com/video/'+f.id+'?autoplay=1" width="'+g+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>':"vzaar"===f.type&&(c='<iframe frameborder="0"height="'+h+'"width="'+g+'" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/'+f.id+'/player?autoplay=true"></iframe>'),a('<div class="owl-video-frame">'+c+"</div>").insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&a.support.animation&&a.support.transition){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.one(a.support.animation.end,c).css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g)),f&&e.one(a.support.animation.end,c).addClass("animated owl-animated-in").addClass(f))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.onTransitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null);
},a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._timeout=null,this._paused=!1,this._handlers={"changed.owl.carousel":a.proxy(function(a){a.namespace&&"settings"===a.property.name?this._core.settings.autoplay?this.play():this.stop():a.namespace&&"position"===a.property.name&&this._core.settings.autoplay&&this._setAutoPlayInterval()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoplay&&this.play()},this),"play.owl.autoplay":a.proxy(function(a,b,c){a.namespace&&this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(a){a.namespace&&this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.play()},this),"touchstart.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"touchend.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this.play()},this)},this._core.$element.on(this._handlers),this._core.options=a.extend({},e.Defaults,this._core.options)};e.Defaults={autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1},e.prototype.play=function(a,b){this._paused=!1,this._core.is("rotating")||(this._core.enter("rotating"),this._setAutoPlayInterval())},e.prototype._getNextTimeout=function(d,e){return this._timeout&&b.clearTimeout(this._timeout),b.setTimeout(a.proxy(function(){this._paused||this._core.is("busy")||this._core.is("interacting")||c.hidden||this._core.next(e||this._core.settings.autoplaySpeed)},this),d||this._core.settings.autoplayTimeout)},e.prototype._setAutoPlayInterval=function(){this._timeout=this._getNextTimeout()},e.prototype.stop=function(){this._core.is("rotating")&&(b.clearTimeout(this._timeout),this._core.leave("rotating"))},e.prototype.pause=function(){this._core.is("rotating")&&(this._paused=!0)},e.prototype.destroy=function(){var a,b;this.stop();for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(b){this._core=b,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){b.namespace&&this._core.settings.dotsData&&this._templates.push('<div class="'+this._core.settings.dotClass+'">'+a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot")+"</div>")},this),"added.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,0,this._templates.pop())},this),"remove.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&this.draw()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&!this._initialized&&(this._core.trigger("initialize",null,"navigation"),this.initialize(),this.update(),this.draw(),this._initialized=!0,this._core.trigger("initialized",null,"navigation"))},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._initialized&&(this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation"))},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers)};e.Defaults={nav:!1,navText:["prev","next"],navSpeed:!1,navElement:"div",navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotsData:!1,dotsSpeed:!1,dotsContainer:!1},e.prototype.initialize=function(){var b,c=this._core.settings;this._controls.$relative=(c.navContainer?a(c.navContainer):a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"),this._controls.$previous=a("<"+c.navElement+">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click",a.proxy(function(a){this.prev(c.navSpeed)},this)),this._controls.$next=a("<"+c.navElement+">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click",a.proxy(function(a){this.next(c.navSpeed)},this)),c.dotsData||(this._templates=[a("<div>").addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),this._controls.$absolute=(c.dotsContainer?a(c.dotsContainer):a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"),this._controls.$absolute.on("click","div",a.proxy(function(b){var d=a(b.target).parent().is(this._controls.$absolute)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(d,c.dotsSpeed)},this));for(b in this._overrides)this._core[b]=a.proxy(this[b],this)},e.prototype.destroy=function(){var a,b,c,d;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},e.prototype.update=function(){var a,b,c,d=this._core.clones().length/2,e=d+this._core.items().length,f=this._core.maximum(!0),g=this._core.settings,h=g.center||g.autoWidth||g.dotsData?1:g.dotsEach||g.items;if("page"!==g.slideBy&&(g.slideBy=Math.min(g.slideBy,g.items)),g.dots||"page"==g.slideBy)for(this._pages=[],a=d,b=0,c=0;e>a;a++){if(b>=h||0===b){if(this._pages.push({start:Math.min(f,a-d),end:a-d+h-1}),Math.min(f,a-d)===f)break;b=0,++c}b+=this._core.mergers(this._core.relative(a))}},e.prototype.draw=function(){var b,c=this._core.settings,d=this._core.items().length<=c.items,e=this._core.relative(this._core.current()),f=c.loop||c.rewind;this._controls.$relative.toggleClass("disabled",!c.nav||d),c.nav&&(this._controls.$previous.toggleClass("disabled",!f&&e<=this._core.minimum(!0)),this._controls.$next.toggleClass("disabled",!f&&e>=this._core.maximum(!0))),this._controls.$absolute.toggleClass("disabled",!c.dots||d),c.dots&&(b=this._pages.length-this._controls.$absolute.children().length,c.dotsData&&0!==b?this._controls.$absolute.html(this._templates.join("")):b>0?this._controls.$absolute.append(new Array(b+1).join(this._templates[0])):0>b&&this._controls.$absolute.children().slice(b).remove(),this._controls.$absolute.find(".active").removeClass("active"),this._controls.$absolute.children().eq(a.inArray(this.current(),this._pages)).addClass("active"))},e.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotsData?1:c.dotsEach||c.items)}},e.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,a.proxy(function(a,c){return a.start<=b&&a.end>=b},this)).pop()},e.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},e.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},e.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},e.prototype.to=function(b,c,d){var e;!d&&this._pages.length?(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c)):a.proxy(this._overrides.to,this._core)(b,c)},a.fn.owlCarousel.Constructor.Plugins.Navigation=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(c){this._core=c,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(c){c.namespace&&"URLHash"===this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");if(!c)return;this._hashes[c]=b.content}},this),"changed.owl.carousel":a.proxy(function(c){if(c.namespace&&"position"===c.property.name){var d=this._core.items(this._core.relative(this._core.current())),e=a.map(this._hashes,function(a,b){return a===d?b:null}).join();if(!e||b.location.hash.slice(1)===e)return;b.location.hash=e}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(a){var c=b.location.hash.substring(1),e=this._core.$stage.children(),f=this._hashes[c]&&e.index(this._hashes[c]);f!==d&&f!==this._core.current()&&this._core.to(this._core.relative(f),!1,!0)},this))};e.Defaults={URLhashListener:!1},e.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){function e(b,c){var e=!1,f=b.charAt(0).toUpperCase()+b.slice(1);return a.each((b+" "+h.join(f+" ")+f).split(" "),function(a,b){return g[b]!==d?(e=c?b:!0,!1):void 0}),e}function f(a){return e(a,!0)}var g=a("<support>").get(0).style,h="Webkit Moz O ms".split(" "),i={transition:{end:{WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}},animation:{end:{WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd",animation:"animationend"}}},j={csstransforms:function(){return!!e("transform")},csstransforms3d:function(){return!!e("perspective")},csstransitions:function(){return!!e("transition")},cssanimations:function(){return!!e("animation")}};j.csstransitions()&&(a.support.transition=new String(f("transition")),a.support.transition.end=i.transition.end[a.support.transition]),j.cssanimations()&&(a.support.animation=new String(f("animation")),a.support.animation.end=i.animation.end[a.support.animation]),j.csstransforms()&&(a.support.transform=new String(f("transform")),a.support.transform3d=j.csstransforms3d())}(window.Zepto||window.jQuery,window,document);
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.1.1
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */


(function(){

	"use strict";

	//Declare root variable - window in the browser, global on the server
	var root = this,
		previous = root.Chart;

	//Occupy the global variable of Chart, and create a simple base class
	var Chart = function(context){
		var chart = this;
		this.canvas = context.canvas;

		this.ctx = context;

		//Variables global to the chart
		var computeDimension = function(element,dimension)
		{
			if (element['offset'+dimension])
			{
				return element['offset'+dimension];
			}
			else
			{
				return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
			}
		};

		var width = this.width = computeDimension(context.canvas,'Width') || context.canvas.width;
		var height = this.height = computeDimension(context.canvas,'Height') || context.canvas.height;

		this.aspectRatio = this.width / this.height;
		//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
		helpers.retinaScale(this);

		return this;
	};
	//Globally expose the defaults to allow for user updating/changing
	Chart.defaults = {
		global: {
			// Boolean - Whether to animate the chart
			animation: true,

			// Number - Number of animation steps
			animationSteps: 60,

			// String - Animation easing effect
			animationEasing: "easeOutQuart",

			// Boolean - If we should show the scale at all
			showScale: true,

			// Boolean - If we want to override with a hard coded scale
			scaleOverride: false,

			// ** Required if scaleOverride is true **
			// Number - The number of steps in a hard coded scale
			scaleSteps: null,
			// Number - The value jump in the hard coded scale
			scaleStepWidth: null,
			// Number - The scale starting value
			scaleStartValue: null,

			// String - Colour of the scale line
			scaleLineColor: "rgba(0,0,0,.1)",

			// Number - Pixel width of the scale line
			scaleLineWidth: 1,

			// Boolean - Whether to show labels on the scale
			scaleShowLabels: true,

			// Interpolated JS string - can access value
			scaleLabel: "<%=value%>",

			// Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
			scaleIntegersOnly: true,

			// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero: false,

			// String - Scale label font declaration for the scale label
			scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Scale label font size in pixels
			scaleFontSize: 12,

			// String - Scale label font weight style
			scaleFontStyle: "normal",

			// String - Scale label font colour
			scaleFontColor: "#666",

			// Boolean - whether or not the chart should be responsive and resize when the browser does.
			responsive: false,

			// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: true,

			// Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
			showTooltips: true,

			// Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
			customTooltips: false,

			// Array - Array of string names to attach tooltip events
			tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],

			// String - Tooltip background colour
			tooltipFillColor: "rgba(0,0,0,0.8)",

			// String - Tooltip label font declaration for the scale label
			tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip label font size in pixels
			tooltipFontSize: 14,

			// String - Tooltip font weight style
			tooltipFontStyle: "normal",

			// String - Tooltip label font colour
			tooltipFontColor: "#fff",

			// String - Tooltip title font declaration for the scale label
			tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip title font size in pixels
			tooltipTitleFontSize: 14,

			// String - Tooltip title font weight style
			tooltipTitleFontStyle: "bold",

			// String - Tooltip title font colour
			tooltipTitleFontColor: "#fff",

			// String - Tooltip title template
			tooltipTitleTemplate: "<%= label%>",

			// Number - pixel width of padding around tooltip text
			tooltipYPadding: 6,

			// Number - pixel width of padding around tooltip text
			tooltipXPadding: 6,

			// Number - Size of the caret on the tooltip
			tooltipCaretSize: 8,

			// Number - Pixel radius of the tooltip border
			tooltipCornerRadius: 6,

			// Number - Pixel offset from point x to tooltip edge
			tooltipXOffset: 10,

			// String - Template string for single tooltips
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

			// String - Template string for single tooltips
			multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>",

			// String - Colour behind the legend colour block
			multiTooltipKeyBackground: '#fff',

			// Array - A list of colors to use as the defaults
			segmentColorDefault: ["#A6CEE3", "#1F78B4", "#B2DF8A", "#33A02C", "#FB9A99", "#E31A1C", "#FDBF6F", "#FF7F00", "#CAB2D6", "#6A3D9A", "#B4B482", "#B15928" ],

			// Array - A list of highlight colors to use as the defaults
			segmentHighlightColorDefaults: [ "#CEF6FF", "#47A0DC", "#DAFFB2", "#5BC854", "#FFC2C1", "#FF4244", "#FFE797", "#FFA728", "#F2DAFE", "#9265C2", "#DCDCAA", "#D98150" ],

			// Function - Will fire on animation progression.
			onAnimationProgress: function(){},

			// Function - Will fire on animation completion.
			onAnimationComplete: function(){}

		}
	};

	//Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	//Global Chart helpers object for utility methods and classes
	var helpers = Chart.helpers = {};

		//-- Basic js utility methods
	var each = helpers.each = function(loopable,callback,self){
			var additionalArgs = Array.prototype.slice.call(arguments, 3);
			// Check to see if null or undefined firstly.
			if (loopable){
				if (loopable.length === +loopable.length){
					var i;
					for (i=0; i<loopable.length; i++){
						callback.apply(self,[loopable[i], i].concat(additionalArgs));
					}
				}
				else{
					for (var item in loopable){
						callback.apply(self,[loopable[item],item].concat(additionalArgs));
					}
				}
			}
		},
		clone = helpers.clone = function(obj){
			var objClone = {};
			each(obj,function(value,key){
				if (obj.hasOwnProperty(key)){
					objClone[key] = value;
				}
			});
			return objClone;
		},
		extend = helpers.extend = function(base){
			each(Array.prototype.slice.call(arguments,1), function(extensionObject) {
				each(extensionObject,function(value,key){
					if (extensionObject.hasOwnProperty(key)){
						base[key] = value;
					}
				});
			});
			return base;
		},
		merge = helpers.merge = function(base,master){
			//Merge properties in left object over to a shallow clone of object right.
			var args = Array.prototype.slice.call(arguments,0);
			args.unshift({});
			return extend.apply(null, args);
		},
		indexOf = helpers.indexOf = function(arrayToSearch, item){
			if (Array.prototype.indexOf) {
				return arrayToSearch.indexOf(item);
			}
			else{
				for (var i = 0; i < arrayToSearch.length; i++) {
					if (arrayToSearch[i] === item) return i;
				}
				return -1;
			}
		},
		where = helpers.where = function(collection, filterCallback){
			var filtered = [];

			helpers.each(collection, function(item){
				if (filterCallback(item)){
					filtered.push(item);
				}
			});

			return filtered;
		},
		findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to start of the array
			if (!startIndex){
				startIndex = -1;
			}
			for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to end of the array
			if (!startIndex){
				startIndex = arrayToSearch.length;
			}
			for (var i = startIndex - 1; i >= 0; i--) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		inherits = helpers.inherits = function(extensions){
			//Basic javascript inheritance based on the model created in Backbone.js
			var parent = this;
			var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function(){ return parent.apply(this, arguments); };

			var Surrogate = function(){ this.constructor = ChartElement;};
			Surrogate.prototype = parent.prototype;
			ChartElement.prototype = new Surrogate();

			ChartElement.extend = inherits;

			if (extensions) extend(ChartElement.prototype, extensions);

			ChartElement.__super__ = parent.prototype;

			return ChartElement;
		},
		noop = helpers.noop = function(){},
		uid = helpers.uid = (function(){
			var id=0;
			return function(){
				return "chart-" + id++;
			};
		})(),
		warn = helpers.warn = function(str){
			//Method for warning of errors
			if (window.console && typeof window.console.warn === "function") console.warn(str);
		},
		amd = helpers.amd = (typeof define === 'function' && define.amd),
		//-- Math methods
		isNumber = helpers.isNumber = function(n){
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		max = helpers.max = function(array){
			return Math.max.apply( Math, array );
		},
		min = helpers.min = function(array){
			return Math.min.apply( Math, array );
		},
		cap = helpers.cap = function(valueToCap,maxValue,minValue){
			if(isNumber(maxValue)) {
				if( valueToCap > maxValue ) {
					return maxValue;
				}
			}
			else if(isNumber(minValue)){
				if ( valueToCap < minValue ){
					return minValue;
				}
			}
			return valueToCap;
		},
		getDecimalPlaces = helpers.getDecimalPlaces = function(num){
			if (num%1!==0 && isNumber(num)){
				var s = num.toString();
				if(s.indexOf("e-") < 0){
					// no exponent, e.g. 0.01
					return s.split(".")[1].length;
				}
				else if(s.indexOf(".") < 0) {
					// no decimal point, e.g. 1e-9
					return parseInt(s.split("e-")[1]);
				}
				else {
					// exponent and decimal point, e.g. 1.23e-9
					var parts = s.split(".")[1].split("e-");
					return parts[0].length + parseInt(parts[1]);
				}
			}
			else {
				return 0;
			}
		},
		toRadians = helpers.radians = function(degrees){
			return degrees * (Math.PI/180);
		},
		// Gets the angle from vertical upright to the point about a centre.
		getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint){
			var distanceFromXCenter = anglePoint.x - centrePoint.x,
				distanceFromYCenter = anglePoint.y - centrePoint.y,
				radialDistanceFromCenter = Math.sqrt( distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


			var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

			//If the segment is in the top left quadrant, we need to add another rotation to the angle
			if (distanceFromXCenter < 0 && distanceFromYCenter < 0){
				angle += Math.PI*2;
			}

			return {
				angle: angle,
				distance: radialDistanceFromCenter
			};
		},
		aliasPixel = helpers.aliasPixel = function(pixelWidth){
			return (pixelWidth % 2 === 0) ? 0 : 0.5;
		},
		splineCurve = helpers.splineCurve = function(FirstPoint,MiddlePoint,AfterPoint,t){
			//Props to Rob Spencer at scaled innovation for his post on splining between points
			//http://scaledinnovation.com/analytics/splines/aboutSplines.html
			var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),
				d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),
				fa=t*d01/(d01+d12),// scaling factor for triangle Ta
				fb=t*d12/(d01+d12);
			return {
				inner : {
					x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)
				},
				outer : {
					x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)
				}
			};
		},
		calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val){
			return Math.floor(Math.log(val) / Math.LN10);
		},
		calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly){

			//Set a minimum step of two - a point at the top of the graph, and a point at the base
			var minSteps = 2,
				maxSteps = Math.floor(drawingSize/(textSize * 1.5)),
				skipFitting = (minSteps >= maxSteps);

			// Filter out null values since these would min() to zero
			var values = [];
			each(valuesArray, function( v ){
				v == null || values.push( v );
			});
			var minValue = min(values),
			    maxValue = max(values);

			// We need some degree of separation here to calculate the scales if all the values are the same
			// Adding/minusing 0.5 will give us a range of 1.
			if (maxValue === minValue){
				maxValue += 0.5;
				// So we don't end up with a graph with a negative start value if we've said always start from zero
				if (minValue >= 0.5 && !startFromZero){
					minValue -= 0.5;
				}
				else{
					// Make up a whole number above the values
					maxValue += 0.5;
				}
			}

			var	valueRange = Math.abs(maxValue - minValue),
				rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
				graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphRange = graphMax - graphMin,
				stepValue = Math.pow(10, rangeOrderOfMagnitude),
				numberOfSteps = Math.round(graphRange / stepValue);

			//If we have more space on the graph we'll use it to give more definition to the data
			while((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
				if(numberOfSteps > maxSteps){
					stepValue *=2;
					numberOfSteps = Math.round(graphRange/stepValue);
					// Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
					if (numberOfSteps % 1 !== 0){
						skipFitting = true;
					}
				}
				//We can fit in double the amount of scale points on the scale
				else{
					//If user has declared ints only, and the step value isn't a decimal
					if (integersOnly && rangeOrderOfMagnitude >= 0){
						//If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
						if(stepValue/2 % 1 === 0){
							stepValue /=2;
							numberOfSteps = Math.round(graphRange/stepValue);
						}
						//If it would make it a float break out of the loop
						else{
							break;
						}
					}
					//If the scale doesn't have to be an int, make the scale more granular anyway.
					else{
						stepValue /=2;
						numberOfSteps = Math.round(graphRange/stepValue);
					}

				}
			}

			if (skipFitting){
				numberOfSteps = minSteps;
				stepValue = graphRange / numberOfSteps;
			}

			return {
				steps : numberOfSteps,
				stepValue : stepValue,
				min : graphMin,
				max	: graphMin + (numberOfSteps * stepValue)
			};

		},
		/* jshint ignore:start */
		// Blows up jshint errors based on the new Function constructor
		//Templating methods
		//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
		template = helpers.template = function(templateString, valuesObject){

			// If templateString is function rather than string-template - call the function for valuesObject

			if(templateString instanceof Function){
			 	return templateString(valuesObject);
		 	}

			var cache = {};
			function tmpl(str, data){
				// Figure out if we're getting a template, or if we need to
				// load the template - and be sure to cache the result.
				var fn = !/\W/.test(str) ?
				cache[str] = cache[str] :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					str
						.replace(/[\r\t\n]/g, " ")
						.split("<%").join("\t")
						.replace(/((^|%>)[^\t]*)'/g, "$1\r")
						.replace(/\t=(.*?)%>/g, "',$1,'")
						.split("\t").join("');")
						.split("%>").join("p.push('")
						.split("\r").join("\\'") +
					"');}return p.join('');"
				);

				// Provide some basic currying to the user
				return data ? fn( data ) : fn;
			}
			return tmpl(templateString,valuesObject);
		},
		/* jshint ignore:end */
		generateLabels = helpers.generateLabels = function(templateString,numberOfSteps,graphMin,stepValue){
			var labelsArray = new Array(numberOfSteps);
			if (templateString){
				each(labelsArray,function(val,index){
					labelsArray[index] = template(templateString,{value: (graphMin + (stepValue*(index+1)))});
				});
			}
			return labelsArray;
		},
		//--Animation methods
		//Easing functions adapted from Robert Penner's easing equations
		//http://www.robertpenner.com/easing/
		easingEffects = helpers.easingEffects = {
			linear: function (t) {
				return t;
			},
			easeInQuad: function (t) {
				return t * t;
			},
			easeOutQuad: function (t) {
				return -1 * t * (t - 2);
			},
			easeInOutQuad: function (t) {
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * t * t;
				}
				return -1 / 2 * ((--t) * (t - 2) - 1);
			},
			easeInCubic: function (t) {
				return t * t * t;
			},
			easeOutCubic: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t + 1);
			},
			easeInOutCubic: function (t) {
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * t * t * t;
				}
				return 1 / 2 * ((t -= 2) * t * t + 2);
			},
			easeInQuart: function (t) {
				return t * t * t * t;
			},
			easeOutQuart: function (t) {
				return -1 * ((t = t / 1 - 1) * t * t * t - 1);
			},
			easeInOutQuart: function (t) {
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * t * t * t * t;
				}
				return -1 / 2 * ((t -= 2) * t * t * t - 2);
			},
			easeInQuint: function (t) {
				return 1 * (t /= 1) * t * t * t * t;
			},
			easeOutQuint: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
			},
			easeInOutQuint: function (t) {
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * t * t * t * t * t;
				}
				return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
			},
			easeInSine: function (t) {
				return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
			},
			easeOutSine: function (t) {
				return 1 * Math.sin(t / 1 * (Math.PI / 2));
			},
			easeInOutSine: function (t) {
				return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
			},
			easeInExpo: function (t) {
				return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
			},
			easeOutExpo: function (t) {
				return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
			},
			easeInOutExpo: function (t) {
				if (t === 0){
					return 0;
				}
				if (t === 1){
					return 1;
				}
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * Math.pow(2, 10 * (t - 1));
				}
				return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
			},
			easeInCirc: function (t) {
				if (t >= 1){
					return t;
				}
				return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
			},
			easeOutCirc: function (t) {
				return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
			},
			easeInOutCirc: function (t) {
				if ((t /= 1 / 2) < 1){
					return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
				}
				return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
			},
			easeInElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0){
					return 0;
				}
				if ((t /= 1) == 1){
					return 1;
				}
				if (!p){
					p = 1 * 0.3;
				}
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else{
					s = p / (2 * Math.PI) * Math.asin(1 / a);
				}
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			},
			easeOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0){
					return 0;
				}
				if ((t /= 1) == 1){
					return 1;
				}
				if (!p){
					p = 1 * 0.3;
				}
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else{
					s = p / (2 * Math.PI) * Math.asin(1 / a);
				}
				return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
			},
			easeInOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0){
					return 0;
				}
				if ((t /= 1 / 2) == 2){
					return 1;
				}
				if (!p){
					p = 1 * (0.3 * 1.5);
				}
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else {
					s = p / (2 * Math.PI) * Math.asin(1 / a);
				}
				if (t < 1){
					return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));}
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
			},
			easeInBack: function (t) {
				var s = 1.70158;
				return 1 * (t /= 1) * t * ((s + 1) * t - s);
			},
			easeOutBack: function (t) {
				var s = 1.70158;
				return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
			},
			easeInOutBack: function (t) {
				var s = 1.70158;
				if ((t /= 1 / 2) < 1){
					return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
				}
				return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
			},
			easeInBounce: function (t) {
				return 1 - easingEffects.easeOutBounce(1 - t);
			},
			easeOutBounce: function (t) {
				if ((t /= 1) < (1 / 2.75)) {
					return 1 * (7.5625 * t * t);
				} else if (t < (2 / 2.75)) {
					return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
				} else if (t < (2.5 / 2.75)) {
					return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
				} else {
					return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
				}
			},
			easeInOutBounce: function (t) {
				if (t < 1 / 2){
					return easingEffects.easeInBounce(t * 2) * 0.5;
				}
				return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
			}
		},
		//Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
		requestAnimFrame = helpers.requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
		})(),
		cancelAnimFrame = helpers.cancelAnimFrame = (function(){
			return window.cancelAnimationFrame ||
				window.webkitCancelAnimationFrame ||
				window.mozCancelAnimationFrame ||
				window.oCancelAnimationFrame ||
				window.msCancelAnimationFrame ||
				function(callback) {
					return window.clearTimeout(callback, 1000 / 60);
				};
		})(),
		animationLoop = helpers.animationLoop = function(callback,totalSteps,easingString,onProgress,onComplete,chartInstance){

			var currentStep = 0,
				easingFunction = easingEffects[easingString] || easingEffects.linear;

			var animationFrame = function(){
				currentStep++;
				var stepDecimal = currentStep/totalSteps;
				var easeDecimal = easingFunction(stepDecimal);

				callback.call(chartInstance,easeDecimal,stepDecimal, currentStep);
				onProgress.call(chartInstance,easeDecimal,stepDecimal);
				if (currentStep < totalSteps){
					chartInstance.animationFrame = requestAnimFrame(animationFrame);
				} else{
					onComplete.apply(chartInstance);
				}
			};
			requestAnimFrame(animationFrame);
		},
		//-- DOM methods
		getRelativePosition = helpers.getRelativePosition = function(evt){
			var mouseX, mouseY;
			var e = evt.originalEvent || evt,
				canvas = evt.currentTarget || evt.srcElement,
				boundingRect = canvas.getBoundingClientRect();

			if (e.touches){
				mouseX = e.touches[0].clientX - boundingRect.left;
				mouseY = e.touches[0].clientY - boundingRect.top;

			}
			else{
				mouseX = e.clientX - boundingRect.left;
				mouseY = e.clientY - boundingRect.top;
			}

			return {
				x : mouseX,
				y : mouseY
			};

		},
		addEvent = helpers.addEvent = function(node,eventType,method){
			if (node.addEventListener){
				node.addEventListener(eventType,method);
			} else if (node.attachEvent){
				node.attachEvent("on"+eventType, method);
			} else {
				node["on"+eventType] = method;
			}
		},
		removeEvent = helpers.removeEvent = function(node, eventType, handler){
			if (node.removeEventListener){
				node.removeEventListener(eventType, handler, false);
			} else if (node.detachEvent){
				node.detachEvent("on"+eventType,handler);
			} else{
				node["on" + eventType] = noop;
			}
		},
		bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler){
			// Create the events object if it's not already present
			if (!chartInstance.events) chartInstance.events = {};

			each(arrayOfEvents,function(eventName){
				chartInstance.events[eventName] = function(){
					handler.apply(chartInstance, arguments);
				};
				addEvent(chartInstance.chart.canvas,eventName,chartInstance.events[eventName]);
			});
		},
		unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
			each(arrayOfEvents, function(handler,eventName){
				removeEvent(chartInstance.chart.canvas, eventName, handler);
			});
		},
		getMaximumWidth = helpers.getMaximumWidth = function(domNode){
			var container = domNode.parentNode,
			    padding = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));
			// TODO = check cross browser stuff with this.
			return container ? container.clientWidth - padding : 0;
		},
		getMaximumHeight = helpers.getMaximumHeight = function(domNode){
			var container = domNode.parentNode,
			    padding = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));
			// TODO = check cross browser stuff with this.
			return container ? container.clientHeight - padding : 0;
		},
		getStyle = helpers.getStyle = function (el, property) {
			return el.currentStyle ?
				el.currentStyle[property] :
				document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
		},
		getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support
		retinaScale = helpers.retinaScale = function(chart){
			var ctx = chart.ctx,
				width = chart.canvas.width,
				height = chart.canvas.height;

			if (window.devicePixelRatio) {
				ctx.canvas.style.width = width + "px";
				ctx.canvas.style.height = height + "px";
				ctx.canvas.height = height * window.devicePixelRatio;
				ctx.canvas.width = width * window.devicePixelRatio;
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
			}
		},
		//-- Canvas methods
		clear = helpers.clear = function(chart){
			chart.ctx.clearRect(0,0,chart.width,chart.height);
		},
		fontString = helpers.fontString = function(pixelSize,fontStyle,fontFamily){
			return fontStyle + " " + pixelSize+"px " + fontFamily;
		},
		longestText = helpers.longestText = function(ctx,font,arrayOfStrings){
			ctx.font = font;
			var longest = 0;
			each(arrayOfStrings,function(string){
				var textWidth = ctx.measureText(string).width;
				longest = (textWidth > longest) ? textWidth : longest;
			});
			return longest;
		},
		drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx,x,y,width,height,radius){
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		};


	//Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	//Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	Chart.Type = function(data,options,chart){
		this.options = options;
		this.chart = chart;
		this.id = uid();
		//Add the chart instance to the global namespace
		Chart.instances[this.id] = this;

		// Initialize is always called when a chart type is created
		// By default it is a no op, but it should be extended
		if (options.responsive){
			this.resize();
		}
		this.initialize.call(this,data);
	};

	//Core methods that'll be a part of every chart type
	extend(Chart.Type.prototype,{
		initialize : function(){return this;},
		clear : function(){
			clear(this.chart);
			return this;
		},
		stop : function(){
			// Stops any current animation loop occuring
			Chart.animationService.cancelAnimation(this);
			return this;
		},
		resize : function(callback){
			this.stop();
			var canvas = this.chart.canvas,
				newWidth = getMaximumWidth(this.chart.canvas),
				newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);

			canvas.width = this.chart.width = newWidth;
			canvas.height = this.chart.height = newHeight;

			retinaScale(this.chart);

			if (typeof callback === "function"){
				callback.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			return this;
		},
		reflow : noop,
		render : function(reflow){
			if (reflow){
				this.reflow();
			}
			
			if (this.options.animation && !reflow){
				var animation = new Chart.Animation();
				animation.numSteps = this.options.animationSteps;
				animation.easing = this.options.animationEasing;
				
				// render function
				animation.render = function(chartInstance, animationObject) {
					var easingFunction = helpers.easingEffects[animationObject.easing];
					var stepDecimal = animationObject.currentStep / animationObject.numSteps;
					var easeDecimal = easingFunction(stepDecimal);
					
					chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
				};
				
				// user events
				animation.onAnimationProgress = this.options.onAnimationProgress;
				animation.onAnimationComplete = this.options.onAnimationComplete;
				
				Chart.animationService.addAnimation(this, animation);
			}
			else{
				this.draw();
				this.options.onAnimationComplete.call(this);
			}
			return this;
		},
		generateLegend : function(){
			return helpers.template(this.options.legendTemplate, this);
		},
		destroy : function(){
			this.stop();
			this.clear();
			unbindEvents(this, this.events);
			var canvas = this.chart.canvas;

			// Reset canvas height/width attributes starts a fresh with the canvas context
			canvas.width = this.chart.width;
			canvas.height = this.chart.height;

			// < IE9 doesn't support removeProperty
			if (canvas.style.removeProperty) {
				canvas.style.removeProperty('width');
				canvas.style.removeProperty('height');
			} else {
				canvas.style.removeAttribute('width');
				canvas.style.removeAttribute('height');
			}

			delete Chart.instances[this.id];
		},
		showTooltip : function(ChartElements, forceRedraw){
			// Only redraw the chart if we've actually changed what we're hovering on.
			if (typeof this.activeElements === 'undefined') this.activeElements = [];

			var isChanged = (function(Elements){
				var changed = false;

				if (Elements.length !== this.activeElements.length){
					changed = true;
					return changed;
				}

				each(Elements, function(element, index){
					if (element !== this.activeElements[index]){
						changed = true;
					}
				}, this);
				return changed;
			}).call(this, ChartElements);

			if (!isChanged && !forceRedraw){
				return;
			}
			else{
				this.activeElements = ChartElements;
			}
			this.draw();
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (ChartElements.length > 0){
				// If we have multiple datasets, show a MultiTooltip for all of the data points at that index
				if (this.datasets && this.datasets.length > 1) {
					var dataArray,
						dataIndex;

					for (var i = this.datasets.length - 1; i >= 0; i--) {
						dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
						dataIndex = indexOf(dataArray, ChartElements[0]);
						if (dataIndex !== -1){
							break;
						}
					}
					var tooltipLabels = [],
						tooltipColors = [],
						medianPosition = (function(index) {

							// Get all the points at that particular index
							var Elements = [],
								dataCollection,
								xPositions = [],
								yPositions = [],
								xMax,
								yMax,
								xMin,
								yMin;
							helpers.each(this.datasets, function(dataset){
								dataCollection = dataset.points || dataset.bars || dataset.segments;
								if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){
									Elements.push(dataCollection[dataIndex]);
								}
							});

							helpers.each(Elements, function(element) {
								xPositions.push(element.x);
								yPositions.push(element.y);


								//Include any colour information about the element
								tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
								tooltipColors.push({
									fill: element._saved.fillColor || element.fillColor,
									stroke: element._saved.strokeColor || element.strokeColor
								});

							}, this);

							yMin = min(yPositions);
							yMax = max(yPositions);

							xMin = min(xPositions);
							xMax = max(xPositions);

							return {
								x: (xMin > this.chart.width/2) ? xMin : xMax,
								y: (yMin + yMax)/2
							};
						}).call(this, dataIndex);

					new Chart.MultiTooltip({
						x: medianPosition.x,
						y: medianPosition.y,
						xPadding: this.options.tooltipXPadding,
						yPadding: this.options.tooltipYPadding,
						xOffset: this.options.tooltipXOffset,
						fillColor: this.options.tooltipFillColor,
						textColor: this.options.tooltipFontColor,
						fontFamily: this.options.tooltipFontFamily,
						fontStyle: this.options.tooltipFontStyle,
						fontSize: this.options.tooltipFontSize,
						titleTextColor: this.options.tooltipTitleFontColor,
						titleFontFamily: this.options.tooltipTitleFontFamily,
						titleFontStyle: this.options.tooltipTitleFontStyle,
						titleFontSize: this.options.tooltipTitleFontSize,
						cornerRadius: this.options.tooltipCornerRadius,
						labels: tooltipLabels,
						legendColors: tooltipColors,
						legendColorBackground : this.options.multiTooltipKeyBackground,
						title: template(this.options.tooltipTitleTemplate,ChartElements[0]),
						chart: this.chart,
						ctx: this.chart.ctx,
						custom: this.options.customTooltips
					}).draw();

				} else {
					each(ChartElements, function(Element) {
						var tooltipPosition = Element.tooltipPosition();
						new Chart.Tooltip({
							x: Math.round(tooltipPosition.x),
							y: Math.round(tooltipPosition.y),
							xPadding: this.options.tooltipXPadding,
							yPadding: this.options.tooltipYPadding,
							fillColor: this.options.tooltipFillColor,
							textColor: this.options.tooltipFontColor,
							fontFamily: this.options.tooltipFontFamily,
							fontStyle: this.options.tooltipFontStyle,
							fontSize: this.options.tooltipFontSize,
							caretHeight: this.options.tooltipCaretSize,
							cornerRadius: this.options.tooltipCornerRadius,
							text: template(this.options.tooltipTemplate, Element),
							chart: this.chart,
							custom: this.options.customTooltips
						}).draw();
					}, this);
				}
			}
			return this;
		},
		toBase64Image : function(){
			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
		}
	});

	Chart.Type.extend = function(extensions){

		var parent = this;

		var ChartType = function(){
			return parent.apply(this,arguments);
		};

		//Copy the prototype object of the this class
		ChartType.prototype = clone(parent.prototype);
		//Now overwrite some of the properties in the base class with the new extensions
		extend(ChartType.prototype, extensions);

		ChartType.extend = Chart.Type.extend;

		if (extensions.name || parent.prototype.name){

			var chartName = extensions.name || parent.prototype.name;
			//Assign any potential default values of the new chart type

			//If none are defined, we'll use a clone of the chart type this is being extended from.
			//I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
			//doesn't define some defaults of their own.

			var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};

			Chart.defaults[chartName] = extend(baseDefaults,extensions.defaults);

			Chart.types[chartName] = ChartType;

			//Register this new chart type in the Chart prototype
			Chart.prototype[chartName] = function(data,options){
				var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
				return new ChartType(data,config,this);
			};
		} else{
			warn("Name not provided for this chart, so it hasn't been registered");
		}
		return parent;
	};

	Chart.Element = function(configuration){
		extend(this,configuration);
		this.initialize.apply(this,arguments);
		this.save();
	};
	extend(Chart.Element.prototype,{
		initialize : function(){},
		restore : function(props){
			if (!props){
				extend(this,this._saved);
			} else {
				each(props,function(key){
					this[key] = this._saved[key];
				},this);
			}
			return this;
		},
		save : function(){
			this._saved = clone(this);
			delete this._saved._saved;
			return this;
		},
		update : function(newProps){
			each(newProps,function(value,key){
				this._saved[key] = this[key];
				this[key] = value;
			},this);
			return this;
		},
		transition : function(props,ease){
			each(props,function(value,key){
				this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
			},this);
			return this;
		},
		tooltipPosition : function(){
			return {
				x : this.x,
				y : this.y
			};
		},
		hasValue: function(){
			return isNumber(this.value);
		}
	});

	Chart.Element.extend = inherits;


	Chart.Point = Chart.Element.extend({
		display: true,
		inRange: function(chartX,chartY){
			var hitDetectionRange = this.hitDetectionRadius + this.radius;
			return ((Math.pow(chartX-this.x, 2)+Math.pow(chartY-this.y, 2)) < Math.pow(hitDetectionRange,2));
		},
		draw : function(){
			if (this.display){
				var ctx = this.ctx;
				ctx.beginPath();

				ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
				ctx.closePath();

				ctx.strokeStyle = this.strokeColor;
				ctx.lineWidth = this.strokeWidth;

				ctx.fillStyle = this.fillColor;

				ctx.fill();
				ctx.stroke();
			}


			//Quick debug for bezier curve splining
			//Highlights control points and the line between them.
			//Handy for dev - stripped in the min version.

			// ctx.save();
			// ctx.fillStyle = "black";
			// ctx.strokeStyle = "black"
			// ctx.beginPath();
			// ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.beginPath();
			// ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);
			// ctx.lineTo(this.x, this.y);
			// ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);
			// ctx.stroke();

			// ctx.restore();



		}
	});

	Chart.Arc = Chart.Element.extend({
		inRange : function(chartX,chartY){

			var pointRelativePosition = helpers.getAngleFromPoint(this, {
				x: chartX,
				y: chartY
			});

			// Normalize all angles to 0 - 2*PI (0 - 360°)
			var pointRelativeAngle = pointRelativePosition.angle % (Math.PI * 2),
			    startAngle = (Math.PI * 2 + this.startAngle) % (Math.PI * 2),
			    endAngle = (Math.PI * 2 + this.endAngle) % (Math.PI * 2) || 360;

			// Calculate wether the pointRelativeAngle is between the start and the end angle
			var betweenAngles = (endAngle < startAngle) ?
				pointRelativeAngle <= endAngle || pointRelativeAngle >= startAngle:
				pointRelativeAngle >= startAngle && pointRelativeAngle <= endAngle;

			//Check if within the range of the open/close angle
			var withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

			return (betweenAngles && withinRadius);
			//Ensure within the outside of the arc centre, but inside arc outer
		},
		tooltipPosition : function(){
			var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
				rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
			return {
				x : this.x + (Math.cos(centreAngle) * rangeFromCentre),
				y : this.y + (Math.sin(centreAngle) * rangeFromCentre)
			};
		},
		draw : function(animationPercent){

			var easingDecimal = animationPercent || 1;

			var ctx = this.ctx;

			ctx.beginPath();

			ctx.arc(this.x, this.y, this.outerRadius < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);

            ctx.arc(this.x, this.y, this.innerRadius < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);

			ctx.closePath();
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			ctx.fillStyle = this.fillColor;

			ctx.fill();
			ctx.lineJoin = 'bevel';

			if (this.showStroke){
				ctx.stroke();
			}
		}
	});

	Chart.Rectangle = Chart.Element.extend({
		draw : function(){
			var ctx = this.ctx,
				halfWidth = this.width/2,
				leftX = this.x - halfWidth,
				rightX = this.x + halfWidth,
				top = this.base - (this.base - this.y),
				halfStroke = this.strokeWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (this.showStroke){
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();

			ctx.fillStyle = this.fillColor;
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(leftX, this.base);
			ctx.lineTo(leftX, top);
			ctx.lineTo(rightX, top);
			ctx.lineTo(rightX, this.base);
			ctx.fill();
			if (this.showStroke){
				ctx.stroke();
			}
		},
		height : function(){
			return this.base - this.y;
		},
		inRange : function(chartX,chartY){
			return (chartX >= this.x - this.width/2 && chartX <= this.x + this.width/2) && (chartY >= this.y && chartY <= this.base);
		}
	});

	Chart.Animation = Chart.Element.extend({
		currentStep: null, // the current animation step
		numSteps: 60, // default number of steps
		easing: "", // the easing to use for this animation
		render: null, // render function used by the animation service
		
		onAnimationProgress: null, // user specified callback to fire on each step of the animation 
		onAnimationComplete: null, // user specified callback to fire when the animation finishes
	});
	
	Chart.Tooltip = Chart.Element.extend({
		draw : function(){

			var ctx = this.chart.ctx;

			ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.xAlign = "center";
			this.yAlign = "above";

			//Distance between the actual element.y position and the start of the tooltip caret
			var caretPadding = this.caretPadding = 2;

			var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
				tooltipRectHeight = this.fontSize + 2*this.yPadding,
				tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

			if (this.x + tooltipWidth/2 >this.chart.width){
				this.xAlign = "left";
			} else if (this.x - tooltipWidth/2 < 0){
				this.xAlign = "right";
			}

			if (this.y - tooltipHeight < 0){
				this.yAlign = "below";
			}


			var tooltipX = this.x - tooltipWidth/2,
				tooltipY = this.y - tooltipHeight;

			ctx.fillStyle = this.fillColor;

			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				switch(this.yAlign)
				{
				case "above":
					//Draw a caret above the x/y
					ctx.beginPath();
					ctx.moveTo(this.x,this.y - caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.closePath();
					ctx.fill();
					break;
				case "below":
					tooltipY = this.y + caretPadding + this.caretHeight;
					//Draw a caret below the x/y
					ctx.beginPath();
					ctx.moveTo(this.x, this.y + caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.closePath();
					ctx.fill();
					break;
				}

				switch(this.xAlign)
				{
				case "left":
					tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
					break;
				case "right":
					tooltipX = this.x - (this.cornerRadius + this.caretHeight);
					break;
				}

				drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);

				ctx.fill();

				ctx.fillStyle = this.textColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
			}
		}
	});

	Chart.MultiTooltip = Chart.Element.extend({
		initialize : function(){
			this.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.titleFont = fontString(this.titleFontSize,this.titleFontStyle,this.titleFontFamily);

			this.titleHeight = this.title ? this.titleFontSize * 1.5 : 0;
			this.height = (this.labels.length * this.fontSize) + ((this.labels.length-1) * (this.fontSize/2)) + (this.yPadding*2) + this.titleHeight;

			this.ctx.font = this.titleFont;

			var titleWidth = this.ctx.measureText(this.title).width,
				//Label has a legend square as well so account for this.
				labelWidth = longestText(this.ctx,this.font,this.labels) + this.fontSize + 3,
				longestTextWidth = max([labelWidth,titleWidth]);

			this.width = longestTextWidth + (this.xPadding*2);


			var halfHeight = this.height/2;

			//Check to ensure the height will fit on the canvas
			if (this.y - halfHeight < 0 ){
				this.y = halfHeight;
			} else if (this.y + halfHeight > this.chart.height){
				this.y = this.chart.height - halfHeight;
			}

			//Decide whether to align left or right based on position on canvas
			if (this.x > this.chart.width/2){
				this.x -= this.xOffset + this.width;
			} else {
				this.x += this.xOffset;
			}


		},
		getLineHeight : function(index){
			var baseLineHeight = this.y - (this.height/2) + this.yPadding,
				afterTitleIndex = index-1;

			//If the index is zero, we're getting the title
			if (index === 0){
				return baseLineHeight + this.titleHeight / 3;
			} else{
				return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize / 2) + this.titleHeight;
			}

		},
		draw : function(){
			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				drawRoundedRectangle(this.ctx,this.x,this.y - this.height/2,this.width,this.height,this.cornerRadius);
				var ctx = this.ctx;
				ctx.fillStyle = this.fillColor;
				ctx.fill();
				ctx.closePath();

				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				ctx.fillStyle = this.titleTextColor;
				ctx.font = this.titleFont;

				ctx.fillText(this.title,this.x + this.xPadding, this.getLineHeight(0));

				ctx.font = this.font;
				helpers.each(this.labels,function(label,index){
					ctx.fillStyle = this.textColor;
					ctx.fillText(label,this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

					//A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)
					//ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);
					//Instead we'll make a white filled block to put the legendColour palette over.

					ctx.fillStyle = this.legendColorBackground;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);

					ctx.fillStyle = this.legendColors[index].fill;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);


				},this);
			}
		}
	});

	Chart.Scale = Chart.Element.extend({
		initialize : function(){
			this.fit();
		},
		buildYLabels : function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
			this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx,this.font,this.yLabels) + 10 : 0;
		},
		addXLabel : function(label){
			this.xLabels.push(label);
			this.valuesCount++;
			this.fit();
		},
		removeXLabel : function(){
			this.xLabels.shift();
			this.valuesCount--;
			this.fit();
		},
		// Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
		fit: function(){
			// First we need the width of the yLabels, assuming the xLabels aren't rotated

			// To do that we need the base line at the top and base of the chart, assuming there is no x label rotation
			this.startPoint = (this.display) ? this.fontSize : 0;
			this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels

			// Apply padding settings to the start and end point.
			this.startPoint += this.padding;
			this.endPoint -= this.padding;

			// Cache the starting endpoint, excluding the space for x labels
			var cachedEndPoint = this.endPoint;

			// Cache the starting height, so can determine if we need to recalculate the scale yAxis
			var cachedHeight = this.endPoint - this.startPoint,
				cachedYLabelWidth;

			// Build the current yLabels so we have an idea of what size they'll be to start
			/*
			 *	This sets what is returned from calculateScaleRange as static properties of this class:
			 *
				this.steps;
				this.stepValue;
				this.min;
				this.max;
			 *
			 */
			this.calculateYRange(cachedHeight);

			// With these properties set we can now build the array of yLabels
			// and also the width of the largest yLabel
			this.buildYLabels();

			this.calculateXLabelRotation();

			while((cachedHeight > this.endPoint - this.startPoint)){
				cachedHeight = this.endPoint - this.startPoint;
				cachedYLabelWidth = this.yLabelWidth;

				this.calculateYRange(cachedHeight);
				this.buildYLabels();

				// Only go through the xLabel loop again if the yLabel width has changed
				if (cachedYLabelWidth < this.yLabelWidth){
					this.endPoint = cachedEndPoint;
					this.calculateXLabelRotation();
				}
			}

		},
		calculateXLabelRotation : function(){
			//Get the width of each grid by calculating the difference
			//between x offsets between 0 and 1.

			this.ctx.font = this.font;

			var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
				lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
				firstRotated,
				lastRotated;


			this.xScalePaddingRight = lastWidth/2 + 3;
			this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth) ? firstWidth/2 : this.yLabelWidth;

			this.xLabelRotation = 0;
			if (this.display){
				var originalLabelWidth = longestText(this.ctx,this.font,this.xLabels),
					cosRotation,
					firstRotatedWidth;
				this.xLabelWidth = originalLabelWidth;
				//Allow 3 pixels x2 padding either side for label readability
				var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

				//Max label rotate should be 90 - also act as a loop counter
				while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){
					cosRotation = Math.cos(toRadians(this.xLabelRotation));

					firstRotated = cosRotation * firstWidth;
					lastRotated = cosRotation * lastWidth;

					// We're right aligning the text now.
					if (firstRotated + this.fontSize / 2 > this.yLabelWidth){
						this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
					}
					this.xScalePaddingRight = this.fontSize/2;


					this.xLabelRotation++;
					this.xLabelWidth = cosRotation * originalLabelWidth;

				}
				if (this.xLabelRotation > 0){
					this.endPoint -= Math.sin(toRadians(this.xLabelRotation))*originalLabelWidth + 3;
				}
			}
			else{
				this.xLabelWidth = 0;
				this.xScalePaddingRight = this.padding;
				this.xScalePaddingLeft = this.padding;
			}

		},
		// Needs to be overidden in each Chart type
		// Otherwise we need to pass all the data into the scale class
		calculateYRange: noop,
		drawingArea: function(){
			return this.startPoint - this.endPoint;
		},
		calculateY : function(value){
			var scalingFactor = this.drawingArea() / (this.min - this.max);
			return this.endPoint - (scalingFactor * (value - this.min));
		},
		calculateX : function(index){
			var isRotated = (this.xLabelRotation > 0),
				// innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,
				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
				valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),
				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

			if (this.offsetGridLines){
				valueOffset += (valueWidth/2);
			}

			return Math.round(valueOffset);
		},
		update : function(newProps){
			helpers.extend(this, newProps);
			this.fit();
		},
		draw : function(){
			var ctx = this.ctx,
				yLabelGap = (this.endPoint - this.startPoint) / this.steps,
				xStart = Math.round(this.xScalePaddingLeft);
			if (this.display){
				ctx.fillStyle = this.textColor;
				ctx.font = this.font;
				each(this.yLabels,function(labelString,index){
					var yLabelCenter = this.endPoint - (yLabelGap * index),
						linePositionY = Math.round(yLabelCenter),
						drawHorizontalLine = this.showHorizontalLines;

					ctx.textAlign = "right";
					ctx.textBaseline = "middle";
					if (this.showLabels){
						ctx.fillText(labelString,xStart - 10,yLabelCenter);
					}

					// This is X axis, so draw it
					if (index === 0 && !drawHorizontalLine){
						drawHorizontalLine = true;
					}

					if (drawHorizontalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					linePositionY += helpers.aliasPixel(ctx.lineWidth);

					if(drawHorizontalLine){
						ctx.moveTo(xStart, linePositionY);
						ctx.lineTo(this.width, linePositionY);
						ctx.stroke();
						ctx.closePath();
					}

					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;
					ctx.beginPath();
					ctx.moveTo(xStart - 5, linePositionY);
					ctx.lineTo(xStart, linePositionY);
					ctx.stroke();
					ctx.closePath();

				},this);

				each(this.xLabels,function(label,index){
					var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
						// Check to see if line/bar here and decide where to place the line
						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
						isRotated = (this.xLabelRotation > 0),
						drawVerticalLine = this.showVerticalLines;

					// This is Y axis, so draw it
					if (index === 0 && !drawVerticalLine){
						drawVerticalLine = true;
					}

					if (drawVerticalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					if (drawVerticalLine){
						ctx.moveTo(linePos,this.endPoint);
						ctx.lineTo(linePos,this.startPoint - 3);
						ctx.stroke();
						ctx.closePath();
					}


					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;


					// Small lines at the bottom of the base grid line
					ctx.beginPath();
					ctx.moveTo(linePos,this.endPoint);
					ctx.lineTo(linePos,this.endPoint + 5);
					ctx.stroke();
					ctx.closePath();

					ctx.save();
					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
					ctx.rotate(toRadians(this.xLabelRotation)*-1);
					ctx.font = this.font;
					ctx.textAlign = (isRotated) ? "right" : "center";
					ctx.textBaseline = (isRotated) ? "middle" : "top";
					ctx.fillText(label, 0, 0);
					ctx.restore();
				},this);

			}
		}

	});

	Chart.RadialScale = Chart.Element.extend({
		initialize: function(){
			this.size = min([this.height, this.width]);
			this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
		},
		calculateCenterOffset: function(value){
			// Take into account half font size + the yPadding of the top value
			var scalingFactor = this.drawingArea / (this.max - this.min);

			return (value - this.min) * scalingFactor;
		},
		update : function(){
			if (!this.lineArc){
				this.setScaleSize();
			} else {
				this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
			}
			this.buildYLabels();
		},
		buildYLabels: function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
		},
		getCircumference : function(){
			return ((Math.PI*2) / this.valuesCount);
		},
		setScaleSize: function(){
			/*
			 * Right, this is really confusing and there is a lot of maths going on here
			 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
			 *
			 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
			 *
			 * Solution:
			 *
			 * We assume the radius of the polygon is half the size of the canvas at first
			 * at each index we check if the text overlaps.
			 *
			 * Where it does, we store that angle and that index.
			 *
			 * After finding the largest index and angle we calculate how much we need to remove
			 * from the shape radius to move the point inwards by that x.
			 *
			 * We average the left and right distances to get the maximum shape radius that can fit in the box
			 * along with labels.
			 *
			 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
			 * on each side, removing that from the size, halving it and adding the left x protrusion width.
			 *
			 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
			 * and position it in the most space efficient manner
			 *
			 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
			 */


			// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
			// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
			var largestPossibleRadius = min([(this.height/2 - this.pointLabelFontSize - 5), this.width/2]),
				pointPosition,
				i,
				textWidth,
				halfTextWidth,
				furthestRight = this.width,
				furthestRightIndex,
				furthestRightAngle,
				furthestLeft = 0,
				furthestLeftIndex,
				furthestLeftAngle,
				xProtrusionLeft,
				xProtrusionRight,
				radiusReductionRight,
				radiusReductionLeft,
				maxWidthRadius;
			this.ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
			for (i=0;i<this.valuesCount;i++){
				// 5px to space the text slightly out - similar to what we do in the draw function.
				pointPosition = this.getPointPosition(i, largestPossibleRadius);
				textWidth = this.ctx.measureText(template(this.templateString, { value: this.labels[i] })).width + 5;
				if (i === 0 || i === this.valuesCount/2){
					// If we're at index zero, or exactly the middle, we're at exactly the top/bottom
					// of the radar chart, so text will be aligned centrally, so we'll half it and compare
					// w/left and right text sizes
					halfTextWidth = textWidth/2;
					if (pointPosition.x + halfTextWidth > furthestRight) {
						furthestRight = pointPosition.x + halfTextWidth;
						furthestRightIndex = i;
					}
					if (pointPosition.x - halfTextWidth < furthestLeft) {
						furthestLeft = pointPosition.x - halfTextWidth;
						furthestLeftIndex = i;
					}
				}
				else if (i < this.valuesCount/2) {
					// Less than half the values means we'll left align the text
					if (pointPosition.x + textWidth > furthestRight) {
						furthestRight = pointPosition.x + textWidth;
						furthestRightIndex = i;
					}
				}
				else if (i > this.valuesCount/2){
					// More than half the values means we'll right align the text
					if (pointPosition.x - textWidth < furthestLeft) {
						furthestLeft = pointPosition.x - textWidth;
						furthestLeftIndex = i;
					}
				}
			}

			xProtrusionLeft = furthestLeft;

			xProtrusionRight = Math.ceil(furthestRight - this.width);

			furthestRightAngle = this.getIndexAngle(furthestRightIndex);

			furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

			radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI/2);

			radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI/2);

			// Ensure we actually need to reduce the size of the chart
			radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
			radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

			this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;

			//this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])
			this.setCenterPoint(radiusReductionLeft, radiusReductionRight);

		},
		setCenterPoint: function(leftMovement, rightMovement){

			var maxRight = this.width - rightMovement - this.drawingArea,
				maxLeft = leftMovement + this.drawingArea;

			this.xCenter = (maxLeft + maxRight)/2;
			// Always vertically in the centre as the text height doesn't change
			this.yCenter = (this.height/2);
		},

		getIndexAngle : function(index){
			var angleMultiplier = (Math.PI * 2) / this.valuesCount;
			// Start from the top instead of right, so remove a quarter of the circle

			return index * angleMultiplier - (Math.PI/2);
		},
		getPointPosition : function(index, distanceFromCenter){
			var thisAngle = this.getIndexAngle(index);
			return {
				x : (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,
				y : (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter
			};
		},
		draw: function(){
			if (this.display){
				var ctx = this.ctx;
				each(this.yLabels, function(label, index){
					// Don't draw a centre value
					if (index > 0){
						var yCenterOffset = index * (this.drawingArea/this.steps),
							yHeight = this.yCenter - yCenterOffset,
							pointPosition;

						// Draw circular lines around the scale
						if (this.lineWidth > 0){
							ctx.strokeStyle = this.lineColor;
							ctx.lineWidth = this.lineWidth;

							if(this.lineArc){
								ctx.beginPath();
								ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI*2);
								ctx.closePath();
								ctx.stroke();
							} else{
								ctx.beginPath();
								for (var i=0;i<this.valuesCount;i++)
								{
									pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));
									if (i === 0){
										ctx.moveTo(pointPosition.x, pointPosition.y);
									} else {
										ctx.lineTo(pointPosition.x, pointPosition.y);
									}
								}
								ctx.closePath();
								ctx.stroke();
							}
						}
						if(this.showLabels){
							ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);
							if (this.showLabelBackdrop){
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = this.backdropColor;
								ctx.fillRect(
									this.xCenter - labelWidth/2 - this.backdropPaddingX,
									yHeight - this.fontSize/2 - this.backdropPaddingY,
									labelWidth + this.backdropPaddingX*2,
									this.fontSize + this.backdropPaddingY*2
								);
							}
							ctx.textAlign = 'center';
							ctx.textBaseline = "middle";
							ctx.fillStyle = this.fontColor;
							ctx.fillText(label, this.xCenter, yHeight);
						}
					}
				}, this);

				if (!this.lineArc){
					ctx.lineWidth = this.angleLineWidth;
					ctx.strokeStyle = this.angleLineColor;
					for (var i = this.valuesCount - 1; i >= 0; i--) {
						var centerOffset = null, outerPosition = null;

						if (this.angleLineWidth > 0 && (i % this.angleLineInterval === 0)){
							centerOffset = this.calculateCenterOffset(this.max);
							outerPosition = this.getPointPosition(i, centerOffset);
							ctx.beginPath();
							ctx.moveTo(this.xCenter, this.yCenter);
							ctx.lineTo(outerPosition.x, outerPosition.y);
							ctx.stroke();
							ctx.closePath();
						}

						if (this.backgroundColors && this.backgroundColors.length == this.valuesCount) {
							if (centerOffset == null)
								centerOffset = this.calculateCenterOffset(this.max);

							if (outerPosition == null)
								outerPosition = this.getPointPosition(i, centerOffset);

							var previousOuterPosition = this.getPointPosition(i === 0 ? this.valuesCount - 1 : i - 1, centerOffset);
							var nextOuterPosition = this.getPointPosition(i === this.valuesCount - 1 ? 0 : i + 1, centerOffset);

							var previousOuterHalfway = { x: (previousOuterPosition.x + outerPosition.x) / 2, y: (previousOuterPosition.y + outerPosition.y) / 2 };
							var nextOuterHalfway = { x: (outerPosition.x + nextOuterPosition.x) / 2, y: (outerPosition.y + nextOuterPosition.y) / 2 };

							ctx.beginPath();
							ctx.moveTo(this.xCenter, this.yCenter);
							ctx.lineTo(previousOuterHalfway.x, previousOuterHalfway.y);
							ctx.lineTo(outerPosition.x, outerPosition.y);
							ctx.lineTo(nextOuterHalfway.x, nextOuterHalfway.y);
							ctx.fillStyle = this.backgroundColors[i];
							ctx.fill();
							ctx.closePath();
						}
						// Extra 3px out for some label spacing
						var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);
						ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
						ctx.fillStyle = this.pointLabelFontColor;

						var labelsCount = this.labels.length,
							halfLabelsCount = this.labels.length/2,
							quarterLabelsCount = halfLabelsCount/2,
							upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
							exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
						if (i === 0){
							ctx.textAlign = 'center';
						} else if(i === halfLabelsCount){
							ctx.textAlign = 'center';
						} else if (i < halfLabelsCount){
							ctx.textAlign = 'left';
						} else {
							ctx.textAlign = 'right';
						}

						// Set the correct text baseline based on outer positioning
						if (exactQuarter){
							ctx.textBaseline = 'middle';
						} else if (upperHalf){
							ctx.textBaseline = 'bottom';
						} else {
							ctx.textBaseline = 'top';
						}

						ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);
					}
				}
			}
		}
	});

	Chart.animationService = {
		frameDuration: 17,
		animations: [],
		dropFrames: 0,
		addAnimation: function(chartInstance, animationObject) {
			for (var index = 0; index < this.animations.length; ++ index){
				if (this.animations[index].chartInstance === chartInstance){
					// replacing an in progress animation
					this.animations[index].animationObject = animationObject;
					return;
				}
			}
			
			this.animations.push({
				chartInstance: chartInstance,
				animationObject: animationObject
			});

			// If there are no animations queued, manually kickstart a digest, for lack of a better word
			if (this.animations.length == 1) {
				helpers.requestAnimFrame.call(window, this.digestWrapper);
			}
		},
		// Cancel the animation for a given chart instance
		cancelAnimation: function(chartInstance) {
			var index = helpers.findNextWhere(this.animations, function(animationWrapper) {
				return animationWrapper.chartInstance === chartInstance;
			});
			
			if (index)
			{
				this.animations.splice(index, 1);
			}
		},
		// calls startDigest with the proper context
		digestWrapper: function() {
			Chart.animationService.startDigest.call(Chart.animationService);
		},
		startDigest: function() {

			var startTime = Date.now();
			var framesToDrop = 0;

			if(this.dropFrames > 1){
				framesToDrop = Math.floor(this.dropFrames);
				this.dropFrames -= framesToDrop;
			}

			for (var i = 0; i < this.animations.length; i++) {

				if (this.animations[i].animationObject.currentStep === null){
					this.animations[i].animationObject.currentStep = 0;
				}

				this.animations[i].animationObject.currentStep += 1 + framesToDrop;
				if(this.animations[i].animationObject.currentStep > this.animations[i].animationObject.numSteps){
					this.animations[i].animationObject.currentStep = this.animations[i].animationObject.numSteps;
				}
				
				this.animations[i].animationObject.render(this.animations[i].chartInstance, this.animations[i].animationObject);
				
				// Check if executed the last frame.
				if (this.animations[i].animationObject.currentStep == this.animations[i].animationObject.numSteps){
					// Call onAnimationComplete
					this.animations[i].animationObject.onAnimationComplete.call(this.animations[i].chartInstance);
					// Remove the animation.
					this.animations.splice(i, 1);
					// Keep the index in place to offset the splice
					i--;
				}
			}

			var endTime = Date.now();
			var delay = endTime - startTime - this.frameDuration;
			var frameDelay = delay / this.frameDuration;

			if(frameDelay > 1){
				this.dropFrames += frameDelay;
			}

			// Do we have more stuff to animate?
			if (this.animations.length > 0){
				helpers.requestAnimFrame.call(window, this.digestWrapper);
			}
		}
	};

	// Attach global event to resize each chart instance when the browser resizes
	helpers.addEvent(window, "resize", (function(){
		// Basic debounce of resize function so it doesn't hurt performance when resizing browser.
		var timeout;
		return function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				each(Chart.instances,function(instance){
					// If the responsive flag is set in the chart instance config
					// Cascade the resize event down to the chart.
					if (instance.options.responsive){
						instance.resize(instance.render, true);
					}
				});
			}, 50);
		};
	})());


	if (amd) {
		define('Chart', [], function(){
			return Chart;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Chart;
	}

	root.Chart = Chart;

	Chart.noConflict = function(){
		root.Chart = previous;
		return Chart;
	};

}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Bar",
		defaults : defaultConfig,
		initialize:  function(data){

			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(datasetCount, datasetIndex, barIndex){
					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
					var xWidth = this.calculateBaseWidth(),
						xAbsolute = this.calculateX(barIndex) - (xWidth/2),
						barWidth = this.calculateBarWidth(datasetCount);

					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
				},
				calculateBaseWidth : function(){
					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				calculateBarWidth : function(datasetCount){
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

					return (baseWidth / datasetCount);
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

					this.eachBars(function(bar){
						bar.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activeBars, function(activeBar){
						if (activeBar) {
							activeBar.fillColor = activeBar.highlightFill;
							activeBar.strokeColor = activeBar.highlightStroke;
						}
					});
					this.showTooltip(activeBars);
				});
			}

			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.BarClass = Chart.Rectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : (typeof dataset.strokeColor == 'object') ? dataset.strokeColor[index] : dataset.strokeColor,
						fillColor : (typeof dataset.fillColor == 'object') ? dataset.fillColor[index] : dataset.fillColor,
						highlightFill : (dataset.highlightFill) ? (typeof dataset.highlightFill == 'object') ? dataset.highlightFill[index] : dataset.highlightFill : (typeof dataset.fillColor == 'object') ? dataset.fillColor[index] : dataset.fillColor,
						highlightStroke : (dataset.highlightStroke) ? (typeof dataset.highlightStroke == 'object') ? dataset.highlightStroke[index] : dataset.highlightStroke : (typeof dataset.strokeColor == 'object') ? dataset.strokeColor[index] : dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);

			this.BarClass.prototype.base = this.scale.endPoint;

			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
					width : this.scale.calculateBarWidth(this.datasets.length),
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
					y: this.scale.endPoint
				});
				bar.save();
			}, this);

			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});

			this.eachBars(function(bar){
				bar.save();
			});
			this.render();
		},
		eachBars : function(callback){
			helpers.each(this.datasets,function(dataset, datasetIndex){
				helpers.each(dataset.bars, callback, this, datasetIndex);
			},this);
		},
		getBarsAtEvent : function(e){
			var barsArray = [],
				eventPosition = helpers.getRelativePosition(e),
				datasetIterator = function(dataset){
					barsArray.push(dataset.bars[barIndex]);
				},
				barIndex;

			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
						helpers.each(this.datasets, datasetIterator);
						return barsArray;
					}
				}
			}

			return barsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachBars(function(bar){
					values.push(bar.value);
				});
				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}

			this.scale = new this.ScaleClass(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].bars.push(new this.BarClass({
					value : value,
					label : label,
					datasetLabel: this.datasets[datasetIndex].label,
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
					y: this.scale.endPoint,
					width : this.scale.calculateBarWidth(this.datasets.length),
					base : this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].strokeColor,
					fillColor : this.datasets[datasetIndex].fillColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.bars.shift();
			},this);
			this.update();
		},
		reflow : function(){
			helpers.extend(this.BarClass.prototype,{
				y: this.scale.endPoint,
				base : this.scale.endPoint
			});
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					if (bar.hasValue()){
						bar.base = this.scale.endPoint;
						//Transition then draw
						bar.transition({
							x : this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
							y : this.scale.calculateY(bar.value),
							width : this.scale.calculateBarWidth(this.datasets.length)
						}, easingDecimal).draw();
					}
				},this);

			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,

		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 50,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : "easeOutBounce",

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=segments[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"

	};

	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "Doughnut",
		//Providing a defaults will also register the defaults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){

			//Declare segments as a static property to prevent inheriting across the Chart type prototype
			this.segments = [];
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;

			this.SegmentArc = Chart.Arc.extend({
				ctx : this.chart.ctx,
				x : this.chart.width/2,
				y : this.chart.height/2
			});

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];

					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}
			this.calculateTotal(data);

			helpers.each(data,function(datapoint, index){
				if (!datapoint.color) {
					datapoint.color = 'hsl(' + (360 * index / data.length) + ', 100%, 50%)';
				}
				this.addData(datapoint, index, true);
			},this);

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex !== undefined ? atIndex : this.segments.length;
			if ( typeof(segment.color) === "undefined" ) {
				segment.color = Chart.defaults.global.segmentColorDefault[index % Chart.defaults.global.segmentColorDefault.length];
				segment.highlight = Chart.defaults.global.segmentHighlightColorDefaults[index % Chart.defaults.global.segmentHighlightColorDefaults.length];				
			}
			this.segments.splice(index, 0, new this.SegmentArc({
				value : segment.value,
				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
				fillColor : segment.color,
				highlightColor : segment.highlight || segment.color,
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				startAngle : Math.PI * 1.5,
				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
				label : segment.label
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		calculateCircumference : function(value) {
			if ( this.total > 0 ) {
				return (Math.PI*2)*(value / this.total);
			} else {
				return 0;
			}
		},
		calculateTotal : function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += Math.abs(segment.value);
			},this);
		},
		update : function(){
			this.calculateTotal(this.segments);

			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor']);
			});

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			this.render();
		},

		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},

		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;
			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				});
			}, this);
		},
		draw : function(easeDecimal){
			var animDecimal = (easeDecimal) ? easeDecimal : 1;
			this.clear();
			helpers.each(this.segments,function(segment,index){
				segment.transition({
					circumference : this.calculateCircumference(segment.value),
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				},animDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				segment.draw();
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}
				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length-1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
			},this);

		}
	});

	Chart.types.Doughnut.extend({
		name : "Pie",
		defaults : helpers.merge(defaultConfig,{percentageInnerCutout : 0})
	});

}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var defaultConfig = {

		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : true,

		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.4,

		//Boolean - Whether to show a dot for each point
		pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",

		//Boolean - Whether to horizontally center the label and point dot inside the grid
		offsetGridLines : false

	};


	Chart.Type.extend({
		name: "Line",
		defaults : defaultConfig,
		initialize:  function(data){
			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.PointClass = Chart.Point.extend({
				offsetGridLines : this.options.offsetGridLines,
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx,
				inRange : function(mouseX){
					return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePoints, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});
					this.showTooltip(activePoints);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);


				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

				this.buildScale(data.labels);


				this.eachPoints(function(point, index){
					helpers.extend(point, {
						x: this.scale.calculateX(index),
						y: this.scale.endPoint
					});
					point.save();
				}, this);

			},this);


			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});
			this.eachPoints(function(point){
				point.save();
			});
			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},
		getPointsAtEvent : function(e){
			var pointsArray = [],
				eventPosition = helpers.getRelativePosition(e);
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,function(point){
					if (point.inRange(eventPosition.x,eventPosition.y)) pointsArray.push(point);
				});
			},this);
			return pointsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachPoints(function(point){
					values.push(point.value);
				});

				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				offsetGridLines : this.options.offsetGridLines,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange : function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}


			this.scale = new Chart.Scale(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets

			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					datasetLabel: this.datasets[datasetIndex].label,
					x: this.scale.calculateX(this.scale.valuesCount+1),
					y: this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.update();
		},
		reflow : function(){
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			// Some helper methods for getting the next/prev points
			var hasValue = function(item){
				return item.value !== null;
			},
			nextPoint = function(point, collection, index){
				return helpers.findNextWhere(collection, hasValue, index) || point;
			},
			previousPoint = function(point, collection, index){
				return helpers.findPreviousWhere(collection, hasValue, index) || point;
			};

			if (!this.scale) return;
			this.scale.draw(easingDecimal);


			helpers.each(this.datasets,function(dataset){
				var pointsWithValues = helpers.where(dataset.points, hasValue);

				//Transition each point first so that the line and point drawing isn't out of sync
				//We can use this extra loop to calculate the control points of this dataset also in this loop

				helpers.each(dataset.points, function(point, index){
					if (point.hasValue()){
						point.transition({
							y : this.scale.calculateY(point.value),
							x : this.scale.calculateX(index)
						}, easingDecimal);
					}
				},this);


				// Control points need to be calculated in a separate loop, because we need to know the current x/y of the point
				// This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
				if (this.options.bezierCurve){
					helpers.each(pointsWithValues, function(point, index){
						var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
						point.controlPoints = helpers.splineCurve(
							previousPoint(point, pointsWithValues, index),
							point,
							nextPoint(point, pointsWithValues, index),
							tension
						);

						// Prevent the bezier going outside of the bounds of the graph

						// Cap puter bezier handles to the upper/lower scale bounds
						if (point.controlPoints.outer.y > this.scale.endPoint){
							point.controlPoints.outer.y = this.scale.endPoint;
						}
						else if (point.controlPoints.outer.y < this.scale.startPoint){
							point.controlPoints.outer.y = this.scale.startPoint;
						}

						// Cap inner bezier handles to the upper/lower scale bounds
						if (point.controlPoints.inner.y > this.scale.endPoint){
							point.controlPoints.inner.y = this.scale.endPoint;
						}
						else if (point.controlPoints.inner.y < this.scale.startPoint){
							point.controlPoints.inner.y = this.scale.startPoint;
						}
					},this);
				}


				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();

				helpers.each(pointsWithValues, function(point, index){
					if (index === 0){
						ctx.moveTo(point.x, point.y);
					}
					else{
						if(this.options.bezierCurve){
							var previous = previousPoint(point, pointsWithValues, index);

							ctx.bezierCurveTo(
								previous.controlPoints.outer.x,
								previous.controlPoints.outer.y,
								point.controlPoints.inner.x,
								point.controlPoints.inner.y,
								point.x,
								point.y
							);
						}
						else{
							ctx.lineTo(point.x,point.y);
						}
					}
				}, this);

				if (this.options.datasetStroke) {
					ctx.stroke();
				}

				if (this.options.datasetFill && pointsWithValues.length > 0){
					//Round off the line by going to the base of the chart, back to the start, then fill.
					ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
					ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
					ctx.fillStyle = dataset.fillColor;
					ctx.closePath();
					ctx.fill();
				}

				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(pointsWithValues,function(point){
					point.draw();
				});
			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Show a backdrop to the scale label
		scaleShowLabelBackdrop : true,

		//String - The colour of the label backdrop
		scaleBackdropColor : "rgba(255,255,255,0.75)",

		// Boolean - Whether the scale should begin at zero
		scaleBeginAtZero : true,

		//Number - The backdrop padding above & below the label in pixels
		scaleBackdropPaddingY : 2,

		//Number - The backdrop padding to the side of the label in pixels
		scaleBackdropPaddingX : 2,

		//Boolean - Show line for each value in the scale
		scaleShowLine : true,

		//Boolean - Stroke a line around each segment in the chart
		segmentShowStroke : true,

		//String - The colour of the stroke on each segment.
		segmentStrokeColor : "#fff",

		//Number - The width of the stroke value in pixels
		segmentStrokeWidth : 2,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect.
		animationEasing : "easeOutBounce",

		//Boolean - Whether to animate the rotation of the chart
		animateRotate : true,

		//Boolean - Whether to animate scaling the chart from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=segments[i].fillColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
	};


	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "PolarArea",
		//Providing a defaults will also register the defaults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){
			this.segments = [];
			//Declare segment class as a chart instance specific class, so it can share props for this instance
			this.SegmentArc = Chart.Arc.extend({
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				ctx : this.chart.ctx,
				innerRadius : 0,
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				lineArc: true,
				width: this.chart.width,
				height: this.chart.height,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				valuesCount: data.length
			});

			this.updateScaleRange(data);

			this.scale.update();

			helpers.each(data,function(segment,index){
				this.addData(segment,index,true);
			},this);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;

			this.segments.splice(index, 0, new this.SegmentArc({
				fillColor: segment.color,
				highlightColor: segment.highlight || segment.color,
				label: segment.label,
				value: segment.value,
				outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
				circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
				startAngle: Math.PI * 1.5
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},
		calculateTotal: function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += segment.value;
			},this);
			this.scale.valuesCount = this.segments.length;
		},
		updateScaleRange: function(datapoints){
			var valuesArray = [];
			helpers.each(datapoints,function(segment){
				valuesArray.push(segment.value);
			});

			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes,
				{
					size: helpers.min([this.chart.width, this.chart.height]),
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2
				}
			);

		},
		update : function(){
			this.calculateTotal(this.segments);

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			
			this.reflow();
			this.render();
		},
		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.updateScaleRange(this.segments);
			this.scale.update();

			helpers.extend(this.scale,{
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});

			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				});
			}, this);

		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			//Clear & draw the canvas
			this.clear();
			helpers.each(this.segments,function(segment, index){
				segment.transition({
					circumference : this.scale.getCircumference(),
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				},easingDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				// If we've removed the first segment we need to set the first one to
				// start at the top.
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}

				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length - 1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
				segment.draw();
			}, this);
			this.scale.draw();
		}
	});

}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;



	Chart.Type.extend({
		name: "Radar",
		defaults:{
			//Boolean - Whether to show lines for each scale point
			scaleShowLine : true,

			//Boolean - Whether we show the angle lines out of the radar
			angleShowLineOut : true,

			//Boolean - Whether to show labels on the scale
			scaleShowLabels : false,

			// Boolean - Whether the scale should begin at zero
			scaleBeginAtZero : true,

			//String - Colour of the angle line
			angleLineColor : "rgba(0,0,0,.1)",

			//Number - Pixel width of the angle line
			angleLineWidth : 1,

			//Number - Interval at which to draw angle lines ("every Nth point")
			angleLineInterval: 1,

			//String - Point label font declaration
			pointLabelFontFamily : "'Arial'",

			//String - Point label font weight
			pointLabelFontStyle : "normal",

			//Number - Point label font size in pixels
			pointLabelFontSize : 10,

			//String - Point label font colour
			pointLabelFontColor : "#666",

			//Boolean - Whether to show a dot for each point
			pointDot : true,

			//Number - Radius of each point dot in pixels
			pointDotRadius : 3,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius : 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-icon\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><span class=\"<%=name.toLowerCase()%>-legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"

		},

		initialize: function(data){
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx
			});

			this.datasets = [];

			this.buildScale(data);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];

					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePointsCollection, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});

					this.showTooltip(activePointsCollection);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label: dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					var pointPosition;
					if (!this.scale.animation){
						pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));
					}
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,
						y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

			},this);

			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},

		getPointsAtEvent : function(evt){
			var mousePosition = helpers.getRelativePosition(evt),
				fromCenter = helpers.getAngleFromPoint({
					x: this.scale.xCenter,
					y: this.scale.yCenter
				}, mousePosition);

			var anglePerIndex = (Math.PI * 2) /this.scale.valuesCount,
				pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),
				activePointsCollection = [];

			// If we're at the top, make the pointIndex 0 to get the first of the array.
			if (pointIndex >= this.scale.valuesCount || pointIndex < 0){
				pointIndex = 0;
			}

			if (fromCenter.distance <= this.scale.drawingArea){
				helpers.each(this.datasets, function(dataset){
					activePointsCollection.push(dataset.points[pointIndex]);
				});
			}

			return activePointsCollection;
		},

		buildScale : function(data){
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backgroundColors: this.options.scaleBackgroundColors,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				angleLineColor : this.options.angleLineColor,
				angleLineWidth : (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,
        angleLineInterval: (this.options.angleLineInterval) ? this.options.angleLineInterval : 1,
				// Point labels at the edge of each line
				pointLabelFontColor : this.options.pointLabelFontColor,
				pointLabelFontSize : this.options.pointLabelFontSize,
				pointLabelFontFamily : this.options.pointLabelFontFamily,
				pointLabelFontStyle : this.options.pointLabelFontStyle,
				height : this.chart.height,
				width: this.chart.width,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				labels: data.labels,
				valuesCount: data.datasets[0].data.length
			});

			this.scale.setScaleSize();
			this.updateScaleRange(data.datasets);
			this.scale.buildYLabels();
		},
		updateScaleRange: function(datasets){
			var valuesArray = (function(){
				var totalDataArray = [];
				helpers.each(datasets,function(dataset){
					if (dataset.data){
						totalDataArray = totalDataArray.concat(dataset.data);
					}
					else {
						helpers.each(dataset.points, function(point){
							totalDataArray.push(point.value);
						});
					}
				});
				return totalDataArray;
			})();


			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes
			);

		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			this.scale.valuesCount++;
			helpers.each(valuesArray,function(value,datasetIndex){
				var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					datasetLabel: this.datasets[datasetIndex].label,
					x: pointPosition.x,
					y: pointPosition.y,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.labels.push(label);

			this.reflow();

			this.update();
		},
		removeData : function(){
			this.scale.valuesCount--;
			this.scale.labels.shift();
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.reflow();
			this.update();
		},
		update : function(){
			this.eachPoints(function(point){
				point.save();
			});
			this.reflow();
			this.render();
		},
		reflow: function(){
			helpers.extend(this.scale, {
				width : this.chart.width,
				height: this.chart.height,
				size : helpers.min([this.chart.width, this.chart.height]),
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});
			this.updateScaleRange(this.datasets);
			this.scale.setScaleSize();
			this.scale.buildYLabels();
		},
		draw : function(ease){
			var easeDecimal = ease || 1,
				ctx = this.chart.ctx;
			this.clear();
			this.scale.draw();

			helpers.each(this.datasets,function(dataset){

				//Transition each point first so that the line and point drawing isn't out of sync
				helpers.each(dataset.points,function(point,index){
					if (point.hasValue()){
						point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);
					}
				},this);



				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();
				helpers.each(dataset.points,function(point,index){
					if (index === 0){
						ctx.moveTo(point.x,point.y);
					}
					else{
						ctx.lineTo(point.x,point.y);
					}
				},this);
				ctx.closePath();
				ctx.stroke();

				ctx.fillStyle = dataset.fillColor;
				if(this.options.datasetFill){
					ctx.fill();
				}
				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(dataset.points,function(point){
					if (point.hasValue()){
						point.draw();
					}
				});

			},this);

		}

	});





}).call(this);

!function(t){"use strict";"object"==typeof exports?module.exports=t("undefined"!=typeof angular?angular:require("angular"),"undefined"!=typeof Chart?Chart:require("chart.js")):"function"==typeof define&&define.amd?define(["angular","chart"],t):t(angular,Chart)}(function(t,e){"use strict";function n(){var n={},r={Chart:e,getOptions:function(e){var r=e&&n[e]||{};return t.extend({},n,r)}};this.setOptions=function(e,r){return r?void(n[e]=t.extend(n[e]||{},r)):(r=e,void(n=t.extend(n,r)))},this.$get=function(){return r}}function r(n,r){function o(t,e){return t&&e&&t.length&&e.length?Array.isArray(t[0])?t.length===e.length&&t.every(function(t,n){return t.length===e[n].length}):e.reduce(i,0)>0?t.length===e.length:!1:!1}function i(t,e){return t+e}function c(e,n,r,a){var o=null;return function(i){var c=n.getPointsAtEvent||n.getBarsAtEvent||n.getSegmentsAtEvent;if(c){var l=c.call(n,i);a!==!1&&t.equals(o,l)!==!1||(o=l,e[r](l,i),e.$apply())}}}function l(r,a){for(var o=!1,i=t.copy(a.colours||n.getOptions(r).colours||e.defaults.global.colours);i.length<a.data.length;)i.push(a.getColour()),o=!0;return o&&(a.colours=i),i.map(u)}function u(t){return"object"==typeof t&&null!==t?t:"string"==typeof t&&"#"===t[0]?f(g(t.substr(1))):s()}function s(){var t=[h(0,255),h(0,255),h(0,255)];return f(t)}function f(t){return{fillColor:d(t,.2),strokeColor:d(t,1),pointColor:d(t,1),pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:d(t,.8)}}function h(t,e){return Math.floor(Math.random()*(e-t+1))+t}function d(t,e){return a?"rgb("+t.join(",")+")":"rgba("+t.concat(e).join(",")+")"}function g(t){var e=parseInt(t,16),n=e>>16&255,r=e>>8&255,a=255&e;return[n,r,a]}function p(e,n,r,a){return{labels:e,datasets:n.map(function(e,n){return t.extend({},a[n],{label:r[n],data:e})})}}function v(e,n,r){return e.map(function(e,a){return t.extend({},r[a],{label:e,value:n[a],color:r[a].strokeColor,highlight:r[a].pointHighlightStroke})})}function y(t,e){var n=t.parent(),r=n.find("chart-legend"),a="<chart-legend>"+e.generateLegend()+"</chart-legend>";r.length?r.replaceWith(a):n.append(a)}function C(t,e,n,r){Array.isArray(n.data[0])?t.datasets.forEach(function(t,n){(t.points||t.bars).forEach(function(t,r){t.value=e[n][r]})}):t.segments.forEach(function(t,n){t.value=e[n]}),t.update(),n.$emit("update",t),n.legend&&"false"!==n.legend&&y(r,t)}function b(t){return!t||Array.isArray(t)&&!t.length||"object"==typeof t&&!Object.keys(t).length}function m(r,a){var o=t.extend({},e.defaults.global,n.getOptions(r),a.options);return o.responsive}function w(t,e){t&&(t.destroy(),e.$emit("destroy",t))}return function(e){return{restrict:"CA",scope:{data:"=?",labels:"=?",options:"=?",series:"=?",colours:"=?",getColour:"=?",chartType:"=",legend:"@",click:"=?",hover:"=?",chartData:"=?",chartLabels:"=?",chartOptions:"=?",chartSeries:"=?",chartColours:"=?",chartLegend:"@",chartClick:"=?",chartHover:"=?"},link:function(i,u){function f(t,e){i.$watch(t,function(t){"undefined"!=typeof t&&(i[e]=t)})}function h(n,r){if(!b(n)&&!t.equals(n,r)){var a=e||i.chartType;a&&d(a)}}function d(e){if(m(e,i)&&0===u[0].clientHeight&&0===k.clientHeight)return r(function(){d(e)},50,!1);if(i.data&&i.data.length){i.getColour="function"==typeof i.getColour?i.getColour:s;var a=l(e,i),o=u[0],f=o.getContext("2d"),h=Array.isArray(i.data[0])?p(i.labels,i.data,i.series||[],a):v(i.labels,i.data,a),g=t.extend({},n.getOptions(e),i.options);w(A,i),A=new n.Chart(f)[e](h,g),i.$emit("create",A),o.onclick=i.click?c(i,A,"click",!1):t.noop,o.onmousemove=i.hover?c(i,A,"hover",!0):t.noop,i.legend&&"false"!==i.legend&&y(u,A)}}function g(t){if("undefined"!=typeof console&&"test"!==n.getOptions().env){var e="function"==typeof console.warn?console.warn:console.log;i[t]&&e.call(console,'"%s" is deprecated and will be removed in a future version. Please use "chart-%s" instead.',t,t)}}var A,k=document.createElement("div");k.className="chart-container",u.replaceWith(k),k.appendChild(u[0]),a&&window.G_vmlCanvasManager.initElement(u[0]),["data","labels","options","series","colours","legend","click","hover"].forEach(g),f("chartData","data"),f("chartLabels","labels"),f("chartOptions","options"),f("chartSeries","series"),f("chartColours","colours"),f("chartLegend","legend"),f("chartClick","click"),f("chartHover","hover"),i.$watch("data",function(t,n){if(!t||!t.length||Array.isArray(t[0])&&!t[0].length)return void w(A,i);var r=e||i.chartType;if(r)return A&&o(t,n)?C(A,t,i,u):void d(r)},!0),i.$watch("series",h,!0),i.$watch("labels",h,!0),i.$watch("options",h,!0),i.$watch("colours",h,!0),i.$watch("chartType",function(e,n){b(e)||t.equals(e,n)||d(e)}),i.$on("$destroy",function(){w(A,i)})}}}}e.defaults.global.responsive=!0,e.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",e.defaults.global.colours=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"];var a="object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement;return a&&(e.defaults.global.animation=!1),t.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs","$timeout",r]).directive("chartBase",["ChartJsFactory",function(t){return new t}]).directive("chartLine",["ChartJsFactory",function(t){return new t("Line")}]).directive("chartBar",["ChartJsFactory",function(t){return new t("Bar")}]).directive("chartRadar",["ChartJsFactory",function(t){return new t("Radar")}]).directive("chartDoughnut",["ChartJsFactory",function(t){return new t("Doughnut")}]).directive("chartPie",["ChartJsFactory",function(t){return new t("Pie")}]).directive("chartPolarArea",["ChartJsFactory",function(t){return new t("PolarArea")}])});
//# sourceMappingURL=angular-chart.min.js.map

/*
 Highstock JS v4.2.5 (2016-05-06)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(L,ga){typeof module==="object"&&module.exports?module.exports=L.document?ga(L):ga:L.Highcharts=ga(L)})(typeof window!=="undefined"?window:this,function(L){function ga(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw Error(c);L.console&&console.log(c)}function xb(a,b,c){this.options=b;this.elem=a;this.prop=c}function z(){var a,b=arguments,c,d={},e=function(a,b){var c,d;typeof a!=="object"&&(a={});for(d in b)b.hasOwnProperty(d)&&(c=b[d],a[d]=c&&typeof c==="object"&&
Object.prototype.toString.call(c)!=="[object Array]"&&d!=="renderTo"&&typeof c.nodeType!=="number"?e(a[d]||{},c):b[d]);return a};b[0]===!0&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function K(a,b){return parseInt(a,b||10)}function Ca(a){return typeof a==="string"}function ea(a){return a&&typeof a==="object"}function Ja(a){return Object.prototype.toString.call(a)==="[object Array]"}function za(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);
break}}function v(a){return a!==t&&a!==null}function X(a,b,c){var d,e;if(Ca(b))v(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(v(b)&&ea(b))for(d in b)a.setAttribute(d,b[d]);return e}function ua(a){return Ja(a)?a:[a]}function Za(a,b,c){if(b)return setTimeout(a,b,c);a.call(0,c)}function N(a,b){if(Ka&&!ja&&b&&b.opacity!==t)b.filter="alpha(opacity="+b.opacity*100+")";A(a.style,b)}function fa(a,b,c,d,e){a=H.createElement(a);b&&A(a,b);e&&N(a,{padding:0,border:"none",margin:0});
c&&N(a,c);d&&d.appendChild(a);return a}function ma(a,b){var c=function(){};c.prototype=new a;A(c.prototype,b);return c}function Oa(a,b,c){return Array((b||2)+1-String(a).length).join(c||0)+a}function eb(a){return(fb&&fb(a)||yb||0)*6E4}function La(a,b){for(var c="{",d=!1,e,f,g,h,i,j=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];if(f.length)f=f.join(":"),g=/\.([0-9])/,h=R.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:
-1,e!==null&&(e=B.numberFormat(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:""))):e=na(f,e)}j.push(e);a=a.slice(c+1);c=(d=!d)?"}":"{"}j.push(a);return j.join("")}function zb(a){return Y.pow(10,V(Y.log(a)/Y.LN10))}function Ab(a,b,c,d,e){var f,g=a,c=q(c,1);f=a/c;b||(b=[1,2,2.5,5,10],d===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(g=b[d],e&&g*c>=a||!e&&f<=(b[d]+(b[d+1]||b[d]))/2)break;g*=c;return g}function nb(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].safeI=e;a.sort(function(a,
c){d=b(a,c);return d===0?a.safeI-c.safeI:d});for(e=0;e<c;e++)delete a[e].safeI}function Ma(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Da(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Pa(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Ua(a){ob||(ob=fa(Va));a&&ob.appendChild(a);ob.innerHTML=""}function ka(a,b){return parseFloat(a.toPrecision(b||14))}function $a(a,b){b.renderer.globalAnimation=q(a,b.animation)}function gb(a){return ea(a)?
z(a):{duration:a?500:0}}function Ob(){var a=R.global,b=a.useUTC,c=b?"getUTC":"get",d=b?"setUTC":"set";ba=a.Date||L.Date;yb=b&&a.timezoneOffset;fb=b&&a.getTimezoneOffset;pb=function(a,c,d,h,i,j){var k;b?(k=ba.UTC.apply(0,arguments),k+=eb(k)):k=(new ba(a,c,q(d,1),q(h,0),q(i,0),q(j,0))).getTime();return k};Bb=c+"Minutes";Cb=c+"Hours";Db=c+"Day";ab=c+"Date";hb=c+"Month";ib=c+"FullYear";Pb=d+"Milliseconds";Qb=d+"Seconds";Rb=d+"Minutes";Sb=d+"Hours";qb=d+"Date";Eb=d+"Month";Fb=d+"FullYear"}function va(a){if(!(this instanceof
va))return new va(a);this.init(a)}function Z(){}function bb(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function Tb(a,b,c,d,e){var f=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.total=null;this.points={};this.stack=e;this.rightCliff=this.leftCliff=0;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":"top"),y:q(b.y,f?4:c?14:-6),x:q(b.x,f?c?-6:6:0)};this.textAlign=
b.textAlign||(f?c?"right":"left":"center")}function Gb(a){var b=a.options,c=b.navigator,d=c.enabled,b=b.scrollbar,e=b.enabled,f=d?c.height:0,g=e?b.height:0;this.handles=[];this.scrollbarButtons=[];this.elementsToDestroy=[];this.chart=a;this.setBaseSeries();this.height=f;this.scrollbarHeight=g;this.scrollbarEnabled=e;this.navigatorEnabled=d;this.navigatorOptions=c;this.scrollbarOptions=b;this.outlineHeight=f+g;this.init()}function Hb(a){this.init(a)}var t,H=L.document,Y=Math,y=Y.round,V=Y.floor,Ea=
Y.ceil,w=Y.max,G=Y.min,S=Y.abs,ca=Y.cos,la=Y.sin,Aa=Y.PI,pa=Aa*2/360,Na=L.navigator&&L.navigator.userAgent||"",Ub=L.opera,Ka=/(msie|trident|edge)/i.test(Na)&&!Ub,rb=H&&H.documentMode===8,sb=!Ka&&/AppleWebKit/.test(Na),Wa=/Firefox/.test(Na),jb=/(Mobile|Android|Windows Phone)/.test(Na),Qa="http://www.w3.org/2000/svg",ja=H&&H.createElementNS&&!!H.createElementNS(Qa,"svg").createSVGRect,Zb=Wa&&parseInt(Na.split("Firefox/")[1],10)<4,qa=H&&!ja&&!Ka&&!!H.createElement("canvas").getContext,Xa,cb,Vb={},Ib=
0,ob,R,na,M,ra=function(){},$=[],kb=0,Va="div",$b=/^[0-9]+$/,tb=["plotTop","marginRight","marginBottom","plotLeft"],ba,pb,yb,fb,Bb,Cb,Db,ab,hb,ib,Pb,Qb,Rb,Sb,qb,Eb,Fb,I={},B;B=L.Highcharts?ga(16,!0):{win:L};B.seriesTypes=I;var Ra=[],wa,sa,o,Fa,Jb,ta,E,T,O,db,Sa;xb.prototype={dSetter:function(){var a=this.paths[0],b=this.paths[1],c=[],d=this.now,e=a.length,f;if(d===1)c=this.toD;else if(e===b.length&&d<1)for(;e--;)f=parseFloat(a[e]),c[e]=isNaN(f)?a[e]:d*parseFloat(b[e]-f)+f;else c=b;this.elem.attr("d",
c)},update:function(){var a=this.elem,b=this.prop,c=this.now,d=this.options.step;if(this[b+"Setter"])this[b+"Setter"]();else a.attr?a.element&&a.attr(b,c):a.style[b]=c+this.unit;d&&d.call(a,c,this)},run:function(a,b,c){var d=this,e=function(a){return e.stopped?!1:d.step(a)},f;this.startTime=+new ba;this.start=a;this.end=b;this.unit=c;this.now=this.start;this.pos=0;e.elem=this.elem;if(e()&&Ra.push(e)===1)e.timerId=setInterval(function(){for(f=0;f<Ra.length;f++)Ra[f]()||Ra.splice(f--,1);Ra.length||
clearInterval(e.timerId)},13)},step:function(a){var b=+new ba,c,d=this.options;c=this.elem;var e=d.complete,f=d.duration,g=d.curAnim,h;if(c.attr&&!c.element)c=!1;else if(a||b>=f+this.startTime){this.now=this.end;this.pos=1;this.update();a=g[this.prop]=!0;for(h in g)g[h]!==!0&&(a=!1);a&&e&&e.call(c);c=!1}else this.pos=d.easing((b-this.startTime)/f),this.now=this.start+(this.end-this.start)*this.pos,this.update(),c=!0;return c},initPath:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?
7:3,g,b=b.split(" "),c=[].concat(c),h=a.isArea,i=h?2:1,j=function(a){for(g=a.length;g--;)(a[g]==="M"||a[g]==="L")&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(j(b),j(c));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=c.slice(0,f).concat(c),h&&(c=c.concat(c.slice(c.length-f)));a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=b.slice().splice(b.length/i-f,f*i),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),[].splice.apply(b,[b.length/i,0].concat(d));return[b,c]}};var A=B.extend=function(a,b){var c;a||(a=
{});for(c in b)a[c]=b[c];return a},C=B.isNumber=function(a){return typeof a==="number"&&!isNaN(a)},q=B.pick=function(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],c!==t&&c!==null)return c},U=B.wrap=function(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}};na=function(a,b,c){if(!C(b))return R.lang.invalidDate||"";var a=q(a,"%Y-%m-%d %H:%M:%S"),d=new ba(b-eb(b)),e,f=d[Cb](),g=d[Db](),h=d[ab](),i=d[hb](),j=d[ib](),k=R.lang,
l=k.weekdays,m=k.shortWeekdays,d=A({a:m?m[g]:l[g].substr(0,3),A:l[g],d:Oa(h),e:Oa(h,2," "),w:g,b:k.shortMonths[i],B:k.months[i],m:Oa(i+1),y:j.toString().substr(2,2),Y:j,H:Oa(f),k:f,I:Oa(f%12||12),l:f%12||12,M:Oa(d[Bb]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Oa(d.getSeconds()),L:Oa(y(b%1E3),3)},B.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]==="function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};M={millisecond:1,second:1E3,minute:6E4,hour:36E5,
day:864E5,week:6048E5,month:24192E5,year:314496E5};B.numberFormat=function(a,b,c,d){var a=+a||0,b=+b,e=R.lang,f=(a.toString().split(".")[1]||"").length,g,h,i=Math.abs(a);b===-1?b=Math.min(f,20):C(b)||(b=2);g=String(K(i.toFixed(b)));h=g.length>3?g.length%3:0;c=q(c,e.decimalPoint);d=q(d,e.thousandsSep);a=a<0?"-":"";a+=h?g.substr(0,h)+d:"";a+=g.substr(h).replace(/(\d{3})(?=\d)/g,"$1"+d);b&&(d=Math.abs(i-g+Math.pow(10,-Math.max(b,f)-1)),a+=c+d.toFixed(b).slice(2));return a};Math.easeInOutSine=function(a){return-0.5*
(Math.cos(Math.PI*a)-1)};wa=function(a,b){var c;if(b==="width")return Math.min(a.offsetWidth,a.scrollWidth)-wa(a,"padding-left")-wa(a,"padding-right");else if(b==="height")return Math.min(a.offsetHeight,a.scrollHeight)-wa(a,"padding-top")-wa(a,"padding-bottom");return(c=L.getComputedStyle(a,void 0))&&K(c.getPropertyValue(b))};sa=function(a,b){return b.indexOf?b.indexOf(a):[].indexOf.call(b,a)};Fa=function(a,b){return[].filter.call(a,b)};ta=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],
a[d],d,a);return c};Jb=function(a){var b=H.documentElement,a=a.getBoundingClientRect();return{top:a.top+(L.pageYOffset||b.scrollTop)-(b.clientTop||0),left:a.left+(L.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}};Sa=function(a){for(var b=Ra.length;b--;)if(Ra[b].elem===a)Ra[b].stopped=!0};o=function(a,b){return Array.prototype.forEach.call(a,b)};E=function(a,b,c){function d(b){b.target=b.srcElement||L;c.call(a,b)}var e=a.hcEvents=a.hcEvents||{};if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent){if(!a.hcEventsIE)a.hcEventsIE=
{};a.hcEventsIE[c.toString()]=d;a.attachEvent("on"+b,d)}e[b]||(e[b]=[]);e[b].push(c)};T=function(a,b,c){function d(b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.attachEvent&&(c=a.hcEventsIE[c.toString()],a.detachEvent("on"+b,c))}function e(){var c,e,f;if(a.nodeName)for(f in b?(c={},c[b]=!0):c=g,c)if(g[f])for(e=g[f].length;e--;)d(f,g[f][e])}var f,g=a.hcEvents,h;if(g)b?(f=g[b]||[],c?(h=sa(c,f),h>-1&&(f.splice(h,1),g[b]=f),d(b,c)):(e(),g[b]=[])):(e(),a.hcEvents={})};O=function(a,b,c,d){var e;
e=a.hcEvents;var f,g,c=c||{};if(H.createEvent&&(a.dispatchEvent||a.fireEvent))e=H.createEvent("Events"),e.initEvent(b,!0,!0),e.target=a,A(e,c),a.dispatchEvent?a.dispatchEvent(e):a.fireEvent(b,e);else if(e){e=e[b]||[];f=e.length;if(!c.preventDefault)c.preventDefault=function(){c.defaultPrevented=!0};c.target=a;if(!c.type)c.type=b;for(b=0;b<f;b++)g=e[b],g.call(a,c)===!1&&c.preventDefault()}d&&!c.defaultPrevented&&d(c)};db=function(a,b,c){var d,e="",f,g,h;ea(c)||(d=arguments,c={duration:d[2],easing:d[3],
complete:d[4]});if(!C(c.duration))c.duration=400;c.easing=typeof c.easing==="function"?c.easing:Math[c.easing]||Math.easeInOutSine;c.curAnim=z(b);for(h in b)g=new xb(a,c,h),f=null,h==="d"?(g.paths=g.initPath(a,a.d,b.d),g.toD=b.d,d=0,f=1):a.attr?d=a.attr(h):(d=parseFloat(wa(a,h))||0,h!=="opacity"&&(e="px")),f||(f=b[h]),f.match&&f.match("px")&&(f=f.replace(/px/g,"")),g.run(d,f,e)};if(L.jQuery)L.jQuery.fn.highcharts=function(){var a=[].slice.call(arguments);if(this[0])return a[0]?(new (B[Ca(a[0])?a.shift():
"Chart"])(this[0],a[0],a[1]),this):$[X(this[0],"data-highcharts-chart")]};H&&!H.defaultView&&(wa=function(a,b){var c;c={width:"clientWidth",height:"clientHeight"}[b];if(a.style[b])return K(a.style[b]);b==="opacity"&&(b="filter");if(c)return a.style.zoom=1,Math.max(a[c]-2*wa(a,"padding"),0);c=a.currentStyle[b.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()})];b==="filter"&&(c=c.replace(/alpha\(opacity=([0-9]+)\)/,function(a,b){return b/100}));return c===""?1:K(c)});Array.prototype.forEach||
(o=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c});Array.prototype.indexOf||(sa=function(a,b){var c,d=0;if(b)for(c=b.length;d<c;d++)if(b[d]===a)return d;return-1});Array.prototype.filter||(Fa=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c});B.Fx=xb;B.inArray=sa;B.each=o;B.grep=Fa;B.offset=Jb;B.map=ta;B.addEvent=E;B.removeEvent=T;B.fireEvent=O;B.animate=db;B.animObject=gb;B.stop=Sa;R={colors:"#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{useUTC:!0,
canvasToolsURL:"http://code.highcharts.com/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/stock/4.2.5/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"},widthAdjust:-44},
subtitle:{text:"",align:"center",style:{color:"#555555"},widthAdjust:-44},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0,lineWidthPlus:1,radiusPlus:2},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return this.y===null?"":B.numberFormat(this.y,-1)},style:{color:"contrast",fontSize:"11px",
fontWeight:"bold",textShadow:"0 0 6px contrast, 0 0 3px contrast"},verticalAlign:"bottom",x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{hover:{lineWidthPlus:1,marker:{},halo:{size:10,opacity:0.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",
inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000"},itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ja,backgroundColor:"rgba(249, 249, 249, .85)",
borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:jb?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",
padding:"8px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var W=R.plotOptions,da=W.line;Ob();va.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[K(a[1]),K(a[2]),K(a[3]),parseFloat(a[4],10)]}},{regex:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
parse:function(a){return[K(a[1],16),K(a[2],16),K(a[3],16),1]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[K(a[1]),K(a[2]),K(a[3]),1]}}],init:function(a){var b,c,d,e;if((this.input=a)&&a.stops)this.stops=ta(a.stops,function(a){return new va(a[1])});else for(d=this.parsers.length;d--&&!c;)e=this.parsers[d],(b=e.regex.exec(a))&&(c=e.parse(b));this.rgba=c||[]},get:function(a){var b=this.input,c=this.rgba,d;this.stops?(d=z(b),d.stops=[].concat(d.stops),
o(this.stops,function(b,c){d.stops[c]=[d.stops[c][0],b.get(a)]})):d=c&&C(c[0])?a==="rgb"||!a&&c[3]===1?"rgb("+c[0]+","+c[1]+","+c[2]+")":a==="a"?c[3]:"rgba("+c.join(",")+")":b;return d},brighten:function(a){var b,c=this.rgba;if(this.stops)o(this.stops,function(b){b.brighten(a)});else if(C(a)&&a!==0)for(b=0;b<3;b++)c[b]+=K(a*255),c[b]<0&&(c[b]=0),c[b]>255&&(c[b]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this}};Z.prototype={opacity:1,textProps:"direction,fontSize,fontWeight,fontFamily,fontStyle,color,lineHeight,width,textDecoration,textOverflow,textShadow".split(","),
init:function(a,b){this.element=b==="span"?fa(b):H.createElementNS(Qa,b);this.renderer=a},animate:function(a,b,c){b=q(b,this.renderer.globalAnimation,!0);Sa(this);if(b){if(c)b.complete=c;db(this,a,b)}else this.attr(a,null,c);return this},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,i,j,k,l,m,n,p,r=[],s;a.linearGradient?f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];i=d.gradients;k=a.stops;n=c.radialReference;Ja(g)&&(a[f]=g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],gradientUnits:"userSpaceOnUse"});
f==="radialGradient"&&n&&!v(g.gradientUnits)&&(h=g,g=z(g,d.getRadialAttr(n,h),{gradientUnits:"userSpaceOnUse"}));for(p in g)p!=="id"&&r.push(p,g[p]);for(p in k)r.push(k[p]);r=r.join(",");i[r]?n=i[r].attr("id"):(g.id=n="highcharts-"+Ib++,i[r]=j=d.createElement(f).attr(g).add(d.defs),j.radAttr=h,j.stops=[],o(k,function(a){a[1].indexOf("rgba")===0?(e=va(a[1]),l=e.get("rgb"),m=e.get("a")):(l=a[1],m=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":l,"stop-opacity":m}).add(j);j.stops.push(a)}));
s="url("+d.url+"#"+n+")";c.setAttribute(b,s);c.gradient=r;a.toString=function(){return s}}},applyTextShadow:function(a){var b=this.element,c,d=a.indexOf("contrast")!==-1,e={},f=this.renderer.forExport,g=f||b.style.textShadow!==t&&!Ka;if(d)e.textShadow=a=a.replace(/contrast/g,this.renderer.getContrast(b.style.fill));if(sb||f)e.textRendering="geometricPrecision";g?this.css(e):(this.fakeTS=!0,this.ySetter=this.xSetter,c=[].slice.call(b.getElementsByTagName("tspan")),o(a.split(/\s?,\s?/g),function(a){var d=
b.firstChild,e,f,a=a.split(" ");e=a[a.length-1];(f=a[a.length-2])&&o(c,function(a,c){var g;c===0&&(a.setAttribute("x",b.getAttribute("x")),c=b.getAttribute("y"),a.setAttribute("y",c||0),c===null&&b.setAttribute("y",0));g=a.cloneNode(1);X(g,{"class":"highcharts-text-shadow",fill:e,stroke:e,"stroke-opacity":1/w(K(f),3),"stroke-width":f,"stroke-linejoin":"round"});b.insertBefore(g,d)})}))},attr:function(a,b,c){var d,e=this.element,f,g=this,h;typeof a==="string"&&b!==t&&(d=a,a={},a[d]=b);if(typeof a===
"string")g=(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(d in a){b=a[d];h=!1;this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(d)&&(f||(this.symbolAttr(a),f=!0),h=!0);if(this.rotation&&(d==="x"||d==="y"))this.doTransform=!0;h||(h=this[d+"Setter"]||this._defaultSetter,h.call(this,b,d,e),this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d)&&this.updateShadows(d,b,h))}if(this.doTransform)this.updateTransform(),this.doTransform=!1}c&&
c();return g},updateShadows:function(a,b,c){for(var d=this.shadows,e=d.length;e--;)c.call(d[e],a==="height"?Math.max(b-(d[e].cutHeight||0),0):a==="d"?this.d:b,a,d[e])},addClass:function(a){var b=this.element,c=X(b,"class")||"";c.indexOf(a)===-1&&X(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;o("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=q(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",
a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a){var b,c={},d,e=this.strokeWidth||0;d=y(e)%2/2;a.x=V(a.x||this.x||0)+d;a.y=V(a.y||this.y||0)+d;a.width=V((a.width||this.width||0)-2*d);a.height=V((a.height||this.height||0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;if(a&&a.color)a.fill=a.color;if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&d.nodeName.toLowerCase()===
"text"&&K(a.width)||this.textWidth;b&&(a=A(b,c));this.styles=a;e&&(qa||!ja&&this.renderer.forExport)&&delete a.width;if(Ka&&!ja)N(this.element,a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+":"+a[f]+";";X(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;cb&&a==="click"?(d.ontouchstart=function(a){c.touchEventFired=ba.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(Na.indexOf("Android")===
-1||ba.now()-(c.touchEventFired||0)>1100)&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){var b=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;b&&b.radAttr&&b.animate(this.renderer.getRadialAttr(a,b.radAttr));return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,
d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");(v(c)||v(d))&&a.push("scale("+q(c,1)+" "+q(d,1)+")");a.length&&g.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;
if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||Ca(c))this.alignTo=d=c||"renderer",za(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=q(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=y(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=y(g);this[this.placed?
"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(a,b){var c,d=this.renderer,e,f,g,h=this.element,i=this.styles;e=this.textStr;var j,k=h.style,l,m=d.cache,n=d.cacheKeys,p;f=q(b,this.rotation);g=f*pa;e!==t&&(p=["",f||0,i&&i.fontSize,h.style.width].join(","),p=e===""||$b.test(e)?"num:"+e.toString().length+p:e+p);p&&!a&&(c=m[p]);if(!c){if(h.namespaceURI===Qa||d.forExport){try{l=this.fakeTS&&function(a){o(h.querySelectorAll(".highcharts-text-shadow"),function(b){b.style.display=
a})},Wa&&k.textShadow?(j=k.textShadow,k.textShadow=""):l&&l("none"),c=h.getBBox?A({},h.getBBox()):{width:h.offsetWidth,height:h.offsetHeight},j?k.textShadow=j:l&&l("")}catch(r){}if(!c||c.width<0)c={width:0,height:0}}else c=this.htmlGetBBox();if(d.isSVG){d=c.width;e=c.height;if(Ka&&i&&i.fontSize==="11px"&&e.toPrecision(3)==="16.9")c.height=e=14;if(f)c.width=S(e*la(g))+S(d*ca(g)),c.height=S(e*ca(g))+S(d*la(g))}if(p){for(;n.length>250;)delete m[n.shift()];m[p]||n.push(p);m[p]=c}}return c},show:function(a){return this.attr({visibility:a?
"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.attr({y:-9999})}})},add:function(a){var b=this.renderer,c=this.element,d;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)d=this.zIndexSetter();d||(a?a.element:b.box).appendChild(c);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=
a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&b.nodeName==="SPAN"&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;Sa(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&o(c,function(b){a.safeRemoveChild(b)});d&&d.div&&d.div.childNodes.length===0;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,
d=b;a.alignTo&&za(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,j,k;if(a){i=q(a.width,3);j=(a.opacity||0.15)/i;k=this.parentInverted?"(-1,-1)":"("+q(a.offsetX,1)+", "+q(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;X(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":j*e,"stroke-width":h,transform:"translate"+k,fill:"none"});if(c)X(f,"height",w(X(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):
g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this},xGetter:function(a){this.element.nodeName==="circle"&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=q(this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b,c=this["stroke-width"];c===
"inherit"&&(c=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=K(a[b])*c;a=a.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},
opacitySetter:function(a,b,c){this[b]=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=H.createElementNS(Qa,"title"),this.element.appendChild(b));b.firstChild&&b.removeChild(b.firstChild);b.appendChild(H.createTextNode(String(q(a),"").replace(/<[^>]*>/g,"")))},textSetter:function(a){if(a!==this.textStr)delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this)},fillSetter:function(a,b,c){typeof a==="string"?c.setAttribute(b,a):
a&&this.colorGradient(a,b,c)},visibilitySetter:function(a,b,c){a==="inherit"?c.removeAttribute(b):c.setAttribute(b,a)},zIndexSetter:function(a,b){var c=this.renderer,d=this.parentGroup,c=(d||c).element||c.box,e,f,g=this.element,h;e=this.added;var i;if(v(a))g.zIndex=a,a=+a,this[b]===a&&(e=!1),this[b]=a;if(e){if((a=this.zIndex)&&d)d.handleZ=!0;d=c.childNodes;for(i=0;i<d.length&&!h;i++)if(e=d[i],f=e.zIndex,e!==g&&(K(f)>a||!v(a)&&v(f)))c.insertBefore(g,e),h=!0;h||c.appendChild(g)}return h},_defaultSetter:function(a,
b,c){c.setAttribute(b,a)}};Z.prototype.yGetter=Z.prototype.xGetter;Z.prototype.translateXSetter=Z.prototype.translateYSetter=Z.prototype.rotationSetter=Z.prototype.verticalAlignSetter=Z.prototype.scaleXSetter=Z.prototype.scaleYSetter=function(a,b){this[b]=a;this.doTransform=!0};Z.prototype["stroke-widthSetter"]=Z.prototype.strokeSetter=function(a,b,c){this[b]=a;if(this.stroke&&this["stroke-width"])this.strokeWidth=this["stroke-width"],Z.prototype.fillSetter.call(this,this.stroke,"stroke",c),c.setAttribute("stroke-width",
this["stroke-width"]),this.hasStroke=!0;else if(b==="stroke-width"&&a===0&&this.hasStroke)c.removeAttribute("stroke"),this.hasStroke=!1};var xa=function(){this.init.apply(this,arguments)};xa.prototype={Element:Z,init:function(a,b,c,d,e,f){var g,d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));g=d.element;a.appendChild(g);a.innerHTML.indexOf("xmlns")===-1&&X(g,"xmlns",Qa);this.isSVG=!0;this.box=g;this.boxWrapper=d;this.alignedObjects=[];this.url=(Wa||sb)&&H.getElementsByTagName("base").length?
L.location.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(H.createTextNode("Created with Highstock 4.2.5"));this.defs=this.createElement("defs").add();this.allowHTML=f;this.forExport=e;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(b,c,!1);var h;if(Wa&&a.getBoundingClientRect)this.subPixelFix=b=function(){N(a,{left:0,top:0});h=a.getBoundingClientRect();N(a,{left:Ea(h.left)-h.left+"px",
top:Ea(h.top)-h.top+"px"})},b(),E(L,"resize",b)},getStyle:function(a){return this.style=A({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Pa(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&T(L,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=
new this.Element;b.init(this,a);return b},draw:function(){},getRadialAttr:function(a,b){return{cx:a[0]-a[2]/2+b.cx*a[2],cy:a[1]-a[2]/2+b.cy*a[2],r:b.r*a[2]}},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=q(a.textStr,"").toString(),f=e.indexOf("<")!==-1,g=b.childNodes,h,i,j,k=X(b,"x"),l=a.styles,m=a.textWidth,n=l&&l.lineHeight,p=l&&l.textShadow,r=l&&l.textOverflow==="ellipsis",s=g.length,F=m&&!a.added&&this.box,u=function(a){return n?K(n):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?
a.style.fontSize:l&&l.fontSize||c.style.fontSize||12,a).h},x=function(a){return a.replace(/&lt;/g,"<").replace(/&gt;/g,">")};s--;)b.removeChild(g[s]);!f&&!p&&!r&&e.indexOf(" ")===-1?b.appendChild(H.createTextNode(x(e))):(h=/<.*style="([^"]+)".*>/,i=/<.*href="(http[^"]+)".*>/,F&&F.appendChild(b),e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g):
[e],e=Fa(e,function(a){return a!==""}),o(e,function(e,f){var g,n=0,e=e.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");o(g,function(e){if(e!==""||g.length===1){var p={},s=H.createElementNS(Qa,"tspan"),F;h.test(e)&&(F=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),X(s,"style",F));i.test(e)&&!d&&(X(s,"onclick",'location.href="'+e.match(i)[1]+'"'),N(s,{cursor:"pointer"}));e=x(e.replace(/<(.|\n)*?>/g,"")||" ");if(e!==" "){s.appendChild(H.createTextNode(e));
if(n)p.dx=0;else if(f&&k!==null)p.x=k;X(s,p);b.appendChild(s);!n&&f&&(!ja&&d&&N(s,{display:"block"}),X(s,"dy",u(s)));if(m){for(var p=e.replace(/([^\^])-/g,"$1- ").split(" "),q=g.length>1||f||p.length>1&&l.whiteSpace!=="nowrap",o,D,v=[],w=u(s),t=1,y=a.rotation,A=e,B=A.length;(q||r)&&(p.length||v.length);)a.rotation=0,o=a.getBBox(!0),D=o.width,!ja&&c.forExport&&(D=c.measureSpanWidth(s.firstChild.data,a.styles)),o=D>m,j===void 0&&(j=o),r&&j?(B/=2,A===""||!o&&B<0.5?p=[]:(A=e.substring(0,A.length+(o?-1:
1)*Ea(B)),p=[A+(m>3?"\u2026":"")],s.removeChild(s.firstChild))):!o||p.length===1?(p=v,v=[],p.length&&(t++,s=H.createElementNS(Qa,"tspan"),X(s,{dy:w,x:k}),F&&X(s,"style",F),b.appendChild(s)),D>m&&(m=D)):(s.removeChild(s.firstChild),v.unshift(p.pop())),p.length&&s.appendChild(H.createTextNode(p.join(" ").replace(/- /g,"-")));a.rotation=y}n++}}})}),j&&a.attr("title",a.textStr),F&&F.removeChild(b),p&&a.applyTextShadow&&a.applyTextShadow(p))},getContrast:function(a){a=va(a).rgba;return a[0]+a[1]+a[2]>
384?"#000000":"#FFFFFF"},button:function(a,b,c,d,e,f,g,h,i){var j=this.label(a,b,c,i,null,null,null,null,"button"),k=0,l,m,n,p,r,s,a={x1:0,y1:0,x2:0,y2:1},e=z({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},r:2,padding:5,style:{color:"black"}},e);n=e.style;delete e.style;f=z(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);p=f.style;delete f.style;g=z(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#9BD"],[1,"#CDF"]]}},g);
r=g.style;delete g.style;h=z(e,{style:{color:"#CCC"}},h);s=h.style;delete h.style;E(j.element,Ka?"mouseover":"mouseenter",function(){k!==3&&j.attr(f).css(p)});E(j.element,Ka?"mouseout":"mouseleave",function(){k!==3&&(l=[e,f,g][k],m=[n,p,r][k],j.attr(l).css(m))});j.setState=function(a){(j.state=k=a)?a===2?j.attr(g).css(r):a===3&&j.attr(h).css(s):j.attr(e).css(n)};return j.on("click",function(a){k!==3&&d.call(j,a)}).attr(e).css(A({cursor:"default"},n))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=
y(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=y(a[2])+b%2/2);return a},path:function(a){var b={fill:"none"};Ja(a)?b.d=a:ea(a)&&A(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=ea(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=b.ySetter=function(a,b,c){c.setAttribute("c"+b,a)};return b.attr(a)},arc:function(a,b,c,d,e,f){if(ea(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;a=this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,
b,c,d,e,f){var e=ea(a)?a.r:e,g=this.createElement("rect"),a=ea(a)?a:a===t?{}:{x:a,y:b,width:w(c,0),height:w(d,0)};if(f!==t)g.strokeWidth=f,a=g.crisp(a);if(e)a.r=e;g.rSetter=function(a,b,c){X(c,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[q(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return v(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,
b,c,d,e){var f={preserveAspectRatio:"none"};arguments.length>1&&A(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g=this,h,i=this.symbols[a],i=i&&i(y(b),y(c),d,e,f),j=/^url\((.*?)\)$/,k,l;if(i)h=this.path(i),A(h,{symbolName:a,x:b,y:c,width:d,height:e}),f&&A(h,f);else if(j.test(a))l=function(a,b){a.element&&
(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(y((d-b[0])/2),y((e-b[1])/2)))},k=a.match(j)[1],a=Vb[k]||f&&f.width&&f.height&&[f.width,f.height],h=this.image(k).attr({x:b,y:c}),h.isImg=!0,a?l(h,a):(h.attr({width:0,height:0}),fa("img",{onload:function(){this.width===0&&(N(this,{position:"absolute",top:"-999em"}),H.body.appendChild(this));l(h,Vb[k]=[this.width,this.height]);this.parentNode&&this.parentNode.removeChild(this);g.imgCount--;if(!g.imgCount&&$[g.chartIndex].onload)$[g.chartIndex].onload()},
src:k}),this.imgCount++);return h},symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,
c=e.r||c||d,g=e.end-0.001,d=e.innerR,h=e.open,i=ca(f),j=la(f),k=ca(g),g=la(g),e=e.end-f<Aa?0:1;return["M",a+c*i,b+c*j,"A",c,c,0,e,1,a+c*k,b+c*g,h?"M":"L",a+d*k,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*j,h?"":"Z"]},callout:function(a,b,c,d,e){var f=G(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX,e=e&&e.anchorY,i;i=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&e>b+g&&e<b+d-g?i.splice(13,3,"L",a+c,e-6,a+
c+6,e,a+c,e+6,a+c,b+d-f):h&&h<0&&e>b+g&&e<b+d-g?i.splice(33,3,"L",a,e+6,a-6,e,a,e-6,a,b+f):e&&e>d&&h>a+g&&h<a+c-g?i.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):e&&e<0&&h>a+g&&h<a+c-g&&i.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return i}},clipRect:function(a,b,c,d){var e="highcharts-"+Ib++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;a.count=0;return a},text:function(a,b,c,d){var e=qa||!ja&&this.forExport,f={};if(d&&(this.allowHTML||
!this.forExport))return this.html(a,b,c);f.x=Math.round(b||0);if(c)f.y=Math.round(c);if(a||a===0)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});if(!d)a.xSetter=function(a,b,c){var d=c.getElementsByTagName("tspan"),e,f=c.getAttribute(b),m;for(m=0;m<d.length;m++)e=d[m],e.getAttribute(b)===f&&e.setAttribute(b,a);c.setAttribute(b,a)};return a},fontMetrics:function(a,b){var c,d,a=a||this.style.fontSize;!a&&b&&L.getComputedStyle&&(b=b.element||b,a=(c=L.getComputedStyle(b,
""))&&c.fontSize);a=/px/.test(a)?K(a):/em/.test(a)?parseFloat(a)*12:12;c=a<24?a+3:y(a*1.2);d=y(c*0.8);return{h:c,b:d,f:a}},rotCorr:function(a,b,c){var d=a;b&&c&&(d=w(d*ca(b*pa),4));return{x:-a/3*la(b*pa),y:d}},label:function(a,b,c,d,e,f,g,h,i){var j=this,k=j.g(i),l=j.text("",0,0,g).attr({zIndex:1}),m,n,p=0,r=3,s=0,F,u,q,D,Q=0,ha={},w,B,Kb,G,C;Kb=function(){var a,b;a=l.element.style;n=(F===void 0||u===void 0||k.styles.textAlign)&&v(l.textStr)&&l.getBBox();k.width=(F||n.width||0)+2*r+s;k.height=(u||
n.height||0)+2*r;w=r+j.fontMetrics(a&&a.fontSize,l).b;if(B){if(!m)a=Q,b=(h?-w:0)+Q,k.box=m=d?j.symbol(d,a,b,k.width,k.height,ha):j.rect(a,b,k.width,k.height,0,ha["stroke-width"]),m.isImg||m.attr("fill","none"),m.add(k);m.isImg||m.attr(A({width:y(k.width),height:y(k.height)},ha));ha=null}};G=function(){var a=k.styles,a=a&&a.textAlign,b=s+r,c;c=h?0:w;if(v(F)&&n&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(F-n.width);if(b!==l.x||c!==l.y)l.attr("x",b),c!==t&&l.attr("y",c);l.x=b;l.y=c};C=function(a,
b){m?m.attr(a,b):ha[a]=b};k.onAdd=function(){l.add(k);k.attr({text:a||a===0?a:"",x:b,y:c});m&&v(e)&&k.attr({anchorX:e,anchorY:f})};k.widthSetter=function(a){F=a};k.heightSetter=function(a){u=a};k.paddingSetter=function(a){if(v(a)&&a!==r)r=k.padding=a,G()};k.paddingLeftSetter=function(a){v(a)&&a!==s&&(s=a,G())};k.alignSetter=function(a){a={left:0,center:0.5,right:1}[a];a!==p&&(p=a,n&&k.attr({x:q}))};k.textSetter=function(a){a!==t&&l.textSetter(a);Kb();G()};k["stroke-widthSetter"]=function(a,b){a&&
(B=!0);Q=a%2/2;C(b,a)};k.strokeSetter=k.fillSetter=k.rSetter=function(a,b){b==="fill"&&a&&(B=!0);C(b,a)};k.anchorXSetter=function(a,b){e=a;C(b,y(a)-Q-q)};k.anchorYSetter=function(a,b){f=a;C(b,a-D)};k.xSetter=function(a){k.x=a;p&&(a-=p*((F||n.width)+2*r));q=y(a);k.attr("translateX",q)};k.ySetter=function(a){D=k.y=y(a);k.attr("translateY",D)};var H=k.css;return A(k,{css:function(a){if(a){var b={},a=z(a);o(k.textProps,function(c){a[c]!==t&&(b[c]=a[c],delete a[c])});l.css(b)}return H.call(k,a)},getBBox:function(){return{width:n.width+
2*r,height:n.height+2*r,x:n.x-r,y:n.y-r}},shadow:function(a){m&&m.shadow(a);return k},destroy:function(){T(k.element,"mouseenter");T(k.element,"mouseleave");l&&(l=l.destroy());m&&(m=m.destroy());Z.prototype.destroy.call(k);k=j=Kb=G=C=null}})}};Xa=xa;A(Z.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();if(a&&a.textOverflow==="ellipsis")a.whiteSpace="nowrap",a.overflow="hidden";this.styles=A(this.styles,a);N(this.element,
a);return this},htmlGetBBox:function(){var a=this.element;if(a.nodeName==="text")a.style.position="absolute";return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=this.shadows,j=this.styles;N(b,{marginLeft:c,marginTop:d});i&&o(i,function(a){N(a,{marginLeft:c+1,marginTop:d+
1})});this.inverted&&o(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var i=this.rotation,k=K(this.textWidth),l=j&&j.whiteSpace,m=[i,g,b.innerHTML,this.textWidth,this.textAlign].join(",");if(m!==this.cTT){j=a.fontMetrics(b.style.fontSize).b;v(i)&&this.setSpanRotation(i,h,j);if(b.offsetWidth>k&&/[ \-]/.test(b.textContent||b.innerText))N(b,{width:k+"px",display:"block",whiteSpace:l||"normal"}),this.hasTextWidth=!0;else if(this.hasTextWidth)N(b,{width:"",display:"",whiteSpace:l||
"nowrap"}),this.hasTextWidth=!1;this.getSpanCorrection(this.hasTextWidth?k:b.offsetWidth,j,h,i,g)}N(b,{left:e+(this.xCorr||0)+"px",top:f+(this.yCorr||0)+"px"});if(sb)j=b.offsetHeight;this.cTT=m}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,c){var d={},e=Ka?"-ms-transform":sb?"-webkit-transform":Wa?"MozTransform":Ub?"-o-transform":"";d[e]=d.transform="rotate("+a+"deg)";d[e+(Wa?"Origin":"-origin")]=d.transformOrigin=b*100+"% "+c+"px";N(this.element,d)},getSpanCorrection:function(a,b,c){this.xCorr=
-a*c;this.yCorr=-b}});A(xa.prototype,{html:function(a,b,c){var d=this.createElement("span"),e=d.element,f=d.renderer,g=f.isSVG,h=function(a,b){o(["opacity","visibility"],function(c){U(a,c+"Setter",function(a,c,d,e){a.call(this,c,d,e);b[d]=c})})};d.textSetter=function(a){a!==e.innerHTML&&delete this.bBox;e.innerHTML=this.textStr=a;d.htmlUpdateTransform()};g&&h(d,d.element.style);d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){b==="align"&&(b="textAlign");d[b]=a;d.htmlUpdateTransform()};
d.attr({text:a,x:y(b),y:y(c)}).css({position:"absolute",fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});e.style.whiteSpace="nowrap";d.css=d.htmlCss;if(g)d.add=function(a){var b,c=f.box.parentNode,g=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)g.push(a),a=a.parentGroup;o(g.reverse(),function(a){var d,e=X(a.element,"class");e&&(e={className:e});b=a.div=a.div||fa(Va,e,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",opacity:a.opacity},b||c);d=b.style;A(a,
{translateXSetter:function(b,c){d.left=b+"px";a[c]=b;a.doTransform=!0},translateYSetter:function(b,c){d.top=b+"px";a[c]=b;a.doTransform=!0}});h(a,d)})}}else b=c;b.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d};return d}});var lb,aa;if(!ja&&!qa)aa={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",";"],e=b===Va;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),
'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=fa(c);this.renderer=a},add:function(a){var b=this.renderer,c=this.element,d=b.box,e=a&&a.inverted,d=a?a.element||a:d;if(a)this.parentGroup=a;e&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();return this},updateTransform:Z.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=ca(a*pa),c=la(a*pa);N(this.element,
{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11=",b,", M12=",-c,", M21=",c,", M22=",b,", sizingMethod='auto expand')"].join(""):"none"})},getSpanCorrection:function(a,b,c,d,e){var f=d?ca(d*pa):1,g=d?la(d*pa):0,h=q(this.elemHeight,this.element.offsetHeight),i;this.xCorr=f<0&&-a;this.yCorr=g<0&&-h;i=f*g<0;this.xCorr+=g*b*(i?1-c:c);this.yCorr-=f*b*(d?i?c:1-c:1);e&&e!=="left"&&(this.xCorr-=a*c*(f<0?-1:1),d&&(this.yCorr-=h*c*(g<0?-1:1)),N(this.element,{textAlign:e}))},pathToVML:function(a){for(var b=
a.length,c=[];b--;)if(C(a[b]))c[b]=y(a[b]*10)-5;else if(a[b]==="Z")c[b]="x";else if(c[b]=a[b],a.isArc&&(a[b]==="wa"||a[b]==="at"))c[b+5]===c[b+7]&&(c[b+7]+=a[b+7]>a[b+5]?1:-1),c[b+6]===c[b+8]&&(c[b+8]+=a[b+8]>a[b+6]?1:-1);return c.join(" ")||"x"},clip:function(a){var b=this,c;a?(c=a.members,za(c,b),c.push(b),b.destroyClip=function(){za(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:rb?"inherit":"rect(auto)"});return b.css(a)},css:Z.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&
Ua(a)},destroy:function(){this.destroyClip&&this.destroyClip();return Z.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+a]=function(){var a=L.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=K(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,j,k=f.path,l,m,n,p;k&&typeof k.value!=="string"&&(k="x");m=k;if(a){n=q(a.width,3);p=(a.opacity||
0.15)/n;for(e=1;e<=3;e++){l=n*2+1-2*e;c&&(m=this.cutOffPath(k.value,l+0.5));j=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',m,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=fa(g.prepVML(j),null,{left:K(i.left)+q(a.offsetX,1),top:K(i.top)+q(a.offsetY,1)});if(c)h.cutOff=l+1;j=['<stroke color="',a.color||"black",'" opacity="',p*e,'"/>'];fa(g.prepVML(j),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this},updateShadows:ra,
setAttr:function(a,b){rb?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){this.element.className=a},dashstyleSetter:function(a,b,c){(c.getElementsByTagName("stroke")[0]||fa(this.renderer.prepVML(["<stroke/>"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var d=this.shadows,a=a||[];this.d=a.join&&a.join(" ");c.path=a=this.pathToVML(a);if(d)for(c=d.length;c--;)d[c].path=d[c].cutOff?this.cutOffPath(a,d[c].cutOff):a;this.setAttr(b,a)},fillSetter:function(a,b,
c){var d=c.nodeName;if(d==="SPAN")c.style.color=a;else if(d!=="IMG")c.filled=a!=="none",this.setAttr("fillcolor",this.renderer.color(a,c,b,this))},"fill-opacitySetter":function(a,b,c){fa(this.renderer.prepVML(["<",b.split("-")[0],' opacity="',a,'"/>']),null,null,c)},opacitySetter:ra,rotationSetter:function(a,b,c){c=c.style;this[b]=c[b]=a;c.left=-y(la(a*pa)+1)+"px";c.top=y(ca(a*pa))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",this.renderer.color(a,c,b,this))},"stroke-widthSetter":function(a,
b,c){c.stroked=!!a;this[b]=a;C(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){a==="inherit"&&(a="visible");this.shadows&&o(this.shadows,function(c){c.style[b]=a});c.nodeName==="DIV"&&(a=a==="hidden"?"-999em":0,rb||(c.style[b]=a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;b==="x"?b="left":b==="y"&&(b="top");this.updateClipping?(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,
b,c){c.style[b]=a}},aa["stroke-opacitySetter"]=aa["fill-opacitySetter"],B.VMLElement=aa=ma(Z,aa),aa.prototype.ySetter=aa.prototype.widthSetter=aa.prototype.heightSetter=aa.prototype.xSetter,aa={Element:aa,isIE8:Na.indexOf("MSIE 8.0")>-1,init:function(a,b,c,d){var e;this.alignedObjects=[];d=this.createElement(Va).css(A(this.getStyle(d),{position:"relative"}));e=d.element;a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=
0;this.setSize(b,c,!1);if(!H.namespaces.hcv){H.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{H.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(f){H.styleSheets[0].cssText+="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},clipRect:function(a,b,c,d){var e=this.createElement(),f=ea(a);return A(e,
{members:[],count:0,left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:c)-1,height:(f?a.height:d)-1,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+y(a?e:d)+"px,"+y(a?f:b)+"px,"+y(a?b:f)+"px,"+y(a?d:e)+"px)"};!a&&rb&&c==="DIV"&&A(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){o(e.members,function(a){a.element&&a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,
f,g=/^rgba/,h,i,j="none";a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var k,l,m=a.linearGradient||a.radialGradient,n,p,r,s,q,u="",a=a.stops,x,D=[],Q=function(){h=['<fill colors="'+D.join(",")+'" opacity="',r,'" o:opacity2="',p,'" type="',i,'" ',u,'focus="100%" method="any" />'];fa(e.prepVML(h),null,null,b)};n=a[0];x=a[a.length-1];n[0]>0&&a.unshift([0,n[1]]);x[0]<1&&a.push([1,x[1]]);o(a,function(a,b){g.test(a[1])?(f=va(a[1]),k=f.get("rgb"),l=f.get("a")):(k=a[1],l=1);D.push(a[0]*
100+"% "+k);b?(r=l,s=k):(p=l,q=k)});if(c==="fill")if(i==="gradient")c=m.x1||m[0]||0,a=m.y1||m[1]||0,n=m.x2||m[2]||0,m=m.y2||m[3]||0,u='angle="'+(90-Y.atan((m-a)/(n-c))*180/Aa)+'"',Q();else{var j=m.r,ha=j*2,v=j*2,w=m.cx,t=m.cy,y=b.radialReference,A,j=function(){y&&(A=d.getBBox(),w+=(y[0]-A.x)/A.width-0.5,t+=(y[1]-A.y)/A.height-0.5,ha*=y[2]/A.width,v*=y[2]/A.height);u='src="'+R.global.VMLRadialGradientURL+'" size="'+ha+","+v+'" origin="0.5,0.5" position="'+w+","+t+'" color2="'+q+'" ';Q()};d.added?j():
d.onAdd=j;j=s}else j=k}else if(g.test(a)&&b.tagName!=="IMG")f=va(a),d[c+"-opacitySetter"](f.get("a"),c,b),j=f.get("rgb");else{j=b.getElementsByTagName(c);if(j.length)j[0].opacity=1,j[0].type="solid";j=a}return j},prepVML:function(a){var b=this.isIE8,a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):
a=a.replace("<","<hcv:");return a},text:xa.prototype.html,path:function(a){var b={coordsize:"10 10"};Ja(a)?b.d=a:ea(a)&&A(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(ea(a))c=a.r,b=a.y,a=a.x;d.isCircle=!0;d.r=c;return d.attr({x:a,y:b})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(Va).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>
1&&f.attr({x:b,y:c,width:d,height:e});return f},createElement:function(a){return a==="rect"?this.symbol(a):xa.prototype.createElement.call(this,a)},invertChild:function(a,b){var c=this,d=b.style,e=a.tagName==="IMG"&&a.style;N(a,{flip:"x",left:K(d.width)-(e?K(e.top):1),top:K(d.height)-(e?K(e.left):1),rotation:-90});o(a.childNodes,function(b){c.invertChild(b,a)})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||d,c=e.innerR,d=ca(f),i=la(f),j=ca(g),k=la(g);if(g-f===0)return["x"];f=["wa",
a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*j,b+h*k];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*j,b+c*k,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&(c=d=2*e.r);e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){return xa.prototype.symbols[!v(e)||!e.r?"square":"callout"].call(0,a,b,c,d,e)}}},B.VMLRenderer=lb=function(){this.init.apply(this,arguments)},lb.prototype=z(xa.prototype,aa),Xa=lb;xa.prototype.measureSpanWidth=
function(a,b){var c=H.createElement("span"),d;d=H.createTextNode(a);c.appendChild(d);N(c,b);this.box.appendChild(c);d=c.offsetWidth;Ua(c);return d};var Wb;if(qa)B.CanVGRenderer=aa=function(){Qa="http://www.w3.org/1999/xhtml"},aa.prototype.symbols={},Wb=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){if(b.length===0){var e=H.getElementsByTagName("head")[0],f=H.createElement("script");f.type="text/javascript";f.src=d;f.onload=a;e.appendChild(f)}b.push(c)}}}(),
Xa=aa;bb.prototype={addLabel:function(){var a=this.axis,b=a.options,c=a.chart,d=a.categories,e=a.names,f=this.pos,g=b.labels,h=a.tickPositions,i=f===h[0],j=f===h[h.length-1],e=d?q(d[f],e[f],f):f,d=this.label,h=h.info,k;a.isDatetimeAxis&&h&&(k=b.dateTimeLabelFormats[h.higherRanks[f]||h.unitName]);this.isFirst=i;this.isLast=j;b=a.labelFormatter.call({axis:a,chart:c,isFirst:i,isLast:j,dateTimeLabelFormat:k,value:a.isLog?ka(a.lin2log(e)):e});v(d)?d&&d.attr({text:b}):(this.labelLength=(this.label=d=v(b)&&
g.enabled?c.renderer.text(b,0,0,g.useHTML).css(z(g.style)).add(a.labelGroup):null)&&d.getBBox().width,this.rotation=0)},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var b=this.axis,c=a.x,d=b.chart.chartWidth,e=b.chart.spacing,f=q(b.labelLeft,G(b.pos,e[3])),e=q(b.labelRight,w(b.pos+b.len,d-e[1])),g=this.label,h=this.rotation,i={left:0,center:0.5,right:1}[b.labelAlign],j=g.getBBox().width,k=b.getSlotWidth(),l=k,m=1,n,
p={};if(h)h<0&&c-i*j<f?n=y(c/ca(h*pa)-f):h>0&&c+i*j>e&&(n=y((d-c)/ca(h*pa)));else if(d=c+(1-i)*j,c-i*j<f?l=a.x+l*(1-i)-f:d>e&&(l=e-a.x+l*i,m=-1),l=G(k,l),l<k&&b.labelAlign==="center"&&(a.x+=m*(k-l-i*(k-G(j,l)))),j>l||b.autoRotation&&g.styles.width)n=l;if(n){p.width=n;if(!b.options.labels.style.textOverflow)p.textOverflow="ellipsis";g.css(p)}},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+
(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=this.axis,j=i.transA,k=i.reversed,l=i.staggerLines,m=i.tickRotCorr||{x:0,y:0},n=e.y;v(n)||(n=i.side===0?c.rotation?-8:-c.getBBox().height:i.side===2?m.y+8:ca(c.rotation*pa)*(m.y-c.getBBox(!1,0).height/2));a=a+e.x+m.x-(f&&d?f*j*(k?-1:1):0);b=b+n-(f&&!d?f*j*(k?1:-1):0);l&&(c=g/(h||1)%l,i.opposite&&
(c=l-c-1),b+=c*(i.labelOffset/l));return{x:a,y:y(b)}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,i=this.label,j=this.pos,k=e.labels,l=this.gridLine,m=h?h+"Grid":"grid",n=h?h+"Tick":"tick",p=e[m+"LineWidth"],r=e[m+"LineColor"],s=e[m+"LineDashStyle"],m=d.tickSize(n),n=e[n+"Color"],F=this.mark,u=k.step,o=!0,D=d.tickmarkOffset,Q=this.getPosition(g,j,D,b),ha=Q.x,
Q=Q.y,v=g&&ha===d.pos+d.len||!g&&Q===d.pos?-1:1,c=q(c,1);this.isActive=!0;if(p){j=d.getPlotLinePath(j+D,p*v,b,!0);if(l===t){l={stroke:r,"stroke-width":p};if(s)l.dashstyle=s;if(!h)l.zIndex=1;if(b)l.opacity=0;this.gridLine=l=p?f.path(j).attr(l).add(d.gridGroup):null}if(!b&&l&&j)l[this.isNew?"attr":"animate"]({d:j,opacity:c})}if(m)d.opposite&&(m[0]=-m[0]),h=this.getMarkPath(ha,Q,m[0],m[1]*v,g,f),F?F.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:n,"stroke-width":m[1],opacity:c}).add(d.axisGroup);
if(i&&C(ha))i.xy=Q=this.getLabelPosition(ha,Q,i,g,k,D,a,u),this.isFirst&&!this.isLast&&!q(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!q(e.showLastLabel,1)?o=!1:g&&!d.isRadial&&!k.step&&!k.rotation&&!b&&c!==0&&this.handleOverflow(Q),u&&a%u&&(o=!1),o&&C(Q.y)?(Q.opacity=c,i[this.isNew?"attr":"animate"](Q),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Pa(this,this.axis)}};B.PlotLineOrBand=function(a,b){this.axis=a;if(b)this.options=b,this.id=b.id};B.PlotLineOrBand.prototype={render:function(){var a=
this,b=a.axis,c=b.horiz,d=a.options,e=d.label,f=a.label,g=d.width,h=d.to,i=d.from,j=v(i)&&v(h),k=d.value,l=d.dashStyle,m=a.svgElem,n=[],p,r=d.color,s=q(d.zIndex,0),F=d.events,u={},o=b.chart.renderer,n=b.log2lin;b.isLog&&(i=n(i),h=n(h),k=n(k));if(g){if(n=b.getPlotLinePath(k,g),u={stroke:r,"stroke-width":g},l)u.dashstyle=l}else if(j){n=b.getPlotBandPath(i,h,d);if(r)u.fill=r;if(d.borderWidth)u.stroke=d.borderColor,u["stroke-width"]=d.borderWidth}else return;u.zIndex=s;if(m)if(n)m.show(),m.animate({d:n});
else{if(m.hide(),f)a.label=f=f.destroy()}else if(n&&n.length&&(a.svgElem=m=o.path(n).attr(u).add(),F))for(p in d=function(b){m.on(b,function(c){F[b].apply(a,[c])})},F)d(p);e&&v(e.text)&&n&&n.length&&b.width>0&&b.height>0&&!n.flat?(e=z({align:c&&j&&"center",x:c?!j&&4:10,verticalAlign:!c&&j&&"middle",y:c?j?16:10:j?6:-4,rotation:c&&!j&&90},e),this.renderLabel(e,n,j,s)):f&&f.hide();return a},renderLabel:function(a,b,c,d){var e=this.label,f=this.axis.chart.renderer;if(!e)e={align:a.textAlign||a.align,
rotation:a.rotation},e.zIndex=d,this.label=e=f.text(a.text,0,0,a.useHTML).attr(e).css(a.style).add();d=[b[1],b[4],c?b[6]:b[1]];b=[b[2],b[5],c?b[7]:b[2]];c=Ma(d);f=Ma(b);e.align(a,!1,{x:c,y:f,width:Da(d)-c,height:Da(b)-f});e.show()},destroy:function(){za(this.axis.plotLinesAndBands,this);delete this.axis;Pa(this)}};var J=B.Axis=function(){this.init.apply(this,arguments)};J.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",
week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#D8D8D8",labels:{enabled:!0,style:{color:"#606060",cursor:"default",fontSize:"11px"},x:0},lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",title:{align:"middle",
style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return B.numberFormat(this.total,-1)},style:z(W.line.dataLabels.style,{color:"#000000"})}},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],
x:0},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0},title:{rotation:0}},init:function(a,b){var c=b.isX;this.chart=a;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.reversed=d.reversed;this.visible=d.visible!==
!1;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.names=this.names||[];this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=v(d.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.stacksTouched=0;this.min=this.max=null;this.crosshair=
q(d.crosshair,ua(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;sa(this,a.axes)===-1&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];if(a.inverted&&c&&this.reversed===t)this.reversed=!0;this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(f in d)E(this,f,d[f]);if(this.isLog)this.val2lin=this.log2lin,this.lin2val=this.lin2log},setOptions:function(a){this.options=z(this.defaultOptions,
this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],z(R[this.coll],a))},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=R.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,a=a.isLog?b:a.tickInterval;if(h)g=La(h,this);else if(c)g=b;else if(d)g=na(d,b);else if(f&&a>=1E3)for(;f--&&g===t;)c=Math.pow(1E3,f+1),a>=c&&b*10%
c===0&&e[f]!==null&&(g=B.numberFormat(b/c,-1)+e[f]);g===t&&(g=S(b)>=1E4?B.numberFormat(b,-1):B.numberFormat(b,-1,t,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();o(a.series,function(c){if(c.visible||!b.options.chart.ignoreHiddenSeries){var d=c.options,e=d.threshold,f;a.hasVisibleSeries=!0;a.isLog&&e<=0&&(e=null);if(a.isXAxis){if(d=c.xData,d.length)c=Ma(d),!C(c)&&!(c instanceof
ba)&&(d=Fa(d,function(a){return C(a)}),c=Ma(d)),a.dataMin=G(q(a.dataMin,d[0]),c),a.dataMax=w(q(a.dataMax,d[0]),Da(d))}else{c.getExtremes();f=c.dataMax;c=c.dataMin;if(v(c)&&v(f))a.dataMin=G(q(a.dataMin,c),c),a.dataMax=w(q(a.dataMax,f),f);if(v(e))a.threshold=e;if(!d.softThreshold||a.isLog)a.softThreshold=!1}}})},translate:function(a,b,c,d,e,f){var g=this.linkedParent||this,h=1,i=0,j=d?g.oldTransA:g.transA,d=d?g.oldMin:g.min,k=g.minPixelPadding,e=(g.isOrdinal||g.isBroken||g.isLog&&e)&&g.lin2val;if(!j)j=
g.transA;if(c)h*=-1,i=g.len;g.reversed&&(h*=-1,i-=h*(g.sector||g.len));b?(a=a*h+i,a-=k,a=a/j+d,e&&(a=g.lin2val(a))):(e&&(a=g.val2lin(a)),f==="between"&&(f=0.5),a=h*(a-d)*j+i+h*k+(C(f)?j*f*g.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,h=this.top,i,j,k=c&&f.oldChartHeight||f.chartHeight,
l=c&&f.oldChartWidth||f.chartWidth,m;i=this.transB;var n=function(a,b,c){if(a<b||a>c)d?a=G(w(b,a),c):m=!0;return a},e=q(e,this.translate(a,null,null,c)),a=c=y(e+i);i=j=y(k-e-i);C(e)?this.horiz?(i=h,j=k-this.bottom,a=c=n(a,g,g+this.width)):(a=g,c=l-this.right,i=j=n(i,h,h+this.height)):m=!0;return m&&!d?null:f.renderer.crispLine(["M",a,i,"L",c,j],b||1)},getLinearTickPositions:function(a,b,c){var d,e=ka(V(b/a)*a),f=ka(Ea(c/a)*a),g=[];if(b===c&&C(b))return[b];for(b=e;b<=f;){g.push(b);b=ka(b+a);if(b===
d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e,f=this.pointRangePadding||0;e=this.min-f;var f=this.max+f,g=f-e;if(g&&g/c<this.len/3)if(this.isLog){f=b.length;for(e=1;e<f;e++)d=d.concat(this.getLogTickPositions(c,b[e-1],b[e],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval==="auto")d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),e,f,a.startOfWeek));else for(b=e+(b[0]-e)%c;b<=f;b+=c)d.push(b);d.length!==
0&&this.trimTicks(d,a.startOnTick,a.endOnTick);return d},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,j,k;if(this.isXAxis&&this.minRange===t&&!this.isLog)v(a.min)||v(a.max)?this.minRange=null:(o(this.series,function(a){i=a.xData;for(g=j=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===t||h<f)f=h}),this.minRange=G(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){k=this.minRange;d=(k-c+b)/2;d=[b-d,q(a.min,b-d)];
if(e)d[2]=this.dataMin;b=Da(d);c=[b+k,q(a.max,b+k)];if(e)c[2]=this.dataMax;c=Ma(c);c-b<k&&(d[0]=c-k,d[1]=q(a.min,c-k),b=Da(d))}this.min=b;this.max=c},getClosest:function(){var a;o(this.series,function(b){var c=b.closestPointRange;!b.noSharedTooltip&&v(c)&&(a=v(a)?G(a,c):c)});return a},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,i=!!b.categories,j=b.transA,k=b.isXAxis;if(k||i||d)if(h?(f=h.minPointOffset,g=h.pointRangePadding):(e=b.getClosest(),
o(b.series,function(a){var c=i?1:k?q(a.options.pointRange,e,0):b.axisPointRange||0,a=a.options.pointPlacement;d=w(d,c);b.single||(f=w(f,Ca(a)?0:c/2),g=w(g,a==="on"?0:c))})),h=b.ordinalSlope&&e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=G(d,c),k)b.closestPointRange=e;if(a)b.oldTransA=j;b.translationSlope=b.transA=j=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=j*f},minFromRange:function(){return this.max-this.range},setTickInterval:function(a){var b=
this,c=b.chart,d=b.options,e=b.isLog,f=b.log2lin,g=b.isDatetimeAxis,h=b.isXAxis,i=b.isLinked,j=d.maxPadding,k=d.minPadding,l=d.tickInterval,m=d.tickPixelInterval,n=b.categories,p=b.threshold,r=b.softThreshold,s,F,u,x;!g&&!n&&!i&&this.getTickAmount();u=q(b.userMin,d.min);x=q(b.userMax,d.max);i?(b.linkedParent=c[b.coll][d.linkedTo],c=b.linkedParent.getExtremes(),b.min=q(c.min,c.dataMin),b.max=q(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&ga(11,1)):(!r&&v(p)&&(b.dataMin>=p?(s=p,k=0):b.dataMax<=
p&&(F=p,j=0)),b.min=q(u,s,b.dataMin),b.max=q(x,F,b.dataMax));if(e)!a&&G(b.min,q(b.dataMin,b.min))<=0&&ga(10,1),b.min=ka(f(b.min),15),b.max=ka(f(b.max),15);if(b.range&&v(b.max))b.userMin=b.min=u=w(b.min,b.minFromRange()),b.userMax=x=b.max,b.range=null;O(b,"foundExtremes");b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!n&&!b.axisPointRange&&!b.usePercentage&&!i&&v(b.min)&&v(b.max)&&(f=b.max-b.min))!v(u)&&k&&(b.min-=f*k),!v(x)&&j&&(b.max+=f*j);if(C(d.floor))b.min=w(b.min,d.floor);if(C(d.ceiling))b.max=
G(b.max,d.ceiling);if(r&&v(b.dataMin))if(p=p||0,!v(u)&&b.min<p&&b.dataMin>=p)b.min=p;else if(!v(x)&&b.max>p&&b.dataMax<=p)b.max=p;b.tickInterval=b.min===b.max||b.min===void 0||b.max===void 0?1:i&&!l&&m===b.linkedParent.options.tickPixelInterval?l=b.linkedParent.tickInterval:q(l,this.tickAmount?(b.max-b.min)/w(this.tickAmount-1,1):void 0,n?1:(b.max-b.min)*m/w(b.len,m));h&&!a&&o(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&
b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(b.pointRange&&!l)b.tickInterval=w(b.pointRange,b.tickInterval);a=q(d.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);if(!l&&b.tickInterval<a)b.tickInterval=a;if(!g&&!e&&!l)b.tickInterval=Ab(b.tickInterval,null,zb(b.tickInterval),q(d.allowDecimals,!(b.tickInterval>0.5&&b.tickInterval<5&&b.max>1E3&&b.max<9999)),!!this.tickAmount);if(!this.tickAmount&&this.len)b.tickInterval=b.unsquish();
this.setTickPositions()},setTickPositions:function(){var a=this.options,b,c=a.tickPositions,d=a.tickPositioner,e=a.startOnTick,f=a.endOnTick,g;this.tickmarkOffset=this.categories&&a.tickmarkPlacement==="between"&&this.tickInterval===1?0.5:0;this.minorTickInterval=a.minorTickInterval==="auto"&&this.tickInterval?this.tickInterval/5:a.minorTickInterval;this.tickPositions=b=c&&c.slice();if(!b&&(b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,
this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],b.pop()]),this.tickPositions=b,d&&(d=d.apply(this,[this.min,this.max]))))this.tickPositions=b=d;if(!this.isLinked)this.trimTicks(b,e,f),this.min===this.max&&v(this.min)&&!this.tickAmount&&(g=!0,this.min-=0.5,this.max+=0.5),this.single=g,!c&&!d&&this.adjustTickAmount()},
trimTicks:function(a,b,c){var d=a[0],e=a[a.length-1],f=this.minPointOffset||0;if(b)this.min=d;else for(;this.min-f>a[0];)a.shift();if(c)this.max=e;else for(;this.max+f<a[a.length-1];)a.pop();a.length===0&&v(d)&&a.push((e+d)/2)},alignToOthers:function(){var a={},b,c=this.options;this.chart.options.chart.alignTicks!==!1&&c.alignTicks!==!1&&o(this.chart[this.coll],function(c){var e=c.options,e=[c.horiz?e.left:e.top,e.width,e.height,e.pane].join(",");c.series.length&&(a[e]?b=!0:a[e]=1)});return b},getTickAmount:function(){var a=
this.options,b=a.tickAmount,c=a.tickPixelInterval;!v(a.tickInterval)&&this.len<c&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Ea(this.len/c)+1);if(b<4)this.finalTickAmt=b,b=5;this.tickAmount=b},adjustTickAmount:function(){var a=this.tickInterval,b=this.tickPositions,c=this.tickAmount,d=this.finalTickAmt,e=b&&b.length;if(e<c){for(;b.length<c;)b.push(ka(b[b.length-1]+a));this.transA*=(e-1)/(c-1);this.max=b[b.length-1]}else e>c&&(this.tickInterval*=2,this.setTickPositions());
if(v(d)){for(a=c=b.length;a--;)(d===3&&a%2===1||d<=2&&a>0&&a<c-1)&&b.splice(a,1);this.finalTickAmt=t}},setScale:function(){var a,b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();b=this.len!==this.oldAxisLength;o(this.series,function(b){if(b.isDirtyData||b.isDirty||b.xAxis.isDirty)a=!0});if(b||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()){if(this.resetStacks&&this.resetStacks(),this.forceRedraw=
!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,!this.isDirty)this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax}else this.cleanStacks&&this.cleanStacks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=q(c,!0);o(f.series,function(a){delete a.kdTree});e=A(e,{min:a,max:b});O(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,e=this.options,
f=G(c,q(e.min,c)),e=w(d,q(e.max,d));this.allowZoomOutside||(v(c)&&a<=f&&(a=f),v(d)&&b>=e&&(b=e));this.displayBtn=a!==t||b!==t;this.setExtremes(a,b,!1,t,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=this.horiz,e=q(b.width,a.plotWidth-c+(b.offsetRight||0)),f=q(b.height,a.plotHeight),g=q(b.top,a.plotTop),b=q(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=Math.round(parseFloat(f)/100*a.plotHeight));c.test(g)&&(g=Math.round(parseFloat(g)/100*a.plotHeight+
a.plotTop));this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=w(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=this.isLog,b=this.lin2log;return{min:a?ka(b(this.min)):this.min,max:a?ka(b(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=this.lin2log,d=b?c(this.min):this.min,b=b?c(this.max):this.max;a===null?a=b<0?b:d:d>a?a=d:b<
a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(q(a,0)-this.side*90+720)%360;return a>15&&a<165?"right":a>195&&a<345?"left":"center"},tickSize:function(a){var b=this.options,c=b[a+"Length"],d=q(b[a+"Width"],a==="tick"&&this.isXAxis?1:0);if(d&&c)return b[a+"Position"]==="inside"&&(c=-c),[c,d]},labelMetrics:function(){return this.chart.renderer.fontMetrics(this.options.labels.style.fontSize,this.ticks[0]&&this.ticks[0].label)},unsquish:function(){var a=this.options.labels,b=
this.horiz,c=this.tickInterval,d=c,e=this.len/(((this.categories?1:0)+this.max-this.min)/c),f,g=a.rotation,h=this.labelMetrics(),i,j=Number.MAX_VALUE,k,l=function(a){a/=e||1;a=a>1?Ea(a):1;return a*c};b?(k=!a.staggerLines&&!a.step&&(v(g)?[g]:e<q(a.autoRotationLimit,80)&&a.autoRotation))&&o(k,function(a){var b;if(a===g||a&&a>=-90&&a<=90)i=l(S(h.h/la(pa*a))),b=i+S(a/360),b<j&&(j=b,f=a,d=i)}):a.step||(d=l(h.h));this.autoRotation=k;this.labelRotation=q(f,g);return d},getSlotWidth:function(){var a=this.chart,
b=this.horiz,c=this.options.labels,d=Math.max(this.tickPositions.length-(this.categories?0:1),1),e=a.margin[3];return b&&(c.step||0)<2&&!c.rotation&&(this.staggerLines||1)*a.plotWidth/d||!b&&(e&&e-a.spacing[3]||a.chartWidth*0.33)},renderUnsquish:function(){var a=this.chart,b=a.renderer,c=this.tickPositions,d=this.ticks,e=this.options.labels,f=this.horiz,g=this.getSlotWidth(),h=w(1,y(g-2*(e.padding||5))),i={},j=this.labelMetrics(),k=e.style.textOverflow,l,m=0,n,p;if(!Ca(e.rotation))i.rotation=e.rotation||
0;if(this.autoRotation)o(c,function(a){if((a=d[a])&&a.labelLength>m)m=a.labelLength}),m>h&&m>j.h?i.rotation=this.labelRotation:this.labelRotation=0;else if(g&&(l={width:h+"px"},!k)){l.textOverflow="clip";for(n=c.length;!f&&n--;)if(p=c[n],h=d[p].label)if(h.styles.textOverflow==="ellipsis"?h.css({textOverflow:"clip"}):d[p].labelLength>g&&h.css({width:g+"px"}),h.getBBox().height>this.len/c.length-(j.h-j.f))h.specCss={textOverflow:"ellipsis"}}if(i.rotation&&(l={width:(m>a.chartHeight*0.5?a.chartHeight*
0.33:a.chartHeight)+"px"},!k))l.textOverflow="ellipsis";if(this.labelAlign=e.align||this.autoLabelAlign(this.labelRotation))i.align=this.labelAlign;o(c,function(a){var b=(a=d[a])&&a.label;if(b)b.attr(i),l&&b.css(z(l,b.specCss)),delete b.specCss,a.rotation=i.rotation});this.tickRotCorr=b.rotCorr(j.b,this.labelRotation||0,this.side!==0)},hasData:function(){return this.hasVisibleSeries||v(this.min)&&v(this.max)&&!!this.tickPositions},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,
e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,j,k,l=0,m,n=0,p=d.title,r=d.labels,s=0,F=a.opposite,u=b.axisOffset,b=b.clipOffset,x=[-1,1,1,-1][h],D,Q=a.axisParent,ha=this.tickSize("tick");j=a.hasData();a.showAxis=k=j||q(d.showEmpty,!0);a.staggerLines=a.horiz&&r.staggerLines;if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(Q),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(Q),a.labelGroup=c.g("axis-labels").attr({zIndex:r.zIndex||7}).addClass("highcharts-"+
a.coll.toLowerCase()+"-labels").add(Q);if(j||a.isLinked){if(o(e,function(b){f[b]?f[b].addLabel():f[b]=new bb(a,b)}),a.renderUnsquish(),r.reserveSpace!==!1&&(h===0||h===2||{1:"left",3:"right"}[h]===a.labelAlign||a.labelAlign==="center")&&o(e,function(a){s=w(f[a].getLabelSize(),s)}),a.staggerLines)s*=a.staggerLines,a.labelOffset=s*(a.opposite?-1:1)}else for(D in f)f[D].destroy(),delete f[D];if(p&&p.text&&p.enabled!==!1){if(!a.axisTitle)(D=p.textAlign)||(D=(g?{low:"left",middle:"center",high:"right"}:
{low:F?"right":"left",middle:"center",high:F?"left":"right"})[p.align]),a.axisTitle=c.text(p.text,0,0,p.useHTML).attr({zIndex:7,rotation:p.rotation||0,align:D}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(p.style).add(a.axisGroup),a.axisTitle.isNew=!0;if(k)l=a.axisTitle.getBBox()[g?"height":"width"],m=p.offset,n=v(m)?0:q(p.margin,g?5:10);a.axisTitle[k?"show":"hide"](!0)}a.offset=x*q(d.offset,u[h]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};c=h===0?-a.labelMetrics().h:h===2?a.tickRotCorr.y:
0;n=Math.abs(s)+n;s&&(n-=c,n+=x*(g?q(r.y,a.tickRotCorr.y+x*8):r.x));a.axisTitleMargin=q(m,n);u[h]=w(u[h],a.axisTitleMargin+l+x*a.offset,n,j&&e.length&&ha?ha[0]:0);d=d.offset?0:V(d.lineWidth/2)*2;b[i]=w(b[i],d)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],
a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=e.x||0,j=e.y||0,k=K(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?k:0);return{x:a?d+i:b+(g?this.width:0)+h+i,y:a?b+j-(g?this.height:0)+h:d+j}},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.isLog,f=a.lin2log,g=a.isLinked,h=a.tickPositions,
i=a.axisTitle,j=a.ticks,k=a.minorTicks,l=a.alternateBands,m=d.stackLabels,n=d.alternateGridColor,p=a.tickmarkOffset,r=d.lineWidth,s,q=b.hasRendered&&C(a.oldMin),u=a.showAxis,x=gb(c.globalAnimation),D,Q;a.labelEdge.length=0;a.overlap=!1;o([j,k,l],function(a){for(var b in a)a[b].isActive=!1});if(a.hasData()||g){a.minorTickInterval&&!a.categories&&o(a.getMinorTickPositions(),function(b){k[b]||(k[b]=new bb(a,b,"minor"));q&&k[b].isNew&&k[b].render(null,!0);k[b].render(null,!1,1)});if(h.length&&(o(h,function(b,
c){if(!g||b>=a.min&&b<=a.max)j[b]||(j[b]=new bb(a,b)),q&&j[b].isNew&&j[b].render(c,!0,0.1),j[b].render(c)}),p&&(a.min===0||a.single)))j[-1]||(j[-1]=new bb(a,-1,null,!0)),j[-1].render(-1);n&&o(h,function(c,d){Q=h[d+1]!==t?h[d+1]+p:a.max-p;if(d%2===0&&c<a.max&&Q<=a.max+(b.polar?-p:p))l[c]||(l[c]=new B.PlotLineOrBand(a)),D=c+p,l[c].options={from:e?f(D):D,to:e?f(Q):Q,color:n},l[c].render(),l[c].isActive=!0});if(!a._addedPlotLB)o((d.plotLines||[]).concat(d.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),
a._addedPlotLB=!0}o([j,k,l],function(a){var c,d,e=[],f=x.duration;for(c in a)if(!a[c].isActive)a[c].render(c,!1,0),a[c].isActive=!1,e.push(c);Za(function(){for(d=e.length;d--;)a[e[d]]&&!a[e[d]].isActive&&(a[e[d]].destroy(),delete a[e[d]])},a===l||!b.hasRendered||!f?0:f)});if(r)s=a.getLinePath(r),a.axisLine?a.axisLine.animate({d:s}):a.axisLine=c.path(s).attr({stroke:d.lineColor,"stroke-width":r,zIndex:7}).add(a.axisGroup),a.axisLine[u?"show":"hide"](!0);if(i&&u)i[i.isNew?"attr":"animate"](a.getTitlePosition()),
i.isNew=!1;m&&m.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){this.visible&&(this.render(),o(this.plotLinesAndBands,function(a){a.render()}));o(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,c=b.stacks,d,e=b.plotLinesAndBands;a||T(b);for(d in c)Pa(c[d]),c[d]=null;o([b.ticks,b.minorTicks,b.alternateBands],function(a){Pa(a)});for(a=e.length;a--;)e[a].destroy();o("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","),function(a){b[a]&&
(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},drawCrosshair:function(a,b){var c,d=this.crosshair,e,f;if(!this.crosshair||(v(b)||!q(d.snap,!0))===!1)this.hideCrosshair();else if(q(d.snap,!0)?v(b)&&(c=this.isXAxis?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos,c=this.isRadial?this.getPlotLinePath(this.isXAxis?b.x:q(b.stackY,b.y))||null:this.getPlotLinePath(null,null,null,null,c)||null,c===null)this.hideCrosshair();else if(e=this.categories&&!this.isRadial,
f=q(d.width,e?this.transA:1),this.cross)this.cross.attr({d:c,visibility:"visible","stroke-width":f});else{e={"pointer-events":"none","stroke-width":f,stroke:d.color||(e?"rgba(155,200,255,0.2)":"#C0C0C0"),zIndex:q(d.zIndex,2)};if(d.dashStyle)e.dashstyle=d.dashStyle;this.cross=this.chart.renderer.path(c).attr(e).add()}},hideCrosshair:function(){this.cross&&this.cross.hide()}};A(J.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b,null,null,!0),d=this.getPlotLinePath(a,null,null,!0);
d&&c?(d.flat=d.toString()===c.toString(),d.push(c[4],c[5],c[1],c[2])):d=null;return d},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new B.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));return c},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,
e=b.length;e--;)b[e].id===a&&b[e].destroy();o([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&za(b,b[e])})}});J.prototype.getTimeTicks=function(a,b,c,d){var e=[],f={},g=R.global.useUTC,h,i=new ba(b-eb(b)),j=a.unitRange,k=a.count;if(v(b)){i[Pb](j>=M.second?0:k*V(i.getMilliseconds()/k));if(j>=M.second)i[Qb](j>=M.minute?0:k*V(i.getSeconds()/k));if(j>=M.minute)i[Rb](j>=M.hour?0:k*V(i[Bb]()/k));if(j>=M.hour)i[Sb](j>=M.day?0:k*V(i[Cb]()/k));
if(j>=M.day)i[qb](j>=M.month?1:k*V(i[ab]()/k));j>=M.month&&(i[Eb](j>=M.year?0:k*V(i[hb]()/k)),h=i[ib]());j>=M.year&&(h-=h%k,i[Fb](h));if(j===M.week)i[qb](i[ab]()-i[Db]()+q(d,1));b=1;if(yb||fb)i=i.getTime(),i=new ba(i+eb(i));h=i[ib]();for(var d=i.getTime(),l=i[hb](),m=i[ab](),n=!g||!!fb,p=(M.day+(g?eb(i):i.getTimezoneOffset()*6E4))%M.day;d<c;)e.push(d),j===M.year?d=pb(h+b*k,0):j===M.month?d=pb(h,l+b*k):n&&(j===M.day||j===M.week)?d=pb(h,l,m+b*k*(j===M.day?1:7)):d+=j*k,b++;e.push(d);o(Fa(e,function(a){return j<=
M.hour&&a%M.day===p}),function(a){f[a]="day"})}e.info=A(a,{higherRanks:f,totalRange:j*k});return e};J.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=M[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=M[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+M[c[g+1][0]])/2)break;e===M.year&&
a<5*e&&(f=[1,2,5]);c=Ab(a/e,f,d[0]==="year"?w(zb(a/e),1):1);return{unitRange:e,count:c,unitName:d[0]}};J.prototype.getLogTickPositions=function(a,b,c,d){var e=this.options,f=this.len,g=this.lin2log,h=this.log2lin,i=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=y(a),i=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=V(b),j,k,l,m,n,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!n;f++){k=e.length;for(j=0;j<k&&!n;j++)l=h(g(f)*e[j]),l>b&&(!d||m<=c)&&m!==t&&i.push(m),m>c&&
(n=!0),m=l}else if(b=g(b),c=g(c),a=e[d?"minorTickInterval":"tickInterval"],a=q(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=Ab(a,null,zb(a)),i=ta(this.getLinearTickPositions(a,b,c),h),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return i};J.prototype.log2lin=function(a){return Y.log(a)/Y.LN10};J.prototype.lin2log=function(a){return Y.pow(10,a)};var Lb=B.Tooltip=function(){this.init.apply(this,arguments)};Lb.prototype=
{init:function(a,b){var c=b.borderWidth,d=b.style,e=K(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});qa||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);
clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=this,f=e.now,g=e.options.animation!==!1&&!e.isHidden&&(S(a-f.x)>1||S(b-f.y)>1),h=e.followPointer||e.len>1;A(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:h?t:g?(2*f.anchorX+c)/3:c,anchorY:h?t:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g)clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(a){var b=this;clearTimeout(this.hideTimer);a=q(a,this.options.hideDelay,500);if(!this.isHidden)this.hideTimer=
Za(function(){b.label[a?"fadeOut":"hide"]();b.isHidden=!0},a)},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=d.plotTop,g=d.plotLeft,h=0,i=0,j,k,a=ua(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===t&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(o(a,function(a){j=a.series.yAxis;k=a.series.xAxis;h+=a.plotX+(!e&&k?k.left-g:0);i+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&j?j.top-f:0)}),h/=a.length,i/=a.length,c=[e?d.plotWidth-i:h,this.shared&&!e&&a.length>
1&&b?b.chartY-f:e?d.plotHeight-h:i]);return ta(c,y)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,f={},g=c.h||0,h,i=["y",d.chartHeight,b,c.plotY+d.plotTop,d.plotTop,d.plotTop+d.plotHeight],j=["x",d.chartWidth,a,c.plotX+d.plotLeft,d.plotLeft,d.plotLeft+d.plotWidth],k=!this.followPointer&&q(c.ttBelow,!d.inverted===!!c.negative),l=function(a,b,c,d,h,i){var j=c<d-e,m=d+e+c<b,l=d-e-c;d+=e;if(k&&m)f[a]=d;else if(!k&&j)f[a]=l;else if(j)f[a]=G(i-c,l-g<0?l:l-g);else if(m)f[a]=w(h,d+g+c>b?d:
d+g);else return!1},m=function(a,b,c,d){var g;d<e||d>b-e?g=!1:f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2;return g},n=function(a){var b=i;i=j;j=b;h=a},p=function(){l.apply(0,i)!==!1?m.apply(0,j)===!1&&!h&&(n(!0),p()):h?f.x=f.y=0:(n(!0),p())};(d.inverted||this.len>1)&&n();p();return f},defaultFormatter:function(a){var b=this.points||ua(this),c;c=[a.tooltipFooterHeaderFormatter(b[0])];c=c.concat(a.bodyFormatter(b));c.push(a.tooltipFooterHeaderFormatter(b[0],!0));return c.join("")},refresh:function(a,b){var c=
this.chart,d=this.label,e=this.options,f,g,h,i={},j,k=[];j=e.formatter||this.defaultFormatter;var i=c.hoverPoints,l,m=this.shared;clearTimeout(this.hideTimer);this.followPointer=ua(a)[0].series.tooltipOptions.followPointer;h=this.getAnchor(a,b);f=h[0];g=h[1];m&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,i&&o(i,function(a){a.setState()}),o(a,function(a){a.setState("hover");k.push(a.getLabelConfig())}),i={x:a[0].category,y:a[0].y},i.points=k,this.len=k.length,a=a[0]):i=a.getLabelConfig();
j=j.call(i,this);i=a.series;this.distance=q(i.tooltipOptions.distance,16);j===!1?this.hide():(this.isHidden&&(Sa(d),d.attr("opacity",1).show()),d.attr({text:j}),l=e.borderColor||a.color||i.color||"#606060",d.attr({stroke:l}),this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow,h:h[2]||0}),this.isHidden=!1);O(c,"tooltipRefresh",{text:j,x:f+c.plotLeft,y:g+c.plotTop,borderColor:l})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,
c.width,c.height,a);this.move(y(c.x),y(c.y||0),a.plotX+b.plotLeft,a.plotY+b.plotTop)},getXDateFormat:function(a,b,c){var d,b=b.dateTimeLabelFormats,e=c&&c.closestPointRange,f,g={millisecond:15,second:12,minute:9,hour:6,day:3},h,i="millisecond";if(e){h=na("%m-%d %H:%M:%S.%L",a.x);for(f in M){if(e===M.week&&+na("%w",a.x)===c.options.startOfWeek&&h.substr(6)==="00:00:00.000"){f="week";break}if(M[f]>e){f=i;break}if(g[f]&&h.substr(g[f])!=="01-01 00:00:00.000".substr(g[f]))break;f!=="week"&&(i=f)}f&&(d=
b[f])}else d=b.day;return d||b.year},tooltipFooterHeaderFormatter:function(a,b){var c=b?"footer":"header",d=a.series,e=d.tooltipOptions,f=e.xDateFormat,g=d.xAxis,h=g&&g.options.type==="datetime"&&C(a.key),c=e[c+"Format"];h&&!f&&(f=this.getXDateFormat(a,e,g));h&&f&&(c=c.replace("{point.key}","{point.key:"+f+"}"));return La(c,{point:a,series:d})},bodyFormatter:function(a){return ta(a,function(a){var c=a.series.tooltipOptions;return(c.pointFormatter||a.point.tooltipFormatter).call(a.point,c.pointFormat)})}};
var oa;cb=H&&H.documentElement.ontouchstart!==t;var Ya=B.Pointer=function(a,b){this.init(a,b)};Ya.prototype={init:function(a,b){var c=b.chart,d=c.events,e=qa?"":c.zoomType,c=a.inverted,f;this.options=b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};if(B.Tooltip&&b.tooltip.enabled)a.tooltip=new Lb(a,b.tooltip),this.followTouchMove=q(b.tooltip.followTouchMove,
!0);this.setDOMEvents()},normalize:function(a,b){var c,d,a=a||L.event;if(!a.target)a.target=a.srcElement;d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;if(!b)this.chartPosition=b=Jb(this.chart.container);d.pageX===t?(c=w(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return A(a,{chartX:y(c),chartY:y(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};o(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":
"chartY"])})});return b},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e=d?d.shared:!1,f=b.hoverPoint,g=b.hoverSeries,h,i=[Number.MAX_VALUE,Number.MAX_VALUE],j,k,l=[],m=[],n;if(!e&&!g)for(h=0;h<c.length;h++)if(c[h].directTouch||!c[h].options.stickyTracking)c=[];g&&(e?g.noSharedTooltip:g.directTouch)&&f?m=[f]:(o(c,function(b){j=b.noSharedTooltip&&e;k=!e&&b.directTouch;b.visible&&!j&&!k&&q(b.options.enableMouseTracking,!0)&&(n=b.searchPoint(a,!j&&b.kdDimensions===1))&&l.push(n)}),
o(l,function(a){a&&o(["dist","distX"],function(b,c){if(C(a[b])){var d=a[b]===i[c]&&a.series.group.zIndex>=m[c].series.group.zIndex;if(a[b]<i[c]||d)i[c]=a[b],m[c]=a}})}));if(e)for(h=l.length;h--;)(l[h].clientX!==m[1].clientX||l[h].series.noSharedTooltip)&&l.splice(h,1);if(m[0]&&(m[0]!==this.prevKDPoint||d&&d.isHidden))if(e&&!m[0].series.noSharedTooltip)l.length&&d&&d.refresh(l,a),o(l,function(b){b.onMouseOver(a,b!==(g&&g.directTouch&&f||m[0]))}),this.prevKDPoint=m[1];else{d&&d.refresh(m[0],a);if(!g||
!g.directTouch)m[0].onMouseOver(a);this.prevKDPoint=m[0]}else c=g&&g.tooltipOptions.followPointer,d&&c&&!d.isHidden&&(c=d.getAnchor([{}],a),d.updatePosition({plotX:c[0],plotY:c[1]}));if(!this._onDocumentMouseMove)this._onDocumentMouseMove=function(a){if($[oa])$[oa].pointer.onDocumentMouseMove(a)},E(H,"mousemove",this._onDocumentMouseMove);o(e?l:[q(f,m[1])],function(c){o(b.axes,function(b){(!c||c.series[b.coll]===b)&&b.drawCrosshair(a,c)})})},reset:function(a,b){var c=this.chart,d=c.hoverSeries,e=
c.hoverPoint,f=c.hoverPoints,g=c.tooltip,h=g&&g.shared?f:e;a&&h&&o(ua(h),function(b){b.series.isCartesian&&b.plotX===void 0&&(a=!1)});if(a)g&&h&&(g.refresh(h),e&&(e.setState(e.state,!0),o(c.axes,function(a){q(a.crosshair&&a.crosshair.snap,!0)?a.drawCrosshair(null,e):a.hideCrosshair()})));else{if(e)e.onMouseOut();f&&o(f,function(a){a.setState()});if(d)d.onMouseOut();g&&g.hide(b);if(this._onDocumentMouseMove)T(H,"mousemove",this._onDocumentMouseMove),this._onDocumentMouseMove=null;o(c.axes,function(a){a.hideCrosshair()});
this.hoverX=c.hoverPoints=c.hoverPoint=null}},scaleGroups:function(a,b){var c=this.chart,d;o(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=
this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,h=b.plotLeft,i=b.plotTop,j=b.plotWidth,k=b.plotHeight,l,m=this.selectionMarker,n=this.mouseDownX,p=this.mouseDownY,r=c.panKey&&a[c.panKey+"Key"];if(!m||!m.touch)if(d<h?d=h:d>h+j&&(d=h+j),e<i?e=i:e>i+k&&(e=i+k),this.hasDragged=Math.sqrt(Math.pow(n-d,2)+Math.pow(p-e,2)),this.hasDragged>10){l=b.isInsidePlot(n-h,p-i);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&l&&!r&&!m)this.selectionMarker=m=b.renderer.rect(h,i,
f?1:j,g?1:k,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();m&&f&&(d-=n,m.attr({width:S(d),x:(d>0?0:d)+n}));m&&g&&(d=e-p,m.attr({height:S(d),y:(d>0?0:d)+p}));l&&!m&&c.panning&&b.pan(a,c.panning)}},drop:function(a){var b=this,c=this.chart,d=this.hasPinched;if(this.selectionMarker){var e={originalEvent:a,xAxis:[],yAxis:[]},f=this.selectionMarker,g=f.attr?f.attr("x"):f.x,h=f.attr?f.attr("y"):f.y,i=f.attr?f.attr("width"):f.width,j=f.attr?f.attr("height"):f.height,k;if(this.hasDragged||
d)o(c.axes,function(c){if(c.zoomEnabled&&v(c.min)&&(d||b[{xAxis:"zoomX",yAxis:"zoomY"}[c.coll]])){var f=c.horiz,n=a.type==="touchend"?c.minPixelPadding:0,p=c.toValue((f?g:h)+n),f=c.toValue((f?g+i:h+j)-n);e[c.coll].push({axis:c,min:G(p,f),max:w(p,f)});k=!0}}),k&&O(c,"selection",e,function(a){c.zoom(A(a,d?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();d&&this.scaleGroups()}if(c)N(c.container,{cursor:c._cursor}),c.cancelClick=this.hasDragged>10,c.mouseIsDown=this.hasDragged=
this.hasPinched=!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(a){$[oa]&&$[oa].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,a=this.normalize(a,c);c&&!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&this.reset()},onContainerMouseLeave:function(a){var b=$[oa];if(b&&(a.relatedTarget||a.toElement))b.pointer.reset(),
b.pointer.chartPosition=null},onContainerMouseMove:function(a){var b=this.chart;if(!v(oa)||!$[oa]||!$[oa].mouseIsDown)oa=b.index;a=this.normalize(a);a.returnValue=!1;b.mouseIsDown==="mousedown"&&this.drag(a);(this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop))&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=X(a,"class")){if(c.indexOf(b)!==-1)return!0;if(c.indexOf("highcharts-container")!==-1)return!1}a=a.parentNode}},
onTrackerMouseOut:function(a){var b=this.chart.hoverSeries,a=a.relatedTarget||a.toElement;if(b&&a&&!b.options.stickyTracking&&!this.inClass(a,"highcharts-tooltip")&&!this.inClass(a,"highcharts-series-"+b.index))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,a=this.normalize(a);b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(O(c.series,"click",A(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(A(a,this.getCoordinates(a)),
b.isInsidePlot(a.chartX-d,a.chartY-e)&&O(b,"click",a)))},setDOMEvents:function(){var a=this,b=a.chart.container;b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};E(b,"mouseleave",a.onContainerMouseLeave);kb===1&&E(H,"mouseup",a.onDocumentMouseUp);if(cb)b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},kb===1&&E(H,"touchend",a.onDocumentTouchEnd)},
destroy:function(){var a;T(this.chart.container,"mouseleave",this.onContainerMouseLeave);kb||(T(H,"mouseup",this.onDocumentMouseUp),T(H,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};A(B.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,b,c,d,e,f,g,h){var i=
this.chart,j=a?"x":"y",k=a?"X":"Y",l="chart"+k,m=a?"width":"height",n=i["plot"+(a?"Left":"Top")],p,r,s=h||1,q=i.inverted,o=i.bounds[a?"h":"v"],x=b.length===1,D=b[0][l],v=c[0][l],w=!x&&b[1][l],y=!x&&c[1][l],t,c=function(){!x&&S(D-w)>20&&(s=h||S(v-y)/S(D-w));r=(n-v)/s+D;p=i["plot"+(a?"Width":"Height")]/s};c();b=r;b<o.min?(b=o.min,t=!0):b+p>o.max&&(b=o.max-p,t=!0);t?(v-=0.8*(v-g[j][0]),x||(y-=0.8*(y-g[j][1])),c()):g[j]=[v,y];q||(f[j]=r-n,f[m]=p);f=q?1/s:s;e[m]=p;e[j]=b;d[q?a?"scaleY":"scaleX":"scale"+
k]=s;d["translate"+k]=f*n+(v-f*D)},pinch:function(a){var b=this,c=b.chart,d=b.pinchDown,e=a.touches,f=e.length,g=b.lastValidTouch,h=b.hasZoom,i=b.selectionMarker,j={},k=f===1&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||b.runChartClick),l={};if(f>1)b.initiated=!0;h&&b.initiated&&!k&&a.preventDefault();ta(e,function(a){return b.normalize(a)});if(a.type==="touchstart")o(e,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),g.x=[d[0].chartX,d[1]&&d[1].chartX],g.y=[d[0].chartY,d[1]&&
d[1].chartY],o(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,e=a.toPixels(q(a.options.min,a.dataMin)),f=a.toPixels(q(a.options.max,a.dataMax)),g=G(e,f),e=w(e,f);b.min=G(a.pos,g-d);b.max=w(a.pos+a.len,e+d)}}),b.res=!0;else if(d.length){if(!i)b.selectionMarker=i=A({destroy:ra,touch:!0},c.plotBox);b.pinchTranslate(d,e,j,i,l,g);b.hasPinched=h;b.scaleGroups(j,l);if(!h&&b.followTouchMove&&f===1)this.runPointActions(b.normalize(a));else if(b.res)b.res=!1,this.reset(!1,
0)}},touch:function(a,b){var c=this.chart,d;oa=c.index;if(a.touches.length===1)if(a=this.normalize(a),c.isInsidePlot(a.chartX-c.plotLeft,a.chartY-c.plotTop)&&!c.openMenu){b&&this.runPointActions(a);if(a.type==="touchmove")c=this.pinchDown,d=c[0]?Math.sqrt(Math.pow(c[0].chartX-a.chartX,2)+Math.pow(c[0].chartY-a.chartY,2))>=4:!1;q(d,!0)&&this.pinch(a)}else b&&this.reset();else a.touches.length===2&&this.pinch(a)},onContainerTouchStart:function(a){this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},
onDocumentTouchEnd:function(a){$[oa]&&$[oa].pointer.drop(a)}});if(L.PointerEvent||L.MSPointerEvent){var Ga={},Mb=!!L.PointerEvent,ac=function(){var a,b=[];b.item=function(a){return this[a]};for(a in Ga)Ga.hasOwnProperty(a)&&b.push({pageX:Ga[a].pageX,pageY:Ga[a].pageY,target:Ga[a].target});return b},Nb=function(a,b,c,d){if((a.pointerType==="touch"||a.pointerType===a.MSPOINTER_TYPE_TOUCH)&&$[oa])d(a),d=$[oa].pointer,d[b]({type:c,target:a.currentTarget,preventDefault:ra,touches:ac()})};A(Ya.prototype,
{onContainerPointerDown:function(a){Nb(a,"onContainerTouchStart","touchstart",function(a){Ga[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){Nb(a,"onContainerTouchMove","touchmove",function(a){Ga[a.pointerId]={pageX:a.pageX,pageY:a.pageY};if(!Ga[a.pointerId].target)Ga[a.pointerId].target=a.currentTarget})},onDocumentPointerUp:function(a){Nb(a,"onDocumentTouchEnd","touchend",function(a){delete Ga[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,
Mb?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,Mb?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(H,Mb?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});U(Ya.prototype,"init",function(a,b,c){a.call(this,b,c);this.hasZoom&&N(b.container,{"-ms-touch-action":"none","touch-action":"none"})});U(Ya.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(E)});U(Ya.prototype,"destroy",function(a){this.batchMSEvents(T);
a.call(this)})}var ub=B.Legend=function(a,b){this.init(a,b)};ub.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=b.itemMarginTop||0;this.options=b;if(b.enabled)c.itemStyle=d,c.itemHiddenStyle=z(d,b.itemHiddenStyle),c.itemMarginTop=e,c.padding=d=q(b.padding,8),c.initialItemX=d,c.initialItemY=d-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.symbolWidth=q(b.symbolWidth,16),c.pages=[],c.render(),E(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,
d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,i={fill:h},j;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(j in i.stroke=h,g=a.convertAttribs(g),g)d=g[j],d!==t&&(i[j]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;(a=a.legendGroup)&&a.element&&a.translate(b?e:this.legendWidth-
e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;o(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&Ua(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();if(a)this.group=a.destroy()},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight,e=this.titleHeight;if(b)c=b.translateY,o(this.allItems,function(f){var g=f.checkbox,h;g&&(h=c+e+g.y+(a||0)+3,N(g,
{left:b.translateX+f.checkboxOffset+g.x-20+"px",top:h+"px",display:h>c-6&&h<c+d-6?"":"none"}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);a=this.title.getBBox();c=a.height;this.offsetWidth=a.width;this.contentGroup.attr({translateY:c})}this.titleHeight=c},setText:function(a){var b=this.options;a.legendItem.attr({text:b.labelFormat?
La(b.labelFormat,a):b.labelFormatter.call(a)})},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,e=d.layout==="horizontal",f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,i=this.itemHiddenStyle,j=this.padding,k=e?q(d.itemDistance,20):0,l=!d.rtl,m=d.width,n=d.itemMarginBottom||0,p=this.itemMarginTop,r=this.initialItemX,s=a.legendItem,o=a.series&&a.series.drawLegendSymbol?a.series:a,u=o.options,u=this.createCheckboxForItem&&u&&u.showCheckbox,x=d.useHTML;if(!s){a.legendGroup=
c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup);a.legendItem=s=c.text("",l?f+g:-g,this.baseline||0,x).css(z(a.visible?h:i)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup);if(!this.baseline)this.fontMetrics=c.fontMetrics(h.fontSize,s),this.baseline=this.fontMetrics.f+3+p,s.attr("y",this.baseline);o.drawLegendSymbol(this,a);this.setItemEvents&&this.setItemEvents(a,s,x,h,i);u&&this.createCheckboxForItem(a)}this.colorizeItem(a,a.visible);this.setText(a);c=s.getBBox();f=a.checkboxOffset=
d.itemWidth||a.legendItemWidth||f+g+c.width+k+(u?20:0);this.itemHeight=g=y(a.legendItemHeight||c.height);if(e&&this.itemX-r+f>(m||b.chartWidth-2*j-r-d.x))this.itemX=r,this.itemY+=p+this.lastLineHeight+n,this.lastLineHeight=0;this.maxItemWidth=w(this.maxItemWidth,f);this.lastItemY=p+this.itemY+n;this.lastLineHeight=w(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=p+g+n,this.lastLineHeight=g);this.offsetWidth=m||w((e?this.itemX-r-k:f)+j,this.offsetWidth)},
getAllItems:function(){var a=[];o(this.chart.series,function(b){var c=b.options;if(q(c.showInLegend,!v(c.linkedTo)?t:!1,!0))a=a.concat(b.legendItems||(c.legendType==="point"?b.data:b))});return a},adjustMargins:function(a,b){var c=this.chart,d=this.options,e=d.align.charAt(0)+d.verticalAlign.charAt(0)+d.layout.charAt(0);this.display&&!d.floating&&o([/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/],function(f,g){f.test(e)&&!v(a[g])&&(c[tb[g]]=w(c[tb[g]],c.legend[(g+1)%2?"legendHeight":
"legendWidth"]+[1,-1,-1,1][g]*d[g%2?"x":"y"]+q(d.margin,12)+b[g]))})},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,j=a.options,k=a.padding,l=j.borderWidth,m=j.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);a.renderTitle();e=a.getAllItems();nb(e,function(a,b){return(a.options&&a.options.legendIndex||
0)-(b.options&&b.options.legendIndex||0)});j.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;a.lastLineHeight=0;o(e,function(b){a.renderItem(b)});g=(j.width||a.offsetWidth)+k;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);h+=k;if(l||m){if(i){if(g>0&&h>0)i[i.isNew?"attr":"animate"](i.crisp({width:g,height:h})),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,j.borderRadius,l||0).attr({stroke:j.borderColor,"stroke-width":l||0,fill:m||"none"}).add(d).shadow(j.shadow),i.isNew=!0;i[f?
"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;o(e,function(b){a.positionItem(b)});f&&d.align(A({width:g,height:h},j),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h,i=this.clipRect,j=e.navigation,k=q(j.animation,!0),l=j.arrowSize||12,m=this.nav,n=this.pages,p=this.padding,r,s=this.allItems,F=function(a){i.attr({height:a});
if(b.contentGroup.div)b.contentGroup.div.style.clip="rect("+p+"px,9999px,"+(p+a)+"px,0)"};e.layout==="horizontal"&&(f/=2);g&&(f=G(f,g));n.length=0;if(a>f&&j.enabled!==!1){this.clipHeight=h=w(f-20-this.titleHeight-p,0);this.currentPage=q(this.currentPage,1);this.fullHeight=a;o(s,function(a,b){var c=a._legendItemPos[1],d=y(a.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>h&&(r||c)!==n[e-1])n.push(r||c),e++;b===s.length-1&&c+d-n[e-1]>h&&n.push(c);c!==r&&(r=c)});if(!i)i=b.clipRect=d.clipRect(0,
p,9999,0),b.contentGroup.clip(i);F(h);if(!m)this.nav=m=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,l,l).on("click",function(){b.scroll(-1,k)}).add(m),this.pager=d.text("",15,10).css(j.style).add(m),this.down=d.symbol("triangle-down",0,0,l,l).on("click",function(){b.scroll(1,k)}).add(m);b.scroll(0);a=f}else if(m)F(c.chartHeight),m.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,
f=this.clipHeight,g=this.options.navigation,h=g.activeColor,g=g.inactiveColor,i=this.pager,j=this.padding;e>d&&(e=d);if(e>0)b!==t&&$a(b,this.chart),this.nav.attr({translateX:j,translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:e===1?g:h}).css({cursor:e===1?"default":"pointer"}),i.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),
this.currentPage=e,this.positionCheckboxes(c)}};aa=B.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||a.fontMetrics.f;b.legendSymbol=this.chart.renderer.rect(0,a.baseline-c+1,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,d=a.symbolWidth,e=this.chart.renderer,f=this.legendGroup,a=a.baseline-y(a.fontMetrics.b*0.3),g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=
b.dashStyle;this.legendLine=e.path(["M",0,a,"L",d,a]).attr(g).add(f)}if(c&&c.enabled!==!1)b=c.radius,this.legendSymbol=c=e.symbol(this.symbol,d/2-b,a-b,2*b,2*b,c).add(f),c.isMarker=!0}};(/Trident\/7\.0/.test(Na)||Wa)&&U(ub.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,b)};d();setTimeout(d)});var Ba=B.Chart=function(){this.getArgs.apply(this,arguments)};B.chart=function(a,b,c){return new Ba(a,b,c)};Ba.prototype={callbacks:[],getArgs:function(){var a=[].slice.call(arguments);
if(Ca(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(a,b){var c,d=a.series;a.series=null;c=z(R,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",d);var e=d.events;this.bounds={h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=$.length;$.push(f);kb++;d.reflow!==!1&&E(f,"load",function(){f.initReflow()});
if(e)for(g in e)E(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=qa?!1:q(d.animation,!0);f.pointCount=f.colorCounter=f.symbolCounter=0;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=I[a.type||b.type||b.defaultSeriesType])||ga(17,!0);b=new b;b.init(this,a);return b},isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,i=this.hasCartesianSeries,
j=this.isDirtyBox,k=c.length,l=k,m=this.renderer,n=m.isHidden(),p=[];$a(a,this);n&&this.cloneRenderTo();for(this.layOutTitles();l--;)if(a=c[l],a.options.stacking&&(g=!0,a.isDirty)){h=!0;break}if(h)for(l=k;l--;)if(a=c[l],a.options.stacking)a.isDirty=!0;o(c,function(a){a.isDirty&&a.options.legendType==="point"&&(a.updateTotals&&a.updateTotals(),f=!0);a.isDirtyData&&O(a,"updatedData")});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;g&&this.getStacks();if(i&&!this.isResizing)this.maxTicks=
null,o(b,function(a){a.setScale()});this.getMargins();i&&(o(b,function(a){a.isDirty&&(j=!0)}),o(b,function(a){var b=a.min+","+a.max;if(a.extKey!==b)a.extKey=b,p.push(function(){O(a,"afterSetExtremes",A(a.eventArgs,a.getExtremes()));delete a.eventArgs});(j||g)&&a.redraw()}));j&&this.drawChartBox();o(c,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);m.draw();O(this,"redraw");n&&this.cloneRenderTo(!0);o(p,function(a){a.call()})},get:function(a){var b=this.axes,
c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=ua(b.xAxis||{}),b=b.yAxis=ua(b.yAxis||{});o(c,function(a,b){a.index=b;a.isX=!0});o(b,function(a,b){a.index=b});c=c.concat(b);o(c,function(b){new J(a,b)})},getSelectedPoints:function(){var a=[];o(this.series,
function(b){a=a.concat(Fa(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Fa(this.series,function(a){return a.selected})},setTitle:function(a,b,c){var g;var d=this,e=d.options,f;f=e.title=z(e.title,a);g=e.subtitle=z(e.subtitle,b),e=g;o([["title",a,f],["subtitle",b,e]],function(a){var b=a[0],c=d[b],e=a[1],a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+b,zIndex:a.zIndex||
4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.renderer,h=this.spacingBox;if(c&&(c.css({width:(f.width||h.width+f.widthAdjust)+"px"}).align(A({y:g.fontMetrics(f.style.fontSize,c).b-3},f),!1,h),!f.floating&&!f.verticalAlign))b=c.getBBox().height;d&&(d.css({width:(e.width||h.width+e.widthAdjust)+"px"}).align(A({y:b+(f.margin-13)+g.fontMetrics(e.style.fontSize,c).b},e),!1,h),!e.floating&&!e.verticalAlign&&
(b=Ea(b+d.getBBox().height)));c=this.titleOffset!==b;this.titleOffset=b;if(!this.isDirtyBox&&c)this.isDirtyBox=c,this.hasRendered&&q(a,!0)&&this.isDirtyBox&&this.redraw()},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;if(!v(b))this.containerWidth=wa(c,"width");if(!v(a))this.containerHeight=wa(c,"height");this.chartWidth=w(0,b||this.containerWidth||600);this.chartHeight=w(0,q(a,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=
this.renderToClone,c=this.container;a?b&&(this.renderTo.appendChild(c),Ua(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),N(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block","important"),H.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options,c=b.chart,d,e;a=this.renderTo;var f="highcharts-"+Ib++;if(!a)this.renderTo=
a=c.renderTo;if(Ca(a))this.renderTo=a=H.getElementById(a);a||ga(13,!0);d=K(X(a,"data-highcharts-chart"));C(d)&&$[d]&&$[d].hasRendered&&$[d].destroy();X(a,"data-highcharts-chart",this.index);a.innerHTML="";!c.skipClone&&!a.offsetWidth&&this.cloneRenderTo();this.getChartSize();d=this.chartWidth;e=this.chartHeight;this.container=a=fa(Va,{className:"highcharts-container"+(c.className?" "+c.className:""),id:f},A({position:"relative",overflow:"hidden",width:d+"px",height:e+"px",textAlign:"left",lineHeight:"normal",
zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},c.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=new (B[c.renderer]||Xa)(a,d,e,c.style,c.forExport,b.exporting&&b.exporting.allowHTML);qa&&this.renderer.create(this,a,d,e);this.renderer.chartIndex=this.index},getMargins:function(a){var b=this.spacing,c=this.margin,d=this.titleOffset;this.resetMargins();if(d&&!v(c[0]))this.plotTop=w(this.plotTop,d+this.options.title.margin+b[0]);this.legend.adjustMargins(c,b);this.extraBottomMargin&&
(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],c=a.margin;a.hasCartesianSeries&&o(a.axes,function(a){a.visible&&a.getOffset()});o(tb,function(d,e){v(c[e])||(a[d]+=b[e])});a.setChartSize()},reflow:function(a){var b=this,c=b.options.chart,d=b.renderTo,e=c.width||wa(d,"width"),f=c.height||wa(d,"height"),c=a?a.target:L;if(!b.hasUserSize&&!b.isPrinting&&e&&f&&(c===
L||c===H)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),b.reflowTimeout=Za(function(){if(b.container)b.setSize(e,f,!1),b.hasUserSize=null},a?100:0);b.containerWidth=e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};E(L,"resize",b);E(a,"destroy",function(){T(L,"resize",b)})},setSize:function(a,b,c){var d=this,e,f,g=d.renderer;d.isResizing+=1;$a(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(v(a))d.chartWidth=e=w(0,
y(a)),d.hasUserSize=!!e;if(v(b))d.chartHeight=f=w(0,y(b));a=g.globalAnimation;(a?db:N)(d.container,{width:e+"px",height:f+"px"},a);d.setChartSize(!0);g.setSize(e,f,c);d.maxTicks=null;o(d.axes,function(a){a.isDirty=!0;a.setScale()});o(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;O(d,"resize");Za(function(){d&&O(d,"endResize",null,function(){d.isResizing-=1})},gb(a).duration)},setChartSize:function(a){var b=
this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,i,j,k,l;this.plotLeft=i=y(this.plotLeft);this.plotTop=j=y(this.plotTop);this.plotWidth=k=w(0,y(d-i-this.marginRight));this.plotHeight=l=w(0,y(e-j-this.marginBottom));this.plotSizeX=b?l:k;this.plotSizeY=b?k:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:i,y:j,width:k,height:l};
d=2*V(this.plotBorderWidth/2);b=Ea(w(d,h[3])/2);c=Ea(w(d,h[0])/2);this.clipBox={x:b,y:c,width:V(this.plotSizeX-w(d,h[1])/2-b),height:w(0,V(this.plotSizeY-w(d,h[2])/2-c))};a||o(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},resetMargins:function(){var a=this;o(tb,function(b,c){a[b]=q(a.margin[c],a.spacing[c])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,
f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,j=a.backgroundColor,k=a.plotBackgroundColor,l=a.plotBackgroundImage,m=a.plotBorderWidth||0,n,p=this.plotLeft,r=this.plotTop,s=this.plotWidth,q=this.plotHeight,o=this.plotBox,x=this.clipRect,D=this.clipBox;n=i+(a.shadow?8:0);if(i||j)if(e)e.animate(e.crisp({width:c-n,height:d-n}));else{e={fill:j||"none"};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(n/2,n/2,c-n,d-n,a.borderRadius,i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)}if(k)f?
f.animate(o):this.plotBackground=b.rect(p,r,s,q,0).attr({fill:k}).add().shadow(a.plotShadow);if(l)h?h.animate(o):this.plotBGImage=b.image(l,p,r,s,q).add();x?x.animate({width:D.width,height:D.height}):this.clipRect=b.clipRect(D);if(m)g?(g.strokeWidth=-m,g.animate(g.crisp({x:p,y:r,width:s,height:q}))):this.plotBorder=b.rect(p,r,s,q,0,-m).attr({stroke:a.plotBorderColor,"stroke-width":m,fill:"none",zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,
e,f;o(["inverted","angular","polar"],function(g){c=I[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];for(e=d&&d.length;!f&&e--;)(c=I[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;o(b,function(a){a.linkedSeries.length=0});o(b,function(b){var d=b.options.linkedTo;if(Ca(d)&&(d=d===":previous"?a.series[b.index-1]:a.get(d)))d.linkedSeries.push(b),b.linkedParent=d,b.visible=q(b.options.visible,d.options.visible,b.visible)})},renderSeries:function(){o(this.series,
function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&o(b.items,function(c){var d=A(b.style,c.style),e=K(d.left)+a.plotLeft,f=K(d.top)+a.plotTop+12;delete d.left;delete d.top;a.renderer.text(c.html,e,f).attr({zIndex:2}).css(d).add()})},render:function(){var a=this.axes,b=this.renderer,c=this.options,d,e,f,g;this.setTitle();this.legend=new ub(this,c.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();d=this.plotWidth;e=this.plotHeight-=
21;o(a,function(a){a.setScale()});this.getAxisMargins();f=d/this.plotWidth>1.1;g=e/this.plotHeight>1.05;if(f||g)this.maxTicks=null,o(a,function(a){(a.horiz&&f||!a.horiz&&g)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&o(a,function(a){a.visible&&a.render()});if(!this.seriesGroup)this.seriesGroup=b.g("series-group").attr({zIndex:3}).add();this.renderSeries();this.renderLabels();this.showCredits(c.credits);this.hasRendered=!0},showCredits:function(a){if(a.enabled&&
!this.credits)this.credits=this.renderer.text(a.text,0,0).on("click",function(){if(a.href)L.location.href=a.href}).attr({align:a.position.align,zIndex:8}).css(a.style).add().align(a.position)},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;O(a,"destroy");$[a.index]=t;kb--;a.renderTo.removeAttribute("data-highcharts-chart");T(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();o("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),
function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",T(d),f&&Ua(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!ja&&L==L.top&&H.readyState!=="complete"||qa&&!L.canvg?(qa?Wb.push(function(){a.firstRender()},a.options.global.canvasToolsURL):H.attachEvent("onreadystatechange",function(){H.detachEvent("onreadystatechange",a.firstRender);H.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options;if(a.isReadyToRender()){a.getContainer();
O(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();o(b.series||[],function(b){a.initSeries(b)});a.linkSeries();O(a,"beforeRender");if(B.Pointer)a.pointer=new Ya(a,b);a.render();a.renderer.draw();if(!a.renderer.imgCount&&a.onload)a.onload();a.cloneRenderTo(!0)}},onload:function(){var a=this;o([this.callback].concat(this.callbacks),function(b){b&&a.index!==void 0&&b.apply(a,[a])});O(a,"load");this.onload=null},splashArray:function(a,b){var c=b[a],c=ea(c)?c:[c,c,c,c];return[q(b[a+
"Top"],c[0]),q(b[a+"Right"],c[1]),q(b[a+"Bottom"],c[2]),q(b[a+"Left"],c[3])]}};var bc=B.CenteredSeriesMixin={getCenter:function(){var a=this.options,b=this.chart,c=2*(a.slicedOffset||0),d=b.plotWidth-2*c,b=b.plotHeight-2*c,e=a.center,e=[q(e[0],"50%"),q(e[1],"50%"),a.size||"100%",a.innerSize||0],f=G(d,b),g,h;for(g=0;g<4;++g)h=e[g],a=g<2||g===2&&/%$/.test(h),e[g]=(/%$/.test(h)?[d,b,f,e[2]][g]*parseFloat(h)/100:parseFloat(h))+(a?c:0);e[3]>e[2]&&(e[3]=e[2]);return e}},Ha=function(){};Ha.prototype={init:function(a,
b,c){this.series=a;this.color=a.color;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.options.pointValKey||c.pointValKey,a=Ha.prototype.optionsToObject.call(this,a);A(this,a);this.options=this.options?A(this.options,a):a;if(d)this.y=this[d];this.isNull=this.x===null||
this.y===null;if(this.x===void 0&&c)this.x=b===void 0?c.autoIncrement():b;return this},optionsToObject:function(a){var b={},c=this.series,d=c.options.keys,e=d||c.pointArrayMap||["y"],f=e.length,g=0,h=0;if(C(a)||a===null)b[e[0]]=a;else if(Ja(a)){if(!d&&a.length>f){c=typeof a[0];if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];g++}for(;h<f;){if(!d||a[g]!==void 0)b[e[h]]=a[g];g++;h++}}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},
destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;if(b&&(this.setState(),za(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)T(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,
y:this.y,color:this.color,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=q(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";o(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return La(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;
(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select&&d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});O(this,a,b,c)},visible:!0};var P=B.Series=function(){};P.prototype={isCartesian:!0,type:"line",pointClass:Ha,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x",
"y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return q(a.options.index,a._i)-q(b.options.index,b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();A(c,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(qa)b.animation=!1;e=b.events;for(d in e)E(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();o(c.parallelArrays,function(a){c[a+"Data"]=
[]});c.setData(b.data,!1);if(c.isCartesian)a.hasCartesianSeries=!0;f.push(c);c._i=f.length-1;nb(f,g);this.yAxis&&nb(this.yAxis.series,g);o(f,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;o(a.axisTypes||[],function(e){o(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==t&&b[e]===d.id||b[e]===t&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});!a[e]&&a.optionalAxis!==e&&ga(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,
d=arguments,e=C(b)?function(d){var e=d==="y"&&c.toYData?c.toYData(a):a[d];c[d+"Data"][b]=e}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))};o(c.parallelArrays,e)},autoIncrement:function(){var a=this.options,b=this.xIncrement,c,d=a.pointIntervalUnit,b=q(b,a.pointStart,0);this.pointInterval=c=q(this.pointInterval,a.pointInterval,1);d&&(a=new ba(b),d==="day"?a=+a[qb](a[ab]()+c):d==="month"?a=+a[Eb](a[hb]()+c):d==="year"&&(a=+a[Fb](a[ib]()+c)),c=a-b);this.xIncrement=
b+c;return b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},e=c[this.type];this.userOptions=a;c=z(e,c.series,a);this.tooltipOptions=z(R.tooltip,R.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);e.marker===null&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();if((c.negativeColor||c.negativeFillColor)&&!c.zones)a.push({value:c[this.zoneAxis+"Threshold"]||
c.threshold||0,color:c.negativeColor,fillColor:c.negativeFillColor});a.length&&v(a[a.length-1].value)&&a.push({color:this.color,fillColor:this.fillColor});return c},getCyclic:function(a,b,c){var d=this.userOptions,e="_"+a+"Index",f=a+"Counter";b||(v(d[e])?b=d[e]:(d[e]=b=this.chart[f]%c.length,this.chart[f]+=1),b=c[b]);this[a]=b},getColor:function(){this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||W[this.type].color,this.chart.options.colors)},getSymbol:function(){var a=
this.options.marker;this.getCyclic("symbol",a.symbol,this.chart.options.symbols);if(/^url/.test(this.symbol))a.radius=0},drawLegendSymbol:aa.drawLineMarker,setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,i=e.options,j=e.chart,k=null,l=e.xAxis,m=l&&!!l.categories,n=i.turboThreshold,p=this.xData,r=this.yData,s=(h=e.pointArrayMap)&&h.length,a=a||[];h=a.length;b=q(b,!0);if(d!==!1&&h&&g===h&&!e.cropped&&!e.hasGroupedData&&e.visible)o(a,function(a,b){f[b].update&&a!==i.data[b]&&f[b].update(a,
!1,null,!1)});else{e.xIncrement=null;e.colorCounter=0;o(this.parallelArrays,function(a){e[a+"Data"].length=0});if(n&&h>n){for(c=0;k===null&&c<h;)k=a[c],c++;if(C(k)){m=q(i.pointStart,0);k=q(i.pointInterval,1);for(c=0;c<h;c++)p[c]=m,r[c]=a[c],m+=k;e.xIncrement=m}else if(Ja(k))if(s)for(c=0;c<h;c++)k=a[c],p[c]=k[0],r[c]=k.slice(1,s+1);else for(c=0;c<h;c++)k=a[c],p[c]=k[0],r[c]=k[1];else ga(12)}else for(c=0;c<h;c++)if(a[c]!==t&&(k={series:e},e.pointClass.prototype.applyOptions.apply(k,[a[c]]),e.updateParallelArrays(k,
c),m&&v(k.name)))l.names[k.x]=k.name;Ca(r[0])&&ga(14,!0);e.data=[];e.options.data=e.userOptions.data=a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();if(l)l.minRange=l.userMinRange;e.isDirty=e.isDirtyData=j.isDirtyBox=!0;c=!1}i.legendType==="point"&&(this.processData(),this.generatePoints());b&&j.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,i,j=this.options;i=j.cropThreshold;var k=this.getExtremesFromAll||j.getExtremesFromAll,l=this.isCartesian,
j=h&&h.val2lin,m=h&&h.isLog,n,p;if(l&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(h)a=h.getExtremes(),n=a.min,p=a.max;if(l&&this.sorted&&!k&&(!i||d>i||this.forceCrop))if(b[d-1]<n||b[0]>p)b=[],c=[];else if(b[0]<n||b[d-1]>p)e=this.cropData(this.xData,this.yData,n,p),b=e.xData,c=e.yData,e=e.start,f=!0;for(i=b.length||1;--i;)d=m?j(b[i])-j(b[i-1]):b[i]-b[i-1],d>0&&(g===t||d<g)?g=d:d<0&&this.requireSorting&&ga(15);this.cropped=f;this.cropStart=e;this.processedXData=b;this.processedYData=
c;this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=q(this.cropShoulder,1),i;for(i=0;i<e;i++)if(a[i]>=c){f=w(0,i-h);break}for(c=i;c<e;c++)if(a[c]>d){g=c+h;break}return{xData:a.slice(f,g),yData:b.slice(f,g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,j=this.hasGroupedData,k,l=[],m;if(!b&&!j)b=[],b.length=a.length,b=this.data=b;for(m=0;m<g;m++)i=
h+m,j?(l[m]=(new f).init(this,[d[m]].concat(ua(e[m]))),l[m].dataGroup=this.groupMap[m]):(b[i]?k=b[i]:a[i]!==t&&(b[i]=k=(new f).init(this,a[i],d[m])),l[m]=k),l[m].index=i;if(b&&(g!==(c=b.length)||j))for(m=0;m<c;m++)if(m===h&&!j&&(m+=g),b[m])b[m].destroyElements(),b[m].plotX=t;this.data=b;this.points=l},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,i,j,k,l,a=a||this.stackedYData||this.processedYData||[];d=a.length;for(l=0;l<
d;l++)if(j=c[l],k=a[l],i=k!==null&&k!==t&&(!b.isLog||k.length||k>0),j=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(c[l+1]||j)>=g&&(c[l-1]||j)<=h,i&&j)if(i=k.length)for(;i--;)k[i]!==null&&(e[f++]=k[i]);else e[f++]=k;this.dataMin=Ma(e);this.dataMax=Da(e)},translate:function(){this.processedXData||this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i=a.pointPlacement,
j=i==="between"||C(i),k=a.threshold,l=a.startFromThreshold?k:0,m,n,p,r,s=Number.MAX_VALUE,a=0;a<g;a++){var o=f[a],u=o.x,x=o.y;n=o.low;var D=b&&e.stacks[(this.negStacks&&x<(l?0:k)?"-":"")+this.stackKey];if(e.isLog&&x!==null&&x<=0)o.y=x=null,ga(10);o.plotX=m=ka(G(w(-1E5,c.translate(u,0,0,0,1,i,this.type==="flags")),1E5));if(b&&this.visible&&!o.isNull&&D&&D[u])r=this.getStackIndicator(r,u,this.index),D=D[u],x=D.points[r.key],n=x[0],x=x[1],n===l&&(n=q(k,e.min)),e.isLog&&n<=0&&(n=null),o.total=o.stackTotal=
D.total,o.percentage=D.total&&o.y/D.total*100,o.stackY=x,D.setOffset(this.pointXOffset||0,this.barW||0);o.yBottom=v(n)?e.translate(n,0,1,0,1):null;h&&(x=this.modifyValue(x,o));o.plotY=n=typeof x==="number"&&x!==Infinity?G(w(-1E5,e.translate(x,0,1,0,1)),1E5):t;o.isInside=n!==t&&n>=0&&n<=e.len&&m>=0&&m<=c.len;o.clientX=j?c.translate(u,0,0,0,1):m;o.negative=o.y<(k||0);o.category=d&&d[o.x]!==t?d[o.x]:o.x;o.isNull||(p!==void 0&&(s=G(s,S(m-p))),p=m)}this.closestPointRangePx=s},getValidPoints:function(a,
b){var c=this.chart;return Fa(a||this.points||[],function(a){return b&&!c.isInsidePlot(a.plotX,a.plotY,c.inverted)?!1:!a.isNull})},setClip:function(a){var b=this.chart,c=this.options,d=b.renderer,e=b.inverted,f=this.clipBox,g=f||b.clipBox,h=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,g.height,c.xAxis,c.yAxis].join(","),i=b[h],j=b[h+"m"];if(!i){if(a)g.width=0,b[h+"m"]=j=d.clipRect(-99,e?-b.plotLeft:-b.plotTop,99,e?b.chartWidth:b.chartHeight);b[h]=i=d.clipRect(g)}a&&(i.count+=1);if(c.clip!==
!1)this.group.clip(a||f?i:b.clipRect),this.markerGroup.clip(j),this.sharedClipKey=h;a||(i.count-=1,i.count<=0&&h&&b[h]&&(f||(b[h]=b[h].destroy()),b[h+"m"]&&(b[h+"m"]=b[h+"m"].destroy())))},animate:function(a){var b=this.chart,c=this.options.animation,d;if(c&&!ea(c))c=W[this.type].animation;a?this.setClip(c):(d=this.sharedClipKey,(a=b[d])&&a.animate({width:b.plotSizeX},c),b[d+"m"]&&b[d+"m"].animate({width:b.plotSizeX+99},c),this.animate=null)},afterAnimate:function(){this.setClip();O(this,"afterAnimate")},
drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,j,k,l=this.options.marker,m=this.pointAttr[""],n,p,r,s=this.markerGroup,o=q(l.enabled,this.xAxis.isRadial,this.closestPointRangePx>2*l.radius);if(l.enabled!==!1||this._hasPointMarkers)for(f=b.length;f--;)if(g=b[f],d=V(g.plotX),e=g.plotY,k=g.graphic,n=g.marker||{},p=!!g.marker,a=o&&n.enabled===t||n.enabled,r=g.isInside,a&&C(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""]||m,h=a.r,i=q(n.symbol,this.symbol),j=i.indexOf("url")===
0,k)k[r?"show":"hide"](!0).attr(a).animate(A({x:d-h,y:e-h},k.symbolName?{width:2*h,height:2*h}:{}));else{if(r&&(h>0||j))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h,p?n:l).attr(a).add(s)}else if(k)g.graphic=k.destroy()},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=q(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=W[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color,h=a.options.negativeColor,
i={stroke:g,fill:g},j=a.points||[],k,l=[],m,n=a.pointAttrToOptions;f=a.hasPointSpecificOptions;var p=c.lineColor,r=c.fillColor;k=b.turboThreshold;var s=a.zones,F=a.zoneAxis||"y",u,x;b.marker?(e.radius=e.radius||c.radius+e.radiusPlus,e.lineWidth=e.lineWidth||c.lineWidth+e.lineWidthPlus):(e.color=e.color||va(e.color||g).brighten(e.brightness).get(),e.negativeColor=e.negativeColor||va(e.negativeColor||h).brighten(e.brightness).get());l[""]=a.convertAttribs(c,i);o(["hover","select"],function(b){l[b]=
a.convertAttribs(d[b],l[""])});a.pointAttr=l;g=j.length;if(!k||g<k||f)for(;g--;){k=j[g];if((c=k.options&&k.options.marker||k.options)&&c.enabled===!1)c.radius=0;i=null;if(s.length){f=0;for(i=s[f];k[F]>=i.value;)i=s[++f];k.color=k.fillColor=i=q(i.color,a.color)}f=b.colorByPoint||k.color;if(k.options)for(x in n)v(c[n[x]])&&(f=!0);if(f){c=c||{};m=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker||k.negative&&!f.fillColor&&!e.fillColor)f[a.pointAttrToOptions.fill]=f.color||!k.options.color&&e[k.negative&&
h?"negativeColor":"color"]||va(k.color).brighten(f.brightness||e.brightness).get();u={color:k.color};if(!r)u.fillColor=k.color;if(!p)u.lineColor=k.color;c.hasOwnProperty("color")&&!c.color&&delete c.color;if(i&&!e.fillColor)f.fillColor=i;m[""]=a.convertAttribs(A(u,c),l[""]);m.hover=a.convertAttribs(d.hover,l.hover,m[""]);m.select=a.convertAttribs(d.select,l.select,m[""])}else m=l;k.pointAttr=m}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(Na),d,e=a.data||[],f,g,h;O(a,"destroy");
T(a);o(a.axisTypes||[],function(b){if(h=a[b])za(h.series,a),h.isDirty=h.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(d=e.length;d--;)(f=e[d])&&f.destroy&&f.destroy();a.points=null;clearTimeout(a.animationTimeout);for(g in a)a[g]instanceof Z&&!a[g].survive&&(d=c&&g==="group"?"hide":"destroy",a[g][d]());if(b.hoverSeries===a)b.hoverSeries=null;za(b.series,a);for(g in a)delete a[g]},getGraphPath:function(a,b,c){var d=this,e=d.options,f=e.step,g,h=[],i,a=a||d.points;(g=a.reversed)&&
a.reverse();(f={right:1,center:2}[f]||f&&3)&&g&&(f=4-f);e.connectNulls&&!b&&!c&&(a=this.getValidPoints(a));o(a,function(g,k){var l=g.plotX,m=g.plotY,n=a[k-1];if((g.leftCliff||n&&n.rightCliff)&&!c)i=!0;g.isNull&&!v(b)&&k>0?i=!e.connectNulls:g.isNull&&!b?i=!0:(k===0||i?n=["M",g.plotX,g.plotY]:d.getPointSpline?n=d.getPointSpline(a,g,k):f?(n=f===1?["L",n.plotX,m]:f===2?["L",(n.plotX+l)/2,n.plotY,"L",(n.plotX+l)/2,m]:["L",l,n.plotY],n.push("L",l,m)):n=["L",l,m],h.push.apply(h,n),i=!1)});return d.graphPath=
h},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color,b.dashStyle]],d=b.lineWidth,e=b.linecap!=="square",f=(this.gappedPath||this.getGraphPath).call(this),g=this.fillGraph&&this.color||"none";o(this.zones,function(d,e){c.push(["zoneGraph"+e,d.color||a.color,d.dashStyle||b.dashStyle])});o(c,function(c,i){var j=c[0],k=a[j];if(k)k.animate({d:f});else if((d||g)&&f.length)k={stroke:c[1],"stroke-width":d,fill:g,zIndex:1},c[2]?k.dashstyle=c[2]:e&&(k["stroke-linecap"]=k["stroke-linejoin"]=
"round"),a[j]=a.chart.renderer.path(f).attr(k).add(a.group).shadow(i<2&&b.shadow)})},applyZones:function(){var a=this,b=this.chart,c=b.renderer,d=this.zones,e,f,g=this.clips||[],h,i=this.graph,j=this.area,k=w(b.chartWidth,b.chartHeight),l=this[(this.zoneAxis||"y")+"Axis"],m,n=l.reversed,p=b.inverted,r=l.horiz,s,F,u,x=!1;if(d.length&&(i||j)&&l.min!==t)i&&i.hide(),j&&j.hide(),m=l.getExtremes(),o(d,function(d,o){e=n?r?b.plotWidth:0:r?0:l.toPixels(m.min);e=G(w(q(f,e),0),k);f=G(w(y(l.toPixels(q(d.value,
m.max),!0)),0),k);x&&(e=f=l.toPixels(m.max));s=Math.abs(e-f);F=G(e,f);u=w(e,f);if(l.isXAxis){if(h={x:p?u:F,y:0,width:s,height:k},!r)h.x=b.plotHeight-h.x}else if(h={x:0,y:p?u:F,width:k,height:s},r)h.y=b.plotWidth-h.y;b.inverted&&c.isVML&&(h=l.isXAxis?{x:0,y:n?F:u,height:h.width,width:b.chartWidth}:{x:h.y-b.plotLeft-b.spacingBox.x,y:0,width:h.height,height:b.chartHeight});g[o]?g[o].animate(h):(g[o]=c.clipRect(h),i&&a["zoneGraph"+o].clip(g[o]),j&&a["zoneArea"+o].clip(g[o]));x=d.value>m.max}),this.clips=
g},invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};o(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)E(c,"resize",a),E(b,"destroy",function(){T(c,"resize",a)}),a(),b.invertGroups=a},plotGroup:function(a,b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({zIndex:d||0.1}).add(e),f.addClass("highcharts-series-"+this.index));f.attr({visibility:c})[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=
this.chart,b=this.xAxis,c=this.yAxis;if(a.inverted)b=c,c=this.xAxis;return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=!!a.animate&&b.renderer.isSVG&&gb(d.animation).duration,f=a.visible?"inherit":"hidden",g=d.zIndex,h=a.hasRendered,i=b.seriesGroup;c=a.plotGroup("group","series",f,g,i);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,i);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:
!1;a.drawGraph&&(a.drawGraph(),a.applyZones());o(a.points,function(a){a.redraw&&a.redraw()});a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&a.options.enableMouseTracking!==!1&&a.drawTracker();b.inverted&&a.invertGroups();d.clip!==!1&&!a.sharedClipKey&&!h&&c.clip(b.clipRect);e&&a.animate();if(!h)a.animationTimeout=Za(function(){a.afterAnimate()},e);a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,c=this.group,
d=this.xAxis,e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:q(d&&d.left,a.plotLeft),translateY:q(e&&e.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree},kdDimensions:1,kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,d=this.yAxis,e=this.chart.inverted;return this.searchKDTree({clientX:e?c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:e?d.len-a.chartX+d.pos:a.chartY-d.pos},b)},buildKDTree:function(){function a(c,
e,f){var g,h;if(h=c&&c.length)return g=b.kdAxisArray[e%f],c.sort(function(a,b){return a[g]-b[g]}),h=Math.floor(h/2),{point:c[h],left:a(c.slice(0,h),e+1,f),right:a(c.slice(h+1),e+1,f)}}var b=this,c=b.kdDimensions;delete b.kdTree;Za(function(){b.kdTree=a(b.getValidPoints(null,!b.directTouch),c,c)},b.options.kdNow?0:1)},searchKDTree:function(a,b){function c(a,b,j,k){var l=b.point,m=d.kdAxisArray[j%k],n,p,r=l;p=v(a[e])&&v(l[e])?Math.pow(a[e]-l[e],2):null;n=v(a[f])&&v(l[f])?Math.pow(a[f]-l[f],2):null;
n=(p||0)+(n||0);l.dist=v(n)?Math.sqrt(n):Number.MAX_VALUE;l.distX=v(p)?Math.sqrt(p):Number.MAX_VALUE;m=a[m]-l[m];n=m<0?"left":"right";p=m<0?"right":"left";b[n]&&(n=c(a,b[n],j+1,k),r=n[g]<r[g]?n:l);b[p]&&Math.sqrt(m*m)<r[g]&&(a=c(a,b[p],j+1,k),r=a[g]<r[g]?a:r);return r}var d=this,e=this.kdAxisArray[0],f=this.kdAxisArray[1],g=b?"distX":"dist";this.kdTree||this.buildKDTree();if(this.kdTree)return c(a,this.kdTree,this.kdDimensions,this.kdDimensions)}};Tb.prototype={destroy:function(){Pa(this,this.axis)},
render:function(a){var b=this.options,c=b.format,c=c?La(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,null,null,b.useHTML).css(b.style).attr({align:this.textAlign,rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=c.reversed,f=this.isNegative&&!f||!this.isNegative&&f,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=S(g-c),h=d.xAxis[0].translate(this.x)+
a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[this.options.crop===!1||d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};Ba.prototype.getStacks=function(){var a=this;o(a.yAxis,function(a){if(a.stacks&&a.hasVisibleSeries)a.oldStacks=a.stacks});o(a.series,function(b){if(b.options.stacking&&(b.visible===!0||a.options.chart.ignoreHiddenSeries===!1))b.stackKey=b.type+q(b.options.stack,"")})};J.prototype.buildStacks=
function(){var a=this.series,b,c=q(this.options.reversedStacks,!0),d=a.length,e;if(!this.isXAxis){this.usePercentage=!1;for(e=d;e--;)a[c?e:d-e-1].setStackedPoints();for(e=d;e--;)b=a[c?e:d-e-1],b.setStackCliffs&&b.setStackCliffs();if(this.usePercentage)for(e=0;e<d;e++)a[e].setPercentStacks()}};J.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;if(!f)this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();f.translate(a.plotLeft,
a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};J.prototype.resetStacks=function(){var a=this.stacks,b,c;if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].touched<this.stacksTouched?(a[b][c].destroy(),delete a[b][c]):(a[b][c].total=null,a[b][c].cum=0)};J.prototype.cleanStacks=function(){var a,b,c;if(!this.isXAxis){if(this.oldStacks)a=this.stacks=this.oldStacks;for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total}};P.prototype.setStackedPoints=function(){if(this.options.stacking&&!(this.visible!==
!0&&this.chart.options.chart.ignoreHiddenSeries!==!1)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.startFromThreshold?f:0,h=e.stack,e=e.stacking,i=this.stackKey,j="-"+i,k=this.negStacks,l=this.yAxis,m=l.stacks,n=l.oldStacks,p,r,s,o,u,x,D;l.stacksTouched+=1;for(u=0;u<d;u++){x=a[u];D=b[u];p=this.getStackIndicator(p,x,this.index);o=p.key;s=(r=k&&D<(g?0:f))?j:i;m[s]||(m[s]={});if(!m[s][x])n[s]&&n[s][x]?(m[s][x]=n[s][x],m[s][x].total=null):m[s][x]=new Tb(l,
l.options.stackLabels,r,x,h);s=m[s][x];if(D!==null)s.points[o]=s.points[this.index]=[q(s.cum,g)],s.touched=l.stacksTouched,p.index>0&&this.singleStacks===!1&&(s.points[o][0]=s.points[this.index+","+x+",0"][0]);e==="percent"?(r=r?i:j,k&&m[r]&&m[r][x]?(r=m[r][x],s.total=r.total=w(r.total,s.total)+S(D)||0):s.total=ka(s.total+(S(D)||0))):s.total=ka(s.total+(D||0));s.cum=q(s.cum,g)+(D||0);if(D!==null)s.points[o].push(s.cum),c[u]=s.cum}if(e==="percent")l.usePercentage=!0;this.stackedYData=c;l.oldStacks=
{}}};P.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData,e;o([b,"-"+b],function(b){var f;for(var g=d.length,h,i;g--;)if(h=d[g],e=a.getStackIndicator(e,h,a.index),f=(i=c[b]&&c[b][h])&&i.points[e.key],h=f)i=i.total?100/i.total:0,h[0]=ka(h[0]*i),h[1]=ka(h[1]*i),a.stackedYData[g]=h[1]})};P.prototype.getStackIndicator=function(a,b,c){!v(a)||a.x!==b?a={x:b,index:0}:a.index++;a.key=[c,b,a.index].join(",");return a};A(Ba.prototype,{addSeries:function(a,b,c){var d,
e=this;a&&(b=q(b,!0),O(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options,a=z(a,{index:this[e].length,isX:b});new J(this,a);f[e]=ua(f[e]||{});f[e].push(a);q(c,!0)&&this.redraw(d)},showLoading:function(a){var b=this,c=b.options,d=b.loadingDiv,e=c.loading,f=function(){d&&N(d,{left:b.plotLeft+"px",top:b.plotTop+"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};if(!d)b.loadingDiv=
d=fa(Va,{className:"highcharts-loading"},A(e.style,{zIndex:10,display:"none"}),b.container),b.loadingSpan=fa("span",null,e.labelStyle,d),E(b,"redraw",f);b.loadingSpan.innerHTML=a||c.lang.loading;if(!b.loadingShown)N(d,{opacity:0,display:""}),db(d,{opacity:e.style.opacity},{duration:e.showDuration||0}),b.loadingShown=!0;f()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&db(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){N(b,{display:"none"})}});this.loadingShown=
!1}});A(Ha.prototype,{update:function(a,b,c,d){function e(){f.applyOptions(a);if(f.y===null&&h)f.graphic=h.destroy();if(ea(a)&&!Ja(a))f.redraw=function(){if(h&&h.element&&a&&a.marker&&a.marker.symbol)f.graphic=h.destroy();if(a&&a.dataLabels&&f.dataLabel)f.dataLabel=f.dataLabel.destroy();f.redraw=null};i=f.index;g.updateParallelArrays(f,i);if(l&&f.name)l[f.x]=f.name;k.data[i]=ea(k.data[i])&&!Ja(k.data[i])?f.options:a;g.isDirty=g.isDirtyData=!0;if(!g.fixedBox&&g.hasCartesianSeries)j.isDirtyBox=!0;if(k.legendType===
"point")j.isDirtyLegend=!0;b&&j.redraw(c)}var f=this,g=f.series,h=f.graphic,i,j=g.chart,k=g.options,l=g.xAxis&&g.xAxis.names,b=q(b,!0);d===!1?e():f.firePointEvent("update",{options:a},e)},remove:function(a,b){this.series.removePoint(sa(this,this.series.data),a,b)}});A(P.prototype,{addPoint:function(a,b,c,d){var e=this,f=e.options,g=e.data,h=e.graph,i=e.area,j=e.chart,k=e.xAxis&&e.xAxis.names,l=h&&h.shift||0,m=["graph","area"],h=f.data,n,p=e.xData;$a(d,j);if(c){for(d=e.zones.length;d--;)m.push("zoneGraph"+
d,"zoneArea"+d);o(m,function(a){if(e[a])e[a].shift=l+(f.step?2:1)})}if(i)i.isArea=!0;b=q(b,!0);i={series:e};e.pointClass.prototype.applyOptions.apply(i,[a]);m=i.x;d=p.length;if(e.requireSorting&&m<p[d-1])for(n=!0;d&&p[d-1]>m;)d--;e.updateParallelArrays(i,"splice",d,0,0);e.updateParallelArrays(i,d);if(k&&i.name)k[m]=i.name;h.splice(d,0,a);n&&(e.data.splice(d,0,null),e.processData());f.legendType==="point"&&e.generatePoints();c&&(g[0]&&g[0].remove?g[0].remove(!1):(g.shift(),e.updateParallelArrays(i,
"shift"),h.shift()));e.isDirty=!0;e.isDirtyData=!0;b&&(e.getAttribs(),j.redraw())},removePoint:function(a,b,c){var d=this,e=d.data,f=e[a],g=d.points,h=d.chart,i=function(){g&&g.length===e.length&&g.splice(a,1);e.splice(a,1);d.options.data.splice(a,1);d.updateParallelArrays(f||{series:d},"splice",a,1);f&&f.destroy();d.isDirty=!0;d.isDirtyData=!0;b&&h.redraw()};$a(c,h);b=q(b,!0);f?f.firePointEvent("remove",null,i):i()},remove:function(a,b){var c=this,d=c.chart;O(c,"remove",null,function(){c.destroy();
d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();q(a,!0)&&d.redraw(b)})},update:function(a,b){var c=this,d=this.chart,e=this.userOptions,f=this.type,g=I[f].prototype,h=["group","markerGroup","dataLabelsGroup"],i;if(a.type&&a.type!==f||a.zIndex!==void 0)h.length=0;o(h,function(a){h[a]=c[a];delete c[a]});a=z(e,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1);for(i in g)this[i]=t;A(this,I[a.type||f].prototype);o(h,function(a){c[a]=h[a]});this.init(d,
a);d.linkSeries();q(b,!0)&&d.redraw(!1)}});A(J.prototype,{update:function(a,b){var c=this.chart,a=c.options[this.coll][this.options.index]=z(this.userOptions,a);this.destroy(!0);this._addedPlotLB=this.chart._labelPanes=t;this.init(c,A(a,{events:t}));c.isDirtyBox=!0;q(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&d[e].remove(!1);za(b.axes,this);za(b[c],this);b.options[c].splice(this.options.index,1);o(b[c],function(a,b){a.options.index=b});
this.destroy();b.isDirtyBox=!0;q(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});var Ia=ma(P);I.line=Ia;W.area=z(da,{softThreshold:!1,threshold:0});var ya=ma(P,{type:"area",singleStacks:!1,getStackPoints:function(){var a=[],b=[],c=this.xAxis,d=this.yAxis,e=d.stacks[this.stackKey],f={},g=this.points,h=this.index,i=d.series,j=i.length,k,l=q(d.options.reversedStacks,!0)?1:-1,m,n;if(this.options.stacking){for(m=0;m<g.length;m++)f[g[m].x]=
g[m];for(n in e)e[n].total!==null&&b.push(n);b.sort(function(a,b){return a-b});k=ta(i,function(){return this.visible});o(b,function(g,i){var n=0,q,u;if(f[g]&&!f[g].isNull)a.push(f[g]),o([-1,1],function(a){var c=a===1?"rightNull":"leftNull",d=0,n=e[b[i+a]];if(n)for(m=h;m>=0&&m<j;)q=n.points[m],q||(m===h?f[g][c]=!0:k[m]&&(u=e[g].points[m])&&(d-=u[1]-u[0])),m+=l;f[g][a===1?"rightCliff":"leftCliff"]=d});else{for(m=h;m>=0&&m<j;){if(q=e[g].points[m]){n=q[1];break}m+=l}n=d.toPixels(n,!0);a.push({isNull:!0,
plotX:c.toPixels(g,!0),plotY:n,yBottom:n})}})}return a},getGraphPath:function(a){var b=P.prototype.getGraphPath,c=this.options,d=c.stacking,e=this.yAxis,f,g,h=[],i=[],j=this.index,k,l=e.stacks[this.stackKey],m=c.threshold,n=e.getThreshold(c.threshold),p,c=c.connectNulls||d==="percent",r=function(b,c,f){var g=a[b],b=d&&l[g.x].points[j],p=g[f+"Null"]||0,f=g[f+"Cliff"]||0,r,o,g=!0;f||p?(r=(p?b[0]:b[1])+f,o=b[0]+f,g=!!p):!d&&a[c]&&a[c].isNull&&(r=o=m);r!==void 0&&(i.push({plotX:k,plotY:r===null?n:e.getThreshold(r),
isNull:g}),h.push({plotX:k,plotY:o===null?n:e.getThreshold(o)}))},a=a||this.points;d&&(a=this.getStackPoints());for(f=0;f<a.length;f++)if(g=a[f].isNull,k=q(a[f].rectPlotX,a[f].plotX),p=q(a[f].yBottom,n),!g||c){c||r(f,f-1,"left");if(!g||d||!c)i.push(a[f]),h.push({x:f,plotX:k,plotY:p});c||r(f,f+1,"right")}f=b.call(this,i,!0,!0);h.reversed=!0;g=b.call(this,h,!0,!0);g.length&&(g[0]="L");f=f.concat(g);b=b.call(this,i,!1,c);this.areaPath=f;return b},drawGraph:function(){this.areaPath=[];P.prototype.drawGraph.apply(this);
var a=this,b=this.areaPath,c=this.options,d=[["area",this.color,c.fillColor]];o(this.zones,function(b,f){d.push(["zoneArea"+f,b.color||a.color,b.fillColor||c.fillColor])});o(d,function(d){var f=d[0],g=a[f];g?g.animate({d:b}):(g={fill:d[2]||d[1],zIndex:0},d[2]||(g["fill-opacity"]=q(c.fillOpacity,0.75)),a[f]=a.chart.renderer.path(b).attr(g).add(a.group))})},drawLegendSymbol:aa.drawRectangle});I.area=ya;W.spline=z(da);Ia=ma(P,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-
1],c=a[c+1],g,h,i,j;if(f&&!f.isNull&&c&&!c.isNull){a=f.plotY;i=c.plotX;var c=c.plotY,k=0;g=(1.5*d+f.plotX)/2.5;h=(1.5*e+a)/2.5;i=(1.5*d+i)/2.5;j=(1.5*e+c)/2.5;i!==g&&(k=(j-h)*(i-d)/(i-g)+e-j);h+=k;j+=k;h>a&&h>e?(h=w(a,e),j=2*e-h):h<a&&h<e&&(h=G(a,e),j=2*e-h);j>c&&j>e?(j=w(c,e),h=2*e-j):j<c&&j<e&&(j=G(c,e),h=2*e-j);b.rightContX=i;b.rightContY=j}b=["C",q(f.rightContX,f.plotX),q(f.rightContY,f.plotY),q(g,d),q(h,e),d,e];f.rightContX=f.rightContY=null;return b}});I.spline=Ia;W.areaspline=z(W.area);ya=
ya.prototype;Ia=ma(Ia,{type:"areaspline",getStackPoints:ya.getStackPoints,getGraphPath:ya.getGraphPath,setStackCliffs:ya.setStackCliffs,drawGraph:ya.drawGraph,drawLegendSymbol:aa.drawRectangle});I.areaspline=Ia;W.column=z(da,{borderColor:"#FFFFFF",borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,
y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0});Ia=ma(P,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){P.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=
c.reversed,f,g={},h=0;b.grouping===!1?h=1:o(a.chart.series,function(b){var c=b.options,e=b.yAxis,i;if(b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos)c.stacking?(f=b.stackKey,g[f]===t&&(g[f]=h++),i=g[f]):c.grouping!==!1&&(i=h++),b.columnIndex=i});var i=G(S(c.transA)*(c.ordinalSlope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),j=i*b.groupPadding,k=(i-2*j)/h,b=G(b.maxPointWidth||c.len,q(b.pointWidth,k*(1-2*b.pointPadding)));a.columnMetrics={width:b,offset:(k-b)/2+(j+((a.columnIndex||
0)+(e?1:0))*k-i/2)*(e?-1:1)};return a.columnMetrics},crispCol:function(a,b,c,d){var e=this.chart,f=this.borderWidth,g=-(f%2?0.5:0),f=f%2?0.5:1;e.inverted&&e.renderer.isVML&&(f+=1);c=Math.round(a+c)+g;a=Math.round(a)+g;c-=a;d=Math.round(b+d)+f;g=S(b)<=0.5&&d>0.5;b=Math.round(b)+f;d-=b;g&&d&&(b-=1,d+=1);return{x:a,y:b,width:c,height:d}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=q(c.borderWidth,a.closestPointRange*a.xAxis.transA<2?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),
g=q(c.minPointLength,5),h=a.getColumnMetrics(),i=h.width,j=a.barW=w(i,1+2*d),k=a.pointXOffset=h.offset;b.inverted&&(f-=0.5);c.pointPadding&&(j=Ea(j));P.prototype.translate.apply(a);o(a.points,function(c){var d=G(q(c.yBottom,f),9E4),h=999+S(d),h=G(w(-h,c.plotY),e.len+h),p=c.plotX+k,r=j,o=G(h,d),F,u=w(h,d)-o;S(u)<g&&g&&(u=g,F=!e.reversed&&!c.negative||e.reversed&&c.negative,o=S(o-f)>g?d-g:f-(F?g:0));c.barX=p;c.pointWidth=i;c.tooltipPos=b.inverted?[e.len+e.pos-b.plotLeft-h,a.xAxis.len-p-r/2,u]:[p+r/
2,h+e.pos-b.plotTop,u];c.shapeType="rect";c.shapeArgs=a.crispCol(p,o,r,u)})},getSymbol:ra,drawLegendSymbol:aa.drawRectangle,drawGraph:ra,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,e=c.animationLimit||250,f,g;o(a.points,function(h){var i=h.graphic,j;if(C(h.plotY)&&h.y!==null)f=h.shapeArgs,j=v(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=h.pointAttr[h.selected?"select":""]||a.pointAttr[""],i?(Sa(i),i.attr(j).attr(g)[b.pointCount<e?"animate":"attr"](z(f))):h.graphic=
d[h.shapeType](f).attr(j).attr(g).add(h.group||a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius);else if(i)h.graphic=i.destroy()})},animate:function(a){var b=this,c=this.yAxis,d=b.options,e=this.chart.inverted,f={};if(ja)a?(f.scaleY=0.001,a=G(c.pos+c.len,w(c.pos,c.toPixels(d.threshold))),e?f.translateX=a-c.len:f.translateY=a,b.group.attr(f)):(f[e?"translateX":"translateY"]=c.pos,b.group.animate(f,A(gb(b.options.animation),{step:function(a,c){b.group.attr({scaleY:w(0.001,c.pos)})}})),b.animate=
null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0});P.prototype.remove.apply(a,arguments)}});I.column=Ia;W.bar=z(W.column);ya=ma(Ia,{type:"bar",inverted:!0});I.bar=ya;W.scatter=z(da,{lineWidth:0,marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px;"> {series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});ya=ma(P,{type:"scatter",
sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,kdDimensions:2,drawGraph:function(){this.options.lineWidth&&P.prototype.drawGraph.call(this)}});I.scatter=ya;W.pie=z(da,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.y===null?void 0:this.point.name},x:0},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,
slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});da={type:"pie",isCartesian:!1,pointClass:ma(Ha,{init:function(){Ha.prototype.init.apply(this,arguments);var a=this,b;a.name=q(a.name,"Slice");b=function(b){a.slice(b.type==="select")};E(a,"select",b);E(a,"unselect",b);return a},setVisible:function(a,b){var c=this,d=c.series,e=d.chart,f=d.options.ignoreHiddenPoint,b=q(b,f);if(a!==c.visible){c.visible=c.options.visible=a=a===t?!c.visible:a;d.options.data[sa(c,
d.data)]=c.options;o(["graphic","dataLabel","connector","shadowGroup"],function(b){if(c[b])c[b][a?"show":"hide"](!0)});c.legendItem&&e.legend.colorizeItem(c,a);!a&&c.state==="hover"&&c.setState("");if(f)d.isDirty=!0;b&&e.redraw()}},slice:function(a,b,c){var d=this.series;$a(c,d.chart);q(b,!0);this.sliced=this.options.sliced=a=v(a)?a:!this.sliced;d.options.data[sa(this,d.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)},
haloPath:function(a){var b=this.shapeArgs,c=this.series.chart;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(c.plotLeft+b.x,c.plotTop+b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}}),requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},animate:function(a){var b=this,c=b.points,d=b.startAngleRad;if(!a)o(c,function(a){var c=
a.graphic,g=a.shapeArgs;c&&(c.attr({r:a.startR||b.center[3]/2,start:d,end:d}),c.animate({r:g.r,start:g.start,end:g.end},b.options.animation))}),b.animate=null},updateTotals:function(){var a,b=0,c=this.points,d=c.length,e,f=this.options.ignoreHiddenPoint;for(a=0;a<d;a++)e=c[a],b+=f&&!e.visible?0:e.y;this.total=b;for(a=0;a<d;a++)e=c[a],e.percentage=b>0&&(e.visible||!f)?e.y/b*100:0,e.total=b},generatePoints:function(){P.prototype.generatePoints.call(this);this.updateTotals()},translate:function(a){this.generatePoints();
var b=0,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g,h,i=c.startAngle||0,j=this.startAngleRad=Aa/180*(i-90),i=(this.endAngleRad=Aa/180*(q(c.endAngle,i+360)-90))-j,k=this.points,l=c.dataLabels.distance,c=c.ignoreHiddenPoint,m,n=k.length,p;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){h=Y.asin(G((b-a[1])/(a[2]/2+l),1));return a[0]+(c?-1:1)*ca(h)*(a[2]/2+l)};for(m=0;m<n;m++){p=k[m];f=j+b*i;if(!c||p.visible)b+=p.percentage/100;g=j+b*i;p.shapeType="arc";p.shapeArgs={x:a[0],y:a[1],
r:a[2]/2,innerR:a[3]/2,start:y(f*1E3)/1E3,end:y(g*1E3)/1E3};h=(g+f)/2;h>1.5*Aa?h-=2*Aa:h<-Aa/2&&(h+=2*Aa);p.slicedTranslation={translateX:y(ca(h)*d),translateY:y(la(h)*d)};f=ca(h)*a[2]/2;g=la(h)*a[2]/2;p.tooltipPos=[a[0]+f*0.7,a[1]+g*0.7];p.half=h<-Aa/2||h>Aa/2?1:0;p.angle=h;e=G(e,l/2);p.labelPos=[a[0]+f+ca(h)*l,a[1]+g+la(h)*l,a[0]+f+ca(h)*e,a[1]+g+la(h)*e,a[0]+f,a[1]+g,l<0?"center":p.half?"right":"left",h]}},drawGraph:null,drawPoints:function(){var a=this,b=a.chart.renderer,c,d,e=a.options.shadow,
f,g,h,i;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);o(a.points,function(j){if(j.y!==null){d=j.graphic;h=j.shapeArgs;f=j.shadowGroup;g=j.pointAttr[j.selected?"select":""];if(!g.stroke)g.stroke=g.fill;if(e&&!f)f=j.shadowGroup=b.g("shadow").add(a.shadowGroup);c=j.sliced?j.slicedTranslation:{translateX:0,translateY:0};f&&f.attr(c);if(d)d.setRadialReference(a.center).attr(g).animate(A(h,c));else{i={"stroke-linejoin":"round"};if(!j.visible)i.visibility="hidden";j.graphic=d=b[j.shapeType](h).setRadialReference(a.center).attr(g).attr(i).attr(c).add(a.group).shadow(e,
f)}}})},searchPoint:ra,sortByAngle:function(a,b){a.sort(function(a,d){return a.angle!==void 0&&(d.angle-a.angle)*b})},drawLegendSymbol:aa.drawRectangle,getCenter:bc.getCenter,getSymbol:ra};da=ma(P,da);I.pie=da;P.prototype.drawDataLabels=function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h=a.hasRendered||0,i,j,k=q(d.defer,!0),l=a.chart.renderer;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(d),j=a.plotGroup("dataLabelsGroup","data-labels",k&&!h?"hidden":
"visible",d.zIndex||6),k&&(j.attr({opacity:+h}),h||E(a,"afterAnimate",function(){a.visible&&j.show();j[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,o(e,function(e){var h,k=e.dataLabel,r,o,F=e.connector,u=!0,x,D={};f=e.dlOptions||e.options&&e.options.dataLabels;h=q(f&&f.enabled,g.enabled)&&e.y!==null;if(k&&!h)e.dataLabel=k.destroy();else if(h){d=z(g,f);x=d.style;h=d.rotation;r=e.getLabelConfig();i=d.format?La(d.format,r):d.formatter.call(r,d);x.color=q(d.color,x.color,a.color,"black");
if(k)if(v(i))k.attr({text:i}),u=!1;else{if(e.dataLabel=k=k.destroy(),F)e.connector=F.destroy()}else if(v(i)){k={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:h,padding:d.padding,zIndex:1};if(x.color==="contrast")D.color=d.inside||d.distance<0||b.stacking?l.getContrast(e.color||a.color):"#000000";if(c)D.cursor=c;for(o in k)k[o]===t&&delete k[o];k=e.dataLabel=l[h?"text":"label"](i,0,-9999,d.shape,null,null,d.useHTML).attr(k).css(A(x,D)).add(j).shadow(d.shadow)}k&&
a.alignDataLabel(e,k,d,null,u)}})};P.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=q(a.plotX,-9999),i=q(a.plotY,-9999),j=b.getBBox(),k=f.renderer.fontMetrics(c.style.fontSize).b,l=c.rotation,m=c.align,n=this.visible&&(a.series.forceDL||f.isInsidePlot(h,y(i),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g)),p=q(c.overflow,"justify")==="justify";if(n)d=A({x:g?f.plotWidth-i:h,y:y(g?f.plotHeight-h:i),width:0,height:0},d),A(c,{width:j.width,height:j.height}),l?(p=!1,g=f.renderer.rotCorr(k,
l),g={x:d.x+c.x+d.width/2+g.x,y:d.y+c.y+{top:0,middle:0.5,bottom:1}[c.verticalAlign]*d.height},b[e?"attr":"animate"](g).attr({align:m}),h=(l+720)%360,h=h>180&&h<360,m==="left"?g.y-=h?j.height:0:m==="center"?(g.x-=j.width/2,g.y-=j.height/2):m==="right"&&(g.x-=j.width,g.y-=h?0:j.height)):(b.align(c,null,d),g=b.alignAttr),p?this.justifyDataLabel(b,c,g,j,d,e):q(c.crop,!0)&&(n=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+j.width,g.y+j.height)),c.shape&&!l&&b.attr({anchorX:a.plotX,anchorY:a.plotY});if(!n)Sa(b),
b.attr({y:-9999}),b.placed=!1};P.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,i=b.verticalAlign,j,k,l=a.box?0:a.padding||0;j=c.x+l;if(j<0)h==="right"?b.align="left":b.x=-j,k=!0;j=c.x+d.width-l;if(j>g.plotWidth)h==="left"?b.align="right":b.x=g.plotWidth-j,k=!0;j=c.y+l;if(j<0)i==="bottom"?b.verticalAlign="top":b.y=-j,k=!0;j=c.y+d.height-l;if(j>g.plotHeight)i==="top"?b.verticalAlign="bottom":b.y=g.plotHeight-j,k=!0;if(k)a.placed=!f,a.align(b,null,e)};if(I.pie)I.pie.prototype.drawDataLabels=
function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=q(e.connectorPadding,10),g=q(e.connectorWidth,1),h=d.plotWidth,i=d.plotHeight,j,k,l=q(e.softConnector,!0),m=e.distance,n=a.center,p=n[2]/2,r=n[1],s=m>0,F,u,x,D=[[],[]],v,t,A,B,z,C=[0,0,0,0],H=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){P.prototype.drawDataLabels.apply(a);o(b,function(a){if(a.dataLabel&&a.visible)D[a.half].push(a),a.dataLabel._pos=null});for(B=2;B--;){var E=[],L=[],K=D[B],I=K.length,
J;if(I){a.sortByAngle(K,B-0.5);for(z=b=0;!b&&K[z];)b=K[z]&&K[z].dataLabel&&(K[z].dataLabel.getBBox().height||21),z++;if(m>0){u=G(r+p+m,d.plotHeight);for(z=w(0,r-p-m);z<=u;z+=b)E.push(z);u=E.length;if(I>u){c=[].concat(K);c.sort(H);for(z=I;z--;)c[z].rank=z;for(z=I;z--;)K[z].rank>=u&&K.splice(z,1);I=K.length}for(z=0;z<I;z++){c=K[z];x=c.labelPos;c=9999;var N,M;for(M=0;M<u;M++)N=S(E[M]-x[1]),N<c&&(c=N,J=M);if(J<z&&E[z]!==null)J=z;else for(u<I-z+J&&E[z]!==null&&(J=u-I+z);E[J]===null;)J++;L.push({i:J,y:E[J]});
E[J]=null}L.sort(H)}for(z=0;z<I;z++){c=K[z];x=c.labelPos;F=c.dataLabel;A=c.visible===!1?"hidden":"inherit";c=x[1];if(m>0){if(u=L.pop(),J=u.i,t=u.y,c>t&&E[J+1]!==null||c<t&&E[J-1]!==null)t=G(w(0,c),d.plotHeight)}else t=c;v=e.justify?n[0]+(B?-1:1)*(p+m):a.getX(t===r-p-m||t===r+p+m?c:t,B);F._attr={visibility:A,align:x[6]};F._pos={x:v+e.x+({left:f,right:-f}[x[6]]||0),y:t+e.y-10};F.connX=v;F.connY=t;if(this.options.size===null)u=F.width,v-u<f?C[3]=w(y(u-v+f),C[3]):v+u>h-f&&(C[1]=w(y(v+u-h+f),C[1])),t-
b/2<0?C[0]=w(y(-t+b/2),C[0]):t+b/2>i&&(C[2]=w(y(t+b/2-i),C[2]))}}}if(Da(C)===0||this.verifyDataLabelOverflow(C))this.placeDataLabels(),s&&g&&o(this.points,function(b){j=b.connector;x=b.labelPos;if((F=b.dataLabel)&&F._pos&&b.visible)A=F._attr.visibility,v=F.connX,t=F.connY,k=l?["M",v+(x[6]==="left"?5:-5),t,"C",v,t,2*x[2]-x[4],2*x[3]-x[5],x[2],x[3],"L",x[4],x[5]]:["M",v+(x[6]==="left"?5:-5),t,"L",x[2],x[3],"L",x[4],x[5]],j?(j.animate({d:k}),j.attr("visibility",A)):b.connector=j=a.chart.renderer.path(k).attr({"stroke-width":g,
stroke:e.connectorColor||b.color||"#606060",visibility:A}).add(a.dataLabelsGroup);else if(j)b.connector=j.destroy()})}},I.pie.prototype.placeDataLabels=function(){o(this.points,function(a){var b=a.dataLabel;if(b&&a.visible)(a=b._pos)?(b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-9999})})},I.pie.prototype.alignDataLabel=ra,I.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,d=c.center,e=c.minSize||80,f=e,g;d[0]!==null?f=w(b[2]-w(a[1],a[3]),
e):(f=w(b[2]-a[1]-a[3],e),b[0]+=(a[3]-a[1])/2);d[1]!==null?f=w(G(f,b[2]-w(a[0],a[2])),e):(f=w(G(f,b[2]-a[0]-a[2]),e),b[1]+=(a[0]-a[2])/2);f<b[2]?(b[2]=f,b[3]=Math.min(/%$/.test(c.innerSize||0)?f*parseFloat(c.innerSize||0)/100:parseFloat(c.innerSize||0),f),this.translate(b),this.drawDataLabels&&this.drawDataLabels()):g=!0;return g};if(I.column)I.column.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart.inverted,g=a.series,h=a.dlBox||a.shapeArgs,i=q(a.below,a.plotY>q(this.translatedThreshold,
g.yAxis.len)),j=q(c.inside,!!this.options.stacking);if(h){d=z(h);if(d.y<0)d.height+=d.y,d.y=0;h=d.y+d.height-g.yAxis.len;h>0&&(d.height-=h);f&&(d={x:g.yAxis.len-d.y-d.height,y:g.xAxis.len-d.x-d.width,width:d.height,height:d.width});if(!j)f?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:0,d.height=0)}c.align=q(c.align,!f||j?"center":i?"right":"left");c.verticalAlign=q(c.verticalAlign,f||j?"middle":i?"top":"bottom");P.prototype.alignDataLabel.call(this,a,b,c,d,e)};(function(a){var b=a.Chart,c=a.each,
d=a.pick,e=a.addEvent;b.prototype.callbacks.push(function(a){function b(){var e=[];c(a.series,function(a){var b=a.options.dataLabels,f=a.dataLabelCollections||["dataLabel"];(b.enabled||a._hasPointLabels)&&!b.allowOverlap&&a.visible&&c(f,function(b){c(a.points,function(a){if(a[b])a[b].labelrank=d(a.labelrank,a.shapeArgs&&a.shapeArgs.height),e.push(a[b])})})});a.hideOverlappingLabels(e)}b();e(a,"redraw",b)});b.prototype.hideOverlappingLabels=function(a){var b=a.length,d,e,j,k,l,m,n,p,r;for(e=0;e<b;e++)if(d=
a[e])d.oldOpacity=d.opacity,d.newOpacity=1;a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(e=0;e<b;e++){j=a[e];for(d=e+1;d<b;++d)if(k=a[d],j&&k&&j.placed&&k.placed&&j.newOpacity!==0&&k.newOpacity!==0&&(l=j.alignAttr,m=k.alignAttr,n=j.parentGroup,p=k.parentGroup,r=2*(j.box?0:j.padding),l=!(m.x+p.translateX>l.x+n.translateX+(j.width-r)||m.x+p.translateX+(k.width-r)<l.x+n.translateX||m.y+p.translateY>l.y+n.translateY+(j.height-r)||m.y+p.translateY+(k.height-r)<l.y+n.translateY)))(j.labelrank<
k.labelrank?j:k).newOpacity=0}c(a,function(a){var b,c;if(a){c=a.newOpacity;if(a.oldOpacity!==c&&a.placed)c?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=c,a[a.isOld?"animate":"attr"](a.alignAttr,null,b);a.isOld=!0}})}})(B);var mb=B.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(a){for(var c=a.target,d;c&&!d;)d=c.point,c=c.parentNode;if(d!==t&&d!==b.hoverPoint)d.onMouseOver(a)};o(a.points,function(a){if(a.graphic)a.graphic.element.point=
a;if(a.dataLabel)a.dataLabel.element.point=a});if(!a._hasTracking)o(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),cb))a[b].on("touchstart",f)}),a._hasTracking=!0},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,j=a.tracker,k=b.cursor,l=k&&{cursor:k},m=function(){if(f.hoverSeries!==
a)a.onMouseOver()},n="rgba(192,192,192,"+(ja?1.0E-4:0.002)+")";if(e&&!c)for(k=e+1;k--;)d[k]==="M"&&d.splice(k+1,0,d[k+1]-i,d[k+2],"L"),(k&&d[k]==="M"||k===e)&&d.splice(k,0,"L",d[k-2]+i,d[k-1]);j?j.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:n,fill:c?n:"none","stroke-width":b.lineWidth+(c?0:2*i),zIndex:2}).add(a.group),o([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",m).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);
if(cb)a.on("touchstart",m)}))}};if(I.column)Ia.prototype.drawTracker=mb.drawTrackerPoint;if(I.pie)I.pie.prototype.drawTracker=mb.drawTrackerPoint;if(I.scatter)ya.prototype.drawTracker=mb.drawTrackerPoint;A(ub.prototype,{setItemEvents:function(a,b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible&&a.setVisible()},b={browserEvent:b};
a.firePointEvent?a.firePointEvent("legendItemClick",b,c):O(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=fa("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);E(a.checkbox,"click",function(b){O(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select()})})}});R.legend.itemStyle.cursor="pointer";A(Ba.prototype,{showResetZoom:function(){var a=this,b=R.lang,c=a.options.chart.resetZoomButton,
d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,f)},zoomOut:function(){var a=this;O(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?o(this.axes,function(a){b=a.zoom()}):o(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?
"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&ea(e))this.resetZoomButton=e.destroy();b&&this.redraw(q(this.options.chart.animation,a&&a.animation,this.pointCount<100))},pan:function(a,b){var c=this,d=c.hoverPoints,e;d&&o(d,function(a){a.setState()});o(b==="xy"?[1,0]:[1],function(b){var b=c[b?"xAxis":"yAxis"][0],d=b.horiz,h=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",i=c[d],j=(b.pointRange||
0)/2,k=b.getExtremes(),l=b.toValue(i-h,!0)+j,j=b.toValue(i+b.len-h,!0)-j,i=i>h;if(b.series.length&&(i||l>G(k.dataMin,k.min))&&(!i||j<w(k.dataMax,k.max)))b.setExtremes(l,j,!1,!1,{trigger:"pan"}),e=!0;c[d]=h});e&&c.redraw(!1);N(c.container,{cursor:"move"})}});A(Ha.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart,a=q(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[sa(c,d.data)]=c.options;c.setState(a&&"select");
b||o(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[sa(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a,b){var c=this.series,d=c.chart,e=d.tooltip,f=d.hoverPoint;if(d.hoverSeries!==c)c.onMouseOver();if(f&&f!==this)f.onMouseOut();if(this.series&&(this.firePointEvent("mouseOver"),e&&(!e.shared||c.noSharedTooltip)&&e.refresh(this,a),this.setState("hover"),!b))d.hoverPoint=this},onMouseOut:function(){var a=
this.series.chart,b=a.hoverPoints;this.firePointEvent("mouseOut");if(!b||sa(this,b)===-1)this.setState(),a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var a=z(this.series.options.point,this.options).events,b;this.events=a;for(b in a)E(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=V(this.plotX),d=this.plotY,e=this.series,f=e.options.states,g=W[e.type].marker&&e.options.marker,h=g&&!g.enabled,i=g&&g.states[a],j=i&&i.enabled===!1,k=e.stateMarkerGraphic,
l=this.marker||{},m=e.chart,n=e.halo,p,a=a||"";p=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&a!=="select"||f[a]&&f[a].enabled===!1||a&&(j||h&&i.enabled===!1)||a&&l.states&&l.states[a]&&l.states[a].enabled===!1)){if(this.graphic)g=g&&this.graphic.symbolName&&p.r,this.graphic.attr(z(p,g?{x:c-g,y:d-g,width:2*g,height:2*g}:{})),k&&k.hide();else{if(a&&i)if(g=i.radius,l=l.symbol||e.symbol,k&&k.currentSymbol!==l&&(k=k.destroy()),k)k[b?"animate":"attr"]({x:c-g,y:d-g});else if(l)e.stateMarkerGraphic=
k=m.renderer.symbol(l,c-g,d-g,2*g,2*g).attr(p).add(e.markerGroup),k.currentSymbol=l;if(k)k[a&&m.isInsidePlot(c,d,m.inverted)?"show":"hide"](),k.element.point=this}if((c=f[a]&&f[a].halo)&&c.size){if(!n)e.halo=n=m.renderer.path().add(m.seriesGroup);n.attr(A({fill:this.color||e.color,"fill-opacity":c.opacity,zIndex:-1},c.attributes))[b?"animate":"attr"]({d:this.haloPath(c.size)})}else n&&n.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series,c=b.chart,d=b.getPlotBox(),e=c.inverted,f=Math.floor(this.plotX);
return c.renderer.symbols.circle(d.translateX+(e?b.yAxis.len-this.plotY:f)-a,d.translateY+(e?b.xAxis.len-f:this.plotY)-a,a*2,a*2)}});A(P.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&O(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&O(this,"mouseOut");c&&!a.stickyTracking&&
(!c.shared||this.noSharedTooltip)&&c.hide();this.setState()},setState:function(a){var b=this.options,c=this.graph,d=b.states,e=b.lineWidth,b=0,a=a||"";if(this.state!==a&&(this.state=a,!(d[a]&&d[a].enabled===!1)&&(a&&(e=d[a].lineWidth||e+(d[a].lineWidthPlus||0)),c&&!c.dashstyle))){a={"stroke-width":e};for(c.attr(a);this["zoneGraph"+b];)this["zoneGraph"+b].attr(a),b+=1}},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,h=c.visible;f=(c.visible=a=c.userOptions.visible=
a===t?!h:a)?"show":"hide";o(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&o(d.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});o(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;b!==!1&&d.redraw();O(c,f)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=
a=a===t?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;O(this,a?"select":"unselect")},drawTracker:mb.drawTrackerGraph});U(P.prototype,"init",function(a){var b;a.apply(this,Array.prototype.slice.call(arguments,1));(b=this.xAxis)&&b.options.ordinal&&E(this,"updatedData",function(){delete b.ordinalIndex})});U(J.prototype,"getTimeTicks",function(a,b,c,d,e,f,g,h){var i=0,j,k,l={},m,n,p,o=[],q=-Number.MAX_VALUE,F=this.options.tickPixelInterval;if(!this.options.ordinal&&!this.options.breaks||
!f||f.length<3||c===t)return a.call(this,b,c,d,e);n=f.length;for(j=0;j<n;j++){p=j&&f[j-1]>d;f[j]<c&&(i=j);if(j===n-1||f[j+1]-f[j]>g*5||p){if(f[j]>q){for(k=a.call(this,b,f[i],f[j],e);k.length&&k[0]<=q;)k.shift();k.length&&(q=k[k.length-1]);o=o.concat(k)}i=j+1}if(p)break}a=k.info;if(h&&a.unitRange<=M.hour){j=o.length-1;for(i=1;i<j;i++)na("%d",o[i])!==na("%d",o[i-1])&&(l[o[i]]="day",m=!0);m&&(l[o[0]]="day");a.higherRanks=l}o.info=a;if(h&&v(F)){h=a=o.length;j=[];var u;for(m=[];h--;)i=this.translate(o[h]),
u&&(m[h]=u-i),j[h]=u=i;m.sort();m=m[V(m.length/2)];m<F*0.6&&(m=null);h=o[a-1]>d?a-1:a;for(u=void 0;h--;)i=j[h],d=u-i,u&&d<F*0.8&&(m===null||d<m*0.8)?(l[o[h]]&&!l[o[h+1]]?(d=h+1,u=i):d=h,o.splice(d,1)):u=i}return o});A(J.prototype,{beforeSetTickPositions:function(){var a,b=[],c=!1,d,e=this.getExtremes(),f=e.min,g=e.max,h,i=this.isXAxis&&!!this.options.breaks;if((e=this.options.ordinal)||i){o(this.series,function(c,d){if(c.visible!==!1&&(c.takeOrdinalPosition!==!1||i))if(b=b.concat(c.processedXData),
a=b.length,b.sort(function(a,b){return a-b}),a)for(d=a-1;d--;)b[d]===b[d+1]&&b.splice(d,1)});a=b.length;if(a>2){d=b[1]-b[0];for(h=a-1;h--&&!c;)b[h+1]-b[h]!==d&&(c=!0);if(!this.options.keepOrdinalPadding&&(b[0]-f>d||g-b[b.length-1]>d))c=!0}c?(this.ordinalPositions=b,d=this.val2lin(w(f,b[0]),!0),h=w(this.val2lin(G(g,b[b.length-1]),!0),1),this.ordinalSlope=g=(g-f)/(h-d),this.ordinalOffset=f-d*g):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=t}this.isOrdinal=e&&c;this.groupIntervalFactor=
null},val2lin:function(a,b){var c=this.ordinalPositions,d;if(c){var e=c.length,f;for(d=e;d--;)if(c[d]===a){f=d;break}for(d=e-1;d--;)if(a>c[d]||d===0){c=(a-c[d])/(c[d+1]-c[d]);f=d+c;break}d=b?f:this.ordinalSlope*(f||0)+this.ordinalOffset}else d=a;return d},lin2val:function(a,b){var c=this.ordinalPositions;if(c){var d=this.ordinalSlope,e=this.ordinalOffset,f=c.length-1,g,h;if(b)a<0?a=c[0]:a>f?a=c[f]:(f=V(a),h=a-f);else for(;f--;)if(g=d*f+e,a>=g){d=d*(f+1)+e;h=(a-g)/(d-g);break}c=h!==t&&c[f]!==t?c[f]+
(h?h*(c[f+1]-c[f]):0):a}else c=a;return c},getExtendedPositions:function(){var a=this.chart,b=this.series[0].currentDataGrouping,c=this.ordinalIndex,d=b?b.count+b.unitName:"raw",e=this.getExtremes(),f,g;if(!c)c=this.ordinalIndex={};if(!c[d])f={series:[],getExtremes:function(){return{min:e.dataMin,max:e.dataMax}},options:{ordinal:!0},val2lin:J.prototype.val2lin},o(this.series,function(c){g={xAxis:f,xData:c.xData,chart:a,destroyGroupedData:ra};g.options={dataGrouping:b?{enabled:!0,forced:!0,approximation:"open",
units:[[b.unitName,[b.count]]]}:{enabled:!1}};c.processData.apply(g);f.series.push(g)}),this.beforeSetTickPositions.apply(f),c[d]=f.ordinalPositions;return c[d]},getGroupIntervalFactor:function(a,b,c){var d,c=c.processedXData,e=c.length,f=[];d=this.groupIntervalFactor;if(!d){for(d=0;d<e-1;d++)f[d]=c[d+1]-c[d];f.sort(function(a,b){return a-b});f=f[V(e/2)];a=w(a,c[0]);b=G(b,c[e-1]);this.groupIntervalFactor=d=e*f/(b-a)}return d},postProcessTickInterval:function(a){var b=this.ordinalSlope;return b?this.options.breaks?
this.closestPointRange:a/(b/this.closestPointRange):a}});U(Ba.prototype,"pan",function(a,b){var c=this.xAxis[0],d=b.chartX,e=!1;if(c.options.ordinal&&c.series.length){var f=this.mouseDownX,g=c.getExtremes(),h=g.dataMax,i=g.min,j=g.max,k=this.hoverPoints,l=c.closestPointRange,f=(f-d)/(c.translationSlope*(c.ordinalSlope||l)),m={ordinalPositions:c.getExtendedPositions()},l=c.lin2val,n=c.val2lin,p;if(m.ordinalPositions){if(S(f)>1)k&&o(k,function(a){a.setState()}),f<0?(k=m,p=c.ordinalPositions?c:m):(k=
c.ordinalPositions?c:m,p=m),m=p.ordinalPositions,h>m[m.length-1]&&m.push(h),this.fixedRange=j-i,f=c.toFixedRange(null,null,l.apply(k,[n.apply(k,[i,!0])+f,!0]),l.apply(p,[n.apply(p,[j,!0])+f,!0])),f.min>=G(g.dataMin,i)&&f.max<=w(h,j)&&c.setExtremes(f.min,f.max,!0,!1,{trigger:"pan"}),this.mouseDownX=d,N(this.container,{cursor:"move"})}else e=!0}else e=!0;e&&a.apply(this,Array.prototype.slice.call(arguments,1))});P.prototype.gappedPath=function(){var a=this.options.gapSize,b=this.points.slice(),c=b.length-
1;if(a&&c>0)for(;c--;)b[c+1].x-b[c].x>this.closestPointRange*a&&b.splice(c+1,0,{isNull:!0});return this.getGraphPath(b)};(function(a){a(B)})(function(a){function b(){return Array.prototype.slice.call(arguments,1)}function c(a){a.apply(this);this.drawBreaks(this.xAxis,["x"]);this.drawBreaks(this.yAxis,d(this.pointArrayMap,["y"]))}var d=a.pick,e=a.wrap,f=a.each,g=a.extend,h=a.fireEvent,i=a.Axis,j=a.Series;g(i.prototype,{isInBreak:function(a,b){var c=a.repeat||Infinity,d=a.from,e=a.to-a.from,c=b>=d?
(b-d)%c:c-(d-b)%c;return a.inclusive?c<=e:c<e&&c!==0},isInAnyBreak:function(a,b){var c=this.options.breaks,e=c&&c.length,f,g,h;if(e){for(;e--;)this.isInBreak(c[e],a)&&(f=!0,g||(g=d(c[e].showPoints,this.isXAxis?!1:!0)));h=f&&b?f&&!g:f}return h}});e(i.prototype,"setTickPositions",function(a){a.apply(this,Array.prototype.slice.call(arguments,1));if(this.options.breaks){var b=this.tickPositions,c=this.tickPositions.info,d=[],e;for(e=0;e<b.length;e++)this.isInAnyBreak(b[e])||d.push(b[e]);this.tickPositions=
d;this.tickPositions.info=c}});e(i.prototype,"init",function(a,b,c){if(c.breaks&&c.breaks.length)c.ordinal=!1;a.call(this,b,c);if(this.options.breaks){var d=this;d.isBroken=!0;this.val2lin=function(a){var b=a,c,e;for(e=0;e<d.breakArray.length;e++)if(c=d.breakArray[e],c.to<=a)b-=c.len;else if(c.from>=a)break;else if(d.isInBreak(c,a)){b-=a-c.from;break}return b};this.lin2val=function(a){var b,c;for(c=0;c<d.breakArray.length;c++)if(b=d.breakArray[c],b.from>=a)break;else b.to<a?a+=b.len:d.isInBreak(b,
a)&&(a+=b.len);return a};this.setExtremes=function(a,b,c,d,e){for(;this.isInAnyBreak(a);)a-=this.closestPointRange;for(;this.isInAnyBreak(b);)b-=this.closestPointRange;i.prototype.setExtremes.call(this,a,b,c,d,e)};this.setAxisTranslation=function(a){i.prototype.setAxisTranslation.call(this,a);var b=d.options.breaks,a=[],c=[],e=0,f,g,k=d.userMin||d.min,j=d.userMax||d.max,l,m;for(m in b)g=b[m],f=g.repeat||Infinity,d.isInBreak(g,k)&&(k+=g.to%f-k%f),d.isInBreak(g,j)&&(j-=j%f-g.from%f);for(m in b){g=b[m];
l=g.from;for(f=g.repeat||Infinity;l-f>k;)l-=f;for(;l<k;)l+=f;for(;l<j;l+=f)a.push({value:l,move:"in"}),a.push({value:l+(g.to-g.from),move:"out",size:g.breakSize})}a.sort(function(a,b){return a.value===b.value?(a.move==="in"?0:1)-(b.move==="in"?0:1):a.value-b.value});b=0;l=k;for(m in a){g=a[m];b+=g.move==="in"?1:-1;if(b===1&&g.move==="in")l=g.value;b===0&&(c.push({from:l,to:g.value,len:g.value-l-(g.size||0)}),e+=g.value-l-(g.size||0))}d.breakArray=c;h(d,"afterBreaks");d.transA*=(j-d.min)/(j-k-e);d.min=
k;d.max=j}}});e(j.prototype,"generatePoints",function(a){a.apply(this,b(arguments));var c=this.xAxis,d=this.yAxis,e=this.points,f,g=e.length,h=this.options.connectNulls,i;if(c&&d&&(c.options.breaks||d.options.breaks))for(;g--;)if(f=e[g],i=f.y===null&&h===!1,!i&&(c.isInAnyBreak(f.x,!0)||d.isInAnyBreak(f.y,!0)))e.splice(g,1),this.data[g]&&this.data[g].destroyElements()});a.Series.prototype.drawBreaks=function(a,b){var c=this,e=c.points,g,i,j,o;f(b,function(b){g=a.breakArray||[];i=a.isXAxis?a.min:d(c.options.threshold,
a.min);f(e,function(c){o=d(c["stack"+b.toUpperCase()],c[b]);f(g,function(b){j=!1;if(i<b.from&&o>b.to||i>b.from&&o<b.from)j="pointBreak";else if(i<b.from&&o>b.from&&o<b.to||i>b.from&&o>b.to&&o<b.from)j="pointInBreak";j&&h(a,j,{point:c,brk:b})})})})};e(a.seriesTypes.column.prototype,"drawPoints",c);e(a.Series.prototype,"drawPoints",c)});var ia=P.prototype,cc=ia.processData,dc=ia.generatePoints,ec=ia.destroy,fc={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:{millisecond:["%A, %b %e, %H:%M:%S.%L",
"%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],second:["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],minute:["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],hour:["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],day:["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],week:["Week from %A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],month:["%B %Y","%B","-%B %Y"],year:["%Y","%Y","-%Y"]}},Xb={line:{},spline:{},area:{},areaspline:{},column:{approximation:"sum",groupPixelWidth:10},arearange:{approximation:"range"},
areasplinerange:{approximation:"range"},columnrange:{approximation:"range",groupPixelWidth:10},candlestick:{approximation:"ohlc",groupPixelWidth:10},ohlc:{approximation:"ohlc",groupPixelWidth:5}},Yb=[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1]],["week",[1]],["month",[1,3,6]],["year",null]],Ta={sum:function(a){var b=a.length,c;if(!b&&a.hasNulls)c=null;else if(b)for(c=0;b--;)c+=a[b];return c},average:function(a){var b=
a.length,a=Ta.sum(a);C(a)&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:t},high:function(a){return a.length?Da(a):a.hasNulls?null:t},low:function(a){return a.length?Ma(a):a.hasNulls?null:t},close:function(a){return a.length?a[a.length-1]:a.hasNulls?null:t},ohlc:function(a,b,c,d){a=Ta.open(a);b=Ta.high(b);c=Ta.low(c);d=Ta.close(d);if(C(a)||C(b)||C(c)||C(d))return[a,b,c,d]},range:function(a,b){a=Ta.low(a);b=Ta.high(b);if(C(a)||C(b))return[a,b]}};ia.groupData=function(a,
b,c,d){var e=this.data,f=this.options.data,g=[],h=[],i=[],j=a.length,k,l,m=!!b,n=[[],[],[],[]],d=typeof d==="function"?d:Ta[d],p=this.pointArrayMap,o=p&&p.length,q,v=0;for(q=0;q<=j;q++)if(a[q]>=c[0])break;for(;q<=j;q++){for(;c[1]!==t&&a[q]>=c[1]||q===j;)if(k=c.shift(),l=d.apply(0,n),l!==t&&(g.push(k),h.push(l),i.push({start:v,length:n[0].length})),v=q,n[0]=[],n[1]=[],n[2]=[],n[3]=[],q===j)break;if(q===j)break;if(p){k=this.cropStart+q;k=e&&e[k]||this.pointClass.prototype.applyOptions.apply({series:this},
[f[k]]);var u;for(l=0;l<o;l++)if(u=k[p[l]],C(u))n[l].push(u);else if(u===null)n[l].hasNulls=!0}else if(k=m?b[q]:null,C(k))n[0].push(k);else if(k===null)n[0].hasNulls=!0}return[g,h,i]};ia.processData=function(){var a=this.chart,b=this.options.dataGrouping,c=this.allowDG!==!1&&b&&q(b.enabled,a.options._stock),d;this.forceCrop=c;this.groupPixelWidth=null;this.hasProcessed=!0;if(cc.apply(this,arguments)!==!1&&c){this.destroyGroupedData();var e=this.processedXData,f=this.processedYData,g=a.plotSizeX,a=
this.xAxis,h=a.options.ordinal,i=this.groupPixelWidth=a.getGroupPixelWidth&&a.getGroupPixelWidth();if(i){d=!0;this.points=null;var j=a.getExtremes(),c=j.min,j=j.max,h=h&&a.getGroupIntervalFactor(c,j,this)||1,g=i*(j-c)/g*h,i=a.getTimeTicks(a.normalizeTimeTickInterval(g,b.units||Yb),Math.min(c,e[0]),Math.max(j,e[e.length-1]),a.options.startOfWeek,e,this.closestPointRange),e=ia.groupData.apply(this,[e,f,i,b.approximation]),f=e[0],h=e[1];if(b.smoothed){b=f.length-1;for(f[b]=Math.min(f[b],j);b--&&b>0;)f[b]+=
g/2;f[0]=Math.max(f[0],c)}this.currentDataGrouping=i.info;this.closestPointRange=i.info.totalRange;this.groupMap=e[2];if(v(f[0])&&f[0]<a.dataMin){if(a.min===a.dataMin)a.min=f[0];a.dataMin=f[0]}this.processedXData=f;this.processedYData=h}else this.currentDataGrouping=this.groupMap=null;this.hasGroupedData=d}};ia.destroyGroupedData=function(){var a=this.groupedData;o(a||[],function(b,c){b&&(a[c]=b.destroy?b.destroy():null)});this.groupedData=null};ia.generatePoints=function(){dc.apply(this);this.destroyGroupedData();
this.groupedData=this.hasGroupedData?this.points:null};U(Lb.prototype,"tooltipFooterHeaderFormatter",function(a,b,c){var d=b.series,e=d.tooltipOptions,f=d.options.dataGrouping,g=e.xDateFormat,h,i=d.xAxis;return i&&i.options.type==="datetime"&&f&&C(b.key)?(a=d.currentDataGrouping,f=f.dateTimeLabelFormats,a?(i=f[a.unitName],a.count===1?g=i[0]:(g=i[1],h=i[2])):!g&&f&&(g=this.getXDateFormat(b,e,i)),g=na(g,b.key),h&&(g+=na(h,b.key+a.totalRange-1)),La(e[(c?"footer":"header")+"Format"],{point:A(b,{key:g}),
series:d})):a.call(this,b,c)});ia.destroy=function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();ec.apply(this)};U(ia,"setOptions",function(a,b){var c=a.call(this,b),d=this.type,e=this.chart.options.plotOptions,f=W[d].dataGrouping;if(Xb[d])f||(f=z(fc,Xb[d])),c.dataGrouping=z(f,e.series&&e.series.dataGrouping,e[d].dataGrouping,b.dataGrouping);if(this.chart.options._stock)this.requireSorting=!0;return c});U(J.prototype,"setScale",function(a){a.call(this);o(this.series,function(a){a.hasProcessed=
!1})});J.prototype.getGroupPixelWidth=function(){var a=this.series,b=a.length,c,d=0,e=!1,f;for(c=b;c--;)(f=a[c].options.dataGrouping)&&(d=w(d,f.groupPixelWidth));for(c=b;c--;)if((f=a[c].options.dataGrouping)&&a[c].hasProcessed)if(b=(a[c].processedXData||a[c].data).length,a[c].groupPixelWidth||b>this.chart.plotSizeX/d||b&&f.forced)e=!0;return e?d:0};J.prototype.setDataGrouping=function(a,b){var c,b=q(b,!0);a||(a={forced:!1,units:null});if(this instanceof J)for(c=this.series.length;c--;)this.series[c].update({dataGrouping:a},
!1);else o(this.chart.options.series,function(b){b.dataGrouping=a},!1);b&&this.chart.redraw()};W.ohlc=z(W.column,{lineWidth:1,tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'},states:{hover:{lineWidth:3}},threshold:null});da=ma(I.column,{type:"ohlc",pointArrayMap:["open","high","low","close"],toYData:function(a){return[a.open,a.high,a.low,a.close]},pointValKey:"high",
pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},upColorProp:"stroke",getAttribs:function(){I.column.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,a=a.upColor||this.color,c=z(this.pointAttr),d=this.upColorProp;c[""][d]=a;c.hover[d]=b.hover.upColor||a;c.select[d]=b.select.upColor||a;o(this.points,function(a){if(a.open<a.close&&!a.options.color)a.pointAttr=c})},translate:function(){var a=this.yAxis;I.column.prototype.translate.apply(this);o(this.points,function(b){if(b.open!==
null)b.plotOpen=a.translate(b.open,0,1,0,1);if(b.close!==null)b.plotClose=a.translate(b.close,0,1,0,1)})},drawPoints:function(){var a=this,b=a.chart,c,d,e,f,g,h,i,j;o(a.points,function(k){if(k.plotY!==t)i=k.graphic,c=k.pointAttr[k.selected?"selected":""]||a.pointAttr[""],f=c["stroke-width"]%2/2,j=y(k.plotX)-f,g=y(k.shapeArgs.width/2),h=["M",j,y(k.yBottom),"L",j,y(k.plotY)],k.open!==null&&(d=y(k.plotOpen)+f,h.push("M",j,d,"L",j-g,d)),k.close!==null&&(e=y(k.plotClose)+f,h.push("M",j,e,"L",j+g,e)),i?
i.attr(c).animate({d:h}):k.graphic=b.renderer.path(h).attr(c).add(a.group)})},animate:null});I.ohlc=da;W.candlestick=z(W.column,{lineColor:"black",lineWidth:1,states:{hover:{lineWidth:2}},tooltip:W.ohlc.tooltip,threshold:null,upColor:"white"});da=ma(da,{type:"candlestick",pointAttrToOptions:{fill:"color",stroke:"lineColor","stroke-width":"lineWidth"},upColorProp:"fill",getAttribs:function(){I.ohlc.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,c=a.upLineColor||a.lineColor,
d=b.hover.upLineColor||c,e=b.select.upLineColor||c;o(this.points,function(a){if(a.open<a.close){if(a.lineColor)a.pointAttr=z(a.pointAttr),c=a.lineColor;a.pointAttr[""].stroke=c;a.pointAttr.hover.stroke=d;a.pointAttr.select.stroke=e}})},drawPoints:function(){var a=this,b=a.chart,c,d=a.pointAttr[""],e,f,g,h,i,j,k,l,m,n,p;o(a.points,function(o){m=o.graphic;if(o.plotY!==t)c=o.pointAttr[o.selected?"selected":""]||d,k=c["stroke-width"]%2/2,l=y(o.plotX)-k,e=o.plotOpen,f=o.plotClose,g=Y.min(e,f),h=Y.max(e,
f),p=y(o.shapeArgs.width/2),i=y(g)!==y(o.plotY),j=h!==o.yBottom,g=y(g)+k,h=y(h)+k,n=[],n.push("M",l-p,h,"L",l-p,g,"L",l+p,g,"L",l+p,h,"Z","M",l,g,"L",l,i?y(o.plotY):g,"M",l,h,"L",l,j?y(o.yBottom):h),m?m.attr(c).animate({d:n}):o.graphic=b.renderer.path(n).attr(c).add(a.group).shadow(a.options.shadow)})}});I.candlestick=da;var vb=xa.prototype.symbols;W.flags=z(W.column,{fillColor:"white",lineWidth:1,pointRange:0,shape:"flag",stackDistance:12,states:{hover:{lineColor:"black",fillColor:"#FCFFC5"}},style:{fontSize:"11px",
fontWeight:"bold",textAlign:"center"},tooltip:{pointFormat:"{point.text}<br/>"},threshold:null,y:-30});I.flags=ma(I.column,{type:"flags",sorted:!1,noSharedTooltip:!0,allowDG:!1,takeOrdinalPosition:!1,trackerGroups:["markerGroup"],forceCrop:!0,init:P.prototype.init,pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth",r:"radius"},translate:function(){I.column.prototype.translate.apply(this);var a=this.options,b=this.chart,c=this.points,d=c.length-1,e,f,g=a.onSeries;e=g&&b.get(g);
var a=a.onKey||"y",g=e&&e.options.step,h=e&&e.points,i=h&&h.length,j=this.xAxis,k=j.getExtremes(),l,m,n;if(e&&e.visible&&i){e=e.currentDataGrouping;m=h[i-1].x+(e?e.totalRange:0);c.sort(function(a,b){return a.x-b.x});for(a="plot"+a[0].toUpperCase()+a.substr(1);i--&&c[d];)if(e=c[d],l=h[i],l.x<=e.x&&l[a]!==void 0){if(e.x<=m)e.plotY=l[a],l.x<e.x&&!g&&(n=h[i+1])&&n[a]!==t&&(e.plotY+=(e.x-l.x)/(n.x-l.x)*(n[a]-l[a]));d--;i++;if(d<0)break}}o(c,function(a,d){var e;if(a.plotY===t)a.x>=k.min&&a.x<=k.max?a.plotY=
b.chartHeight-j.bottom-(j.opposite?j.height:0)+j.offset-b.plotTop:a.shapeArgs={};if((f=c[d-1])&&f.plotX===a.plotX){if(f.stackIndex===t)f.stackIndex=0;e=f.stackIndex+1}a.stackIndex=e})},drawPoints:function(){var a,b=this.pointAttr[""],c=this.points,d=this.chart,e=d.renderer,f,g,h=this.options,i=h.y,j,k,l,m,n,p,o=this.yAxis;for(k=c.length;k--;)if(l=c[k],a=l.plotX>this.xAxis.len,f=l.plotX,f>0&&(f-=q(l.lineWidth,h.lineWidth)%2),m=l.stackIndex,j=l.options.shape||h.shape,g=l.plotY,g!==t&&(g=l.plotY+i-(m!==
t&&m*h.stackDistance)),n=m?t:l.plotX,p=m?t:l.plotY,m=l.graphic,g!==t&&f>=0&&!a)a=l.pointAttr[l.selected?"select":""]||b,m?m.attr({x:f,y:g,r:a.r,anchorX:n,anchorY:p}):l.graphic=e.label(l.options.title||h.title||"A",f,g,j,n,p,h.useHTML).css(z(h.style,l.style)).attr(a).attr({align:j==="flag"?"left":"center",width:h.width,height:h.height}).add(this.markerGroup).shadow(h.shadow),l.tooltipPos=d.inverted?[o.len+o.pos-d.plotLeft-g,this.xAxis.len-f]:[f,g];else if(m)l.graphic=m.destroy()},drawTracker:function(){var a=
this.points;mb.drawTrackerPoint.apply(this);o(a,function(b){var c=b.graphic;c&&E(c.element,"mouseover",function(){if(b.stackIndex>0&&!b.raised)b._y=c.y,c.attr({y:b._y-8}),b.raised=!0;o(a,function(a){if(a!==b&&a.raised&&a.graphic)a.graphic.attr({y:a._y}),a.raised=!1})})})},animate:ra,buildKDTree:ra,setClip:ra});vb.flag=function(a,b,c,d,e){return["M",e&&e.anchorX||a,e&&e.anchorY||b,"L",a,b+d,a,b,a+c,b,a+c,b+d,a,b+d,"Z"]};o(["circle","square"],function(a){vb[a+"pin"]=function(b,c,d,e,f){var g=f&&f.anchorX,
f=f&&f.anchorY;a==="circle"&&e>d&&(b-=y((e-d)/2),d=e);b=vb[a](b,c,d,e);g&&f&&b.push("M",g,c>f?c:c+e,"L",g,f);return b}});Xa===B.VMLRenderer&&o(["flag","circlepin","squarepin"],function(a){lb.prototype.symbols[a]=vb[a]});var da=[].concat(Yb),wb=function(a){var b=Fa(arguments,function(a){return C(a)});if(b.length)return Math[a].apply(0,b)};da[4]=["day",[1,2,3,4]];da[5]=["week",[1,2,3]];A(R,{navigator:{handles:{backgroundColor:"#ebe7e8",borderColor:"#b2b1b6"},height:40,margin:25,maskFill:"rgba(128,179,236,0.3)",
maskInside:!0,outlineColor:"#b2b1b6",outlineWidth:1,series:{type:I.areaspline===t?"line":"areaspline",color:"#4572A7",compare:null,fillOpacity:0.05,dataGrouping:{approximation:"average",enabled:!0,groupPixelWidth:2,smoothed:!0,units:da},dataLabels:{enabled:!1,zIndex:2},id:"highcharts-navigator-series",lineColor:null,lineWidth:1,marker:{enabled:!1},pointRange:0,shadow:!1,threshold:null},xAxis:{tickWidth:0,lineWidth:0,gridLineColor:"#EEE",gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",style:{color:"#888"},
x:3,y:-4},crosshair:!1},yAxis:{gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:0.1,maxPadding:0.1,labels:{enabled:!1},crosshair:!1,title:{text:null},tickWidth:0}},scrollbar:{height:jb?20:14,barBackgroundColor:"#bfc8d1",barBorderRadius:0,barBorderWidth:1,barBorderColor:"#bfc8d1",buttonArrowColor:"#666",buttonBackgroundColor:"#ebe7e8",buttonBorderColor:"#bbb",buttonBorderRadius:0,buttonBorderWidth:1,minWidth:6,rifleColor:"#666",trackBackgroundColor:"#eeeeee",trackBorderColor:"#eeeeee",trackBorderWidth:1,
liveRedraw:ja&&!jb}});Gb.prototype={drawHandle:function(a,b){var c=this.chart.renderer,d=this.elementsToDestroy,e=this.handles,f=this.navigatorOptions.handles,f={fill:f.backgroundColor,stroke:f.borderColor,"stroke-width":1},g;this.rendered||(e[b]=c.g("navigator-handle-"+["left","right"][b]).css({cursor:"ew-resize"}).attr({zIndex:10-b}).add(),g=c.rect(-4.5,0,9,16,0,1).attr(f).add(e[b]),d.push(g),g=c.path(["M",-1.5,4,"L",-1.5,12,"M",0.5,4,"L",0.5,12]).attr(f).add(e[b]),d.push(g));e[b][this.rendered?
"animate":"attr"]({translateX:this.scrollerLeft+this.scrollbarHeight+parseInt(a,10),translateY:this.top+this.height/2-8})},drawScrollbarButton:function(a){var b=this.chart.renderer,c=this.elementsToDestroy,d=this.scrollbarButtons,e=this.scrollbarHeight,f=this.scrollbarOptions,g;this.rendered||(d[a]=b.g().add(this.scrollbarGroup),g=b.rect(-0.5,-0.5,e+1,e+1,f.buttonBorderRadius,f.buttonBorderWidth).attr({stroke:f.buttonBorderColor,"stroke-width":f.buttonBorderWidth,fill:f.buttonBackgroundColor}).add(d[a]),
c.push(g),g=b.path(["M",e/2+(a?-1:1),e/2-3,"L",e/2+(a?-1:1),e/2+3,e/2+(a?2:-2),e/2]).attr({fill:f.buttonArrowColor}).add(d[a]),c.push(g));a&&d[a].attr({translateX:this.scrollerWidth-e})},render:function(a,b,c,d){var e=this.chart,f=e.renderer,g,h,i,j,k=this.scrollbarGroup,l=this.navigatorGroup,m=this.scrollbar,l=this.xAxis,n=this.scrollbarTrack,p=this.scrollbarHeight,o=this.scrollbarEnabled,s=this.navigatorOptions,t=this.scrollbarOptions,u=t.minWidth,x=this.height,D=this.top,z=this.navigatorEnabled,
A=s.outlineWidth,B=A/2,E=0,H=this.outlineHeight,K=t.barBorderRadius,J=t.barBorderWidth,I=D+B,L=this.rendered;if(C(a)&&C(b)&&(!this.hasDragged||v(c))){this.navigatorLeft=g=q(l.left,e.plotLeft+p);this.navigatorWidth=h=q(l.len,e.plotWidth-2*p);this.scrollerLeft=i=g-p;this.scrollerWidth=j=j=h+2*p;c=q(c,l.translate(a));d=q(d,l.translate(b));if(!C(c)||S(c)===Infinity)c=0,d=j;if(!(l.translate(d,!0)-l.translate(c,!0)<e.xAxis[0].minRange)){this.zoomedMax=G(w(c,d,0),h);this.zoomedMin=G(w(this.fixedWidth?this.zoomedMax-
this.fixedWidth:G(c,d),0),h);this.range=this.zoomedMax-this.zoomedMin;c=y(this.zoomedMax);b=y(this.zoomedMin);a=c-b;if(!L){if(z)this.navigatorGroup=l=f.g("navigator").attr({zIndex:3}).add(),this.leftShade=f.rect().attr({fill:s.maskFill}).add(l),s.maskInside?this.leftShade.css({cursor:"ew-resize"}):this.rightShade=f.rect().attr({fill:s.maskFill}).add(l),this.outline=f.path().attr({"stroke-width":A,stroke:s.outlineColor}).add(l);if(o)this.scrollbarGroup=k=f.g("scrollbar").add(),m=t.trackBorderWidth,
this.scrollbarTrack=n=f.rect().attr({x:0,y:-m%2/2,fill:t.trackBackgroundColor,stroke:t.trackBorderColor,"stroke-width":m,r:t.trackBorderRadius||0,height:p}).add(k),this.scrollbar=m=f.rect().attr({y:-J%2/2,height:p,fill:t.barBackgroundColor,stroke:t.barBorderColor,"stroke-width":J,r:K}).add(k),this.scrollbarRifles=f.path().attr({stroke:t.rifleColor,"stroke-width":1}).add(k)}f=L?"animate":"attr";if(z){this.leftShade[f](s.maskInside?{x:g+b,y:D,width:c-b,height:x}:{x:g,y:D,width:b,height:x});if(this.rightShade)this.rightShade[f]({x:g+
c,y:D,width:h-c,height:x});this.outline[f]({d:["M",i,I,"L",g+b-B,I,g+b-B,I+H,"L",g+c-B,I+H,"L",g+c-B,I,i+j,I].concat(s.maskInside?["M",g+b+B,I,"L",g+c-B,I]:[])});this.drawHandle(b+B,0);this.drawHandle(c+B,1)}if(o&&k)this.drawScrollbarButton(0),this.drawScrollbarButton(1),k[f]({translateX:i,translateY:y(I+x)}),n[f]({width:j}),g=p+b,h=a-J,h<u&&(E=(u-h)/2,h=u,g-=E),this.scrollbarPad=E,m[f]({x:V(g)+J%2/2,width:h}),u=p+b+a/2-0.5,this.scrollbarRifles.attr({visibility:a>12?"visible":"hidden"})[f]({d:["M",
u-3,p/4,"L",u-3,2*p/3,"M",u,p/4,"L",u,2*p/3,"M",u+3,p/4,"L",u+3,2*p/3]});this.scrollbarPad=E;this.rendered=!0}}},addEvents:function(){var a=this.chart,b=a.container,c=this.mouseDownHandler,d=this.mouseMoveHandler,e=this.mouseUpHandler,f;f=[[b,"mousedown",c],[b,"mousemove",d],[H,"mouseup",e]];cb&&f.push([b,"touchstart",c],[b,"touchmove",d],[H,"touchend",e]);o(f,function(a){E.apply(null,a)});this._events=f;this.series&&E(this.series.xAxis,"foundExtremes",function(){a.scroller.modifyNavigatorAxisExtremes()});
E(a,"redraw",function(){var a=this.scroller,b;if(a)(b=a.baseSeries.xAxis)&&a.render(b.min,b.max)})},removeEvents:function(){o(this._events,function(a){T.apply(null,a)});this._events=t;this.navigatorEnabled&&this.baseSeries&&T(this.baseSeries,"updatedData",this.updatedDataHandler)},init:function(){var a=this,b=a.chart,c,d,e=a.scrollbarHeight,f=a.navigatorOptions,g=a.height,h=a.top,i,j=a.baseSeries;a.mouseDownHandler=function(d){var d=b.pointer.normalize(d),e=a.zoomedMin,f=a.zoomedMax,h=a.top,j=a.scrollbarHeight,
k=a.scrollerLeft,l=a.scrollerWidth,o=a.navigatorLeft,q=a.navigatorWidth,v=a.scrollbarPad,t=a.range,w=d.chartX,y=d.chartY,d=b.xAxis[0],z,A=jb?10:7;if(y>h&&y<h+g+j)if((h=!a.scrollbarEnabled||y<h+g)&&Y.abs(w-e-o)<A)a.grabbedLeft=!0,a.otherHandlePos=f,a.fixedExtreme=d.max,b.fixedRange=null;else if(h&&Y.abs(w-f-o)<A)a.grabbedRight=!0,a.otherHandlePos=e,a.fixedExtreme=d.min,b.fixedRange=null;else if(w>o+e-v&&w<o+f+v)a.grabbedCenter=w,a.fixedWidth=t,i=w-e;else if(w>k&&w<k+l){f=h?w-o-t/2:w<o?e-t*0.2:w>k+
l-j?e+t*0.2:w<o+e?e-t:f;if(f<0)f=0;else if(f+t>=q)f=q-t,z=a.getUnionExtremes().dataMax;if(f!==e)a.fixedWidth=t,e=c.toFixedRange(f,f+t,null,z),d.setExtremes(e.min,e.max,!0,!1,{trigger:"navigator"})}};a.mouseMoveHandler=function(c){var d=a.scrollbarHeight,e=a.navigatorLeft,f=a.navigatorWidth,g=a.scrollerLeft,h=a.scrollerWidth,j=a.range,k,l;if(!c.touches||c.touches[0].pageX!==0)c=b.pointer.normalize(c),k=c.chartX,k<e?k=e:k>g+h-d&&(k=g+h-d),a.grabbedLeft?(l=!0,a.render(0,0,k-e,a.otherHandlePos)):a.grabbedRight?
(l=!0,a.render(0,0,a.otherHandlePos,k-e)):a.grabbedCenter&&(l=!0,k<i?k=i:k>f+i-j&&(k=f+i-j),a.render(0,0,k-i,k-i+j)),l&&a.scrollbarOptions.liveRedraw&&setTimeout(function(){a.mouseUpHandler(c)},0),a.hasDragged=l};a.mouseUpHandler=function(d){var e,f;if(a.hasDragged){if(a.zoomedMin===a.otherHandlePos)e=a.fixedExtreme;else if(a.zoomedMax===a.otherHandlePos)f=a.fixedExtreme;if(a.zoomedMax===a.navigatorWidth)f=a.getUnionExtremes().dataMax;e=c.toFixedRange(a.zoomedMin,a.zoomedMax,e,f);v(e.min)&&b.xAxis[0].setExtremes(e.min,
e.max,!0,!1,{trigger:"navigator",triggerOp:"navigator-drag",DOMEvent:d})}if(d.type!=="mousemove")a.grabbedLeft=a.grabbedRight=a.grabbedCenter=a.fixedWidth=a.fixedExtreme=a.otherHandlePos=a.hasDragged=i=null};var k=b.xAxis.length,l=b.yAxis.length;b.extraBottomMargin=a.outlineHeight+f.margin;a.navigatorEnabled?(a.xAxis=c=new J(b,z({breaks:j&&j.xAxis.options.breaks,ordinal:j&&j.xAxis.options.ordinal},f.xAxis,{id:"navigator-x-axis",isX:!0,type:"datetime",index:k,height:g,offset:0,offsetLeft:e,offsetRight:-e,
keepOrdinalPadding:!0,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1})),a.yAxis=d=new J(b,z(f.yAxis,{id:"navigator-y-axis",alignTicks:!1,height:g,offset:0,index:l,zoomEnabled:!1})),j||f.series.data?a.addBaseSeries():b.series.length===0&&U(b,"redraw",function(c,d){if(b.series.length>0&&!a.series)a.setBaseSeries(),b.redraw=c;c.call(b,d)})):a.xAxis=c={translate:function(a,c){var d=b.xAxis[0],f=d.getExtremes(),g=b.plotWidth-2*e,h=wb("min",d.options.min,f.dataMin),d=wb("max",d.options.max,
f.dataMax)-h;return c?a*d/g+h:g*(a-h)/d},toFixedRange:J.prototype.toFixedRange};if(j&&j.xAxis&&this.navigatorOptions.adaptToUpdatedData!==!1)E(j,"updatedData",this.updatedDataHandler),E(j.xAxis,"foundExtremes",function(){j.xAxis&&this.chart.scroller.modifyBaseAxisExtremes()}),j.userOptions.events=A(j.userOptions.event,{updatedData:this.updatedDataHandler});U(b,"getMargins",function(b){var e=this.legend,f=e.options;b.apply(this,[].slice.call(arguments,1));a.top=h=a.navigatorOptions.top||this.chartHeight-
a.height-a.scrollbarHeight-this.spacing[2]-(f.verticalAlign==="bottom"&&f.enabled&&!f.floating?e.legendHeight+q(f.margin,10):0);if(c&&d)c.options.top=d.options.top=h,c.setAxisSize(),d.setAxisSize()});a.addEvents()},getUnionExtremes:function(a){var b=this.chart.xAxis[0],c=this.xAxis,d=c.options,e=b.options,f;if(!a||b.dataMin!==null)f={dataMin:q(d&&d.min,wb("min",e.min,b.dataMin,c.dataMin,c.min)),dataMax:q(d&&d.max,wb("max",e.max,b.dataMax,c.dataMax,c.max))};return f},setBaseSeries:function(a){var b=
this.chart,a=a||b.options.navigator.baseSeries;this.series&&this.series.remove();this.baseSeries=b.series[a]||typeof a==="string"&&b.get(a)||b.series[0];this.xAxis&&this.addBaseSeries()},addBaseSeries:function(){var a=this.baseSeries,b=a?a.options:{},a=b.data,c=this.navigatorOptions.series,d;d=c.data;this.hasNavigatorData=!!d;b=z(b,c,{enableMouseTracking:!1,group:"nav",padXAxis:!1,xAxis:"navigator-x-axis",yAxis:"navigator-y-axis",name:"Navigator",showInLegend:!1,stacking:!1,isInternal:!0,visible:!0});
b.data=d||a.slice(0);this.series=this.chart.initSeries(b)},modifyNavigatorAxisExtremes:function(){var a=this.xAxis,b;if(a.getExtremes&&(b=this.getUnionExtremes(!0))&&(b.dataMin!==a.min||b.dataMax!==a.max))a.min=b.dataMin,a.max=b.dataMax},modifyBaseAxisExtremes:function(){var a=this.baseSeries.xAxis,b=a.getExtremes(),c=b.dataMin,d=b.dataMax,b=b.max-b.min,e=this.stickToMin,f=this.stickToMax,g,h,i=this.series,j=!!a.setExtremes;e&&(h=c,g=h+b);f&&(g=d,e||(h=w(g-b,i?i.xData[0]:-Number.MAX_VALUE)));if(j&&
(e||f)&&C(h))a.min=a.userMin=h,a.max=a.userMax=g;this.stickToMin=this.stickToMax=null},updatedDataHandler:function(){var a=this.chart.scroller,b=a.baseSeries,c=a.series;a.stickToMin=b.xAxis.min<=b.xData[0];a.stickToMax=a.zoomedMax>=a.navigatorWidth;if(c&&!a.hasNavigatorData&&(c.options.pointStart=b.xData[0],c.setData(b.options.data,!1),c.graph&&b.graph))c.graph.shift=b.graph.shift},destroy:function(){this.removeEvents();o([this.xAxis,this.yAxis,this.leftShade,this.rightShade,this.outline,this.scrollbarTrack,
this.scrollbarRifles,this.scrollbarGroup,this.scrollbar],function(a){a&&a.destroy&&a.destroy()});this.xAxis=this.yAxis=this.leftShade=this.rightShade=this.outline=this.scrollbarTrack=this.scrollbarRifles=this.scrollbarGroup=this.scrollbar=null;o([this.scrollbarButtons,this.handles,this.elementsToDestroy],function(a){Pa(a)})}};B.Scroller=Gb;U(J.prototype,"zoom",function(a,b,c){var d=this.chart,e=d.options,f=e.chart.zoomType,g=e.navigator,e=e.rangeSelector,h;if(this.isXAxis&&(g&&g.enabled||e&&e.enabled))if(f===
"x")d.resetZoomButton="blocked";else if(f==="y")h=!1;else if(f==="xy")d=this.previousZoom,v(b)?this.previousZoom=[this.min,this.max]:d&&(b=d[0],c=d[1],delete this.previousZoom);return h!==t?h:a.call(this,b,c)});U(Ba.prototype,"init",function(a,b,c){E(this,"beforeRender",function(){var a=this.options;if(a.navigator.enabled||a.scrollbar.enabled)this.scroller=new Gb(this)});a.call(this,b,c)});U(P.prototype,"addPoint",function(a,b,c,d,e){var f=this.options.turboThreshold;f&&this.xData.length>f&&ea(b)&&
!Ja(b)&&this.chart.scroller&&ga(20,!0);a.call(this,b,c,d,e)});A(R,{rangeSelector:{buttonTheme:{width:28,height:18,fill:"#f7f7f7",padding:2,r:0,"stroke-width":0,style:{color:"#444",cursor:"pointer",fontWeight:"normal"},zIndex:7,states:{hover:{fill:"#e7e7e7"},select:{fill:"#e7f0f9",style:{color:"black",fontWeight:"bold"}}}},height:35,inputPosition:{align:"right"},labelStyle:{color:"#666"}}});R.lang=z(R.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From",rangeSelectorTo:"To"});Hb.prototype={clickButton:function(a,
b){var c=this,d=c.selected,e=c.chart,f=c.buttons,g=c.buttonOptions[a],h=e.xAxis[0],i=e.scroller&&e.scroller.getUnionExtremes()||h||{},j=i.dataMin,k=i.dataMax,l,m=h&&y(G(h.max,q(k,h.max))),n=g.type,p,i=g._range,r,s,v,u=g.dataGrouping;if(!(j===null||k===null||a===c.selected)){e.fixedRange=i;if(u)this.forcedDataGrouping=!0,J.prototype.setDataGrouping.call(h||{chart:this.chart},u,!1);if(n==="month"||n==="year")if(h){if(n={range:g,max:m,dataMin:j,dataMax:k},l=h.minFromRange.call(n),C(n.newMax))m=n.newMax}else i=
g;else if(i)l=w(m-i,j),m=G(l+i,k);else if(n==="ytd")if(h){if(k===t)j=Number.MAX_VALUE,k=Number.MIN_VALUE,o(e.series,function(a){a=a.xData;j=G(a[0],j);k=w(a[a.length-1],k)}),b=!1;m=new ba(k);l=m.getFullYear();l=r=w(j||0,ba.UTC(l,0,1));m=m.getTime();m=G(k||m,m)}else{E(e,"beforeRender",function(){c.clickButton(a)});return}else n==="all"&&h&&(l=j,m=k);f[d]&&f[d].setState(0);if(f[a])f[a].setState(2),c.lastSelected=a;h?(h.setExtremes(l,m,q(b,1),0,{trigger:"rangeSelectorButton",rangeSelectorButton:g}),c.setSelected(a)):
(p=e.options.xAxis[0],v=p.range,p.range=i,s=p.min,p.min=r,c.setSelected(a),E(e,"load",function(){p.range=v;p.min=s}))}},setSelected:function(a){this.selected=this.options.selected=a},defaultButtons:[{type:"month",count:1,text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}],init:function(a){var b=this,c=a.options.rangeSelector,d=c.buttons||[].concat(b.defaultButtons),e=c.selected,f=b.blurInputs=
function(){var a=b.minInput,c=b.maxInput;a&&a.blur&&O(a,"blur");c&&c.blur&&O(c,"blur")};b.chart=a;b.options=c;b.buttons=[];a.extraTopMargin=c.height;b.buttonOptions=d;E(a.container,"mousedown",f);E(a,"resize",f);o(d,b.computeButtonRange);e!==t&&d[e]&&this.clickButton(e,!1);E(a,"load",function(){E(a.xAxis[0],"setExtremes",function(c){this.max-this.min!==a.fixedRange&&c.trigger!=="rangeSelectorButton"&&c.trigger!=="updatedData"&&b.forcedDataGrouping&&this.setDataGrouping(!1,!1)});E(a.xAxis[0],"afterSetExtremes",
function(){b.updateButtonStates(!0)})})},updateButtonStates:function(a){var b=this,c=this.chart,d=c.xAxis[0],e=c.scroller&&c.scroller.getUnionExtremes()||d,f=e.dataMin,g=e.dataMax,h=b.selected,i=b.options.allButtonsEnabled,j=b.buttons;a&&c.fixedRange!==y(d.max-d.min)&&(j[h]&&j[h].setState(0),b.setSelected(null));o(b.buttonOptions,function(a,e){var m=y(d.max-d.min),n=a._range,o=a.type,q=a.count||1,s=n>g-f,t=n<d.minRange,u=a.type==="all"&&d.max-d.min>=g-f&&j[e].state!==2,v=a.type==="ytd"&&na("%Y",f)===
na("%Y",g),w=c.renderer.forExport&&e===h,n=n===m,z=!d.hasVisibleSeries;if((o==="month"||o==="year")&&m>={month:28,year:365}[o]*864E5*q&&m<={month:31,year:366}[o]*864E5*q)n=!0;w||n&&e!==h&&e===b.lastSelected?(b.setSelected(e),j[e].setState(2)):!i&&(s||t||u||v||z)?j[e].setState(3):j[e].state===3&&j[e].setState(0)})},computeButtonRange:function(a){var b=a.type,c=a.count||1,d={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(d[b])a._range=d[b]*c;else if(b==="month"||b==="year")a._range=
{month:30,year:365}[b]*864E5*c},setInputValue:function(a,b){var c=this.chart.options.rangeSelector;if(v(b))this[a+"Input"].HCTime=b;this[a+"Input"].value=na(c.inputEditDateFormat||"%Y-%m-%d",this[a+"Input"].HCTime);this[a+"DateBox"].attr({text:na(c.inputDateFormat||"%b %e, %Y",this[a+"Input"].HCTime)})},showInput:function(a){var b=this.inputGroup,c=this[a+"DateBox"];N(this[a+"Input"],{left:b.translateX+c.x+"px",top:b.translateY+"px",width:c.width-2+"px",height:c.height-2+"px",border:"2px solid silver"})},
hideInput:function(a){N(this[a+"Input"],{border:0,width:"1px",height:"1px"});this.setInputValue(a)},drawInput:function(a){function b(){var a=j.value,b=(g.inputDateParser||ba.parse)(a),e=d.xAxis[0],f=e.dataMin,h=e.dataMax;if(b!==j.previousValue)j.previousValue=b,C(b)||(b=a.split("-"),b=ba.UTC(K(b[0]),K(b[1])-1,K(b[2]))),C(b)&&(R.global.useUTC||(b+=(new ba).getTimezoneOffset()*6E4),i?b>c.maxInput.HCTime?b=t:b<f&&(b=f):b<c.minInput.HCTime?b=t:b>h&&(b=h),b!==t&&d.xAxis[0].setExtremes(i?b:e.min,i?e.max:
b,t,t,{trigger:"rangeSelectorInput"}))}var c=this,d=c.chart,e=d.renderer.style,f=d.renderer,g=d.options.rangeSelector,h=c.div,i=a==="min",j,k,l=this.inputGroup;this[a+"Label"]=k=f.label(R.lang[i?"rangeSelectorFrom":"rangeSelectorTo"],this.inputGroup.offset).attr({padding:2}).css(z(e,g.labelStyle)).add(l);l.offset+=k.width+5;this[a+"DateBox"]=f=f.label("",l.offset).attr({padding:2,width:g.inputBoxWidth||90,height:g.inputBoxHeight||17,stroke:g.inputBoxBorderColor||"silver","stroke-width":1}).css(z({textAlign:"center",
color:"#444"},e,g.inputStyle)).on("click",function(){c.showInput(a);c[a+"Input"].focus()}).add(l);l.offset+=f.width+(i?10:0);this[a+"Input"]=j=fa("input",{name:a,className:"highcharts-range-selector",type:"text"},A({position:"absolute",border:0,width:"1px",height:"1px",padding:0,textAlign:"center",fontSize:e.fontSize,fontFamily:e.fontFamily,left:"-9em",top:d.plotTop+"px"},g.inputStyle),h);j.onfocus=function(){c.showInput(a)};j.onblur=function(){c.hideInput(a)};j.onchange=b;j.onkeypress=function(a){a.keyCode===
13&&b()}},getPosition:function(){var a=this.chart,b=a.options.rangeSelector,a=q((b.buttonPosition||{}).y,a.plotTop-a.axisOffset[0]-b.height);return{buttonTop:a,inputTop:a-10}},render:function(a,b){var c=this,d=c.chart,e=d.renderer,f=d.container,g=d.options,h=g.exporting&&g.exporting.enabled!==!1&&g.navigation&&g.navigation.buttonOptions,i=g.rangeSelector,j=c.buttons,g=R.lang,k=c.div,k=c.inputGroup,l=i.buttonTheme,m=i.buttonPosition||{},n=i.inputEnabled,p=l&&l.states,r=d.plotLeft,s,t=this.getPosition(),
u=c.group,w=c.rendered;if(!w&&(c.group=u=e.g("range-selector-buttons").add(),c.zoomText=e.text(g.rangeSelectorZoom,q(m.x,r),15).css(i.labelStyle).add(u),s=q(m.x,r)+c.zoomText.getBBox().width+5,o(c.buttonOptions,function(a,b){j[b]=e.button(a.text,s,0,function(){c.clickButton(b);c.isActive=!0},l,p&&p.hover,p&&p.select,p&&p.disabled).css({textAlign:"center"}).add(u);s+=j[b].width+q(i.buttonSpacing,5);c.selected===b&&j[b].setState(2)}),c.updateButtonStates(),n!==!1))c.div=k=fa("div",null,{position:"relative",
height:0,zIndex:1}),f.parentNode.insertBefore(k,f),c.inputGroup=k=e.g("input-group").add(),k.offset=0,c.drawInput("min"),c.drawInput("max");u[w?"animate":"attr"]({translateY:t.buttonTop});n!==!1&&(k.align(A({y:t.inputTop,width:k.offset,x:h&&t.inputTop<(h.y||0)+h.height-d.spacing[0]?-40:0},i.inputPosition),!0,d.spacingBox),v(n)||(d=u.getBBox(),k[k.translateX<d.x+d.width+10?"hide":"show"]()),c.setInputValue("min",a),c.setInputValue("max",b));c.rendered=!0},destroy:function(){var a=this.minInput,b=this.maxInput,
c=this.chart,d=this.blurInputs,e;T(c.container,"mousedown",d);T(c,"resize",d);Pa(this.buttons);if(a)a.onfocus=a.onblur=a.onchange=null;if(b)b.onfocus=b.onblur=b.onchange=null;for(e in this)this[e]&&e!=="chart"&&(this[e].destroy?this[e].destroy():this[e].nodeType&&Ua(this[e])),this[e]=null}};J.prototype.toFixedRange=function(a,b,c,d){var e=this.chart&&this.chart.fixedRange,a=q(c,this.translate(a,!0)),b=q(d,this.translate(b,!0)),c=e&&(b-a)/e;c>0.7&&c<1.3&&(d?a=b-e:b=a+e);C(a)||(a=b=void 0);return{min:a,
max:b}};J.prototype.minFromRange=function(){var a=this.range,b={month:"Month",year:"FullYear"}[a.type],c,d=this.max,e,f,g=function(a,c){var d=new ba(a);d["set"+b](d["get"+b]()+c);return d.getTime()-a};C(a)?(c=this.max-a,f=a):c=d+g(d,-a.count);e=q(this.dataMin,Number.MIN_VALUE);C(c)||(c=e);if(c<=e)c=e,f===void 0&&(f=g(c,a.count)),this.newMax=G(c+f,this.dataMax);C(d)||(c=void 0);return c};U(Ba.prototype,"init",function(a,b,c){E(this,"init",function(){if(this.options.rangeSelector.enabled)this.rangeSelector=
new Hb(this)});a.call(this,b,c)});B.RangeSelector=Hb;Ba.prototype.callbacks.push(function(a){function b(){d=a.xAxis[0].getExtremes();C(d.min)&&f.render(d.min,d.max)}function c(a){f.render(a.min,a.max)}var d,e=a.scroller,f=a.rangeSelector;e&&(d=a.xAxis[0].getExtremes(),e.render(d.min,d.max));f&&(E(a.xAxis[0],"afterSetExtremes",c),E(a,"resize",b),b());E(a,"destroy",function(){f&&(T(a,"resize",b),T(a.xAxis[0],"afterSetExtremes",c))})});B.StockChart=B.stockChart=function(a,b,c){var d=Ca(a)||a.nodeName,
e=arguments[d?1:0],f=e.series,g,h=q(e.navigator&&e.navigator.enabled,!0)?{startOnTick:!1,endOnTick:!1}:null,i={marker:{enabled:!1,radius:2}},j={shadow:!1,borderWidth:0};e.xAxis=ta(ua(e.xAxis||{}),function(a){return z({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},labels:{overflow:"justify"},showLastLabel:!0},a,{type:"datetime",categories:null},h)});e.yAxis=ta(ua(e.yAxis||{}),function(a){g=q(a.opposite,!0);return z({labels:{y:-2},opposite:g,showLastLabel:!1,title:{text:null}},a)});e.series=
null;e=z({chart:{panning:!0,pinchType:"x"},navigator:{enabled:!0},scrollbar:{enabled:!0},rangeSelector:{enabled:!0},title:{text:null,style:{fontSize:"16px"}},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:i,spline:i,area:i,areaspline:i,arearange:i,areasplinerange:i,column:j,columnrange:j,candlestick:j,ohlc:j}},e,{_stock:!0,chart:{inverted:!1}});e.series=f;return d?new Ba(a,e,c):new Ba(e,b)};U(Ya.prototype,"init",function(a,b,c){var d=c.chart.pinchType||"";a.call(this,b,c);
this.pinchX=this.pinchHor=d.indexOf("x")!==-1;this.pinchY=this.pinchVert=d.indexOf("y")!==-1;this.hasZoom=this.hasZoom||this.pinchHor||this.pinchVert});U(J.prototype,"autoLabelAlign",function(a){var b=this.chart,c=this.options,b=b._labelPanes=b._labelPanes||{},d=this.options.labels;if(this.chart.options._stock&&this.coll==="yAxis"&&(c=c.top+","+c.height,!b[c]&&d.enabled)){if(d.x===15)d.x=0;if(d.align===void 0)d.align="right";b[c]=1;return"right"}return a.call(this,[].slice.call(arguments,1))});U(J.prototype,
"getPlotLinePath",function(a,b,c,d,e,f){var g=this,h=this.isLinked&&!this.series?this.linkedParent.series:this.series,i=g.chart,j=i.renderer,k=g.left,l=g.top,m,n,p,r,s=[],t=[],u,x;if(g.coll==="colorAxis")return a.apply(this,[].slice.call(arguments,1));t=g.isXAxis?v(g.options.yAxis)?[i.yAxis[g.options.yAxis]]:ta(h,function(a){return a.yAxis}):v(g.options.xAxis)?[i.xAxis[g.options.xAxis]]:ta(h,function(a){return a.xAxis});o(g.isXAxis?i.yAxis:i.xAxis,function(a){if(v(a.options.id)?a.options.id.indexOf("navigator")===
-1:1){var b=a.isXAxis?"yAxis":"xAxis",b=v(a.options[b])?i[b][a.options[b]]:i[b][0];g===b&&t.push(a)}});u=t.length?[]:[g.isXAxis?i.yAxis[0]:i.xAxis[0]];o(t,function(a){sa(a,u)===-1&&u.push(a)});x=q(f,g.translate(b,null,null,d));C(x)&&(g.horiz?o(u,function(a){var b;n=a.pos;r=n+a.len;m=p=y(x+g.transB);if(m<k||m>k+g.width)e?m=p=G(w(k,m),k+g.width):b=!0;b||s.push("M",m,n,"L",p,r)}):o(u,function(a){var b;m=a.pos;p=m+a.len;n=r=y(l+g.height-x);if(n<l||n>l+g.height)e?n=r=G(w(l,n),g.top+g.height):b=!0;b||s.push("M",
m,n,"L",p,r)}));return s.length>0?j.crispPolyLine(s,c||1):null});J.prototype.getPlotBandPath=function(a,b){var c=this.getPlotLinePath(b,null,null,!0),d=this.getPlotLinePath(a,null,null,!0),e=[],f;if(d&&c&&d.toString()!==c.toString())for(f=0;f<d.length;f+=6)e.push("M",d[f+1],d[f+2],"L",d[f+4],d[f+5],c[f+4],c[f+5],c[f+1],c[f+2]);else e=null;return e};xa.prototype.crispPolyLine=function(a,b){var c;for(c=0;c<a.length;c+=6)a[c+1]===a[c+4]&&(a[c+1]=a[c+4]=y(a[c+1])-b%2/2),a[c+2]===a[c+5]&&(a[c+2]=a[c+5]=
y(a[c+2])+b%2/2);return a};if(Xa===B.VMLRenderer)lb.prototype.crispPolyLine=xa.prototype.crispPolyLine;U(J.prototype,"hideCrosshair",function(a,b){a.call(this,b);if(this.crossLabel)this.crossLabel=this.crossLabel.hide()});U(J.prototype,"drawCrosshair",function(a,b,c){var d,e;a.call(this,b,c);if(v(this.crosshair.label)&&this.crosshair.label.enabled){var a=this.chart,f=this.options.crosshair.label,g=this.horiz,h=this.opposite,i=this.left,j=this.top,k=this.crossLabel,l,m=f.format,n="",o=this.options.tickPosition===
"inside",r=this.crosshair.snap!==!1;l=g?"center":h?this.labelAlign==="right"?"right":"left":this.labelAlign==="left"?"left":"center";if(!k)k=this.crossLabel=a.renderer.label(null,null,null,f.shape||"callout").attr({align:f.align||l,zIndex:12,fill:f.backgroundColor||this.series[0]&&this.series[0].color||"gray",padding:q(f.padding,8),stroke:f.borderColor||"","stroke-width":f.borderWidth||0,r:q(f.borderRadius,3)}).css(A({color:"white",fontWeight:"normal",fontSize:"11px",textAlign:"center"},f.style)).add();
g?(l=r?c.plotX+i:b.chartX,j+=h?0:this.height):(l=h?this.width+i:0,j=r?c.plotY+j:b.chartY);!m&&!f.formatter&&(this.isDatetimeAxis&&(n="%b %d, %Y"),m="{value"+(n?":"+n:"")+"}");b=r?c[this.isXAxis?"x":"y"]:this.toValue(g?b.chartX:b.chartY);k.attr({text:m?La(m,{value:b}):f.formatter.call(this,b),anchorX:g?l:this.opposite?0:a.chartWidth,anchorY:g?this.opposite?a.chartHeight:0:j,x:l,y:j,visibility:"visible"});b=k.getBBox();if(g){if(o&&!h||!o&&h)j=k.y-b.height}else j=k.y-b.height/2;g?(d=i-b.x,e=i+this.width-
b.x):(d=this.labelAlign==="left"?i:0,e=this.labelAlign==="right"?i+this.width:a.chartWidth);k.translateX<d&&(l+=d-k.translateX);k.translateX+b.width>=e&&(l-=k.translateX+b.width-e);k.attr({x:l,y:j,visibility:"visible"})}});var gc=ia.init,hc=ia.processData,ic=Ha.prototype.tooltipFormatter;ia.init=function(){gc.apply(this,arguments);this.setCompare(this.options.compare)};ia.setCompare=function(a){this.modifyValue=a==="value"||a==="percent"?function(b,c){var d=this.compareValue;if(b!==t&&(b=a==="value"?
b-d:b=100*(b/d)-100,c))c.change=b;return b}:null;if(this.chart.hasRendered)this.isDirty=!0};ia.processData=function(){var a,b=-1,c,d,e,f;hc.apply(this,arguments);if(this.xAxis&&this.processedYData){c=this.processedXData;d=this.processedYData;e=d.length;this.pointArrayMap&&(b=sa(this.pointValKey||"y",this.pointArrayMap));for(a=0;a<e;a++)if(f=b>-1?d[a][b]:d[a],C(f)&&c[a]>=this.xAxis.min&&f!==0){this.compareValue=f;break}}};U(ia,"getExtremes",function(a){var b;a.apply(this,[].slice.call(arguments,1));
if(this.modifyValue)b=[this.modifyValue(this.dataMin),this.modifyValue(this.dataMax)],this.dataMin=Ma(b),this.dataMax=Da(b)});J.prototype.setCompare=function(a,b){this.isXAxis||(o(this.series,function(b){b.setCompare(a)}),q(b,!0)&&this.chart.redraw())};Ha.prototype.tooltipFormatter=function(a){a=a.replace("{point.change}",(this.change>0?"+":"")+B.numberFormat(this.change,q(this.series.tooltipOptions.changeDecimals,2)));return ic.apply(this,[a])};U(P.prototype,"render",function(a){if(this.chart.options._stock&&
this.xAxis)!this.clipBox&&this.animate?(this.clipBox=z(this.chart.clipBox),this.clipBox.width=this.xAxis.len,this.clipBox.height=this.yAxis.len):this.chart[this.sharedClipKey]&&(Sa(this.chart[this.sharedClipKey]),this.chart[this.sharedClipKey].attr({width:this.xAxis.len,height:this.yAxis.len}));a.call(this)});A(B,{Color:va,Point:Ha,Tick:bb,Renderer:Xa,SVGElement:Z,SVGRenderer:xa,arrayMin:Ma,arrayMax:Da,charts:$,correctFloat:ka,dateFormat:na,error:ga,format:La,pathAnim:void 0,getOptions:function(){return R},
hasBidiBug:Zb,isTouchDevice:jb,setOptions:function(a){R=z(!0,R,a);Ob();return R},addEvent:E,removeEvent:T,createElement:fa,discardElement:Ua,css:N,each:o,map:ta,merge:z,splat:ua,stableSort:nb,extendClass:ma,pInt:K,svg:ja,canvas:qa,vml:!ja&&!qa,product:"Highstock",version:"4.2.5"});return B});

/*
 Highcharts JS v4.2.5 (2016-05-06)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(m){typeof module==="object"&&module.exports?module.exports=m:m(Highcharts)})(function(m){function M(a,b,c){this.init(a,b,c)}var R=m.arrayMin,S=m.arrayMax,t=m.each,H=m.extend,I=m.isNumber,u=m.merge,T=m.map,o=m.pick,B=m.pInt,G=m.correctFloat,p=m.getOptions().plotOptions,i=m.seriesTypes,v=m.extendClass,N=m.splat,w=m.wrap,O=m.Axis,z=m.Tick,J=m.Point,U=m.Pointer,V=m.CenteredSeriesMixin,C=m.TrackerMixin,x=m.Series,y=Math,F=y.round,D=y.floor,P=y.max,W=m.Color,r=function(){};H(M.prototype,{init:function(a,
b,c){var d=this,g=d.defaultOptions;d.chart=b;d.options=a=u(g,b.angular?{background:{}}:void 0,a);(a=a.background)&&t([].concat(N(a)).reverse(),function(a){var b=a.backgroundColor,g=c.userOptions,a=u(d.defaultBackgroundOptions,a);if(b)a.backgroundColor=b;a.color=a.backgroundColor;c.options.plotBands.unshift(a);g.plotBands=g.plotBands||[];g.plotBands!==c.options.plotBands&&g.plotBands.unshift(a)})},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",
borderWidth:1,borderColor:"silver",backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#DDD"]]},from:-Number.MAX_VALUE,innerRadius:0,to:Number.MAX_VALUE,outerRadius:"105%"}});var A=O.prototype,z=z.prototype,X={getOffset:r,redraw:function(){this.isDirty=!1},render:function(){this.isDirty=!1},setScale:r,setCategories:r,setTitle:r},Q={isRadial:!0,defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",
minorTickWidth:1,tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,distance:15,x:0,y:null},maxPadding:0,minPadding:0,showLastLabel:!1,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},showLastLabel:!1,title:{x:4,text:null,rotation:90}},setOptions:function(a){a=this.options=u(this.defaultOptions,this.defaultRadialOptions,a);if(!a.plotBands)a.plotBands=[]},getOffset:function(){A.getOffset.call(this);
this.chart.axisOffset[this.side]=0;this.center=this.pane.center=V.getCenter.call(this.pane)},getLinePath:function(a,b){var c=this.center,b=o(b,c[2]/2-this.offset);return this.chart.renderer.symbols.arc(this.left+c[0],this.top+c[1],b,b,{start:this.startAngleRad,end:this.endAngleRad,open:!0,innerR:0})},setAxisTranslation:function(){A.setAxisTranslation.call(this);if(this.center)this.transA=this.isCircular?(this.endAngleRad-this.startAngleRad)/(this.max-this.min||1):this.center[2]/2/(this.max-this.min||
1),this.minPixelPadding=this.isXAxis?this.transA*this.minPointOffset:0},beforeSetTickPositions:function(){this.autoConnect&&(this.max+=this.categories&&1||this.pointRange||this.closestPointRange||0)},setAxisSize:function(){A.setAxisSize.call(this);if(this.isRadial){this.center=this.pane.center=m.CenteredSeriesMixin.getCenter.call(this.pane);if(this.isCircular)this.sector=this.endAngleRad-this.startAngleRad;this.len=this.width=this.height=this.center[2]*o(this.sector,1)/2}},getPosition:function(a,
b){return this.postTranslate(this.isCircular?this.translate(a):0,o(this.isCircular?b:this.translate(a),this.center[2]/2)-this.offset)},postTranslate:function(a,b){var c=this.chart,d=this.center,a=this.startAngleRad+a;return{x:c.plotLeft+d[0]+Math.cos(a)*b,y:c.plotTop+d[1]+Math.sin(a)*b}},getPlotBandPath:function(a,b,c){var d=this.center,g=this.startAngleRad,e=d[2]/2,j=[o(c.outerRadius,"100%"),c.innerRadius,o(c.thickness,10)],l=/%$/,h,f=this.isCircular;this.options.gridLineInterpolation==="polygon"?
d=this.getPlotLinePath(a).concat(this.getPlotLinePath(b,!0)):(a=Math.max(a,this.min),b=Math.min(b,this.max),f||(j[0]=this.translate(a),j[1]=this.translate(b)),j=T(j,function(a){l.test(a)&&(a=B(a,10)*e/100);return a}),c.shape==="circle"||!f?(a=-Math.PI/2,b=Math.PI*1.5,h=!0):(a=g+this.translate(a),b=g+this.translate(b)),d=this.chart.renderer.symbols.arc(this.left+d[0],this.top+d[1],j[0],j[0],{start:Math.min(a,b),end:Math.max(a,b),innerR:o(j[1],j[0]-j[2]),open:h}));return d},getPlotLinePath:function(a,
b){var c=this,d=c.center,g=c.chart,e=c.getPosition(a),j,l,h;c.isCircular?h=["M",d[0]+g.plotLeft,d[1]+g.plotTop,"L",e.x,e.y]:c.options.gridLineInterpolation==="circle"?(a=c.translate(a))&&(h=c.getLinePath(0,a)):(t(g.xAxis,function(a){a.pane===c.pane&&(j=a)}),h=[],a=c.translate(a),d=j.tickPositions,j.autoConnect&&(d=d.concat([d[0]])),b&&(d=[].concat(d).reverse()),t(d,function(e,b){l=j.getPosition(e,a);h.push(b?"L":"M",l.x,l.y)}));return h},getTitlePosition:function(){var a=this.center,b=this.chart,
c=this.options.title;return{x:b.plotLeft+a[0]+(c.x||0),y:b.plotTop+a[1]-{high:0.5,middle:0.25,low:0}[c.align]*a[2]+(c.y||0)}}};w(A,"init",function(a,b,c){var k;var d=b.angular,g=b.polar,e=c.isX,j=d&&e,l,h;h=b.options;var f=c.pane||0;if(d){if(H(this,j?X:Q),l=!e)this.defaultRadialOptions=this.defaultRadialGaugeOptions}else if(g)H(this,Q),this.defaultRadialOptions=(l=e)?this.defaultRadialXOptions:u(this.defaultYAxisOptions,this.defaultRadialYOptions);if(d||g)b.inverted=!1,h.chart.zoomType=null;a.call(this,
b,c);if(!j&&(d||g)){a=this.options;if(!b.panes)b.panes=[];this.pane=(k=b.panes[f]=b.panes[f]||new M(N(h.pane)[f],b,this),b=k);h=b.options;this.startAngleRad=b=(h.startAngle-90)*Math.PI/180;this.endAngleRad=h=(o(h.endAngle,h.startAngle+360)-90)*Math.PI/180;this.offset=a.offset||0;if((this.isCircular=l)&&c.max===void 0&&h-b===2*Math.PI)this.autoConnect=!0}});w(A,"autoLabelAlign",function(a){if(!this.isRadial)return a.apply(this,[].slice.call(arguments,1))});w(z,"getPosition",function(a,b,c,d,g){var e=
this.axis;return e.getPosition?e.getPosition(c):a.call(this,b,c,d,g)});w(z,"getLabelPosition",function(a,b,c,d,g,e,j,l,h){var f=this.axis,k=e.y,n=20,s=e.align,i=(f.translate(this.pos)+f.startAngleRad+Math.PI/2)/Math.PI*180%360;f.isRadial?(a=f.getPosition(this.pos,f.center[2]/2+o(e.distance,-25)),e.rotation==="auto"?d.attr({rotation:i}):k===null&&(k=f.chart.renderer.fontMetrics(d.styles.fontSize).b-d.getBBox().height/2),s===null&&(f.isCircular?(this.label.getBBox().width>f.len*f.tickInterval/(f.max-
f.min)&&(n=0),s=i>n&&i<180-n?"left":i>180+n&&i<360-n?"right":"center"):s="center",d.attr({align:s})),a.x+=e.x,a.y+=k):a=a.call(this,b,c,d,g,e,j,l,h);return a});w(z,"getMarkPath",function(a,b,c,d,g,e,j){var l=this.axis;l.isRadial?(a=l.getPosition(this.pos,l.center[2]/2+d),b=["M",b,c,"L",a.x,a.y]):b=a.call(this,b,c,d,g,e,j);return b});p.arearange=u(p.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
trackByArea:!0,dataLabels:{align:null,verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},states:{hover:{halo:!1}}});i.arearange=v(i.area,{type:"arearange",pointArrayMap:["low","high"],dataLabelCollections:["dataLabel","dataLabelUpper"],toYData:function(a){return[a.low,a.high]},pointValKey:"low",deferTranslatePolar:!0,highToXY:function(a){var b=this.chart,c=this.xAxis.postTranslate(a.rectPlotX,this.yAxis.len-a.plotHigh);a.plotHighX=c.x-b.plotLeft;a.plotHigh=c.y-b.plotTop},translate:function(){var a=
this,b=a.yAxis;i.area.prototype.translate.apply(a);t(a.points,function(a){var d=a.low,g=a.high,e=a.plotY;g===null||d===null?a.isNull=!0:(a.plotLow=e,a.plotHigh=b.translate(g,0,1,0,1))});this.chart.polar&&t(this.points,function(b){a.highToXY(b)})},getGraphPath:function(){var a=this.points,b=[],c=[],d=a.length,g=x.prototype.getGraphPath,e,j,l;l=this.options;for(var h=l.step,d=a.length;d--;)e=a[d],!e.isNull&&(!a[d+1]||a[d+1].isNull)&&c.push({plotX:e.plotX,plotY:e.plotLow}),j={plotX:e.plotX,plotY:e.plotHigh,
isNull:e.isNull},c.push(j),b.push(j),!e.isNull&&(!a[d-1]||a[d-1].isNull)&&c.push({plotX:e.plotX,plotY:e.plotLow});a=g.call(this,a);if(h)h===!0&&(h="left"),l.step={left:"right",center:"center",right:"left"}[h];b=g.call(this,b);c=g.call(this,c);l.step=h;l=[].concat(a,b);!this.chart.polar&&c[0]==="M"&&(c[0]="L");this.areaPath=this.areaPath.concat(a,c);return l},drawDataLabels:function(){var a=this.data,b=a.length,c,d=[],g=x.prototype,e=this.options.dataLabels,j=e.align,l=e.verticalAlign,h=e.inside,f,
k,n=this.chart.inverted;if(e.enabled||this._hasPointLabels){for(c=b;c--;)if(f=a[c]){k=h?f.plotHigh<f.plotLow:f.plotHigh>f.plotLow;f.y=f.high;f._plotY=f.plotY;f.plotY=f.plotHigh;d[c]=f.dataLabel;f.dataLabel=f.dataLabelUpper;f.below=k;if(n){if(!j)e.align=k?"right":"left"}else if(!l)e.verticalAlign=k?"top":"bottom";e.x=e.xHigh;e.y=e.yHigh}g.drawDataLabels&&g.drawDataLabels.apply(this,arguments);for(c=b;c--;)if(f=a[c]){k=h?f.plotHigh<f.plotLow:f.plotHigh>f.plotLow;f.dataLabelUpper=f.dataLabel;f.dataLabel=
d[c];f.y=f.low;f.plotY=f._plotY;f.below=!k;if(n){if(!j)e.align=k?"left":"right"}else if(!l)e.verticalAlign=k?"bottom":"top";e.x=e.xLow;e.y=e.yLow}g.drawDataLabels&&g.drawDataLabels.apply(this,arguments)}e.align=j;e.verticalAlign=l},alignDataLabel:function(){i.column.prototype.alignDataLabel.apply(this,arguments)},setStackedPoints:r,getSymbol:r,drawPoints:r});p.areasplinerange=u(p.arearange);i.areasplinerange=v(i.arearange,{type:"areasplinerange",getPointSpline:i.spline.prototype.getPointSpline});
(function(){var a=i.column.prototype;p.columnrange=u(p.column,p.arearange,{lineWidth:1,pointRange:null});i.columnrange=v(i.arearange,{type:"columnrange",translate:function(){var b=this,c=b.yAxis,d=b.xAxis,g=d.startAngleRad,e,j=b.chart,l=b.xAxis.isRadial,h;a.translate.apply(b);t(b.points,function(a){var k=a.shapeArgs,n=b.options.minPointLength,s,i;a.plotHigh=h=c.translate(a.high,0,1,0,1);a.plotLow=a.plotY;i=h;s=o(a.rectPlotY,a.plotY)-h;Math.abs(s)<n?(n-=s,s+=n,i-=n/2):s<0&&(s*=-1,i-=s);l?(e=a.barX+
g,a.shapeType="path",a.shapeArgs={d:b.polarArc(i+s,i,e,e+a.pointWidth)}):(k.height=s,k.y=i,a.tooltipPos=j.inverted?[c.len+c.pos-j.plotLeft-i-s/2,d.len+d.pos-j.plotTop-k.x-k.width/2,s]:[d.left-j.plotLeft+k.x+k.width/2,c.pos-j.plotTop+i+s/2,s])})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:r,crispCol:a.crispCol,pointAttrToOptions:a.pointAttrToOptions,drawPoints:a.drawPoints,drawTracker:a.drawTracker,getColumnMetrics:a.getColumnMetrics,animate:function(){return a.animate.apply(this,
arguments)},polarArc:function(){return a.polarArc.apply(this,arguments)}})})();p.gauge=u(p.line,{dataLabels:{enabled:!0,defer:!1,y:15,borderWidth:1,borderColor:"silver",borderRadius:3,crop:!1,verticalAlign:"top",zIndex:2},dial:{},pivot:{},tooltip:{headerFormat:""},showInLegend:!1});C={type:"gauge",pointClass:v(J,{setState:function(a){this.state=a}}),angular:!0,directTouch:!0,drawGraph:r,fixedBox:!0,forceDL:!0,trackerGroups:["group","dataLabelsGroup"],translate:function(){var a=this.yAxis,b=this.options,
c=a.center;this.generatePoints();t(this.points,function(d){var g=u(b.dial,d.dial),e=B(o(g.radius,80))*c[2]/200,j=B(o(g.baseLength,70))*e/100,l=B(o(g.rearLength,10))*e/100,h=g.baseWidth||3,f=g.topWidth||1,k=b.overshoot,n=a.startAngleRad+a.translate(d.y,null,null,null,!0);I(k)?(k=k/180*Math.PI,n=Math.max(a.startAngleRad-k,Math.min(a.endAngleRad+k,n))):b.wrap===!1&&(n=Math.max(a.startAngleRad,Math.min(a.endAngleRad,n)));n=n*180/Math.PI;d.shapeType="path";d.shapeArgs={d:g.path||["M",-l,-h/2,"L",j,-h/
2,e,-f/2,e,f/2,j,h/2,-l,h/2,"z"],translateX:c[0],translateY:c[1],rotation:n};d.plotX=c[0];d.plotY=c[1]})},drawPoints:function(){var a=this,b=a.yAxis.center,c=a.pivot,d=a.options,g=d.pivot,e=a.chart.renderer;t(a.points,function(b){var g=b.graphic,c=b.shapeArgs,f=c.d,k=u(d.dial,b.dial);g?(g.animate(c),c.d=f):b.graphic=e[b.shapeType](c).attr({stroke:k.borderColor||"none","stroke-width":k.borderWidth||0,fill:k.backgroundColor||"black",rotation:c.rotation,zIndex:1}).add(a.group)});c?c.animate({translateX:b[0],
translateY:b[1]}):a.pivot=e.circle(0,0,o(g.radius,5)).attr({"stroke-width":g.borderWidth||0,stroke:g.borderColor||"silver",fill:g.backgroundColor||"black",zIndex:2}).translate(b[0],b[1]).add(a.group)},animate:function(a){var b=this;if(!a)t(b.points,function(a){var d=a.graphic;d&&(d.attr({rotation:b.yAxis.startAngleRad*180/Math.PI}),d.animate({rotation:a.shapeArgs.rotation},b.options.animation))}),b.animate=null},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",
this.options.zIndex,this.chart.seriesGroup);x.prototype.render.call(this);this.group.clip(this.chart.clipRect)},setData:function(a,b){x.prototype.setData.call(this,a,!1);this.processData();this.generatePoints();o(b,!0)&&this.chart.redraw()},drawTracker:C&&C.drawTrackerPoint};i.gauge=v(i.line,C);p.boxplot=u(p.column,{fillColor:"#FFFFFF",lineWidth:1,medianWidth:2,states:{hover:{brightness:-0.3}},threshold:null,tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},
whiskerLength:"50%",whiskerWidth:2});i.boxplot=v(i.column,{type:"boxplot",pointArrayMap:["low","q1","median","q3","high"],toYData:function(a){return[a.low,a.q1,a.median,a.q3,a.high]},pointValKey:"high",pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth"},drawDataLabels:r,translate:function(){var a=this.yAxis,b=this.pointArrayMap;i.column.prototype.translate.apply(this);t(this.points,function(c){t(b,function(b){c[b]!==null&&(c[b+"Plot"]=a.translate(c[b],0,1,0,1))})})},drawPoints:function(){var a=
this,b=a.options,c=a.chart.renderer,d,g,e,j,l,h,f,k,n,i,m,K,L,p,u,r,w,v,x,y,C,B,z=a.doQuartiles!==!1,A,E=a.options.whiskerLength;t(a.points,function(q){n=q.graphic;C=q.shapeArgs;m={};p={};r={};B=q.color||a.color;if(q.plotY!==void 0)if(d=q.pointAttr[q.selected?"selected":""],w=C.width,v=D(C.x),x=v+w,y=F(w/2),g=D(z?q.q1Plot:q.lowPlot),e=D(z?q.q3Plot:q.lowPlot),j=D(q.highPlot),l=D(q.lowPlot),m.stroke=q.stemColor||b.stemColor||B,m["stroke-width"]=o(q.stemWidth,b.stemWidth,b.lineWidth),m.dashstyle=q.stemDashStyle||
b.stemDashStyle,p.stroke=q.whiskerColor||b.whiskerColor||B,p["stroke-width"]=o(q.whiskerWidth,b.whiskerWidth,b.lineWidth),r.stroke=q.medianColor||b.medianColor||B,r["stroke-width"]=o(q.medianWidth,b.medianWidth,b.lineWidth),f=m["stroke-width"]%2/2,k=v+y+f,i=["M",k,e,"L",k,j,"M",k,g,"L",k,l],z&&(f=d["stroke-width"]%2/2,k=D(k)+f,g=D(g)+f,e=D(e)+f,v+=f,x+=f,K=["M",v,e,"L",v,g,"L",x,g,"L",x,e,"L",v,e,"z"]),E&&(f=p["stroke-width"]%2/2,j+=f,l+=f,A=/%$/.test(E)?y*parseFloat(E)/100:E/2,L=["M",k-A,j,"L",k+
A,j,"M",k-A,l,"L",k+A,l]),f=r["stroke-width"]%2/2,h=F(q.medianPlot)+f,u=["M",v,h,"L",x,h],n)q.stem.animate({d:i}),E&&q.whiskers.animate({d:L}),z&&q.box.animate({d:K}),q.medianShape.animate({d:u});else{q.graphic=n=c.g().add(a.group);q.stem=c.path(i).attr(m).add(n);if(E)q.whiskers=c.path(L).attr(p).add(n);if(z)q.box=c.path(K).attr(d).add(n);q.medianShape=c.path(u).attr(r).add(n)}})},setStackedPoints:r});p.errorbar=u(p.boxplot,{color:"#000000",grouping:!1,linkedTo:":previous",tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
whiskerWidth:null});i.errorbar=v(i.boxplot,{type:"errorbar",pointArrayMap:["low","high"],toYData:function(a){return[a.low,a.high]},pointValKey:"high",doQuartiles:!1,drawDataLabels:i.arearange?i.arearange.prototype.drawDataLabels:r,getColumnMetrics:function(){return this.linkedParent&&this.linkedParent.columnMetrics||i.column.prototype.getColumnMetrics.call(this)}});p.waterfall=u(p.column,{lineWidth:1,lineColor:"#333",dashStyle:"dot",borderColor:"#333",dataLabels:{inside:!0},states:{hover:{lineWidthPlus:0}}});
i.waterfall=v(i.column,{type:"waterfall",upColorProp:"fill",pointValKey:"y",translate:function(){var a=this.options,b=this.yAxis,c,d,g,e,j,l,h,f,k,n=o(a.minPointLength,5),s=a.threshold,m=a.stacking;i.column.prototype.translate.apply(this);this.minPointLengthOffset=0;h=f=s;d=this.points;for(c=0,a=d.length;c<a;c++){g=d[c];l=this.processedYData[c];e=g.shapeArgs;k=(j=m&&b.stacks[(this.negStacks&&l<s?"-":"")+this.stackKey])?j[g.x].points[this.index+","+c]:[0,l];if(g.isSum)g.y=G(l);else if(g.isIntermediateSum)g.y=
G(l-f);j=P(h,h+g.y)+k[0];e.y=b.translate(j,0,1);if(g.isSum)e.y=b.translate(k[1],0,1),e.height=Math.min(b.translate(k[0],0,1),b.len)-e.y+this.minPointLengthOffset;else if(g.isIntermediateSum)e.y=b.translate(k[1],0,1),e.height=Math.min(b.translate(f,0,1),b.len)-e.y+this.minPointLengthOffset,f=k[1];else{if(h!==0)e.height=l>0?b.translate(h,0,1)-e.y:b.translate(h,0,1)-b.translate(h-l,0,1);h+=l}e.height<0&&(e.y+=e.height,e.height*=-1);g.plotY=e.y=F(e.y)-this.borderWidth%2/2;e.height=P(F(e.height),0.001);
g.yBottom=e.y+e.height;if(e.height<=n)e.height=n,this.minPointLengthOffset+=n;e.y-=this.minPointLengthOffset;e=g.plotY+(g.negative?e.height:0)-this.minPointLengthOffset;this.chart.inverted?g.tooltipPos[0]=b.len-e:g.tooltipPos[1]=e}},processData:function(a){var b=this.yData,c=this.options.data,d,g=b.length,e,j,l,h,f,k;j=e=l=h=this.options.threshold||0;for(k=0;k<g;k++)f=b[k],d=c&&c[k]?c[k]:{},f==="sum"||d.isSum?b[k]=G(j):f==="intermediateSum"||d.isIntermediateSum?b[k]=G(e):(j+=f,e+=f),l=Math.min(j,
l),h=Math.max(j,h);x.prototype.processData.call(this,a);this.dataMin=l;this.dataMax=h},toYData:function(a){return a.isSum?a.x===0?null:"sum":a.isIntermediateSum?a.x===0?null:"intermediateSum":a.y},getAttribs:function(){i.column.prototype.getAttribs.apply(this,arguments);var a=this,b=a.options,c=b.states,d=b.upColor||a.color,b=m.Color(d).brighten(0.1).get(),g=u(a.pointAttr),e=a.upColorProp;g[""][e]=d;g.hover[e]=c.hover.upColor||b;g.select[e]=c.select.upColor||d;t(a.points,function(e){if(!e.options.color)e.y>
0?(e.pointAttr=g,e.color=d):e.pointAttr=a.pointAttr})},getGraphPath:function(){var a=this.data,b=a.length,c=F(this.options.lineWidth+this.borderWidth)%2/2,d=[],g,e,j;for(j=1;j<b;j++)e=a[j].shapeArgs,g=a[j-1].shapeArgs,e=["M",g.x+g.width,g.y+c,"L",e.x,g.y+c],a[j-1].y<0&&(e[2]+=g.height,e[5]+=g.height),d=d.concat(e);return d},getExtremes:r,drawGraph:x.prototype.drawGraph});p.polygon=u(p.scatter,{marker:{enabled:!1}});i.polygon=v(i.scatter,{type:"polygon",fillGraph:!0,getSegmentPath:function(a){return x.prototype.getSegmentPath.call(this,
a).concat("z")},drawGraph:x.prototype.drawGraph,drawLegendSymbol:m.LegendSymbolMixin.drawRectangle});p.bubble=u(p.scatter,{dataLabels:{formatter:function(){return this.point.z},inside:!0,verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1},minSize:8,maxSize:"20%",softThreshold:!1,states:{hover:{halo:{size:5}}},tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},turboThreshold:0,zThreshold:0,zoneAxis:"z"});C=v(J,{haloPath:function(){return J.prototype.haloPath.call(this,this.shapeArgs.r+
this.series.options.states.hover.halo.size)},ttBelow:!1});i.bubble=v(i.scatter,{type:"bubble",pointClass:C,pointArrayMap:["y","z"],parallelArrays:["x","y","z"],trackerGroups:["group","dataLabelsGroup"],bubblePadding:!0,zoneAxis:"z",pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor"},applyOpacity:function(a){var b=this.options.marker,c=o(b.fillOpacity,0.5),a=a||b.fillColor||this.color;c!==1&&(a=W(a).setOpacity(c).get("rgba"));return a},convertAttribs:function(){var a=
x.prototype.convertAttribs.apply(this,arguments);a.fill=this.applyOpacity(a.fill);return a},getRadii:function(a,b,c,d){var g,e,j,l=this.zData,h=[],f=this.options,k=f.sizeBy!=="width",n=f.zThreshold,i=b-a;for(e=0,g=l.length;e<g;e++)j=l[e],f.sizeByAbsoluteValue&&j!==null&&(j=Math.abs(j-n),b=Math.max(b-n,Math.abs(a-n)),a=0),j===null?j=null:j<a?j=c/2-1:(j=i>0?(j-a)/i:0.5,k&&j>=0&&(j=Math.sqrt(j)),j=y.ceil(c+j*(d-c))/2),h.push(j);this.radii=h},animate:function(a){var b=this.options.animation;if(!a)t(this.points,
function(a){var d=a.graphic,a=a.shapeArgs;d&&a&&(d.attr("r",1),d.animate({r:a.r},b))}),this.animate=null},translate:function(){var a,b=this.data,c,d,g=this.radii;i.scatter.prototype.translate.call(this);for(a=b.length;a--;)c=b[a],d=g?g[a]:0,I(d)&&d>=this.minPxSize/2?(c.shapeType="circle",c.shapeArgs={x:c.plotX,y:c.plotY,r:d},c.dlBox={x:c.plotX-d,y:c.plotY-d,width:2*d,height:2*d}):c.shapeArgs=c.plotY=c.dlBox=void 0},drawLegendSymbol:function(a,b){var c=this.chart.renderer,d=c.fontMetrics(a.itemStyle.fontSize).f/
2;b.legendSymbol=c.circle(d,a.baseline-d,d).attr({zIndex:3}).add(b.legendGroup);b.legendSymbol.isMarker=!0},drawPoints:i.column.prototype.drawPoints,alignDataLabel:i.column.prototype.alignDataLabel,buildKDTree:r,applyZones:r});O.prototype.beforePadding=function(){var a=this,b=this.len,c=this.chart,d=0,g=b,e=this.isXAxis,j=e?"xData":"yData",l=this.min,h={},f=y.min(c.plotWidth,c.plotHeight),k=Number.MAX_VALUE,n=-Number.MAX_VALUE,i=this.max-l,m=b/i,p=[];t(this.series,function(b){var g=b.options;if(b.bubblePadding&&
(b.visible||!c.options.chart.ignoreHiddenSeries))if(a.allowZoomOutside=!0,p.push(b),e)t(["minSize","maxSize"],function(a){var b=g[a],e=/%$/.test(b),b=B(b);h[a]=e?f*b/100:b}),b.minPxSize=h.minSize,b.maxPxSize=h.maxSize,b=b.zData,b.length&&(k=o(g.zMin,y.min(k,y.max(R(b),g.displayNegative===!1?g.zThreshold:-Number.MAX_VALUE))),n=o(g.zMax,y.max(n,S(b))))});t(p,function(b){var c=b[j],f=c.length,h;e&&b.getRadii(k,n,b.minPxSize,b.maxPxSize);if(i>0)for(;f--;)I(c[f])&&a.dataMin<=c[f]&&c[f]<=a.dataMax&&(h=
b.radii[f],d=Math.min((c[f]-l)*m-h,d),g=Math.max((c[f]-l)*m+h,g))});p.length&&i>0&&!this.isLog&&(g-=b,m*=(b+d-g)/b,t([["min","userMin",d],["max","userMax",g]],function(b){o(a.options[b[0]],a[b[1]])===void 0&&(a[b[0]]+=b[2]/m)}))};(function(){function a(a,b){var c=this.chart,d=this.options.animation,h=this.group,f=this.markerGroup,k=this.xAxis.center,i=c.plotLeft,m=c.plotTop;if(c.polar){if(c.renderer.isSVG)d===!0&&(d={}),b?(c={translateX:k[0]+i,translateY:k[1]+m,scaleX:0.001,scaleY:0.001},h.attr(c),
f&&f.attr(c)):(c={translateX:i,translateY:m,scaleX:1,scaleY:1},h.animate(c,d),f&&f.animate(c,d),this.animate=null)}else a.call(this,b)}var b=x.prototype,c=U.prototype,d;b.searchPointByAngle=function(a){var b=this.chart,c=this.xAxis.pane.center;return this.searchKDTree({clientX:180+Math.atan2(a.chartX-c[0]-b.plotLeft,a.chartY-c[1]-b.plotTop)*(-180/Math.PI)})};w(b,"buildKDTree",function(a){if(this.chart.polar)this.kdByAngle?this.searchPoint=this.searchPointByAngle:this.kdDimensions=2;a.apply(this)});
b.toXY=function(a){var b,c=this.chart,d=a.plotX;b=a.plotY;a.rectPlotX=d;a.rectPlotY=b;b=this.xAxis.postTranslate(a.plotX,this.yAxis.len-b);a.plotX=a.polarPlotX=b.x-c.plotLeft;a.plotY=a.polarPlotY=b.y-c.plotTop;this.kdByAngle?(c=(d/Math.PI*180+this.xAxis.pane.options.startAngle)%360,c<0&&(c+=360),a.clientX=c):a.clientX=a.plotX};i.spline&&w(i.spline.prototype,"getPointSpline",function(a,b,c,d){var h,f,k,i,m,p,o;if(this.chart.polar){h=c.plotX;f=c.plotY;a=b[d-1];k=b[d+1];this.connectEnds&&(a||(a=b[b.length-
2]),k||(k=b[1]));if(a&&k)i=a.plotX,m=a.plotY,b=k.plotX,p=k.plotY,i=(1.5*h+i)/2.5,m=(1.5*f+m)/2.5,k=(1.5*h+b)/2.5,o=(1.5*f+p)/2.5,b=Math.sqrt(Math.pow(i-h,2)+Math.pow(m-f,2)),p=Math.sqrt(Math.pow(k-h,2)+Math.pow(o-f,2)),i=Math.atan2(m-f,i-h),m=Math.atan2(o-f,k-h),o=Math.PI/2+(i+m)/2,Math.abs(i-o)>Math.PI/2&&(o-=Math.PI),i=h+Math.cos(o)*b,m=f+Math.sin(o)*b,k=h+Math.cos(Math.PI+o)*p,o=f+Math.sin(Math.PI+o)*p,c.rightContX=k,c.rightContY=o;d?(c=["C",a.rightContX||a.plotX,a.rightContY||a.plotY,i||h,m||
f,h,f],a.rightContX=a.rightContY=null):c=["M",h,f]}else c=a.call(this,b,c,d);return c});w(b,"translate",function(a){var b=this.chart;a.call(this);if(b.polar&&(this.kdByAngle=b.tooltip&&b.tooltip.shared,!this.preventPostTranslate)){a=this.points;for(b=a.length;b--;)this.toXY(a[b])}});w(b,"getGraphPath",function(a,b){var c=this;if(this.chart.polar){b=b||this.points;if(this.options.connectEnds!==!1&&b[0]&&b[0].y!==null)this.connectEnds=!0,b.splice(b.length,0,b[0]);t(b,function(a){a.polarPlotY===void 0&&
c.toXY(a)})}return a.apply(this,[].slice.call(arguments,1))});w(b,"animate",a);if(i.column)d=i.column.prototype,d.polarArc=function(a,b,c,d){var h=this.xAxis.center,f=this.yAxis.len;return this.chart.renderer.symbols.arc(h[0],h[1],f-b,null,{start:c,end:d,innerR:f-o(a,f)})},w(d,"animate",a),w(d,"translate",function(a){var b=this.xAxis,c=b.startAngleRad,d,h,f;this.preventPostTranslate=!0;a.call(this);if(b.isRadial){d=this.points;for(f=d.length;f--;)h=d[f],a=h.barX+c,h.shapeType="path",h.shapeArgs={d:this.polarArc(h.yBottom,
h.plotY,a,a+h.pointWidth)},this.toXY(h),h.tooltipPos=[h.plotX,h.plotY],h.ttBelow=h.plotY>b.center[1]}}),w(d,"alignDataLabel",function(a,c,d,i,h,f){if(this.chart.polar){a=c.rectPlotX/Math.PI*180;if(i.align===null)i.align=a>20&&a<160?"left":a>200&&a<340?"right":"center";if(i.verticalAlign===null)i.verticalAlign=a<45||a>315?"bottom":a>135&&a<225?"top":"middle";b.alignDataLabel.call(this,c,d,i,h,f)}else a.call(this,c,d,i,h,f)});w(c,"getCoordinates",function(a,b){var c=this.chart,d={xAxis:[],yAxis:[]};
c.polar?t(c.axes,function(a){var f=a.isXAxis,g=a.center,i=b.chartX-g[0]-c.plotLeft,g=b.chartY-g[1]-c.plotTop;d[f?"xAxis":"yAxis"].push({axis:a,value:a.translate(f?Math.PI-Math.atan2(i,g):Math.sqrt(Math.pow(i,2)+Math.pow(g,2)),!0)})}):d=a.call(this,b);return d})})()});

/*
 Highstock JS v4.2.5 (2016-05-06)
 Exporting module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(f){typeof module==="object"&&module.exports?module.exports=f:f(Highcharts)})(function(f){var t=f.win,k=t.document,C=f.Chart,v=f.addEvent,D=f.removeEvent,E=f.fireEvent,s=f.createElement,u=f.discardElement,x=f.css,l=f.merge,q=f.each,r=f.extend,F=f.splat,G=Math.max,H=f.isTouchDevice,I=f.Renderer.prototype.symbols,A=f.getOptions(),B;r(A.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",
contextButtonTitle:"Chart context menu"});A.navigation={menuStyle:{border:"1px solid #A0A0A0",background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:H?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}};
A.exporting={type:"image/png",url:"http://export.highcharts.com/",printMaxWidth:780,buttons:{contextButton:{menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},
{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};f.post=function(a,b,e){var c,a=s("form",l({method:"post",action:a,enctype:"multipart/form-data"},e),{display:"none"},k.body);for(c in b)s("input",{type:"hidden",name:c,value:b[c]},null,a);a.submit();u(a)};r(C.prototype,{sanitizeSVG:function(a){return a.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,
'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g," xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad").replace(/<IMG /g,"<image ").replace(/<(\/?)TITLE>/g,"<$1title>").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,'width="$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href="$1"/>').replace(/ id=([^" >]+)/g,
' id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g," ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(a){return a.toLowerCase()})},getChartHTML:function(){return this.container.innerHTML},getSVG:function(a){var b=this,e,c,g,j,h,d=l(b.options,a),m=d.exporting.allowHTML;if(!k.createElementNS)k.createElementNS=function(a,b){return k.createElement(b)};c=s("div",null,{position:"absolute",top:"-9999em",width:b.chartWidth+"px",height:b.chartHeight+"px"},k.body);
g=b.renderTo.style.width;h=b.renderTo.style.height;g=d.exporting.sourceWidth||d.chart.width||/px$/.test(g)&&parseInt(g,10)||600;h=d.exporting.sourceHeight||d.chart.height||/px$/.test(h)&&parseInt(h,10)||400;r(d.chart,{animation:!1,renderTo:c,forExport:!0,renderer:"SVGRenderer",width:g,height:h});d.exporting.enabled=!1;delete d.data;d.series=[];q(b.series,function(a){j=l(a.userOptions,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:a.visible});j.isInternal||d.series.push(j)});a&&q(["xAxis",
"yAxis"],function(b){q(F(a[b]),function(a,c){d[b][c]=l(d[b][c],a)})});e=new f.Chart(d,b.callback);q(["xAxis","yAxis"],function(a){q(b[a],function(b,c){var d=e[a][c],f=b.getExtremes(),g=f.userMin,f=f.userMax;d&&(g!==void 0||f!==void 0)&&d.setExtremes(g,f,!0,!1)})});g=e.getChartHTML();d=null;e.destroy();u(c);if(m&&(c=g.match(/<\/svg>(.*?$)/)))c='<foreignObject x="0" y="0" width="200" height="200"><body xmlns="http://www.w3.org/1999/xhtml">'+c[1]+"</body></foreignObject>",g=g.replace("</svg>",c+"</svg>");
g=this.sanitizeSVG(g);return g=g.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1").replace(/&quot;/g,"'")},getSVGForExport:function(a,b){var e=this.options.exporting;return this.getSVG(l({chart:{borderRadius:0}},e.chartOptions,b,{exporting:{sourceWidth:a&&a.sourceWidth||e.sourceWidth,sourceHeight:a&&a.sourceHeight||e.sourceHeight}}))},exportChart:function(a,b){var e=this.getSVGForExport(a,b),a=l(this.options.exporting,a);f.post(a.url,{filename:a.filename||"chart",type:a.type,width:a.width||0,scale:a.scale||
2,svg:e},a.formAttributes)},print:function(){var a=this,b=a.container,e=[],c=b.parentNode,f=k.body,j=f.childNodes,h=a.options.exporting.printMaxWidth,d,m,n;if(!a.isPrinting){a.isPrinting=!0;a.pointer.reset(null,0);E(a,"beforePrint");if(n=h&&a.chartWidth>h)d=a.hasUserSize,m=[a.chartWidth,a.chartHeight,!1],a.setSize(h,a.chartHeight,!1);q(j,function(a,b){if(a.nodeType===1)e[b]=a.style.display,a.style.display="none"});f.appendChild(b);t.focus();t.print();setTimeout(function(){c.appendChild(b);q(j,function(a,
b){if(a.nodeType===1)a.style.display=e[b]});a.isPrinting=!1;if(n)a.setSize.apply(a,m),a.hasUserSize=d;E(a,"afterPrint")},1E3)}},contextMenu:function(a,b,e,c,f,j,h){var d=this,m=d.options.navigation,n=m.menuItemStyle,o=d.chartWidth,p=d.chartHeight,l="cache-"+a,i=d[l],w=G(f,j),y,z,t,u=function(b){d.pointer.inClass(b.target,a)||z()};if(!i)d[l]=i=s("div",{className:a},{position:"absolute",zIndex:1E3,padding:w+"px"},d.container),y=s("div",null,r({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",
boxShadow:"3px 3px 10px #888"},m.menuStyle),i),z=function(){x(i,{display:"none"});h&&h.setState(0);d.openMenu=!1},v(i,"mouseleave",function(){t=setTimeout(z,500)}),v(i,"mouseenter",function(){clearTimeout(t)}),v(k,"mouseup",u),v(d,"destroy",function(){D(k,"mouseup",u)}),q(b,function(a){if(a){var b=a.separator?s("hr",null,null,y):s("div",{onmouseover:function(){x(this,m.menuItemHoverStyle)},onmouseout:function(){x(this,n)},onclick:function(b){b&&b.stopPropagation();z();a.onclick&&a.onclick.apply(d,
arguments)},innerHTML:a.text||d.options.lang[a.textKey]},r({cursor:"pointer"},n),y);d.exportDivElements.push(b)}}),d.exportDivElements.push(y,i),d.exportMenuWidth=i.offsetWidth,d.exportMenuHeight=i.offsetHeight;b={display:"block"};e+d.exportMenuWidth>o?b.right=o-e-f-w+"px":b.left=e-w+"px";c+j+d.exportMenuHeight>p&&h.alignOptions.verticalAlign!=="top"?b.bottom=p-c-w+"px":b.top=c+j-w+"px";x(i,b);d.openMenu=!0},addButton:function(a){var b=this,e=b.renderer,c=l(b.options.navigation.buttonOptions,a),g=
c.onclick,j=c.menuItems,h,d,m={stroke:c.symbolStroke,fill:c.symbolFill},n=c.symbolSize||12;if(!b.btnCount)b.btnCount=0;if(!b.exportDivElements)b.exportDivElements=[],b.exportSVGElements=[];if(c.enabled!==!1){var o=c.theme,p=o.states,k=p&&p.hover,p=p&&p.select,i;delete o.states;g?i=function(a){a.stopPropagation();g.call(b,a)}:j&&(i=function(){b.contextMenu(d.menuClassName,j,d.translateX,d.translateY,d.width,d.height,d);d.setState(2)});c.text&&c.symbol?o.paddingLeft=f.pick(o.paddingLeft,25):c.text||
r(o,{width:c.width,height:c.height,padding:0});d=e.button(c.text,0,0,i,o,k,p).attr({title:b.options.lang[c._titleKey],"stroke-linecap":"round",zIndex:3});d.menuClassName=a.menuClassName||"highcharts-menu-"+b.btnCount++;c.symbol&&(h=e.symbol(c.symbol,c.symbolX-n/2,c.symbolY-n/2,n,n).attr(r(m,{"stroke-width":c.symbolStrokeWidth||1,zIndex:1})).add(d));d.add().align(r(c,{width:d.width,x:f.pick(c.x,B)}),!0,"spacingBox");B+=(d.width+c.buttonSpacing)*(c.align==="right"?-1:1);b.exportSVGElements.push(d,h)}},
destroyExport:function(a){var a=a.target,b,e;for(b=0;b<a.exportSVGElements.length;b++)if(e=a.exportSVGElements[b])e.onclick=e.ontouchstart=null,a.exportSVGElements[b]=e.destroy();for(b=0;b<a.exportDivElements.length;b++)e=a.exportDivElements[b],D(e,"mouseleave"),a.exportDivElements[b]=e.onmouseout=e.onmouseover=e.ontouchstart=e.onclick=null,u(e)}});I.menu=function(a,b,e,c){return["M",a,b+2.5,"L",a+e,b+2.5,"M",a,b+c/2+0.5,"L",a+e,b+c/2+0.5,"M",a,b+c-1.5,"L",a+e,b+c-1.5]};C.prototype.callbacks.push(function(a){var b,
e=a.options.exporting,c=e.buttons;B=0;if(e.enabled!==!1){for(b in c)a.addButton(c[b]);v(a,"destroy",a.destroyExport)}})});

if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports){
  module.exports = 'highcharts-ng';
}

(function () {
  'use strict';
  /*global angular: false, Highcharts: false */


  angular.module('highcharts-ng', [])
    .provider('highchartsNG', highchartsNGProvider)
    .directive('highchart', ['highchartsNG', '$timeout', highchart]);
  
  function highchartsNGProvider(){
    var modules = [];
    var basePath = false;
    var lazyLoad = false;
    return {
      HIGHCHART: 'highcharts.js',
      HIGHSTOCK: 'stock/highstock.js',
      basePath: function (p) {
        basePath = p;
      },
      lazyLoad: function (list) {
        if (list === undefined) {
          modules = [this.HIGHCHART];
        } else {
          modules = list;
        }
        lazyLoad = true;
      },
      $get: ['$window', '$rootScope', function ($window, $rootScope) {
        if (!basePath) {
          basePath = (window.location.protocol === 'https:' ? 'https' : 'http') + '://code.highcharts.com/';
        }
        return highchartsNG($window, $rootScope, lazyLoad, basePath, modules);
      }]
    };
  }
  function highchartsNG($window, $rootScope, lazyload, basePath, modules) {
    var readyQueue = [];
    var loading = false;
    return {
      lazyLoad:lazyload,
      ready: function (callback, thisArg) {
        if (typeof $window.Highcharts !== 'undefined' || !lazyload) {
          callback();
        } else {
          readyQueue.push([callback, thisArg]);
          if (loading) {
            return;
          }
          loading = true;
          var self = this;
          if (typeof jQuery === 'undefined') {
            modules.unshift('adapters/standalone-framework.js');
          }
          var doWork = function () {
            if (modules.length === 0) {
              loading = false;
              $rootScope.$apply(function () {
                angular.forEach(readyQueue, function (e) {
                  // invoke callback passing 'thisArg'
                  e[0].apply(e[1], []);
                });
              });
            } else {
              var s = modules.shift();
              self.loadScript(s, doWork);
            }
          };
          doWork();
        }
      },
      loadScript: function (path, callback) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = basePath + path;
        s.onload = callback;
        document.getElementsByTagName('body')[0].appendChild(s);
      },
      //IE8 support
      indexOf: function (arr, find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += arr.length;
        if (i < 0) i = 0;
        for (var n = arr.length; i < n; i++)
          if (i in arr && arr[i] === find)
            return i;
        return -1;
      },

      prependMethod: function (obj, method, func) {
        var original = obj[method];
        obj[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          func.apply(this, args);
          if (original) {
            return original.apply(this, args);
          } else {
            return;
          }

        };
      },

      deepExtend: function deepExtend(destination, source) {
        //Slightly strange behaviour in edge cases (e.g. passing in non objects)
        //But does the job for current use cases.
        if (angular.isArray(source)) {
          destination = angular.isArray(destination) ? destination : [];
          for (var i = 0; i < source.length; i++) {
            destination[i] = deepExtend(destination[i] || {}, source[i]);
          }
        } else if (angular.isObject(source)) {
          destination = angular.isObject(destination) ? destination : {};
          for (var property in source) {
            destination[property] = deepExtend(destination[property] || {}, source[property]);
          }
        } else {
          destination = source;
        }
        return destination;
      }
    };
  }

  function highchart(highchartsNGUtils, $timeout) {

    // acceptable shared state
    var seriesId = 0;
    var ensureIds = function (series) {
      var changed = false;
      angular.forEach(series, function(s) {
        if (!angular.isDefined(s.id)) {
          s.id = 'series-' + seriesId++;
          changed = true;
        }
      });
      return changed;
    };

    // immutable
    var axisNames = [ 'xAxis', 'yAxis' ];
    var chartTypeMap = {
      'stock': 'StockChart',
      'map':   'Map',
      'chart': 'Chart'
    };

    var getMergedOptions = function (scope, element, config) {
      var mergedOptions = {};

      var defaultOptions = {
        chart: {
          events: {}
        },
        title: {},
        subtitle: {},
        series: [],
        credits: {},
        plotOptions: {},
        navigator: {enabled: false},
        xAxis: {
          events: {}
        },
        yAxis: {
          events: {}
        }
      };

      if (config.options) {
        mergedOptions = highchartsNGUtils.deepExtend(defaultOptions, config.options);
      } else {
        mergedOptions = defaultOptions;
      }
      mergedOptions.chart.renderTo = element[0];

      angular.forEach(axisNames, function(axisName) {
        if(angular.isDefined(config[axisName])) {
          mergedOptions[axisName] = highchartsNGUtils.deepExtend(mergedOptions[axisName] || {}, config[axisName]);

          if(angular.isDefined(config[axisName].currentMin) ||
              angular.isDefined(config[axisName].currentMax)) {

            highchartsNGUtils.prependMethod(mergedOptions.chart.events, 'selection', function(e){
              var thisChart = this;
              if (e[axisName]) {
                scope.$apply(function () {
                  scope.config[axisName].currentMin = e[axisName][0].min;
                  scope.config[axisName].currentMax = e[axisName][0].max;
                });
              } else {
                //handle reset button - zoom out to all
                scope.$apply(function () {
                  scope.config[axisName].currentMin = thisChart[axisName][0].dataMin;
                  scope.config[axisName].currentMax = thisChart[axisName][0].dataMax;
                });
              }
            });

            highchartsNGUtils.prependMethod(mergedOptions.chart.events, 'addSeries', function(e){
              scope.config[axisName].currentMin = this[axisName][0].min || scope.config[axisName].currentMin;
              scope.config[axisName].currentMax = this[axisName][0].max || scope.config[axisName].currentMax;
            });
            highchartsNGUtils.prependMethod(mergedOptions[axisName].events, 'setExtremes', function (e) {
              if (e.trigger && e.trigger !== 'zoom') { // zoom trigger is handled by selection event
                $timeout(function () {
                  scope.config[axisName].currentMin = e.min;
                  scope.config[axisName].currentMax = e.max;
                  scope.config[axisName].min = e.min; // set min and max to adjust scrollbar/navigator
                  scope.config[axisName].max = e.max;
                }, 0);
              }
            });
          }
        }
      });

      if(config.title) {
        mergedOptions.title = config.title;
      }
      if (config.subtitle) {
        mergedOptions.subtitle = config.subtitle;
      }
      if (config.credits) {
        mergedOptions.credits = config.credits;
      }
      if(config.size) {
        if (config.size.width) {
          mergedOptions.chart.width = config.size.width;
        }
        if (config.size.height) {
          mergedOptions.chart.height = config.size.height;
        }
      }
      return mergedOptions;
    };

    var updateZoom = function (axis, modelAxis) {
      var extremes = axis.getExtremes();
      if(modelAxis.currentMin !== extremes.dataMin || modelAxis.currentMax !== extremes.dataMax) {
        if (axis.setExtremes) {
          axis.setExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
        } else {
          axis.detachedsetExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
        }
      }
    };

    var processExtremes = function(chart, axis, axisName) {
      if(axis.currentMin || axis.currentMax) {
        chart[axisName][0].setExtremes(axis.currentMin, axis.currentMax, true);
      }
    };

    var chartOptionsWithoutEasyOptions = function (options) {
      return angular.extend(
        highchartsNGUtils.deepExtend({}, options),
        { data: null, visible: null }
      );
    };

    var getChartType = function(scope) {
      if (scope.config === undefined) return 'Chart';
      return chartTypeMap[('' + scope.config.chartType).toLowerCase()] ||
             (scope.config.useHighStocks ? 'StockChart' : 'Chart');
    };

    var res = {
      restrict: 'EAC',
      replace: true,
      template: '<div></div>',
      scope: {
        config: '=',
        disableDataWatch: '='
      },
      link: function (scope, element, attrs) {
        // We keep some chart-specific variables here as a closure
        // instead of storing them on 'scope'.

        // prevSeriesOptions is maintained by processSeries
        var prevSeriesOptions = {};

        var processSeries = function(series) {
          var i;
          var ids = [];

          if(series) {
            var setIds = ensureIds(series);
            if(setIds && !scope.disableDataWatch) {
              //If we have set some ids this will trigger another digest cycle.
              //In this scenario just return early and let the next cycle take care of changes
              return false;
            }

            //Find series to add or update
            angular.forEach(series, function(s) {
              ids.push(s.id);
              var chartSeries = chart.get(s.id);
              if (chartSeries) {
                if (!angular.equals(prevSeriesOptions[s.id], chartOptionsWithoutEasyOptions(s))) {
                  chartSeries.update(angular.copy(s), false);
                } else {
                  if (s.visible !== undefined && chartSeries.visible !== s.visible) {
                    chartSeries.setVisible(s.visible, false);
                  }
                  chartSeries.setData(angular.copy(s.data), false);
                }
              } else {
                chart.addSeries(angular.copy(s), false);
              }
              prevSeriesOptions[s.id] = chartOptionsWithoutEasyOptions(s);
            });

            //  Shows no data text if all series are empty
            if(scope.config.noData) {
              var chartContainsData = false;

              for(i = 0; i < series.length; i++) {
                if (series[i].data && series[i].data.length > 0) {
                  chartContainsData = true;

                  break;
                }
              }

              if (!chartContainsData) {
                chart.showLoading(scope.config.noData);
              } else {
                chart.hideLoading();
              }
            }
          }

          //Now remove any missing series
          for(i = chart.series.length - 1; i >= 0; i--) {
            var s = chart.series[i];
            if (s.options.id !== 'highcharts-navigator-series' && highchartsNGUtils.indexOf(ids, s.options.id) < 0) {
              s.remove(false);
            }
          }

          return true;
        };

        // chart is maintained by initChart
        var chart = false;
        var initChart = function() {
          if (chart) chart.destroy();
          prevSeriesOptions = {};
          var config = scope.config || {};
          var mergedOptions = getMergedOptions(scope, element, config);
          var func = config.func || undefined;
          var chartType = getChartType(scope);

          chart = new Highcharts[chartType](mergedOptions, func);

          for (var i = 0; i < axisNames.length; i++) {
            if (config[axisNames[i]]) {
              processExtremes(chart, config[axisNames[i]], axisNames[i]);
            }
          }
          if(config.loading) {
            chart.showLoading();
          }
          config.getHighcharts = function() {
            return chart;
          };

        };
        initChart();


        if(scope.disableDataWatch){
          scope.$watchCollection('config.series', function (newSeries, oldSeries) {
            processSeries(newSeries);
            chart.redraw();
          });
        } else {
          scope.$watch('config.series', function (newSeries, oldSeries) {
            var needsRedraw = processSeries(newSeries);
            if(needsRedraw) {
              chart.redraw();
            }
          }, true);
        }

        scope.$watch('config.title', function (newTitle) {
          chart.setTitle(newTitle, true);
        }, true);

        scope.$watch('config.subtitle', function (newSubtitle) {
          chart.setTitle(true, newSubtitle);
        }, true);

        scope.$watch('config.loading', function (loading) {
          if(loading) {
            chart.showLoading(loading === true ? null : loading);
          } else {
            chart.hideLoading();
          }
        });
        scope.$watch('config.noData', function (noData) {
          if(scope.config && scope.config.loading) {
            chart.showLoading(noData);
          }
        }, true);

        scope.$watch('config.credits.enabled', function (enabled) {
          if (enabled) {
            chart.credits.show();
          } else if (chart.credits) {
            chart.credits.hide();
          }
        });

        scope.$watch(getChartType, function (chartType, oldChartType) {
          if (chartType === oldChartType) return;
          initChart();
        });

        angular.forEach(axisNames, function(axisName) {
          scope.$watch('config.' + axisName, function(newAxes, oldAxes) {
            if (newAxes === oldAxes || !newAxes) {
              return;
            }

            if (angular.isArray(newAxes)) {

              for (var axisIndex = 0; axisIndex < newAxes.length; axisIndex++) {
                var axis = newAxes[axisIndex];

                if (axisIndex < chart[axisName].length) {
                  chart[axisName][axisIndex].update(axis, false);
                  updateZoom(chart[axisName][axisIndex], angular.copy(axis));
                }

              }

            } else {
              // update single axis
              chart[axisName][0].update(newAxes, false);
              updateZoom(chart[axisName][0], angular.copy(newAxes));
            }

            chart.redraw();
          }, true);
        });
        scope.$watch('config.options', function (newOptions, oldOptions, scope) {
          //do nothing when called on registration
          if (newOptions === oldOptions) return;
          initChart();
          processSeries(scope.config.series);
          chart.redraw();
        }, true);

        scope.$watch('config.size', function (newSize, oldSize) {
          if(newSize === oldSize) return;
          if(newSize) {
            chart.setSize(newSize.width || chart.chartWidth, newSize.height || chart.chartHeight);
          }
        }, true);

        scope.$on('highchartsng.reflow', function () {
          chart.reflow();
        });

        scope.$on('$destroy', function() {
          if (chart) {
            try{
              chart.destroy();
            }catch(ex){
              // fail silently as highcharts will throw exception if element doesn't exist
            }

            $timeout(function(){
              element.remove();
            }, 0);
          }
        });

      }
    };
    
    // override link fn if lazy loading is enabled
    if(highchartsNGUtils.lazyLoad){
      var oldLink = res.link;
      res.link = function(){
        var args = arguments;
        highchartsNGUtils.ready(function(){
          oldLink.apply(this, args);
        }, this);
      };
    }
    return res;
  }
}());

/*!
 * ngImgCropExtended v0.6.2
 * http://crackerakiua.github.io/ngImgCropFullExtended/
 *
 * Copyright (c) 2016 Alex Kaul
 * License: MIT
 *
 * Generated at Thursday, October 20th, 2016, 3:43:09 PM
 */
(function() {
var crop = angular.module('ngImgCrop', []);

crop.factory('cropAreaCircle', ['cropArea', function(CropArea) {
    var CropAreaCircle = function() {
        CropArea.apply(this, arguments);

        this._boxResizeBaseSize = 25;
        this._boxResizeNormalRatio = 1;
        this._boxResizeHoverRatio = 1.2;
        this._iconMoveNormalRatio = 0.9;
        this._iconMoveHoverRatio = 1.2;

        this._boxResizeNormalSize = this._boxResizeBaseSize * this._boxResizeNormalRatio;
        this._boxResizeHoverSize = this._boxResizeBaseSize * this._boxResizeHoverRatio;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
        this._posResizeStartX = 0;
        this._posResizeStartY = 0;
        this._posResizeStartSize = 0;

        this._boxResizeIsHover = false;
        this._areaIsHover = false;
        this._boxResizeIsDragging = false;
        this._areaIsDragging = false;
    };

    CropAreaCircle.prototype = new CropArea();

    CropAreaCircle.prototype.getType = function() {
        return 'circle';
    };

    CropAreaCircle.prototype._calcCirclePerimeterCoords = function(angleDegrees) {
        var hSize = this._size.w / 2;
        var angleRadians = angleDegrees * (Math.PI / 180),
            circlePerimeterX = this.getCenterPoint().x + hSize * Math.cos(angleRadians),
            circlePerimeterY = this.getCenterPoint().y + hSize * Math.sin(angleRadians);
        return [circlePerimeterX, circlePerimeterY];
    };

    CropAreaCircle.prototype._calcResizeIconCenterCoords = function() {
        return this._calcCirclePerimeterCoords(-45);
    };

    CropAreaCircle.prototype._isCoordWithinArea = function(coord) {
        return Math.sqrt((coord[0] - this.getCenterPoint().x) * (coord[0] - this.getCenterPoint().x) + (coord[1] - this.getCenterPoint().y) * (coord[1] - this.getCenterPoint().y)) < this._size.w / 2;
    };
    CropAreaCircle.prototype._isCoordWithinBoxResize = function(coord) {
        var resizeIconCenterCoords = this._calcResizeIconCenterCoords();
        var hSize = this._boxResizeHoverSize / 2;
        return (coord[0] > resizeIconCenterCoords[0] - hSize && coord[0] < resizeIconCenterCoords[0] + hSize &&
            coord[1] > resizeIconCenterCoords[1] - hSize && coord[1] < resizeIconCenterCoords[1] + hSize);
    };

    CropAreaCircle.prototype._drawArea = function(ctx, centerCoords, size) {
        ctx.arc(centerCoords.x, centerCoords.y, size.w / 2, 0, 2 * Math.PI);
    };

    CropAreaCircle.prototype.draw = function() {
        CropArea.prototype.draw.apply(this, arguments);

        // draw move icon
        var center = this.getCenterPoint();
        this._cropCanvas.drawIconMove([center.x, center.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);

        // draw resize cubes
        this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(), this._boxResizeBaseSize, this._boxResizeIsHover ? this._boxResizeHoverRatio : this._boxResizeNormalRatio);
    };

    CropAreaCircle.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
        var cursor = 'default';
        var res = false;

        this._boxResizeIsHover = false;
        this._areaIsHover = false;

        if (this._areaIsDragging) {
            this.setCenterPointOnMove({
                x: mouseCurX - this._posDragStartX,
                y: mouseCurY - this._posDragStartY
            });
            this._areaIsHover = true;
            cursor = 'move';
            res = true;
            this._events.trigger('area-move');
        } else if (this._boxResizeIsDragging) {
            cursor = 'nesw-resize';
            var iFR, iFX, iFY;
            iFX = mouseCurX - this._posResizeStartX;
            iFY = this._posResizeStartY - mouseCurY;
            if (iFX > iFY) {
                iFR = this._posResizeStartSize.w + iFY * 2;
            } else {
                iFR = this._posResizeStartSize.w + iFX * 2;
            }

            var center = this.getCenterPoint(),
                newNO = {},
                newSE = {};

            newNO.x = this.getCenterPoint().x - iFR * 0.5;
            newSE.x = this.getCenterPoint().x + iFR * 0.5;

            newNO.y = this.getCenterPoint().y - iFR * 0.5;
            newSE.y = this.getCenterPoint().y + iFR * 0.5;

            this.CircleOnMove(newNO, newSE);
            this._boxResizeIsHover = true;
            res = true;
            this._events.trigger('area-resize');
        } else if (this._isCoordWithinBoxResize([mouseCurX, mouseCurY])) {
            cursor = 'nesw-resize';
            this._areaIsHover = false;
            this._boxResizeIsHover = true;
            res = true;
        } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
            cursor = 'move';
            this._areaIsHover = true;
            res = true;
        }

        //this._dontDragOutside();
        angular.element(this._ctx.canvas).css({
            'cursor': cursor
        });

        return res;
    };

    CropAreaCircle.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
        if (this._isCoordWithinBoxResize([mouseDownX, mouseDownY])) {
            this._areaIsDragging = false;
            this._areaIsHover = false;
            this._boxResizeIsDragging = true;
            this._boxResizeIsHover = true;
            this._posResizeStartX = mouseDownX;
            this._posResizeStartY = mouseDownY;
            this._posResizeStartSize = this._size;
            this._events.trigger('area-resize-start');
        } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
            this._areaIsDragging = true;
            this._areaIsHover = true;
            this._boxResizeIsDragging = false;
            this._boxResizeIsHover = false;
            var center = this.getCenterPoint();
            this._posDragStartX = mouseDownX - center.x;
            this._posDragStartY = mouseDownY - center.y;
            this._events.trigger('area-move-start');
        }
    };

    CropAreaCircle.prototype.processMouseUp = function( /*mouseUpX, mouseUpY*/ ) {
        if (this._areaIsDragging) {
            this._areaIsDragging = false;
            this._events.trigger('area-move-end');
        }
        if (this._boxResizeIsDragging) {
            this._boxResizeIsDragging = false;
            this._events.trigger('area-resize-end');
        }
        this._areaIsHover = false;
        this._boxResizeIsHover = false;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
    };

    return CropAreaCircle;
}]);

crop.factory('cropAreaRectangle', ['cropArea', function (CropArea) {
    var CropAreaRectangle = function () {
        CropArea.apply(this, arguments);

        this._resizeCtrlBaseRadius = 15;
        this._resizeCtrlNormalRatio = 0.6;
        this._resizeCtrlHoverRatio = 0.70;
        this._iconMoveNormalRatio = 0.9;
        this._iconMoveHoverRatio = 1.2;

        this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
        this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
        this._posResizeStartX = 0;
        this._posResizeStartY = 0;
        this._posResizeStartSize = {
            w: 0,
            h: 0
        };

        this._resizeCtrlIsHover = -1;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = -1;
        this._areaIsDragging = false;
    };

    CropAreaRectangle.prototype = new CropArea();

    // return a type string
    CropAreaRectangle.prototype.getType = function () {
        return 'rectangle';
    };

    CropAreaRectangle.prototype._calcRectangleCorners = function () {
        var size = this.getSize();
        var se = this.getSouthEastBound();
        return [
            [size.x, size.y], //northwest
            [se.x, size.y], //northeast
            [size.x, se.y], //southwest
            [se.x, se.y] //southeast
        ];
    };

    CropAreaRectangle.prototype._calcRectangleDimensions = function () {
        var size = this.getSize();
        var se = this.getSouthEastBound();
        return {
            left: size.x,
            top: size.y,
            right: se.x,
            bottom: se.y
        };
    };

    CropAreaRectangle.prototype._isCoordWithinArea = function (coord) {
        var rectangleDimensions = this._calcRectangleDimensions();
        return (coord[0] >= rectangleDimensions.left && coord[0] <= rectangleDimensions.right && coord[1] >= rectangleDimensions.top && coord[1] <= rectangleDimensions.bottom);
    };

    CropAreaRectangle.prototype._isCoordWithinResizeCtrl = function (coord) {
        var resizeIconsCenterCoords = this._calcRectangleCorners();
        var res = -1;
        for (var i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
            var resizeIconCenterCoords = resizeIconsCenterCoords[i];
            if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius &&
                coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
                res = i;
                break;
            }
        }
        return res;
    };

    CropAreaRectangle.prototype._drawArea = function (ctx, center, size) {
        ctx.rect(size.x, size.y, size.w, size.h);
    };

    CropAreaRectangle.prototype.draw = function () {
        CropArea.prototype.draw.apply(this, arguments);

        var center = this.getCenterPoint();
        // draw move icon
        this._cropCanvas.drawIconMove([center.x, center.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);

        // draw resize thumbs
        var resizeIconsCenterCoords = this._calcRectangleCorners();
        for (var i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
            var resizeIconCenterCoords = resizeIconsCenterCoords[i];
            this._cropCanvas.drawIconResizeBoxBase(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        }
    };

    CropAreaRectangle.prototype.processMouseMove = function (mouseCurX, mouseCurY) {
        var cursor = 'default';
        var res = false;

        this._resizeCtrlIsHover = -1;
        this._areaIsHover = false;

        if (this._areaIsDragging) {
            this.setCenterPointOnMove({
                x: mouseCurX - this._posDragStartX,
                y: mouseCurY - this._posDragStartY
            });
            this._areaIsHover = true;
            cursor = 'move';
            res = true;
            this._events.trigger('area-move');
        } else if (this._resizeCtrlIsDragging > -1) {
            var s = this.getSize();
            var se = this.getSouthEastBound();
            var posX = mouseCurX;
            switch (this._resizeCtrlIsDragging) {
                case 0: // Top Left
                    if (this._aspect) {
                        posX = se.x - ((se.y - mouseCurY) * this._aspect);
                    }
                    this.setSizeByCorners({
                        x: posX,
                        y: mouseCurY
                    }, {
                        x: se.x,
                        y: se.y
                    });
                    cursor = 'nwse-resize';
                    break;
                case 1: // Top Right
                    if (this._aspect) {
                        posX = s.x + ((se.y - mouseCurY) * this._aspect);
                    }
                    this.setSizeByCorners({
                        x: s.x,
                        y: mouseCurY
                    }, {
                        x: posX,
                        y: se.y
                    });
                    cursor = 'nesw-resize';
                    break;
                case 2: // Bottom Left
                    if (this._aspect) {
                        posX = se.x - ((mouseCurY - s.y) * this._aspect);
                    }
                    this.setSizeByCorners({
                        x: posX,
                        y: s.y
                    }, {
                        x: se.x,
                        y: mouseCurY
                    });
                    cursor = 'nesw-resize';
                    break;
                case 3: // Bottom Right
                    if (this._aspect) {
                        posX = s.x + ((mouseCurY - s.y) * this._aspect);
                    }
                    this.setSizeByCorners({
                        x: s.x,
                        y: s.y
                    }, {
                        x: posX,
                        y: mouseCurY
                    });
                    cursor = 'nwse-resize';
                    break;
            }

            this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
            res = true;
            this._events.trigger('area-resize');
        } else {
            var hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
            if (hoveredResizeBox > -1) {
                switch (hoveredResizeBox) {
                    case 0:
                        cursor = 'nwse-resize';
                        break;
                    case 1:
                        cursor = 'nesw-resize';
                        break;
                    case 2:
                        cursor = 'nesw-resize';
                        break;
                    case 3:
                        cursor = 'nwse-resize';
                        break;
                }
                this._areaIsHover = false;
                this._resizeCtrlIsHover = hoveredResizeBox;
                res = true;
            } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
                cursor = 'move';
                this._areaIsHover = true;
                res = true;
            }
        }

        angular.element(this._ctx.canvas).css({
            'cursor': cursor
        });

        return res;
    };

    CropAreaRectangle.prototype.processMouseDown = function (mouseDownX, mouseDownY) {
        var isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
        if (isWithinResizeCtrl > -1) {
            this._areaIsDragging = false;
            this._areaIsHover = false;
            this._resizeCtrlIsDragging = isWithinResizeCtrl;
            this._resizeCtrlIsHover = isWithinResizeCtrl;
            this._posResizeStartX = mouseDownX;
            this._posResizeStartY = mouseDownY;
            this._posResizeStartSize = this._size;
            this._events.trigger('area-resize-start');
        } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
            this._areaIsDragging = true;
            this._areaIsHover = true;
            this._resizeCtrlIsDragging = -1;
            this._resizeCtrlIsHover = -1;
            var center = this.getCenterPoint();
            this._posDragStartX = mouseDownX - center.x;
            this._posDragStartY = mouseDownY - center.y;
            this._events.trigger('area-move-start');
        }
    };

    CropAreaRectangle.prototype.processMouseUp = function (/*mouseUpX, mouseUpY*/) {
        if (this._areaIsDragging) {
            this._areaIsDragging = false;
            this._events.trigger('area-move-end');
        }
        if (this._resizeCtrlIsDragging > -1) {
            this._resizeCtrlIsDragging = -1;
            this._events.trigger('area-resize-end');
        }
        this._areaIsHover = false;
        this._resizeCtrlIsHover = -1;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
    };

    return CropAreaRectangle;
}]);

crop.factory('cropAreaSquare', ['cropArea', function(CropArea) {
    var CropAreaSquare = function() {
        CropArea.apply(this, arguments);

        this._resizeCtrlBaseRadius = 15;
        this._resizeCtrlNormalRatio = 0.6;
        this._resizeCtrlHoverRatio = 0.70;
        this._iconMoveNormalRatio = 0.9;
        this._iconMoveHoverRatio = 1.2;

        this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
        this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
        this._posResizeStartX = 0;
        this._posResizeStartY = 0;
        this._posResizeStartSize = 0;

        this._resizeCtrlIsHover = -1;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = -1;
        this._areaIsDragging = false;
    };

    CropAreaSquare.prototype = new CropArea();

    CropAreaSquare.prototype.getType = function() {
        return 'square';
    };

    CropAreaSquare.prototype._calcSquareCorners = function() {
        var size = this.getSize(),
            se = this.getSouthEastBound();
        return [
            [size.x, size.y], //northwest
            [se.x, size.y], //northeast
            [size.x, se.y], //southwest
            [se.x, se.y] //southeast
        ];
    };

    CropAreaSquare.prototype._calcSquareDimensions = function() {
        var size = this.getSize(),
            se = this.getSouthEastBound();
        return {
            left: size.x,
            top: size.y,
            right: se.x,
            bottom: se.y
        };
    };

    CropAreaSquare.prototype._isCoordWithinArea = function(coord) {
        var squareDimensions = this._calcSquareDimensions();
        return (coord[0] >= squareDimensions.left && coord[0] <= squareDimensions.right && coord[1] >= squareDimensions.top && coord[1] <= squareDimensions.bottom);
    };

    CropAreaSquare.prototype._isCoordWithinResizeCtrl = function(coord) {
        var resizeIconsCenterCoords = this._calcSquareCorners();
        var res = -1;
        for (var i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
            var resizeIconCenterCoords = resizeIconsCenterCoords[i];
            if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius &&
                coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
                res = i;
                break;
            }
        }
        return res;
    };

    CropAreaSquare.prototype._drawArea = function(ctx, centerCoords, size) {
        var hSize = size / 2;
        ctx.rect(size.x, size.y, size.w, size.h);
    };

    CropAreaSquare.prototype.draw = function() {
        CropArea.prototype.draw.apply(this, arguments);

        // draw move icon
        var center = this.getCenterPoint();
        this._cropCanvas.drawIconMove([center.x, center.y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);

        // draw resize cubes
        var resizeIconsCenterCoords = this._calcSquareCorners();
        for (var i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
            var resizeIconCenterCoords = resizeIconsCenterCoords[i];
            this._cropCanvas.drawIconResizeBoxBase(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        }
    };

    CropAreaSquare.prototype._clampPoint = function(x, y) {
        var size = this._ctx.canvas.width;

        if(x < 0) {
            y -= Math.abs(x);
            x = 0;
        }

        if(y < 0) {
            x -= Math.abs(y);
            y = 0;
        }

        if(x > size) {
            y -= (size - x);
            x = size;
        }

        if(y > size) {
            x -= (size - y);
            y = size;
        }

        return {
            x: x,
            y: y
        };
    };

    CropAreaSquare.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
        var cursor = 'default';
        var res = false;

        this._resizeCtrlIsHover = -1;
        this._areaIsHover = false;

        if (this._areaIsDragging) {
            this.setCenterPointOnMove({
                x: mouseCurX - this._posDragStartX,
                y: mouseCurY - this._posDragStartY
            });
            this._areaIsHover = true;
            cursor = 'move';
            res = true;
            this._events.trigger('area-move');
        } else if (this._resizeCtrlIsDragging > -1) {
            var xMulti, yMulti;
            switch (this._resizeCtrlIsDragging) {
                case 0: // Top Left
                    xMulti = -1;
                    yMulti = -1;
                    cursor = 'nwse-resize';
                    break;
                case 1: // Top Right
                    xMulti = 1;
                    yMulti = -1;
                    cursor = 'nesw-resize';
                    break;
                case 2: // Bottom Left
                    xMulti = -1;
                    yMulti = 1;
                    cursor = 'nesw-resize';
                    break;
                case 3: // Bottom Right
                    xMulti = 1;
                    yMulti = 1;
                    cursor = 'nwse-resize';
                    break;
            }
            var iFX = (mouseCurX - this._posResizeStartX) * xMulti,
                iFY = (mouseCurY - this._posResizeStartY) * yMulti,
                iFR;
            if (iFX > iFY) {
                iFR = this._posResizeStartSize.w + iFY;
            } else {
                iFR = this._posResizeStartSize.w + iFX;
            }
            var newSize = Math.max(this._minSize.w, iFR),
                newNO = {},
                newSE = {},
                newSO = {},
                newNE = {},
                s = this.getSize(),
                se = this.getSouthEastBound();

            switch (this._resizeCtrlIsDragging) {
                case 0: // Top Left
                    newNO.x = se.x - newSize;
                    newNO.y = se.y - newSize;

                    newNO = this._clampPoint(newNO.x, newNO.y);

                    this.setSizeByCorners(newNO, {
                        x: se.x,
                        y: se.y
                    });

                    cursor = 'nwse-resize';
                    break;
                case 1: // Top Right

                    newNE.x = s.x + newSize;
                    newNE.y = se.y - newSize;

                    newNE = this._clampPoint(newNE.x, newNE.y);

                    this.setSizeByCorners({
                        x: s.x,
                        y: newNE.y
                    }, {
                        x: newNE.x,
                        y: se.y
                    });

                    cursor = 'nesw-resize';
                    break;
                case 2: // Bottom Left
                    newSO.x = se.x - newSize;
                    newSO.y = s.y + newSize;

                    newSO = this._clampPoint(newSO.x, newSO.y);

                    this.setSizeByCorners({
                        x: newSO.x,
                        y: s.y
                    }, {
                        x: se.x,
                        y: newSO.y
                    });

                    cursor = 'nesw-resize';
                    break;
                case 3: // Bottom Right

                    newSE.x = s.x + newSize;
                    newSE.y = s.y + newSize;

                    newSE = this._clampPoint(newSE.x, newSE.y);

                    this.setSizeByCorners({
                        x: s.x,
                        y: s.y
                    }, newSE);

                    cursor = 'nwse-resize';
                    break;
            }
            this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
            res = true;
            this._events.trigger('area-resize');
        } else {
            var hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
            if (hoveredResizeBox > -1) {
                switch (hoveredResizeBox) {
                    case 0:
                        cursor = 'nwse-resize';
                        break;
                    case 1:
                        cursor = 'nesw-resize';
                        break;
                    case 2:
                        cursor = 'nesw-resize';
                        break;
                    case 3:
                        cursor = 'nwse-resize';
                        break;
                }
                this._areaIsHover = false;
                this._resizeCtrlIsHover = hoveredResizeBox;
                res = true;
            } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
                cursor = 'move';
                this._areaIsHover = true;
                res = true;
            }
        }

        angular.element(this._ctx.canvas).css({
            'cursor': cursor
        });

        return res;
    };

    CropAreaSquare.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
        var isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
        if (isWithinResizeCtrl > -1) {
            this._areaIsDragging = false;
            this._areaIsHover = false;
            this._resizeCtrlIsDragging = isWithinResizeCtrl;
            this._resizeCtrlIsHover = isWithinResizeCtrl;
            this._posResizeStartX = mouseDownX;
            this._posResizeStartY = mouseDownY;
            this._posResizeStartSize = this._size;
            this._events.trigger('area-resize-start');
        } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
            this._areaIsDragging = true;
            this._areaIsHover = true;
            this._resizeCtrlIsDragging = -1;
            this._resizeCtrlIsHover = -1;
            var center = this.getCenterPoint();
            this._posDragStartX = mouseDownX - center.x;
            this._posDragStartY = mouseDownY - center.y;
            this._events.trigger('area-move-start');
        }
    };

    CropAreaSquare.prototype.processMouseUp = function( /*mouseUpX, mouseUpY*/ ) {
        if (this._areaIsDragging) {
            this._areaIsDragging = false;
            this._events.trigger('area-move-end');
        }
        if (this._resizeCtrlIsDragging > -1) {
            this._resizeCtrlIsDragging = -1;
            this._events.trigger('area-resize-end');
        }
        this._areaIsHover = false;
        this._resizeCtrlIsHover = -1;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
    };

    return CropAreaSquare;
}]);

crop.factory('cropArea', ['cropCanvas', function (CropCanvas) {
    var CropArea = function (ctx, events) {
        this._ctx = ctx;
        this._events = events;

        this._minSize = {
            x: 0,
            y: 0,
            w: 80,
            h: 80
        };

        this._initSize = undefined;
        this._initCoords = undefined;
        this._allowCropResizeOnCorners = false;

        this._forceAspectRatio = false;
        this._aspect = null;

        this._cropCanvas = new CropCanvas(ctx);

        this._image = new Image();
        this._size = {
            x: 0,
            y: 0,
            w: 150,
            h: 150
        };
    };

    /* GETTERS/SETTERS */

    CropArea.prototype.setAllowCropResizeOnCorners = function (bool) {
        this._allowCropResizeOnCorners = bool;
    };
    CropArea.prototype.getImage = function () {
        return this._image;
    };
    CropArea.prototype.setImage = function (image) {
        this._image = image;
    };
    CropArea.prototype.setForceAspectRatio = function (force) {
        this._forceAspectRatio = force;
    };
    CropArea.prototype.setAspect = function (aspect) {
        this._aspect = aspect;
    };
    CropArea.prototype.getAspect = function () {
        return this._aspect;
    };
    CropArea.prototype.getCanvasSize = function () {
        return {
            w: this._ctx.canvas.width,
            h: this._ctx.canvas.height
        };
    };
    CropArea.prototype.getSize = function () {
        return this._size;
    };
    CropArea.prototype.setSize = function (size) {
        size = this._processSize(size);
        this._size = this._preventBoundaryCollision(size);
    };
    CropArea.prototype.setSizeOnMove = function (size) {
        size = this._processSize(size);
        if (this._allowCropResizeOnCorners) {
            this._size = this._preventBoundaryCollision(size);
        } else {
            this._size = this._allowMouseOutsideCanvas(size);
        }
    };
    CropArea.prototype.CircleOnMove = function (northWestCorner, southEastCorner) {
        var size = {
            x: northWestCorner.x,
            y: northWestCorner.y,
            w: southEastCorner.x - northWestCorner.x,
            h: southEastCorner.y - northWestCorner.y
        };
        var canvasH = this._ctx.canvas.height,
            canvasW = this._ctx.canvas.width;
        if (size.w > canvasW || size.h > canvasH) {
            if (canvasW < canvasH) {
                size.w = canvasW;
                size.h = canvasW;
            } else {
                size.w = canvasH;
                size.h = canvasH;
            }
        }
        if (size.x + size.w > canvasW) {
            size.x = canvasW - size.w;
        }
        if (size.y + size.h > canvasH) {
            size.y = canvasH - size.h;
        }
        if (size.x < 0) {
            size.x = 0;
        }
        if (size.y < 0) {
            size.y = 0;
        }
        if (this._minSize.w > size.w) {
            size.w = this._minSize.w;
            size.x = this._size.x;
        }
        if (this._minSize.h > size.h) {
            size.h = this._minSize.h;
            size.y = this._size.y;
        }
        this._size = size;
    };

    CropArea.prototype.setSizeByCorners = function (northWestCorner, southEastCorner) {

        var size = {
            x: northWestCorner.x,
            y: northWestCorner.y,
            w: southEastCorner.x - northWestCorner.x,
            h: southEastCorner.y - northWestCorner.y
        };
        this.setSize(size);
    };

    CropArea.prototype.getSouthEastBound = function () {
        return this._southEastBound(this.getSize());
    };

    CropArea.prototype.setMinSize = function (size) {
        this._minSize = this._processSize(size);
        this.setSize(this._minSize);
    };

    CropArea.prototype.getMinSize = function () {
        return this._minSize;
    };

    CropArea.prototype.getCenterPoint = function () {
        var s = this.getSize();
        return {
            x: s.x + (s.w / 2),
            y: s.y + (s.h / 2)
        };
    };

    CropArea.prototype.setCenterPoint = function (point) {
        var s = this.getSize();
        this.setSize({
            x: point.x - s.w / 2,
            y: point.y - s.h / 2,
            w: s.w,
            h: s.h
        });
    };

    CropArea.prototype.setCenterPointOnMove = function (point) {
        var s = this.getSize();
        this.setSizeOnMove({
            x: point.x - s.w / 2,
            y: point.y - s.h / 2,
            w: s.w,
            h: s.h
        });
    };

    CropArea.prototype.setInitSize = function (size) {
        this._initSize = this._processSize(size);
        this.setSize(this._initSize);
    };

    CropArea.prototype.getInitSize = function () {
        return this._initSize;
    };

    CropArea.prototype.setInitCoords = function (coords) {
        //add h/w-data to coords-object
        coords.h = this.getSize().h;
        coords.w = this.getSize().w;
        this._initCoords = this._processSize(coords);
        this.setSize(this._initCoords);
    };

    CropArea.prototype.getInitCoords = function () {
        return this._initCoords;
    };

    // return a type string
    CropArea.prototype.getType = function () {
        //default to circle
        return 'circle';
    };

    /* FUNCTIONS */
    CropArea.prototype._allowMouseOutsideCanvas = function (size) {
        var canvasH = this._ctx.canvas.height,
            canvasW = this._ctx.canvas.width;
        var newSize = {
            w: size.w,
            h: size.h,
        };
        if (size.x < 0) {
            newSize.x = 0;
        }
        else if (size.x + size.w > canvasW) {
            newSize.x = canvasW - size.w;
        }
        else {
            newSize.x = size.x;
        }
        if (size.y < 0) {
            newSize.y = 0;
        }
        else if (size.y + size.h > canvasH) {
            newSize.y = canvasH - size.h;
        }
        else {
            newSize.y = size.y;
        }
        return newSize;
    };

    CropArea.prototype._preventBoundaryCollision = function (size) {
        var canvasH = this._ctx.canvas.height,
            canvasW = this._ctx.canvas.width;

        var nw = {
            x: size.x,
            y: size.y
        };
        var se = this._southEastBound(size);

        // check northwest corner
        if (nw.x < 0) {
            nw.x = 0;
        }
        if (nw.y < 0) {
            nw.y = 0;
        }

        // check southeast corner
        if (se.x > canvasW) {
            se.x = canvasW;
        }
        if (se.y > canvasH) {
            se.y = canvasH;
        }

        var newSizeWidth = (this._forceAspectRatio) ? size.w : se.x - nw.x,
            newSizeHeight = (this._forceAspectRatio) ? size.h : se.y - nw.y;

        if (newSizeHeight > canvasH) {
            newSizeHeight = canvasH;
        }

        // save rectangle scale
        if (this._aspect) {
            newSizeWidth = newSizeHeight * this._aspect;
            if (nw.x + newSizeWidth > canvasW) {
                newSizeWidth = canvasW - nw.x;
                newSizeHeight = newSizeWidth / this._aspect;
                if (this._minSize.w > newSizeWidth) {
                    newSizeWidth = this._minSize.w;
                }
                if (this._minSize.h > newSizeHeight) {
                    newSizeHeight = this._minSize.h;
                }
                nw.x = canvasW - newSizeWidth;
            }
            if (nw.y + newSizeHeight > canvasH) {
                nw.y = canvasH - newSizeHeight;
            }
        }

        // save square scale
        if (this._forceAspectRatio) {
            newSizeWidth = newSizeHeight;
            if (nw.x + newSizeWidth > canvasW) {
                newSizeWidth = canvasW - nw.x;
                if (newSizeWidth < this._minSize.w) {
                    newSizeWidth = this._minSize.w;
                }
                newSizeHeight = newSizeWidth;
            }
        }

        var newSize = {
            x: nw.x,
            y: nw.y,
            w: newSizeWidth,
            h: newSizeHeight
        };

        //check size (if < min, adjust nw corner)
        if ((newSize.w < this._minSize.w) && !this._forceAspectRatio) {
            newSize.w = this._minSize.w;
            se = this._southEastBound(newSize);
            //adjust se corner, if it's out of bounds
            if (se.x > canvasW) {
                se.x = canvasW;
                //adjust nw corner according to min width
                nw.x = Math.max(se.x - canvasW, se.x - this._minSize.w);
                newSize = {
                    x: nw.x,
                    y: nw.y,
                    w: se.x - nw.x,
                    h: se.y - nw.y
                };
            }
        }

        if ((newSize.h < this._minSize.h) && !this._forceAspectRatio) {
            newSize.h = this._minSize.h;
            se = this._southEastBound(newSize);

            if (se.y > canvasH) {
                se.y = canvasH;
                //adjust nw corner according to min height
                nw.y = Math.max(se.y - canvasH, se.y - this._minSize.h);
                newSize = {
                    x: nw.x,
                    y: nw.y,
                    w: se.x - nw.x,
                    h: se.y - nw.y
                };
            }
        }

        if (this._forceAspectRatio) {
            //check if outside SE bound
            se = this._southEastBound(newSize);
            if (se.y > canvasH) {
                newSize.y = canvasH - newSize.h;
            }
            if (se.x > canvasW) {
                newSize.x = canvasW - newSize.w;
            }
        }

        return newSize;
    };

    CropArea.prototype._dontDragOutside = function () {
        var h = this._ctx.canvas.height,
            w = this._ctx.canvas.width;

        if (this._width > w) {
            this._width = w;
        }
        if (this._height > h) {
            this._height = h;
        }
        if (this._x < this._width / 2) {
            this._x = this._width / 2;
        }
        if (this._x > w - this._width / 2) {
            this._x = w - this._width / 2;
        }
        if (this._y < this._height / 2) {
            this._y = this._height / 2;
        }
        if (this._y > h - this._height / 2) {
            this._y = h - this._height / 2;
        }
    };

    CropArea.prototype._drawArea = function () {
    };

    CropArea.prototype._processSize = function (size) {
        // make this polymorphic to accept a single floating point number
        // for square-like sizes (including circle)
        if (typeof size === 'number') {
            size = {
                w: size,
                h: size
            };
        }
        var width = size.w;
        if (this._aspect) {
            width = size.h * this._aspect;
        }
        return {
            x: (typeof size.x === 'undefined') ? this.getSize().x : size.x,
            y: (typeof size.y === 'undefined') ? this.getSize().y : size.y,
            w: width || this._minSize.w,
            h: size.h || this._minSize.h
        };
    };

    CropArea.prototype._southEastBound = function (size) {
        return {
            x: size.x + size.w,
            y: size.y + size.h
        };
    };

    CropArea.prototype.draw = function () {
        // draw crop area
        this._cropCanvas.drawCropArea(this._image, this.getCenterPoint(), this._size, this._drawArea);
    };

    CropArea.prototype.processMouseMove = function () {
    };

    CropArea.prototype.processMouseDown = function () {
    };

    CropArea.prototype.processMouseUp = function () {
    };

    return CropArea;
}]);

crop.factory('cropCanvas', [function() {
    // Shape = Array of [x,y]; [0, 0] - center
    var shapeArrowNW = [
        [-0.5, -2],
        [-3, -4.5],
        [-0.5, -7],
        [-7, -7],
        [-7, -0.5],
        [-4.5, -3],
        [-2, -0.5]
    ];
    var shapeArrowNE = [
        [0.5, -2],
        [3, -4.5],
        [0.5, -7],
        [7, -7],
        [7, -0.5],
        [4.5, -3],
        [2, -0.5]
    ];
    var shapeArrowSW = [
        [-0.5, 2],
        [-3, 4.5],
        [-0.5, 7],
        [-7, 7],
        [-7, 0.5],
        [-4.5, 3],
        [-2, 0.5]
    ];
    var shapeArrowSE = [
        [0.5, 2],
        [3, 4.5],
        [0.5, 7],
        [7, 7],
        [7, 0.5],
        [4.5, 3],
        [2, 0.5]
    ];
    var shapeArrowN = [
        [-1.5, -2.5],
        [-1.5, -6],
        [-5, -6],
        [0, -11],
        [5, -6],
        [1.5, -6],
        [1.5, -2.5]
    ];
    var shapeArrowW = [
        [-2.5, -1.5],
        [-6, -1.5],
        [-6, -5],
        [-11, 0],
        [-6, 5],
        [-6, 1.5],
        [-2.5, 1.5]
    ];
    var shapeArrowS = [
        [-1.5, 2.5],
        [-1.5, 6],
        [-5, 6],
        [0, 11],
        [5, 6],
        [1.5, 6],
        [1.5, 2.5]
    ];
    var shapeArrowE = [
        [2.5, -1.5],
        [6, -1.5],
        [6, -5],
        [11, 0],
        [6, 5],
        [6, 1.5],
        [2.5, 1.5]
    ];

    // Colors
    var colors = {
        areaOutline: '#fff',
        resizeBoxStroke: '#bababa',
        resizeBoxFill: '#444',
        resizeBoxArrowFill: '#fff',
        resizeCircleStroke: '#bababa',
        resizeCircleFill: '#444',
        moveIconFill: '#fff'
    };

    var cropper = {
        strokeWidth: 1
    };

    return function(ctx) {

        /* Base functions */

        // Calculate Point
        var calcPoint = function(point, offset, scale) {
            return [scale * point[0] + offset[0], scale * point[1] + offset[1]];
        };

        // Draw Filled Polygon
        var drawFilledPolygon = function(shape, fillStyle, centerCoords, scale) {
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            var pc, pc0 = calcPoint(shape[0], centerCoords, scale);
            ctx.moveTo(pc0[0], pc0[1]);

            for (var p in shape) {
                if (p > 0) {
                    pc = calcPoint(shape[p], centerCoords, scale);
                    ctx.lineTo(pc[0], pc[1]);
                }
            }

            ctx.lineTo(pc0[0], pc0[1]);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        };

        /* Icons */

        this.drawIconMove = function(centerCoords, scale) {
            drawFilledPolygon(shapeArrowN, colors.moveIconFill, centerCoords, scale);
            drawFilledPolygon(shapeArrowW, colors.moveIconFill, centerCoords, scale);
            drawFilledPolygon(shapeArrowS, colors.moveIconFill, centerCoords, scale);
            drawFilledPolygon(shapeArrowE, colors.moveIconFill, centerCoords, scale);
        };

        this.drawIconResizeCircle = function(centerCoords, circleRadius, scale) {
            var scaledCircleRadius = circleRadius * scale;
            ctx.save();
            ctx.strokeStyle = colors.resizeCircleStroke;
            ctx.lineWidth = cropper.strokeWidth;
            ctx.fillStyle = colors.resizeCircleFill;
            ctx.beginPath();
            ctx.arc(centerCoords[0], centerCoords[1], scaledCircleRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        };

        this.drawIconResizeBoxBase = function(centerCoords, boxSize, scale) {
            var scaledBoxSize = boxSize * scale;
            ctx.save();
            ctx.strokeStyle = colors.resizeBoxStroke;
            ctx.lineWidth = cropper.strokeWidth;
            ctx.fillStyle = colors.resizeBoxFill;
            ctx.fillRect(centerCoords[0] - scaledBoxSize / 2, centerCoords[1] - scaledBoxSize / 2, scaledBoxSize, scaledBoxSize);
            ctx.strokeRect(centerCoords[0] - scaledBoxSize / 2, centerCoords[1] - scaledBoxSize / 2, scaledBoxSize, scaledBoxSize);
            ctx.restore();
        };
        this.drawIconResizeBoxNESW = function(centerCoords, boxSize, scale) {
            this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
            drawFilledPolygon(shapeArrowNE, colors.resizeBoxArrowFill, centerCoords, scale);
            drawFilledPolygon(shapeArrowSW, colors.resizeBoxArrowFill, centerCoords, scale);
        };
        this.drawIconResizeBoxNWSE = function(centerCoords, boxSize, scale) {
            this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
            drawFilledPolygon(shapeArrowNW, colors.resizeBoxArrowFill, centerCoords, scale);
            drawFilledPolygon(shapeArrowSE, colors.resizeBoxArrowFill, centerCoords, scale);
        };

        /* Crop Area */

        this.drawCropArea = function(image, centerCoords, size, fnDrawClipPath) {
            var xRatio = Math.abs(image.width / ctx.canvas.width),
                yRatio = Math.abs(image.height / ctx.canvas.height),
                xLeft = Math.abs(centerCoords.x - size.w / 2),
                yTop = Math.abs(centerCoords.y - size.h / 2);

            ctx.save();
            ctx.strokeStyle = colors.areaOutline;
            ctx.lineWidth = cropper.strokeWidth;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            fnDrawClipPath(ctx, centerCoords, size);
            ctx.stroke();
            ctx.clip();

            // draw part of original image
            if (size.w > 0) {
                ctx.drawImage(image, xLeft * xRatio, yTop * yRatio, Math.abs(size.w * xRatio), Math.abs(size.h * yRatio), xLeft, yTop, Math.abs(size.w), Math.abs(size.h));
            }

            ctx.beginPath();
            fnDrawClipPath(ctx, centerCoords, size);
            ctx.stroke();
            ctx.clip();

            ctx.restore();
        };

    };
}]);

/**
 * EXIF service is based on the exif-js library (https://github.com/jseidelin/exif-js)
 */

crop.service('cropEXIF', [function () {
    var debug = false;

    var ExifTags = this.Tags = {

        // version tags
        0x9000: 'ExifVersion', // EXIF version
        0xA000: 'FlashpixVersion', // Flashpix format version

        // colorspace tags
        0xA001: 'ColorSpace', // Color space information tag

        // image configuration
        0xA002: 'PixelXDimension', // Valid width of meaningful image
        0xA003: 'PixelYDimension', // Valid height of meaningful image
        0x9101: 'ComponentsConfiguration', // Information about channels
        0x9102: 'CompressedBitsPerPixel', // Compressed bits per pixel

        // user information
        0x927C: 'MakerNote', // Any desired information written by the manufacturer
        0x9286: 'UserComment', // Comments by user

        // related file
        0xA004: 'RelatedSoundFile', // Name of related sound file

        // date and time
        0x9003: 'DateTimeOriginal', // Date and time when the original image was generated
        0x9004: 'DateTimeDigitized', // Date and time when the image was stored digitally
        0x9290: 'SubsecTime', // Fractions of seconds for DateTime
        0x9291: 'SubsecTimeOriginal', // Fractions of seconds for DateTimeOriginal
        0x9292: 'SubsecTimeDigitized', // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: 'ExposureTime', // Exposure time (in seconds)
        0x829D: 'FNumber', // F number
        0x8822: 'ExposureProgram', // Exposure program
        0x8824: 'SpectralSensitivity', // Spectral sensitivity
        0x8827: 'ISOSpeedRatings', // ISO speed rating
        0x8828: 'OECF', // Optoelectric conversion factor
        0x9201: 'ShutterSpeedValue', // Shutter speed
        0x9202: 'ApertureValue', // Lens aperture
        0x9203: 'BrightnessValue', // Value of brightness
        0x9204: 'ExposureBias', // Exposure bias
        0x9205: 'MaxApertureValue', // Smallest F number of lens
        0x9206: 'SubjectDistance', // Distance to subject in meters
        0x9207: 'MeteringMode', // Metering mode
        0x9208: 'LightSource', // Kind of light source
        0x9209: 'Flash', // Flash status
        0x9214: 'SubjectArea', // Location and area of main subject
        0x920A: 'FocalLength', // Focal length of the lens in mm
        0xA20B: 'FlashEnergy', // Strobe energy in BCPS
        0xA20C: 'SpatialFrequencyResponse', //
        0xA20E: 'FocalPlaneXResolution', // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: 'FocalPlaneYResolution', // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: 'FocalPlaneResolutionUnit', // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: 'SubjectLocation', // Location of subject in image
        0xA215: 'ExposureIndex', // Exposure index selected on camera
        0xA217: 'SensingMethod', // Image sensor type
        0xA300: 'FileSource', // Image source (3 == DSC)
        0xA301: 'SceneType', // Scene type (1 == directly photographed)
        0xA302: 'CFAPattern', // Color filter array geometric pattern
        0xA401: 'CustomRendered', // Special processing
        0xA402: 'ExposureMode', // Exposure mode
        0xA403: 'WhiteBalance', // 1 = auto white balance, 2 = manual
        0xA404: 'DigitalZoomRation', // Digital zoom ratio
        0xA405: 'FocalLengthIn35mmFilm', // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: 'SceneCaptureType', // Type of scene
        0xA407: 'GainControl', // Degree of overall image gain adjustment
        0xA408: 'Contrast', // Direction of contrast processing applied by camera
        0xA409: 'Saturation', // Direction of saturation processing applied by camera
        0xA40A: 'Sharpness', // Direction of sharpness processing applied by camera
        0xA40B: 'DeviceSettingDescription', //
        0xA40C: 'SubjectDistanceRange', // Distance to subject

        // other tags
        0xA005: 'InteroperabilityIFDPointer',
        0xA420: 'ImageUniqueID' // Identifier assigned uniquely to each image
    };

    var TiffTags = this.TiffTags = {
        0x0100: 'ImageWidth',
        0x0101: 'ImageHeight',
        0x8769: 'ExifIFDPointer',
        0x8825: 'GPSInfoIFDPointer',
        0xA005: 'InteroperabilityIFDPointer',
        0x0102: 'BitsPerSample',
        0x0103: 'Compression',
        0x0106: 'PhotometricInterpretation',
        0x0112: 'Orientation',
        0x0115: 'SamplesPerPixel',
        0x011C: 'PlanarConfiguration',
        0x0212: 'YCbCrSubSampling',
        0x0213: 'YCbCrPositioning',
        0x011A: 'XResolution',
        0x011B: 'YResolution',
        0x0128: 'ResolutionUnit',
        0x0111: 'StripOffsets',
        0x0116: 'RowsPerStrip',
        0x0117: 'StripByteCounts',
        0x0201: 'JPEGInterchangeFormat',
        0x0202: 'JPEGInterchangeFormatLength',
        0x012D: 'TransferFunction',
        0x013E: 'WhitePoint',
        0x013F: 'PrimaryChromaticities',
        0x0211: 'YCbCrCoefficients',
        0x0214: 'ReferenceBlackWhite',
        0x0132: 'DateTime',
        0x010E: 'ImageDescription',
        0x010F: 'Make',
        0x0110: 'Model',
        0x0131: 'Software',
        0x013B: 'Artist',
        0x8298: 'Copyright'
    };

    var GPSTags = this.GPSTags = {
        0x0000: 'GPSVersionID',
        0x0001: 'GPSLatitudeRef',
        0x0002: 'GPSLatitude',
        0x0003: 'GPSLongitudeRef',
        0x0004: 'GPSLongitude',
        0x0005: 'GPSAltitudeRef',
        0x0006: 'GPSAltitude',
        0x0007: 'GPSTimeStamp',
        0x0008: 'GPSSatellites',
        0x0009: 'GPSStatus',
        0x000A: 'GPSMeasureMode',
        0x000B: 'GPSDOP',
        0x000C: 'GPSSpeedRef',
        0x000D: 'GPSSpeed',
        0x000E: 'GPSTrackRef',
        0x000F: 'GPSTrack',
        0x0010: 'GPSImgDirectionRef',
        0x0011: 'GPSImgDirection',
        0x0012: 'GPSMapDatum',
        0x0013: 'GPSDestLatitudeRef',
        0x0014: 'GPSDestLatitude',
        0x0015: 'GPSDestLongitudeRef',
        0x0016: 'GPSDestLongitude',
        0x0017: 'GPSDestBearingRef',
        0x0018: 'GPSDestBearing',
        0x0019: 'GPSDestDistanceRef',
        0x001A: 'GPSDestDistance',
        0x001B: 'GPSProcessingMethod',
        0x001C: 'GPSAreaInformation',
        0x001D: 'GPSDateStamp',
        0x001E: 'GPSDifferential'
    };

    var StringValues = this.StringValues = {
        ExposureProgram: {
            0: 'Not defined',
            1: 'Manual',
            2: 'Normal program',
            3: 'Aperture priority',
            4: 'Shutter priority',
            5: 'Creative program',
            6: 'Action program',
            7: 'Portrait mode',
            8: 'Landscape mode'
        },
        MeteringMode: {
            0: 'Unknown',
            1: 'Average',
            2: 'CenterWeightedAverage',
            3: 'Spot',
            4: 'MultiSpot',
            5: 'Pattern',
            6: 'Partial',
            255: 'Other'
        },
        LightSource: {
            0: 'Unknown',
            1: 'Daylight',
            2: 'Fluorescent',
            3: 'Tungsten (incandescent light)',
            4: 'Flash',
            9: 'Fine weather',
            10: 'Cloudy weather',
            11: 'Shade',
            12: 'Daylight fluorescent (D 5700 - 7100K)',
            13: 'Day white fluorescent (N 4600 - 5400K)',
            14: 'Cool white fluorescent (W 3900 - 4500K)',
            15: 'White fluorescent (WW 3200 - 3700K)',
            17: 'Standard light A',
            18: 'Standard light B',
            19: 'Standard light C',
            20: 'D55',
            21: 'D65',
            22: 'D75',
            23: 'D50',
            24: 'ISO studio tungsten',
            255: 'Other'
        },
        Flash: {
            0x0000: 'Flash did not fire',
            0x0001: 'Flash fired',
            0x0005: 'Strobe return light not detected',
            0x0007: 'Strobe return light detected',
            0x0009: 'Flash fired, compulsory flash mode',
            0x000D: 'Flash fired, compulsory flash mode, return light not detected',
            0x000F: 'Flash fired, compulsory flash mode, return light detected',
            0x0010: 'Flash did not fire, compulsory flash mode',
            0x0018: 'Flash did not fire, auto mode',
            0x0019: 'Flash fired, auto mode',
            0x001D: 'Flash fired, auto mode, return light not detected',
            0x001F: 'Flash fired, auto mode, return light detected',
            0x0020: 'No flash function',
            0x0041: 'Flash fired, red-eye reduction mode',
            0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
            0x0047: 'Flash fired, red-eye reduction mode, return light detected',
            0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
            0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
            0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
            0x0059: 'Flash fired, auto mode, red-eye reduction mode',
            0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
            0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
        },
        SensingMethod: {
            1: 'Not defined',
            2: 'One-chip color area sensor',
            3: 'Two-chip color area sensor',
            4: 'Three-chip color area sensor',
            5: 'Color sequential area sensor',
            7: 'Trilinear sensor',
            8: 'Color sequential linear sensor'
        },
        SceneCaptureType: {
            0: 'Standard',
            1: 'Landscape',
            2: 'Portrait',
            3: 'Night scene'
        },
        SceneType: {
            1: 'Directly photographed'
        },
        CustomRendered: {
            0: 'Normal process',
            1: 'Custom process'
        },
        WhiteBalance: {
            0: 'Auto white balance',
            1: 'Manual white balance'
        },
        GainControl: {
            0: 'None',
            1: 'Low gain up',
            2: 'High gain up',
            3: 'Low gain down',
            4: 'High gain down'
        },
        Contrast: {
            0: 'Normal',
            1: 'Soft',
            2: 'Hard'
        },
        Saturation: {
            0: 'Normal',
            1: 'Low saturation',
            2: 'High saturation'
        },
        Sharpness: {
            0: 'Normal',
            1: 'Soft',
            2: 'Hard'
        },
        SubjectDistanceRange: {
            0: 'Unknown',
            1: 'Macro',
            2: 'Close view',
            3: 'Distant view'
        },
        FileSource: {
            3: 'DSC'
        },

        Components: {
            0: '',
            1: 'Y',
            2: 'Cb',
            3: 'Cr',
            4: 'R',
            5: 'G',
            6: 'B'
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }

    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open('GET', url, true);
        http.responseType = 'blob';
        http.onload = function (e) {
            if (this.status === 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        var fileReader = new FileReader();

        if (img.src) {

            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                fileReader.onload = function (e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            }
            var http = new XMLHttpRequest();
            http.onload = function () {
                if (this.status === 200 || this.status === 0) {
                    handleBinaryFile(http.response);
                } else {
                    throw 'Could not load image';
                }
                http = null;
            };
            http.responseType = 'arraybuffer';
            http.open('GET', img.src, true);
            try {
                http.send(null);
            } catch(e) {
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            fileReader.onload = function (e) {
                if (debug) {
                    console.log('Got file of length ' + e.target.result.byteLength);
                }
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) {
            console.log('Got file of length ' + file.byteLength);
        }
        if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
            if (debug) {
                console.log('Not a valid JPEG');
            }
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) !== 0xFF) {
                if (debug) {
                    console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset));
                }
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) {
                console.log(marker);
            }

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker === 225) {
                if (debug) {
                    console.log('Found 0xFFE1 marker');
                }

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset + 2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) {
            console.log('Got file of length ' + file.byteLength);
        }
        if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
            if (debug) {
                console.log('Not a valid JPEG');
            }
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;

        var isFieldSegmentStart = function (dataView, offset) {
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset + 1) === 0x42 &&
                dataView.getUint8(offset + 2) === 0x49 &&
                dataView.getUint8(offset + 3) === 0x4D &&
                dataView.getUint8(offset + 4) === 0x04 &&
                dataView.getUint8(offset + 5) === 0x04
            );
        };

        while (offset < length) {

            if (isFieldSegmentStart(dataView, offset)) {

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) {
                    nameHeaderLength += 1;
                }
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);
            }

            // Not the marker, continue searching
            offset++;

        }

    }

    var IptcFieldMap = {
        0x78: 'caption',
        0x6E: 'credit',
        0x19: 'keywords',
        0x37: 'dateCreated',
        0x50: 'byline',
        0x55: 'bylineTitle',
        0x7A: 'captionWriter',
        0x69: 'headline',
        0x74: 'copyright',
        0x0F: 'category'
    };

    function readIPTCData(file, startOffset, sectionLength) {
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while (segmentStartPos < startOffset + sectionLength) {
            if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
                segmentType = dataView.getUint8(segmentStartPos + 2);
                if (segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos + 3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                    // Check if we already stored a value with this name
                    if (data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if (data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        } else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    } else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }

    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) {
                console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
            }
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }

    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset + 2, !bigEnd),
            numValues = file.getUint32(entryOffset + 4, !bigEnd),
            valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues === 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                }
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = file.getUint8(offset + n);
                }
                return vals;

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues === 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                }
                offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                }
                return vals;

            case 4: // long, 32 bit int
                if (numValues === 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                }
                vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                }
                return vals;

            case 5: // rational = two long values, first is numerator, second is denominator
                if (numValues === 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = (numerator / denominator); //@TODO need to inspect if this fix is really working
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                }
                vals = [];
                for (n = 0; n < numValues; n++) {
                    numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                    vals[n] = (numerator / denominator); //@TODO need to inspect if this fix is really working
                    vals[n].numerator = numerator;
                    vals[n].denominator = denominator;
                }
                return vals;

            case 9: // slong, 32 bit signed int
                if (numValues === 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                }
                vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                }
                return vals;

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues === 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                }
                vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                }
                return vals;
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = '';
        for (var n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) !== 'Exif') {
            if (debug) {
                console.log('Not valid EXIF data! ' + getStringFromDB(file, start, 4));
            }
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) === 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) === 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) {
                console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
            }
            return false;
        }

        if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
            if (debug) {
                console.log('Not valid TIFF data! (no 0x002A)');
            }
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) {
                console.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd));
            }
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case 'LightSource':
                    case 'Flash':
                    case 'MeteringMode':
                    case 'ExposureProgram':
                    case 'SensingMethod':
                    case 'SceneCaptureType':
                    case 'SceneType':
                    case 'CustomRendered':
                    case 'WhiteBalance':
                    case 'GainControl':
                    case 'Contrast':
                    case 'Saturation':
                    case 'Sharpness':
                    case 'SubjectDistanceRange':
                    case 'FileSource':
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case 'ExifVersion':
                    case 'FlashpixVersion':
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case 'ComponentsConfiguration':
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case 'GPSVersionID':
                        gpsData[tag] = gpsData[tag][0] +
                            '.' + gpsData[tag][1] +
                            '.' + gpsData[tag][2] +
                            '.' + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    this.getData = function (img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) {
            return false;
        }

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    };

    this.getTag = function (img, tag) {
        if (!imageHasData(img)) {
            return;
        }
        return img.exifdata[tag];
    };

    this.getAllTags = function (img) {
        if (!imageHasData(img)) {
            return {};
        }
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    };

    this.pretty = function (img) {
        if (!imageHasData(img)) {
            return '';
        }
        var a,
            data = img.exifdata,
            strPretty = '';
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] === 'object') {
                    if (data[a] instanceof Number) {
                        strPretty += a + ' : ' + data[a] + ' [' + data[a].numerator + '/' + data[a].denominator + ']\r\n';
                    } else {
                        strPretty += a + ' : [' + data[a].length + ' values]\r\n';
                    }
                } else {
                    strPretty += a + ' : ' + data[a] + '\r\n';
                }
            }
        }
        return strPretty;
    };

    this.readFromBinaryFile = function (file) {
        return findEXIFinJPEG(file);
    };
}]);

crop.factory('cropHost', ['$document', '$q', 'cropAreaCircle', 'cropAreaSquare', 'cropAreaRectangle', 'cropEXIF', function ($document, $q, CropAreaCircle, CropAreaSquare, CropAreaRectangle, cropEXIF) {
    /* STATIC FUNCTIONS */

    // Get Element's Offset
    var getElementOffset = function (elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        var colorPaletteLength = 8;

        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    };

    return function (elCanvas, opts, events) {
        /* PRIVATE VARIABLES */

        // Object Pointers
        var ctx = null,
            image = null,
            theArea = null,
            initMax = null,
            isAspectRatio = null,
            self = this,

            // Dimensions
            minCanvasDims = [100, 100],
            maxCanvasDims = [300, 300],

            scalemode = null,

            // Result Image size
            resImgSizeArray = [],
            resImgSize = {
                w: 200,
                h: 200
            },
            areaMinRelativeSize = null,

            // Result Image type
            resImgFormat = 'image/png',

            // Result Image quality
            resImgQuality = null,

            forceAspectRatio = false;

        /* PRIVATE FUNCTIONS */
        this.setInitMax = function (bool) {
            initMax = bool;
        };
        this.setAllowCropResizeOnCorners = function (bool) {
            theArea.setAllowCropResizeOnCorners(bool);
        };
        // Draw Scene
        function drawScene() {
            // clear canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (image !== null) {
                // draw source image
                ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();

                // and make it darker
                ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.restore();

                // draw Area
                theArea.draw();
            }
        }

        // Resets CropHost
        var resetCropHost = function () {
            if (image !== null) {
                theArea.setImage(image);
                var imageDims = [image.width, image.height],
                    imageRatio = image.width / image.height,
                    canvasDims = imageDims;

                if (canvasDims[0] > maxCanvasDims[0]) {
                    canvasDims[0] = maxCanvasDims[0];
                    canvasDims[1] = canvasDims[0] / imageRatio;
                } else if (canvasDims[0] < minCanvasDims[0]) {
                    canvasDims[0] = minCanvasDims[0];
                    canvasDims[1] = canvasDims[0] / imageRatio;
                }
                if (scalemode === 'fixed-height' && canvasDims[1] > maxCanvasDims[1]) {
                    canvasDims[1] = maxCanvasDims[1];
                    canvasDims[0] = canvasDims[1] * imageRatio;
                } else if (canvasDims[1] < minCanvasDims[1]) {
                    canvasDims[1] = minCanvasDims[1];
                    canvasDims[0] = canvasDims[1] * imageRatio;
                }
                elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]);
                if (scalemode === 'fixed-height') {
                    elCanvas.css({
                        'margin-left': -canvasDims[0] / 2 + 'px',
                        'margin-top': -canvasDims[1] / 2 + 'px'
                    });
                }

                var cw = ctx.canvas.width;
                var ch = ctx.canvas.height;

                var areaType = self.getAreaType();
                // enforce 1:1 aspect ratio for square-like selections
                if ((areaType === 'circle') || (areaType === 'square')) {
                    if (ch < cw) {
                        cw = ch;
                    }
                    ch = cw;
                } else if (areaType === 'rectangle' && isAspectRatio) {
                    var aspectRatio = theArea.getAspect(); // use `aspectRatio` instead of `resImgSize` dimensions bc `resImgSize` can be 'selection' string
                    if (cw / ch > aspectRatio) {
                        cw = aspectRatio * ch;
                    } else {
                        ch = aspectRatio * cw;
                    }
                }

                if (initMax) {
                    theArea.setSize({
                        w: cw,
                        h: ch
                    });
                } else if (undefined !== theArea.getInitSize()) {
                    theArea.setSize({
                        w: Math.min(theArea.getInitSize().w, cw / 2),
                        h: Math.min(theArea.getInitSize().h, ch / 2)
                    });
                } else {
                    theArea.setSize({
                        w: Math.min(200, cw / 2),
                        h: Math.min(200, ch / 2)
                    });
                }

                if (theArea.getInitCoords()) {
                    if (self.areaInitIsRelativeToImage) {
                        var ratio = image.width / canvasDims[0];
                        theArea.setSize({
                            w: theArea.getInitSize().w / ratio,
                            h: theArea.getInitSize().h / ratio,
                            x: theArea.getInitCoords().x / ratio,
                            y: theArea.getInitCoords().y / ratio
                        });
                    } else {
                        theArea.setSize({
                            w: theArea.getSize().w,
                            h: theArea.getSize().h,
                            x: theArea.getInitCoords().x,
                            y: theArea.getInitCoords().y
                        });
                    }
                } else {
                    theArea.setCenterPoint({
                        x: ctx.canvas.width / 2,
                        y: ctx.canvas.height / 2
                    });
                }

            } else {
                elCanvas.prop('width', 0).prop('height', 0).css({
                    'margin-top': 0
                });
            }

            drawScene();
        };

        var getChangedTouches = function (event) {
            if (angular.isDefined(event.changedTouches)) {
                return event.changedTouches;
            } else {
                return event.originalEvent.changedTouches;
            }
        };

        var onMouseMove = function (e) {
            if (image !== null) {
                var offset = getElementOffset(ctx.canvas),
                    pageX, pageY;
                if (e.type === 'touchmove') {
                    pageX = getChangedTouches(e)[0].pageX;
                    pageY = getChangedTouches(e)[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }
                theArea.processMouseMove(pageX - offset.left, pageY - offset.top);
                drawScene();
            }
        };

        var onMouseDown = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (image !== null) {
                var offset = getElementOffset(ctx.canvas),
                    pageX, pageY;
                if (e.type === 'touchstart') {
                    pageX = getChangedTouches(e)[0].pageX;
                    pageY = getChangedTouches(e)[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }
                theArea.processMouseDown(pageX - offset.left, pageY - offset.top);
                drawScene();
            }
        };

        var onMouseUp = function (e) {
            if (image !== null) {
                var offset = getElementOffset(ctx.canvas),
                    pageX, pageY;
                if (e.type === 'touchend') {
                    pageX = getChangedTouches(e)[0].pageX;
                    pageY = getChangedTouches(e)[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }
                theArea.processMouseUp(pageX - offset.left, pageY - offset.top);
                drawScene();
            }
        };

        var renderImageToDataURL = function (getResultImageSize) {
            var temp_ctx, temp_canvas,
                ris = getResultImageSize,
                center = theArea.getCenterPoint(),
                retObj = {
                    dataURI: null,
                    imageData: null
                };
            temp_canvas = angular.element('<canvas></canvas>')[0];
            temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = ris.w;
            temp_canvas.height = ris.h;
            if (image !== null) {
                var x = (center.x - theArea.getSize().w / 2) * (image.width / ctx.canvas.width),
                    y = (center.y - theArea.getSize().h / 2) * (image.height / ctx.canvas.height),
                    areaWidth = theArea.getSize().w * (image.width / ctx.canvas.width),
                    areaHeight = theArea.getSize().h * (image.height / ctx.canvas.height);

                if (forceAspectRatio) {
                    temp_ctx.drawImage(image, x, y,
                        areaWidth,
                        areaHeight,
                        0,
                        0,
                        ris.w,
                        ris.h);
                } else {
                    var aspectRatio = areaWidth / areaHeight;
                    var resultHeight, resultWidth;

                    if (aspectRatio > 1) {
                        resultWidth = ris.w;
                        resultHeight = resultWidth / aspectRatio;
                    } else {
                        resultHeight = ris.h;
                        resultWidth = resultHeight * aspectRatio;
                    }

                    temp_ctx.drawImage(image,
                        x,
                        y,
                        areaWidth,
                        areaHeight,
                        0,
                        0,
                        Math.round(resultWidth),
                        Math.round(resultHeight));
                }

                if (resImgQuality !== null) {
                    retObj.dataURI = temp_canvas.toDataURL(resImgFormat, resImgQuality);
                } else {
                    retObj.dataURI = temp_canvas.toDataURL(resImgFormat);
                }
            }
            return retObj;
        };

        this.getResultImage = function () {
            if (resImgSizeArray.length === 0) {
                return renderImageToDataURL(this.getResultImageSize());
            }

            var arrayResultImages = [];
            for (var i = 0; i < resImgSizeArray.length; i++) {
                arrayResultImages.push({
                    dataURI: renderImageToDataURL(resImgSizeArray[i]).dataURI,
                    w: resImgSizeArray[i].w,
                    h: resImgSizeArray[i].h
                });
            }

            return arrayResultImages;
        };

        this.getResultImageDataBlob = function () {
            var temp_ctx, temp_canvas,
                center = theArea.getCenterPoint(),
                ris = this.getResultImageSize(),
                _p = $q.defer();
            temp_canvas = angular.element('<canvas></canvas>')[0];
            temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = ris.w;
            temp_canvas.height = ris.h;
            if (image !== null) {
                var x = (center.x - theArea.getSize().w / 2) * (image.width / ctx.canvas.width),
                    y = (center.y - theArea.getSize().h / 2) * (image.height / ctx.canvas.height),
                    areaWidth = theArea.getSize().w * (image.width / ctx.canvas.width),
                    areaHeight = theArea.getSize().h * (image.height / ctx.canvas.height);

                if (forceAspectRatio) {
                    temp_ctx.drawImage(image, x, y,
                        areaWidth,
                        areaHeight,
                        0,
                        0,
                        ris.w,
                        ris.h);
                } else {
                    var aspectRatio = areaWidth / areaHeight;
                    var resultHeight, resultWidth;

                    if (aspectRatio > 1) {
                        resultWidth = ris.w;
                        resultHeight = resultWidth / aspectRatio;
                    } else {
                        resultHeight = ris.h;
                        resultWidth = resultHeight * aspectRatio;
                    }

                    temp_ctx.drawImage(image,
                        x,
                        y,
                        areaWidth,
                        areaHeight,
                        0,
                        0,
                        Math.round(resultWidth),
                        Math.round(resultHeight));
                }
            }

            if (resImgQuality !== null) {
                temp_canvas.toBlob(function (blob) {
                    _p.resolve(blob);
                }, resImgFormat, resImgQuality);
            } else {
                temp_canvas.toBlob(function (blob) {
                    _p.resolve(blob);
                }, resImgFormat);
            }

            return _p.promise;
        };

        this.getAreaCoords = function () {
            return theArea.getSize();
        };

        this.getArea = function () {
            return theArea;
        };

        this.setNewImageSource = function (imageSource) {
            image = null;
            resetCropHost();
            if (!!imageSource) {
                var newImage = new Image();
                newImage.onload = function () {
                    events.trigger('load-done');

                    cropEXIF.getData(newImage, function () {
                        var orientation = cropEXIF.getTag(newImage, 'Orientation');

                        if ([3, 6, 8].indexOf(orientation) > -1) {
                            var canvas = document.createElement('canvas'),
                                ctx = canvas.getContext('2d'),
                                cw = newImage.width,
                                ch = newImage.height,
                                cx = 0,
                                cy = 0,
                                deg = 0,
                                rw = 0,
                                rh = 0;
                            rw = cw;
                            rh = ch;
                            switch (orientation) {
                                case 3:
                                    cx = -newImage.width;
                                    cy = -newImage.height;
                                    deg = 180;
                                    break;
                                case 6:
                                    cw = newImage.height;
                                    ch = newImage.width;
                                    cy = -newImage.height;
                                    rw = ch;
                                    rh = cw;
                                    deg = 90;
                                    break;
                                case 8:
                                    cw = newImage.height;
                                    ch = newImage.width;
                                    cx = -newImage.width;
                                    rw = ch;
                                    rh = cw;
                                    deg = 270;
                                    break;
                            }

                            //// canvas.toDataURL will only work if the canvas isn't too large. Resize to 1000px.
                            var maxWorH = 1000;
                            if (cw > maxWorH || ch > maxWorH) {
                                var p = 0;
                                if (cw > maxWorH) {
                                    p = (maxWorH) / cw;
                                    cw = maxWorH;
                                    ch = p * ch;
                                } else if (ch > maxWorH) {
                                    p = (maxWorH) / ch;
                                    ch = maxWorH;
                                    cw = p * cw;
                                }

                                cy = p * cy;
                                cx = p * cx;
                                rw = p * rw;
                                rh = p * rh;
                            }

                            canvas.width = cw;
                            canvas.height = ch;
                            ctx.rotate(deg * Math.PI / 180);
                            ctx.drawImage(newImage, cx, cy, rw, rh);

                            image = new Image();
                            image.onload = function () {
                                resetCropHost();
                                events.trigger('image-updated');
                            };

                            image.src = canvas.toDataURL(resImgFormat);
                        } else {
                            image = newImage;
                            events.trigger('image-updated');
                        }
                        resetCropHost();
                    });
                };
                newImage.onerror = function () {
                    events.trigger('load-error');
                };
                events.trigger('load-start');
                if (imageSource instanceof window.Blob) {
                    newImage.src = URL.createObjectURL(imageSource);
                } else {
                    if (imageSource.substring(0, 4).toLowerCase() === 'http' || imageSource.substring(0, 2) === '//') {
                        newImage.crossOrigin = 'anonymous';
                    }
                    newImage.src = imageSource;
                }
            }
        };

        this.setMaxDimensions = function (width, height) {
            maxCanvasDims = [width, height];

            if (image !== null) {
                var curWidth = ctx.canvas.width,
                    curHeight = ctx.canvas.height;

                var imageDims = [image.width, image.height],
                    imageRatio = image.width / image.height,
                    canvasDims = imageDims;

                if (canvasDims[0] > maxCanvasDims[0]) {
                    canvasDims[0] = maxCanvasDims[0];
                    canvasDims[1] = canvasDims[0] / imageRatio;
                } else if (canvasDims[0] < minCanvasDims[0]) {
                    canvasDims[0] = minCanvasDims[0];
                    canvasDims[1] = canvasDims[0] / imageRatio;
                }
                if (scalemode === 'fixed-height' && canvasDims[1] > maxCanvasDims[1]) {
                    canvasDims[1] = maxCanvasDims[1];
                    canvasDims[0] = canvasDims[1] * imageRatio;
                } else if (canvasDims[1] < minCanvasDims[1]) {
                    canvasDims[1] = minCanvasDims[1];
                    canvasDims[0] = canvasDims[1] * imageRatio;
                }
                elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]);

                if (scalemode === 'fixed-height') {
                    elCanvas.css({
                        'margin-left': -canvasDims[0] / 2 + 'px',
                        'margin-top': -canvasDims[1] / 2 + 'px'
                    });
                }

                var ratioNewCurWidth = ctx.canvas.width / curWidth,
                    ratioNewCurHeight = ctx.canvas.height / curHeight,
                    ratioMin = Math.min(ratioNewCurWidth, ratioNewCurHeight);

                //TODO: use top left corner point
                var center = theArea.getCenterPoint();
                theArea.setSize({
                    w: theArea.getSize().w * ratioMin,
                    h: theArea.getSize().h * ratioMin
                });
                theArea.setCenterPoint({
                    x: center.x * ratioNewCurWidth,
                    y: center.y * ratioNewCurHeight
                });

            } else {
                elCanvas.prop('width', 0).prop('height', 0).css({
                    'margin-top': 0
                });
            }

            drawScene();

        };

        this.setAreaMinSize = function (size) {
            if (angular.isUndefined(size)) {
                return;
            } else if (typeof size === 'number' || typeof size === 'string') {
                size = {
                    w: parseInt(parseInt(size), 10),
                    h: parseInt(parseInt(size), 10)
                };
            } else {
                size = {
                    w: parseInt(size.w, 10),
                    h: parseInt(size.h, 10)
                };
            }
            if (!isNaN(size.w) && !isNaN(size.h)) {
                theArea.setMinSize(size);
                drawScene();
            }
        };

        this.setAreaMinRelativeSize = function (size) {
            if (image === null || angular.isUndefined(size)) {
                return;
            }

            var canvasSize = theArea.getCanvasSize();

            if (typeof size === 'number' || typeof size === 'string') {
                areaMinRelativeSize = {
                    w: size,
                    h: size
                };
                size = {
                    w: canvasSize.w / (image.width / parseInt(parseInt(size), 10)),
                    h: canvasSize.h / (image.height / parseInt(parseInt(size), 10))
                };
            } else {
                areaMinRelativeSize = size;
                size = {
                    w: canvasSize.w / (image.width / parseInt(parseInt(size.w), 10)),
                    h: canvasSize.h / (image.height / parseInt(parseInt(size.h), 10))
                };
            }

            if (!isNaN(size.w) && !isNaN(size.h)) {
                theArea.setMinSize(size);
                drawScene();
            }
        };

        this.setAreaInitSize = function (size) {
            if (angular.isUndefined(size)) {
                return;
            } else if (typeof size === 'number' || typeof size === 'string') {
                size = {
                    w: parseInt(parseInt(size), 10),
                    h: parseInt(parseInt(size), 10)
                };
            } else {
                size = {
                    w: parseInt(size.w, 10),
                    h: parseInt(size.h, 10)
                };
            }
            if (!isNaN(size.w) && !isNaN(size.h)) {
                theArea.setInitSize(size);
                drawScene();
            }
        };

        this.setAreaInitCoords = function (coords) {
            if (angular.isUndefined(coords)) {
                return;
            } else {
                coords = {
                    x: parseInt(coords.x, 10),
                    y: parseInt(coords.y, 10)
                };
            }
            if (!isNaN(coords.x) && !isNaN(coords.y)) {
                theArea.setInitCoords(coords);
                drawScene();
            }
        };

        this.setMaxCanvasDimensions = function (maxCanvasDimensions) {
            if (!angular.isUndefined(maxCanvasDimensions)) {
                var newMaxCanvasDims = [];
                if (typeof maxCanvasDimensions === 'number' || typeof maxCanvasDimensions === 'string') {
                    newMaxCanvasDims = [
                        parseInt(parseInt(maxCanvasDimensions), 10),
                        parseInt(parseInt(maxCanvasDimensions), 10)
                    ];
                } else {
                    newMaxCanvasDims = [
                        parseInt(maxCanvasDimensions.w, 10),
                        parseInt(maxCanvasDimensions.h, 10)
                    ];
                }
                if ((!isNaN(newMaxCanvasDims[0]) &&
                    newMaxCanvasDims[0] > 0 &&
                    newMaxCanvasDims[0] > minCanvasDims[0]) &&
                    (!isNaN(newMaxCanvasDims[1]) &&
                    newMaxCanvasDims[1] > 0 &&
                    newMaxCanvasDims[1] > minCanvasDims[1])) {
                    maxCanvasDims = newMaxCanvasDims;
                }
            }
        };

        this.setMinCanvasDimensions = function (minCanvasDimensions) {
            if (!angular.isUndefined(minCanvasDimensions)) {
                var newMinCanvasDims = [];
                if (typeof minCanvasDimensions === 'number' || typeof minCanvasDimensions === 'string') {
                    newMinCanvasDims = [
                        parseInt(parseInt(minCanvasDimensions), 10),
                        parseInt(parseInt(minCanvasDimensions), 10)
                    ];
                } else {
                    newMinCanvasDims = [
                        parseInt(minCanvasDimensions.w, 10),
                        parseInt(minCanvasDimensions.h, 10)
                    ];
                }
                if ((!isNaN(newMinCanvasDims[0]) &&
                    newMinCanvasDims[0] >= 0) &&
                    (!isNaN(newMinCanvasDims[1]) &&
                    newMinCanvasDims[1] >= 0)) {
                    minCanvasDims = newMinCanvasDims;
                }
            }
        };

        this.setScalemode = function (value) {
            scalemode = value;
        };

        this.getScalemode = function () {
            return scalemode;
        };

        this.getResultImageSize = function () {
            if (resImgSize === 'selection') {
                return theArea.getSize();
            }

            if (resImgSize === 'max') {
                // We maximize the rendered size
                var zoom = 1;
                if (image && ctx && ctx.canvas) {
                    zoom = image.width / ctx.canvas.width;
                }
                var size = {
                    w: zoom * theArea.getSize().w,
                    h: zoom * theArea.getSize().h
                };

                if (areaMinRelativeSize) {
                    if (size.w < areaMinRelativeSize.w) {
                        size.w = areaMinRelativeSize.w;
                    }
                    if (size.h < areaMinRelativeSize.h) {
                        size.h = areaMinRelativeSize.h;
                    }
                }

                return size;
            }

            return resImgSize;
        };

        this.setResultImageSize = function (size) {
            if (angular.isArray(size)) {
                resImgSizeArray = size.slice();
                size = {
                    w: parseInt(size[0].w, 10),
                    h: parseInt(size[0].h, 10)
                };
                return;
            }
            if (angular.isUndefined(size)) {
                return;
            }
            //allow setting of size to "selection" for mirroring selection's dimensions
            if (angular.isString(size)) {
                resImgSize = size;
                return;
            }
            //allow scalar values for square-like selection shapes
            if (angular.isNumber(size)) {
                size = parseInt(size, 10);
                size = {
                    w: size,
                    h: size
                };
            }
            size = {
                w: parseInt(size.w, 10),
                h: parseInt(size.h, 10)
            };
            if (!isNaN(size.w) && !isNaN(size.h)) {
                resImgSize = size;
                drawScene();
            }
        };

        this.setResultImageFormat = function (format) {
            resImgFormat = format;
        };

        this.setResultImageQuality = function (quality) {
            quality = parseFloat(quality);
            if (!isNaN(quality) && quality >= 0 && quality <= 1) {
                resImgQuality = quality;
            }
        };

        // returns a string of the selection area's type
        this.getAreaType = function () {
            return theArea.getType();
        };

        this.setAreaType = function (type) {
            var center = theArea.getCenterPoint();
            var curSize = theArea.getSize(),
                curMinSize = theArea.getMinSize(),
                curX = center.x,
                curY = center.y;

            var AreaClass = CropAreaCircle;
            if (type === 'square') {
                AreaClass = CropAreaSquare;
            } else if (type === 'rectangle') {
                AreaClass = CropAreaRectangle;
            }
            theArea = new AreaClass(ctx, events);
            theArea.setMinSize(curMinSize);
            theArea.setSize(curSize);
            if (type === 'square' || type === 'circle') {
                forceAspectRatio = true;
                theArea.setForceAspectRatio(true);
            } else {
                forceAspectRatio = false;
                theArea.setForceAspectRatio(false);
            }

            //TODO: use top left point
            theArea.setCenterPoint({
                x: curX,
                y: curY
            });

            // resetCropHost();
            if (image !== null) {
                theArea.setImage(image);
            }

            drawScene();
        };

        this.getDominantColor = function (uri) {
            var imageDC = new Image(),
                colorThief = new ColorThief(),
                dominantColor = null,
                _p = $q.defer();
            imageDC.src = uri;
            imageDC.onload = function () {
                dominantColor = colorThief.getColor(imageDC);
                _p.resolve(dominantColor);
            };

            return _p.promise;
        };

        this.getPalette = function (uri) {
            var imageDC = new Image(),
                colorThief = new ColorThief(),
                palette = null,
                _p = $q.defer();
            imageDC.src = uri;
            imageDC.onload = function () {
                palette = colorThief.getPalette(imageDC, colorPaletteLength);
                _p.resolve(palette);
            };

            return _p.promise;
        };

        this.setPaletteColorLength = function (lg) {
            colorPaletteLength = lg;
        };

        this.setAspect = function (aspect) {
            isAspectRatio = true;
            theArea.setAspect(aspect);
            var minSize = theArea.getMinSize();
            minSize.w = minSize.h * aspect;
            theArea.setMinSize(minSize);
            var size = theArea.getSize();
            size.w = size.h * aspect;
            theArea.setSize(size);
        };

        /* Life Cycle begins */

        // Init Context var
        ctx = elCanvas[0].getContext('2d');

        // Init CropArea
        theArea = new CropAreaCircle(ctx, events);

        // Init Mouse Event Listeners
        $document.on('mousemove', onMouseMove);
        elCanvas.on('mousedown', onMouseDown);
        $document.on('mouseup', onMouseUp);

        // Init Touch Event Listeners
        $document.on('touchmove', onMouseMove);
        elCanvas.on('touchstart', onMouseDown);
        $document.on('touchend', onMouseUp);

        // CropHost Destructor
        this.destroy = function () {
            $document.off('mousemove', onMouseMove);
            elCanvas.off('mousedown', onMouseDown);
            $document.off('mouseup', onMouseUp);

            $document.off('touchmove', onMouseMove);
            elCanvas.off('touchstart', onMouseDown);
            $document.off('touchend', onMouseUp);

            elCanvas.remove();
        };
    };
}]);

crop.factory('cropPubSub', [function() {
    return function() {
        var events = {};
        // Subscribe
        this.on = function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        };
        // Publish
        this.trigger = function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        };
    };
}]);

crop.directive('imgCrop', ['$timeout', 'cropHost', 'cropPubSub', function ($timeout, CropHost, CropPubSub) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            resultImage: '=',
            resultArrayImage: '=?',
            resultBlob: '=?',
            urlBlob: '=?',
            chargement: '=?',
            cropject: '=?',
            maxCanvasDimensions: '=?',
            minCanvasDimensions: '=?',
            canvasScalemode: '@?', /* String. If set to 'full-width' the directive uses all width available */
            /* and the canvas expands in height as much as it need to maintain the aspect ratio */
            /* if set to 'fixed-height', the directive is restricted by a parent element in height */

            changeOnFly: '=?',
            liveView: '=?',
            initMaxArea: '=?',
            areaCoords: '=?',
            areaType: '@',
            areaMinSize: '=?',
            areaInitSize: '=?',
            areaInitCoords: '=?',
            areaInitIsRelativeToImage: '=?', /* Boolean: If true the areaInitCoords and areaInitSize is scaled according to canvas size. */
            /* No matter how big/small the canvas is, the resultImage remains the same */
            /* Example: areaInitCoords are {x: 100, y: 100}, areaInitSize {w: 100, h: 100}   */
            /* Image is 1000x1000
             /* if canvas is 500x500 Crop coordinates will be x: 50, y: 50, w: 50, h: 50 */
            /* if canvas is 100x100 crop coordinates will be x: 10, y: 10, w: 10, h: 10 */
            areaMinRelativeSize: '=?',
            resultImageSize: '=?',
            resultImageFormat: '=?',
            resultImageQuality: '=?',

            aspectRatio: '=?',
            allowCropResizeOnCorners: '=?',

            dominantColor: '=?',
            paletteColor: '=?',
            paletteColorLength: '=?',

            onChange: '&',
            onLoadBegin: '&',
            onLoadDone: '&',
            onLoadError: '&'
        },
        template: '<canvas></canvas>',
        controller: ['$scope', function ($scope) {
            $scope.events = new CropPubSub();
        }],
        link: function (scope, element) {

            console.warn('This plugin is deprecated in the name of ui-cropper. You can find it under https://github.com/CrackerakiUA/ui-cropper');

            if (scope.liveView && typeof scope.liveView.block === 'boolean') {
                scope.liveView.render = function (callback) {
                    updateResultImage(scope, true, callback);
                };
            } else {
                scope.liveView = {block: false};
            }

            // Init Events Manager
            var events = scope.events;

            // Init Crop Host
            var cropHost = new CropHost(element.find('canvas'), {}, events);

            if (scope.canvasScalemode) {
                cropHost.setScalemode(scope.canvasScalemode);
            } else {
                cropHost.setScalemode('fixed-height');
            }

            element.addClass(cropHost.getScalemode());

            // Store Result Image to check if it's changed
            var storedResultImage;

            var updateResultImage = function (scope, force, callback) {
                if (scope.image !== '' && (!scope.liveView.block || force)) {
                    var resultImageObj = cropHost.getResultImage();
                    var resultImage;
                    if (angular.isArray(resultImageObj)) {
                        resultImage = resultImageObj[0].dataURI;
                        scope.resultArrayImage = resultImageObj;
                    } else {
                        resultImage = resultImageObj.dataURI;
                    }

                    var urlCreator = window.URL || window.webkitURL;
                    if (storedResultImage !== resultImage) {
                        storedResultImage = resultImage;
                        scope.resultImage = resultImage;
                        if (scope.liveView.callback) {
                            scope.liveView.callback(resultImage);
                        }
                        if (callback) {
                            callback(resultImage);
                        }
                        cropHost.getResultImageDataBlob().then(function (blob) {
                            scope.resultBlob = blob;
                            scope.urlBlob = urlCreator.createObjectURL(blob);
                        });

                        if (scope.resultImage) {
                            cropHost.getDominantColor(scope.resultImage).then(function (dominantColor) {
                                scope.dominantColor = dominantColor;
                            });
                            cropHost.getPalette(scope.resultImage).then(function (palette) {
                                scope.paletteColor = palette;
                            });
                        }

                        updateAreaCoords(scope);
                        scope.onChange({
                            $dataURI: scope.resultImage
                        });
                    }
                }
            };

            var updateAreaCoords = function (scope) {
                scope.areaCoords = cropHost.getAreaCoords();
            };

            var updateCropject = function (scope) {
                var areaCoords = cropHost.getAreaCoords();

                var dimRatio = {
                    x: cropHost.getArea().getImage().width / cropHost.getArea().getCanvasSize().w,
                    y: cropHost.getArea().getImage().height / cropHost.getArea().getCanvasSize().h
                };

                scope.cropject = {
                    canvasSize: cropHost.getArea().getCanvasSize(),
                    areaCoords: areaCoords,
                    cropWidth: areaCoords.w,
                    cropHeight: areaCoords.h,
                    cropTop: areaCoords.y,
                    cropLeft: areaCoords.x,
                    cropImageWidth: Math.round(areaCoords.w * dimRatio.x),
                    cropImageHeight: Math.round(areaCoords.h * dimRatio.y),
                    cropImageTop: Math.round(areaCoords.y * dimRatio.y),
                    cropImageLeft: Math.round(areaCoords.x * dimRatio.x)
                };
            };

            // Wrapper to safely exec functions within $apply on a running $digest cycle
            var fnSafeApply = function (fn) {
                return function () {
                    $timeout(function () {
                        scope.$apply(function (scope) {
                            fn(scope);
                        });
                    });
                };
            };

            // Will get the users language settings, and return the appropriate loading text
            var printLoadMsg = function () {
                var language = window.navigator.userLanguage || window.navigator.language;

                switch (language) {
                    case 'nl':
                    case 'nl_NL':
                        return 'Aan het laden';

                    case 'fr':
                    case 'fr-FR':
                        return 'Chargement';

                    case 'es':
                    case 'es-ES':
                        return 'Cargando';

                    case 'ca':
                    case 'ca-ES':
                        return 'Càrrega';

                    case 'de':
                    case 'de-DE':
                        return 'Laden';

                    default:
                        return 'Loading';
                }
            };

            if (!scope.chargement) {
                scope.chargement = printLoadMsg();
            }
            var displayLoading = function () {
                element.append('<div class="loading"><span>' + scope.chargement + '...</span></div>');
            };

            // Setup CropHost Event Handlers
            events
                .on('load-start', fnSafeApply(function (scope) {
                    scope.onLoadBegin({});
                }))
                .on('load-done', fnSafeApply(function (scope) {
                    var children = element.children();
                    angular.forEach(children, function (child, index) {
                        if (angular.element(child).hasClass('loading')) {
                            angular.element(child).remove();
                        }
                    });
                    updateCropject(scope);
                    scope.onLoadDone({});
                }))
                .on('load-error', fnSafeApply(function (scope) {
                    scope.onLoadError({});
                }))
                .on('area-move area-resize', fnSafeApply(function (scope) {
                    if (!!scope.changeOnFly) {
                        updateResultImage(scope);
                    }
                    updateCropject(scope);
                }))
                .on('image-updated', fnSafeApply(function (scope) {
                    cropHost.setAreaMinRelativeSize(scope.areaMinRelativeSize);
                }))
                .on('area-move-end area-resize-end image-updated', fnSafeApply(function (scope) {
                    updateResultImage(scope);
                    updateCropject(scope);
                }));

            // Sync CropHost with Directive's options
            scope.$watch('image', function (newVal) {
                if (newVal) {
                    displayLoading();
                }
                // cancel timeout if necessary
                if (!!scope.timeout) {
                    $timeout.cancel(scope.timeout);
                }
                scope.timeout = $timeout(function () {
                    scope.timeout = null;
                    cropHost.setInitMax(scope.initMaxArea);
                    cropHost.setNewImageSource(scope.image);
                }, 100);
            });
            scope.$watch('areaType', function () {
                cropHost.setAreaType(scope.areaType);
                updateResultImage(scope);
            });
            scope.$watch('areaMinSize', function () {
                cropHost.setAreaMinSize(scope.areaMinSize);
                updateResultImage(scope);
            });
            scope.$watch('areaMinRelativeSize', function () {
                if (scope.image !== '') {
                    cropHost.setAreaMinRelativeSize(scope.areaMinRelativeSize);
                    updateResultImage(scope);
                }
            });
            scope.$watch('areaInitSize', function () {
                cropHost.setAreaInitSize(scope.areaInitSize);
                updateResultImage(scope);
            });
            scope.$watch('areaInitCoords', function () {
                cropHost.setAreaInitCoords(scope.areaInitCoords);
                cropHost.areaInitIsRelativeToImage = scope.areaInitIsRelativeToImage;
                updateResultImage(scope);
            });
            scope.$watch('maxCanvasDimensions', function () {
                cropHost.setMaxCanvasDimensions(scope.maxCanvasDimensions);
            });
            scope.$watch('minCanvasDimensions', function () {
                cropHost.setMinCanvasDimensions(scope.minCanvasDimensions);
            });
            scope.$watch('resultImageFormat', function () {
                cropHost.setResultImageFormat(scope.resultImageFormat);
                updateResultImage(scope);
            });
            scope.$watch('resultImageQuality', function () {
                cropHost.setResultImageQuality(scope.resultImageQuality);
                updateResultImage(scope);
            });
            scope.$watch('resultImageSize', function () {
                cropHost.setResultImageSize(scope.resultImageSize);
                updateResultImage(scope);
            });
            scope.$watch('paletteColorLength', function () {
                cropHost.setPaletteColorLength(scope.paletteColorLength);
            });
            scope.$watch('aspectRatio', function () {
                if (typeof scope.aspectRatio === 'string' && scope.aspectRatio !== '') {
                    scope.aspectRatio = parseInt(scope.aspectRatio);
                }
                if (scope.aspectRatio) {
                    cropHost.setAspect(scope.aspectRatio);
                }
            });
            scope.$watch('allowCropResizeOnCorners', function () {
                if (scope.allowCropResizeOnCorners) {
                    cropHost.setAllowCropResizeOnCorners(scope.allowCropResizeOnCorners);
                }
            });

            // Update CropHost dimensions when the directive element is resized
            scope.$watch(
                function () {
                    if (cropHost.getScalemode() === 'fixed-height') {
                        return [element[0].clientWidth, element[0].clientHeight];
                    }
                    if (cropHost.getScalemode() === 'full-width') {
                        return element[0].clientWidth;
                    }
                },
                function (value) {

                    if (cropHost.getScalemode() === 'fixed-height') {
                        if (value[0] > 0 && value[1] > 0) {
                            cropHost.setMaxDimensions(value[0], value[1]);
                            updateResultImage(scope);
                        }
                    }
                    if (cropHost.getScalemode() === 'full-width') {
                        if (value > 0) {
                            cropHost.setMaxDimensions(value);
                        }
                    }
                },
                true
            );

            // Destroy CropHost Instance when the directive is destroying
            scope.$on('$destroy', function () {
                cropHost.destroy();
            });
        }
    };
}]);

}());

/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2013-12-27
 * 
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: X11/MIT
 *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

(function(view) {
    "use strict";
    var
        Uint8Array = view.Uint8Array,
        HTMLCanvasElement = view.HTMLCanvasElement,
        canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype,
        is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i,
        to_data_url = "toDataURL",
        base64_ranks, decode_base64 = function(base64) {
            var
                len = base64.length,
                buffer = new Uint8Array(len / 4 * 3 | 0),
                i = 0,
                outptr = 0,
                last = [0, 0],
                state = 0,
                save = 0,
                rank, code, undef;
            while (len--) {
                code = base64.charCodeAt(i++);
                rank = base64_ranks[code - 43];
                if (rank !== 255 && rank !== undef) {
                    last[1] = last[0];
                    last[0] = code;
                    save = (save << 6) | rank;
                    state++;
                    if (state === 4) {
                        buffer[outptr++] = save >>> 16;
                        if (last[1] !== 61 /* padding character */ ) {
                            buffer[outptr++] = save >>> 8;
                        }
                        if (last[0] !== 61 /* padding character */ ) {
                            buffer[outptr++] = save;
                        }
                        state = 0;
                    }
                }
            }
            // 2/3 chance there's going to be some null bytes at the end, but that
            // doesn't really matter with most image formats.
            // If it somehow matters for you, truncate the buffer up outptr.
            return buffer;
        };
    if (Uint8Array) {
        base64_ranks = new Uint8Array([
            62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
        ]);
    }
    if (HTMLCanvasElement && !canvas_proto.toBlob) {
        canvas_proto.toBlob = function(callback, type /*, ...args*/ ) {
            if (!type) {
                type = "image/png";
            }
            if (this.mozGetAsFile) {
                callback(this.mozGetAsFile("canvas", type));
                return;
            }
            if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
                callback(this.msToBlob());
                return;
            }

            var
                args = Array.prototype.slice.call(arguments, 1),
                dataURI = this[to_data_url].apply(this, args),
                header_end = dataURI.indexOf(","),
                data = dataURI.substring(header_end + 1),
                is_base64 = is_base64_regex.test(dataURI.substring(0, header_end)),
                blob;
            if (Blob.fake) {
                // no reason to decode a data: URI that's just going to become a data URI again
                blob = new Blob
                if (is_base64) {
                    blob.encoding = "base64";
                } else {
                    blob.encoding = "URI";
                }
                blob.data = data;
                blob.size = data.length;
            } else if (Uint8Array) {
                if (is_base64) {
                    blob = new Blob([decode_base64(data)], {
                        type: type
                    });
                } else {
                    blob = new Blob([decodeURIComponent(data)], {
                        type: type
                    });
                }
            }
            if (typeof callback !== 'undefined') {
                callback(blob);
            }
        };

        if (canvas_proto.toDataURLHD) {
            canvas_proto.toBlobHD = function() {
                to_data_url = "toDataURLHD";
                var blob = this.toBlob();
                to_data_url = "toDataURL";
                return blob;
            }
        } else {
            canvas_proto.toBlobHD = canvas_proto.toBlob;
        }
    }
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));


/*!
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 */
(function() {
    /*!
     * Color Thief v2.0
     * by Lokesh Dhakar - http://www.lokeshdhakar.com
     *
     * Thanks
     * ------
     * Nick Rabinowitz - For creating quantize.js.
     * John Schulz - For clean up and optimization. @JFSIII
     * Nathan Spady - For adding drag and drop support to the demo page.
     *
     * License
     * -------
     * Copyright 2011, 2015 Lokesh Dhakar
     * Released under the MIT license
     * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
     *
     */

    /*
      CanvasImage Class
      Class that wraps the html image element and canvas.
      It also simplifies some of the canvas context manipulation
      with a set of helper functions.
    */
    var CanvasImage = function(image) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);

        this.width = this.canvas.width = image.width;
        this.height = this.canvas.height = image.height;

        this.context.drawImage(image, 0, 0, this.width, this.height);
    };

    CanvasImage.prototype.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    };

    CanvasImage.prototype.update = function(imageData) {
        this.context.putImageData(imageData, 0, 0);
    };

    CanvasImage.prototype.getPixelCount = function() {
        return this.width * this.height;
    };

    CanvasImage.prototype.getImageData = function() {
        return this.context.getImageData(0, 0, this.width, this.height);
    };

    CanvasImage.prototype.removeCanvas = function() {
        this.canvas.parentNode.removeChild(this.canvas);
    };

    var ColorThief = function() {};

    /*
     * getColor(sourceImage[, quality])
     * returns {r: num, g: num, b: num}
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar
     * colors and return the base color from the largest cluster.
     *
     * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster a color will be returned but the greater the likelihood that it will not be the visually
     * most dominant color.
     *
     * */
    ColorThief.prototype.getColor = function(sourceImage, quality) {
        var palette = this.getPalette(sourceImage, 5, quality);
        var dominantColor = palette[0];
        return dominantColor;
    };

    /*
     * getPalette(sourceImage[, colorCount, quality])
     * returns array[ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...]
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar colors.
     *
     * colorCount determines the size of the palette; the number of colors returned. If not set, it
     * defaults to 10.
     *
     * BUGGY: Function does not always return the requested amount of colors. It can be +/- 2.
     *
     * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster the palette generation but the greater the likelihood that colors will be missed.
     *
     *
     */
    ColorThief.prototype.getPalette = function(sourceImage, colorCount, quality) {

        if (typeof colorCount === 'undefined') {
            colorCount = 10;
        }
        if (typeof quality === 'undefined' || quality < 1) {
            quality = 10;
        }

        // Create custom CanvasImage object
        var image = new CanvasImage(sourceImage);
        var imageData = image.getImageData();
        var pixels = imageData.data;
        var pixelCount = image.getPixelCount();

        // Store the RGB values in an array format suitable for quantize function
        var pixelArray = [];
        for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // If pixel is mostly opaque and not white
            if (a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }

        // Send array to quantize function which clusters values
        // using median cut algorithm
        var cmap = MMCQ.quantize(pixelArray, colorCount);
        var palette = cmap ? cmap.palette() : null;

        // Clean up
        image.removeCanvas();

        return palette;
    };

    /*!
     * quantize.js Copyright 2008 Nick Rabinowitz.
     * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     */

    // fill out a couple protovis dependencies
    /*!
     * Block below copied from Protovis: http://mbostock.github.com/protovis/
     * Copyright 2010 Stanford Visualization Group
     * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
     */
    if (!pv) {
        var pv = {
            map: function(array, f) {
                var o = {};
                return f ? array.map(function(d, i) {
                    o.index = i;
                    return f.call(o, d);
                }) : array.slice();
            },
            naturalOrder: function(a, b) {
                return (a < b) ? -1 : ((a > b) ? 1 : 0);
            },
            sum: function(array, f) {
                var o = {};
                return array.reduce(f ? function(p, d, i) {
                    o.index = i;
                    return p + f.call(o, d);
                } : function(p, d) {
                    return p + d;
                }, 0);
            },
            max: function(array, f) {
                return Math.max.apply(null, f ? pv.map(array, f) : array);
            }
        };
    }

    /**
     * Basic Javascript port of the MMCQ (modified median cut quantization)
     * algorithm from the Leptonica library (http://www.leptonica.com/).
     * Returns a color map you can use to map original pixels to the reduced
     * palette. Still a work in progress.
     *
     * @author Nick Rabinowitz
     * @example

    // array of pixels as [R,G,B] arrays
    var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                    // etc
                    ];
    var maxColors = 4;

    var cmap = MMCQ.quantize(myPixels, maxColors);
    var newPalette = cmap.palette();
    var newPixels = myPixels.map(function(p) {
        return cmap.map(p);
    });

     */
    var MMCQ = (function() {
        // private constants
        var sigbits = 5,
            rshift = 8 - sigbits,
            maxIterations = 1000,
            fractByPopulations = 0.75;

        // get reduced-space color index for a pixel
        function getColorIndex(r, g, b) {
            return (r << (2 * sigbits)) + (g << sigbits) + b;
        }

        // Simple priority queue
        function PQueue(comparator) {
            var contents = [],
                sorted = false;

            function sort() {
                contents.sort(comparator);
                sorted = true;
            }

            return {
                push: function(o) {
                    contents.push(o);
                    sorted = false;
                },
                peek: function(index) {
                    if (!sorted) sort();
                    if (index === undefined) index = contents.length - 1;
                    return contents[index];
                },
                pop: function() {
                    if (!sorted) sort();
                    return contents.pop();
                },
                size: function() {
                    return contents.length;
                },
                map: function(f) {
                    return contents.map(f);
                },
                debug: function() {
                    if (!sorted) sort();
                    return contents;
                }
            };
        }

        // 3d color space box
        function VBox(r1, r2, g1, g2, b1, b2, histo) {
            var vbox = this;
            vbox.r1 = r1;
            vbox.r2 = r2;
            vbox.g1 = g1;
            vbox.g2 = g2;
            vbox.b1 = b1;
            vbox.b2 = b2;
            vbox.histo = histo;
        }
        VBox.prototype = {
            volume: function(force) {
                var vbox = this;
                if (!vbox._volume || force) {
                    vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
                }
                return vbox._volume;
            },
            count: function(force) {
                var vbox = this,
                    histo = vbox.histo;
                if (!vbox._count_set || force) {
                    var npix = 0,
                        i, j, k;
                    for (i = vbox.r1; i <= vbox.r2; i++) {
                        for (j = vbox.g1; j <= vbox.g2; j++) {
                            for (k = vbox.b1; k <= vbox.b2; k++) {
                                index = getColorIndex(i, j, k);
                                npix += (histo[index] || 0);
                            }
                        }
                    }
                    vbox._count = npix;
                    vbox._count_set = true;
                }
                return vbox._count;
            },
            copy: function() {
                var vbox = this;
                return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
            },
            avg: function(force) {
                var vbox = this,
                    histo = vbox.histo;
                if (!vbox._avg || force) {
                    var ntot = 0,
                        mult = 1 << (8 - sigbits),
                        rsum = 0,
                        gsum = 0,
                        bsum = 0,
                        hval,
                        i, j, k, histoindex;
                    for (i = vbox.r1; i <= vbox.r2; i++) {
                        for (j = vbox.g1; j <= vbox.g2; j++) {
                            for (k = vbox.b1; k <= vbox.b2; k++) {
                                histoindex = getColorIndex(i, j, k);
                                hval = histo[histoindex] || 0;
                                ntot += hval;
                                rsum += (hval * (i + 0.5) * mult);
                                gsum += (hval * (j + 0.5) * mult);
                                bsum += (hval * (k + 0.5) * mult);
                            }
                        }
                    }
                    if (ntot) {
                        vbox._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
                    } else {
                        //                    console.log('empty box');
                        vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)];
                    }
                }
                return vbox._avg;
            },
            contains: function(pixel) {
                var vbox = this,
                    rval = pixel[0] >> rshift;
                gval = pixel[1] >> rshift;
                bval = pixel[2] >> rshift;
                return (rval >= vbox.r1 && rval <= vbox.r2 &&
                    gval >= vbox.g1 && gval <= vbox.g2 &&
                    bval >= vbox.b1 && bval <= vbox.b2);
            }
        };

        // Color map
        function CMap() {
            this.vboxes = new PQueue(function(a, b) {
                return pv.naturalOrder(
                    a.vbox.count() * a.vbox.volume(),
                    b.vbox.count() * b.vbox.volume()
                );
            });
        }
        CMap.prototype = {
            push: function(vbox) {
                this.vboxes.push({
                    vbox: vbox,
                    color: vbox.avg()
                });
            },
            palette: function() {
                return this.vboxes.map(function(vb) {
                    return vb.color;
                });
            },
            size: function() {
                return this.vboxes.size();
            },
            map: function(color) {
                var vboxes = this.vboxes;
                for (var i = 0; i < vboxes.size(); i++) {
                    if (vboxes.peek(i).vbox.contains(color)) {
                        return vboxes.peek(i).color;
                    }
                }
                return this.nearest(color);
            },
            nearest: function(color) {
                var vboxes = this.vboxes,
                    d1, d2, pColor;
                for (var i = 0; i < vboxes.size(); i++) {
                    d2 = Math.sqrt(
                        Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
                        Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
                        Math.pow(color[2] - vboxes.peek(i).color[2], 2)
                    );
                    if (d2 < d1 || d1 === undefined) {
                        d1 = d2;
                        pColor = vboxes.peek(i).color;
                    }
                }
                return pColor;
            },
            forcebw: function() {
                // XXX: won't  work yet
                var vboxes = this.vboxes;
                vboxes.sort(function(a, b) {
                    return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));
                });

                // force darkest color to black if everything < 5
                var lowest = vboxes[0].color;
                if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
                    vboxes[0].color = [0, 0, 0];

                // force lightest color to white if everything > 251
                var idx = vboxes.length - 1,
                    highest = vboxes[idx].color;
                if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
                    vboxes[idx].color = [255, 255, 255];
            }
        };

        // histo (1-d array, giving the number of pixels in
        // each quantized region of color space), or null on error
        function getHisto(pixels) {
            var histosize = 1 << (3 * sigbits),
                histo = new Array(histosize),
                index, rval, gval, bval;
            pixels.forEach(function(pixel) {
                rval = pixel[0] >> rshift;
                gval = pixel[1] >> rshift;
                bval = pixel[2] >> rshift;
                index = getColorIndex(rval, gval, bval);
                histo[index] = (histo[index] || 0) + 1;
            });
            return histo;
        }

        function vboxFromPixels(pixels, histo) {
            var rmin = 1000000,
                rmax = 0,
                gmin = 1000000,
                gmax = 0,
                bmin = 1000000,
                bmax = 0,
                rval, gval, bval;
            // find min/max
            pixels.forEach(function(pixel) {
                rval = pixel[0] >> rshift;
                gval = pixel[1] >> rshift;
                bval = pixel[2] >> rshift;
                if (rval < rmin) rmin = rval;
                else if (rval > rmax) rmax = rval;
                if (gval < gmin) gmin = gval;
                else if (gval > gmax) gmax = gval;
                if (bval < bmin) bmin = bval;
                else if (bval > bmax) bmax = bval;
            });
            return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
        }

        function medianCutApply(histo, vbox) {
            if (!vbox.count()) return;

            var rw = vbox.r2 - vbox.r1 + 1,
                gw = vbox.g2 - vbox.g1 + 1,
                bw = vbox.b2 - vbox.b1 + 1,
                maxw = pv.max([rw, gw, bw]);
            // only one pixel, no split
            if (vbox.count() == 1) {
                return [vbox.copy()];
            }
            /* Find the partial sum arrays along the selected axis. */
            var total = 0,
                partialsum = [],
                lookaheadsum = [],
                i, j, k, sum, index;
            if (maxw == rw) {
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    sum = 0;
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            index = getColorIndex(i, j, k);
                            sum += (histo[index] || 0);
                        }
                    }
                    total += sum;
                    partialsum[i] = total;
                }
            } else if (maxw == gw) {
                for (i = vbox.g1; i <= vbox.g2; i++) {
                    sum = 0;
                    for (j = vbox.r1; j <= vbox.r2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            index = getColorIndex(j, i, k);
                            sum += (histo[index] || 0);
                        }
                    }
                    total += sum;
                    partialsum[i] = total;
                }
            } else { /* maxw == bw */
                for (i = vbox.b1; i <= vbox.b2; i++) {
                    sum = 0;
                    for (j = vbox.r1; j <= vbox.r2; j++) {
                        for (k = vbox.g1; k <= vbox.g2; k++) {
                            index = getColorIndex(j, k, i);
                            sum += (histo[index] || 0);
                        }
                    }
                    total += sum;
                    partialsum[i] = total;
                }
            }
            partialsum.forEach(function(d, i) {
                lookaheadsum[i] = total - d;
            });

            function doCut(color) {
                var dim1 = color + '1',
                    dim2 = color + '2',
                    left, right, vbox1, vbox2, d2, count2 = 0;
                for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
                    if (partialsum[i] > total / 2) {
                        vbox1 = vbox.copy();
                        vbox2 = vbox.copy();
                        left = i - vbox[dim1];
                        right = vbox[dim2] - i;
                        if (left <= right)
                            d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
                        else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
                        // avoid 0-count boxes
                        while (!partialsum[d2]) d2++;
                        count2 = lookaheadsum[d2];
                        while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
                        // set dimensions
                        vbox1[dim2] = d2;
                        vbox2[dim1] = vbox1[dim2] + 1;
                        //                    console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
                        return [vbox1, vbox2];
                    }
                }

            }
            // determine the cut planes
            return maxw == rw ? doCut('r') :
                maxw == gw ? doCut('g') :
                doCut('b');
        }

        function quantize(pixels, maxcolors) {
            // short-circuit
            if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
                //            console.log('wrong number of maxcolors');
                return false;
            }

            // XXX: check color content and convert to grayscale if insufficient

            var histo = getHisto(pixels),
                histosize = 1 << (3 * sigbits);

            // check that we aren't below maxcolors already
            var nColors = 0;
            histo.forEach(function() {
                nColors++;
            });
            if (nColors <= maxcolors) {
                // XXX: generate the new colors from the histo and return
            }

            // get the beginning vbox from the colors
            var vbox = vboxFromPixels(pixels, histo),
                pq = new PQueue(function(a, b) {
                    return pv.naturalOrder(a.count(), b.count());
                });
            pq.push(vbox);

            // inner function to do the iteration
            function iter(lh, target) {
                var ncolors = 1,
                    niters = 0,
                    vbox;
                while (niters < maxIterations) {
                    vbox = lh.pop();
                    if (!vbox.count()) { /* just put it back */
                        lh.push(vbox);
                        niters++;
                        continue;
                    }
                    // do the cut
                    var vboxes = medianCutApply(histo, vbox),
                        vbox1 = vboxes[0],
                        vbox2 = vboxes[1];

                    if (!vbox1) {
                        //                    console.log("vbox1 not defined; shouldn't happen!");
                        return;
                    }
                    lh.push(vbox1);
                    if (vbox2) { /* vbox2 can be null */
                        lh.push(vbox2);
                        ncolors++;
                    }
                    if (ncolors >= target) return;
                    if (niters++ > maxIterations) {
                        //                    console.log("infinite loop; perhaps too few pixels!");
                        return;
                    }
                }
            }

            // first set of colors, sorted by population
            iter(pq, fractByPopulations * maxcolors);

            // Re-sort by the product of pixel occupancy times the size in color space.
            var pq2 = new PQueue(function(a, b) {
                return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume());
            });
            while (pq.size()) {
                pq2.push(pq.pop());
            }

            // next set - generate the median cuts using the (npix * vol) sorting.
            iter(pq2, maxcolors - pq2.size());

            // calculate the actual colors
            var cmap = new CMap();
            while (pq2.size()) {
                cmap.push(pq2.pop());
            }

            return cmap;
        }

        return {
            quantize: quantize
        };
    })();

    /**
     * Export class to global
     */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return ColorThief;
        }); // for AMD loader
    } else if (typeof exports === 'object') {
        module.exports = ColorThief; // for CommonJS
    } else {
        this.ColorThief = ColorThief;
    }
}.call(this));


/*!
 * Exif.js v2.1.1
 * https://github.com/exif-js/exif-js
 */
(function() {

    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }

    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;

        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }

            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }

    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }

    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    EXIF.getData = function(img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));


/**
 * Mega pixel image rendering library for iOS6 Safari
 *
 * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
 * which causes unexpected subsampling when drawing it in canvas.
 * By using this library, you can safely render the image with proper stretching.
 *
 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
 * Released under the MIT license
 */
(function () {

    /**
     * Detect subsampling in loaded image.
     * In iOS, larger images than 2M pixels may be subsampled in rendering.
     */
    function detectSubsampling(img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, -iw + 1, 0);
            // subsampled image becomes half smaller in rendering size.
            // check alpha channel value to confirm image is covering edge pixel or not.
            // if alpha value is 0 image is not covering, hence subsampled.
            return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
        } else {
            return false;
        }
    }

    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     */
    function detectVerticalSquash(img, iw, ih) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }

    /**
     * Rendering image element (with resizing) and get its data URL
     */
    function renderImageToDataURL(img, options, doSquash) {
        var canvas = document.createElement('canvas');
        renderImageToCanvas(img, canvas, options, doSquash);
        return canvas.toDataURL('image/jpeg', options.quality || 0.8);
    }

    /**
     * Rendering image element (with resizing) into the canvas element
     */
    function renderImageToCanvas(img, canvas, options, doSquash) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        if ((iw + ih) === false) {
            return;
        }
        var width = options.width, height = options.height;
        var ctx = canvas.getContext('2d');
        ctx.save();
        transformCoordinate(canvas, ctx, width, height, options.orientation);
        var subsampled = detectSubsampling(img);
        if (subsampled) {
            iw /= 2;
            ih /= 2;
        }
        var d = 1024; // size of tiling canvas
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = tmpCanvas.height = d;
        var tmpCtx = tmpCanvas.getContext('2d');
        var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
        var dw = Math.ceil(d * width / iw);
        var dh = Math.ceil(d * height / ih / vertSquashRatio);
        var sy = 0;
        var dy = 0;
        while (sy < ih) {
            var sx = 0;
            var dx = 0;
            while (sx < iw) {
                tmpCtx.clearRect(0, 0, d, d);
                tmpCtx.drawImage(img, -sx, -sy);
                ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
                sx += d;
                dx += dw;
            }
            sy += d;
            dy += dh;
        }
        ctx.restore();
        tmpCanvas = tmpCtx = null;
    }

    /**
     * Transform canvas coordination according to specified frame size and orientation
     * Orientation value is from EXIF tag
     */
    function transformCoordinate(canvas, ctx, width, height, orientation) {
        switch (orientation) {
            case 5:
            case 6:
            case 7:
            case 8:
                canvas.width = height;
                canvas.height = width;
                break;
            default:
                canvas.width = width;
                canvas.height = height;
        }
        switch (orientation) {
            case 2:
                // horizontal flip
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
                break;
            case 3:
                // 180 rotate left
                ctx.translate(width, height);
                ctx.rotate(Math.PI);
                break;
            case 4:
                // vertical flip
                ctx.translate(0, height);
                ctx.scale(1, -1);
                break;
            case 5:
                // vertical flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
            case 6:
                // 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -height);
                break;
            case 7:
                // horizontal flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(width, -height);
                ctx.scale(-1, 1);
                break;
            case 8:
                // 90 rotate left
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-width, 0);
                break;
            default:
                break;
        }
    }

    var URL = window.URL && window.URL.createObjectURL ? window.URL :
        window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
            null;

    /**
     * MegaPixImage class
     */
    function MegaPixImage(srcImage) {
        if (window.Blob && srcImage instanceof Blob) {
            if (!URL) {
                throw Error('No createObjectURL function found to create blob url');
            }
            var img = new Image();
            img.src = URL.createObjectURL(srcImage);
            this.blob = srcImage;
            srcImage = img;
        }
        if (!srcImage.naturalWidth && !srcImage.naturalHeight) {
            var _this = this;
            srcImage.onload = srcImage.onerror = function () {
                var listeners = _this.imageLoadListeners;
                if (listeners) {
                    _this.imageLoadListeners = null;
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        listeners[i]();
                    }
                }
            };
            this.imageLoadListeners = [];
        }
        this.srcImage = srcImage;
    }

    /**
     * Rendering megapix image into specified target element
     */
    MegaPixImage.prototype.render = function (target, options, callback) {
        if (this.imageLoadListeners) {
            var _this = this;
            this.imageLoadListeners.push(function () {
                _this.render(target, options, callback);
            });
            return;
        }
        options = options || {};
        var imgWidth = this.srcImage.naturalWidth, imgHeight = this.srcImage.naturalHeight,
            width = options.width, height = options.height,
            maxWidth = options.maxWidth, maxHeight = options.maxHeight,
            doSquash = !this.blob || this.blob.type === 'image/jpeg';
        if (width && !height) {
            height = (imgHeight * width / imgWidth) << 0;
        } else if (height && !width) {
            width = (imgWidth * height / imgHeight) << 0;
        } else {
            width = imgWidth;
            height = imgHeight;
        }
        if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = (imgHeight * width / imgWidth) << 0;
        }
        if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = (imgWidth * height / imgHeight) << 0;
        }
        var opt = {width: width, height: height};
        for (var k in options) {
            opt[k] = options[k];
        }

        var tagName = target.tagName.toLowerCase();
        if (tagName === 'img') {
            target.src = renderImageToDataURL(this.srcImage, opt, doSquash);
        } else if (tagName === 'canvas') {
            renderImageToCanvas(this.srcImage, target, opt, doSquash);
        }
        if (typeof this.onrender === 'function') {
            this.onrender(target);
        }
        if (callback) {
            callback();
        }
        if (this.blob) {
            this.blob = null;
            URL.revokeObjectURL(this.srcImage.src);
        }
    };

    /**
     * Export class to global
     */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return MegaPixImage;
        }); // for AMD loader
    } else if (typeof exports === 'object') {
        module.exports = MegaPixImage; // for CommonJS
    } else {
        this.MegaPixImage = MegaPixImage;
    }

})();
/* Chartist.js 0.9.8
 * Copyright © 2016 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
 */

!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.Chartist=b()}):"object"==typeof exports?module.exports=b():a.Chartist=b()}(this,function(){var a={version:"0.9.8"};return function(a,b,c){"use strict";c.namespaces={svg:"http://www.w3.org/2000/svg",xmlns:"http://www.w3.org/2000/xmlns/",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",ct:"http://gionkunz.github.com/chartist-js/ct"},c.noop=function(a){return a},c.alphaNumerate=function(a){return String.fromCharCode(97+a%26)},c.extend=function(a){a=a||{};var b=Array.prototype.slice.call(arguments,1);return b.forEach(function(b){for(var d in b)"object"!=typeof b[d]||null===b[d]||b[d]instanceof Array?a[d]=b[d]:a[d]=c.extend({},a[d],b[d])}),a},c.replaceAll=function(a,b,c){return a.replace(new RegExp(b,"g"),c)},c.ensureUnit=function(a,b){return"number"==typeof a&&(a+=b),a},c.quantity=function(a){if("string"==typeof a){var b=/^(\d+)\s*(.*)$/g.exec(a);return{value:+b[1],unit:b[2]||void 0}}return{value:a}},c.querySelector=function(a){return a instanceof Node?a:b.querySelector(a)},c.times=function(a){return Array.apply(null,new Array(a))},c.sum=function(a,b){return a+(b?b:0)},c.mapMultiply=function(a){return function(b){return b*a}},c.mapAdd=function(a){return function(b){return b+a}},c.serialMap=function(a,b){var d=[],e=Math.max.apply(null,a.map(function(a){return a.length}));return c.times(e).forEach(function(c,e){var f=a.map(function(a){return a[e]});d[e]=b.apply(null,f)}),d},c.roundWithPrecision=function(a,b){var d=Math.pow(10,b||c.precision);return Math.round(a*d)/d},c.precision=8,c.escapingMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"},c.serialize=function(a){return null===a||void 0===a?a:("number"==typeof a?a=""+a:"object"==typeof a&&(a=JSON.stringify({data:a})),Object.keys(c.escapingMap).reduce(function(a,b){return c.replaceAll(a,b,c.escapingMap[b])},a))},c.deserialize=function(a){if("string"!=typeof a)return a;a=Object.keys(c.escapingMap).reduce(function(a,b){return c.replaceAll(a,c.escapingMap[b],b)},a);try{a=JSON.parse(a),a=void 0!==a.data?a.data:a}catch(b){}return a},c.createSvg=function(a,b,d,e){var f;return b=b||"100%",d=d||"100%",Array.prototype.slice.call(a.querySelectorAll("svg")).filter(function(a){return a.getAttributeNS(c.namespaces.xmlns,"ct")}).forEach(function(b){a.removeChild(b)}),f=new c.Svg("svg").attr({width:b,height:d}).addClass(e).attr({style:"width: "+b+"; height: "+d+";"}),a.appendChild(f._node),f},c.normalizeData=function(a){if(a=a||{series:[],labels:[]},a.series=a.series||[],a.labels=a.labels||[],a.series.length>0&&0===a.labels.length){var b,d=c.getDataArray(a);b=d.every(function(a){return a instanceof Array})?Math.max.apply(null,d.map(function(a){return a.length})):d.length,a.labels=c.times(b).map(function(){return""})}return a},c.reverseData=function(a){a.labels.reverse(),a.series.reverse();for(var b=0;b<a.series.length;b++)"object"==typeof a.series[b]&&void 0!==a.series[b].data?a.series[b].data.reverse():a.series[b]instanceof Array&&a.series[b].reverse()},c.getDataArray=function(a,b,d){function e(a){if(!c.isFalseyButZero(a)){if((a.data||a)instanceof Array)return(a.data||a).map(e);if(a.hasOwnProperty("value"))return e(a.value);if(d){var b={};return"string"==typeof d?b[d]=c.getNumberOrUndefined(a):b.y=c.getNumberOrUndefined(a),b.x=a.hasOwnProperty("x")?c.getNumberOrUndefined(a.x):b.x,b.y=a.hasOwnProperty("y")?c.getNumberOrUndefined(a.y):b.y,b}return c.getNumberOrUndefined(a)}}return(b&&!a.reversed||!b&&a.reversed)&&(c.reverseData(a),a.reversed=!a.reversed),a.series.map(e)},c.normalizePadding=function(a,b){return b=b||0,"number"==typeof a?{top:a,right:a,bottom:a,left:a}:{top:"number"==typeof a.top?a.top:b,right:"number"==typeof a.right?a.right:b,bottom:"number"==typeof a.bottom?a.bottom:b,left:"number"==typeof a.left?a.left:b}},c.getMetaData=function(a,b){var d=a.data?a.data[b]:a[b];return d?c.serialize(d.meta):void 0},c.orderOfMagnitude=function(a){return Math.floor(Math.log(Math.abs(a))/Math.LN10)},c.projectLength=function(a,b,c){return b/c.range*a},c.getAvailableHeight=function(a,b){return Math.max((c.quantity(b.height).value||a.height())-(b.chartPadding.top+b.chartPadding.bottom)-b.axisX.offset,0)},c.getHighLow=function(a,b,d){function e(a){if(void 0!==a)if(a instanceof Array)for(var b=0;b<a.length;b++)e(a[b]);else{var c=d?+a[d]:+a;g&&c>f.high&&(f.high=c),h&&c<f.low&&(f.low=c)}}b=c.extend({},b,d?b["axis"+d.toUpperCase()]:{});var f={high:void 0===b.high?-Number.MAX_VALUE:+b.high,low:void 0===b.low?Number.MAX_VALUE:+b.low},g=void 0===b.high,h=void 0===b.low;return(g||h)&&e(a),(b.referenceValue||0===b.referenceValue)&&(f.high=Math.max(b.referenceValue,f.high),f.low=Math.min(b.referenceValue,f.low)),f.high<=f.low&&(0===f.low?f.high=1:f.low<0?f.high=0:f.high>0?f.low=0:(f.high=1,f.low=0)),f},c.isNum=function(a){return!isNaN(a)&&isFinite(a)},c.isFalseyButZero=function(a){return!a&&0!==a},c.getNumberOrUndefined=function(a){return isNaN(+a)?void 0:+a},c.getMultiValue=function(a,b){return c.isNum(a)?+a:a?a[b||"y"]||0:0},c.rho=function(a){function b(a,c){return a%c===0?c:b(c,a%c)}function c(a){return a*a+1}if(1===a)return a;var d,e=2,f=2;if(a%2===0)return 2;do e=c(e)%a,f=c(c(f))%a,d=b(Math.abs(e-f),a);while(1===d);return d},c.getBounds=function(a,b,d,e){var f,g,h,i=0,j={high:b.high,low:b.low};j.valueRange=j.high-j.low,j.oom=c.orderOfMagnitude(j.valueRange),j.step=Math.pow(10,j.oom),j.min=Math.floor(j.low/j.step)*j.step,j.max=Math.ceil(j.high/j.step)*j.step,j.range=j.max-j.min,j.numberOfSteps=Math.round(j.range/j.step);var k=c.projectLength(a,j.step,j),l=k<d,m=e?c.rho(j.range):0;if(e&&c.projectLength(a,1,j)>=d)j.step=1;else if(e&&m<j.step&&c.projectLength(a,m,j)>=d)j.step=m;else for(;;){if(l&&c.projectLength(a,j.step,j)<=d)j.step*=2;else{if(l||!(c.projectLength(a,j.step/2,j)>=d))break;if(j.step/=2,e&&j.step%1!==0){j.step*=2;break}}if(i++>1e3)throw new Error("Exceeded maximum number of iterations while optimizing scale step!")}var n=2.221e-16;for(j.step=Math.max(j.step,n),g=j.min,h=j.max;g+j.step<=j.low;)g+=j.step;for(;h-j.step>=j.high;)h-=j.step;j.min=g,j.max=h,j.range=j.max-j.min;var o=[];for(f=j.min;f<=j.max;f+=j.step){var p=c.roundWithPrecision(f);p!==o[o.length-1]&&o.push(f)}return j.values=o,j},c.polarToCartesian=function(a,b,c,d){var e=(d-90)*Math.PI/180;return{x:a+c*Math.cos(e),y:b+c*Math.sin(e)}},c.createChartRect=function(a,b,d){var e=!(!b.axisX&&!b.axisY),f=e?b.axisY.offset:0,g=e?b.axisX.offset:0,h=a.width()||c.quantity(b.width).value||0,i=a.height()||c.quantity(b.height).value||0,j=c.normalizePadding(b.chartPadding,d);h=Math.max(h,f+j.left+j.right),i=Math.max(i,g+j.top+j.bottom);var k={padding:j,width:function(){return this.x2-this.x1},height:function(){return this.y1-this.y2}};return e?("start"===b.axisX.position?(k.y2=j.top+g,k.y1=Math.max(i-j.bottom,k.y2+1)):(k.y2=j.top,k.y1=Math.max(i-j.bottom-g,k.y2+1)),"start"===b.axisY.position?(k.x1=j.left+f,k.x2=Math.max(h-j.right,k.x1+1)):(k.x1=j.left,k.x2=Math.max(h-j.right-f,k.x1+1))):(k.x1=j.left,k.x2=Math.max(h-j.right,k.x1+1),k.y2=j.top,k.y1=Math.max(i-j.bottom,k.y2+1)),k},c.createGrid=function(a,b,d,e,f,g,h,i){var j={};j[d.units.pos+"1"]=a,j[d.units.pos+"2"]=a,j[d.counterUnits.pos+"1"]=e,j[d.counterUnits.pos+"2"]=e+f;var k=g.elem("line",j,h.join(" "));i.emit("draw",c.extend({type:"grid",axis:d,index:b,group:g,element:k},j))},c.createLabel=function(a,b,d,e,f,g,h,i,j,k,l){var m,n={};if(n[f.units.pos]=a+h[f.units.pos],n[f.counterUnits.pos]=h[f.counterUnits.pos],n[f.units.len]=b,n[f.counterUnits.len]=Math.max(0,g-10),k){var o='<span class="'+j.join(" ")+'" style="'+f.units.len+": "+Math.round(n[f.units.len])+"px; "+f.counterUnits.len+": "+Math.round(n[f.counterUnits.len])+'px">'+e[d]+"</span>";m=i.foreignObject(o,c.extend({style:"overflow: visible;"},n))}else m=i.elem("text",n,j.join(" ")).text(e[d]);l.emit("draw",c.extend({type:"label",axis:f,index:d,group:i,element:m,text:e[d]},n))},c.getSeriesOption=function(a,b,c){if(a.name&&b.series&&b.series[a.name]){var d=b.series[a.name];return d.hasOwnProperty(c)?d[c]:b[c]}return b[c]},c.optionsProvider=function(b,d,e){function f(b){var f=h;if(h=c.extend({},j),d)for(i=0;i<d.length;i++){var g=a.matchMedia(d[i][0]);g.matches&&(h=c.extend(h,d[i][1]))}e&&b&&e.emit("optionsChanged",{previousOptions:f,currentOptions:h})}function g(){k.forEach(function(a){a.removeListener(f)})}var h,i,j=c.extend({},b),k=[];if(!a.matchMedia)throw"window.matchMedia not found! Make sure you're using a polyfill.";if(d)for(i=0;i<d.length;i++){var l=a.matchMedia(d[i][0]);l.addListener(f),k.push(l)}return f(),{removeMediaQueryListeners:g,getCurrentOptions:function(){return c.extend({},h)}}},c.splitIntoSegments=function(a,b,d){var e={increasingX:!1,fillHoles:!1};d=c.extend({},e,d);for(var f=[],g=!0,h=0;h<a.length;h+=2)void 0===b[h/2].value?d.fillHoles||(g=!0):(d.increasingX&&h>=2&&a[h]<=a[h-2]&&(g=!0),g&&(f.push({pathCoordinates:[],valueData:[]}),g=!1),f[f.length-1].pathCoordinates.push(a[h],a[h+1]),f[f.length-1].valueData.push(b[h/2]));return f}}(window,document,a),function(a,b,c){"use strict";c.Interpolation={},c.Interpolation.none=function(a){var b={fillHoles:!1};return a=c.extend({},b,a),function(b,d){for(var e=new c.Svg.Path,f=!0,g=0;g<b.length;g+=2){var h=b[g],i=b[g+1],j=d[g/2];void 0!==j.value?(f?e.move(h,i,!1,j):e.line(h,i,!1,j),f=!1):a.fillHoles||(f=!0)}return e}},c.Interpolation.simple=function(a){var b={divisor:2,fillHoles:!1};a=c.extend({},b,a);var d=1/Math.max(1,a.divisor);return function(b,e){for(var f,g,h,i=new c.Svg.Path,j=0;j<b.length;j+=2){var k=b[j],l=b[j+1],m=(k-f)*d,n=e[j/2];void 0!==n.value?(void 0===h?i.move(k,l,!1,n):i.curve(f+m,g,k-m,l,k,l,!1,n),f=k,g=l,h=n):a.fillHoles||(f=k=h=void 0)}return i}},c.Interpolation.cardinal=function(a){var b={tension:1,fillHoles:!1};a=c.extend({},b,a);var d=Math.min(1,Math.max(0,a.tension)),e=1-d;return function f(b,g){var h=c.splitIntoSegments(b,g,{fillHoles:a.fillHoles});if(h.length){if(h.length>1){var i=[];return h.forEach(function(a){i.push(f(a.pathCoordinates,a.valueData))}),c.Svg.Path.join(i)}if(b=h[0].pathCoordinates,g=h[0].valueData,b.length<=4)return c.Interpolation.none()(b,g);for(var j,k=(new c.Svg.Path).move(b[0],b[1],!1,g[0]),l=0,m=b.length;m-2*!j>l;l+=2){var n=[{x:+b[l-2],y:+b[l-1]},{x:+b[l],y:+b[l+1]},{x:+b[l+2],y:+b[l+3]},{x:+b[l+4],y:+b[l+5]}];j?l?m-4===l?n[3]={x:+b[0],y:+b[1]}:m-2===l&&(n[2]={x:+b[0],y:+b[1]},n[3]={x:+b[2],y:+b[3]}):n[0]={x:+b[m-2],y:+b[m-1]}:m-4===l?n[3]=n[2]:l||(n[0]={x:+b[l],y:+b[l+1]}),k.curve(d*(-n[0].x+6*n[1].x+n[2].x)/6+e*n[2].x,d*(-n[0].y+6*n[1].y+n[2].y)/6+e*n[2].y,d*(n[1].x+6*n[2].x-n[3].x)/6+e*n[2].x,d*(n[1].y+6*n[2].y-n[3].y)/6+e*n[2].y,n[2].x,n[2].y,!1,g[(l+2)/2])}return k}return c.Interpolation.none()([])}},c.Interpolation.monotoneCubic=function(a){var b={fillHoles:!1};return a=c.extend({},b,a),function d(b,e){var f=c.splitIntoSegments(b,e,{fillHoles:a.fillHoles,increasingX:!0});if(f.length){if(f.length>1){var g=[];return f.forEach(function(a){g.push(d(a.pathCoordinates,a.valueData))}),c.Svg.Path.join(g)}if(b=f[0].pathCoordinates,e=f[0].valueData,b.length<=4)return c.Interpolation.none()(b,e);var h,i,j=[],k=[],l=b.length/2,m=[],n=[],o=[],p=[];for(h=0;h<l;h++)j[h]=b[2*h],k[h]=b[2*h+1];for(h=0;h<l-1;h++)o[h]=k[h+1]-k[h],p[h]=j[h+1]-j[h],n[h]=o[h]/p[h];for(m[0]=n[0],m[l-1]=n[l-2],h=1;h<l-1;h++)0===n[h]||0===n[h-1]||n[h-1]>0!=n[h]>0?m[h]=0:(m[h]=3*(p[h-1]+p[h])/((2*p[h]+p[h-1])/n[h-1]+(p[h]+2*p[h-1])/n[h]),isFinite(m[h])||(m[h]=0));for(i=(new c.Svg.Path).move(j[0],k[0],!1,e[0]),h=0;h<l-1;h++)i.curve(j[h]+p[h]/3,k[h]+m[h]*p[h]/3,j[h+1]-p[h]/3,k[h+1]-m[h+1]*p[h]/3,j[h+1],k[h+1],!1,e[h+1]);return i}return c.Interpolation.none()([])}},c.Interpolation.step=function(a){var b={postpone:!0,fillHoles:!1};return a=c.extend({},b,a),function(b,d){for(var e,f,g,h=new c.Svg.Path,i=0;i<b.length;i+=2){var j=b[i],k=b[i+1],l=d[i/2];void 0!==l.value?(void 0===g?h.move(j,k,!1,l):(a.postpone?h.line(j,f,!1,g):h.line(e,k,!1,l),h.line(j,k,!1,l)),e=j,f=k,g=l):a.fillHoles||(e=f=g=void 0)}return h}}}(window,document,a),function(a,b,c){"use strict";c.EventEmitter=function(){function a(a,b){d[a]=d[a]||[],d[a].push(b)}function b(a,b){d[a]&&(b?(d[a].splice(d[a].indexOf(b),1),0===d[a].length&&delete d[a]):delete d[a])}function c(a,b){d[a]&&d[a].forEach(function(a){a(b)}),d["*"]&&d["*"].forEach(function(c){c(a,b)})}var d=[];return{addEventHandler:a,removeEventHandler:b,emit:c}}}(window,document,a),function(a,b,c){"use strict";function d(a){var b=[];if(a.length)for(var c=0;c<a.length;c++)b.push(a[c]);return b}function e(a,b){var d=b||this.prototype||c.Class,e=Object.create(d);c.Class.cloneDefinitions(e,a);var f=function(){var a,b=e.constructor||function(){};return a=this===c?Object.create(e):this,b.apply(a,Array.prototype.slice.call(arguments,0)),a};return f.prototype=e,f["super"]=d,f.extend=this.extend,f}function f(){var a=d(arguments),b=a[0];return a.splice(1,a.length-1).forEach(function(a){Object.getOwnPropertyNames(a).forEach(function(c){delete b[c],Object.defineProperty(b,c,Object.getOwnPropertyDescriptor(a,c))})}),b}c.Class={extend:e,cloneDefinitions:f}}(window,document,a),function(a,b,c){"use strict";function d(a,b,d){return a&&(this.data=a,this.eventEmitter.emit("data",{type:"update",data:this.data})),b&&(this.options=c.extend({},d?this.options:this.defaultOptions,b),this.initializeTimeoutId||(this.optionsProvider.removeMediaQueryListeners(),this.optionsProvider=c.optionsProvider(this.options,this.responsiveOptions,this.eventEmitter))),this.initializeTimeoutId||this.createChart(this.optionsProvider.getCurrentOptions()),this}function e(){return this.initializeTimeoutId?a.clearTimeout(this.initializeTimeoutId):(a.removeEventListener("resize",this.resizeListener),this.optionsProvider.removeMediaQueryListeners()),this}function f(a,b){return this.eventEmitter.addEventHandler(a,b),this}function g(a,b){return this.eventEmitter.removeEventHandler(a,b),this}function h(){a.addEventListener("resize",this.resizeListener),this.optionsProvider=c.optionsProvider(this.options,this.responsiveOptions,this.eventEmitter),this.eventEmitter.addEventHandler("optionsChanged",function(){this.update()}.bind(this)),this.options.plugins&&this.options.plugins.forEach(function(a){a instanceof Array?a[0](this,a[1]):a(this)}.bind(this)),this.eventEmitter.emit("data",{type:"initial",data:this.data}),this.createChart(this.optionsProvider.getCurrentOptions()),this.initializeTimeoutId=void 0}function i(a,b,d,e,f){this.container=c.querySelector(a),this.data=b,this.defaultOptions=d,this.options=e,this.responsiveOptions=f,this.eventEmitter=c.EventEmitter(),this.supportsForeignObject=c.Svg.isSupported("Extensibility"),this.supportsAnimations=c.Svg.isSupported("AnimationEventsAttribute"),this.resizeListener=function(){this.update()}.bind(this),this.container&&(this.container.__chartist__&&this.container.__chartist__.detach(),this.container.__chartist__=this),this.initializeTimeoutId=setTimeout(h.bind(this),0)}c.Base=c.Class.extend({constructor:i,optionsProvider:void 0,container:void 0,svg:void 0,eventEmitter:void 0,createChart:function(){throw new Error("Base chart type can't be instantiated!")},update:d,detach:e,on:f,off:g,version:c.version,supportsForeignObject:!1})}(window,document,a),function(a,b,c){"use strict";function d(a,d,e,f,g){a instanceof Element?this._node=a:(this._node=b.createElementNS(c.namespaces.svg,a),"svg"===a&&this.attr({"xmlns:ct":c.namespaces.ct})),d&&this.attr(d),e&&this.addClass(e),f&&(g&&f._node.firstChild?f._node.insertBefore(this._node,f._node.firstChild):f._node.appendChild(this._node))}function e(a,b){return"string"==typeof a?b?this._node.getAttributeNS(b,a):this._node.getAttribute(a):(Object.keys(a).forEach(function(b){if(void 0!==a[b])if(b.indexOf(":")!==-1){var d=b.split(":");this._node.setAttributeNS(c.namespaces[d[0]],b,a[b])}else this._node.setAttribute(b,a[b])}.bind(this)),this)}function f(a,b,d,e){return new c.Svg(a,b,d,this,e)}function g(){return this._node.parentNode instanceof SVGElement?new c.Svg(this._node.parentNode):null}function h(){for(var a=this._node;"svg"!==a.nodeName;)a=a.parentNode;return new c.Svg(a)}function i(a){var b=this._node.querySelector(a);return b?new c.Svg(b):null}function j(a){var b=this._node.querySelectorAll(a);return b.length?new c.Svg.List(b):null}function k(a,d,e,f){if("string"==typeof a){var g=b.createElement("div");g.innerHTML=a,a=g.firstChild}a.setAttribute("xmlns",c.namespaces.xmlns);var h=this.elem("foreignObject",d,e,f);return h._node.appendChild(a),h}function l(a){return this._node.appendChild(b.createTextNode(a)),this}function m(){for(;this._node.firstChild;)this._node.removeChild(this._node.firstChild);return this}function n(){return this._node.parentNode.removeChild(this._node),this.parent()}function o(a){return this._node.parentNode.replaceChild(a._node,this._node),a}function p(a,b){return b&&this._node.firstChild?this._node.insertBefore(a._node,this._node.firstChild):this._node.appendChild(a._node),this}function q(){return this._node.getAttribute("class")?this._node.getAttribute("class").trim().split(/\s+/):[]}function r(a){return this._node.setAttribute("class",this.classes(this._node).concat(a.trim().split(/\s+/)).filter(function(a,b,c){return c.indexOf(a)===b}).join(" ")),this}function s(a){var b=a.trim().split(/\s+/);return this._node.setAttribute("class",this.classes(this._node).filter(function(a){return b.indexOf(a)===-1}).join(" ")),this}function t(){return this._node.setAttribute("class",""),this}function u(){return this._node.getBoundingClientRect().height}function v(){return this._node.getBoundingClientRect().width}function w(a,b,d){return void 0===b&&(b=!0),Object.keys(a).forEach(function(e){function f(a,b){var f,g,h,i={};a.easing&&(h=a.easing instanceof Array?a.easing:c.Svg.Easing[a.easing],delete a.easing),a.begin=c.ensureUnit(a.begin,"ms"),a.dur=c.ensureUnit(a.dur,"ms"),h&&(a.calcMode="spline",a.keySplines=h.join(" "),a.keyTimes="0;1"),b&&(a.fill="freeze",i[e]=a.from,this.attr(i),g=c.quantity(a.begin||0).value,a.begin="indefinite"),f=this.elem("animate",c.extend({attributeName:e},a)),b&&setTimeout(function(){try{f._node.beginElement()}catch(b){i[e]=a.to,this.attr(i),f.remove()}}.bind(this),g),d&&f._node.addEventListener("beginEvent",function(){d.emit("animationBegin",{element:this,animate:f._node,params:a})}.bind(this)),f._node.addEventListener("endEvent",function(){d&&d.emit("animationEnd",{element:this,animate:f._node,params:a}),b&&(i[e]=a.to,this.attr(i),f.remove())}.bind(this))}a[e]instanceof Array?a[e].forEach(function(a){f.bind(this)(a,!1)}.bind(this)):f.bind(this)(a[e],b)}.bind(this)),this}function x(a){var b=this;this.svgElements=[];for(var d=0;d<a.length;d++)this.svgElements.push(new c.Svg(a[d]));Object.keys(c.Svg.prototype).filter(function(a){return["constructor","parent","querySelector","querySelectorAll","replace","append","classes","height","width"].indexOf(a)===-1}).forEach(function(a){b[a]=function(){var d=Array.prototype.slice.call(arguments,0);return b.svgElements.forEach(function(b){c.Svg.prototype[a].apply(b,d)}),b}})}c.Svg=c.Class.extend({constructor:d,attr:e,elem:f,parent:g,root:h,querySelector:i,querySelectorAll:j,foreignObject:k,text:l,empty:m,remove:n,replace:o,append:p,classes:q,addClass:r,removeClass:s,removeAllClasses:t,height:u,width:v,animate:w}),c.Svg.isSupported=function(a){return b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#"+a,"1.1")};var y={easeInSine:[.47,0,.745,.715],easeOutSine:[.39,.575,.565,1],easeInOutSine:[.445,.05,.55,.95],easeInQuad:[.55,.085,.68,.53],easeOutQuad:[.25,.46,.45,.94],easeInOutQuad:[.455,.03,.515,.955],easeInCubic:[.55,.055,.675,.19],easeOutCubic:[.215,.61,.355,1],easeInOutCubic:[.645,.045,.355,1],easeInQuart:[.895,.03,.685,.22],easeOutQuart:[.165,.84,.44,1],easeInOutQuart:[.77,0,.175,1],easeInQuint:[.755,.05,.855,.06],easeOutQuint:[.23,1,.32,1],easeInOutQuint:[.86,0,.07,1],easeInExpo:[.95,.05,.795,.035],easeOutExpo:[.19,1,.22,1],easeInOutExpo:[1,0,0,1],easeInCirc:[.6,.04,.98,.335],easeOutCirc:[.075,.82,.165,1],easeInOutCirc:[.785,.135,.15,.86],easeInBack:[.6,-.28,.735,.045],easeOutBack:[.175,.885,.32,1.275],easeInOutBack:[.68,-.55,.265,1.55]};c.Svg.Easing=y,c.Svg.List=c.Class.extend({constructor:x})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e,f,g){var h=c.extend({command:f?a.toLowerCase():a.toUpperCase()},b,g?{data:g}:{});d.splice(e,0,h)}function e(a,b){a.forEach(function(c,d){u[c.command.toLowerCase()].forEach(function(e,f){b(c,e,d,f,a)})})}function f(a,b){this.pathElements=[],this.pos=0,this.close=a,this.options=c.extend({},v,b)}function g(a){return void 0!==a?(this.pos=Math.max(0,Math.min(this.pathElements.length,a)),this):this.pos}function h(a){return this.pathElements.splice(this.pos,a),this}function i(a,b,c,e){return d("M",{x:+a,y:+b},this.pathElements,this.pos++,c,e),this}function j(a,b,c,e){return d("L",{x:+a,y:+b},this.pathElements,this.pos++,c,e),this}function k(a,b,c,e,f,g,h,i){return d("C",{x1:+a,y1:+b,x2:+c,y2:+e,x:+f,y:+g},this.pathElements,this.pos++,h,i),this}function l(a,b,c,e,f,g,h,i,j){return d("A",{rx:+a,ry:+b,xAr:+c,lAf:+e,sf:+f,x:+g,y:+h},this.pathElements,this.pos++,i,j),this}function m(a){var b=a.replace(/([A-Za-z])([0-9])/g,"$1 $2").replace(/([0-9])([A-Za-z])/g,"$1 $2").split(/[\s,]+/).reduce(function(a,b){return b.match(/[A-Za-z]/)&&a.push([]),a[a.length-1].push(b),a},[]);"Z"===b[b.length-1][0].toUpperCase()&&b.pop();var d=b.map(function(a){var b=a.shift(),d=u[b.toLowerCase()];return c.extend({command:b},d.reduce(function(b,c,d){return b[c]=+a[d],b},{}))}),e=[this.pos,0];return Array.prototype.push.apply(e,d),Array.prototype.splice.apply(this.pathElements,e),this.pos+=d.length,this}function n(){var a=Math.pow(10,this.options.accuracy);return this.pathElements.reduce(function(b,c){var d=u[c.command.toLowerCase()].map(function(b){return this.options.accuracy?Math.round(c[b]*a)/a:c[b]}.bind(this));return b+c.command+d.join(",")}.bind(this),"")+(this.close?"Z":"")}function o(a,b){return e(this.pathElements,function(c,d){c[d]*="x"===d[0]?a:b}),this}function p(a,b){return e(this.pathElements,function(c,d){c[d]+="x"===d[0]?a:b}),this}function q(a){return e(this.pathElements,function(b,c,d,e,f){var g=a(b,c,d,e,f);(g||0===g)&&(b[c]=g)}),this}function r(a){var b=new c.Svg.Path(a||this.close);return b.pos=this.pos,b.pathElements=this.pathElements.slice().map(function(a){return c.extend({},a)}),b.options=c.extend({},this.options),b}function s(a){var b=[new c.Svg.Path];return this.pathElements.forEach(function(d){d.command===a.toUpperCase()&&0!==b[b.length-1].pathElements.length&&b.push(new c.Svg.Path),b[b.length-1].pathElements.push(d)}),b}function t(a,b,d){for(var e=new c.Svg.Path(b,d),f=0;f<a.length;f++)for(var g=a[f],h=0;h<g.pathElements.length;h++)e.pathElements.push(g.pathElements[h]);return e}var u={m:["x","y"],l:["x","y"],c:["x1","y1","x2","y2","x","y"],a:["rx","ry","xAr","lAf","sf","x","y"]},v={accuracy:3};c.Svg.Path=c.Class.extend({constructor:f,position:g,remove:h,move:i,line:j,curve:k,arc:l,scale:o,translate:p,transform:q,parse:m,stringify:n,clone:r,splitByCommand:s}),c.Svg.Path.elementDescriptions=u,c.Svg.Path.join=t}(window,document,a),function(a,b,c){"use strict";function d(a,b,c,d){this.units=a,this.counterUnits=a===f.x?f.y:f.x,this.chartRect=b,this.axisLength=b[a.rectEnd]-b[a.rectStart],this.gridOffset=b[a.rectOffset],this.ticks=c,this.options=d}function e(a,b,d,e,f){var g=e["axis"+this.units.pos.toUpperCase()],h=this.ticks.map(this.projectValue.bind(this)),i=this.ticks.map(g.labelInterpolationFnc);h.forEach(function(j,k){var l,m={x:0,y:0};l=h[k+1]?h[k+1]-j:Math.max(this.axisLength-j,30),c.isFalseyButZero(i[k])&&""!==i[k]||("x"===this.units.pos?(j=this.chartRect.x1+j,m.x=e.axisX.labelOffset.x,"start"===e.axisX.position?m.y=this.chartRect.padding.top+e.axisX.labelOffset.y+(d?5:20):m.y=this.chartRect.y1+e.axisX.labelOffset.y+(d?5:20)):(j=this.chartRect.y1-j,m.y=e.axisY.labelOffset.y-(d?l:0),"start"===e.axisY.position?m.x=d?this.chartRect.padding.left+e.axisY.labelOffset.x:this.chartRect.x1-10:m.x=this.chartRect.x2+e.axisY.labelOffset.x+10),g.showGrid&&c.createGrid(j,k,this,this.gridOffset,this.chartRect[this.counterUnits.len](),a,[e.classNames.grid,e.classNames[this.units.dir]],f),g.showLabel&&c.createLabel(j,l,k,i,this,g.offset,m,b,[e.classNames.label,e.classNames[this.units.dir],e.classNames[g.position]],d,f))}.bind(this))}var f={x:{pos:"x",len:"width",dir:"horizontal",rectStart:"x1",rectEnd:"x2",rectOffset:"y2"},y:{pos:"y",len:"height",dir:"vertical",rectStart:"y2",rectEnd:"y1",rectOffset:"x1"}};c.Axis=c.Class.extend({constructor:d,createGridAndLabels:e,projectValue:function(a,b,c){throw new Error("Base axis can't be instantiated!")}}),c.Axis.units=f}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){var f=e.highLow||c.getHighLow(b.normalized,e,a.pos);this.bounds=c.getBounds(d[a.rectEnd]-d[a.rectStart],f,e.scaleMinSpace||20,e.onlyInteger),this.range={min:this.bounds.min,max:this.bounds.max},c.AutoScaleAxis["super"].constructor.call(this,a,d,this.bounds.values,e)}function e(a){return this.axisLength*(+c.getMultiValue(a,this.units.pos)-this.bounds.min)/this.bounds.range}c.AutoScaleAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){var f=e.highLow||c.getHighLow(b.normalized,e,a.pos);this.divisor=e.divisor||1,this.ticks=e.ticks||c.times(this.divisor).map(function(a,b){return f.low+(f.high-f.low)/this.divisor*b}.bind(this)),this.ticks.sort(function(a,b){return a-b}),this.range={min:f.low,max:f.high},c.FixedScaleAxis["super"].constructor.call(this,a,d,this.ticks,e),this.stepLength=this.axisLength/this.divisor}function e(a){return this.axisLength*(+c.getMultiValue(a,this.units.pos)-this.range.min)/(this.range.max-this.range.min)}c.FixedScaleAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){c.StepAxis["super"].constructor.call(this,a,d,e.ticks,e),this.stepLength=this.axisLength/(e.ticks.length-(e.stretch?1:0))}function e(a,b){return this.stepLength*b}c.StepAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a){this.data=c.normalizeData(this.data);var b={raw:this.data,normalized:c.getDataArray(this.data,a.reverseData,!0)};this.svg=c.createSvg(this.container,a.width,a.height,a.classNames.chart);var d,e,g=this.svg.elem("g").addClass(a.classNames.gridGroup),h=this.svg.elem("g"),i=this.svg.elem("g").addClass(a.classNames.labelGroup),j=c.createChartRect(this.svg,a,f.padding);d=void 0===a.axisX.type?new c.StepAxis(c.Axis.units.x,b,j,c.extend({},a.axisX,{ticks:b.raw.labels,stretch:a.fullWidth})):a.axisX.type.call(c,c.Axis.units.x,b,j,a.axisX),e=void 0===a.axisY.type?new c.AutoScaleAxis(c.Axis.units.y,b,j,c.extend({},a.axisY,{high:c.isNum(a.high)?a.high:a.axisY.high,low:c.isNum(a.low)?a.low:a.axisY.low})):a.axisY.type.call(c,c.Axis.units.y,b,j,a.axisY),d.createGridAndLabels(g,i,this.supportsForeignObject,a,this.eventEmitter),e.createGridAndLabels(g,i,this.supportsForeignObject,a,this.eventEmitter),b.raw.series.forEach(function(f,g){var i=h.elem("g");i.attr({"ct:series-name":f.name,"ct:meta":c.serialize(f.meta)}),i.addClass([a.classNames.series,f.className||a.classNames.series+"-"+c.alphaNumerate(g)].join(" "));var k=[],l=[];b.normalized[g].forEach(function(a,h){var i={x:j.x1+d.projectValue(a,h,b.normalized[g]),y:j.y1-e.projectValue(a,h,b.normalized[g])};k.push(i.x,i.y),l.push({value:a,valueIndex:h,meta:c.getMetaData(f,h)})}.bind(this));var m={lineSmooth:c.getSeriesOption(f,a,"lineSmooth"),showPoint:c.getSeriesOption(f,a,"showPoint"),showLine:c.getSeriesOption(f,a,"showLine"),showArea:c.getSeriesOption(f,a,"showArea"),areaBase:c.getSeriesOption(f,a,"areaBase")},n="function"==typeof m.lineSmooth?m.lineSmooth:m.lineSmooth?c.Interpolation.monotoneCubic():c.Interpolation.none(),o=n(k,l);if(m.showPoint&&o.pathElements.forEach(function(b){var h=i.elem("line",{x1:b.x,y1:b.y,x2:b.x+.01,y2:b.y},a.classNames.point).attr({"ct:value":[b.data.value.x,b.data.value.y].filter(c.isNum).join(","),"ct:meta":b.data.meta});this.eventEmitter.emit("draw",{type:"point",value:b.data.value,index:b.data.valueIndex,meta:b.data.meta,series:f,seriesIndex:g,axisX:d,axisY:e,group:i,element:h,x:b.x,y:b.y})}.bind(this)),m.showLine){var p=i.elem("path",{d:o.stringify()},a.classNames.line,!0);this.eventEmitter.emit("draw",{type:"line",values:b.normalized[g],path:o.clone(),chartRect:j,index:g,series:f,seriesIndex:g,axisX:d,axisY:e,group:i,element:p})}if(m.showArea&&e.range){var q=Math.max(Math.min(m.areaBase,e.range.max),e.range.min),r=j.y1-e.projectValue(q);o.splitByCommand("M").filter(function(a){return a.pathElements.length>1}).map(function(a){var b=a.pathElements[0],c=a.pathElements[a.pathElements.length-1];return a.clone(!0).position(0).remove(1).move(b.x,r).line(b.x,b.y).position(a.pathElements.length+1).line(c.x,r)}).forEach(function(c){var h=i.elem("path",{d:c.stringify()},a.classNames.area,!0);this.eventEmitter.emit("draw",{type:"area",values:b.normalized[g],path:c.clone(),series:f,seriesIndex:g,axisX:d,axisY:e,chartRect:j,index:g,group:i,element:h})}.bind(this))}}.bind(this)),this.eventEmitter.emit("created",{bounds:e.bounds,chartRect:j,axisX:d,axisY:e,svg:this.svg,options:a})}function e(a,b,d,e){c.Line["super"].constructor.call(this,a,b,f,c.extend({},f,d),e)}var f={axisX:{offset:30,position:"end",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,type:void 0},axisY:{offset:40,position:"start",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,type:void 0,scaleMinSpace:20,onlyInteger:!1},width:void 0,height:void 0,showLine:!0,showPoint:!0,showArea:!1,areaBase:0,lineSmooth:!0,low:void 0,high:void 0,chartPadding:{top:15,right:15,bottom:5,left:10},fullWidth:!1,reverseData:!1,classNames:{chart:"ct-chart-line",label:"ct-label",labelGroup:"ct-labels",series:"ct-series",line:"ct-line",point:"ct-point",area:"ct-area",grid:"ct-grid",gridGroup:"ct-grids",vertical:"ct-vertical",horizontal:"ct-horizontal",start:"ct-start",end:"ct-end"}};c.Line=c.Base.extend({constructor:e,createChart:d})}(window,document,a),function(a,b,c){"use strict";function d(a){this.data=c.normalizeData(this.data);var b,d={raw:this.data,normalized:a.distributeSeries?c.getDataArray(this.data,a.reverseData,a.horizontalBars?"x":"y").map(function(a){return[a]}):c.getDataArray(this.data,a.reverseData,a.horizontalBars?"x":"y")};this.svg=c.createSvg(this.container,a.width,a.height,a.classNames.chart+(a.horizontalBars?" "+a.classNames.horizontalBars:""));var e=this.svg.elem("g").addClass(a.classNames.gridGroup),g=this.svg.elem("g"),h=this.svg.elem("g").addClass(a.classNames.labelGroup);if(a.stackBars&&0!==d.normalized.length){var i=c.serialMap(d.normalized,function(){return Array.prototype.slice.call(arguments).map(function(a){return a}).reduce(function(a,b){return{x:a.x+(b&&b.x)||0,y:a.y+(b&&b.y)||0}},{x:0,y:0})});b=c.getHighLow([i],c.extend({},a,{referenceValue:0}),a.horizontalBars?"x":"y")}else b=c.getHighLow(d.normalized,c.extend({},a,{referenceValue:0}),a.horizontalBars?"x":"y");b.high=+a.high||(0===a.high?0:b.high),b.low=+a.low||(0===a.low?0:b.low);var j,k,l,m,n,o=c.createChartRect(this.svg,a,f.padding);k=a.distributeSeries&&a.stackBars?d.raw.labels.slice(0,1):d.raw.labels,a.horizontalBars?(j=m=void 0===a.axisX.type?new c.AutoScaleAxis(c.Axis.units.x,d,o,c.extend({},a.axisX,{highLow:b,referenceValue:0})):a.axisX.type.call(c,c.Axis.units.x,d,o,c.extend({},a.axisX,{highLow:b,referenceValue:0})),l=n=void 0===a.axisY.type?new c.StepAxis(c.Axis.units.y,d,o,{ticks:k}):a.axisY.type.call(c,c.Axis.units.y,d,o,a.axisY)):(l=m=void 0===a.axisX.type?new c.StepAxis(c.Axis.units.x,d,o,{ticks:k}):a.axisX.type.call(c,c.Axis.units.x,d,o,a.axisX),j=n=void 0===a.axisY.type?new c.AutoScaleAxis(c.Axis.units.y,d,o,c.extend({},a.axisY,{highLow:b,referenceValue:0})):a.axisY.type.call(c,c.Axis.units.y,d,o,c.extend({},a.axisY,{highLow:b,referenceValue:0})));var p=a.horizontalBars?o.x1+j.projectValue(0):o.y1-j.projectValue(0),q=[];
l.createGridAndLabels(e,h,this.supportsForeignObject,a,this.eventEmitter),j.createGridAndLabels(e,h,this.supportsForeignObject,a,this.eventEmitter),d.raw.series.forEach(function(b,e){var f,h,i=e-(d.raw.series.length-1)/2;f=a.distributeSeries&&!a.stackBars?l.axisLength/d.normalized.length/2:a.distributeSeries&&a.stackBars?l.axisLength/2:l.axisLength/d.normalized[e].length/2,h=g.elem("g"),h.attr({"ct:series-name":b.name,"ct:meta":c.serialize(b.meta)}),h.addClass([a.classNames.series,b.className||a.classNames.series+"-"+c.alphaNumerate(e)].join(" ")),d.normalized[e].forEach(function(g,k){var r,s,t,u;if(u=a.distributeSeries&&!a.stackBars?e:a.distributeSeries&&a.stackBars?0:k,r=a.horizontalBars?{x:o.x1+j.projectValue(g&&g.x?g.x:0,k,d.normalized[e]),y:o.y1-l.projectValue(g&&g.y?g.y:0,u,d.normalized[e])}:{x:o.x1+l.projectValue(g&&g.x?g.x:0,u,d.normalized[e]),y:o.y1-j.projectValue(g&&g.y?g.y:0,k,d.normalized[e])},l instanceof c.StepAxis&&(l.options.stretch||(r[l.units.pos]+=f*(a.horizontalBars?-1:1)),r[l.units.pos]+=a.stackBars||a.distributeSeries?0:i*a.seriesBarDistance*(a.horizontalBars?-1:1)),t=q[k]||p,q[k]=t-(p-r[l.counterUnits.pos]),void 0!==g){var v={};v[l.units.pos+"1"]=r[l.units.pos],v[l.units.pos+"2"]=r[l.units.pos],!a.stackBars||"accumulate"!==a.stackMode&&a.stackMode?(v[l.counterUnits.pos+"1"]=p,v[l.counterUnits.pos+"2"]=r[l.counterUnits.pos]):(v[l.counterUnits.pos+"1"]=t,v[l.counterUnits.pos+"2"]=q[k]),v.x1=Math.min(Math.max(v.x1,o.x1),o.x2),v.x2=Math.min(Math.max(v.x2,o.x1),o.x2),v.y1=Math.min(Math.max(v.y1,o.y2),o.y1),v.y2=Math.min(Math.max(v.y2,o.y2),o.y1),s=h.elem("line",v,a.classNames.bar).attr({"ct:value":[g.x,g.y].filter(c.isNum).join(","),"ct:meta":c.getMetaData(b,k)}),this.eventEmitter.emit("draw",c.extend({type:"bar",value:g,index:k,meta:c.getMetaData(b,k),series:b,seriesIndex:e,axisX:m,axisY:n,chartRect:o,group:h,element:s},v))}}.bind(this))}.bind(this)),this.eventEmitter.emit("created",{bounds:j.bounds,chartRect:o,axisX:m,axisY:n,svg:this.svg,options:a})}function e(a,b,d,e){c.Bar["super"].constructor.call(this,a,b,f,c.extend({},f,d),e)}var f={axisX:{offset:30,position:"end",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,scaleMinSpace:30,onlyInteger:!1},axisY:{offset:40,position:"start",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,scaleMinSpace:20,onlyInteger:!1},width:void 0,height:void 0,high:void 0,low:void 0,chartPadding:{top:15,right:15,bottom:5,left:10},seriesBarDistance:15,stackBars:!1,stackMode:"accumulate",horizontalBars:!1,distributeSeries:!1,reverseData:!1,classNames:{chart:"ct-chart-bar",horizontalBars:"ct-horizontal-bars",label:"ct-label",labelGroup:"ct-labels",series:"ct-series",bar:"ct-bar",grid:"ct-grid",gridGroup:"ct-grids",vertical:"ct-vertical",horizontal:"ct-horizontal",start:"ct-start",end:"ct-end"}};c.Bar=c.Base.extend({constructor:e,createChart:d})}(window,document,a),function(a,b,c){"use strict";function d(a,b,c){var d=b.x>a.x;return d&&"explode"===c||!d&&"implode"===c?"start":d&&"implode"===c||!d&&"explode"===c?"end":"middle"}function e(a){this.data=c.normalizeData(this.data);var b,e,f,h,i,j=[],k=a.startAngle,l=c.getDataArray(this.data,a.reverseData);this.svg=c.createSvg(this.container,a.width,a.height,a.donut?a.classNames.chartDonut:a.classNames.chartPie),e=c.createChartRect(this.svg,a,g.padding),f=Math.min(e.width()/2,e.height()/2),i=a.total||l.reduce(function(a,b){return a+b},0);var m=c.quantity(a.donutWidth);"%"===m.unit&&(m.value*=f/100),f-=a.donut?m.value/2:0,h="outside"===a.labelPosition||a.donut?f:"center"===a.labelPosition?0:f/2,h+=a.labelOffset;var n={x:e.x1+e.width()/2,y:e.y2+e.height()/2},o=1===this.data.series.filter(function(a){return a.hasOwnProperty("value")?0!==a.value:0!==a}).length;a.showLabel&&(b=this.svg.elem("g",null,null,!0));for(var p=0;p<this.data.series.length;p++)if(0!==l[p]||!a.ignoreEmptyValues){var q=this.data.series[p];j[p]=this.svg.elem("g",null,null,!0),j[p].attr({"ct:series-name":q.name}),j[p].addClass([a.classNames.series,q.className||a.classNames.series+"-"+c.alphaNumerate(p)].join(" "));var r=k+l[p]/i*360,s=Math.max(0,k-(0===p||o?0:.2));r-s>=359.99&&(r=s+359.99);var t=c.polarToCartesian(n.x,n.y,f,s),u=c.polarToCartesian(n.x,n.y,f,r),v=new c.Svg.Path((!a.donut)).move(u.x,u.y).arc(f,f,0,r-k>180,0,t.x,t.y);a.donut||v.line(n.x,n.y);var w=j[p].elem("path",{d:v.stringify()},a.donut?a.classNames.sliceDonut:a.classNames.slicePie);if(w.attr({"ct:value":l[p],"ct:meta":c.serialize(q.meta)}),a.donut&&w.attr({style:"stroke-width: "+m.value+"px"}),this.eventEmitter.emit("draw",{type:"slice",value:l[p],totalDataSum:i,index:p,meta:q.meta,series:q,group:j[p],element:w,path:v.clone(),center:n,radius:f,startAngle:k,endAngle:r}),a.showLabel){var x=c.polarToCartesian(n.x,n.y,h,k+(r-k)/2),y=a.labelInterpolationFnc(this.data.labels&&!c.isFalseyButZero(this.data.labels[p])?this.data.labels[p]:l[p],p);if(y||0===y){var z=b.elem("text",{dx:x.x,dy:x.y,"text-anchor":d(n,x,a.labelDirection)},a.classNames.label).text(""+y);this.eventEmitter.emit("draw",{type:"label",index:p,group:b,element:z,text:""+y,x:x.x,y:x.y})}}k=r}this.eventEmitter.emit("created",{chartRect:e,svg:this.svg,options:a})}function f(a,b,d,e){c.Pie["super"].constructor.call(this,a,b,g,c.extend({},g,d),e)}var g={width:void 0,height:void 0,chartPadding:5,classNames:{chartPie:"ct-chart-pie",chartDonut:"ct-chart-donut",series:"ct-series",slicePie:"ct-slice-pie",sliceDonut:"ct-slice-donut",label:"ct-label"},startAngle:0,total:void 0,donut:!1,donutWidth:60,showLabel:!0,labelOffset:0,labelPosition:"inside",labelInterpolationFnc:c.noop,labelDirection:"neutral",reverseData:!1,ignoreEmptyValues:!1};c.Pie=c.Base.extend({constructor:f,createChart:e,determineAnchorPosition:d})}(window,document,a),a});
//# sourceMappingURL=chartist.min.js.map

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["angular","chartist"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), require('chartist'));
  } else {
    root.angularChartist = factory(root.angular, root.Chartist);
  }
}(this, function(angular, Chartist) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global angular, Chartist*/

var AngularChartistCtrl = (function () {
    function AngularChartistCtrl($scope, $element) {
        var _this = this;

        _classCallCheck(this, AngularChartistCtrl);

        this.data = $scope.data;
        this.chartType = $scope.chartType;

        this.events = $scope.events() || {};
        this.options = $scope.chartOptions() || null;
        this.responsiveOptions = $scope.responsiveOptions() || null;

        this.element = $element[0];

        this.renderChart();

        $scope.$watch(function () {
            return {
                data: $scope.data,
                chartType: $scope.chartType,
                chartOptions: $scope.chartOptions()
            };
        }, this.update.bind(this), true);

        $scope.$on('$destroy', function () {
            if (_this.chart) {
                _this.chart.detach();
            }
        });
    }

    _createClass(AngularChartistCtrl, [{
        key: 'bindEvents',
        value: function bindEvents() {
            var _this2 = this;

            Object.keys(this.events).forEach(function (eventName) {
                _this2.chart.on(eventName, _this2.events[eventName]);
            });
        }
    }, {
        key: 'renderChart',
        value: function renderChart() {
            // ensure that the chart does not get created without data
            if (this.data) {
                this.chart = Chartist[this.chartType](this.element, this.data, this.options, this.responsiveOptions);

                this.bindEvents();

                return this.chart;
            }
        }
    }, {
        key: 'update',
        value: function update(newConfig, oldConfig) {
            // Update controller with new configuration
            this.chartType = newConfig.chartType;
            this.data = newConfig.data;
            this.options = newConfig.chartOptions;

            // If chart type changed we need to recreate whole chart, otherwise we can update
            if (!this.chart || newConfig.chartType !== oldConfig.chartType) {
                this.renderChart();
            } else {
                this.chart.update(this.data, this.options);
            }
        }
    }]);

    return AngularChartistCtrl;
})();

AngularChartistCtrl.$inject = ['$scope', '$element'];

function chartistDirective() {
    return {
        restrict: 'EA',
        scope: {
            // mandatory
            data: '=chartistData',
            chartType: '@chartistChartType',
            // optional
            events: '&chartistEvents',
            chartOptions: '&chartistChartOptions',
            responsiveOptions: '&chartistResponsiveOptions'
        },
        controller: 'AngularChartistCtrl'
    };
}

chartistDirective.$inject = [];

/*eslint-disable no-unused-vars */
var angularChartist = angular.module('angular-chartist', []).controller('AngularChartistCtrl', AngularChartistCtrl).directive('chartist', chartistDirective);
/*eslint-enable no-unused-vars */
return angularChartist;

}));

/*!
 * Cropper.js v0.8.1
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2015-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-09-03T04:55:16.458Z
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _defaults = __webpack_require__(1);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _template = __webpack_require__(2);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _render = __webpack_require__(3);
	
	var _render2 = _interopRequireDefault(_render);
	
	var _preview = __webpack_require__(5);
	
	var _preview2 = _interopRequireDefault(_preview);
	
	var _events = __webpack_require__(6);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _handlers = __webpack_require__(7);
	
	var _handlers2 = _interopRequireDefault(_handlers);
	
	var _change = __webpack_require__(8);
	
	var _change2 = _interopRequireDefault(_change);
	
	var _methods = __webpack_require__(9);
	
	var _methods2 = _interopRequireDefault(_methods);
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Constants
	var NAMESPACE = 'cropper';
	
	// Classes
	var CLASS_HIDDEN = NAMESPACE + '-hidden';
	
	// Events
	var EVENT_ERROR = 'error';
	var EVENT_LOAD = 'load';
	var EVENT_READY = 'ready';
	var EVENT_CROP = 'crop';
	
	// RegExps
	var REGEXP_DATA_URL = /^data:/;
	var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg.*;base64,/;
	
	var AnotherCropper = void 0;
	
	var Cropper = function () {
	  function Cropper(element, options) {
	    _classCallCheck(this, Cropper);
	
	    var self = this;
	
	    self.element = element;
	    self.options = $.extend({}, _defaults2.default, $.isPlainObject(options) && options);
	    self.loaded = false;
	    self.ready = false;
	    self.complete = false;
	    self.rotated = false;
	    self.cropped = false;
	    self.disabled = false;
	    self.replaced = false;
	    self.limited = false;
	    self.wheeling = false;
	    self.isImg = false;
	    self.originalUrl = '';
	    self.canvasData = null;
	    self.cropBoxData = null;
	    self.previews = null;
	    self.init();
	  }
	
	  _createClass(Cropper, [{
	    key: 'init',
	    value: function init() {
	      var self = this;
	      var element = self.element;
	      var tagName = element.tagName.toLowerCase();
	      var url = void 0;
	
	      if ($.getData(element, NAMESPACE)) {
	        return;
	      }
	
	      $.setData(element, NAMESPACE, self);
	
	      if (tagName === 'img') {
	        self.isImg = true;
	
	        // e.g.: "img/picture.jpg"
	        self.originalUrl = url = element.getAttribute('src');
	
	        // Stop when it's a blank image
	        if (!url) {
	          return;
	        }
	
	        // e.g.: "http://example.com/img/picture.jpg"
	        url = element.src;
	      } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
	        url = element.toDataURL();
	      }
	
	      self.load(url);
	    }
	  }, {
	    key: 'load',
	    value: function load(url) {
	      var self = this;
	      var options = self.options;
	      var element = self.element;
	
	      if (!url) {
	        return;
	      }
	
	      self.url = url;
	      self.imageData = {};
	
	      if (!options.checkOrientation || !window.ArrayBuffer) {
	        self.clone();
	        return;
	      }
	
	      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
	      if (REGEXP_DATA_URL.test(url)) {
	        if (REGEXP_DATA_URL_JPEG) {
	          self.read($.dataURLToArrayBuffer(url));
	        } else {
	          self.clone();
	        }
	        return;
	      }
	
	      var xhr = new XMLHttpRequest();
	
	      xhr.onerror = xhr.onabort = function () {
	        self.clone();
	      };
	
	      xhr.onload = function () {
	        self.read(xhr.response);
	      };
	
	      if (options.checkCrossOrigin && $.isCrossOriginURL(url) && element.crossOrigin) {
	        url = $.addTimestamp(url);
	      }
	
	      xhr.open('get', url);
	      xhr.responseType = 'arraybuffer';
	      xhr.send();
	    }
	  }, {
	    key: 'read',
	    value: function read(arrayBuffer) {
	      var self = this;
	      var options = self.options;
	      var orientation = $.getOrientation(arrayBuffer);
	      var imageData = self.imageData;
	      var rotate = 0;
	      var scaleX = 1;
	      var scaleY = 1;
	
	      if (orientation > 1) {
	        self.url = $.arrayBufferToDataURL(arrayBuffer);
	
	        switch (orientation) {
	
	          // flip horizontal
	          case 2:
	            scaleX = -1;
	            break;
	
	          // rotate left 180°
	          case 3:
	            rotate = -180;
	            break;
	
	          // flip vertical
	          case 4:
	            scaleY = -1;
	            break;
	
	          // flip vertical + rotate right 90°
	          case 5:
	            rotate = 90;
	            scaleY = -1;
	            break;
	
	          // rotate right 90°
	          case 6:
	            rotate = 90;
	            break;
	
	          // flip horizontal + rotate right 90°
	          case 7:
	            rotate = 90;
	            scaleX = -1;
	            break;
	
	          // rotate left 90°
	          case 8:
	            rotate = -90;
	            break;
	        }
	      }
	
	      if (options.rotatable) {
	        imageData.rotate = rotate;
	      }
	
	      if (options.scalable) {
	        imageData.scaleX = scaleX;
	        imageData.scaleY = scaleY;
	      }
	
	      self.clone();
	    }
	  }, {
	    key: 'clone',
	    value: function clone() {
	      var self = this;
	      var element = self.element;
	      var url = self.url;
	      var crossOrigin = void 0;
	      var crossOriginUrl = void 0;
	      var start = void 0;
	      var stop = void 0;
	
	      if (self.options.checkCrossOrigin && $.isCrossOriginURL(url)) {
	        crossOrigin = element.crossOrigin;
	
	        if (crossOrigin) {
	          crossOriginUrl = url;
	        } else {
	          crossOrigin = 'anonymous';
	
	          // Bust cache when there is not a "crossOrigin" property
	          crossOriginUrl = $.addTimestamp(url);
	        }
	      }
	
	      self.crossOrigin = crossOrigin;
	      self.crossOriginUrl = crossOriginUrl;
	
	      var image = $.createElement('img');
	
	      if (crossOrigin) {
	        image.crossOrigin = crossOrigin;
	      }
	
	      image.src = crossOriginUrl || url;
	      self.image = image;
	      self.onStart = start = $.proxy(self.start, self);
	      self.onStop = stop = $.proxy(self.stop, self);
	
	      if (self.isImg) {
	        if (element.complete) {
	          self.start();
	        } else {
	          $.addListener(element, EVENT_LOAD, start);
	        }
	      } else {
	        $.addListener(image, EVENT_LOAD, start);
	        $.addListener(image, EVENT_ERROR, stop);
	        $.addClass(image, 'cropper-hide');
	        element.parentNode.insertBefore(image, element.nextSibling);
	      }
	    }
	  }, {
	    key: 'start',
	    value: function start(event) {
	      var self = this;
	      var image = self.isImg ? self.element : self.image;
	
	      if (event) {
	        $.removeListener(image, EVENT_LOAD, self.onStart);
	        $.removeListener(image, EVENT_ERROR, self.onStop);
	      }
	
	      $.getImageSize(image, function (naturalWidth, naturalHeight) {
	        $.extend(self.imageData, {
	          naturalWidth: naturalWidth,
	          naturalHeight: naturalHeight,
	          aspectRatio: naturalWidth / naturalHeight
	        });
	
	        self.loaded = true;
	        self.build();
	      });
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      var self = this;
	      var image = self.image;
	
	      $.removeListener(image, EVENT_LOAD, self.onStart);
	      $.removeListener(image, EVENT_ERROR, self.onStop);
	
	      $.removeChild(image);
	      self.image = null;
	    }
	  }, {
	    key: 'build',
	    value: function build() {
	      var self = this;
	      var options = self.options;
	      var element = self.element;
	      var image = self.image;
	      var container = void 0;
	      var cropper = void 0;
	      var canvas = void 0;
	      var dragBox = void 0;
	      var cropBox = void 0;
	      var face = void 0;
	
	      if (!self.loaded) {
	        return;
	      }
	
	      // Unbuild first when replace
	      if (self.ready) {
	        self.unbuild();
	      }
	
	      var template = $.createElement('div');
	      template.innerHTML = _template2.default;
	
	      // Create cropper elements
	      self.container = container = element.parentNode;
	      self.cropper = cropper = $.getByClass(template, 'cropper-container')[0];
	      self.canvas = canvas = $.getByClass(cropper, 'cropper-canvas')[0];
	      self.dragBox = dragBox = $.getByClass(cropper, 'cropper-drag-box')[0];
	      self.cropBox = cropBox = $.getByClass(cropper, 'cropper-crop-box')[0];
	      self.viewBox = $.getByClass(cropper, 'cropper-view-box')[0];
	      self.face = face = $.getByClass(cropBox, 'cropper-face')[0];
	
	      $.appendChild(canvas, image);
	
	      // Hide the original image
	      $.addClass(element, CLASS_HIDDEN);
	
	      // Inserts the cropper after to the current image
	      container.insertBefore(cropper, element.nextSibling);
	
	      // Show the image if is hidden
	      if (!self.isImg) {
	        $.removeClass(image, 'cropper-hide');
	      }
	
	      self.initPreview();
	      self.bind();
	
	      options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
	      options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
	
	      if (options.autoCrop) {
	        self.cropped = true;
	
	        if (options.modal) {
	          $.addClass(dragBox, 'cropper-modal');
	        }
	      } else {
	        $.addClass(cropBox, CLASS_HIDDEN);
	      }
	
	      if (!options.guides) {
	        $.addClass($.getByClass(cropBox, 'cropper-dashed'), CLASS_HIDDEN);
	      }
	
	      if (!options.center) {
	        $.addClass($.getByClass(cropBox, 'cropper-center'), CLASS_HIDDEN);
	      }
	
	      if (options.background) {
	        $.addClass(cropper, 'cropper-bg');
	      }
	
	      if (!options.highlight) {
	        $.addClass(face, 'cropper-invisible');
	      }
	
	      if (options.cropBoxMovable) {
	        $.addClass(face, 'cropper-move');
	        $.setData(face, 'action', 'all');
	      }
	
	      if (!options.cropBoxResizable) {
	        $.addClass($.getByClass(cropBox, 'cropper-line'), CLASS_HIDDEN);
	        $.addClass($.getByClass(cropBox, 'cropper-point'), CLASS_HIDDEN);
	      }
	
	      self.setDragMode(options.dragMode);
	      self.render();
	      self.ready = true;
	      self.setData(options.data);
	
	      // Call the "ready" option asynchronously to keep "image.cropper" is defined
	      self.completing = setTimeout(function () {
	        if ($.isFunction(options.ready)) {
	          $.addListener(element, EVENT_READY, options.ready, true);
	        }
	
	        $.dispatchEvent(element, EVENT_READY);
	        $.dispatchEvent(element, EVENT_CROP, self.getData());
	
	        self.complete = true;
	      }, 0);
	    }
	  }, {
	    key: 'unbuild',
	    value: function unbuild() {
	      var self = this;
	
	      if (!self.ready) {
	        return;
	      }
	
	      if (!self.complete) {
	        clearTimeout(self.completing);
	      }
	
	      self.ready = false;
	      self.complete = false;
	      self.initialImageData = null;
	
	      // Clear `initialCanvasData` is necessary when replace
	      self.initialCanvasData = null;
	      self.initialCropBoxData = null;
	      self.containerData = null;
	      self.canvasData = null;
	
	      // Clear `cropBoxData` is necessary when replace
	      self.cropBoxData = null;
	      self.unbind();
	
	      self.resetPreview();
	      self.previews = null;
	
	      self.viewBox = null;
	      self.cropBox = null;
	      self.dragBox = null;
	      self.canvas = null;
	      self.container = null;
	
	      $.removeChild(self.cropper);
	      self.cropper = null;
	    }
	  }], [{
	    key: 'noConflict',
	    value: function noConflict() {
	      window.Cropper = AnotherCropper;
	      return Cropper;
	    }
	  }, {
	    key: 'setDefaults',
	    value: function setDefaults(options) {
	      $.extend(_defaults2.default, $.isPlainObject(options) && options);
	    }
	  }]);
	
	  return Cropper;
	}();
	
	$.extend(Cropper.prototype, _render2.default);
	$.extend(Cropper.prototype, _preview2.default);
	$.extend(Cropper.prototype, _events2.default);
	$.extend(Cropper.prototype, _handlers2.default);
	$.extend(Cropper.prototype, _change2.default);
	$.extend(Cropper.prototype, _methods2.default);
	
	if (typeof window !== 'undefined') {
	  AnotherCropper = window.Cropper;
	  window.Cropper = Cropper;
	}
	
	exports.default = Cropper;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  // Define the view mode of the cropper
	  viewMode: 0, // 0, 1, 2, 3
	
	  // Define the dragging mode of the cropper
	  dragMode: 'crop', // 'crop', 'move' or 'none'
	
	  // Define the aspect ratio of the crop box
	  aspectRatio: NaN,
	
	  // An object with the previous cropping result data
	  data: null,
	
	  // A selector for adding extra containers to preview
	  preview: '',
	
	  // Re-render the cropper when resize the window
	  responsive: true,
	
	  // Restore the cropped area after resize the window
	  restore: true,
	
	  // Check if the current image is a cross-origin image
	  checkCrossOrigin: true,
	
	  // Check the current image's Exif Orientation information
	  checkOrientation: true,
	
	  // Show the black modal
	  modal: true,
	
	  // Show the dashed lines for guiding
	  guides: true,
	
	  // Show the center indicator for guiding
	  center: true,
	
	  // Show the white modal to highlight the crop box
	  highlight: true,
	
	  // Show the grid background
	  background: true,
	
	  // Enable to crop the image automatically when initialize
	  autoCrop: true,
	
	  // Define the percentage of automatic cropping area when initializes
	  autoCropArea: 0.8,
	
	  // Enable to move the image
	  movable: true,
	
	  // Enable to rotate the image
	  rotatable: true,
	
	  // Enable to scale the image
	  scalable: true,
	
	  // Enable to zoom the image
	  zoomable: true,
	
	  // Enable to zoom the image by dragging touch
	  zoomOnTouch: true,
	
	  // Enable to zoom the image by wheeling mouse
	  zoomOnWheel: true,
	
	  // Define zoom ratio when zoom the image by wheeling mouse
	  wheelZoomRatio: 0.1,
	
	  // Enable to move the crop box
	  cropBoxMovable: true,
	
	  // Enable to resize the crop box
	  cropBoxResizable: true,
	
	  // Toggle drag mode between "crop" and "move" when click twice on the cropper
	  toggleDragModeOnDblclick: true,
	
	  // Size limitation
	  minCanvasWidth: 0,
	  minCanvasHeight: 0,
	  minCropBoxWidth: 0,
	  minCropBoxHeight: 0,
	  minContainerWidth: 200,
	  minContainerHeight: 100,
	
	  // Shortcuts of events
	  ready: null,
	  cropstart: null,
	  cropmove: null,
	  cropend: null,
	  crop: null,
	  zoom: null
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = '<div class="cropper-container">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-action="e"></span>' + '<span class="cropper-line line-n" data-action="n"></span>' + '<span class="cropper-line line-w" data-action="w"></span>' + '<span class="cropper-line line-s" data-action="s"></span>' + '<span class="cropper-point point-e" data-action="e"></span>' + '<span class="cropper-point point-n" data-action="n"></span>' + '<span class="cropper-point point-w" data-action="w"></span>' + '<span class="cropper-point point-s" data-action="s"></span>' + '<span class="cropper-point point-ne" data-action="ne"></span>' + '<span class="cropper-point point-nw" data-action="nw"></span>' + '<span class="cropper-point point-sw" data-action="sw"></span>' + '<span class="cropper-point point-se" data-action="se"></span>' + '</div>' + '</div>';

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.default = {
	  render: function render() {
	    var self = this;
	
	    self.initContainer();
	    self.initCanvas();
	    self.initCropBox();
	
	    self.renderCanvas();
	
	    if (self.cropped) {
	      self.renderCropBox();
	    }
	  },
	  initContainer: function initContainer() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var container = self.container;
	    var cropper = self.cropper;
	    var containerData = void 0;
	
	    $.addClass(cropper, 'cropper-hidden');
	    $.removeClass(element, 'cropper-hidden');
	
	    self.containerData = containerData = {
	      width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
	      height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
	    };
	
	    $.setStyle(cropper, {
	      width: containerData.width,
	      height: containerData.height
	    });
	
	    $.addClass(element, 'cropper-hidden');
	    $.removeClass(cropper, 'cropper-hidden');
	  },
	
	
	  // Canvas (image wrapper)
	  initCanvas: function initCanvas() {
	    var self = this;
	    var viewMode = self.options.viewMode;
	    var containerData = self.containerData;
	    var imageData = self.imageData;
	    var rotated = Math.abs(imageData.rotate) === 90;
	    var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
	    var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
	    var aspectRatio = naturalWidth / naturalHeight;
	    var canvasWidth = containerData.width;
	    var canvasHeight = containerData.height;
	
	    if (containerData.height * aspectRatio > containerData.width) {
	      if (viewMode === 3) {
	        canvasWidth = containerData.height * aspectRatio;
	      } else {
	        canvasHeight = containerData.width / aspectRatio;
	      }
	    } else if (viewMode === 3) {
	      canvasHeight = containerData.width / aspectRatio;
	    } else {
	      canvasWidth = containerData.height * aspectRatio;
	    }
	
	    var canvasData = {
	      naturalWidth: naturalWidth,
	      naturalHeight: naturalHeight,
	      aspectRatio: aspectRatio,
	      width: canvasWidth,
	      height: canvasHeight
	    };
	
	    canvasData.oldLeft = canvasData.left = (containerData.width - canvasWidth) / 2;
	    canvasData.oldTop = canvasData.top = (containerData.height - canvasHeight) / 2;
	
	    self.canvasData = canvasData;
	    self.limited = viewMode === 1 || viewMode === 2;
	    self.limitCanvas(true, true);
	    self.initialImageData = $.extend({}, imageData);
	    self.initialCanvasData = $.extend({}, canvasData);
	  },
	  limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
	    var self = this;
	    var options = self.options;
	    var viewMode = options.viewMode;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var aspectRatio = canvasData.aspectRatio;
	    var cropBoxData = self.cropBoxData;
	    var cropped = self.cropped && cropBoxData;
	    var minCanvasWidth = void 0;
	    var minCanvasHeight = void 0;
	    var newCanvasLeft = void 0;
	    var newCanvasTop = void 0;
	
	    if (sizeLimited) {
	      minCanvasWidth = Number(options.minCanvasWidth) || 0;
	      minCanvasHeight = Number(options.minCanvasHeight) || 0;
	
	      if (viewMode > 1) {
	        minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
	        minCanvasHeight = Math.max(minCanvasHeight, containerData.height);
	
	        if (viewMode === 3) {
	          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	            minCanvasWidth = minCanvasHeight * aspectRatio;
	          } else {
	            minCanvasHeight = minCanvasWidth / aspectRatio;
	          }
	        }
	      } else if (viewMode > 0) {
	        if (minCanvasWidth) {
	          minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
	        } else if (minCanvasHeight) {
	          minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
	        } else if (cropped) {
	          minCanvasWidth = cropBoxData.width;
	          minCanvasHeight = cropBoxData.height;
	
	          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	            minCanvasWidth = minCanvasHeight * aspectRatio;
	          } else {
	            minCanvasHeight = minCanvasWidth / aspectRatio;
	          }
	        }
	      }
	
	      if (minCanvasWidth && minCanvasHeight) {
	        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	          minCanvasHeight = minCanvasWidth / aspectRatio;
	        } else {
	          minCanvasWidth = minCanvasHeight * aspectRatio;
	        }
	      } else if (minCanvasWidth) {
	        minCanvasHeight = minCanvasWidth / aspectRatio;
	      } else if (minCanvasHeight) {
	        minCanvasWidth = minCanvasHeight * aspectRatio;
	      }
	
	      canvasData.minWidth = minCanvasWidth;
	      canvasData.minHeight = minCanvasHeight;
	      canvasData.maxWidth = Infinity;
	      canvasData.maxHeight = Infinity;
	    }
	
	    if (positionLimited) {
	      if (viewMode) {
	        newCanvasLeft = containerData.width - canvasData.width;
	        newCanvasTop = containerData.height - canvasData.height;
	
	        canvasData.minLeft = Math.min(0, newCanvasLeft);
	        canvasData.minTop = Math.min(0, newCanvasTop);
	        canvasData.maxLeft = Math.max(0, newCanvasLeft);
	        canvasData.maxTop = Math.max(0, newCanvasTop);
	
	        if (cropped && self.limited) {
	          canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
	          canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
	          canvasData.maxLeft = cropBoxData.left;
	          canvasData.maxTop = cropBoxData.top;
	
	          if (viewMode === 2) {
	            if (canvasData.width >= containerData.width) {
	              canvasData.minLeft = Math.min(0, newCanvasLeft);
	              canvasData.maxLeft = Math.max(0, newCanvasLeft);
	            }
	
	            if (canvasData.height >= containerData.height) {
	              canvasData.minTop = Math.min(0, newCanvasTop);
	              canvasData.maxTop = Math.max(0, newCanvasTop);
	            }
	          }
	        }
	      } else {
	        canvasData.minLeft = -canvasData.width;
	        canvasData.minTop = -canvasData.height;
	        canvasData.maxLeft = containerData.width;
	        canvasData.maxTop = containerData.height;
	      }
	    }
	  },
	  renderCanvas: function renderCanvas(changed) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var imageData = self.imageData;
	    var rotate = imageData.rotate;
	    var aspectRatio = void 0;
	    var rotatedData = void 0;
	
	    if (self.rotated) {
	      self.rotated = false;
	
	      // Computes rotated sizes with image sizes
	      rotatedData = $.getRotatedSizes({
	        width: imageData.width,
	        height: imageData.height,
	        degree: rotate
	      });
	
	      aspectRatio = rotatedData.width / rotatedData.height;
	
	      if (aspectRatio !== canvasData.aspectRatio) {
	        canvasData.left -= (rotatedData.width - canvasData.width) / 2;
	        canvasData.top -= (rotatedData.height - canvasData.height) / 2;
	        canvasData.width = rotatedData.width;
	        canvasData.height = rotatedData.height;
	        canvasData.aspectRatio = aspectRatio;
	        canvasData.naturalWidth = imageData.naturalWidth;
	        canvasData.naturalHeight = imageData.naturalHeight;
	
	        // Computes rotated sizes with natural image sizes
	        if (rotate % 180) {
	          rotatedData = $.getRotatedSizes({
	            width: imageData.naturalWidth,
	            height: imageData.naturalHeight,
	            degree: rotate
	          });
	
	          canvasData.naturalWidth = rotatedData.width;
	          canvasData.naturalHeight = rotatedData.height;
	        }
	
	        self.limitCanvas(true, false);
	      }
	    }
	
	    if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
	      canvasData.left = canvasData.oldLeft;
	    }
	
	    if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
	      canvasData.top = canvasData.oldTop;
	    }
	
	    canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
	    canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
	
	    self.limitCanvas(false, true);
	
	    canvasData.oldLeft = canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
	    canvasData.oldTop = canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
	
	    $.setStyle(self.canvas, {
	      width: canvasData.width,
	      height: canvasData.height,
	      left: canvasData.left,
	      top: canvasData.top
	    });
	
	    self.renderImage();
	
	    if (self.cropped && self.limited) {
	      self.limitCropBox(true, true);
	    }
	
	    if (changed) {
	      self.output();
	    }
	  },
	  renderImage: function renderImage(changed) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var imageData = self.imageData;
	    var newImageData = void 0;
	    var reversedData = void 0;
	    var reversedWidth = void 0;
	    var reversedHeight = void 0;
	
	    if (imageData.rotate) {
	      reversedData = $.getRotatedSizes({
	        width: canvasData.width,
	        height: canvasData.height,
	        degree: imageData.rotate,
	        aspectRatio: imageData.aspectRatio
	      }, true);
	
	      reversedWidth = reversedData.width;
	      reversedHeight = reversedData.height;
	
	      newImageData = {
	        width: reversedWidth,
	        height: reversedHeight,
	        left: (canvasData.width - reversedWidth) / 2,
	        top: (canvasData.height - reversedHeight) / 2
	      };
	    }
	
	    $.extend(imageData, newImageData || {
	      width: canvasData.width,
	      height: canvasData.height,
	      left: 0,
	      top: 0
	    });
	
	    var transform = $.getTransform(imageData);
	
	    $.setStyle(self.image, {
	      width: imageData.width,
	      height: imageData.height,
	      marginLeft: imageData.left,
	      marginTop: imageData.top,
	      WebkitTransform: transform,
	      msTransform: transform,
	      transform: transform
	    });
	
	    if (changed) {
	      self.output();
	    }
	  },
	  initCropBox: function initCropBox() {
	    var self = this;
	    var options = self.options;
	    var aspectRatio = options.aspectRatio;
	    var autoCropArea = Number(options.autoCropArea) || 0.8;
	    var canvasData = self.canvasData;
	    var cropBoxData = {
	      width: canvasData.width,
	      height: canvasData.height
	    };
	
	    if (aspectRatio) {
	      if (canvasData.height * aspectRatio > canvasData.width) {
	        cropBoxData.height = cropBoxData.width / aspectRatio;
	      } else {
	        cropBoxData.width = cropBoxData.height * aspectRatio;
	      }
	    }
	
	    self.cropBoxData = cropBoxData;
	    self.limitCropBox(true, true);
	
	    // Initialize auto crop area
	    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
	
	    // The width/height of auto crop area must large than "minWidth/Height"
	    cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
	    cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
	    cropBoxData.oldLeft = cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
	    cropBoxData.oldTop = cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
	
	    self.initialCropBoxData = $.extend({}, cropBoxData);
	  },
	  limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
	    var self = this;
	    var options = self.options;
	    var aspectRatio = options.aspectRatio;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var limited = self.limited;
	    var minCropBoxWidth = void 0;
	    var minCropBoxHeight = void 0;
	    var maxCropBoxWidth = void 0;
	    var maxCropBoxHeight = void 0;
	
	    if (sizeLimited) {
	      minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
	      minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
	
	      // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
	      minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
	      minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);
	      maxCropBoxWidth = Math.min(containerData.width, limited ? canvasData.width : containerData.width);
	      maxCropBoxHeight = Math.min(containerData.height, limited ? canvasData.height : containerData.height);
	
	      if (aspectRatio) {
	        if (minCropBoxWidth && minCropBoxHeight) {
	          if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
	            minCropBoxHeight = minCropBoxWidth / aspectRatio;
	          } else {
	            minCropBoxWidth = minCropBoxHeight * aspectRatio;
	          }
	        } else if (minCropBoxWidth) {
	          minCropBoxHeight = minCropBoxWidth / aspectRatio;
	        } else if (minCropBoxHeight) {
	          minCropBoxWidth = minCropBoxHeight * aspectRatio;
	        }
	
	        if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
	          maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
	        } else {
	          maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
	        }
	      }
	
	      // The minWidth/Height must be less than maxWidth/Height
	      cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
	      cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
	      cropBoxData.maxWidth = maxCropBoxWidth;
	      cropBoxData.maxHeight = maxCropBoxHeight;
	    }
	
	    if (positionLimited) {
	      if (limited) {
	        cropBoxData.minLeft = Math.max(0, canvasData.left);
	        cropBoxData.minTop = Math.max(0, canvasData.top);
	        cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
	        cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
	      } else {
	        cropBoxData.minLeft = 0;
	        cropBoxData.minTop = 0;
	        cropBoxData.maxLeft = containerData.width - cropBoxData.width;
	        cropBoxData.maxTop = containerData.height - cropBoxData.height;
	      }
	    }
	  },
	  renderCropBox: function renderCropBox() {
	    var self = this;
	    var options = self.options;
	    var containerData = self.containerData;
	    var cropBoxData = self.cropBoxData;
	
	    if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
	      cropBoxData.left = cropBoxData.oldLeft;
	    }
	
	    if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
	      cropBoxData.top = cropBoxData.oldTop;
	    }
	
	    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
	
	    self.limitCropBox(false, true);
	
	    cropBoxData.oldLeft = cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
	    cropBoxData.oldTop = cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
	
	    if (options.movable && options.cropBoxMovable) {
	      // Turn to move the canvas when the crop box is equal to the container
	      $.setData(self.face, 'action', cropBoxData.width === containerData.width && cropBoxData.height === containerData.height ? 'move' : 'all');
	    }
	
	    $.setStyle(self.cropBox, {
	      width: cropBoxData.width,
	      height: cropBoxData.height,
	      left: cropBoxData.left,
	      top: cropBoxData.top
	    });
	
	    if (self.cropped && self.limited) {
	      self.limitCanvas(true, true);
	    }
	
	    if (!self.disabled) {
	      self.output();
	    }
	  },
	  output: function output() {
	    var self = this;
	
	    self.preview();
	
	    if (self.complete) {
	      $.dispatchEvent(self.element, 'crop', self.getData());
	    }
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.typeOf = typeOf;
	exports.isNumber = isNumber;
	exports.isUndefined = isUndefined;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.isFunction = isFunction;
	exports.isArray = isArray;
	exports.toArray = toArray;
	exports.trim = trim;
	exports.each = each;
	exports.extend = extend;
	exports.proxy = proxy;
	exports.setStyle = setStyle;
	exports.hasClass = hasClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.toggleClass = toggleClass;
	exports.hyphenate = hyphenate;
	exports.getData = getData;
	exports.setData = setData;
	exports.removeData = removeData;
	exports.removeListener = removeListener;
	exports.dispatchEvent = dispatchEvent;
	exports.getEvent = getEvent;
	exports.getOffset = getOffset;
	exports.getTouchesCenter = getTouchesCenter;
	exports.getByTag = getByTag;
	exports.getByClass = getByClass;
	exports.createElement = createElement;
	exports.appendChild = appendChild;
	exports.removeChild = removeChild;
	exports.empty = empty;
	exports.isCrossOriginURL = isCrossOriginURL;
	exports.addTimestamp = addTimestamp;
	exports.getImageSize = getImageSize;
	exports.getTransform = getTransform;
	exports.getRotatedSizes = getRotatedSizes;
	exports.getSourceCanvas = getSourceCanvas;
	exports.getStringFromCharCode = getStringFromCharCode;
	exports.getOrientation = getOrientation;
	exports.dataURLToArrayBuffer = dataURLToArrayBuffer;
	exports.arrayBufferToDataURL = arrayBufferToDataURL;
	// RegExps
	var REGEXP_DATA_URL_HEAD = /^data:([^;]+);base64,/;
	var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
	var REGEXP_ORIGINS = /^(https?:)\/\/([^:\/\?#]+):?(\d*)/i;
	var REGEXP_SPACES = /\s+/;
	var REGEXP_SUFFIX = /^(width|height|left|top|marginLeft|marginTop)$/;
	var REGEXP_TRIM = /^\s+(.*)\s+$/;
	var REGEXP_USERAGENT = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i;
	var navigator = window.navigator;
	var IS_SAFARI_OR_UIWEBVIEW = navigator && REGEXP_USERAGENT.test(navigator.userAgent);
	
	// Utilities
	var objectProto = Object.prototype;
	var toString = objectProto.toString;
	var hasOwnProperty = objectProto.hasOwnProperty;
	var slice = Array.prototype.slice;
	var fromCharCode = String.fromCharCode;
	
	function typeOf(obj) {
	  return toString.call(obj).slice(8, -1).toLowerCase();
	}
	
	function isNumber(num) {
	  return typeof num === 'number' && !isNaN(num);
	}
	
	function isUndefined(obj) {
	  return typeof obj === 'undefined';
	}
	
	function isObject(obj) {
	  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
	}
	
	function isPlainObject(obj) {
	  if (!isObject(obj)) {
	    return false;
	  }
	
	  try {
	    var _constructor = obj.constructor;
	    var prototype = _constructor.prototype;
	
	    return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	  } catch (e) {
	    return false;
	  }
	}
	
	function isFunction(fn) {
	  return typeOf(fn) === 'function';
	}
	
	function isArray(arr) {
	  return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
	}
	
	function toArray(obj, offset) {
	  offset = offset >= 0 ? offset : 0;
	
	  if (Array.from) {
	    return Array.from(obj).slice(offset);
	  }
	
	  return slice.call(obj, offset);
	}
	
	function trim(str) {
	  if (typeof str === 'string') {
	    str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '$1');
	  }
	
	  return str;
	}
	
	function each(obj, callback) {
	  if (obj && isFunction(callback)) {
	    var i = void 0;
	
	    if (isArray(obj) || isNumber(obj.length) /* array-like */) {
	        var length = obj.length;
	
	        for (i = 0; i < length; i++) {
	          if (callback.call(obj, obj[i], i, obj) === false) {
	            break;
	          }
	        }
	      } else if (isObject(obj)) {
	      Object.keys(obj).forEach(function (key) {
	        callback.call(obj, obj[key], key, obj);
	      });
	    }
	  }
	
	  return obj;
	}
	
	function extend() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var deep = args[0] === true;
	  var data = deep ? args[1] : args[0];
	
	  if (args.length > 1) {
	    // if (Object.assign) {
	    //   return Object.assign.apply(Object, args);
	    // }
	
	    args.shift();
	
	    args.forEach(function (arg) {
	      if (isObject(arg)) {
	        Object.keys(arg).forEach(function (key) {
	          if (deep && isObject(data[key])) {
	            extend(true, data[key], arg[key]);
	          } else {
	            data[key] = arg[key];
	          }
	        });
	      }
	    });
	  }
	
	  return data;
	}
	
	function proxy(fn, context) {
	  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	    args[_key2 - 2] = arguments[_key2];
	  }
	
	  return function () {
	    for (var _len3 = arguments.length, args2 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args2[_key3] = arguments[_key3];
	    }
	
	    return fn.apply(context, args.concat(args2));
	  };
	}
	
	function setStyle(element, styles) {
	  var style = element.style;
	
	  each(styles, function (value, property) {
	    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
	      value += 'px';
	    }
	
	    style[property] = value;
	  });
	}
	
	function hasClass(element, value) {
	  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
	}
	
	function addClass(element, value) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      addClass(elem, value);
	    });
	    return;
	  }
	
	  if (element.classList) {
	    element.classList.add(value);
	    return;
	  }
	
	  var className = trim(element.className);
	
	  if (!className) {
	    element.className = value;
	  } else if (className.indexOf(value) < 0) {
	    element.className = className + ' ' + value;
	  }
	}
	
	function removeClass(element, value) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      removeClass(elem, value);
	    });
	    return;
	  }
	
	  if (element.classList) {
	    element.classList.remove(value);
	    return;
	  }
	
	  if (element.className.indexOf(value) >= 0) {
	    element.className = element.className.replace(value, '');
	  }
	}
	
	function toggleClass(element, value, added) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      toggleClass(elem, value, added);
	    });
	    return;
	  }
	
	  // IE10-11 doesn't support the second parameter of `classList.toggle`
	  if (added) {
	    addClass(element, value);
	  } else {
	    removeClass(element, value);
	  }
	}
	
	function hyphenate(str) {
	  return str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
	}
	
	function getData(element, name) {
	  if (isObject(element[name])) {
	    return element[name];
	  } else if (element.dataset) {
	    return element.dataset[name];
	  }
	
	  return element.getAttribute('data-' + hyphenate(name));
	}
	
	function setData(element, name, data) {
	  if (isObject(data)) {
	    element[name] = data;
	  } else if (element.dataset) {
	    element.dataset[name] = data;
	  } else {
	    element.setAttribute('data-' + hyphenate(name), data);
	  }
	}
	
	function removeData(element, name) {
	  if (isObject(element[name])) {
	    delete element[name];
	  } else if (element.dataset) {
	    delete element.dataset[name];
	  } else {
	    element.removeAttribute('data-' + hyphenate(name));
	  }
	}
	
	function removeListener(element, type, handler) {
	  var types = trim(type).split(REGEXP_SPACES);
	
	  if (types.length > 1) {
	    each(types, function (t) {
	      removeListener(element, t, handler);
	    });
	    return;
	  }
	
	  if (element.removeEventListener) {
	    element.removeEventListener(type, handler, false);
	  } else if (element.detachEvent) {
	    element.detachEvent('on' + type, handler);
	  }
	}
	
	function addListener(element, type, _handler, once) {
	  var types = trim(type).split(REGEXP_SPACES);
	  var originalHandler = _handler;
	
	  if (types.length > 1) {
	    each(types, function (t) {
	      addListener(element, t, _handler);
	    });
	    return;
	  }
	
	  if (once) {
	    _handler = function handler() {
	      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }
	
	      removeListener(element, type, _handler);
	
	      return originalHandler.apply(element, args);
	    };
	  }
	
	  if (element.addEventListener) {
	    element.addEventListener(type, _handler, false);
	  } else if (element.attachEvent) {
	    element.attachEvent('on${type}', _handler);
	  }
	}
	
	exports.addListener = addListener;
	function dispatchEvent(element, type, data) {
	  if (element.dispatchEvent) {
	    var event = void 0;
	
	    // Event and CustomEvent on IE9-11 are global objects, not constructors
	    if (isFunction(Event) && isFunction(CustomEvent)) {
	      if (isUndefined(data)) {
	        event = new Event(type, {
	          bubbles: true,
	          cancelable: true
	        });
	      } else {
	        event = new CustomEvent(type, {
	          detail: data,
	          bubbles: true,
	          cancelable: true
	        });
	      }
	    } else if (isUndefined(data)) {
	      event = document.createEvent('Event');
	      event.initEvent(type, true, true);
	    } else {
	      event = document.createEvent('CustomEvent');
	      event.initCustomEvent(type, true, true, data);
	    }
	
	    // IE9+
	    return element.dispatchEvent(event);
	  } else if (element.fireEvent) {
	    // IE6-10 (native events only)
	    return element.fireEvent('on' + type);
	  }
	
	  return true;
	}
	
	function getEvent(event) {
	  var e = event || window.event;
	
	  // Fix target property (IE8)
	  if (!e.target) {
	    e.target = e.srcElement || document;
	  }
	
	  if (!isNumber(e.pageX) && isNumber(e.clientX)) {
	    var eventDoc = event.target.ownerDocument || document;
	    var doc = eventDoc.documentElement;
	    var body = eventDoc.body;
	
	    e.pageX = e.clientX + ((doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
	    e.pageY = e.clientY + ((doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0));
	  }
	
	  return e;
	}
	
	function getOffset(element) {
	  var doc = document.documentElement;
	  var box = element.getBoundingClientRect();
	
	  return {
	    left: box.left + ((window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0)),
	    top: box.top + ((window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0))
	  };
	}
	
	function getTouchesCenter(touches) {
	  var length = touches.length;
	  var pageX = 0;
	  var pageY = 0;
	
	  if (length) {
	    each(touches, function (touch) {
	      pageX += touch.pageX;
	      pageY += touch.pageY;
	    });
	
	    pageX /= length;
	    pageY /= length;
	  }
	
	  return {
	    pageX: pageX,
	    pageY: pageY
	  };
	}
	
	function getByTag(element, tagName) {
	  return element.getElementsByTagName(tagName);
	}
	
	function getByClass(element, className) {
	  return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
	}
	
	function createElement(tagName) {
	  return document.createElement(tagName);
	}
	
	function appendChild(element, elem) {
	  element.appendChild(elem);
	}
	
	function removeChild(element) {
	  if (element.parentNode) {
	    element.parentNode.removeChild(element);
	  }
	}
	
	function empty(element) {
	  while (element.firstChild) {
	    element.removeChild(element.firstChild);
	  }
	}
	
	function isCrossOriginURL(url) {
	  var parts = url.match(REGEXP_ORIGINS);
	
	  return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
	}
	
	function addTimestamp(url) {
	  var timestamp = 'timestamp=' + new Date().getTime();
	
	  return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
	}
	
	function getImageSize(image, callback) {
	  // Modern browsers (ignore Safari)
	  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
	    callback(image.naturalWidth, image.naturalHeight);
	    return;
	  }
	
	  // IE8: Don't use `new Image()` here
	  var newImage = createElement('img');
	
	  newImage.onload = function load() {
	    callback(this.width, this.height);
	  };
	
	  newImage.src = image.src;
	}
	
	function getTransform(data) {
	  var transforms = [];
	  var rotate = data.rotate;
	  var scaleX = data.scaleX;
	  var scaleY = data.scaleY;
	
	  // Rotate should come first before scale to match orientation transform
	  if (isNumber(rotate) && rotate !== 0) {
	    transforms.push('rotate(' + rotate + 'deg)');
	  }
	
	  if (isNumber(scaleX) && scaleX !== 1) {
	    transforms.push('scaleX(' + scaleX + ')');
	  }
	
	  if (isNumber(scaleY) && scaleY !== 1) {
	    transforms.push('scaleY(' + scaleY + ')');
	  }
	
	  return transforms.length ? transforms.join(' ') : 'none';
	}
	
	function getRotatedSizes(data, reversed) {
	  var deg = Math.abs(data.degree) % 180;
	  var arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180;
	  var sinArc = Math.sin(arc);
	  var cosArc = Math.cos(arc);
	  var width = data.width;
	  var height = data.height;
	  var aspectRatio = data.aspectRatio;
	  var newWidth = void 0;
	  var newHeight = void 0;
	
	  if (!reversed) {
	    newWidth = width * cosArc + height * sinArc;
	    newHeight = width * sinArc + height * cosArc;
	  } else {
	    newWidth = width / (cosArc + sinArc / aspectRatio);
	    newHeight = newWidth / aspectRatio;
	  }
	
	  return {
	    width: newWidth,
	    height: newHeight
	  };
	}
	
	function getSourceCanvas(image, data) {
	  var canvas = createElement('canvas');
	  var context = canvas.getContext('2d');
	  var dstX = 0;
	  var dstY = 0;
	  var dstWidth = data.naturalWidth;
	  var dstHeight = data.naturalHeight;
	  var rotate = data.rotate;
	  var scaleX = data.scaleX;
	  var scaleY = data.scaleY;
	  var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
	  var rotatable = isNumber(rotate) && rotate !== 0;
	  var advanced = rotatable || scalable;
	  var canvasWidth = dstWidth * Math.abs(scaleX || 1);
	  var canvasHeight = dstHeight * Math.abs(scaleY || 1);
	  var translateX = void 0;
	  var translateY = void 0;
	  var rotated = void 0;
	
	  if (scalable) {
	    translateX = canvasWidth / 2;
	    translateY = canvasHeight / 2;
	  }
	
	  if (rotatable) {
	    rotated = getRotatedSizes({
	      width: canvasWidth,
	      height: canvasHeight,
	      degree: rotate
	    });
	
	    canvasWidth = rotated.width;
	    canvasHeight = rotated.height;
	    translateX = canvasWidth / 2;
	    translateY = canvasHeight / 2;
	  }
	
	  canvas.width = canvasWidth;
	  canvas.height = canvasHeight;
	
	  if (advanced) {
	    dstX = -dstWidth / 2;
	    dstY = -dstHeight / 2;
	
	    context.save();
	    context.translate(translateX, translateY);
	  }
	
	  // Rotate should come first before scale as in the "getTransform" function
	  if (rotatable) {
	    context.rotate(rotate * Math.PI / 180);
	  }
	
	  if (scalable) {
	    context.scale(scaleX, scaleY);
	  }
	
	  context.drawImage(image, Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
	
	  if (advanced) {
	    context.restore();
	  }
	
	  return canvas;
	}
	
	function getStringFromCharCode(dataView, start, length) {
	  var str = '';
	  var i = start;
	
	  for (length += start; i < length; i++) {
	    str += fromCharCode(dataView.getUint8(i));
	  }
	
	  return str;
	}
	
	function getOrientation(arrayBuffer) {
	  var dataView = new DataView(arrayBuffer);
	  var length = dataView.byteLength;
	  var orientation = void 0;
	  var exifIDCode = void 0;
	  var tiffOffset = void 0;
	  var firstIFDOffset = void 0;
	  var littleEndian = void 0;
	  var endianness = void 0;
	  var app1Start = void 0;
	  var ifdStart = void 0;
	  var offset = void 0;
	  var i = void 0;
	
	  // Only handle JPEG image (start by 0xFFD8)
	  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
	    offset = 2;
	
	    while (offset < length) {
	      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
	        app1Start = offset;
	        break;
	      }
	
	      offset++;
	    }
	  }
	
	  if (app1Start) {
	    exifIDCode = app1Start + 4;
	    tiffOffset = app1Start + 10;
	
	    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
	      endianness = dataView.getUint16(tiffOffset);
	      littleEndian = endianness === 0x4949;
	
	      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
	          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
	            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
	
	            if (firstIFDOffset >= 0x00000008) {
	              ifdStart = tiffOffset + firstIFDOffset;
	            }
	          }
	        }
	    }
	  }
	
	  if (ifdStart) {
	    length = dataView.getUint16(ifdStart, littleEndian);
	
	    for (i = 0; i < length; i++) {
	      offset = ifdStart + i * 12 + 2;
	
	      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
	          // 8 is the offset of the current tag's value
	          offset += 8;
	
	          // Get the original orientation value
	          orientation = dataView.getUint16(offset, littleEndian);
	
	          // Override the orientation with its default value for Safari
	          if (IS_SAFARI_OR_UIWEBVIEW) {
	            dataView.setUint16(offset, 1, littleEndian);
	          }
	
	          break;
	        }
	    }
	  }
	
	  return orientation;
	}
	
	function dataURLToArrayBuffer(dataURL) {
	  var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
	  var binary = atob(base64);
	  var length = binary.length;
	  var arrayBuffer = new ArrayBuffer(length);
	  var dataView = new Uint8Array(arrayBuffer);
	  var i = void 0;
	
	  for (i = 0; i < length; i++) {
	    dataView[i] = binary.charCodeAt(i);
	  }
	
	  return arrayBuffer;
	}
	
	// Only available for JPEG image
	function arrayBufferToDataURL(arrayBuffer) {
	  var dataView = new Uint8Array(arrayBuffer);
	  var length = dataView.length;
	  var base64 = '';
	  var i = void 0;
	
	  for (i = 0; i < length; i++) {
	    base64 += fromCharCode(dataView[i]);
	  }
	
	  return 'data:image/jpeg;base64,' + btoa(base64);
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var DATA_PREVIEW = 'preview';
	
	exports.default = {
	  initPreview: function initPreview() {
	    var self = this;
	    var preview = self.options.preview;
	    var image = $.createElement('img');
	    var crossOrigin = self.crossOrigin;
	    var url = crossOrigin ? self.crossOriginUrl : self.url;
	
	    if (crossOrigin) {
	      image.crossOrigin = crossOrigin;
	    }
	
	    image.src = url;
	    $.appendChild(self.viewBox, image);
	    self.image2 = image;
	
	    if (!preview) {
	      return;
	    }
	
	    var previews = document.querySelectorAll(preview);
	
	    self.previews = previews;
	
	    $.each(previews, function (element) {
	      var img = $.createElement('img');
	
	      // Save the original size for recover
	      $.setData(element, DATA_PREVIEW, {
	        width: element.offsetWidth,
	        height: element.offsetHeight,
	        html: element.innerHTML
	      });
	
	      if (crossOrigin) {
	        img.crossOrigin = crossOrigin;
	      }
	
	      img.src = url;
	
	      /**
	       * Override img element styles
	       * Add `display:block` to avoid margin top issue
	       * Add `height:auto` to override `height` attribute on IE8
	       * (Occur only when margin-top <= -height)
	       */
	
	      img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
	
	      $.empty(element);
	      $.appendChild(element, img);
	    });
	  },
	  resetPreview: function resetPreview() {
	    $.each(this.previews, function (element) {
	      var data = $.getData(element, DATA_PREVIEW);
	
	      $.setStyle(element, {
	        width: data.width,
	        height: data.height
	      });
	
	      element.innerHTML = data.html;
	      $.removeData(element, DATA_PREVIEW);
	    });
	  },
	  preview: function preview() {
	    var self = this;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var cropBoxWidth = cropBoxData.width;
	    var cropBoxHeight = cropBoxData.height;
	    var width = imageData.width;
	    var height = imageData.height;
	    var left = cropBoxData.left - canvasData.left - imageData.left;
	    var top = cropBoxData.top - canvasData.top - imageData.top;
	    var transform = $.getTransform(imageData);
	    var transforms = {
	      WebkitTransform: transform,
	      msTransform: transform,
	      transform: transform
	    };
	
	    if (!self.cropped || self.disabled) {
	      return;
	    }
	
	    $.setStyle(self.image2, $.extend({
	      width: width,
	      height: height,
	      marginLeft: -left,
	      marginTop: -top
	    }, transforms));
	
	    $.each(self.previews, function (element) {
	      var data = $.getData(element, DATA_PREVIEW);
	      var originalWidth = data.width;
	      var originalHeight = data.height;
	      var newWidth = originalWidth;
	      var newHeight = originalHeight;
	      var ratio = 1;
	
	      if (cropBoxWidth) {
	        ratio = originalWidth / cropBoxWidth;
	        newHeight = cropBoxHeight * ratio;
	      }
	
	      if (cropBoxHeight && newHeight > originalHeight) {
	        ratio = originalHeight / cropBoxHeight;
	        newWidth = cropBoxWidth * ratio;
	        newHeight = originalHeight;
	      }
	
	      $.setStyle(element, {
	        width: newWidth,
	        height: newHeight
	      });
	
	      $.setStyle($.getByTag(element, 'img')[0], $.extend({
	        width: width * ratio,
	        height: height * ratio,
	        marginLeft: -left * ratio,
	        marginTop: -top * ratio
	      }, transforms));
	    });
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// Events
	var EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
	var EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
	var EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel' + ' MSPointerUp MSPointerCancel';
	var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
	var EVENT_DBLCLICK = 'dblclick';
	var EVENT_RESIZE = 'resize';
	var EVENT_CROP_START = 'cropstart';
	var EVENT_CROP_MOVE = 'cropmove';
	var EVENT_CROP_END = 'cropend';
	var EVENT_CROP = 'crop';
	var EVENT_ZOOM = 'zoom';
	
	exports.default = {
	  bind: function bind() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var cropper = self.cropper;
	
	    if ($.isFunction(options.cropstart)) {
	      $.addListener(element, EVENT_CROP_START, options.cropstart);
	    }
	
	    if ($.isFunction(options.cropmove)) {
	      $.addListener(element, EVENT_CROP_MOVE, options.cropmove);
	    }
	
	    if ($.isFunction(options.cropend)) {
	      $.addListener(element, EVENT_CROP_END, options.cropend);
	    }
	
	    if ($.isFunction(options.crop)) {
	      $.addListener(element, EVENT_CROP, options.crop);
	    }
	
	    if ($.isFunction(options.zoom)) {
	      $.addListener(element, EVENT_ZOOM, options.zoom);
	    }
	
	    $.addListener(cropper, EVENT_MOUSE_DOWN, self.onCropStart = $.proxy(self.cropStart, self));
	
	    if (options.zoomable && options.zoomOnWheel) {
	      $.addListener(cropper, EVENT_WHEEL, self.onWheel = $.proxy(self.wheel, self));
	    }
	
	    if (options.toggleDragModeOnDblclick) {
	      $.addListener(cropper, EVENT_DBLCLICK, self.onDblclick = $.proxy(self.dblclick, self));
	    }
	
	    $.addListener(document, EVENT_MOUSE_MOVE, self.onCropMove = $.proxy(self.cropMove, self));
	    $.addListener(document, EVENT_MOUSE_UP, self.onCropEnd = $.proxy(self.cropEnd, self));
	
	    if (options.responsive) {
	      $.addListener(window, EVENT_RESIZE, self.onResize = $.proxy(self.resize, self));
	    }
	  },
	  unbind: function unbind() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var cropper = self.cropper;
	
	    if ($.isFunction(options.cropstart)) {
	      $.removeListener(element, EVENT_CROP_START, options.cropstart);
	    }
	
	    if ($.isFunction(options.cropmove)) {
	      $.removeListener(element, EVENT_CROP_MOVE, options.cropmove);
	    }
	
	    if ($.isFunction(options.cropend)) {
	      $.removeListener(element, EVENT_CROP_END, options.cropend);
	    }
	
	    if ($.isFunction(options.crop)) {
	      $.removeListener(element, EVENT_CROP, options.crop);
	    }
	
	    if ($.isFunction(options.zoom)) {
	      $.removeListener(element, EVENT_ZOOM, options.zoom);
	    }
	
	    $.removeListener(cropper, EVENT_MOUSE_DOWN, self.onCropStart);
	
	    if (options.zoomable && options.zoomOnWheel) {
	      $.removeListener(cropper, EVENT_WHEEL, self.onWheel);
	    }
	
	    if (options.toggleDragModeOnDblclick) {
	      $.removeListener(cropper, EVENT_DBLCLICK, self.onDblclick);
	    }
	
	    $.removeListener(document, EVENT_MOUSE_MOVE, self.onCropMove);
	    $.removeListener(document, EVENT_MOUSE_UP, self.onCropEnd);
	
	    if (options.responsive) {
	      $.removeListener(window, EVENT_RESIZE, self.onResize);
	    }
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REGEXP_ACTIONS = undefined;
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var REGEXP_ACTIONS = exports.REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;
	
	exports.default = {
	  resize: function resize() {
	    var self = this;
	    var restore = self.options.restore;
	    var container = self.container;
	    var containerData = self.containerData;
	
	    // Check `container` is necessary for IE8
	    if (self.disabled || !containerData) {
	      return;
	    }
	
	    var ratio = container.offsetWidth / containerData.width;
	    var canvasData = void 0;
	    var cropBoxData = void 0;
	
	    // Resize when width changed or height changed
	    if (ratio !== 1 || container.offsetHeight !== containerData.height) {
	      if (restore) {
	        canvasData = self.getCanvasData();
	        cropBoxData = self.getCropBoxData();
	      }
	
	      self.render();
	
	      if (restore) {
	        self.setCanvasData($.each(canvasData, function (n, i) {
	          canvasData[i] = n * ratio;
	        }));
	        self.setCropBoxData($.each(cropBoxData, function (n, i) {
	          cropBoxData[i] = n * ratio;
	        }));
	      }
	    }
	  },
	  dblclick: function dblclick() {
	    var self = this;
	
	    if (self.disabled) {
	      return;
	    }
	
	    self.setDragMode($.hasClass(self.dragBox, 'cropper-crop') ? 'move' : 'crop');
	  },
	  wheel: function wheel(event) {
	    var self = this;
	    var e = $.getEvent(event);
	    var ratio = Number(self.options.wheelZoomRatio) || 0.1;
	    var delta = 1;
	
	    if (self.disabled) {
	      return;
	    }
	
	    e.preventDefault();
	
	    // Limit wheel speed to prevent zoom too fast (#21)
	    if (self.wheeling) {
	      return;
	    }
	
	    self.wheeling = true;
	
	    setTimeout(function () {
	      self.wheeling = false;
	    }, 50);
	
	    if (e.deltaY) {
	      delta = e.deltaY > 0 ? 1 : -1;
	    } else if (e.wheelDelta) {
	      delta = -e.wheelDelta / 120;
	    } else if (e.detail) {
	      delta = e.detail > 0 ? 1 : -1;
	    }
	
	    self.zoom(-delta * ratio, e);
	  },
	  cropStart: function cropStart(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var touches = e.touches;
	    var touchesLength = void 0;
	    var touch = void 0;
	    var action = void 0;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (touches) {
	      touchesLength = touches.length;
	
	      if (touchesLength > 1) {
	        if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	          touch = touches[1];
	          self.startX2 = touch.pageX;
	          self.startY2 = touch.pageY;
	          action = 'zoom';
	        } else {
	          return;
	        }
	      }
	
	      touch = touches[0];
	    }
	
	    action = action || $.getData(e.target, 'action');
	
	    if (REGEXP_ACTIONS.test(action)) {
	      if ($.dispatchEvent(self.element, 'cropstart', {
	        originalEvent: e,
	        action: action
	      }) === false) {
	        return;
	      }
	
	      e.preventDefault();
	
	      self.action = action;
	      self.cropping = false;
	
	      self.startX = touch ? touch.pageX : e.pageX;
	      self.startY = touch ? touch.pageY : e.pageY;
	
	      if (action === 'crop') {
	        self.cropping = true;
	        $.addClass(self.dragBox, 'cropper-modal');
	      }
	    }
	  },
	  cropMove: function cropMove(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var touches = e.touches;
	    var action = self.action;
	    var touchesLength = void 0;
	    var touch = void 0;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (touches) {
	      touchesLength = touches.length;
	
	      if (touchesLength > 1) {
	        if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	          touch = touches[1];
	          self.endX2 = touch.pageX;
	          self.endY2 = touch.pageY;
	        } else {
	          return;
	        }
	      }
	
	      touch = touches[0];
	    }
	
	    if (action) {
	      if ($.dispatchEvent(self.element, 'cropmove', {
	        originalEvent: e,
	        action: action
	      }) === false) {
	        return;
	      }
	
	      e.preventDefault();
	
	      self.endX = touch ? touch.pageX : e.pageX;
	      self.endY = touch ? touch.pageY : e.pageY;
	
	      self.change(e.shiftKey, action === 'zoom' ? e : null);
	    }
	  },
	  cropEnd: function cropEnd(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var action = self.action;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (action) {
	      e.preventDefault();
	
	      if (self.cropping) {
	        self.cropping = false;
	        $.toggleClass(self.dragBox, 'cropper-modal', self.cropped && options.modal);
	      }
	
	      self.action = '';
	
	      $.dispatchEvent(self.element, 'cropend', {
	        originalEvent: e,
	        action: action
	      });
	    }
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// Actions
	var ACTION_EAST = 'e';
	var ACTION_WEST = 'w';
	var ACTION_SOUTH = 's';
	var ACTION_NORTH = 'n';
	var ACTION_SOUTH_EAST = 'se';
	var ACTION_SOUTH_WEST = 'sw';
	var ACTION_NORTH_EAST = 'ne';
	var ACTION_NORTH_WEST = 'nw';
	
	exports.default = {
	  change: function change(shiftKey, originalEvent) {
	    var self = this;
	    var options = self.options;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var aspectRatio = options.aspectRatio;
	    var action = self.action;
	    var width = cropBoxData.width;
	    var height = cropBoxData.height;
	    var left = cropBoxData.left;
	    var top = cropBoxData.top;
	    var right = left + width;
	    var bottom = top + height;
	    var minLeft = 0;
	    var minTop = 0;
	    var maxWidth = containerData.width;
	    var maxHeight = containerData.height;
	    var renderable = true;
	    var offset = void 0;
	
	    // Locking aspect ratio in "free mode" by holding shift key
	    if (!aspectRatio && shiftKey) {
	      aspectRatio = width && height ? width / height : 1;
	    }
	
	    if (self.limited) {
	      minLeft = cropBoxData.minLeft;
	      minTop = cropBoxData.minTop;
	      maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
	      maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
	    }
	
	    var range = {
	      x: self.endX - self.startX,
	      y: self.endY - self.startY
	    };
	
	    if (aspectRatio) {
	      range.X = range.y * aspectRatio;
	      range.Y = range.x / aspectRatio;
	    }
	
	    switch (action) {
	      // Move crop box
	      case 'all':
	        left += range.x;
	        top += range.y;
	        break;
	
	      // Resize crop box
	      case ACTION_EAST:
	        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }
	
	        width += range.x;
	
	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top -= range.Y / 2;
	        }
	
	        if (width < 0) {
	          action = ACTION_WEST;
	          width = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH:
	        if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }
	
	        height -= range.y;
	        top += range.y;
	
	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left += range.X / 2;
	        }
	
	        if (height < 0) {
	          action = ACTION_SOUTH;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_WEST:
	        if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }
	
	        width -= range.x;
	        left += range.x;
	
	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top += range.Y / 2;
	        }
	
	        if (width < 0) {
	          action = ACTION_EAST;
	          width = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH:
	        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }
	
	        height += range.y;
	
	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left -= range.X / 2;
	        }
	
	        if (height < 0) {
	          action = ACTION_NORTH;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH_EAST:
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
	            renderable = false;
	            break;
	          }
	
	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }
	
	          if (range.y <= 0) {
	            if (top > minTop) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_SOUTH_WEST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_NORTH_WEST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_SOUTH_EAST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH_WEST:
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
	            renderable = false;
	            break;
	          }
	
	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	          left += range.X;
	        } else {
	          if (range.x <= 0) {
	            if (left > minLeft) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }
	
	          if (range.y <= 0) {
	            if (top > minTop) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_SOUTH_EAST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_NORTH_EAST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_SOUTH_WEST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH_WEST:
	        if (aspectRatio) {
	          if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }
	
	          width -= range.x;
	          left += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x <= 0) {
	            if (left > minLeft) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }
	
	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_NORTH_EAST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_SOUTH_EAST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_NORTH_WEST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH_EAST:
	        if (aspectRatio) {
	          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }
	
	          width += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }
	
	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_NORTH_WEST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_SOUTH_WEST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_NORTH_EAST;
	          height = 0;
	        }
	
	        break;
	
	      // Move canvas
	      case 'move':
	        self.move(range.x, range.y);
	        renderable = false;
	        break;
	
	      // Zoom canvas
	      case 'zoom':
	        self.zoom(function (x1, y1, x2, y2) {
	          var z1 = Math.sqrt(x1 * x1 + y1 * y1);
	          var z2 = Math.sqrt(x2 * x2 + y2 * y2);
	
	          return (z2 - z1) / z1;
	        }(Math.abs(self.startX - self.startX2), Math.abs(self.startY - self.startY2), Math.abs(self.endX - self.endX2), Math.abs(self.endY - self.endY2)), originalEvent);
	        self.startX2 = self.endX2;
	        self.startY2 = self.endY2;
	        renderable = false;
	        break;
	
	      // Create crop box
	      case 'crop':
	        if (!range.x || !range.y) {
	          renderable = false;
	          break;
	        }
	
	        offset = $.getOffset(self.cropper);
	        left = self.startX - offset.left;
	        top = self.startY - offset.top;
	        width = cropBoxData.minWidth;
	        height = cropBoxData.minHeight;
	
	        if (range.x > 0) {
	          action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
	        } else if (range.x < 0) {
	          left -= width;
	          action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
	        }
	
	        if (range.y < 0) {
	          top -= height;
	        }
	
	        // Show the crop box if is hidden
	        if (!self.cropped) {
	          $.removeClass(self.cropBox, 'cropper-hidden');
	          self.cropped = true;
	
	          if (self.limited) {
	            self.limitCropBox(true, true);
	          }
	        }
	
	        break;
	
	      // No default
	    }
	
	    if (renderable) {
	      cropBoxData.width = width;
	      cropBoxData.height = height;
	      cropBoxData.left = left;
	      cropBoxData.top = top;
	      self.action = action;
	
	      self.renderCropBox();
	    }
	
	    // Override
	    self.startX = self.endX;
	    self.startY = self.endY;
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	exports.default = {
	  // Show the crop box manually
	  crop: function crop() {
	    var self = this;
	
	    if (self.ready && !self.disabled) {
	      if (!self.cropped) {
	        self.cropped = true;
	        self.limitCropBox(true, true);
	
	        if (self.options.modal) {
	          $.addClass(self.dragBox, 'cropper-modal');
	        }
	
	        $.removeClass(self.cropBox, 'cropper-hidden');
	      }
	
	      self.setCropBoxData(self.initialCropBoxData);
	    }
	
	    return self;
	  },
	
	
	  // Reset the image and crop box to their initial states
	  reset: function reset() {
	    var self = this;
	
	    if (self.ready && !self.disabled) {
	      self.imageData = $.extend({}, self.initialImageData);
	      self.canvasData = $.extend({}, self.initialCanvasData);
	      self.cropBoxData = $.extend({}, self.initialCropBoxData);
	
	      self.renderCanvas();
	
	      if (self.cropped) {
	        self.renderCropBox();
	      }
	    }
	
	    return self;
	  },
	
	
	  // Clear the crop box
	  clear: function clear() {
	    var self = this;
	
	    if (self.cropped && !self.disabled) {
	      $.extend(self.cropBoxData, {
	        left: 0,
	        top: 0,
	        width: 0,
	        height: 0
	      });
	
	      self.cropped = false;
	      self.renderCropBox();
	
	      self.limitCanvas();
	
	      // Render canvas after crop box rendered
	      self.renderCanvas();
	
	      $.removeClass(self.dragBox, 'cropper-modal');
	      $.addClass(self.cropBox, 'cropper-hidden');
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Replace the image's src and rebuild the cropper
	   *
	   * @param {String} url
	   * @param {Boolean} onlyColorChanged (optional)
	   */
	  replace: function replace(url, onlyColorChanged) {
	    var self = this;
	
	    if (!self.disabled && url) {
	      if (self.isImg) {
	        self.element.src = url;
	      }
	
	      if (onlyColorChanged) {
	        self.url = url;
	        self.image.src = url;
	
	        if (self.ready) {
	          self.image2.src = url;
	
	          $.each(self.previews, function (element) {
	            $.getByTag(element, 'img')[0].src = url;
	          });
	        }
	      } else {
	        if (self.isImg) {
	          self.replaced = true;
	        }
	
	        // Clear previous data
	        self.options.data = null;
	        self.load(url);
	      }
	    }
	
	    return self;
	  },
	
	
	  // Enable (unfreeze) the cropper
	  enable: function enable() {
	    var self = this;
	
	    if (self.ready) {
	      self.disabled = false;
	      $.removeClass(self.cropper, 'cropper-disabled');
	    }
	
	    return self;
	  },
	
	
	  // Disable (freeze) the cropper
	  disable: function disable() {
	    var self = this;
	
	    if (self.ready) {
	      self.disabled = true;
	      $.addClass(self.cropper, 'cropper-disabled');
	    }
	
	    return self;
	  },
	
	
	  // Destroy the cropper and remove the instance from the image
	  destroy: function destroy() {
	    var self = this;
	    var element = self.element;
	    var image = self.image;
	
	    if (self.loaded) {
	      if (self.isImg && self.replaced) {
	        element.src = self.originalUrl;
	      }
	
	      self.unbuild();
	      $.removeClass(element, 'cropper-hidden');
	    } else if (self.isImg) {
	      $.removeListener(element, 'load', self.start);
	    } else if (image) {
	      $.removeChild(image);
	    }
	
	    $.removeData(element, 'cropper');
	
	    return self;
	  },
	
	
	  /**
	   * Move the canvas with relative offsets
	   *
	   * @param {Number} offsetX
	   * @param {Number} offsetY (optional)
	   */
	  move: function move(offsetX, offsetY) {
	    var self = this;
	    var canvasData = self.canvasData;
	
	    return self.moveTo($.isUndefined(offsetX) ? offsetX : canvasData.left + Number(offsetX), $.isUndefined(offsetY) ? offsetY : canvasData.top + Number(offsetY));
	  },
	
	
	  /**
	   * Move the canvas to an absolute point
	   *
	   * @param {Number} x
	   * @param {Number} y (optional)
	   */
	  moveTo: function moveTo(x, y) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var changed = false;
	
	    // If "y" is not present, its default value is "x"
	    if ($.isUndefined(y)) {
	      y = x;
	    }
	
	    x = Number(x);
	    y = Number(y);
	
	    if (self.ready && !self.disabled && self.options.movable) {
	      if ($.isNumber(x)) {
	        canvasData.left = x;
	        changed = true;
	      }
	
	      if ($.isNumber(y)) {
	        canvasData.top = y;
	        changed = true;
	      }
	
	      if (changed) {
	        self.renderCanvas(true);
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Zoom the canvas with a relative ratio
	   *
	   * @param {Number} ratio
	   * @param {Event} _originalEvent (private)
	   */
	  zoom: function zoom(ratio, _originalEvent) {
	    var self = this;
	    var canvasData = self.canvasData;
	
	    ratio = Number(ratio);
	
	    if (ratio < 0) {
	      ratio = 1 / (1 - ratio);
	    } else {
	      ratio = 1 + ratio;
	    }
	
	    return self.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, _originalEvent);
	  },
	
	
	  /**
	   * Zoom the canvas to an absolute ratio
	   *
	   * @param {Number} ratio
	   * @param {Event} _originalEvent (private)
	   */
	  zoomTo: function zoomTo(ratio, _originalEvent) {
	    var self = this;
	    var options = self.options;
	    var canvasData = self.canvasData;
	    var width = canvasData.width;
	    var height = canvasData.height;
	    var naturalWidth = canvasData.naturalWidth;
	    var naturalHeight = canvasData.naturalHeight;
	    var newWidth = void 0;
	    var newHeight = void 0;
	    var offset = void 0;
	    var center = void 0;
	
	    ratio = Number(ratio);
	
	    if (ratio >= 0 && self.ready && !self.disabled && options.zoomable) {
	      newWidth = naturalWidth * ratio;
	      newHeight = naturalHeight * ratio;
	
	      if ($.dispatchEvent(self.element, 'zoom', {
	        originalEvent: _originalEvent,
	        oldRatio: width / naturalWidth,
	        ratio: newWidth / naturalWidth
	      }) === false) {
	        return self;
	      }
	
	      if (_originalEvent) {
	        offset = $.getOffset(self.cropper);
	        center = _originalEvent.touches ? $.getTouchesCenter(_originalEvent.touches) : {
	          pageX: _originalEvent.pageX,
	          pageY: _originalEvent.pageY
	        };
	
	        // Zoom from the triggering point of the event
	        canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
	        canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
	      } else {
	        // Zoom from the center of the canvas
	        canvasData.left -= (newWidth - width) / 2;
	        canvasData.top -= (newHeight - height) / 2;
	      }
	
	      canvasData.width = newWidth;
	      canvasData.height = newHeight;
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Rotate the canvas with a relative degree
	   *
	   * @param {Number} degree
	   */
	  rotate: function rotate(degree) {
	    var self = this;
	
	    return self.rotateTo((self.imageData.rotate || 0) + Number(degree));
	  },
	
	
	  /**
	   * Rotate the canvas to an absolute degree
	   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
	   *
	   * @param {Number} degree
	   */
	  rotateTo: function rotateTo(degree) {
	    var self = this;
	
	    degree = Number(degree);
	
	    if ($.isNumber(degree) && self.ready && !self.disabled && self.options.rotatable) {
	      self.imageData.rotate = degree % 360;
	      self.rotated = true;
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Scale the image
	   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
	   *
	   * @param {Number} scaleX
	   * @param {Number} scaleY (optional)
	   */
	  scale: function scale(scaleX, scaleY) {
	    var self = this;
	    var imageData = self.imageData;
	    var changed = false;
	
	    // If "scaleY" is not present, its default value is "scaleX"
	    if ($.isUndefined(scaleY)) {
	      scaleY = scaleX;
	    }
	
	    scaleX = Number(scaleX);
	    scaleY = Number(scaleY);
	
	    if (self.ready && !self.disabled && self.options.scalable) {
	      if ($.isNumber(scaleX)) {
	        imageData.scaleX = scaleX;
	        changed = true;
	      }
	
	      if ($.isNumber(scaleY)) {
	        imageData.scaleY = scaleY;
	        changed = true;
	      }
	
	      if (changed) {
	        self.renderImage(true);
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Scale the abscissa of the image
	   *
	   * @param {Number} scaleX
	   */
	  scaleX: function scaleX(_scaleX) {
	    var self = this;
	    var scaleY = self.imageData.scaleY;
	
	    return self.scale(_scaleX, $.isNumber(scaleY) ? scaleY : 1);
	  },
	
	
	  /**
	   * Scale the ordinate of the image
	   *
	   * @param {Number} scaleY
	   */
	  scaleY: function scaleY(_scaleY) {
	    var self = this;
	    var scaleX = self.imageData.scaleX;
	
	    return self.scale($.isNumber(scaleX) ? scaleX : 1, _scaleY);
	  },
	
	
	  /**
	   * Get the cropped area position and size data (base on the original image)
	   *
	   * @param {Boolean} rounded (optional)
	   * @return {Object} data
	   */
	  getData: function getData(rounded) {
	    var self = this;
	    var options = self.options;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var ratio = void 0;
	    var data = void 0;
	
	    if (self.ready && self.cropped) {
	      data = {
	        x: cropBoxData.left - canvasData.left,
	        y: cropBoxData.top - canvasData.top,
	        width: cropBoxData.width,
	        height: cropBoxData.height
	      };
	
	      ratio = imageData.width / imageData.naturalWidth;
	
	      $.each(data, function (n, i) {
	        n /= ratio;
	        data[i] = rounded ? Math.round(n) : n;
	      });
	    } else {
	      data = {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      };
	    }
	
	    if (options.rotatable) {
	      data.rotate = imageData.rotate || 0;
	    }
	
	    if (options.scalable) {
	      data.scaleX = imageData.scaleX || 1;
	      data.scaleY = imageData.scaleY || 1;
	    }
	
	    return data;
	  },
	
	
	  /**
	   * Set the cropped area position and size with new data
	   *
	   * @param {Object} data
	   */
	  setData: function setData(data) {
	    var self = this;
	    var options = self.options;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = {};
	    var rotated = void 0;
	    var scaled = void 0;
	    var ratio = void 0;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && !self.disabled && $.isPlainObject(data)) {
	      if (options.rotatable) {
	        if ($.isNumber(data.rotate) && data.rotate !== imageData.rotate) {
	          imageData.rotate = data.rotate;
	          self.rotated = rotated = true;
	        }
	      }
	
	      if (options.scalable) {
	        if ($.isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
	          imageData.scaleX = data.scaleX;
	          scaled = true;
	        }
	
	        if ($.isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
	          imageData.scaleY = data.scaleY;
	          scaled = true;
	        }
	      }
	
	      if (rotated) {
	        self.renderCanvas();
	      } else if (scaled) {
	        self.renderImage();
	      }
	
	      ratio = imageData.width / imageData.naturalWidth;
	
	      if ($.isNumber(data.x)) {
	        cropBoxData.left = data.x * ratio + canvasData.left;
	      }
	
	      if ($.isNumber(data.y)) {
	        cropBoxData.top = data.y * ratio + canvasData.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        cropBoxData.width = data.width * ratio;
	      }
	
	      if ($.isNumber(data.height)) {
	        cropBoxData.height = data.height * ratio;
	      }
	
	      self.setCropBoxData(cropBoxData);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get the container size data
	   *
	   * @return {Object} data
	   */
	  getContainerData: function getContainerData() {
	    var self = this;
	
	    return self.ready ? self.containerData : {};
	  },
	
	
	  /**
	   * Get the image position and size data
	   *
	   * @return {Object} data
	   */
	  getImageData: function getImageData() {
	    var self = this;
	
	    return self.loaded ? self.imageData : {};
	  },
	
	
	  /**
	   * Get the canvas position and size data
	   *
	   * @return {Object} data
	   */
	  getCanvasData: function getCanvasData() {
	    var self = this;
	    var canvasData = self.canvasData;
	    var data = {};
	
	    if (self.ready) {
	      $.each(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
	        data[n] = canvasData[n];
	      });
	    }
	
	    return data;
	  },
	
	
	  /**
	   * Set the canvas position and size with new data
	   *
	   * @param {Object} data
	   */
	  setCanvasData: function setCanvasData(data) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var aspectRatio = canvasData.aspectRatio;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && !self.disabled && $.isPlainObject(data)) {
	      if ($.isNumber(data.left)) {
	        canvasData.left = data.left;
	      }
	
	      if ($.isNumber(data.top)) {
	        canvasData.top = data.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        canvasData.width = data.width;
	        canvasData.height = data.width / aspectRatio;
	      } else if ($.isNumber(data.height)) {
	        canvasData.height = data.height;
	        canvasData.width = data.height * aspectRatio;
	      }
	
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get the crop box position and size data
	   *
	   * @return {Object} data
	   */
	  getCropBoxData: function getCropBoxData() {
	    var self = this;
	    var cropBoxData = self.cropBoxData;
	    var data = void 0;
	
	    if (self.ready && self.cropped) {
	      data = {
	        left: cropBoxData.left,
	        top: cropBoxData.top,
	        width: cropBoxData.width,
	        height: cropBoxData.height
	      };
	    }
	
	    return data || {};
	  },
	
	
	  /**
	   * Set the crop box position and size with new data
	   *
	   * @param {Object} data
	   */
	  setCropBoxData: function setCropBoxData(data) {
	    var self = this;
	    var cropBoxData = self.cropBoxData;
	    var aspectRatio = self.options.aspectRatio;
	    var widthChanged = void 0;
	    var heightChanged = void 0;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && self.cropped && !self.disabled && $.isPlainObject(data)) {
	      if ($.isNumber(data.left)) {
	        cropBoxData.left = data.left;
	      }
	
	      if ($.isNumber(data.top)) {
	        cropBoxData.top = data.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        widthChanged = true;
	        cropBoxData.width = data.width;
	      }
	
	      if ($.isNumber(data.height)) {
	        heightChanged = true;
	        cropBoxData.height = data.height;
	      }
	
	      if (aspectRatio) {
	        if (widthChanged) {
	          cropBoxData.height = cropBoxData.width / aspectRatio;
	        } else if (heightChanged) {
	          cropBoxData.width = cropBoxData.height * aspectRatio;
	        }
	      }
	
	      self.renderCropBox();
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get a canvas drawn the cropped image
	   *
	   * @param {Object} options (optional)
	   * @return {HTMLCanvasElement} canvas
	   */
	  getCroppedCanvas: function getCroppedCanvas(options) {
	    var self = this;
	
	    if (!self.ready || !window.HTMLCanvasElement) {
	      return null;
	    }
	
	    // Return the whole canvas if not cropped
	    if (!self.cropped) {
	      return $.getSourceCanvas(self.image, self.imageData);
	    }
	
	    if (!$.isPlainObject(options)) {
	      options = {};
	    }
	
	    var data = self.getData();
	    var originalWidth = data.width;
	    var originalHeight = data.height;
	    var aspectRatio = originalWidth / originalHeight;
	    var scaledWidth = void 0;
	    var scaledHeight = void 0;
	    var scaledRatio = void 0;
	
	    if ($.isPlainObject(options)) {
	      scaledWidth = options.width;
	      scaledHeight = options.height;
	
	      if (scaledWidth) {
	        scaledHeight = scaledWidth / aspectRatio;
	        scaledRatio = scaledWidth / originalWidth;
	      } else if (scaledHeight) {
	        scaledWidth = scaledHeight * aspectRatio;
	        scaledRatio = scaledHeight / originalHeight;
	      }
	    }
	
	    // The canvas element will use `Math.floor` on a float number, so floor first
	    var canvasWidth = Math.floor(scaledWidth || originalWidth);
	    var canvasHeight = Math.floor(scaledHeight || originalHeight);
	
	    var canvas = $.createElement('canvas');
	    var context = canvas.getContext('2d');
	
	    canvas.width = canvasWidth;
	    canvas.height = canvasHeight;
	
	    if (options.fillColor) {
	      context.fillStyle = options.fillColor;
	      context.fillRect(0, 0, canvasWidth, canvasHeight);
	    }
	
	    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	    var parameters = function () {
	      var source = $.getSourceCanvas(self.image, self.imageData);
	      var sourceWidth = source.width;
	      var sourceHeight = source.height;
	      var canvasData = self.canvasData;
	      var params = [source];
	
	      // Source canvas
	      var srcX = data.x + canvasData.naturalWidth * (Math.abs(data.scaleX || 1) - 1) / 2;
	      var srcY = data.y + canvasData.naturalHeight * (Math.abs(data.scaleY || 1) - 1) / 2;
	      var srcWidth = void 0;
	      var srcHeight = void 0;
	
	      // Destination canvas
	      var dstX = void 0;
	      var dstY = void 0;
	      var dstWidth = void 0;
	      var dstHeight = void 0;
	
	      if (srcX <= -originalWidth || srcX > sourceWidth) {
	        srcX = srcWidth = dstX = dstWidth = 0;
	      } else if (srcX <= 0) {
	        dstX = -srcX;
	        srcX = 0;
	        srcWidth = dstWidth = Math.min(sourceWidth, originalWidth + srcX);
	      } else if (srcX <= sourceWidth) {
	        dstX = 0;
	        srcWidth = dstWidth = Math.min(originalWidth, sourceWidth - srcX);
	      }
	
	      if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
	        srcY = srcHeight = dstY = dstHeight = 0;
	      } else if (srcY <= 0) {
	        dstY = -srcY;
	        srcY = 0;
	        srcHeight = dstHeight = Math.min(sourceHeight, originalHeight + srcY);
	      } else if (srcY <= sourceHeight) {
	        dstY = 0;
	        srcHeight = dstHeight = Math.min(originalHeight, sourceHeight - srcY);
	      }
	
	      params.push(Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight));
	
	      // Scale destination sizes
	      if (scaledRatio) {
	        dstX *= scaledRatio;
	        dstY *= scaledRatio;
	        dstWidth *= scaledRatio;
	        dstHeight *= scaledRatio;
	      }
	
	      // Avoid "IndexSizeError" in IE and Firefox
	      if (dstWidth > 0 && dstHeight > 0) {
	        params.push(Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
	      }
	
	      return params;
	    }();
	
	    context.drawImage.apply(context, _toConsumableArray(parameters));
	
	    return canvas;
	  },
	
	
	  /**
	   * Change the aspect ratio of the crop box
	   *
	   * @param {Number} aspectRatio
	   */
	  setAspectRatio: function setAspectRatio(aspectRatio) {
	    var self = this;
	    var options = self.options;
	
	    if (!self.disabled && !$.isUndefined(aspectRatio)) {
	      // 0 -> NaN
	      options.aspectRatio = Math.max(0, aspectRatio) || NaN;
	
	      if (self.ready) {
	        self.initCropBox();
	
	        if (self.cropped) {
	          self.renderCropBox();
	        }
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Change the drag mode
	   *
	   * @param {String} mode (optional)
	   */
	  setDragMode: function setDragMode(mode) {
	    var self = this;
	    var options = self.options;
	    var dragBox = self.dragBox;
	    var face = self.face;
	    var croppable = void 0;
	    var movable = void 0;
	
	    if (self.loaded && !self.disabled) {
	      croppable = mode === 'crop';
	      movable = options.movable && mode === 'move';
	      mode = croppable || movable ? mode : 'none';
	
	      $.setData(dragBox, 'action', mode);
	      $.toggleClass(dragBox, 'cropper-crop', croppable);
	      $.toggleClass(dragBox, 'cropper-move', movable);
	
	      if (!options.cropBoxMovable) {
	        // Sync drag mode to crop box when it is not movable
	        $.setData(face, 'action', mode);
	        $.toggleClass(face, 'cropper-crop', croppable);
	        $.toggleClass(face, 'cropper-move', movable);
	      }
	    }
	
	    return self;
	  }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cropper.js.map
!function(e,t){"object"==typeof exports?module.exports=t(require("angular")):"function"==typeof define&&define.amd?define(["angular"],t):t(e.angular)}(this,function(angular){/**
 * AngularJS Google Maps Ver. 1.17.7
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014, 2015, 1016 Allen Kim
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
return angular.module("ngMap",[]),function(){"use strict";var e,t=function(t,n,o,i,a,r,s){e=a;var p=this;p.mapOptions,p.mapEvents,p.eventListeners,p.addObject=function(e,t){if(p.map){p.map[e]=p.map[e]||{};var n=Object.keys(p.map[e]).length;p.map[e][t.id||n]=t,p.map instanceof google.maps.Map&&("infoWindows"!=e&&t.setMap&&t.setMap&&t.setMap(p.map),t.centered&&t.position&&p.map.setCenter(t.position),"markers"==e&&p.objectChanged("markers"),"customMarkers"==e&&p.objectChanged("customMarkers"))}},p.deleteObject=function(e,t){if(t.map){var n=t.map[e];for(var o in n)n[o]===t&&(google.maps.event.clearInstanceListeners(t),delete n[o]);t.map&&t.setMap&&t.setMap(null),"markers"==e&&p.objectChanged("markers"),"customMarkers"==e&&p.objectChanged("customMarkers")}},p.observeAttrSetObj=function(t,n,o){if(n.noWatcher)return!1;for(var i=e.getAttrsToObserve(t),a=0;a<i.length;a++){var s=i[a];n.$observe(s,r.observeAndSet(s,o))}},p.zoomToIncludeMarkers=function(){if(null!=p.map.markers&&Object.keys(p.map.markers).length>0||null!=p.map.customMarkers&&Object.keys(p.map.customMarkers).length>0){var e=new google.maps.LatLngBounds;for(var t in p.map.markers)e.extend(p.map.markers[t].getPosition());for(var n in p.map.customMarkers)e.extend(p.map.customMarkers[n].getPosition());p.mapOptions.maximumZoom&&(p.enableMaximumZoomCheck=!0),p.map.fitBounds(e)}},p.objectChanged=function(e){!p.map||"markers"!=e&&"customMarkers"!=e||"auto"!=p.map.zoomToIncludeMarkers||p.zoomToIncludeMarkers()},p.initializeMap=function(){var a=p.mapOptions,u=p.mapEvents,l=p.map;if(p.map=s.getMapInstance(n[0]),r.setStyle(n[0]),l){var g=e.filter(o),d=e.getOptions(g),m=e.getControlOptions(g);a=angular.extend(d,m);for(var f in l){var v=l[f];if("object"==typeof v)for(var y in v)p.addObject(f,v[y])}p.map.showInfoWindow=p.showInfoWindow,p.map.hideInfoWindow=p.hideInfoWindow}a.zoom=a.zoom||15;var h=a.center;if(!a.center||"string"==typeof h&&h.match(/\{\{.*\}\}/))a.center=new google.maps.LatLng(0,0);else if("string"==typeof h&&h.match(/[0-9.-]*,[0-9.-]*/))a.center=new google.maps.LatLng(h);else if(!(h instanceof google.maps.LatLng)){var M=a.center;delete a.center,r.getGeoLocation(M,a.geoLocationOptions).then(function(e){p.map.setCenter(e);var n=a.geoCallback;n&&i(n)(t)},function(){a.geoFallbackCenter&&p.map.setCenter(a.geoFallbackCenter)})}p.map.setOptions(a);for(var b in u){var O=u[b],w=google.maps.event.addListener(p.map,b,O);p.eventListeners[b]=w}p.observeAttrSetObj(c,o,p.map),p.singleInfoWindow=a.singleInfoWindow,google.maps.event.trigger(p.map,"resize"),google.maps.event.addListenerOnce(p.map,"idle",function(){r.addMap(p),a.zoomToIncludeMarkers&&p.zoomToIncludeMarkers(),t.map=p.map,t.$emit("mapInitialized",p.map),o.mapInitialized&&i(o.mapInitialized)(t,{map:p.map})}),a.zoomToIncludeMarkers&&a.maximumZoom&&google.maps.event.addListener(p.map,"zoom_changed",function(){1==p.enableMaximumZoomCheck&&(p.enableMaximumZoomCheck=!1,google.maps.event.addListenerOnce(p.map,"bounds_changed",function(){p.map.setZoom(Math.min(a.maximumZoom,p.map.getZoom()))}))})},t.google=google;var c=e.orgAttributes(n),u=e.filter(o),l=e.getOptions(u,{scope:t}),g=e.getControlOptions(u),d=angular.extend(l,g),m=e.getEvents(t,u);if(Object.keys(m).length&&void 0,p.mapOptions=d,p.mapEvents=m,p.eventListeners={},l.lazyInit){if(o.id&&0===o.id.indexOf("{{",0)&&-1!==o.id.indexOf("}}",o.id.length-"}}".length))var f=o.id.slice(2,-2),v=i(f)(t);else var v=o.id;p.map={id:v},r.addMap(p)}else p.initializeMap();l.triggerResize&&google.maps.event.trigger(p.map,"resize"),n.bind("$destroy",function(){s.returnMapInstance(p.map),r.deleteMap(p)})};t.$inject=["$scope","$element","$attrs","$parse","Attr2MapOptions","NgMap","NgMapPool"],angular.module("ngMap").controller("__MapController",t)}(),function(){"use strict";var e,t=function(t,o,i,a){a=a[0]||a[1];var r=e.orgAttributes(o),s=e.filter(i),p=e.getOptions(s,{scope:t}),c=e.getEvents(t,s),u=n(p,c);a.addObject("bicyclingLayers",u),a.observeAttrSetObj(r,i,u),o.bind("$destroy",function(){a.deleteObject("bicyclingLayers",u)})},n=function(e,t){var n=new google.maps.BicyclingLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n},o=function(n){return e=n,{restrict:"E",require:["?^map","?^ngMap"],link:t}};o.$inject=["Attr2MapOptions"],angular.module("ngMap").directive("bicyclingLayer",o)}(),function(){"use strict";var e,t,n,o=function(n,o,i,a){a=a[0]||a[1];var r=e.filter(i),s=e.getOptions(r,{scope:n}),p=e.getEvents(n,r),c=o[0].parentElement.removeChild(o[0]);t(c.innerHTML.trim())(n);for(var u in p)google.maps.event.addDomListener(c,u,p[u]);a.addObject("customControls",c);var l=s.position;a.map.controls[google.maps.ControlPosition[l]].push(c),o.bind("$destroy",function(){a.deleteObject("customControls",c)})},i=function(i,a,r){return e=i,t=a,n=r,{restrict:"E",require:["?^map","?^ngMap"],link:o}};i.$inject=["Attr2MapOptions","$compile","NgMap"],angular.module("ngMap").directive("customControl",i)}(),function(){"use strict";var e,t,n,o,i=function(e){e=e||{},this.el=document.createElement("div"),this.el.style.display="inline-block",this.el.style.visibility="hidden",this.visible=!0;for(var t in e)this[t]=e[t]},a=function(){i.prototype=new google.maps.OverlayView,i.prototype.setContent=function(e,t){this.el.innerHTML=e,this.el.style.position="absolute",t&&n(angular.element(this.el).contents())(t)},i.prototype.getDraggable=function(){return this.draggable},i.prototype.setDraggable=function(e){this.draggable=e},i.prototype.getPosition=function(){return this.position},i.prototype.setPosition=function(e){if(e&&(this.position=e),this.getProjection()&&"function"==typeof this.position.lng){var n=this,o=function(){var e=n.getProjection().fromLatLngToDivPixel(n.position),t=Math.round(e.x-n.el.offsetWidth/2),o=Math.round(e.y-n.el.offsetHeight-10);n.el.style.left=t+"px",n.el.style.top=o+"px",n.el.style.visibility="visible"};n.el.offsetWidth&&n.el.offsetHeight?o():t(o,300)}},i.prototype.setZIndex=function(e){e&&(this.zIndex=e),this.el.style.zIndex=this.zIndex},i.prototype.getVisible=function(){return this.visible},i.prototype.setVisible=function(e){this.el.style.display=e?"inline-block":"none",this.visible=e},i.prototype.addClass=function(e){var t=this.el.className.trim().split(" ");-1==t.indexOf(e)&&t.push(e),this.el.className=t.join(" ")},i.prototype.removeClass=function(e){var t=this.el.className.split(" "),n=t.indexOf(e);n>-1&&t.splice(n,1),this.el.className=t.join(" ")},i.prototype.onAdd=function(){this.getPanes().overlayMouseTarget.appendChild(this.el)},i.prototype.draw=function(){this.setPosition(),this.setZIndex(this.zIndex),this.setVisible(this.visible)},i.prototype.onRemove=function(){this.el.parentNode.removeChild(this.el)}},r=function(n,a){return function(r,s,p,c){c=c[0]||c[1];var u=e.orgAttributes(s),l=e.filter(p),g=e.getOptions(l,{scope:r}),d=e.getEvents(r,l);s[0].style.display="none";var m=new i(g);t(function(){r.$watch("["+a.join(",")+"]",function(){m.setContent(n,r)},!0),m.setContent(s[0].innerHTML,r);var e=s[0].firstElementChild.className;m.addClass("custom-marker"),m.addClass(e),g.position instanceof google.maps.LatLng||o.getGeoLocation(g.position).then(function(e){m.setPosition(e)})});for(var f in d)google.maps.event.addDomListener(m.el,f,d[f]);c.addObject("customMarkers",m),c.observeAttrSetObj(u,p,m),s.bind("$destroy",function(){c.deleteObject("customMarkers",m)})}},s=function(i,s,p,c){return e=p,t=i,n=s,o=c,{restrict:"E",require:["?^map","?^ngMap"],compile:function(e){a(),e[0].style.display="none";var t=e.html(),n=t.match(/{{([^}]+)}}/g),o=[];return(n||[]).forEach(function(e){var t=e.replace("{{","").replace("}}","");-1==e.indexOf("::")&&-1==e.indexOf("this.")&&-1==o.indexOf(t)&&o.push(e.replace("{{","").replace("}}",""))}),r(t,o)}}};s.$inject=["$timeout","$compile","Attr2MapOptions","NgMap"],angular.module("ngMap").directive("customMarker",s)}(),function(){"use strict";var e,t,n,o=function(e,t){e.panel&&(e.panel=document.getElementById(e.panel)||document.querySelector(e.panel));var n=new google.maps.DirectionsRenderer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n},i=function(e,o){var i=new google.maps.DirectionsService,a=o;a.travelMode=a.travelMode||"DRIVING";var r=["origin","destination","travelMode","transitOptions","unitSystem","durationInTraffic","waypoints","optimizeWaypoints","provideRouteAlternatives","avoidHighways","avoidTolls","region"];for(var s in a)-1===r.indexOf(s)&&delete a[s];a.waypoints&&("[]"==a.waypoints||""===a.waypoints)&&delete a.waypoints;var p=function(n){i.route(n,function(n,o){o==google.maps.DirectionsStatus.OK&&t(function(){e.setDirections(n)})})};a.origin&&a.destination&&("current-location"==a.origin?n.getCurrentPosition().then(function(e){a.origin=new google.maps.LatLng(e.coords.latitude,e.coords.longitude),p(a)}):"current-location"==a.destination?n.getCurrentPosition().then(function(e){a.destination=new google.maps.LatLng(e.coords.latitude,e.coords.longitude),p(a)}):p(a))},a=function(a,r,s,p){var c=a;e=p,t=r,n=s;var u=function(n,a,r,s){s=s[0]||s[1];var p=c.orgAttributes(a),u=c.filter(r),l=c.getOptions(u,{scope:n}),g=c.getEvents(n,u),d=c.getAttrsToObserve(p),m=o(l,g);s.addObject("directionsRenderers",m),d.forEach(function(e){!function(e){r.$observe(e,function(n){if("panel"==e)t(function(){var e=document.getElementById(n)||document.querySelector(n);e&&m.setPanel(e)});else if(l[e]!==n){var o=c.toOptionValue(n,{key:e});l[e]=o,i(m,l)}})}(e)}),e.getMap().then(function(){i(m,l)}),a.bind("$destroy",function(){s.deleteObject("directionsRenderers",m)})};return{restrict:"E",require:["?^map","?^ngMap"],link:u}};a.$inject=["Attr2MapOptions","$timeout","NavigatorGeolocation","NgMap"],angular.module("ngMap").directive("directions",a)}(),function(){"use strict";angular.module("ngMap").directive("drawingManager",["Attr2MapOptions",function(e){var t=e;return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,n,o,i){i=i[0]||i[1];var a=t.filter(o),r=t.getOptions(a,{scope:e}),s=t.getControlOptions(a),p=t.getEvents(e,a),c=new google.maps.drawing.DrawingManager({drawingMode:r.drawingmode,drawingControl:r.drawingcontrol,drawingControlOptions:s.drawingControlOptions,circleOptions:r.circleoptions,markerOptions:r.markeroptions,polygonOptions:r.polygonoptions,polylineOptions:r.polylineoptions,rectangleOptions:r.rectangleoptions});o.$observe("drawingControlOptions",function(e){c.drawingControlOptions=t.getControlOptions({drawingControlOptions:e}).drawingControlOptions,c.setDrawingMode(null),c.setMap(i.map)});for(var u in p)google.maps.event.addListener(c,u,p[u]);i.addObject("mapDrawingManager",c),n.bind("$destroy",function(){i.deleteObject("mapDrawingManager",c)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("dynamicMapsEngineLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.DynamicMapsEngineLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.filter(i),s=t.getOptions(r,{scope:e}),p=t.getEvents(e,r,p),c=n(s,p);a.addObject("mapsEngineLayers",c)}}}])}(),function(){"use strict";angular.module("ngMap").directive("fusionTablesLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.FusionTablesLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.filter(i),s=t.getOptions(r,{scope:e}),p=t.getEvents(e,r,p),c=n(s,p);a.addObject("fusionTablesLayers",c)}}}])}(),function(){"use strict";angular.module("ngMap").directive("heatmapLayer",["Attr2MapOptions","$window",function(e,t){var n=e;return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=n.filter(i),s=n.getOptions(r,{scope:e});if(s.data=t[i.data]||e[i.data],!(s.data instanceof Array))throw"invalid heatmap data";s.data=new google.maps.MVCArray(s.data);{var p=new google.maps.visualization.HeatmapLayer(s);n.getEvents(e,r)}a.addObject("heatmapLayers",p)}}}])}(),function(){"use strict";var e=function(e,t,n,o,i,a,r){var s=e,p=function(e,a,r){var s;!e.position||e.position instanceof google.maps.LatLng||delete e.position,s=new google.maps.InfoWindow(e);for(var p in a)p&&google.maps.event.addListener(s,p,a[p]);var c=n(function(e){angular.isString(r)?o(r).then(function(t){e(angular.element(t).wrap("<div>").parent())},function(e){throw"info-window template request failed: "+e}):e(r)}).then(function(e){var t=e.html().trim();if(1!=angular.element(t).length)throw"info-window working as a template must have a container";s.__template=t.replace(/\s?ng-non-bindable[='"]+/,"")});return s.__open=function(e,n,o){c.then(function(){i(function(){o&&(n.anchor=o);var i=t(s.__template)(n);s.setContent(i[0]),n.$apply(),o&&o.getPosition?s.open(e,o):o&&o instanceof google.maps.LatLng?(s.open(e),s.setPosition(o)):s.open(e);var a=s.content.parentElement.parentElement.parentElement;a.className="ng-map-info-window"})})},s},c=function(e,t,n,o){o=o[0]||o[1],t.css("display","none");var i,c=s.orgAttributes(t),u=s.filter(n),l=s.getOptions(u,{scope:e}),g=s.getEvents(e,u),d=p(l,g,l.template||t);!l.position||l.position instanceof google.maps.LatLng||(i=l.position),i&&r.getGeoLocation(i).then(function(t){d.setPosition(t),d.__open(o.map,e,t);var i=n.geoCallback;i&&a(i)(e)}),o.addObject("infoWindows",d),o.observeAttrSetObj(c,n,d),o.showInfoWindow=o.map.showInfoWindow=o.showInfoWindow||function(t,n,i){var a="string"==typeof t?t:n,r="string"==typeof t?n:i;if("string"==typeof r)if("undefined"!=typeof o.map.markers&&"undefined"!=typeof o.map.markers[r])r=o.map.markers[r];else{if("undefined"==typeof o.map.customMarkers[r])throw new Error("Cant open info window for id "+r+". Marker or CustomMarker is not defined");r=o.map.customMarkers[r]}var s=o.map.infoWindows[a],p=r?r:this.getPosition?this:null;s.__open(o.map,e,p),o.singleInfoWindow&&(o.lastInfoWindow&&e.hideInfoWindow(o.lastInfoWindow),o.lastInfoWindow=a)},o.hideInfoWindow=o.map.hideInfoWindow=o.hideInfoWindow||function(e,t){var n="string"==typeof e?e:t,i=o.map.infoWindows[n];i.close()},e.showInfoWindow=o.map.showInfoWindow,e.hideInfoWindow=o.map.hideInfoWindow;var m=d.mapId?{id:d.mapId}:0;r.getMap(m).then(function(t){if(d.visible&&d.__open(t,e),d.visibleOnMarker){var n=d.visibleOnMarker;d.__open(t,e,t.markers[n])}})};return{restrict:"E",require:["?^map","?^ngMap"],link:c}};e.$inject=["Attr2MapOptions","$compile","$q","$templateRequest","$timeout","$parse","NgMap"],angular.module("ngMap").directive("infoWindow",e)}(),function(){"use strict";angular.module("ngMap").directive("kmlLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.KmlLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.orgAttributes(o),s=t.filter(i),p=t.getOptions(s,{scope:e}),c=t.getEvents(e,s),u=n(p,c);a.addObject("kmlLayers",u),a.observeAttrSetObj(r,i,u),o.bind("$destroy",function(){a.deleteObject("kmlLayers",u)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("mapData",["Attr2MapOptions","NgMap",function(e,t){var n=e;return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i){var a=n.filter(i),r=n.getOptions(a,{scope:e}),s=n.getEvents(e,a,s);t.getMap().then(function(t){for(var n in r){var o=r[n];"function"==typeof e[o]?t.data[n](e[o]):t.data[n](o)}for(var i in s)t.data.addListener(i,s[i])})}}}])}(),function(){"use strict";var e,t,n,o=[],i=[],a=function(n,a,r){var s=r.mapLazyLoadParams||r.mapLazyLoad;if(void 0===window.google||void 0===window.google.maps){i.push({scope:n,element:a,savedHtml:o[i.length]}),window.lazyLoadCallback=function(){e(function(){i.forEach(function(e){e.element.html(e.savedHtml),t(e.element.contents())(e.scope)})},100)};var p=document.createElement("script");p.src=s+(s.indexOf("?")>-1?"&":"?")+"callback=lazyLoadCallback",document.querySelector('script[src="'+p.src+'"]')||document.body.appendChild(p)}else a.html(o),t(a.contents())(n)},r=function(e,t){return!t.mapLazyLoad&&void 0,o.push(e.html()),n=t.mapLazyLoad,void 0!==window.google&&void 0!==window.google.maps?!1:(e.html(""),{pre:a})},s=function(n,o){return t=n,e=o,{compile:r}};s.$inject=["$compile","$timeout"],angular.module("ngMap").directive("mapLazyLoad",s)}(),function(){"use strict";angular.module("ngMap").directive("mapType",["$parse","NgMap",function(e,t){return{restrict:"E",require:["?^map","?^ngMap"],link:function(n,o,i,a){a=a[0]||a[1];var r,s=i.name;if(!s)throw"invalid map-type name";if(r=e(i.object)(n),!r)throw"invalid map-type object";t.getMap().then(function(e){e.mapTypes.set(s,r)}),a.addObject("mapTypes",r)}}}])}(),function(){"use strict";var e=function(){return{restrict:"AE",controller:"__MapController",controllerAs:"ngmap"}};angular.module("ngMap").directive("map",[e]),angular.module("ngMap").directive("ngMap",[e])}(),function(){"use strict";angular.module("ngMap").directive("mapsEngineLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.MapsEngineLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.filter(i),s=t.getOptions(r,{scope:e}),p=t.getEvents(e,r,p),c=n(s,p);a.addObject("mapsEngineLayers",c)}}}])}(),function(){"use strict";var e,t,n,o=function(e,t){var o;if(n.defaultOptions.marker)for(var i in n.defaultOptions.marker)"undefined"==typeof e[i]&&(e[i]=n.defaultOptions.marker[i]);e.position instanceof google.maps.LatLng||(e.position=new google.maps.LatLng(0,0)),o=new google.maps.Marker(e),Object.keys(t).length>0;for(var a in t)a&&google.maps.event.addListener(o,a,t[a]);return o},i=function(i,a,r,s){s=s[0]||s[1];var p,c=e.orgAttributes(a),u=e.filter(r),l=e.getOptions(u,i,{scope:i}),g=e.getEvents(i,u);l.position instanceof google.maps.LatLng||(p=l.position);var d=o(l,g);s.addObject("markers",d),p&&n.getGeoLocation(p).then(function(e){d.setPosition(e),l.centered&&d.map.setCenter(e);var n=r.geoCallback;n&&t(n)(i)}),s.observeAttrSetObj(c,r,d),a.bind("$destroy",function(){s.deleteObject("markers",d)})},a=function(o,a,r){return e=o,t=a,n=r,{restrict:"E",require:["^?map","?^ngMap"],link:i}};a.$inject=["Attr2MapOptions","$parse","NgMap"],angular.module("ngMap").directive("marker",a)}(),function(){"use strict";angular.module("ngMap").directive("overlayMapType",["NgMap",function(e){return{restrict:"E",require:["?^map","?^ngMap"],link:function(t,n,o,i){i=i[0]||i[1];var a=o.initMethod||"insertAt",r=t[o.object];e.getMap().then(function(e){if("insertAt"==a){var t=parseInt(o.index,10);e.overlayMapTypes.insertAt(t,r)}else"push"==a&&e.overlayMapTypes.push(r)}),i.addObject("overlayMapTypes",r)}}}])}(),function(){"use strict";var e=function(e,t){var n=e,o=function(e,o,i,a){if("false"===i.placesAutoComplete)return!1;var r=n.filter(i),s=n.getOptions(r,{scope:e}),p=n.getEvents(e,r),c=new google.maps.places.Autocomplete(o[0],s);for(var u in p)google.maps.event.addListener(c,u,p[u]);var l=function(){t(function(){a&&a.$setViewValue(o.val())},100)};google.maps.event.addListener(c,"place_changed",l),o[0].addEventListener("change",l),i.$observe("types",function(e){if(e){var t=n.toOptionValue(e,{key:"types"});c.setTypes(t)}}),i.$observe("componentRestrictions",function(t){t&&c.setComponentRestrictions(e.$eval(t))})};return{restrict:"A",require:"?ngModel",link:o}};e.$inject=["Attr2MapOptions","$timeout"],angular.module("ngMap").directive("placesAutoComplete",e)}(),function(){"use strict";var e=function(e,t){var n,o=e.name;switch(delete e.name,o){case"circle":e.center instanceof google.maps.LatLng||(e.center=new google.maps.LatLng(0,0)),n=new google.maps.Circle(e);break;case"polygon":n=new google.maps.Polygon(e);break;case"polyline":n=new google.maps.Polyline(e);break;case"rectangle":n=new google.maps.Rectangle(e);break;case"groundOverlay":case"image":var i=e.url,a={opacity:e.opacity,clickable:e.clickable,id:e.id};n=new google.maps.GroundOverlay(i,e.bounds,a)}for(var r in t)t[r]&&google.maps.event.addListener(n,r,t[r]);return n},t=function(t,n,o){var i=t,a=function(t,a,r,s){s=s[0]||s[1];var p,c,u=i.orgAttributes(a),l=i.filter(r),g=i.getOptions(l,{scope:t}),d=i.getEvents(t,l);c=g.name,g.center instanceof google.maps.LatLng||(p=g.center);var m=e(g,d);s.addObject("shapes",m),p&&"circle"==c&&o.getGeoLocation(p).then(function(e){m.setCenter(e),m.centered&&m.map.setCenter(e);var o=r.geoCallback;o&&n(o)(t)}),s.observeAttrSetObj(u,r,m),a.bind("$destroy",function(){s.deleteObject("shapes",m)})};return{restrict:"E",require:["?^map","?^ngMap"],link:a}};t.$inject=["Attr2MapOptions","$parse","NgMap"],angular.module("ngMap").directive("shape",t)}(),function(){"use strict";var e=function(e,t){var n=e,o=function(e,t,n){var o,i;t.container&&(i=document.getElementById(t.container),i=i||document.querySelector(t.container)),i?o=new google.maps.StreetViewPanorama(i,t):(o=e.getStreetView(),o.setOptions(t));for(var a in n)a&&google.maps.event.addListener(o,a,n[a]);return o},i=function(e,i,a){var r=n.filter(a),s=n.getOptions(r,{scope:e}),p=n.getControlOptions(r),c=angular.extend(s,p),u=n.getEvents(e,r);t.getMap().then(function(e){var t=o(e,c,u);e.setStreetView(t),!t.getPosition()&&t.setPosition(e.getCenter()),google.maps.event.addListener(t,"position_changed",function(){t.getPosition()!==e.getCenter()&&e.setCenter(t.getPosition())});var n=google.maps.event.addListener(e,"center_changed",function(){t.setPosition(e.getCenter()),google.maps.event.removeListener(n)})})};return{restrict:"E",require:["?^map","?^ngMap"],link:i}};e.$inject=["Attr2MapOptions","NgMap"],angular.module("ngMap").directive("streetViewPanorama",e)}(),function(){"use strict";angular.module("ngMap").directive("trafficLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.TrafficLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.orgAttributes(o),s=t.filter(i),p=t.getOptions(s,{scope:e}),c=t.getEvents(e,s),u=n(p,c);a.addObject("trafficLayers",u),a.observeAttrSetObj(r,i,u),o.bind("$destroy",function(){a.deleteObject("trafficLayers",u)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("transitLayer",["Attr2MapOptions",function(e){var t=e,n=function(e,t){var n=new google.maps.TransitLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:["?^map","?^ngMap"],link:function(e,o,i,a){a=a[0]||a[1];var r=t.orgAttributes(o),s=t.filter(i),p=t.getOptions(s,{scope:e}),c=t.getEvents(e,s),u=n(p,c);a.addObject("transitLayers",u),a.observeAttrSetObj(r,i,u),o.bind("$destroy",function(){a.deleteObject("transitLayers",u)})}}}])}(),function(){"use strict";var e=/([\:\-\_]+(.))/g,t=/^moz([A-Z])/,n=function(){return function(n){return n.replace(e,function(e,t,n,o){return o?n.toUpperCase():n}).replace(t,"Moz$1")}};angular.module("ngMap").filter("camelCase",n)}(),function(){"use strict";var e=function(){return function(e){try{return JSON.parse(e),e}catch(t){return e.replace(/([\$\w]+)\s*:/g,function(e,t){return'"'+t+'":'}).replace(/'([^']+)'/g,function(e,t){return'"'+t+'"'})}}};angular.module("ngMap").filter("jsonize",e)}(),function(){"use strict";var isoDateRE=/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/,Attr2MapOptions=function($parse,$timeout,$log,NavigatorGeolocation,GeoCoder,camelCaseFilter,jsonizeFilter){var orgAttributes=function(e){e.length>0&&(e=e[0]);for(var t={},n=0;n<e.attributes.length;n++){var o=e.attributes[n];t[o.name]=o.value}return t},getJSON=function(e){var t=/^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/;return e.match(t)&&(e="["+e+"]"),JSON.parse(jsonizeFilter(e))},getLatLng=function(e){var t=e;return e[0].constructor==Array?t=e.map(function(e){return new google.maps.LatLng(e[0],e[1])}):!isNaN(parseFloat(e[0]))&&isFinite(e[0])&&(t=new google.maps.LatLng(t[0],t[1])),t},toOptionValue=function(input,options){var output;try{output=getNumber(input)}catch(err){try{var output=getJSON(input);if(output instanceof Array)output=output[0].constructor==Object?output:getLatLng(output);else if(output===Object(output)){var newOptions=options;newOptions.doNotConverStringToNumber=!0,output=getOptions(output,newOptions)}}catch(err2){if(input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/))try{var exp="new google.maps."+input;output=eval(exp)}catch(e){output=input}else if(input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/))try{var matches=input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);output=google.maps[matches[1]][matches[2]]}catch(e){output=input}else if(input.match(/^[A-Z]+$/))try{var capitalizedKey=options.key.charAt(0).toUpperCase()+options.key.slice(1);options.key.match(/temperatureUnit|windSpeedUnit|labelColor/)?(capitalizedKey=capitalizedKey.replace(/s$/,""),output=google.maps.weather[capitalizedKey][input]):output=google.maps[capitalizedKey][input]}catch(e){output=input}else if(input.match(isoDateRE))try{output=new Date(input)}catch(e){output=input}else if(input.match(/^{/)&&options.scope)try{var expr=input.replace(/{{/,"").replace(/}}/g,"");output=options.scope.$eval(expr)}catch(err){output=input}else output=input}}if(("center"==options.key||"position"==options.key)&&output instanceof Array&&(output=new google.maps.LatLng(output[0],output[1])),"bounds"==options.key&&output instanceof Array&&(output=new google.maps.LatLngBounds(output[0],output[1])),"icons"==options.key&&output instanceof Array)for(var i=0;i<output.length;i++){var el=output[i];el.icon.path.match(/^[A-Z_]+$/)&&(el.icon.path=google.maps.SymbolPath[el.icon.path])}if("icon"==options.key&&output instanceof Object){(""+output.path).match(/^[A-Z_]+$/)&&(output.path=google.maps.SymbolPath[output.path]);for(var key in output){var arr=output[key];"anchor"==key||"origin"==key||"labelOrigin"==key?output[key]=new google.maps.Point(arr[0],arr[1]):("size"==key||"scaledSize"==key)&&(output[key]=new google.maps.Size(arr[0],arr[1]))}}return output},getAttrsToObserve=function(e){var t=[];if(!e.noWatcher)for(var n in e){var o=e[n];o&&o.match(/\{\{.*\}\}/)&&t.push(camelCaseFilter(n))}return t},filter=function(e){var t={};for(var n in e)n.match(/^\$/)||n.match(/^ng[A-Z]/)||(t[n]=e[n]);return t},getOptions=function(e,t){t=t||{};var n={};for(var o in e)if(e[o]||0===e[o]){if(o.match(/^on[A-Z]/))continue;if(o.match(/ControlOptions$/))continue;n[o]="string"!=typeof e[o]?e[o]:t.doNotConverStringToNumber&&e[o].match(/^[0-9]+$/)?e[o]:toOptionValue(e[o],{key:o,scope:t.scope})}return n},getEvents=function(e,t){var n={},o=function(e){return"_"+e.toLowerCase()},i=function(t){var n=t.match(/([^\(]+)\(([^\)]*)\)/),o=n[1],i=n[2].replace(/event[ ,]*/,""),a=$parse("["+i+"]");return function(t){function n(e,t){return e[t]}var i=a(e),r=o.split(".").reduce(n,e);r&&r.apply(this,[t].concat(i)),$timeout(function(){e.$apply()})}};for(var a in t)if(t[a]){if(!a.match(/^on[A-Z]/))continue;var r=a.replace(/^on/,"");r=r.charAt(0).toLowerCase()+r.slice(1),r=r.replace(/([A-Z])/g,o);var s=t[a];n[r]=new i(s)}return n},getControlOptions=function(e){var t={};if("object"!=typeof e)return!1;for(var n in e)if(e[n]){if(!n.match(/(.*)ControlOptions$/))continue;var o=e[n],i=o.replace(/'/g,'"');i=i.replace(/([^"]+)|("[^"]+")/g,function(e,t,n){return t?t.replace(/([a-zA-Z0-9]+?):/g,'"$1":'):n});try{var a=JSON.parse(i);for(var r in a)if(a[r]){var s=a[r];if("string"==typeof s?s=s.toUpperCase():"mapTypeIds"===r&&(s=s.map(function(e){return e.match(/^[A-Z]+$/)?google.maps.MapTypeId[e.toUpperCase()]:e})),"style"===r){var p=n.charAt(0).toUpperCase()+n.slice(1),c=p.replace(/Options$/,"")+"Style";a[r]=google.maps[c][s]}else a[r]="position"===r?google.maps.ControlPosition[s]:s}t[n]=a}catch(u){}}return t};return{filter:filter,getOptions:getOptions,getEvents:getEvents,getControlOptions:getControlOptions,toOptionValue:toOptionValue,getAttrsToObserve:getAttrsToObserve,orgAttributes:orgAttributes}};Attr2MapOptions.$inject=["$parse","$timeout","$log","NavigatorGeolocation","GeoCoder","camelCaseFilter","jsonizeFilter"],angular.module("ngMap").service("Attr2MapOptions",Attr2MapOptions)}(),function(){"use strict";var e,t=function(t){var n=e.defer(),o=new google.maps.Geocoder;return o.geocode(t,function(e,t){t==google.maps.GeocoderStatus.OK?n.resolve(e):n.reject(t)}),n.promise},n=function(n){return e=n,{geocode:t}};n.$inject=["$q"],angular.module("ngMap").service("GeoCoder",n)}(),function(){"use strict";var e,t=function(t){var n=e.defer();return navigator.geolocation?(void 0===t?t={timeout:5e3}:void 0===t.timeout&&(t.timeout=5e3),navigator.geolocation.getCurrentPosition(function(e){n.resolve(e)},function(e){n.reject(e)},t)):n.reject("Browser Geolocation service failed."),n.promise},n=function(n){return e=n,{getCurrentPosition:t}};n.$inject=["$q"],angular.module("ngMap").service("NavigatorGeolocation",n)}(),function(){"use strict";var e,t,n,o=[],i=function(n){var i=t.createElement("div");i.style.width="100%",i.style.height="100%",n.appendChild(i);var a=new e.google.maps.Map(i,{});return o.push(a),a},a=function(e,t){for(var n,i=0;i<o.length;i++){var a=o[i];if(a.id==t&&!a.inUse){var r=a.getDiv();e.appendChild(r),n=a;break}}return n},r=function(e){for(var t,n=0;n<o.length;n++){var i=o[n];if(!i.id&&!i.inUse){var a=i.getDiv();e.appendChild(a),t=i;break}}return t},s=function(e){var t=a(e,e.id)||r(e);return t?n(function(){google.maps.event.trigger(t,"idle")},100):t=i(e),t.inUse=!0,t},p=function(e){e.inUse=!1},c=function(){for(var e=0;e<o.length;e++)o[e]=null;o=[]},u=function(i,a,r){return t=i[0],e=a,n=r,{mapInstances:o,resetMapInstances:c,getMapInstance:s,returnMapInstance:p}};u.$inject=["$document","$window","$timeout"],angular.module("ngMap").factory("NgMapPool",u)}(),function(){"use strict";var e,t,n,o,i,a,r,s={},p=function(n,o){var i;return n.currentStyle?i=n.currentStyle[o]:e.getComputedStyle&&(i=t.defaultView.getComputedStyle(n,null).getPropertyValue(o)),i},c=function(e){var t=s[e||0];return t.map instanceof google.maps.Map?void 0:(t.initializeMap(),t.map)},u=function(t){function o(n){s[t]?i.resolve(s[t].map):n>a?i.reject("could not find map"):e.setTimeout(function(){o(n+100)},100)}t="object"==typeof t?t.id:t,t=t||0;var i=n.defer(),a=2e3;return o(0),i.promise},l=function(e){if(e.map){var t=Object.keys(s).length;s[e.map.id||t]=e}},g=function(e){var t=Object.keys(s).length-1,n=e.map.id||t;if(e.map){for(var o in e.eventListeners){var i=e.eventListeners[o];google.maps.event.removeListener(i)}e.map.controls&&e.map.controls.forEach(function(e){e.clear()})}e.map.heatmapLayers&&Object.keys(e.map.heatmapLayers).forEach(function(t){e.deleteObject("heatmapLayers",e.map.heatmapLayers[t])}),delete s[n]},d=function(e,t){var i=n.defer();return!e||e.match(/^current/i)?o.getCurrentPosition(t).then(function(e){var t=e.coords.latitude,n=e.coords.longitude,o=new google.maps.LatLng(t,n);i.resolve(o)},function(e){i.reject(e)}):a.geocode({address:e}).then(function(e){i.resolve(e[0].geometry.location)},function(e){i.reject(e)}),i.promise},m=function(e,t){return function(n){if(n){var o=r("set-"+e),a=i.toOptionValue(n,{key:e});t[o]&&(e.match(/center|position/)&&"string"==typeof a?d(a).then(function(e){t[o](e)}):t[o](a))}}},f=function(e){var t=e.getAttribute("default-style");"true"==t?(e.style.display="block",e.style.height="300px"):("block"!=p(e,"display")&&(e.style.display="block"),p(e,"height").match(/^(0|auto)/)&&(e.style.height="300px"))};angular.module("ngMap").provider("NgMap",function(){var s={};this.setDefaultOptions=function(e){s=e};var p=function(p,v,y,h,M,b,O){return e=p,t=v[0],n=y,o=h,i=M,a=b,r=O,{defaultOptions:s,addMap:l,deleteMap:g,getMap:u,initMap:c,setStyle:f,getGeoLocation:d,observeAndSet:m}};p.$inject=["$window","$document","$q","NavigatorGeolocation","Attr2MapOptions","GeoCoder","camelCaseFilter"],this.$get=p})}(),function(){"use strict";var e,t=function(t,n){n=n||t.getCenter();var o=e.defer(),i=new google.maps.StreetViewService;return i.getPanoramaByLocation(n||t.getCenter,100,function(e,t){t===google.maps.StreetViewStatus.OK?o.resolve(e.location.pano):o.resolve(!1)
}),o.promise},n=function(e,t){var n=new google.maps.StreetViewPanorama(e.getDiv(),{enableCloseButton:!0});n.setPano(t)},o=function(o){return e=o,{getPanorama:t,setPanorama:n}};o.$inject=["$q"],angular.module("ngMap").service("StreetView",o)}(),"ngMap"});
/**
 * JQuery Organisation Chart Plugin.
 *
 * Author: Mark Lee
 * Copyright (C)2013-2015 Caprica Software Limited
 * http://www.capricasoftware.co.uk
 *
 * Contributions by: Paul Lautman <paul.lautman at gmail.com>
 *
 * This software is licensed under the Creative Commons Attribution-ShareAlike 3.0 License,
 * see here for license terms:
 *
 *     http://creativecommons.org/licenses/by-sa/3.0
 */
(function(a){function p(d,h,g,e,b){var q=a("<table cellpadding='0' cellspacing='0' border='0'/>"),l=a("<tbody/>"),n=a("<tr/>").addClass("nodes"),k=a("<td/>").addClass("node").attr("colspan",2),f=d.children("ul:first").children("li");1<f.length&&k.attr("colspan",2*f.length);var c=d.children("adjunct").eq(0);0<c.length&&(a("<div>").addClass("adjunct node").addClass("level"+g).addClass("node"+e).addClass("level"+g+"-node"+e).append(b.nodeText(c)).appendTo(k),a("<div>").addClass("adjunct-link").appendTo(k),
c.remove());c=a("<h2>").html(b.nodeText(d));c=a("<div>").addClass("node").addClass("level"+g).addClass("node"+e).addClass("level"+g+"-node"+e).append(c);b.copyClasses&&c.addClass(d.attr("class"));b.copyData&&c.data(d.data());b.copyStyles&&c.attr("style",d.attr("style"));b.copyTitle&&c.attr("title",d.attr("title"));c.data("orgchart-level",g).data("orgchart-node",d);k.append(c);n.append(k);l.append(n);c.click(function(){var c=a(this);b.nodeClicked(c.data("orgchart-node"),c);if(b.interactive){var d=
c.closest("tr");d.next("tr").is(":visible")?(b.fade?d.nextAll("tr").fadeOut(b.speed):d.nextAll("tr").hide(),c.removeClass("shownChildren").addClass("hiddenChildren")):(c.removeClass("hiddenChildren").addClass("shownChildren"),b.fade?d.nextAll("tr").fadeIn(b.speed):d.nextAll("tr").show())}});if(0<f.length)if(-1==b.depth||g+1<b.depth){e=a("<tr/>").addClass("lines");d=a("<td/>").attr("colspan",2*f.length);e.append(d);k=a("<table cellpadding='0' cellspacing='0' border='0'>");k.append("<tbody>");var r=
a("<tr/>").addClass("lines x"),t=a("<td>").addClass("line left"),u=a("<td>").addClass("line right");r.append(t).append(u);k.children("tbody").append(r);d.append(k);l.append(e);0<f.length&&(c.addClass("hasChildren"),-1==b.showLevels||g<b.showLevels-1?c.addClass("shownChildren"):c.addClass("hiddenChildren"),b.interactive&&c.hover(function(){a(this).addClass(b.hoverClass)},function(){a(this).removeClass(b.hoverClass)}));var m=a("<tr/>").addClass("lines v");f.each(function(){var b=a("<td/>").addClass("line left top"),
c=a("<td/>").addClass("line right top");m.append(b).append(c)});m.find("td:first").removeClass("top");m.find("td:last").removeClass("top");l.append(m);var s=a("<tr/>");f.each(function(c){var d=a("<td/>");d.attr("colspan",2);p(a(this),d,g+1,c,b);s.append(d)});l.append(s)}else b.stack&&(f=f.clone(),f=a("<ul class='stack'>").append(f).addClass("level"+g).addClass("node"+e).addClass("level"+g+"-node"+e),f=a("<div class='stack-container'>").append(f),c.after(f));-1<b.showLevels&&g>=b.showLevels-1&&n.nextAll("tr").hide();
q.append(l);h.append(q)}a.fn.orgChart=function(d){var h=a.extend({},a.fn.orgChart.defaults,d);return this.each(function(){var d=a(this);$this=d.clone();-1<h.levels&&$this.find("ul").andSelf().filter(function(){return d.parents("ul").length+1>h.levels}).remove();$this.data("chart-source",d);var e=a("<div class='"+h.chartClass+"'/>");h.interactive&&e.addClass("interactive");var b;$this.is("ul")?b=$this.find("li:first"):$this.is("li")&&(b=$this);b&&(p(b,e,0,0,h),e.find("div.node a").click(function(a){a.stopImmediatePropagation()}),
h.replace&&h.container.empty(),h.container.append(e))})};a.fn.orgChart.defaults={container:a("body"),depth:-1,levels:-1,showLevels:-1,stack:!1,chartClass:"orgChart",hoverClass:"hover",nodeText:function(a){return a.clone().children("ul,li").remove().end().html()},interactive:!1,fade:!1,speed:"slow",nodeClicked:function(a){},copyClasses:!0,copyData:!0,copyStyles:!0,copyTitle:!0,replace:!0}})(jQuery);
/*
  Highcharts JS v4.2.1 (2015-12-21)
 Solid angular gauge module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(a){typeof module==="object"&&module.exports?module.exports=a:a(Highcharts)})(function(a){var q=a.getOptions().plotOptions,r=a.pInt,s=a.pick,k=a.each,l;q.solidgauge=a.merge(q.gauge,{colorByPoint:!0});l={initDataClasses:function(b){var d=this,i=this.chart,c,g=0,e=this.options;this.dataClasses=c=[];k(b.dataClasses,function(f,h){var p,f=a.merge(f);c.push(f);if(!f.color)e.dataClassColor==="category"?(p=i.options.colors,f.color=p[g++],g===p.length&&(g=0)):f.color=d.tweenColors(a.Color(e.minColor),
a.Color(e.maxColor),h/(b.dataClasses.length-1))})},initStops:function(b){this.stops=b.stops||[[0,this.options.minColor],[1,this.options.maxColor]];k(this.stops,function(b){b.color=a.Color(b[1])})},toColor:function(b,d){var a,c=this.stops,g,e=this.dataClasses,f,h;if(e)for(h=e.length;h--;){if(f=e[h],g=f.from,c=f.to,(g===void 0||b>=g)&&(c===void 0||b<=c)){a=f.color;if(d)d.dataClass=h;break}}else{this.isLog&&(b=this.val2lin(b));a=1-(this.max-b)/(this.max-this.min);for(h=c.length;h--;)if(a>c[h][0])break;
g=c[h]||c[h+1];c=c[h+1]||g;a=1-(c[0]-a)/(c[0]-g[0]||1);a=this.tweenColors(g.color,c.color,a)}return a},tweenColors:function(b,a,i){var c;!a.rgba.length||!b.rgba.length?b=a.input||"none":(b=b.rgba,a=a.rgba,c=a[3]!==1||b[3]!==1,b=(c?"rgba(":"rgb(")+Math.round(a[0]+(b[0]-a[0])*(1-i))+","+Math.round(a[1]+(b[1]-a[1])*(1-i))+","+Math.round(a[2]+(b[2]-a[2])*(1-i))+(c?","+(a[3]+(b[3]-a[3])*(1-i)):"")+")");return b}};k(["fill","stroke"],function(b){a.Fx.prototype[b+"Setter"]=function(){this.elem.attr(b,l.tweenColors(a.Color(this.start),
a.Color(this.end),this.pos))}});a.seriesTypes.solidgauge=a.extendClass(a.seriesTypes.gauge,{type:"solidgauge",pointAttrToOptions:{},bindAxes:function(){var b;a.seriesTypes.gauge.prototype.bindAxes.call(this);b=this.yAxis;a.extend(b,l);b.options.dataClasses&&b.initDataClasses(b.options);b.initStops(b.options)},drawPoints:function(){var b=this,d=b.yAxis,i=d.center,c=b.options,g=b.chart.renderer,e=c.overshoot,f=e&&typeof e==="number"?e/180*Math.PI:0;a.each(b.points,function(a){var e=a.graphic,j=d.startAngleRad+
d.translate(a.y,null,null,null,!0),k=r(s(a.options.radius,c.radius,100))*i[2]/200,m=r(s(a.options.innerRadius,c.innerRadius,60))*i[2]/200,n=d.toColor(a.y,a),o=Math.min(d.startAngleRad,d.endAngleRad),l=Math.max(d.startAngleRad,d.endAngleRad);n==="none"&&(n=a.color||b.color||"none");if(n!=="none")a.color=n;j=Math.max(o-f,Math.min(l+f,j));c.wrap===!1&&(j=Math.max(o,Math.min(l,j)));o=Math.min(j,d.startAngleRad);j=Math.max(j,d.startAngleRad);j-o>2*Math.PI&&(j=o+2*Math.PI);a.shapeArgs=m={x:i[0],y:i[1],
r:k,innerR:m,start:o,end:j,fill:n};a.startR=k;if(e){if(a=m.d,e.animate(m),a)m.d=a}else a.graphic=g.arc(m).attr({stroke:c.borderColor||"none","stroke-width":c.borderWidth||0,fill:n,"sweep-flag":0}).add(b.group)})},animate:function(b){if(!b)this.startAngleRad=this.yAxis.startAngleRad,a.seriesTypes.pie.prototype.animate.call(this,b)}})});

/*
 Highmaps JS v4.2.3 (2016-02-08)
 Highmaps as a plugin for Highcharts 4.1.x or Highstock 2.1.x (x being the patch version of this file)

 (c) 2011-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(i){typeof module==="object"&&module.exports?module.exports=i:i(Highcharts)})(function(i){function K(a,b){var c,d,e,f,g=!1,h=a.x,j=a.y;for(c=0,d=b.length-1;c<b.length;d=c++)e=b[c][1]>j,f=b[d][1]>j,e!==f&&h<(b[d][0]-b[c][0])*(j-b[c][1])/(b[d][1]-b[c][1])+b[c][0]&&(g=!g);return g}function L(a,b,c,d,e,f,g,h){return["M",a+e,b,"L",a+c-f,b,"C",a+c-f/2,b,a+c,b+f/2,a+c,b+f,"L",a+c,b+d-g,"C",a+c,b+d-g/2,a+c-g/2,b+d,a+c-g,b+d,"L",a+h,b+d,"C",a+h/2,b+d,a,b+d-h/2,a,b+d-h,"L",a,b+e,"C",a,b+e/2,a+e/2,
b,a+e,b,"Z"]}var p=i.Axis,q=i.Chart,x=i.Color,t=i.Point,G=i.Pointer,D=i.Legend,H=i.LegendSymbolMixin,R=i.Renderer,y=i.Series,I=i.SVGRenderer,M=i.VMLRenderer,A=i.win,N=A.document,J=i.addEvent,k=i.each,E=i.error,o=i.extend,u=i.extendClass,O=i.format,n=i.merge,l=i.pick,B=i.getOptions(),m=i.seriesTypes,w=B.plotOptions,v=i.wrap,s=function(){};v(p.prototype,"getSeriesExtremes",function(a){var b=this.isXAxis,c,d,e=[],f;b&&k(this.series,function(a,b){if(a.useMapGeometry)e[b]=a.xData,a.xData=[]});a.call(this);
if(b&&(c=l(this.dataMin,Number.MAX_VALUE),d=l(this.dataMax,-Number.MAX_VALUE),k(this.series,function(a,b){if(a.useMapGeometry)c=Math.min(c,l(a.minX,c)),d=Math.max(d,l(a.maxX,c)),a.xData=e[b],f=!0}),f))this.dataMin=c,this.dataMax=d});v(p.prototype,"setAxisTranslation",function(a){var b=this.chart,c=b.plotWidth/b.plotHeight,b=b.xAxis[0],d;a.call(this);this.coll==="yAxis"&&b.transA!==void 0&&k(this.series,function(a){a.preserveAspectRatio&&(d=!0)});if(d&&(this.transA=b.transA=Math.min(this.transA,b.transA),
a=c/((b.max-b.min)/(this.max-this.min)),a=a<1?this:b,c=(a.max-a.min)*a.transA,a.pixelPadding=a.len-c,a.minPixelPadding=a.pixelPadding/2,c=a.fixTo)){c=c[1]-a.toValue(c[0],!0);c*=a.transA;if(Math.abs(c)>a.minPixelPadding||a.min===a.dataMin&&a.max===a.dataMax)c=0;a.minPixelPadding-=c}});v(p.prototype,"render",function(a){a.call(this);this.fixTo=null});var C=i.ColorAxis=function(){this.isColorAxis=!0;this.init.apply(this,arguments)};o(C.prototype,p.prototype);o(C.prototype,{defaultColorAxisOptions:{lineWidth:0,
minPadding:0,maxPadding:0,gridLineWidth:1,tickPixelInterval:72,startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},color:"gray",width:0.01},labels:{overflow:"justify"},minColor:"#EFEFFF",maxColor:"#003875",tickLength:5},init:function(a,b){var c=a.options.legend.layout!=="vertical",d;d=n(this.defaultColorAxisOptions,{side:c?2:1,reversed:!c},b,{opposite:!c,showEmpty:!1,title:null,isColor:!0});p.prototype.init.call(this,a,d);b.dataClasses&&this.initDataClasses(b);this.initStops(b);this.horiz=
c;this.zoomEnabled=!1},tweenColors:function(a,b,c){var d;!b.rgba.length||!a.rgba.length?a=b.input||"none":(a=a.rgba,b=b.rgba,d=b[3]!==1||a[3]!==1,a=(d?"rgba(":"rgb(")+Math.round(b[0]+(a[0]-b[0])*(1-c))+","+Math.round(b[1]+(a[1]-b[1])*(1-c))+","+Math.round(b[2]+(a[2]-b[2])*(1-c))+(d?","+(b[3]+(a[3]-b[3])*(1-c)):"")+")");return a},initDataClasses:function(a){var b=this,c=this.chart,d,e=0,f=this.options,g=a.dataClasses.length;this.dataClasses=d=[];this.legendItems=[];k(a.dataClasses,function(a,j){var r,
a=n(a);d.push(a);if(!a.color)f.dataClassColor==="category"?(r=c.options.colors,a.color=r[e++],e===r.length&&(e=0)):a.color=b.tweenColors(x(f.minColor),x(f.maxColor),g<2?0.5:j/(g-1))})},initStops:function(a){this.stops=a.stops||[[0,this.options.minColor],[1,this.options.maxColor]];k(this.stops,function(a){a.color=x(a[1])})},setOptions:function(a){p.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker;this.coll="colorAxis"},setAxisSize:function(){var a=this.legendSymbol,b=this.chart,
c,d,e;if(a)this.left=c=a.attr("x"),this.top=d=a.attr("y"),this.width=e=a.attr("width"),this.height=a=a.attr("height"),this.right=b.chartWidth-c-e,this.bottom=b.chartHeight-d-a,this.len=this.horiz?e:a,this.pos=this.horiz?c:d},toColor:function(a,b){var c,d=this.stops,e,f=this.dataClasses,g,h;if(f)for(h=f.length;h--;){if(g=f[h],e=g.from,d=g.to,(e===void 0||a>=e)&&(d===void 0||a<=d)){c=g.color;if(b)b.dataClass=h;break}}else{this.isLog&&(a=this.val2lin(a));c=1-(this.max-a)/(this.max-this.min||1);for(h=
d.length;h--;)if(c>d[h][0])break;e=d[h]||d[h+1];d=d[h+1]||e;c=1-(d[0]-c)/(d[0]-e[0]||1);c=this.tweenColors(e.color,d.color,c)}return c},getOffset:function(){var a=this.legendGroup,b=this.chart.axisOffset[this.side];if(a){this.axisParent=a;p.prototype.getOffset.call(this);if(!this.added)this.added=!0,this.labelLeft=0,this.labelRight=this.width;this.chart.axisOffset[this.side]=b}},setLegendColor:function(){var a,b=this.options,c=this.reversed;a=c?1:0;c=c?0:1;a=this.horiz?[a,0,c,0]:[0,c,0,a];this.legendColor=
{linearGradient:{x1:a[0],y1:a[1],x2:a[2],y2:a[3]},stops:b.stops||[[0,b.minColor],[1,b.maxColor]]}},drawLegendSymbol:function(a,b){var c=a.padding,d=a.options,e=this.horiz,f=l(d.symbolWidth,e?200:12),g=l(d.symbolHeight,e?12:200),h=l(d.labelPadding,e?16:30),d=l(d.itemDistance,10);this.setLegendColor();b.legendSymbol=this.chart.renderer.rect(0,a.baseline-11,f,g).attr({zIndex:1}).add(b.legendGroup);this.legendItemWidth=f+c+(e?d:h);this.legendItemHeight=g+c+(e?h:0)},setState:s,visible:!0,setVisible:s,
getSeriesExtremes:function(){var a;if(this.series.length)a=this.series[0],this.dataMin=a.valueMin,this.dataMax=a.valueMax},drawCrosshair:function(a,b){var c=b&&b.plotX,d=b&&b.plotY,e,f=this.pos,g=this.len;if(b)e=this.toPixels(b[b.series.colorKey]),e<f?e=f-2:e>f+g&&(e=f+g+2),b.plotX=e,b.plotY=this.len-e,p.prototype.drawCrosshair.call(this,a,b),b.plotX=c,b.plotY=d,this.cross&&this.cross.attr({fill:this.crosshair.color}).add(this.legendGroup)},getPlotLinePath:function(a,b,c,d,e){return typeof e==="number"?
this.horiz?["M",e-4,this.top-6,"L",e+4,this.top-6,e,this.top,"Z"]:["M",this.left,e,"L",this.left-6,e+6,this.left-6,e-6,"Z"]:p.prototype.getPlotLinePath.call(this,a,b,c,d)},update:function(a,b){var c=this.chart,d=c.legend;k(this.series,function(a){a.isDirtyData=!0});if(a.dataClasses&&d.allItems)k(d.allItems,function(a){a.isDataClass&&a.legendGroup.destroy()}),c.isDirtyLegend=!0;c.options[this.coll]=n(this.userOptions,a);p.prototype.update.call(this,a,b);this.legendItem&&(this.setLegendColor(),d.colorizeItem(this,
!0))},getDataClassLegendSymbols:function(){var a=this,b=this.chart,c=this.legendItems,d=b.options.legend,e=d.valueDecimals,f=d.valueSuffix||"",g;c.length||k(this.dataClasses,function(d,j){var r=!0,z=d.from,l=d.to;g="";z===void 0?g="< ":l===void 0&&(g="> ");z!==void 0&&(g+=i.numberFormat(z,e)+f);z!==void 0&&l!==void 0&&(g+=" - ");l!==void 0&&(g+=i.numberFormat(l,e)+f);c.push(o({chart:b,name:g,options:{},drawLegendSymbol:H.drawRectangle,visible:!0,setState:s,isDataClass:!0,setVisible:function(){r=this.visible=
!r;k(a.series,function(a){k(a.points,function(a){a.dataClass===j&&a.setVisible(r)})});b.legend.colorizeItem(this,r)}},d))});return c},name:""});k(["fill","stroke"],function(a){i.Fx.prototype[a+"Setter"]=function(){this.elem.attr(a,C.prototype.tweenColors(x(this.start),x(this.end),this.pos))}});v(q.prototype,"getAxes",function(a){var b=this.options.colorAxis;a.call(this);this.colorAxis=[];b&&new C(this,b)});v(D.prototype,"getAllItems",function(a){var b=[],c=this.chart.colorAxis[0];c&&(c.options.dataClasses?
b=b.concat(c.getDataClassLegendSymbols()):b.push(c),k(c.series,function(a){a.options.showInLegend=!1}));return b.concat(a.call(this))});var D={setVisible:function(a){var b=this,c=a?"show":"hide";k(["graphic","dataLabel"],function(a){if(b[a])b[a][c]()})}},P={pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",dashstyle:"dashStyle"},pointArrayMap:["value"],axisTypes:["xAxis","yAxis","colorAxis"],optionalAxis:"colorAxis",trackerGroups:["group","markerGroup","dataLabelsGroup"],
getSymbol:s,parallelArrays:["x","y","value"],colorKey:"value",translateColors:function(){var a=this,b=this.options.nullColor,c=this.colorAxis,d=this.colorKey;k(this.data,function(e){var f=e[d];if(f=e.options.color||(f===null?b:c&&f!==void 0?c.toColor(f,e):e.color||a.color))e.color=f})}};o(q.prototype,{renderMapNavigation:function(){var a=this,b=this.options.mapNavigation,c=b.buttons,d,e,f,g,h=function(a){if(a)a.preventDefault&&a.preventDefault(),a.stopPropagation&&a.stopPropagation(),a.cancelBubble=
!0},j=function(b){this.handler.call(a,b);h(b)};if(l(b.enableButtons,b.enabled)&&!a.renderer.forExport)for(d in c)if(c.hasOwnProperty(d))f=n(b.buttonOptions,c[d]),e=f.theme,e.style=n(f.theme.style,f.style),g=e.states,e=a.renderer.button(f.text,0,0,j,e,g&&g.hover,g&&g.select,0,d==="zoomIn"?"topbutton":"bottombutton").attr({width:f.width,height:f.height,title:a.options.lang[d],zIndex:5}).add(),e.handler=f.onclick,e.align(o(f,{width:e.width,height:2*e.height}),null,f.alignTo),J(e.element,"dblclick",h)},
fitToBox:function(a,b){k([["x","width"],["y","height"]],function(c){var d=c[0],c=c[1];a[d]+a[c]>b[d]+b[c]&&(a[c]>b[c]?(a[c]=b[c],a[d]=b[d]):a[d]=b[d]+b[c]-a[c]);a[c]>b[c]&&(a[c]=b[c]);a[d]<b[d]&&(a[d]=b[d])});return a},mapZoom:function(a,b,c,d,e){var f=this.xAxis[0],g=f.max-f.min,h=l(b,f.min+g/2),j=g*a,g=this.yAxis[0],i=g.max-g.min,z=l(c,g.min+i/2);i*=a;h=this.fitToBox({x:h-j*(d?(d-f.pos)/f.len:0.5),y:z-i*(e?(e-g.pos)/g.len:0.5),width:j,height:i},{x:f.dataMin,y:g.dataMin,width:f.dataMax-f.dataMin,
height:g.dataMax-g.dataMin});if(d)f.fixTo=[d-f.pos,b];if(e)g.fixTo=[e-g.pos,c];a!==void 0?(f.setExtremes(h.x,h.x+h.width,!1),g.setExtremes(h.y,h.y+h.height,!1)):(f.setExtremes(void 0,void 0,!1),g.setExtremes(void 0,void 0,!1));this.redraw()}});v(q.prototype,"render",function(a){var b=this,c=b.options.mapNavigation;b.renderMapNavigation();a.call(b);(l(c.enableDoubleClickZoom,c.enabled)||c.enableDoubleClickZoomTo)&&J(b.container,"dblclick",function(a){b.pointer.onContainerDblClick(a)});l(c.enableMouseWheelZoom,
c.enabled)&&J(b.container,N.onmousewheel===void 0?"DOMMouseScroll":"mousewheel",function(a){b.pointer.onContainerMouseWheel(a);return!1})});o(G.prototype,{onContainerDblClick:function(a){var b=this.chart,a=this.normalize(a);b.options.mapNavigation.enableDoubleClickZoomTo?b.pointer.inClass(a.target,"highcharts-tracker")&&b.hoverPoint.zoomTo():b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&b.mapZoom(0.5,b.xAxis[0].toValue(a.chartX),b.yAxis[0].toValue(a.chartY),a.chartX,a.chartY)},onContainerMouseWheel:function(a){var b=
this.chart,c,a=this.normalize(a);c=a.detail||-(a.wheelDelta/120);b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&b.mapZoom(Math.pow(2,c),b.xAxis[0].toValue(a.chartX),b.yAxis[0].toValue(a.chartY),a.chartX,a.chartY)}});v(G.prototype,"init",function(a,b,c){a.call(this,b,c);if(l(c.mapNavigation.enableTouchZoom,c.mapNavigation.enabled))this.pinchX=this.pinchHor=this.pinchY=this.pinchVert=this.hasZoom=!0});v(G.prototype,"pinchTranslate",function(a,b,c,d,e,f,g){a.call(this,b,c,d,e,f,g);this.chart.options.chart.type===
"map"&&this.hasZoom&&(a=d.scaleX>d.scaleY,this.pinchTranslateDirection(!a,b,c,d,e,f,g,a?d.scaleX:d.scaleY))});var F=N.documentElement.style.vectorEffect!==void 0;w.map=n(w.scatter,{allAreas:!0,animation:!1,nullColor:"#F8F8F8",borderColor:"silver",borderWidth:1,marker:null,stickyTracking:!1,dataLabels:{formatter:function(){return this.point.value},inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},turboThreshold:0,tooltip:{followPointer:!0,pointFormat:"{point.name}: {point.value}<br/>"},
states:{normal:{animation:!0},hover:{brightness:0.2,halo:null}}});var Q=u(t,o({applyOptions:function(a,b){var c=t.prototype.applyOptions.call(this,a,b),d=this.series,e=d.joinBy;if(d.mapData)if(e=c[e[1]]!==void 0&&d.mapMap[c[e[1]]]){if(d.xyFromShape)c.x=e._midX,c.y=e._midY;o(c,e)}else c.value=c.value||null;return c},onMouseOver:function(a){clearTimeout(this.colorInterval);if(this.value!==null)t.prototype.onMouseOver.call(this,a);else this.series.onMouseOut(a)},onMouseOut:function(){var a=this,b=+new Date,
c=x(a.color),d=x(a.pointAttr.hover.fill),e=a.series.options.states.normal.animation,f=e&&(e.duration||500),g;if(f&&c.rgba.length===4&&d.rgba.length===4&&a.state!=="select")g=a.pointAttr[""].fill,delete a.pointAttr[""].fill,clearTimeout(a.colorInterval),a.colorInterval=setInterval(function(){var e=(new Date-b)/f,g=a.graphic;e>1&&(e=1);g&&g.attr("fill",C.prototype.tweenColors.call(0,d,c,e));e>=1&&clearTimeout(a.colorInterval)},13);t.prototype.onMouseOut.call(a);if(g)a.pointAttr[""].fill=g},zoomTo:function(){var a=
this.series;a.xAxis.setExtremes(this._minX,this._maxX,!1);a.yAxis.setExtremes(this._minY,this._maxY,!1);a.chart.redraw()}},D));m.map=u(m.scatter,n(P,{type:"map",pointClass:Q,supportsDrilldown:!0,getExtremesFromAll:!0,useMapGeometry:!0,forceDL:!0,searchPoint:s,directTouch:!0,preserveAspectRatio:!0,getBox:function(a){var b=Number.MAX_VALUE,c=-b,d=b,e=-b,f=b,g=b,h=this.xAxis,j=this.yAxis,r;k(a||[],function(a){if(a.path){if(typeof a.path==="string")a.path=i.splitPath(a.path);var h=a.path||[],j=h.length,
k=!1,m=-b,n=b,o=-b,p=b,q=a.properties;if(!a._foundBox){for(;j--;)typeof h[j]==="number"&&!isNaN(h[j])&&(k?(m=Math.max(m,h[j]),n=Math.min(n,h[j])):(o=Math.max(o,h[j]),p=Math.min(p,h[j])),k=!k);a._midX=n+(m-n)*(a.middleX||q&&q["hc-middle-x"]||0.5);a._midY=p+(o-p)*(a.middleY||q&&q["hc-middle-y"]||0.5);a._maxX=m;a._minX=n;a._maxY=o;a._minY=p;a.labelrank=l(a.labelrank,(m-n)*(o-p));a._foundBox=!0}c=Math.max(c,a._maxX);d=Math.min(d,a._minX);e=Math.max(e,a._maxY);f=Math.min(f,a._minY);g=Math.min(a._maxX-
a._minX,a._maxY-a._minY,g);r=!0}});if(r){this.minY=Math.min(f,l(this.minY,b));this.maxY=Math.max(e,l(this.maxY,-b));this.minX=Math.min(d,l(this.minX,b));this.maxX=Math.max(c,l(this.maxX,-b));if(h&&h.options.minRange===void 0)h.minRange=Math.min(5*g,(this.maxX-this.minX)/5,h.minRange||b);if(j&&j.options.minRange===void 0)j.minRange=Math.min(5*g,(this.maxY-this.minY)/5,j.minRange||b)}},getExtremes:function(){y.prototype.getExtremes.call(this,this.valueData);this.chart.hasRendered&&this.isDirtyData&&
this.getBox(this.options.data);this.valueMin=this.dataMin;this.valueMax=this.dataMax;this.dataMin=this.minY;this.dataMax=this.maxY},translatePath:function(a){var b=!1,c=this.xAxis,d=this.yAxis,e=c.min,f=c.transA,c=c.minPixelPadding,g=d.min,h=d.transA,d=d.minPixelPadding,j,i=[];if(a)for(j=a.length;j--;)typeof a[j]==="number"?(i[j]=b?(a[j]-e)*f+c:(a[j]-g)*h+d,b=!b):i[j]=a[j];return i},setData:function(a,b){var c=this.options,d=c.mapData,e=c.joinBy,f=e===null,g=[],h,j,l;f&&(e="_i");e=this.joinBy=i.splat(e);
e[1]||(e[1]=e[0]);a&&k(a,function(b,c){typeof b==="number"&&(a[c]={value:b});if(f)a[c]._i=c});this.getBox(a);if(d){if(d.type==="FeatureCollection"){if(d["hc-transform"])for(h in this.chart.mapTransforms=j=d["hc-transform"],j)if(j.hasOwnProperty(h)&&h.rotation)h.cosAngle=Math.cos(h.rotation),h.sinAngle=Math.sin(h.rotation);d=i.geojson(d,this.type,this)}this.getBox(d);this.mapData=d;this.mapMap={};for(l=0;l<d.length;l++)h=d[l],j=h.properties,h._i=l,e[0]&&j&&j[e[0]]&&(h[e[0]]=j[e[0]]),this.mapMap[h[e[0]]]=
h;c.allAreas&&(a=a||[],e[1]&&k(a,function(a){g.push(a[e[1]])}),g="|"+g.join("|")+"|",k(d,function(b){(!e[0]||g.indexOf("|"+b[e[0]]+"|")===-1)&&a.push(n(b,{value:null}))}))}y.prototype.setData.call(this,a,b)},drawGraph:s,drawDataLabels:s,doFullTranslate:function(){return this.isDirtyData||this.chart.isResizing||this.chart.renderer.isVML||!this.baseTrans},translate:function(){var a=this,b=a.xAxis,c=a.yAxis,d=a.doFullTranslate();a.generatePoints();k(a.data,function(e){e.plotX=b.toPixels(e._midX,!0);
e.plotY=c.toPixels(e._midY,!0);if(d)e.shapeType="path",e.shapeArgs={d:a.translatePath(e.path)},F&&(e.shapeArgs["vector-effect"]="non-scaling-stroke")});a.translateColors()},drawPoints:function(){var a=this,b=a.xAxis,c=a.yAxis,d=a.group,e=a.chart,f=e.renderer,g,h=this.baseTrans;if(!a.transformGroup)a.transformGroup=f.g().attr({scaleX:1,scaleY:1}).add(d),a.transformGroup.survive=!0;a.doFullTranslate()?(e.hasRendered&&a.pointAttrToOptions.fill==="color"&&k(a.points,function(a){if(a.shapeArgs)a.shapeArgs.fill=
a.pointAttr[l(a.state,"")].fill}),F||k(a.points,function(b){b=b.pointAttr[""];b["stroke-width"]===a.pointAttr[""]["stroke-width"]&&(b["stroke-width"]="inherit")}),a.group=a.transformGroup,m.column.prototype.drawPoints.apply(a),a.group=d,k(a.points,function(a){a.graphic&&(a.name&&a.graphic.addClass("highcharts-name-"+a.name.replace(" ","-").toLowerCase()),a.properties&&a.properties["hc-key"]&&a.graphic.addClass("highcharts-key-"+a.properties["hc-key"].toLowerCase()),F||(a.graphic["stroke-widthSetter"]=
s))}),this.baseTrans={originX:b.min-b.minPixelPadding/b.transA,originY:c.min-c.minPixelPadding/c.transA+(c.reversed?0:c.len/c.transA),transAX:b.transA,transAY:c.transA},this.transformGroup.animate({translateX:0,translateY:0,scaleX:1,scaleY:1})):(g=b.transA/h.transAX,d=c.transA/h.transAY,b=b.toPixels(h.originX,!0),c=c.toPixels(h.originY,!0),g>0.99&&g<1.01&&d>0.99&&d<1.01&&(d=g=1,b=Math.round(b),c=Math.round(c)),this.transformGroup.animate({translateX:b,translateY:c,scaleX:g,scaleY:d}));F||a.group.element.setAttribute("stroke-width",
a.options.borderWidth/(g||1));this.drawMapDataLabels()},drawMapDataLabels:function(){y.prototype.drawDataLabels.call(this);this.dataLabelsGroup&&this.dataLabelsGroup.clip(this.chart.clipRect)},render:function(){var a=this,b=y.prototype.render;a.chart.renderer.isVML&&a.data.length>3E3?setTimeout(function(){b.call(a)}):b.call(a)},animate:function(a){var b=this.options.animation,c=this.group,d=this.xAxis,e=this.yAxis,f=d.pos,g=e.pos;if(this.chart.renderer.isSVG)b===!0&&(b={duration:1E3}),a?c.attr({translateX:f+
d.len/2,translateY:g+e.len/2,scaleX:0.001,scaleY:0.001}):(c.animate({translateX:f,translateY:g,scaleX:1,scaleY:1},b),this.animate=null)},animateDrilldown:function(a){var b=this.chart.plotBox,c=this.chart.drilldownLevels[this.chart.drilldownLevels.length-1],d=c.bBox,e=this.chart.options.drilldown.animation;if(!a)a=Math.min(d.width/b.width,d.height/b.height),c.shapeArgs={scaleX:a,scaleY:a,translateX:d.x,translateY:d.y},k(this.points,function(a){a.graphic&&a.graphic.attr(c.shapeArgs).animate({scaleX:1,
scaleY:1,translateX:0,translateY:0},e)}),this.animate=null},drawLegendSymbol:H.drawRectangle,animateDrillupFrom:function(a){m.column.prototype.animateDrillupFrom.call(this,a)},animateDrillupTo:function(a){m.column.prototype.animateDrillupTo.call(this,a)}}));w.mapline=n(w.map,{lineWidth:1,fillColor:"none"});m.mapline=u(m.map,{type:"mapline",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth",fill:"fillColor",dashstyle:"dashStyle"},drawLegendSymbol:m.line.prototype.drawLegendSymbol});w.mappoint=
n(w.scatter,{dataLabels:{enabled:!0,formatter:function(){return this.point.name},crop:!1,defer:!1,overflow:!1,style:{color:"#000000"}}});m.mappoint=u(m.scatter,{type:"mappoint",forceDL:!0,pointClass:u(t,{applyOptions:function(a,b){var c=t.prototype.applyOptions.call(this,a,b);a.lat!==void 0&&a.lon!==void 0&&(c=o(c,this.series.chart.fromLatLonToPoint(c)));return c}})});if(m.bubble)w.mapbubble=n(w.bubble,{animationLimit:500,tooltip:{pointFormat:"{point.name}: {point.z}"}}),m.mapbubble=u(m.bubble,{pointClass:u(t,
{applyOptions:function(a,b){var c;a&&a.lat!==void 0&&a.lon!==void 0?(c=t.prototype.applyOptions.call(this,a,b),c=o(c,this.series.chart.fromLatLonToPoint(c))):c=Q.prototype.applyOptions.call(this,a,b);return c},ttBelow:!1}),xyFromShape:!0,type:"mapbubble",pointArrayMap:["z"],getMapData:m.map.prototype.getMapData,getBox:m.map.prototype.getBox,setData:m.map.prototype.setData});B.plotOptions.heatmap=n(B.plotOptions.scatter,{animation:!1,borderWidth:0,nullColor:"#F8F8F8",dataLabels:{formatter:function(){return this.point.value},
inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},marker:null,pointRange:null,tooltip:{pointFormat:"{point.x}, {point.y}: {point.value}<br/>"},states:{normal:{animation:!0},hover:{halo:!1,brightness:0.2}}});m.heatmap=u(m.scatter,n(P,{type:"heatmap",pointArrayMap:["y","value"],hasPointSpecificOptions:!0,pointClass:u(t,D),supportsDrilldown:!0,getExtremesFromAll:!0,directTouch:!0,init:function(){var a;m.scatter.prototype.init.apply(this,arguments);a=this.options;a.pointRange=l(a.pointRange,
a.colsize||1);this.yAxis.axisPointRange=a.rowsize||1},translate:function(){var a=this.options,b=this.xAxis,c=this.yAxis,d=function(a,b,c){return Math.min(Math.max(b,a),c)};this.generatePoints();k(this.points,function(e){var f=(a.colsize||1)/2,g=(a.rowsize||1)/2,h=d(Math.round(b.len-b.translate(e.x-f,0,1,0,1)),0,b.len),f=d(Math.round(b.len-b.translate(e.x+f,0,1,0,1)),0,b.len),j=d(Math.round(c.translate(e.y-g,0,1,0,1)),0,c.len),g=d(Math.round(c.translate(e.y+g,0,1,0,1)),0,c.len);e.plotX=e.clientX=(h+
f)/2;e.plotY=(j+g)/2;e.shapeType="rect";e.shapeArgs={x:Math.min(h,f),y:Math.min(j,g),width:Math.abs(f-h),height:Math.abs(g-j)}});this.translateColors();this.chart.hasRendered&&k(this.points,function(a){a.shapeArgs.fill=a.options.color||a.color})},drawPoints:m.column.prototype.drawPoints,animate:s,getBox:s,drawLegendSymbol:H.drawRectangle,getExtremes:function(){y.prototype.getExtremes.call(this,this.valueData);this.valueMin=this.dataMin;this.valueMax=this.dataMax;y.prototype.getExtremes.call(this)}}));
q.prototype.transformFromLatLon=function(a,b){if(A.proj4===void 0)return E(21),{x:0,y:null};var c=A.proj4(b.crs,[a.lon,a.lat]),d=b.cosAngle||b.rotation&&Math.cos(b.rotation),e=b.sinAngle||b.rotation&&Math.sin(b.rotation),c=b.rotation?[c[0]*d+c[1]*e,-c[0]*e+c[1]*d]:c;return{x:((c[0]-(b.xoffset||0))*(b.scale||1)+(b.xpan||0))*(b.jsonres||1)+(b.jsonmarginX||0),y:(((b.yoffset||0)-c[1])*(b.scale||1)+(b.ypan||0))*(b.jsonres||1)-(b.jsonmarginY||0)}};q.prototype.transformToLatLon=function(a,b){if(A.proj4===
void 0)E(21);else{var c={x:((a.x-(b.jsonmarginX||0))/(b.jsonres||1)-(b.xpan||0))/(b.scale||1)+(b.xoffset||0),y:((-a.y-(b.jsonmarginY||0))/(b.jsonres||1)+(b.ypan||0))/(b.scale||1)+(b.yoffset||0)},d=b.cosAngle||b.rotation&&Math.cos(b.rotation),e=b.sinAngle||b.rotation&&Math.sin(b.rotation),c=A.proj4(b.crs,"WGS84",b.rotation?{x:c.x*d+c.y*-e,y:c.x*e+c.y*d}:c);return{lat:c.y,lon:c.x}}};q.prototype.fromPointToLatLon=function(a){var b=this.mapTransforms,c;if(b){for(c in b)if(b.hasOwnProperty(c)&&b[c].hitZone&&
K({x:a.x,y:-a.y},b[c].hitZone.coordinates[0]))return this.transformToLatLon(a,b[c]);return this.transformToLatLon(a,b["default"])}else E(22)};q.prototype.fromLatLonToPoint=function(a){var b=this.mapTransforms,c,d;if(!b)return E(22),{x:0,y:null};for(c in b)if(b.hasOwnProperty(c)&&b[c].hitZone&&(d=this.transformFromLatLon(a,b[c]),K({x:d.x,y:-d.y},b[c].hitZone.coordinates[0])))return d;return this.transformFromLatLon(a,b["default"])};i.geojson=function(a,b,c){var d=[],e=[],f=function(a){var b,c=a.length;
e.push("M");for(b=0;b<c;b++)b===1&&e.push("L"),e.push(a[b][0],-a[b][1])},b=b||"map";k(a.features,function(a){var c=a.geometry,j=c.type,c=c.coordinates,a=a.properties,i;e=[];b==="map"||b==="mapbubble"?(j==="Polygon"?(k(c,f),e.push("Z")):j==="MultiPolygon"&&(k(c,function(a){k(a,f)}),e.push("Z")),e.length&&(i={path:e})):b==="mapline"?(j==="LineString"?f(c):j==="MultiLineString"&&k(c,f),e.length&&(i={path:e})):b==="mappoint"&&j==="Point"&&(i={x:c[0],y:-c[1]});i&&d.push(o(i,{name:a.name||a.NAME,properties:a}))});
if(c&&a.copyrightShort)c.chart.mapCredits=O(c.chart.options.credits.mapText,{geojson:a}),c.chart.mapCreditsFull=O(c.chart.options.credits.mapTextFull,{geojson:a});return d};v(q.prototype,"showCredits",function(a,b){if(this.mapCredits)b.href=null;a.call(this,i.merge(b,{text:b.text+(this.mapCredits||"")}));this.credits&&this.mapCreditsFull&&this.credits.attr({title:this.mapCreditsFull})});o(B.lang,{zoomIn:"Zoom in",zoomOut:"Zoom out"});B.mapNavigation={buttonOptions:{alignTo:"plotBox",align:"left",
verticalAlign:"top",x:0,width:18,height:18,style:{fontSize:"15px",fontWeight:"bold",textAlign:"center"},theme:{"stroke-width":1}},buttons:{zoomIn:{onclick:function(){this.mapZoom(0.5)},text:"+",y:0},zoomOut:{onclick:function(){this.mapZoom(2)},text:"-",y:28}}};i.splitPath=function(a){var b,a=a.replace(/([A-Za-z])/g," $1 "),a=a.replace(/^\s*/,"").replace(/\s*$/,""),a=a.split(/[ ,]+/);for(b=0;b<a.length;b++)/[a-zA-Z]/.test(a[b])||(a[b]=parseFloat(a[b]));return a};i.maps={};I.prototype.symbols.topbutton=
function(a,b,c,d,e){return L(a-1,b-1,c,d,e.r,e.r,0,0)};I.prototype.symbols.bottombutton=function(a,b,c,d,e){return L(a-1,b-1,c,d,0,0,e.r,e.r)};R===M&&k(["topbutton","bottombutton"],function(a){M.prototype.symbols[a]=I.prototype.symbols[a]});i.Map=i.mapChart=function(a,b,c){var d=typeof a==="string"||a.nodeName,e=arguments[d?1:0],f={endOnTick:!1,gridLineWidth:0,lineWidth:0,minPadding:0,maxPadding:0,startOnTick:!1,title:null,tickPositions:[]},g,h=i.getOptions().credits;g=e.series;e.series=null;e=n({chart:{panning:"xy",
type:"map"},credits:{mapText:l(h.mapText,' \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>'),mapTextFull:l(h.mapTextFull,"{geojson.copyright}")},xAxis:f,yAxis:n(f,{reversed:!0})},e,{chart:{inverted:!1,alignTicks:!1}});e.series=g;return d?new q(a,e,c):new q(e,b)}});
Highcharts.maps["custom/world"] = {"title":"World, Miller projection, medium resolution","version":"1.1.2","type":"FeatureCollection","copyright":"Copyright (c) 2015 Highsoft AS, Based on data from Natural Earth","copyrightShort":"Natural Earth","copyrightUrl":"http://www.naturalearthdata.com","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:54003"}},"hc-transform":{"default":{"crs":"+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R_A +datum=WGS84 +units=m +no_defs","scale":1.72182781654e-05,"jsonres":15.5,"jsonmarginX":-999,"jsonmarginY":9851.0,"xoffset":-19495356.3693,"yoffset":12635908.1982}},
})(jQuery);
//# sourceMappingURL=libsPanel.js.map