
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();
var cw = 10;
var direction;
var food;
var score = 0;
var score_last = 0;
var score_max = 0;
var game_over = false;
var snake_array = [];


function play() {
    init();
}

function finish() {

    ctx.fillStyle = '#195D00';
    ctx.font = "bold 55px Verdana";
    ctx.fillText('S  N  A  K  E', 38, 256.5);

    //Desenha o captcha do score
    var x = 40, y = 201.5, n = 30, q = 4
    for (var i = 0; i < 1; i++) {
        draw_cptcha(x, y, n, q, set_color());
        x += 4;
    }

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    ctx.font = "bold 50px Verdana";
    ctx.fillText('Game Over', 55, 190);
    ctx.strokeText('Game Over', 55, 190);
    ctx.fillStyle = 'white';
    ctx.font = "40px Verdana";
    ctx.fillText("Score: " + score, 55, 250);
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


function draw_cptcha(x, y, n, q, color) {
    for (var i = 0; i < n; i++) {
        ctx.fillStyle = color[i];
        var some = 10;
        for (var j = 0; j < 6; j++) {
            ctx.fillRect(x, y + some, q, q);
            some += 10;
        }
        x += 12;
    }
}

function set_color() {
    var arr = [
        '#ffff66',
        '#ffcc99',
        '#ff9999',
        '#ff6699',
        '#ff33cc',
        '#cc00cc',
        '#9900cc',
        '#6600cc',
        '#9900ff',
        '#6600ff',
        '#3366ff',
        '#0099ff',
        '#0066cc',
        '#0099cc',
        '#336699',
        '#003366',
        '#006666',
        '#009999',
        '#00cc99',
        '#00ff99',
        '#99ff99',
        '#ccff99',
        '#ffff00',
        '#ffcc00',
        '#ff9933',
        '#ff6600',
        '#ff0000',
        '#990000'
    ];
    return arr;
}

$(document).ready(function () {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'chartreuse';
    ctx.font = "bold 50px Verdana";
    ctx.fillText('SNAKE', 55, 90);
    ctx.strokeText('SNAKE', 55, 90);

    ctx.fillText('>-2000', 55, 135);
    ctx.strokeText('>-2000', 55, 135);


    ctx.fillStyle = 'chartreuse';
    ctx.strokeStyle = 'white';
    ctx.font = "bold 16px Verdana";

    ctx.fillText('                         __ ', 55, 190);
    ctx.fillText('           ---_ ...... _/_ -   ', 55, 200);
    ctx.fillText('          /  .      ./ .\'*\ \    ', 55, 210);
    ctx.fillText('          : \'         /__-\'   \. ', 55, 220);
    ctx.fillText('         /                      )', 55, 230);
    ctx.fillText('       _/                  >   .\' ', 55, 240);
    ctx.fillText('     /   \'   .       _.-" /  .\'   ', 55, 250);
    ctx.fillText('     \           __/"     /.\'    ', 55, 260);
    ctx.fillText('      \ \'--  .-" /     //\'', 55, 270);
    ctx.fillText('        \|  \ | /     // ', 55, 280);
    ctx.fillText('             \:     //', 55, 290);
    ctx.fillText('          `\/     //', 55, 300);
    ctx.fillText("           \__`\/ /  ASH", 55, 310);
    ctx.fillText('               \_|', 55, 320);

//ctx.fillText('                                             .o@*hu   ', 55, 100);
//ctx.fillText('                      ..      .........   .u*"    ^Rc         ', 55, 110);
//ctx.fillText('                    oP""*Lo*#"""""""""""7d" .d*N.   $  ', 55, 120);
//ctx.fillText('                   @  u@""           .u*" o*"   #L  ?b  ', 55, 130);
//ctx.fillText('                  @   "              " .d"  .d@@e$   ?b.  ', 55, 140);
//ctx.fillText('                 8                    @*@me@#         \'"Nu    ', 55, 150);
//ctx.fillText('                @                                        \'#b  ', 55, 160);
//ctx.fillText('              .P                                           $r ', 55, 170);
//ctx.fillText('            .@"                                  $L        $  ', 55, 180);
//ctx.fillText('          .@"                                   8"R      dP  ', 55, 190);
//ctx.fillText('       .d#"                                  .dP d"   .d#  ', 55, 200);
//ctx.fillText('      xP              .e                 .ud#"  dE.o@"(  ', 55, 210);
//ctx.fillText('      $             s*"              .u@*""     \'""\dP"   ', 55, 220);
//ctx.fillText('      ?L  ..                    ..o@""        .$  uP ', 55, 230);
//ctx.fillText('       #c:$"*u.             .u@*""$          uR .@" ', 55, 240);
//ctx.fillText('        ?L$. \'"""***Nc    x@""   @"         d" JP   ', 55, 250);
//ctx.fillText('         ^#$.        #L  .$     8"         d" d"     ', 55, 260);
//ctx.fillText('           \'          "b.\'$.   @"         $" 8" ', 55, 270);
//ctx.fillText('                       \'"*@$L $"         $  @ ', 55, 280);
//ctx.fillText('                       @L    $"         d" 8\  ', 55, 290);
//ctx.fillText('                       $$u.u$"         dF dF  ', 55, 300);
//ctx.fillText('                       $ """   o      dP xR ', 55, 310);
//ctx.fillText('                       $      dFNu...@"  $ ', 55, 320);
//ctx.fillText('                       "N..   ?B ^"""   :R  ', 55, 330);
//ctx.fillText('                         """"* RL       d&gt; ', 55, 340);
//ctx.fillText('                                "$u.   .$ ', 55, 350);
//ctx.fillText('                                  ^"*bo@" tony', 55, 360);
});