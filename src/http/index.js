import axios from "axios";
export default function (config) {
  let myaxios = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 2000,
  });

  // 添加请求拦截器
  myaxios.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      if(sessionStorage.token){
        config.headers.Authorization = sessionStorage.token
      }
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  myaxios.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      return response.data;
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );

  return myaxios(config);
}
