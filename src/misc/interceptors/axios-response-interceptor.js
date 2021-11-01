// import Vue from "vue";
import store from "@store";
import router from "@router";

/**
 * 攔截每個AJAX HTTP Response進行處理
 * @param {*} response
 */

const handleResponse = response => {
  store.dispatch("doDecrementAjaxReq");
  if(response.data.status == "403") {
    this.$Message.error("Token失效請重新登入");
    this.$store.dispatch("doLogout")
    this.$router.push("/login")
  }
  return response;
};

/**
 * 攔截每個AJAX HTTP Response Error進行處理
 * @param {*} error
 */
const handleResponseError = error => {
  store.dispatch("doDecrementAjaxReq");

  /**
   * 401: (Unauthorized)代表客戶端錯誤，指的是由於缺乏目標資源要求的身份驗證憑證，發送的請求未得到滿足
   */
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("userToken");
    router.push("/401");
    return Promise.reject(error);
  }

  /**
   * 403: (Forbidden)代表客戶端錯誤，指的是服務器端有能力處理該請求，但是拒絕授權訪問
   */
  if (error.response && error.response.status === 403) {
    router.push("/403");
    return Promise.reject(error);
  }

  /**
   * 412: (Precondition Failed)傳入參數不符Server端預期
   */
  if (error.response && error.response.status === 412) {
    // showMessage(error.response.data.msg);
    return Promise.reject(error);
  }

  /**
   * 401(Unauthorized)、403(Forbidden)及412: (Precondition Failed)以外，其他類型錯誤
   */
  router.push("/error");
  return Promise.reject(error);
};

export { handleResponse, handleResponseError };
