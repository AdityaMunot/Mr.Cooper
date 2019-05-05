const express 		= require('express');
const bodyParser 	= require('body-parser');
const mysql 		= require('mysql');
const cors 			= require('cors');
const exec          = require('child_process').exec
var nodemailer      = require('nodemailer');


// Dariel //

const connection1 = mysql.createPool({
	host: 'mallard.stevens.edu',
    user: 'dbobadilla',
    password: '2019admin',
    database: 'scheduling'
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/subjects', function(req, res) {
	connection1.query('SELECT id, sub_alias, sub_name FROM subjects', function(err, results, fields) {
		if (err) throw err;
		res.send(results);
	});
});

app.get('/courses/:subID', function(req, res) {

	let subID = req.params.subID;

	connection1.query('SELECT * FROM sections WHERE sub_id = ' + subID, function(err, results, fields) {

		if (err) throw err;
		res.send(results);
	});
});

app.post('/shortlist', function(req, res) {
	let data = [req.body.student_id, req.body.course_id, '2019 Spring'];
	const sql = 'INSERT INTO shortlist (student, course, term) VALUES (?,?,?)';
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send({reply:'ok'});
	});
});

app.post('/getshortlist', function(req, res) {
	let data = [req.body.student_id];
	const sql = 'SELECT courses.summary, courses.easy, courses.useful, courses.rating,  courses.course_name FROM shortlist, courses WHERE shortlist.course=courses.id AND shortlist.student= ?';
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send(results);
	});
});

app.post('/passedcourselist', function(req, res) {
	let data = [req.body.student_id];
	const sql = 'SELECT courses.summary, courses.easy, courses.useful, courses.rating, courses.course_name FROM student_course_list, courses WHERE student_course_list.course_id=courses.id AND student_course_list.student_id= ?';
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send(results);
	});
});

app.post('/coursefeedback', function(req, res) {
	let data1 = [req.body.useful, req.body.easy, req.body.rating, req.body.course_name, ];
	const sql = 'UPDATE courses SET useful = ?, easy = ?, rating = ? WHERE course_name = ?';
	connection1.query(sql, data1, function(err, results, fields) {
		if (err) throw err;
		res.send({result: 'ok'});
	});
});

app.post('/inscomment', function(req, res) {
	let data = [req.body.clear, req.body.engaging, req.body.rating, req.body.instructor, ];
	const sql = 'UPDATE instructors SET clear = ?, engaging = ?, rating = ? WHERE name = ?';
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send({result: 'ok'});
	});
});

app.post('/coursecomment', function(req, res) {
	let data1 = [ req.body.course_name, req.body.comment,];
	const sql = 'INSERT INTO course_comment (course, comment) VALUES (?,?)';
	connection1.query(sql, data1, function(err, results, fields) {
		if (err) throw err;
		res.send({result: 'ok'});
	});
});

app.post('/getInstructorlist', function(req, res) {
	let data = [req.body.course_name];
	const sql = 'SELECT DISTINCT sections.Instructor, instructors.engaging, instructors.clear, instructors.rating FROM sections, instructors WHERE instructors.name = sections.Instructor AND sections.course_label = ?';
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send(results);
	});
});

app.post('/getCommentlist', function(req, res) {
	let data = [req.body.course_name];
	const sql = "SELECT comment FROM course_comment WHERE comment !='' AND course = ?";
	connection1.query(sql, data, function(err, results, fields) {
		if (err) throw err;
		res.send(results);
	});
});

// app.get('/groupedCourses/:subAlias', function(req, res) {

// 	const subAlias = req.params.subAlias;

// 	connection.query("SELECT * FROM courses WHERE sub_alias = '" + subAlias + "' GROUP BY course_number", function(err, results, fields) {

// 		if (err) throw err;
// 		res.send(results);
// 	});
// });

