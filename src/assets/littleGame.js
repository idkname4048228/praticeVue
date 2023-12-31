// source code from https://github.com/courajs/pipes

Array.prototype.random_index = function () {
    let index = Math.floor(Math.random() * this.length);
    if (index === this.length)
        index -= 1;
    return index;
}


Array.prototype.random = function () {
    let index = this.random_index();
    return this[index];
}

function Cell(x, y, board) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.connections = {};
    this.plumbed = false;
    this.filled = false;

    this.view = new CellView(this);
}

Cell.prototype.render = function () {
    let self = this;
    let type = determine_piece_type(this.connections);
    let rotation = determine_rotation(type, this.connections);
    let img_src = type;
    if (this.filled)
        img_src += '_green';
    this.view.set_inner_image(img_src);
    this.view.rotate(rotation);

    function determine_piece_type() {
        let cons = self.connections;
        let num_connections = !!cons.left + !!cons.top + !!cons.right + !!cons.bottom;
        if (num_connections === 0)
            return '0';
        if (num_connections === 1)
            return '1';
        if (num_connections === 3)
            return 'T';
        if (num_connections === 4)
            return '+';
        if (cons.left && cons.right || cons.top && cons.bottom)
            return 'I';
        return 'L';
    }

    function determine_rotation(piece_type) {
        let cons = self.connections;
        switch (piece_type) {
            case '0':
                return 0;
            case '1':
                return determine_1_rotation(cons);
            case 'I':
                return determine_i_rotation(cons);
            case 'L':
                return determine_l_rotation(cons);
            case 'T':
                return determine_t_rotation(cons);
            case '+':
                return 0;
        }

        function determine_1_rotation(cons) {
            if (cons.right)
                return 90;
            if (cons.bottom)
                return 180;
            if (cons.left)
                return 270;
            return 0;
        }
        function determine_i_rotation(cons) {
            if (cons.right)
                return 90;
            return 0;
        }
        function determine_l_rotation(cons) {
            if (cons.right && cons.bottom)
                return 90;
            if (cons.bottom && cons.left)
                return 180;
            if (cons.left && cons.top)
                return 270;
            return 0;
        }

        function determine_t_rotation(cons) {
            if (!cons.top)
                return 90;
            if (!cons.right)
                return 180;
            if (!cons.bottom)
                return 270;
            return 0;
        }
    }

}

Cell.prototype.rotate = function () {
    let cons = this.connections;
    let newcons = this.connections = {};

    if (cons.top)
        newcons.right = this.to_the_right();
    if (cons.right)
        newcons.bottom = this.below();
    if (cons.bottom)
        newcons.left = this.to_the_left();
    if (cons.left)
        newcons.top = this.above();
    this.render();
}

Cell.prototype.above = function () {
    return this.relative_cell(0, -1);
};
Cell.prototype.below = function () {
    return this.relative_cell(0, 1);
};
Cell.prototype.to_the_right = function () {
    return this.relative_cell(1, 0);
};
Cell.prototype.to_the_left = function () {
    return this.relative_cell(-1, 0);
};
Cell.prototype.relative_cell = function (x, y) {
    let new_x = this.x + x;
    let new_y = this.y + y;
    if (this.board.cells[new_x] && this.board.cells[new_x][new_y])
        return this.board.cells[new_x][new_y];
    return true;
};

Cell.prototype.neighbors = function () {
    let cells = this.board.cells;
    let x = this.x;
    let y = this.y;
    let result = [cells[x][y - 1], cells[x][y + 1]];
    if (cells[x - 1])
        result.push(cells[x - 1][y]);
    if (cells[x + 1])
        result.push(cells[x + 1][y]);
    result = result.filter(function (item) {
        return item;
    });
    return result;
};

Cell.prototype.connected_neighbors = function () {
    let cons = this.connections;
    let result = [];
    if (cons.top && cons.top.connections && cons.top.connections.bottom)
        result.push(cons.top);
    if (cons.right && cons.right.connections && cons.right.connections.left)
        result.push(cons.right);
    if (cons.bottom && cons.bottom.connections && cons.bottom.connections.top)
        result.push(cons.bottom);
    if (cons.left && cons.left.connections && cons.left.connections.right)
        result.push(cons.left);
    return result;
};


