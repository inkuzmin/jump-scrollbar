/**
 * Created with JetBrains PhpStorm.
 * User: inkuzmin
 * Date: 7/27/12
 * Time: 4:39 AM
 */

(function ($) {

    var methods = {
        init:function (options) {

            var settings = $.extend({
                'width':'14',
                'rander':'raphael' // raphael, native_svg, css_without_images, css_with_images
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
                self._randerJumpscrollbar();

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

        _randerJumpscrollbar:function () {
            var self = this;

            if (self.settings.rander === "raphael") {
                self._randerRaphaelScrollbar();
            }
            else if (self.settings.rander === "native_svg") {
                // Do some stuff
            }
            else {
                // Do some more stuff
            }

        },


        _randerRaphaelScrollbar:function () {
            var self = this;

            var $scrollContainer = self._createScrollContainer();

            var paper = Raphael($scrollContainer[0], '100%', '100%');




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

            return $scrollContainer;
        },

        _lockDemention:function () {
            var self = this;

            self.$root.width(self.$root.width());
            self.$root.height(self.$root.height());

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


        },

        _test:function () {
            var self = this;

            console.log(1);
        }



    };

})(jQuery);