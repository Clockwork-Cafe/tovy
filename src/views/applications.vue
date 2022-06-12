<template>
  <div>
    <v-sheet :color="$store.state.group.color" height="200" style="width: 100%">
      <v-container>
        <p class="text-h4 font-weight-bold mt-14">
          Hi {{ this.$store.state.user.displayName }},
        </p>
        <p class="text-body-1 font-weight-bold mt-n5 gray">
          Welcome to Applications
        </p>
      </v-container>
    </v-sheet>
    <v-container class="mt-n5">
      <!--make a card for each application that allows you to enable/disable them-->
      <v-card class="mt-7" v-for="app in applications" :key="app.name">
        <v-card-title>
          <v-card-title-text>
            <div class="headline">{{ app.name }}</div>
          </v-card-title-text>
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">{{ app.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="enableApplication(app.name)" v-bind:disabled="app.enabled">
            Enable</v-btn
          >
          <v-btn color="error" @click="disableApplication(app.name) " v-bind:disabled="!app.enabled">
            Disable</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
    <v-snackbar v-model="toast.visible">
      {{ toast.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="toast.color"
          text
          v-bind="attrs"
          @click="toast.visible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      applications: [],
      toast: {
        message: "",
        color: "success",
        visible: false,
      },
    };
  },
  mounted: function () {
    this.$http
      .get("/settings/applications")
      .then((response) => {
        this.applications = response.data.applications;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getApplications: function () {
      this.$http
        .get("/settings/applications")
        .then((response) => {
          this.applications = response.data.applications;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    enableApplication: function (name) {
      this.$http
        .post("/settings/enableapplication", { name: name })
        .then(() => {
          this.getApplications();
          this.toast.message = "Application enabled";
          this.toast.color = "success";
          this.toast.visible = true;
        })
        .catch((error) => {
          console.log(error);
          this.toast.message = "Error enabling application";
          this.toast.color = "error";
          this.toast.visible = true;
        });
    },
    disableApplication: function (name) {
      this.$http
        .post("/settings/disableapplication", { name: name })
        .then(() => {
          this.getApplications();
          this.toast.message = "Application disabled";
          this.toast.color = "success";
          this.toast.visible = true;
        })
        .catch((error) => {
          console.log(error);
          this.toast.message = "Error disabling application";
          this.toast.color = "error";
          this.toast.visible = true;
        });
    },
  },
};
</script>
