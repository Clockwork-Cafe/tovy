<template>
  <div>
    <v-container>
      <p class="text-h4 font-weight-bold mt-14">Settings</p>
    </v-container>
    <v-container class="= mx-auto">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-palette
            </v-icon>
            <v-expansion-panel-header> Customization </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="ml-2">Theme Color</p>
            <v-row class="ml-2 mb-2" wrap>
              <v-sheet
                v-for="color in colors"
                :key="color.value"
                class="mt-1"
                width="48"
                height="48"
                :color="color.value"
                @click="select(color)"
                :class="`rounded-circle ${color.selected ? 'selectedcolor' : null} mr-2`"
                elevation="0"
              >
              </v-sheet
            ></v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-cookie
            </v-icon>
            <v-expansion-panel-header> Ranking </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <v-card :loading="ranking.loading" v-if="!ranking.id" class="m-6" outlined>
              <v-card-title> Not logged in! </v-card-title>
              <p class="ml-4 mt-n6 grey--text">
                Please enter your roblox secuirty token below
              </p>
              <v-text-field
                v-model="ranking.cookie"
                hide-details="auto"
                outlined
                class="mx-4 mt-n1"
                label=".ROBLOSECURITY"
              >
              </v-text-field>
              <v-btn class="ml-4 mt-3 mb-4" @click="setcookie" elevation="0" color="info">
                Set cookie
              </v-btn></v-card
            >

            <v-card v-if="ranking.id" :loading="ranking.loading" class="m-6" outlined>
              <v-card-title> Logged in! </v-card-title>
              <v-card class="mx-4" outlined>
                <v-layout v-if="!loading" class="">
                  <v-avatar
                    class="my-auto rounded-l mr-3"
                    :color="$store.state.group.color"
                    size="80"
                    tile
                  >
                    <v-img :src="ranking.pfp"></v-img>
                  </v-avatar>
                  <div class="my-auto">
                    <p class="text-h4 my-auto font-weight-bold">
                      {{ ranking.username }}
                    </p>
                  </div></v-layout
                ></v-card
              >
              <p class="ml-4 mt-4 grey--text">
                You can enter your ROBLOSECURITY token below if you wish to update it
              </p>
              <v-text-field
                v-model="ranking.cookie"
                hide-details="auto"
                outlined
                class="mx-4 mt-n2"
                label=".ROBLOSECURITY"
              >
              </v-text-field>
              <v-btn class="ml-4 mt-3 mb-6" elevation="0" @click="setcookie" color="info">
                Set cookie
              </v-btn></v-card
            >
            <div v-if="ranking.id">
              <v-btn @click="downlodrloader" class="mt-3" elevation="0" color="info">
                Download module
              </v-btn>
              <v-btn @click="copykey" class="ml-1 mt-3" elevation="0" color="error">
                Copy API key
              </v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-wall
            </v-icon>
            <v-expansion-panel-header> Wall </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="">
              Tovy group wall is a customisable wall that can be used to display
              information about your group.
            </p>

            <v-switch
              @change="setwall"
              v-model="wall.sync"
              class="mt-n3"
              label="Sync with group shout"
            ></v-switch>
            <p class="" v-if="wall.enabled">
              The discord webhook synces the wall with a discord webhook leave blank if
              you want to disable
            </p>
            <v-text-field
              v-model="wall.discordhook"
              @keydown.enter="setwall"
              hide-details="auto"
              outlined
              class="mt-n2 mb-3"
              hint="Press enter to save"
              label="Discord webhook"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-webhook
            </v-icon>
            <v-expansion-panel-header> Webhook proxy </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="">
              If enabled this lets you proxy discord webhooks though our server (allows
              you to use webhooks in roblox)
            </p>
            <v-switch v-model="other.proxy" @change="setproxy" label="Enabled?">
            </v-switch>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-shield-check
            </v-icon>
            <v-expansion-panel-header> Tovy Registry </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="">
              Enroll your group with tovy to allow support staff to easily pull up data
              about your instance and let us know who uses tovy.
            </p>
            <v-switch v-model="other.tovyr" @change="setreg" label="Enabled?">
            </v-switch>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-clipboard
            </v-icon>
            <v-expansion-panel-header> Sessions </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="">
              If enabled this lets you proxy discord webhooks though our server (allows
              you to use webhooks in roblox)
            </p>
            <v-switch v-model="sessions.enabled" @change="setsessions" label="Enabled?" />
            <v-card v-if="sessions.enabled" outlined class="mb-5">
              <v-card-title> Games </v-card-title>
              <div class="mb-4 px-4 mt-n6 py-7">
                <v-row class="px-3">
                  <v-btn class="success elevation-0" @click="pushgame"> New game </v-btn>
                  <v-btn class="ml-auto info elevation-0" @click="setsessions">
                    Save
                  </v-btn></v-row
                >
                <v-row v-for="(game, i) in sessions.games" :key="i" class="mb-n14">
                  <v-col cols="6">
                    <v-select
                      outlined
                      label="Game"
                      item-text="name"
                      item-value="id"
                      v-model="game.id"
                      :items="games"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      outlined
                      label="Type"
                      v-model="game.type"
                      :items="games"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <div>
                      <v-btn icon class="mt-2 mx-auto" @click="delgame(game)">
                        <v-icon> mdi-delete </v-icon></v-btn
                      >
                    </div>
                  </v-col></v-row
                >
              </div></v-card
            >
            <v-text-field
              label="Webhook"
              v-if="sessions.enabled"
              hide-details="auto"
              hint="Press enter to save"
              @keydown.enter="setsessions"
              v-model="sessions.discohook"
              outlined
            >
            </v-text-field>

            <v-text-field
              label="Prefix to message (eg ping)"
              class="mt-2"
              v-if="sessions.enabled && sessions.discohook.length"
              hide-details="auto"
              hint="Press enter to save (leave blank for none)"
              @keydown.enter="setsessions"
              v-model="sessions.discoping"
              outlined
            >
            </v-text-field>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-list-status
            </v-icon>
            <v-expansion-panel-header> Roles </v-expansion-panel-header>
          </v-layout>
          <v-expansion-panel-content>
            <v-btn color="success" elevation="0" @click="newrole" class="ml-auto">
              New role
            </v-btn>
            <v-btn color="info" elevation="0" @click="updateroles" class="float-right">
              Save
            </v-btn>

            <v-expansion-panels class="mt-4">
              <v-expansion-panel v-for="role in roles" :key="role.id">
                <v-expansion-panel-header>
                  {{ role.name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-text-field label="Name" v-model="role.name" outlined> </v-text-field>
                  <div
                    v-for="permission in permissions"
                    :key="permission.id"
                    class="mt-n9"
                  >
                    <v-row class="mx-1 pt-n2">
                      <v-switch
                        @change="(e) => setperm(role, permission.value, e)"
                        :input-value="isperm(role, permission)"
                        class=""
                      >
                      </v-switch>
                      <p class="my-auto ml-auto">
                        {{ permission.name }}
                      </p></v-row
                    >
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-account-multiple
            </v-icon>
            <v-expansion-panel-header> Users </v-expansion-panel-header>
          </v-layout>
          <v-expansion-panel-content>
            <v-progress-linear
              indeterminate
              rounded
              v-if="adduser.loading"
              class="mb-2"
            ></v-progress-linear>
            <v-text-field
              ref="form"
              v-model="adduser.username"
              dense
              :disabled="adduser.loading"
              outlined
              @input="adduser.invalidusername = false"
              :rules="[
                (v) => !!v || 'Username is required',
                (v) => !v.includes(' ') || 'Username cannot contain spaces',
                (v) => !adduser.invalidusername || 'Invalid username',
                (v) => !users.find((u) => u.username === v) || 'Username already exists',
              ]"
              label="Name"
              class="mb-n1"
              hint="Press enter to add"
              @keyup.enter="createuser"
              required
            ></v-text-field>
            <v-card v-for="user in users" :key="user.userid" outlined class="mb-2">
              <v-layout>
                <v-card-title> {{ user.username }} </v-card-title>
                <v-spacer> </v-spacer>
                <v-menu left bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="adduser.loading"
                      plain
                      class="my-auto mr-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ roles.find((r) => r.id === parseInt(user.role || 1)).name }}
                      <v-icon class="ml-1" right dark> mdi-menu-down </v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="role in roles"
                      :key="role.id"
                      @click="updateuserroles(user, role)"
                    >
                      <v-list-item-title>{{ role.name }}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="deleteuser(user, 'delete')">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-layout></v-card
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-playlist-plus
            </v-icon>
            <v-expansion-panel-header> Invites </v-expansion-panel-header>
          </v-layout>
          <v-expansion-panel-content>
            <v-btn color="success" elevation="0" :disabled="!sroles.length" @click="createnewinvite" class="ml-auto">
              New invite
            </v-btn>
            <v-btn color="info" elevation="0" @click="updateinvites" class="float-right">
              Save
            </v-btn>
            <v-progress-linear
              indeterminate
              rounded
              v-if="roleconfig.loading"
              class="mb-2"
            ></v-progress-linear>
            <v-card v-for="invite in invites" :key="invite.code" outlined class="mt-3">
              <v-layout>
                <v-card-title> {{ host }}/invite/{{ invite.code }} </v-card-title>
                <v-spacer> </v-spacer>
                <v-menu left bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="roleconfig.loading"
                      plain
                      class="my-auto mr-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ sroles.find((r) => r.id === invite.role).name }}
                      <v-icon class="ml-1" right dark> mdi-menu-down </v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="role in sroles"
                      :key="role.id"
                      @click="invite.role = role.id"
                    >
                      <v-list-item-title>{{ role.name }}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="invites.splice(invites.indexOf(invite), 1)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-layout></v-card
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-timer
            </v-icon>
            <v-expansion-panel-header> Tovy loader </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="ml-2">Minimum activity rank settings (roles from linked roblox group)!</p>
            <v-select
              @change="(v) => setgrole(v)"
              v-model="roleconfig.arole"
              :items="groles"
              outlined
              item-value="rank"
              item-text="name"
            >
            </v-select>
            <v-divider></v-divider>
            <v-btn @click="downlodloader" color="info mt-2"> Download loader </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-clipboard
            </v-icon>
            <v-expansion-panel-header> Notice management </v-expansion-panel-header>
          </v-layout>

          <v-expansion-panel-content>
            <p class="">Inactivity notice policy</p>
            <v-text-field
              outlined
              hide-details="auto"
              v-model="notice.text"
              class="mt-n2"
              label="Inactivity notice"
              placeholder="You have 50 days off"
            />

            <v-divider></v-divider>
            <v-btn @click="setpolicy" color="info mt-2"> Save </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-layout>
            <v-icon size="22" :color="this.$store.state.group.color" class="ml-3 mr-n5">
              mdi-cloud-upload
            </v-icon>
            <v-expansion-panel-header> Update </v-expansion-panel-header>
          </v-layout>
          <v-expansion-panel-content>
            <p>Update this Tovy instance</p>
            <v-btn @click="update" color="info"> Update </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-snackbar v-model="toast.visible">
      {{ toast.message }}

      <template v-slot:action="{ attrs }">
        <v-btn :color="toast.color" text v-bind="attrs" @click="toast.visible = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    drawer: true,
    loading: false,
    valid: true,
    wall: {
      enabled: false,
      sync: false,
      discordhook: "",
    },
    sessions: {
      games: [],
      discohook: "",
      discoping: "",
      wall: false,
      enabled: false,
    },
    ranking: {
      cookie: "",
      username: "",
      pfp: "",
      id: 0,
      loading: false,
    },
    roleconfig: {
      loading: false,
      arole: 1,
    },
    adduser: {
      username: "",
      invalidusername: false,
      loading: false,
    },
    other: {},
    notice: {
      text: "",
    },
    users: [],
    toast: {
      message: "",
      color: "success",
      visible: false,
    },
    permissions: [
      {
        name: "View staff activity",
        value: "view_staff_activity",
      },
      {
        name: "Manage bans",
        value: "manage_bans",
      },
      {
        name: "Admin",
        value: "admin",
      },
      {
        name: "Manage notices",
        value: "manage_notices",
      },
      {
        name: "Manage tasks",
        value: "manage_tasks",
      },
      {
        name: "Manage staff activity",
        value: "manage_staff_activity",
      },
      {
        name: "Update shout",
        value: "update_shout",
      },
      {
        name: "Post on wall",
        value: "post_on_wall",
      },
      {
        name: "Host sessions",
        value: "host_sessions",
      },
    ],
    invites: [],

    host: location.host,
    roles: [],
    groles: [],
    games: [],
    sroles: [],
    colors: [
      "red darken-2",
      "pink",
      "purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
      "grey",
      "grey lighten-2",
    ],
    groups: "dog",
  }),
  components: {},
  mounted: function () {
    if (!this.$store.state.user.perms.includes("admin")) {
      this.$router.push(`/`);
      return;
    }
    let c = this.colors;
    c;
    this.colors = this.colors.map((color) => ({
      value: color,
      selected: this.$store.state.group.color == color,
    }));

    this.$http.get("/settings/roles", { withCredentials: true }).then((response) => {
      this.roles = response.data.roles;
      this.sroles = response.data.roles;
    });

    this.$http.get("/settings/invites", { withCredentials: true }).then((response) => {
      this.invites = response.data.invites;
    });

    this.$http.get("/settings/groles", { withCredentials: true }).then((response) => {
      this.groles = response.data.roles;
      this.arole = response.data.currole;
    });

    this.$http.get("/settings/users", { withCredentials: true }).then((response) => {
      this.users = response.data.users.filter((u) => u.role);
    });

    this.$http.get("/settings/other", { withCredentials: true }).then((response) => {
      this.other = response.data.config;
      this.roleconfig.arole = response.data.config.role;
      this.games = response.data.config.groupgames;
      console.log(response.data.config);
      if (response.data.config.noticetext) {
        console.log("ua");
        this.notice.text = response.data.config.noticetext;
      }

      if (response.data.config.sessions) {
        this.sessions = response.data.config.sessions;
      }

      if (response.data.config.ranking) {
        this.ranking = {
          cookie: "",
          username: response.data.config.ranking.username,
          pfp: response.data.config.ranking.pfp,
          id: response.data.config.ranking.uid,
          apikey: response.data.config.ranking.apikey,
          loading: false,
        };
      }
      if (response.data.config.wall) this.wall = response.data.config.wall;
    });
  },
  methods: {
    goto: function (url) {
      this.$router.push(url);
    },
    update: function () {
      this.loading = true;
      this.$http.post("/settings/update", {
        withCredentials: true,
        data: {
          wall: this.wall,
          sessions: this.sessions,
          ranking: this.ranking,
          roleconfig: this.roleconfig,
          other: this.other,
          notice: this.notice,
        },
      }).then(() => {
        this.loading = false;
        this.toast.message = "Tovy updated";
        this.toast.color = "success";
        this.toast.visible = true;  
      });
    },
    copykey: function () {
      navigator.clipboard.writeText(this.ranking.apikey);
      this.toast.message = `Copied the api key to clipboard`;
      this.toast.visible = true;
    },
    setcookie: function () {
      this.ranking.loading = true;
      this.$http
        .post(
          "/settings/setcookie",
          { cookie: this.ranking.cookie },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.ranking = {
              cookie: "",
              apikey: r.data.info.apikey,
              username: r.data.info.username,
              pfp: r.data.info.pfp,
              id: r.data.info.uid,
              loading: false,
            };
            this.toast.message = `Logged in as ${r.data.info.username}`;
            this.toast.visible = true;
          },
          (err) => {
            this.ranking.loading = false;

            err;
            this.toast.message = "Error logging in! Did you enter the right cookie?";
            this.toast.visible = true;
          }
        );
    },
    setpolicy: function () {
      this.$http
        .post(
          "/settings/setpolicy",
          { text: this.notice.text },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.toast.message = "Notice policy updated!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error updating notice policy!";
            this.toast.visible = true;
          }
        );
    },
    pushgame: function () {
      this.sessions.games.push({ id: 0, type: "" });
    },
    delgame: function (game) {
      this.sessions.games.splice(this.sessions.games.indexOf(game), 1);
    },
    setwall: function () {
      this.$http
        .post("/settings/setwall", { settings: this.wall }, { withCredentials: true })
        .then(
          (r) => {
            r;
            this.toast.message = "Wall updated!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error updating wall!";
            this.toast.visible = true;
          }
        );
    },
    setsessions: function () {
      this.$http
        .post(
          "/settings/setsessions",
          { settings: this.sessions },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.toast.message = "Sessions updated!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error updating sessions!";
            this.toast.visible = true;
          }
        );
    },
    setproxy: function () {
      this.$http
        .post(
          "/settings/setproxy",
          { enabled: this.other.proxy },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.toast.message = "Proxy updated!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error updating proxy!";
            this.toast.visible = true;
          }
        );
    },
    setreg: function () {
      this.$http
        .post("/settings/settr", { enabled: this.other.tovyr }, { withCredentials: true })
        .then(
          (r) => {
            r;
            this.toast.message = "Registry updated!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error updating Registry!";
            this.toast.visible = true;
          }
        );
    },
    downlodloader: function () {
      window.open(this.$http.defaults.baseURL + "/settings/loader");
    },
    downlodrloader: function () {
      window.open(this.$http.defaults.baseURL + "/settings/rloader");
    },
    downloadbloader: function () {
      window.open(this.$http.defaults.baseURL + "/settings/bloader");
    },
    isperm: function (role, perm) {
      return role.permissions.includes(perm.value);
    },
    setgrole: function (role) {
      this.$http
        .post("/settings/setgrouprole", { role: role }, { withCredentials: true })
        .then(
          (r) => {
            r;
            this.toast.message = "Set role!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error setting role!";
            this.toast.visible = true;
          }
        );
    },
    setperm: function (role, perm, value) {
      if (value) {
        role.permissions.push(perm);
      } else {
        role.permissions.splice(role.permissions.indexOf(perm), 1);
      }
    },
    createuser: function () {
      this.adduser.loading = true;
      this.$http
        .post(
          "/settings/adduser",
          { username: this.adduser.username },
          { withCredentials: true }
        )
        .catch((err) => {
          if (err.response.status == 400) {
            this.adduser.invalidusername = true;
            this.$refs.form.validate();
            this.toast.message = "Error adding user!";
            this.toast.visible = true;
            this.adduser.loading = false;
          }
        })
        .then((r) => {
          if (!r) return;
          this.toast.message = "Added user!";
          this.toast.visible = true;
          this.users.push({
            username: this.adduser.username,
            role: 1,
            userid: r.data.uid,
          });

          this.adduser.loading = false;
        });
    },
    updateroles: function () {
      this.$http
        .post("/settings/updateroles", { roles: this.roles }, { withCredentials: true })
        .then(() => {
          this.sroles = this.roles;
          this.toast.message = "Updated roles!";
          this.toast.visible = true;
        })
        .catch(() => {
          this.toast.message = "Error updating roles!";
          this.toast.visible = true;
        });
    },
    updateinvites: function () {
      this.$http
        .post(
          "/settings/updateinvites",
          { invites: this.invites },
          { withCredentials: true }
        )
        .then((r) => {
          this.toast.message = "Updated invites!";
          this.toast.visible = true;
          this.invites = r.data.invites;
        })
        .catch(() => {
          this.toast.message = "Error updating invites!";
          this.toast.visible = true;
        });
    },
    createnewinvite: function () {
      this.roleconfig.loading = true;
      this.$http
        .post("/settings/newinvite", {}, { withCredentials: true })
        .catch(() => {
          this.toast.message = "Error updating invites!";
          this.toast.visible = true;
        })
        .then((response) => {
          this.toast.message = "Updated invites!";

          this.invites.push(response.data.invite);
          this.roleconfig.loading = false;
        });
    },
    updateuserroles: function (user, newrole) {
      user.role = newrole.id;
      this.$http
        .post(
          "/settings/updateuserroles",
          { userid: user.userid, role: newrole.id },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.toast.message = "Set role!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error setting role!";
            this.toast.visible = true;
          }
        );
    },
    deleteuser: function (user) {
      this.users.splice(this.users.indexOf(user), 1);
      this.$http
        .post(
          "/settings/updateuserroles",
          { userid: user.userid, role: "delete" },
          { withCredentials: true }
        )
        .then(
          (r) => {
            r;
            this.toast.message = "Deleted user!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error deleteing users!";
            this.toast.visible = true;
          }
        );
    },
    newrole: function () {
      this.roles.push({
        name: "New role",
        permissions: [],
        id: this.roles.length + 1,
      });
    },
    select: function (color) {
      let pastcolor =
        this.colors.find((e) => e.selected) ||
        this.colors.find((e) => e.value == "grey lighten-2");
      pastcolor.selected = false;
      color.selected = true;
      this.$store.commit("setcolor", color.value);

      this.$http
        .post("/settings/setcolor", { color: color.value }, { withCredentials: true })
        .then(
          (r) => {
            r;
            this.toast.message = "Set color!";
            this.toast.visible = true;
          },
          (err) => {
            err;
            this.toast.message = "Error setting color!";
            this.toast.visible = true;
          }
        );
    },
  },
};
</script>

<style>
.selectedcolor {
  outline-style: solid;
  outline-color: #000000;
  outline-offset: -2px;
  outline-width: 2px;
}
</style>
