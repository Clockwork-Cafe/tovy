<template>
  <div>
    <v-sheet :color="$store.state.group.color" height="200" style="width: 100%">
      <v-container>
        <p class="text-h4 font-weight-bold mt-14">
          Hi {{ this.$store.state.user.displayName }},
        </p>
        <p class="text-body-1 font-weight-bold mt-n5 gray">Welcome to guides</p>
      </v-container>
    </v-sheet>
    <v-btn @click="dialog.active = true" class="mt-n5 mx-10">
      <v-icon>mdi-pencil-plus</v-icon>
      Create Guide
    </v-btn>
    <v-dialog v-model="dialog.active" max-width="600px">
      <v-progress-linear
        :color="$store.state.group.color"
        indeterminate
        v-if="dialog.loading"
        reverse
      ></v-progress-linear>
      <v-stepper v-model="dialog.page">
        <v-stepper-header>
          <v-stepper-step :complete="dialog.page > 1" step="1"> URL </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="dialog.page > 2" step="2">
            Name and Description
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3"> Permission </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-text-field
              v-model="newGuide.url"
              label="URL"
              :rules="[
                v => !!v || 'URL is required',
                v => v.includes('http') || 'URL must be valid',
              required
              ]"
              
            ></v-text-field>
            <v-btn color="primary" @click="dialog.page++"> Continue </v-btn>

            <v-btn text @click="dialog.active = false"> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-text-field
              label="Guide Name"
              outlined
              v-model="newGuide.name"
              required
              :rules="[(v) => !!v || 'Name is required']"
              class="mb-3"
              hide-details="auto"
            ></v-text-field>
            <v-textarea
              outlined
              label="Guide Description"
              :rules="[(v) => !!v || 'Description is required']"
              v-model="newGuide.description"
              required
              class="mb-4"
              hide-details="auto"
            ></v-textarea>

            <v-btn color="primary" @click="dialog.page++"> Continue </v-btn>

            <v-btn text @click="dialog.page--"> Previous </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-autocomplete
              class="mt-3"
              v-model="newGuide.permission"
              :items="dialog.roles"
              item-text="name"
              item-value="id"
              outlined
              chips
              small-chips
              label="Roles"
              multiple
            ></v-autocomplete>

            <v-btn color="primary" @click="create"> Finish </v-btn>

            <v-btn text @click="dialog.page--"> Previous </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      guides: [],
      toast: {
        message: "",
        color: "success",
        visible: false,
      },
      new: {
        name: "",
        description: "",
        url: "",
        perm: "",
      },
      dialog: {
        active: false,
        page: 1,
        loading: false,
        users: [],
        roles: [],
      },
      newGuide: {
        name: "",
        description: "",
        url: "",
        permission: [],
        enabled: true,
      },
      list: ["Delete"],
    };
  },
  mounted: function () {
    this.$http.get("/pdf/all").then((response) => {
      this.guides = response.data.pdfs;
    });
    this.$http.get("/settings/roles").then((response) => {
      this.dialog.roles = response.data.roles;
    });
  },
  methods: {
    refresh: function () {
      this.$http.get("/pdf/all").then((response) => {
        this.guides = response.data.pdfs;
      });
    },
    create: function () {
      this.$http.post("/pdf/add", this.newGuide).then(() => {
        this.refresh();
        this.newGuide.name = "";
        this.newGuide.description = "";
        this.newGuide.url = "";
        this.newGuide.permission = [];
        this.toast.message = "Guide created";
        this.toast.color = "success";
        this.toast.visible = true;
      });
    },
    delete: function (name) {
      this.$http.delete("/pdf/delete/", { name: name }).then(() => {
        this.refresh();
        this.toast.message = "Guide deleted";
        this.toast.color = "success";
        this.toast.visible = true;
      });
    },
  },
};
</script>
