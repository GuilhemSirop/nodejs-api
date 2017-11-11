### Mise en place de AdminMongo
URL GITHUB : https://github.com/mrvautin/adminMongo.git
    - git clone https://github.com/mrvautin/adminMongo.git 
    - cd adminMongo
    - npm i
    
    - On va dans la CONF adminMongo/config/app.json 
        {
            "app":{
                "port" : 8081
            }
        }
        
    - On démarre adminMongo (depuis le dossier adminMongo): 
        node app.js 