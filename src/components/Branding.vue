<template>
  <a href="#" class="branding">
    <div class="avatar">C</div>
    <h1>Yoeun Chanthorn</h1>
  </a>
</template>

<script>
export default {
  name: "Branding",
};
</script>

<style lang="scss" scoped>
.branding {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    font-size: 32px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    align-self: center;
    background: rgb(150, 108, 108);
  }
}
</style>