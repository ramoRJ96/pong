const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

const user = {
  x: 10,
  y: canvas.height / 2 - 120 / 2,
  width: 20,
  height: 120,
  color: "WHITE",
  score: 0,
};

const computer = {
  x: canvas.width - 30,
  y: canvas.height / 2 - 120 / 2,
  width: 20,
  height: 120,
  color: "WHITE",
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  color: "WHITE",
  speed: 5,
  velocityX: 5,
  velocityY: 5,
};

const drawRectangle = (x, y, width, height, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

const drawCircle = (x, y, radius, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.closePath();
  context.fill();
};

const drawText = (text, x, y, color) => {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text, x, y);
};

const render = () => {
  drawRectangle(0, 0, canvas.width, canvas.height, "#22347a");
  drawRectangle(canvas.width / 2 - 2.5, 0, 5, canvas.height, "WHITE");

  drawRectangle(user.x, user.y, user.width, user.height, "WHITE");
  drawRectangle(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    "WHITE"
  );

  drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
  drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "WHITE");

  drawCircle(ball.x, ball.y, ball.radius, "WHITE");
};

const collision = (ball, player) => {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  return (
    ball.top < player.bottom &&
    ball.bottom > player.top &&
    ball.left < player.right &&
    ball.right > player.left
  );
};

const movePaddle = (event) => {
  let rect = canvas.getBoundingClientRect();

  user.y = event.clientY - rect.top - user.height / 2;
};

canvas.addEventListener("mousemove", movePaddle);

const resetBall = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  ball.speed = 5;
  ball.velocityX = 5;
};

const update = () => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x < canvas.width / 2 ? user : computer;

  let computerLevel = 0.1;
  computer.y += (ball.y - (computer.y + computer.height / 2)) * computerLevel;

  if (collision(ball, player)) {
    let collidePoint =
      (ball.y - (player.y + player.height / 2)) / (player.height / 2);

    let angle = (collidePoint * Math.PI) / 4;

    let direction = ball.x < canvas.width / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
  }

  if (ball.x + ball.radius < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x - ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
};

const game = () => {
  render();
  update();
};

const framePerSecond = 60;
setInterval(game, 1000 / framePerSecond);
