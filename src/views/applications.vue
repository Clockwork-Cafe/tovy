<template>
    <div>
    <v-sheet :color="$store.state.group.color" height="200" style="width: 100%">
      <v-container>
        <p class="text-h4 font-weight-bold mt-14">
          Hi {{ this.$store.state.user.displayName }},
        </p>
        <p class="text-body-1 font-weight-bold mt-n5 gray">Welcome to Applications</p>
      </v-container>
    </v-sheet>
    </div>
</template>

<script>
export default {
  name: "HelloWorld",
};
</script>
