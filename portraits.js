const cast = {
  judge: ['The Judge', 'Player', '#78617b', '#ac7052', '#363039', '#272736', 'short'],
  james: ['James Miller', 'Defendant', '#426968', '#b87954', '#302722', '#507b72', 'curls'],
  allen: ['Henry Allen', 'Store owner', '#815744', '#d59b76', '#85543b', '#7c543d', 'beard'],
  collins: ['Sarah Collins', 'Prosecutor', '#41556f', '#9c6249', '#271f25', '#384966', 'bob'],
  carter: ['Mike Carter', 'Defense attorney', '#736849', '#e0aa8b', '#49352a', '#666c52', 'glasses'],
  brooks: ['Dr. Peyton Brooks', 'Researcher', '#6e536b', '#774934', '#24232c', '#69536d', 'round'],
  howell: ['Mark Howell', 'Mediator', '#40615b', '#d7a87f', '#a09b8b', '#497471', 'sweater'],
  thornton: ['Katelyn Thornton', 'Court officer', '#605647', '#e2ac81', '#a45f36', '#3d5364', 'braid'],
  applicant: ['Case study participant', 'Simulated hearing', '#4b5a70', '#b67c65', '#51433c', '#5d626e', 'short'],
  owner: ['Case study owner', 'Simulated hearing', '#65526a', '#84553c', '#25232a', '#764e57', 'glasses'],
};

function portrait(key) {
  const [name, role, backdrop, skin, hair, clothes, style] = cast[key];
  const figure = document.createElement('figure');
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 40;
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  function block(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  block(backdrop, 0, 0, 40, 40);
  block('#ffffff18', 3, 3, 34, 24);
  block('#ffffff17', 5, 5, 2, 19);
  block('#12151c45', 0, 33, 40, 7);
  block(clothes, 6, 35, 28, 5);
  block(clothes, 10, 32, 20, 8);
  block('#10151c55', 9, 38, 22, 2);
  if (style === 'bob' || style === 'braid') block(hair, 10, 11, 21, 20);
  if (style === 'braid') block(hair, 29, 21, 4, 14);
  block(skin, 16, 26, 8, 7);
  block('#291d2240', 16, 27, 8, 3);
  block(skin, 12, 12, 16, 14);
  block(skin, 14, 24, 12, 4);
  block(skin, 10, 17, 20, 5);
  block('#ffffff23', 13, 14, 3, 9);
  block(hair, 12, 9, 16, 5);
  block(hair, 11, 12, 3, 6);
  block(hair, 26, 12, 3, 5);
  if (style === 'curls' || style === 'round') {
    block(hair, 10, 8, 20, 5);
    block(hair, 13, 6, 12, 4);
    block(hair, 9, 11, 4, 5);
  }
  if (style === 'beard') {
    block(hair, 12, 23, 16, 4);
    block(hair, 15, 26, 10, 3);
  }
  if (style === 'glasses' || style === 'round') {
    ctx.strokeStyle = '#29232c';
    ctx.strokeRect(13.5, 16.5, 5, 5);
    ctx.strokeRect(21.5, 16.5, 5, 5);
    block('#29232c', 18, 18, 4, 1);
  }
  block('#29232c', 15, 18, 2, 2);
  block('#29232c', 23, 18, 2, 2);
  block('#582f34', 18, 24, 4, 1);
  if (style === 'braid') block('#eac384', 25, 34, 3, 3);
  else if (style === 'sweater') block('#e9ddc1', 15, 32, 10, 2);
  else {
    block('#e9ddc1', 16, 32, 8, 2);
    block('#e9ddc1', 18, 34, 4, 2);
  }
  const caption = document.createElement('figcaption');
  caption.textContent = name;
  caption.title = role;
  figure.append(canvas, caption);
  return figure;
}
