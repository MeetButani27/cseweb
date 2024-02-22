const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const url = require('url');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const port = 8000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: '3306',
    database: 'cspit_cse'
});


app.post('/addUser', (req,res) => {
    const {f_name,l_name,email_id,phone_no,subject,password,re_password} = req.body;
    
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Insert into users(f_name,l_name,email_id,phone_no,subject,password,re_password) values(?,?,?,?,?,?,?)", [f_name,l_name,email_id,phone_no,subject,password,re_password], (err, result) => {
            connection.release()

            if(!err) {
                res.send({ message: 'User added successfully!!'});
            } else {
                res.send({ message: 'Error adding user to DB'});
            }
        });
    })
});


app.get('/allUser', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Select * from users", (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of all users'});
            }
        });
    })
});



// ===================== Achievements =========================

app.post('/addAchievement', (req,res) => {
    const {s_id, s_name,s_email,s_counsellor,s_semester,phone_no,issue_org,course_name,score,issue_date,certi_image} = req.body;
    
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Insert into achievements(s_id, s_name,s_email,s_counsellor,s_semester,phone_no,issue_org,course_name,score,issue_date,certificate_image) values(?,?,?,?,?,?,?,?,?,?,?)", [s_id, s_name,s_email,s_counsellor,s_semester,phone_no,issue_org,course_name,score,issue_date,certi_image], (err, result) => {
            connection.release()

            if(!err) {
                res.status(200).send({ message: 'Student\'s Achievement added successfully!!'});
            } else {
                res.status(404).send({ message: 'Error adding Achievement to DB'});
            }
        });
    })
});


app.get('/allAchievements', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }
        
        connection.query(`Select * from achievements`, (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of all Achievements'});
            }
        });
    });
});


app.post('/allAchievements', (req,res) => {
    const {sortBy,order} = req.body;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }
        
        connection.query(`Select * from achievements order by ${sortBy} ${order}`, (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of all Achievements'});
            }
        });
    });
});


app.get('/getAchievement/:id', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query(`Select * from achievements where id=${req.params.id}`, (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of Achievement'});
            }
        });
    });
});


app.put('/updateAchievement/:id', (req, res) => {
    const id = req.params.id;
    const {s_id, s_name,s_email,s_counsellor,s_semester,phone_no,issue_org,course_name,score,issue_date,certificate_image} = req.body;
    const query = "Update achievements set s_id=?, s_name=?, s_email=?, s_counsellor=?, s_semester=?, phone_no=?, issue_org=?, course_name=?, score=?, issue_date=?, certificate_image=? where id=?"; 
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query(query, [s_id, s_name,s_email,s_counsellor,s_semester,phone_no,issue_org,course_name,score,issue_date,certificate_image, id], (err, result) => {
            connection.release()

            if(!err) {
                res.send({ message: 'Successfully updated Achievements data'});
            } else {
                console.log(err);
                res.send({ message: 'Error updating Achievements data of users'});
            }
        });
    });
});


app.delete('/deleteAchievement/:id', (req, res) => {
    const id = req.params.id;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Delete from achievements where id=?", [id], (err, result) => {
            connection.release()

            if(!err) {
                res.send({ message: 'Successfully deleted this Achievement'});
            } else {
                console.log(err);
                res.send({ message: 'Error deleting this Achievement'});
            }
        });
    });
});



// ===================== Expert Talks =========================

app.post('/addExpertTalk', auth, (req,res) => {
    const {f_name, f_email,f_phone_no,expert_name,expert_email,expert_phone_no,expert_topic,subject_name,semester,mode,talk_date,invitation_url,thanking_url,event_image} = req.body;
    
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Insert into experttalk(f_name, f_email,f_phone_no,expert_name,expert_email,expert_phone_no,expert_topic,subject_name,semester,mode,talk_date,invitation_url,thanking_url,event_image) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [f_name, f_email,f_phone_no,expert_name,expert_email,expert_phone_no,expert_topic,subject_name,semester,mode,talk_date,invitation_url,thanking_url,event_image], (err, result) => {
            connection.release();

            if(!err) {
                res.send({ message: 'Expert Talk\'s data Added successfully!!'});
            } else {
                res.send({ message: 'Error adding Expert talk to DB'});
            }
        });
    })
});


app.get('/allExpertTalks', (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Select * from experttalk", (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of Expert Talks'});
            }
        });
    })
});


app.post('/allExpertTalks', (req,res) => {
    const {sortBy,order} = req.body;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query(`Select * from experttalk order by ${sortBy} ${order}`, (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                res.send({ message: 'Error fetching data of Expert Talks'});
            }
        });
    })
});


app.put('/updateExpertTalk/:id', (req, res) => {
    const id = req.params.id;
    const {f_name, f_email,f_phone_no,expert_name,expert_email,expert_phone_no,expert_topic,subject_name,semester,mode,talk_date,invitation_url,thanking_url,event_image} = req.body;

    const query = "Update experttalk set f_name=?, f_email=?, f_phone_no=?, expert_name=?, expert_email=?, expert_phone_no=?, expert_topic=?, subject_name=?, semester=?, mode=?, talk_date=?, invitation_url=?, thanking_url=? ,event_image=? where id=?"; 
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query(query, [f_name,f_email,f_phone_no,expert_name,expert_email,expert_phone_no,expert_topic,subject_name,semester,mode,talk_date,invitation_url,thanking_url,event_image, id], (err, result) => {
            connection.release()

            if(!err) {
                res.send({ message: 'Successfully updated Expert Talk data'});
            } else {
                console.log(err);
                res.send({ message: 'Error updating Expert Talk data'});
            }
        });
    });
});


app.delete('/deleteExpertTalk/:id', (req, res) => {
    const id = req.params.id;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }

        connection.query("Delete from experttalk where id=?", [id], (err, result) => {
            connection.release()

            if(!err) {
                res.send(result);
            } else {
                console.log(err);
                res.send({ message: 'Error deleting this Expert talk'});
            }
        });
    });
});



// ===================== Login =========================

app.post('/login', async(req, res) => {
    const { email_id, password } = req.body;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return;
        }
        
        connection.query("Select * from users where email_id=? and password=?", [email_id, password], (err, result) => {
            connection.release()

            if(result.length == 0) {
                res.status(404).send({ message: 'Invalid login credentials'});
            } 
            else if(!err) {
                const token = jwt.sign({ email_id: email_id }, JWT_SECRET);

                if(token)
                    res.status(200).send({ token: token });
                else
                    res.status(404).send({ message: "Error generating token" });
            }
            else {
                res.send({ message: 'User LogIn error'});
            }
        });
    });
});