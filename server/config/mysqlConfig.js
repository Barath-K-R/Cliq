import mysql from 'mysql2';

const mysqldb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9659223637',
    database: 'cliq',
    port: 3306
});

mysqldb.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('MySQL Connected...');
});

export default mysqldb;