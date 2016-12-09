
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();

//Variável que define a larguara de um poligono
var cw = 10;
var direction;
var food;
var score = 0;
var score_last = 0;
var score_max = 0;
var game_over = false;

var snake_array;

function finish() {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    ctx.font = "bold 50px Verdana";
    ctx.fillText('Game Over', 55, 190);
    ctx.strokeText('Game Over', 55, 190);
    set_score();
    game_over = true;
}

function init() {
    score_last = score;
    score_max = (score > score_max) ? score : score_max;
    direction = "right";
    create_snake();
    create_food();
    score = 0;
    game_over = false;

    //Permite mover a cobra agora usando um temporizador que irá
    //desencadear a função da pintura cada 60ms
    if (typeof game_loop != "undefined")
        clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
}
init();

function create_snake()
{
    var length = 5;
    snake_array = [];
    for (var i = length - 1; i >= 0; i--)
    {
        //cria uma cobra horizontal a partir do canto superior esquerdo
        snake_array.push({x: i, y: 0});
    }
}

function create_food()
{

    food = {
        x: Math.round(Math.random() * (w - cw) / cw),
        y: Math.round(Math.random() * (h - cw) / cw),
    };
    //Define um limite para a aparicação da comida
    food.y = (food.y > 42) ? 42 : food.y;

    //Isto irá criar uma célula com x / y entre 0-44
    //Porque há 45(450/10) posições entre as linhas e colunas
}

//Lets paint the snake now
function paint()
{
    //Redeniza a cobra
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //Movimento para a cobra vir aqui
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;

    if (direction == "right")
        nx++;
    else if (direction == "left")
        nx--;
    else if (direction == "up")
        ny--;
    else if (direction == "down")
        ny++;

    //Permite adicionar o jogo sobre cláusulas agora
    if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array))
    {
        finish();
        return;
    }

    //Se a posição da cabeça, for a mesma da comida,
    //cria uma nova cabeça ao invés de mover a calda
    if (nx == food.x && ny == food.y)
    {
        var tail = {x: nx, y: ny};
        score++;
        create_food();
    } else
    {
        //Sai a última célula
        var tail = snake_array.pop();
        tail.x = nx;
        tail.y = ny;
    }
    //A cobra agora pode comer a comida
    //Recoloca a cauda como a primeira célula
    snake_array.unshift(tail);

    for (var i = 0; i < snake_array.length; i++)
    {
        var c = snake_array[i];
        head = (i == 0) ? true : false;
        paint_cell(c.x, c.y, head);
    }

    //Cria os alimentos
    paint_cell(food.x, food.y);
    set_score();
}

function paint_cell(x, y, head)
{
    ctx.fillStyle = (head == true) ? "purple" : "black";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}

function check_collision(x, y, array)
{
    //Verifica se x/y existe em uma matriz de células
    for (var i = 0; i < array.length; i++)
    {
        if (array[i].x == x && array[i].y == y)
            return true;
    }
    return false;
}

$(document).keydown(function (e) {
    if (!game_over) {
        var key = e.which;
        if (key == "37" && direction != "right")
            direction = "left";
        else if (key == "38" && direction != "down")
            direction = "up";
        else if (key == "39" && direction != "left")
            direction = "right";
        else if (key == "40" && direction != "up")
            direction = "down";
    }

})

function set_score() {

    //Cria o painel do score
    ctx.fillStyle = "black";
    //(pos esq),(cima baixo),(esq comprimento),(largura)
    ctx.fillRect(0, 430, 450, 20);
    //Exibe os scores
    ctx.fillStyle = "yellow";
    ctx.font = "12px Verdana";
    var score_text = "Score: " + score;
    ctx.fillText(score_text, 5, h - 5);
    var score_last_text = "Last Score: " + score_last;
    ctx.fillText(score_last_text, 120, h - 5);
    var score_max_text = "Max Score: " + score_max;
    ctx.fillText(score_max_text, 300, h - 5);
}