app.get('/total', function(req, res) {

	var query = 'SELECT * FROM sections';

	connection1.query( query, function (cerr, rows, fields) {

		var arr = [];
		var results = {};

		for (var i = 0; i < rows.length; i++) {

			key = rows[i].course_label;

			if (!(key in results)) {
				results[key] = [rows[i]];
			}
			else {
				results[key].push(rows[i]);
			}
		}

		for ( key in results) {
			var obj = {};
			obj.course_name = key;
			obj.sections = results[key];
			arr.push(obj);
		}

		res.send({total: arr.length});

	});

});

app.get('/limited_courses/:offset', function(req, res) {

	let offset = req.params.offset;

	var query = 'SELECT sections.*, courses.id as course_id, courses.summary, courses.useful, courses.easy, courses.rating FROM sections, courses WHERE sections.course_label = courses.course_name';

	connection1.query( query, function (cerr, rows, fields) {

		var arr = [];
		var resultArray = [];
		var results = {};

		for (var i = 0; i < rows.length; i++) {

			key = rows[i].course_label;

			if (!(key in results)) {
				results[key] = [rows[i]];
			}
			else {
				results[key].push(rows[i]);
			}
		}

		for ( key in results) {
			var obj = {};
			obj.course_name = key;
			obj.course_id = results[key][0].course_id;
			obj.summary = results[key][0].summary;
			obj.useful = results[key][0].useful;
			obj.easy = results[key][0].easy;
			obj.rating = results[key][0].rating;
			obj.sections = results[key];
			arr.push(obj);
		}

		for (var j = parseInt(offset); j < parseInt(offset)+10; j++ ) {
			resultArray.push(arr[j]);
		}
		res.send(resultArray);

	});

});


app.get('/grouped_courses/', function(req, res) {

	var query = 'SELECT * FROM sections';

	connection1.query( query, function (cerr, rows, fields) {

		var results = {};

		for (var i = 0; i < rows.length; i++) {

			key = rows[i].course_label;

			if (!(key in results)) {
				results[key] = [rows[i]];
			}
			else {
				results[key].push(rows[i]);
			}
		}

		res.send(results);

	});
});

app.get('/groupBySubject/:subId', function(req, res) {

	const subID = req.params.subId;

	var query = "SELECT * FROM sections WHERE sub_id = " + subID + " AND Activity='LEC'";
console.log(query);
	connection1.query( query, function (cerr, rows, fields) {

		var arr = [];
		var results = {};

		for (var i = 0; i < rows.length; i++) {

			key = rows[i].course_label;

			if (!(key in results)) {
				results[key] = [rows[i]];
			}
			else {
				results[key].push(rows[i]);
			}
		}

		for ( key in results) {
			var obj = {};
			obj.course_name = key;
			obj.sections = results[key];
			arr.push(obj);
		}

		res.send(arr);

	});
});

app.get('/courses', function(req, res) {

	connection1.query('SELECT * FROM sections LIMIT 20', function(err, rows, fields) {

		if (err) throw err;
		res.send(rows);
	});

});

app.post('/signup', function(req, res) {

	const name = req.body.name;
	const email = req.body.email;
	const phone = req.body.phone;
	const password = req.body.password;

	const sql = "INSERT INTO students (name, email, phone, password) VALUES ('" + name + "', '" + email + "', '" + phone + "', MD5('" + password + "'))";

	connection1.query(sql, function(err, results, fields) {
		if (err) {
			res.send(JSON.stringify({msg: 'signup failed'}));
		} else {
			res.send(JSON.stringify({msg: 'success', student_name: name, student_id: results.insertId}));
		}
	});

});

app.post('/signin', function(req, res) {

	const name = req.body.name;
	const password = req.body.password;

	const sql = "SELECT * FROM students WHERE name='" + name + "' AND password=MD5('" + password + "')";

	connection1.query(sql, function(err, results, fields) {
		if (err) {
			res.send(JSON.stringify({msg: 'signup failed'}));
		} else if (results.length < 1) {
			res.send(JSON.stringify({msg: 'You have no account.'}));
		}
		else {
			res.send(JSON.stringify({msg: 'success', student_name: results[0].name, student_id: results[0].id}));
		}
	});

});

