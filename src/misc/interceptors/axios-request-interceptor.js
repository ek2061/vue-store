import store from "@store";

/**
 * 攔截每個AJAX HTTP Request進行處理
 * @param {*} config
 */
const handleRequest = config => {
  // Request發送出去後500ms，才將次數加1，避免回應很快的Request一樣會轉圈圈 -------------------------------------------
  setTimeout(function() {
    store.dispatch("doIncrementAjaxReq");
  }, 500);

  let ignoreAPI = ["/product/getKind", "/product/getProductByKind"]
  // 如果有token就攜帶
  if (localStorage.getItem('userToken') && !ignoreAPI.includes(config.url)) {
    // config.headers.Authorization = "Bearer " + localStorage.getItem('userToken')
    config.headers.token = localStorage.getItem('userToken')
  }
  return config;
};

/**
 * 攔截每個AJAX HTTP Request Error進行處理
 * @param {*} error
 */
const handleRequestError = error => {
  return Promise.reject(error);
};

export { handleRequest, handleRequestError };
