/**
 * Created with JetBrains PhpStorm.
 * User: inkuzmin
 * Date: 7/27/12
 * Time: 4:39 AM
 */

var a;

(function( $ ) {

    var methods = {
        init: function( options ) {

            var settings = $.extend( {
                'test1': '1',
                'test2': '2'
            }, options);


            return this.each(function() {

                var $this = $(this),
                    data = $this.data('jumpscrollbar');

                if ( !data ) {
                    // some setup stuff
                    $this.data('jumpscrollbar', {
                        'test3' : 1
                    })

                }

                $( this ).data('jumpscrollbar', new Scrollbar( {
                    'root':    $this,
                    'settings': settings
                } ) );

//                $(window).bind('resize.jumpscrollbar', methods.update);

            });

        },

        destroy: function( ) {

            return this.each(function(){

                var $this = $(this),
                    data = $this.data('jumpscrollbar');


                $(window).unbind('.jumpscrollbar');
                $this.removeData('jumpscrollbar');

            });
        },

        update: function(  ) {
            return this.each( function() {
                var $this = $(this),
                    data = $this.data('jumpscrollbar');

                data.update();
            });

        }
    };


    $.fn.jumpscrollbar = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method == 'object' || !method ) {
            return methods.init.apply( this, arguments );
        }
        else {
            $.error( 'Method ' + method + 'does not exist on jQuery.jumpscrollbar' );
        }
    };




    function Scrollbar( options ) {
        var self = this;

        self._obtainOptions( options );
        self._init();

    }

    Scrollbar.prototype = {

        constructor:Scrollbar,

        _obtainOptions:function (options) {
            var self = this;

            self.options = {};

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

        _initVars:function() {
            var self = this;

            self.root = self.options.root;
            self.settings = self.options.settings;


        },

        update:function() {
            var self = this;



        },

        _bindHandlers: function() {
            var self = this;

            $(window).bind('resize.jumpscrollbar', self._test);


        },

        _test: function() {
            var self = this;

            console.log(1);
        }



    };

} ) (jQuery);