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

init = function(locale, email_hash=null, name=null, dark=true, show_search=true, role="basic", page=null) {
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
            navForceOpen: null,
            navOpen: true,
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
            page: page
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
            showHideMenu() {
                if (this.navForceOpen === null) {
                    this.navForceOpen = false;
                    this.navOpen = false;
                }
                else {
                    this.navForceOpen = !this.navForceOpen;
                    this.navOpen = this.navForceOpen;
                }
            },
            onResize () {
              this.windowSize = { x: window.innerWidth, y: window.innerHeight }
            },
            isPage(page) {
                return page === this.page || page === this.page + "/" || page + "/" === this.page
            },
            setPage(page, keep_history=false) {
                console.log("set page");
                this.page = page;
                session.get("/data/page_title", {endpoint: page}, response => {
                    let title = response.data.title;
                    document.title = title;
                    if (keep_history) {
                        window.history.replaceState("", title, page);
                    } else {
                        window.history.pushState("", title, page);
                    }
                });
            }
        },
        mounted() {
          let vm = this;
          let $this = this;
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
          $(window).on('popstate', function() {
              $this.setPage(window.location.pathname, true);
          });
          this.onResize();
        },
        created() {
            let $this = this;
            // Alert events:
            eventBus.$on('alertInfo', (message) => {
                this.alertInfo(message);
            });
            eventBus.$on('alertError', (message) => {
                this.alertError(message);
            });
            eventBus.$on('alertWarn', (message) => {
                this.alertWarn(message);
            });
            eventBus.$on('alertSuccess', (message) => {
                this.alertSuccess(message);
            });
            // Notification events:
            eventBus.$on('notifInfo', (message) => {
                this.notifInfo(message);
            });
            eventBus.$on('notifError', (message) => {
                this.notifError(message);
            });
            eventBus.$on('notifWarn', (message) => {
                this.notifWarn(message);
            });
            eventBus.$on('notifSuccess', (message) => {
                this.notifSuccess(message);
            });
            eventBus.$on('startLoading', () => {
                console.debug("Start loading");
                this.loadings += 1;
            });
            eventBus.$on('stopLoading', () => {
                console.debug("Stop loading");
                this.loadings -= 1;
            });
            eventBus.$on("userChange", (user) => {
                console.log("User change");
                this.name = user.name;
            })
        },
    });
};