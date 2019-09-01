Vue.component("main-register", {
    extends: Basic,
    template: `
        <v-container fill-height>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-card column max-width="500px" class="mx-auto">
              <v-card-title>
                {{ tr("Register") }}
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="name"
                    :counter="50"
                    :rules="[rules.required, rules.nameLength]"
                    :label="tr('Name')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    :counter="100"
                    :rules="[rules.required, rules.mailLength, rules.mailValid]"
                    :label="tr('E-mail')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="emailConf"
                    :counter="100"
                    :rules="[rules.required, rules.mailMatch, rules.mailLength]"
                    :label="tr('E-mail (confirmation)')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.passwordLength]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="tr('Password')"
                    :hint="tr('At least 12 characters')"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    v-model="passwordConf"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.passwordMatch, rules.passwordLength]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="tr('Password (confirmation)')"
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
                  {{ tr('Send') }}
                </v-btn>
                <v-btn v-blur
                  small
                  style="margin-bottom: 10px;"
                  @click="clear"
                >
                  {{ tr('Clear') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        </v-container>
    `,
    data() { return {
        name: "",
        email: "",
        emailConf: "",
        password: "",
        passwordConf: "",
        show1: false,
        show2: false,
        rules: {
            required: value => !!value || tr('Field required'),
            mailValid: v => (/.+@.+\..+/.test(v) || tr("E-mail must be valid")),
            mailMatch: v => (v === this.email || tr("E-mails does not match")),
            nameLength: v => ((v && v.length <= 50) || tr('Name must be less than 50 characters')),
            mailLength: v => ((v && v.length <= 100) || tr('E-mail must be less than 50 characters')),
            passwordLength: v => (v && v.length >= 12 || tr('Min 12 characters')),
            passwordMatch: v => (v === this.password || tr("Passwords does not match"))
        },
        valid: true,
    }},
    methods: {
        send() {
            this.$refs.form.validate();
            if (this.valid) {
                session.post("/register", {
                    name: this.name,
                    email: this.email,
                    password: this.password
                },
                response => {console.log(response);});
            }
        },
        clear() {
            this.$refs.form.reset();
        }
    }
});