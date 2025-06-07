
const USERS = [
  { user: "admin", pass: "123456" },
  { user: "gv1", pass: "thi_dua" }
];

const records = [];
let editingIndex = -1;

function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  const ok = USERS.some(acc => acc.user === u && acc.pass === p);
  if (ok) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    loadApp();
  } else {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
  }
}

function saveRecord() {
  const ngay = document.getElementById("ngay").value;
  const nguoitruc = document.getElementById("nguoitruc").value;
  const lop = document.getElementById("lop").value;
  const danhmuc = document.getElementById("danhmuc").value;
  const diem = document.getElementById("diem").value;
  const chuthich = document.getElementById("chuthich").value;

  if (!ngay || !lop || !danhmuc || !diem) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const newData = { ngay, nguoitruc, lop, danhmuc, diem, chuthich };

  if (editingIndex >= 0) {
    records[editingIndex] = newData;
    editingIndex = -1;
    alert("✅ Đã cập nhật dữ liệu!");
  } else {
    records.push(newData);
    alert("✅ Đã lưu!");
  }

  localStorage.setItem("records", JSON.stringify(records));

  document.getElementById("ngay").value = '';
  document.getElementById("nguoitruc").value = '';
  document.getElementById("diem").value = '';
  document.getElementById("chuthich").value = '';
  updateSummary();
  renderTable();
}


function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  const filter = document.getElementById("filterClass").value;
  tbody.innerHTML = "";
  let total = 0;

  records.forEach((r, index) => {
    if (!filter || r.lop === filter) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.ngay}</td>
        <td>${r.nguoitruc}</td>
        <td>${r.lop}</td>
        <td>${r.danhmuc}</td>
        <td>${r.diem}</td>
        <td>${r.chuthich}</td>
        <td><button onclick="editRecord(${index})">✏️ Sửa</button></td>
      `;
      tbody.appendChild(row);

      const diem = parseInt(r.diem);
      if (!isNaN(diem)) {
        total += diem;
      }
    }
  });

  document.getElementById("summary").innerText = `🔢 Tổng điểm hiện tại của lớp ${filter || 'tất cả'}: ${total}`;
}


function editRecord(index) {
  const r = records[index];
  document.getElementById("ngay").value = r.ngay;
  document.getElementById("nguoitruc").value = r.nguoitruc;
  document.getElementById("lop").value = r.lop;
  document.getElementById("danhmuc").value = r.danhmuc;
  document.getElementById("diem").value = r.diem;
  document.getElementById("chuthich").value = r.chuthich;
  editingIndex = index;
}

function updateSummary() {
  let total = 0;
  records.forEach(r => {
    const diem = parseInt(r.diem);
    if (!isNaN(diem)) {
      total += diem;
    }
  });
  document.getElementById("summary").innerText = `🔢 Tổng điểm hiện tại: ${total}`;
}

function loadApp() {
  const saved = localStorage.getItem("records");
  if (saved) {
    const parsed = JSON.parse(saved);
  records.length = 0;
  records.push(...parsed);
  }

  document.getElementById("mainApp").innerHTML = `
    <div class="section">
      <label>Ngày:</label>
      <input type="date" id="ngay">
      <label>Người trực:</label>
      <input type="text" id="nguoitruc" placeholder="Tên người trực">
      <label>Lớp học:</label>
      <select id="lop">
        <option>6A</option><option>6B</option><option>7A</option><option>7B</option>
        <option>8A</option><option>8B</option><option>9A</option><option>9B</option>
      </select>
      <label>Danh mục:</label>
      <select id="danhmuc">
        <option>Đi học muộn</option><option>Không đồng phục</option>
        <option>Không trực nhật</option><option>Gây mất trật tự</option>
        <option>Phát sinh điểm cộng</option><option>Phát sinh điểm trừ</option>
      </select>
      <label>Điểm cộng / trừ:</label>
      <input type="number" id="diem">
      <label>Chú thích:</label>
      <input type="text" id="chuthich" placeholder="Tên học sinh / ghi chú cụ thể">
      <button onclick="saveRecord()">💾 Ghi nhận</button> <button onclick="exportToExcel()">📤 Xuất Excel</button> <button onclick="exportToExcelByClass()">🏫 Xuất theo lớp</button>
      <button onclick="logout()">🔓 Thoát</button>
      <label>Lọc theo lớp:</label>
<select id="filterClass" onchange="renderTable()">
  <option value="">-- Tất cả lớp --</option>
  <option>6A</option><option>6B</option><option>7A</option><option>7B</option>
  <option>8A</option><option>8B</option><option>9A</option><option>9B</option>
</select>
<div id="summary">🔢 Tổng điểm hiện tại: 0</div>
      <h4>Dữ liệu đã nhập</h4>
      <table id="dataTable">
        <thead>
          <tr>
            <th>Ngày</th><th>Người trực</th><th>Lớp</th>
            <th>Danh mục</th><th>Điểm</th><th>Chú thích</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  updateSummary();
  renderTable();
}

function logout() {
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("username").value = '';
  document.getElementById("password").value = '';
}

function exportToExcel() {
  if (records.length === 0) {
    alert("Chưa có dữ liệu để xuất.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Ngày,Người trực,Lớp,Danh mục,Điểm,Chú thích\n";
  records.forEach(r => {
    let row = [r.ngay, r.nguoitruc, r.lop, r.danhmuc, r.diem, r.chuthich].map(v => `"${v}"`).join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "thi_dua_lop.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToExcelByClass() {
  const lop = prompt("Nhập lớp bạn muốn xuất (ví dụ: 6A):");
  if (!lop) return;

  const filtered = records.filter(r => r.lop === lop);
  if (filtered.length === 0) {
    alert("Không có dữ liệu cho lớp " + lop);
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Ngày,Người trực,Lớp,Danh mục,Điểm,Chú thích\n";
  filtered.forEach(r => {
    let row = [r.ngay, r.nguoitruc, r.lop, r.danhmuc, r.diem, r.chuthich].map(v => `"${v}"`).join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "thi_dua_" + lop + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
