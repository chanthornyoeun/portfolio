<template>
  <main>
    <div class="header">
      <Header />
    </div>

    <Footer />
  </main>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Lato, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  height: 100dvh;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
}
</style>
