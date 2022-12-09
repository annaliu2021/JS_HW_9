getOrders(); //訂單清單
getProducts(); //產品品項圖表

//1.axios載入來源資料
function getOrders() {
  let urlPath = "anna"; // 記得替換成自己申請的路徑

  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${urlPath}/orders`,
      {
        headers: {
          Authorization: `i4aFigHaRLOmLyl8s0X8mfBhwaF3`,
        },
      }
    )
    .then(function (response) {
      console.log(response.data.orders);
      renderTable(response.data.orders);
    });
}
function getProducts() {
  let urlPath = "anna"; // 記得替換成自己申請的路徑

  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlPath}/products`
    )
    .then(function (response) {
      //console.log(response.data.products);
      renderChart(response.data.products);
    });
}
function deleteAll() {
  let urlPath = "anna"; // 記得替換成自己申請的路徑

  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${urlPath}/orders`,
      {
        headers: {
          Authorization: `i4aFigHaRLOmLyl8s0X8mfBhwaF3`,
        },
      }
    )
    .then(function (response) {
      //console.log(response);
      alert(response.data.message);
      if (response.data.status) {
        document.querySelector(".orderPage-table").innerHTML = "";
      }
    });
}
function deleteOne(id) {
  var yes = confirm(`確定要刪除訂單:${id}`);
  if (yes) {
    __go(id);
  }

  function __go(id) {
    let urlPath = "anna"; // 記得替換成自己申請的路徑

    axios
      .delete(
        `https://livejs-api.hexschool.io/api/livejs/v1/admin/${urlPath}/orders/${id}`,
        {
          headers: {
            Authorization: `i4aFigHaRLOmLyl8s0X8mfBhwaF3`,
          },
        }
      )
      .then(function (response) {
        console.log(response);
        //   {
        //     "status": false,
        //     "message": "找不到該筆訂單，因此無法刪除 RRR ((((；゜Д゜)))"
        //   }
        if (!response.data.status) {
          alert(response.data.message);
        } else {
          //刪除特定訂單列表成功後將會回傳一整個訂單列表。
          alert(`訂單:${id} 刪除成功`);
          renderTable(response.data.orders);
        }
      });
  }
}
function updateOderStatus(id, status) {
  var yes = confirm(`確定要修改此筆訂單狀態:${id}`);
  if (yes) {
    __go(id, status);
  }

  function __go(id, status) {
    let value = status === "false" ? false : true;
    let urlPath = "anna"; // 記得替換成自己申請的路徑

    axios
      .put(
        `https://livejs-api.hexschool.io/api/livejs/v1/admin/${urlPath}/orders`,
        {
          data: {
            id: id,
            paid: !value,
          },
        },
        {
          headers: {
            Authorization: `i4aFigHaRLOmLyl8s0X8mfBhwaF3`,
          },
        }
      )
      .then(function (response) {
        if (!response.data.status) {
          alert(response.data.message);
        } else {
          //刪除特定訂單列表成功後將會回傳一整個訂單列表。
          console.log(response.data.orders);
          alert(`訂單:${id} 狀態修改成功`);
          renderTable(response.data.orders);
        }
      });
  }
}

//2.渲染畫面訂單清單
function renderTable(dataArr) {
  let html = "";
  document.querySelector(".orderPage-table").innerHTML = "";
  dataArr.forEach((item) => {
    let tr = renderTr(item);
    html += tr;
  });
  html = `<thead>${renderThead()}</thead><tbody>${html}</tbody>`;
  document.querySelector(".orderPage-table").innerHTML = html;

  //監聽事件
  var delSingleOrderBtns =
    document.getElementsByClassName("delSingleOrder-Btn");
  for (var i = 0; i < delSingleOrderBtns.length; i++) {
    delSingleOrderBtns[i].addEventListener(
      "click",
      function (e) {
        deleteOne(e.target.dataset.id);
      },
      false
    );
  }

  var updateStatusOrderBtns = document.getElementsByClassName(
    "updateStatusOrder-Btn"
  );
  for (var i = 0; i < updateStatusOrderBtns.length; i++) {
    updateStatusOrderBtns[i].addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        updateOderStatus(e.target.dataset.id, e.target.dataset.status);
      },
      false
    );
  }
}
function renderThead() {
  const thead = [
    "訂單編號",
    "聯絡人",
    "聯絡地址",
    "電子郵件",
    "訂單品項",
    "訂單日期",
    "訂單狀態",
    "操作",
  ];
  let str = ``;
  thead.forEach((item) => {
    str += `<th>${item}</th>`;
  });
  return str;
}
function renderTr(data) {
  let str = `<tr>
    <td>${data.id}</td>
    <td>
        <p>${data.user.name}</p>
        <p>${data.user.tel}</p>
    </td>
    <td>${data.user.address}</td>
    <td>${data.user.email}</td>
    <td>
        ${renderProduct(data.products)}
    </td>
    <td>${getDate(data.createdAt)}</td>
    <td class="orderStatus">
        <a href="#" class="updateStatusOrder-Btn" data-id="${
          data.id
        }" data-status="${data.paid}">${
    data.paid === false ? "未處理" : "已處理"
  }</a>
    </td>
    <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
          data.id
        }">
    </td>
    </tr>`;
  return str;
}
function renderProduct(data) {
  let str = ``;
  data.forEach((item) => {
    str += `<p>${item.title}</p>`;
  });
  return str;
}
function getDate(timtimestamp) {
  let date = new Date(timtimestamp);
  date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  return date;
}
function parseC3Columns(data) {
  let c3Columns = [];
  let categoryObj = {};

  data.forEach((item) => {
    if (categoryObj[item.category] == undefined) {
      categoryObj[item.category] = 1;
    } else {
      categoryObj[item.category] += 1;
    }
  });

  //console.log(categoryObj);

  const categoryKeys = Object.keys(categoryObj);
  categoryKeys.forEach((item) => {
    let arr = [];
    arr.push(item);
    arr.push(categoryObj[item]);
    c3Columns.push(arr);
  });

  //console.log(c3Columns);
  return c3Columns;
}
function renderChart(data) {
  let c3Columns = parseC3Columns(data);

  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: c3Columns,
      // [
      //   ["床架", 1],
      //   ["收納", 2],
      //   ["窗簾", 3],
      // ],
      colors: {
        床架: "#DACBFF",
        收納: "#9D7FEA",
        窗簾: "#5434A7",
        //其他: "#301E5F",
      },
    },
  });
}

//監聽事件
document
  .querySelector(".discardAllBtn")
  .addEventListener("click", function (e) {
    if (document.querySelector(".orderPage-table > tbody > tr") == null) {
      alert("目前沒有訂單");
      return;
    }

    var yes = confirm("確定要刪除所有訂單？");
    if (yes) {
      deleteAll();
    }
  });
