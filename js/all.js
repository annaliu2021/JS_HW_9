const urlPath = "anna";

getProducts(); //產品清單
getCarts(); //購物車清單

function getProducts() {
  const selectValue = document.querySelector(".productSelect").value;

  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/products`
    )
    .then(function (response) {
      //console.log(response.data.products);
      let products = response.data.products;
      if (selectValue != "全部") {
        //取得新陣列
        products = response.data.products.filter(
          (e) => e.category == selectValue
        );
      }
      renderProductList(products);
    })
    .catch(function (error) {
      // handle error
      alert("取得產品清單發生錯誤");
    });
}
function getCarts() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/carts`
    )
    .then(function (response) {
      //console.log(response.data.products);
      renderCarTable(response.data);
    })
    .catch(function (error) {
      // handle error
      alert("取得購物車清單發生錯誤");
    });
}

//渲染產品
function renderProductList(datas) {
  document.querySelector(".productWrap").innerHTML = "";
  let html = "";
  datas.forEach((element) => {
    html += renderProduct(element);
  });
  document.querySelector(".productWrap").innerHTML = html;

  //監聽事件
  var addCardBtn = document.getElementsByClassName("addCardBtn");
  for (var i = 0; i < addCardBtn.length; i++) {
    addCardBtn[i].addEventListener(
      "click",
      function (e) {
        AddToCar(e.target.dataset.id);
      },
      false
    );
  } //--for end
}
function renderProduct(data) {
  const html = `
  <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${data.images}"
          alt="">
      <a href="#" class="addCardBtn" data-id="${data.id}">加入購物車</a>
      <h3>${data.title}</h3>
      <del class="originPrice">${moneyNTFormat(data.origin_price)}</del>
      <p class="nowPrice">${moneyNTFormat(data.price)}</p>
  </li>
  `;
  return html;
}

//渲染購物車
function renderCarTable(data) {
  document.querySelector(".shoppingCart-table").innerHTML = "";

  if (data.carts.length == 0) {
    document.querySelector(".shoppingCart-empty").style.display = "block";
    return;
  } else {
    document.querySelector(".shoppingCart-empty").style.display = "none";
  }

  let html = "";
  html += `
  <tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
</tr>`;

  data.carts.forEach((element) => {
    html += renderOne(element);
  });
  html += `
  <tr>
      <td>
          <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
          <p>總金額</p>
      </td>
      <td>${data.finalTotal}</td>
  </tr>`;
  document.querySelector(".shoppingCart-table").innerHTML = html;

  //監聽事件-刪除購物車一筆資料
  var btnDeleteOne = document.getElementsByClassName("btnDeleteOne");
  for (var i = 0; i < btnDeleteOne.length; i++) {
    btnDeleteOne[i].addEventListener(
      "click",
      function (e) {
        deleteCartItem(e.target.dataset.id);
      },
      false
    );
  } //--for end

  //監聽事件-刪除購物車所有資料
  document
    .querySelector(".discardAllBtn")
    .addEventListener("click", function (e) {
      var yes = confirm("確定要刪除所有品項？");
      if (yes) {
        axios
          .delete(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/carts`
          )
          .then(function (response) {
            alert(response.data.message);
            if (response.data.status) {
              document.querySelector(".shoppingCart-table").innerHTML = "";
              document.querySelector(".shoppingCart-empty").style.display =
                "block";
            }
          });
      }
    }); //--end
}
function renderOne(data) {
  const html = `
  <tr>
      <td>
          <div class="cardItem-title">
              <img src="${data.product.images}" alt="${data.product.title}">
              <p>${data.product.title}</p>
          </div>
      </td>
      <td>${moneyNTFormat(data.product.price)}</td>
      <td>${data.quantity}</td>
      <td>${moneyNTFormat(data.product.price * data.quantity)}</td>
      <td class="discardBtn">
          <a href="#" class="material-icons btnDeleteOne" data-id="${data.id}">
              clear
          </a>
      </td>
  </tr>
  `;
  return html;
}

//監聽事件-刪除購物車一筆資料
function deleteCartItem(id) {
  var yes = confirm("確定要刪除此品項？");
  if (yes) {
    axios
      .delete(
        `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/carts/${id}`
      )
      .then(function (response) {
        renderCarTable(response.data);
      })
      .catch(function (error) {
        // handle error
        alert("取得刪除購物車品項發生錯誤");
      });
  }
}
//監聽事件-加入購物車
function AddToCar(id) {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/carts`,
      {
        data: {
          productId: id,
          quantity: 1, //先固定加1
        },
      }
    )
    .then(function (response) {
      if (response.data.status) {
        alert("加入購物車成功!");
      } else {
        alert("加入購物車失敗!");
      }
      renderCarTable(response.data);
    })
    .catch(function (error) {
      // handle error
      alert("取得加入購物車發生錯誤");
    });
}

//監聽事件-篩選品項
document.querySelector(".productSelect").addEventListener("click", getProducts); //--end

//新台幣金額格式
function _moneyFormat(str) {
  str = "" + str;
  if (str.length <= 3) return str;
  else
    return (
      this._moneyFormat(str.substr(0, str.length - 3)) +
      "," +
      str.substr(str.length - 3)
    );
}
function moneyNTFormat(value) {
  if (isNaN(value)) {
    return value;
  }
  return `NT$${_moneyFormat(value)}`;
}

//監聽事件-送出表單
document
  .querySelector(".orderInfo-form")
  .addEventListener("submit", function (e) {
    //const form = document.querySelector(".orderInfo-form");
    const formData = new FormData(e.target);
    let message = "";
    //檢查輸入資料
    for (const pair of formData.entries()) {
      //console.log(`${pair[0]}, ${pair[1]}`);
      const key = pair[0];
      const value = pair[1];
      if (value.length == 0) {
        message += `請輸入${key}\n`;
      }
    }
    if (message.length > 0) {
      alert(message);
      return;
    }

    axios
      .post(
        `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/orders`,
        {
          data: {
            user: {
              name: formData.get("姓名"),
              tel: formData.get("電話"),
              email: formData.get("Email"),
              address: formData.get("寄送地址"),
              payment: formData.get("交易方式"),
            },
          },
        }
      )
      .then(function (response) {
        //console.log(response.data);
        if (response.data.status) {
          alert("訂購成功");
        }
      })
      .catch(function (error) {
        // handle error
        alert("送出訂單發生錯誤");
      });
  });
