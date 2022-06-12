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
          <v-btn
            color="primary"
            @click="enableApplication(app.name)"
            v-bind:disabled="app.enabled"
          >
            Enable</v-btn
          >
          <v-btn
            color="error"
            @click="disableApplication(app.name)"
            v-bind:disabled="!app.enabled"
          >
            Disable</v-btn
          >
          <v-btn
          @click="dialog.active = true; question.name = app.name"
          >
            <v-icon>mdi-pencil-outline</v-icon>
            Add Question
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

        <v-dialog v-model="dialog.active" max-width="600px">
      <v-progress-linear
        :color="$store.state.group.color"
        indeterminate
        v-if="dialog.loading"
        reverse
      ></v-progress-linear>
      <v-stepper v-model="dialog.page">
        <v-stepper-header>
          <v-stepper-step :complete="dialog.page > 1" step="1"> Question </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="dialog.page > 2" step="2">
            Answers
          </v-stepper-step>


        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-text-field
              v-model="question.question"
              label="Question"
              :rules="[
                v => !!v || 'Question is required',
              required
              ]"
              
            ></v-text-field>
            <v-btn color="primary" @click="dialog.page++"> Continue </v-btn>

            <v-btn text @click="dialog.active = false"> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
                                    <v-text-field
              label="Wrong Answer 1"
              outlined
              v-model="question.a1"
              required
              :rules="[(v) => !!v || 'Answer is required']"
              class="mb-3"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              label="Wrong Answer 2"
              outlined
              v-model="question.a2"
              required
              :rules="[(v) => !!v || 'Answer is required']"
              class="mb-3"
              hide-details="auto"
            ></v-text-field>
                        <v-text-field
              label="Wrong Answer 3"
              outlined
              v-model="question.a3"
              required
              :rules="[(v) => !!v || 'Answer is required']"
              class="mb-3"
              hide-details="auto"
            ></v-text-field>
                        <v-text-field
              label="Correct Answer"
              outlined
              v-model="question.answer"
              required
              :rules="[(v) => !!v || 'Answer is required']"
              class="mb-3"
              hide-details="auto"
            ></v-text-field>


            <v-btn color="primary" @click="addQuestion"> Finish </v-btn>

            <v-btn text @click="dialog.page--"> Previous </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

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
      dialog: {
        active: false,
        page: 1,
        loading: false,
        roles: []
      },
      question: {
        question: "",
        a1: "",
        a2: "",
        a3: "",
        answer: "",
        name: "",
      }
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
    addQuestion: function () {
   
      this.$http.post('/settings/addquestion', {
        question: this.question,
        name: this.question.name,
      }).then(() => {
        this.getApplications();
        this.toast.message = "Question added";
        this.toast.color = "success";
        this.toast.visible = true;
           this.dialog.active = false;
      this.dialog.page = 1;
      this.dialog.loading = false;
      this.dialog.roles = [];
      this.question.question = "";
      this.question.a1 = "";
      this.question.a2 = "";
      this.question.name
      this.question.a3 = "";
      this.question.answer = "";
      }).catch((error) => {
        console.log(error);
        this.toast.message = "Error adding question";
        this.toast.color = "error";
        this.toast.visible = true;
      });
    },
  },
};
</script>
