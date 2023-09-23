<template>
  <header class="header">
    <Branding />
    <nav>
      <ul class="menu">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#"> About Me </a>
        </li>
        <li>
          <a href="#"> Skills </a>
        </li>
        <li>
          <a href="#">Experiences</a>
        </li>
        <li>
          <a href="#" class="contact"> Contact </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import Branding from "./Branding.vue";
export default {
  name: "Header",
  components: {
    Branding,
  },
};
</script>

<style lang="scss" scoped>
@import ".././assets/styles/_variable.scss";

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  text-transform: uppercase;
  padding: 0 2rem;
  background: $background-color;
  color: $foreground-color;
}

ul.menu {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

a {
  text-decoration: none;
  color: $foreground-color;
}

.contact {
  outline: 1px solid $foreground-color;
  padding: 1rem 2rem;
  border-radius: 50px;
}
</style>