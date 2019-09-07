Vue.use(Vuetify);

let app;
let eventBus;

Vue.prototype.tr = function(message, context = null) {
    return tr(message, context);
};

Vue.directive('blur', {
  inserted: function (el) {
    el.onfocus = (ev) => ev.target.blur()
  }
});

(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      return el.apply(this, arguments);
    };
  });
})(jQuery);

init = function(locale, dark=true) {
    LANG = locale;
    eventBus = new Vue();
    app = new Vue({
        vuetify: new Vuetify({
            theme: {
               dark: dark,
            }
        }),
        delimiters: ['((', '))'],
        el: '#app',
        data: {
            show_alert: false,
            message_alert: null,
            type_alert: "error",
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
            },
            snackbar: false,
            snackbar_message: null,
            snackbar_color: "info",
            snackbar_multiline: false,
            loadings: 0,
        },
        methods: {
            alert(message, type_message) {
                this.show_alert = true;
                this.message_alert = message;
                this.type_alert = type_message;
            },
            alertError(message) {
                this.alert(message, "error");
            },
            alertWarn(message) {
                this.alert(message, "warning");
            },
            alertInfo(message) {
                this.alert(message, "info");
            },
            alertSuccess(message) {
                this.alert(message, "success");
            },
            notif(message, type_message) {
                this.snackbar_color = type_message;
                this.snackbar_message = message;
                this.snackbar = true;
            },
            notifError(message) {
                this.notif(message, "error");
            },
            notifWarn(message) {
                this.notif(message, "warning");
            },
            notifInfo(message) {
                this.notif(message, "info");
            },
            notifSuccess(message) {
                this.notif(message, "success");
            },
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
        created() {
            let $this = this;
            // Alert events:
            eventBus.$on('alertInfo', function (message) {
                this.alertInfo(message);
            }.bind(this));
            eventBus.$on('alertError', function (message) {
                this.alertError(message);
            }.bind(this));
            eventBus.$on('alertWarn', function (message) {
                this.alertWarn(message);
            }.bind(this));
            eventBus.$on('alertSuccess', function (message) {
                this.alertSuccess(message);
            }.bind(this));
            // Notification events:
            eventBus.$on('notifInfo', function (message) {
                this.notifInfo(message);
            }.bind(this));
            eventBus.$on('notifError', function (message) {
                console.log("NOTIF ERROR", message);
                this.notifError(message);
            }.bind(this));
            eventBus.$on('notifWarn', function (message) {
                this.notifWarn(message);
            }.bind(this));
            eventBus.$on('notifSuccess', function (message) {
                this.notifSuccess(message);
            }.bind(this));
            eventBus.$on('startLoading', function () {
                console.log("start");
                $this.loadings += 1;
            });
            eventBus.$on('stopLoading', function () {
                console.log("stop");
                $this.loadings -= 1;
            });
        },
    });
};