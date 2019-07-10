const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var arr = [];
setInterval(giveRole, 30000);

client.on('message', function(msg){
if(msg.channel.type === "dm"){
    if (msg.author.bot) return;
    if(msg.content.toLowerCase().includes("!verifyme")){
        
        var filedata = fs.readFileSync('./activated.json', { encoding: 'utf8' });
        var act = JSON.parse(filedata);
        var found = false;
        act.forEach(element => {
            if(element.id == msg.author.id){
                found = true;
            }
        });

        if(found == true){
            msg.channel.send("It appears that you have already verfied yourself.")
        }else{
            var request = require("request");

            var options = { method: 'GET',
            url: 'http://www.hhverification.xyz/api.php',
            qs: 
            { 
                id: '597558716946055215',
                type: 'user',
                uid: msg.author.id }
            };
    
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
             
            if(body != ""){
                var user = JSON.parse(body);
                if(msg.content.toLowerCase().includes(user.Key)){
                    msg.channel.send("Congratulations, Welcome to **Hobby Heights**");
                    addActivated(msg.author.id);
                    arr.push({id:msg.author.id});
                }else{
                    msg.channel.send("The key that you presented is invalid.");
                }
            }else{
                msg.channel.send("Please visit http://hhverification.xyz/ and login via discord to get a token.")
            }
    
            });   
        }



    }else if(msg.content.toLowerCase().includes("!info")){

        var did = /\d{18}/gi;
        var found = msg.content.toLowerCase().match(did);

        found.forEach(element =>{
            getUser(element,msg);

        });   
    }
}
});

client.login("");


function addActivated(userid){

    var filedata = fs.readFileSync('./activated.json', { encoding: 'utf8' });
    var act = JSON.parse(filedata);
    act.push({id: userid});


        fs.writeFileSync('./activated.json', JSON.stringify(act), { encoding: "utf8" }, function (err) {
            if (err) throw err;
        });


}

function giveRole(){

    var guild = null;

    client.guilds.forEach(element =>{
       if(element.id == "475261208124194826"){
           guild  = element;
       }
        
    })

    if(arr.length != 0){

        arr.forEach(element =>{
            console.log(element.id);
            var user = null;
            guild.members.forEach(member =>{
                if(member.id == element.id){
                    user = member;
                }
            });
            let role = guild.roles.find(r => r.id === "549281251547283486");
            user.addRole(role).catch(console.error);
            
        });

        arr = [];
    }

}


function getUser(id,msg){
    var final = null;
    var request = require("request");

    var options = { method: 'GET',
    url: 'http://www.hhverification.xyz/api.php',
    qs: 
    { 
        id: '597558716946055215',
        type: 'user',
        uid: id }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
     
    if(body != ""){
        var user = JSON.parse(body);

        if(id.toLowerCase().includes(user.Id)){
            final = user;
            const embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setAuthor('HH Info', '')
            .addField('Username: ', user.Username)
            .addField('Id: ', user.Id)
            .addField('Email: ', user.Email)
            .addField('IP: ', user.IP)
            .addField('Valid IP: ', user.IPValid == 1 ? "Yes" : "No")
            .addField('Connections: ', user.Connections)
            .addField('Two Factor Authentication: ', user["2FA"])
            .addField('Trust Rating:  ', user.Level)
            .addField('Account Age:  ', user.Age + " Days")
            .addField('Key Date:  ', user.KeyDate)
            .setTimestamp()
            .setFooter('HH Infor', '');
            
            msg.channel.send(embed);
        }
    }

    });   

}