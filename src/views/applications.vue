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
  <v-row>
                           <v-autocomplete
              v-on:mousedown="getSelected(app.name)"
              class="mx-10 mt-5 mb-n2"
              v-model="newRanks"
              :items="ranks"
              item-text="name"
              item-value="id"
              outlined
              chips
              :select="app.ranks"
              small-chips
              label="Allowed Ranks"
              multiple
            ></v-autocomplete>
            <v-btn class="mt-8 mb-n2 ml-n9 mr-10" @click="setRankRequirement(app.name)">
              <v-icon>mdi-disk</v-icon>
              Save
            </v-btn>
            </v-row>
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
            @click="
              dialog.active = true;
              question.name = app.name;
            "
          >
          <br>
          <v-divider></v-divider>
          <br>
            <v-icon>mdi-pencil-outline</v-icon>
            Add Question
          </v-btn>

        </v-card-actions>
        <v-expansion-panel>
          
        <v-expansion-panels>
          <v-expansion-panel
            v-for="question in app.choiceQuestions"
            :key="question.question"
          >
            <v-expansion-panel-header>
              <div class="subheading mb-n2">
                {{ question.question }}
                <v-btn @click="deleteQuestion(app.name, question.question)" text icon color="red lighten-2">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="red--text text--lighten-1 text-body-1">
                {{ question.a1 }}
              </p>
              <p class="red--text text--lighten-1 text-body-1">
                {{ question.a2 }}
              </p>
              <p class="red--text text--lighten-1 text-body-1">
                {{ question.a3 }}
              </p>
              <p class="mb-n1 green--text text--lighten-1 text-body-1">
                {{ question.answer }}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel>

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
          <v-stepper-step :complete="dialog.page > 1" step="1">
            Question
          </v-stepper-step>

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
              :rules="[(v) => !!v || 'Question is required', required]"
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
      ranks: [],
      dialog: {
        active: false,
        page: 1,
        loading: false,
        roles: [],
      },
      question: {
        question: "",
        a1: "",
        a2: "",
        a3: "",
        answer: "",
        name: "",
      },
      newRanksTrainee: [],
      newRanks: []
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
    this.$http.get('/pdf/ranks').then((response) => {
      console.log(response.data);
      this.ranks = response.data.roles;
    }).catch((error) => {
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
    getSelected: function (name) {
      this.$http.get('/settings/getallowedranks?name=' + name).then((response) => {
        for (let i in response.data.ranks) {
          this.newRanks.push(Number(response.data.ranks[i]));
        }
      }).catch((error) => {
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
    setRankRequirement: function (name) {
      this.dialog.loading = true;
      this.$http.post('/settings/setallowedranks', {
        name: name,
        ranks: this.newRanks
      }).then(() => {
        this.dialog.loading = false;
        this.newRanks = [];
        this.dialog.active = false;
        this.getApplications();
        this.toast.message = "Rank requirements updated";
        this.toast.color = "success";
        this.toast.visible = true;
      }).catch((error) => {
        console.log(error);
        this.dialog.loading = false;
        this.toast.message = "Error updating rank requirements";
        this.toast.color = "error";
        this.toast.visible = true;
      });
    },
    addQuestion: function () {
      this.$http
        .post("/settings/addquestion", {
          question: this.question,
          name: this.question.name,
        })
        .then(() => {
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
          this.question.name;
          this.question.a3 = "";
          this.question.answer = "";
        })
        .catch((error) => {
          console.log(error);
          this.toast.message = "Error adding question";
          this.toast.color = "error";
          this.toast.visible = true;
        });
    },
    deleteQuestion: function (name, question) {
      this.$http
        .post("/settings/removequestion", {
          name: name,
          question: question,
        })
        .then(() => {
          this.getApplications();
          this.toast.message = "Question deleted";
          this.toast.color = "success";
          this.toast.visible = true;
        })
        .catch((error) => {
          console.log(error);
          this.toast.message = "Error deleting question";
          this.toast.color = "error";
          this.toast.visible = true;
        });
    },
  },
};
</script>
