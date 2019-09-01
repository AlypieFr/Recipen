Vue.component("main-login", {
    extends: Basic,
    //language=Vue template
    template: `
      <v-container fill-height>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-card column max-width="500px" class="mx-auto" style="margin-top: -100px;">
              <v-card-title>
                <v-icon>mdi-login</v-icon>&nbsp;&nbsp;{{ tr("Login", "title") }}
              </v-card-title>
              <form action='login' method='POST'>
                <v-card-text>
                  <v-text-field :label='tr("E-mail")' type='text' name='email' id='email' v-model="login"></v-text-field>
                  <v-text-field :label='tr("Password")' type='password' name='password' id='password'></v-text-field>
                </v-card-text>
                <input type="hidden" name="after" :value="after !== null ? after : '/'"/>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type='submit' name='submit'>{{ tr("Connexion") }}</v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    `,
    props: {
        email: {
            type: String,
            required: false
        },
        after: {
            type: String,
            required: false,
            default: "/"
        }
    },
    data() { return {
        login: this.username
    }}
});
