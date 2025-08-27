const container = document.getElementById('grid');

const names = await fetch('/api/list').then(r => r.json());

const table = document.createElement('table');
table.innerHTML = `
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Duration (ms)</th>
    </tr>
  </thead>
  <tbody></tbody>
`;
container.appendChild(table);
const tbody = table.querySelector('tbody');
let total = 0;

for (const name of names) {
  const start = performance.now();
  try {
    const res = await fetch(`/api/pokemon/${name}`);
    const data = await res.json();
    const duration = Math.round(performance.now() - start);
    total += duration;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${duration}</td>
    `;
    tbody.appendChild(row);
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>–</td>
      <td>${name}</td>
      <td>${duration} (error)</td>
    `;
    row.style.color = 'red';
    tbody.appendChild(row);
  }


}
const row = document.createElement('tr');
row.innerHTML = `
<td>Total</td>
<td></td>
<td>${total}</td>`;

tbody.appendChild(row);