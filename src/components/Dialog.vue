<template>
  <div class="dialog-container">
    <Modal
      :title="dialog.title"
      v-model="dialog.show"
      :closable="false"
      :mask-closable="false"
      @on-ok="onSubmit('formData')"
    >
      <Form
        ref="formData"
        :model="formData"
        :rules="form_rules"
        label-position="left"
        :label-width="100"
        style="margin: 10px; width: auto"
      >
        <Form-item label="商品名稱" prop="productName">
          <Input v-model="formData.productName" placeholder="商品名稱"></Input>
        </Form-item>
        <Form-item label="商品種類">
          <Select
            v-model="formData.productKind"
            placeholder="商品種類"
            no-data-text="目前沒有商品種類的資料"
          >
            <Option
              v-for="(v, k) in productKind"
              :key="k"
              :value="productKind[k]"
              >{{ kindName[k] }}</Option
            >
          </Select>
        </Form-item>
        <Form-item label="庫存" prop="inventory">
          <Input v-model="formData.inventory" placeholder="庫存" type="number"></Input>
        </Form-item>
        <Form-item label="單價" prop="price">
          <Input v-model="formData.price" placeholder="單價" type="number"></Input>
        </Form-item>
        <Form-item label="是否上架">
          <Select v-model="formData.onsell" placeholder="是否上架">
            <Option value="Y">Y</Option>
            <Option value="N">N</Option>
          </Select>
        </Form-item>
        <Form-item label="商品描述" prop="depiction">
          <Input v-model="formData.depiction" placeholder="商品描述"></Input>
        </Form-item>
      </Form>

      <div class="demo-upload-list">
        <Upload
          ref="upload"
          :headers="{'token': token}"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :data="uploadData"
          type="drag"
          action="http://localhost:8080/EIAM/uploadImage/product"
          style="display: inline-block; width: 200px;"
        >
          <div style="width: 200px; height: 200px; line-height: 200px">
            <img :src="imgURL" style="width: 200px; height: 200px" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-camera" size="50"></Icon>
            </div>
          </div>
        </Upload>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dialog",
  data() {
    return {
      kindName: [], // 種類名稱
      productKind: [], // 種類id
      token: localStorage.getItem("userToken"),
      uploadData: {
        productId: "",
        file: "",
      },
      form_rules: {
        depiction: [
          { required: true, message: "商品描述不能為空", trigger: "blur" },
        ],
        inventory: [
          { required: true, message: "庫存不能為空", trigger: "blur" },
        ],
        price: [{ required: true, message: "單價不能為空", trigger: "blur" }],
        productName: [
          { required: true, message: "商品名稱不能為空", trigger: "blur" },
        ],
        onsell: [
          {
            required: true,
            message: "是否上架不能為空",
            trigger: ["blur", "change"],
          },
        ],
        productKind: [
          {
            required: true,
            message: "商品種類不能為空",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  props: {
    formData: Object,
    dialog: Object,
    imgURL: String,
  },
  methods: {
    // 上傳前要做的事
    handleBeforeUpload(file) {
      // 這裡一定要給值，我被雷到= =
      this.uploadData.productId = this.formData.id
      this.uploadData.file = file
      return false
    },
    // 影像上傳成功的事件
    handleSuccess(res, file) {
      if(res.body == "err") {
        this.$Message.error("圖片上傳失敗")
      } else {
        this.$Message.success("圖片上傳成功")
        file.url = "http://localhost:8080/EIAM/" + res.body;
        this.$emit("update");
      }
    },
    // 影像格式錯誤的事件
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正確",
        desc:
          "文件 " + file.name + " 格式不正確，請上傳 jpg 或 png 格式的圖片。",
      });
    },
    // 影像超過最大限制的事件
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超過 2M。",
      });
    },
    // 取得所有商品類別
    async getProductKind() {
      try {
        let res = await axios.post("/product/getKind");
        let pk = res.data.body; // product kind縮寫，暫用
        for (let i = 0; i < pk.length; i++) {
          this.kindName.push(pk[i].kindName);
          this.productKind.push(pk[i].kindId);
        }
      } catch (err) {
        this.$Message.error("請求商品種類失敗");
      }
    },
    // 送出修改或新增
    onSubmit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          let option = this.dialog.option === "put" ? "put" : "add";
          try {
            let res = await axios.post(`/product/${option}`, this.formData);
            if (res.data.body === "err") {
              this.$Message.error("操作失敗");
            } else if(res.data.body == 403) {
              this.$Message.error("權限不符請重新登入");
              this.$store.dispatch("doLogout")
              this.$router.push("/login")
            } else if(option === "add"){
              this.uploadData.productId = res.data.body
            }
            this.$Message.success("操作成功")
          } catch (err) {
            this.$Message.error("發生錯誤");
          }
          this.$emit("update");

          try {
            let config = {
              headers: {"Content-Type":"multipart/form/data"}
            }
            var param = new FormData();
            param.append("file", this.uploadData.file)
            param.append("productId", this.uploadData.productId)
            let res = await axios.post("/uploadImage/product", param, config)
            console.log(res.data.status)
          } catch(err) {
            // this.$Message.error("上傳圖片發生錯誤")
          }
          this.$emit("update");
        } else {
          this.dialog.show = true;
          this.$Message.error("表單驗證失敗");
        }
      });
    },
  },
  watch: {
  },
  created() {
    // 一定要created不能mounted，不然會拿不到資料
    this.getProductKind();
  },
};
</script>

<style scoped>
.demo-upload-list {
  display: inline-block;
  width: 200px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
/* @media screen and (max-width: 780px) {
  .el-dialog--small {
    width: 380px !important;
  }
}
@media screen and (max-width: 990px) {
  .seqnum-desc {
    display: none;
  }
}
@media screen and (min-width: 990px) {
  .el-dialog--small {
    width: 700px !important;
  }
} */
</style>