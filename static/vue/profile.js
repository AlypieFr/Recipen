Vue.component("main-profile", {
    extends: Basic,
    template: `
        <v-container fill-height>
        <v-layout row wrap>
          <v-flex class="text-xs-center">
            <v-card column class="mx-auto">
              <v-card-title>
                {{ tr("User profile") }}
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                >
                  <v-text-field
                    v-model="user.name"
                    :counter="50"
                    :rules="[rules.required, rules.nameLength]"
                    :label="tr('Name')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.email"
                    :counter="100"
                    :rules="[rules.required, rules.mailLength, rules.mailValid]"
                    :label="tr('E-mail')"
                    disabled
                  ></v-text-field>
                  <v-text-field
                    v-model="oldPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.requiredIfPwd, rules.passwordLength]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="tr('Current password')"
                    :hint="tr('At least 12 characters')"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.passwordLength, rules.passwordChange]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="tr('New password')"
                    :hint="tr('At least 12 characters')"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    v-model="passwordConf"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.requiredIfPwd, rules.passwordMatch, rules.passwordLength]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="tr('New password (confirmation)')"
                    :hint="tr('At least 12 characters')"
                    counter
                    @click:append="show2 = !show2"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn v-blur
                  small
                  style="margin-left: 10px; margin-right: 10px; margin-bottom: 10px;"
                  @click="send"
                >
                  {{ tr('Send changes') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        </v-container>
    `,
    data() { return {
        oldPassword: "",
        password: "",
        passwordConf: "",
        show1: false,
        show2: false,
        user: {
            "email": "",
            "name": "",
        },
        rules: {
            required: v => !!v || tr('Field required'),
            requiredIfPwd: v => ((!this.password || !!v) || tr('Field required')),
            mailValid: v => (/.+@.+\..+/.test(v) || tr("E-mail must be valid")),
            nameLength: v => ((v && v.length <= 50) || tr('Name must be less than 50 characters')),
            mailLength: v => ((v && v.length <= 100) || tr('E-mail must be less than 50 characters')),
            passwordLength: v => (!v || v.length >= 12 || tr('Min 12 characters')),
            passwordMatch: v => (v === this.password || tr("Passwords does not match")),
            passwordChange: v => ((!v ||v !== this.oldPassword) || tr("New password must be different from the old one"))
        },
        valid: false,
    }},
    methods: {
        send() {
            this.$refs.form.validate();
            window.setTimeout(() => {  // To ensure validation is done before
                if (this.valid) {
                    session.post("/panel/profile", {
                        name: this.user.name,
                        email: this.user.email,
                        password: this.oldPassword,
                        new_password: this.password
                    },
                    response => {
                        eventBus.$emit("notifSuccess", response.data.message);
                        eventBus.$emit("userChange", {
                            name: this.user.name
                        })
                    });
                }
            }, 0);
        }
    },
    mounted() {
        session.get("/panel/data/userinfo", {}, response => {
            this.user = response.data;
        }, tr("Unable to get user infos. Please try again later"))
    }
});