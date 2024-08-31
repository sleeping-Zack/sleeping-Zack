// 创造两个基本对象:蛇和食物
        // 食物:有位置,宽高,颜色
(function () {
    // 将食物放到数组里面方便我们食物被吃了之后再次出现
    let foodArr = [];
    function Food(x, y, width, height, bg) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 20;
        this.height = height || 20;
        this.bg = bg || 'black';
        // 计算分数
        this.count = 0;
    }
    //  添加食物初始化方法--init 放到scope地图里
    Food.prototype.init = function (scope) {
        // 删除食物的方法
        remove();
        // 创建一个div 来表示食物
        let div = document.createElement('div');
        // 把食物放到地图里
        scope.appendChild(div);
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.background = this.bg;
        div.style.position = 'absolute';
        // 这段代码随机计算并设置 div 的位置
        this.x = div.style.left = parseInt(Math.random() * (scope.offsetWidth / this.width)) * this.width + 'px';
        this.y = div.style.top = parseInt(Math.random() * (scope.offsetWidth / this.height)) * this.height + 'px';
        // 把食物放进数组
        foodArr.push(div);

    }
    // 删除食物的方法
    function remove() {
        // 循环数组,因为如果有多个食物时,数组中有多个数据
        for (let i = 0; i < foodArr.length; i++) {
            // 获取食物
            let item = foodArr[i];
            // 从地图中删除
            item.parentNode.removeChild(item);
            // 从数组中删除,从i开始,删除1个
            foodArr.splice(i, 1);
        }
    };
    // 将食物的构造函数暴露给全局
    window.Food = Food;

})();
// 蛇:有宽高,颜色,方向
(function () {
    let bodyArr = [];
    // 定义蛇
    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        // 构建蛇身体
        this.body = [
            { x: 3, y: 2, color: 'red' },
            { x: 2, y: 2, color: 'black' },
            { x: 1, y: 2, color: 'black' },
        ];
        // 方向
        this.direction = direction || 'right';
    }
    // 方法添加到原型上
    Snake.prototype.init = function (scope) {
        // 删除方法
        removeSnake();
        //循环遍历
        for (let i = 0; i < this.body.length; i++) {
            let item = this.body[i];
            // 创造蛇身体
            let div = document.createElement('div');
            // 追加到地图上
            scope.appendChild(div);
            // 设置身体样式
            div.style.position = 'absolute';
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.background = item.color;
            div.style.left = item.x * this.width + "px";
            div.style.top = item.y * this.height + "px";

            // 添加到数组
            bodyArr.push(div);

        }
    }
    // 在原型上添加蛇移动的方法
    Snake.prototype.move = function (scope, food, snake) {
        let i = this.body.length - 1;
        for (; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        switch (this.direction) {
            case 'right':
                this.body[i].x += 1;
                break;
            case 'left':
                this.body[i].x -= 1;
                break;
            case 'top':
                this.body[i].y -= 1;
                break;
            case 'bottom':
                this.body[i].y += 1;
                break;
        }
        // 吃到食物
        // 获取蛇头坐标
        // console.log(snake.width);
        let headX = this.body[0].x * this.width;
        let headY = this.body[0].y * this.height;


        // 进行判断
        if (headX == parseInt(food.x) && headY == parseInt(food.y)) {
            let last = this.body[this.body.length - 1];//获取蛇尾,让蛇尾加一
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color
            })
            food.init(scope);
            // 分数++
            food.count++;
            // 把分数渲染到页面
            document.querySelector(".score").innerHTML = food.count;

        }




    }
    // 写删除方法
    function removeSnake() {
        let i = bodyArr.length - 1;
        for (; i >= 0; i--) {
            let item = bodyArr[i];
            // 从地图上删除
            item.parentNode.removeChild(item);
            // 从数组中删除
            bodyArr.splice(i, 1);
        }
    }


    // 将蛇的构造函数暴露给全局
    window.Snake = Snake;
})();
// 封装游戏对象
(function () {
    function Game(scope) {
        // 地图
        this.scope = scope;
        // 食物
        this.food = new Food();
        // 蛇
        this.snake = new Snake();
        // 先设置timer,节约内存
        this.timer = null;
        // 设置游戏状态
        this.isDeath = false;


    }
    // 初始化
    Game.prototype.init = function () {
        this.food.init(this.scope);
        this.snake.init(this.scope);
        this.gameMove();
        // 调用键盘方向方法()
        this.changeDirection();
    }
    // 定时器,游戏动画
    Game.prototype.gameMove = function () {
        let that = this;//函数默认指向window

        that.timer = setInterval(function () {
            // console.log(this);此时发现this指向window
            // console.log(that);//改变this指向让他指向我们的Game
            that.snake.move(that.scope, that.food, that.snake);
            that.snake.init(that.scope);
            // 控制小蛇不要超过地图画布
            // 横坐标最大值
            let maxX = that.scope.offsetWidth / that.snake.width;
            // 纵坐标最大值
            let maxY = that.scope.offsetHeight / that.snake.height;

            // 上大招--控制蛇头坐标不要超过我们设置的大小
            let headX = that.snake.body[0].x;
            let headY = that.snake.body[0].y;

            // 判断 X 轴
            if (headX < 0 || headX >= maxX || headY < 0 || headY >= maxY) {
                // 清除定时器
                clearInterval(that.timer);
                // 设置状态
                that.isDeath = true;
            }

            //结束动画
            if(that.isDeath){
                let status = document.querySelector('.status');
                status.innerHTML = '结束';
                status.className='fail';
                setTimeout(function(){
                    alert('分数'+that.food.count);
                },10);

            }
        }, 150);
    }
    // 键盘按下改变小蛇方向
    Game.prototype.changeDirection = function () {
        let that = this;//开发经验，大招
        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                    that.snake.direction = 'left';
                    break;
                case 38:
                    that.snake.direction = 'top';
                    break;
                case 39:
                    that.snake.direction = 'right';
                    break;
                case 40:
                    that.snake.direction = 'bottom';
                    break;
            }
        })
    }
    // 还是暴露
    window.Game = Game;
})();

// 获取地图
let scope = document.querySelector('.scope');

let game = new Game(scope);
game.init();