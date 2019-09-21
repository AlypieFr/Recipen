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

init = function(locale, email_hash=null, name=null, dark=true, show_search=true, role="basic") {
    LANG = locale;
    eventBus = new Vue();
    dark = dark !== null && dark !== undefined && dark !== "false" && dark !== "False";
    show_search = show_search !== null && show_search !== undefined && show_search !== "false"
        && show_search !== "False";
    app = new Vue({
        vuetify: new Vuetify({
            theme: {
               dark: dark === true || dark === "True",
            }
        }),
        delimiters: ['((', '))'],
        el: '#app',
        data: {
            dark: true,
            email_hash: email_hash,
            user_role: role,
            loadings: 0,
            logged: email_hash && email_hash !== "None" && email_hash !== "null" && email_hash !== "none",
            message_alert: null,
            name: name,
            show_search: show_search,
            search: false,
            searchFieldColor: dark ? "white": "black",
            searchText: "",
            show_alert: false,
            snackbar: false,
            snackbar_color: "info",
            snackbar_message: null,
            snackbar_multiline: false,
            type_alert: "error",
            windowSize: {
              x: 0,
              y: 0
            },
            menu: false,
        },
        computed: {
            user_role_name() {
                switch (this.user_role) {
                    case "admin":
                        return tr("Admin")
                    case "moderator":
                        return tr("Moderator")
                    case "editor":
                        return tr("Editor")
                    default:
                        return tr("Simple user")
                }
            },
            avatar_src() {
                return 'https://www.gravatar.com/avatar/' + email_hash +
                    '?default=http://www.flo-art.fr/static/images/account-' + (dark ? '-dark' : '') + '.png';
            }
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
                if (this.search) {
                    setTimeout(function () {
                        $("#search").focus();
                    }, 10);
                }
                else {
                    $("#btn-search").blur();
                }
            },
            launchSearch() {
                console.log("Searching for " + this.searchText + "...");
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