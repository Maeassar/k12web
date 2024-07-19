const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 修改为你的MySQL用户名
    password: '123456', // 修改为你的MySQL密码
    database: 'k12'
});

db.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('连接到MySQL数据库');
});

app.post('/api/login', (req, res) => {
    const { name, password, permission } = req.body;

    const query = 'SELECT * FROM user WHERE name = ? AND password = ? AND permission = ?';
    db.query(query, [name, password, permission], (err, results) => {
        if (err) {
            console.error('查询错误:', err);
            return res.status(500).send({ success: false, message: '服务器错误' });
        }

        if (results.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});

app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});
