const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
// const round= require('mongo-round');

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get('/totalRecovered',(req,res)=>{
    let totalRecovered= 0;
    connection.find().then(states=>{
        states.forEach((state)=>{
            // console.log(state.infected);
            totalRecovered+= state.infected;
        });
        // console.log(totalRecovered);
        res.send({data: {_id:"total",recovered: totalRecovered}});
    });
});

app.get('/totalActive',(req,res)=>{
    let totalActive= 0;
    connection.find().then(states=>{
        states.forEach((state)=>{
            totalActive+= (state.infected- state.recovered);
        });
        res.send({data: {_id:"total",active: totalActive}});
    });
});

app.get('/totalDeath',(req,res)=>{
    let totalDeath= 0;
    connection.find().then(states=>{
        states.forEach((state)=>{
            totalDeath+= state.death;
        });
        res.send({data: {_id:"total",death: totalDeath}});
    });
});

app.get('/hotspotStates',(req,res)=>{
    let hotspotStates= [];
    connection.find().then(states=>{
        states.forEach((state)=>{
            let rate= (state.infected- state.recovered)/state.infected;
            if(rate>0.1){
                hotspotStates.push({state: state.state,rate: rate});
            }
        });
        res.send({data: hotspotStates});
    });
});

app.get('/healthyStates',(req,res)=>{
    let healthyStates= [];
    connection.find().then(states=>{
        states.forEach((state)=>{
            let mortality= (state.death)/state.infected;
            if(mortality<0.005){
                healthyStates.push({state: state.state,mortality: mortality});
            }
        });
        // console.log(healthyStates);
        res.send({data: healthyStates});
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;