Cell.prototype.plumb = function () {
    let neighbors = this.neighbors();
    let plumbed_neighbors = neighbors.filter(function (item) {
        return item.plumbed;
    });
    let target = plumbed_neighbors.random();
    if (!target)
        throw new Error('whoah can\'t plumb there');
    connect(this, target);
    this.plumbed = true;
    this.render();
    target.render();


    function connect(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        if (dx === 1 && dy === 0) {
            a.connections.left = b;
            b.connections.right = a;
        }
        else if (dx === -1 && dy === 0) {
            a.connections.right = b;
            b.connections.left = a;
        }
        else if (dx === 0 && dy === 1) {
            a.connections.top = b;
            b.connections.bottom = a;
        }
        else if (dx === 0 && dy === -1) {
            a.connections.bottom = b;
            b.connections.top = a;
        }
        else {
            throw new Error('whoa, can\'t connect those two cells');
        }
    }
}

Cell.prototype.fill = function () {
    if (this.filled) return 0;
    this.filled = true;
    this.render();
    let fill_nums = this.connected_neighbors().map(function (cell) {
        let result = cell.fill();
        return result;
    });
    return fill_nums.reduce(function (a, b) { return a + b }, 1);
};

Cell.prototype.taxi_distance = function () {
    return Math.abs(this.x - 4) + Math.abs(this.y - 4);
};




function CellView(cell) {
    let self = this;
    this.cell = cell;
    this.el = create_and_insert_div();

    this.el.onclick = function () {
        self.cell.board.step += 1;
        self.cell.rotate();
        self.cell.board.refill();
    }

    function create_and_insert_div() {
        let div = document.createElement('div');
        div.className = 'cell';
        let game = document.getElementById('game');
        game.appendChild(div);
        return div;
    }

}

CellView.prototype.set_inner_image = function (image_name) {
    let image_path = 'littleGameImg/' + image_name + '.png';
    let img_html = '<img class="pipe" src="../src/assets/' + image_path + '""></img>';
    this.el.innerHTML = img_html;
}

CellView.prototype.rotate = function (angle) {
    this.angle = angle;
    let transform = 'rotate(' + this.angle + 'deg)'
    this.el.style.webkitTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.transform = transform;
}


function Board() {
    this.step = 0;
    this.win = false;

}


Board.prototype.init = function (size) {
    let gameContainer = document.querySelector(".game-container");

    if (gameContainer) {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
        const newDiv = document.createElement("div");
        newDiv.id = "game";

        // 將新的 <div> 元素加入到 .game-container 中
        gameContainer.appendChild(newDiv);
    }

    gameContainer.style.setProperty("--size", `${size}`);

    this.step = 0;
    this.size = size;
    this.win = false;
    let cells = this.cells = [];

    for (let column = 0; column < size; column++) {
        cells[column] = [];
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            cells[x][y] = new Cell(x, y, this);
        }
    }

    this.center().plumbed = true;
    this.center().render();

    let unplumbed_cells = this.center().neighbors();

    while (unplumbed_cells.length) {
        let index = unplumbed_cells.random_index();
        let cell_to_plumb = unplumbed_cells.splice(index, 1)[0];
        cell_to_plumb.plumb();
        let new_unplumbed = cell_to_plumb.neighbors().filter(function (item) {
            return !item.plumbed;
        });

        for (let i = 0; i < new_unplumbed.length; i++) {
            let cell = new_unplumbed[i];
            if (!(unplumbed_cells.indexOf(cell) + 1))
                unplumbed_cells.push(cell);
        }
        unplumbed_cells.sort(function (a, b) {
            return a.taxi_distance() - b.taxi_distance();
        })

    }


    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let num_rotations = [0, 1, 2, 3].random();
            for (let i = 0; i < num_rotations; i++)
                cells[x][y].rotate();
        }
    }

    this.center().fill();

}

Board.prototype.refill = function () {
    for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
            this.cells[x][y].filled = false;
            this.cells[x][y].render();
        }
    }
    if (this.center().fill() === this.area()) {
        console.log('hehe')
        this.win = true;
    }
};

Board.prototype.center = function () {
    let center = (this.cells.length - 1) / 2;
    return this.cells[center][center];
};

Board.prototype.area = function () {
    return this.cells.length * this.cells.length;
};

export default Board;

// source code from https://github.com/courajs/pipes