// const connection1 = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'scheduling'
// });

// const app = express();

// app.use(cors());

// app.get('/subjects', function(req, res) {
// 	connection1.query('SELECT id, sub_alias, sub_name FROM subjects', function(err, results, fields) {
// 		if (err) throw err;
// 		res.send(results);
// 	});
// });

// app.get('/courses/:subID', function(req, res) {
// 	let subID = req.params.subID;
// 	connection1.query('SELECT * FROM courses1 WHERE sub_id = ' + subID, function(err, results, fields) {
// 		if (err) throw err;
// 		res.send(results);
// 	});
	
// });


// Sriki //
const select_all_products_query = "select * from products";
const select_all_exchangecollection="select * from exchangecollection";

//DB config
const connection = mysql.createConnection({
    host: 'mallard.stevens.edu',
    user: 'dbobadilla',
    password: '2019admin',
    database: 'scheduling'
});

//connect to db
connection.connect((err) => {
    if (err) {
        console.log("err");
    }
    console.log("node_db connected...")
});

app.get('/', (req, res) => {
    res.send('goto /products to see comment section')
});

app.get('/individualcourses/:studentId', (req,res)=> {
    connection.query(
        "select * from studentcourses where student_id= " + req.params.studentId, 
    (err,results) => {
        if(err){
            return res.send(err)
        } else{
            return res.send(results)
        }
    })
})


app.get('/individualexchange/:studentId', (req,res)=> {
    connection.query(
        "select * from exchangecollection where student_id= " + req.params.studentId, 
    (err,results) => {
        if(err){
            return res.send(err)
        } else{
            return res.send(results)
        }
    })
})

app.get('/swap/add', (req, res) => {
    // parse your parameters
    const {
        student_id,
        ex_g_course_id,
        ex_w_course_id
    } = req.query;

    try {
        // run the query
        connection.query(
            "INSERT INTO exchangecollection (student_id, ex_g_course_id, ex_w_course_id) VALUES ?",
            [
                [
                    [student_id, ex_g_course_id,ex_w_course_id ]
                ]
            ],
            (err, results) => {
                if (err) throw err
            }
        );

        // send the success note
        res.send('swap request added');
    } catch (exp) {
        // or send the err note
        res.send(exp);
    }

    exec('python "D:\\college\\ssw 590\\swapper_final3.py"', (err, stdout, stderr) => {
        if (!err) {
            console.log(stdout)
        } else {
            console.log(stderr)
        }
    })
});

app.get('/swap', (req,res) =>{
    connection.query(select_all_exchangecollection,(err, results) =>{
        if(err) {
            return res.send(err)
        } else{
            return res.json({
                data:results
            })
        }
    })
})

app.get('/products', (req, res) => {
    connection.query(select_all_products_query, (err, results) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/products/add', (req, res) => {
    // parse your parameters
    const {
        c_name,
        price
    } = req.query;

    try {
        // run the query
        connection.query(
            "INSERT INTO products (c_name, price) VALUES ?",
            [
                [
                    [c_name, price]
                ]
            ],
            (err, results) => {
                if (err) throw err
            }
        );

        // send the success note
        res.send('Product added');
    } catch (exp) {
        // or send the err note
        res.send(exp);
    }
});


// Vineet //

var sql = 'SELECT * From test_notifications';

var con = mysql.createConnection({
    host: 'mallard.stevens.edu',
    user: 'dbobadilla',
    password: '2019admin',
    database: 'scheduling'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected to mallard database!');

    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length !== 0) {
            for (i = 0; i <= result.length-1; i++) {
                sendMail(i, result);
            }
        }
    });

});

function sendMail(i, result) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mrcooper690@gmail.com',
            pass: 'cooper@2018'
        }
    });

    var mailOptions = {
        from: 'mrcooper690@gmail.com',
        to: result[i].email,
        subject: result[i].message,
        // text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

app.listen(3200, () => {
	console.log('Server started as http://localhost:3200');
});