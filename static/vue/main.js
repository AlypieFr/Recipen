let app;
Vue.use(Vuetify);

(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      return el.apply(this, arguments);
    };
  });
})(jQuery);

init = function(dark=true) {
    app = new Vue({
    vuetify: new Vuetify({
        theme: {
           dark: dark,
        }
    }),
    delimiters: ['((', '))'],
    el: '#app',
    data: {
        message: 'Hello Vue!',
        dark: true,
        search: false,
        searchText: "",
        searchFieldColor: dark ? "white": "black",
        searchLaunched: false,
        menuItems: [
            {title: "Home", icon: "mdi-news"},
            {title: "Recipes", icon: "mdi-news"},
        ],
        windowSize: {
          x: 0,
          y: 0
        }
    },
    methods: {
        showHideSearch() {
            this.searchText = "";
            this.search = !this.search;
            setTimeout(function() {$("#search").focus();}, 10);
        },
        launchSearch() {
            console.log("Searching for " + this.searchText + "...");
            this.searchLaunched = true;
        },
        searchBoxBlur() {
            if (this.searchText === '' || this.searchText === null) {
                this.search = false;
            } else if(!this.searchLaunched) {
                this.launchSearch()
            }
        },
        onResize () {
          this.windowSize = { x: window.innerWidth, y: window.innerHeight }
        }
    },
    mounted() {
      let vm = this;
      window.addEventListener('keydown', function(e) {
          // If down arrow was pressed...
          if (e.ctrlKey && e.code === "KeyF") {
              e.preventDefault();
              if (!vm.search) {
                  vm.showHideSearch();
              } else {
                  $("#search").focus();
                  $("#search").select();
              }
          }
      });
      this.onResize();
    },
    });
};