import Vue from "vue";
import VueLodash from "vue-lodash";
import lodash from "lodash";

const options = {
  name: "lds",
  lodash: lodash
};

Vue.use(VueLodash, options);
