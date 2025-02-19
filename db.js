const mysql = require('mysql')

let _ = class DB {

    // edit this line to be a database call

    // TODO:
    static localStorage = [{id:1, username:"username", password:"password"}]

    

    static write(data){

    }

    static async findByUsername(username) {
        let user = false;

        // var mysqlDB = mysql.createConnection({
        //     host: "localhost",
        //     user: "root",
        //     password: "",
        //     database: "grp467"
        // })

        // await mysqlDB.connect( async function(err) {
        //     if (err) throw err;
        //     console.log(`connected to server`)

        //     // var query = `Select * from userlogin where username="${username}"`
        //     var DBquery = "Select * from userlogin where username=\'" + username + "\""

        //     console.log(DBquery)

        //     const data = await mysqlDB.query("Select * from userlogin where username=\"" + username + "\"", function (err, result) {
        //         if (err) throw err;
        //         user = JSON.stringify(result)
        //         console.log("Result: " + user)
        //         return user
        //     })
        // })
        

        
        

        // mock db for testing purpose used here
        if (username) {
            for (let item of this.localStorage) {
                if (item.username === username) {
                    user = item   
                }
            }
        } 
        
        return user
    }

    static findByID(id) {
        if (id) {
            for (let item of this.localStorage) {
                if (item.id === id) {
                    return item
                }
            }
        }
        return false
    }
    
};

module.exports = _;