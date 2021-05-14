/********** Select canvas **********/

const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

/*********** Create the user and computer paddle ************/

const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "WHITE",
  score: 0,
};

const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "WHITE",
  score: 0,
};

/*********** The ball ***********/

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "WHITE",
};

/********** the net **********/

const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "WHITE",
};

/*********** Draw rectangle ************/

const drawRectangle = (x, y, w, h, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
};

/********** Draw the net **********/

const drawNet = () => {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRectangle(net.x, net.y + i, net.width, net.height, net.color);
  }
};

/*********** Draw circle ************/

const drawCircle = (x, y, r, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
};

/*********** Draw text ************/

const drawText = (text, x, y, color) => {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text, x, y);
};

/************** Render the game **************/
function render() {
  // Clear the canvas
  drawRectangle(0, 0, canvas.width, canvas.height, "BLACK");

  //draw the net
  drawNet();

  //Draw score
  drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5, "WHITE");

  //Draw the user and com paddle
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(com.x, com.y, com.width, com.height, com.color);

  //Draw the ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

/*************** Control the paddle ***************/
const movePaddle = (event) => {
  let rect = canvas.getBoundingClientRect();
  user.y = event.clientY - rect.top - user.width / 2;
};

canvas.addEventListener("mousemove", movePaddle);

/************** collision detection ***************/
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
    ball.right > player.left &&
    ball.bottom > player.top &&
    ball.left < player.right &&
    ball.top < player.bottom
  );
};

/*********** Reset the ball ************/
const resetBall = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
};

/********** update: pos, move, score ***********/
const update = () => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //Simple AI to control the computer paddle
  let computerLevel = 0.1;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x < canvas.width / 2 ? user : com;

  if (collision(ball, player)) {
    //where the player hit the ball
    let collidePoint = ball.y - (player.y + player.height / 2);

    //Normalization
    collidePoint = collidePoint / (player.height / 2);

    //Calculate the angle in radian
    let angleRad = collidePoint + Math.PI / 4;

    //X direction of the ball when it's hit
    let direction = ball.x < canvas.width / 2 ? 1 : -1;

    //Change the velocity X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.5;
  }

  //update the score
  if (ball.x - ball.radius < 0) {
    //the computer win
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    //the user win
    user.score++;
    resetBall();
  }
};

/*********** game init ***********/
const game = () => {
  update();
  render();
};

//Loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
