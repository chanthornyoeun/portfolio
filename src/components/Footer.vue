<template>
  <footer>
    <div class="footer">
      <div class="social-media-contact">
        <a
          :href="socialMedia.url"
          target="_blank"
          v-for="socialMedia of socialMedias"
          :key="socialMedia.platform"
        >
          <font-awesome-icon
            class="icon"
            :icon="['fab', socialMedia.iconName]"
          />
        </a>
      </div>
      <h4>All right reserved by YOEUN CHANTHORN</h4>
    </div>
  </footer>
</template>


<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

export default {
  name: "Footer",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      socialMedias: [
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/chanthornyoeun",
          iconName: "linkedin",
        },
        {
          platform: "Facebook",
          url: "https://www.facebook.com/chanthornyoeundev",
          iconName: "facebook",
        },
        {
          platform: "Twitter",
          url: "https://twitter.com/chanthornyoeun",
          iconName: "twitter",
        },
        {
          platform: "GitHub",
          url: "https://github.com/chanthornyoeun",
          iconName: "github",
        },
        {
          platform: "Telegram",
          url: "https://t.me/chanthornyoeun",
          iconName: "telegram",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import ".././assets/styles/_variable.scss";

footer {
  background-color: $background-color;
  color: $foreground-color;
}

.footer {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;

  .social-media-contact {
    display: flex;
    gap: 2rem;

    a {
      color: $foreground-color;

      .icon {
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>