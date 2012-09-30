/**
 * Created with JetBrains PhpStorm.
 * User: inkuzmin
 * Date: 7/27/12
 * Time: 4:39 AM
 */

var b = 0;

(function ($) {

    var methods = {
        init:function (options) {

            var settings = $.extend({
                'width':'16',
                'render':'svg' // svg or css
            }, options);


            return this.each(function () {

                var $this = $(this),
                    data = $this.data('jumpscrollbar');

                if (!data) {
                    // some setup stuff
                    $this.data('jumpscrollbar', {
                        'test3':1
                    })

                }

                $(this).data('jumpscrollbar', new Scrollbar({
                    'root':this,
                    'settings':settings
                }));

//                $(window).bind('resize.jumpscrollbar', methods.update);

            });

        },

        destroy:function () {

            return this.each(function () {

                var $this = $(this),
                    data = $this.data('jumpscrollbar');


                $(window).unbind('.jumpscrollbar');
                $this.removeData('jumpscrollbar');

            });
        },

        update:function () {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('jumpscrollbar');

                data.update();
            });

        }
    };


    $.fn.jumpscrollbar = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method == 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + 'does not exist on jQuery.jumpscrollbar');
        }
    };


    function Scrollbar(options) {
        var self = this;

        self._obtainOptions(options);
        self._init();

    }

    Scrollbar.prototype = {

        constructor:Scrollbar,

        _obtainOptions:function (options) {
            var self = this;

            self.options = { };

            for (var param in options) {
                if (options.hasOwnProperty(param))
                    self.options[param] = options[param];
            }

        },

        _init:function () {
            var self = this;

            self._initVars();

            self.update();

            self._bindHandlers();


            return this;
        },

        _initVars:function () {
            var self = this;

            self.root = self.options.root;
            self.$root = $(self.root);

            self.settings = self.options.settings;

            self.height = 0;
            self.scrollHeight = 0;

            self.width = self.settings.width;


            self.$scrollbarContainer = {};
            self.$svg = {};

            self.pimpa = {};

            self.isScrollingInProcess = false;

            self.scroll = 0;


        },

        update:function () {
            var self = this;

            self._createScrollbar();

        },

        _createScrollbar:function () {
            var self = this;

            self._lockDemention();

            var isScrollbar = self._isScrollbar();

            if (isScrollbar) {

                self._changeBlockView();
                self._createScrollContainer();
                self._renderJumpscrollbar();

            }


        },

        _changeBlockView:function () {
            var self = this;

            self.$root.css({
                'padding-right':self.settings.width + 'px',
                'overflow':'hidden',
                'float':'left'
            });

        },

        _renderJumpscrollbar:function () {
            var self = this;

            if (self.settings.render === "svg") {
                self._renderSVGScrollbar();

            }
            else if (self.settings.render === "css") {
                // Do some stuff
            }
            else {
                // Do some more stuff
            }


            self.scrollHeight = self.root.scrollHeight;

        },

        _renderSVGScrollbar:function () {
            var self = this;

            var svgNode = self._makeSVGElement("svg", {
                version:'1.1',
                width:self.width,
                height:self.height
            });

            self.$scrollbarContainer.append(svgNode);
            self.svgNode = svgNode;


            /////////

            var self = this;

            var rails = self._makeSVGElement("rect", {
                x:7,
                y:7,
                rx:2,
                ry:2,
                width:2,
                height:(self.height - 14),
                style:"fill:#bfbfbf;stroke:#7f7f7f;stroke-width:1;",
                class:'rails'
            });

            self.rails = rails;
            self.svgNode.appendChild(rails);


            ////////////

            var self = this;

            var khuynyushka = self._makeSVGElement("circle", {
                cx:8,
                cy:(self.height / 2),
                r:7,
                stroke:"black",
                'stroke-width':1,
                fill:"royalblue",
                class:'khuynyushka'
            });

            self.svgNode.appendChild(khuynyushka);

            self.khuynyushka = khuynyushka;


        },

        _makeSVGElement:function (tag, attrs) {

            var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var attr in attrs)
                element.setAttribute(attr, attrs[attr]);
            return element;


        },

        _createScrollContainer:function () {
            var self = this;

            var $scrollContainer = $('<div />');
            var cssMap = {
                height:self.$root.height() + 'px',
                width:self.settings.width + 'px',
                float:'left',
//                            backgroundColor: 'red',
                position:'relative',
                left:'-' + self.settings.width + 'px'
            };
            var attrMap = {
                class:'scrollContainer'
            };
            $scrollContainer.css(cssMap);
            $scrollContainer.attr(attrMap);

            self.$root.after($scrollContainer);

            self.$scrollbarContainer = $scrollContainer;


            ////////


            var $contentContainer = $('<div />');
            var cssMap = {
                height:self.$root.height() + 'px',
                position:'relative',
                top:"0px"

            };
            var attrMap = {
                class:'contentContainer'
            };
            $contentContainer.css(cssMap);
            $contentContainer.attr(attrMap);


            self.$root.wrapInner($contentContainer);

            self.$contentContainer = self.$root.children();

        },

        _lockDemention:function () {
            var self = this;

            self.$root.width(self.$root.width());
            self.$root.height(self.$root.height());

            self.height = self.$root.height();

        },

        _isScrollbar:function () {
            var self = this;
//
//            var height = self.$root.height();
//            var scrollHeight = self.root.scrollHeight;

            self.$root.scrollTop(1); // Сдвигаем контент на один пиксель вниз

            self.$root.css({  // При это поднимаем весь блок на пиксель вверх чтобы текст не дергался
                position:'relative',
                top:'-1px'
            });

            var isScrollbar = self.$root.scrollTop(); // Проверяем, сдвинулось ли

            self.$root.scrollTop(0); // Возвращаем контент на место

            self.$root.css({ // Блок тоже
                position:'relative',
                top:'0px'
            });

            return isScrollbar;

        },


        _bindHandlers:function () {
            var self = this;

            $(window).bind('resize.jumpscrollbar', self._test);


            $(self.khuynyushka).bind('mousedown.jumpscrollbar', function (e) {
                self._scrollingStart(e)
            });

            $(document).bind('mousemove.jumpscrollbar', function (e) {
                self._scrolling(e);
            });

            $(document).bind('mouseup.jumpscrollbar', function (e) {
                self._scrollingStop(e);
            });

            self.$root.bind('mousewheel.jumpscrollbar', function (e) {
                self._wheel(e);
            });

            self.$scrollbarContainer.bind('mousedown.jumpscrollbar', function (e) {
                self._toPosition(e);
            })


        },


        _toPosition:function (e) {
            var self = this;

            self.isScrollingInProcess = true;
            var e = e || window.event;


            self.khuynyushka.setAttribute("fill-opacity", "0.5");

            self.y = e.clientY;

            var cy = self.y - self.$root.offset().top;

//            console.log(cy);

            var maxTop = self.height - 7;
            var minTop = 0 + 7; // TODO: Магические числа - в констаты ( а лучше выводить из ширины )

            if (cy > minTop && cy < maxTop) {


                self.khuynyushka.setAttribute("cy",  cy);


                self.interval = setInterval(function () {
                    cy = parseInt(self.khuynyushka.getAttribute("cy"));
                    self._scrollContent(cy);

                }, 10);

            }

            e.preventDefault();


        },

        //$scrollbarContainer
        _wheel:function (e) {
            var self = this;

            // TODO: обратную связь в виде подергиваний хуйнюшки в сторону прокрутки


            e = e.originalEvent;

            var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;


            self.scroll -= delta * 40; // TODO: 40 - в опции

            var maxTop = self.scrollHeight - self.height;
            var minTop = 0;

            if (self.scroll > minTop && self.scroll < maxTop) {

                self.$contentContainer.css({
                    top:-self.scroll
                });

            }
            else if (self.scroll < minTop) {
                self.$contentContainer.css({
                    top:minTop
                });
                self.scroll = minTop;
            }
            else if (self.scroll > maxTop) {
                self.$contentContainer.css({
                    top:-maxTop
                });
                self.scroll = maxTop;
            }


            e.preventDefault();

        },


        _scrollingStart:function (e) {
            var self = this;
            self.isScrollingInProcess = true;
            var e = e || window.event;


            self.khuynyushka.setAttribute("fill-opacity", "0.5");

        var cy;

             self.interval = setInterval(function () {
                cy = parseInt(self.khuynyushka.getAttribute("cy"));
                self._scrollContent(cy);

            }, 10);

            e.preventDefault();
            self.y = e.clientY;
            e.cancelBubble = true;
            e.stopPropagation();
            return false;
        },

        _scrolling:function (e) {
            var self = this;
            var e = e || window.event;
            e.preventDefault();

            if (self.isScrollingInProcess === true) {


//                var dy = e.clientY - self.y;
//
//                self.y = e.clientY;
//
//                if (self.y < self.$root.offset().top + self.height - 7) {
//
//                    self._moveKhuynyushka(dy);
//                }


                //



                if (e.clientY < self.$root.offset().top + self.height - 7 &&
                    e.clientY > self.$root.offset().top + 7) {

                    var dy = e.clientY - self.y;

                    self.y = e.clientY;
                    self._moveKhuynyushka(dy);
                }


            }
            e.cancelBubble = true;
            e.stopPropagation();
            return false;

        },

        _moveKhuynyushka:function (dy) {
            var self = this,
                y;


            var cy = parseInt(self.khuynyushka.getAttribute("cy"));


            if (dy > 0) {
                if (cy <= (self.height - 10)) {
                    y = cy + dy;
                }
                else if (cy > (self.height - 8)) {
                    y = (self.height - 10);
                }
            } else if (dy < 0) {
                if (cy >= 10) {
                    y = cy + dy;
                }
                else if (cy < 8) {
                    y = 10;
                }
            }


            if (y) {
                self.khuynyushka.setAttribute("cy", y);
            }


        },

        _scrollContent:function (cy) {
            var self = this;

            var percent = self._definePercent(cy);
            var percentModule = Math.sqrt(percent * percent);

            //var v = ( percentModule * (self.scrollHeight) ) / 3000;


            var v = Math.pow(Math.E, percentModule * (Math.log(self.scrollHeight / 100) / 45));
            // а 60 это 100 с поправкой на хуй знает что
            // 45 это 50 с поправкой на пологость графика

            if (percent > 0) {


                self._executeNegScrolling(v);


            } else if (percent < 0) {
                self._executePosScrolling(v);
            }

            self.scroll =  -parseInt(self.$contentContainer.css("top"));


        },

        _executeNegScrolling:function (v) {
            var self = this;

            var maxTop = self.scrollHeight - self.height;

            var top = parseInt(self.$contentContainer.css("top")) * -1;

            if (top < maxTop) {

                self.$contentContainer.css({
                    top:"-=" + v
                });

            }

            else {
                self.$contentContainer.css({
                    top:-maxTop
                });
                // тут можно колбечить функцию по завершению скроллинга, например

            }
        },

        _executePosScrolling:function (v) {
            var self = this;

            var minTop = 0;

            var top = parseInt(self.$contentContainer.css("top")) * -1;

            if (top > minTop) {

                self.$contentContainer.css({
                    top:"+=" + v
                });

            }

            else {
                self.$contentContainer.css({
                    top:0
                });
                // тут можно колбечить функцию по завершению скроллинга, например
            }
        },

        _definePercent:function (y) {
            var self = this;

            return ( ( y * 100 ) / self.height ) - 50;
        },

        _scrollingStop:function (e) {
            var self = this;
            self.isScrollingInProcess = false;
            var e = e || window.event;

            self._returnKhuynyushka();

            clearInterval(self.interval);

            e.preventDefault();
            e.cancelBubble = true;
            e.stopPropagation();
            return false;
        },

        _returnKhuynyushka:function () {
            var self = this;


            var cy = parseInt(self.khuynyushka.getAttribute("cy"));

            while (cy != self.height / 2) {

                if (cy > self.height / 2) {
                    cy--;

                }
                else {
                    cy++;

                }
//                self.khuynyushka.setAttribute("cy", cy);

            }
            self.khuynyushka.setAttribute("cy", cy);

            self.khuynyushka.setAttribute("fill-opacity", "1");


        },


        _test:function () {
            var self = this;


        }



    };

})(jQuery);