const Mock = require("mockjs")

const productKind = {
  body: [
    { kindId: "1", kindName: "生活用品" },
    { kindId: "2", kindName: "3C" },
    { kindId: "3", kindName: "水" },
    { kindId: "4", kindName: "食物" }
  ]
}

const productsByKind = {
  body: [
    {
      depiction: null,
      img: "a3db565c7d0f456a8da6568ba5b95919.jpg",
      inventory: "95",
      price: "465",
      productId: "84",
      productName: "椅子",
    },
    {
      depiction: null,
      img: "d6dca0aa739549c68e704efe0c944704.jpg",
      inventory: "3",
      price: "3200",
      productId: "122",
      productName: "保冰袋",
    },
    {
      depiction: null,
      img: "b816064136c74a6b9818095491d5e7c1.jpg",
      inventory: "16",
      price: "250",
      productId: "123",
      productName: "手電筒",
    },
    {
      depiction: null,
      img: "548485a5e2d94fcfb5f559697a6da153.jpg",
      inventory: "6",
      price: "7800",
      productId: "124",
      productName: "烤箱",
    }
  ]
}

Mock.mock("/api/mock/getKind", "post", productKind)
Mock.mock("/api/mock/productsByKind", "post", productsByKind)