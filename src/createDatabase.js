const { connection } = require('./connector')
const { data } = require('./data')

const refreshAll = async () => {
    await connection.deleteMany({});
    await connection.insertMany(data);
}
refreshAll().then(_=>console.log("Successfully uploaded")).catch((err)=>console.log("error occurred",err));