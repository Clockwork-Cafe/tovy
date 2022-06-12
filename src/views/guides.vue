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
      roles: [],
    };
  },
  mounted: function () {
    this.$http.get("/pdf/all").then((response) => {
      this.guides = response.data.pdfs;
    });
        this.$http.get("/settings/roles").then((response) => {
      this.roles = response.data.roles;
    });
  },
  methods: {
    refresh: function () {
      this.$http.get("/pdf/all").then((response) => {
        this.guides = response.data.pdfs;
      });
    },
    create: function () {
      this.$http.post("/pdf/create", this.new).then((response) => {
        this.refresh();
        this.new.name = "";
        this.new.description = "";
        this.new.url = "";
        this.new.perm = "";
        this.toast.message = "Guide created";
        this.toast.color = "success";
        this.toast.visible = true;
      });
    },
    delete: function (name) {
      this.$http.delete("/pdf/delete/", { name: name }).then((response) => {
        this.refresh();
        this.toast.message = "Guide deleted";
        this.toast.color = "success";
        this.toast.visible = true;
      });
    },
  },
};
</script>
